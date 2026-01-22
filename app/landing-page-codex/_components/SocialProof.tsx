const testimonials = [
  {
    name: "Sakshi D.",
    role: "CET aspirant",
    quote:
      "The section locks felt like the real CET. My confidence shot up after two mocks.",
  },
  {
    name: "Prof. Kale",
    role: "Junior college coordinator",
    quote:
      "Teachers finally stopped manual checking. Results and flags are all in one place.",
  },
];

const customers = [
  "Vantage Junior College",
  "Spectrum CET Hub",
  "Prism Academy",
  "Nova Coaching",
  "Meridian Institute",
  "Orbit Learning",
];

export default function SocialProof() {
  return (
    <section id="results" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="journey flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div data-reveal data-delay="1" className="journey-step">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Social proof</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Results that matter to students and teachers.</h2>
        </div>
        <div className="journey-step grid gap-4 text-sm text-[var(--muted)]" data-reveal data-delay="2">
          <div className="rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-4 py-2">Randomized papers for every attempt</div>
          <div className="rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-4 py-2">Results in seconds, not days</div>
        </div>
      </div>

      <div className="journey mt-12 grid gap-6 md:grid-cols-2">
        {testimonials.map((item, index) => (
          <div
            key={item.name}
            data-reveal
            data-delay={index + 1}
            className="journey-step rounded-3xl border border-[var(--line)] bg-white/70 p-6"
          >
            <p className="text-sm text-[var(--muted)]">“{item.quote}”</p>
            <div className="mt-6">
              <p className="text-base font-semibold">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{item.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="journey mt-14 grid gap-6 md:grid-cols-2">
        <div data-reveal data-delay="1" className="journey-step rounded-3xl border border-[var(--line)] bg-[var(--paper-deep)] p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Teacher benefits</p>
          <div className="mt-6 grid gap-4">
            {[
              "Share tests without paper setting",
              "Track tab-switch and auto-submit flags",
              "See performance trends across the batch",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
                <span>{item}</span>
                <span className="mono text-xs text-[var(--accent)]">Live</span>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal data-delay="2" className="journey-step rounded-3xl border border-[var(--line)] bg-white/70 p-6">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Institutions</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {customers.map((name) => (
              <div
                key={name}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-4 text-center transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
