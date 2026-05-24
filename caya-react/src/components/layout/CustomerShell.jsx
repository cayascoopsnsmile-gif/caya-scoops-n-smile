import { Home, IceCreamCone, ShoppingBag, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu.jsx";
import { CUSTOMER_ROUTE_PATHS, getCustomerBottomNavValue } from "@/lib/customer-routes.js";

const navItems = [
  { label: "Home", icon: Home, value: "home", path: CUSTOMER_ROUTE_PATHS.home },
  { label: "Menu", icon: IceCreamCone, value: "menu", path: CUSTOMER_ROUTE_PATHS.menu },
  { label: "Cart", icon: ShoppingBag, value: "cart", path: CUSTOMER_ROUTE_PATHS.cart },
  { label: "Profile", icon: UserRound, value: "profile", path: CUSTOMER_ROUTE_PATHS.profile }
];

function CustomerRouteNav({ activeValue, cartCount, navigate }) {
  return (
    <>
      <div className="sticky top-4 z-30 hidden md:block">
        <NavigationMenu className="glass-nav mx-auto w-full max-w-5xl rounded-[32px] p-2.5">
          <NavigationMenuList className="flex items-center justify-between gap-2">
            {navItems.map(({ icon: Icon, label, path, value }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink active={activeValue === value} className="mx-auto" onClick={() => navigate(path)}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                  {value === "cart" && cartCount > 0 ? (
                    <Badge className="absolute right-2.5 top-2 min-w-5 justify-center rounded-full bg-white/85 px-1.5 text-[10px] text-foreground shadow-soft" variant="secondary">
                      {cartCount}
                    </Badge>
                  ) : null}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <nav className="glass-nav fixed inset-x-3 bottom-3 z-40 rounded-[32px] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-3">
          {navItems.map(({ icon: Icon, label, path, value }) => (
            <Button
              key={label}
              className="relative h-14 min-w-0 flex-1 basis-0 gap-2 rounded-3xl px-2 text-sm font-semibold shadow-[0_12px_30px_rgba(84,31,104,0.08)]"
              onClick={() => navigate(path)}
              type="button"
              variant={activeValue === value ? "secondary" : "ghost"}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
              {value === "cart" && cartCount > 0 ? (
                <Badge className="absolute right-2.5 top-1.5 min-w-5 justify-center rounded-full bg-white/85 px-1.5 text-[10px] text-foreground shadow-soft" variant="secondary">
                  {cartCount}
                </Badge>
              ) : null}
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
}

export function CustomerShell({ cartCount = 0, children, showMobileNav = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeValue = getCustomerBottomNavValue(location.pathname);

  return (
    <div className="relative min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 pb-40 pt-6 md:px-6 md:pb-10">
        {showMobileNav ? <CustomerRouteNav activeValue={activeValue} cartCount={cartCount} navigate={navigate} /> : null}
        {children}
      </main>
    </div>
  );
}
