"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export function StoreHydrationGate({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // If already hydrated (e.g. navigating within the SPA), render immediately
        const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));

        // In case hydration already completed before this effect ran
        if (useAuthStore.persist.hasHydrated()) {
            setHydrated(true);
        }

        return unsub;
    }, []);

    if (!hydrated) return null;

    return children;
}
