import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

// Placeholder for admin pages not built yet (Manage → Users / Machines).
const PAGES: Record<string, string> = { users: "Users", machines: "Machines" };

export default async function AdminPlaceholderPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const title = PAGES[page];
  if (!title) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader />
      <main className="px-[3.75rem] pt-[2.8rem]">
        <h1 className="text-[2.1rem] font-semibold text-title-navy">{title}</h1>
        <p className="mt-4 text-xl text-subtle">This page hasn&apos;t been built yet.</p>
      </main>
    </div>
  );
}
