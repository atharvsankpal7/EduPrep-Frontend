"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-2.5 w-16" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-2.5 w-20" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function CardSkeleton() {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex gap-4 mb-3.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
                <Skeleton className="h-9 w-28 rounded-md" />
            </div>
        </Card>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <StatsSkeleton />

            {/* Filter skeleton */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-9 w-full sm:max-w-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-[120px]" />
                        <Skeleton className="h-9 w-16" />
                    </div>
                </div>
                <Skeleton className="h-9 w-full sm:w-[480px] rounded-md" />
            </div>

            {/* Cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
