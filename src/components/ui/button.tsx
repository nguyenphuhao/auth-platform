import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/util/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-accent text-accent-foreground hover:opacity-90",
        secondary: "bg-surface text-text-primary hover:bg-surface-elevated",
        ghost: "border-transparent bg-transparent text-text-muted hover:bg-surface",
        danger: "border-transparent bg-danger text-accent-foreground hover:opacity-95"
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2",
        lg: "px-5 py-3 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
