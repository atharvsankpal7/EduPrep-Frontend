"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TeacherNav } from "@/components/navbar/teacher-nav";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLogout } from "@/lib/api/hooks/useAuth";

const studentRoutes = [
  { href: "/", label: "Home" },
  { href: "/test", label: "Mock Tests" },
];

const adminRoutes = [
  { href: "/admin/students", label: "Students" },
  { href: "/admin/upload", label: "Upload Questions" },
];

export function NavBar() {
  const pathname = usePathname();
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isAdminRoute = pathname.startsWith("/admin");

  // Use selectors to avoid unnecessary re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navRoutes = isAdminRoute ? adminRoutes : studentRoutes;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container flex h-16 items-center justify-between container mx-auto">
      {/* <div className=" w-full"> */}
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-6">
              {isTeacherRoute ? (
                <TeacherNav />
              ) : (
                navRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.label}
                  </Link>
                ))
              )}
              {isAuthenticated && (
                <Button variant="outline" onClick={handleLogout} className="mt-2">
                  Log Out
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduPrep
          </span>
        </Link>
      </div>

      <div className="hidden md:flex mx-6 flex-1">
        {isTeacherRoute ? (
          <TeacherNav />
        ) : (
          <nav className="flex items-center space-x-6">
            {navRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        {!isTeacherRoute && (
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user?.fullName}
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin/students">
                    <Button variant="outline" size="icon" className="mr-2">
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="hover-glow" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button className="bg-gradient-blue hover-glow" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {/* </div> */}
    </header>
  );
}