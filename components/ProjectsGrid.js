"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionBadge from "./SectionBadge";
import { useData } from "../lib/store";

export default function ProjectsGrid() {
  const data = useData();
  const projects = data.projects || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (activeIndex >= projects.length && projects.length > 0) {
      setActiveIndex(0);
    }
  }, [projects.length, activeIndex]);

  const handlePrev = useCallback(() => {
    if (projects.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const handleNext = useCallback(() => {
    if (projects.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const inField =
        target instanceof Element &&
        (target.closest("input, textarea, select") || target.isContentEditable);
      if (inField) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (projects.length === 0) {
    return (
      <section id="projects" className="relative z-10 py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-4">
              <SectionBadge text="Selected Works" align="left" />
              <h2 className="font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
                Featured<br />Projects
              </h2>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] py-20 text-center" style={{ borderWidth: "0.5px" }}>
            <p className="text-[var(--muted-foreground)]">Belum ada proyek.</p>
          </div>
        </div>
      </section>
    );
  }

  const activeProject = projects[activeIndex] || projects[0];
  const prevIndex = (activeIndex - 1 + projects.length) % projects.length;
  const nextIndex = (activeIndex + 1) % projects.length;
  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  return (
    <section id="projects" className="relative z-10 py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 mb-10 md:mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <SectionBadge text="Selected Works" align="left" />
          <h2 className="font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
            Featured<br />Projects
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)] md:text-right">
          Kurasi karya terbaik yang menunjukkan keahlian dan hasil yang saya raih.
        </p>
      </div>

      {/* Slider Stage */}
      <div className="relative w-full overflow-hidden" style={{ perspective: "1600px" }}>
        <div
          className="relative flex items-center justify-center"
          style={{ minHeight: "clamp(220px, 34vw, 460px)" }}
        >
          {/* LEFT GHOST */}
          {projects.length > 1 && (
            <div
              onClick={handlePrev}
              className="absolute hidden sm:block cursor-pointer select-none"
              style={{
                width: "min(680px, 72%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                marginLeft: "-32%",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  transform: "rotateY(14deg) scale(0.8)",
                  transformOrigin: "right center",
                  filter: "blur(4px) brightness(0.7) grayscale(0.5)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  pointerEvents: "none",
                }}
              >
                <div className="w-full bg-[#1a1a1a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prevProject.imageUrl}
                    alt={prevProject.title}
                    className="w-full h-auto block"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CENTER CARD */}
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={activeProject.id || activeIndex}
              custom={direction}
              initial={{
                opacity: 0,
                scale: 0.96,
                x: direction > 0 ? 90 : direction < 0 ? -90 : 0,
              }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                x: direction > 0 ? -90 : direction < 0 ? 90 : 0,
              }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-30"
              style={{ width: "min(680px, 72%)" }}
            >
              {/* Screen frame */}
              <div
                style={{
                  borderRadius: "12px 12px 0 0",
                  overflow: "hidden",
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderBottom: "none",
                  boxShadow: "0 32px 100px -12px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.05)",
                }}
              >
                {/* Top bezel */}
                <div
                  style={{
                    height: "24px",
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2d2d2d" }} />
                </div>

                {/* Screenshot */}
                <div className="relative w-full bg-[#050506] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                    className="w-full h-auto block select-none"
                    draggable={false}
                  />

                  {/* OPEN PREVIEW */}
                  {(activeProject.demoUrl || activeProject.repoUrl) && (
                    <a
                      href={activeProject.demoUrl || activeProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 z-20 flex items-center gap-1 transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
                      style={{
                        background: "rgba(255,255,255,0.97)",
                        color: "#000",
                        borderRadius: "5px",
                        padding: "5px 13px",
                        fontFamily: "monospace",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      }}
                    >
                      OPEN PREVIEW <ArrowUpRight size={10} style={{ marginLeft: "3px" }} />
                    </a>
                  )}
                </div>
              </div>

              {/* Laptop base */}
              <div
                style={{
                  height: "9px",
                  background: "linear-gradient(to bottom, #1c1c1e, #111)",
                  borderRadius: "0 0 9px 9px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: "none",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "56px", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)" }} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT GHOST */}
          {projects.length > 1 && (
            <div
              onClick={handleNext}
              className="absolute hidden sm:block cursor-pointer select-none"
              style={{
                width: "min(680px, 72%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                marginLeft: "32%",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  transform: "rotateY(-14deg) scale(0.8)",
                  transformOrigin: "left center",
                  filter: "blur(4px) brightness(0.7) grayscale(0.5)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  pointerEvents: "none",
                }}
              >
                <div className="w-full bg-[#1a1a1a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={nextProject.imageUrl}
                    alt={nextProject.title}
                    className="w-full h-auto block"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata & Controls Footer */}
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 mt-6">
        <div style={{ borderTop: "0.5px solid rgba(128,128,128,0.22)", marginBottom: "18px" }} />
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          {/* Left: title + subtitle */}
          <div className="flex flex-col gap-1">
            <AnimatePresence mode="wait">
              <motion.h3
                key={activeProject.id + "-title"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-semibold leading-none tracking-tight text-[var(--foreground)]"
                style={{ fontSize: "clamp(26px, 3.8vw, 50px)" }}
              >
                {activeProject.title}
              </motion.h3>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeProject.id + "-sub"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.24 }}
                className="font-mono uppercase tracking-widest text-[var(--muted-foreground)]"
                style={{ fontSize: "10.5px", marginTop: "5px" }}
              >
                {activeProject.description
                  ? activeProject.description.toUpperCase().slice(0, 45)
                  : (activeProject.tags?.[0] || "WEB APPLICATION").toUpperCase()}
                {" · "}
                {activeProject.year || new Date().getFullYear()}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right: tags + nav */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeProject.id + "-tags"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="font-mono uppercase tracking-widest text-[var(--muted-foreground)] text-left md:text-right"
                style={{ fontSize: "10.5px" }}
              >
                {(activeProject.tags || []).join("  ·  ")}
              </motion.p>
            </AnimatePresence>

            {projects.length > 1 && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[var(--muted-foreground)] tracking-widest opacity-60">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <button
                  suppressHydrationWarning
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    border: "0.5px solid rgba(128,128,128,0.3)",
                    background: "transparent",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--foreground)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(128,128,128,0.3)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  suppressHydrationWarning
                  onClick={handleNext}
                  aria-label="Next project"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    border: "0.5px solid rgba(128,128,128,0.3)",
                    background: "transparent",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--foreground)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(128,128,128,0.3)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}