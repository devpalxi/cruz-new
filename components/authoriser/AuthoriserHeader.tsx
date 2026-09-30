import AppHeader from "@/components/layout/AppHeader";
import UserMenu from "@/components/layout/UserMenu";
import Dropdown from "@/components/ui/Dropdown";
import { MOCK_AUTHORISATION } from "@/lib/authoriser-data";

const MANAGE_ITEMS = [{ label: "Manual Bank Export", href: "/authoriser/manual-bank-export" }];

export default function AuthoriserHeader() {
  return (
    <AppHeader
      right={
        <UserMenu
          name={MOCK_AUTHORISATION.user}
          dashboardHref="/"
          extra={<Dropdown label="Manage" items={MANAGE_ITEMS} />}
        />
      }
    />
  );
}
