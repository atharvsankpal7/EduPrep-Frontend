"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useCreateTest } from "@/lib/api/hooks/useCreateTest";
import { useToast } from "@/components/ui/use-toast";
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
    const mutation = useCreateTest();
    const [hasError, setHasError] = useState(false);

    const clearError = useCallback(() => setHasError(false), []);

    const createAndNavigate = useCallback(
        (params: TCreateTestParams) => {
            mutation.mutate(params, {
                onSuccess: (response) => {
                    const testId = extractTestId(response);
                    if (!testId) {
                        setHasError(true);
                        return;
                    }
                    router.push(`/test/${testId}`);
                },
                onError: () => {
                    setHasError(true);
                    toast({
                        title: "Error",
                        description: "Failed to create test. Please try again.",
                        variant: "destructive",
                    });
                },
            });
        },
        [mutation, router, toast],
    );

    return {
        createAndNavigate,
        isPending: mutation.isPending,
        hasError,
        clearError,
    };
}
