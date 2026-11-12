'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox } from '@/components/ui'

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function cancel() {
    if (!window.confirm('Batalkan pemesanan ini? Jadwal akan dilepas kembali.')) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'dibatalkan' })
      .eq('id', bookingId)
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <button
        onClick={cancel}
        disabled={loading}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {loading ? 'Memproses...' : 'Batalkan pemesanan'}
      </button>
      <ErrorBox message={error} />
    </div>
  )
}
