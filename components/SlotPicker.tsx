'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnCls } from '@/components/ui'

type Group = { dateLabel: string; slots: { id: string; label: string }[] }

export default function SlotPicker({
  clientId,
  counselorId,
  specialtyId,
  groups,
}: {
  clientId: string
  counselorId: string
  specialtyId: number
  groups: Group[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function book() {
    if (!selected) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    // session_number dan status diisi otomatis oleh trigger database.
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: clientId,
        counselor_id: counselorId,
        specialty_id: specialtyId,
        slot_id: selected,
      })
      .select('id')
      .single()
    setLoading(false)

    if (error || !data) {
      setError(pesanError(error?.message ?? 'Gagal membuat booking.'))
      setSelected(null)
      router.refresh() // muat ulang daftar slot terbaru
      return
    }
    router.push(`/konseli/booking/${data.id}`)
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.dateLabel}>
          <p className="mb-2 text-sm font-medium text-slate-700">{g.dateLabel}</p>
          <div className="flex flex-wrap gap-2">
            {g.slots.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={
                  'rounded-lg border px-3 py-1.5 text-sm ' +
                  (selected === s.id
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-teal-600')
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <ErrorBox message={error} />

      <div className="max-w-xs">
        <button className={btnCls} disabled={!selected || loading} onClick={book}>
          {loading ? 'Memproses...' : 'Pesan jadwal ini'}
        </button>
      </div>
    </div>
  )
}
