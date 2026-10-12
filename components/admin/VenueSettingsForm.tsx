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
  type Venue,
} from "@/lib/venue-data";
import AlwaysAvailableMethodRow from "./AlwaysAvailableMethodRow";
import ChequeModeOptions from "./ChequeModeOptions";
import PaymentMethodRow from "./PaymentMethodRow";

type VenueSettingsFormProps = {
  venue: Venue;
  onSave: (venue: Venue) => void;
};

export default function VenueSettingsForm({ venue, onSave }: VenueSettingsFormProps) {
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

      <h2 className="mt-[2.2rem] text-xl font-semibold text-ink">How Winners Are Paid</h2>

      <div className="mt-4 flex flex-col gap-4">
        <AlwaysAvailableMethodRow
          title={FUNDS_TRANSFER_LABEL}
          description="Paid into the winner's bank account automatically."
        />

        <PaymentMethodRow
          id="payment-file-enabled"
          title={PAYMENT_FILE_LABEL}
          description="Your team uploads a payment file to your bank's online portal."
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
            <p className="text-base text-subtle">Included in the file; leading zeros are kept.</p>
          </FormField>
        </PaymentMethodRow>

        <PaymentMethodRow
          id="cheque-enabled"
          title={CHEQUE_LABEL}
          description="Winners are paid by cheque."
          checked={draft.chequeEnabled}
          onChange={(chequeEnabled) => update({ chequeEnabled })}
        >
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-label">Who can enter cheque details?</p>
            <ChequeModeOptions value={draft.chequeMode} onChange={(chequeMode) => update({ chequeMode })} />
            {chequeModeError && (
              <WarningAlert tone="danger" message="Choose who can enter cheque details before saving." />
            )}
          </div>
        </PaymentMethodRow>
      </div>

      <p className="mt-8 text-base text-subtle">Changes apply to new payouts only. Submitted payouts are not affected.</p>
      <div className="mt-3 flex gap-6">
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
