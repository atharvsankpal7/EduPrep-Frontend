"use client";

interface QueryErrorProps {
    title?: string;
    error?: unknown;
    fallbackMessage?: string;
    retryLabel?: string;
    onRetry?: () => void;
    className?: string;
}

const resolveErrorMessage = (
    error: unknown,
    fallbackMessage: string
): string => {
    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message;
    }

    return fallbackMessage;
};

export default function QueryError({
    title = "Something went wrong",
    error,
    fallbackMessage = "Unable to load this data. Please try again.",
    retryLabel = "Try again",
    onRetry,
    className = "",
}: QueryErrorProps) {
    const message = resolveErrorMessage(error, fallbackMessage);

    return (
        <section
            role="alert"
            className={`rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center ${className}`.trim()}
        >
            <h2 className="text-lg font-semibold text-destructive">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            {onRetry ? (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center justify-center rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    {retryLabel}
                </button>
            ) : null}
        </section>
    );
}
