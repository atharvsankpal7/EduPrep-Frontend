"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
    const [mounted, setMounted] = useState(false);
    const [goal, setGoal] = useState("Competitive Exams");

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="top" className="relative min-h-dvh flex items-center pt-24 pb-16">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl">
                    <p className={`text-xs font-semibold uppercase text-[var(--accent)] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Trusted by students, teachers, and coaching teams
                    </p>
                    <h1 className={`mt-5 font-heading text-balance text-5xl md:text-7xl leading-[1.06] font-bold transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Focused prep. Measurable growth. Confident exam performance.
                    </h1>
                    <p className={`mt-6 text-pretty text-lg text-[var(--muted)] max-w-xl transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        EduPrep combines structured learning, smart practice, realistic mock tests, and performance analytics so preparation becomes guided instead of guess-based.
                    </p>
                    <div className={`mt-10 flex flex-wrap gap-4 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <Link href="#enroll" className="px-7 py-3.5 rounded-full bg-[var(--accent)] text-[var(--bg)] font-semibold hover:bg-[var(--accent-strong)] transition-colors">Try EduPrep</Link>
                        <Link href="#platform" className="px-7 py-3.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:scale-105 transition-transform">See How It Works</Link>
                    </div>
                    <div className={`mt-10 flex flex-wrap gap-3 text-xs text-[var(--muted)] transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        {[
                            "Curriculum-aligned content",
                            "Exam-condition mock testing",
                            "Topic-wise accuracy and speed tracking",
                        ].map((item) => (
                            <span key={item} className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)]">{item}</span>
                        ))}
                    </div>
                </div>

                <div className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <h2 className="font-heading text-xl">Personal Study Flow</h2>
                        <span className="px-2.5 py-1 rounded-full text-xs bg-[var(--surface-alt)]">Live Demo</span>
                    </div>
                    <div className="mt-5 space-y-4">
                        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-alt)]">
                            <p className="text-xs text-[var(--muted)] mb-3">Choose your goal</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {["Competitive Exams", "School Assessments", "Skill-based Tests", "Aptitude Practice"].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setGoal(item)}
                                        className={`rounded-lg px-3 py-2 border transition-colors ${goal === item ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]" : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-alt)]"}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[var(--border)] p-4">
                            <p className="text-xs text-[var(--muted)] mb-2">Current Path</p>
                            <p className="font-semibold">{goal}</p>
                            <div className="mt-4 space-y-2">
                                {["Learn concepts", "Practice mapped questions", "Attempt timed mock", "Review weak areas"].map((step, index) => (
                                    <div key={step} className="flex items-center justify-between rounded-lg bg-[var(--surface-alt)] px-3 py-2 text-sm">
                                        <span>{index + 1}. {step}</span>
                                        <span className="font-mono text-[var(--muted)]">{index < 2 ? "In progress" : "Queued"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
