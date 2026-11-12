import type { ReactNode } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export const labelCls = 'block text-sm font-medium text-slate-700 mb-1'
export const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 ' +
  'placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200'
export const btnCls =
  'w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white transition ' +
  'hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60'
export const btnInlineCls =
  'inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition ' +
  'hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60'
export const btnOutlineCls =
  'inline-block rounded-lg border border-teal-700 px-4 py-2 text-sm font-medium text-teal-800 ' +
  'transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60'

export function Brand() {
  return (
    <Link href="/" className="text-xl font-bold tracking-tight text-teal-800">
      MindSpace
    </Link>
  )
}

// Kerangka halaman dengan header, dipakai halaman setelah login.
export function PageShell({
  title,
  name,
  home,
  back,
  children,
}: {
  title: string
  name?: string
  home?: string
  back?: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Brand />
          <div className="flex items-center gap-3 text-sm">
            {home && (
              <Link href={home} className="text-slate-600 hover:text-teal-800">
                Beranda
              </Link>
            )}
            <Link href="/kontak" className="text-slate-600 hover:text-teal-800">
              Kontak
            </Link>
            {name && <span className="hidden text-slate-600 sm:inline">{name}</span>}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {back && (
          <Link href={back.href} className="mb-3 inline-block text-sm text-teal-700 hover:underline">
            &larr; {back.label}
          </Link>
        )}
        <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
        {children}
      </main>
    </div>
  )
}

// Kerangka halaman login/register.
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Brand />
          <h1 className="mt-3 text-lg font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ' + className}>
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold text-slate-900">{children}</h2>
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  )
}

const STATUS: Record<string, { label: string; cls: string }> = {
  menunggu_pembayaran: { label: 'Menunggu pembayaran', cls: 'bg-amber-100 text-amber-800' },
  terkonfirmasi: { label: 'Terkonfirmasi', cls: 'bg-teal-100 text-teal-800' },
  selesai: { label: 'Selesai', cls: 'bg-slate-200 text-slate-700' },
  dibatalkan: { label: 'Dibatalkan', cls: 'bg-red-100 text-red-700' },
  izin: { label: 'Izin', cls: 'bg-blue-100 text-blue-800' },
  belum_bayar: { label: 'Belum bayar', cls: 'bg-amber-100 text-amber-800' },
  lunas: { label: 'Lunas', cls: 'bg-teal-100 text-teal-800' },
  kedaluwarsa: { label: 'Kedaluwarsa', cls: 'bg-red-100 text-red-700' },
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700' }
  return (
    <span className={'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ' + s.cls}>
      {s.label}
    </span>
  )
}
