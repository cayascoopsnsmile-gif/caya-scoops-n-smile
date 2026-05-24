import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const LOYALTY_INFORMATION_CARDS = [
  {
    title: "Welcome Points",
    body: "Customers receive 10 points when signing up."
  },
  {
    title: "Earn Points",
    body: "Every qualifying purchase adds points to your loyalty account."
  },
  {
    title: "Redeem Rewards",
    body: "60 points unlocks a Free 1 Scoop Cone. 100 points unlocks a Free 2 Scoop Cone."
  },
  {
    title: "Referral Rewards",
    body: "Refer a friend and when they spend $25 or more, you unlock a FREE 1-scoop ice cream on us."
  },
  {
    title: "Birthday Treat",
    body: "Complete your profile with your date of birth to redeem your birthday reward on your birthday."
  },
  {
    title: "Customer Offers",
    body: "Promos, store credit, gift cards, daily winner rewards, and special announcements appear in your rewards wallet."
  }
];

export function CustomerRewardsPanel() {
  return (
    <Card className="glass-card-strong">
      <CardHeader className="space-y-2">
        <Badge className="w-fit" variant="secondary">
          Loyalty information
        </Badge>
        <CardTitle className="font-display text-2xl">Loyalty Information</CardTitle>
        <CardDescription>
          Welcome points, reward milestones, referral perks, birthday treats, and customer offers exactly as they work in Caya Scoops N Smile.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {LOYALTY_INFORMATION_CARDS.map((card) => (
          <Card className="glass-panel rounded-[24px]" key={card.title}>
            <CardContent className="grid gap-2 p-5">
              <p className="font-semibold">{card.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
