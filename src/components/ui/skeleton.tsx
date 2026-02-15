import * as React from "react";

import { cn } from "@/lib/util/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-surface-elevated/80", className)} {...props} />;
}

export { Skeleton };
