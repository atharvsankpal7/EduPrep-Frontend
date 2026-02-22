"use client";

import { ShieldCheck } from "lucide-react";
import { StickyBar } from "@/components/common/sticky-bar";
import { Typography } from "@/components/common/typography";

export function TestHeader({ testName }: { testName: string }) {
  return (
    <StickyBar position="top">
      <div className="mx-auto flex h-16 w-full max-w-[1380px] items-center justify-between px-4 lg:px-8">
        <div className="space-y-0.5">
          <Typography variant="body">Assessment Workspace</Typography>
          <Typography variant="pageTitle">{testName}</Typography>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground md:flex">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Secure Session
        </div>
      </div>
    </StickyBar>
  );
}
