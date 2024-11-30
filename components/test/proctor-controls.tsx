"use client";

import { HandHelping, Camera, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProctorControlsProps {
  onRaiseHand: () => void;
}

export function ProctorControls({ onRaiseHand }: ProctorControlsProps) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Proctor Controls</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm">Camera</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4 text-primary" />
            <span className="text-sm">Microphone</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onRaiseHand}
      >
        <HandHelping className="w-4 h-4 mr-2" />
        Raise Hand
      </Button>
    </Card>
  );
}