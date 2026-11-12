import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import ChatLink from '@/components/ChatLink'
import { jadwalLengkap, jam, kunciTanggal, tanggalPanjang } from '@/lib/format'
import { Card, PageShell, SectionTitle, StatusBadge } from '@/components/ui'
import CounselorDetailsForm from '@/components/CounselorDetailsForm'
import SlotManager from '@/components/SlotManager'

export default async function KonselorPage() {
  const { supabase, user, profile, detail } = await requireUser('konselor')

  if (!detail) {
    const { data: specialties } = await supabase.from('specialties').select('id, name').order('id')
    return (
      <PageShell title="Lengkapi profil konselor" name={profile.full_name}>
        <CounselorDetailsForm userId={user.id} specialties={specialties ?? []} />
      </PageShell>
    )
  }

  const nowIso = new Date().toISOString()

  const [slotsRes, bookingsRes, specsRes] = await Promise.all([
    supabase
      .from('availability_slots')
      .select('id, start_time, end_time, is_booked')
      .eq('counselor_id', user.id)
      .gte('start_time', nowIso)
      .order('start_time')
      .limit(300),
    supabase
      .from('bookings')
      .select('id, client_id, specialty_id, slot_id, session_number, status, created_at')
      .eq('counselor_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('specialties').select('id, name'),
  ])

  // Slot mendatang, dikelompokkan per tanggal.
  const groupMap = new Map<
    string,
    { dateLabel: string; slots: { id: string; label: string; isBooked: boolean }[] }
  >()
  for (const s of (slotsRes.data ?? []) as any[]) {
    const key = kunciTanggal(s.start_time)
    if (!groupMap.has(key)) groupMap.set(key, { dateLabel: tanggalPanjang(s.start_time), slots: [] })
    groupMap.get(key)!.slots.push({
      id: s.id,
      label: `${jam(s.start_time)}-${jam(s.end_time)}`,
      isBooked: s.is_booked,
    })
  }
  const groups = [...groupMap.values()]

  // Data pendukung daftar booking.
  const bookings: any[] = bookingsRes.data ?? []
  const clientIds = [...new Set(bookings.map((b) => b.client_id))]
  const bookingSlotIds = bookings.map((b) => b.slot_id)

  const [clientsRes, bookingSlotsRes, unreadRes] = await Promise.all([
    clientIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', clientIds)
      : Promise.resolve({ data: [] as any[] }),
    bookingSlotIds.length
      ? supabase.from('availability_slots').select('id, start_time, end_time').in('id', bookingSlotIds)
      : Promise.resolve({ data: [] as any[] }),
    bookings.length
      ? supabase
          .from('messages')
          .select('booking_id')
          .in('booking_id', bookings.map((b) => b.id))
          .eq('is_read', false)
          .neq('sender_id', user.id)
      : Promise.resolve({ data: [] as any[] }),
  ])
  const unreadMap = new Map<string, number>()
  for (const m of (unreadRes.data ?? []) as any[]) {
    unreadMap.set(m.booking_id, (unreadMap.get(m.booking_id) ?? 0) + 1)
  }

  const clientMap = new Map<string, string>((clientsRes.data ?? []).map((p: any) => [p.id, p.full_name]))
  const slotMap = new Map<string, any>((bookingSlotsRes.data ?? []).map((s: any) => [s.id, s]))
  const specMap = new Map<number, string>((specsRes.data ?? []).map((s: any) => [s.id, s.name]))

  const todayWib = kunciTanggal(nowIso)

  return (
    <PageShell title={`Halo, ${profile.full_name}`} name={profile.full_name} home="/konselor">
      <div className="space-y-8">
        <Card>
          <SectionTitle>Jadwal saya</SectionTitle>
          <SlotManager counselorId={user.id} groups={groups} todayWib={todayWib} />
        </Card>

        <section>
          <SectionTitle>Booking yang masuk</SectionTitle>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada booking dari konseli.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-2">Konseli</th>
                    <th className="px-4 py-2">Bidang</th>
                    <th className="px-4 py-2">Jadwal</th>
                    <th className="px-4 py-2">Sesi</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const s = slotMap.get(b.slot_id)
                    return (
                      <tr key={b.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 font-medium">{clientMap.get(b.client_id)}</td>
                        <td className="px-4 py-2">{specMap.get(b.specialty_id)}</td>
                        <td className="px-4 py-2">
                          {s ? jadwalLengkap(s.start_time, s.end_time) : '-'}
                        </td>
                        <td className="px-4 py-2">ke-{b.session_number}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/konselor/booking/${b.id}`}
                              className="font-medium text-teal-700 hover:underline"
                            >
                              Buka
                            </Link>
                            <ChatLink
                              href={`/konselor/booking/${b.id}/chat`}
                              unread={unreadMap.get(b.id) ?? 0}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Klik "Buka" untuk melihat lembar kehidupan, surat izin, dan mengisi riwayat konseling. Ikon chat membuka percakapan saja.
          </p>
        </section>
      </div>
    </PageShell>
  )
}
