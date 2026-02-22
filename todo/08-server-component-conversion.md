# Task 08 — Server Component Conversion

## Priority: 🟠 High
## Estimated Effort: 1–2 hours
## Dependencies: None (can be done in parallel with other tasks)

---

## Why This Matters

Every page in this app is marked `"use client"`. This means:
- The full JavaScript bundle ships to the browser for every page
- No server-side rendering benefit (defeats the purpose of Next.js App Router)
- Static content is hydrated unnecessarily
- TTFB (Time To First Byte) is slower than it needs to be

Several pages are pure static content that can be server components, shipping zero JavaScript.

---

## Pages to Convert

### 1. `app/page.tsx` (Landing Page) — ALREADY A SERVER COMPONENT ✅

```tsx
// No "use client" directive — already correct!
import { NavBar } from '@/components/navbar';
import { HeroSection } from '@/components/sections/hero';
// ...
export default function Home() { ... }
```

This is already good. BUT — `NavBar` is a client component (uses hooks). This is fine — the page is a server component that renders client component children. The boundary is correct.

**Action:** No change needed.

---

### 2. `app/test/page.tsx` — CONVERT TO SERVER COMPONENT

**Current:** `"use client"` — uses `framer-motion` for card animations.

**Analysis:** The only interactive elements are `<Link>` components (which work in server components). The `motion.div` animations are the sole reason for `"use client"`.

**Fix:** Remove `"use client"` and replace `motion.div` with CSS animations.

```tsx
// REMOVE: "use client"
// REMOVE: import { motion } from "framer-motion"

// Replace motion.div with a wrapper that uses CSS animation
// You already have fadeInUp animations in globals.css

export default function TestPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Education Level</h1>
          <p className="text-muted-foreground">...</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {educationLevels.map((level, i) => (
            <Link href={level.href} key={level.id}>
              <div style={{ animationDelay: `${i * 100}ms` }}
                   className="animate-fade-in-up">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 card-highlight glass-effect">
                  {/* ... same content ... */}
                </Card>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Note:** The `animate-fade-in-up` class already exists in `globals.css` under `.landing-page-glm`. You need to make it available globally (move it out of the `.landing-page-glm` scope) or create a general-purpose animation class.

**Add to `globals.css`:**
```css
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

---

### 3. `app/test/undergraduate/page.tsx` — CONVERT TO SERVER COMPONENT

Same pattern as above. Uses `motion.div` for card stagger animations. Replace with CSS.

**Action:** Remove `"use client"`, remove `framer-motion`, use CSS animations.

---

### 4. `app/admin/page.tsx` — CONVERT TO SERVER COMPONENT

**Current:** `"use client"` — but contains ZERO interactive elements. All content is static cards with `<Link>` components.

**Action:** Simply remove `"use client"`. Nothing else changes.

```tsx
// REMOVE: "use client"
import Link from "next/link";
import { Card, ... } from "@/components/ui/card";
// ... rest is the same
```

---

### 5. `app/admin/layout.tsx` — CHECK IF SERVER COMPONENT

```tsx
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <NavBar />
      {children}
    </div>
  );
}
```

This should already be a server component (no `"use client"` directive). `NavBar` is a client component, but that's fine — it's a child rendered within a server component.

**Action:** Verify no `"use client"` is present. No change needed.

---

### 6. `app/test/layout.tsx` — ALREADY A SERVER COMPONENT ✅

No `"use client"`. Correct.

---

### Pages That MUST Remain Client Components

| Page | Why |
|---|---|
| `app/test/[...id]/page.tsx` | Uses `useQuery`, `useRouter`, event handlers |
| `app/result/[...id]/page.tsx` | Uses `useQuery`, `useMemo` |
| `app/(auth)/sign-in/page.tsx` | Uses `useForm`, `useMutation`, controlled inputs |
| `app/(auth)/sign-up/page.tsx` | Same as sign-in |
| `app/test/undergraduate/gate/page.tsx` | Uses `useState` for test flow |
| `app/test/undergraduate/custom/page.tsx` | Uses `useState`, `useMutation` |
| `app/test/junior-college/page.tsx` | Needs review — likely convertible |
| `app/admin/students/page.tsx` | Uses queries and filters |

---

## Handling Components That Import Client-Only Libraries

Some `components/ui/` shadcn components have `"use client"` (e.g., `Card` which uses `forwardRef`). These can still be imported by server components — the `"use client"` boundary is at the component level, not the file level.

**Rule of thumb:** If a page component only:
1. Renders other components (client or server)
2. Uses `<Link>` for navigation
3. Passes static props

Then it can be a server component, even if its children are client components.

---

## CSS Animation Utility

Since we're replacing `framer-motion` stagger animations with CSS, add these utility classes to `globals.css`:

```css
/* General-purpose entrance animations */
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

/* Stagger delay utilities */
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
.stagger-4 { animation-delay: 400ms; }
```

These replace the `framer-motion` stagger pattern for static pages. Pages with truly interactive animations (e.g., drag-based, gesture-based) should keep `framer-motion`.

---

## Verification

```
[ ] app/test/page.tsx — no "use client", no framer-motion import
[ ] app/test/undergraduate/page.tsx — no "use client", no framer-motion import
[ ] app/admin/page.tsx — no "use client"
[ ] CSS animation utilities added to globals.css
[ ] Card animations still work visually (CSS replaces framer-motion)
[ ] npx next build — must pass cleanly
[ ] Check build output: converted pages should show as static/server-rendered (○ or ● in build output, not ƒ)
```
