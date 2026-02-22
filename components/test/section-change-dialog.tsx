"use client";

import { AlertTriangle } from "lucide-react";
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

interface SectionChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SectionChangeDialog({
  open,
  onOpenChange,
  onConfirm,
}: SectionChangeDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--status-warning-text))]" />
            Warning: Section Change
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to move to the next section. Please note:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>You cannot return to the previous section once you proceed</li>
              <li>
                All unanswered questions in the current section will be marked
                as not attempted
              </li>
              <li>Make sure you have reviewed all your answers</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Stay in Current Section
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Proceed to Next Section
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
