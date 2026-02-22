import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface TabSwitchWarningModalProps {
  open: boolean;
  onClose: () => void;
  tabSwitchCount: number;
  isLastWarning: boolean;
  isAutoSubmitted: boolean;
}

export function TabSwitchWarningModal({
  open,
  onClose,
  tabSwitchCount,
  isLastWarning,
  isAutoSubmitted,
}: TabSwitchWarningModalProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full border border-[hsl(var(--status-danger-border))] bg-[hsl(var(--status-danger-bg))] p-3 text-[hsl(var(--status-danger-text))]">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="text-xl">
              {isAutoSubmitted
                ? "Test Automatically Submitted"
                : isLastWarning
                  ? "Final Warning"
                  : "Tab Switch Detected"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {isAutoSubmitted ? (
                "Your test has been automatically submitted due to multiple tab switches."
              ) : isLastWarning ? (
                "This is your last warning. The next tab switch will automatically submit your test."
              ) : (
                <>
                  Tab switch detected ({tabSwitchCount}/3).
                  <br />
                  You have 3 warnings. After 3/3, one more switch will auto-submit your test.
                </>
              )}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center items-center">
          <AlertDialogAction
            onClick={onClose}
            className={
              isAutoSubmitted
                ? "border-[hsl(var(--status-danger-border))] bg-[hsl(var(--status-danger-bg))] text-[hsl(var(--status-danger-text))] hover:bg-[hsl(var(--status-danger-bg))]"
                : "border-[hsl(var(--status-warning-border))] bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning-text))] hover:bg-[hsl(var(--status-warning-bg))]"
            }
          >
            {isAutoSubmitted ? "View Results" : "I Understand"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
