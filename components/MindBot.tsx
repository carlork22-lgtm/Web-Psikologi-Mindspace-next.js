'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
}

const FAQ_KNOWLEDGE_BASE = [
  {
    keywords: ['buat janji', 'booking', 'jadwal', 'cara pesan', 'konsultasi', 'alur', 'tata cara'],
    answer:
      'Untuk membuat janji konseling di MindSpace:\n1. Masuk/Daftar akun sebagai Konseli (karyawan).\n2. Lengkapi data diri Anda di menu Dashboard.\n3. Masuk ke menu "Pilih Bidang" lalu tentukan salah satu dari 6 bidang psikologi.\n4. Pilih psikolog dan slot jam yang Anda inginkan (sesi berdurasi 60 menit).\n5. Lakukan pembayaran Virtual Account untuk mengonfirmasi sesi.',
  },
  {
    keywords: ['biaya', 'harga', 'tarif', 'bayar', 'pembayaran', 'virtual account', 'va', 'rekening'],
    answer:
      'Biaya konseling bervariasi sesuai tarif masing-masing psikolog (dapat dilihat pada profil psikolog). Pembayaran dilakukan melalui nomor Virtual Account (diawali digit 9xxx) dengan batas waktu 24 jam. Pada platform ini, terdapat tombol simulasi pembayaran untuk memudahkan pengujian sistem.',
  },
  {
    keywords: ['pio', 'klinis', 'perbedaan', 'beda pio', 'beda klinis', 'jenis psikolog'],
    answer:
      'Perbedaan utama:\n• Psikolog Klinis: Berfokus pada kesehatan mental individu (stres berat, kecemasan, depresi, trauma, kesulitan regulasi emosi).\n• Psikolog Industri & Organisasi (PIO): Berfokus pada dinamika kerja, motivasi karyawan, kepemimpinan, budaya organisasi, dan relasi antarkerja.\nKeduanya saling melengkapi untuk mendukung kesejahteraan karyawan.',
  },
  {
    keywords: ['6 bidang', 'bidang psikologi', 'spesialisasi', 'forensik', 'pendidikan', 'perkembangan', 'sosial'],
    answer:
      'MindSpace menyediakan 6 bidang psikologi:\n1. PIO (Dunia Kerja & Organisasi)\n2. Psikologi Klinis (Kesehatan Mental & Emosi)\n3. Psikologi Sosial (Relasi & Lingkungan Sekitar)\n4. Psikologi Forensik (Hukum & Kasus Pidana)\n5. Psikologi Pendidikan (Proses Belajar & Akademik)\n6. Psikologi Perkembangan (Fase Kehidupan Anak - Lansia).',
  },
  {
    keywords: ['izin sakit', 'surat sakit', 'surat dokter', 'surat izin', 'berhalangan', 'tidak masuk'],
    answer:
      'Jika Anda berhalangan hadir pada hari sesi karena kondisi sakit, Anda dapat mengajukan Surat Izin Sakit melalui halaman detail booking. Dokter/klinik mitra kami akan meninjau dan menerbitkan Surat Keterangan Sakit resmi lengkap dengan Nomor Surat, SIP, dan stempel digital yang dapat Anda cetak/unduh.',
  },
  {
    keywords: ['informed consent', 'persetujuan', 'rahasia', 'kerahasiaan', 'rekaman', 'lembar kehidupan', 'life sheet'],
    answer:
      'Di MindSpace, privasi Anda terjamin:\n• Informed Consent: Surat persetujuan 8 butir kode etik yang wajib disetujui konseli sebelum konseling dimulai.\n• Lembar Kehidupan Klien: Formulir riwayat hidup (masa kanak-kanak, remaja, dewasa awal, kesehatan) yang diisi 1 kali agar psikolog dapat mendiagnosa dengan tepat.',
  },
  {
    keywords: ['kontak', 'call center', 'whatsapp', 'wa', 'telepon', 'operator', 'hubungi'],
    answer:
      'Anda dapat menghubungi layanan bantuan kami melalui:\n• WhatsApp: Layanan chat resmi bantuan\n• Telepon Langsung: Hubungi nomor operator bantuan kami\nKunjungi menu "Call Center & Chatbot" di navbar atas untuk mengakses kontak langsung.',
  },
  {
    keywords: ['batal', 'cancel', 'pembatalan', 'ganti jadwal'],
    answer:
      'Pemesanan yang belum selesai dapat dibatalkan melalui tombol "Batalkan Pemesanan" di halaman detail sesi. Slot jadwal yang dibatalkan akan otomatis dilepas sehingga Anda dapat memilih slot jam lain yang tersedia.',
  },
]

const QUICK_QUESTIONS = [
  'Cara buat janji konseling?',
  'Beda Psikolog PIO vs Klinis?',
  'Bagaimana cara pembayaran?',
  'Tentang surat izin sakit?',
]

function getBotReply(userText: string): string {
  const normalized = userText.toLowerCase().trim()

  if (
    normalized === 'halo' ||
    normalized === 'hai' ||
    normalized === 'p' ||
    normalized === 'halo mindbot' ||
    normalized === 'assalamualaikum'
  ) {
    return 'Halo! Saya MindBot, asisten virtual MindSpace. Ada yang bisa saya bantu seputar layanan konseling, 6 bidang psikologi, booking jadwal, atau surat izin sakit di web ini? 😊'
  }

  if (normalized.includes('terima kasih') || normalized.includes('makasih') || normalized.includes('thanks')) {
    return 'Sama-sama! Semoga harimu menyenangkan dan jangan ragu bertanya lagi jika butuh bantuan di MindSpace ya! ✨'
  }

  // Cari jawaban di basis data FAQ
  for (const item of FAQ_KNOWLEDGE_BASE) {
    const isMatched = item.keywords.some((k) => normalized.includes(k))
    if (isMatched) {
      return item.answer
    }
  }

  // Fallback guard untuk pertanyaan di luar topik
  return (
    'Maaf, saya MindBot yang khusus dilatih untuk mendampingi layanan di MindSpace. Saya hanya dapat menjawab pertanyaan seputar:\n' +
    '• Pendaftaran & pengisian data diri\n' +
    '• 6 bidang psikologi & peran konselor\n' +
    '• Alur booking jadwal per jam & pembayaran Virtual Account\n' +
    '• Informed consent, lembar kehidupan & surat izin sakit\n\n' +
    'Silakan pilih pertanyaan di bawah atau hubungi Call Center di menu Kontak jika ada kendala khusus ya!'
  )
}

function timeNow() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function MindBot() {
  // status: 'minimized' (logo only) | 'open' (popup open) | 'closed' (completely hidden from screen)
  const [status, setStatus] = useState<'minimized' | 'open' | 'closed'>('minimized')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! 👋 Saya MindBot, asisten khusus layanan MindSpace. Ada yang bisa saya bantu seputar alur konseling karyawan, 6 bidang psikologi, atau pemesanan jadwal?',
      timestamp: timeNow(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // Inisialisasi status dari localStorage dan URL query
  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('mindspace_bot_dismissed') === 'true'
      const searchParams = new URLSearchParams(window.location.search)
      const forceBotOpen = searchParams.get('bot') === 'open' || searchParams.get('chatbot') === '1'

      if (forceBotOpen) {
        localStorage.setItem('mindspace_bot_dismissed', 'false')
        setStatus('open')
      } else if (isDismissed) {
        setStatus('closed')
      } else {
        setStatus('minimized')
      }
    } catch {
      setStatus('minimized')
    }

    // Listener custom event untuk memanggil bot kembali
    function handleOpenBot() {
      localStorage.setItem('mindspace_bot_dismissed', 'false')
      setStatus('open')
    }

    window.addEventListener('open-mindspace-bot', handleOpenBot)
    return () => window.removeEventListener('open-mindspace-bot', handleOpenBot)
  }, [])

  // Auto scroll saat pesan bertambah
  useEffect(() => {
    if (status === 'open') {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, status, isTyping])

  // Kirim pesan
  function handleSend(textToSend?: string) {
    const text = (textToSend ?? inputText).trim()
    if (!text) return

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: timeNow(),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputText('')
    setIsTyping(true)

    // Efek mengetik natural
    setTimeout(() => {
      const replyText = getBotReply(text)
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: replyText,
        timestamp: timeNow(),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 450)
  }

  // Tombol minimize (\/)
  function handleMinimize() {
    setStatus('minimized')
  }

  // Tombol X (hapus bot dari layar sampai dipanggil lagi)
  function handleDismiss() {
    localStorage.setItem('mindspace_bot_dismissed', 'true')
    setStatus('closed')
  }

  // Jika closed, sembunyikan seluruh elemen
  if (status === 'closed') {
    return null
  }

  return (
    <>
      {/* 1. Pop-up Jendela Chat (Saat status === 'open') */}
      {status === 'open' && (
        <aside
          aria-label="Jendela Chatbot MindBot"
          className="fixed bottom-5 right-5 z-50 flex h-[520px] max-h-[85vh] w-[350px] sm:w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-200"
        >
          {/* Header Pop-up */}
          <div className="flex items-center justify-between bg-teal-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-900 font-bold text-white shadow-xs">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">MindBot Assistant</h3>
                <p className="flex items-center gap-1.5 text-[11px] text-teal-200">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                  Khusus Layanan MindSpace
                </p>
              </div>
            </div>

            {/* Tombol Kontrol: Minimize (\/) & Tutup (X) */}
            <div className="flex items-center gap-1">
              {/* Tombol Minimize (\/) */}
              <button
                type="button"
                onClick={handleMinimize}
                title="Kecilkan layar chat ke logo"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-teal-100 hover:bg-teal-700 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Tombol Tutup Total (X) */}
              <button
                type="button"
                onClick={handleDismiss}
                title="Hapus dan sembunyikan chatbot dari layar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-teal-100 hover:bg-red-600 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Area Pesan Chat */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-xs">
                    🤖
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line leading-relaxed'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`mt-1 block text-[10px] text-right ${
                      m.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-xs">
                  🤖
                </span>
                <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                  MindBot sedang mengetik...
                </div>
              </div>
            )}

            {/* Quick Question Chips */}
            <div className="pt-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pilihan Pertanyaan Cepat:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="rounded-xl border border-teal-200 bg-white px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition shadow-2xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div ref={endRef} />
          </div>

          {/* Form Input Chat */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pertanyaan seputar MindSpace..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-800 disabled:opacity-40 transition"
            >
              Kirim
            </button>
          </form>
        </aside>
      )}

      {/* 2. Tombol Logo Chatbot Kecil di Pojok Kanan Bawah (Saat status === 'minimized') */}
      {status === 'minimized' && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatus('open')}
            title="Buka Chatbot MindBot"
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-teal-800 text-white shadow-xl hover:bg-teal-900 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white"
          >
            <span className="text-2xl transition group-hover:rotate-12">🤖</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}
    </>
  )
}
