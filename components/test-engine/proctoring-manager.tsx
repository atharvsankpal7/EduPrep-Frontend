"use client";

import { useEffect, useRef } from "react";

interface ProctoringManagerProps {
  enabled: boolean;
  onStrikeViolation: (reason: "tab_switch" | "fullscreen_exit") => void;
  onClipboardViolation: () => void;
  onContextMenuViolation: () => void;
}

export function ProctoringManager({
  enabled,
  onStrikeViolation,
  onClipboardViolation,
  onContextMenuViolation,
}: ProctoringManagerProps) {
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

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onStrikeViolationRef.current("tab_switch");
      }
    };

    const handleBlur = () => {
      onStrikeViolationRef.current("tab_switch");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onStrikeViolationRef.current("fullscreen_exit");
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
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled]);

  return null;
}
