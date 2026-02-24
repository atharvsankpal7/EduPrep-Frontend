"use client";

import { useEffect, useRef } from "react";

interface UseTestHotkeysOptions {
    enabled: boolean;
    optionCount: number;
    onSelectOption: (optionIndex: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onToggleReview: () => void;
    onSaveAndNext: () => void;
}

/**
 * Global keyboard shortcuts for the test engine:
 * - 1/2/3/4 or A/B/C/D  → select option
 * - ArrowRight            → next question
 * - ArrowLeft             → previous question
 * - Space or M            → toggle review
 * - Enter                 → save & next
 */
export function useTestHotkeys({
    enabled,
    optionCount,
    onSelectOption,
    onNext,
    onPrevious,
    onToggleReview,
    onSaveAndNext,
}: UseTestHotkeysOptions) {
    const onSelectOptionRef = useRef(onSelectOption);
    const onNextRef = useRef(onNext);
    const onPreviousRef = useRef(onPrevious);
    const onToggleReviewRef = useRef(onToggleReview);
    const onSaveAndNextRef = useRef(onSaveAndNext);

    useEffect(() => { onSelectOptionRef.current = onSelectOption; }, [onSelectOption]);
    useEffect(() => { onNextRef.current = onNext; }, [onNext]);
    useEffect(() => { onPreviousRef.current = onPrevious; }, [onPrevious]);
    useEffect(() => { onToggleReviewRef.current = onToggleReview; }, [onToggleReview]);
    useEffect(() => { onSaveAndNextRef.current = onSaveAndNext; }, [onSaveAndNext]);

    useEffect(() => {
        if (!enabled) return;

        const numberToIndex = (key: string): number | null => {
            const num = parseInt(key, 10);
            if (num >= 1 && num <= optionCount) return num - 1;
            return null;
        };

        const letterToIndex = (key: string): number | null => {
            const code = key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
            if (code >= 0 && code < optionCount) return code;
            return null;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't capture when typing in inputs
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            // Number keys 1-4
            const numIndex = numberToIndex(event.key);
            if (numIndex !== null) {
                event.preventDefault();
                onSelectOptionRef.current(numIndex);
                return;
            }

            // Letter keys A-D
            const letterIndex = letterToIndex(event.key);
            if (letterIndex !== null && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                onSelectOptionRef.current(letterIndex);
                return;
            }

            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault();
                    onNextRef.current();
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    onPreviousRef.current();
                    break;
                case " ":
                    event.preventDefault();
                    onToggleReviewRef.current();
                    break;
                case "m":
                case "M":
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        onToggleReviewRef.current();
                    }
                    break;
                case "Enter":
                    event.preventDefault();
                    onSaveAndNextRef.current();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enabled, optionCount]);
}
