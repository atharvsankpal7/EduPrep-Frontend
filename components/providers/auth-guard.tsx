"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { isAppPublicPath } from "@/lib/routing/public-paths";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAppPublicPath(pathname)) return;

    if (!isAuthenticated) {
      router.push(`/sign-up?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Admin route protection
    if (pathname.startsWith("/admin") && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, pathname, router]);

  // Public routes - always render
  if (isAppPublicPath(pathname)) return children;

  // Private routes - do not render until authenticated
  if (!isAuthenticated) return null;

  // Admin routes - do not render unless admin
  if (pathname.startsWith("/admin") && user?.role !== "admin") return null;

  return children;
}
