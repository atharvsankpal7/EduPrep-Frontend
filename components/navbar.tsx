"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TeacherNav } from "@/components/navbar/teacher-nav";
import { useAuthStore } from "@/lib/stores/auth-store";

const studentRoutes = [
  { href: "/", label: "Home" },
  { href: "/test", label: "Mock Tests" },
  { href: "/analytics", label: "Analytics" },
  { href: "/study-groups", label: "Study Groups" },
  { href: "/recommendations", label: "Recommendations" },
];

export function NavBar() {
  const pathname = usePathname();
  const isTeacherRoute = pathname.startsWith("/teacher");
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user?.id }),
      });

      if (response.ok) {
        logout();
      }
      if(response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
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
                  studentRoutes.map((route) => (
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
              {studentRoutes.map((route) => (
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
      </div>
    </header>
  );
}