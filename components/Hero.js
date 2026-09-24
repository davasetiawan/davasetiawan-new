"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { useData } from "../lib/store";

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

function RotatingHighlight({ words: wordsProp }) {
  const words = Array.isArray(wordsProp) && wordsProp.length > 0
    ? wordsProp
    : ["solusi digital"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-flex relative overflow-hidden align-bottom px-1 py-0.5" style={{ perspective: "1000px" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index] + index}
          initial={{ y: "110%", opacity: 0, filter: "blur(12px)", rotateX: -65 }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(12px)", rotateX: 65 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block text-[var(--highlight)] drop-shadow-[0_0_25px_rgba(181,255,109,0.4)] font-semibold tracking-tight"
          style={{ willChange: "transform, opacity, filter", transformOrigin: "50% 50% -20px" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const data = useData();
  const p = data.profile;
  const heroSocials = ["GitHub", "LinkedIn", "Instagram", "Email"];

  return (
    <section
      id="home"
      className="relative w-full min-h-[92vh] pb-20 pt-36 sm:pt-40 md:pt-44 md:pb-24 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1536px] px-6 md:px-12 flex flex-col justify-between min-h-[calc(92vh-10rem)] relative z-10">
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
            className="max-w-5xl select-none font-display text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.08] tracking-tight"
          >
            {p.heroPre}{" "}
            <RotatingHighlight words={p.rotatingWords?.length ? p.rotatingWords : [p.heroHighlight || "solusi digital"]} />{" "}
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
          <div className="flex flex-wrap gap-6 font-display text-xs font-medium uppercase tracking-[0.3em] text-[var(--muted-foreground)] md:text-sm">
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
      </div>
    </section>
  );
}
