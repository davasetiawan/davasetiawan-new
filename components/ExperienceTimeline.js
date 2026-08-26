"use client";

import { motion } from "framer-motion";
import SectionBadge from "./SectionBadge";
import WordReveal from "./WordReveal";
import { useData } from "../lib/store";

export default function ExperienceTimeline() {
  const data = useData();
  const items = data.experience || [];

  return (
    <section id="experience" className="container mx-auto px-6 py-24 md:py-32">
      <div className="mb-20 flex flex-col items-center text-center md:mb-24">
        <div className="mb-4">
          <SectionBadge text="Career Path" />
        </div>
        <h2 className="mb-6 flex flex-wrap justify-center gap-x-4 font-display text-4xl font-medium md:text-5xl lg:text-6xl">
          My{" "}
          <span className="text-[var(--highlight)]">
            <WordReveal text="Experience" />
          </span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          Garis waktu perjalanan profesional saya — peran-peran kunci dan
          kontribusi di dunia teknologi.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-[23px] top-0 w-[2px] bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent" />

        {items.length === 0 ? (
          <p className="pl-16 italic text-[var(--muted-foreground)]">
            Belum ada pengalaman yang ditambahkan.
          </p>
        ) : (
          <div className="space-y-16">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="relative pl-16"
              >
                <span
                  className={`absolute left-[17px] top-1.5 block h-3.5 w-3.5 rounded-full border-2 ${
                    item.type === "work"
                      ? "border-[var(--highlight)] bg-[var(--background)] shadow-[0_0_10px_var(--highlight)]"
                      : "border-[var(--muted-foreground)] bg-[var(--background)]"
                  }`}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
                    {item.period}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                      item.type === "work"
                        ? "border-[color-mix(in_srgb,var(--highlight)_35%,transparent)] bg-[color-mix(in_srgb,var(--highlight)_10%,transparent)] text-[var(--highlight)]"
                        : "border-[var(--border-strong)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {item.type === "work" ? "WORK" : "EDUCATION"}
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-xl font-medium md:text-2xl">
                  {item.role}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[var(--highlight)]">
                  @ {item.org}
                </p>
                <p className="mt-3 leading-relaxed text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
