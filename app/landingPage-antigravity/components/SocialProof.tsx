export default function SocialProof() {
    const testimonials = [
        {
            name: "Meera G.",
            role: "Junior College Student",
            quote: "The topic-wise analytics helped me raise chemistry accuracy from 61% to 84% in six weeks.",
            metric: "84% Accuracy",
        },
        {
            name: "Arjun P.",
            role: "Entrance Exam Aspirant",
            quote: "Mock exams felt close to the real paper format, so I stayed calm and managed time better.",
            metric: "+19 Score Gain",
        },
        {
            name: "Kavita Rao",
            role: "Physics Teacher",
            quote: "I can track where my students struggle and assign targeted practice instead of generic worksheets.",
            metric: "3x Better Follow-up",
        },
        {
            name: "NXT Prep Academy",
            role: "Coaching Partner",
            quote: "EduPrep gave us one digital system for lessons, tests, and reports without adding admin burden.",
            metric: "1 Unified Platform",
        },
    ];

    return (
        <section id="results" className="py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-balance">Outcomes That Matter to Learners and Teachers</h2>
                    <p className="mt-4 text-lg text-[var(--muted)] text-pretty">From confidence in mock exams to measurable gains in topic accuracy, EduPrep is built around visible progress.</p>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    {testimonials.map((item) => (
                        <article key={item.name} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 hover:-translate-y-1 transition-transform">
                            <p className="text-pretty leading-relaxed">"{item.quote}"</p>
                            <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-[var(--muted)]">{item.role}</p>
                                </div>
                                <span className="text-xs font-mono tabular-nums px-3 py-1.5 rounded-full bg-[var(--surface-alt)] border border-[var(--border)]">{item.metric}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
