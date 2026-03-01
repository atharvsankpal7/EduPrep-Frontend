## 2026-03-01 - Memoizing SectionTimer
**Learning:** React 18 / Next.js app needs strict functional component memoization with referential equality checking to prevent heavy UI re-renders on every tick.
**Action:** When working with high-frequency updates (e.g. countdowns) ensure  and  callbacks passed down are fully wrapped in  inside the parent.
## 2024-05-19 - Memoizing SectionTimer
**Learning:** React 18 / Next.js app needs strict functional component memoization with referential equality checking to prevent heavy UI re-renders on every tick.
**Action:** When working with high-frequency updates (e.g. countdowns) ensure onTick and onExpire callbacks passed down are fully wrapped in useCallback inside the parent.
