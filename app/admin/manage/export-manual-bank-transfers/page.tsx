import ExportManualBankTransfersView from "@/components/admin/ExportManualBankTransfersView";
import AppHeader from "@/components/layout/AppHeader";
import UserMenu from "@/components/layout/UserMenu";
import { ADMIN_MANAGE_ITEMS } from "@/lib/admin-data";

export const metadata = { title: "Export Manual Bank Transfers | Cruz Money" };

export default function ExportManualBankTransfersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader
        right={<UserMenu name="Admin-Qa" dashboardHref="/" manageItems={ADMIN_MANAGE_ITEMS} />}
      />
      <main className="mx-auto mt-10 w-full max-w-[90rem] px-4 pb-16 sm:px-8">
        <ExportManualBankTransfersView />
      </main>
    </div>
  );
}
