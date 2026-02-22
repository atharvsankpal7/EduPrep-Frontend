"use client";

interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({
    title,
    description = "No data is available right now.",
    actionLabel,
    onAction,
    className = "",
}: EmptyStateProps) {
    return (
        <section
            className={`rounded-xl border border-border/70 bg-card p-8 text-center ${className}`.trim()}
        >
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            {actionLabel && onAction ? (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-5 inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                    {actionLabel}
                </button>
            ) : null}
        </section>
    );
}
