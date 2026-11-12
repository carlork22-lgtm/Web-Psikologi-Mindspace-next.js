'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { jam, kunciTanggal, tanggalPanjang } from '@/lib/format'
import { ErrorBox, btnInlineCls, inputCls } from '@/components/ui'

export type Msg = {
  id: number
  sender_id: string
  body: string
  created_at: string
  is_read: boolean
}

const COLS = 'id, sender_id, body, created_at, is_read'

export default function ChatBox({
  bookingId,
  currentUserId,
  otherName,
  initial,
  disabled,
  tall,
}: {
  bookingId: string
  currentUserId: string
  otherName: string
  initial: Msg[]
  disabled?: boolean
  tall?: boolean
}) {
  const [supabase] = useState(() => createClient())
  const [messages, setMessages] = useState<Msg[]>(initial)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const merge = useCallback((incoming: Msg[]) => {
    setMessages((prev) => {
      const map = new Map<number, Msg>(prev.map((m) => [m.id, m]))
      incoming.forEach((m) => map.set(m.id, m))
      return [...map.values()].sort((a, b) => a.id - b.id)
    })
  }, [])

  const markRead = useCallback(async () => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('booking_id', bookingId)
      .neq('sender_id', currentUserId)
      .eq('is_read', false)
  }, [supabase, bookingId, currentUserId])

  useEffect(() => {
    markRead()

    // Realtime: pesan baru langsung muncul.
    const channel = supabase
      .channel(`chat-${bookingId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          const m = payload.new as Msg
          merge([m])
          if (m.sender_id !== currentUserId) markRead()
        }
      )
      .subscribe()

    // Cadangan: ambil ulang tiap 8 detik (juga memperbarui status "dibaca").
    const timer = setInterval(async () => {
      const { data } = await supabase
        .from('messages')
        .select(COLS)
        .eq('booking_id', bookingId)
        .order('id')
        .limit(500)
      if (data) {
        merge(data as Msg[])
        if ((data as Msg[]).some((m) => m.sender_id !== currentUserId && !m.is_read)) markRead()
      }
    }, 8000)

    return () => {
      clearInterval(timer)
      supabase.removeChannel(channel)
    }
  }, [supabase, bookingId, currentUserId, merge, markRead])

  // Gulir otomatis ke pesan terbaru (hanya di dalam kotak chat).
  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setSending(true)
    setError(null)

    const { data, error } = await supabase
      .from('messages')
      .insert({ booking_id: bookingId, sender_id: currentUserId, body })
      .select(COLS)
      .single()
    setSending(false)

    if (error || !data) {
      setError(pesanError(error?.message ?? 'Pesan gagal dikirim.'))
      return
    }
    merge([data as Msg])
    setText('')
  }

  const lastMineId = [...messages].reverse().find((m) => m.sender_id === currentUserId)?.id

  return (
    <div>
      <div
        ref={boxRef}
        className={
          (tall ? 'h-[60vh] min-h-[320px] ' : 'h-72 ') +
          'space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3'
        }
      >
        {messages.length === 0 && (
          <p className="pt-24 text-center text-sm text-slate-400">
            Belum ada pesan. Mulai percakapan dengan {otherName}.
          </p>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_id === currentUserId
          const newDay = i === 0 || kunciTanggal(messages[i - 1].created_at) !== kunciTanggal(m.created_at)
          return (
            <div key={m.id}>
              {newDay && (
                <p className="my-2 text-center text-xs text-slate-400" suppressHydrationWarning>
                  {tanggalPanjang(m.created_at)}
                </p>
              )}
              <div className={'flex ' + (mine ? 'justify-end' : 'justify-start')}>
                <div
                  className={
                    'max-w-[80%] rounded-2xl px-3 py-2 text-sm ' +
                    (mine ? 'bg-teal-700 text-white' : 'bg-white text-slate-800 shadow-sm')
                  }
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={'mt-1 text-right text-[10px] ' + (mine ? 'text-teal-100' : 'text-slate-400')}
                    suppressHydrationWarning
                  >
                    {jam(m.created_at)}
                    {mine && m.id === lastMineId && m.is_read ? ' · Dibaca' : ''}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {disabled ? (
        <p className="mt-3 text-sm text-slate-500">Chat ditutup karena pemesanan ini dibatalkan.</p>
      ) : (
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input
            className={inputCls}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Tulis pesan untuk ${otherName}...`}
            maxLength={2000}
          />
          <button className={btnInlineCls + ' shrink-0'} disabled={sending || !text.trim()}>
            Kirim
          </button>
        </form>
      )}
      <div className="mt-2">
        <ErrorBox message={error} />
      </div>
    </div>
  )
}
