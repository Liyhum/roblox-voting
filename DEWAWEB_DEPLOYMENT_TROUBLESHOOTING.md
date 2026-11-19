# 🛠️ CATATAN KENDALA DEPLOYMENT & PANDUAN UPDATE DEWAWEB
Dokumen ini mencatat kendala teknis yang pernah terjadi saat deploy/update aplikasi **TREC KL** di hosting **Dewaweb (cPanel / CloudLinux / LiteSpeed)** beserta solusi pastinya agar developer & AI di masa depan dapat langsung menanganinya tanpa bingung.

---

## 📌 DAFTAR KENDALA & PENYEBABNYA

### 1. Git Pull Gagal: `fatal: unable to create thread: Resource temporarily unavailable`
* **Gejala:**
  Saat mengetik `git pull origin main` di Terminal cPanel, proses berhenti di `Receiving objects` lalu gagal dengan pesan:
  ```text
  fatal: unable to create thread: Resource temporarily unavailable
  fatal: fetch-pack: invalid index-pack output
  ```
* **Penyebab:**
  Server Dewaweb menggunakan OS **CloudLinux (LVE)** yang membatasi jumlah proses dan thread per akun cPanel (`nproc limit`). Secara default, Git mencoba membuat puluhan thread sekaligus mengikuti core CPU server fisik, sehingga langsung diblokir oleh kernel server.
* **Solusi Pasti:**
  Paksa Git untuk hanya menggunakan **1 thread**:
  ```bash
  git -c pack.threads=1 pull origin main
  ```
  *(Atau jalankan `git config --global pack.threads 1` sekali di terminal agar tersimpan permanen).*

---

### 2. Tampilan Web Pecah (CSS Hilang / Raw Unstyled HTML)
* **Gejala:**
  Setelah web diupdate, website terlihat berantakan seperti teks biru tanpa styling, tombol tidak berbentuk, dan gambar membesar.
* **Penyebab:**
  1. Next.js secara default meng-cache file HTML statis (SSG/ISR) di folder `.next/cache` dengan header `Cache-Control: s-maxage=31536000` (1 tahun).
  2. Ketika ada build baru, nama/hash file CSS berubah (misal dari `0m4lk93awlr0x.css` ke `252jgv7qbbpwu.css`), dan file CSS lama terhapus oleh git.
  3. Server LiteSpeed / browser memuat file HTML lama dari cache yang masih memanggil file CSS lama.
  4. Karena file CSS lama sudah tidak ada, server mengembalikan 404 atau WAF challenge HTML, yang otomatis ditolak oleh browser karena perlindungan `X-Content-Type-Options: nosniff`.
* **Solusi Pasti:**
  1. **Di Codebase:**
     - Pasang `export const dynamic = "force-dynamic";` dan `export const revalidate = 0;` di `src/app/layout.tsx` dan halaman utama agar Next.js **selalu server-rendered** dan tidak pernah mengunci HTML statis.
     - Pasang header anti-cache di `next.config.ts`: `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.
     - Mirror file CSS ke `public/_next/static/chunks/` dan pertahankan nama CSS lama sebagai fallback agar client berkas lama tidak pernah 404.
  2. **Di Server Dewaweb:**
     - Selalu bersihkan cache Next.js dengan perintah:
       ```bash
       rm -rf .next/cache
       ```

---

### 3. Kode Sudah Di-pull Tapi Web Masih Menampilkan Versi Lama
* **Gejala:**
  Di Git status sudah commit terbaru, tetapi ketika dibuka di browser web masih menampilkan tombol atau teks lama.
* **Penyebab:**
  1. **Proses Node.js lama masih tersimpan di RAM:** Node.js di server produksi tidak otomatis memuat ulang file JS baru di memori jika prosesnya belum dimatikan.
  2. **LiteSpeed Web Server Cache (LSCache):** LiteSpeed menyimpan respon HTTP di level web server sebelum mencapai Node.js.
* **Solusi Pasti:**
  1. Matikan paksa proses Node.js lama agar cPanel melahirkan proses baru dengan kode terkini:
     ```bash
     pkill -9 -f node
     mkdir -p tmp && touch tmp/restart.txt
     ```
  2. Masuk ke cPanel menu **Setup Node.js App** -> Klik ikon **Restart** (ikon panah melingkar) pada baris `trecblx.com`.
  3. Jika ada menu **LiteSpeed Web Cache Manager** di cPanel -> Klik **Flush All**.

---

## 🚀 SOP RESMI: CARA UPDATE WEBSITE DI DEWAWEB (CUKUP 1 BARIS)

Setiap kali Anda selesai melakukan perubahan di komputer lokal dan sudah push ke GitHub (`git push origin main`), buka **Terminal cPanel Dewaweb** dan jalankan perintah sakti 1 baris berikut:

```bash
cd ~/roblox-voting && git -c pack.threads=1 pull origin main && rm -rf .next/cache && pkill -9 -f node && mkdir -p tmp && touch tmp/restart.txt
```

### Penjelasan Perintah di Atas:
| Perintah | Fungsi |
| :--- | :--- |
| `cd ~/roblox-voting` | Masuk ke folder root aplikasi Node.js |
| `git -c pack.threads=1 pull origin main` | Menarik update Git dengan 1 thread (bebas error thread limit CloudLinux) |
| `rm -rf .next/cache` | Menghapus seluruh cache halaman lama Next.js |
| `pkill -9 -f node` | Mematikan proses Node.js lama yang masih menggantung di memori RAM |
| `mkdir -p tmp && touch tmp/restart.txt` | Mengirim sinyal restart resmi ke Phusion Passenger cPanel |

Setelah perintah selesai, cukup tekan **Restart** di menu cPanel **Setup Node.js App** dan refresh browser Anda (`Ctrl + F5`). Website dijamin 100% langsung terupdate dengan rapi tanpa error!
