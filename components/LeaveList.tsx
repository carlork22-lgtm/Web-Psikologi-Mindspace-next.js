import Link from 'next/link'
import { tanggalSaja, tanggalWaktu } from '@/lib/format'
import { StatusBadge } from '@/components/ui'
import LeaveDecision from '@/components/LeaveDecision'

// Daftar pengajuan surat izin. Konseli: melihat status dan membuka surat.
// Konselor: menerbitkan atau menolak pengajuan.
export default function LeaveList({
  leaves,
  canDecide,
  defaultStartDate,
}: {
  leaves: any[]
  canDecide?: boolean
  defaultStartDate?: string
}) {
  if (leaves.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada pengajuan surat izin.</p>
  }
  return (
    <ul className="space-y-3">
      {leaves.map((l) => (
        <li key={l.id} className="rounded-xl border border-slate-200 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-slate-600">Diajukan {tanggalWaktu(l.created_at)}</p>
            <StatusBadge
              status={l.status === 'menunggu' ? 'menunggu_pembayaran' : l.status === 'disetujui' ? 'terkonfirmasi' : 'dibatalkan'}
            />
          </div>
          {l.reason && (
            <p className="mt-2">
              <span className="text-slate-500">Alasan: </span>
              {l.reason}
            </p>
          )}

          {l.status === 'menunggu' && !canDecide && (
            <p className="mt-2 text-slate-500">Menunggu psikolog menerbitkan surat izin.</p>
          )}
          {l.status === 'ditolak' && <p className="mt-2 text-red-700">Pengajuan ditolak.</p>}

          {l.status === 'disetujui' && (
            <div className="mt-2 space-y-1">
              <p>
                Surat <span className="font-medium">{l.letter_number}</span>: istirahat {l.rest_days} hari,{' '}
                {tanggalSaja(l.start_date + 'T00:00:00+07:00')} s.d. {tanggalSaja(l.end_date + 'T00:00:00+07:00')}.
              </p>
              <Link
                href={`/surat/${l.id}`}
                className="inline-block font-medium text-teal-700 hover:underline"
              >
                Lihat / cetak surat keterangan sakit
              </Link>
            </div>
          )}

          {canDecide && l.status === 'menunggu' && (
            <LeaveDecision leaveId={l.id} defaultStartDate={defaultStartDate ?? ''} />
          )}
        </li>
      ))}
    </ul>
  )
}
