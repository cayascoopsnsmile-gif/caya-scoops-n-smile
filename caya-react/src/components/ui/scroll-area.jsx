import { cn } from "@/lib/utils.js";

function ScrollArea({ className, children, ...props }) {
  return (
    <div className={cn("relative overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

export { ScrollArea };
