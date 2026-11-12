import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Brand } from '@/components/ui'
import LogoutButton from '@/components/LogoutButton'

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

const ARTIKEL_MINDSPACE = [
  {
    nomor: '01',
    judul: 'Menjaga Motivasi di Tengah Tekanan Pekerjaan',
    kategori: 'Motivasi Kerja',
    kutipan: '“Tidak harus menyelesaikan semuanya hari ini. Satu langkah kecil tetap merupakan sebuah kemajuan.”',
    paragraf: [
      'Setiap pekerjaan memiliki tantangannya sendiri. Tugas yang menumpuk, tenggat waktu, dan tanggung jawab yang besar terkadang membuat semangat kerja menurun. Namun, bukan berarti kamu harus menyerah atau memaksakan diri untuk menyelesaikan semuanya sekaligus.',
      'Cobalah membagi pekerjaan menjadi bagian-bagian kecil, mengingat kembali tujuan yang ingin dicapai, dan memberikan waktu bagi diri sendiri untuk beristirahat. Hargai setiap kemajuan, sekecil apa pun itu.',
      'Ingat, produktivitas bukan tentang seberapa banyak pekerjaan yang diselesaikan dalam satu waktu, tetapi juga bagaimana kamu menjaga diri selama prosesnya.',
    ],
    sumber: 'Gusti Ayu Tita P. (21 Agustus 2025). Bagaimana Caranya Tetap Termotivasi Meski Pekerjaan Terasa Berat? Universitas STEKOM.',
    link: 'https://stekom.ac.id/artikel/bagaimana-caranya-tetap-termotivasi-meski-pekerjaan-terasa-berat',
  },
  {
    nomor: '02',
    judul: 'Lingkungan Kerja yang Sehat Dimulai dari Rasa Saling Menghargai',
    kategori: 'Lingkungan Kerja',
    kutipan: '“Kamu tidak hanya berhak mendapatkan pekerjaan yang layak, tetapi juga lingkungan yang membuatmu merasa nyaman dan dihargai.”',
    paragraf: [
      'Lingkungan kerja memiliki pengaruh terhadap suasana hati, kenyamanan, dan produktivitas karyawan. Komunikasi yang baik, hubungan antarrekan kerja yang suportif, serta pembagian tugas yang jelas merupakan beberapa hal yang mendukung terciptanya lingkungan kerja yang sehat.',
      'Sebaliknya, konflik berkepanjangan, komunikasi yang tidak nyaman, dan kurangnya dukungan dapat membuat karyawan merasa tertekan. Karena itu, menciptakan tempat kerja yang positif bukan hanya tanggung jawab individu, tetapi juga seluruh pihak dalam organisasi.',
    ],
    sumber: 'Serikat Pekerja Nasional (11 Maret 2021). Lingkungan Kerja yang Sehat.',
    link: 'https://spn.or.id/lingkungan-kerja-yang-sehat/',
  },
  {
    nomor: '03',
    judul: 'Mencari Konseling Bukanlah Tanda Kelemahan',
    kategori: 'Konseling Psikologis',
    kutipan: '“Meminta bantuan bukan berarti kamu tidak mampu. Terkadang, itu adalah bentuk keberanian untuk menjaga diri sendiri.”',
    paragraf: [
      'Dalam menghadapi tekanan pekerjaan, tidak semua permasalahan harus diselesaikan sendirian. Ada kalanya seseorang membutuhkan ruang untuk bercerita, memahami perasaannya, dan menemukan sudut pandang baru terhadap masalah yang sedang dihadapi.',
      'Konseling dapat menjadi salah satu langkah untuk mengenali kondisi emosional, mengelola stres, serta mengembangkan strategi menghadapi tantangan dengan lebih sehat.',
      'Jangan menunggu sampai merasa benar-benar kewalahan untuk mencari bantuan. Mengenali kebutuhan diri dan berani meminta dukungan merupakan bagian dari menjaga kesejahteraan psikologis.',
    ],
    sumber: 'UPT Pengembangan Karier (18 Juni). Jangan Takut Minta Bantuan: Mengapa Mencari Konseling Adalah Tanda Kekuatan, Bukan Kelemahan.',
    link: 'https://cdc.uinssc.ac.id/jangan-takut-minta-bantuan-mengapa-mencari-konseling-adalah-tanda-kekuatan-bukan-kelemahan-p2523',
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

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: { id: string; role: string; full_name: string } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', user.id)
      .maybeSingle()
    profile = data
  }

  const dashboardHref = profile?.role === 'konselor' ? '/konselor' : '/konseli'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar Terhubung */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#bidang" className="text-slate-600 hover:text-teal-800 transition">
              Bidang Layanan
            </a>
            <a href="#peran-psikolog" className="text-slate-600 hover:text-teal-800 transition">
              Peran Psikolog
            </a>
            <a href="#artikel" className="text-slate-600 hover:text-teal-800 transition">
              Artikel MINDSPACE
            </a>
            <a href="#peraturan" className="text-slate-600 hover:text-teal-800 transition">
              Peraturan
            </a>
            <Link href="/kontak" className="text-slate-600 hover:text-teal-800 transition">
              Call Center & Chatbot
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {profile ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[11px] font-bold text-teal-800 uppercase">
                    {profile.role === 'konselor' ? 'Psikolog' : 'Konseli'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                    {profile.full_name}
                  </span>
                </div>
                <Link
                  href={dashboardHref}
                  className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition"
                >
                  Dashboard Saya
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50 transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-800 transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50/70 via-white to-white py-16 px-4 text-center sm:py-24">
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
            {profile ? (
              <Link
                href={dashboardHref}
                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-xs hover:bg-teal-800 transition"
              >
                Buka Dashboard Anda ({profile.role === 'konselor' ? 'Konselor' : 'Konseli'})
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-xs hover:bg-teal-800 transition"
              >
                Mulai Konsultasi Sekarang
              </Link>
            )}
            <a
              href="#bidang"
              className="rounded-xl border border-teal-700 bg-white px-6 py-3 font-semibold text-teal-800 hover:bg-teal-50 transition"
            >
              Lihat 6 Bidang Psikologi
            </a>
            <Link
              href="/kontak"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Call Center / Chatbot
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 space-y-24">
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
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-teal-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-800 text-sm">
                      {b.nomor}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
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

          {profile?.role === 'konseli' && (
            <div className="mt-6 text-center sm:text-left">
              <Link
                href="/konseli/bidang"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 transition"
              >
                <span>Pilih Psikolog & Buat Janji Sekarang</span>
                <span>&rarr;</span>
              </Link>
            </div>
          )}
        </section>

        {/* 2. Mengenal Psikolog yang Berperan dalam Kesejahteraan Karyawan */}
        <section id="peran-psikolog" className="scroll-mt-20 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/60 via-white to-slate-50 p-6 sm:p-10 shadow-xs">
          <div className="mb-8">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
              Edukasi Peran Profesional
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Mengenal Psikolog yang Berperan dalam Kesejahteraan Karyawan
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
              Dalam mendukung kesehatan mental dan produktivitas tenaga kerja, terdapat dua peran psikolog utama yang saling melengkapi dengan pendekatan dan ruang lingkup yang berbeda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Psikolog Klinis */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 font-bold text-white text-lg">
                    1
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Psikolog Klinis</h3>
                    <span className="text-xs font-semibold text-teal-700">Fokus: Kondisi Psikologis Individu</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Psikolog klinis berfokus pada <strong>kesehatan mental dan kondisi psikologis individu</strong>. Mereka dapat membantu seseorang menghadapi permasalahan seperti stres, kecemasan, depresi, trauma, hingga kesulitan mengelola emosi.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                <p className="text-xs font-bold text-teal-900">Kapan membutuhkan psikolog klinis?</p>
                <p className="mt-1 text-xs sm:text-sm text-teal-800 leading-relaxed">
                  Ketika tekanan pekerjaan mulai memengaruhi kondisi emosional, aktivitas sehari-hari, kualitas tidur, atau kesehatan mental.
                </p>
              </div>
            </div>

            {/* Card 2: Psikolog PIO */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 font-bold text-white text-lg">
                    2
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Psikolog Industri dan Organisasi (PIO)</h3>
                    <span className="text-xs font-semibold text-teal-700">Fokus: Perilaku Manusia di Lingkungan Kerja</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Psikolog industri dan organisasi berfokus pada <strong>perilaku manusia dalam lingkungan kerja</strong>. Bidang ini berkaitan dengan motivasi karyawan, kepuasan kerja, budaya organisasi, kepemimpinan, komunikasi antarkaryawan, serta kesejahteraan di tempat kerja.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                <p className="text-xs font-bold text-teal-900">Kapan membutuhkan psikolog PIO?</p>
                <p className="mt-1 text-xs sm:text-sm text-teal-800 leading-relaxed">
                  Ketika perusahaan ingin menciptakan lingkungan kerja yang lebih sehat, meningkatkan kenyamanan karyawan, atau memahami permasalahan yang terjadi dalam organisasi.
                </p>
              </div>
            </div>
          </div>

          {/* Perbedaan Keduanya */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h4 className="text-base font-bold text-slate-900">Apa perbedaan keduanya?</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              <strong>Psikolog klinis</strong> lebih berfokus pada kondisi psikologis individu, sedangkan <strong>psikolog industri dan organisasi</strong> lebih berfokus pada hubungan antara individu, pekerjaan, dan lingkungan organisasi.
            </p>
            <p className="mt-2 text-sm font-medium text-teal-900">
              ✨ Keduanya dapat berperan dalam mendukung kesejahteraan psikologis karyawan, dengan pendekatan dan ruang lingkup yang berbeda.
            </p>
          </div>
        </section>

        {/* 3. Artikel MINDSPACE */}
        <section id="artikel" className="scroll-mt-20">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Artikel MINDSPACE
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Wawasan & Inspirasi Kesejahteraan Kerja
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Baca artikel pilihan untuk membantu Anda mengelola stres, menjaga motivasi kerja, dan membangun hubungan kerja yang sehat.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {ARTIKEL_MINDSPACE.map((art) => (
              <article
                key={art.nomor}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs transition hover:shadow-md hover:border-teal-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-teal-200">{art.nomor}</span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-100">
                      {art.kategori}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900">
                    {art.judul}
                  </h3>

                  {/* Kutipan Utama */}
                  <blockquote className="mt-3 rounded-xl bg-slate-50 border-l-4 border-teal-600 p-3 text-xs italic font-medium text-slate-700 leading-relaxed">
                    {art.kutipan}
                  </blockquote>

                  {/* Isi Paragraf Artikel */}
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                    {art.paragraf.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Sumber Ilmiah & Link */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sumber Referensi:
                  </p>
                  <p className="mt-1 text-xs italic text-slate-600 leading-relaxed">
                    {art.sumber}
                  </p>
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>Buka tautan artikel asli</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Peraturan Layanan */}
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
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <h3 className="font-bold text-slate-900">{p.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.isi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Ajakan Konseling */}
        <section className="rounded-3xl bg-teal-800 p-8 text-white text-center sm:p-12 shadow-md">
          <h2 className="text-2xl font-bold sm:text-3xl">Siap Mencapai Kesejahteraan di Tempat Kerja?</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-100 text-sm sm:text-base">
            Jangan ragu untuk mencari bantuan. Konseling adalah langkah awal yang berani untuk merawat kesehatan mental Anda.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {profile ? (
              <Link
                href={dashboardHref}
                className="rounded-xl bg-white px-6 py-3 font-semibold text-teal-900 hover:bg-teal-50 transition"
              >
                Masuk ke Dashboard Saya
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-teal-900 hover:bg-teal-50 transition"
              >
                Daftar Sebagai Konseli
              </Link>
            )}
            <Link
              href="/kontak"
              className="rounded-xl border border-teal-300 px-6 py-3 font-semibold text-white hover:bg-teal-700 transition"
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
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a href="#bidang" className="hover:text-teal-800 transition">
              Bidang
            </a>
            <a href="#peran-psikolog" className="hover:text-teal-800 transition">
              Peran Psikolog
            </a>
            <a href="#artikel" className="hover:text-teal-800 transition">
              Artikel
            </a>
            <a href="#peraturan" className="hover:text-teal-800 transition">
              Peraturan
            </a>
            <Link href="/kontak" className="hover:text-teal-800 transition">
              Kontak
            </Link>
            {profile ? (
              <Link href={dashboardHref} className="text-teal-700 font-semibold hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hover:text-teal-800 transition">
                Masuk
              </Link>
            )}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-slate-100 px-4 pt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MindSpace. Seluruh hak cipta dilindungi.
        </div>
      </footer>
    </div>
  )
}
