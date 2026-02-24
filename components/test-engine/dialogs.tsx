"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConsentRulesDialogProps {
  open: boolean;
  onStart: () => void;
}

export function ConsentRulesDialog({ open, onStart }: ConsentRulesDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Important Test Rules</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <ul className="list-disc space-y-2 pl-5 text-left">
              <li>Fullscreen mode is mandatory throughout the test.</li>
              <li>Copy, cut, paste, and right click are disabled.</li>
              <li>Tab switching is monitored. Third violation auto-submits.</li>
              <li>Section progression is one-way. You cannot go back.</li>
              <li>The test auto-submits when section/final timer reaches zero.</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStart}>
            I Understand, Start Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface StrikeWarningDialogProps {
  open: boolean;
  strikeCount: number;
  isFinalWarning: boolean;
  onAcknowledge: () => void;
}

export function StrikeWarningDialog({
  open,
  strikeCount,
  isFinalWarning,
  onAcknowledge,
}: StrikeWarningDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Integrity Warning</AlertDialogTitle>
          <AlertDialogDescription>
            {isFinalWarning
              ? `Violation ${strikeCount}: this is your final warning. One more tab switch or fullscreen exit will auto-submit your test.`
              : `Violation ${strikeCount}: tab switch or fullscreen exit detected. Please continue only in fullscreen mode.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onAcknowledge}>
            Resume Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SectionLockDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SectionLockDialog({
  open,
  onCancel,
  onConfirm,
}: SectionLockDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move to Next Section?</AlertDialogTitle>
          <AlertDialogDescription>
            You cannot return to this section after moving forward. Any unanswered
            questions here will be skipped permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Stay Here</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Next Section</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SubmitConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SubmitConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: SubmitConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Test?</AlertDialogTitle>
          <AlertDialogDescription>
            After submission you cannot edit answers. Confirm only when you are
            ready to finish the test.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
