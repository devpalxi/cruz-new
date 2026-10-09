import AdminHeader from "@/components/admin/AdminHeader";
import VenueSettingsView from "@/components/admin/VenueSettingsView";

export const metadata = { title: "Payouts - Venue Settings" };

export default async function AdminVenueSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { id } = await params;
  const { role } = await searchParams;
  const isSuperAdmin = role === "super-admin";

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader isSuperAdmin={isSuperAdmin} />
      <main className="w-full px-[3.75rem] pb-16 pt-[2.8rem]">
        <VenueSettingsView venueId={id} isSuperAdmin={isSuperAdmin} />
      </main>
    </div>
  );
}
