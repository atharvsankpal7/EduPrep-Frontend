"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  timeLeft: number;
  setTimeLeft: (time: number | ((prev: number) => number)) => void; // Explicitly allow a function type
  onTimeUp: () => void;
}

export function Timer({ timeLeft, setTimeLeft, onTimeUp }: TimerProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
