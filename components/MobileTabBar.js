"use client";

import { Award, Briefcase, House, Mail, UserRound } from "lucide-react";

const ITEMS = [
  { id: "home", label: "Home", icon: House },
  { id: "projects", label: "Proyek", icon: Briefcase },
  { id: "about", label: "About", icon: UserRound },
  { id: "certificates", label: "Sertifikat", icon: Award },
  { id: "contact", label: "Kontak", icon: Mail },
];

export default function MobileTabBar({ active }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors duration-300 ${
              active === id ? "text-[var(--highlight)]" : "text-[var(--muted-foreground)]"
            }`}
          >
            <span
              className={`rounded-xl p-1 transition-all duration-300 ${
                active === id ? "bg-[color-mix(in_srgb,var(--highlight)_12%,transparent)]" : ""
              }`}
            >
              <Icon size={19} strokeWidth={active === id ? 2.5 : 2} />
            </span>
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
