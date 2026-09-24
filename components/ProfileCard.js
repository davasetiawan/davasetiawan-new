"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { RotateCw, Mail, MapPin, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { useData } from "../lib/store";

export default function ProfileCard({ photoUrl, handle, name, role }) {
  const data = useData();
  const profile = data?.profile || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18 });

  const move = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 16);
    rx.set(-(py - 0.5) * 16);
    cardRef.current?.style.setProperty("--mx", `${px * 100}%`);
    cardRef.current?.style.setProperty("--my", `${py * 100}%`);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
    cardRef.current?.style.setProperty("--mx", "50%");
    cardRef.current?.style.setProperty("--my", "50%");
  };

  const handleFlip = (e) => {
    if (e.target.closest("a") || e.target.closest(".pcard-contact-btn")) {
      return;
    }
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="pcard-scene relative w-full max-w-[270px] md:max-w-[380px] [perspective:1400px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--highlight)_20%,transparent)] blur-[80px]" />

      <div
        className="pcard-wrapper"
        style={{ "--behind-glow-color": "rgba(181,255,109,0.45)" }}
        onMouseMove={move}
        onMouseLeave={leave}
      >
        <div className="pcard-behind" />
        <div className="pcard-shell overflow-hidden">
          <motion.div
            ref={cardRef}
            className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
            style={{ rotateX, rotateY }}
            onClick={handleFlip}
          >
            {/* 3D Flip Inner Container */}
            <motion.div
              className="relative h-full w-full [transform-style:preserve-3d]"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* ─── FRONT FACE (Original ProfileCard layout & CSS classes) ─── */}
              <div
                className="absolute inset-0 h-full w-full rounded-[calc(1.6rem-2.5px)] overflow-hidden bg-[#0a0f0b] [backface-visibility:hidden] [WebkitBackfaceVisibility:hidden]"
                style={{ transform: "rotateY(0deg)" }}
              >
             

                <div className="pcard-details">
                  <h3 className="font-display text-2xl font-semibold text-white">{name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{role}</p>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={name}
                  loading="lazy"
                  className="absolute inset-0 z-10 h-full w-full rounded-[inherit] object-cover"
                />

                <div className="pcard-glare" />
                <div className="pcard-shine" />

                <div className="pcard-user-info">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="pcard-mini-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="pcard-handle truncate">{handle || "@user"}</div>
                      <div className="pcard-status">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                        </span>
                        Online
                      </div>
                    </div>
                  </div>
                  <a href="#contact" onClick={(e) => e.stopPropagation()}>
                    <button type="button" suppressHydrationWarning className="pcard-contact-btn">
                      Contact Me
                    </button>
                  </a>
                </div>
              </div>

              {/* ─── BACK FACE ─── */}
              <div
                className="absolute inset-0 h-full w-full rounded-[calc(1.6rem-2.5px)] overflow-hidden bg-[#0a0f0b] p-5 flex flex-col justify-between [backface-visibility:hidden] [WebkitBackfaceVisibility:hidden] border border-white/10"
                style={{
                  transform: "rotateY(180deg)",
                  background: "radial-gradient(circle at 50% 0%, #152219 0%, #0a0f0b 80%)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                 
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] tracking-wider text-white/90 border border-white/20 hover:border-white/50 transition-all"
                    title="Flip Back"
                  >
                    <RotateCw size={11} /> FRONT
                  </button>
                </div>

                {/* Profile Avatar & Info */}
                <div className="flex flex-col items-center text-center my-auto py-1">
                  <div className="relative mb-2.5 h-16 w-16 md:h-20 md:w-20 rounded-full p-0.5 bg-gradient-to-tr from-[var(--highlight)] to-emerald-500 shadow-[0_0_20px_rgba(181,255,109,0.3)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="" className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white leading-tight">
                    {name}
                  </h3>
                  <div className="pcard-handle mt-0.5 text-xs text-[var(--highlight)] font-mono">
                    {handle || "@davasetiawan"}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-[240px] line-clamp-2 leading-snug">
                    {role}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="flex flex-col gap-2 my-1 bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-sm text-left">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span className="truncate text-[11px]">{profile.availability || "AVAILABLE FOR FREELANCE & JOBS"}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <MapPin size={13} className="text-[var(--highlight)] shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2 text-xs text-white/80 truncate">
                      <Mail size={13} className="text-[var(--highlight)] shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <p className="text-[10px] font-mono tracking-widest text-[var(--muted-foreground)] uppercase text-center">
                    Connect With Me
                  </p>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {(profile.socials || []).slice(0, 4).map((soc, idx) => (
                      <a
                        key={soc.label + idx}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white hover:bg-[var(--highlight)] hover:text-black transition-all border border-white/10"
                      >
                        {soc.label} <ExternalLink size={9} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
