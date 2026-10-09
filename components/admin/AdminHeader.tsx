import AppHeader from "@/components/layout/AppHeader";
import UserMenu from "@/components/layout/UserMenu";
import Dropdown from "@/components/ui/Dropdown";
import { ADMIN_USER } from "@/lib/admin-data";

const MANAGE_ITEMS = [
  { label: "Users", href: "/admin/users" },
  { label: "Machines", href: "/admin/machines" },
  { label: "Venues", href: "/admin/venues" },
];

// Prototype only: the Super Admin sees the same menu, with Venues listing every client
const SUPER_ADMIN_MANAGE_ITEMS = MANAGE_ITEMS.map((item) =>
  item.label === "Venues" ? { ...item, href: "/admin/venues?role=super-admin" } : item,
);

export default function AdminHeader({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  return (
    <AppHeader
      right={
        <UserMenu
          name={isSuperAdmin ? "Super.Admin" : ADMIN_USER}
          dashboardHref="/admin/dashboard"
          extra={<Dropdown label="Manage" items={isSuperAdmin ? SUPER_ADMIN_MANAGE_ITEMS : MANAGE_ITEMS} />}
        />
      }
    />
  );
}
