const capabilities = [
  "Topic-mapped practice architecture",
  "Adaptive feedback loops in under 300ms",
  "Mock engine with sectional and full-length modes",
  "Analytics snapshots for students and teachers",
];

export default function ProductShowcase() {
  return (
    <section id="showcase" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Product Showcase</p>
          <h2 className="mt-2 text-4xl md:text-5xl">One interface, complete exam-prep workflow.</h2>
        </div>
        <p data-reveal data-delay="1" className="max-w-xl text-[var(--muted)]">Designed for daily use by students and educators, EduPrep keeps lessons, practice, mocks, and progress in one uninterrupted flow.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div data-reveal data-delay="1" className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[#f9f5ec] p-4 md:p-6">
          <div className="parallax-soft rounded-[1.4rem] border border-[var(--line)] bg-[#fffdf8] p-5 shadow-[0_24px_50px_rgba(31,35,32,0.12)]">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Mock Test Console</p>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent)]">Live session</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--line)] p-4">
                <p className="text-xs text-[var(--muted)]">Time left</p>
                <p className="mt-2 text-2xl font-semibold">24:18</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] p-4">
                <p className="text-xs text-[var(--muted)]">Questions solved</p>
                <p className="mt-2 text-2xl font-semibold">37 / 50</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] p-4">
                <p className="text-xs text-[var(--muted)]">Projected score</p>
                <p className="mt-2 text-2xl font-semibold">81.4</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Quantitative Aptitude</span>
                  <span className="text-[var(--muted)]">72%</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6dfd1]">
                  <div className="h-full w-[72%] rounded-full bg-[var(--accent)]" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Reasoning</span>
                  <span className="text-[var(--muted)]">88%</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6dfd1]">
                  <div className="h-full w-[88%] rounded-full bg-[var(--accent)]" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Language</span>
                  <span className="text-[var(--muted)]">79%</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6dfd1]">
                  <div className="h-full w-[79%] rounded-full bg-[var(--accent)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {capabilities.map((capability, index) => (
            <div
              key={capability}
              data-reveal
              data-delay={String((index % 3) + 1)}
              className="rounded-2xl border border-[var(--line)] bg-[#faf7ef] p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Capability {index + 1}</p>
              <p className="mt-2 text-lg">{capability}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
