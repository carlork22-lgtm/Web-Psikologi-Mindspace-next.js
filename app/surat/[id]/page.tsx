import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SITE } from '@/lib/site'
import { tanggalSaja } from '@/lib/format'
import PrintButton from '@/components/PrintButton'

const wib = (date: string) => tanggalSaja(date + 'T00:00:00+07:00')

// Surat Keterangan Sakit: terisi otomatis dari data konseli dan konselor.
// Hanya konseli dan konselor pada sesi tersebut yang bisa membukanya (dijaga RLS).
export default async function SuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: leave } = await supabase.from('leave_requests').select('*').eq('id', id).maybeSingle()
  if (!leave || leave.status !== 'disetujui') notFound()

  const { data: booking } = await supabase
    .from('bookings')
    .select('client_id, counselor_id')
    .eq('id', leave.booking_id)
    .single()
  if (!booking) notFound()

  const [clientRes, detailRes, meRes, phoneRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', booking.client_id).single(),
    supabase.from('client_details').select('*').eq('profile_id', booking.client_id).maybeSingle(),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('contact_channels').select('value').eq('type', 'telepon').eq('is_active', true).limit(1),
  ])

  const cd = detailRes.data
  const phone = phoneRes.data?.[0]?.value ?? SITE.phone
  const backHref =
    meRes.data?.role === 'konselor'
      ? `/konselor/booking/${leave.booking_id}`
      : `/konseli/booking/${leave.booking_id}`

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden">
        <Link href={backHref} className="text-sm text-teal-700 hover:underline">
          &larr; Kembali
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[210mm] bg-white px-12 py-12 font-serif shadow-md print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {/* Kop surat */}
        <header className="flex items-center gap-4 border-b-2 border-slate-800 pb-4">
          <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0" aria-hidden>
            <circle cx="32" cy="32" r="30" fill="#0f766e" />
            <text x="32" y="43" textAnchor="middle" fontSize="32" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
              M
            </text>
          </svg>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold uppercase tracking-wide">{SITE.name}</p>
            <p className="text-sm">{SITE.address}</p>
            <p className="text-sm">Telepon: {phone}</p>
          </div>
        </header>

        <div className="mt-8 text-center">
          <h1 className="text-xl font-bold underline">SURAT KETERANGAN SAKIT</h1>
          <p className="mt-1 text-sm">Nomor: {leave.letter_number}</p>
        </div>

        <div className="mt-8 space-y-5 text-[15px] leading-relaxed">
          <p>
            Yang bertanda tangan di bawah ini, dokter yang bertugas di{' '}
            <strong>{leave.institution_name}</strong>, menerangkan bahwa:
          </p>

          <table className="ml-6">
            <tbody>
              {[
                ['Nama Lengkap', clientRes.data?.full_name],
                [
                  'Tempat, Tanggal Lahir',
                  cd ? `${cd.birth_place}, ${wib(cd.birth_date)}` : '-',
                ],
                ['Jenis Kelamin', cd?.gender ?? '-'],
                ['Alamat', cd?.address ?? '-'],
              ].map(([k, v]) => (
                <tr key={k} className="align-top">
                  <td className="whitespace-nowrap py-0.5 pr-3">{k}</td>
                  <td className="py-0.5 pr-2">:</td>
                  <td className="py-0.5">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-justify">
            Berdasarkan hasil pemeriksaan medis, pasien tersebut dinyatakan sedang dalam kondisi
            sakit dan memerlukan waktu istirahat selama <strong>{leave.rest_days}</strong> hari,
            terhitung mulai tanggal <strong>{wib(leave.start_date)}</strong> sampai dengan{' '}
            <strong>{wib(leave.end_date)}</strong>.
          </p>

          <p className="text-justify">
            Demikian surat keterangan sakit ini dibuat berdasarkan hasil pemeriksaan untuk
            dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Tanda tangan */}
        <div className="mt-12 flex justify-end">
          <div className="w-64 text-center text-[15px]">
            <p>
              {leave.issued_place}, {wib(new Date(leave.issued_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }))}
            </p>
            <p className="mt-1">Dokter Pemeriksa,</p>
            <div className="mx-auto my-3 flex h-20 items-end justify-center border-b border-dashed border-slate-400 pb-1">
              <span className="text-3xl italic" style={{ fontFamily: 'cursive, serif' }}>
                {leave.doctor_name}
              </span>
            </div>
            <p className="text-xs text-slate-500">(Stempel dan Tanda Tangan)</p>
            <p className="mt-2 font-bold underline">{leave.doctor_name}</p>
            <p>SIP: {leave.doctor_sip}</p>
          </div>
        </div>
      </article>
    </div>
  )
}
