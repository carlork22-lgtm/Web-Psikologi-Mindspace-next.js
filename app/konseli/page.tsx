import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import ChatLink from '@/components/ChatLink'
import { jadwalLengkap } from '@/lib/format'
import {
  Card,
  PageShell,
  SectionTitle,
  StatusBadge,
  btnInlineCls,
  btnOutlineCls,
} from '@/components/ui'
import ClientDetailsForm from '@/components/ClientDetailsForm'

export default async function KonseliPage() {
  const { supabase, user, profile, detail } = await requireUser('konseli')

  if (!detail) {
    return (
      <PageShell title="Lengkapi identitas Anda" name={profile.full_name}>
        <ClientDetailsForm userId={user.id} />
      </PageShell>
    )
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, counselor_id, specialty_id, slot_id, session_number, status, created_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const list: any[] = bookings ?? []
  const slotIds = list.map((b) => b.slot_id)
  const counselorIds = [...new Set(list.map((b) => b.counselor_id))]

  const bookingIds = list.map((b) => b.id)
  const [slotsRes, profilesRes, specsRes, unreadRes] = await Promise.all([
    slotIds.length
      ? supabase.from('availability_slots').select('id, start_time, end_time').in('id', slotIds)
      : Promise.resolve({ data: [] as any[] }),
    counselorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', counselorIds)
      : Promise.resolve({ data: [] as any[] }),
    supabase.from('specialties').select('id, name'),
    bookingIds.length
      ? supabase
          .from('messages')
          .select('booking_id')
          .in('booking_id', bookingIds)
          .eq('is_read', false)
          .neq('sender_id', user.id)
      : Promise.resolve({ data: [] as any[] }),
  ])
  const unreadMap = new Map<string, number>()
  for (const m of (unreadRes.data ?? []) as any[]) {
    unreadMap.set(m.booking_id, (unreadMap.get(m.booking_id) ?? 0) + 1)
  }

  const slotMap = new Map<string, any>((slotsRes.data ?? []).map((s: any) => [s.id, s]))
  const nameMap = new Map<string, string>((profilesRes.data ?? []).map((p: any) => [p.id, p.full_name]))
  const specMap = new Map<number, string>((specsRes.data ?? []).map((s: any) => [s.id, s.name]))

  const now = Date.now()
  const upcoming = list
    .filter((b) => b.status === 'terkonfirmasi' && new Date(slotMap.get(b.slot_id)?.start_time).getTime() > now)
    .sort(
      (a, b) =>
        new Date(slotMap.get(a.slot_id).start_time).getTime() -
        new Date(slotMap.get(b.slot_id).start_time).getTime()
    )

  return (
    <PageShell title={`Halo, ${profile.full_name}`} name={profile.full_name} home="/konseli">
      <div className="space-y-8">
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-900">Butuh teman bicara?</p>
            <p className="text-sm text-slate-600">
              Pilih bidang psikologi, lalu pilih psikolog dan jadwal yang sesuai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/konseli/riwayat" className={btnOutlineCls}>
              Riwayat konseling
            </Link>
            <Link href="/konseli/bidang" className={btnInlineCls}>
              Buat janji baru
            </Link>
          </div>
        </Card>

        <section>
          <SectionTitle>Pertemuan selanjutnya</SectionTitle>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada pertemuan terkonfirmasi. Pembayaran yang sudah lunas akan muncul di sini.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Jadwal pertemuan</th>
                    <th className="px-4 py-2">Konselor</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((b, i) => {
                    const s = slotMap.get(b.slot_id)
                    return (
                      <tr key={b.id} className="border-t border-slate-100">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{jadwalLengkap(s.start_time, s.end_time)}</td>
                        <td className="px-4 py-2">{nameMap.get(b.counselor_id)}</td>
                        <td className="px-4 py-2">
                          <ChatLink href={`/konseli/booking/${b.id}/chat`} unread={unreadMap.get(b.id) ?? 0} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <SectionTitle>Semua pemesanan</SectionTitle>
          {list.length === 0 ? (
            <p className="text-sm text-slate-500">Anda belum pernah membuat janji.</p>
          ) : (
            <ul className="space-y-3">
              {list.map((b) => {
                const s = slotMap.get(b.slot_id)
                return (
                  <li
                    key={b.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-600"
                  >
                    <Link href={`/konseli/booking/${b.id}`} className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">
                        {specMap.get(b.specialty_id)} &middot; {nameMap.get(b.counselor_id)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Pertemuan ke-{b.session_number} &middot;{' '}
                        {s ? jadwalLengkap(s.start_time, s.end_time) : '-'}
                      </p>
                    </Link>
                    <StatusBadge status={b.status} />
                    <ChatLink href={`/konseli/booking/${b.id}/chat`} unread={unreadMap.get(b.id) ?? 0} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  )
}
