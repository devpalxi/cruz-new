# Progress and Next Steps: Configurable Payouts (Manual Bank + Cheque)

Last updated: 2026-10-10. Written so the work can be picked up on another day with no other context.

Read this together with `CLAUDE.md`, `docs/ui-rules.md` and `docs/design.md`. The skill `.claude/skills/customer-wording/SKILL.md` governs all wording a customer could read.

---

## 1. What this work is

Two Jira epics, split out of one earlier idea:

| Epic | Jira | Story prefix | Stories |
|---|---|---|---|
| Manual Bank Transfer | CRP-250 | MBT-01 to MBT-30 | 30 |
| Cheque, Configurable Payout Destinations | CRP-321 | CHE-01 to CHE-28 | 28 |

- The stories are written in `html/MBT-jira-user-stories.html` and `html/CHE-jira-user-stories.html`. They are the source of truth for what each screen should do.
- Only CHE-01 (CRP-323) and CHE-02 (CRP-326) exist as Jira tickets so far. CRP-326 gives the design direction: a **Venues** list table (Venue name, Payment Method, Daily limit, Client for Super Admin, edit icon on hover) that opens the venue screen.
- The job is **UI prototypes only**: mock data, no backend. Oshada will turn these into technical items in Jira after reviewing the UI. **CSV customisation stories (MBT-26, MBT-27) are out of scope.**
- Target: a first set of stories with screenshots and live links by **Saturday 2026-10-10 end of day**.
- Live prototype: https://cruz-new.vercel.app (only shows what has been deployed; nothing here deploys it).
- Updates go to Linear in this format per story: **issue name, short description, screenshots of the built UI, how the feature works with a live link.** See `docs/linear-updates.md`.

---

## 2. Quick start for the next session

1. Read `CLAUDE.md`, all of `docs/`, and this file.
2. `pnpm dev` (the user often already has it running on port 3000; check before starting another).
3. Open these routes to see the current state (details in section 4):
   - `/admin/venues` and `/admin/venues?role=super-admin`
   - `/collector/payment-breakdown`
   - `/authoriser/payout?scenario=cheque-both` and `/approver/payout?scenario=payment-file`
   - `/collector/returned-payout?type=cheque`
4. Check `git status` and `git log`. The user commits their own work; do not auto-commit.
5. Pick up from section 8 (next steps).

---

## 3. Customer wording (important)

Names were chosen with the `customer-wording` skill (Brien, a venue owner, is the test reader). **None of these are confirmed by Brien or Minosha yet.** They are single constants in `lib/venue-data.ts`, so changing one changes every screen.

| Used on screens | Replaces | Status |
|---|---|---|
| Payment File for Your Bank | Manual Bank Transfer | Suggested by the skill; not confirmed |
| Funds Transfer | Bank Transfer | Chosen by us; always on for every venue |
| Cheque | Cheque | Fine |
| How the Rest Is Paid | Non Cash Details (dropdown label on Payment Breakdown) | Suggested by the skill |
| Payment Method Details | Payout Destination Details (section and Collector step) | **Chosen by the user** |
| Account Name Check | CoP Status | **Chosen by the user** |
| Return for Correction / Send Back for Review / Correct Returned Payout | (new) | Our wording, unconfirmed |
| Who Enters the Cheque Details | (new) | Our wording, unconfirmed |

Still using the **old** wording (left on purpose until the names are agreed):
- "Manual Bank Transfer" in `app/authoriser/manual-bank-export/page.tsx`, `ManualExportView.tsx`, `ExportConfirmDialog.tsx`, `AuthoriserHeader.tsx` ("Manual Bank Export"), `app/payout-destination-scenarios/page.tsx`, and the verification titles in `SummaryView.tsx` and `CopValidationCard` usage.
- Issue names and short descriptions in the story HTML files and `docs/linear-updates.md` (copied from the stories). They say "Manual Bank Transfer" and "payout destination".
- The route `/collector/payout-destination-details` (a code name, kept on purpose).
- The term guide in the skill has **not** been updated with the user's two choices (Payment Method Details, Account Name Check). Minosha reviewed that file, so ask before editing it.

Rules to keep following: one name per thing everywhere; Title Case labels; Cheque spelling; spell out acronyms; tell the user about any term you were unsure of.

---

## 4. What is built

All screens are prototype-only. State is mock data plus `sessionStorage` (resets when the tab closes).

### 4.1 Venues list and Venue Settings (MBT-01 to 07, CHE-01 to 03, CRP-326)

| Route | What it does |
|---|---|
| `/admin/venues` | Admin view: venues of the Admin's own client (Riverside RSL Group). Columns: Venue Name, Payment Method, Daily Limit. Edit pencil appears on row hover. Row click opens settings. |
| `/admin/venues?role=super-admin` | Super Admin view: all clients, plus a Client column. `?role=super-admin` is a prototype stand-in for logging in as a Super Admin. |
| `/admin/venues/[id]` (+ `?role=super-admin`) | Venue Settings. Funds Transfer (always on). Switch for Payment File for Your Bank, with Venue Code (text, keeps leading zeros). Switch for Cheque, with three radio options for who enters the cheque details. Save and Cancel. |
| Home page `/` | "Super Admin Pages" button opens the Super Admin list. |

Behaviour:
- Save with Cheque on and no option chosen: error message, no save. Save success: toast "Settings saved for {venue}."
- Cancel restores the saved values. Reloading shows saved values (per browser tab).
- An Admin opening another client's venue sees "You do not have access to this venue."
- Manage menu now has Users, Machines, **Venues** (`components/admin/AdminHeader.tsx`).

Mock venues (`lib/venue-data.ts`): Riverside RSL Club and Northside Sports Club (Riverside RSL Group), Harbourview Hotel and Bayside Tavern (Harbourview Hospitality). Seed settings: Riverside has Payment File on (code 0042) and Cheque on (Both); Northside has both off; Harbourview has Payment File on (0107); Bayside has Cheque on (Collector Only).

Files: `app/admin/venues/page.tsx`, `app/admin/venues/[id]/page.tsx`, `components/admin/{VenuesView,VenuesTable,VenueSettingsView,VenueSettingsForm,PaymentMethodRow,ChequeModeOptions}.tsx`, `components/ui/{Switch,RadioOption}.tsx`, `lib/venue-data.ts`, `lib/use-venues.ts`.

### 4.2 Collector flow (MBT-09, 10, 11, CHE-06, 07, 08, 13, 15)

- **Payment Breakdown** (`/collector/payment-breakdown`): the dropdown **How the Rest Is Paid** lists only the methods the Collector's venue has switched on. The Collector's venue is fixed to `riverside-rsl-club` (`COLLECTOR_VENUE_ID` in `lib/collector-data.ts`). Membership Card is still always offered (outside these epics). Cash only: leave the dropdown empty.
- **Payment Method Details** (`/collector/payout-destination-details`), reads the chosen method from `sessionStorage` key `cruz.selectedPayoutDestination`:
  - Funds Transfer and Payment File for Your Bank: Account Name, BSB (6 digits), Account Number (digits). Messages appear when the Collector selects Validate Account with bad or empty fields. The Venue Code field is **no longer on this screen** (it comes from Venue Settings). The payment file version has an explanation above the form.
  - Cheque, by the venue's setting:
    - Collector Only: Cheque Number and Cheque Name required (name starts as the winner's name); needs Validate Cheque.
    - Authoriser Only: nothing to enter; a note says so; Next is available.
    - Both: both fields optional; blank values show "Not entered yet" on the Summary; no validation step.
  - If the venue has switched the chosen method off after it was picked, a warning says it is no longer available and Next is blocked. Entered values are kept.
- **Returned payout** (`/collector/returned-payout?type=cheque|payment-file|funds-transfer`): shows who returned it and the reviewer's reason (from `sessionStorage` key `cruz.returnedPayout`, otherwise a sample), with the saved details editable. "Send Back for Review" checks the fields, then shows a toast and switches off.

Files: `components/collector/{PaymentBreakdownForm,PayoutDestinationDetailsForm,BankAccountFields,ChequeDetailsFields,ReturnedPayoutView}.tsx`, `app/collector/returned-payout/page.tsx`, `lib/collector-data.ts`.

### 4.3 Approver and Authoriser review (MBT-08, 12, CHE-04, 09, 11, 12, 14, 16)

`/approver/payout` and `/authoriser/payout` both take `?scenario=`:

| scenario | Paid by | Authoriser behaviour |
|---|---|---|
| `funds-transfer` | Funds Transfer | read-only account details (Approver default) |
| `payment-file` | Payment File for Your Bank | read-only account details; note that it stays pending until the file is uploaded |
| `cheque-collector` | Cheque, Collector Only | cheque details read-only |
| `cheque-authoriser` | Cheque, Authoriser Only | Authoriser enters Cheque Number and Name; **Authorise stays off until both are entered and Validate Cheque is selected** (Authoriser default) |
| `cheque-both` | Cheque, Both | Collector's number prefilled, name blank; Authoriser completes it |

- A "Prototype only. Payout paid by:" row at the top switches scenario.
- The Payment Method Details section shows Paid By, Amount and the account or cheque details (`components/payout-review/RecordedDestination.tsx`). The Approver never edits cheque details.
- **Return for Correction** (both roles): a dialog requires a reason, then the reviewer is sent to the Collector's returned-payout page for that payment method.
- When cheque details are needed, a warning above the buttons tells the Authoriser where to enter them.
- "Identity Documents Provided To Staff Member" and "Identity manually verified" show Yes/No `VerificationPill`s.
- The Approvals rows (verification label and ID Name Match) share one size and colour.
- The second name in Name Verification is labelled by method (`comparedNameLabel`): Name on cheque, Account name provided, Provided bank account name.
- Authoriser check label: "Cheque Verification" for cheques, "Account Name Check" otherwise. Approver shows "Account Name Check" for Funds Transfer only.

Files: `components/approver/ApproverPayoutView.tsx`, `components/authoriser/{AuthoriserPayoutView,AuthorisationPanel,ChequeDetailsEditor}.tsx`, `components/payout-review/{RecordedDestination,ReturnForCorrectionDialog,ScenarioSwitcher,IdentityConfirmation}.tsx`, `components/ui/TextArea.tsx`, `lib/payout-review-scenarios.ts`, `lib/return-payout.ts`, `lib/approver-data.ts`, `lib/authoriser-data.ts`.

### 4.4 Documentation deliverables

- `html/MBT-jira-user-stories.html` and `html/CHE-jira-user-stories.html`: every story now has a **Prototype** box with a status badge, screenshots and "Open live" links. A coverage table sits at the top. Images are embedded (base64), so each file works alone. Cross-links between the two files and within each file were fixed. "Payout Destination Details" was renamed in them.
- `html/screenshots/`: 25 PNGs at 1440 wide.
- `docs/linear-updates.md`: 27 Linear-ready entries (name, short description, screenshots, how it works, live links) plus a table of stories with no screen yet. Its images are relative links, so they only show where the folder structure is kept.
- `html/linear-updates.html`: the same 27 entries as **one self-contained page** with the screenshots embedded. This is the one to share with people who only get a single file.
- `docs/design.md`: updated with every new component and route.
- `html/tools/`: the scripts that make the screenshots and embed them (see section 7).

Story coverage (from the HTML coverage tables):

| | MBT | CHE |
|---|---|---|
| Built | 11 | 14 |
| Partly built | 1 (MBT-10) | 1 (CHE-07) |
| Existing page, not yet checked | 8 | 0 |
| Screen not built yet | 3 (MBT-17, 18, 24) | 8 (CHE-05, 17 to 23) |
| No screen needed | 5 | 5 |
| Out of scope | 2 (MBT-26, 27) | 0 |

---

## 5. Decisions made

- Prototype scope only. No real backend, auth or persistence (project rule).
- Funds Transfer is always available. Payment File and Cheque are per-venue switches.
- Cheque has three modes: Collector Only, Authoriser Only, Both. The mode is **recorded at submission** and review pages show it. Later venue changes do not reroute a submitted payout.
- Authorise needs both cheque details when the Authoriser is responsible. Both-mode lets the Collector leave fields blank.
- Return for Correction takes the reviewer into the Collector flow and carries the reason.
- The Venue Code is set in Venue Settings only, not typed by the Collector.
- Prototype-only controls (scenario switcher, `?role=super-admin`) are labelled or documented as prototype only.
- Venue settings persist per browser tab via `sessionStorage` key `cruz-venues`.
- Existing rules still apply: rem sizing (root 80%), tokens only for colour, one component per file, icons from lucide-react or react-icons, no auto-commit.

## 6. Problems solved (so they are not solved twice)

- **Bash heredocs with apostrophes or nested quotes can fail** with "unexpected EOF". Write scripts to a file with the Write tool, then run them.
- **Saving remounted the venue form** (key changed on save), which wiped the toast. The form is now keyed by venue id and waits for saved data (`ready` flag in `use-venues.ts`).
- **Switch looked off in a screenshot** while mid-transition. The state was correct (`aria-checked`).
- **Two font sizes in Approvals:** the first row was 0.875rem in the muted colour. Both rows are now `text-base text-ink`.
- **Lazy-loaded images show as broken** in headless checks. Embedded images no longer use `loading="lazy"`.
- Browser test scripts must wait about 1.5 s after navigation for React to hydrate (also noted in `memory.md`).
- The user's dev server often already runs on port 3000; use it rather than `preview_start`.
- Jira needs the user's login in the built-in browser pane. Image attachments on tickets did not load in the small pane.

---

## 7. Regenerating screenshots, story files and Linear entries

Tools are in `html/tools/`. They have **absolute Windows paths** for this machine (`D:\DN-75\...`); edit the constants at the top if the repo moves.

```bash
cd html/tools
npm install                     # puppeteer-core only; uses the installed Chrome
node shots.mjs                  # needs the dev server on http://localhost:3000; writes html/screenshots/*.png
python embed.py                 # re-embeds screenshots into both story HTML files (safe to re-run)
python linear.py                # rewrites docs/linear-updates.md and html/linear-updates.html
node verify.mjs                 # checks no broken images or anchors
```

- `embed.py` holds the **story to screenshot map and statuses** (`MBT`, `CHE`, `SHOTS`). When a story gets a screen, add its screenshot name there and change its status.
- `shots.mjs` seeds venue settings itself and sets `sessionStorage` per shot. Add a new shot at the end, before `browser.close()`.
- `linear.py` holds the "How it works" text per story (`HOW`). Add an entry for each newly built story.
- `embed.py` and `linear.py` assume the `html/` and `docs/` folders at the paths inside them.
- The original story HTML (before any edits) was backed up outside the repo; `git diff` shows the changes if you need them.

---

## 8. What is left to build (in the suggested order)

### 8.1 Cheque name match (CHE-17 to CHE-23). Highest value.

Needs a similarity score on every cheque payout. Mock it: a small client-side function that normalises names and returns a percentage. Do not invent a real algorithm service.

- **CHE-17 Show names and similarity.** In Collector capture, Summary and the reviews, show Cheque Name, the comparison name, **Name Similarity %**, the **applied threshold**, and **Match / No match**.
  - Comparison name label: **Verified ID Name** when an ID document verified it; **Captured Name** plus the text **"Name is not verified using ID documents"** when no ID was submitted. Show that text even when the result is Match.
  - Rules: ignore case, extra spaces and common punctuation; keep the original text for display; reordered parts are equal (John Smith = Smith John); initials or missing parts are only partial matches (J Smith, John Michael Smith vs John Smith).
  - Match when score is greater than or equal to the threshold (default 0.7: 0.70 is Match, 0.69 is No match).
- **CHE-18 Refresh when names change.** Recalculate when the cheque name, comparison name or its source changes (also after a returned payout is corrected). Clear the earlier acknowledgement and resolution; require a fresh rationale if the new result is No match. Past decisions stay in history. Keep the payout's original threshold.
- **CHE-19 No-ID payouts.** Use the captured recipient name; show "Name is not verified using ID documents". If no name is available, show **Unable to compare** with the reason. Never invent a score.
- **CHE-20 Authoriser rationale.** For No match, a required **Rationale** note beside the names, score and threshold (follow the sanctions/PEP resolution pattern). Whitespace-only does not count. Only the Authoriser can resolve; Collector and Approver cannot.
- **CHE-21 Acknowledgement.** An unchecked checkbox: "I acknowledge that the cheque name differs from the verified ID name and confirm completion of this payout." For captured names, say "captured recipient name" instead. Needs both the rationale and the tick. Cleared when names change. Ticking alone does not skip the wait or other conditions.
- **CHE-22 History.** Read-only record of both names, source, score, threshold, rationale, acknowledgement, Authoriser and time; active decision shown, earlier ones marked historical.
- **CHE-23 Status.** **Pending Payment** until all conditions are met, listing what is missing: cheque details, name resolution, remaining original wait, any daily-limit reason. Say payment completes automatically. Payment Completed appears only after the completion event and does not mean the winner collected the cheque.
- Where it plugs in: `NameComparison` and the Authoriser/Approver `Approvals` panels, plus `ChequeDetailsFields` / `PayoutDestinationDetailsForm` and the Summary. Add scenarios to `lib/payout-review-scenarios.ts` (match, no match, captured name, unable to compare). The existing name panel currently always shows a match.
- Use `VerificationPill` for Match / No match. Remember the wording rule: say "name check" style plain words, not "fuzzy".

### 8.2 Manual Bank export page: audit against MBT-13 and MBT-15 to 25

The page exists (`/authoriser/manual-bank-export`, built earlier; see `memory.md` for its rules). It has not been compared with the stories. Likely gaps:

- **MBT-17** required client selector for a Super Admin, above the filters; changing client clears the venue.
- **MBT-18** exactly one venue per export; if the user has one venue, show it as context; no "All Venues".
- **MBT-20** before export: lists of **Ready for first export** and **Held** (with reasons: Awaiting authorisation, Time delay remaining, Missing venue code, Required bank data missing); after export: included (Newly exported vs Downloaded again) and **skipped** with reasons; counts match lists.
- **MBT-13** readiness status: Awaiting authorisation, Time delay remaining, Required data missing, Ready for export, Exported.
- **MBT-24** progress, then filename, included IDs, row count, newly completed count, skipped IDs and reasons, export time; readable failure message with a recovery action; empty result when nothing exports.
- MBT-15 and MBT-16: confirm both menu entry points (authorisation workspace and Manage).
- Reconcile with decisions already made on that page (three tabs; one batch per export awaiting an ABA reference; CSV has 7 columns). The stories mention **eight columns**, a **Last Exported DateTime** and **venue timezone**; these differ from what was built, so confirm which is right before changing anything.

### 8.3 CHE-05 Global cheque name-match threshold

Super Admin global settings screen: **Cheque Name Match Threshold**, default 0.7, number between 0 and 1 inclusive, help text (0.7 = 70% similarity), Save and Cancel, note that changes apply to new payouts only and do not re-evaluate payouts in progress. Admins cannot edit it. Show who changed it and when. Do this alongside 8.1 because 8.1 displays the threshold.

### 8.4 Gaps inside "built" stories

- **MBT-10 and CHE-07:** saving and reopening a draft is not modelled; only the "method no longer available" message is.
- **Collector flow for no-ID payouts** is not shown (needed for CHE-19 screenshots).
- **Authorise and Reject buttons** do nothing (as before); no success state after Authorise.

### 8.5 Delivery work after each build

1. Add the screenshots and statuses to `html/tools/embed.py`; run the pipeline (section 7).
2. Update `docs/design.md` for every new component, token or route (project rule).
3. Run `npx tsc --noEmit`, and check the page in the browser.
4. Update `docs/linear-updates.md` via `linear.py`.
5. Do not commit; leave changes for the user.

### 8.6 Not building (no screen)

MBT-14, MBT-23, CHE-24, CHE-25 (backend rules); MBT-28, MBT-29, CHE-26, CHE-27 (notifications); MBT-30, CHE-28 (verification stories); MBT-26, MBT-27 (out of scope).

---

## 9. Open questions for the user

1. Are the names in section 3 acceptable to Brien and Minosha? (Payment File for Your Bank, Funds Transfer, How the Rest Is Paid, Return for Correction, Who Enters the Cheque Details.) After they are agreed: rename the remaining "Manual Bank Transfer" and "Bank Transfer" places, update the story HTML and `docs/linear-updates.md`, and update the skill's term guide.
2. Is the payment-file export CSV 7 columns (what was built) or 8 (what the stories say)? Is the on-screen header "Amount" and the CSV header "Bank Transfer Amount" still right?
3. Should the saved ABA reference be editable, and does it have a real format? (Open since the first export work.)
4. Where is the live prototype deployed from? Nothing here deploys it; the live links work only after the branch is deployed.
5. Linear or Jira for the write-ups? The user said Linear; the epics and tickets are in Jira (`CLAUDE.md` also mentions Linear).
6. The user wrote "check amount" for the Authoriser Only cheque: this was read as the cheque details (number and name), not the amount. Confirm.
7. Should the `?scenario=` and `?role=super-admin` prototype controls stay for the shareable build?

## 10. Repo state at the time of writing

- Branch: `dineth`. The user has committed up to the "Payment Method Details" rename.
- **Uncommitted at the time of writing:** the name-label fix (`lib/payout-review-scenarios.ts`, both review views), the two story HTML files, `html/screenshots/`, `html/tools/`, `docs/linear-updates.md` and this file. Check `git status`.
- `memory.md` (project root) still holds the older export-page notes and has **not** been updated.
- `npx tsc --noEmit` passed on the last run.

## 11. Housekeeping

- The temporary working folder used for scripts, a `puppeteer-core` install and backups was emptied on 2026-10-10. Everything needed to regenerate the screenshots and documents is in `html/tools/`. Run `npm install` there once (its `node_modules` is in `.gitignore`).
