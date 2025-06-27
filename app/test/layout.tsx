"use client";

import { NavBar } from "@/components/navbar";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // show nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center ">
      <NavBar />
      {children}
    </div>
  );
}