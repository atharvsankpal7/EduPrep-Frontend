"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ProctoringViolation = "clipboard" | "contextmenu";

interface UseProctoringOptions {
  enabled: boolean;
  onAutoSubmit: (context: { tabSwitchCount: number }) => void;
  onViolation?: (type: ProctoringViolation) => void;
  maxTabSwitches?: number;
}

interface UseProctoringReturn {
  tabSwitchCount: number;
  warningModalOpen: boolean;
  isLastWarning: boolean;
  isAutoSubmitted: boolean;
  dismissWarning: () => void;
  resetProctoring: () => void;
}

const DEFAULT_MAX_TAB_SWITCHES = 3;

export function useProctoring({
  enabled,
  onAutoSubmit,
  onViolation,
  maxTabSwitches = DEFAULT_MAX_TAB_SWITCHES,
}: UseProctoringOptions): UseProctoringReturn {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [isLastWarning, setIsLastWarning] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const hasAutoSubmittedRef = useRef(false);
  const onAutoSubmitRef = useRef(onAutoSubmit);
  const onViolationRef = useRef(onViolation);
  const previousEnabledRef = useRef(enabled);

  useEffect(() => {
    onAutoSubmitRef.current = onAutoSubmit;
  }, [onAutoSubmit]);

  useEffect(() => {
    onViolationRef.current = onViolation;
  }, [onViolation]);

  const resetProctoring = useCallback(() => {
    hasAutoSubmittedRef.current = false;
    setTabSwitchCount(0);
    setWarningModalOpen(false);
    setIsLastWarning(false);
    setIsAutoSubmitted(false);
  }, []);

  useEffect(() => {
    if (enabled && !previousEnabledRef.current) {
      resetProctoring();
    }
    previousEnabledRef.current = enabled;
  }, [enabled, resetProctoring]);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const element = document.documentElement;
        const vendorElement = element as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void> | void;
          msRequestFullscreen?: () => Promise<void> | void;
        };
        if (element.requestFullscreen) {
          await element.requestFullscreen();
          return;
        }

        if (vendorElement.webkitRequestFullscreen) {
          await vendorElement.webkitRequestFullscreen();
          return;
        }

        if (vendorElement.msRequestFullscreen) {
          await vendorElement.msRequestFullscreen();
        }
      } catch (error) {
        console.error("Failed to enter fullscreen:", error);
      }
    };

    if (enabled) {
      void enterFullscreen();
      document.body.classList.add("test-mode");
    }

    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        void document.exitFullscreen();
      }
      document.body.classList.remove("test-mode");
    };
  }, [enabled]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && enabled && !hasAutoSubmittedRef.current) {
        setTabSwitchCount((previous) => previous + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || tabSwitchCount === 0) {
      return;
    }

    if (tabSwitchCount < maxTabSwitches) {
      setWarningModalOpen(true);
      setIsLastWarning(false);
      setIsAutoSubmitted(false);
      return;
    }

    if (tabSwitchCount === maxTabSwitches) {
      setWarningModalOpen(true);
      setIsLastWarning(true);
      setIsAutoSubmitted(false);
      return;
    }

    if (!hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      setWarningModalOpen(true);
      setIsLastWarning(false);
      setIsAutoSubmitted(true);
      onAutoSubmitRef.current({ tabSwitchCount });
    }
  }, [enabled, maxTabSwitches, tabSwitchCount]);

  useEffect(() => {
    const preventCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      onViolationRef.current?.("clipboard");
    };

    if (enabled) {
      document.addEventListener("copy", preventCopyPaste);
      document.addEventListener("paste", preventCopyPaste);
      document.addEventListener("cut", preventCopyPaste);
    }

    return () => {
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("cut", preventCopyPaste);
    };
  }, [enabled]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      onViolationRef.current?.("contextmenu");
    };

    if (enabled) {
      document.addEventListener("contextmenu", preventContextMenu);
    }

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [enabled]);

  const dismissWarning = useCallback(() => {
    setWarningModalOpen(false);
  }, []);

  return {
    tabSwitchCount,
    warningModalOpen,
    isLastWarning,
    isAutoSubmitted,
    dismissWarning,
    resetProctoring,
  };
}
