import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { Card, PageShell } from '@/components/ui'
import ChatBox from '@/components/ChatBox'

// Halaman chat saja (tanpa detail pemesanan) untuk konseli.
export default async function KonseliChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user, profile } = await requireUser('konseli', { needDetails: true })

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, client_id, counselor_id, status')
    .eq('id', id)
    .maybeSingle()
  if (!booking || booking.client_id !== user.id) notFound()

  const [counselorRes, msgRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', booking.counselor_id).single(),
    supabase
      .from('messages')
      .select('id, sender_id, body, created_at, is_read')
      .eq('booking_id', id)
      .order('id')
      .limit(500),
  ])
  const counselorName: string = counselorRes.data?.full_name ?? 'Konselor'

  return (
    <PageShell
      title={`Chat dengan ${counselorName}`}
      name={profile.full_name}
      home="/konseli"
      back={{ href: '/konseli', label: 'Kembali ke beranda' }}
    >
      <Card>
        <ChatBox
          tall
          bookingId={booking.id}
          currentUserId={user.id}
          otherName={counselorName}
          initial={msgRes.data ?? []}
          disabled={booking.status === 'dibatalkan'}
        />
      </Card>
    </PageShell>
  )
}
