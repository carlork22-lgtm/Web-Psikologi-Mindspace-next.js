'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

type Identity = {
  name: string
  birthDate: string
  education: string
  gender: string
  phone: string
}

function Check({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm text-slate-800">
      <input type="checkbox" name={name} required className="mt-1 h-4 w-4 accent-teal-700" />
      <span>{children}</span>
    </label>
  )
}

export default function ConsentForm({
  bookingId,
  counselorName,
  jadwal,
  tanggalHariIni,
  identity,
}: {
  bookingId: string
  counselorName: string
  jadwal: string
  tanggalHariIni: string
  identity: Identity
}) {
  const router = useRouter()
  const [signedName, setSignedName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('informed_consents').insert({
      booking_id: bookingId,
      agree_participation: true,
      agree_recording: true,
      agree_confidentiality_terms: true,
      signed_name: signedName,
    })
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-slate-700">
        Berkaitan dengan proses konseling yang akan dilakukan dan diselenggarakan oleh{' '}
        <strong>{counselorName}</strong>, yang akan diikuti dan dilaksanakan pada{' '}
        <strong>{jadwal}</strong>. Kami akan melakukan kegiatan konseling terhadap konseli dengan
        identitas sebagai berikut:
      </p>

      <table className="text-sm">
        <tbody>
          {[
            ['Nama', identity.name],
            ['Tanggal lahir', identity.birthDate],
            ['Pendidikan', identity.education],
            ['Jenis kelamin', identity.gender],
            ['Nomor telepon', identity.phone],
          ].map(([k, v]) => (
            <tr key={k}>
              <td className="py-0.5 pr-4 text-slate-500">{k}</td>
              <td className="py-0.5 font-medium">: {v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-slate-700">
        Saya yang tersebut di atas menyatakan <strong>SETUJU</strong> dan <strong>BERSEDIA</strong>{' '}
        untuk terlibat dan berpartisipasi aktif sebagai klien. Dalam kegiatan ini, saya telah
        menyadari, memahami, dan menerima bahwa:
      </p>

      <div className="space-y-4 rounded-xl bg-slate-50 p-4">
        <Check name="agree_participation">
          Saya bersedia terlibat penuh dan aktif selama proses konseling, memberikan informasi yang
          akurat dan relevan, bersedia memberikan seluruh informasi untuk membantu mencapai tujuan
          yang saya inginkan, dan melakukan sesi konseling dengan kesadaran tanpa paksaan.
        </Check>
        <Check name="agree_recording">
          Saya menyetujui adanya perekaman selama proses konseling.
        </Check>
        <Check name="agree_confidentiality_terms">
          Saya berhak membatalkan keterlibatan atau menarik data dari penelitian tanpa konsekuensi
          apa pun; data yang saya berikan hanya digunakan untuk kepentingan tertentu dengan
          konfirmasi dari kedua belah pihak terlebih dahulu; dan identitas yang saya berikan akan{' '}
          <strong>DIRAHASIAKAN</strong>.
        </Check>
      </div>

      <div className="max-w-sm">
        <p className="mb-2 text-sm text-slate-600">Jakarta, {tanggalHariIni}</p>
        <label className={labelCls}>Tanda tangan (ketik nama lengkap Anda)</label>
        <input
          className={inputCls}
          value={signedName}
          onChange={(e) => setSignedName(e.target.value)}
          required
        />
      </div>

      <ErrorBox message={error} />

      <div className="max-w-xs">
        <button className={btnCls} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Saya setuju'}
        </button>
      </div>
    </form>
  )
}
