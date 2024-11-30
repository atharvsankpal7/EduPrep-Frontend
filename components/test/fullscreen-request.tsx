"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Maximize } from "lucide-react";

interface FullscreenRequestProps {
  onAccept: () => Promise<void>;
  onDecline: () => void;
}

export function FullscreenRequest({ onAccept, onDecline }: FullscreenRequestProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleAccept = async () => {
    try {
      await onAccept();
      setIsOpen(false);
    } catch (error) {
      // Keep dialog open if fullscreen request fails
      console.error("Fullscreen request failed:", error);
    }
  };

  const handleDecline = () => {
    setIsOpen(false);
    onDecline();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Fullscreen Mode</DialogTitle>
          <DialogDescription>
            This test requires fullscreen mode to maintain academic integrity. 
            Please click "Enter Fullscreen" to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          <Maximize className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDecline}>
            Cancel
          </Button>
          <Button onClick={handleAccept}>
            Enter Fullscreen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}