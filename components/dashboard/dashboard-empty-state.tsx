"use client";

import { motion } from "framer-motion";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

export function DashboardEmptyState({ hasFilters, onClearFilters }: DashboardEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center rounded-lg border bg-card px-6 py-14"
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>

            {hasFilters ? (
                <>
                    <h3 className="mb-1 text-base font-semibold text-foreground">
                        No matching tests found
                    </h3>
                    <p className="mb-5 max-w-md text-center text-sm text-muted-foreground">
                        Adjust your filters or search terms to view more results.
                    </p>
                    <Button variant="outline" onClick={onClearFilters} size="sm">
                        Clear filters
                    </Button>
                </>
            ) : (
                <>
                    <h3 className="mb-1 text-base font-semibold text-foreground">No tests yet</h3>
                    <p className="mb-5 max-w-md text-center text-sm text-muted-foreground">
                        Start a test to see your performance history on this dashboard.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/test">
                            Start a test
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                </>
            )}
        </motion.div>
    );
}
