'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls } from '@/components/ui'

export default function CompleteSessionButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function complete() {
    if (!window.confirm('Tandai sesi ini selesai? Pastikan riwayat konseling sudah disimpan.')) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.from('bookings').update({ status: 'selesai' }).eq('id', bookingId)
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <button onClick={complete} disabled={loading} className={btnInlineCls}>
        {loading ? 'Memproses...' : 'Selesaikan sesi'}
      </button>
      <ErrorBox message={error} />
    </div>
  )
}
