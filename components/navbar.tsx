"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
  { href: "/analytics", label: "Analytics" },
  { href: "/study-groups", label: "Study Groups" },
  { href: "/recommendations", label: "Recommendations" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
      <div className="container flex items-center h-16 ">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EduPrep</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === route.href && "text-primary"
                    )}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center ml-auto space-x-4">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}