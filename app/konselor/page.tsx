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
      <PageShell title="Lengkapi Profil Konselor" name={profile.full_name} home="/konselor">
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
    <PageShell title="Dashboard Konselor" name={profile.full_name} home="/konselor">
      <div className="space-y-8">
        {/* Banner Profil Konselor */}
        <div className="rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-50 via-teal-50/40 to-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 uppercase tracking-wide">
                Ruang Praktik Psikolog
              </span>
              <h2 className="mt-2 text-2xl font-bold text-teal-950 sm:text-3xl">
                Halo, {profile.full_name} 👋
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                Kelola jadwal ketersediaan konsultasi Anda per jam, periksa formulir lembar kehidupan konseli, dan berikan rekam diagnosis sesi.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-xl border border-teal-700 bg-white px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 transition"
              >
                Lihat Halaman Utama &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Manajemen Slot Jadwal */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <SectionTitle>Jadwal Praktik (Per Jam)</SectionTitle>
            <span className="text-xs text-slate-500 font-medium">Buka atau tutup slot ketersediaan</span>
          </div>
          <SlotManager counselorId={user.id} groups={groups} todayWib={todayWib} />
        </Card>

        {/* Daftar Booking Konseli */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Booking yang masuk</SectionTitle>
            <span className="text-xs text-slate-500 font-medium">{bookings.length} total sesi</span>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">Belum ada booking dari konseli.</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Konseli</th>
                    <th className="px-4 py-3 font-semibold">Bidang</th>
                    <th className="px-4 py-3 font-semibold">Jadwal Pertemuan</th>
                    <th className="px-4 py-3 font-semibold">Sesi</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => {
                    const s = slotMap.get(b.slot_id)
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-4 py-3 font-bold text-slate-900">{clientMap.get(b.client_id)}</td>
                        <td className="px-4 py-3 text-slate-700">{specMap.get(b.specialty_id)}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">
                          {s ? jadwalLengkap(s.start_time, s.end_time) : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">ke-{b.session_number}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <Link
                              href={`/konselor/booking/${b.id}`}
                              className="text-xs font-semibold text-teal-700 hover:underline"
                            >
                              Buka Dokumen
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
            * Klik "Buka Dokumen" untuk melihat informed consent, lembar kehidupan, surat izin sakit, dan mengisi rekam diagnosis.
          </p>
        </section>
      </div>
    </PageShell>
  )
}
