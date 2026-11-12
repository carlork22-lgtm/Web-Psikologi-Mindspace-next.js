'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

// Form identitas konseli -> tabel client_details.
export default function ClientDetailsForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const f = new FormData(e.currentTarget)
    const birthOrder = Number(f.get('birth_order'))
    const siblingsTotal = Number(f.get('siblings_total'))
    if (siblingsTotal < birthOrder) {
      setError('Jumlah bersaudara tidak boleh lebih kecil dari urutan kelahiran (anak keberapa).')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('client_details').insert({
      profile_id: userId,
      birth_place: String(f.get('birth_place')),
      birth_date: String(f.get('birth_date')),
      gender: String(f.get('gender')),
      address: String(f.get('address')),
      occupation: String(f.get('occupation')),
      marital_status: String(f.get('marital_status')),
      children_count: Number(f.get('children_count')),
      birth_order: birthOrder,
      siblings_total: siblingsTotal,
      last_education: String(f.get('last_education')),
      religion: String(f.get('religion') ?? '') || null,
    })
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
    >
      <div className="rounded-2xl bg-teal-50/80 border border-teal-100 p-4 text-sm text-teal-900">
        <p className="font-semibold">Mengapa data ini dibutuhkan?</p>
        <p className="mt-1 text-teal-800 text-xs sm:text-sm leading-relaxed">
          Identitas ini digunakan oleh psikolog konselor untuk memahami latar belakang Anda dan
          hanya dapat diakses oleh psikolog yang menangani sesi konseling Anda. Seluruh data dijaga
          kerahasiaannya sesuai kode etik profesi psikologi.
        </p>
      </div>

      {/* Bagian 1: Data Diri */}
      <div>
        <h2 className="mb-4 text-base font-bold text-teal-900 border-b border-slate-100 pb-2">
          1. Data Pribadi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Tempat lahir</label>
            <input name="birth_place" className={inputCls} placeholder="Contoh: Jakarta" required />
          </div>
          <div>
            <label className={labelCls}>Tanggal lahir</label>
            <input name="birth_date" type="date" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Jenis kelamin</label>
            <select name="gender" className={inputCls} required defaultValue="">
              <option value="" disabled>
                Pilih Jenis Kelamin
              </option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Agama / Kepercayaan (opsional)</label>
            <input name="religion" className={inputCls} placeholder="Contoh: Islam / Kristen / dll." />
          </div>
        </div>
      </div>

      {/* Bagian 2: Pendidikan & Pekerjaan */}
      <div>
        <h2 className="mb-4 text-base font-bold text-teal-900 border-b border-slate-100 pb-2">
          2. Pekerjaan & Pendidikan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pendidikan terakhir</label>
            <input
              name="last_education"
              className={inputCls}
              placeholder="Contoh: SMA / D3 / S1 / S2"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Pekerjaan saat ini</label>
            <input
              name="occupation"
              className={inputCls}
              placeholder="Contoh: Staf HR / Software Engineer / dll."
              required
            />
          </div>
        </div>
      </div>

      {/* Bagian 3: Status Keluarga */}
      <div>
        <h2 className="mb-4 text-base font-bold text-teal-900 border-b border-slate-100 pb-2">
          3. Keluarga & Perkawinan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Status pernikahan</label>
            <select name="marital_status" className={inputCls} required defaultValue="">
              <option value="" disabled>
                Pilih Status Pernikahan
              </option>
              <option>Belum menikah</option>
              <option>Menikah</option>
              <option>Cerai</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Jumlah anak</label>
            <input
              name="children_count"
              type="number"
              min={0}
              defaultValue={0}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Anak keberapa</label>
            <input
              name="birth_order"
              type="number"
              min={1}
              placeholder="Misal: 1"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Dari berapa bersaudara</label>
            <input
              name="siblings_total"
              type="number"
              min={1}
              placeholder="Misal: 3"
              className={inputCls}
              required
            />
          </div>
        </div>
      </div>

      {/* Bagian 4: Domisili */}
      <div>
        <h2 className="mb-4 text-base font-bold text-teal-900 border-b border-slate-100 pb-2">
          4. Alamat Domisili
        </h2>
        <div>
          <label className={labelCls}>Alamat lengkap tempat tinggal</label>
          <textarea
            name="address"
            rows={3}
            className={inputCls}
            placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten"
            required
          />
        </div>
      </div>

      <ErrorBox message={error} />

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Ingin melihat bidang psikologi atau artikel terlebih dahulu?{' '}
          <Link href="/" className="font-semibold text-teal-700 hover:underline">
            Kunjungi Halaman Utama
          </Link>
        </p>
        <button className={btnCls + ' sm:w-auto sm:px-8'} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Identitas & Lanjutkan'}
        </button>
      </div>
    </form>
  )
}
