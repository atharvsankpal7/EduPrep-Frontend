const comparison = [
  {
    point: "Learning path",
    traditional: "Static PDFs and disconnected notes",
    eduprep: "Guided sequence by goal and current readiness",
  },
  {
    point: "Practice design",
    traditional: "Random question banks",
    eduprep: "Concept-mapped and difficulty-balanced sets",
  },
  {
    point: "Exam simulation",
    traditional: "Infrequent tests with delayed review",
    eduprep: "Timed mocks with instant score diagnostics",
  },
  {
    point: "Progress tracking",
    traditional: "Manual estimate and guesswork",
    eduprep: "Trend analytics across accuracy and speed",
  },
];

export default function Differentiators() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div data-reveal className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Technical Differentiators</p>
        <h2 className="mt-2 text-4xl md:text-5xl">Built for outcomes, not content overload.</h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[#f9f5ec]">
        <div className="grid grid-cols-3 border-b border-[var(--line)] bg-[#f2ecdf] p-4 text-sm font-semibold md:p-5">
          <span>Dimension</span>
          <span className="text-[var(--muted)]">Conventional Tools</span>
          <span className="text-[var(--accent)]">EduPrep</span>
        </div>
        {comparison.map((row, index) => (
          <div
            key={row.point}
            data-reveal
            data-delay={String((index % 3) + 1)}
            className="grid grid-cols-1 gap-3 border-b border-[var(--line)] p-4 md:grid-cols-3 md:p-5"
          >
            <p className="font-semibold">{row.point}</p>
            <p className="text-[var(--muted)]">{row.traditional}</p>
            <p className="text-[var(--accent)]">{row.eduprep}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
