"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import Toast from "@/components/ui/Toast";
import WarningAlert from "@/components/ui/WarningAlert";
import {
  CHEQUE_LABEL,
  FUNDS_TRANSFER_LABEL,
  PAYMENT_FILE_LABEL,
  formatDailyLimit,
  type Venue,
} from "@/lib/venue-data";
import ChequeModeOptions from "./ChequeModeOptions";
import PaymentMethodRow from "./PaymentMethodRow";

type VenueSettingsFormProps = {
  venue: Venue;
  showClient: boolean;
  onSave: (venue: Venue) => void;
};

export default function VenueSettingsForm({ venue, showClient, onSave }: VenueSettingsFormProps) {
  const [draft, setDraft] = useState<Venue>(venue);
  const [chequeModeError, setChequeModeError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function update(changes: Partial<Venue>) {
    setDraft((d) => ({ ...d, ...changes }));
    setChequeModeError(false);
  }

  function handleSave() {
    // Cheque needs one saved choice for who enters its details
    if (draft.chequeEnabled && draft.chequeMode === "") {
      setChequeModeError(true);
      return;
    }
    onSave(draft);
    setToast(`Settings saved for ${draft.name}.`);
  }

  function handleCancel() {
    setDraft(venue);
    setChequeModeError(false);
  }

  return (
    <div className="mt-4">
      <h1 className="text-[2.1rem] font-semibold leading-[2.6rem] text-title-navy">{venue.name}</h1>
      <p className="mt-1 text-lg text-label">
        {showClient && <>Client: {venue.client} · </>}Daily limit: {formatDailyLimit(venue.dailyLimit)}
      </p>

      <h2 className="mt-[2.2rem] text-xl font-semibold text-ink">How Winners Are Paid</h2>
      <p className="mt-1 text-base text-subtle">
        Choose the ways this venue can pay winners. Changes apply to new payouts only. Payouts already submitted keep
        their payment method and can still be finished.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <section className="rounded-xl bg-surface px-[1.9rem] py-[1.6rem]">
          <h3 className="text-xl font-semibold text-ink">{FUNDS_TRANSFER_LABEL}</h3>
          <p className="mt-1 text-base text-subtle">
            Winners are paid into their bank account automatically. This is always available.
          </p>
        </section>

        <PaymentMethodRow
          id="payment-file-enabled"
          title={PAYMENT_FILE_LABEL}
          description="Your team downloads a file of these payments and uploads it to your bank's online portal to pay winners."
          checked={draft.paymentFileEnabled}
          onChange={(paymentFileEnabled) => update({ paymentFileEnabled })}
        >
          <FormField label="Venue Code" htmlFor="venue-code">
            <TextInput
              id="venue-code"
              value={draft.venueCode}
              onChange={(e) => update({ venueCode: e.target.value })}
              placeholder="e.g. 0042"
              autoComplete="off"
            />
            <p className="text-base text-subtle">
              Shown against each payment in the file so your team knows which venue it belongs to. Leading zeros are
              kept.
            </p>
          </FormField>
        </PaymentMethodRow>

        <PaymentMethodRow
          id="cheque-enabled"
          title={CHEQUE_LABEL}
          description="Winners are paid by cheque. Choose who enters the cheque details."
          checked={draft.chequeEnabled}
          onChange={(chequeEnabled) => update({ chequeEnabled })}
        >
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-label">Who Enters the Cheque Details</p>
            <ChequeModeOptions value={draft.chequeMode} onChange={(chequeMode) => update({ chequeMode })} />
            {chequeModeError && (
              <WarningAlert tone="danger" message="Choose who enters the cheque details before saving." />
            )}
          </div>
        </PaymentMethodRow>
      </div>

      <div className="mt-8 flex gap-6">
        <Button variant="outline" onClick={handleCancel} className="h-[2.875rem] w-[14rem]">
          Cancel
        </Button>
        <Button onClick={handleSave} className="h-[2.875rem] w-[14rem]">
          Save
        </Button>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
