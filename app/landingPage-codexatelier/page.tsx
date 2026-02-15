"use client";

import { useEffect } from "react";
import { IBM_Plex_Mono, Playfair_Display, Source_Serif_4 } from "next/font/google";
import HeroSection from "./_components/HeroSection";
import StorySection from "./_components/StorySection";
import ProductShowcase from "./_components/ProductShowcase";
import SocialProof from "./_components/SocialProof";
import Differentiators from "./_components/Differentiators";
import ConversionSection from "./_components/ConversionSection";
import FooterSection from "./_components/FooterSection";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const bodyFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export default function LandingPageCodexAtelier() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const setScroll = () => {
      root.style.setProperty("--scroll-y", `${window.scrollY}`);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setScroll();
        raf = 0;
      });
    };

    const onMove = (event: MouseEvent) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    setScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.classList.add("edu-ready");

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("edu-ready");
    };
  }, []);

  return (
    <main className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]`}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-grid h-full w-full" />
        <div className="ambient-cursor h-full w-full" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <StorySection />
        <ProductShowcase />
        <SocialProof />
        <Differentiators />
        <ConversionSection />
        <FooterSection />
      </div>

      <style jsx global>{`
        :root {
          --bg: #f7f3ea;
          --bg-elevated: #efe7d6;
          --text: #1f2320;
          --muted: #5d6159;
          --line: rgba(31, 35, 32, 0.14);
          --accent: #0b5f4f;
          --accent-soft: #d6ebdf;
          --cursor-x: 50vw;
          --cursor-y: 50vh;
          --scroll-y: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body), serif;
        }

        h1,
        h2,
        h3,
        h4 {
          font-family: var(--font-display), serif;
          letter-spacing: -0.03em;
        }

        .font-mono {
          font-family: var(--font-mono), monospace;
        }

        .ambient-grid {
          background-image: linear-gradient(rgba(31, 35, 32, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 35, 32, 0.04) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(circle at 50% 30%, black 52%, transparent 100%);
          opacity: 0.5;
          animation: glide 22s linear infinite;
        }

        .ambient-cursor {
          background: radial-gradient(420px circle at var(--cursor-x) var(--cursor-y), rgba(11, 95, 79, 0.14), transparent 66%);
        }

        @keyframes glide {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(52px);
          }
        }

        .edu-ready [data-load] {
          opacity: 0;
          transform: translateY(18px);
          animation: reveal-up 0.72s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }

        .edu-ready [data-load='1'] {
          animation-delay: 0ms;
        }

        .edu-ready [data-load='2'] {
          animation-delay: 200ms;
        }

        .edu-ready [data-load='3'] {
          animation-delay: 400ms;
        }

        @keyframes reveal-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }

        [data-reveal][data-delay='1'] {
          transition-delay: 120ms;
        }

        [data-reveal][data-delay='2'] {
          transition-delay: 240ms;
        }

        [data-reveal][data-delay='3'] {
          transition-delay: 360ms;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .parallax-soft {
          transform: translateY(calc(var(--scroll-y) * -0.02));
        }

        .hover-underline {
          background: linear-gradient(currentColor, currentColor) left bottom / 0% 1px no-repeat;
          transition: background-size 0.3s ease;
        }

        .hover-underline:hover {
          background-size: 100% 1px;
        }

        .magnetic {
          transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
        }

        .magnetic:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 36px rgba(11, 95, 79, 0.22);
        }

        .grain::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image: radial-gradient(rgba(31, 35, 32, 0.18) 0.4px, transparent 0.4px);
          background-size: 3px 3px;
          mix-blend-mode: multiply;
        }
      `}</style>
    </main>
  );
}
