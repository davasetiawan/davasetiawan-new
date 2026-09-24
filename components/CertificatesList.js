"use client";

import { Trophy, ExternalLink } from "lucide-react";
import SectionBadge from "./SectionBadge";
import { useData } from "../lib/store";
import AccordionGallery from "./AccordionGallery";

function formatDate(value) {
  if (!value) return "—";
  const [year, month] = String(value).split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const m = Number(month) - 1;
  return Number.isInteger(m) && names[m] ? `${names[m]} ${year}` : value;
}

export default function CertificatesList() {
  const data = useData();
  const rawCertificates = data.certificates || [];

  const galleryItems = rawCertificates.map((cert) => ({
    id: cert.id,
    image: cert.imageUrl,
    label: cert.name,
    sublabel: `${cert.issuer} · ${formatDate(cert.date)}`,
    link: cert.verifyUrl || "#",
    alt: cert.name,
  }));

  return (
    <section id="certificates" className="mx-auto w-full max-w-[1536px] px-6 md:px-12 border-t border-[var(--border)] pb-24 pt-24 md:pt-28">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4">
          <SectionBadge text="Recognition" icon={Trophy} />
        </div>
        <h2 className="font-display text-4xl font-medium md:text-6xl">
          Awards &amp; Certifications
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
          Sertifikasi dan penghargaan yang saya raih. Klik sertifikat untuk membuka tautan kredensial resmi.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        {galleryItems.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_35%,transparent)] p-12 text-center text-sm italic text-[var(--muted-foreground)]">
            Belum ada sertifikat.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AccordionGallery
              items={galleryItems}
              defaultIndex={Math.min(1, galleryItems.length - 1)}
              height={500}
              expandRatio={0.62}
              accentColor="var(--highlight, #b5ff6d)"
              overlayColor="#060010"
              textColor="#ffffff"
              radius={20}
              gap={14}
              tilt={5}
              parallax={0.25}
              trigger="hover"
              grayscale={true}
              showLabels={true}
            />

            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--muted-foreground)] opacity-80">
              <ExternalLink size={13} className="text-[var(--highlight)]" />
              <span>Arahkan / tekan sertifikat untuk melihat detail, lalu klik panel yang terbuka untuk membuka halaman kredensial verifikasi.</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

