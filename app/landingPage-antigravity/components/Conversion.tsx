"use client";

import Link from "next/link";

export default function Conversion() {
    return (
        <section id="enroll" className="py-24">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-balance">Start your next preparation cycle with clarity.</h2>
                            <p className="mt-5 text-[var(--muted)] text-lg text-pretty">
                                Seats for guided onboarding batches are filled weekly. Join now to set your goal, start structured learning, and get your first analytics report.
                            </p>
                            <div className="mt-7 flex gap-3 flex-wrap">
                                <Link href="/sign-up" className="px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--bg)] font-semibold hover:bg-[var(--accent-strong)] transition-colors">Create Free Account</Link>
                                <button type="button" className="px-6 py-3 rounded-full border border-[var(--border)] hover:bg-[var(--surface-alt)] transition-colors">Book a Demo Session</button>
                            </div>
                        </div>

                        <form className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-6 space-y-4" action="#" method="post">
                            <label className="block text-sm">
                                <span className="block mb-1 text-[var(--muted)]">Name</span>
                                <input name="name" type="text" required className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                            </label>
                            <label className="block text-sm">
                                <span className="block mb-1 text-[var(--muted)]">Email</span>
                                <input name="email" type="email" required className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                            </label>
                            <label className="block text-sm">
                                <span className="block mb-1 text-[var(--muted)]">Company</span>
                                <input name="company" type="text" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
                            </label>
                            <button type="submit" className="w-full rounded-lg bg-[var(--accent)] text-[var(--bg)] py-2.5 font-semibold hover:bg-[var(--accent-strong)] transition-colors">Request Access</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

