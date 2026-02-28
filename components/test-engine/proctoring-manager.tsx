"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ProctoringManagerProps {
  enabled: boolean;
  onStrikeViolation: (reason: "tab_switch" | "fullscreen_exit") => void;
  onClipboardViolation: () => void;
  onContextMenuViolation: () => void;
}

const ALERT_DISPLAY_MS = 6000;

export function ProctoringManager({
  enabled,
  onStrikeViolation,
  onClipboardViolation,
  onContextMenuViolation,
}: ProctoringManagerProps) {
  const [alertActive, setAlertActive] = useState(false);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const onStrikeViolationRef = useRef(onStrikeViolation);
  const onClipboardViolationRef = useRef(onClipboardViolation);
  const onContextMenuViolationRef = useRef(onContextMenuViolation);

  useEffect(() => {
    onStrikeViolationRef.current = onStrikeViolation;
  }, [onStrikeViolation]);

  useEffect(() => {
    onClipboardViolationRef.current = onClipboardViolation;
  }, [onClipboardViolation]);

  useEffect(() => {
    onContextMenuViolationRef.current = onContextMenuViolation;
  }, [onContextMenuViolation]);

  const triggerAlert = useCallback(() => {
    setAlertActive(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(
      () => setAlertActive(false),
      ALERT_DISPLAY_MS
    );
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onStrikeViolationRef.current("tab_switch");
        triggerAlert();
      }
    };

    const handleBlur = () => {
      onStrikeViolationRef.current("tab_switch");
      triggerAlert();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onStrikeViolationRef.current("fullscreen_exit");
        triggerAlert();
      }
    };

    const handleClipboard = (event: ClipboardEvent) => {
      event.preventDefault();
      onClipboardViolationRef.current();
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      onContextMenuViolationRef.current();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("cut", handleClipboard);
    document.addEventListener("paste", handleClipboard);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, triggerAlert]);

  return (
    <div
      className="te-proctor-alert"
      data-active={alertActive}
      aria-hidden="true"
    />
  );
}
