"use client";

import { useEffect } from "react";
import Hero from "./_components/Hero";
import ProblemSolution from "./_components/ProblemSolution";
import ProductShowcase from "./_components/ProductShowcase";
import SocialProof from "./_components/SocialProof";
import Differentiators from "./_components/Differentiators";
import Conversion from "./_components/Conversion";
import Footer from "./_components/Footer";

export default function LandingPageCodex() {
  useEffect(() => {
    const root = document.documentElement;
    let rafScroll = 0;
    let rafMove = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onScroll = () => {
      if (rafScroll) return;
      rafScroll = window.requestAnimationFrame(() => {
        root.style.setProperty("--scrollY", `${window.scrollY}`);
        rafScroll = 0;
      });
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (rafMove) return;
      rafMove = window.requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${mouseX}`);
        root.style.setProperty("--my", `${mouseY}`);
        rafMove = 0;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.classList.add("page-ready");

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      if (rafScroll) cancelAnimationFrame(rafScroll);
      if (rafMove) cancelAnimationFrame(rafMove);
      observer.disconnect();
      document.body.classList.remove("page-ready");
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden>
        <div className="ambient" />
      </div>
      <Hero />
      <ProblemSolution />
      <ProductShowcase />
      <SocialProof />
      <Differentiators />
      <Conversion />
      <Footer />
      <style jsx global>{`
        :root {
          --paper: #ffffff;
          --paper-deep: #eef8f1;
          --ink: #1b1f23;
          --muted: #5b6b70;
          --accent: #68aef3;
          --accent-dark: #3f84d0;
          --line: rgba(27, 31, 35, 0.12);
          --scrollY: 0;
          --mx: 50vw;
          --my: 50vh;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family: "Source Serif 4", serif;
          background: var(--paper);
          color: var(--ink);
        }

        h1, h2, h3, h4 {
          font-family: "Playfair Display", serif;
          letter-spacing: -0.02em;
        }

        .mono {
          font-family: "IBM Plex Mono", monospace;
        }

        .ambient {
          position: absolute;
          inset: -30vh -20vw;
          background:
            radial-gradient(700px circle at var(--mx) var(--my), rgba(104, 174, 243, 0.22), transparent 60%),
            radial-gradient(900px circle at 12% 18%, rgba(209, 240, 226, 0.5), transparent 62%),
            linear-gradient(120deg, rgba(41, 111, 176, 0.08), transparent 55%);
          filter: blur(0px);
          animation: drift 18s ease-in-out infinite alternate;
        }

        @keyframes drift {
          0% { transform: translate3d(-2%, -1%, 0); }
          100% { transform: translate3d(2%, 1%, 0); }
        }

        .grain {
          position: relative;
        }

        .grain:before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
          pointer-events: none;
          opacity: 0.35;
        }

        .page-ready .load-reveal {
          opacity: 0;
          animation: rise 0.9s ease forwards;
        }

        .page-ready .load-reveal[data-delay="1"] { animation-delay: 0.2s; }
        .page-ready .load-reveal[data-delay="2"] { animation-delay: 0.4s; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        [data-reveal][data-delay="1"] { transition-delay: 0.15s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.3s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.45s; }
        [data-reveal][data-delay="4"] { transition-delay: 0.6s; }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .parallax {
          transform: translateY(calc(var(--scrollY) * -0.02));
        }

        .underline-link {
          position: relative;
        }

        .underline-link:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .underline-link:hover:after {
          transform: scaleX(1);
        }

        .magnetic {
          transform: translate3d(var(--tx, 0), var(--ty, 0), 0);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .magnetic:hover {
          box-shadow: 0 14px 40px rgba(155, 63, 45, 0.2);
        }

        .mockup {
          box-shadow: 0 30px 80px rgba(27, 26, 22, 0.18);
        }

        .journey {
          position: relative;
        }

        .journey:before {
          content: "";
          position: absolute;
          left: 14px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--line);
        }

        .journey-step {
          position: relative;
          padding-left: 36px;
        }

        .journey-step:before {
          content: "";
          position: absolute;
          left: 8px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 0 6px rgba(104, 174, 243, 0.25);
        }

        .float {
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  );
}
