const rows = [
  {
    label: "Test personalization",
    eduprep: "Subjects, topics, time",
    generic: "Fixed paper sets",
  },
  {
    label: "Randomization",
    eduprep: "Unique paper every attempt",
    generic: "Repeated question sets",
  },
  {
    label: "Secure environment",
    eduprep: "Tab switch monitoring + auto-submit",
    generic: "No enforcement",
  },
  {
    label: "Instant results",
    eduprep: "Auto-evaluation + shareable link",
    generic: "Manual checking",
  },
];

export default function Differentiators() {
  return (
    <section id="compare" className="journey mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div data-reveal data-delay="1" className="journey-step">
        <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Technical differentiators</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">A system designed for fairness and exam realism.</h2>
      </div>

      <div className="journey mt-10 overflow-hidden rounded-3xl border border-[var(--line)] bg-white/70" data-reveal data-delay="2">
        <div className="grid grid-cols-3 border-b border-[var(--line)] bg-[var(--paper-deep)] text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          <div className="px-6 py-4">Capability</div>
          <div className="px-6 py-4">EduPrep</div>
          <div className="px-6 py-4">Generic practice apps</div>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-3 border-b border-[var(--line)] text-sm">
            <div className="px-6 py-4 font-semibold text-[var(--ink)]">{row.label}</div>
            <div className="px-6 py-4 text-[var(--accent)]">{row.eduprep}</div>
            <div className="px-6 py-4 text-[var(--muted)]">{row.generic}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
