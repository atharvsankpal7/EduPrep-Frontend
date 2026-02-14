export default function TechnicalDifferentiators() {
    const rows = [
        { feature: "Guided goal-to-plan workflow", eduprep: "Included", others: "Partial" },
        { feature: "Concept-mapped practice questions", eduprep: "Included", others: "Rare" },
        { feature: "Full-length and sectional mock tests", eduprep: "Included", others: "Basic" },
        { feature: "Topic-wise speed and accuracy tracking", eduprep: "Included", others: "Limited" },
        { feature: "Personalized improvement suggestions", eduprep: "Included", others: "Minimal" },
        { feature: "Built for self-learners and institutes", eduprep: "Included", others: "Not consistent" },
    ];

    return (
        <section className="py-24">
            <div className="container mx-auto px-6 max-w-5xl">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-balance">Technical Differentiators</h2>
                <p className="text-center mt-4 text-[var(--muted)] text-pretty">EduPrep focuses on measurable preparation quality, not just content volume.</p>

                <div className="mt-10 rounded-3xl border border-[var(--border)] overflow-hidden">
                    <div className="grid grid-cols-3 bg-[var(--surface)] font-semibold text-sm">
                        <div className="p-4 border-b border-[var(--border)]">Capability</div>
                        <div className="p-4 border-b border-[var(--border)] text-center">EduPrep</div>
                        <div className="p-4 border-b border-[var(--border)] text-center text-[var(--muted)]">Typical Tools</div>
                    </div>
                    {rows.map((row) => (
                        <div key={row.feature} className="grid grid-cols-3 text-sm bg-[var(--surface-alt)]/40 even:bg-transparent">
                            <div className="p-4 border-b border-[var(--border)] text-pretty">{row.feature}</div>
                            <div className="p-4 border-b border-[var(--border)] text-center font-medium text-[var(--accent)]">{row.eduprep}</div>
                            <div className="p-4 border-b border-[var(--border)] text-center text-[var(--muted)]">{row.others}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
