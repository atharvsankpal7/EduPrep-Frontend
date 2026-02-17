"use client";

import { ShieldCheck } from "lucide-react";
import { testUi } from "@/components/test/test-design-system";
import { memo } from "react";

// Memoized to prevent unnecessary re-renders when parent Timer updates
export const TestHeader = memo(function TestHeader({ testName }: { testName: string }) {
  return (
    <header className={testUi.header}>
      <div className="mx-auto flex h-16 w-full max-w-[1380px] items-center justify-between px-4 lg:px-8">
        <div className="space-y-0.5">
          <p className={testUi.bodyText}>Assessment Workspace</p>
          <h1 className={testUi.pageTitle}>{testName}</h1>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--test-muted-foreground))] md:flex">
          <ShieldCheck className="h-4 w-4 text-[hsl(var(--test-primary))]" />
          Secure Session
        </div>
      </div>
    </header>
  );
});
