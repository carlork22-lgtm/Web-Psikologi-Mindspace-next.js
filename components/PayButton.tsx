'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pesanError } from '@/lib/errors'
import { ErrorBox, btnInlineCls } from '@/components/ui'

export default function PayButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function pay() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.rpc('simulate_payment', { p_booking_id: bookingId })
    setLoading(false)
    if (error) {
      setError(pesanError(error.message))
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <button onClick={pay} disabled={loading} className={btnInlineCls}>
        {loading ? 'Memproses...' : 'Bayar (simulasi)'}
      </button>
      <ErrorBox message={error} />
    </div>
  )
}
