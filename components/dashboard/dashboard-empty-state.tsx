"use client";

import { motion } from "framer-motion";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

export function DashboardEmptyState({
    hasFilters,
    onClearFilters,
}: DashboardEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-16 px-6"
        >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>

            {hasFilters ? (
                <>
                    <h3 className="text-lg font-semibold text-foreground mb-1.5">
                        No tests match your filters
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                        Try adjusting your search query or filter criteria to find the tests
                        you&apos;re looking for.
                    </p>
                    <Button variant="outline" onClick={onClearFilters} size="sm">
                        Clear Filters
                    </Button>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-foreground mb-1.5">
                        No tests attempted yet
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                        Start your exam preparation journey by taking your first mock test.
                        Your performance history will appear here.
                    </p>
                    <Button asChild className="bg-gradient-blue hover-glow">
                        <Link href="/test">
                            Take Your First Test
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                    </Button>
                </>
            )}
        </motion.div>
    );
}
