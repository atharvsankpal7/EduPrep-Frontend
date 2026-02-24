"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTimerProps {
  sectionKey: string;
  initialSeconds: number;
  isRunning: boolean;
  onTick: () => void;
  onExpire: () => void;
}

const LOW_TIME_WARNING_SECONDS = 300;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export function SectionTimer({
  sectionKey,
  initialSeconds,
  isRunning,
  onTick,
  onExpire,
}: SectionTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, initialSeconds)
  );
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    setRemainingSeconds(Math.max(0, initialSeconds));
    hasExpiredRef.current = false;
  }, [initialSeconds, sectionKey]);

  useEffect(() => {
    if (!isRunning || remainingSeconds > 0) {
      return;
    }

    if (!hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpire();
    }
  }, [isRunning, onExpire, remainingSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((previousValue) => {
        onTick();

        if (previousValue <= 1) {
          window.clearInterval(timerId);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return previousValue - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isRunning, onExpire, onTick]);

  const formattedTime = useMemo(
    () => formatTime(remainingSeconds),
    [remainingSeconds]
  );
  const isLowTime = remainingSeconds > 0 && remainingSeconds < LOW_TIME_WARNING_SECONDS;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 tabular-nums",
        isLowTime
          ? "border-destructive/60 text-destructive"
          : "border-border text-foreground"
      )}
      aria-live="polite"
    >
      {isLowTime ? <AlertTriangle className="size-4" /> : <Clock3 className="size-4" />}
      <span className="text-sm font-semibold">{formattedTime}</span>
    </div>
  );
}
