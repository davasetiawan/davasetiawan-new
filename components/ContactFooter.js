"use client";

import { useState } from "react";
import {
  Github,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { useData, store } from "../lib/store";

function socialIcon(label) {
  const l = (label || "").toLowerCase();
  if (l.includes("github")) return Github;
  if (l.includes("linked")) return Linkedin;
  if (l.includes("insta")) return Instagram;
  if (l.includes("mail") || l.includes("email")) return Mail;
  return LinkIcon;
}

export default function ContactFooter() {
  const data = useData();
  const p = data.profile;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Semua field wajib diisi.");
      setSent(false);
      return;
    }
    store.update((draft) => {
      draft.messages = [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          date: new Date().toISOString(),
        },
        ...(draft.messages || []),
      ];
      return draft;
    });
    setForm({ name: "", email: "", message: "" });
    setError("");
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  const footerSocials = ["GitHub", "LinkedIn", "Instagram"];

  return (
    <section id="contact" className="border-t border-[var(--border)] pb-40 pt-24 md:pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-20 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_45%,transparent)] p-6 md:p-8">
            <h3 className="font-display text-2xl font-medium">Kirim Pesan</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Punya ide proyek atau sekadar ingin menyapa? Tulis di sini.
            </p>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="tinput"
                  placeholder="Nama kamu"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  className="tinput"
                  placeholder="nama@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <textarea
                rows={5}
                className="tinput resize-y"
                placeholder="Halo Dava, saya tertarik untuk..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              {error ? (
                <p className="text-xs text-red-500">✖ {error}</p>
              ) : null}
              {sent ? (
                <p className="text-xs text-[var(--highlight)]">
                  ✔ Pesan terkirim — saya akan membalas segera.
                </p>
              ) : null}

              <button type="submit" className="tbtn tbtn-primary self-start px-6 py-3">
                <Send size={14} /> Kirim Pesan
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-[var(--border)] p-6 md:p-8">
              <h3 className="font-display text-2xl font-medium">Kontak Langsung</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                <a
                  href={`mailto:${p.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-[var(--highlight)]"
                >
                  <Mail size={16} className="text-[var(--highlight)]" />
                  <span className="underline decoration-dotted underline-offset-4">{p.email}</span>
                </a>
                <p className="flex items-center gap-3 text-[var(--muted-foreground)]">
                  <MapPin size={16} className="text-[var(--highlight)]" />
                  {p.location}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {(p.socials || []).map((social) => {
                  const Icon = socialIcon(social.label);
                  return (
                    <a
                      key={social.label + social.url}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm transition-all hover:border-[var(--highlight)] hover:text-[var(--highlight)]"
                    >
                      <Icon size={15} />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="group relative mt-4 overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_50%,transparent)] p-12 text-center shadow-2xl transition-all duration-500 hover:border-[color-mix(in_srgb,var(--highlight)_30%,transparent)] md:p-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--highlight)] opacity-15 blur-[120px] transition-opacity duration-1000 group-hover:opacity-30 md:h-[600px] md:w-[600px]" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--highlight)_30%,transparent)] bg-[color-mix(in_srgb,var(--highlight)_10%,transparent)] px-5 py-2 font-display text-xs font-medium tracking-wide text-[var(--highlight)] shadow-[0_0_15px_-5px_var(--highlight)] backdrop-blur-sm md:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--highlight)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--highlight)]" />
              </span>
              {p.availability}
            </span>

            <h2 className="mb-12 font-display text-5xl font-medium leading-[0.9] tracking-tighter lg:text-9xl">
              Let&apos;s work
              <br />
              <span className="text-[var(--muted-foreground)] transition-colors duration-500 group-hover:text-[var(--foreground)]">
                together.
              </span>
            </h2>

            <a
              href={`mailto:${p.email}`}
              className="inline-flex h-16 items-center rounded-full border-none bg-[var(--highlight)] px-12 font-display text-xl font-medium text-[var(--highlight-foreground)] shadow-[0_0_40px_-10px_var(--highlight)] transition-all duration-300 hover:scale-105 hover:brightness-110 md:h-20 md:px-16 md:text-2xl"
            >
              Start a Project
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between text-sm font-medium uppercase tracking-widest text-[var(--muted-foreground)] md:flex-row">
          <p>© {new Date().getFullYear()} {(p.name || "").toUpperCase()}.</p>
          <div className="mt-6 flex gap-8 font-display md:mt-0">
            {(p.socials || [])
              .filter((s) => footerSocials.some((f) => s.label.toLowerCase().includes(f.toLowerCase())))
              .map((social) => {
                const Icon = socialIcon(social.label);
                return (
                  <a
                    key={social.label + social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={social.url}
                    aria-label={social.label}
                    className="transition-all hover:scale-110 hover:text-[var(--highlight)]"
                  >
                    <Icon size={22} strokeWidth={1.5} />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
