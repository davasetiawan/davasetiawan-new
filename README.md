# Dava Portfolio — Clone syfrsam.space

Portfolio satu halaman (single-page scroll) yang **meniru struktur & gaya visual
[syfrsam.space](https://www.syfrsam.space/)**: banner pengumuman, navbar pill
dengan glow, hero display raksasa dengan kata ber-highlight neon green, marquee
layanan, About dengan badge shine + animasi per kata, grid Featured Projects,
timeline Experience, daftar Awards & Certifications, CTA raksasa "Let's work
together.", bottom tab bar di mobile, serta dark/light mode.

Ditambah fitur khusus: **panel admin tersembunyi (CMS)** untuk mengelola semua
konten tanpa menyentuh kode, **upload foto** (proyek/sertifikat/foto profil)
langsung dari perangkat, **kartu profil 3D tilt + glare** di About, **marquee
tech stack berlogo**, dan **efek kursor** (spotlight hero + cincin kustom).

Stack: **Next.js 15 · React 19 · Tailwind CSS 4 · Framer Motion · Lucide Icons ·
Font Clash Display & Satoshi (Fontshare)**

---

## Menjalankan

```bash
npm install     # sudah dilakukan
npm run dev     # buka http://localhost:3000
```

Build produksi:

```bash
npm run build && npm run start
```

---

## Panel Admin (CMS)

Tiga cara membuka:

1. Tekan **Ctrl + Shift + A**
2. Ketik `sudo` di keyboard (di luar form input)
3. Lihat hint di console browser (F12)

Password default: **`admin123`** — ganti di tab *Settings* setelah login.

### Yang bisa dikelola

| Tab | Isi |
|---|---|
| Bio & Hero | Nama, greeting, handle, **foto profil (upload dari perangkat atau URL)**, headline hero (sebelum/highlight/sesudah), sub-headline, headline About, bio, availability, lokasi, email, URL CV, sosial media |
| Skills & Marquee | Skills chip · **Tech Stack marquee** (format `Nama \| URL-logo` per baris) · kata-kata marquee layanan |
| Projects | Tambah/edit/hapus proyek: judul, tahun, deskripsi, tags, **thumbnail (upload/URL)**, demo, GitHub |
| Experience | Timeline kerja/pendidikan: posisi, institusi, periode, tipe (dropdown), deskripsi |
| Certificates | Nama, penerbit, tanggal, **gambar sertifikat (upload/URL)** dengan lightbox, link verifikasi |
| Inbox | Pesan masuk dari form kontak |
| Settings | Banner pengumuman atas, ganti password, Export/Import JSON, Reset default |

Data tersimpan di **localStorage** browser (key `dava-portfolio:v2`).

### Lupa password?

DevTools → Console:

```js
const d = JSON.parse(localStorage.getItem("dava-portfolio:v2"));
d.settings.password = "passwordbaru";
localStorage.setItem("dava-portfolio:v2", JSON.stringify(d));
location.reload();
```

---

## Struktur Kode

```
app/
  layout.js                 HTML root + font Fontshare + script anti-flash tema
  globals.css               Tema (dark/light), highlight #b5ff6d, shine, marquee,
                            komponen CSS (.tcard/.tbtn/.tinput/.tchip)
  page.js                   Entry → render <Portfolio/>
components/
  Portfolio.js              Root client: fade-in halaman, scroll-spy,
                            shortcut admin, wiring modals
  Navbar.js                 Banner pengumuman (bisa ditutup) + navbar desktop +
                            header mobile + toggle tema
  MobileTabBar.js           Bottom tab bar mobile (Home/Proyek/About/Sertifikat/Kontak)
  Hero.js                   Hero besar + pulsing dot + social row + Scroll Down
  TechMarquee.js            Marquee layanan (hover pause, klik item → aksen)
  About.js                  Badge shine + animasi kata + bio
  ProjectsGrid.js           Grid Featured Projects + View All
  ExperienceTimeline.js     Timeline vertikal WORK/EDUCATION
  CertificatesList.js       Baris sertifikat + lightbox pratinjau + verify
  ContactFooter.js          Form kontak + kartu kontak + CTA raksasa + footer
  WordReveal.js             Animasi kemunculan per kata
  SectionBadge.js           Badge pill "✦ LABEL" dengan shine
  admin/
    AdminAuth.js            Modal login
    AdminPanel.js           CMS 7 tab
lib/
  seed.js                   Data default — EDIT DI SINI untuk konten awal baru
  store.js                  Store localStorage + hook useData()
  nav.js                    Daftar section navigasi
```

### Mengganti konten

Cara termudah: buka panel admin dan edit langsung. Untuk mengubah **data
default** (yang muncul sebelum ada editan), ubah `lib/seed.js`.

> Catatan: karena memakai localStorage, hasil edit admin hanya tersimpan di
> perangkat/browser tempat Anda mengedit. Untuk sinkron lintas perangkat,
> migrasikan `lib/store.js` ke Supabase/Firebase — struktur data sudah JSON
> siap kirim.

---

## Deploy

Push ke GitHub → import di [Vercel](https://vercel.com) → deploy (zero config).
