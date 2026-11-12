import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { PageShell } from '@/components/ui'

export default async function PilihBidangPage() {
  const { supabase, profile } = await requireUser('konseli', { needDetails: true })

  const { data: specialties } = await supabase
    .from('specialties')
    .select('id, name, description, when_to_consult')
    .order('id')

  return (
    <PageShell
      title="Pilih bidang psikolog"
      name={profile.full_name}
      home="/konseli"
      back={{ href: '/konseli', label: 'Kembali' }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(specialties ?? []).map((s: any) => (
          <Link
            key={s.id}
            href={`/konseli/bidang/${s.id}`}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-600"
          >
            <h2 className="font-semibold text-teal-800">{s.name}</h2>
            <p className="mt-2 text-sm text-slate-700">{s.description}</p>
            <p className="mt-3 text-sm text-slate-500">
              <span className="font-medium text-slate-600">Cocok untuk: </span>
              {s.when_to_consult}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
