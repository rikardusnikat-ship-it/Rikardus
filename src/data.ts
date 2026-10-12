import { Assignment } from './types';

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Analisis Dampak Kecerdasan Buatan terhadap Dunia Pendidikan',
    description: 'Tuliskan esai sepanjang 300-500 kata yang menganalisis bagaimana kecerdasan buatan (AI) mengubah paradigma pendidikan modern. Sertakan contoh konkret, analisis kritis, dan pandangan Anda terhadap tantangan serta peluang yang muncul.',
    subject: 'Teknologi Informasi',
    maxScore: 100,
    dueDate: '2026-02-15',
    rubric: [
      { criteria: 'Kedalaman Analisis', maxScore: 30, weight: 0.3 },
      { criteria: 'Struktur & Koherensi', maxScore: 25, weight: 0.25 },
      { criteria: 'Penggunaan Contoh & Bukti', maxScore: 20, weight: 0.2 },
      { criteria: 'Orisinalitas & Kreativitas', maxScore: 15, weight: 0.15 },
      { criteria: 'Tata Bahasa & Ejaan', maxScore: 10, weight: 0.1 },
    ],
  },
  {
    id: '2',
    title: 'Etika dalam Pengembangan Teknologi Digital',
    description: 'Tuliskan esai sepanjang 400-600 kata tentang tanggung jawab etis para pengembang teknologi digital. Bahas isu privasi data, bias algoritma, dan dampak sosial dari teknologi yang dikembangkan.',
    subject: 'Etika Teknologi',
    maxScore: 100,
    dueDate: '2026-02-20',
    rubric: [
      { criteria: 'Pemahaman Konsep Etika', maxScore: 30, weight: 0.3 },
      { criteria: 'Argumentasi & Logika', maxScore: 25, weight: 0.25 },
      { criteria: 'Relevansi Contoh Kasus', maxScore: 20, weight: 0.2 },
      { criteria: 'Solusi & Rekomendasi', maxScore: 15, weight: 0.15 },
      { criteria: 'Kualitas Penulisan', maxScore: 10, weight: 0.1 },
    ],
  },
  {
    id: '3',
    title: 'Transformasi Digital dalam Bisnis UMKM',
    description: 'Tuliskan esai sepanjang 300-500 kata yang membahas bagaimana transformasi digital dapat membantu UMKM bertahan dan berkembang di era modern. Analisis hambatan dan strategi yang efektif.',
    subject: 'Manajemen Bisnis',
    maxScore: 100,
    dueDate: '2026-02-25',
    rubric: [
      { criteria: 'Analisis Situasi UMKM', maxScore: 25, weight: 0.25 },
      { criteria: 'Strategi Transformasi Digital', maxScore: 30, weight: 0.3 },
      { criteria: 'Data & Fakta Pendukung', maxScore: 20, weight: 0.2 },
      { criteria: 'Kreativitas Solusi', maxScore: 15, weight: 0.15 },
      { criteria: 'Penulisan Akademik', maxScore: 10, weight: 0.1 },
    ],
  },
];
