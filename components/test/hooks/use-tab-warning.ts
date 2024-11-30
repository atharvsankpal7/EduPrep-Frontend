"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTestStore } from '@/lib/stores/test-store';

export function useTabWarning() {
  const [warningVisible, setWarningVisible] = useState(false);
  const { toast } = useToast();
  const { incrementTabSwitches, tabSwitchCount, submitTest } = useTestStore();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitches();
        
        if (tabSwitchCount < 2) {
          toast({
            title: "Warning",
            description: `Tab switch detected (${tabSwitchCount + 1}/3). Your test will be auto-submitted after 3 attempts.`,
            variant: "destructive",
          });
        } else if (tabSwitchCount === 2) {
          toast({
            title: "Final Warning",
            description: "This is your last warning. Next tab switch will submit your test.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Test Submitted",
            description: "Your test has been automatically submitted due to multiple tab switches.",
            variant: "destructive",
          });
          submitTest();
        }

        setWarningVisible(true);
        setTimeout(() => setWarningVisible(false), 10000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [tabSwitchCount, incrementTabSwitches, submitTest, toast]);

  return { warningVisible, tabSwitchCount };
}