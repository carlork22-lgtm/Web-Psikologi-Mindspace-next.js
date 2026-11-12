'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls, inputCls, labelCls } from '@/components/ui'

type Group = {
  dateLabel: string
  slots: { id: string; label: string; isBooked: boolean }[]
}

const pad = (n: number) => String(n).padStart(2, '0')
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 06 s.d. 21

export default function SlotManager({
  counselorId,
  groups,
  todayWib,
}: {
  counselorId: string
  groups: Group[]
  todayWib: string // 'YYYY-MM-DD'
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function addSlots(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    const f = new FormData(e.currentTarget)
    const date = String(f.get('date'))
    const startHour = Number(f.get('start_hour'))
    const endHour = Number(f.get('end_hour'))

    if (endHour <= startHour) {
      setError('Jam selesai harus lebih besar dari jam mulai.')
      return
    }

    // Satu slot per jam, waktu dibaca sebagai WIB (+07:00).
    const rows = []
    for (let h = startHour; h < endHour; h++) {
      const start = new Date(`${date}T${pad(h)}:00:00+07:00`)
      const end = new Date(`${date}T${pad(h + 1)}:00:00+07:00`)
      if (start.getTime() <= Date.now()) {
        setError('Jadwal harus di masa depan.')
        return
      }
      rows.push({
        counselor_id: counselorId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      })
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('availability_slots').insert(rows)
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    setInfo(`${rows.length} slot jadwal ditambahkan.`)
    router.refresh()
  }

  async function removeSlot(id: string) {
    setError(null)
    setInfo(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('availability_slots')
      .delete()
      .eq('id', id)
      .select('id')
    if (error) {
      setError(pesanError(error.message))
      return
    }
    if (!data || data.length === 0) {
      setError('Slot tidak bisa dihapus (mungkin sudah dipesan).')
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addSlots} className="grid gap-3 sm:grid-cols-4 sm:items-end">
        <div>
          <label className={labelCls}>Tanggal</label>
          <input name="date" type="date" min={todayWib} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Mulai jam</label>
          <select name="start_hour" defaultValue={9} className={inputCls}>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {pad(h)}.00
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Sampai jam</label>
          <select name="end_hour" defaultValue={16} className={inputCls}>
            {HOURS.map((h) => (
              <option key={h + 1} value={h + 1}>
                {pad(h + 1)}.00
              </option>
            ))}
          </select>
        </div>
        <button className={btnInlineCls} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Tambah jadwal'}
        </button>
      </form>
      <p className="-mt-3 text-xs text-slate-500">
        Setiap jam dalam rentang itu menjadi satu slot (misal 09.00 sampai 12.00 membuat 3 slot).
        Waktu dalam WIB.
      </p>

      <ErrorBox message={error} />
      {info && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
          {info}
        </p>
      )}

      {groups.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada jadwal mendatang.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.dateLabel}>
              <p className="mb-2 text-sm font-medium text-slate-700">{g.dateLabel}</p>
              <div className="flex flex-wrap gap-2">
                {g.slots.map((s) =>
                  s.isBooked ? (
                    <span
                      key={s.id}
                      className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm text-slate-600"
                      title="Sudah dipesan"
                    >
                      {s.label} &middot; dipesan
                    </span>
                  ) : (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
                    >
                      {s.label}
                      <button
                        type="button"
                        onClick={() => removeSlot(s.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Hapus slot ${s.label}`}
                      >
                        &times;
                      </button>
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
