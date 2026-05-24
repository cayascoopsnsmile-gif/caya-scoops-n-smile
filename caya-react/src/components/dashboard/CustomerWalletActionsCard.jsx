import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Gift, Send, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { buildFavoriteTreatWhatsappUrl, buildReferralWhatsappUrl, redeemCustomerGiftCard, requestCustomerGiftCardPurchase } from "@/lib/customer-wallet-actions.js";
import { currency } from "@/lib/customer-experience.js";

function getReferralExpiryText(profile = {}) {
  const code = String(profile.referralCode || "").trim();
  if (!code) return "Ask Caya Scoops N Smile to add a new referral code for 14 days.";
  if (profile.referralCodeExpiresAt) return `Referral code expires: ${profile.referralCodeExpiresAt}`;
  return "";
}

export function CustomerWalletActionsCard({ onProfileSaved, onWalletRefresh, profile, settings, user, wallet }) {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardAmount, setGiftCardAmount] = useState("");
  const [giftCardRecipient, setGiftCardRecipient] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const referralExpiryText = useMemo(() => getReferralExpiryText(profile), [profile]);

  const handleGiftCardRedeem = () => {
    setRedeeming(true);
    redeemCustomerGiftCard({
      code: giftCardCode,
      profile,
      user
    })
      .then((result) => {
        setGiftCardCode("");
        onProfileSaved?.({
          ...profile,
          storeCredit: result.nextStoreCredit
        });
        return Promise.resolve(onWalletRefresh?.()).then(() => result);
      })
      .then((result) => {
        toast.success(`Gift card redeemed: ${currency(result.amount, settings.currencySymbol)}`);
      })
      .catch((error) => toast.error(error?.message || "Gift card could not be redeemed."))
      .finally(() => setRedeeming(false));
  };

  const handleGiftCardRequest = () => {
    setRequesting(true);
    requestCustomerGiftCardPurchase({
      amount: giftCardAmount,
      profile,
      recipientName: giftCardRecipient,
      settings,
      user
    })
      .then((result) => {
        setGiftCardAmount("");
        setGiftCardRecipient("");
        toast.success("Gift card purchase created.");
        if (result.manualPaymentUrl && typeof window !== "undefined") {
          window.location.href = result.manualPaymentUrl;
        }
        return onWalletRefresh?.();
      })
      .catch((error) => toast.error(error?.message || "Gift card purchase could not be created."))
      .finally(() => setRequesting(false));
  };

  const handleReferralShare = () => {
    const url = buildReferralWhatsappUrl({
      expiryText: referralExpiryText,
      referralCode: profile.referralCode
    });
    if (!url) {
      toast.error("No active referral code is available.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFavoriteShare = () => {
    window.open(buildFavoriteTreatWhatsappUrl(profile.favoriteFlavors), "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="glass-card-strong">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="font-display text-2xl">Gift cards and referral share</CardTitle>
            <CardDescription>Redeem gift cards, request a new one, and share your active referral perks.</CardDescription>
          </div>
          <Badge variant="secondary">Wallet tools</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass-panel grid gap-4 rounded-[24px] px-5 py-5">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-primary" />
              <p className="font-semibold">Redeem a gift card</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-gift-card-code">Gift card code</Label>
              <Input id="customer-gift-card-code" onChange={(event) => setGiftCardCode(event.target.value)} placeholder="Gift card code" value={giftCardCode} />
            </div>
            <Button disabled={redeeming} onClick={handleGiftCardRedeem} type="button">
              {redeeming ? "Redeeming..." : "Redeem gift card"}
            </Button>
          </div>

          <div className="glass-panel grid gap-4 rounded-[24px] px-5 py-5">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-primary" />
              <p className="font-semibold">Request a gift card purchase</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-gift-card-amount">Gift card amount</Label>
              <Input id="customer-gift-card-amount" onChange={(event) => setGiftCardAmount(event.target.value)} placeholder="Gift card amount" type="number" value={giftCardAmount} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-gift-card-recipient">Recipient name</Label>
              <Input id="customer-gift-card-recipient" onChange={(event) => setGiftCardRecipient(event.target.value)} placeholder="Recipient name" value={giftCardRecipient} />
            </div>
            <Button disabled={requesting} onClick={handleGiftCardRequest} type="button">
              {requesting ? "Preparing..." : "Request gift card"}
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass-panel grid gap-3 rounded-[24px] px-5 py-5">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-primary" />
              <p className="font-semibold">Referral and share</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.referralCode ? `Referral code: ${profile.referralCode}` : "No active referral code right now."}
            </p>
            <p className="text-sm text-muted-foreground">{referralExpiryText}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleReferralShare} type="button" variant="secondary">
                <Share2 className="mr-2 h-4 w-4" />
                Share referral
              </Button>
              <Button onClick={handleFavoriteShare} type="button" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Share favorite treat
              </Button>
            </div>
          </div>

          <div className="glass-panel grid gap-2 rounded-[24px] px-5 py-5">
            <p className="font-semibold">Current wallet balance</p>
            <p className="text-3xl font-semibold">{currency(profile.storeCredit || wallet.storeCredit || 0, settings.currencySymbol)}</p>
            <p className="text-sm text-muted-foreground">Store credit updates after gift card redemption and approved adjustments.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
