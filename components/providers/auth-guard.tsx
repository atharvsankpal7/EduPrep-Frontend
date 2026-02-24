"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up"];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isPublicPath(pathname)) return;

        if (!isAuthenticated) {
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        // Admin route protection
        if (pathname.startsWith("/admin") && user?.role !== "admin") {
            router.push("/");
        }
    }, [isAuthenticated, user, pathname, router]);

    // Public routes — always render
    if (isPublicPath(pathname)) return children;

    // Private routes — don't render until authenticated
    if (!isAuthenticated) return null;

    // Admin routes — don't render unless admin
    if (pathname.startsWith("/admin") && user?.role !== "admin") return null;

    return children;
}
