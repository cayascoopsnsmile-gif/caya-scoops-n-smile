import { cn } from "@/lib/utils.js";

function NavigationMenu({ className, ...props }) {
  return <nav className={cn("w-full", className)} {...props} />;
}

function NavigationMenuList({ className, ...props }) {
  return <div className={cn("flex items-center justify-between gap-2", className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }) {
  return <div className={cn("min-w-0 flex-1 basis-0", className)} {...props} />;
}

function NavigationMenuLink({ className, active = false, ...props }) {
  return (
    <button
      className={cn(
        "relative flex h-14 w-full items-center justify-center gap-2 rounded-3xl border border-white/10 px-4 text-sm font-semibold backdrop-blur-xl transition-all duration-300",
        active
          ? "glass-button text-primary-foreground shadow-[0_18px_38px_rgba(123,44,191,0.24)]"
          : "bg-white/30 text-foreground/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] hover:-translate-y-0.5 hover:bg-white/45 hover:text-foreground",
        className
      )}
      type="button"
      {...props}
    />
  );
}

export { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList };
