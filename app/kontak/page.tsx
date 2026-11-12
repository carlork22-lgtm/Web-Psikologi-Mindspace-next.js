import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Brand } from '@/components/ui'

// Nomor WhatsApp: 0812... -> https://wa.me/62812...
function waLink(value: string) {
  const digits = value.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? '62' + digits.slice(1) : digits
  return `https://wa.me/${intl}`
}

// Halaman publik: call center dan chatbot. Isinya dibaca dari tabel contact_channels,
// jadi bisa diubah lewat Table Editor Supabase tanpa mengubah kode.
export default async function KontakPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contact_channels')
    .select('id, type, label, value')
    .eq('is_active', true)
    .order('id')
  const channels: any[] = data ?? []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Brand />
          <Link href="/login" className="text-sm text-slate-600 hover:text-teal-800">
            Masuk
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-semibold">Hubungi kami</h1>
        <p className="mb-6 text-sm text-slate-600">
          Butuh bantuan? Hubungi call center atau gunakan chatbot kami.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {channels.map((c) => {
            const href =
              c.type === 'whatsapp' ? waLink(c.value) : c.type === 'telepon' ? `tel:${c.value}` : c.value
            const action =
              c.type === 'whatsapp' ? 'Chat via WhatsApp' : c.type === 'telepon' ? 'Telepon sekarang' : 'Buka chatbot'
            return (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{c.label}</p>
                <p className="mt-1 break-all font-semibold text-slate-900">
                  {c.type === 'chatbot' ? 'Chatbot MindSpace' : c.value}
                </p>
                <a
                  href={href}
                  target={c.type === 'telepon' ? undefined : '_blank'}
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
                >
                  {action}
                </a>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
