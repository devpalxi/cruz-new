"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_ID_COUNTRY,
  EMPTY_ID_ADDRESS,
  ID_CAPTURE_KEY,
  type IdAddress,
  type IdCapture,
  type IdCheckResult,
  type IdDocumentType,
  type PrimaryIdScreen,
} from "@/lib/id-document-config";
import IdAddressForm from "./IdAddressForm";
import IdDobForm from "./IdDobForm";
import IdDocumentDetailsForm from "./IdDocumentDetailsForm";
import IdDocumentPicker from "./IdDocumentPicker";
import IdNameForm from "./IdNameForm";
import IdReviewScreen from "./IdReviewScreen";

// The Primary ID Document step: document → details → name → date of birth → address → review
// (with the identity check). Editing from the review page returns straight to it.
export default function PrimaryIdFlow() {
  const router = useRouter();
  const [screen, setScreen] = useState<PrimaryIdScreen>("document");
  const [editing, setEditing] = useState(false);

  const [country, setCountry] = useState(DEFAULT_ID_COUNTRY);
  const [document, setDocument] = useState<IdDocumentType>("driver-licence");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [name, setName] = useState({ firstName: "", middleName: "", lastName: "" });
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState<IdAddress>(EMPTY_ID_ADDRESS);

  // After a sub-screen: back to the review page when editing from it, otherwise the next screen.
  function advance(next: PrimaryIdScreen) {
    if (editing) {
      setEditing(false);
      setScreen("review");
    } else {
      setScreen(next);
    }
  }

  function complete(checkResult: IdCheckResult) {
    const capture: IdCapture = { country, document, details, ...name, dateOfBirth, address, checkResult };
    sessionStorage.setItem(ID_CAPTURE_KEY, JSON.stringify(capture));
    router.push("/collector/secondary-id");
  }

  switch (screen) {
    case "document":
      return (
        <IdDocumentPicker
          country={country}
          onCountryChange={(next) => {
            setCountry(next);
            setDetails({});
          }}
          onSelectDocument={(next) => {
            if (next !== document) setDetails({});
            setDocument(next);
            // Always re-enter the document details (the fields depend on country + document);
            // when editing from the review page, that screen then returns to the review.
            setScreen("details");
          }}
        />
      );
    case "details":
      return (
        <IdDocumentDetailsForm
          country={country}
          document={document}
          details={details}
          onDetailsChange={setDetails}
          onBack={() => (editing ? (setEditing(false), setScreen("review")) : setScreen("document"))}
          onNext={() => advance("name")}
        />
      );
    case "name":
      return (
        <IdNameForm
          {...name}
          onChange={(patch) => setName({ ...name, ...patch })}
          onBack={() => (editing ? (setEditing(false), setScreen("review")) : setScreen("details"))}
          onNext={() => advance("dob")}
        />
      );
    case "dob":
      return (
        <IdDobForm
          dateOfBirth={dateOfBirth}
          onChange={setDateOfBirth}
          onBack={() => (editing ? (setEditing(false), setScreen("review")) : setScreen("name"))}
          onNext={() => advance("address")}
        />
      );
    case "address":
      return (
        <IdAddressForm
          address={address}
          onChange={setAddress}
          onBack={() => (editing ? (setEditing(false), setScreen("review")) : setScreen("dob"))}
          onNext={() => advance("review")}
        />
      );
    case "review":
      return (
        <IdReviewScreen
          country={country}
          document={document}
          details={details}
          fullName={[name.firstName, name.middleName, name.lastName].filter(Boolean).join(" ")}
          dateOfBirth={dateOfBirth}
          address={address}
          onEdit={(next) => {
            setEditing(true);
            setScreen(next);
          }}
          onBack={() => setScreen("address")}
          onComplete={complete}
        />
      );
  }
}
