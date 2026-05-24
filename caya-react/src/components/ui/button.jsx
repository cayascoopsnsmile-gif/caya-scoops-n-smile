import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default: "glass-button border border-white/15 text-primary-foreground hover:-translate-y-0.5 hover:brightness-105",
        secondary: "glass-panel text-secondary-foreground hover:-translate-y-0.5 hover:bg-white/55",
        outline: "glass-panel text-foreground hover:-translate-y-0.5 hover:bg-white/55",
        ghost: "text-muted-foreground hover:bg-white/40 hover:text-foreground"
      },
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-12 px-6 py-3",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
