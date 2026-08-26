import "./globals.css";

export const metadata = {
  title: "Dava Setiawan | Full-Stack Developer & Creative Developer",
  description:
    "Portfolio resmi Dava Setiawan. Spesialis Full-Stack Development dan Creative Developer — membangun pengalaman digital yang estetis, cepat, dan berpusat pada pengguna.",
  keywords: [
    "Dava Setiawan", "Portfolio", "Full-Stack Developer",
    "Creative Developer", "Web Developer Indonesia",
  ],
};

const themeInit =
  "(function(){try{var t=localStorage.getItem('dava-theme');var r=document.documentElement;if(t==='light'){r.classList.add('light')}else{r.classList.remove('light')}}catch(e){}})();";

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
