import FormField from "@/components/ui/FormField";
import TextInput from "@/components/ui/TextInput";
import { getPayoutType } from "@/lib/payout-types";
import type { Venue } from "@/lib/venue-data";
import AlwaysAvailableMethodRow from "./AlwaysAvailableMethodRow";
import PaymentMethodRow from "./PaymentMethodRow";

type PayoutTypeSettingsProps = {
  venue: Venue;
  onChange: (changes: Partial<Venue>) => void;
};

// Venue Settings group for the payout types the Collector can pick (CRP-461). EGM is always on;
// the other types each have a switch. Member Card can be shown under the venue's own name.
export default function PayoutTypeSettings({ venue, onChange }: PayoutTypeSettingsProps) {
  const egm = getPayoutType("egm");
  const memberCard = getPayoutType("member-card");
  const gamingPromotion = getPayoutType("gaming-promotion");
  const clubPromotion = getPayoutType("club-promotion");

  return (
    <>
      <h2 className="mt-[2.2rem] text-xl font-semibold text-ink">Payout Types</h2>
      <p className="mt-1 text-base text-subtle">
        Choose what Collectors can record a payout as. The payout type shows on the bank statement, so payments can be
        coded in your accounts.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <AlwaysAvailableMethodRow id="payout-type-egm" title={egm.label} />

        <PaymentMethodRow
          id="member-card-enabled"
          title={memberCard.label}
          checked={venue.memberCardEnabled}
          onChange={(memberCardEnabled) => onChange({ memberCardEnabled })}
        >
          <FormField label="Display Name (optional)" htmlFor="member-card-name">
            <TextInput
              id="member-card-name"
              value={venue.memberCardName}
              onChange={(e) => onChange({ memberCardName: e.target.value })}
              placeholder={memberCard.label}
              maxLength={30}
              autoComplete="off"
            />
            <p className="text-base text-subtle">
              The name Collectors and reviewers see, for example MyCash. Leave blank to show {memberCard.label}.
            </p>
          </FormField>
        </PaymentMethodRow>

        <PaymentMethodRow
          id="gaming-promotion-enabled"
          title={gamingPromotion.label}
          checked={venue.gamingPromotionEnabled}
          onChange={(gamingPromotionEnabled) => onChange({ gamingPromotionEnabled })}
        />

        <PaymentMethodRow
          id="club-promotion-enabled"
          title={clubPromotion.label}
          checked={venue.clubPromotionEnabled}
          onChange={(clubPromotionEnabled) => onChange({ clubPromotionEnabled })}
        />
      </div>
    </>
  );
}
