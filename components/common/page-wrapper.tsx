import { cn } from "@/lib/utils";

interface PageWrapperProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
}

export function PageWrapper({ className, children, ...props }: PageWrapperProps) {
    return (
        <div className={cn("mx-auto w-full max-w-[1380px] px-4 pb-28 pt-6 lg:px-8", className)} {...props}>
            {children}
        </div>
    );
}
