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
| `Button` | `components/ui/Button.tsx` | `primary` / `outline`, disabled state, can render as link |
| `Icons` | `components/ui/Icons.tsx` | Inline-only icons (Calendar). Others come from lucide-react / react-icons |
| `CurrencyInput` | `components/ui/CurrencyInput.tsx` | `$` prefix + AUD suffix input |
| `AmountCard` | `components/collector/AmountCard.tsx` | White rounded card with icon + title |
| `Accordion` | `components/ui/Accordion.tsx` | Single-open accordion; open header gets `header-open` bg + 3px `line-soft` ring |
| `DetailList` | `components/ui/DetailList.tsx` | Bold label / right-aligned value rows |
| `WarningBadge` / `WarningAlert` | `components/ui/` | Amber `warn-*` pill and alert box |
| `CopValidationCard` / `SummaryView` | `components/collector/` | Summary step pieces |
| `PaymentBreakdownForm` | `components/collector/PaymentBreakdownForm.tsx` | Step 2 form |

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
- `/collector/[step]` — placeholder for unbuilt steps (email-address, primary-id, secondary-id, bank-account, approval)
- Stepper items are links; every step navigates to its route
