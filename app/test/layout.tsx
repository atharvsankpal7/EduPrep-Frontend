"use client";
import { NavBar } from "@/components/navbar";
import { checkAuthStatus } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();

    // If not authenticated and not loading, redirect to sign in
    if (!isAuthenticated && !isLoading) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show nothing while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      {children}
    </div>
  );
}