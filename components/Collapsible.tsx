import type { ReactNode } from 'react'

// Kartu yang bisa dibuka/ditutup (elemen <details> bawaan HTML).
export default function Collapsible({
  title,
  badge,
  defaultOpen,
  children,
}: {
  title: string
  badge?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4">
        <span className="text-lg font-semibold text-slate-900">{title}</span>
        {badge}
      </summary>
      <div className="border-t border-slate-100 px-6 py-5">{children}</div>
    </details>
  )
}
