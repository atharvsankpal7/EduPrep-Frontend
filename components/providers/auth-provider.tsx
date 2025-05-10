"use client";

import { ReactNode, useEffect } from "react";
import { checkAuthStatus } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    checkAuthStatus();
  }, [setLoading]);

  return children;
}
