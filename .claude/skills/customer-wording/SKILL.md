---
name: customer-wording
description: Choose plain, accurate wording the way a venue owner or finance person would understand it (not an engineer). Use this whenever you write or edit anything a customer could read — screen labels, buttons, help and error text, Linear issue titles and descriptions, release notes, update emails, client-facing docs — and whenever a name, option or status is being introduced or renamed. Trigger even when the user doesn't mention wording, because our internal names often mean something different to customers (e.g. "Manual Bank Transfer", "non-cash destination", "counterparty"). Skip it for code names, internal developer discussion, or when the user explicitly asks for technical wording.
---

# Customer wording

The people reading our product are venue owners, club managers and finance teams. They know money, banking and paying winners very well. They do not know our system, our internal names or engineering vocabulary. A word that is obvious to us can mean something different to them, or nothing at all.

The aim is not simpler language for its own sake. It is that the customer reads a word and picks the same meaning we intended.

## The test: read it as Brien

Brien runs a venue business. Before you settle on any customer-facing word, ask:

1. **Would Brien say this word himself?** If not, find the word he would use.
2. **Does it mean the same thing to him as to us?** If we use "Manual Bank Transfer" for a file the venue downloads and uploads to its bank's online portal, but Brien hears "a transfer someone does by hand", the label is wrong even though it is accurate to us.
3. **Could he explain it to his finance team?** If he'd have to ask us, the wording failed. In the Oct 9 meeting he said "what does that question even mean?" about "non-cash destination".

## Rules

- **Finance words are fine.** BSB, account number, cheque, cash, EFT, funds transfer, ABA reference — customers use these every day. Don't "simplify" them.
- **Engineering and internal words are not.** Replace them, or describe what they do in a short phrase.
- **Name things by what the customer does or gets,** not by how the system handles them. "A file to upload to your bank" beats "CSV export".
- **One name per thing, everywhere.** If a label changes, change it on every screen, doc and issue. Two names for one thing makes customers think there are two things.
- **Spell out acronyms the first time** and prefer the plain phrase after ("account name check", not "CoP").
- **Say what changes for them and when,** in release notes and update emails. Not "deployed counterparty linking", but what they will see or need to do, and the time it is ready (venues start trading around 10:00 am, so say "ready before 10:00 am").
- **Cheque** is the Australian spelling. Use it.
- **If two readings are possible, spend the extra words.** A slightly longer label that can only be read one way is better than a short one that can be read two.

## Term guide (seeded from the Oct 9, 2026 meeting)

The "Say instead" column is a suggestion to check with the team or Brien, not a final decision. If you change a term, tell the user so the guide gets updated.

| Internal / technical term | How the customer reads it | Say instead (suggested) |
|---|---|---|
| Manual Bank Transfer / manual payout | Unclear. In the meeting Brien treated it as the option for banks that can't be paid automatically, and asked why it was crossed out | "Payment file for your bank" — a file the venue downloads and uploads to its bank's online portal (e.g. NAB Connect) to make the payments itself |
| Funds transfer / EFT / PayTo | Funds transfer = the automatic bank payment. PayTo is invisible to them | "Funds transfer (paid automatically)". Avoid "PayTo" in customer text |
| Non-cash destination / payout destination | Confusing ("what does that question even mean?") | Say how the winner is paid: "How the rest is paid" or "Paid by". Current label on Payment Breakdown is "Non Cash Details" — check it reads clearly |
| Counterparty, KYB, KYC | Not understood | "Verified business details" / "identity checks", with one line on why |
| PayTo agreement | Not understood | "Your bank's approval for automatic payments" |
| CoP | Not understood | "Account name check" (checks the name matches the bank account) |
| UAT / production | Engineering terms | "Test version" / "live system" |
| Release, change window, bucket | Engineering terms | "Update" / "scheduled update, finished before 10:00 am" |
| Patron, win payout, venue, finance team | Their own words | Use as they are |

## How to apply it

1. List the customer-facing words in what you are writing: labels, headings, button text, status names, issue titles.
2. Check each against the three questions above. Look hardest at words we invented.
3. Replace or reword. Keep the same word for the same thing across the whole product.
4. In your reply, briefly list any term you were unsure about, so the user can confirm with Brien. Don't guess silently.
5. Add anything new you learn to the term guide.

## Where this sits next to other rules

- `docs/v1-glossary.md` is the team's vocabulary and is right for internal discussion. For customer-facing text, use the plainer wording here, and spell out an acronym if it must appear.
- `docs/ui-rules.md` section 7 (copy and naming) still applies: Title Case labels, one name per concept, formal tone.
- Role names (Collector, Approver, Authoriser) are used in the app today. Don't change them from this skill without asking.
