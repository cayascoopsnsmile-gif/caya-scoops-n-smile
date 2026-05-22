import { cn } from "@/lib/utils.js";

function Avatar({ className, ...props }) {
  return <div className={cn("relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full", className)} {...props} />;
}

function AvatarImage({ className, alt = "", src, ...props }) {
  if (!src) return null;
  return <img alt={alt} className={cn("h-full w-full object-cover", className)} src={src} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-white/70 text-sm font-semibold text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
