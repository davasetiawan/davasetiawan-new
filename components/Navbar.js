"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Award, Briefcase, FolderOpen, History, House, Mail, Moon, Sun, UserRound, X } from "lucide-react";
import { NAV_ITEMS } from "../lib/nav";
import { useData } from "../lib/store";

function ThemeToggle({ className = "" }) {
  const toggle = () => {
    const root = document.documentElement;
    const nextDark = root.classList.contains("light");
    root.classList.toggle("light", !nextDark);
    try {
      localStorage.setItem("dava-theme", nextDark ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--highlight)] ${className}`}
    >
      <Sun size={19} className="hidden dark:block" />
      <Moon size={19} className="block dark:hidden" />
    </button>
  );
}

export default function Navbar({ active }) {
  const data = useData();
  const profile = data.profile;
  const announcement = data.settings?.announcement;
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
    setDismissed(sessionStorage.getItem("dava-announce-dismissed") === "1");
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("dava-announce-dismissed", "1");
    setDismissed(true);
  };

  const firstName = (profile.name || "").split(" ")[0] || "Dava";
  const showAnnounce = mounted && !dismissed && announcement && (announcement.label || announcement.desc);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/10">
      {showAnnounce ? (
        <div className="w-full border-b border-[color-mix(in_srgb,var(--highlight)_30%,transparent)] bg-gradient-to-r from-[color-mix(in_srgb,var(--highlight)_15%,transparent)] via-[color-mix(in_srgb,var(--highlight)_30%,transparent)] to-[color-mix(in_srgb,var(--highlight)_15%,transparent)] px-8 py-2 text-xs font-medium backdrop-blur-xl sm:px-10 sm:text-sm">
          <div className="relative mx-auto flex w-full max-w-[1536px] items-center justify-center gap-2 text-center px-6 md:px-12">
            <span className="inline-flex shrink-0 items-center gap-1.5 font-display font-medium text-[var(--highlight)]">
              <FolderOpen size={16} />
              <span>{announcement.label}</span>
            </span>
            {announcement.desc ? (
              <span className="hidden font-medium text-[var(--muted-foreground)] md:inline">
                • {announcement.desc}
              </span>
            ) : null}
            {announcement.url ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={announcement.url}
                className="ml-1 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-medium text-[var(--highlight-foreground)] shadow-sm transition-all hover:opacity-90"
              >
                {announcement.cta || "Buka"}
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            <button
              onClick={dismiss}
              title="Tutup pengumuman"
              aria-label="Tutup pengumuman"
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}

      <nav className="h-20 w-full border-b border-white/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1536px] px-6 md:px-12 flex h-full items-center justify-between gap-4">
          <a className="font-display font-medium text-2xl tracking-wider text-foreground hover:text-[var(--highlight)] transition-colors" href="#home">
            <span className="hidden lg:inline">{firstName} Portfolio.</span>
            <span className="inline lg:hidden">{firstName}.</span>
          </a>

          <div className="flex-1 flex justify-center items-center">
            <div className="relative z-20 inline-flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-background/80 backdrop-blur-md shadow-lg">
              {NAV_ITEMS.map((item) => {
                const Icon =
                  item.id === "home" ? House :
                  item.id === "about" ? UserRound :
                  item.id === "projects" ? Briefcase :
                  item.id === "experience" ? History :
                  item.id === "certificates" ? Award :
                  Mail;
                return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                    active === item.id
                      ? "text-[var(--highlight-foreground)] bg-[var(--highlight)] shadow-[0_0_15px_var(--highlight)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </a>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-border/50 mx-1" />
            <a href="#contact">
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 py-2 bg-[var(--highlight)] text-[var(--highlight-foreground)] hover:opacity-90 transition-all font-bold rounded-full px-6 shadow-[0_0_15px_var(--highlight)] shadow-[var(--highlight)]/20">
                Let&apos;s Talk
              </button>
            </a>
          </div>
        </div>
      </nav>

      <header className="md:hidden w-full bg-transparent border-b border-white/10 px-4 h-14 flex items-center justify-between transition-all duration-300">
        <a className="font-display font-medium text-xl tracking-wider text-foreground" href="#home">
          {firstName}
        </a>
        <ThemeToggle />
      </header>
    </div>
  );
}