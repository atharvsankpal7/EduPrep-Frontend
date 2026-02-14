"use client";

import { useEffect } from "react";

const narrative = [
    {
        title: "Before EduPrep",
        line: "Students juggle random notes, disconnected videos, and untargeted practice.",
        detail: "Even long study hours feel uncertain because there is no sequence, no performance baseline, and no clear next step.",
    },
    {
        title: "Inside EduPrep",
        line: "Learning, practice, testing, and analytics run in one guided flow.",
        detail: "Each concept links to targeted questions, each mock mirrors exam pressure, and each attempt updates topic-wise insights.",
    },
    {
        title: "After Consistent Use",
        line: "Preparation shifts from stress-driven to confidence-driven.",
        detail: "Students and teachers can track speed, accuracy, and consistency over time and focus only on high-impact improvements.",
    },
];

export default function ProblemSolution() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-8");
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll(".story-block").forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="story" className="py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-14">
                    <h2 className="font-heading text-balance text-4xl md:text-5xl font-bold">A Better Preparation Story</h2>
                    <p className="mt-4 text-pretty text-[var(--muted)] text-lg">
                        EduPrep solves the everyday preparation gaps students and teachers face by connecting what to learn, what to practice, and what to improve next.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {narrative.map((item, index) => (
                        <article
                            key={item.title}
                            className="story-block opacity-0 translate-y-8 transition-all duration-700 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7"
                            style={{ transitionDelay: `${index * 160}ms` }}
                        >
                            <p className="text-xs font-mono tabular-nums text-[var(--accent)]">0{index + 1}</p>
                            <h3 className="mt-3 font-heading text-2xl">{item.title}</h3>
                            <p className="mt-3 text-[var(--text)] font-medium text-pretty">{item.line}</p>
                            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] text-pretty">{item.detail}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
