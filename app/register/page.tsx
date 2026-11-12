'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { AuthCard, ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

type Role = 'konseli' | 'konselor'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('konseli')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    // role, full_name, dan phone dibaca trigger database untuk membuat baris profiles.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: fullName, phone } },
    })
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    if (!data.session) {
      setError(
        'Akun dibuat, tetapi belum bisa langsung masuk karena konfirmasi email masih aktif. ' +
          'Matikan "Confirm email" di Supabase (Authentication > Sign In / Providers > Email), ' +
          'lalu login.'
      )
      return
    }
    router.push(role === 'konselor' ? '/konselor' : '/konseli')
    router.refresh()
  }

  return (
    <AuthCard title="Buat akun baru">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <span className={labelCls}>Daftar sebagai</span>
          <div className="grid grid-cols-2 gap-2">
            {(['konseli', 'konselor'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={
                  'rounded-lg border px-3 py-2 text-sm font-medium capitalize ' +
                  (role === r
                    ? 'border-teal-700 bg-teal-50 text-teal-800'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50')
                }
              >
                {r === 'konseli' ? 'Konseli (karyawan)' : 'Konselor (psikolog)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Nama lengkap</label>
          <input
            className={inputCls}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>No. HP / WhatsApp</label>
          <input
            className={inputCls}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            className={inputCls}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Password (minimal 6 karakter)</label>
          <input
            className={inputCls}
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <ErrorBox message={error} />

        <button className={btnCls} disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthCard>
  )
}
