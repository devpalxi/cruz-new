# Feature questions

Plans and open questions for features in progress. A feature's section is removed once the feature is marked complete.

---

## CRP-461 - Configurable Payout Source - Member Card / Promos

_Started: 2026-11-19 · Status: Ready for review (built with placeholder wording)_
Jira: [CRP-461](https://cruzmoney.atlassian.net/browse/CRP-461)

### What we're building

Venues pay out more than poker machine wins. A patron's member card balance (MyCash, Porters Perks) or a promotion prize can be paid to their bank account through Cruz. The Collector picks the payout type from four options: EGM, Member Card, Gaming Promotion and Club Promotion. The checks are the same for every type; only the label changes. The Approver, the Authoriser, both patron emails, the bank statement description and the payment file all show the type, because the venue's accounting system codes each payment by it. Each venue switches the non-EGM types on or off in Venue Settings.

### Words we're using

- **Payout Type:** the existing field on Create New Payout (it offered EGM, TAB and Keno). It is re-used to say where the payout came from. The ticket calls this "Payout Source"; the customer calls it "payout type".
- **EGM:** a win from a poker machine. This is how payouts work today.
- **Member Card:** a patron's member card balance (MyCash from Max Gaming, Porters Perks). It is a stored-value card, not a place to pay into, and it holds up to \$10,000. The MyCash number is the member number. A venue can rename this option, for example to "MyCash" (question 3). MyCash is used by pubs and clubs in Queensland and the Northern Territory.
- **Gaming Promotion:** a prize from a gaming promotion, for example a member number drawn on a promotion night. It doesn't count towards gaming tax. _Name to confirm._
- **Club Promotion:** a prize from a member or club-wide promotion, run by the venue's marketing. _Name to confirm._
- **Bank statement description:** the text that shows on the bank statement line for the transfer. The venue's accounting system (Xero) reads it to code the payment. The wording follows Lee's list (question 4).
- **Venue toggle:** a per-venue on/off switch in Venue Settings, the same as the Manual Bank Transfer and Cheque switches.

### How we plan to build it

- **Who uses it:**
  - Admin, in Venue Settings: turns the types on or off.
  - Collector, on step 1 Create New Payout: picks the type.
  - Approver and Authoriser, on the review pages: see the type and the bank statement reference.
  - Patron: sees the type in the two emails (after collection, and when the money is transferred) and on the bank statement.
  - Authoriser: downloads the payment file, which shows the type.
- **Where:**
  - `/admin/venues/[id]`: a new "Payout Types" group under Payouts settings.
  - `/collector/payout-details`: the Payout Type field.
  - `/collector/summary`.
  - `/approver/payout` and `/authoriser/payout`: new scenarios in the prototype switcher.
  - `/authoriser/manual-bank-export`: the CSV gets the payout type and the bank statement description.
  - New email preview route (path to decide): the two patron emails, with the text that changes by type.
- **Reuse:**
  - In Venue Settings: `PaymentMethodRow` (switch cards), `AlwaysAvailableMethodRow` (EGM is always on), `Switch`, `FormField` and `TextInput`.
  - In the Collector flow: `SelectInput`.
  - On the review pages: `DetailList`, `ScenarioSwitcher`, and the `paymentMethods`-style label constants in `lib/venue-data.ts`.
- **New:**
  - `lib/payout-types.ts`: one list of the four types, with each type's label, code, bank statement description and email text. A `buildBankDescription()` helper builds the description. Every screen, the CSV and the emails read from this list, so wording changes in one place. The descriptions are placeholders until Lee's list arrives.
  - New fields on `Venue` in `lib/venue-data.ts`: `memberCardEnabled`, `gamingPromotionEnabled`, `clubPromotionEnabled`, and an optional `memberCardName`.
  - `components/admin/PayoutTypeSettings.tsx`: the group of payout type cards in Venue Settings. EGM is fixed On. Member Card, Gaming Promotion and Club Promotion each have a switch, and Member Card has an optional Display Name.
  - A Bank Statement Description row in Payout Details on the review pages. A plain `DetailList` row unless it needs more.
  - A Payout Type column and a Bank Statement Description column in the Manual Bank Transfer CSV (`lib/manual-export-data.ts`).
  - Email preview components (names to decide), one per email, with the type-specific line taken from `lib/payout-types.ts`.
  - Collector step 1 changes:
    - Venue moves above Payout Type, because the options depend on the venue.
    - Machine shows only for EGM.
    - TAB and Keno are removed.
    - The member number is already captured on every payout, so Member Card needs nothing extra.
  - `docs/design.md` gets the new components, fields and route.
- **Not changing:** the checks. ID, screening, bank account checks and the \$5,000 rule are the same for every type.
- **Mock data and scenarios:**
  - Riverside RSL Club (Queensland) has all four types on, with Member Card renamed to "MyCash".
  - One other venue has only EGM, to show the field with a single option.
  - New review scenarios: `member-card`, `gaming-promotion` and `club-promotion`, next to the current EGM ones.
  - Example bank statement description: placeholder until Lee's list arrives.
- **Wording to confirm:**
  - "Gaming Promotion" and "Club Promotion".
  - "Member Card", and whether it is shown as "MyCash" for Queensland venues.
  - The bank statement description and email text for each type (from Lee's list).
  - "Bank Statement Description" as the row label.

### Questions

Answers below come from the call with Lee (head of finance at the customer) on 2026-11-19. Each question is marked **✅ Answered**, **🟡 Partly answered** or **🔴 Unresolved**.

1. **Should the screen label stay "Payout Type", or change to "Payout Source"?** "Payout Type" is already on the Collector screen, and venues know it. "Source" is closer to what it means, but it's a new word. Default: keep **Payout Type**.
   - ✅ **Answered:** Keep **Payout Type**. Lee uses the term himself ("the MyCash is the payout type"), and the team called it "the payout type drop-down" on the call.
2. **Should Member Card and Promo be two separate options, or one "Member Card / Promo" option?** Two options give the finance team two codes to filter on. One option is simpler, and was the working label in the meeting. Default: **two separate options** (EGM, Member Card, Promo).
   - ✅ **Answered:** Separate options, and there are **four types, not three**: **EGM**, **MyCash** (member card), **Gaming Promotion** and **Member / Club-wide Promotion**. Each goes to a different account code in the venue's accounting system:
     - EGM payouts count towards state gaming tax.
     - Gaming promotions don't count towards gaming tax.
     - MyCash goes to its own code.
     - Club-wide promotions go to the marketing division.
   - 🔴 **Still to confirm:** the exact names on screen ("Gaming Promotion", "Club Promotion" or Lee's own wording). Jackpot was also mentioned as a source of payouts ("or it'll be a jackpot"). Confirm whether it is just EGM or needs its own type.
3. **Can a venue rename the Member Card option (for example to "Porters Perks")?** The meeting asked for some control over the display name. Default: an **optional Display Name** for Member Card in Venue Settings. Collectors see that name, while the code in the bank reference stays fixed. Promo keeps its name.
   - 🟡 **Partly answered:** Not asked directly. The call confirms "MyCash" is Max Gaming's product name, so other venues and card systems will use other names (for example Porters Perks). That supports a venue display name. Whether venues need to rename it is still unconfirmed.
4. **What are the three-letter codes, and what is the reference format?** The meeting suggested payout number, then the code, then patron info. Default: codes **EGM / MEM / PRO**, format `<Payout ID> <Code> <Initial Surname>`, cut to 18 characters. Example: `764 MEM V MISHRA`.
   - 🔴 **Unresolved:** Lee will **email the list of descriptions they use now** for each payout type. The bank statement wording should match it as closely as possible, because their accounting system (Xero) reads the bank statement line to code each payment automatically. Wait for Lee's list before fixing the codes and format.
5. **Where should the bank statement reference appear in the prototype?** Default: as a **"Bank Statement Reference" row** in Payout Details on the Approver and Authoriser pages, and as a new column in the Manual Bank Transfer CSV. The CSV would then have 8 columns, which may also settle the open 7-or-8-columns question.
   - ✅ **Answered:** The payout type must show in two places:
     - **The bank statement description** of the transfer, so the patron and the venue see it.
     - **The CSV / payment file**, which must "identify them separately".

     The same wording should also match the two patron emails (see question 7).
6. **What extra details does the Collector enter for Member Card and Promo?** There is no machine for these, so Machine would be hidden. Default: **Member Card: nothing extra** (the membership number is already captured with the member details). **Promo: an optional "Promotion Name"** (for example "Friday Door Prize"). The docket stays for all types.
   - 🟡 **Partly answered:**
     - **MyCash:** no machine is needed ("you don't need to know the EGM anymore once it's transferred to the card"). The **MyCash number is the same as the member number**, and the member number is captured on every payout, so nothing extra is needed.
     - **Every type:** ID checks, screening and bank account checks still apply. The \$5,000 rule is the same whatever the type ("5K is 5K"). Only the identifier changes, not the process.
     - 🔴 **Still to confirm:** whether promotions need any extra field (such as a promotion name), and whether the docket is still needed for MyCash and promotions.
7. **Should the prototype show emails?** No email screens exist yet. Default: **one static email preview page** (the "payout awaiting approval" email) with a Payout Type line, so the developer can see where it goes. If you know which emails are meant, list them.
   - ✅ **Answered:** There are **two patron emails**, and their text must match the payout type:
     - one sent at the end of collection
     - one sent when the money is transferred

     Together with the bank statement, that makes three places the patron sees, and the wording must be consistent across all three. The logic is "if MyCash, insert this text; if club promotion, insert that text". The emails are generic today.
   - 🔴 **Still to confirm:** the email text for each type. It will probably follow Lee's list from question 4.
8. **Should we build anything for the waiting period now?** The meeting left this open for Lee (head of finance at the customer). Default: **build nothing for it** and keep it as an open question. If needed later, it could be a per-venue "minimum wait before payment" setting.
   - 🟡 **Partly answered:** A 24 to 48 hour hold before payment came up, but for the **payment file** flow: the file should only include payouts that have passed their time frame. It was not described as a rule for MyCash or promotions. Nothing to build in this ticket.
9. **Should EGM always be on, or switchable like the others?** Default: **EGM is always on** (a fixed On switch, the same as Electronic Fund Transfer). Member Card and Promo are off until the venue turns them on.
   - 🟡 **Partly answered:** Not asked directly. The call says **MyCash exists only for pubs and clubs in Queensland and the Northern Territory**. The suggestion was to use the venue's postcode (starting with 4 for Queensland) to decide which types are offered, which fits the earlier idea of a state on the venue. EGM always on, and the per-venue switches for the other types, are still unconfirmed.
10. **Should the Admin Payouts Dashboard get a Payout Type column or filter?** Default: **not in this ticket**, so the scope stays on Collector, review pages, Venue Settings and reference.
    - 🔴 **Unresolved:** Not discussed on the call.
11. **(New, from the build) Should the payment file show the venue's own Member Card name (for example "MyCash") or the standard "Member Card"?** The screens show the venue's name. The CSV shows "Member Card" so the column is the same for every venue. Default: keep **"Member Card"** in the CSV.
    - 🔴 **Unresolved**

---

## CRP-186 - Re-using winner details

_Started: 2026-11-19 · Status: Ready for review (draft, built with the defaults)_
Jira: [CRP-186](https://cruzmoney.atlassian.net/browse/CRP-186) (Jira status: Blocked, waiting on CRP-216 Frankie Integration Review)

### Is it already in the prototype?

**No.** Today every payout makes the Collector type the winner's ID details again, and the identity check runs every time. The pieces that exist:

- The Email Address step (`/collector/email-address`) already asks for **Membership #**, but nothing is looked up with it.
- The Approver and Authoriser pages have an **Identity Verification (IDV) History** table, but it only shows the current payout's check.
- `docs/cruz-money-system-overview.md` describes a "90-Day Returning Winner Policy" (skip the check for a repeat winner at the same venue within 90 days, Confirmation of Payee still required). Nothing in the prototype does this, and it doesn't match the newer Jira spec (a window each client sets, up to about 12 months).

### What this feature is (plain explanation)

When a winner is paid through Cruz, the Collector types their ID details (licence, passport and so on), and Cruz pays FrankieOne to check them. If the same person wins again next week, all of that happens again: the same typing, the same wait and another FrankieOne charge.

This feature lets Cruz **recognise a winner it has already checked** and **re-use that earlier identity check**, instead of running a new one:

1. The Collector enters the winner's **membership number**, as they do today.
2. Cruz searches that client's earlier winners for the same membership number.
3. If it finds them, and their last identity check **passed** and is **recent enough** (inside the client's re-use period, for example 12 months), the Collector sees the saved details: name, date of birth, ID document and the date of the last check.
4. The Collector asks the winner whether anything has changed. If **nothing has changed**, the payout re-uses the earlier check and skips the ID screens, with no FrankieOne charge. If **something has changed**, or the old check was too old, failed or incomplete, the Collector goes through the normal ID screens.
5. Every lookup and every re-use or re-check decision is recorded, so it can be audited later.

**Why:** fewer FrankieOne charges, faster payouts for regulars, and less re-typing (which also means fewer typing mistakes).

**What does not change:** the bank account check (Confirmation of Payee) still runs on every payout. Approval rules don't change, and no records are shared between different clients.

### Two approaches in the Jira text

The ticket holds two ideas, and they need a decision (question 1):

- **A. Earlier idea (top of the ticket):** confirm it's really the same person by **sending the winner an email**. The winner clicks to approve, or reads a code back to the Collector. This idea also talks about re-using **personal, bank and ID** details.
- **B. Later spec ("Returning Player Recognition & IDV Reuse", with the technical plan):** look up by **membership number** within the client. The **Collector confirms** the details are unchanged, and no email is sent. It re-uses **only the identity check**, not the bank account check. This is the more detailed and more recent version.

### Details pulled from the ticket (relevant to the UI)

- Re-use only a check that **passed and is complete**. Don't re-use failed checks, checks still processing, manual bypasses (No ID / Manual KYC) or checks where the service was unavailable.
- The re-use period is **set per client, in days**, with a cap of about 12 months. If it isn't set, nothing is re-used.
- The Collector **sees the saved record before re-using it**, and must confirm it is unchanged.
- **Edge cases:**
  - The ID document's expiry date. A review comment says the current design "won't check ID expiry date".
  - Membership numbers written differently (spaces or punctuation).
  - Existing winners with no membership number stored yet.
  - Two records with the same membership number.
- **Still open in Jira:**
  - Can a failed PEP result that was manually accepted be re-used?
  - Does the re-use period start from the date FrankieOne ran the check, or from the date Cruz assessed it?
  - How are older winners without a membership number linked?
- **Engineering only, not on screen:** hashed matching, database fields, audit records and data migration.

### Simple flow

```mermaid
flowchart TD
  A[Collector enters Membership # on Email Address step] --> B{Earlier winner found for this client?}
  B -- No --> N[Normal ID screens and a new identity check]
  B -- Yes --> C{Last check passed, recent enough, and ID document not expired?}
  C -- No --> R[Show why it can't be re-used, then normal ID screens]
  C -- Yes --> D[Show saved details and last check date]
  D --> E{Winner says nothing has changed?}
  E -- Yes --> S[Re-use the earlier check, skip ID screens]
  E -- No --> N
```

### Words we're using

- **Returning winner:** someone this client has paid through Cruz before. The ticket says "returning player" and "returning customer". The customer-facing word needs confirming (question 11).
- **Identity check (IDV):** the FrankieOne check of the winner's ID document, plus the PEP and sanctions screening.
- **Re-use period:** how long a passed identity check can be re-used, in days, set per client.
- **Membership number:** the venue's member number, already captured on the Email Address step. For MyCash it is the same number (CRP-461).
- **Saved record:** the winner's details from their last checked payout.

### How we plan to build it

- **Who uses it:**
  - **Collector:** on the new screen after the Email Address step.
  - **Approver and Authoriser:** see on the review pages that the identity check was re-used, and from when.
  - **Admin (or Super Admin):** sets the re-use period.
- **Where:**
  - New Collector screen between `/collector/email-address` and `/collector/primary-id`, for example `/collector/returning-winner`.
  - Review pages: `/approver/payout` and `/authoriser/payout`.
  - Re-use period setting: Venue Settings or a client-level page (question 6).
- **Reuse:**
  - `StepFormLayout` and `DetailList` for the saved details.
  - `VerificationPill` for the last check's result.
  - `WarningAlert` for reasons a record can't be re-used.
  - `IdvHistoryTable`, extended with a "Re-used from payout #… on …" row.
  - `PaymentMethodRow` / `FormField` / `TextInput` for the setting.
- **New (names to settle):**
  - `lib/returning-winner.ts`: mock earlier winners and a lookup that returns found and re-usable / found but too old / found but failed / found but ID expired / not found.
  - `components/collector/ReturningWinnerView.tsx`: the decision screen.
  - A small "identity check re-used" note for the review pages.
  - A re-use period field.
  - A prototype-only scenario switcher, so reviewers can see each lookup result.
  - `docs/design.md` updated.
- **Mock data and scenarios** (click through each):
  1. Found and re-usable.
  2. Found, but the last check is older than the re-use period.
  3. Found, but the ID document has expired.
  4. Found, but the last check failed or was a No ID / Manual KYC exception.
  5. Not found (first-time winner).
  6. No membership number entered.
  7. The winner says details changed.
- **Wording to confirm:** the screen title and button labels, "Returning Winner", "Re-use period" and the reason messages.

### Questions

1. **Which approach should the prototype show: A (email or code sent to the winner) or B (membership number lookup, Collector confirms)?** B is the newer, detailed spec, and engineering's plan follows it. A adds a confirmation step from the winner. Default: **B**, with no email or code.
   - Answer: Use the default (user, 2026-11-20).
2. **What is re-used: only the identity check, or the bank details too?** Spec B re-uses only the identity check and runs the bank account check every time. Idea A mentions personal, bank and ID. Default: **identity details and the identity check only.** Bank details are entered as today.
   - Answer: Use the default (user, 2026-11-20).
3. **What should the Collector see in the saved record?** It is personal information shown on the gaming floor. Default:
   - full name
   - date of birth
   - ID document type
   - document number, masked to the last 3 digits
   - document expiry date
   - suburb and state
   - last check date and result
   - Answer: Use the default (user, 2026-11-20).
4. **How does the Collector confirm "nothing has changed"?** Default: two buttons, **"Details Are the Same, Use These"** and **"Details Have Changed, Check Again"**, after the Collector asks the winner. No tick box.
   - Answer: Use the default (user, 2026-11-20).
5. **If the ID document has expired (or expires today), must the winner be checked again even inside the re-use period?** This is the edge case in the ticket. Default: **yes, a full check again.** The screen says the document has expired.
   - Answer: Use the default (user, 2026-11-20).
6. **Where is the re-use period set: per client (the spec) or per venue (the ticket summary)?** The prototype only has Venue Settings today; there is no client settings page. Default: **a "Re-use Identity Check For (days)" field on Venue Settings**, maximum 365. Blank means off. Say if it must be client-level instead.
   - Answer: Use the default (user, 2026-11-20).
7. **Which earlier results can be re-used?** Default: **only a clean pass.** Not a failed check, a manual bypass, No ID / Manual KYC, or "service unavailable". A failed PEP result that was manually accepted is treated as **not re-usable** until Compliance decides (it's open in Jira).
   - Answer: Use the default (user, 2026-11-20).
8. **Should the Approver and Authoriser see that the check was re-used?** Default: **yes.** The IDV History shows "Re-used from payout #<number>, checked <date>", and the Identity Verification section says the check was re-used.
   - Answer: Use the default (user, 2026-11-20).
9. **What happens when no membership number is entered, or two records share one?** Default:
   - **No number:** skip the lookup and use the normal ID screens.
   - **Duplicate:** treat it as not re-usable and use the normal ID screens. The Collector isn't shown the duplicate.
   - Answer: Use the default (user, 2026-11-20).
10. **Does the "90-Day Returning Winner Policy" in the system overview still apply?** Default: **no.** It is replaced by the per-client re-use period. The overview doc can be updated later if you want.
    - Answer: Use the default (user, 2026-11-20).
11. **What should it be called on screen?** Options: "Returning Winner", "Returning Member", "Previous Identity Check Found". Default: screen title **"Returning Winner"**, with a line such as "This member was identity checked on 12/08/2026."
    - Answer: Use the default (user, 2026-11-20).
12. **Should we wait for the Jira blockers?** The ticket is Blocked (CRP-216), and the technical plan says policy decisions come first (Phase 0). Default: **build the prototype now** with the defaults above, so it can help those decisions. Mark it as a draft.
    - Answer: Use the default (user, 2026-11-20).

---

## CRP-382 - Region Driven AML Configuration

_Started: 2026-11-20 · Status: Waiting for answers_
Jira: [CRP-382](https://cruzmoney.atlassian.net/browse/CRP-382) (theme: Trust and Compliance)

### What this feature is (plain explanation)

Each Australian state or territory limits how much of a gaming machine win a pub or club can pay in **cash**. Anything above that limit must be paid another way, such as a bank transfer or a cheque. Today the prototype has **one set of rules for every venue**: the Collector can type any cash amount, whatever state the venue is in. That risks paying out in a way that breaks state law.

This feature makes the rules follow **the venue's state**:

1. Each venue has a **state or territory** (NSW, VIC, QLD and so on). It is fixed in Venue Settings, not something the Collector picks.
2. The state sets the **state cash limit**, for example \$5,000 in NSW and \$2,000 in VIC. A venue can set its **own lower limit**, and in Queensland it must set one.
3. On **Payment Breakdown**, the Collector can't enter more cash than the lower of the two limits. If they try, a message explains the limit and that the rest must be paid by bank transfer or cheque.
4. The **\$5,000 AML rule** stays the same in every state: a payout of \$5,000 or more always needs an identity check. The ticket adds that payouts to the **same person that add up to \$5,000 or more** (aggregated) also need one.
5. The venue chooses which **payment methods** it offers (cash, bank transfer, cheque, MyCash). Payment Breakdown only offers those.

### Is any of it in the prototype today?

- **Venue Settings** already has switches for Manual Bank Transfer and Cheque (Electronic Fund Transfer is always on), and a Daily Limit. There is **no state** and **no cash limit**.
- **Payment Breakdown** (`/collector/payment-breakdown`) has Cash Amount, Confirm Cash Amount and one Non-Cash Payout Method. It **doesn't check any cash limit**. Total Winnings is a fixed mock \$1,000, not the amount from step 1.
- **Membership Card** is offered as a non-cash method at every venue, outside earlier epics.
- `docs/cruz-money-system-overview.md` already describes this design: a state cash table, "effective cash cap = the lower of the state limit and the venue limit", the \$5,000 AML gate, and a venue toggle "Require IDV + Screening below \$5,000 AML threshold". **None of it is built.**
- The **CRP-461** call with Lee said MyCash and the extra payout types belong to Queensland and the Northern Territory, and suggested deciding by the venue's state.

### Details pulled from the ticket and screenshots

- **Scenarios** (the venue's payment methods):
  1. Cash and bank transfer only. This is the current flow, but with the state cash limit applied.
  2. Cash, bank transfer and cheque.
  3. MyCash, bank transfer and cash.
- **Your note:** "MyCash: venue-level on/off switch. Flow the same as EFT."
- **AML:** an aggregate of \$5,000 or more is a hard rule for an identity check.
- **State limits for pubs and clubs** (from the table with Rule Status):

  | State | Limit | Rule | Status |
  |---|---|---|---|
  | VIC | \$2,000 | Ban: no cash at all above it | Verified |
  | NSW | \$5,000 | Cap: cash up to \$5,000, the rest transferred | Verified |
  | QLD | Venue sets it, \$5,000 maximum | Cap | Verified |
  | TAS | \$1,000 | Cap, per win | Verified |
  | SA | about \$2,000 | Unknown | Unverified |
  | NT | about \$500 | Unknown | Unverified |
  | ACT | about \$1,200 | Unknown | Unverified |
  | WA | No pokies in pubs or clubs | - | Verified |

  The other tables and the system overview give slightly different figures (for example TAS \$1,500, QLD default \$1,000). Casinos have their own rules.
- **Screenshot ideas** (mock only; we use our existing UI design):
  - A "Regional compliance" block with a fixed jurisdiction, the state limit, and "Maximum cash payout allowed".
  - The rule "Bank transfer and cheque cannot be enabled together".
  - The error "Cash amount exceeds the NSW statutory limit of \$5,000.00 AUD. The remainder must be paid by bank transfer or cheque."
  - Venue toggles "Require IDV + Screening below \$5,000 AML threshold" and "Skip Identity Verification".
  - Payment Breakdown with **two non-cash lines at once**: Cheque and Bank, or MyCash and Bank.

### Words we're using

- **State (state or territory):** where the venue is. It decides the state cash limit. The screenshots say "jurisdiction"; on screen we'd say "State or Territory".
- **State cash limit:** the most cash the law lets a pub or club pay for one win in that state.
- **Venue cash limit:** an optional lower limit the venue sets for itself. Required in Queensland.
- **Cash limit (effective):** the lower of the two. This is what the Collector is held to.
- **Cap vs Ban:**
  - **Cap:** cash up to the limit, and the rest by another method.
  - **Ban:** once the win is over the limit, possibly **no cash at all** (VIC). This needs confirming (question 3).
- **Aggregated payouts:** several payouts to the same person within a period, added together for the \$5,000 AML rule.
- **MyCash (payment method):** here it seems to mean paying the money **onto** the patron's member card. That is different from CRP-461, where Member Card is the **source** of the payout (question 7).

### How we plan to build it

- **Who uses it:**
  - **Super Admin** (or onboarding): sets the venue's state.
  - **Admin:** sees the state and its limit, and sets the venue cash limit and payment methods.
  - **Collector:** is held to the limit on Payment Breakdown.
  - **Approver and Authoriser:** see the limit that applied, and any aggregate AML note.
- **Where:**
  - `/admin/venues/[id]`: a new "State Rules" group, possibly also showing the state on the Venues list.
  - `/collector/payment-breakdown`: the limit check and message.
  - `/approver/payout` and `/authoriser/payout`: small additions.
- **Reuse:**
  - Venue Settings: `PaymentMethodRow` / `AlwaysAvailableMethodRow` / `Switch`, `FormField`, `TextInput` / `CurrencyInput`, `SelectInput`, `WarningAlert`.
  - Payment Breakdown: `AmountCard`, `CurrencyInput`, `DetailList`.
  - Demo states: `PrototypeSwitcher`.
- **New (names to settle):**
  - `lib/state-rules.ts`: one table of states with limit, rule type and verified flag, plus a helper for the effective limit.
  - New `Venue` fields: `state`, `venueCashLimit`, and possibly `myCashEnabled` and `requireIdBelowThreshold`.
  - `components/admin/StateRulesSettings.tsx`.
  - A cash limit message under Cash Amount on Payment Breakdown.
  - Possibly an aggregate AML notice.
  - Total Winnings taken from the step 1 Win Amount, so limits can be shown with real amounts.
  - `docs/design.md` updated.
- **Mock data and scenarios:**
  - Riverside RSL Club: QLD, venue limit \$2,000, cash, bank transfer, cheque and MyCash.
  - Northside Sports Club: NSW, \$5,000, cash and bank transfer.
  - A VIC venue, to show the \$2,000 rule.
  - A prototype switcher on Payment Breakdown for the three scenarios and a few states.
  - Win amounts below and above the limit.
  - A win over the limit at a venue with no non-cash method.
- **Wording to confirm:** "State Rules", "State or Territory", "State Cash Limit", "Venue Cash Limit", the over-limit message, and the aggregate AML message.

### Questions

1. **Where is the venue's state set, and can the Admin change it?** The screenshot shows it as fixed. Default: **set by the Super Admin** (Venue Settings with `?role=super-admin`). The Admin sees it read-only with its state cash limit.
   - Answer: _pending_
2. **Which limits should the prototype use?** The tables differ. Default: the **Rule Status table** (VIC \$2,000, NSW \$5,000, QLD venue-set up to \$5,000, TAS \$1,000, SA \$2,000, NT \$500, ACT \$1,200, WA not available), with the unverified states (SA, NT, ACT) marked "to be confirmed" in the code only.
   - Answer: _pending_
3. **What does "Ban" mean for VIC?**
   - **Cap:** up to \$2,000 in cash, and the rest by bank transfer or cheque.
   - **Ban:** if the win is over \$2,000, none of it can be cash.

   This changes what Payment Breakdown allows. Default: **Ban.** For a VIC win over \$2,000, Cash must be \$0 and a message explains why.
   - Answer: _pending_
4. **Should every venue be able to set its own lower cash limit, and must Queensland venues set one?** Default: **yes to both.** An optional "Venue Cash Limit" for every state, which can't be higher than the state limit. For Queensland it is required (up to \$5,000).
   - Answer: _pending_
5. **Pubs and clubs only, or casinos too?** Casinos have different limits. Default: **pubs and clubs only.** No venue type field for now.
   - Answer: _pending_
6. **Can a venue switch on both bank transfer and cheque?** One screenshot says they can't be enabled together, but Scenario 2 has both. Default: **yes, both can be on**, as the prototype allows today.
   - Answer: _pending_
7. **What is MyCash here?** Your note says "venue-level on/off, flow same as EFT", and Scenario 3 is MyCash + bank + cash. That reads like paying **onto** the member card as a non-cash method. CRP-461 treats Member Card as the **source** of the money (a payout type), not a way to pay. Default: **replace the always-on "Membership Card" method with a MyCash switch in Venue Settings** (using the venue's Member Card name). When chosen, it has the same steps as Electronic Fund Transfer: amount, then card details, then validate. Please confirm this is a way of paying, not the payout type.
   - Answer: _pending_
8. **Can one payout be split across two non-cash methods** (for example cheque and bank transfer, as in the screenshots)? Today the Collector picks **one** non-cash method. Default: **keep one non-cash method per payout.** The screenshots are mock only.
   - Answer: _pending_
9. **What happens when the win is over the cash limit?** Default:
   - An **error under Cash Amount** in our existing style, for example: "Cash amount is over the NSW limit of \$5,000.00. Pay the rest by bank transfer or cheque." Next stays off until it's fixed.
   - When a non-cash method is chosen, its amount is filled with the remainder, as today.
   - If the venue offers **no non-cash method**, a message says the payout can't go over the cash limit at this venue.
   - Answer: _pending_
10. **The \$5,000 aggregate rule: which payouts are added together?** Default: **the same member (membership number) at the same client within the last 24 hours.** When the total, including this payout, reaches \$5,000, a notice says an identity check is required, and the ID check can't be skipped. Say if the period should be the gaming day, 7 days or something else.
    - Answer: _pending_
11. **Should Venue Settings include the two identity toggles from the screenshots?** The screenshots have "Require identity check below \$5,000" and "Skip Identity Verification". They overlap, and Skip IDV exists in the glossary. Default: **add only "Require Identity Check Below \$5,000"** (off by default). Skip Identity Verification is left out of this ticket.
    - Answer: _pending_
12. **Should the Approver and Authoriser see the cash limit that applied?** Default: **yes**, a row in Payout Details such as "Cash Limit: \$5,000.00 (NSW)", plus the aggregate notice when it triggered.
    - Answer: _pending_
13. **Should the payout types from CRP-461 follow the state too** (Member Card and promotions only in QLD and NT)? Default: **not in this ticket.** The venue switches stay as they are, and state-based defaults can come later.
    - Answer: _pending_

---
