"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTest } from "@/lib/api/hooks/useCreateTest";
import { useToast } from "@/components/ui/use-toast";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestById } from "@/lib/api/services/test.api";
import type {
    TCreateTestParams,
    TCreateTestResponse,
} from "@/types/global/interface/test.apiInterface";

export function extractTestId(response: TCreateTestResponse): string | null {
    const nested = response?.data?.testDetails?.testId;
    if (nested) return nested;

    if (response?.testId) return response.testId;

    return null;
}

interface UseCreateAndNavigateReturn {
    createAndNavigate: (params: TCreateTestParams) => void;
    isPending: boolean;
    hasError: boolean;
    clearError: () => void;
}

export function useCreateAndNavigate(): UseCreateAndNavigateReturn {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const mutation = useCreateTest();
    const [hasError, setHasError] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const clearError = useCallback(() => setHasError(false), []);

    const createAndNavigate = useCallback(
        async (params: TCreateTestParams) => {
            if (isStarting) return;

            try {
                setIsStarting(true);
                setHasError(false);

                const response = await mutation.mutateAsync(params);
                const testId = extractTestId(response);

                if (!testId) {
                    throw new Error("Missing test ID in response");
                }

                await queryClient.fetchQuery({
                    queryKey: queryKeys.tests.detail(testId),
                    queryFn: () => fetchTestById(testId),
                });

                router.push(`/test/${testId}`);
            } catch (error) {
                setIsStarting(false);
                setHasError(true);
                toast({
                    title: "Error",
                    description: "Failed to create or load test. Please try again.",
                    variant: "destructive",
                });
            }
        },
        [mutation, queryClient, router, toast, isStarting],
    );

    return {
        createAndNavigate,
        isPending: isStarting,
        hasError,
        clearError,
    };
}


