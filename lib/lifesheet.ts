// Struktur lembar kehidupan. Nama field sama dengan nama kolom di tabel life_sheets.
// Bagian G (catatan konselor) sengaja tidak ada di sini: hanya diisi konselor.
export type LifeField = { name: string; label: string; required?: boolean }
export type LifeSection = { title: string; fields: LifeField[] }

export const LIFE_SECTIONS: LifeSection[] = [
  {
    title: 'B. Riwayat kehidupan',
    fields: [
      { name: 'childhood_parent_relation', label: 'Masa kanak-kanak (2-11 tahun): bagaimana hubungan dengan orang tua?', required: true },
      { name: 'childhood_experience', label: 'Apakah ada pengalaman menyenangkan/traumatis?' },
      { name: 'childhood_influential_figure', label: 'Siapa figur paling berpengaruh dalam masa kecil Anda?' },
      { name: 'teen_peer_relation', label: 'Masa remaja (12-17 tahun): bagaimana hubungan dengan teman sebaya?' },
      { name: 'teen_key_events', label: 'Apakah ada peristiwa penting di masa remaja?' },
      { name: 'adult_achievement_challenge', label: 'Masa dewasa awal (18-30 tahun): apa pencapaian atau tantangan terbesar saat ini?' },
      { name: 'adult_romance_marriage', label: 'Bagaimana hubungan percintaan atau pernikahan (jika ada)?' },
      { name: 'relationship_pattern', label: 'Pola relasi: bagaimana Anda menjalin hubungan dengan orang lain?' },
      { name: 'relationship_conflict', label: 'Apakah ada pola konflik atau kesulitan tertentu dalam relasi?' },
    ],
  },
  {
    title: 'C. Riwayat pendidikan dan pekerjaan',
    fields: [
      { name: 'education_history', label: 'Pendidikan dasar hingga tertinggi (nama sekolah, tahun)' },
      { name: 'work_history', label: 'Pengalaman kerja (pekerjaan, jabatan, tahun)' },
      { name: 'job_satisfaction', label: 'Kepuasan terhadap pekerjaan saat ini' },
    ],
  },
  {
    title: 'D. Riwayat kesehatan',
    fields: [
      { name: 'health_history', label: 'Apakah pernah mengalami gangguan fisik/psikologis serius?' },
      { name: 'previous_counseling', label: 'Pernah konseling/terapi sebelumnya? Jika ya, jelaskan.' },
      { name: 'medication', label: 'Konsumsi obat/psikofarmaka?' },
    ],
  },
  {
    title: 'E. Kehidupan sosial dan spiritualitas',
    fields: [
      { name: 'close_friends', label: 'Apakah Anda memiliki sahabat dekat?' },
      { name: 'social_activities', label: 'Aktivitas sosial atau komunitas yang diikuti?' },
      { name: 'spirituality_role', label: 'Peran agama/spiritualitas dalam hidup Anda?' },
    ],
  },
  {
    title: 'F. Kekuatan dan harapan',
    fields: [
      { name: 'personal_strengths', label: 'Apa kekuatan pribadi Anda menurut Anda sendiri?' },
      { name: 'counseling_goal', label: 'Apa yang ingin Anda capai melalui konseling ini?', required: true },
      { name: 'life_goals', label: 'Harapan atau tujuan hidup saat ini?' },
    ],
  },
]
