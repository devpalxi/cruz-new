import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import { MAX_IDV_REUSE_DAYS, type Venue } from "@/lib/venue-data";
import PaymentMethodRow from "./PaymentMethodRow";

type IdentityCheckSettingsProps = {
  venue: Venue;
  onChange: (changes: Partial<Venue>) => void;
  error: boolean;
};

// Venue Settings group for re-using a returning winner's identity check (CRP-186): an On/Off switch,
// and the number of days when it is on
export default function IdentityCheckSettings({ venue, onChange, error }: IdentityCheckSettingsProps) {
  return (
    <>
      <h2 className="mt-[2.2rem] text-xl font-semibold text-ink">Identity Checks</h2>
      <p className="mt-1 text-base text-subtle">
        A returning winner whose identity check passed recently can skip the ID screens. The bank account check still
        runs on every payout.
      </p>

      <div className="mt-4">
        <PaymentMethodRow
          id="idv-reuse-enabled"
          title="Re-use Identity Checks"
          checked={venue.idvReuseEnabled}
          onChange={(idvReuseEnabled) => onChange({ idvReuseEnabled })}
        >
          <FormField label="Re-use Period (days)" htmlFor="idv-reuse-days" required>
            <TextInput
              id="idv-reuse-days"
              type="number"
              inputMode="numeric"
              min="1"
              max={MAX_IDV_REUSE_DAYS}
              value={venue.idvReuseDays}
              onChange={(e) => onChange({ idvReuseDays: e.target.value })}
              placeholder="e.g. 365"
              aria-invalid={error}
              aria-describedby="idv-reuse-days-help"
            />
            <p id="idv-reuse-days-help" className={`text-base ${error ? "text-danger" : "text-subtle"}`}>
              {error
                ? `Enter a whole number of days from 1 to ${MAX_IDV_REUSE_DAYS}.`
                : `How long a passed identity check can be re-used. Up to ${MAX_IDV_REUSE_DAYS} days.`}
            </p>
          </FormField>
        </PaymentMethodRow>
      </div>
    </>
  );
}
