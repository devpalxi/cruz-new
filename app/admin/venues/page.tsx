import AdminHeader from "@/components/admin/AdminHeader";
import VenuesView from "@/components/admin/VenuesView";

export const metadata = { title: "Payouts - Venues" };

export default async function AdminVenuesPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const isSuperAdmin = role === "super-admin";

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader isSuperAdmin={isSuperAdmin} />
      <main className="w-full px-[3.75rem] pb-16 pt-[2.8rem]">
        <VenuesView isSuperAdmin={isSuperAdmin} />
      </main>
    </div>
  );
}
