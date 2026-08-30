const svgAvatar =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1712"/><stop offset="1" stop-color="#1a2620"/></linearGradient></defs><rect width="480" height="600" fill="url(#g)"/><circle cx="240" cy="215" r="105" fill="#243529"/><path d="M85 600 C85 435 150 372 240 372 C330 372 395 435 395 600 Z" fill="#243529"/><text x="240" y="558" font-family="monospace" font-size="15" fill="#7f9086" text-anchor="middle">[ FOTO PROFIL ANDA ]</text></svg>`
  );

const svgThumb = (title, sub) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101511"/><stop offset="1" stop-color="#18231a"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><rect x="14" y="14" width="772" height="422" rx="22" fill="none" stroke="#b5ff6d" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="12 8"/><text x="400" y="215" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#eafff0" text-anchor="middle">${title}</text><text x="400" y="262" font-family="monospace" font-size="18" fill="#8a938d" text-anchor="middle">${sub}</text></svg>`
  );

const svgCert = (title) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1410"/><stop offset="1" stop-color="#16241a"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><rect x="12" y="12" width="616" height="376" rx="18" fill="none" stroke="#b5ff6d" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="10 8"/><text x="320" y="185" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#d8ffd0" text-anchor="middle">${title}</text><text x="320" y="228" font-family="monospace" font-size="15" fill="#8a938d" text-anchor="middle">[ preview sertifikat ]</text></svg>`
  );

const SEED = {
  profile: {
    name: "Dava Setiawan",
    greetingName: "Dava",
    handle: "@davasetiawan",
    photoUrl: svgAvatar,
    role: "Full-Stack Developer & Creative Developer",
    heroPre: "Merangkai estetika dan fungsi menjadi",
    heroHighlight: "solusi digital",
    heroPost: "yang berdampak.",
    subheadline:
      "Lulusan Teknik Informatika yang gemar membangun antarmuka user-centered sekaligus aplikasi web yang tangguh. Ide yang rumit saya ubah menjadi produk digital yang bersih, cepat, dan responsif.",
    aboutHeadline:
      "Saya Dava Setiawan — seorang developer kreatif yang berdedikasi menghasilkan produk digital berkualitas tinggi dan berkesan bagi penggunanya.",
    bio: "Saya percaya produk terbaik lahir dari perpaduan engineering yang solid dan sentuhan desain yang empatik.\n\nDi luar coding, saya aktif menulis catatan teknis dan berkontribusi pada proyek open source.",
    availability: "TERBUKA UNTUK PROYEK BARU",
    location: "Jakarta, Indonesia",
    email: "hello@davasetiawan.dev",
    resumeUrl: "",
    socials: [
      { label: "GitHub", url: "https://github.com/davasetiawan" },
      { label: "LinkedIn", url: "https://linkedin.com/in/davasetiawan" },
      { label: "Instagram", url: "https://instagram.com/davasetiawan" },
      { label: "Email", url: "mailto:hello@davasetiawan.dev" },
    ],
  },
  skills: [],
  marquee: [
    "Web Apps", "UI Engineering", "REST API", "Dashboards", "Automation", "Open Source",
  ],
  techStack: [
    { name: "JavaScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "React", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Next.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
    { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Tailwind CSS", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "PostgreSQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "Prisma", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" },
    { name: "Git & GitHub", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Docker", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Figma", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
    { name: "React JS", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "JavaScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Tailwind CSS", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "PostgreSQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
    { name: "Docker", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Figma", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
    { name: "Git", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Firebase", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
  ],
  projects: [
    {
      id: "p1",
      title: "NusaMart — Marketplace UMKM",
      year: "2025",
      description:
        "Platform marketplace untuk UMKM lokal dengan keranjang, checkout, dan dashboard penjual lengkap dengan analitik penjualan.",
      tags: ["Next.js", "Tailwind CSS", "PostgreSQL"],
      imageUrl: svgThumb("NUSAMART", "marketplace umkm · 2025"),
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/davasetiawan/nusamart",
    },
    {
      id: "p2",
      title: "Siakadku — Sistem Informasi Akademik",
      year: "2024",
      description:
        "Aplikasi akademik kampus: KRS online, manajemen nilai, jadwal kuliah, dan notifikasi email otomatis.",
      tags: ["React", "Express", "MySQL"],
      imageUrl: svgThumb("SIAKADKU", "sistem informasi akademik · 2024"),
      demoUrl: "",
      repoUrl: "https://github.com/davasetiawan/siakadku",
    },
    {
      id: "p3",
      title: "TrashClassify — Klasifikasi Sampah AI",
      year: "2024",
      description:
        "Model CNN untuk mengklasifikasi jenis sampah dari gambar, dilengkapi web app upload dan API prediksi.",
      tags: ["Python", "TensorFlow", "Flask"],
      imageUrl: svgThumb("TRASHCLASSIFY", "klasifikasi sampah ai · 2024"),
      demoUrl: "",
      repoUrl: "https://github.com/davasetiawan/trashclassify",
    },
  ],
  experience: [
    {
      id: "e1",
      period: "2024 — Sekarang",
      role: "Freelance Full-Stack Developer",
      org: "Self-Employed",
      type: "work",
      description:
        "Membangun company profile, landing page, dan dashboard internal untuk klien UMKM serta komunitas — dari perancangan sampai deploy.",
    },
    {
      id: "e2",
      period: "2024",
      role: "Frontend Developer Intern",
      org: "PT Teknologi Nusantara",
      type: "work",
      description:
        "Berkontribusi pada design system internal dan migrasi halaman legacy ke React + Tailwind CSS.",
    },
    {
      id: "e3",
      period: "2021 — 2025",
      role: "S1 Teknik Informatika",
      org: "Universitas Negeri Jakarta",
      type: "education",
      description:
        "Fokus pada rekayasa perangkat lunak dan kecerdasan buatan. Aktif di lab pemrograman dan komunitas developer kampus.",
    },
  ],
  certificates: [
    {
      id: "c1",
      name: "Belajar Fundamental Front-End Web Development",
      issuer: "Dicoding Indonesia",
      date: "2024-05",
      imageUrl: svgCert("FRONT-END FUNDAMENTAL"),
      verifyUrl: "https://dicoding.com",
    },
    {
      id: "c2",
      name: "AWS Cloud Practitioner Essentials",
      issuer: "AWS Training & Certification",
      date: "2024-11",
      imageUrl: svgCert("AWS CLOUD PRACTITIONER"),
      verifyUrl: "https://aws.amazon.com/certification/",
    },
    {
      id: "c3",
      name: "Belajar Machine Learning untuk Pemula",
      issuer: "Dicoding Indonesia",
      date: "2025-01",
      imageUrl: svgCert("MACHINE LEARNING PEMULA"),
      verifyUrl: "https://dicoding.com",
    },
  ],
  messages: [],
  settings: {
    password: "admin123",
    announcement: {
      label: "PORTOFOLIO TERBARU",
      desc: "Dokumen portofolio terbaru dapat diakses via Google Drive",
      cta: "Buka Drive",
      url: "https://drive.google.com",
    },
  },
};

export default SEED;
