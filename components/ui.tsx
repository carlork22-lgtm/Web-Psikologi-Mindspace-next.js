import type { ReactNode } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5'
export const inputCls =
  'w-full rounded-xl border border-violet-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition ' +
  'placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200'
export const btnCls =
  'w-full rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white shadow-xs transition ' +
  'hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
export const btnInlineCls =
  'inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition ' +
  'hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
export const btnOutlineCls =
  'inline-flex items-center justify-center rounded-xl border border-violet-500 px-4 py-2 text-sm font-medium text-violet-700 transition ' +
  'hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60'

export function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-violet-800 hover:opacity-90 transition">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 font-black text-white text-base">
        M
      </span>
      <span>MindSpace</span>
    </Link>
  )
}

// Kerangka halaman dengan header terintegrasi, dipakai halaman setelah login.
export function PageShell({
  title,
  name,
  home,
  back,
  role,
  children,
}: {
  title: string
  name?: string
  home?: string
  back?: { href: string; label: string }
  role?: 'konseli' | 'konselor'
  children: ReactNode
}) {
  const userRole =
    role ?? (home?.includes('konselor') ? 'konselor' : home?.includes('konseli') ? 'konseli' : undefined)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <Brand />
              <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
                <Link
                  href="/"
                  className="text-slate-600 hover:text-violet-700 transition"
                  title="Kembali ke halaman utama untuk melihat 6 bidang psikologi, artikel, dan peraturan"
                >
                  Halaman Utama
                </Link>
                {home && (
                  <Link
                    href={home}
                    className="rounded-lg bg-violet-50 px-3 py-1.5 font-semibold text-violet-700 hover:bg-violet-100 transition"
                  >
                    Dashboard Saya
                  </Link>
                )}
                {userRole === 'konseli' && (
                  <>
                    <Link href="/konseli/bidang" className="text-slate-600 hover:text-violet-700 transition">
                      Pilih Bidang
                    </Link>
                    <Link href="/konseli/riwayat" className="text-slate-600 hover:text-violet-700 transition">
                      Riwayat Konseling
                    </Link>
                  </>
                )}
                <Link href="/kontak" className="text-slate-600 hover:text-violet-700 transition">
                  Kontak & Chatbot
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {name && (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                    {userRole === 'konselor' ? 'Psikolog / Konselor' : 'Konseli'}
                  </span>
                  <span className="font-semibold text-slate-800 max-w-[130px] truncate sm:max-w-none">
                    {name}
                  </span>
                </div>
              )}
              <LogoutButton />
            </div>
          </div>

          {/* Sub-navbar responsif mobile */}
          <div className="border-t border-slate-100 bg-violet-50/50 px-4 py-2 md:hidden overflow-x-auto">
            <div className="flex items-center gap-4 text-xs whitespace-nowrap">
              <Link href="/" className="font-medium text-slate-700 hover:text-violet-700">
                🏠 Halaman Utama
              </Link>
              {home && (
                <Link href={home} className="font-semibold text-violet-700">
                  Dashboard
                </Link>
              )}
              {userRole === 'konseli' && (
                <>
                  <Link href="/konseli/bidang" className="text-slate-700 hover:text-violet-700">
                    Pilih Bidang
                  </Link>
                  <Link href="/konseli/riwayat" className="text-slate-700 hover:text-violet-700">
                    Riwayat
                  </Link>
                </>
              )}
              <Link href="/kontak" className="text-slate-700 hover:text-violet-700">
                Kontak
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          {back && (
            <Link
              href={back.href}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 hover:underline"
            >
              <span>&larr;</span> {back.label}
            </Link>
          )}
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {children}
        </main>
      </div>

      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MindSpace &middot; Ruang Aman untuk Kesejahteraan Psikologis Karyawan</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-violet-700">Halaman Utama</Link>
            <Link href="/kontak" className="hover:text-violet-700">Bantuan</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Kerangka halaman login/register.
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Brand />
          <h1 className="mt-3 text-lg font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kembali ke{' '}
            <Link href="/" className="font-medium text-violet-600 hover:underline">
              Halaman Utama
            </Link>
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={'rounded-2xl border border-slate-200 bg-white p-6 shadow-xs ' + className}>
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-lg font-bold text-slate-900">{children}</h2>
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
      {message}
    </p>
  )
}

const STATUS: Record<string, { label: string; cls: string }> = {
  menunggu_pembayaran: { label: 'Menunggu pembayaran', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  terkonfirmasi: { label: 'Terkonfirmasi', cls: 'bg-violet-100 text-violet-800 border-violet-200' },
  selesai: { label: 'Selesai', cls: 'bg-slate-200 text-slate-700 border-slate-300' },
  dibatalkan: { label: 'Dibatalkan', cls: 'bg-red-100 text-red-700 border-red-200' },
  izin: { label: 'Izin Sakit', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  belum_bayar: { label: 'Belum bayar', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  lunas: { label: 'Lunas', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  kedaluwarsa: { label: 'Kedaluwarsa', cls: 'bg-red-100 text-red-700 border-red-200' },
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ' + s.cls}>
      {s.label}
    </span>
  )
}
