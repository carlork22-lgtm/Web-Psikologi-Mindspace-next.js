import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Brand } from '@/components/ui'
import LogoutButton from '@/components/LogoutButton'
import OpenBotButton from '@/components/OpenBotButton'

// Nomor WhatsApp: 0812... -> https://wa.me/62812...
function waLink(value: string) {
  const digits = value.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? '62' + digits.slice(1) : digits
  return `https://wa.me/${intl}`
}

export default async function KontakPage() {
  const supabase = await createClient()

  const [{ data: channelsData }, { data: userData }] = await Promise.all([
    supabase
      .from('contact_channels')
      .select('id, type, label, value')
      .eq('is_active', true)
      .order('id'),
    supabase.auth.getUser(),
  ])

  let profile: { id: string; role: string; full_name: string } | null = null
  if (userData?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', userData.user.id)
      .maybeSingle()
    profile = data
  }

  const channels: any[] = channelsData ?? []
  const dashboardHref = profile?.role === 'konselor' ? '/konselor' : '/konseli'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Navbar Terhubung Lengkap */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <Brand />
              <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
                <Link href="/" className="text-slate-600 hover:text-teal-800 transition">
                  Halaman Utama
                </Link>
                <Link href="/#bidang" className="text-slate-600 hover:text-teal-800 transition">
                  Bidang Layanan
                </Link>
                <Link href="/#artikel" className="text-slate-600 hover:text-teal-800 transition">
                  Artikel Ilmiah
                </Link>
                <Link href="/#peraturan" className="text-slate-600 hover:text-teal-800 transition">
                  Peraturan
                </Link>
                <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-teal-800 font-semibold">
                  Kontak & Chatbot
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {profile ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[11px] font-bold text-teal-800 uppercase">
                      {profile.role === 'konselor' ? 'Psikolog' : 'Konseli'}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 max-w-[130px] truncate">
                      {profile.full_name}
                    </span>
                  </div>
                  <Link
                    href={dashboardHref}
                    className="rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
                  >
                    Dashboard Saya
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sub-nav mobile */}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 md:hidden overflow-x-auto">
            <div className="flex items-center gap-4 text-xs whitespace-nowrap">
              <Link href="/" className="font-medium text-slate-700 hover:text-teal-800">
                🏠 Halaman Utama
              </Link>
              <Link href="/#bidang" className="text-slate-700 hover:text-teal-800">
                Bidang
              </Link>
              <Link href="/#artikel" className="text-slate-700 hover:text-teal-800">
                Artikel
              </Link>
              {profile && (
                <Link href={dashboardHref} className="font-semibold text-teal-800">
                  Dashboard Saya
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Konten Halaman Kontak */}
        <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          {/* Breadcrumbs / Tombol Kembali Cepat */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-teal-800 transition"
            >
              <span>&larr;</span>
              <span>Kembali ke Halaman Utama</span>
            </Link>
            {profile && (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 font-semibold text-teal-800 hover:bg-teal-100 transition"
              >
                <span>&rarr;</span>
                <span>Buka Dashboard {profile.role === 'konselor' ? 'Konselor' : 'Konseli'}</span>
              </Link>
            )}
          </div>

          <div className="mb-8">
            <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
              Layanan Bantuan & Respons Cepat
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Call Center & Chatbot
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Butuh panduan konsultasi atau bantuan darurat? Hubungi staf kami melalui saluran resmi WhatsApp, panggilan telepon, atau gunakan chatbot cerdas MindSpace.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {channels.map((c) => {
              const href =
                c.type === 'whatsapp' ? waLink(c.value) : c.type === 'telepon' ? `tel:${c.value}` : c.value
              const action =
                c.type === 'whatsapp'
                  ? 'Chat via WhatsApp'
                  : c.type === 'telepon'
                  ? 'Telepon Sekarang'
                  : 'Buka Chatbot MindSpace'
              const icon =
                c.type === 'whatsapp' ? '💬' : c.type === 'telepon' ? '📞' : '🤖'

              return (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-teal-400 hover:shadow-md"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-xl border border-teal-100">
                      {icon}
                    </div>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      {c.label}
                    </p>
                    <p className="mt-1 break-all text-base font-bold text-slate-900">
                      {c.type === 'chatbot' ? 'Chatbot AI MindSpace' : c.value}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {c.type === 'whatsapp'
                        ? 'Layanan pesan cepat untuk pertanyaan umum & konfirmasi jadwal.'
                        : c.type === 'telepon'
                        ? 'Hubungi langsung operator bantuan pada jam kerja operasional.'
                        : 'Asisten interaktif otomatis untuk menjawab pertanyaan seputar konseling.'}
                    </p>
                  </div>

                  {c.type === 'chatbot' ? (
                    <OpenBotButton className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition">
                      <span>Buka Chatbot MindSpace</span>
                      <span className="ml-1.5">&rarr;</span>
                    </OpenBotButton>
                  ) : (
                    <a
                      href={href}
                      target={c.type === 'telepon' ? undefined : '_blank'}
                      rel="noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition"
                    >
                      <span>{action}</span>
                      <span className="ml-1.5">&rarr;</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {/* Jam Operasional */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Jam Operasional Layanan</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-800">Senin - Jumat:</p>
                <p>08.00 - 20.00 WIB</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Sabtu & Minggu:</p>
                <p>09.00 - 17.00 WIB (Sesuai Slot Konselor)</p>
              </div>
            </div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
              * Chatbot MindSpace dapat diakses secara otomatis selama 24 jam setiap hari.
            </p>
          </div>
        </main>
      </div>

      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MindSpace &middot; Call Center & Chatbot Support</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-teal-800">Halaman Utama</Link>
            <Link href="/login" className="hover:text-teal-800">Masuk</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
