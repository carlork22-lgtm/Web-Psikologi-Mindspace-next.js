'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls, inputCls, labelCls } from '@/components/ui'

// Konselor menerbitkan surat (cukup jumlah hari dan tanggal mulai; sisanya otomatis)
// atau menolak pengajuan.
export default function LeaveDecision({
  leaveId,
  defaultStartDate,
}: {
  leaveId: string
  defaultStartDate: string // 'YYYY-MM-DD' (tanggal sesi, WIB)
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function issue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const f = new FormData(e.currentTarget)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.rpc('issue_leave_letter', {
      p_leave_id: leaveId,
      p_rest_days: Number(f.get('rest_days')),
      p_start_date: String(f.get('start_date')),
    })
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  async function reject() {
    if (!window.confirm('Tolak pengajuan izin ini?')) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.rpc('reject_leave_request', { p_leave_id: leaveId })
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
      <form onSubmit={issue} className="grid gap-3 sm:grid-cols-3 sm:items-end">
        <div>
          <label className={labelCls}>Istirahat (hari)</label>
          <input name="rest_days" type="number" min={1} max={30} defaultValue={1} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Mulai tanggal</label>
          <input name="start_date" type="date" defaultValue={defaultStartDate} className={inputCls} required />
        </div>
        <button className={btnInlineCls} disabled={loading}>
          {loading ? 'Memproses...' : 'Terbitkan surat'}
        </button>
      </form>
      <p className="text-xs text-slate-500">
        Nomor surat, nama dokter, nomor SIP, dan identitas konseli terisi otomatis.
      </p>
      <button
        type="button"
        onClick={reject}
        disabled={loading}
        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        Tolak pengajuan
      </button>
      <ErrorBox message={error} />
    </div>
  )
}
