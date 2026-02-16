"use client";

import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

export function Timer({ initialTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

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
  }, [initialTime]);

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
