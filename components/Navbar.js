"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, FolderOpen, Moon, Sun, X } from "lucide-react";
import { NAV_ITEMS } from "../lib/nav";
import { useData } from "../lib/store";

function ThemeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);
  const toggle = () => {
    const root = document.documentElement;
    const nextDark = root.classList.contains("light");
    root.classList.toggle("light", !nextDark);
    try {
      localStorage.setItem("dava-theme", nextDark ? "dark" : "light");
    } catch {}
    setIsDark(nextDark);
  };
  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--highlight)] ${className}`}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

export default function Navbar({ active }) {
  const data = useData();
  const profile = data.profile;
  const announcement = data.settings?.announcement;
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("dava-announce-dismissed") === "1");
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("dava-announce-dismissed", "1");
    setDismissed(true);
  };

  const firstName = (profile.name || "").split(" ")[0] || "Dava";

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      {!dismissed && announcement ? (
        <div className="w-full border-b border-[color-mix(in_srgb,var(--highlight)_30%,transparent)] bg-gradient-to-r from-[color-mix(in_srgb,var(--highlight)_15%,transparent)] via-[color-mix(in_srgb,var(--highlight)_30%,transparent)] to-[color-mix(in_srgb,var(--highlight)_15%,transparent)] px-8 py-2 text-xs font-medium backdrop-blur-xl sm:px-10 sm:text-sm">
          <div className="relative mx-auto flex w-full max-w-4xl items-center justify-center gap-2 text-center">
            <span className="inline-flex shrink-0 items-center gap-1.5 font-display font-medium text-[var(--highlight)]">
              <FolderOpen size={16} />
              <span>{announcement.label}</span>
            </span>
            <span className="hidden font-medium text-[var(--muted-foreground)] md:inline">
              • {announcement.desc}
            </span>
            {announcement.url ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={announcement.url}
                className="ml-1 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-medium text-[var(--highlight-foreground)] shadow-sm transition-all hover:opacity-90"
              >
                {announcement.cta}
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            <button
              onClick={dismiss}
              title="Tutup pengumuman"
              aria-label="Tutup pengumuman"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}

      <nav className="hidden h-20 w-full border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-md md:block">
        <div className="container mx-auto flex h-full items-center justify-between gap-4 px-6">
          <a href="#home" className="shrink-0 font-display text-2xl font-medium tracking-wider transition-colors hover:text-[var(--highlight)]">
            <span className="hidden lg:inline">{firstName} Portfolio.</span>
            <span className="inline lg:hidden">{firstName}.</span>
          </a>

          <div className="hidden flex-1 items-center justify-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm transition-colors ${
                  active === item.id
                    ? "font-semibold text-[var(--highlight)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <div className="mx-1 h-6 w-px bg-[var(--border-strong)]" />
            <a href="#contact">
              <button className="h-10 rounded-full bg-[var(--highlight)] px-6 text-sm font-bold text-[var(--highlight-foreground)] shadow-[0_0_15px_var(--highlight)] transition-all hover:opacity-90">
                Let&apos;s Talk
              </button>
            </a>
          </div>
        </div>
      </nav>

      <header className="flex h-14 w-full items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] px-4 backdrop-blur-md md:hidden">
        <a href="#home" className="font-display text-xl font-medium tracking-wider">
          {firstName}
        </a>
        <ThemeToggle />
      </header>
    </div>
  );
}
