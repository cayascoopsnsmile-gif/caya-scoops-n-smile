import { CustomerConciergePanel } from "@/components/concierge/CustomerConciergePanel.jsx";
import { CustomerOverviewCard } from "@/components/dashboard/CustomerOverviewCard.jsx";
import { CustomerRewardsPanel } from "@/components/dashboard/CustomerRewardsPanel.jsx";
import { CustomerWalletSummaryCard } from "@/components/dashboard/CustomerWalletSummaryCard.jsx";
import { PaymentReturnBanner } from "@/components/orders/PaymentReturnBanner.jsx";

export function CustomerHomePage({
  currencySymbol,
  paymentReturn,
  profile,
  user,
  wallet
}) {
  return (
    <div className="grid gap-6">
      <PaymentReturnBanner banner={paymentReturn.banner} onDismiss={paymentReturn.dismiss} />
      <CustomerOverviewCard profile={profile} user={user} />
      <CustomerRewardsPanel profile={profile} />
      <CustomerWalletSummaryCard currencySymbol={currencySymbol} loading={wallet.loading} wallet={wallet.wallet} />
    </div>
  );
}
