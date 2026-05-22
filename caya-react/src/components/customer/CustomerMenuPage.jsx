import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { CustomerMenuSection } from "@/components/menu/CustomerMenuSection.jsx";
import { CustomerPartyPackagesSection } from "@/components/party/CustomerPartyPackagesSection.jsx";

export function CustomerMenuPage({ cart, menu, partyPackages, settings }) {
  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <Badge className="w-fit" variant="secondary">
            Menu
          </Badge>
          <CardTitle className="font-display text-3xl">Choose your treats</CardTitle>
          <CardDescription>Browse featured desserts, bubble tea, chillers, and party extras in a cleaner app-style menu.</CardDescription>
        </CardHeader>
      </Card>
      <CustomerMenuSection cart={cart} menu={menu} />
      <CustomerPartyPackagesSection cart={cart} partyPackages={partyPackages} settings={settings} />
    </div>
  );
}
