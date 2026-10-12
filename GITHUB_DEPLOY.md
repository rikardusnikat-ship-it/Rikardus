# 🚀 Panduan Deploy ke GitHub Pages

## Langkah-langkah Lengkap

### 1️⃣ Buat Repository di GitHub

1. Buka https://github.com/new
2. Isi form:
   - **Repository name:** `ai-essay-grader` (atau nama lain)
   - **Description:** Sistem Ujian Online AI Essay Grader
   - **Public** ✓
   - **Add a README:** ✓ (sudah ada)
3. Klik **Create repository**

### 2️⃣ Konfigurasi Base Path

**PENTING:** Edit file `vite.config.js` di baris ke-5:

```javascript
base: '/ai-essay-grader/', // ← Ganti dengan nama repository Anda
```

**Contoh:**
- Jika nama repo: `ai-essay-grader` → `base: '/ai-essay-grader/'`
- Jika nama repo: `ujian-online` → `base: '/ujian-online/'`

### 3️⃣ Push Code ke GitHub

Buka terminal/command prompt di folder project, lalu jalankan:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: AI Essay Grader"

# Tambahkan remote repository (GANTI USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Ganti:**
- `USERNAME` dengan username GitHub Anda
- `REPO_NAME` dengan nama repository Anda

### 4️⃣ Enable GitHub Pages

1. Buka repository Anda di GitHub
2. Klik tab **Settings** (⚙️)
3. Di sidebar kiri, klik **Pages**
4. Pada bagian **Source**:
   - Pilih **GitHub Actions** (bukan Deploy from a branch)
5. Workflow akan otomatis berjalan

### 5️⃣ Monitor Deployment

1. Di repository, klik tab **Actions**
2. Anda akan melihat workflow "Deploy to GitHub Pages" sedang berjalan
3. Tunggu sampai selesai (biasanya 2-3 menit)
4. Jika berhasil, akan muncul centang hijau ✓

### 6️⃣ Akses Aplikasi

Setelah deploy selesai, aplikasi akan tersedia di:

```
https://USERNAME.github.io/REPO_NAME/
```

**Contoh:**
- Username: `johndoe`
- Repo: `ai-essay-grader`
- URL: `https://johndoe.github.io/ai-essay-grader/`

## 🔧 Troubleshooting

### Error: "Base path tidak sesuai"
**Solusi:** Pastikan `base` di `vite.config.js` sama persis dengan nama repository (dengan slash di awal dan akhir).

### Error: "Page not found" setelah deploy
**Solusi:** 
1. Tunggu 5-10 menit (GitHub Pages perlu waktu)
2. Refresh browser dengan Ctrl+F5
3. Cek URL sudah benar

### Workflow tidak berjalan
**Solusi:**
1. Pastikan file `.github/workflows/deploy.yml` ada
2. Cek tab Actions untuk melihat error
3. Push ulang commit untuk trigger workflow

### Build gagal
**Solusi:**
1. Jalankan `npm run build` di lokal untuk cek error
2. Pastikan semua dependencies terinstall
3. Cek Node.js version (minimal 18)

## 📝 Update Aplikasi

Untuk update aplikasi setelah deploy:

```bash
# Edit file yang diperlukan
# ...

# Commit perubahan
git add .
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub
git push origin main
```

GitHub Actions akan otomatis rebuild dan deploy ulang.

## 🗑️ Hapus Deployment

Untuk menghapus deployment dari GitHub Pages:

1. Buka **Settings** → **Pages**
2. Klik **Unpublish** atau ubah Source ke **None**

## 💡 Tips

- ✅ Selalu test build lokal (`npm run build`) sebelum push
- ✅ Gunakan commit message yang deskriptif
- ✅ Backup kode secara berkala
- ✅ Cek URL deployment di browser incognito untuk cache

## 📞 Bantuan

Jika mengalami masalah:
1. Cek tab **Actions** di GitHub untuk log error
2. Pastikan semua langkah di atas sudah diikuti
3. Buat issue di repository GitHub

---

**Selamat! Aplikasi Anda sekarang live di GitHub Pages 🎉**
