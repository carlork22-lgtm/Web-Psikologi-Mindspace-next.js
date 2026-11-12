import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { Card, PageShell } from '@/components/ui'
import ChatBox from '@/components/ChatBox'

// Halaman chat saja (tanpa detail pemesanan) untuk konselor.
export default async function KonselorChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user, profile } = await requireUser('konselor', { needDetails: true })

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, client_id, counselor_id, status')
    .eq('id', id)
    .maybeSingle()
  if (!booking || booking.counselor_id !== user.id) notFound()

  const [clientRes, msgRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', booking.client_id).single(),
    supabase
      .from('messages')
      .select('id, sender_id, body, created_at, is_read')
      .eq('booking_id', id)
      .order('id')
      .limit(500),
  ])
  const clientName: string = clientRes.data?.full_name ?? 'Konseli'

  return (
    <PageShell
      title={`Chat dengan ${clientName}`}
      name={profile.full_name}
      home="/konselor"
      back={{ href: '/konselor', label: 'Kembali ke beranda' }}
    >
      <Card>
        <ChatBox
          tall
          bookingId={booking.id}
          currentUserId={user.id}
          otherName={clientName}
          initial={msgRes.data ?? []}
          disabled={booking.status === 'dibatalkan'}
        />
      </Card>
    </PageShell>
  )
}
