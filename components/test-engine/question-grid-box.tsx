"use client";

import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QuestionVisualState } from "@/hooks/use-test-engine";

interface QuestionGridBoxProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  questionStatuses: QuestionVisualState[];
  disabled?: boolean;
  onSelectQuestion: (questionIndex: number) => void;
}

const LEGEND: {
  label: string;
  status: QuestionVisualState;
}[] = [
    { label: "Not Visited", status: "not-visited" },
    { label: "Unanswered", status: "visited-unanswered" },
    { label: "Answered", status: "answered" },
    { label: "Review", status: "marked-for-review" },
  ];

function QuestionGridBoxComponent({
  totalQuestions,
  currentQuestionIndex,
  questionStatuses,
  disabled = false,
  onSelectQuestion,
}: QuestionGridBoxProps) {
  return (
    <aside
      className="flex flex-col rounded-xl border border-border bg-card"
      aria-label="Question navigation palette"
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Question Palette
        </h3>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          Jump to any question in this section
        </p>
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div
          className="grid grid-cols-5 gap-2.5"
          role="group"
          aria-label="Question grid"
        >
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = questionStatuses[index] ?? "not-visited";
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={`qg-${index}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelectQuestion(index)}
                className="te-grid-btn"
                data-status={status}
                data-current={isCurrent}
                aria-label={`Question ${index + 1}, ${status.replaceAll(
                  "-",
                  " "
                )}${isCurrent ? ", current" : ""}`}
                aria-current={isCurrent ? "true" : undefined}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="border-t border-border px-4 py-3">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {LEGEND.map((item) => (
            <div key={item.status} className="te-legend-item">
              <span
                className="te-legend-swatch te-grid-btn"
                data-status={item.status}
                style={{
                  width: "0.875rem",
                  height: "0.875rem",
                  fontSize: "0px",
                }}
                aria-hidden="true"
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export const QuestionGridBox = memo(QuestionGridBoxComponent);
