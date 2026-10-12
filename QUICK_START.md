# 🚀 CARA CEPAT DEPLOY ONLINE - AI Essay Grader

## 📝 Langkah Singkat (5 Menit Selesai!)

### 1️⃣ Buat Akun GitHub
- Buka: https://github.com/signup
- Daftar gratis (bisa pakai email atau Google)

### 2️⃣ Buat Repository Baru
- Klik tombol **+** → **New repository**
- Nama: `ai-essay-grader` (atau nama lain)
- Pilih: **Public** ✓
- Klik: **Create repository**

### 3️⃣ Edit Konfigurasi
Buka file `vite.config.js` dan ubah baris ke-5:

```javascript
base: '/ai-essay-grader/', // ← Ganti dengan nama repository Anda
```

**PENTING:** Nama di `base` harus SAMA PERSIS dengan nama repository!

### 4️⃣ Upload Code ke GitHub

**Cara Mudah (via GitHub Web):**
1. Buka repository Anda di GitHub
2. Klik **Add file** → **Upload files**
3. Drag & drop semua file project (kecuali `node_modules`)
4. Klik **Commit changes**

**Cara Terminal (Recommended):**
```bash
# Di folder project Anda
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 5️⃣ Aktifkan GitHub Pages
1. Buka repository → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Tunggu 2-3 menit

### 6️⃣ Akses Aplikasi!
```
https://USERNAME.github.io/REPO_NAME/
```

**Selesai! Aplikasi Anda sekarang ONLINE dan bisa diakses publik!** 🎉

---

## 👤 Akun Demo untuk Testing

**Dosen:**
- Email: `ahmad.wijaya@university.ac.id`
- Password: `dosen123`

**Mahasiswa:**
- Email: `budi.santoso@student.university.ac.id`
- Password: `mhs123`

---

## 🆘 Jika Ada Masalah

### Error: "Page not found"
- Tunggu 5-10 menit (GitHub perlu waktu)
- Refresh dengan `Ctrl + F5`
- Cek `base` di `vite.config.js` sudah benar

### Error: "Build failed"
- Cek tab **Actions** di GitHub untuk lihat error
- Pastikan semua file ter-upload
- Test build lokal: `npm run build`

### Butuh Bantuan?
- Baca panduan lengkap: `ONLINE_DEPLOY_GUIDE.md`
- Atau buat issue di repository GitHub Anda

---

## 🌐 Alternatif: Deploy ke Netlify (Lebih Mudah!)

Jika GitHub Pages bermasalah, coba Netlify:

1. Build project: `npm run build`
2. Buka: https://app.netlify.com/drop
3. Drag folder `dist/` ke halaman Netlify
4. Selesai! Dapat URL instan

**Netlify lebih mudah dan cepat untuk pemula!**

---

## 📱 Akses dari HP

Aplikasi **responsive** dan bisa diakses dari:
- 💻 Laptop/PC
- 📱 Smartphone
- 📟 Tablet

Bagikan URL kepada mahasiswa untuk mulai mengerjakan ujian!

---

## ✅ Checklist Sebelum Deploy

- [ ] Akun GitHub sudah dibuat
- [ ] Repository sudah dibuat (Public)
- [ ] File `vite.config.js` sudah diedit (base path)
- [ ] Semua file sudah di-upload ke GitHub
- [ ] GitHub Pages sudah diaktifkan
- [ ] URL sudah bisa diakses

---

## 🎯 Contoh URL Hasil Deploy

Jika username GitHub Anda `johndoe` dan repository `ai-essay-grader`:

```
https://johndoe.github.io/ai-essay-grader/
```

URL ini bisa diakses oleh **siapa saja** dari **mana saja** di dunia! 🌍

---

**Selamat! Aplikasi ujian online Anda sekarang LIVE!** 🚀
