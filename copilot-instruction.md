## PetSetu Copilot Instructions

This document guides future AI/code assistants when working on the PetSetu codebase.

### Project Overview

PetSetu is a pet super app + marketplace enabling users to buy, sell, adopt, and manage pet care (food tracking, medicines, vaccine card, routines, reminders). Web app uses Next.js 13 (app router) with Tailwind + shadcn/ui style component set.

### Tech Stack

- Next.js 13.5 (App Directory)
- TypeScript
- TailwindCSS + shadcn/ui (Radix primitives)
- Lucide icons

### Conventions

- Use server components for primary data pages (SEO) unless interactivity/stateful UI mandates a client component. Add `"use client"` only where needed.
- Prefer explicit type definitions in `lib/types.ts`.
- Utility fetchers in `lib/api.ts`. Keep them thin and typed.
- Keep UI components presentational & composable. Reuse existing design system components in `components/ui`.
- Favor semantic, descriptive URLs. Example: `/search?q=pug&type=sell` rather than nested, unless a fully structured taxonomy is introduced.
- Use `cache: 'no-store'` for dynamic marketplace queries to avoid showing stale listings.

### Pull Request Guidance

1. Include concise summary & reasoning for architectural changes.
2. Add/adjust types when API shape changes.
3. Include basic error handling & empty states.
4. Maintain accessibility: alt attributes, semantic headings, focusable buttons/links.
5. Avoid over-fetching. Pagination or infinite scroll for large lists.

### Adding New Feature Pages

1. Create a server page under `app/<route>/page.tsx`.
2. Add `generateMetadata` for SEO.
3. Isolate client-only logic (filters, interactive widgets) into colocated components with `"use client"`.
4. Validate API calls (status check) & surface user-friendly errors.

### API Integration

The posts API endpoint (currently) expects POST with body filters and query params for pagination/sorting.
Example (simplified):

```
POST /v1/post/get-posts?sortBy=createdAt:desc&page=1&limit=20
{ "isActive": true, "postType": "all" }
```

Add new filter keys cautiously—document speculative ones with comments.

### Styling

- Gradient backgrounds + soft shadows for hero/feature sections.
- Cards: subtle scale/ shadow hover transitions (`transition-all duration-300`).
- Use existing utility `cn` for conditional classes.

### Performance

- Avoid unnecessary client bundles. Keep heavy logic server-side.
- Defer non-critical JS (e.g., analytics) via dynamic import if added later.

### Testing (Future)

- Introduce lightweight component tests (e.g., Vitest/Testing Library) when behavior becomes complex.

### Roadmap Ideas (Document Only)

- Individual post detail page `/post/[id]/[slug]` with structured data for SEO (JSON-LD).
- Saved searches & alerts.
- Infinite scroll or cursor pagination.
- Authentication & user dashboards.
- Pet personalization module (care timeline, reminders, health records).

### Assistant Expectations

When modifying code:

- Keep patches focused; avoid broad reformatting.
- Update this file when introducing conventions or patterns.
- Flag any ambiguous API behavior with a TODO.

---

Last updated: 2025-08-27
