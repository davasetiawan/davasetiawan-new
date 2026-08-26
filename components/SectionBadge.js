"use client";

export default function SectionBadge({ text, icon: Icon, align = "center" }) {
  return (
    <div
      className={`flex items-center gap-2 text-[var(--highlight)] ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {Icon ? <Icon size={17} /> : <span className="text-lg leading-none">✦</span>}
      <span className="shine-text text-xs font-medium font-display uppercase tracking-[0.2em]">
        {text}
      </span>
    </div>
  );
}
