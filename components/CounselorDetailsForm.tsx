'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

type Specialty = { id: number; name: string }

// Form profil konselor -> tabel counselor_details dan counselor_specialties.
export default function CounselorDetailsForm({
  userId,
  specialties,
}: {
  userId: string
  specialties: Specialty[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function toggle(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (selected.length === 0) {
      setError('Pilih minimal satu bidang psikologi.')
      return
    }

    const f = new FormData(e.currentTarget)
    setLoading(true)
    const supabase = createClient()

    const { error: e1 } = await supabase.from('counselor_details').insert({
      profile_id: userId,
      sip_number: String(f.get('sip_number')),
      bio: String(f.get('bio') ?? '') || null,
      session_fee: Number(f.get('session_fee')),
    })
    if (e1) {
      setLoading(false)
      setError(pesanError(e1.message))
      return
    }

    const { error: e2 } = await supabase
      .from('counselor_specialties')
      .insert(selected.map((specialty_id) => ({ counselor_id: userId, specialty_id })))
    setLoading(false)
    if (e2) {
      setError(pesanError(e2.message))
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
        Lengkapi profil Anda agar dapat dipilih oleh konseli.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nomor SIP</label>
          <input name="sip_number" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Biaya per sesi (Rp)</label>
          <input
            name="session_fee"
            type="number"
            min={0}
            step={1000}
            defaultValue={150000}
            className={inputCls}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Bio singkat</label>
        <textarea name="bio" rows={3} className={inputCls} />
      </div>

      <div>
        <span className={labelCls}>Bidang psikologi yang Anda tangani</span>
        <div className="space-y-2">
          {specialties.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggle(s.id)}
                className="h-4 w-4 accent-teal-700"
              />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <ErrorBox message={error} />

      <button className={btnCls} disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan profil'}
      </button>
    </form>
  )
}
