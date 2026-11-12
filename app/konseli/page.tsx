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

  // Onboarding jika belum mengisi client_details
  if (!detail) {
    return (
      <PageShell title="Lengkapi Profil Anda" name={profile.full_name} home="/konseli">
        <div className="space-y-6">
          {/* Progress Guide */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-xs text-teal-800 font-semibold uppercase">Langkah 1</p>
                <p className="text-sm font-bold text-teal-950">Buat Akun</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-teal-600 bg-white p-4 shadow-xs">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                2
              </span>
              <div>
                <p className="text-xs text-teal-700 font-semibold uppercase">Langkah 2 (Aktif)</p>
                <p className="text-sm font-bold text-slate-900">Lengkapi Data Diri</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-70">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-600">
                3
              </span>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Langkah 3</p>
                <p className="text-sm font-bold text-slate-700">Pilih Psikolog & Janji</p>
              </div>
            </div>
          </div>

          <ClientDetailsForm userId={user.id} />
        </div>
      </PageShell>
    )
  }

  // Pengambilan data booking konseli
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
    <PageShell title={`Dashboard Konseli`} name={profile.full_name} home="/konseli">
      <div className="space-y-8">
        {/* Banner Selamat Datang & Menu Cepat */}
        <div className="rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-50 via-teal-50/40 to-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 uppercase tracking-wide">
                Area Karyawan & Konseli
              </span>
              <h2 className="mt-2 text-2xl font-bold text-teal-950 sm:text-3xl">
                Halo, {profile.full_name} 👋
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                Butuh teman bicara mengenai tekanan kerja, kecemasan, atau relasi kantor? Pilih psikolog berlisensi sesuai bidang kebutuhan Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/konseli/bidang" className={btnInlineCls + ' px-5 py-2.5 font-semibold shadow-sm'}>
                Buat Janji Baru &rarr;
              </Link>
              <Link href="/konseli/riwayat" className={btnOutlineCls + ' px-5 py-2.5 font-semibold bg-white'}>
                Riwayat Konseling
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-teal-100/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 transition"
            >
              <span>📖</span>
              <span className="font-semibold">6 Bidang & Artikel</span>
            </Link>
            <Link
              href="/konseli/bidang"
              className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 transition"
            >
              <span>🩺</span>
              <span className="font-semibold">Pilih Psikolog</span>
            </Link>
            <Link
              href="/konseli/riwayat"
              className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 transition"
            >
              <span>📋</span>
              <span className="font-semibold">Diagnosa Sesi</span>
            </Link>
            <Link
              href="/kontak"
              className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 transition"
            >
              <span>💬</span>
              <span className="font-semibold">Chatbot & Bantuan</span>
            </Link>
          </div>
        </div>

        {/* Pertemuan Selanjutnya */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Pertemuan selanjutnya</SectionTitle>
            <span className="text-xs text-slate-500 font-medium">Jadwal konseling terkonfirmasi</span>
          </div>

          {upcoming.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-600">
                Belum ada pertemuan terkonfirmasi mendatang. Sesi yang sudah lunas dibayar akan muncul di sini.
              </p>
              <div className="mt-3">
                <Link href="/konseli/bidang" className="text-sm font-semibold text-teal-700 hover:underline">
                  + Buat janji konseling sekarang
                </Link>
              </div>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">No</th>
                    <th className="px-4 py-3 font-semibold">Jadwal Pertemuan</th>
                    <th className="px-4 py-3 font-semibold">Konselor</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcoming.map((b, i) => {
                    const s = slotMap.get(b.slot_id)
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-4 py-3 font-medium text-slate-500">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {jadwalLengkap(s.start_time, s.end_time)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{nameMap.get(b.counselor_id)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/konseli/booking/${b.id}`}
                              className="text-xs font-semibold text-teal-700 hover:underline"
                            >
                              Detail & Izin
                            </Link>
                            <ChatLink href={`/konseli/booking/${b.id}/chat`} unread={unreadMap.get(b.id) ?? 0} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Semua Pemesanan */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Semua pemesanan sesi</SectionTitle>
            <span className="text-xs text-slate-500 font-medium">Riwayat transaksi & status booking</span>
          </div>

          {list.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">Anda belum pernah membuat janji konseling.</p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {list.map((b) => {
                const s = slotMap.get(b.slot_id)
                return (
                  <li
                    key={b.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-teal-400"
                  >
                    <Link href={`/konseli/booking/${b.id}`} className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {specMap.get(b.specialty_id)} &middot; {nameMap.get(b.counselor_id)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Pertemuan ke-{b.session_number} &middot;{' '}
                        {s ? jadwalLengkap(s.start_time, s.end_time) : '-'}
                      </p>
                    </Link>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={b.status} />
                      <ChatLink href={`/konseli/booking/${b.id}/chat`} unread={unreadMap.get(b.id) ?? 0} />
                    </div>
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
