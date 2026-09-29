import AdminHeader from "@/components/admin/AdminHeader";
import PayoutsDashboard from "@/components/admin/PayoutsDashboard";

export const metadata = { title: "Payouts - Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader />
      <main className="w-full px-[3.75rem] pb-16 pt-[2.8rem]">
        <PayoutsDashboard />
      </main>
    </div>
  );
}
