import WarningAlert from "@/components/ui/WarningAlert";
import { MOCK_APPROVAL } from "@/lib/approver-data";
import { buildBankDescription, emailNoun, type PayoutTypeId } from "@/lib/payout-types";
import { REVIEW_VENUE } from "@/lib/venue-data";
import EmailPreview from "./EmailPreview";
import TypeText from "./TypeText";

// The two emails the patron receives for a payout (CRP-461). The highlighted text changes with the payout
// type, so the emails and the bank statement describe the payout the same way. Wording is a placeholder.
export default function PatronEmailsView({ payoutType }: { payoutType: PayoutTypeId }) {
  const venue = REVIEW_VENUE;
  const payoutId = MOCK_APPROVAL.payoutId;
  const winner = MOCK_APPROVAL.nameVerification.idName;
  const firstName = winner.split(" ")[0];
  const email = MOCK_APPROVAL.member.find((row) => row.label === "Email")?.value ?? "";
  const amount = "$500.00";
  const noun = emailNoun(payoutType, venue);
  const description = buildBankDescription(payoutId, payoutType, winner);
  const from = `${venue.name} (sent by Cruz Money)`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-[2.875rem] text-brand">Patron Emails</h1>
        <p className="mt-3 text-lg text-subtle">
          The emails a patron receives for payout #{payoutId}, paid by bank transfer.
        </p>
      </div>

      <WarningAlert
        title="Prototype only. Placeholder wording."
        message="Highlighted text changes with the payout type. Final wording will follow the descriptions the venue uses today."
      />

      <EmailPreview
        title="1. After the payout is collected"
        from={from}
        to={email}
        subject={`Your payout from ${venue.name} is being processed`}
      >
        <p>Hi {firstName},</p>
        <p>
          We have recorded your <TypeText>{noun}</TypeText> of {amount} at {venue.name} (payout #{payoutId}).
        </p>
        <p>
          Your payout is being checked and approved. We will email you again when the money has been sent to your
          bank account. This usually takes one to two business days.
        </p>
        <p>
          Thank you,
          <br />
          {venue.name}
        </p>
      </EmailPreview>

      <EmailPreview
        title="2. When the money is transferred"
        from={from}
        to={email}
        subject={`Your payout from ${venue.name} has been sent`}
      >
        <p>Hi {firstName},</p>
        <p>
          We have sent {amount} for your <TypeText>{noun}</TypeText> to your bank account (BSB 015-203, account
          ending 5678).
        </p>
        <p>
          It will show on your bank statement as <TypeText>{description}</TypeText>. Depending on your bank, it can
          take up to one business day to appear.
        </p>
        <p>
          Thank you,
          <br />
          {venue.name}
        </p>
      </EmailPreview>
    </div>
  );
}
