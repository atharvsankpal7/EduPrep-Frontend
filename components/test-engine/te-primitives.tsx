import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
 * Test Engine Primitives
 * Drop-in div-like components with pre-attached CSS classes.
 * All accept the same props as their underlying HTML element.
 * ═══════════════════════════════════════════════════════════════ */

// ─── Container ──────────────────────────────────────────────
/** Centered max-width wrapper with horizontal padding. */
export const TEContainer = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl px-4", className)}
        {...props}
    />
));
TEContainer.displayName = "TEContainer";

// ─── Header ─────────────────────────────────────────────────
/** Glass-effect header bar. Uses .te-header from globals.css. */
export const TEHeader = forwardRef<
    HTMLElement,
    ComponentPropsWithoutRef<"header">
>(({ className, ...props }, ref) => (
    <header ref={ref} className={cn("te-header", className)} {...props} />
));
TEHeader.displayName = "TEHeader";

// ─── Footer ──────────────────────────────────────────────────
/** Fixed bottom toolbar. Uses .te-footer from globals.css. */
export const TEFooter = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("te-footer", className)}
        role="toolbar"
        aria-label="Test controls"
        {...props}
    />
));
TEFooter.displayName = "TEFooter";

// ─── ProgressBar ─────────────────────────────────────────────
/** Thin progress track + fill. Pass `value` (0–100). */
interface TEProgressBarProps extends ComponentPropsWithoutRef<"div"> {
    value: number;
}

export const TEProgressBar = forwardRef<HTMLDivElement, TEProgressBarProps>(
    ({ value, className, ...props }, ref) => (
        <div ref={ref} className={cn("te-progress-track", className)} {...props}>
            <div
                className="te-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${value}% of questions answered`}
            />
        </div>
    )
);
TEProgressBar.displayName = "TEProgressBar";

// ─── OptionCard ──────────────────────────────────────────────
/** Clickable option surface. Uses .te-option-card from globals.css. */
interface TEOptionCardProps extends ComponentPropsWithoutRef<"div"> {
    selected?: boolean;
    disabled?: boolean;
}

export const TEOptionCard = forwardRef<HTMLDivElement, TEOptionCardProps>(
    ({ selected = false, disabled = false, className, ...props }, ref) => (
        <div
            ref={ref}
            role="button"
            tabIndex={disabled ? -1 : 0}
            className={cn("te-option-card", className)}
            data-selected={selected}
            data-disabled={disabled}
            {...props}
        />
    )
);
TEOptionCard.displayName = "TEOptionCard";

// ─── KeyboardBadge ───────────────────────────────────────────
/** Small keyboard shortcut indicator (A, B, C, D). */
export const TEKbd = forwardRef<
    HTMLSpanElement,
    ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("te-kbd mt-0.5", className)}
        aria-hidden="true"
        {...props}
    />
));
TEKbd.displayName = "TEKbd";

// ─── GridButton ──────────────────────────────────────────────
/** Question palette grid button. Status drives color via CSS. */
interface TEGridButtonProps extends ComponentPropsWithoutRef<"button"> {
    status: string;
    current?: boolean;
}

export const TEGridButton = forwardRef<HTMLButtonElement, TEGridButtonProps>(
    ({ status, current = false, className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cn("te-grid-btn", className)}
            data-status={status}
            data-current={current}
            {...props}
        />
    )
);
TEGridButton.displayName = "TEGridButton";

// ─── Separator ───────────────────────────────────────────────
/** Thin vertical line divider. */
export const TESeparator = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("h-4 w-px bg-border", className)}
        role="separator"
        aria-hidden="true"
        {...props}
    />
));
TESeparator.displayName = "TESeparator";
