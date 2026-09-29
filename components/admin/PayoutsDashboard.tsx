"use client";

import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { ADMIN_PAYOUTS, TOTAL_RESULTS } from "@/lib/admin-data";
import PayoutFilters from "./PayoutFilters";
import PayoutsTable from "./PayoutsTable";

export default function PayoutsDashboard() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState({ status: "", search: "" });

  const query = applied.search.trim().toLowerCase();
  const rows = ADMIN_PAYOUTS.filter(
    (r) =>
      (applied.status === "" || r.status === applied.status) &&
      (query === "" || `${r.id} ${r.venue}`.toLowerCase().includes(query)),
  );
  const filtered = applied.status !== "" || query !== "";

  return (
    <div>
      <h1 className="text-[2.1rem] font-semibold leading-[2.6rem] text-title-navy">Payouts Dashboard</h1>
      <p className="mt-1 text-lg text-label">Manage and monitor all payout transactions.</p>

      <div className="mt-[1.9rem]">
        <PayoutFilters
          status={status}
          onStatusChange={setStatus}
          search={search}
          onSearchChange={setSearch}
          onApply={() => setApplied({ status, search })}
          onClear={() => {
            setStatus("");
            setSearch("");
            setApplied({ status: "", search: "" });
          }}
        />
      </div>

      <div className="mt-[1.3rem] flex items-center justify-end gap-3">
        <span className="mr-2 text-lg text-subtle">
          Showing {filtered ? rows.length : TOTAL_RESULTS} results
        </span>
        {/* Visual only for now */}
        <Button variant="ghost" className="h-[2.9rem] gap-2 border-line! px-5 text-lg! font-medium!">
          <Download size="1.2rem" strokeWidth={2} /> Export CSV
        </Button>
        <Button variant="ghost" className="h-[2.9rem] gap-2 border-line! px-5 text-lg! font-medium!">
          <RefreshCw size="1.1rem" strokeWidth={2} /> Refresh
        </Button>
      </div>

      <div className="mt-[1.3rem]">
        <PayoutsTable rows={rows} />
      </div>

      <div className="mt-[2rem]">
        <Pagination pages={5} current={1} />
      </div>
    </div>
  );
}
