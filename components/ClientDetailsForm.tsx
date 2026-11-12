'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
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
      setError('Jumlah bersaudara tidak boleh lebih kecil dari urutan kelahiran.')
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
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-slate-600">
        Lengkapi identitas Anda terlebih dahulu. Data ini hanya dapat dilihat oleh psikolog
        yang Anda pilih.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Tempat lahir</label>
          <input name="birth_place" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Tanggal lahir</label>
          <input name="birth_date" type="date" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Jenis kelamin</label>
          <select name="gender" className={inputCls} required defaultValue="">
            <option value="" disabled>
              Pilih
            </option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Agama / kepercayaan (opsional)</label>
          <input name="religion" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Pekerjaan</label>
          <input name="occupation" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Pendidikan terakhir</label>
          <input name="last_education" className={inputCls} placeholder="Mis. S1" required />
        </div>
        <div>
          <label className={labelCls}>Status pernikahan</label>
          <select name="marital_status" className={inputCls} required defaultValue="">
            <option value="" disabled>
              Pilih
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
          <input name="birth_order" type="number" min={1} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Dari berapa bersaudara</label>
          <input name="siblings_total" type="number" min={1} className={inputCls} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Alamat tempat tinggal</label>
        <textarea name="address" rows={3} className={inputCls} required />
      </div>

      <ErrorBox message={error} />

      <button className={btnCls} disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan identitas'}
      </button>
    </form>
  )
}
