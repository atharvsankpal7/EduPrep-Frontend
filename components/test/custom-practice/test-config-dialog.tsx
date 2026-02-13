"use client";

import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Clock, AlertTriangle } from "lucide-react";
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
  const [duration, setDuration] = useState(60);
  const [questionCount, setQuestionCount] = useState(30);

  const handleConfirm = () => {
    onConfirm({ duration, questionCount });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Your Test</DialogTitle>
          <DialogDescription>
            Set the duration and number of questions for your custom test
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Test Duration (minutes)
              </Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  min={15}
                  max={180}
                  step={15}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>15 min</span>
                  <span>{formatCompactDurationFromMinutes(duration)}</span>
                  <span>180 min</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                id="questions"
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={5}
                max={100}
                className="mt-2"
              />
              {(questionCount < 5 || questionCount > 100) && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please select between 5 and 100 questions</span>
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
            disabled={questionCount < 5 || questionCount > 100}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
