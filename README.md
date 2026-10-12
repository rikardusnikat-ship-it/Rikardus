# 🎓 AI Essay Grader

Sistem ujian online berbasis AI dengan fitur anti copy-paste untuk penilaian esai mahasiswa.

## 🚀 Quick Start - Deploy ke GitHub Pages

### 1. Persiapan Repository

Buat repository baru di GitHub dengan nama yang Anda inginkan (contoh: `ai-essay-grader`).

### 2. Update Konfigurasi

**PENTING:** Edit file `vite.config.js` dan tambahkan baris `base` sesuai nama repository Anda:

```javascript
export default defineConfig({
  base: '/nama-repository-anda/', // ← GANTI INI
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
```

### 3. Push ke GitHub

```bash
# Inisialisasi git
git init
git add .
git commit -m "Initial commit"

# Tambahkan remote (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages

1. Buka repository di GitHub
2. **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Tunggu 2-3 menit untuk deploy

### 5. Akses Aplikasi

```
https://USERNAME.github.io/REPO_NAME/
```

## 👤 Akun Demo

**Dosen:**
- Email: `ahmad.wijaya@university.ac.id`
- Password: `dosen123`

**Mahasiswa:**
- Email: `budi.santoso@student.university.ac.id`
- Password: `mhs123`

## 💻 Development Lokal

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## ✨ Fitur

### Mahasiswa
- ✅ Timer countdown 90 menit
- ✅ Anti copy-paste protection
- ✅ Progress tracking
- ✅ Lihat hasil penilaian

### Dosen
- ✅ CRUD soal ujian
- ✅ Monitoring submission
- ✅ Analisis integritas
- ✅ Rekap nilai

## 📚 Dokumentasi Lengkap

Lihat [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) untuk panduan lengkap.

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- GitHub Actions

## 📄 License

MIT
