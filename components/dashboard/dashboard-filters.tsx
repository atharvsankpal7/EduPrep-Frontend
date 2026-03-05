"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TestType } from "@/types/global/interface/test-history.interface";

// ─── Types ────────────────────────────────────────────────────────────────

export type TestTypeFilter = TestType | "all";
export type SortByOption = "attemptedAt" | "score" | "timeTaken";
export type SortOrder = "asc" | "desc";

interface DashboardFiltersProps {
    testType: TestTypeFilter;
    onTestTypeChange: (value: TestTypeFilter) => void;
    search: string;
    onSearchChange: (value: string) => void;
    sortBy: SortByOption;
    onSortByChange: (value: SortByOption) => void;
    sortOrder: SortOrder;
    onSortOrderChange: (value: SortOrder) => void;
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────

const testTypeOptions: { value: TestTypeFilter; label: string }[] = [
    { value: "all", label: "All Tests" },
    { value: "custom", label: "Custom" },
    { value: "cet", label: "CET" },
];

const sortByOptions: { value: SortByOption; label: string }[] = [
    { value: "attemptedAt", label: "Date" },
    { value: "score", label: "Score" },
    { value: "timeTaken", label: "Duration" },
];

// ─── Component ────────────────────────────────────────────────────────────

export function DashboardFilters({
    testType,
    onTestTypeChange,
    search,
    onSearchChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
}: DashboardFiltersProps) {
    return (
        <div className="space-y-4">
            {/* ─── Search + Sort Row ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="dashboard-search"
                        type="text"
                        placeholder="Search tests by name or topic…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-9 h-9 text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortByOption)}>
                        <SelectTrigger className="w-[120px] h-9 text-xs" id="sort-by-select">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortByOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-2.5 text-xs"
                        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                        id="sort-order-toggle"
                    >
                        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                    </Button>
                </div>
            </div>

            {/* ─── Test Type Tabs ───────────────────────────────────── */}
            <Tabs
                value={testType}
                onValueChange={(v) => onTestTypeChange(v as TestTypeFilter)}
            >
                <TabsList className="h-9 gap-0.5 bg-muted/60 p-0.5 w-full sm:w-auto overflow-x-auto flex-nowrap">
                    {testTypeOptions.map((opt) => (
                        <TabsTrigger
                            key={opt.value}
                            value={opt.value}
                            className="text-xs px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                            id={`filter-tab-${opt.value}`}
                        >
                            {opt.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
