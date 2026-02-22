/**
 * Centralised query-key factory.
 *
 * Rules:
 *  1. Every key starts with a domain namespace (`tests`, `topics`, `auth`, …).
 *  2. Keys are deterministic `readonly` tuples — never mutable arrays.
 *  3. Parameterised keys are factory functions; static scopes are plain tuples.
 *  4. `queryClient.invalidateQueries({ queryKey: queryKeys.<domain>.all })`
 *     will cascade to every key that shares the prefix.
 *
 * Reference: https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */

// ────────────────────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────────────────────
export const authKeys = {
    /** Invalidate everything auth-related. */
    all: ["auth"] as const,

    /** Current session / user profile. */
    session: () => ["auth", "session"] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────────────────────
export const testKeys = {
    /** Invalidate everything test-related. */
    all: ["tests"] as const,

    /** Single test by ID (the "take a test" flow). */
    detail: (testId: string) => ["tests", "detail", testId] as const,

    /** Test result by result ID (the "view result" flow). */
    result: (resultId: string) => ["tests", "result", resultId] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Topics
// ────────────────────────────────────────────────────────────────────────────
export const topicKeys = {
    /** Invalidate everything topic-related. */
    all: ["topics"] as const,

    /** CET topic list. */
    cet: () => ["topics", "cet"] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Admin
// ────────────────────────────────────────────────────────────────────────────
export const adminKeys = {
    /** Invalidate everything admin-related. */
    all: ["admin"] as const,

    /** Paginated / filtered student list. */
    students: (params: Record<string, unknown>) =>
        ["admin", "students", params] as const,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Convenience re-export – single import for all domains
// ────────────────────────────────────────────────────────────────────────────
export const queryKeys = {
    auth: authKeys,
    tests: testKeys,
    topics: topicKeys,
    admin: adminKeys,
} as const;
