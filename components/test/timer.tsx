"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  duration: number;
  onTimeUpdate: (time: number) => void;
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUpdate, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const callbackRef = useRef({ onTimeUpdate, onTimeUp });

  useEffect(() => {
    callbackRef.current = { onTimeUpdate, onTimeUp };
  }, [onTimeUpdate, onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = prev - 1;
        callbackRef.current.onTimeUpdate(newValue);
        if (newValue <= 0) {
          clearInterval(timer);
          callbackRef.current.onTimeUp();
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-medium">Time Remaining</span>
        </div>
        {isLowTime && (
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
        )}
      </div>

      <div
        className={`text-3xl font-bold text-center ${
          isLowTime ? "text-destructive animate-pulse" : ""
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <Progress
        value={(timeLeft / (30 * 60)) * 100}
        className={isLowTime ? "bg-destructive/20" : ""}
      />
    </div>
  );
}
