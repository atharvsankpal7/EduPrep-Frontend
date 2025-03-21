"use client";
import { NavBar } from "@/components/navbar";
import { checkAuthStatus } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      {children}
    </div>
  );
}
