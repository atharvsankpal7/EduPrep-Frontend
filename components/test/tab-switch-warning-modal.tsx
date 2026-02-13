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
import { testUi } from "@/components/test/test-design-system";

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
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
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
            className={isAutoSubmitted ? testUi.dangerButton : testUi.warningButton}
          >
            {isAutoSubmitted ? "View Results" : "I Understand"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
