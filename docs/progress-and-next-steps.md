# Progress and Next Steps: Configurable Payouts (Manual Bank + Cheque)

Last updated: 2026-10-15. Written so the work can be picked up on another day with no other context.

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

Names were first chosen with the `customer-wording` skill (Brien, a venue owner, is the test reader), then changed by the user after reviewer feedback. They are single constants in `lib/venue-data.ts`, so changing one changes every screen.

| Used on screens | Replaces | Status |
|---|---|---|
| **Electronic Fund Transfer** | Funds Transfer, then EFT | **User decision, 2026-10-14**: written in full, not EFT (the constant is still `FUNDS_TRANSFER_LABEL` in `lib/venue-data.ts`). Always on for every venue |
| **Manual Bank Transfer** | Payment File for Your Bank | **User decision, 2026-10-13** (a Figma comment asked for it). See the warning below |
| Cheque | Cheque | Fine |
| Non-Cash Payout Method | Non Cash Details, then How the Rest Is Paid (dropdown label on Payment Breakdown) | **User decision, 2026-10-15**: follows Figma comment #14, Title Case, placeholder "Select non-cash payout method". This reverses the earlier choice: Brien did not understand "non-cash destination", so tell Brien and Minosha. The term guide in the `customer-wording` skill still says the opposite |
| Payment Method Details | Payout Destination Details (section and Collector step) | User decision |
| Account Name Check | CoP Status | User decision |
| Method | Paid By (row label on the review cards) | From a Figma comment |
| Entered By | Cheque Details Entered By (row label on the review cards) | **User decision, 2026-10-15**: follows Figma comment #20 ("Entered by"). Shows usernames with roles, for example "M.Santos (Collector), R.Nguyen (Authoriser)" |
| Payouts settings | How Winners Are Paid, then Payouts configuration (Venue Settings heading) | **User decision, 2026-10-15**: a reply on Figma comment #3 says the heading was requested as "Payouts settings". Line under it: "Choose how winners can be paid." |
| Check Name Match | Validate Cheque (button) | From a Figma comment (the thread said it was already discussed) |
| Cheque detail entry | Who can enter cheque details? | **User decision, 2026-10-15**: follows Figma comment #8, with the line "Select who can enter the cheque details." This replaces Oshada's earlier wording, so tell Oshada. The save message still says "Choose who can enter cheque details before saving." |
| Return for Correction / Send Back for Review / Correct Returned Payout | (new) | Our wording, unconfirmed |

**Warning:** the skill's term guide, built from the Oct 9 meeting with Brien, says "Manual Bank Transfer" reads as "a transfer someone does by hand" and suggests "Payment file for your bank". The user chose to go with the reviewer's request. The term guide in `.claude/skills/customer-wording/SKILL.md` has **not** been updated (Minosha reviewed it), so it still says the opposite. Ask before editing it, and tell Brien or Minosha about the change.

Still using older wording (left on purpose):
- Issue names and short descriptions in the story HTML files and `docs/linear-updates.md` (copied from the stories). They say "payout destination".
- The route `/collector/payout-destination-details` (a code name, kept on purpose).
- `docs/v1-glossary.md` (the team's own glossary, not customer wording).
- Round 1 of `html/feedback-changes.html` shows the names as they were at that time, on purpose.

Rules to keep following: one name per thing everywhere; Title Case labels; Cheque spelling; spell out acronyms; tell the user about any term you were unsure of.

---

## 4. What is built

All screens are prototype-only. State is mock data plus `sessionStorage` (resets when the tab closes).

### 4.1 Venues list and Venue Settings (MBT-01 to 07, CHE-01 to 03, CRP-326)

| Route | What it does |
|---|---|
| `/admin/venues` | Admin view: venues of the Admin's own client (Riverside RSL Group). Columns: Venue Name, Payment Method, Daily Limit. Edit pencil appears on row hover. Row click opens settings. |
| `/admin/venues?role=super-admin` | Super Admin view: all clients, plus a Client column. `?role=super-admin` is a prototype stand-in for logging in as a Super Admin. |
| `/admin/venues/[id]` (+ `?role=super-admin`) | Venue Settings. Electronic Fund Transfer (the same card as the others, with a disabled switch fixed to On and no badge; user decision 2026-10-14, following the Figma comment). The venue's client and daily limit are not shown on this screen. Switch for Manual Bank Transfer, with Venue Code (text, keeps leading zeros). Switch for Cheque, with three radio options for who enters the cheque details. Save and Cancel. |
| Home page `/` | "Super Admin Pages" button opens the Super Admin list. |

Behaviour:
- Save with Cheque on and no option chosen: error message, no save. Save success: toast "Settings saved for {venue}."
- Cancel restores the saved values. Reloading shows saved values (per browser tab).
- An Admin opening another client's venue sees "You do not have access to this venue."
- Manage menu now has Users, Machines, **Venues** (`components/admin/AdminHeader.tsx`).

Mock venues (`lib/venue-data.ts`): Riverside RSL Club and Northside Sports Club (Riverside RSL Group), Harbourview Hotel and Bayside Tavern (Harbourview Hospitality). Seed settings: Riverside has Payment File on (code 0042) and Cheque on (Both); Northside has both off; Harbourview has Payment File on (0107); Bayside has Cheque on (Collector Only).

Files: `app/admin/venues/page.tsx`, `app/admin/venues/[id]/page.tsx`, `components/admin/{VenuesView,VenuesTable,VenueSettingsView,VenueSettingsForm,PaymentMethodRow,ChequeModeOptions}.tsx`, `components/ui/{Switch,RadioOption}.tsx`, `lib/venue-data.ts`, `lib/use-venues.ts`.

### 4.2 Collector flow (MBT-09, 10, 11, CHE-06, 07, 08, 13, 15)

- **Payment Breakdown** (`/collector/payment-breakdown`): the dropdown **Non-Cash Payout Method** lists only the methods the Collector's venue has switched on. The Collector's venue is fixed to `riverside-rsl-club` (`COLLECTOR_VENUE_ID` in `lib/collector-data.ts`). Membership Card is still always offered (outside these epics). Cash only: leave the dropdown empty.
- **Payment Method Details** (`/collector/payout-destination-details`), reads the chosen method from `sessionStorage` key `cruz.selectedPayoutDestination`:
  - Electronic Fund Transfer and Manual Bank Transfer: Account Name, BSB (6 digits), Account Number (digits). Messages appear when the Collector selects Validate Account with bad or empty fields. The Venue Code field is **no longer on this screen** (it comes from Venue Settings). The payment file version has an explanation above the form.
  - Cheque, by the venue's setting:
    - Collector Only: Cheque Number and Cheque Name required (name starts as the winner's name); needs Check Name Match.
    - Authoriser Only: nothing to enter; a note says so; Next is available.
    - Both: both fields optional; blank values show "Not entered yet" on the Summary; no validation step.
  - If the venue has switched the chosen method off after it was picked, the Collector is **sent straight back to Payment Breakdown**, where a warning says the method is no longer available (notice key `cruz.unavailableMethodNotice`). The earlier selection is cleared; amounts typed on Payment Breakdown are not kept.
- **Returned payout** (`/collector/returned-payout?type=cheque|payment-file|funds-transfer`): shows who returned it and the reviewer's reason (from `sessionStorage` key `cruz.returnedPayout`, otherwise a sample), with the saved details editable. "Send Back for Review" checks the fields, then shows a toast and switches off.

Files: `components/collector/{PaymentBreakdownForm,PayoutDestinationDetailsForm,BankAccountFields,ChequeDetailsFields,ReturnedPayoutView}.tsx`, `app/collector/returned-payout/page.tsx`, `lib/collector-data.ts`.

### 4.3 Approver and Authoriser review (MBT-08, 12, CHE-04, 09, 11, 12, 14, 16)

`/approver/payout` and `/authoriser/payout` both take `?scenario=`:

| scenario | Paid by | Authoriser behaviour |
|---|---|---|
| `funds-transfer` | Electronic Fund Transfer | read-only account details (Approver default) |
| `payment-file` | Manual Bank Transfer | read-only account details; note that it stays pending until the file is uploaded |
| `cheque-collector` | Cheque, Collector Only | cheque details read-only |
| `cheque-authoriser` | Cheque, Authoriser Only | Authoriser enters Cheque Number and Name; **Authorise stays off until both are entered and Check Name Match is selected** (Authoriser default) |
| `cheque-both` | Cheque, Both | Collector's number prefilled, name blank; Authoriser completes it |

- A "Prototype only. Payout paid by:" row at the top switches scenario.
- The Payment Method Details card shows Method, Amount and the account or cheque details (`components/payout-review/RecordedDestination.tsx`). The Approver never edits cheque details.
- **Cheque Details Entered By** lists the usernames of the people who actually entered details (for example `M.Santos (Collector), R.Nguyen (Authoriser)`), or `Not entered yet`. The Authoriser's name is added once they enter or change details and check them.
- When the Authoriser enters cheque details, the Cheque Number and Cheque Name fields sit **inside the card** in place of the two rows (no separate form below). After Check Name Match the card shows the values with a pencil to edit.
- **Return for Correction** (both roles): a dialog requires a reason, then the reviewer is sent to the Collector's returned-payout page for that payment method.
- When cheque details are needed, a warning above the buttons tells the Authoriser where to enter them.
- "Identity Documents Provided To Staff Member" and "Identity manually verified" show Yes/No `VerificationPill`s.
- The Approvals rows (verification label and ID Name Match) share one size and colour.
- The second name in Name Verification is labelled by method (`comparedNameLabel`): Name on cheque, Account name provided, Provided bank account name.
- Authoriser check label: "Cheque Verification" for cheques, "Account Name Check" otherwise. Approver shows "Account Name Check" for Electronic Fund Transfer only.

Files: `components/approver/ApproverPayoutView.tsx`, `components/authoriser/{AuthoriserPayoutView,AuthorisationPanel,ChequeDetailsEditor}.tsx`, `components/payout-review/{RecordedDestination,ReturnForCorrectionDialog,ScenarioSwitcher,IdentityConfirmation}.tsx`, `components/ui/TextArea.tsx`, `lib/payout-review-scenarios.ts`, `lib/return-payout.ts`, `lib/approver-data.ts`, `lib/authoriser-data.ts`.

### 4.4 Documentation deliverables

- `html/MBT-jira-user-stories.html` and `html/CHE-jira-user-stories.html`: every story now has a **Prototype** box with a status badge, screenshots and "Open live" links. A coverage table sits at the top. Images are embedded (base64), so each file works alone. Cross-links between the two files and within each file were fixed. "Payout Destination Details" was renamed in them.
- `html/screenshots/`: 25 PNGs at 1440 wide.
- `docs/linear-updates.md`: 27 Linear-ready entries (name, short description, screenshots, how it works, live links) plus a table of stories with no screen yet. Its images are relative links, so they only show where the folder structure is kept.
- `html/feedback-changes.html`: report of reviewer feedback in two rounds. **Round 1** (2026-10-12, Oshada and Akila): 8 entries, first build (commit `914eb5b`) to the build after round 1 (commit `158fefc`). **Round 2** (2026-10-13, Figma comments): 11 entries plus a table of comments not followed, from `158fefc` to the current screenshots in `html/screenshots/`. Each entry has the issue, the feedback (quoted), the before and after crops, and the workflow after. Built by `html/tools/feedback.py` (round 1 content) and `html/tools/feedback_round2.py` (round 2 content and crop boxes). Run `python feedback.py` after `shots.mjs`. When round 2 is committed, pin its "after" to that commit the way round 1 is pinned.
- `html/linear-updates.html`: the same 27 entries as **one self-contained page** with the screenshots embedded. This is the one to share with people who only get a single file.
- `docs/design.md`: updated with every new component and route.
- `html/tools/`: the scripts that make the screenshots and embed them (see section 7).

Story coverage (from the HTML coverage tables):

| | MBT | CHE |
|---|---|---|
| Built | 11 | 21 (14 + CHE-17 to 23) |
| Partly built | 1 (MBT-10) | 1 (CHE-07) |
| Existing page, not yet checked | 8 | 0 |
| Screen not built yet | 3 (MBT-17, 18, 24) | 1 (CHE-05) |
| No screen needed | 5 | 5 |
| Out of scope | 2 (MBT-26, 27) | 0 |

---

### 4.5 Cheque name match (CHE-17 to CHE-23), built 2026-10-15

Decisions from the user: the Authoriser resolves; the Approver and the Collector Summary show the result read-only; percentages on screen (70%, not 0.7); four cases in the switcher.

| Where | What it shows |
|---|---|
| Authoriser review, section **Name Verification** (cheques only) | **Cheque Name Check** card: Verified ID Name (or Captured Name) beside Cheque Name, Name Similarity, Threshold, Result pill (`VerificationPill`: Match, No Match, Unable to Compare). For No Match: required **Rationale** (500 characters, counter) and the acknowledgement checkbox |
| Authoriser review, **Name Check History** (appears when there is a record) | One card per decision: date, Authoriser, both names, similarity, threshold, rationale, acknowledged, **Active** or **Historical** |
| Authoriser and Approver review, **Payment Status** (cheques only) | **Pending Payment**, then each outstanding condition (cheque details, name difference, original waiting time, daily limit), "Payment completes automatically", and "Payment Completed does not mean the winner has collected the cheque." |
| Approver review | Same card and history, read-only. "Names differ. The Authoriser records a reason before the payout is completed." The Approvals panel no longer shows ID Name Match for cheques |
| Collector Summary | Same card, read-only, for a cheque (hidden when only the Authoriser enters cheque details). A blank name shows Unable to Compare |
| Collector cheque step | **Check Name Match** now compares the name with the winner's name and says if it differs. The Collector can still continue; the Authoriser resolves it |

Rules (all in `lib/name-match.ts`, mock only, no server):
- Ignores case, extra spaces and `. , '`; hyphens count as spaces. Re-ordered names are equal. An initial scores 0.5 of a part; a small typo scores its closeness (80% or more of the letters). Score = points / the longer name's part count.
- Match when the rounded percentage is at or above the threshold (default 70%: 70 is Match, 69 is No Match). Examples: Vivek Mishra vs Vivek Mishra Jr = 67% No Match; J Smith vs John Smith = 75% Match.
- No ID: the comparison name is the **Captured Name** and the line "Name is not verified using ID documents." shows, even for a Match. No name at all: Unable to Compare with the reason and no score.
- Names change (Authoriser edits and checks the cheque details): the score is redone, the rationale and tick are cleared, and a decision already made moves to history as Historical (CHE-18). The payout keeps its original threshold (a constant for now; CHE-05 will set it).

Prototype payouts (switcher on both review pages; `lib/payout-review-scenarios.ts`): Cheque: Collector Only (Match), Cheque: Name differs (No Match, with an earlier historical decision and a waiting time), Cheque: Captured name, Cheque: Cannot compare (with a daily limit hold). The demo payouts also show "Drivers Licence" or "No ID document" and the Identity Confirmation lines to match their name source.

Authorise stays off while a No Match has no rationale and tick. The short line above the buttons says which one is missing (cheque details come first).

Files: new `lib/name-match.ts`, `lib/cheque-payment-status.ts`, `components/payout-review/{ChequeNameCheck,NameCheckHistory,ChequePaymentStatus,NameBox}.tsx`. Changed: `lib/payout-review-scenarios.ts`, `components/authoriser/{AuthoriserPayoutView,AuthorisationPanel,ChequeDetailsEditor}.tsx`, `components/approver/{ApproverPayoutView,ApprovalPanel,NameMatchStatus}.tsx`, `components/payout-review/NameComparison.tsx` (NameBox moved out), `components/collector/{PayoutDestinationDetailsForm,SummaryView}.tsx`. `docs/design.md` was **not** updated this round (user asked to touch only the two documents); add the new components and routes there next time.

Lessons from the earlier feedback and Figma comments, applied here:
- One short line, no repeated explanation, no "you/your" (round 1 and 2 comments on wording).
- Results are pills with an icon and text, in the warning tone for "needs a look" (the Not entered yet comment); no plain coloured text.
- Required fields have an asterisk and a character limit with a counter (the Return for Correction comments); the primary button stays off and a one-line message says why.
- Same data looks the same on every role's page, so one `ChequeNameCheck` is used by the Authoriser, Approver and Collector.
- Clear names: Title Case labels, no technical words ("similarity", not "fuzzy"). Names already agreed stay as they are.
- A message says why and what to do (the method-unavailable comment).
- Where the Collector cannot act, they are not shown a step for it; the Approver only reads.
- Colours come from tokens only. Two known hard-coded colours (in `WarningAlert` and `StatusPill`) are used by the new screens but were not added to.

## 5. Decisions made

- Prototype scope only. No real backend, auth or persistence (project rule).
- Electronic Fund Transfer is always available (a disabled switch set to On). Manual Bank Transfer and Cheque are per-venue switches.
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
node shots_namecheck.mjs        # the name check screenshots (26 to 36), cropped to the relevant sections
python linear.py --md           # also rewrites docs/linear-updates.md (without --md only html/linear-updates.html is written)
```

- `embed.py` holds the **story to screenshot map and statuses** (`MBT`, `CHE`, `SHOTS`). When a story gets a screen, add its screenshot name there and change its status.
- `shots.mjs` seeds venue settings itself and sets `sessionStorage` per shot. Add a new shot at the end, before `browser.close()`.
- `linear.py` holds the "How it works" text per story (`HOW`). Add an entry for each newly built story.
- `embed.py` and `linear.py` assume the `html/` and `docs/` folders at the paths inside them.
- The original story HTML (before any edits) was backed up outside the repo; `git diff` shows the changes if you need them.

---

## 8. What is left to build (in the suggested order)

### 8.1 Cheque name match (CHE-17 to CHE-23): built 2026-10-15

Done. See section 4.5. Still open inside it:
- **Unable to Compare does not block Authorise.** The stories only require a rationale for No Match. Confirm that a payout with no name to compare should still be authorisable.
- **The returned-payout correction page does not redo the check** (CHE-18 mentions a corrected payout). The Authoriser editing the cheque details does.
- The Collector's cheque step compares with the winner's name from a mock; there is no Collector no-ID flow to show a Captured Name there.
- Wording to confirm with Brien or Minosha: Cheque Name Check, Verified ID Name, Captured Name, Name Similarity, Threshold, Rationale, Unable to Compare, Name Check History, Pending Payment.

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

Super Admin global settings screen: **Cheque Name Match Threshold**, default 0.7, number between 0 and 1 inclusive, help text (0.7 = 70% similarity), Save and Cancel, note that changes apply to new payouts only and do not re-evaluate payouts in progress. Admins cannot edit it. Show who changed it and when. The name match (4.5) now displays a fixed 70% threshold; this screen should supply it.

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

1. Are the names in section 3 acceptable to Brien and Minosha? (Manual Bank Transfer, EFT, How the Rest Is Paid, Return for Correction, Who Enters the Cheque Details.) After they are agreed: rename the remaining "Manual Bank Transfer" and "Bank Transfer" places, update the story HTML and `docs/linear-updates.md`, and update the skill's term guide.
2. Is the payment-file export CSV 7 columns (what was built) or 8 (what the stories say)? Is the on-screen header "Amount" and the CSV header "Bank Transfer Amount" still right?
3. Should the saved ABA reference be editable, and does it have a real format? (Open since the first export work.)
4. Where is the live prototype deployed from? Nothing here deploys it; the live links work only after the branch is deployed.
5. Linear or Jira for the write-ups? The user said Linear; the epics and tickets are in Jira (`CLAUDE.md` also mentions Linear).
6. The user wrote "check amount" for the Authoriser Only cheque: this was read as the cheque details (number and name), not the amount. Confirm.
7. Should the `?scenario=` and `?role=super-admin` prototype controls stay for the shareable build?

## 10. Repo state at the time of writing (updated 2026-10-15)

- Not committed: the name match work (4.5), the regenerated `html/screenshots/`, `html/linear-updates.html` and the tooling changes in `html/tools/`. `docs/linear-updates.md`, the two story pages and `html/feedback-changes.html` were deliberately **not** regenerated for these changes, so they have no name match entries. (The Electronic Fund Transfer card and name change were already committed.)
- `html/linear-updates.html` has a blue **NEW CHANGES START HERE** banner before CHE-17, NEW badges on CHE-17 to 23 and UPDATED badges on the six earlier cheque entries whose screens changed.

(Older note, 2026-10-10:)

- Branch: `dineth`. The user has committed up to the "Payment Method Details" rename.
- **Uncommitted at the time of writing:** the name-label fix (`lib/payout-review-scenarios.ts`, both review views), the two story HTML files, `html/screenshots/`, `html/tools/`, `docs/linear-updates.md` and this file. Check `git status`.
- `memory.md` (project root) still holds the older export-page notes and has **not** been updated.
- `npx tsc --noEmit` passed on the last run.

## 11. Housekeeping

- The temporary working folder used for scripts, a `puppeteer-core` install and backups was emptied on 2026-10-10. Everything needed to regenerate the screenshots and documents is in `html/tools/`. Run `npm install` there once (its `node_modules` is in `.gitignore`).

## 12. Reviewer feedback fixed on 2026-10-12

Feedback came from Oshada and Akila on the Venue Settings screen, the review pages and the Collector flow. All of it is done:

| Feedback | Fix |
|---|---|
| Move the "changes apply to new payouts only" note near Save | The note now sits directly above Save and Cancel; the long intro under "How Winners Are Paid" is gone |
| Toggles need a clear label, announce state, work with a keyboard, show state in text | `Switch` shows On or Off in words, is a real button with `role="switch"` (Space and Enter work), and points to its description with `aria-describedby` |
| Shorter descriptions; reveal detail only when needed | One short line per method; Venue Code note is "Included in the file; leading zeros are kept."; cheque question is "Who can enter cheque details?"; the three options have shorter help lines |
| Funds Transfer looks configurable | New `AlwaysAvailableMethodRow`. First a lighter card with "Always available"; then changed (user request, 2026-10-12) to the same card as the others with an "Always available" badge. The "Client / Daily limit" line under the venue name was also removed |
| Cheque Details Entered By should show the actual username | Shows usernames of people who entered details; one row listing everyone, as agreed |
| Authoriser-entered details should fill the card, not new placeholders | Editor now lives inside the card; values show in the card after Validate Cheque |
| A method switched off should take the Collector to Payment Breakdown | Redirect with a warning on Payment Breakdown |
| Akila: less wordy | Covered by the shorter descriptions above |

The screenshots, both story pages, `docs/linear-updates.md` and `html/linear-updates.html` were regenerated after these changes.

Still open from this round: the Collector's typed amounts are not kept when they are sent back to Payment Breakdown (prototype only; the amounts live in component state).

## 13. Figma review comments, round 2 (2026-10-13)

Board: https://www.figma.com/board/wps619UWOeRFJ8YpBxZvzs/Payouts-new-UIs (comments by PromptLane, a day old). The comments are not returned by the Figma connector. They can be read by opening the board in the browser as a guest and hovering each pin (use `?node-id=` in the URL to focus one screenshot). A guest cannot open threads, so **replies are unreadable**; the "Check Name Match" comment has 2 replies and an image that were not seen.

**Rule the user set:** where a Figma comment conflicts with earlier feedback, the earlier feedback wins. Later the user also said to use "EFT" and "Manual Bank Transfer", which overrides that rule for those two names.

### Comments and what was done

| Screen | Comment (short) | Result |
|---|---|---|
| Venue Settings | Where does the daily limit come from? | Already removed |
| Venue Settings | Title "Payouts configuration" (renamed "Payouts settings" on 2026-10-15 after a reply on the comment); one line "Choose how winners can be paid"; add "applies to new payouts only" near save | Done |
| Venue Settings | Funds transfer: disabled toggle set to On; use EFT | **Kept the "Always available" badge** (earlier decision); **EFT adopted** (user) |
| Venue Settings | "Manual bank transfer" name; describe what it is | Name adopted (user); description: "Paid by uploading a payment file to the bank's online portal." |
| Venue Settings | Concise descriptions, avoid "you/your" | Done |
| Venue Settings | Remove "choose who enters" from the Cheque description | Already done |
| Venue Settings | Label "Cheque detail entry" | **Not adopted in round 2** (Oshada asked for "Who can enter cheque details?"); **adopted 2026-10-15** by user decision (see section 3) |
| Venue Settings | Simpler option lines | Done ("Collector enters the cheque details. Authoriser can view them." and so on) |
| Venue Settings | Buttons consistent with the Collector view | Done: equal width, outline left, primary right |
| Review card | "Paid by" is confusing, use "Method" | Done |
| Review card | Pending message belongs with status | Done: "Pending until included in a payment file." under the status pill (suggestion approved by the user) |
| Review card | Method / Entered by: name of the collector | Already done in round 1 |
| Review card | Make "Not entered yet" a different colour | Done: warning-tone pill (`NotEnteredYet`) |
| Authoriser card | "Enter cheque details" is enough; mark fields mandatory | Done: one short line "Enter cheque details before authorising."; asterisks; Authorise stays disabled (user approved) |
| Authoriser card | "Validate Cheque" misleading, use "Check Name Match" | Done on the Collector and Authoriser screens |
| Payment Breakdown | Label "Non-cash payout method" | **Not adopted** (see wording table) |
| Details screen warning | Clearer; "choose another non-cash payment method" | Wording clarified: "It was switched off for this venue. Choose another way to pay the rest." |
| Details screen | Payment file description not needed | Removed |
| Collector, cheque (both) | Description not needed (fields say optional) | Removed |
| Collector, cheque (Authoriser Only) | Skip this screen | Done: Collector goes straight to Summary, which says "To be entered by the Authoriser" |
| Return dialog | Direct description, asterisk on Reason, character limit and scrolling, no "For example" | Done: 500-character limit with a counter, scrolling box, asterisk |
| Correct Returned Payout | Text under the form not needed | Removed |
| Correct Returned Payout | "Only approvers return payouts? no need for the role in brackets"; mind how long reasons show | **Role kept** (stories say Approver and Authoriser can both return). Long reasons wrap and are limited to 500 characters |
| Settings saved message | Green background like other success messages | Done (success token) |
| Cheque card after checking | Data repeated / "Not entered yet" wrong | Already fixed in round 1 |

### Files changed in this round
`lib/venue-data.ts` (labels, option text), `lib/collector-data.ts` (`AUTHORISER_ONLY_CHEQUE_DETAILS`), `lib/return-payout.ts` (`RETURN_REASON_MAX_LENGTH`), `components/ui/{FormField,DetailList,Toast,WarningAlert}.tsx`, new `components/ui/NotEnteredYet.tsx`, new `components/payout-review/PayoutStatusNote.tsx`, `components/payout-review/{RecordedDestination,ReturnForCorrectionDialog}.tsx`, `components/authoriser/{AuthoriserPayoutView,ChequeDetailsEditor}.tsx`, `components/approver/ApproverPayoutView.tsx`, `components/admin/VenueSettingsForm.tsx`, `components/collector/{ChequeDetailsFields,PayoutDestinationDetailsForm,SecondaryIdForm,ReturnedPayoutView,PaymentBreakdownForm}.tsx`.

### Documents
Screenshots, both story pages, `docs/linear-updates.md` and `html/linear-updates.html` were regenerated with the new UI and names. `html/tools/feedback.py` now takes its "after" images from git commit `158fefc` (the build after round 1), so regenerating screenshots does not change the round 1 report. The round 2 report was added to `html/feedback-changes.html` (before: commit `158fefc`; after: the current screenshots). One bug found while making it: the Collector Summary showed a "Cheque Verification: Match" card when the Authoriser will enter the cheque details. It is now hidden in that case.

### Open
- The unread replies on the "Check Name Match" comment.
- Whether Brien and Minosha accept "Manual Bank Transfer" and "EFT" (see section 3).
- Commit the round 2 changes, then pin the round 2 "after" images to that commit in `feedback_round2.py`.
