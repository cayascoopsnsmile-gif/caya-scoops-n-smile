import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { currency } from "@/lib/customer-experience.js";

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4 shadow-soft">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function CustomerWalletSummaryCard({ currencySymbol, loading, wallet }) {
  if (loading) {
    return (
      <Card className="bg-card/90">
        <CardHeader className="space-y-2">
          <Badge className="w-fit" variant="secondary">
            Wallet summary
          </Badge>
          <CardTitle className="font-display text-2xl">Rewards wallet summary</CardTitle>
          <CardDescription>Loading your available balances and offers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-24 rounded-2xl bg-secondary/60" />
          <div className="h-24 rounded-2xl bg-secondary/60" />
          <div className="h-24 rounded-2xl bg-secondary/60" />
          <div className="h-24 rounded-2xl bg-secondary/60" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90">
      <CardHeader className="space-y-2">
        <Badge className="w-fit" variant="secondary">
          Wallet summary
        </Badge>
        <CardTitle className="font-display text-2xl">Rewards wallet summary</CardTitle>
        <CardDescription>Quick access to your credits, gift cards, promos, and referral rewards.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric label="Store credit" value={currency(wallet.storeCredit, currencySymbol)} />
        <SummaryMetric label="Gift cards" value={wallet.giftCards.length} />
        <SummaryMetric label="Promo codes" value={wallet.promos.length} />
        <SummaryMetric label="Referral rewards" value={wallet.referralRewards.length} />
      </CardContent>
    </Card>
  );
}
