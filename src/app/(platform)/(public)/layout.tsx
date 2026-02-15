import type { ReactNode } from "react";

import { PublicAuthShell } from "@/components/layout/public-auth-shell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="platform-ui--public">
      <PublicAuthShell>{children}</PublicAuthShell>
    </div>
  );
}
