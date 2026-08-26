"use client";

import { useEffect, useRef } from "react";

export default function StripesBackground() {
  const wrapRef = useRef(null);
  const litRef = useRef(null);
  const target = useRef({ x: -600, y: -600 });
  const pos = useRef({ x: -600, y: -600 });
  const active = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const lit = litRef.current;
    if (!wrap || !lit) return;

    let raf = 0;
    const loop = () => {
      if (wrap.offsetParent !== null) {
        pos.current.x += (target.current.x - pos.current.x) * 0.09;
        pos.current.y += (target.current.y - pos.current.y) * 0.09;
        lit.style.setProperty("--tx", `${pos.current.x}px`);
        lit.style.setProperty("--ty", `${pos.current.y}px`);
        lit.style.setProperty("--on", active.current ? "1" : "0");
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width) return;
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      active.current =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden opacity-40 dark:block"
    >
      <div className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
        <div className="stripes-base absolute inset-0" />
        <div ref={litRef} className="stripes-lit absolute inset-0" />
      </div>
      <div className="grain absolute inset-0" />
    </div>
  );
}
