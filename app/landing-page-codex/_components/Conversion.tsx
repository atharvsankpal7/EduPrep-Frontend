"use client";

import MagneticButton from "./MagneticButton";

export default function Conversion() {
  return (
    <section id="enroll" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="journey grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div data-reveal data-delay="1" className="journey-step">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Conversion</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Upgrade the way you prepare for exams.</h2>
          <p className="mt-4 text-base text-[var(--muted)]">
            Whether you are a student aiming for CET success or an institute modernizing testing, EduPrep delivers clarity, fairness, and results.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]">
              Get Started with EduPrep Today
            </MagneticButton>
            <a className="underline-link text-sm uppercase tracking-[0.2em] text-[var(--muted)]" href="#showcase">
              Create Your First Test
            </a>
          </div>
        </div>

        <form data-reveal data-delay="2" className="journey-step rounded-3xl border border-[var(--line)] bg-white/80 p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Start rollout</p>
          <div className="mt-6 grid gap-4">
            <input
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="Full name"
              name="name"
            />
            <input
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="Email address"
              type="email"
              name="email"
            />
            <input
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="College / Coaching institute"
              name="company"
            />
          </div>
          <MagneticButton
            type="submit"
            className="mt-6 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
          >
            Send my details
          </MagneticButton>
          <p className="mt-4 text-xs text-[var(--muted)]">We respond within 24 hours with a tailored rollout plan.</p>
        </form>
      </div>
    </section>
  );
}
