"use client";

import Link from "next/link";

type Theme = "dark" | "light";

export default function Navbar({
    theme,
    onToggleTheme,
}: {
    theme: Theme;
    onToggleTheme: () => void;
}) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)] backdrop-blur-sm border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-8 rounded-sm rotate-3 flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] font-heading font-bold text-xl leading-none">E</div>
                    <span className="font-heading font-bold text-xl">EduPrep</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--muted)]">
                    <Link href="/#story" className="hover:text-[var(--text)] transition-colors">Story</Link>
                    <Link href="/#platform" className="hover:text-[var(--text)] transition-colors">Platform</Link>
                    <Link href="/#results" className="hover:text-[var(--text)] transition-colors">Results</Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label="Toggle theme"
                        className="h-10 px-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs font-semibold hover:scale-105 transition-transform"
                    >
                        {theme === "dark" ? "Light" : "Dark"}
                    </button>
                    <Link
                        href="/#enroll"
                        className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:bg-[var(--accent-strong)] transition-colors"
                    >
                        Start Preparation
                    </Link>
                </div>
            </div>
        </nav>
    );
}

