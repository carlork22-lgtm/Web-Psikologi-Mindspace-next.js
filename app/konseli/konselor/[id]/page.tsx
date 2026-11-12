import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { kunciTanggal, jam, tanggalPanjang, rupiah } from '@/lib/format'
import { Card, PageShell } from '@/components/ui'
import SlotPicker from '@/components/SlotPicker'

export default async function JadwalKonselorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ bidang?: string }>
}) {
  const { id } = await params
  const { bidang } = await searchParams
  const { supabase, user, profile } = await requireUser('konseli', { needDetails: true })

  const specialtyId = Number(bidang)
  if (!Number.isInteger(specialtyId)) notFound()

  // Pastikan konselor memang menangani bidang ini.
  const { data: link } = await supabase
    .from('counselor_specialties')
    .select('counselor_id')
    .eq('counselor_id', id)
    .eq('specialty_id', specialtyId)
    .maybeSingle()
  if (!link) notFound()

  const [counselorRes, detailRes, specialtyRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', id).maybeSingle(),
    supabase.from('counselor_details').select('bio, session_fee').eq('profile_id', id).maybeSingle(),
    supabase.from('specialties').select('name').eq('id', specialtyId).maybeSingle(),
  ])
  if (!counselorRes.data || !detailRes.data) notFound()

  const nowIso = new Date().toISOString()
  const { data: slots } = await supabase
    .from('availability_slots')
    .select('id, start_time, end_time')
    .eq('counselor_id', id)
    .eq('is_booked', false)
    .gt('start_time', nowIso)
    .order('start_time')
    .limit(300)

  // Kelompokkan per tanggal; teks sudah diformat di server.
  const groupMap = new Map<string, { dateLabel: string; slots: { id: string; label: string }[] }>()
  for (const s of (slots ?? []) as any[]) {
    const key = kunciTanggal(s.start_time)
    if (!groupMap.has(key)) {
      groupMap.set(key, { dateLabel: tanggalPanjang(s.start_time), slots: [] })
    }
    groupMap.get(key)!.slots.push({ id: s.id, label: `${jam(s.start_time)}-${jam(s.end_time)}` })
  }
  const groups = [...groupMap.values()]

  return (
    <PageShell
      title={counselorRes.data.full_name}
      name={profile.full_name}
      home="/konseli"
      back={{ href: `/konseli/bidang/${specialtyId}`, label: 'Kembali ke daftar psikolog' }}
    >
      <Card className="mb-6">
        <p className="text-sm text-slate-500">Bidang: {specialtyRes.data?.name}</p>
        {detailRes.data.bio && <p className="mt-1 text-sm text-slate-700">{detailRes.data.bio}</p>}
        <p className="mt-2 text-sm font-medium text-teal-800">
          {rupiah(detailRes.data.session_fee)} / sesi
        </p>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Pilih jadwal (WIB)</h2>
      {groups.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            Belum ada jadwal kosong untuk psikolog ini. Silakan coba psikolog lain.
          </p>
        </Card>
      ) : (
        <SlotPicker
          clientId={user.id}
          counselorId={id}
          specialtyId={specialtyId}
          groups={groups}
        />
      )}
    </PageShell>
  )
}
