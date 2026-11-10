# RELIF HOSPITAL — Architecture Decisions

## Decision Log

### D-001: Tech Stack
**Date:** 2026-11-10  
**Decision:** React 18 + Vite + TypeScript + Tailwind CSS v3 + React Router v6 + Firebase (Auth + Firestore + Storage + Functions)  
**Reason:** Matches the brief. Vite for fast dev. Firebase for auth/db/storage without a separate server. Firebase Emulator Suite for local dev.  
**Alternatives considered:** Next.js (SSR helpful for SEO but adds complexity for a demo portfolio), Express backend (overkill for Firebase).

### D-002: Animation Libraries
**Date:** 2026-11-10  
**Decision:** Framer Motion for React component animations + GSAP ScrollTrigger for the Relif Line scroll-driven morphing. Lenis for smooth scroll.  
**Reason:** Framer Motion integrates cleanly with React. GSAP has the best SVG path morphing via MorphSVG/DrawSVG. Lenis is lightweight for smooth scroll.

### D-003: Color — Zero Blue Policy
**Date:** 2026-11-10  
**Decision:** All CSS color tokens defined in `src/styles/tokens.css` as CSS custom properties. Tailwind extended to consume those tokens. No Tailwind default blue/indigo/sky/slate palettes. Lint rule added to block hardcoded hex values in components.  
**Reason:** Per design brief — "NO BLUE ANYWHERE."

### D-004: Fonts
**Date:** 2026-11-10  
**Decision:** Google Fonts — Fraunces (variable), Instrument Sans, JetBrains Mono, Noto Serif Devanagari, Noto Sans Devanagari. Loaded via `@font-face` with `font-display: swap`.  
**Reason:** Per design brief. Variable fonts reduce file count.

### D-005: i18n
**Date:** 2026-11-10  
**Decision:** i18next + react-i18next. Translation files in `src/i18n/locales/{en,hi,mr}/`. Language persisted in localStorage.  
**Reason:** Industry standard, good React integration, supports Devanagari.

### D-006: State Management
**Date:** 2026-11-10  
**Decision:** React Context for auth/user state + local component state for UI. No Redux — scope doesn't require it.  
**Reason:** Keep complexity low. Firebase real-time listeners handle data sync.

### D-007: Component Library
**Date:** 2026-11-10  
**Decision:** Custom component library built from scratch in `src/components/ui/`. No shadcn/ui defaults (they conflict with blue theme policy). Radix UI primitives for accessible modals/dropdowns.  
**Reason:** shadcn defaults require significant de-blue-ing. Building custom ensures full token compliance.

### D-008: AI Assistant
**Date:** 2026-11-10  
**Decision:** "Ask Relif" assistant backed by a Firebase Cloud Function that calls the Gemini API. Rule/keyword fallback for demo mode without API key. Never diagnoses.  
**Reason:** Per brief. API key stays server-side.

### D-009: Payment
**Date:** 2026-11-10  
**Decision:** Razorpay adapter pattern. Demo/sandbox mode by default. Payment orders created server-side, webhooks verified before marking paid.  
**Reason:** Per brief. Never simulate a real payment.

### D-010: Security
**Date:** 2026-11-10  
**Decision:** Firestore security rules cover every collection. Client-side route guards + server-side rules. Document signed expiring URLs via Firebase Storage.  
**Reason:** Defense in depth. UI-only protection is insufficient.

### D-011: Demo Mode
**Date:** 2026-11-10  
**Decision:** `VITE_DEMO_MODE=true` env flag. Demo banner shown globally. All seeded data labelled "Demo". Notifications go to simulated outbox only. Ambulance tracking shows "DEMO" banner.  
**Reason:** Per brief — never imply real services.

### D-012: Tailwind Config
**Date:** 2026-11-10  
**Decision:** `tailwind.config.ts` extends theme with custom color tokens, font families, border radii, box shadows. `safelist` only used for dynamic class generation in queue/status chips.  
**Reason:** Keeps Tailwind purge accurate while supporting dynamic classes.

