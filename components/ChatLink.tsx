import Link from 'next/link'

// Ikon chat dengan penanda jumlah pesan belum dibaca.
export default function ChatLink({ href, unread = 0 }: { href: string; unread?: number }) {
  return (
    <Link
      href={href}
      title="Buka chat"
      aria-label={unread > 0 ? `Buka chat, ${unread} pesan baru` : 'Buka chat'}
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-teal-700 transition hover:border-teal-600 hover:bg-teal-50"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
