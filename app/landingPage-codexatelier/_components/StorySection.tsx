const journey = [
  {
    title: "Choose a target",
    detail: "Students start with a concrete exam, subject, or skill milestone.",
  },
  {
    title: "Follow guided learning",
    detail: "Topic-wise lessons and notes replace random video hopping.",
  },
  {
    title: "Practice with intent",
    detail: "Each question set maps to specific concepts and difficulty levels.",
  },
  {
    title: "Simulate exam pressure",
    detail: "Timed mocks mirror the pace and structure of real assessments.",
  },
  {
    title: "Refine by analytics",
    detail: "Weak zones surface automatically with focused improvement suggestions.",
  },
];

export default function StorySection() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div data-reveal className="parallax-soft space-y-6 lg:sticky lg:top-20 lg:h-fit">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Problem to Progress</p>
          <h2 className="text-4xl leading-tight md:text-5xl">From scattered studying to measurable momentum.</h2>
          <p className="text-lg text-[var(--muted)]">Most students do not fail from low effort. They fail from low direction. EduPrep removes guesswork by aligning what to learn, what to practice, and what to improve next.</p>
          <div className="rounded-2xl border border-[var(--line)] bg-[#faf8f2] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Real-world scenario</p>
            <p className="mt-3 text-[15px] text-[var(--muted)]">A junior college student preparing for entrance exams completes a sectional mock, sees accuracy drop in quantitative reasoning, then receives a tailored concept path and practice stack for the next week.</p>
          </div>
        </div>

        <ol className="space-y-4">
          {journey.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              data-delay={String((index % 3) + 1)}
              className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[#f9f5ec] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Step {String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">{item.detail}</p>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 -translate-x-full bg-gradient-to-r from-transparent to-[var(--accent-soft)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
