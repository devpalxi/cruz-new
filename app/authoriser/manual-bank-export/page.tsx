import AuthoriserHeader from "@/components/authoriser/AuthoriserHeader";
import ManualExportView from "@/components/authoriser/ManualExportView";

export const metadata = { title: "Manual Bank Transfer Export | Cruz Money" };

export default function ManualBankExportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthoriserHeader />
      <main className="w-full px-[3.75rem] pb-16 pt-[2.8rem]">
        <ManualExportView />
      </main>
    </div>
  );
}
