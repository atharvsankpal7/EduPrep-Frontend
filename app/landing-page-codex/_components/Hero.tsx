"use client";

import { useState } from "react";
import MagneticButton from "./MagneticButton";

const goals = [
  {
    id: "plan",
    label: "Plan",
    title: "Choose what you want to practice",
    detail: "Subjects, topics, question count, and duration in minutes.",
    stat: "Made for 11th, 12th, CET",
  },
  {
    id: "attempt",
    label: "Attempt",
    title: "Write under real exam discipline",
    detail: "Full-screen mode, tab monitoring, and auto-submit on time.",
    stat: "CET-style section locks",
  },
  {
    id: "learn",
    label: "Learn",
    title: "Get instant, actionable insights",
    detail: "Correct, wrong, unattempted with shareable result links.",
    stat: "Immediate evaluation",
  },
];

export default function Hero() {
  const [active, setActive] = useState(goals[0]);

  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-28 md:pt-14">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper-deep)] text-lg">E</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">EduPrep</p>
            <p className="mono text-[11px] text-[var(--muted)]">Guided preparation platform</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          <a className="underline-link" href="#journey">Journey</a>
          <a className="underline-link" href="#showcase">Product</a>
          <a className="underline-link" href="#results">Results</a>
          <a className="underline-link" href="#compare">Why EduPrep</a>
          <a className="underline-link" href="#enroll">Enroll</a>
        </nav>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <div className="load-reveal inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]" data-delay="0">
            Smart testing platform for Junior College & CET
          </div>
          <h1 className="load-reveal mt-6 text-4xl font-semibold leading-tight md:text-6xl" data-delay="1">
            Personalized CET practice with real exam discipline.
          </h1>
          <p className="load-reveal mt-5 max-w-xl text-base text-[var(--muted)] md:text-lg" data-delay="2">
            EduPrep turns practice into a guided journey: plan your test, attempt securely, and improve with instant insights.
          </p>
          <div className="load-reveal mt-8 flex flex-wrap items-center gap-4" data-delay="2">
            <MagneticButton className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]">
              Start Practicing Now
            </MagneticButton>
            <a className="underline-link text-sm uppercase tracking-[0.2em] text-[var(--muted)]" href="#showcase">
              Try a CET Mock Test
            </a>
          </div>
          <div className="load-reveal mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.32em] text-[var(--muted)]" data-delay="2">
            <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Auto-submit on time</span>
            <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Randomized papers</span>
            <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Instant results</span>
          </div>
        </div>

        <div className="grain relative">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--paper-deep)] p-6 shadow-xl">
            <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Journey preview</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setActive(goal)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active.id === goal.id
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white/60 p-6">
              <p className="text-lg font-semibold text-[var(--ink)]">{active.title}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{active.detail}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Live impact</span>
                <span className="text-sm font-semibold text-[var(--accent)]">{active.stat}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
              <div className="rounded-xl border border-[var(--line)] bg-white/40 px-2 py-4">11th</div>
              <div className="rounded-xl border border-[var(--line)] bg-white/40 px-2 py-4">12th</div>
              <div className="rounded-xl border border-[var(--line)] bg-white/40 px-2 py-4">CET</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
