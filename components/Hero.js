"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import StripesBackground from "./StripesBackground";
import { useData } from "../lib/store";

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const data = useData();
  const p = data.profile;
  const heroSocials = ["GitHub", "LinkedIn", "Instagram", "Email"];

  return (
    <section
      id="home"
      className="container relative mx-auto flex min-h-[92vh] flex-col justify-between px-6 pb-20 pt-36 sm:pt-40 md:pt-44 md:pb-24"
    >
      <StripesBackground />
      <div className="pointer-events-none relative z-10 flex flex-col gap-8 md:gap-10">
        <motion.div
          {...fadeUp(0.05)}
          className="pointer-events-auto flex items-center gap-3"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--highlight)] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--highlight)] shadow-[0_0_15px_var(--highlight)]" />
          </span>
          <span className="font-display text-sm font-medium uppercase tracking-widest text-[var(--muted-foreground)] md:text-base">
            Hello, It&apos;s me {p.greetingName || p.name}
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="max-w-6xl select-none font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          {p.heroPre}{" "}
          <span className="inline-block origin-left text-[var(--highlight)] drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]">
            {p.heroHighlight}
          </span>{" "}
          {p.heroPost}
        </motion.h1>

        <motion.p
          {...fadeUp(0.25)}
          className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl"
        >
          {p.subheadline}
        </motion.p>
      </div>

      <motion.div
        {...fadeUp(0.35)}
        className="relative z-10 mt-16 flex flex-col items-start justify-between gap-8 border-t border-[var(--border)] pt-8 md:mt-24 md:flex-row md:items-center"
      >
        <div className="flex flex-wrap gap-6 font-display text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] md:text-sm">
          {(p.socials || [])
            .filter((s) => heroSocials.some((h) => s.label.toLowerCase().includes(h.toLowerCase())))
            .map((social) => (
              <a
                key={social.label + social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 transition-colors hover:text-[var(--highlight)]"
              >
                {social.label}
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
        </div>

        <a href="#about" className="group relative block cursor-pointer overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--secondary)] px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[var(--highlight)] hover:bg-[var(--highlight)]">
          <span className="relative flex items-center gap-2 font-display text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--highlight-foreground)] md:text-base">
            Scroll Down
            <MoveRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </a>
      </motion.div>
    </section>
  );
}
