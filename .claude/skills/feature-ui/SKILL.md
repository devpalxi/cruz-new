---
name: feature-ui
description: The Cruz Money workflow for building the UI of a new feature in this prototype repo — read the project docs, plan the screens, write the plan and clarifying questions into questions.md, wait for answers, build the UI with the shared components, theme tokens, UI rules and customer wording, and then clear the feature's section from questions.md when the user says it is complete. Use this whenever the user describes a feature, screen, flow or change they want a UI for ("I want to build the UI for…", "new feature:", "add a screen where the Authoriser can…", a pasted Jira or Linear ticket), and whenever they say a feature is done, completed or finished so its questions can be removed — even if they don't name the skill or mention questions.md.
---

# Feature UI workflow

This repo holds UI prototypes for Cruz Money. After a screen is built here, a developer rebuilds it with the same stack in the production codebase, so the prototype has to match the real theme, components and wording exactly. This workflow makes sure every new feature starts from a shared understanding: Claude plans first, the user answers the open questions, and only then is the UI built.

There are two moments this skill covers:

- **Starting a feature**: the user describes what they want. Go through steps 1–5 below.
- **Finishing a feature**: the user says a feature is complete. Go to "When the user says a feature is complete".

If the user comes back mid-way (for example with answers to earlier questions), open `questions.md`, find the feature's section, and pick up from the step its status shows.

## Step 1: Read the project context

Before planning, read what the project already says. These files change often, so read them each time instead of relying on memory:

- `CLAUDE.md` and `AGENTS.md` in the repo root.
- Every `.md` file in `docs/`. The key ones are `docs/ui-rules.md` (the UI rules), `docs/design.md` (the design system: tokens, components, routes), `docs/v1-glossary.md` (internal names), `docs/cruz-money-system-overview.md` (roles and flows), and `docs/progress-and-next-steps.md` (what exists and recent decisions). Read any new files there too.
- `.claude/skills/customer-wording/SKILL.md`, because every label, button, heading and help line in the new UI is something a customer reads.
- `questions.md` in the repo root, if it exists, so you don't repeat a question that is already open for a related feature.

Then look at the code the feature touches: the relevant route under `app/` (admin, collector, approver, authoriser and so on), the components in `components/<area>/` and `components/ui/`, and the mock data in `lib/`. The goal is to reuse what exists. A new feature that looks like the rest of the product is worth more than a clever one-off.

This repo uses a Next.js version with breaking changes. If the feature needs an API you haven't used here, check `node_modules/next/dist/docs/` first.

## Step 2: Plan the UI

Work out, in plain terms:

- **Who uses it**: which role (Admin, Collector, Approver, Authoriser, or a venue user), and at what point in their flow.
- **Where it lives**: a new route, a new section on an existing page, a modal or a panel.
- **What to reuse**: existing components that already do the job (cards, tables, pills, form rows, `VerificationPill` for any verification result). Check `docs/design.md` and `components/` before deciding something is new.
- **What is new**: each new component gets its own file in the right `components/` folder, per the component rules. Note any new token (in `app/globals.css` only) or route.
- **Mock data and scenarios**: what data the screen needs in `lib/`, and which scenarios a reviewer should be able to click through (the normal case, edge cases, empty, disabled, error).
- **Wording**: the customer-facing names for new things. Check them against the customer-wording skill and the glossary. List any name you're unsure of as a question rather than guessing.

Keep the plan proportional to the feature. A small change needs a few lines; a new flow needs more.

## Step 3: Write the plan and questions into questions.md

`questions.md` lives in the repo root. It holds one section per feature that is in progress, so the user and future sessions can see what was planned and what is still open. Create the file if it doesn't exist, using the header below. Add the new feature as a new section at the end. Don't edit other features' sections.

Use this structure so sections stay consistent and easy to remove later:

```markdown
# Feature questions

Plans and open questions for features in progress. A feature's section is removed once the feature is marked complete.

---

## <Feature name>

_Started: <YYYY-MM-DD> · Status: Waiting for answers_
<Jira or Linear key and link, if the user gave one>

### What we're building

<Two to four plain sentences: what the feature is, who it's for, and what they can do with it.>

### How we plan to build it

- **Who uses it:** <role and where in their flow>
- **Where:** <route or page, new or existing>
- **Reuse:** <existing components>
- **New:** <new components, tokens or routes, each with its file path>
- **Mock data and scenarios:** <data in lib/ and the scenarios to click through>
- **Wording to confirm:** <customer-facing names that need sign-off, or "None">

### Questions

1. **<Question?>** <Why it matters, and the default you'll use if the user prefers you to decide.>
   - Answer: _pending_
2. ...

---
```

Good questions are ones where the answer changes what gets built: scope edges, which role sees what, what happens in an edge case, which name to use. Give each one a sensible default so the user can reply "go with your defaults". Skip questions the docs already answer. If you genuinely have no questions, say so in the section ("No open questions") and keep the plan.

The feature name is the heading, so use the name the user gave the feature (or a short, plain name if they didn't).

## Step 4: Ask, then wait

Tell the user the plan is in `questions.md` and put the questions to them in chat as well, so they can answer without opening the file. Where a question has two to four clear options, the AskUserQuestion tool works well; otherwise list them briefly.

Don't start building until the user has answered or told you to go ahead with your defaults. Building on a wrong assumption costs more than the wait, because the developer copies what's built here.

When answers come in, write each one under its question in `questions.md` (replace `_pending_`), update the plan bullets if an answer changed them, and set the status to `Building`. This keeps the file the single record of what was decided for the feature.

## Step 5: Build the UI

Build to the plan, following the project rules:

- Reuse shared components. Don't create components inline in pages or other components. Each new component is its own file in the shared components folder.
- No hard-coded colours: only the tokens in `app/globals.css` (no hex values, no stock Tailwind colours).
- Verification results (CoP Status, ID Name Match, Match / Close Match / No Match) always use `VerificationPill`.
- Icons from react-icons or lucide-react, sized in rem.
- Customer-facing text follows the customer-wording skill. Code names follow the glossary.
- Mock or static data only. No backend, API, auth or persistence.
- If you add a component, token or route, update `docs/design.md`, as `CLAUDE.md` requires.

Check your work before handing it over: run `npx tsc --noEmit`, and open the route in the preview to click through each scenario from the plan. Fix what you find.

Then set the feature's status in `questions.md` to `Ready for review`, and if anything new came up while building, add it as a question there and mention it to the user.

Don't commit. Leave the changes for the user to review, and end with the summary `CLAUDE.md` asks for:

1. **What was built**
2. **Files changed** (created / modified)
3. **How to verify manually** (run `pnpm dev`, which route to open, what to click and check)

Also list any customer-facing term you weren't sure about, so it can be confirmed.

## When the user says a feature is complete

When the user says a feature is done, completed or finished:

1. Open `questions.md` and find that feature's section by its heading. If the name is ambiguous or matches more than one section, ask which one they mean.
2. Delete that section only: from its `## <Feature name>` heading through the `---` divider that closes it. Leave the file header and every other feature's section as they are.
3. If no feature sections remain, keep the file with just its header and intro line, so the next feature has somewhere to go.
4. Tell the user in one line which section was removed. If the section still had unanswered questions, name them first and check the user is happy to drop them; they might belong in Linear instead.

Removing the section is the whole job here. Don't change code or other docs unless the user asks.
