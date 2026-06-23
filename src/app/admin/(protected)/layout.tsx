import Link from "next/link";
import { requireAdminPage } from "@/lib/require-admin";
import { LogoutButton } from "@/components/admin/logout-button";

const ADMIN_NAV = [
  { label: "Visão geral", href: "/admin" },
  { label: "Notícias", href: "/admin/articles" },
  { label: "Fontes", href: "/admin/sources" },
  { label: "Logs", href: "/admin/logs" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <nav className="flex gap-6 text-sm font-medium">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent-red">
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
