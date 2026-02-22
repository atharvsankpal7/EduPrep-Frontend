"use client";

import { useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDigitalDurationFromSeconds } from "@/lib/time";

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
  variant?: "panel" | "inline";
}

export function Timer({
  timeLeft,
  totalTime,
  setTimeLeft,
  onTimeUp,
  variant = "panel",
}: TimerProps) {
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft]);

  const isLowTime = timeLeft < 300;
  const timeProgress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
          isLowTime
            ? "border-[hsl(var(--status-warning-border))] bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning-text))]"
            : "border-border bg-muted text-foreground"
        )}
      >
        <Clock className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Time
        </span>
        <span className="font-semibold text-foreground">
          {formatDigitalDurationFromSeconds(timeLeft)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock
            className={cn(
              "h-5 w-5 text-primary",
              isLowTime && "text-[hsl(var(--status-warning-text))]"
            )}
          />
          <span className="font-medium text-foreground">
            Time Remaining
          </span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium",
            isLowTime
              ? "border-[hsl(var(--status-warning-border))] bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning-text))]"
              : "border-border bg-muted text-muted-foreground"
          )}
        >
          {isLowTime ? "Ending Soon" : "In Progress"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={cn(
            "text-3xl font-semibold tracking-tight text-foreground",
            isLowTime && "text-[hsl(var(--status-warning-text))]"
          )}
        >
          {formatDigitalDurationFromSeconds(timeLeft)}
        </div>
        {isLowTime && (
          <AlertTriangle className="h-5 w-5 text-[hsl(var(--status-warning-text))]" />
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full",
            isLowTime
              ? "bg-[hsl(var(--status-warning-text))]"
              : "bg-primary"
          )}
          style={{ width: `${Math.max(0, Math.min(100, timeProgress))}%` }}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Keep a steady pace. Review marked questions before submission.
      </div>
    </div>
  );
}
