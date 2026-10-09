"use client";

import BackLink from "@/components/layout/BackLink";
import { useVenues } from "@/lib/use-venues";
import { ADMIN_CLIENT } from "@/lib/venue-data";
import VenueSettingsForm from "./VenueSettingsForm";

type VenueSettingsViewProps = {
  venueId: string;
  isSuperAdmin: boolean;
};

export default function VenueSettingsView({ venueId, isSuperAdmin }: VenueSettingsViewProps) {
  const { venues, saveVenue, ready } = useVenues();
  const venue = venues.find((v) => v.id === venueId);
  const backHref = isSuperAdmin ? "/admin/venues?role=super-admin" : "/admin/venues";

  // An Admin cannot open another client's venue
  const allowed = venue && (isSuperAdmin || venue.client === ADMIN_CLIENT);

  return (
    <div>
      <BackLink href={backHref}>Venues</BackLink>
      {!ready ? null : allowed ? (
        <VenueSettingsForm
          key={venue.id}
          venue={venue}
          showClient={isSuperAdmin}
          onSave={saveVenue}
        />
      ) : (
        <p className="mt-8 text-xl text-subtle">
          {venue ? "You do not have access to this venue." : "This venue could not be found."}
        </p>
      )}
    </div>
  );
}
