# PANDUAN LENGKAP DEPLOY KE DEWAWEB & PANDUAN KEAMANAN (ANTI-DDOS, RETAS & MANIPULATIF)

Panduan ini dibuat khusus untuk memindahkan website **TREC KL Fashion Show Roblox Voting** dari Vercel ke **Dewaweb**.

---

## 🛡️ RINGKASAN FITUR KEAMANAN YANG SUDAH DITAMBAHKAN

Aplikasi kamu kini sudah dilengkapi dengan sistem pertahanan bertingkat:

1. **Anti-Manipulatif & Anti-Bot Voting**:
   - Pemilihan vote tidak lagi dilakukan langsung oleh browser ke Supabase.
   - Semua vote wajib melalui API server aman: `POST /api/vote`.
   - Server memverifikasi sesi login Roblox asli secara kriptografis (HMAC-SHA256 signature). Tidak ada yang bisa memalsukan cookie atau mengubah ID pemilih!
   - Kuota ketat 2 vote per akun Roblox dijaga langsung di level Database RPC dan Server.
2. **Anti-DDoS & Rate Limiting (Aplikasi)**:
   - Built-in In-Memory Sliding Window Rate Limiter:
     - Maksimal 10 vote / menit per IP.
     - Maksimal 5 upload outfit / 10 menit per IP.
     - Maksimal 15 percobaan login / menit per IP.
     - Jika melebihi batas, server otomatis memblokir dengan `HTTP 429 Too Many Requests`.
3. **Anti-Retas & Anti-XSS (Input & Content Security)**:
   - Sanitasi teks pada nama, caption, dan link TikTok.
   - Validasi ketat ukuran file (maksimal 5 MB) dan format MIME gambar (`image/png`, `image/jpeg`, `image/webp`).
   - Content Security Policy (CSP), HSTS, `X-Frame-Options: SAMEORIGIN`, `nosniff`, dan penyembunyian identitas Next.js (`poweredByHeader: false`).
4. **Standalone Production Build (`output: 'standalone'`)**:
   - Aplikasi dikemas secara mandiri dan sangat ringan, siap dijalankan dengan PM2 atau cPanel Node.js Selector di Dewaweb.

---

## ⚡ LANGKAH 1: UPDATE KEAMANAN DATABASE SUPABASE

Agar tidak ada orang/bot yang bisa menembak function database langsung menggunakan tool seperti Postman/curl:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih project kamu (`zlrtrydfvzlxodbbhslv`).
3. Masuk ke menu **SQL Editor** (ikon terminal di sidebar kiri).
4. Salin dan jalankan kode SQL berikut:

```sql
-- Cabut izin eksekusi publik dari user anonim agar vote hanya bisa dijalankan melalui backend server terverifikasi
revoke execute on function public.cast_verified_vote(uuid, bigint, text) from public;
revoke execute on function public.cast_verified_vote(uuid, bigint, text) from anon;
grant execute on function public.cast_verified_vote(uuid, bigint, text) to service_role;

revoke execute on function public.increment_vote(uuid) from public;
revoke execute on function public.increment_vote(uuid) from anon;
grant execute on function public.increment_vote(uuid) to service_role;

revoke execute on function public.decrement_vote(uuid) from public;
revoke execute on function public.decrement_vote(uuid) from anon;
grant execute on function public.decrement_vote(uuid) to service_role;
```

5. Klik **Run** (Ctrl + Enter).

---

## 🔑 LANGKAH 2: AMBIL SERVICE ROLE KEY SUPABASE

1. Di Supabase Dashboard, buka **Project Settings** (ikon gear di kiri bawah) -> **API**.
2. Cari bagian **Project API keys**.
3. Di sana ada `service_role` (Secret / Rahasia). Klik **Reveal** lalu **Copy**.
4. Masukkan kunci ini ke environment variable server Dewaweb sebagai:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=kunci_service_role_kamu
   ```

---

## 🌐 LANGKAH 3: UPDATE REDIRECT URI ROBLOX OAUTH

Karena sekarang website pindah ke domain Dewaweb (misal: `https://domainmu.com`):

1. Buka [Roblox Creator Dashboard - Credentials](https://create.roblox.com/dashboard/credentials).
2. Pilih aplikasi OAuth kamu (**Client ID: 1048790179280686213**).
3. Di bagian **Redirect URIs**, tambahkan URL baru kamu:
   ```text
   https://domainmu.com/api/auth/roblox/callback
   ```
   *(Ganti `domainmu.com` dengan nama domain yang kamu beli di Dewaweb)*.
4. Klik **Save Changes**.

---

## 🚀 LANGKAH 4: PILIH CARA DEPLOY KE DEWAWEB

Pilih salah satu metode berikut sesuai jenis paket yang kamu beli di Dewaweb:

### PILIHAN A: DEWAWEB CLOUD HOSTING (cPanel)

Jika kamu membeli paket Shared/Cloud Hosting Dewaweb dengan cPanel:

1. **Build Project di Komputer Lokal**:
   Jalankan perintah ini di terminal VSCode:
   ```bash
   npm run build
   ```
2. **Kemas File yang Perlu Diunggah**:
   Siapkan file-file berikut (kamu bisa zip):
   - Folder `.next`
   - Folder `public`
   - File `server.js`
   - File `package.json`
   - File `next.config.ts` (atau `next.config.js`)
   - File `.env.local` (atau buat file `.env` di cPanel)
   *(Folder `node_modules` tidak perlu di-upload karena akan di-install di cPanel).*
3. **Buka cPanel Dewaweb**:
   - Masuk ke **File Manager**, buat folder baru misal `roblox-voting` di dalam `/home/username/`.
   - Ekstrak/upload file-file di atas ke folder tersebut.
4. **Masuk ke Menu "Setup Node.js App" di cPanel**:
   - Klik **Create Application**.
   - **Node.js version**: Pilih versi **20.x** atau **22.x**.
   - **Application mode**: `Production`.
   - **Application root**: `roblox-voting` (folder tempat kamu menaruh file).
   - **Application URL**: Pilih domain atau subdomain kamu.
   - **Application startup file**: `server.js`.
5. **Tambahkan Environment Variables di cPanel**:
   Di bagian **Environment variables**, klik **Add Variable**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://zlrtrydfvzlxodbbhslv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `...`
   - `SUPABASE_SERVICE_ROLE_KEY` = `...` (Kunci rahasia dari Langkah 2)
   - `ROBLOX_CLIENT_ID` = `1048790179280686213`
   - `ROBLOX_CLIENT_SECRET` = `RBX-EYTJRsKHT06GsnJlsXYVbbxr-i-5vu3Ml0FdyJYTeZYvIHJq0ywHIatPREUOnu2h`
   - `SESSION_SECRET` = `trec-kl-super-secret-session-key-2026-production`
   - `NEXT_PUBLIC_APP_URL` = `https://domainmu.com`
   - `NEXT_PUBLIC_VOTING_END_DATE` = `2026-10-25T23:59:59+08:00`
   - `HOST_ADMIN_PIN` = `Femme_Host99_Tr3c$2026`
   - `NODE_ENV` = `production`
6. **Install Dependencies & Jalankan**:
   - Klik **Run NPM Install** di halaman Setup Node.js App.
   - Klik **Start Application** atau **Restart**.

---

### PILIHAN B: DEWAWEB CLOUD VPS (Ubuntu / Linux)

Jika kamu membeli paket Cloud VPS Dewaweb dengan akses root SSH:

1. **Hubungkan ke VPS via SSH**:
   ```bash
   ssh root@ip_vps_kamu
   ```
2. **Install Node.js & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git nginx
   sudo npm install -g pm2
   ```
3. **Upload / Clone Project ke VPS**:
   ```bash
   git clone <link-repo-kamu> /var/www/roblox-voting
   cd /var/www/roblox-voting
   ```
4. **Buat file `.env.local` di folder project**:
   ```bash
   nano .env.local
   # Tempelkan semua variabel env dari file .env.example
   ```
5. **Build & Jalankan dengan PM2**:
   ```bash
   npm install
   npm run build
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
6. **Konfigurasi Nginx Reverse Proxy**:
   Edit file konfigurasi Nginx:
   ```nginx
   server {
       listen 80;
       server_name domainmu.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Lalu restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🛡️ PERLINDUNGAN DDOS MAKSIMAL: GUNAKAN CLOUDFLARE (100% GRATIS)

Untuk melindungi server Dewaweb kamu dari serangan banjir trafik (DDoS Layer 3, 4, dan 7):

1. Daftar di [Cloudflare.com](https://dash.cloudflare.com/) (Gratis).
2. Tambahkan domain kamu (misal: `domainmu.com`).
3. Ganti Nameserver di dashboard Dewaweb domain kamu ke Nameserver yang diberikan oleh Cloudflare.
4. Di dashboard Cloudflare:
   - Pastikan status DNS **Proxied** (Awan berwarna oranye aktif).
   - Masuk ke menu **SSL/TLS** -> Pilih mode **Full** atau **Full (strict)**.
   - Masuk ke menu **Security** -> **Bots** -> Aktifkan **Bot Fight Mode**.
   - Jika suatu saat ada indikasi serangan DDoS, cukup aktifkan tombol **"Under Attack Mode"** di dashboard Cloudflare! Semua bot otomatis akan disaring oleh Cloudflare sebelum mencapai server Dewaweb kamu.
