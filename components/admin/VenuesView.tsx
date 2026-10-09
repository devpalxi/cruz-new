"use client";

import { useVenues } from "@/lib/use-venues";
import { ADMIN_CLIENT } from "@/lib/venue-data";
import VenuesTable from "./VenuesTable";

export default function VenuesView({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const { venues } = useVenues();
  // An Admin only sees the venues of their own client
  const visible = isSuperAdmin ? venues : venues.filter((v) => v.client === ADMIN_CLIENT);

  return (
    <div>
      <h1 className="text-[2.1rem] font-semibold leading-[2.6rem] text-title-navy">Venues</h1>
      <p className="mt-1 text-lg text-label">
        {isSuperAdmin
          ? "All venues across clients. Select a venue to change how its winners can be paid."
          : "Select a venue to change how its winners can be paid."}
      </p>
      <div className="mt-[1.9rem]">
        <VenuesTable
          venues={visible}
          showClient={isSuperAdmin}
          roleQuery={isSuperAdmin ? "?role=super-admin" : ""}
        />
      </div>
    </div>
  );
}
