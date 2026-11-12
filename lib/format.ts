// Pemformat tanggal/jam (zona waktu WIB) dan rupiah.
const TZ = 'Asia/Jakarta'

export function tanggalPanjang(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  })
}

export function tanggalSaja(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  })
}

export function jam(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: TZ,
    })
    .replace(':', '.')
}

export function rentangJam(startIso: string, endIso: string): string {
  return `${jam(startIso)}-${jam(endIso)} WIB`
}

export function jadwalLengkap(startIso: string, endIso: string): string {
  return `${tanggalPanjang(startIso)}, ${rentangJam(startIso, endIso)}`
}

// 'YYYY-MM-DD' menurut WIB, untuk mengelompokkan slot per hari.
export function kunciTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ })
}

export function rupiah(n: number | string): string {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

export function tanggalWaktu(iso: string): string {
  return (
    new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: TZ,
    }) +
    ', ' +
    jam(iso) +
    ' WIB'
  )
}
