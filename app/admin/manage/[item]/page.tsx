import { notFound } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import UserMenu from "@/components/layout/UserMenu";
import { ADMIN_MANAGE_ITEMS } from "@/lib/admin-data";

// Placeholder for Manage items that have no dedicated page yet (e.g. Users, Machines).
// Built items (like Export Manual Bank Transfers) have their own static route, which takes
// precedence over this one — same pattern as app/collector/[step]/page.tsx.
export default async function ManageItemPlaceholder({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;
  const match = ADMIN_MANAGE_ITEMS.find((i) => i.href === `/admin/manage/${item}`);
  if (!match) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader right={<UserMenu name="Admin-Qa" dashboardHref="/" manageItems={ADMIN_MANAGE_ITEMS} />} />
      <main className="mx-auto mt-10 w-full max-w-[75rem] px-4 pb-16 sm:px-8">
        <h1 className="text-[2.25rem] font-bold leading-[2.875rem] text-brand">{match.label}</h1>
        <p className="mt-6 text-xl text-subtle">This page hasn&apos;t been built yet.</p>
      </main>
    </div>
  );
}
