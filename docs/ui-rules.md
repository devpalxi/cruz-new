# Cruz Money — UI Rules

The rules every new screen follows so the whole prototype looks and behaves like one product. `docs/design.md` lists the tokens and components that exist; this file says how to use them. If a rule here and a one-off need collide, change the shared piece (component or token) — don't work around it in the page.

---

## 1. Reuse before you build

1. **Look first.** Before writing any UI, check `components/ui/` (generic pieces) and the feature folders (`components/collector/`, `approver/`, `authoriser/`, `admin/`, `payout-review/`). If something close exists, use it or extend it.
2. **Anything used twice becomes a component.** The second copy is the signal. Copy-pasted markup is a bug, even if it looks identical today.
3. **Where it lives.**
   - Generic and role-neutral (button, input, pill, alert, modal, table piece) → `components/ui/`.
   - Specific to one role or flow → that role's folder.
   - Shared by two roles (e.g. Approver + Authoriser) → `components/payout-review/` or `components/ui/`.
4. **One component per file.** Never define a component inside a page or inside another component's file, not even a small helper. Pages only assemble components.
5. **Pages stay thin.** A `page.tsx` renders the shell and one view component. Logic, state and markup live in components.
6. **Extend with props, not forks.** If a variant is needed (size, tone, label), add a prop to the shared component. Don't create `FooButton2`.
7. **Don't restyle at the call site.** A `className` passed in may adjust layout (width, margin, height). It must not change colour, border or typography that the component owns.

## 2. Colour: tokens only

1. **Every colour is a token** defined in `app/globals.css` and used by its utility name (`bg-brand`, `text-ink`, `border-line`, `bg-success-soft`, ...). The token list is in `docs/design.md`.
2. **No hard-coded colours.** Not as hex (`#2b2e33`), not as arbitrary values (`bg-[#ebf5ff]`), not as `rgb()`/`hsl()`, and not with Tailwind's stock palette (`text-red-700`, `bg-blue-100`).
3. **White and black.** Use `bg-surface` for white surfaces and `text-ink` for text. `text-white` is allowed only on a filled brand, danger or ink background.
4. **Need a new colour?** Add a token to `globals.css` (both the variable and its `--color-*` mapping), document it in `docs/design.md`, then use it. Name it by purpose (`info-soft`, `warn-line`), not by appearance (`light-blue`).
5. **Transparency.** If a tint is needed, make it its own token (e.g. `success-soft`). Don't write alpha hex like `#4daa9e1a` inline.
6. **Meaning is consistent.** The same meaning always gets the same tone everywhere: success = green, warning = amber, danger = red, info = blue. Never reuse a tone for a different meaning.

## 3. Status and result display

1. **Verification results** (Account Name Check, ID Name Match, any Match / Close Match / No Match) are always a `VerificationPill`. Never plain coloured text. See the rule in `docs/design.md`.
2. **Other statuses** use the existing pill (`StatusPill`, `PayoutStatusPill`). A new status adds a tone or value there; it doesn't get its own badge.
3. **Alerts and warnings** use `WarningAlert` (`warning`, `success`, `danger`). Don't write another alert box.
4. **The same data looks the same on every role's page.** If the Approver and Authoriser both show it, they use the same component.

## 4. Sizing, spacing and type

1. **rem, never px.** The root font size is 80% (see `docs/design.md`), so `1.5rem`, not `24px`. Icon `size` props are rem strings too.
2. **Fonts.** The font is Rubik via `font-sans`. Don't set another family.
3. **Match existing values.** Reuse the established sizes: page title `text-[2.5rem] font-bold text-brand`, field label `text-base font-semibold text-label`, inputs `h-[4.5rem]`, action buttons `h-[2.875rem]`. If a screen needs different, change the shared piece, not one page.
4. **Form layout.** Label above control, labels via `FormField`, controls via `TextInput` / `SelectInput` / `CurrencyInput` etc. Back (outline) on the left, Next/primary on the right, equal width.
5. **No magic numbers repeated.** If the same arbitrary value shows up in three places, it's a token or a component prop.

## 5. Icons

1. Use **lucide-react** or **react-icons**. Search both before anything else.
2. Only if neither has the icon, add an inline SVG to `components/ui/Icons.tsx` using `currentColor`.
3. Size in rem (`size="1.5rem"`). Colour comes from the parent's text colour token, never an icon-level colour value.

## 6. States and behaviour

1. **Every control has its states:** default, hover, focus, disabled, and an error state where input can be wrong. Use the shared component's states; don't re-implement them.
2. **Focus is always visible** (`focus` token ring). Never remove the outline without replacing it.
3. **Disabled primary actions** use the shared disabled style, and the page says why (helper text) when the reason isn't obvious.
4. **Optional vs required.** Required fields block Next; optional fields are labelled "(optional)" and never block. Say so in the label.
5. **Validate on input, show errors near the field,** in the danger tone, in plain language.
6. **Prototype only:** use mock data and in-browser state. Controls that exist only to demo a state (e.g. "Pass / Server unavailable") must be labelled "Prototype only".

## 7. Copy and naming

1. **Use the glossary terms** from `docs/v1-glossary.md` exactly (Collector, Approver, Authoriser, CoP, IDV, BSB...). Don't invent synonyms.
2. **One name per concept across the app.** If a label is renamed (e.g. "Non Cash Details"), rename it everywhere it appears, not only on one screen.
3. **Title Case** for headings, labels and buttons; sentence case for helper and error text.
4. **Plain, formal language.** No jargon in user-facing text, no exclamation marks, no emoji.

## 8. Accessibility basics

1. Every input has a visible label tied to it (`htmlFor` / `id`). Icon-only buttons have an `aria-label`.
2. Don't rely on colour alone. Pills carry an icon and text; errors carry text.
3. Keyboard works: everything clickable is a real `button` or `a`, in a sensible tab order.
4. Text contrast uses the existing tokens, which are tuned for the page backgrounds. Don't put `muted` text on a tinted background without checking it.

## 9. Before you finish a screen

Check each item:

- [ ] No hex, `rgb()`, arbitrary colour or stock Tailwind colour in the files I touched.
- [ ] Nothing I wrote is a copy of something that already exists in `components/`.
- [ ] Anything I wrote that is used twice is its own component, one per file.
- [ ] Sizes are rem and match the established values.
- [ ] Results and statuses use the shared pill; alerts use `WarningAlert`.
- [ ] Labels use glossary terms and match the same concept elsewhere.
- [ ] `docs/design.md` is updated with any new component, token or route.
- [ ] `pnpm build` (or `tsc --noEmit`) passes, and I opened the page and checked it.

## 10. Known exceptions to clean up

These existing files break the rules above. They aren't fixed yet; fix them when touching the file, or as one cleanup task.

- **Repeated hard-coded success green** (`#4daa9e80`, `#4daa9e1a`, `#2b2e33`): `components/ui/StatusPill.tsx`, `components/ui/WarningAlert.tsx`, `components/collector/AccountNameValidationAlert.tsx`, `components/payout-review/NameComparison.tsx`. Replace with success tokens.
- **Hard-coded info-box blue** (`#ebf5ff`, `text-blue-800`): `components/collector/ChequeOptionalScenario.tsx`, `components/collector/SecondaryIdForm.tsx`. Replace with an `InfoBox` component and info tokens.
- **Duplicated alert styling:** `AccountNameValidationAlert` keeps its own copy of the tone map that `WarningAlert` already owns.
- **Duplicated notes textarea:** the Approver and Authoriser notes (`ApprovalPanel`, `AuthorisationPanel`) each carry their own styled `<textarea>`. Replace with one shared component.
- **Repeated step heading classes:** the large page-title styling is repeated across the Collector pages. Replace with one heading component.
- **Stock Tailwind colours** (`text-red-700` and similar) in several `components/ui/` and approver files, including `WarningAlert`, `StatusPill` and `NameMatchStatus`. Replace with danger/warn tokens.
- **Admin dashboard `ResultPill`** has its own cell style, separate from `VerificationPill`. Decide whether to unify.
