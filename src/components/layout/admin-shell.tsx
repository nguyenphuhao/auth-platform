import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";

import { AppAccentToggle } from "@/components/app-accent-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/docs/api", label: "API Docs", icon: ShieldCheck }
];

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-bg md:grid md:grid-cols-[270px_1fr]">
      <aside className="border-b border-border bg-surface p-5 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="mb-8 flex items-center justify-between rounded-md border border-border bg-surface-elevated p-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-text-muted">Admin</p>
            <h2 className="text-lg font-semibold">Control Center</h2>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-text-primary transition hover:border-border hover:bg-surface-elevated"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>
        <header className="sticky top-0 z-20 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">Admin UI defaults to dark mode in EPIC-001 baseline.</p>
            <div className="flex items-center gap-2">
              <AppAccentToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
