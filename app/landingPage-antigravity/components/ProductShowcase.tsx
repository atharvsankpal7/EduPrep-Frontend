"use client";

import { useState } from "react";

const modules = [
    {
        id: "structured",
        title: "Structured Learning",
        summary: "Topic-wise lessons with clear progression paths.",
        points: ["Video lessons and concise notes", "Level-based concept sequencing", "Revision checkpoints by topic"],
    },
    {
        id: "practice",
        title: "Smart Practice",
        summary: "Concept-linked questions with instant feedback.",
        points: ["Difficulty-balanced question sets", "Detailed step-by-step solutions", "Weak-area focused quizzes"],
    },
    {
        id: "mock",
        title: "Mock Tests & Assessments",
        summary: "Real exam simulation with timed sections.",
        points: ["Full-length and sectional tests", "Auto-evaluation and score split", "Resume exactly where you paused"],
    },
    {
        id: "analytics",
        title: "Performance Analytics",
        summary: "Clarity on strengths, gaps, and score trajectory.",
        points: ["Topic-wise accuracy tracking", "Speed trends over time", "Personalized improvement suggestions"],
    },
];

export default function ProductShowcase() {
    const [active, setActive] = useState(modules[0]);

    return (
        <section id="platform" className="py-24">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
                    <div>
                        <h2 className="font-heading text-4xl md:text-5xl text-balance font-bold">Inside the EduPrep Platform</h2>
                        <p className="mt-5 text-lg text-pretty text-[var(--muted)]">
                            Every tool in EduPrep is connected, so students and educators move from concept to measurable improvement without switching between disconnected systems.
                        </p>
                        <div className="mt-8 space-y-3">
                            {modules.map((module) => (
                                <button
                                    key={module.id}
                                    type="button"
                                    onClick={() => setActive(module)}
                                    className={`w-full text-left rounded-2xl border p-5 transition-all ${active.id === module.id ? "border-[var(--accent)] bg-[var(--surface-alt)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)]"}`}
                                >
                                    <h3 className="font-semibold">{module.title}</h3>
                                    <p className="text-sm mt-1 text-[var(--muted)] text-pretty">{module.summary}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-heading text-2xl">{active.title}</h3>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--border)]">Live Module</span>
                        </div>
                        <p className="mt-3 text-[var(--muted)] text-pretty">{active.summary}</p>

                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            {active.points.map((point, index) => (
                                <div key={point} className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4 transition-transform hover:scale-[1.02]" style={{ animationDelay: `${index * 140}ms` }}>
                                    <p className="font-mono text-xs tabular-nums text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</p>
                                    <p className="mt-2 text-sm text-pretty">{point}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-5">
                            <p className="text-xs text-[var(--muted)]">Technical Credibility</p>
                            <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                                    <p className="font-semibold">Auto Evaluation</p>
                                    <p className="text-[var(--muted)] text-xs mt-1">Instant score and breakdown</p>
                                </div>
                                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                                    <p className="font-semibold">Timed Environment</p>
                                    <p className="text-[var(--muted)] text-xs mt-1">Exam-like pressure simulation</p>
                                </div>
                                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                                    <p className="font-semibold">Progress Model</p>
                                    <p className="text-[var(--muted)] text-xs mt-1">Accuracy and speed trajectory</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
