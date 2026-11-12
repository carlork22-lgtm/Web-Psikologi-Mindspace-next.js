'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls, inputCls, labelCls } from '@/components/ui'

// Bagian G lembar kehidupan: catatan tambahan, hanya diisi konselor.
export default function CounselorNotesForm({
  lifeSheetId,
  initial,
}: {
  lifeSheetId: string
  initial: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setLoading(true)
    const f = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase
      .from('life_sheets')
      .update({ counselor_notes: String(f.get('notes') ?? '').trim() || null })
      .eq('id', lifeSheetId)
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className={labelCls}>G. Catatan tambahan konselor (observasi, hal menarik, catatan khusus)</label>
        <textarea name="notes" rows={4} defaultValue={initial} className={inputCls} />
      </div>
      <ErrorBox message={error} />
      <div className="flex items-center gap-3">
        <button className={btnInlineCls} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan catatan'}
        </button>
        {saved && <span className="text-sm text-teal-700">Tersimpan.</span>}
      </div>
    </form>
  )
}
