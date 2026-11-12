import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { jadwalLengkap, rupiah, tanggalSaja, tanggalWaktu } from '@/lib/format'
import { Card, PageShell, SectionTitle, StatusBadge, btnInlineCls } from '@/components/ui'
import Collapsible from '@/components/Collapsible'
import ConsentForm from '@/components/ConsentForm'
import LifeSheetForm from '@/components/LifeSheetForm'
import PayButton from '@/components/PayButton'
import CancelBookingButton from '@/components/CancelBookingButton'
import LeaveRequestForm from '@/components/LeaveRequestForm'
import LeaveList from '@/components/LeaveList'

function Done({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium text-teal-800">
      <span aria-hidden>&#10003;</span> {text}
    </p>
  )
}

export default async function DetailBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, user, profile, detail } = await requireUser('konseli', { needDetails: true })

  const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
  if (!booking || booking.client_id !== user.id) notFound()

  const [slotRes, counselorRes, specialtyRes, paymentRes, consentRes, lifeRes, leaveRes] =
    await Promise.all([
      supabase.from('availability_slots').select('start_time, end_time').eq('id', booking.slot_id).single(),
      supabase.from('profiles').select('full_name').eq('id', booking.counselor_id).single(),
      supabase.from('specialties').select('name').eq('id', booking.specialty_id).single(),
      supabase.from('payments').select('*').eq('booking_id', id).maybeSingle(),
      supabase.from('informed_consents').select('id').eq('booking_id', id).maybeSingle(),
      supabase.from('life_sheets').select('id').eq('booking_id', id).maybeSingle(),
      supabase.from('leave_requests').select('*').eq('booking_id', id).order('created_at', { ascending: false }),
    ])

  const slot = slotRes.data
  const counselorName: string = counselorRes.data?.full_name ?? '-'
  const payment = paymentRes.data
  const jadwal = slot ? jadwalLengkap(slot.start_time, slot.end_time) : '-'
  const active = booking.status === 'menunggu_pembayaran' || booking.status === 'terkonfirmasi'
  const leaves: any[] = leaveRes.data ?? []
  const hasPendingLeave = leaves.some((l) => l.status === 'menunggu')

  const expired =
    payment && payment.status === 'belum_bayar' && new Date(payment.expired_at).getTime() < Date.now()
  const paymentStatus = expired ? 'kedaluwarsa' : payment?.status

  // Ringkasan untuk kartu penutup di bagian paling bawah.
  const consentDone = !!consentRes.data
  const lifeDone = !!lifeRes.data
  const paid = payment?.status === 'lunas'
  const remaining: string[] = []
  if (active && !consentDone) remaining.push('mengisi informed consent')
  if (active && !paid) remaining.push('menyelesaikan pembayaran')
  const allDone = remaining.length === 0

  return (
    <PageShell
      title={`Pertemuan ke-${booking.session_number}`}
      name={profile.full_name}
      home="/konseli"
      back={{ href: '/konseli', label: 'Kembali ke beranda' }}
    >
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-teal-800">{specialtyRes.data?.name}</p>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Konselor</dt>
              <dd className="font-medium">{counselorName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Jadwal</dt>
              <dd className="font-medium">{jadwal}</dd>
            </div>
          </dl>
          {booking.status === 'dibatalkan' && (
            <p className="mt-3 text-sm text-red-700">Pemesanan ini telah dibatalkan.</p>
          )}
          {booking.status === 'izin' && (
            <p className="mt-3 text-sm text-blue-700">
              Izin sakit Anda disetujui. Silakan buat janji baru untuk jadwal pengganti.
            </p>
          )}
        </Card>

        {/* Administration */}
        {payment && (
          <Card>
            <SectionTitle>Administration</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[
                    ['Konselor', counselorName],
                    ['Konseli', profile.full_name],
                    ['Total waktu', `${payment.duration_minutes} menit`],
                    ['Pertemuan ke-', String(booking.session_number)],
                    ['Biaya', rupiah(payment.amount)],
                    ['No. pembayaran Virtual Account', payment.virtual_account],
                    ['Batas pembayaran', tanggalWaktu(payment.expired_at)],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-t border-slate-100 first:border-0">
                      <td className="py-2 pr-4 text-slate-500">{k}</td>
                      <td className="py-2 font-medium">{v}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-100">
                    <td className="py-2 pr-4 text-slate-500">Status pembayaran</td>
                    <td className="py-2">
                      <StatusBadge status={paymentStatus ?? 'belum_bayar'} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {payment.status === 'belum_bayar' && booking.status === 'menunggu_pembayaran' && !expired && (
              <div className="mt-4">
                <PayButton bookingId={booking.id} />
                <p className="mt-2 text-xs text-slate-500">
                  Ini simulasi pembayaran untuk keperluan tugas, tidak ada uang yang dipindahkan.
                </p>
              </div>
            )}
            {payment.status === 'lunas' && payment.paid_at && (
              <p className="mt-3 text-sm text-slate-600">Dibayar pada {tanggalWaktu(payment.paid_at)}.</p>
            )}
          </Card>
        )}

        {/* Izin sakit */}
        <Collapsible
          title="Surat izin sakit"
          defaultOpen={leaves.length > 0}
          badge={
            leaves.length > 0 ? (
              <span className="text-sm text-slate-500">{leaves.length} pengajuan</span>
            ) : undefined
          }
        >
          <div className="space-y-5">
            <LeaveList leaves={leaves} />
            {active && !hasPendingLeave && <LeaveRequestForm bookingId={booking.id} />}
            {active && hasPendingLeave && (
              <p className="text-sm text-slate-500">
                Menunggu psikolog menerbitkan surat izin.
              </p>
            )}
          </div>
        </Collapsible>

        {/* Informed consent */}
        <Card>
          <SectionTitle>1. Informed consent</SectionTitle>
          {consentDone ? (
            <Done text="Sudah disetujui." />
          ) : active ? (
            <ConsentForm
              bookingId={booking.id}
              counselorName={counselorName}
              jadwal={jadwal}
              tanggalHariIni={tanggalSaja(new Date().toISOString())}
              identity={{
                name: profile.full_name,
                birthDate: tanggalSaja(detail.birth_date + 'T00:00:00+07:00'),
                education: detail.last_education,
                gender: detail.gender,
                phone: profile.phone,
              }}
            />
          ) : (
            <p className="text-sm text-slate-500">Tidak tersedia untuk pemesanan ini.</p>
          )}
        </Card>

        {/* Lembar kehidupan */}
        <Card>
          <SectionTitle>2. Lembar kehidupan klien</SectionTitle>
          {lifeDone ? (
            <Done text="Sudah diisi." />
          ) : active ? (
            <>
              <p className="mb-4 text-sm text-slate-600">
                Wajib diisi satu kali sebelum sesi konseling dimulai. Data identitas Anda diambil
                otomatis dari profil.
              </p>
              <LifeSheetForm bookingId={booking.id} />
            </>
          ) : (
            <p className="text-sm text-slate-500">Tidak tersedia untuk pemesanan ini.</p>
          )}
        </Card>

        {active && (
          <div>
            <CancelBookingButton bookingId={booking.id} />
          </div>
        )}

        {/* Penutup di paling bawah: muncul setelah lembar kehidupan terkirim */}
        {lifeDone && (
          <Card className="text-center">
            <p className="font-medium text-teal-800">
              {allDone
                ? 'Semua data untuk sesi ini sudah lengkap.'
                : 'Lembar kehidupan Anda sudah terkirim.'}
            </p>
            {!allDone && (
              <p className="mt-1 text-sm text-slate-600">
                Yang masih perlu dilakukan: {remaining.join(' dan ')}.
              </p>
            )}
            <Link href="/konseli" className={btnInlineCls + ' mt-4'}>
              Kembali ke beranda
            </Link>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
