import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/docs", label: "Foundation Setup" },
  { href: "/docs/api", label: "API Swagger" },
  { href: "/login", label: "Auth Platform UI" }
];

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[250px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Auth Platform</p>
          <h1 className="mt-2 text-lg font-semibold">Documentation</h1>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-10 items-center rounded-md px-3 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
