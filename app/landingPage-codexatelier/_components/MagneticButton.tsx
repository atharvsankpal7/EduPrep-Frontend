"use client";

import { type MouseEvent, useRef } from "react";

type MagneticButtonProps = {
  label: string;
  href: string;
  variant?: "solid" | "ghost";
};

export default function MagneticButton({ label, href, variant = "solid" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  const onMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const offsetY = (event.clientY - rect.top - rect.height / 2) * 0.16;
    buttonRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const onMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`magnetic inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
        variant === "solid"
          ? "bg-[var(--accent)] text-[#f7f3ea]"
          : "border border-[var(--line)] bg-[#f7f3ea]/80 text-[var(--text)] backdrop-blur"
      }`}
    >
      {label}
    </a>
  );
}
