import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { jadwalLengkap } from '@/lib/format'
import { Card, PageShell } from '@/components/ui'

export default async function RiwayatKonselingPage() {
  const { supabase, user, profile } = await requireUser('konseli', { needDetails: true })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, counselor_id, slot_id, session_number')
    .eq('client_id', user.id)
    .eq('status', 'selesai')

  const list: any[] = bookings ?? []
  const bookingIds = list.map((b) => b.id)
  const slotIds = list.map((b) => b.slot_id)
  const counselorIds = [...new Set(list.map((b) => b.counselor_id))]

  const [recordsRes, slotsRes, profilesRes] = await Promise.all([
    bookingIds.length
      ? supabase.from('counseling_records').select('booking_id, diagnosis').in('booking_id', bookingIds)
      : Promise.resolve({ data: [] as any[] }),
    slotIds.length
      ? supabase.from('availability_slots').select('id, start_time, end_time').in('id', slotIds)
      : Promise.resolve({ data: [] as any[] }),
    counselorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', counselorIds)
      : Promise.resolve({ data: [] as any[] }),
  ])

  const recMap = new Map<string, string | null>((recordsRes.data ?? []).map((r: any) => [r.booking_id, r.diagnosis]))
  const slotMap = new Map<string, any>((slotsRes.data ?? []).map((s: any) => [s.id, s]))
  const nameMap = new Map<string, string>((profilesRes.data ?? []).map((p: any) => [p.id, p.full_name]))

  const rows = list
    .map((b) => ({ ...b, slot: slotMap.get(b.slot_id) }))
    .filter((b) => b.slot)
    .sort((a, b) => new Date(b.slot.start_time).getTime() - new Date(a.slot.start_time).getTime())

  return (
    <PageShell
      title="Riwayat konseling"
      name={profile.full_name}
      home="/konseli"
      back={{ href: '/konseli', label: 'Kembali ke beranda' }}
    >
      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            Belum ada sesi yang selesai. Riwayat akan muncul setelah konselor menyelesaikan sesi Anda.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Riwayat konseling</th>
                <th className="px-4 py-2">Diagnose</th>
                <th className="px-4 py-2">Konselor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">
                    <Link href={`/konseli/booking/${b.id}`} className="text-teal-700 hover:underline">
                      {jadwalLengkap(b.slot.start_time, b.slot.end_time)}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{recMap.get(b.id) || '-'}</td>
                  <td className="px-4 py-2">{nameMap.get(b.counselor_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  )
}
