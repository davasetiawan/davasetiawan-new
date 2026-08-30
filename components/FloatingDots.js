"use client";

import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 43.7) % 100}%`,
  top: `${(index * 67.3) % 100}%`,
  delay: `${-(index % 12)}s`,
  duration: `${7 + (index % 6) * 1.5}s`,
  driftX: `${index % 2 === 0 ? 1 : -1}`,
  driftY: `${index % 3 === 0 ? 1 : -1}`,
  size: `${1 + (index % 3)}px`,
}));

export default function FloatingDots() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !window.matchMedia("(pointer: fine)").matches) return;

    const moveSpotlight = (event) => {
      layer.style.setProperty("--pointer-x", `${event.clientX}px`);
      layer.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", moveSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", moveSpotlight);
  }, []);

  return (
    <div ref={layerRef} className="ambient-background" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-spotlight" />
      <div className="ambient-particles">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="ambient-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--delay": particle.delay,
              "--duration": particle.duration,
              "--drift-x": particle.driftX,
              "--drift-y": particle.driftY,
            }}
          />
        ))}
      </div>
    </div>
  );
}
