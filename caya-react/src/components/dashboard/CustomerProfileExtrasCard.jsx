import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";

function getBirthdayStatus(profile = {}) {
  if (profile.birthdayRewardCode) return `Birthday reward code: ${profile.birthdayRewardCode}`;
  if (profile.dateOfBirth) return "Birthday on file. Reward status will appear here when available.";
  return "Add your date of birth to unlock birthday reward handling.";
}

export function CustomerProfileExtrasCard({ profile, user }) {
  return (
    <Card className="glass-card">
      <CardHeader className="space-y-2">
        <CardTitle className="font-display text-2xl">Account extras</CardTitle>
        <CardDescription>Loyalty, birthday, and contact preference details from your customer profile.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel grid gap-1 rounded-[24px] px-4 py-4">
          <p className="text-sm text-muted-foreground">Customer email</p>
          <p className="font-medium">{user?.email || profile.email || "N/A"}</p>
        </div>
        <div className="glass-panel grid gap-1 rounded-[24px] px-4 py-4">
          <p className="text-sm text-muted-foreground">Loyalty ID</p>
          <p className="font-medium">{profile.loyaltyId || "Not linked yet"}</p>
        </div>
        <div className="glass-panel grid gap-2 rounded-[24px] px-4 py-4">
          <p className="text-sm text-muted-foreground">Birthday reward</p>
          <p className="font-medium">{getBirthdayStatus(profile)}</p>
          {profile.birthdayRewardStatus ? <Badge className="w-fit" variant="secondary">{profile.birthdayRewardStatus}</Badge> : null}
        </div>
        <div className="glass-panel grid gap-2 rounded-[24px] px-4 py-4">
          <p className="text-sm text-muted-foreground">Notification preferences</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{profile.notifyEmail ? "Email on" : "Email off"}</Badge>
            <Badge variant="secondary">{profile.notifyWhatsapp ? "WhatsApp on" : "WhatsApp off"}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
