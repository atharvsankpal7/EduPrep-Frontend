"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Clock, BookOpen, AlertTriangle } from "lucide-react";

interface TestInfoDisplayProps {
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  onStart: () => void;
  requirements?: string[];
  instructions?: string[];
}

export function TestInfoDisplay({
  title,
  description,
  duration,
  questionCount,
  onStart,
  requirements = [],
  instructions = [
    "Ensure you have a stable internet connection",
    "Find a quiet place without distractions",
    "Keep your webcam and microphone ready for proctoring",
    "The test will automatically submit when the time is up",
    "Switching tabs or windows will be recorded",
  ],
}: TestInfoDisplayProps) {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Duration
                </CardTitle>
                <CardDescription>{duration} minutes</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Questions
                </CardTitle>
                <CardDescription>{questionCount} questions</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Important
                </CardTitle>
                <CardDescription>Full screen mode required</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {requirements.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Requirements:</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Before you begin:</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full mt-4">
                      Start Test
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The test will start immediately in full-screen mode. Make
                        sure you&apos;re ready to spend the next {duration} minutes
                        uninterrupted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onStart}>
                        Start Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}