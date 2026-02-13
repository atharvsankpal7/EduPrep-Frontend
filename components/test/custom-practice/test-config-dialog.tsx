"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, BookOpen } from "lucide-react";
import { formatCompactDurationFromMinutes } from "@/lib/time";

interface TestConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (config: { duration: number; questionCount: number }) => void;
  selectedTopics: string[];
}

export function TestConfigDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedTopics,
}: TestConfigDialogProps) {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [questionCount, setQuestionCount] = useState(30);

  // Reset values when dialog opens
  useEffect(() => {
    if (open) {
      setHours(1);
      setMinutes(0);
      setSeconds(0);
      setQuestionCount(30);
    }
  }, [open]);

  const handleConfirm = () => {
    // Convert to minutes (including fractional minutes from seconds)
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    // Ensure at least some duration
    const validDuration = Math.max(0.25, totalMinutes); // Minimum 15 seconds
    onConfirm({ duration: validDuration, questionCount });
  };

  const isQuestionCountValid = questionCount >= 10 && questionCount <= 120;
  const isDurationValid = (hours > 0 || minutes > 0 || seconds > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Your Test</DialogTitle>
          <DialogDescription>
            Set the duration and number of questions for your custom test
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                Test Duration
              </Label>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="hours" className="text-xs text-muted-foreground mb-1 block">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min={0}
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="minutes" className="text-xs text-muted-foreground mb-1 block">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="seconds" className="text-xs text-muted-foreground mb-1 block">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min={0}
                    max={59}
                    value={seconds}
                    onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  />
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Total: {formatCompactDurationFromMinutes(Math.max(0.25, hours * 60 + minutes + seconds / 60))}
              </div>
            </div>

            <div>
              <Label htmlFor="questions" className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                Number of Questions
              </Label>
              <Input
                id="questions"
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={10}
                max={120}
              />
              {!isQuestionCountValid && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please select between 10 and 120 questions</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isQuestionCountValid || !isDurationValid}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
