"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ProfileCard({ photoUrl, handle, name, role }) {
  const cardRef = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18 });

  const glowX = useTransform(rotateY, (v) => `${50 - v * 2.2}%`);
  const glowY = useTransform(rotateX, (v) => `${50 + v * 2.2}%`);

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

  return (
    <div className="pcard-scene relative w-full max-w-[270px] md:max-w-[380px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--highlight)_20%,transparent)] blur-[80px]" />

      <div
        className="pcard-wrapper"
        style={{ "--behind-glow-color": "rgba(181,255,109,0.45)" }}
        onMouseMove={move}
        onMouseLeave={leave}
      >
        <div className="pcard-behind" />
        <div className="pcard-shell">
          <motion.section ref={cardRef} className="pcard" style={{ rotateX, rotateY }}>
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
              <a href="#contact">
                <button type="button" suppressHydrationWarning className="pcard-contact-btn">
                  Contact Me
                </button>
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
