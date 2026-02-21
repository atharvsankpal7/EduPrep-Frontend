"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/sign-up?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  return { isAuthenticated };
}
