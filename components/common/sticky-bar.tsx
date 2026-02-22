import { cn } from "@/lib/utils";

const positionVariants = {
    top: "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur",
    bottom:
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-3 py-4 backdrop-blur",
};

interface StickyBarProps extends React.ComponentPropsWithoutRef<"div"> {
    position: keyof typeof positionVariants;
}

export function StickyBar({ position, className, ...props }: StickyBarProps) {
    return <div className={cn(positionVariants[position], className)} {...props} />;
}
