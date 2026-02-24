"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { NavBar } from "@/components/navbar";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHideNav = useMemo(() => {
    if (!pathname) {
      return false;
    }

    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length !== 2 || pathSegments[0] !== "test") {
      return false;
    }

    const staticRoutes = new Set(["undergraduate", "junior-college", "teacher"]);
    return !staticRoutes.has(pathSegments[1]);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {shouldHideNav ? null : <NavBar />}
      {children}
    </div>
  );
}
