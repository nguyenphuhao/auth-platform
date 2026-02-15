import type { ReactNode } from "react";

import { AppAccentToggle } from "@/components/app-accent-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

interface PublicAuthShellProps {
  children: ReactNode;
}

export function PublicAuthShell({ children }: PublicAuthShellProps) {
  return (
    <div className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 flex w-full max-w-4xl items-center justify-between reveal">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-text-muted">Auth Platform</p>
          <h1 className="text-lg font-semibold">Foundation UI</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto mb-6 flex w-full max-w-4xl justify-end reveal reveal-delay-1">
        <AppAccentToggle />
      </div>
      <div className="reveal reveal-delay-2">{children}</div>
    </div>
  );
}
