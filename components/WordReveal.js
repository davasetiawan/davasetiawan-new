"use client";

import { motion } from "framer-motion";

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};
const child = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WordReveal({ text, className }) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  return (
    <motion.span
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </motion.span>
  );
}
