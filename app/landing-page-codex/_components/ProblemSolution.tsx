export default function ProblemSolution() {
  return (
    <section id="journey" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="journey grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div data-reveal data-delay="1" className="journey-step">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">The journey</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Practice moves in stages, not scattered attempts.
          </h2>
          <p className="mt-4 text-base text-[var(--muted)]">
            EduPrep reveals what to do next as you scroll: set a goal, build a test, experience real exam discipline, and review instantly.
          </p>
        </div>
        <div className="journey-step rounded-3xl border border-[var(--line)] bg-[var(--paper-deep)] p-8">
          <div className="grid gap-6">
            {[
              {
                title: "1. Choose the goal",
                detail: "Select CET, 11th, or 12th and define what matters this week.",
              },
              {
                title: "2. Build the test",
                detail: "Pick subjects, chapters, and timing. A new paper is generated.",
              },
              {
                title: "3. Attempt with discipline",
                detail: "Full-screen mode, tab monitoring, and auto-submit on time.",
              },
              {
                title: "4. Review instantly",
                detail: "See correct, wrong, and unattempted in seconds.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                data-reveal
                data-delay={index + 1}
                className="rounded-2xl border border-[var(--line)] bg-white/70 p-5"
              >
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="journey mt-16 grid gap-6 md:grid-cols-3">
        <div data-reveal data-delay="1" className="journey-step rounded-3xl border border-[var(--line)] bg-white/60 p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Personalized</p>
          <h3 className="mt-4 text-xl font-semibold">Create tests your way.</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Students control subjects, topics, and time without repeating papers.
          </p>
        </div>
        <div data-reveal data-delay="2" className="journey-step rounded-3xl border border-[var(--line)] bg-white/60 p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Fairness</p>
          <h3 className="mt-4 text-xl font-semibold">Randomized papers by design.</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Every student gets a unique paper with real CET distribution.
          </p>
        </div>
        <div data-reveal data-delay="3" className="journey-step rounded-3xl border border-[var(--line)] bg-white/60 p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Instant</p>
          <h3 className="mt-4 text-xl font-semibold">Results without waiting.</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Immediate feedback with shareable links and clear next steps.
          </p>
        </div>
      </div>
    </section>
  );
}
