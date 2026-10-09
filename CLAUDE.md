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

Use the glossary terms consistently in code names and internal discussion. For text a customer will read (UI copy, Linear issues, release notes, emails), follow the **Customer wording** section below instead.

`docs/ui-rules.md` and `docs/design.md` are the UI rules and the design system. Read them before building or changing any screen.

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

## UI rules

- Follow `docs/ui-rules.md`: reuse shared components, one component per file, and **no hard-coded colours** — use the tokens in `app/globals.css` only (no hex, no stock Tailwind colours).
- Verification results (CoP Status, ID Name Match, Match / Close Match / No Match) always use `VerificationPill`.
- If you add a component, token or route, update `docs/design.md`.

## Customer wording

Customers are venue owners and finance teams: strong financial knowledge, not engineers. For anything a customer could read, use the `customer-wording` skill (`.claude/skills/customer-wording/SKILL.md`):
- Prefer plain, general words over technical or internal ones, and check that a name means the same thing to the customer as it does to us (e.g. "Manual Bank Transfer", "non-cash destination").
- Finance words (BSB, cheque, EFT) are fine; engineering and internal words are not.
- Keep one name per thing everywhere. If you are unsure about a term, list it in your reply so it can be confirmed — don't guess.
- This does not apply to code names or internal developer discussion, or when technical wording is asked for.

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
