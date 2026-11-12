import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { LIFE_SECTIONS } from '@/lib/lifesheet'
import { jadwalLengkap, kunciTanggal, rupiah, tanggalSaja, tanggalWaktu } from '@/lib/format'
import { Card, PageShell, SectionTitle, StatusBadge } from '@/components/ui'
import LeaveList from '@/components/LeaveList'
import CounselorNotesForm from '@/components/CounselorNotesForm'
import CounselingRecordForm from '@/components/CounselingRecordForm'
import CompleteSessionButton from '@/components/CompleteSessionButton'
import CancelBookingButton from '@/components/CancelBookingButton'

export default async function KonselorBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, user, profile } = await requireUser('konselor', { needDetails: true })

  const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
  if (!booking || booking.counselor_id !== user.id) notFound()

  const [
    slotRes,
    clientProfileRes,
    clientDetailRes,
    specialtyRes,
    paymentRes,
    consentRes,
    lifeRes,
    recordRes,
    leaveRes,
  ] = await Promise.all([
    supabase.from('availability_slots').select('start_time, end_time').eq('id', booking.slot_id).single(),
    supabase.from('profiles').select('full_name, phone').eq('id', booking.client_id).single(),
    supabase.from('client_details').select('*').eq('profile_id', booking.client_id).maybeSingle(),
    supabase.from('specialties').select('name').eq('id', booking.specialty_id).single(),
    supabase.from('payments').select('amount, status').eq('booking_id', id).maybeSingle(),
    supabase.from('informed_consents').select('signed_name, signed_at').eq('booking_id', id).maybeSingle(),
    supabase.from('life_sheets').select('*').eq('booking_id', id).maybeSingle(),
    supabase.from('counseling_records').select('diagnosis, session_notes').eq('booking_id', id).maybeSingle(),
    supabase.from('leave_requests').select('*').eq('booking_id', id).order('created_at', { ascending: false }),
  ])

  const slot = slotRes.data
  const client = clientProfileRes.data
  const cd = clientDetailRes.data
  const life = lifeRes.data
  const payment = paymentRes.data
  const leaves: any[] = leaveRes.data ?? []
  const active = booking.status === 'menunggu_pembayaran' || booking.status === 'terkonfirmasi'
  const canWriteRecord = booking.status === 'terkonfirmasi' || booking.status === 'selesai'
  const clientName: string = client?.full_name ?? '-'

  return (
    <PageShell
      title={`${clientName} · sesi ke-${booking.session_number}`}
      name={profile.full_name}
      home="/konselor"
      back={{ href: '/konselor', label: 'Kembali ke beranda' }}
    >
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-teal-800">{specialtyRes.data?.name}</p>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Jadwal</dt>
              <dd className="font-medium">{slot ? jadwalLengkap(slot.start_time, slot.end_time) : '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Biaya</dt>
              <dd className="font-medium">{payment ? rupiah(payment.amount) : '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Pembayaran</dt>
              <dd>{payment && <StatusBadge status={payment.status} />}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-start gap-4">
            {booking.status === 'terkonfirmasi' && <CompleteSessionButton bookingId={booking.id} />}
            {active && <CancelBookingButton bookingId={booking.id} />}
          </div>
        </Card>

        {/* Izin sakit */}
        <Card>
          <SectionTitle>Surat izin sakit</SectionTitle>
          <LeaveList
            leaves={leaves}
            canDecide
            defaultStartDate={slot ? kunciTanggal(slot.start_time) : undefined}
          />
        </Card>

        {/* Identitas */}
        <Card>
          <SectionTitle>Identitas konseli</SectionTitle>
          {cd ? (
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {[
                ['Nama lengkap', clientName],
                ['No. HP/WA', client?.phone],
                ['Tempat, tanggal lahir', `${cd.birth_place}, ${tanggalSaja(cd.birth_date + 'T00:00:00+07:00')}`],
                ['Jenis kelamin', cd.gender],
                ['Agama/kepercayaan', cd.religion || '-'],
                ['Pendidikan terakhir', cd.last_education],
                ['Pekerjaan', cd.occupation],
                ['Status pernikahan', cd.marital_status],
                ['Jumlah anak', String(cd.children_count)],
                ['Anak keberapa', `${cd.birth_order} dari ${cd.siblings_total} bersaudara`],
                ['Alamat', cd.address],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-slate-500">Data identitas tidak tersedia.</p>
          )}
        </Card>

        {/* Informed consent */}
        <Card>
          <SectionTitle>Informed consent</SectionTitle>
          {consentRes.data ? (
            <p className="text-sm text-teal-800">
              &#10003; Disetujui oleh {consentRes.data.signed_name} pada{' '}
              {tanggalWaktu(consentRes.data.signed_at)}.
            </p>
          ) : (
            <p className="text-sm text-slate-500">Konseli belum mengisi informed consent.</p>
          )}
        </Card>

        {/* Lembar kehidupan */}
        <Card>
          <SectionTitle>Lembar kehidupan klien</SectionTitle>
          {life ? (
            <div className="space-y-6">
              {life.nickname_note && (
                <p className="text-sm">
                  <span className="text-slate-500">Nama panggilan: </span>
                  <span className="font-medium">{life.nickname_note}</span>
                </p>
              )}
              {LIFE_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 font-semibold text-teal-800">{section.title}</h3>
                  <dl className="space-y-3 text-sm">
                    {section.fields.map((f) => (
                      <div key={f.name}>
                        <dt className="text-slate-500">{f.label}</dt>
                        <dd className="whitespace-pre-wrap font-medium">{life[f.name] || '-'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-5">
                <CounselorNotesForm lifeSheetId={life.id} initial={life.counselor_notes ?? ''} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Konseli belum mengisi lembar kehidupan.</p>
          )}
        </Card>

        {/* Riwayat konseling */}
        <Card>
          <SectionTitle>Riwayat konseling dan diagnosis</SectionTitle>
          {canWriteRecord ? (
            <CounselingRecordForm
              bookingId={booking.id}
              initialDiagnosis={recordRes.data?.diagnosis ?? ''}
              initialNotes={recordRes.data?.session_notes ?? ''}
            />
          ) : (
            <p className="text-sm text-slate-500">
              Bisa diisi setelah pembayaran lunas dan pemesanan terkonfirmasi.
            </p>
          )}
        </Card>
      </div>
    </PageShell>
  )
}
