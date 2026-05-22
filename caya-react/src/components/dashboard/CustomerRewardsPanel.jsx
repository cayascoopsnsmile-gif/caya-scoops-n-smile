import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";

const PROGRESS_SEGMENTS = 12;

const REWARD_STEPS = [
  { label: "Free 1 Scoop Cone", points: 60 },
  { label: "Free 2 Scoop Cone", points: 100 },
  { label: "Golden Scoop VIP", points: 300 }
];

function getNextReward(points) {
  return REWARD_STEPS.find((step) => points < step.points) || REWARD_STEPS[REWARD_STEPS.length - 1];
}

function buildProgressValue(points, nextReward) {
  if (!nextReward) return 100;
  const previousStep = REWARD_STEPS.filter((step) => step.points < nextReward.points).pop();
  const previousPoints = previousStep?.points || 0;
  const span = Math.max(1, nextReward.points - previousPoints);
  return Math.max(0, Math.min(100, ((points - previousPoints) / span) * 100));
}

export function CustomerRewardsPanel({ profile }) {
  const points = Number(profile?.points || 0);
  const nextReward = getNextReward(points);
  const progressValue = buildProgressValue(points, nextReward);
  const filledSegments = Math.max(0, Math.min(PROGRESS_SEGMENTS, Math.round((progressValue / 100) * PROGRESS_SEGMENTS)));

  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <Badge className="w-fit" variant="secondary">
          Loyalty progress
        </Badge>
        <CardTitle className="font-display text-2xl">Rewards wallet</CardTitle>
        <CardDescription className="text-base leading-relaxed md:text-sm">
          Track how close you are to the next reward and keep your post-checkout progress visible.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-base text-muted-foreground md:text-sm">Current points</p>
              <p className="text-3xl font-semibold">{points}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-base text-muted-foreground md:text-sm">Next unlock</p>
              <p className="text-lg font-semibold leading-tight">{nextReward.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: PROGRESS_SEGMENTS }, (_, index) => (
              <div
                className={index < filledSegments ? "h-3 rounded-2xl bg-primary transition-colors" : "h-3 rounded-2xl bg-secondary transition-colors"}
                key={`reward-segment-${index}`}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {points >= nextReward.points ? "You already unlocked this reward tier." : `${Math.max(0, nextReward.points - points)} more points to unlock ${nextReward.label}.`}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {REWARD_STEPS.map((step) => (
            <Card className="rounded-3xl border-white/20 bg-white/50 backdrop-blur-xl" key={step.label}>
              <CardContent className="grid gap-2 p-4">
                <p className="text-base text-muted-foreground md:text-sm">{step.points} points</p>
                <p className="text-base font-semibold">{step.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
