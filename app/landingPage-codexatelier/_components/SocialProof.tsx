const testimonials = [
  {
    quote: "My students stopped asking where to begin. EduPrep gives them a precise sequence and I can monitor consistency without extra admin work.",
    name: "Ritika Sharma",
    role: "Mathematics Teacher, Pune",
  },
  {
    quote: "The mock pattern felt close to my entrance exam. The analysis after each test made revision far more strategic.",
    name: "Aman Verma",
    role: "Junior College Student, Mumbai",
  },
  {
    quote: "We adopted EduPrep for our coaching batches and saw stronger retention because students practiced with purpose, not just volume.",
    name: "S. Krishnan",
    role: "Academic Director, Chennai",
  },
];

const metrics = [
  { label: "Weekly active learners", value: "94k+" },
  { label: "Average mock completion", value: "86%" },
  { label: "Teacher dashboard adoption", value: "91%" },
  { label: "Median score improvement", value: "+18.6%" },
];

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Social Proof</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Trusted by learners and educators who value measurable progress.</h2>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            data-reveal
            data-delay={String((index % 3) + 1)}
            className="rounded-2xl border border-[var(--line)] bg-[#faf6ee] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <article
            key={testimonial.name}
            data-reveal
            data-delay={String((index % 3) + 1)}
            className="group rounded-2xl border border-[var(--line)] bg-[#f9f4ea] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <p className="text-lg leading-relaxed">“{testimonial.quote}”</p>
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
