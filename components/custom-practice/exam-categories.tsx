"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Play } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ExamCategoriesProps {
  onBack: () => void;
}

export function ExamCategories({ onBack }: ExamCategoriesProps) {
  const startTest = () => {
    // Implement test start logic
    console.log("Starting GATE mock test");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ChevronLeft className="w-4 h-4" /> Back
      </Button>

      <Card className="text-center">
        <CardHeader>
          <CardTitle>GATE Mock Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This mock test simulates the actual GATE exam environment with similar difficulty level and time constraints.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="gap-2">
                <Play className="w-4 h-4" /> Start Mock Test
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start GATE Mock Test?</AlertDialogTitle>
                <AlertDialogDescription>
                  This test will take 3 hours to complete. Make sure you have a stable internet connection and won&apos;t be disturbed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={startTest}>Start Test</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}