"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer className={`bg-[var(--surface)] text-[var(--muted)] border-t border-[var(--border)] pt-16 pb-8 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="#top" className="flex items-center gap-2 mb-6 text-[var(--text)]">
                            <div className="size-8 rounded-sm rotate-3 flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] font-heading font-bold text-xl leading-none">E</div>
                            <span className="font-heading font-bold text-xl">EduPrep</span>
                        </Link>
                        <p className="max-w-md text-sm leading-relaxed mb-6">
                            EduPrep empowers students with data-driven preparation tools, realistic mock tests, and actionable insights to excel in competitive exams and assessments.
                        </p>
                        <div className="flex gap-4">
                            {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social) => (
                                <a key={social} href="#" className="hover:text-[var(--accent)] transition-colors text-sm">{social}</a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[var(--text)] font-semibold mb-6">Platform</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#features" className="hover:text-[var(--accent)] transition-colors">Features</Link></li>
                            <li><Link href="#analytics" className="hover:text-[var(--accent)] transition-colors">Analytics</Link></li>
                            <li><Link href="#pricing" className="hover:text-[var(--accent)] transition-colors">Pricing</Link></li>
                            <li><Link href="#testimonials" className="hover:text-[var(--accent)] transition-colors">Testimonials</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[var(--text)] font-semibold mb-6">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-[var(--accent)] transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-[var(--accent)] transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>&copy; {currentYear} EduPrep. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
