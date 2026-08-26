"use client";

import { useData } from "../lib/store";

export default function TechMarquee() {
  const data = useData();
  const words = data.marquee?.length ? data.marquee : ["Web Apps"];

  return (
    <div className="marquee-wrap w-full overflow-hidden border-y border-[var(--border)] bg-[var(--marquee-bg)] py-12 md:py-16">
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track select-none" role="region" aria-label="Layanan">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {words.map((word, i) => (
                <li key={`${copy}-${word}-${i}`} className="flex-none px-4">
                  <span className="group flex cursor-default items-center gap-6 px-4">
                    <span className="whitespace-nowrap font-display text-4xl font-medium tracking-tight text-zinc-300 transition-colors duration-500 group-hover:text-[var(--highlight)] dark:text-zinc-800 md:text-7xl">
                      {word}
                    </span>
                    <span className="text-2xl text-[var(--highlight)] opacity-50 transition-opacity group-hover:opacity-100 md:text-4xl">
                      ✦
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
