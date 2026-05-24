import { CustomerAnnouncementsCard } from "@/components/dashboard/CustomerAnnouncementsCard.jsx";
import { CustomerNotificationsCard } from "@/components/dashboard/CustomerNotificationsCard.jsx";
import { CustomerOverviewCard } from "@/components/dashboard/CustomerOverviewCard.jsx";
import { CustomerRewardsPanel } from "@/components/dashboard/CustomerRewardsPanel.jsx";
import { CustomerWalletSummaryCard } from "@/components/dashboard/CustomerWalletSummaryCard.jsx";
import { PaymentReturnBanner } from "@/components/orders/PaymentReturnBanner.jsx";

export function CustomerHomePage({
  announcements,
  notifications,
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
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CustomerAnnouncementsCard announcements={announcements.announcements} loading={announcements.loading} />
        <CustomerNotificationsCard notifications={notifications} />
      </div>
      <CustomerWalletSummaryCard currencySymbol={currencySymbol} loading={wallet.loading} wallet={wallet.wallet} />
      <CustomerRewardsPanel profile={profile} />
    </div>
  );
}
