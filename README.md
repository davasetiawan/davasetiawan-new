# Dava Setiawan — Portfolio

Portfolio personal saya yang dibangun dari nol menggunakan **Next.js 15**, **React 19**, **Tailwind CSS 4**, **Framer Motion**, **Lucide Icons**, dan font **Clash Display + Satoshi** (via Fontshare).

Desain terinspirasi estetika *dark-mode* minimalis dengan aksen neon hijau (#b5ff6d), *scanline* CRT halus, dan animasi masuk halus. Saya ingin tampilan yang bersih, cepat, dan terasa "hidup" saat dikunjungi.

---

## Fitur Utama

| Fitur | Detail |
|-------|--------|
| **Hero Interaktif** | Pulsing dot + headline besar dengan kata ber-highlight, social row, tombol *Scroll Down* |
| **Tech Stack Marquee** | Strip logo bergerak (React, TS, Node.js, Tailwind, PostgreSQL, MongoDB, Docker, Python, Figma, Git, Firebase) — logo warna via devicon CDN, *pause on hover*, *fade edge* |
| **About dengan Kartu 3D** | Kartu profil *tilt 3D* mengikuti kursor, *shine & glare*, *glow* berdenyut di belakang, overlay info (`@handle`, status *Online*, tombol *Contact Me*) |
| **Featured Projects** | Grid kartu *hover-glow*, thumbnail, tags chip, link Demo & GitHub, tombol *View All Projects* |
| **Experience Timeline** | Garis vertikal + node *WORK/EDUCATION*, periode, peran, organisasi, deskripsi |
| **Certificates** | Baris bernomor + thumbnail klik → *lightbox* pratinjau + tombol *Verify* |
| **Contact & CTA** | Form kontak (tersimpan ke localStorage), info langsung + sosial media, kartu CTA raksasa *"Let's work together."*, footer copyright + ikon sosial |
| **Dark / Light Mode** | Toggle di navbar + shortcut `[t]`, preferensi tersimpan `localStorage` |
| **Efek Kursor** | Spotlight garis diagonal menyala mengikuti kursor di hero + cincin & titik kursor kustom yang membesar di atas elemen interaktif (desktop only) |

---

## CMS Admin Tersembunyi

Semua konten bisa diubah tanpa menyentuh kode.

**Cara buka:**
- Tekan **Ctrl + Shift + A**
- Atau ketik `sudo` di keyboard (di luar input form)
- Lihat hint di console browser (F12)

**Password default:** `admin123` — ganti di tab *Settings* setelah login.

**Tab Admin:**
1. **Bio & Hero** — nama, greeting, handle, **foto profil (upload/URL)**, headline hero, sub-headline, headline About, bio, availability, lokasi, email, URL CV, sosial media
2. **Skills & Marquee** — skills chip, **Tech Stack marquee** (`Nama | URL-logo` per baris), kata-kata marquee layanan
3. **Projects** — CRUD proyek: judul, tahun, deskripsi, tags, **thumbnail (upload/URL)**, demo, GitHub
4. **Experience** — CRUD timeline: posisi, institusi, periode, tipe *dropdown* (Work/Education), deskripsi
5. **Certificates** — CRUD sertifikat: nama, penerbit, tanggal, **gambar (upload/URL)** + lightbox, link verifikasi
6. **Inbox** — pesan masuk dari form kontak (bisa hapus per item / hapus semua)
7. **Settings** — banner pengumuman atas, ganti password, **Export/Import JSON**, Reset default

Data tersimpan di `localStorage` (key `dava-portfolio:v2`).

---

## Menjalankan Lokal

```bash
npm install
npm run dev     # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm run start
```

---

## Struktur Proyek

```
app/
  layout.js          # Root HTML, font Fontshare, script anti-flash tema
  globals.css        # Tema dark/light, aksen #b5ff6d, shine, marquee, kartu 3D, garis diagonal, grain
  page.js            # Entry → render <Portfolio/>
components/
  Portfolio.js       # Root client: fade-in, scroll-spy, shortcut admin, modals
  Navbar.js          # Banner pengumuman + navbar desktop + header mobile + toggle tema
  MobileTabBar.js    # Bottom tab bar mobile
  Hero.js            # Hero + StripesBackground (garis diagonal menyala)
  StripesBackground.js # Efek garis diagonal + spotlight kursor + grain
  TechLogosMarquee.js# Marquee logo tech stack (pill logo + nama)
  TechMarquee.js     # Marquee kata layanan (sebelum footer)
  About.js           # Two-col: kartu profil 3D kiri + teks kanan (badge shine + WordReveal)
  ProjectsGrid.js    # Grid proyek + View All
  ExperienceTimeline.js # Timeline vertikal
  CertificatesList.js # Baris sertifikat + lightbox
  ContactFooter.js   # Form + info + CTA raksasa + footer
  WordReveal.js      # Animasi per kata
  ProfileCard.js     # Kartu 3D tilt + shine/glare + info bar
  CursorFX.js        # Cincin & titik kursor kustom (desktop)
  admin/
    AdminAuth.js     # Modal login
    AdminPanel.js    # CMS 7 tab
    ImageInput.js    # Upload gambar (FileReader → dataURL, max 1.5 MB)
lib/
  seed.js            # Data default — EDIT UNTUK KONTEN AWAL BARU
  store.js           # Store localStorage + hook useData()
  nav.js             # Daftar section navigasi
```

---

## Deploy

Push ke GitHub → Import di **Vercel** → Deploy (zero config).

> Catatan: karena memakai `localStorage`, perubahan lewat admin hanya tersimpan di browser/perangkat yang digunakan. Untuk sinkron lintas perangkat, migrasikan `lib/store.js` ke Supabase/Firebase — struktur data sudah JSON siap kirim.

---

## Kredit

- Font **Clash Display** & **Satoshi** oleh Indian Type Foundry (Fontshare, free for commercial use)
- Ikon **Lucide** (MIT)
- Logo tech stack dari **devicon** (CDN jsdelivr)
- Inspirasi visual & interaksi: portfolio-modern dark-mode patterns

---

**Dibangun oleh Dava Setiawan** — 2025