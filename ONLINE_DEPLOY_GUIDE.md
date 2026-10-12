# 🌐 PANDUAN LENGKAP DEPLOY ONLINE - AI Essay Grader

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Deploy ke GitHub Pages (GRATIS)](#1-deploy-ke-github-pages-gratis)
3. [Deploy ke Netlify (GRATIS - Lebih Mudah)](#2-deploy-ke-netlify-gratis---lebih-mudah)
4. [Deploy ke Vercel (GRATIS)](#3-deploy-ke-vercel-gratis)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Persiapan Awal

### Yang Anda Butuhkan:
- ✅ Akun GitHub (daftar di https://github.com)
- ✅ Git terinstall di komputer
- ✅ Node.js 18+ terinstall
- ✅ Text editor (VS Code recommended)

### Cek Instalasi:
```bash
# Cek Git
git --version

# Cek Node.js
node --version

# Cek npm
npm --version
```

---

## 1. Deploy ke GitHub Pages (GRATIS)

### Langkah 1: Buat Repository GitHub

1. Buka https://github.com/new
2. Isi form:
   - **Repository name:** `ai-essay-grader` (atau nama pilihan Anda)
   - **Description:** Sistem Ujian Online AI Essay Grader
   - **Public** ✓ (WAJIB PUBLIC untuk GitHub Pages gratis)
   - ❌ Jangan centang "Add a README" (sudah ada)
3. Klik **Create repository**

### Langkah 2: Konfigurasi Base Path

**PENTING!** Edit file `vite.config.js`:

```javascript
// Buka file vite.config.js
// Ubah baris base sesuai nama repository Anda

export default defineConfig({
  // GANTI 'ai-essay-grader' dengan nama repository Anda
  // Contoh: base: '/ai-essay-grader/',
  base: '/ai-essay-grader/', // ← GANTI INI
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

**Contoh:**
- Nama repo: `ai-essay-grader` → `base: '/ai-essay-grader/'`
- Nama repo: `ujian-online` → `base: '/ujian-online/'`
- Nama repo: `my-app` → `base: '/my-app/'`

### Langkah 3: Test Build Lokal

```bash
# Build untuk production
npm run build

# Cek folder dist sudah terbentuk
ls dist
```

Jika berhasil, akan muncul folder `dist/` dengan file HTML, CSS, dan JS.

### Langkah 4: Push ke GitHub

Buka terminal/command prompt di folder project:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit: AI Essay Grader"

# Tambahkan remote (GANTI USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**GANTI:**
- `USERNAME` → username GitHub Anda
- `REPO_NAME` → nama repository Anda

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/ai-essay-grader.git
```

### Langkah 5: Enable GitHub Pages

1. Buka repository Anda di GitHub
2. Klik tab **Settings** (⚙️ icon)
3. Di sidebar kiri, klik **Pages**
4. Pada bagian **Build and deployment**:
   - **Source:** Pilih **GitHub Actions**
5. Workflow akan otomatis berjalan

### Langkah 6: Monitor Deployment

1. Klik tab **Actions** di repository
2. Anda akan melihat workflow "Deploy to GitHub Pages" sedang berjalan
3. Tunggu sampai selesai (2-3 menit)
4. Jika berhasil, akan muncul centang hijau ✓

### Langkah 7: Akses Aplikasi

Setelah deploy selesai, aplikasi akan tersedia di:

```
https://USERNAME.github.io/REPO_NAME/
```

**Contoh:**
- Username: `johndoe`
- Repo: `ai-essay-grader`
- URL: `https://johndoe.github.io/ai-essay-grader/`

### ✅ Selesai! Aplikasi Anda Sekarang Online!

---

## 2. Deploy ke Netlify (GRATIS - Lebih Mudah)

### Cara 1: Drag & Drop (Paling Mudah)

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Buka Netlify:**
   - Buka https://app.netlify.com/drop
   - Login dengan GitHub/Email

3. **Drag & Drop:**
   - Tarik folder `dist/` ke halaman Netlify
   - Tunggu upload selesai (1-2 menit)
   - Selesai! Anda akan mendapat URL seperti: `https://random-name-123.netlify.app`

### Cara 2: Connect GitHub (Recommended)

1. **Buat repository GitHub** (lihat langkah di atas)

2. **Buka Netlify:**
   - https://app.netlify.com
   - Login dengan GitHub

3. **Add new site:**
   - Klik **Add new site** → **Import an existing project**
   - Pilih **GitHub**
   - Pilih repository Anda

4. **Configure:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Klik **Deploy site**

5. **Tunggu 2-3 menit**, aplikasi akan live!

6. **Custom domain (opsional):**
   - Site settings → Domain management
   - Bisa pakai domain sendiri atau subdomain Netlify gratis

---

## 3. Deploy ke Vercel (GRATIS)

### Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Langkah 2: Deploy

```bash
# Login ke Vercel
vercel login

# Deploy
vercel

# Ikuti instruksi di terminal
# Tekan Enter untuk default settings
```

### Langkah 3: Production Deploy

```bash
# Deploy ke production
vercel --prod
```

Aplikasi akan live di URL seperti: `https://your-project.vercel.app`

---

## 🔄 Cara Update Aplikasi

Setelah aplikasi online, untuk update:

```bash
# Edit file yang diperlukan
# ...

# Commit perubahan
git add .
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub
git push origin main
```

**GitHub Pages & Netlify** akan otomatis rebuild dan deploy ulang!

---

## 🐛 Troubleshooting

### ❌ Error: "Page not found" setelah deploy

**Solusi:**
1. Tunggu 5-10 menit (GitHub Pages perlu waktu)
2. Refresh browser dengan `Ctrl + F5` (hard refresh)
3. Cek URL sudah benar: `https://USERNAME.github.io/REPO_NAME/`
4. Pastikan `base` di `vite.config.js` sudah sesuai

### ❌ Error: "Base path tidak sesuai"

**Solusi:**
```javascript
// Pastikan base path SAMA PERSIS dengan nama repository
// Nama repo: ai-essay-grader
base: '/ai-essay-grader/', // ✓ Benar
base: 'ai-essay-grader',   // ✗ Salah (kurang slash)
base: '/ai-essay-grader',  // ✗ Salah (kurang slash akhir)
```

### ❌ Error: "Workflow tidak berjalan"

**Solusi:**
1. Cek file `.github/workflows/deploy.yml` ada
2. Buka tab **Actions** untuk lihat error
3. Push ulang commit untuk trigger workflow:
   ```bash
   git commit --allow-empty -m "Trigger deploy"
   git push
   ```

### ❌ Error: "Build gagal di GitHub"

**Solusi:**
1. Test build lokal dulu:
   ```bash
   npm run build
   ```
2. Jika error di lokal, perbaiki dulu
3. Cek Node.js version di GitHub Actions (minimal 18)

### ❌ Error: "404 saat refresh halaman"

**Solusi:**
File `public/404.html` sudah disiapkan untuk handle SPA routing di GitHub Pages.

---

## 📊 Perbandingan Platform

| Platform | Kecepatan | Kemudahan | Custom Domain | Limit |
|----------|-----------|-----------|---------------|-------|
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐⭐ | ✅ Gratis | 1 GB storage |
| **Netlify** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Gratis | 100 GB bandwidth |
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Gratis | 100 GB bandwidth |

**Rekomendasi:**
- **Pemula:** Netlify (paling mudah, drag & drop)
- **Developer:** Vercel (performa terbaik)
- **Open Source:** GitHub Pages (integrasi GitHub)

---

## 🎓 Akun Demo

Setelah aplikasi online, gunakan akun ini untuk testing:

**Dosen:**
- Email: `ahmad.wijaya@university.ac.id`
- Password: `dosen123`

**Mahasiswa:**
- Email: `budi.santoso@student.university.ac.id`
- Password: `mhs123`

---

## 💡 Tips & Trik

### ✅ Best Practices

1. **Test lokal dulu** sebelum push
   ```bash
   npm run dev    # Test development
   npm run build  # Test production build
   ```

2. **Gunakan commit message yang jelas**
   ```bash
   git commit -m "Fix: timer countdown error"
   git commit -m "Add: fitur edit soal untuk dosen"
   ```

3. **Backup kode secara berkala**
   - Push ke GitHub setiap selesai fitur
   - Buat branch untuk fitur baru

4. **Cek URL di browser incognito**
   - Menghindari cache
   - Memastikan deploy berhasil

### 🚀 Optimasi

1. **Enable HTTPS** (otomatis di GitHub Pages/Netlify/Vercel)
2. **Custom domain** untuk branding profesional
3. **Analytics** dengan Google Analytics (opsional)

---

## 📞 Bantuan Lebih Lanjut

### Dokumentasi Resmi
- GitHub Pages: https://docs.github.com/en/pages
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs

### Komunitas
- Stack Overflow: https://stackoverflow.com/questions/tagged/github-pages
- GitHub Community: https://github.community

### Buat Issue
Jika ada masalah, buat issue di repository GitHub Anda.

---

## 🎉 Selamat!

Aplikasi AI Essay Grader Anda sekarang **LIVE** dan bisa diakses publik dari mana saja!

**URL Anda:** `https://USERNAME.github.io/REPO_NAME/`

Bagikan link ini kepada mahasiswa dan dosen untuk mulai menggunakan sistem ujian online! 🚀

---

**Dibuat dengan ❤️ untuk dunia pendidikan Indonesia**
