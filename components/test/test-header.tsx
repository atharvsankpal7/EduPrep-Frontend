"use client";

import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestHeaderProps {
  testName: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function TestHeader({ testName, isFullscreen, onToggleFullscreen }: TestHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-lg font-semibold">{testName}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          className="hover:bg-primary/10"
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}