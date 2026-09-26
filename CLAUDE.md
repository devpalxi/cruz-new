@AGENTS.md

# CLAUDE.md

This file guides Claude Code when working in this repository.

## Project purpose

This repo holds **UI prototypes** for Cruz Money. It is **not the production app**.
- Focus on screens, layouts, and interaction flows.
- Use mock/static data. Do not build real backends, APIs, auth, or persistence.
- Favor speed and visual fidelity over production hardening.

## Session start

At the start of every session, read all Markdown files in `docs/` before doing any work:
- `docs/cruz-money-system-overview.md`
- `docs/strapi-onboarding-guide.md`
- `docs/v1-glossary.md`
- plus any other `.md` files added to `docs/` later.

Use the glossary terms consistently in UI copy and code names.

## Stack

- Next.js 16 (App Router, `app/` directory), React 19, TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Package manager: pnpm
- Commands: `pnpm dev`, `pnpm build`, `pnpm start`

This Next.js version has breaking changes — check `node_modules/next/dist/docs/` before using unfamiliar APIs (see AGENTS.md).

## Component rules

- **Do not create components inline** inside pages or other components.
- Always **import from pre-made components**. Reuse existing ones first.
- If a needed component doesn't exist, create it as its own file in the shared components folder, then import it.

## After building something

- **Do not auto-commit.** Leave all changes uncommitted for the user to review.
- End with a short summary containing:
  1. **What was built**
  2. **Files changed** (created / modified)
  3. **How to verify manually** (e.g. run `pnpm dev`, open which route, what to click/check)

## Icons

- Use **react-icons** and **lucide-react** for all icons. Search both libraries first.
- Only if the icon exists in neither, create it inline in `components/ui/Icons.tsx` (SVG, `currentColor`).
- Size icons in rem (e.g. `size="1.5rem"`), not px — the root font size is 80% (see `docs/design.md`).
