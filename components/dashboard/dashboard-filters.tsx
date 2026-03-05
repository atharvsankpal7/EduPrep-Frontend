"use client";

import { Search, X } from "lucide-react";
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

const testTypeOptions: { value: TestTypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "custom", label: "Custom" },
    { value: "cet", label: "CET" },
];

const sortByOptions: { value: SortByOption; label: string }[] = [
    { value: "attemptedAt", label: "Date" },
    { value: "score", label: "Score" },
    { value: "timeTaken", label: "Duration" },
];

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
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="dashboard-search"
                        type="text"
                        placeholder="Search by test or topic"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-9 border bg-background pl-9 pr-9 text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortByOption)}>
                        <SelectTrigger className="h-9 w-[120px] text-xs" id="sort-by-select">
                            <SelectValue placeholder="Sort" />
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
                        className="h-9 px-3 text-xs"
                        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                        id="sort-order-toggle"
                    >
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </Button>
                </div>
            </div>

            <Tabs value={testType} onValueChange={(v) => onTestTypeChange(v as TestTypeFilter)}>
                <TabsList className="h-9 w-full justify-start gap-1 overflow-x-auto bg-muted/30 p-1 sm:w-auto">
                    {testTypeOptions.map((opt) => (
                        <TabsTrigger
                            key={opt.value}
                            value={opt.value}
                            className="whitespace-nowrap px-3 text-xs data-[state=active]:shadow-none"
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
