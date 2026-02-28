import { cn } from "@/lib/utils";

const surfaceVariants = {
    default:
        "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
    muted:
        "rounded-2xl border border-border bg-muted shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
};

interface SurfaceProps extends React.ComponentPropsWithoutRef<"div"> {
    variant?: keyof typeof surfaceVariants;
}

export function Surface({ variant = "default", className, ...props }: SurfaceProps) {
    return <div className={cn(surfaceVariants[variant], className)} {...props} />;
}
