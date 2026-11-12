import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Role = 'konseli' | 'konselor'

// Memastikan pengguna sudah login dengan role yang benar.
// Mengembalikan klien Supabase, user, profil, dan baris detail
// (client_details untuk konseli, counselor_details untuk konselor).
export async function requireUser(role: Role, opts: { needDetails?: boolean } = {}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, phone')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/login')

  if (profile.role !== role) {
    redirect(profile.role === 'konselor' ? '/konselor' : '/konseli')
  }

  const { data: detail } = await supabase
    .from(role === 'konseli' ? 'client_details' : 'counselor_details')
    .select('*')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (opts.needDetails && !detail) {
    redirect(role === 'konseli' ? '/konseli' : '/konselor')
  }

  return { supabase, user, profile, detail }
}
