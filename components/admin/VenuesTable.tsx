"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDailyLimit, paymentMethods, type Venue } from "@/lib/venue-data";

type VenuesTableProps = {
  venues: Venue[];
  showClient: boolean;
  roleQuery: string;
};

export default function VenuesTable({ venues, showClient, roleQuery }: VenuesTableProps) {
  const router = useRouter();
  const headers = ["Venue Name", "Payment Method", "Daily Limit", ...(showClient ? ["Client"] : []), ""];

  return (
    <div className="overflow-x-auto rounded-xl bg-surface">
      <table className="w-full min-w-[56rem] text-left">
        <thead className="bg-table-head">
          <tr>
            {headers.map((h) => (
              <th
                key={h || "edit"}
                className="h-[4.4rem] px-[1.5rem] text-[0.95rem] font-normal uppercase tracking-wide text-subtle first:pl-[1.9rem]"
              >
                {h || <span className="sr-only">Edit</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {venues.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-lg text-subtle">
                No venues found.
              </td>
            </tr>
          )}
          {venues.map((venue) => {
            const href = `/admin/venues/${venue.id}${roleQuery}`;
            return (
              <tr
                key={venue.id}
                onClick={() => router.push(href)}
                className="group h-[5rem] cursor-pointer border-t border-line-soft text-lg text-ink hover:bg-field"
              >
                <td className="pl-[1.9rem] pr-[1.5rem] font-medium">
                  <Link href={href} onClick={(e) => e.stopPropagation()} className="hover:text-brand">
                    {venue.name}
                  </Link>
                </td>
                <td className="px-[1.5rem]">{paymentMethods(venue).join(", ")}</td>
                <td className="px-[1.5rem]">{formatDailyLimit(venue.dailyLimit)}</td>
                {showClient && <td className="px-[1.5rem]">{venue.client}</td>}
                <td className="px-[1.5rem] text-right">
                  <Link
                    href={href}
                    aria-label={`Edit ${venue.name}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex rounded-md p-2 text-subtle opacity-0 hover:text-brand focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Pencil size="1.25rem" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
