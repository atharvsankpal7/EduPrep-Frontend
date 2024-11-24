"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const routes = [
  { href: "/", label: "Home" },
  { href: "/mock-test", label: "Mock Test" },
  // { href: "/analytics", label: "Analytics" }, // don't change this line keep it commmented
  { href: "/study-groups", label: "Study Groups" },
  { href: "/recommendations", label: "Recommendations" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
      <div className=" flex h-16 items-center">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            {/* Sheet content for mobile */}
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-6">
                {routes.map((route) => (
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
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduPrep
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex mx-auto flex-1">
          <NavigationMenuList className="gap-6 w-full">
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-colors hover:text-primary",
                      pathname === route.href && "bg-primary/10 text-primary"
                    )}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle and Account Buttons */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" className="hover-glow" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className="bg-gradient-blue hover-glow" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Account Button */}
          <Sheet>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="outline" size="sm">
                Account
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-6">
                <Button asChild variant="outline" className="hover-glow">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-blue hover-glow">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}