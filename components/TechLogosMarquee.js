"use client";

import { useState } from "react";
import { useData } from "../lib/store";

function TechPill({ item }) {
  const [broken, setBroken] = useState(false);
  
  // Normalisasi keyword untuk URL devicon
  const keyword = item.name.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\.js/g, 'js')
    .replace(/node/g, 'nodejs')
    .replace(/react/g, 'react')
    .replace(/tailwind/g, 'tailwindcss');

  const autoLogoUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${keyword}/${keyword}-original.svg`;
  const finalUrl = item.logoUrl || autoLogoUrl;

  return (
    <li className="mr-6 flex-none leading-none">
      <div className="mx-2 flex cursor-default items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-colors duration-300 hover:border-[var(--highlight)]/50 md:px-5">
        {!broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalUrl}
            alt={item.name}
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-5 w-5 object-contain"
          />
        ) : (
          <span className="grid h-5 w-5 place-items-center rounded-sm bg-white/10 text-[9px] font-bold">
            {(item.name || "?").slice(0, 2).toUpperCase()}
          </span>
        )}
        <span className="whitespace-nowrap font-display text-xs font-normal md:text-sm">
          {item.name}
        </span>
      </div>
    </li>
  );
}

export default function TechLogosMarquee() {
  const data = useData();
  const items = data.techStack?.length ? data.techStack : [];

  return (
    <div className="relative z-20 w-full overflow-hidden border-y border-white/10 bg-background py-8 md:py-12">
      <div className="w-full overflow-hidden no-scrollbar">
        <div
          role="region"
          aria-label="Technology Stack"
          className="marquee-wrap relative group"
        >
          <div className="tech-fade">
            <div className="tech-track select-none motion-reduce:transform-none">
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
                  {items.map((item, i) => (
                    <TechPill key={`${copy}-${item.name}-${i}`} item={item} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
