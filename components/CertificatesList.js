"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Eye, Trophy, X } from "lucide-react";
import SectionBadge from "./SectionBadge";
import { useData } from "../lib/store";

function formatDate(value) {
  if (!value) return "—";
  const [year, month] = String(value).split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const m = Number(month) - 1;
  return Number.isInteger(m) && names[m] ? `${names[m]} ${year}` : value;
}

export default function CertificatesList() {
  const data = useData();
  const items = data.certificates || [];
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  return (
    <section id="certificates" className="container mx-auto border-t border-[var(--border)] px-6 pb-24 pt-24 md:pt-28">
      <div className="mb-14 flex flex-col items-center text-center">
        <div className="mb-4">
          <SectionBadge text="Recognition" icon={Trophy} />
        </div>
        <h2 className="font-display text-4xl font-medium md:text-6xl">
          Awards &amp; Certifications
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
          Sertifikasi dan penghargaan yang saya raih sepanjang perjalanan belajar.
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col divide-y divide-[var(--border)] rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_35%,transparent)] px-4 sm:px-6">
        {items.length === 0 ? (
          <p className="p-8 text-center italic text-[var(--muted-foreground)]">
            Belum ada sertifikat.
          </p>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group flex items-center gap-4 py-6 md:gap-8 md:py-8"
            >
              <span className="hidden w-10 shrink-0 font-display text-2xl text-[var(--muted-foreground)] opacity-60 md:block">
                {String(index + 1).padStart(2, "0")}
              </span>

              <button
                onClick={() => setPreview(item)}
                title="Klik untuk pratinjau"
                className="aspect-[4/3] w-24 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-[var(--border)] sm:w-32 md:w-40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold md:text-lg">{item.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {item.issuer} · {formatDate(item.date)}
                </p>
                <div className="mt-3 flex items-center gap-2 lg:hidden">
                  <button onClick={() => setPreview(item)} className="tbtn text-xs">
                    <Eye size={13} /> Preview
                  </button>
                  {item.verifyUrl ? (
                    <a href={item.verifyUrl} target="_blank" rel="noopener noreferrer" className="tbtn text-xs">
                      <BadgeCheck size={13} /> Verify
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-2 lg:flex">
                <button onClick={() => setPreview(item)} className="tbtn text-xs">
                  <Eye size={13} /> Preview
                </button>
                {item.verifyUrl ? (
                  <a href={item.verifyUrl} target="_blank" rel="noopener noreferrer" className="tbtn tbtn-primary text-xs">
                    <BadgeCheck size={13} /> Verify
                  </a>
                ) : null}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <span className="truncate text-xs text-[var(--muted-foreground)]">
                  ~/certificates/{preview.name.toLowerCase().replace(/\s+/g, "-")}.png
                </span>
                <button
                  onClick={() => setPreview(null)}
                  aria-label="Tutup"
                  className="rounded-full p-1 text-[var(--muted-foreground)] transition-colors hover:bg-white/10 hover:text-[var(--highlight)]"
                >
                  <X size={16} />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.imageUrl}
                alt={preview.name}
                className="max-h-[65vh] w-full bg-black/40 object-contain"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{preview.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {preview.issuer} · {formatDate(preview.date)}
                  </p>
                </div>
                {preview.verifyUrl ? (
                  <a
                    href={preview.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tbtn tbtn-primary text-xs"
                  >
                    <BadgeCheck size={14} /> Verifikasi Sertifikat
                  </a>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
