import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { rupiah } from '@/lib/format'
import { Card, PageShell, btnInlineCls } from '@/components/ui'

export default async function DaftarKonselorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile } = await requireUser('konseli', { needDetails: true })

  const specialtyId = Number(id)
  if (!Number.isInteger(specialtyId)) notFound()

  const { data: specialty } = await supabase
    .from('specialties')
    .select('id, name, description')
    .eq('id', specialtyId)
    .maybeSingle()
  if (!specialty) notFound()

  const { data: links } = await supabase
    .from('counselor_specialties')
    .select('counselor_id')
    .eq('specialty_id', specialtyId)
  const ids: string[] = (links ?? []).map((l: any) => l.counselor_id)

  const [detailsRes, profilesRes] = await Promise.all([
    ids.length
      ? supabase
          .from('counselor_details')
          .select('profile_id, bio, session_fee')
          .in('profile_id', ids)
          .eq('is_active', true)
      : Promise.resolve({ data: [] as any[] }),
    ids.length
      ? supabase.from('profiles').select('id, full_name').in('id', ids)
      : Promise.resolve({ data: [] as any[] }),
  ])

  const nameMap = new Map<string, string>((profilesRes.data ?? []).map((p: any) => [p.id, p.full_name]))
  const counselors: any[] = detailsRes.data ?? []

  return (
    <PageShell
      title={specialty.name}
      name={profile.full_name}
      home="/konseli"
      back={{ href: '/konseli/bidang', label: 'Pilih bidang lain' }}
    >
      <p className="mb-6 text-sm text-slate-600">{specialty.description}</p>

      {counselors.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            Belum ada psikolog yang tersedia untuk bidang ini. Silakan pilih bidang lain.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {counselors.map((c) => (
            <Card key={c.profile_id} className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <h2 className="font-semibold text-slate-900">{nameMap.get(c.profile_id)}</h2>
                {c.bio && <p className="mt-1 text-sm text-slate-600">{c.bio}</p>}
                <p className="mt-2 text-sm font-medium text-teal-800">
                  {rupiah(c.session_fee)} / sesi
                </p>
              </div>
              <Link
                href={`/konseli/konselor/${c.profile_id}?bidang=${specialtyId}`}
                className={btnInlineCls}
              >
                Lihat jadwal
              </Link>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
