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
 * - ArrowDown             → focus next option card
 * - ArrowUp               → focus previous option card
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

        const getFocusedOptionIndex = (): number => {
            const focused = document.activeElement;
            if (!focused || !focused.classList.contains("te-option-card")) return -1;
            const allCards = Array.from(document.querySelectorAll(".te-option-card"));
            return allCards.indexOf(focused);
        };

        const focusOption = (index: number) => {
            const allCards = document.querySelectorAll<HTMLElement>(".te-option-card");
            if (index >= 0 && index < allCards.length) {
                allCards[index]?.focus();
            }
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
                case "ArrowDown": {
                    event.preventDefault();
                    const currentIdx = getFocusedOptionIndex();
                    const nextIdx = currentIdx + 1;
                    if (nextIdx < optionCount) {
                        focusOption(nextIdx);
                    } else {
                        // Wrap to first option
                        focusOption(0);
                    }
                    break;
                }
                case "ArrowUp": {
                    event.preventDefault();
                    const currentIdx = getFocusedOptionIndex();
                    const prevIdx = currentIdx - 1;
                    if (prevIdx >= 0) {
                        focusOption(prevIdx);
                    } else {
                        // Wrap to last option
                        focusOption(optionCount - 1);
                    }
                    break;
                }
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
