"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDigitalDurationFromSeconds } from "@/lib/time";
import { testUi } from "@/components/test/test-design-system";

interface TimerProps {
  duration: number;
  onTimeUpdate?: (timeLeft: number) => void;
  onTimeUp: () => void;
  variant?: "panel" | "inline";
}

export function Timer({
  duration,
  onTimeUpdate,
  onTimeUp,
  variant = "panel",
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUpRef.current();
          if (onTimeUpdateRef.current) {
            onTimeUpdateRef.current(0);
          }
          return 0;
        }
        const newTime = prev - 1;
        if (onTimeUpdateRef.current) {
          onTimeUpdateRef.current(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isLowTime = timeLeft < 300;
  const timeProgress = duration > 0 ? (timeLeft / duration) * 100 : 0;

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
          isLowTime
            ? "border-rose-300 bg-rose-100 text-rose-700"
            : "border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface-muted))] text-[hsl(var(--test-foreground))]",
        )}
      >
        <Clock className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide text-[hsl(var(--test-muted-foreground))]">
          Time
        </span>
        <span className="font-semibold text-[hsl(var(--test-foreground))]">
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
              "h-5 w-5 text-[hsl(var(--test-primary))]",
              isLowTime && "text-rose-600",
            )}
          />
          <span className="font-medium text-[hsl(var(--test-foreground))]">
            Time Remaining
          </span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium",
            isLowTime
              ? "border-rose-300 bg-rose-100 text-rose-700"
              : "border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface-muted))] text-[hsl(var(--test-muted-foreground))]",
          )}
        >
          {isLowTime ? "Ending Soon" : "In Progress"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={cn(
            "text-3xl font-semibold tracking-tight text-[hsl(var(--test-foreground))]",
            isLowTime && "text-rose-600",
          )}
        >
          {formatDigitalDurationFromSeconds(timeLeft)}
        </div>
        {isLowTime && <AlertTriangle className="h-5 w-5 text-rose-600" />}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--test-border))]">
        <div
          className={cn(
            "h-full rounded-full",
            isLowTime ? "bg-rose-500" : "bg-[hsl(var(--test-primary))]",
          )}
          style={{ width: `${Math.max(0, Math.min(100, timeProgress))}%` }}
        />
      </div>

      <p className={testUi.bodyText}>
        Keep a steady pace. Review marked questions before submission.
      </p>
    </div>
  );
}
