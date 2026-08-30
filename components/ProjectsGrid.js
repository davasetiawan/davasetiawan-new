"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import SectionBadge from "./SectionBadge";
import { useData } from "../lib/store";

function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[color-mix(in_srgb,var(--highlight)_45%,transparent)] hover:shadow-[0_0_35px_-12px_var(--highlight)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[var(--secondary)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageUrl}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-medium leading-snug transition-colors group-hover:text-[var(--highlight)]">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-full border border-[var(--border-strong)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]">
            {project.year}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {(project.tags || []).map((tag) => (
            <span key={tag} className="tchip">
              {tag}
            </span>
          ))}
        </div>

        {(project.demoUrl || project.repoUrl) ? (
          <div className="flex items-center gap-2 pt-2">
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="tbtn tbtn-primary text-xs">
                <ExternalLink size={13} /> Live Demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="tbtn text-xs">
                <Github size={13} /> Source
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function ProjectsGrid() {
  const data = useData();
  const projects = data.projects || [];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="mx-auto w-full max-w-[1536px] px-6 md:px-12 relative z-10 py-20 md:py-24">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <SectionBadge text="Selected Works" align="left" />
          <h2 className="font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
            Featured
            <br />
            Projects
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)] md:text-right md:text-base">
          Kurasi karya terbaik yang menunjukkan keahlian dan hasil yang saya raih.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="col-span-full rounded-3xl border border-dashed border-[var(--border-strong)] py-20 text-center">
          <p className="text-[var(--muted-foreground)]">Belum ada proyek.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {projects.length > 4 ? (
        <div className="mt-24 flex justify-center">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="h-16 rounded-full border border-[var(--border-strong)] bg-[var(--background)] px-12 font-display text-lg font-medium shadow-sm transition-all hover:border-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--highlight-foreground)]"
            >
              View All Projects
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
