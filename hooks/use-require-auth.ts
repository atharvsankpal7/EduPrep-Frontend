"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/sign-up?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return { isAuthenticated, isLoading };
}
