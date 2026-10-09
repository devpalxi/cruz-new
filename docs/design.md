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
| `DetailList` | `components/ui/DetailList.tsx` | Bold label / right-aligned value rows |
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
| `Switch` / `RadioOption` | `components/ui/` | On/off switch (`role="switch"`); radio with a label and a help line |
| `PaymentBreakdownForm` | `components/collector/PaymentBreakdownForm.tsx` | Step 2 form |
| `BeforeYouStartView` / `EmailAddressForm` / `SecondaryIdForm` / `MedicareCardForm` / `ApprovalView` | `components/collector/` | Before you start (pre-step, not in the stepper), Email Address, Secondary ID (skip checkbox or Medicare form), Approval confirmation |
| `PrimaryIdFlow` | `components/collector/PrimaryIdFlow.tsx` | Primary ID state machine: `IdDocumentPicker` → `IdDocumentDetailsForm` → `IdNameForm` → `IdDobForm` → `IdAddressForm` → `IdReviewScreen` (+ `IdentityCheckPanel`, `IdCheckActionRow`, `ReviewSection`) |
| `StepFormLayout` / `CheckboxRow` | `components/collector/` / `components/ui/` | Heading + Back/Next row shared by the ID sub-screens; bordered checkbox row |

## ID documents (FrankieOne alignment)

`lib/id-document-config.ts` is the single source for the Primary ID step: the country list, the document types offered per country (mirrors UAT), and the detail fields per country + document. The Country picks the document buttons, and the document picks the fields — e.g. an Australian Driver Licence asks for State of Issue, a New Zealand Driver Licence asks for Licence Number + Version and no State. Fields marked "assumed" in that file (NZ Licence Version, Passport, National ID, Manual KYC) are placeholders until the FrankieOne field spec is confirmed. The identity check is mocked: a prototype-only toggle picks Pass or Server unavailable (which shows the bypass + manual-verification attestations).

## UI rule: verification results are always a pill

Any verification outcome — CoP Status, ID Name Match, and similar Match / Close Match / No Match results — is shown with `VerificationPill` (`components/ui/VerificationPill.tsx`). Never render these as plain coloured text or a one-off badge.

| Tone | Icon | Use for |
|---|---|---|
| `success` | tick | Match, Yes, Pass |
| `warning` | triangle | Close Match, needs a look |
| `danger` | cross | No Match, No, Fail |

- The pill text is the result only ("Match", "Yes"); the label sits beside it ("CoP Status:", "ID Name Match:").
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
- `/authoriser/payout` — authoriser final sign-off on a payout (visually identical shell to the approver page; separate from both collector and approver flows)
- `/collector/before-you-start` → `/collector/email-address` → `/collector/primary-id` → `/collector/secondary-id` (all built). Secondary ID routes to `/collector/payout-destination-details` for a non-cash destination, or `/collector/summary` for cash only. Summary Submit → `/collector/approval` (built; the original Approval screen wasn't captured, so it's a simple "awaiting approval" confirmation)
- `/collector/[step]` — placeholder for any collector step without its own route (none left in the current stepper)
- Stepper items are links; every step navigates to its route
