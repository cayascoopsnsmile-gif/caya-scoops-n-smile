import { CustomerConciergePanel } from "@/components/concierge/CustomerConciergePanel.jsx";
import { CustomerProfileForm } from "@/components/dashboard/CustomerProfileForm.jsx";
import { CustomerWalletPanel } from "@/components/dashboard/CustomerWalletPanel.jsx";
import { CustomerOrderHistory } from "@/components/orders/CustomerOrderHistory.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";

export function CustomerProfilePage({
  cart,
  concierge,
  currencySymbol,
  onLogout,
  onProfileSaved,
  onUseAddress,
  orders,
  profile,
  user,
  wallet
}) {
  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-display text-2xl">Profile and support</CardTitle>
            <CardDescription>
              Manage your wallet, promo codes, gift cards, favorites, address book, support lounge, and order history.
            </CardDescription>
          </div>
          <Button className="w-full md:w-auto" onClick={onLogout} variant="outline">
            Sign Out
          </Button>
        </CardHeader>
      </Card>
      <ScrollArea className="grid max-h-[calc(100vh-12rem)] gap-6 pr-1">
        <CustomerProfileForm onProfileSaved={onProfileSaved} profile={profile} user={user} />
        <CustomerWalletPanel currencySymbol={currencySymbol} loading={wallet.loading} wallet={wallet.wallet} />
        <CustomerConciergePanel
          concierge={concierge}
          currencySymbol={currencySymbol}
          onAddFavoriteToCart={(items) => cart.replaceItems(items)}
          onUseAddress={onUseAddress}
        />
        <CustomerOrderHistory
          cart={cart}
          concierge={concierge}
          currencySymbol={currencySymbol}
          loading={orders.loading}
          onRefresh={orders.refresh}
          orders={orders.orders}
          user={user}
        />
      </ScrollArea>
    </div>
  );
}
