import { Gift, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { getCustomerTier, getProfileCompletionPercent, getProgressSegments, getRewardMessage, getTierPerks } from "@/lib/customer-experience.js";

function SegmentProgress({ percent }) {
  const segments = getProgressSegments(percent);

  return (
    <div className="grid grid-cols-5 gap-2">
      {segments.map((active, index) => (
        <div key={`${percent}-${index}`} className={active ? "h-2 rounded-2xl bg-primary" : "h-2 rounded-2xl bg-secondary"} />
      ))}
    </div>
  );
}

export function CustomerOverviewCard({ profile, user, onLogout }) {
  const displayName = profile.fullName || user?.email || "Customer";
  const points = Number(profile.points || 10);
  const tier = getCustomerTier(points);
  const profilePercent = getProfileCompletionPercent(profile);

  return (
    <Card className="bg-card/90">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            Signed in
          </Badge>
          <CardTitle className="font-display text-2xl leading-tight md:text-3xl">Welcome back, {displayName}</CardTitle>
          <CardDescription className="text-base leading-relaxed md:text-sm">{getTierPerks(tier)}</CardDescription>
        </div>
        {onLogout ? (
          <Button className="w-full md:w-auto" variant="outline" onClick={onLogout}>
            Sign Out
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card className="bg-secondary/70">
          <CardContent className="flex items-center gap-3 p-4 md:p-5">
            <Gift className="h-5 w-5 text-primary md:h-6 md:w-6" />
            <div className="space-y-1">
              <p className="text-base text-muted-foreground md:text-sm">Reward points</p>
              <p className="text-2xl font-semibold md:text-xl">{points}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{getRewardMessage(points)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/70">
          <CardContent className="flex items-center gap-3 p-4 md:p-5">
            <Star className="h-5 w-5 text-primary md:h-6 md:w-6" />
            <div className="space-y-1">
              <p className="text-base text-muted-foreground md:text-sm">Referral code</p>
              <p className="text-2xl font-semibold md:text-xl">{profile.referralCode || "Pending"}</p>
              <p className="text-sm text-muted-foreground">{tier}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/70">
          <CardContent className="space-y-3 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary md:h-6 md:w-6" />
              <div>
                <p className="text-base text-muted-foreground md:text-sm">Profile progress</p>
                <p className="text-2xl font-semibold md:text-xl">{profilePercent}% complete</p>
              </div>
            </div>
            <SegmentProgress percent={profilePercent} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
