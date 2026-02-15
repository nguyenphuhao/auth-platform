import { cn } from "@/lib/util/cn";

interface ToastProps {
  title: string;
  description?: string;
  tone?: "success" | "warning" | "danger";
}

export function Toast({ title, description, tone = "success" }: ToastProps) {
  const toneClass = {
    success: "border-success/40",
    warning: "border-warning/40",
    danger: "border-danger/40"
  }[tone];

  return (
    <div className={cn("rounded-md border bg-surface-elevated p-3 shadow-sm", toneClass)} role="status" aria-live="polite">
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs text-text-muted">{description}</p> : null}
    </div>
  );
}
