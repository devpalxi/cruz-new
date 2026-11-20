# Cruz Money — Design System (Collector UI)

Extracted from the Riverside Hotel "Create New Payout" reference screenshots. All design tokens live in `app/globals.css` (Tailwind v4 `@theme`). Use the token utilities (`bg-brand`, `text-label`, `border-line`, ...) — never hard-code hex values in components.

## Colour tokens

| Token (Tailwind utility) | Hex | Used for |
|---|---|---|
| `brand` (`bg-brand`, `text-brand`) | `#2e2f7a` | Page title, active step, primary button |
| `brand-disabled` | `#8f90b6` | Disabled primary button (brand at ~55% on page bg) |
| `page` (`bg-page`) | `#f0f1f2` | Page + header background |
| `surface` (`bg-surface`) | `#ffffff` | Date input, docket dropzone, dropdown panel |
| `field` (`bg-field`) | `#f9fafb` | Text / select inputs |
| `field-disabled` | `#f5f5f7` | Disabled input (Machine before a venue is chosen) |
| `line` (`border-line`) | `#d1d5db` | Input borders, stepper circles + connector, Back button border |
| `line-soft` | `#e4e5e6` | Header bottom border, list dividers |
| `line-date` | `#c4c4c4` | Date/time input border |
| `label` (`text-label`) | `#5f6675` | Field labels (semibold) |
| `ink` (`text-ink`) | `#111827` | Input text, body copy, button text |
| `muted` (`text-muted`) | `#9ca3af` | Inactive step labels, placeholders |
| `subtle` (`text-subtle`) | `#6b7280` | Icons, secondary list text |
| `focus` (`ring-focus`) | `#06b6d4` | Focus border/ring on inputs, selects, combobox |
| `option-active` | `#c8c8c8` | Native dropdown highlighted option |
| `icon-dark` | `#1e3946` | Cash / bank card icons |
| `card` | `#f6f7f7` | Approver page card background |
| `info` | `#76a9fa` | Status pill (Awaiting Approval) |
| `success` / `success-soft` / `success-line` | `#4daa9e` / `#edf3f2` / `#cde5e2` | Collapse All button, Match pill |
| `success-pill` / `success-ink` | `#d6e8e2` / `#2f6b5b` | CLEAR result pill |
| `danger` | `#ef4b4b` | Cancel button |
| `title-navy` / `table-head` | `#1e3a5f` / `#f7f8f9` | Admin page title; table header row |
| `fail` / `close-match` | `#b91c1c` / `#7f1d1d` | Fail and Close Match text in table |
| `awaiting` | `#8b5cf6` | Awaiting ABA Reference status pill |
| `complete` / `draft` / `pending` | `#22c55e` / `#8b8f97` / `#f59e0b` | Payout status pills |
| `header-open` | `#f3f4f6` | Open accordion header |
| `warn-bg` / `warn-line` / `warn-ink` | `#fffbeb` / `#fde68a` / `#78350f` | Warning badge + alert |

## Typography

- **Font family:** Rubik (Google Fonts) → `font-sans`, loaded in `app/layout.tsx` as `--font-rubik`.
- Page title: 40px / bold / `brand` (e.g. "Create New Payout").
- Field label: 16px / semibold / `label`.
- Input + select text: 20px / regular / `ink`.
- Stepper label: 20px / regular; active = `brand`, inactive = `muted`.
- Dropzone text: 18px / regular / `ink`. Buttons: 16px / semibold.
- Combobox item title: 18px / medium; meta line 15px / `subtle`.

## Layout

All sizes are rem-based and `html` is set to `font-size: 80%` (12.8px), because the reference site was measured at 80% browser zoom. Values below are the reference pixels at that measurement; use rem in code (px ÷ 16).


- **Header:** 121px tall, `page` background, 1px `line-soft` bottom border, Riverside Hotel logo left-aligned with 20px inset.
- **Stepper (left):** 30px circles (2px border), 40px vertical connector, 70px row pitch, starts 90px below the header, 80px from the left edge. Hidden below `lg`.
- **Form column:** 613px wide, horizontally centred on the page, 90px top padding.
- **Field spacing:** label → input 12px; field → field ~34px.
- **Actions row:** Back (outlined) + Next (primary), each 286px × 46px, 40px gap.
- **Close (✕):** top-right of the content area, returns to the home page.

## Components

| Component | File | Notes |
|---|---|---|
| `Logo` | `components/layout/Logo.tsx` | Riverside Hotel wordmark (SVG) |
| `AppHeader` | `components/layout/AppHeader.tsx` | Header bar with logo |
| `Stepper` | `components/collector/Stepper.tsx` | Vertical 8-step progress list |
| `CollectorShell` | `components/collector/CollectorShell.tsx` | Header + stepper + centred column + close button |
| `PayoutDetailsForm` | `components/collector/PayoutDetailsForm.tsx` | Step 1 form: New Payout Details |
| `FormField` | `components/ui/FormField.tsx` | Label + control wrapper |
| `TextInput` | `components/ui/TextInput.tsx` | 72px input, disabled + focus states |
| `SelectInput` | `components/ui/SelectInput.tsx` | Native select with chevron |
| `DateTimeInput` | `components/ui/DateTimeInput.tsx` | White input with calendar icon |
| `FileDropzone` | `components/ui/FileDropzone.tsx` | Dashed drag-and-drop + Browse |
| `SearchCombobox` | `components/ui/SearchCombobox.tsx` | Searchable list (title + meta line) |
| `Button` | `components/ui/Button.tsx` | `primary` / `outline` / `ghost` / `soft` / `danger`, disabled state, can render as link |
| `Icons` | `components/ui/Icons.tsx` | Inline-only icons (Calendar). Others come from lucide-react / react-icons |
| `CurrencyInput` | `components/ui/CurrencyInput.tsx` | `$` prefix + AUD suffix input |
| `AmountCard` | `components/collector/AmountCard.tsx` | White rounded card with icon + title |
| `Accordion` | `components/ui/Accordion.tsx` | Single-open accordion; open header gets `header-open` bg + 3px `line-soft` ring |
| `DetailList` | `components/ui/DetailList.tsx` | Bold label / right-aligned value rows (a value can be text or a component such as `NotEnteredYet`) |
| `WarningBadge` / `WarningAlert` | `components/ui/` | Amber `warn-*` pill and alert box |
| `CopValidationCard` / `SummaryView` | `components/collector/` | Summary step pieces |
| `UserMenu` / `BackLink` | `components/layout/` | Header nav (Dashboard link + avatar) + back link — shared by approver and authoriser |
| `CollapsibleSections` | `components/ui/CollapsibleSections.tsx` | Multi-open sections + Collapse All / Expand All |
| `StatusPill` / `InsetCard` | `components/ui/` | Coloured pill; grey inset panel |
| `ApproverPayoutView` + `ApprovalPanel` | `components/approver/` | Approver-only pieces: editable risk level + Approve/Cancel |
| `AuthoriserPayoutView` + `AuthorisationPanel` + `ApproverDecision` | `components/authoriser/` | Authoriser-only pieces: read-only approver decision + Authorise/Reject |
| `DocketRow` / `IdentityConfirmation` / `NameComparison` / `AmlScreening` / `IdvHistoryTable` / `CollectorInfo` | `components/payout-review/` | Shared payout-review pieces used by both approver and authoriser |
| `Dropdown` / `SearchInput` / `Pagination` | `components/ui/` | Header menu, search box with icon, page buttons (visual only) |
| `VerificationPill` | `components/ui/` | Universal verification result pill (see the UI rule below) |
| `ResultPill` / `PayoutStatusPill` | `components/ui/` | Table cell check results; coloured payout status pill |
| `AdminHeader` / `PayoutsDashboard` / `PayoutFilters` / `PayoutsTable` | `components/admin/` | Admin dashboard pieces |
| `Tabs` / `Modal` / `Toast` / `DateInput` | `components/ui/` | Tab bar with counts; confirm dialog; success toast; labelled date field |
| `AuthoriserHeader` / `ManualExportView` / `ExportTable` / `BatchTable` / `ExportDateFilter` / `ExportConfirmDialog` / `AbaReferenceDialog` | `components/authoriser/` | Manual Bank Transfer Export pieces (CSV built in `lib/manual-export-data.ts`, downloaded via `lib/download.ts`) |
| `VenuesView` / `VenuesTable` / `VenueSettingsView` / `VenueSettingsForm` / `PaymentMethodRow` / `ChequeModeOptions` | `components/admin/` | Venues list (Manage → Venues) and the Venue Settings screen: payment method switches, Venue Code, cheque collection mode, Save / Cancel. Mock data in `lib/venue-data.ts`; saved edits kept per browser tab by `lib/use-venues.ts` |
| `Switch` / `RadioOption` | `components/ui/` | On/off switch (`role="switch"`, shows the word On or Off beside it, can point to its description with `describedBy`; `disabled` shows a fixed state at reduced opacity); radio with a label and a help line |
| `AlwaysAvailableMethodRow` | `components/admin/` | Venue Settings card for a method that cannot be switched off (EFT). Same card as the switchable methods, with an "Always available" badge where the switch would be, so it is clear there is nothing to set |
| `ChequeDetailsFields` | `components/collector/` | Cheque Number / Cheque Name for the Collector. Shows required fields, optional fields, or a note that the Authoriser enters them, depending on the venue's cheque setting |
| `RecordedDestination` / `ReturnForCorrectionDialog` / `ScenarioSwitcher` | `components/payout-review/` | Summary card of how the non-cash amount is paid, shared by Approver and Authoriser (the Authoriser's cheque editor can replace the cheque rows via `chequeSlot`; Cheque Details Entered By lists usernames); the Return for Correction dialog (reason required); prototype-only switcher between payout types. Mock payouts in `lib/payout-review-scenarios.ts` |
| `ChequeDetailsEditor` | `components/authoriser/` | Authoriser enters or completes Cheque Number / Cheque Name; Authorise stays off until both are entered and checked |
| `ReturnedPayoutView` | `components/collector/` | Collector corrects a returned cheque or payment-file payout and sends it back for review |
| `TextArea` | `components/ui/` | Shared multi-line input |
| `NotEnteredYet` | `components/ui/` | Warning-tone pill for a value nobody has entered yet (review cards) |
| `PayoutStatusNote` | `components/payout-review/` | One line under the status on the review pages, shown for a Manual Bank Transfer payout ("Pending until included in a payment file.") |
| `PayoutTypeSettings` | `components/admin/` | Venue Settings "Payout Types" group (CRP-461): EGM fixed On (`AlwaysAvailableMethodRow`, now takes an `id`), switches for Member Card, Gaming Promotion and Club Promotion, and an optional Member Card Display Name (for example MyCash) |
| `PayoutTypeSwitcher` | `components/payout-review/` | Prototype-only switcher between payout types (`?type=`), used on the review pages and Patron Emails. `ScenarioSwitcher` keeps the `type` value when switching |
| `EmailPreview` / `PatronEmailsView` / `TypeText` | `components/emails/` | Mock email frame (From / To / Subject + body); the two patron emails; highlight for text that changes with the payout type |
| `IdentityCheckSettings` | `components/admin/` | Venue Settings "Identity Checks" group (CRP-186): a "Re-use Identity Checks" switch card (`PaymentMethodRow`); when on, a required "Re-use Period (days)", 1 to 365, checked on Save |
| `ReturningWinnerView` | `components/collector/` | Returning Winner screen (CRP-186): saved record + last check `VerificationPill`, "Details Have Changed, Check Again" / "Details Are the Same, Use These"; or the reason a check can't be re-used (too old, ID document expired, not passed) |
| `PrototypeSwitcher` | `components/ui/` | Generic prototype-only row of links that sets one query parameter (used for the returning-winner outcomes and the review pages' Identity check: New / Re-used) |
| `PaymentBreakdownForm` | `components/collector/PaymentBreakdownForm.tsx` | Step 2 form |
| `BeforeYouStartView` / `EmailAddressForm` / `SecondaryIdForm` / `MedicareCardForm` / `ApprovalView` | `components/collector/` | Before you start (pre-step, not in the stepper), Email Address, Secondary ID (skip checkbox or Medicare form), Approval confirmation |
| `PrimaryIdFlow` | `components/collector/PrimaryIdFlow.tsx` | Primary ID state machine: `IdDocumentPicker` → `IdDocumentDetailsForm` → `IdNameForm` → `IdDobForm` → `IdAddressForm` → `IdReviewScreen` (+ `IdentityCheckPanel`, `IdCheckActionRow`, `ReviewSection`) |
| `StepFormLayout` / `CheckboxRow` | `components/collector/` / `components/ui/` | Heading + Back/Next row shared by the ID sub-screens; bordered checkbox row |

## ID documents (FrankieOne alignment)

`lib/id-document-config.ts` is the single source for the Primary ID step: the country list, the document types offered per country (mirrors UAT), and the detail fields per country + document. The Country picks the document buttons, and the document picks the fields — e.g. an Australian Driver Licence asks for State of Issue, a New Zealand Driver Licence asks for Licence Number + Version and no State. Fields marked "assumed" in that file (NZ Licence Version, Passport, National ID, Manual KYC) are placeholders until the FrankieOne field spec is confirmed. The identity check is mocked: a prototype-only toggle picks Pass or Server unavailable (which shows the bypass + manual-verification attestations).

## UI rule: verification results are always a pill

Any verification outcome — Account Name Check, ID Name Match, and similar Match / Close Match / No Match results — is shown with `VerificationPill` (`components/ui/VerificationPill.tsx`). Never render these as plain coloured text or a one-off badge.

| Tone | Icon | Use for |
|---|---|---|
| `success` | tick | Match, Yes, Pass |
| `warning` | triangle | Close Match, needs a look |
| `danger` | cross | No Match, No, Fail |

- The pill text is the result only ("Match", "Yes"); the label sits beside it ("Account Name Check:", "ID Name Match:").
- `size="sm"` for inline rows on the Approver / Authoriser panels; `size="md"` for a standalone result card (Collector CoP Validation).
- Colour, icon and sizing live in the component, so a new result type only picks a tone.
- Not covered yet: the Admin dashboard table cells (`ResultPill`) keep their own compact style.

## Field states

- **Default:** `field` bg, 1px `line` border, 8px radius, 72px height, 21px left padding.
- **Focus:** border + 2px ring `focus`.
- **Disabled:** `field-disabled` bg, `muted` text (Machine shows "Please select a venue first").
- **Primary button disabled:** `brand-disabled` bg, white text, `cursor-not-allowed`.

## Collector step order

1. New Payout Details 2. Payment Breakdown 3. Email Address 4. Primary ID Document 5. Secondary ID (Optional) 6. Bank Account 7. Summary 8. Approval

## Routes

- `/` — home, with a button to the collector flow
- `/collector/payout-details` — step 1 (built)
- `/collector/payment-breakdown` — step 2 (built)
- `/collector/summary` — step 7 (built; steps 3–6 skipped for now)
- `/approver/payout` — approver review of a payout (separate from the collector flow)
- `/admin/dashboard` — Venue Admin Payouts Dashboard (filters, table, pagination). `/admin/users` and `/admin/machines` are placeholders
- `/admin/venues` — Venues list (Venue Name, Payment Method, Daily Limit, edit icon on hover). Add `?role=super-admin` to see every client with a Client column. `/admin/venues/[id]` — Venue Settings (same query). An Admin opening another client's venue sees an access message
- `/authoriser/manual-bank-export` — Manual Bank Transfer Export (authoriser Manage menu). Tabs: Ready to Export (Pending Payment; confirm → CSV download → batch moves to Awaiting ABA Reference, no prompt), Awaiting ABA Reference (one row per export batch; Enter ABA Reference once the bank has processed the file / re-download), Completed (ABA Reference + fixed Exported DateTime; Start/End date filter; re-download changes nothing). Payouts move to Payment Completed only when the ABA reference is saved
- `/collector/returned-payout?type=cheque|payment-file` — Collector corrects a returned payout (shows the return reason)
- `/approver/payout` and `/authoriser/payout` accept `?scenario=funds-transfer|payment-file|cheque-collector|cheque-authoriser|cheque-both` (prototype switcher at the top of each page). Both roles can Return for Correction
- `/authoriser/payout` — authoriser final sign-off on a payout (visually identical shell to the approver page; separate from both collector and approver flows)
- `/collector/before-you-start` → `/collector/email-address` → `/collector/primary-id` → `/collector/secondary-id` (all built). Secondary ID routes to `/collector/payout-destination-details` for a non-cash destination, or `/collector/summary` for cash only. Summary Submit → `/collector/approval` (built; the original Approval screen wasn't captured, so it's a simple "awaiting approval" confirmation)
- `/approver/payout` and `/authoriser/payout` also accept `?type=egm|member-card|gaming-promotion|club-promotion` (CRP-461). Payout Details shows Payout Type first, Machine ID only for EGM, and Bank Statement Description when the payout goes to a bank account
- `/emails/patron?type=…` — the two patron emails (after collection, when the money is sent); highlighted text changes with the payout type (placeholder wording)
- `/collector/[step]` — placeholder for any collector step without its own route (none left in the current stepper)
- Stepper items are links; every step navigates to its route

## Payout types (CRP-461)

`lib/payout-types.ts` is the single source for payout types: label, Venue Settings line, bank statement code and email wording, plus `buildBankDescription()` (`<Payout ID> <Code> <Initial Surname>`, upper case, cut to 18 characters). Codes and wording are placeholders until the venue's finance team confirms them. The Collector's Venue now comes before Payout Type; the options are the venue's switched-on types (EGM always), a venue with one type gets it chosen automatically, and Machine shows only for EGM. The Manual Bank Transfer CSV adds Payout Type and Bank Statement Description columns (9 columns). The export page shows a Payout Type column after Amount on all three tabs (in the expanded batch list on Awaiting ABA Reference), using the venue's Member Card name; the CSV keeps the standard name.

## Returning winner (CRP-186)

`lib/returning-winner.ts` mocks the lookup. On Next, the Email Address step normalises the Membership # (spaces and punctuation ignored) and looks for an earlier winner of the client. A found record whose last check passed, is inside the venue's re-use period and whose ID document hasn't expired can be re-used: the saved details go to the Summary (with "Identity Check: Re-used" and "Checked On: <date>" rows) and the Collector skips to Secondary ID. Too old, expired document or not passed show the reason and lead to Primary ID. Not found, no number, a duplicate number or re-use switched off go straight to Primary ID. Routes: `/collector/returning-winner` (`?member=` picks a mock outcome: 1234567 re-usable, 2345678 too old, 3456789 document expired, 4567890 not passed). `/approver/payout` and `/authoriser/payout` take `?idv=reused`, which shows the re-used check and its note in IDV History.

## Required fields and limits

- `FormField` takes `required` to add a red asterisk after the label. Optional fields are labelled "(optional)" instead.
- The Return for Correction reason is required (asterisk), limited to 500 characters with a counter, and the box scrolls.
- The success message (`Toast`) uses the success tint (`bg-success-soft`) like other success alerts.
- When only the Authoriser enters cheque details, the Collector skips Payment Method Details and goes from Secondary ID straight to Summary.
