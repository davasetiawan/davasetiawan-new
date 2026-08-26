"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFX() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth >= 1024;
    if (!fine) return;
    setEnabled(true);

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target;
      setHovering(
        target instanceof Element &&
        !!target.closest("a, button, input, textarea, select, [role='button']")
      );
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] hidden lg:block"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          animate={{
            opacity: visible ? 1 : 0,
            scale: hovering ? 1.7 : 1,
          }}
          transition={{ duration: 0.18 }}
          className="-ml-[18px] -mt-[18px] h-9 w-9 rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--highlight)_75%,transparent)] bg-[color-mix(in_srgb,var(--highlight)_8%,transparent)]"
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[97] hidden lg:block"
        style={{ x, y }}
      >
        <motion.div
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.12 }}
          className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--highlight)] shadow-[0_0_10px_var(--highlight)]"
        />
      </motion.div>
    </>
  );
}
