"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container flex items-center justify-center text-sm text-muted-foreground">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} • Developed by{" "}
          <Link
            href="https://www.linkedin.com/in/atharv-sankpal-235a7730a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Atharv Sankpal
          </Link>{" "}
          and team
        </p>
      </div>
    </footer>
  );
}
