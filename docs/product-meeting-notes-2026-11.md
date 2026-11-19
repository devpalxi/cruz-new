# Product Meeting Notes (November 2026): Priorities, Decisions and Open Questions

Source: a transcript of an internal product and priorities meeting, pasted by the user on 2026-11-18. The transcript has no speaker labels and the first seconds are cut off, so speakers are named by role where that was clear. Read this before designing new screens. It is background, not a spec: nothing here is built in the prototype, and items marked "to confirm" are not decided.

Use the glossary terms in `docs/v1-glossary.md`. For anything a customer reads, follow the customer-wording rules in `CLAUDE.md`.

## 1. Who and what

- Participants (by role): Brian (close to customers, owns Stripe invoicing and venue agreements), Scott (product lead, runs the backlog list), Akila (requirements, spoke to the customer Kedron Wavel), Ben (engineer, joined late), an engineer who handles integrations, and Craig (senior, not on the call; several items wait for his view).
- Prioritisation test used: **"what gets us more revenue or more clients"**. Features that only improve compliance or polish rank lower.
- Customers mentioned: Kedron Wavel (needs Member Card), Endeavor Group (overseas payments, banks with Westpac), Momento, Eping, Ride, Eastwood, ABC pubs in Queensland, Porters Plains (about to be onboarded; has a "Porters Perks" member card).

## 2. Priority order (as discussed)

| Priority | Item | Why |
|---|---|---|
| Done | Manual Bank Transfer, Cheque | Built (this is the work in this repo) |
| High (revenue) | Stripe invoicing | Billing events are recorded; draft invoices are created at month end; Brian reviews and sends. Customers set up a payment method after their first invoice. The price per client can be overridden, and invoices can be amended with credit notes |
| High (revenue) | **Member Card / Promo payouts** | Kedron Wavel cannot use Cruz without it |
| Enabler | Region (state) at venue level | Foundation for limits and payout options per state |
| High | Move to FrankieOne v2 (refactor the identity-check integration) | Expected to fix many v1 failures; chosen over patching v1 |
| Medium | Show clearer reasons for ID check failures | Needs Craig's approval before showing more to the Collector |
| Medium | Sanctions status clarity | See section 7 |
| Lower | Exclusion lists | See section 5 |
| Lower / research | Overseas payments | See section 6 |
| Low | New Zealand driver licence, "tracks", test-payout flagging, time-zone bug | Smaller items; see section 8 |
| Backlog | TTR (threshold transaction reporting) | Wanted on the list to revisit; "a fairly mechanical thing" |

"Incremental improvements" (small requests such as collector comments or a mobile phone field) is a standing bucket, not one item.

## 3. Member Card / Promo payouts

Key decisions and understanding:
- A member card (for example MyCash) is a **source of funds**, not a destination. The jackpot is already on the card. When a patron wants cash out, the only way is through Cruz, which pays their bank account and **decrements the card by the payout value**. Akila confirmed this matches what Kedron Wavel said. In the UI, treat it as a way to pay out, not as an account to pay into.
- **Compliance (AML):** ID verification and screening apply when money **leaves** the club. Above the $5,000 threshold they are mandatory. Under it, the venue can still run the payout through Cruz, and it goes in the venue's normal batch.
- **Collector UI:** one more option in the payout type or method dropdown. There is no big change beyond that.
- **Approver and Authoriser:** the Approver sees "awaiting approval", can see it is a member card payout and the amount, checks due diligence and sanctions, then sends to the Authoriser, who releases payment after checking funds.
- **Bank statement reference:** the payout source must show in the bank reference so the venue can filter it. Space is very tight, so use a short **three-letter code** (for example MCP, or MEM). Proposed form: payout number, code, then patron and payout info. Show an example to Lee (head of finance at the customer) to confirm.
- **Naming:** use a generic label so it also fits other clubs' cards (Porters Perks) and **non-member promotional prizes** (for example a door-prize winner who is not a member). Working label: **"Member Card / Promo"**, possibly one line or two separate lines. Decide by whether venues need separate bank references for promo and member card.
- **Venue-level toggle:** the venue chooses whether to offer it, like the other methods. It does not depend on the cash-ceiling feature.
- **Customisation:** give some control over the display name, since references and wording differ by venue.
- **Open:** whether a waiting period applies (poker machine payouts are often 24 to 48 hours). Ask Lee. A mention that MyCash holders cannot withdraw cash at a machine supports routing all cash-outs through Cruz.
- The existing payout type field (EGM, plus TAB and Keno that were removed) can be reused for this.

## 4. State (region) rules at venue level

- Cash limits differ by state (examples given: Victoria $2,000, NSW $5,000, South Australia up to $10,000 with unlimited cash payout).
- Decision direction: add a **region or state indicator on the venue** (not the client, because a client can span states). Other defaults then attach to it: cash limits, and which payout options to show the Collector (for example only EGM in NSW, EGM plus Member Card and Promo in Queensland).
- Status: the per-venue configuration of limits is done. The next step is to **auto-default** these from the venue's state. See "Varied cash ceilings and AML" on the backlog list.

## 5. Exclusion lists

- Two separate ideas:
  1. **State and venue self-exclusion lists** (for example NSW MVSE, which covers gambling, lottery and casino exclusions; there is also multi-venue self-exclusion). The venue maintains its list, like the EGM spreadsheet. The patron's name is compared against it, like the name checks for payee confirmation. Lists include people excluded only for alcohol, who may still enter the venue, so those must not be blocked.
  2. **A Cruz-owned internal blacklist** (Craig's idea) to stop a payout being collected early on. Craig wants Cruz to hold authority in this risk area.
- One list in the Collector's view, not several to switch between.
- **Open and risky:** who sees the warning. The Collector may face an angry patron, so lean towards routing the alert to the **Approver**, as with AML. Unresolved case: a patron takes a cash portion and leaves. Some venues reportedly hold winnings until the exclusion period ends. Brian will get a sample list (names can be changed for privacy) and ask what identifying fields exist (assumed name and date of birth). A state list may become available by API.
- Training notes would need to say what the Collector does when Cruz refuses someone.
- Priority is low, because the club has already failed if an excluded person gambled; it is a reactive control.

## 6. Overseas payments

- One customer says about 20% of its payments go overseas, mostly to China.
- Zepto has **no international capability**, so the current rails cannot do it. Possible route: ABA export, then collect IBAN or sort code for international details. Overseas telegraphic transfers need the bank to do it.
- Idea: an overseas destination could create a suspicious matter report.
- Next step: research, and have an answer ready for an Endeavor meeting about three weeks away. Ask how casinos handle it and how venues handle it today (they write cheques, which patrons struggle to deposit).

## 7. ID verification (FrankieOne) failures

- Failed checks cost money (Frankie charges per attempt; six or seven failures were seen on one payout), and a venue that pays anyway may blame Cruz.
- Most failures are real "fail" results from Frankie (wrong licence number or birth date), not integration faults. The venue sees only "failed", while Frankie shows the reason.
- Direction: show **more reason detail** on failure. For the Collector this needs **Craig's confirmation**. The Authoriser and Approver views already show more.
- Known defects to fix:
  - If the ID check fails, the PEP and sanctions checks are skipped.
  - Changing the email after screening disconnects the result from the payout.
  - A later failure overwrites earlier passes when a patron has several payouts in a short period. Results are stored partly on the customer and partly on the payout, so roles can see conflicting information.
- **Sanctions status:** the screen shows a dash because Frankie returns "nothing" for sanctions but "clear" for PEP. Direction: show a clear result in line with PEP, or add a legend. The list that matters is the Australian consolidated sanctions list (about 2,500 entries, updated now and then). Brian is writing to Frankie to confirm they check it.

## 8. Smaller items

- **Time zone bug:** a Queensland payout showed 12:07 on one screen and 10:07 on another (an hour out). Brian will email the trail.
- **Test payouts in production:** flag test clients and venues so they are excluded from exports, or let users flag a payout as a test. Wait for Craig.
- **New Zealand driver licence:** low priority (already partly in the ID configuration).
- **Stripe:** Brian needs the agreed pricing for the early customers (some pay a monthly fee plus a lower rate than the standard payout price) before sending invoices.
- **Zepto and banks:** waiting on Zepto about pay-to for MCC. One customer said a major bank has opened PayTo for gambling accounts. Nothing from NAB.
- **Gap noted:** Brian offered to join product calls, as his family ran pubs.

## 9. Design guidance from this meeting

When designing the next screens:
1. Treat Member Card / Promo as a **method choice**, with a venue toggle, not as a new account type.
2. Keep Collector screens minimal. Compliance warnings (exclusion, AML, sanctions) go to the **Approver**, not the Collector, unless Craig says otherwise.
3. Show the payout **source code** where a bank reference is built.
4. Anything that depends on state belongs on the **venue**, not the client.
5. Prefer clear result wording over blank values (dash versus a clear "no match").
6. Do not show extra ID failure reasons to the Collector until Craig confirms.

## 10. Open questions and owners (from the meeting)

| Question | Who / next step |
|---|---|
| Is there a legal delay for Member Card payouts? | Ask Lee (head of finance); show him an example with the three-letter code |
| Member Card and Promo on one line or two? | Depends on separate bank references; ask venues |
| How do Collectors handle excluded patrons, and who sees the alert? | Craig, Brian |
| Sample exclusion list and its fields | Brian (via Leon) |
| Show IDV failure reasons to the Collector? | Craig |
| Do Frankie check the Australian consolidated sanctions list? | Brian writing to Frankie |
| Overseas payment approach | Research before the Endeavor meeting |
| Test payout flagging | Wait for Craig |
| Stripe: agreed price for each early customer | Brian |
| Zepto: pay-to for MCC | Waiting on Zepto |
