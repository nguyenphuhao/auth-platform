import Link from "next/link";

export default function DocsPage() {
  return (
    <article className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">EPIC-001</p>
        <h1 className="text-3xl font-semibold tracking-tight">Foundation Setup</h1>
        <p className="text-slate-600">
          Trang docs tạm thời không dùng Fumadocs. Mục tiêu là giữ trải nghiệm đọc rõ ràng trong khi tập trung hoàn thiện auth platform.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Route Map</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          <li>
            Public login: <code>/login</code>
          </li>
          <li>
            Admin dashboard: <code>/admin</code>
          </li>
          <li>
            Admin users: <code>/admin/users</code>
          </li>
          <li>
            Swagger docs: <code>/docs/api</code>
          </li>
          <li>
            OpenAPI JSON: <code>/api/openapi</code>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">API Contract Skeleton</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          <li>
            <code>POST /api/auth/otp/request</code>
          </li>
          <li>
            <code>POST /api/auth/otp/verify</code>
          </li>
          <li>
            <code>GET /api/admin/users</code>
          </li>
          <li>
            <code>POST /api/admin/users/{'{id}'}/disable</code>
          </li>
          <li>
            <code>DELETE /api/admin/users/{'{id}'}/delete</code>
          </li>
          <li>
            <code>GET /api/admin/users/{'{id}'}/login-events</code>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Docs Guard</h2>
        <p className="text-slate-700">
          Docs access vẫn được kiểm soát bởi <code>API_DOCS_ENABLED</code>, <code>API_DOCS_REQUIRE_ADMIN</code>, <code>API_DOCS_ALLOW_IN_PROD</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/api"
            className="inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            Open Swagger
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            Open Auth UI
          </Link>
        </div>
      </section>
    </article>
  );
}
