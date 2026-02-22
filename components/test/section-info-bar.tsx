"use client";

import { useEffect, useState } from "react";
import { Timer } from "@/components/test/timer";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/common/surface";
import { Typography } from "@/components/common/typography";
import { cn } from "@/lib/utils";

interface SectionInfoBarProps {
  sectionName: string;
  sections: { name: string }[];
  currentSectionIndex: number;
  sectionCompleted: boolean[];
  totalTime: number;
  onTimeUp: () => void;
  onTimeChange: (timeLeft: number) => void;
  showNextSection: boolean;
  onNextSection: () => void;
}

export function SectionInfoBar({
  sectionName,
  sections,
  currentSectionIndex,
  sectionCompleted,
  totalTime,
  onTimeUp,
  onTimeChange,
  showNextSection,
  onNextSection,
}: SectionInfoBarProps) {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    setTimeLeft(totalTime);
  }, [totalTime, currentSectionIndex]);

  useEffect(() => {
    onTimeChange(timeLeft);
  }, [onTimeChange, timeLeft]);

  return (
    <Surface className="mb-6 p-4 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <Typography variant="sectionTitle">
            Section: {sectionName}
          </Typography>
          <Typography variant="body">
            Attempt questions, flag uncertain ones, and review before
            submission.
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Timer
            key={`${currentSectionIndex}-${totalTime}`}
            variant="inline"
            timeLeft={timeLeft}
            totalTime={totalTime}
            setTimeLeft={setTimeLeft}
            onTimeUp={onTimeUp}
          />
          {showNextSection && (
            <Button
              onClick={onNextSection}
              variant="outline"
            >
              Next Section
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sections.map((section, index) => (
          <span
            key={section.name}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              index === currentSectionIndex
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
              sectionCompleted[index] && "opacity-65"
            )}
          >
            {section.name}
          </span>
        ))}
      </div>
    </Surface>
  );
}
