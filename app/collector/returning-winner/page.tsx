import CollectorShell from "@/components/collector/CollectorShell";
import ReturningWinnerView from "@/components/collector/ReturningWinnerView";
import PrototypeSwitcher from "@/components/ui/PrototypeSwitcher";
import { RETURNING_SCENARIOS } from "@/lib/returning-winner";

export const metadata = { title: "Returning Winner | Cruz Money" };

export default async function ReturningWinnerPage({ searchParams }: { searchParams: Promise<{ member?: string }> }) {
  const { member } = await searchParams;

  return (
    // Part of the Primary ID Document step
    <CollectorShell currentStep={3}>
      <PrototypeSwitcher
        label="Membership #"
        basePath="/collector/returning-winner"
        param="member"
        options={RETURNING_SCENARIOS}
        current={member ?? ""}
      />
      <ReturningWinnerView key={member ?? "stored"} membershipOverride={member} />
    </CollectorShell>
  );
}
