"use client";

import { Clock3, ListChecks, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestInfoDisplayProps {
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  requirements: string[];
  onStart: () => void;
  startButtonLabel?: string;
  isStartDisabled?: boolean;
  isStartLoading?: boolean;
}

export function TestInfoDisplay({
  title,
  description,
  duration,
  questionCount,
  requirements,
  onStart,
  startButtonLabel = "Start Test",
  isStartDisabled = false,
  isStartLoading = false,
}: TestInfoDisplayProps) {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl text-balance">{title}</CardTitle>
            <p className="text-sm text-muted-foreground text-pretty">{description}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-md border border-border p-3">
                <Clock3 className="size-4 text-muted-foreground" />
                <p className="text-sm tabular-nums">{duration} minutes</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border p-3">
                <ListChecks className="size-4 text-muted-foreground" />
                <p className="text-sm tabular-nums">{questionCount} questions</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Requirements</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              onClick={onStart}
              className="w-full"
              disabled={isStartDisabled}
            >
              {isStartLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {startButtonLabel}
                </span>
              ) : (
                startButtonLabel
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
