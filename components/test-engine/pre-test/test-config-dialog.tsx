"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestConfigDialogProps {
  open: boolean;
  selectedTopics: string[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: { duration: number; questionCount: number }) => void;
}

const DEFAULT_DURATION = 60;
const DEFAULT_QUESTION_COUNT = 30;

export function TestConfigDialog({
  open,
  selectedTopics,
  onOpenChange,
  onConfirm,
}: TestConfigDialogProps) {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDuration(DEFAULT_DURATION);
    setQuestionCount(DEFAULT_QUESTION_COUNT);
  }, [open]);

  const handleConfirm = () => {
    const normalizedDuration = Math.max(1, Math.floor(duration));
    const normalizedQuestionCount = Math.max(1, Math.floor(questionCount));

    onConfirm({
      duration: normalizedDuration,
      questionCount: normalizedQuestionCount,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Test</DialogTitle>
          <DialogDescription>
            Selected topics: {selectedTopics.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-duration">Duration (minutes)</Label>
            <Input
              id="test-duration"
              type="number"
              min={1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-count">Number of questions</Label>
            <Input
              id="question-count"
              type="number"
              min={1}
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
