"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Clock3 } from "lucide-react";

interface SectionTimerProps {
  sectionKey: string;
  initialSeconds: number;
  isRunning: boolean;
  onTick: () => void;
  onExpire: () => void;
}

const WARNING_SECONDS = 600; // 10 min
const CRITICAL_SECONDS = 300; // 5 min

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const getUrgency = (seconds: number): "normal" | "warning" | "critical" => {
  if (seconds <= 0) return "critical";
  if (seconds <= CRITICAL_SECONDS) return "critical";
  if (seconds <= WARNING_SECONDS) return "warning";
  return "normal";
};

function SectionTimerComponent({
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
  const urgency = getUrgency(remainingSeconds);

  return (
    <div
      className="te-timer"
      data-urgency={urgency}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formattedTime}`}
    >
      {urgency === "critical" ? (
        <AlertTriangle className="size-4" />
      ) : (
        <Clock3 className="size-4" />
      )}

      <span className="font-semibold">{formattedTime}</span>

      {urgency === "warning" && (
        <span className="text-[0.625rem] font-medium opacity-70">LOW</span>
      )}
    </div>
  );
}

export const SectionTimer = memo(SectionTimerComponent);
