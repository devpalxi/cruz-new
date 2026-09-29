import AppHeader from "@/components/layout/AppHeader";
import UserMenu from "@/components/layout/UserMenu";
import Dropdown from "@/components/ui/Dropdown";
import { ADMIN_USER } from "@/lib/admin-data";

const MANAGE_ITEMS = [
  { label: "Users", href: "/admin/users" },
  { label: "Machines", href: "/admin/machines" },
];

export default function AdminHeader() {
  return (
    <AppHeader
      right={
        <UserMenu
          name={ADMIN_USER}
          dashboardHref="/admin/dashboard"
          extra={<Dropdown label="Manage" items={MANAGE_ITEMS} />}
        />
      }
    />
  );
}
