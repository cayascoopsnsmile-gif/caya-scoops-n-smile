import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { CustomerMenuCard } from "@/components/menu/CustomerMenuCard.jsx";
import { MenuCustomizationDialog } from "@/components/menu/MenuCustomizationDialog.jsx";

function FeaturedRow({ featuredItems, onCustomize }) {
  if (!featuredItems.length) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {featuredItems.map((item) => (
        <CustomerMenuCard key={`featured-${item.id}`} item={item} onCustomize={onCustomize} />
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={`menu-skeleton-${index}`} className="h-96 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function CustomerMenuSection({ cart, menu }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const selectedFlavorOptions = useMemo(() => {
    if (!selectedItem) return [];
    return menu.flavorsByCategory[selectedItem.category] || [];
  }, [menu.flavorsByCategory, selectedItem]);

  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="font-display text-2xl">Menu experience</CardTitle>
          <CardDescription>Browse featured treats, pick a category, then customize the flavor before adding it to cart.</CardDescription>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Featured today</p>
            <FeaturedRow featuredItems={menu.featuredItems} onCustomize={setSelectedItem} />
          </div>
          <div className="space-y-2 lg:min-w-60">
            <p className="text-sm font-medium text-muted-foreground">Filter by category</p>
            <Select onValueChange={menu.setCategory} value={menu.category}>
              <SelectTrigger className="rounded-3xl border-white/20 bg-white/55 backdrop-blur-xl">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {menu.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {menu.loading ? <LoadingGrid /> : null}
        {!menu.loading && !menu.filteredItems.length ? (
          <div className="rounded-3xl border border-white/20 bg-white/50 px-6 py-10 text-center text-muted-foreground backdrop-blur-xl">
            No treats are live in this category right now.
          </div>
        ) : null}
        {!menu.loading && menu.filteredItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menu.filteredItems.map((item) => (
              <CustomerMenuCard key={item.id} item={item} onCustomize={setSelectedItem} />
            ))}
          </div>
        ) : null}
      </CardContent>
      <MenuCustomizationDialog
        flavorOptions={selectedFlavorOptions}
        item={selectedItem}
        onAddToCart={cart.addItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
        open={Boolean(selectedItem)}
      />
    </Card>
  );
}
