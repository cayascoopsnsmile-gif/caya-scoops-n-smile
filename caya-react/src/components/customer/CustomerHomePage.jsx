import { CustomerConciergePanel } from "@/components/concierge/CustomerConciergePanel.jsx";
import { CustomerMenuSection } from "@/components/menu/CustomerMenuSection.jsx";
import { CustomerOverviewCard } from "@/components/dashboard/CustomerOverviewCard.jsx";
import { CustomerRewardsPanel } from "@/components/dashboard/CustomerRewardsPanel.jsx";
import { CustomerWalletPanel } from "@/components/dashboard/CustomerWalletPanel.jsx";
import { CustomerOrderHistory } from "@/components/orders/CustomerOrderHistory.jsx";
import { PaymentReturnBanner } from "@/components/orders/PaymentReturnBanner.jsx";
import { CustomerPartyPackagesSection } from "@/components/party/CustomerPartyPackagesSection.jsx";

export function CustomerHomePage({
  cart,
  concierge,
  currencySymbol,
  menu,
  onLogout,
  onUseAddress,
  orders,
  partyPackages,
  paymentReturn,
  profile,
  settings,
  user,
  wallet
}) {
  return (
    <div className="grid gap-6">
      <PaymentReturnBanner banner={paymentReturn.banner} onDismiss={paymentReturn.dismiss} />
      <CustomerOverviewCard onLogout={onLogout} profile={profile} user={user} />
      <CustomerRewardsPanel profile={profile} />
      <CustomerWalletPanel currencySymbol={currencySymbol} loading={wallet.loading} wallet={wallet.wallet} />
      <CustomerMenuSection cart={cart} menu={menu} />
      <CustomerConciergePanel
        concierge={concierge}
        currencySymbol={currencySymbol}
        onAddFavoriteToCart={(items) => cart.replaceItems(items)}
        onUseAddress={onUseAddress}
      />
      <CustomerPartyPackagesSection cart={cart} partyPackages={partyPackages} settings={settings} />
      <CustomerOrderHistory
        cart={cart}
        concierge={concierge}
        currencySymbol={currencySymbol}
        loading={orders.loading}
        onRefresh={orders.refresh}
        orders={orders.orders}
        user={user}
      />
    </div>
  );
}
