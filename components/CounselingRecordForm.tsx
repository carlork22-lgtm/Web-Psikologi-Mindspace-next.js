'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls, inputCls, labelCls } from '@/components/ui'

// Riwayat konseling: diagnosis dan catatan sesi (ditulis konselor).
export default function CounselingRecordForm({
  bookingId,
  initialDiagnosis,
  initialNotes,
}: {
  bookingId: string
  initialDiagnosis: string
  initialNotes: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setLoading(true)
    const f = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.from('counseling_records').upsert(
      {
        booking_id: bookingId,
        diagnosis: String(f.get('diagnosis') ?? '').trim() || null,
        session_notes: String(f.get('session_notes') ?? '').trim() || null,
      },
      { onConflict: 'booking_id' }
    )
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Diagnosis</label>
        <input name="diagnosis" defaultValue={initialDiagnosis} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Catatan sesi</label>
        <textarea name="session_notes" rows={5} defaultValue={initialNotes} className={inputCls} />
      </div>
      <ErrorBox message={error} />
      <div className="flex items-center gap-3">
        <button className={btnInlineCls} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan riwayat konseling'}
        </button>
        {saved && <span className="text-sm text-teal-700">Tersimpan.</span>}
      </div>
    </form>
  )
}
