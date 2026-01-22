"use client";

import { ButtonHTMLAttributes, PropsWithChildren, MouseEvent } from "react";

type MagneticButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    event.currentTarget.style.setProperty("--tx", `${x * 0.18}px`);
    event.currentTarget.style.setProperty("--ty", `${y * 0.18}px`);
  };

  const handleLeave = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--tx", "0px");
    event.currentTarget.style.setProperty("--ty", "0px");
  };

  return (
    <button
      {...props}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`magnetic ${className}`}
    >
      {children}
    </button>
  );
}
