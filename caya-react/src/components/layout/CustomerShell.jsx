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
        <NavigationMenu className="mx-auto max-w-4xl rounded-[32px] border border-white/20 bg-white/55 p-3 shadow-[0_24px_60px_rgba(84,31,104,0.15)] backdrop-blur-xl">
          <NavigationMenuList className="grid grid-cols-4 gap-3">
            {navItems.map(({ icon: Icon, label, path, value }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink active={activeValue === value} onClick={() => navigate(path)}>
                  <Icon className="h-4 w-4" />
                  {label}
                  {value === "cart" && cartCount > 0 ? (
                    <Badge className="absolute right-3 top-2 min-w-5 justify-center rounded-full bg-white/85 px-1.5 text-[10px] text-foreground shadow-soft" variant="secondary">
                      {cartCount}
                    </Badge>
                  ) : null}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-white/55 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-2 px-4">
          {navItems.map(({ icon: Icon, label, path, value }) => (
            <Button
              key={label}
              className="relative h-16 gap-3 rounded-3xl text-sm font-semibold shadow-[0_12px_30px_rgba(84,31,104,0.08)]"
              onClick={() => navigate(path)}
              type="button"
              variant={activeValue === value ? "secondary" : "ghost"}
            >
              <Icon className="h-4 w-4" />
              {label}
              {value === "cart" && cartCount > 0 ? (
                <Badge className="absolute right-3 top-2 min-w-5 justify-center rounded-full bg-white/85 px-1.5 text-[10px] text-foreground shadow-soft" variant="secondary">
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
