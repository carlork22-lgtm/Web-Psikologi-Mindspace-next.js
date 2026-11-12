// Menerjemahkan pesan error umum dari Supabase/database ke bahasa Indonesia.
export function pesanError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email atau password salah.'
  if (m.includes('user already registered')) return 'Email ini sudah terdaftar. Silakan login.'
  if (m.includes('password should be at least')) return 'Password minimal 6 karakter.'
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'Format email tidak valid.'
  if (m.includes('rate limit')) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.'
  if (m.includes('duplicate key') && m.includes('sip_number'))
    return 'Nomor SIP ini sudah terdaftar.'
  if (m.includes('slots_no_overlap') || m.includes('slots_unique_start'))
    return 'Sebagian jadwal sudah ada atau bertumpuk dengan slot lain. Pilih rentang jam yang berbeda.'
  if (m.includes('bookings_counselor_specialty_fk'))
    return 'Konselor ini tidak menangani bidang yang dipilih.'
  if (m.includes('bookings_slot_active_uq'))
    return 'Jadwal ini baru saja dipesan orang lain. Silakan pilih jadwal lain.'
  if (m.includes('bookings_slot_id_fkey'))
    return 'Slot ini punya riwayat pemesanan sehingga tidak bisa dihapus.'
  if (m.includes('informed_consents_booking_id_key'))
    return 'Informed consent untuk sesi ini sudah pernah diisi.'
  if (m.includes('life_sheets_booking_id_key'))
    return 'Lembar kehidupan untuk sesi ini sudah pernah diisi.'
  if (m.includes('row-level security')) return 'Aksi ini tidak diizinkan untuk akun Anda.'
  return message
}
