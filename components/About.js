"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import WordReveal from "./WordReveal";
import ProfileCard from "./ProfileCard";
import { useData } from "../lib/store";

export default function About() {
  const data = useData();
  const p = data.profile;
  const techStack = data.techStack || [];

  return (
    <section
      id="about"
      className="mx-auto w-full max-w-[1536px] px-6 md:px-12 pb-12 pt-24 md:pb-20 md:pt-32"
    >
      <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-24">
        <div className="flex w-full justify-center lg:w-1/3 lg:justify-end">
          <ProfileCard
            photoUrl={p.photoUrl}
            handle={p.handle}
            name={p.name}
            role={p.role}
          />
        </div>

        <div className="w-full space-y-6 text-center md:space-y-8 lg:w-2/3 lg:text-left">
          <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
            <span className="animate-pulse text-xl text-[var(--highlight)]">✦</span>
            <span className="shine-text font-display text-xs font-medium uppercase tracking-[0.2em]">
              About Me
            </span>
          </div>

          <h2 className="font-display text-3xl font-medium leading-[1.15] md:text-5xl">
            <WordReveal
              text={p.aboutHeadline}
              className="inline-block font-semibold leading-snug"
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="whitespace-pre-line text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg"
          >
            {p.bio}
          </motion.p>

          {/* Tech Stack Chips with Logos */}
          {techStack.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 lg:justify-start">
              {techStack.map((tech, i) => (
                <div
                  key={tech.name + i}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-sm"
                >
                  {tech.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tech.logoUrl} alt="" className="h-4 w-4 object-contain" />
                  ) : null}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-[var(--muted-foreground)] lg:justify-start"
          >
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-[var(--highlight)]" />
              {p.location}
            </span>
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-2 transition-colors hover:text-[var(--highlight)]"
            >
              <Mail size={14} className="text-[var(--highlight)]" />
              {p.email}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
