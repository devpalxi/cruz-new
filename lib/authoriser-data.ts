// Mock payout awaiting final authorisation (prototype only)
// Same underlying payout the approver already reviewed (see lib/approver-data.ts),
// now carrying the approver's decision through to the authoriser's dual sign-off.
export const MOCK_AUTHORISATION = {
  payoutId: 764,
  createdAt: "24/09/2026, 3:23:31 am",
  status: "Awaiting Approval",
  user: "R.Nguyen",
  payout: [
    { label: "Cash Amount", value: "0" },
    { label: "Transfer Amount", value: "80" },
    { label: "Internal Transaction ID", value: "98765432187" },
    { label: "Machine ID", value: "EGM-001" },
  ],
  member: [
    { label: "Membership #", value: "1234567" },
    { label: "Email", value: "vkwins@gmail.com" },
    { label: "Full Name", value: "Vivek Mishra" },
    { label: "Document Type", value: "No ID document" },
  ],
  identityConfirmation: [
    "Identity Documents Provided To Staff Member: No",
    "Identity manually verified: No",
  ],
  bank: [
    { label: "Account Name", value: "Vivek Mishra" },
    { label: "BSB Number", value: "015203" },
    { label: "Account Number", value: "02345678" },
  ],
  nameVerification: { idName: "Vivek Mishra", bankName: "Vivek Mishra", match: true },
  aml: { title: "AML Screening", check: "PEP - Clear", result: "CLEAR" },
  idvHistory: [
    { country: "Australia Manual KYC (No ID)", dateTime: "24 Sept 2026, 7:59 am", result: "-" },
  ],
  collector: { email: "Vivek@Cruz.Money", at: "24/09/2026 03:30am" },
  approvals: { copStatus: "Match", idNameMatch: "Yes" },
  approverDecision: {
    approvedBy: "D.Walsh",
    at: "24/09/2026 03:45am",
    riskLevel: "Low",
    note: "Phone-confirmed with patron, ID on file matches system record.",
  },
};
