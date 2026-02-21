"use client";

import { NavBar } from "@/components/navbar";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRequireAuth();

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