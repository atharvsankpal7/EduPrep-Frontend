import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { AlertTriangle } from "lucide-react";
  
  interface ErrorMessageDialogProps {
    open: boolean;
    onClose: () => void;
  }
  
  export function ErrorMessageDialog({ open, onClose }: ErrorMessageDialogProps) {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-red-100 text-red-600 rounded-full p-3">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <AlertDialogTitle>Test Creation Failed</AlertDialogTitle>
              <AlertDialogDescription>
                Something went wrong while creating your test. Please try again
                later.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div className="flex justify-center">
            <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  