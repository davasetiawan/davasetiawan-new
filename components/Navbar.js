"use client";

import { Award, Briefcase, History, House, Mail, Moon, Sun, UserRound } from "lucide-react";
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
      suppressHydrationWarning
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
  const firstName = (profile.name || "").split(" ")[0] || "Dava";

  return (
    <div className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <nav className="hidden h-20 w-full border-b border-white/10 bg-[color-mix(in_srgb,var(--background)_80%,transparent)] backdrop-blur-md md:flex">
        <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-4 px-6">
          <a className="font-display font-medium text-2xl tracking-wider text-foreground hover:text-[var(--highlight)] transition-colors" href="#home">
            <span className="hidden lg:inline">{firstName} Portfolio.</span>
            <span className="inline lg:hidden">{firstName}.</span>
          </a>

          <div className="flex flex-1 justify-center">
            <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_72%,transparent)] p-1 backdrop-blur-md">
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-medium transition-colors xl:px-3 xl:text-sm ${
                      active === item.id
                        ? "bg-[var(--highlight)] text-[var(--highlight-foreground)]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden xl:inline">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-border/50 mx-1" />
            <a href="#contact">
              <button suppressHydrationWarning className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 py-2 bg-[var(--highlight)] text-[var(--highlight-foreground)] hover:opacity-90 transition-all font-bold rounded-full px-6 shadow-[0_0_15px_var(--highlight)] shadow-[var(--highlight)]/20">
                Let&apos;s Talk
              </button>
            </a>
          </div>
        </div>
      </nav>

      <header className="flex h-14 w-full items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_80%,transparent)] px-4 backdrop-blur-md transition-all duration-300 md:hidden">
        <a className="font-display font-medium text-xl tracking-wider text-foreground" href="#home">
          {firstName}
        </a>
        <ThemeToggle />
      </header>
    </div>
  );
}
