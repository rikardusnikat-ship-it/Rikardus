# 🎓 AI Essay Grader - Sistem Ujian Online

Sistem penilaian tugas esai berbasis AI dengan fitur anti copy-paste untuk dunia pendidikan.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)

## ✨ Fitur Utama

### 🎯 Untuk Mahasiswa
- ✅ Dashboard ujian dengan daftar soal
- ✅ Timer countdown 90 menit per soal
- ✅ Editor esai dengan proteksi anti copy-paste
- ✅ Deteksi aktivitas paste & shortcut keyboard
- ✅ Progress tracking & word counter
- ✅ Lihat hasil penilaian & feedback AI

### 👨‍🏫 Untuk Dosen
- ✅ Dashboard statistik lengkap
- ✅ CRUD soal ujian (Buat, Edit, Hapus)
- ✅ Monitoring submission mahasiswa
- ✅ Analisis integritas akademik
- ✅ Rekap nilai dalam bentuk tabel
- ✅ Detail penilaian per kriteria

### 🤖 Penilaian AI
- ✅ Analisis kedalaman esai
- ✅ Penilaian berdasarkan rubrik
- ✅ Feedback otomatis
- ✅ Skor integritas berdasarkan pola ketik
- ✅ Deteksi copy-paste

## 🚀 Deploy ke GitHub Pages

### Langkah 1: Persiapan Repository

1. **Buat repository baru di GitHub:**
   - Buka https://github.com/new
   - Beri nama repository (contoh: `ai-essay-grader`)
   - Pilih Public
   - Klik "Create repository"

2. **Update vite.config.js:**
   
   Buka file `vite.config.js` dan tambahkan `base` sesuai nama repository:
   
   ```javascript
   export default defineConfig({
     base: '/ai-essay-grader/', // Ganti dengan nama repository Anda
     plugins: [react(), tailwindcss()],
     // ... kode lainnya
   });
   ```

### Langkah 2: Push ke GitHub

Jalankan perintah berikut di terminal:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit: AI Essay Grader"

# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### Langkah 3: Enable GitHub Pages

1. Buka repository Anda di GitHub
2. Klik **Settings** → **Pages**
3. Pada "Source", pilih **GitHub Actions**
4. Workflow akan otomatis berjalan dan deploy aplikasi

### Langkah 4: Akses Aplikasi

Setelah deploy selesai (biasanya 2-3 menit), aplikasi akan tersedia di:
```
https://USERNAME.github.io/REPO_NAME/
```

## 🛠️ Development Lokal

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Instalasi

```bash
# Clone repository
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`

## 👤 Akun Demo

### Dosen
- **Email:** ahmad.wijaya@university.ac.id
- **Password:** dosen123

### Mahasiswa
- **Email:** budi.santoso@student.university.ac.id
- **Password:** mhs123

## 📋 Struktur Proyek

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── components/
│   │   ├── AntiPasteTextarea.tsx
│   │   ├── AuthPage.tsx
│   │   ├── EssaySubmission.tsx
│   │   ├── GradingResultView.tsx
│   │   ├── LecturerDashboard.tsx
│   │   ├── ResultsList.tsx
│   │   └── StudentDashboard.tsx
│   ├── App.tsx
│   ├── aiGrader.ts
│   ├── data.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Teknologi

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **GitHub Actions** - CI/CD

## 📝 Fitur Keamanan

### Anti Copy-Paste
- ❌ Block Ctrl+V / Cmd+V
- ❌ Block Ctrl+C / Cmd+C
- ❌ Block Ctrl+X / Cmd+X
- ❌ Block Ctrl+A / Cmd+A
- ❌ Block Right Click
- ❌ Block Drag & Drop
- ❌ Block Shift+Insert
- ✅ Deteksi input mencurigakan
- ✅ Monitoring waktu ketik

### Integritas Akademik
- 📊 Analisis pola pengetikan
- ⏱️ Tracking waktu pengerjaan
- 🚨 Deteksi paste attempts
- 📈 Skor integritas otomatis

## 🎨 Tampilan

Aplikasi menggunakan desain formal mirip platform ujian online:
- Timer countdown yang jelas
- Navigasi soal dengan status warna
- Layout responsif (mobile-friendly)
- Tabel rekap nilai untuk dosen
- Modal konfirmasi untuk aksi penting

## 📄 License

MIT License - Bebas digunakan untuk keperluan pendidikan

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di GitHub repository.

---

**Dibuat dengan ❤️ untuk dunia pendidikan Indonesia**
