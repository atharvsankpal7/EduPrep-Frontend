"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProblemSolution from "./components/ProblemSolution";
import ProductShowcase from "./components/ProductShowcase";
import SocialProof from "./components/SocialProof";
import TechnicalDifferentiators from "./components/TechnicalDifferentiators";
import Conversion from "./components/Conversion";
import Footer from "./components/Footer";

type Theme = "dark" | "light";

const themeTokens: Record<Theme, Record<string, string>> = {
    dark: {
        "--bg": "#0b0d10",
        "--surface": "#13171d",
        "--surface-alt": "#1b2129",
        "--text": "#f5f7fa",
        "--muted": "#a7b0bb",
        "--border": "#27303a",
        "--accent": "#b7f36b",
        "--accent-strong": "#9adc44",
        "--ring": "rgba(183, 243, 107, 0.4)",
    },
    light: {
        "--bg": "#f5f0e8",
        "--surface": "#fffaf2",
        "--surface-alt": "#efe6d9",
        "--text": "#22201c",
        "--muted": "#5d554b",
        "--border": "#d6c8b8",
        "--accent": "#b3472f",
        "--accent-strong": "#8f351f",
        "--ring": "rgba(179, 71, 47, 0.25)",
    },
};

export default function LandingPageClient({ fontVars }: { fontVars: string }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = window.localStorage.getItem("eduprep-theme");
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            setReady(true);
            return;
        }

        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(systemPrefersDark ? "dark" : "light");
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) {
            return;
        }
        window.localStorage.setItem("eduprep-theme", theme);
    }, [theme, ready]);

    // Antigravity: Redirect to /test/junior-college if logged in
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/test/junior-college");
        }
    }, [isAuthenticated, isLoading, router]);

    const styleVars = useMemo(() => themeTokens[theme] as CSSProperties, [theme]);

    return (
        <div
            className={`${fontVars} font-body bg-[var(--bg)] text-[var(--text)] min-h-dvh selection:bg-[var(--accent)] selection:text-[var(--bg)] overflow-x-hidden scroll-smooth`}
            style={styleVars}
        >
            <Navbar theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
            <main>
                <Hero />
                <ProblemSolution />
                <ProductShowcase />
                <SocialProof />
                <TechnicalDifferentiators />
                <Conversion />
            </main>
            <Footer />
        </div>
    );
}
