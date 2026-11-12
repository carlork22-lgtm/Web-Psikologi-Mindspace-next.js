import Link from 'next/link'
import { Brand } from '@/components/ui'

const BIDANG_PSIKOLOGI = [
  {
    nomor: '1',
    nama: 'Psikologi Industri dan Organisasi (PIO)',
    singkatan: 'PIO',
    penjelasan:
      'Psikologi PIO berfokus pada perilaku dan kondisi seseorang di lingkungan pekerjaan. Bidang ini berkaitan dengan bagaimana seseorang merasa, berpikir, dan berperilaku ketika menjalankan pekerjaannya.',
    kapanKonsultasi:
      'Ketika seseorang merasa tidak nyaman, tertekan, tidak dihargai, atau kehilangan motivasi dalam pekerjaan.',
    tag: 'Dunia Kerja & Karier',
  },
  {
    nomor: '2',
    nama: 'Psikologi Klinis',
    singkatan: 'Klinis',
    penjelasan:
      'Psikologi klinis lebih berfokus pada kesehatan mental dan kondisi psikologis seseorang. Bidang ini membantu individu yang mengalami permasalahan emosional maupun gangguan psikologis yang dapat mengganggu kehidupan sehari-hari.',
    kapanKonsultasi:
      'Ketika seseorang mengalami permasalahan kesehatan mental, seperti kecemasan, depresi, atau trauma.',
    tag: 'Kesehatan Mental',
  },
  {
    nomor: '3',
    nama: 'Psikologi Sosial',
    singkatan: 'Sosial',
    penjelasan:
      'Psikologi sosial membahas bagaimana lingkungan dan hubungan dengan orang lain dapat memengaruhi perasaan serta perilaku seseorang.',
    kapanKonsultasi:
      'Ketika seseorang mengalami masalah dalam hubungan dan interaksi dengan lingkungan sekitarnya.',
    tag: 'Relasi & Interaksi',
  },
  {
    nomor: '4',
    nama: 'Psikologi Forensik',
    singkatan: 'Forensik',
    penjelasan:
      'Psikologi forensik merupakan bidang psikologi yang berhubungan dengan hukum dan tindak pidana. Bidang ini membantu memahami kondisi psikologis seseorang yang terlibat dalam suatu perkara hukum, baik sebagai pelaku maupun korban.',
    kapanKonsultasi:
      'Ketika kondisi psikologis seseorang berkaitan dengan tindak pidana atau proses hukum.',
    tag: 'Hukum & Keadilan',
  },
  {
    nomor: '5',
    nama: 'Psikologi Pendidikan',
    singkatan: 'Pendidikan',
    penjelasan:
      'Psikologi pendidikan berfokus pada kondisi psikologis seseorang dalam proses belajar dan lingkungan pendidikan. Bidang ini membantu memahami kesulitan yang dialami siswa maupun mahasiswa selama menjalani pendidikan.',
    kapanKonsultasi: 'Ketika seseorang mengalami permasalahan dalam proses belajar.',
    tag: 'Akademik & Belajar',
  },
  {
    nomor: '6',
    nama: 'Psikologi Perkembangan',
    singkatan: 'Perkembangan',
    penjelasan:
      'Psikologi perkembangan mempelajari perubahan perilaku, pikiran, dan emosi manusia sepanjang kehidupannya, mulai dari masa anak-anak hingga lanjut usia.',
    kapanKonsultasi:
      'Ketika seseorang mengalami kesulitan dalam menghadapi perubahan pada tahap kehidupannya.',
    tag: 'Tahap Kehidupan',
  },
]

const ARTIKEL_ILMIAH = [
  {
    id: 1,
    judul: 'Pengaruh Lingkungan Kerja dan Iklim Organisasi terhadap Kesejahteraan Psikologis Karyawan',
    kategori: 'Psikologi Industri & Organisasi',
    ringkasan:
      'Kesejahteraan psikologis karyawan berkaitan erat dengan produktivitas dan kepuasan kerja. Studi menunjukkan bahwa dukungan emosional dan apresiasi di tempat kerja dapat menurunkan risiko kelelahan kerja (burnout).',
    sumberIlmiah:
      'Jurnal Psikologi Industri dan Organisasi Indonesia, Vol. 11, No. 2, Hal. 104-118 (Placeholder Sumber Ilmiah)',
    tanggal: '12 November 2026',
    penulis: 'Tim Riset MindSpace',
  },
  {
    id: 2,
    judul: 'Strategi Manajemen Stres Kerja dan Pencegahan Burnout pada Karyawan di Era Modern',
    kategori: 'Psikologi Klinis & Terapan',
    ringkasan:
      'Tekanan kerja yang terus-menerus tanpa penanganan tepat dapat berkembang menjadi kecemasan berlebih. Penerapan mindfulness dan konseling berkala terbukti efektif mengembalikan kestabilan regulasi emosi.',
    sumberIlmiah:
      'Indonesian Journal of Clinical Psychology and Mental Health, Vol. 8, No. 1, Hal. 45-60 (Placeholder Sumber Ilmiah)',
    tanggal: '10 November 2026',
    penulis: 'Tim Riset MindSpace',
  },
  {
    id: 3,
    judul: 'Menjaga Work-Life Balance: Dampak Dinamika Relasi Sosial terhadap Kualitas Hidup Tenaga Kerja',
    kategori: 'Psikologi Sosial & Kesejahteraan',
    ringkasan:
      'Relasi antarpribadi di luar pekerjaan memberikan ketahanan mental ketika menghadapi tantangan profesional. Artikel ini membahas batas sehat antara tuntutan kantor dan ruang personal.',
    sumberIlmiah:
      'Jurnal Penelitian Ilmu Psikologi Terapan, Vol. 14, No. 3, Hal. 210-225 (Placeholder Sumber Ilmiah)',
    tanggal: '05 November 2026',
    penulis: 'Tim Riset MindSpace',
  },
]

const PERATURAN = [
  {
    judul: '1. Kerahasiaan Data & Kode Etik',
    isi: 'Seluruh identitas klien, isi percakapan, rekam konseling, dan lembar kehidupan dijamin kerahasiaannya sesuai kode etik profesi psikologi.',
  },
  {
    judul: '2. Komitmen Jadwal Konseling (Per Jam)',
    isi: 'Setiap sesi konseling berlangsung selama 60 menit (per jam) sesuai jadwal yang telah dipilih dan disepakati. Konseli dan konselor diharapkan hadir tepat waktu.',
  },
  {
    judul: '3. Pengisian Informed Consent & Lembar Kehidupan',
    isi: 'Konseli wajib menyetujui lembar persetujuan (Informed Consent) dan mengisi Lembar Kehidupan Klien 1 kali sebelum sesi konseling dimulai.',
  },
  {
    judul: '4. Administrasi & Pembayaran',
    isi: 'Pemesanan sesi dinyatakan terkonfirmasi setelah pembayaran Virtual Account selesai sebelum batas waktu yang ditentukan.',
  },
  {
    judul: '5. Pengajuan Izin Sakit',
    isi: 'Bagi konseli yang berhalangan hadir pada hari konsultasi karena alasan medis, dapat mengajukan izin sakit untuk diterbitkan Surat Keterangan Sakit resmi dari dokter/klinik mitra.',
  },
  {
    judul: '6. Ruang Aman dan Saling Menghormati',
    isi: 'MindSpace adalah ruang aman (safe space). Setiap pihak diharapkan berkomunikasi secara santun, jujur, terbuka, dan tanpa diskriminasi.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar Publik */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#bidang" className="text-slate-600 hover:text-teal-800">
              Bidang Layanan
            </a>
            <a href="#artikel" className="text-slate-600 hover:text-teal-800">
              Artikel Ilmiah
            </a>
            <a href="#peraturan" className="text-slate-600 hover:text-teal-800">
              Peraturan
            </a>
            <Link href="/kontak" className="text-slate-600 hover:text-teal-800">
              Call Center & Chatbot
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50/60 to-white py-16 px-4 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-800">
            Layanan Psikologi Karyawan
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-teal-900 sm:text-5xl">
            MINDSPACE
          </h1>
          <p className="mt-2 text-xl font-medium text-teal-800 sm:text-2xl">
            Your Space to Feel Better at Work
          </p>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Ruang Aman untuk Kesejahteraan Psikologis Karyawan. Dapatkan pendampingan profesional dari psikolog berpengalaman sesuai kebutuhan Anda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              Mulai Konsultasi Sekarang
            </Link>
            <a
              href="#bidang"
              className="rounded-xl border border-teal-700 px-6 py-3 font-semibold text-teal-800 hover:bg-teal-50"
            >
              Lihat Bidang Psikologi
            </a>
            <Link
              href="/kontak"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Call Center / Chatbot
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 space-y-20">
        {/* 1. Bidang Layanan Psikologi */}
        <section id="bidang" className="scroll-mt-20">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Spesialisasi Konseling
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Bidang Psikologi yang Tersedia
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pilih bidang yang paling sesuai dengan tantangan emosional, karier, atau kesehatan mental yang sedang Anda hadapi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BIDANG_PSIKOLOGI.map((b) => (
              <div
                key={b.nomor}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-teal-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-800 text-sm">
                      {b.nomor}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {b.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{b.nama}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.penjelasan}</p>
                </div>
                <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-3.5">
                  <p className="text-xs font-semibold text-teal-900">Kapan Anda harus konsultasi?</p>
                  <p className="mt-1 text-xs leading-relaxed text-teal-800">{b.kapanKonsultasi}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Artikel Ilmiah */}
        <section id="artikel" className="scroll-mt-20">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Edukasi & Wawasan
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Artikel Edukatif Ilmiah
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Artikel referensi ilmiah untuk mendukung kesehatan mental dan produktivitas di tempat kerja.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ARTIKEL_ILMIAH.map((art) => (
              <article
                key={art.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-teal-700">{art.kategori}</span>
                    <span>{art.tanggal}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
                    {art.judul}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {art.ringkasan}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Sumber Ilmiah:</p>
                  <p className="mt-1 text-xs italic text-slate-600">{art.sumberIlmiah}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Peraturan Layanan */}
        <section id="peraturan" className="scroll-mt-20">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Ketentuan & Tata Tertib
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Peraturan Layanan MindSpace
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Panduan yang mengatur kenyamanan, kerahasiaan, dan kelancaran proses konseling antara konseli dan psikolog.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERATURAN.map((p, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{p.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.isi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Ajakan Konseling */}
        <section className="rounded-3xl bg-teal-800 p-8 text-white text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Siap Mencapai Kesejahteraan di Tempat Kerja?</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-100 text-sm sm:text-base">
            Jangan ragu untuk mencari bantuan. Konseling adalah langkah awal yang berani untuk merawat kesehatan mental Anda.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-teal-900 hover:bg-teal-50"
            >
              Daftar Sebagai Konseli
            </Link>
            <Link
              href="/kontak"
              className="rounded-xl border border-teal-300 px-6 py-3 font-semibold text-white hover:bg-teal-700"
            >
              Hubungi Call Center / Bot
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10 text-slate-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left">
          <div>
            <Brand />
            <p className="mt-1 text-sm text-slate-500">Your Space to Feel Better at Work</p>
            <p className="text-xs text-slate-400">Ruang Aman untuk Kesejahteraan Psikologis Karyawan</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#bidang" className="hover:text-teal-800">
              Bidang
            </a>
            <a href="#artikel" className="hover:text-teal-800">
              Artikel
            </a>
            <a href="#peraturan" className="hover:text-teal-800">
              Peraturan
            </a>
            <Link href="/kontak" className="hover:text-teal-800">
              Kontak
            </Link>
            <Link href="/login" className="hover:text-teal-800">
              Masuk
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-slate-100 px-4 pt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MindSpace. Seluruh hak cipta dilindungi.
        </div>
      </footer>
    </div>
  )
}
