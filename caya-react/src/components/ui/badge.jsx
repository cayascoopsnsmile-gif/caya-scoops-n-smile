import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border border-white/20 bg-white/55 text-secondary-foreground backdrop-blur-xl",
        outline: "border-white/20 bg-white/35 text-foreground backdrop-blur-xl"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
