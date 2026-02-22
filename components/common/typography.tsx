import { cn } from "@/lib/utils";

const typographyVariants = {
    pageTitle: "text-base font-semibold tracking-tight text-foreground",
    sectionTitle: "text-xl font-semibold tracking-tight text-foreground lg:text-2xl",
    body: "text-sm text-muted-foreground",
};

interface TypographyProps extends React.ComponentPropsWithoutRef<"div"> {
    variant: keyof typeof typographyVariants;
}

export function Typography({ variant, className, ...props }: TypographyProps) {
    return <div className={cn(typographyVariants[variant], className)} {...props} />;
}
