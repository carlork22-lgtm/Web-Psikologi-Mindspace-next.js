import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center text-slate-900">
      <h1 className="text-4xl font-bold tracking-tight text-teal-800">MINDSPACE</h1>
      <p className="mt-2 text-lg text-slate-700">Your Space to Feel Better at Work</p>
      <p className="mt-1 text-slate-500">
        Ruang Aman untuk Kesejahteraan Psikologis Karyawan
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-teal-700 px-5 py-2.5 font-medium text-teal-800 hover:bg-teal-50"
        >
          Daftar
        </Link>
      </div>
    </div>
  )
}
