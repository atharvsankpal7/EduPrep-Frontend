export default function ProductShowcase() {
  return (
    <section id="showcase" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="journey flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div data-reveal data-delay="1" className="journey-step">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Product showcase</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">See the platform reveal itself.</h2>
          <p className="mt-4 max-w-xl text-base text-[var(--muted)]">
            The interface is simple on purpose. As students scroll, they see only the next action they need to take.
          </p>
        </div>
        <div className="journey-step flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]" data-reveal data-delay="2">
          <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Minimal steps</span>
          <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Clear outcomes</span>
          <span className="mono rounded-full border border-[var(--line)] px-3 py-2">Exam realism</span>
        </div>
      </div>

      <div className="journey mt-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div data-reveal data-delay="1" className="journey-step parallax mockup rounded-[32px] border border-[var(--line)] bg-white/80 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            <span className="mono">Step 1 · Build</span>
            <span className="mono">Step 2 · Attempt</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
              <p className="text-sm font-semibold">Choose your test</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subjects</span>
                  <span className="mono text-xs text-[var(--muted)]">PCM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Topics</span>
                  <span className="mono text-xs text-[var(--muted)]">Custom</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Questions</span>
                  <span className="mono text-xs text-[var(--muted)]">60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time</span>
                  <span className="mono text-xs text-[var(--muted)]">75 min</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-deep)] p-4">
              <p className="text-sm font-semibold">Secure attempt</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Full-screen</span>
                  <span className="mono text-xs text-[var(--muted)]">On</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tab switches</span>
                  <span className="mono text-xs text-[var(--muted)]">0 / 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-submit</span>
                  <span className="mono text-xs text-[var(--muted)]">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Timer</span>
                  <span className="mono text-xs text-[var(--muted)]">Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { label: "Paper", value: "Unique" },
              { label: "Coverage", value: "11th + 12th" },
              { label: "Mode", value: "CET-ready" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--accent)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div data-reveal data-delay="2" className="journey-step rounded-3xl border border-[var(--line)] bg-[var(--paper-deep)] p-6">
            <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Step 3 · Review</p>
            <h3 className="mt-4 text-xl font-semibold">Results surface instantly.</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Correct, wrong, unattempted, and a shareable result link within seconds.
            </p>
            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Result link</span>
                <span className="mono">Copied</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--paper)]">
                <div className="h-2 w-2/3 rounded-full bg-[var(--accent)]" />
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">Topic-wise accuracy and speed</p>
            </div>
          </div>
          <div data-reveal data-delay="3" className="journey-step rounded-3xl border border-[var(--line)] bg-white/70 p-6">
            <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">CET-ready engine</p>
            <h3 className="mt-4 text-xl font-semibold">Built on real CET distribution.</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              11th + 12th syllabus coverage with chapter-wise weightage and 18,000+ questions.
            </p>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm">
              <span className="text-[var(--muted)]">CET sections:</span>
              <span className="mono text-[var(--accent)]">90 + 90 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
