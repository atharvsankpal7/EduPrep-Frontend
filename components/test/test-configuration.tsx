"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, AlertTriangle } from "lucide-react";
import { TimeInput } from "@/components/ui/time-input";

interface TestConfigurationProps {
  selectedTopics: string[];
  onStartTest: (config: TestConfig) => void;
  defaultDuration?: number;
  defaultQuestions?: number;
}

export interface TestConfig {
  duration: number;
  numberOfQuestions: number;
  selectedTopics: string[];
  isTimeLimited: boolean;
}

export function TestConfiguration({
  selectedTopics,
  onStartTest,
  defaultDuration = 60,
  defaultQuestions = 30,
}: TestConfigurationProps) {
  const [isTimeLimited, setIsTimeLimited] = useState(true);
  const [duration, setDuration] = useState(defaultDuration);
  const [numberOfQuestions, setNumberOfQuestions] = useState(defaultQuestions);

  const handleStartTest = () => {
    onStartTest({
      duration: duration,
      numberOfQuestions,
      selectedTopics,
      isTimeLimited,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Test Configuration
          </CardTitle>
          <CardDescription>
            Customize your test settings before starting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Limit Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="time-limit" className="text-base font-medium">
                Time Limit
              </Label>
              <Switch
                id="time-limit"
                checked={isTimeLimited}
                onCheckedChange={setIsTimeLimited}
              />
            </div>
            
            {isTimeLimited && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Test Duration
                  </span>
                </div>
                <TimeInput
                  value={duration}
                  onChange={setDuration}
                />
              </div>
            )}
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="questions" className="text-base font-medium">
              Number of Questions
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="questions"
                type="number"
                min={10}
                max={120}
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                (10-120 questions)
              </span>
            </div>
          </div>

          {/* Selected Topics */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Selected Topics</Label>
            <div className="grid grid-cols-2 gap-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic}
                  className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Warning Messages */}
          {(numberOfQuestions < 10 || numberOfQuestions > 120) && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Please select between 10 and 120 questions</span>
            </div>
          )}

          {/* Start Button */}
          <Button
            onClick={handleStartTest}
            disabled={
              numberOfQuestions < 10 ||
              numberOfQuestions > 120 ||
              (isTimeLimited && duration <= 0)
            }
            className="w-full"
          >
            Start Test
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
