'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

// Konseli hanya mengajukan. Isi surat (nomor, dokter, SIP, hari istirahat, tanggal)
// terisi otomatis saat konselor menerbitkan surat.
export default function LeaveRequestForm({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const f = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.from('leave_requests').insert({
      booking_id: bookingId,
      reason: String(f.get('reason') ?? '').trim() || null,
    })
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-slate-600">
        Jika Anda sakit dan tidak dapat hadir, ajukan surat izin. Surat keterangan sakit akan
        diterbitkan oleh psikolog Anda, dan Anda tidak perlu mengisi apa pun selain alasan singkat.
      </p>
      <div>
        <label className={labelCls}>Alasan singkat (opsional)</label>
        <textarea
          name="reason"
          rows={3}
          className={inputCls}
          placeholder="Contoh: demam dan sakit kepala sejak kemarin"
        />
      </div>

      <ErrorBox message={error} />

      <div className="max-w-xs">
        <button className={btnCls} disabled={loading}>
          {loading ? 'Mengirim...' : 'Ajukan surat izin'}
        </button>
      </div>
    </form>
  )
}
