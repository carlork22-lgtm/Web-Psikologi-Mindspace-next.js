'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { LIFE_SECTIONS } from '@/lib/lifesheet'
import { ErrorBox, btnCls, inputCls, labelCls } from '@/components/ui'

export default function LifeSheetForm({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const f = new FormData(e.currentTarget)
    const row: Record<string, string | null> = { booking_id: bookingId }
    row.nickname_note = String(f.get('nickname_note') ?? '').trim() || null
    for (const section of LIFE_SECTIONS) {
      for (const field of section.fields) {
        row[field.name] = String(f.get(field.name) ?? '').trim() || null
      }
    }

    const supabase = createClient()
    const { error } = await supabase.from('life_sheets').insert(row)
    setLoading(false)

    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="max-w-sm">
        <label className={labelCls}>Nama panggilan (opsional)</label>
        <input name="nickname_note" className={inputCls} />
      </div>

      {LIFE_SECTIONS.map((section) => (
        <fieldset key={section.title} className="space-y-4">
          <legend className="mb-1 font-semibold text-teal-800">{section.title}</legend>
          {section.fields.map((field) => (
            <div key={field.name}>
              <label className={labelCls}>
                {field.label}
                {field.required && <span className="text-red-600"> *</span>}
              </label>
              <textarea name={field.name} rows={3} className={inputCls} required={field.required} />
            </div>
          ))}
        </fieldset>
      ))}

      <ErrorBox message={error} />

      <div className="max-w-xs">
        <button className={btnCls} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Kirim lembar kehidupan'}
        </button>
      </div>
    </form>
  )
}
