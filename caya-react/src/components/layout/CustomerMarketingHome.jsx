import { Gift, PartyPopper, Sparkles } from "lucide-react";
import { CustomerLandingHero } from "@/components/layout/CustomerLandingHero.jsx";
import { CustomerMarketingFooter } from "@/components/layout/CustomerMarketingFooter.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useBusinessSettings } from "@/hooks/useBusinessSettings.js";

function RewardsPreview() {
  return (
    <section className="space-y-6 rounded-3xl border border-border/70 bg-card/60 p-6 shadow-card md:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge className="w-fit rounded-full" variant="secondary">
            Rewards
          </Badge>
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Join Caya Rewards.</h2>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Create your customer account, earn welcome points, share your referral code, and unlock sweet rewards with every visit.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-border/70 bg-card/92 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gift className="h-5 w-5 text-primary" />
                10 Welcome Points
              </CardTitle>
              <CardDescription>Every customer starts with 10 loyalty points after signing up.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/92 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PartyPopper className="h-5 w-5 text-primary" />
                Referral Code
              </CardTitle>
              <CardDescription>
                Refer a friend and when they spend $25 or more, you unlock a FREE 1-scoop ice cream on us.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/92 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Sweet Rewards
              </CardTitle>
              <CardDescription>
                Earn points toward free scoops, birthday treats, promos, and special customer offers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function CustomerMarketingHome({ onOpenAuth, onTrackOrder }) {
  useBusinessSettings();

  const openOrderNow = () => onOpenAuth("signup", { redirectTo: "/menu" });
  const openSignIn = () => onOpenAuth("login", { redirectTo: "/home" });

  return (
    <div className="grid gap-10">
      <CustomerLandingHero onOpenAuth={openSignIn} onOrderNow={openOrderNow} onTrackOrder={onTrackOrder} />
      <Separator className="bg-border/70" />
      <RewardsPreview />
      <Separator className="bg-border/70" />
      <CustomerMarketingFooter onOpenAuth={onOpenAuth} onTrackOrder={onTrackOrder} />
    </div>
  );
}
