import { notFound } from "next/navigation";

import { SwaggerUiPanel } from "@/components/docs/swagger-ui-panel";
import { evaluateDocsPageAccess } from "@/lib/security/api-docs-guard";

export default async function ApiDocsPage() {
  const access = await evaluateDocsPageAccess();

  if (access.status === 404) {
    notFound();
  }

  if (!access.allowed) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold">API docs access denied</h1>
        <p className="mt-2 text-sm text-slate-600">{access.reason}</p>
        <p className="mt-3 text-sm text-slate-600">
          {access.status === 401
            ? "Authenticate first, then use role hint `x-dev-role: admin` (or cookie `dev_role=admin`) in this skeleton stage."
            : "Set role hint `x-dev-role: admin` (or cookie `dev_role=admin`) to view docs in this skeleton stage."}
        </p>
      </div>
    );
  }

  return <SwaggerUiPanel />;
}
