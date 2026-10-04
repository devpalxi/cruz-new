import { useState } from "react";
import FormField from "@/components/ui/FormField";
import SearchCombobox from "@/components/ui/SearchCombobox";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { AU_STATES, MOCK_ADDRESS_SUGGESTIONS, type IdAddress } from "@/lib/id-document-config";
import StepFormLayout from "./StepFormLayout";

type IdAddressFormProps = {
  address: IdAddress;
  onChange: (address: IdAddress) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function IdAddressForm({ address, onChange, onBack, onNext }: IdAddressFormProps) {
  const [suggestion, setSuggestion] = useState("");
  // Address fields appear once an address is picked from search, or already filled when editing.
  const showFields = suggestion !== "" || address.streetName !== "";

  function update(patch: Partial<IdAddress>) {
    onChange({ ...address, ...patch });
  }

  return (
    <StepFormLayout
      title="Your residential address"
      onBack={onBack}
      onNext={onNext}
      nextDisabled={
        address.streetNumber.trim() === "" ||
        address.streetName.trim() === "" ||
        address.suburb.trim() === "" ||
        address.state === "" ||
        address.postCode.trim() === ""
      }
    >
      <FormField label="Search Address" htmlFor="address-search">
        <SearchCombobox
          id="address-search"
          options={MOCK_ADDRESS_SUGGESTIONS}
          value={suggestion}
          placeholder="Unit, Street, Suburb, State, Postcode"
          onChange={(value) => {
            setSuggestion(value);
            const match = MOCK_ADDRESS_SUGGESTIONS.find((s) => s.value === value);
            if (match) onChange(match.address);
          }}
        />
      </FormField>

      {showFields && (
        <>
          <div className="grid grid-cols-2 gap-[1.375rem]">
            <FormField label="Unit Number" htmlFor="address-unit">
              <TextInput
                id="address-unit"
                placeholder="Unit Number"
                value={address.unit}
                onChange={(e) => update({ unit: e.target.value })}
              />
            </FormField>
            <FormField label="Street Number" htmlFor="address-street-number">
              <TextInput
                id="address-street-number"
                placeholder="Street Number"
                value={address.streetNumber}
                onChange={(e) => update({ streetNumber: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Street Name" htmlFor="address-street-name">
            <TextInput
              id="address-street-name"
              placeholder="Street Name"
              value={address.streetName}
              onChange={(e) => update({ streetName: e.target.value })}
            />
          </FormField>
          <FormField label="Suburb" htmlFor="address-suburb">
            <TextInput
              id="address-suburb"
              placeholder="Suburb"
              value={address.suburb}
              onChange={(e) => update({ suburb: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-[1.375rem]">
            <FormField label="State" htmlFor="address-state">
              <SelectInput
                id="address-state"
                placeholder="Select State"
                options={AU_STATES.map((s) => ({ value: s.value, label: s.label }))}
                value={address.state}
                onChange={(e) => update({ state: e.target.value })}
              />
            </FormField>
            <FormField label="Post Code" htmlFor="address-post-code">
              <TextInput
                id="address-post-code"
                placeholder="Post Code"
                value={address.postCode}
                onChange={(e) => update({ postCode: e.target.value })}
              />
            </FormField>
          </div>
        </>
      )}
    </StepFormLayout>
  );
}
