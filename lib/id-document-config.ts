// Single source of truth for the Primary ID step: which countries / ID document types the
// Collector can pick, and which detail fields each document asks for. The country list and the
// document types per country mirror what the UAT Primary ID Document step offers (the set
// FrankieOne can verify). Field lists marked "assumed" are placeholders until the FrankieOne
// field spec is confirmed — change them here and the form updates.

export type IdDocumentType = "driver-licence" | "passport" | "national-id" | "manual-kyc";

export const ID_DOCUMENT_LABELS: Record<IdDocumentType, string> = {
  "driver-licence": "Driver Licence",
  passport: "Passport",
  "national-id": "National ID",
  "manual-kyc": "Manual KYC",
};

export const ID_COUNTRIES = [
  { value: "AUS", label: "Australia" },
  { value: "BRA", label: "Brazil" },
  { value: "CAN", label: "Canada" },
  { value: "CHL", label: "Chile" },
  { value: "CHN", label: "China" },
  { value: "COL", label: "Colombia" },
  { value: "CZE", label: "Czech Republic" },
  { value: "DNK", label: "Denmark" },
  { value: "FIN", label: "Finland" },
  { value: "GHA", label: "Ghana" },
  { value: "HKG", label: "Hong Kong" },
  { value: "IND", label: "India" },
  { value: "IDN", label: "Indonesia" },
  { value: "ITA", label: "Italy" },
  { value: "JPN", label: "Japan" },
  { value: "JOR", label: "Jordan" },
  { value: "KEN", label: "Kenya" },
  { value: "LUX", label: "Luxembourg" },
  { value: "MYS", label: "Malaysia" },
  { value: "MEX", label: "Mexico" },
  { value: "NZL", label: "New Zealand" },
  { value: "NGA", label: "Nigeria" },
  { value: "PHL", label: "Philippines" },
  { value: "POL", label: "Poland" },
  { value: "PRT", label: "Portugal" },
  { value: "ROU", label: "Romania" },
  { value: "RUS", label: "Russia" },
  { value: "ZAF", label: "South Africa" },
  { value: "ESP", label: "Spain" },
  { value: "SWE", label: "Sweden" },
  { value: "THA", label: "Thailand" },
  { value: "TUR", label: "Turkey" },
  { value: "USA", label: "United States" },
];

export const DEFAULT_ID_COUNTRY = "AUS";

// Countries not listed here only support a National ID.
const DOCUMENTS_BY_COUNTRY: Record<string, IdDocumentType[]> = {
  AUS: ["driver-licence", "passport"],
  CHN: ["passport", "national-id"],
  IND: ["driver-licence", "passport", "national-id"],
  KEN: ["driver-licence", "passport", "national-id"],
  NZL: ["driver-licence", "passport"],
  NGA: ["driver-licence", "national-id"],
  PHL: ["passport", "national-id"],
  RUS: ["passport", "national-id"],
};

// Manual KYC is always offered last, whatever the country.
export function getIdDocumentTypes(country: string): IdDocumentType[] {
  return [...(DOCUMENTS_BY_COUNTRY[country] ?? ["national-id"]), "manual-kyc"];
}

export const AU_STATES = [
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NSW", label: "New South Wales" },
  { value: "NT", label: "Northern Territory" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "VIC", label: "Victoria" },
  { value: "WA", label: "Western Australia" },
];

export type IdField = {
  key: string;
  label: string;
  placeholder?: string;
  input: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  // The field shown as "Document Number" on the Summary.
  isDocumentNumber?: boolean;
};

const LICENCE_NUMBER: IdField = {
  key: "licenceNumber",
  label: "Licence Number",
  placeholder: "Licence Number",
  input: "text",
  isDocumentNumber: true,
};

export function getIdDocumentFields(country: string, document: IdDocumentType): IdField[] {
  switch (document) {
    case "driver-licence":
      if (country === "AUS") {
        return [
          { key: "state", label: "State or Territory of Issue", input: "select", options: AU_STATES },
          LICENCE_NUMBER,
          { key: "cardNumber", label: "Card Number", placeholder: "Card Number", input: "text" },
        ];
      }
      if (country === "NZL") {
        // NZ licences carry a licence number and a version, and have no State of issue.
        // Version is assumed from the NZTA licence format — confirm against FrankieOne.
        return [
          LICENCE_NUMBER,
          { key: "licenceVersion", label: "Licence Version", placeholder: "Licence Version", input: "text" },
        ];
      }
      return [LICENCE_NUMBER];
    case "passport":
      return [
        { key: "passportNumber", label: "Passport Number", placeholder: "Passport Number", input: "text", isDocumentNumber: true },
        { key: "expiryDate", label: "Expiry Date", input: "date" },
      ];
    case "national-id":
      return [
        { key: "nationalIdNumber", label: "National ID Number", placeholder: "National ID Number", input: "text", isDocumentNumber: true },
      ];
    case "manual-kyc":
      return [
        { key: "documentViewed", label: "Document Viewed", placeholder: "e.g. Driver Licence", input: "text" },
        { key: "documentNumber", label: "Document Number", placeholder: "Document Number", input: "text", isDocumentNumber: true },
      ];
  }
}

export function getIdDocumentHeading(document: IdDocumentType): string {
  switch (document) {
    case "driver-licence":
      return "Your driver's licence details";
    case "passport":
      return "Your passport details";
    case "national-id":
      return "Your national ID details";
    case "manual-kyc":
      return "Manual verification details";
  }
}

export type IdAddress = {
  unit: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postCode: string;
};

export const EMPTY_ID_ADDRESS: IdAddress = {
  unit: "",
  streetNumber: "",
  streetName: "",
  suburb: "",
  state: "",
  postCode: "",
};

// Mock address-autocomplete results (prototype only — the real site calls an address API).
export const MOCK_ADDRESS_SUGGESTIONS: { value: string; title: string; meta: string; address: IdAddress }[] = [
  {
    value: "conn-street",
    title: "10 Conn Street, Ferntree Gully VIC, Australia",
    meta: "Residential",
    address: { unit: "", streetNumber: "10", streetName: "Conn Street", suburb: "Ferntree Gully", state: "VIC", postCode: "3156" },
  },
  {
    value: "george-street",
    title: "200 George Street, Sydney NSW, Australia",
    meta: "Residential",
    address: { unit: "", streetNumber: "200", streetName: "George Street", suburb: "Sydney", state: "NSW", postCode: "2000" },
  },
  {
    value: "queen-street",
    title: "Unit 4, 85 Queen Street, Brisbane City QLD, Australia",
    meta: "Residential",
    address: { unit: "4", streetNumber: "85", streetName: "Queen Street", suburb: "Brisbane City", state: "QLD", postCode: "4000" },
  },
];

export type IdCheckResult = "passed" | "bypassed" | "manual";

// The sub-screens of the Primary ID step, in order.
export type PrimaryIdScreen = "document" | "details" | "name" | "dob" | "address" | "review";

// What the Primary ID step captures, carried to the Summary through sessionStorage.
export type IdCapture = {
  country: string;
  document: IdDocumentType;
  details: Record<string, string>;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  address: IdAddress;
  checkResult: IdCheckResult;
};

export const ID_CAPTURE_KEY = "cruz.primaryIdCapture";
export const EMAIL_CAPTURE_KEY = "cruz.emailCapture";

export type EmailCapture = { email: string; membershipNumber: string };

export function getCountryLabel(country: string): string {
  return ID_COUNTRIES.find((c) => c.value === country)?.label ?? country;
}

export function formatIdAddress(address: IdAddress): string {
  const street = [address.unit && `Unit ${address.unit}`, address.streetNumber, address.streetName]
    .filter(Boolean)
    .join(" ");
  return `${street}, ${address.suburb} ${address.state} ${address.postCode}`;
}

// Rows for the Summary's "Member Identification" section, in the order the UAT Summary shows them.
export function buildMemberIdentificationRows(
  id: IdCapture,
  email: EmailCapture | null,
): { label: string; value: string }[] {
  const fields = getIdDocumentFields(id.country, id.document);
  const numberField = fields.find((f) => f.isDocumentNumber);
  const fullName = [id.firstName, id.middleName, id.lastName].filter(Boolean).join(" ");
  const street = [id.address.streetNumber, id.address.streetName].filter(Boolean).join(" ");

  return [
    { label: "Membership #", value: email?.membershipNumber || "-" },
    { label: "Email", value: email?.email ?? "-" },
    { label: "Full Name", value: fullName },
    { label: "Document Type", value: ID_DOCUMENT_LABELS[id.document] },
    { label: "Document Number", value: numberField ? (id.details[numberField.key] ?? "") : "" },
    { label: "Street", value: street },
    { label: "Suburb", value: id.address.suburb },
    { label: "State", value: id.address.state },
    { label: "Post Code", value: id.address.postCode },
    { label: "Country of Issue", value: getCountryLabel(id.country) },
  ];
}
