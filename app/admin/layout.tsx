"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { NavBar } from "@/components/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
