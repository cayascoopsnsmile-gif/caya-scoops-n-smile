import { CustomerWalletActionsCard } from "@/components/dashboard/CustomerWalletActionsCard.jsx";
import { CustomerRewardsPanel } from "@/components/dashboard/CustomerRewardsPanel.jsx";
import { CustomerWalletPanel } from "@/components/dashboard/CustomerWalletPanel.jsx";

export function CustomerRewardsPage({ currencySymbol, onProfileSaved, profile, settings, user, wallet }) {
  return (
    <div className="grid gap-6">
      <CustomerRewardsPanel profile={profile} />
      <CustomerWalletPanel currencySymbol={currencySymbol} loading={wallet.loading} wallet={wallet.wallet} />
      <CustomerWalletActionsCard
        onProfileSaved={onProfileSaved}
        onWalletRefresh={wallet.refresh}
        profile={profile}
        settings={settings}
        user={user}
        wallet={wallet.wallet}
      />
    </div>
  );
}
