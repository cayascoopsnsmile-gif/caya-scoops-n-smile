import { IceCreamBowl, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { currency, getProductImageUrl } from "@/lib/customer-experience.js";

export function CustomerMenuCard({ item, onCustomize }) {
  const imageUrl = getProductImageUrl(item);

  return (
    <Card className="overflow-hidden rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(84,31,104,0.18)]">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.category || "Treats"}</p>
          </div>
          {item.badgeText ? <Badge variant="secondary">{item.badgeText}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {imageUrl ? (
          <img alt={item.name} className="h-52 w-full rounded-3xl object-cover shadow-[0_16px_32px_rgba(84,31,104,0.12)]" src={imageUrl} />
        ) : (
          <div className="flex h-52 items-center justify-center rounded-3xl bg-white/45 backdrop-blur-xl">
            <IceCreamBowl className="h-10 w-10 text-primary" />
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold">{currency(item.price)}</p>
            <p className="text-sm text-muted-foreground">Flavor choice available where saved.</p>
          </div>
          {item.isFeatured ? <Sparkles className="h-5 w-5 text-primary" /> : null}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_16px_34px_rgba(123,44,191,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(123,44,191,0.26)]" onClick={() => onCustomize(item)} type="button">
          Customize
        </Button>
      </CardFooter>
    </Card>
  );
}
