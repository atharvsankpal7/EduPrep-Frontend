"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WarningModalProps {
  onStart: () => void;
}

export function WarningModal({ onStart }: WarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-card border rounded-lg shadow-lg max-w-md w-full p-6 m-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8" />
          </div>
          
          <h2 className="text-2xl font-bold">Important Test Rules</h2>
          
          <div className="space-y-4 text-left">
            <p className="text-muted-foreground">
              Before starting the test, please be aware of the following rules:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Do not switch tabs or windows during the test</li>
              <li>After 3 tab switches, your test will be automatically submitted</li>
              <li>The test will run in fullscreen mode</li>
              <li>Copy and paste functions are disabled</li>
              <li>Once you move to the next section, you cannot return to previous sections</li>
              <li>The test will automatically submit when the time is up</li>
            </ul>
            
            <p className="font-medium text-destructive">
              Violation of these rules may result in automatic test submission.
            </p>
          </div>
          
          <Button 
            onClick={onStart} 
            size="lg" 
            className="w-full mt-4"
          >
            I Understand, Start Test
          </Button>
        </div>
      </div>
    </div>
  );
}