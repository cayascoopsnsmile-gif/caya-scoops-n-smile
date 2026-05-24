import { Bell, Gift, IceCreamCone, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const ICONS = {
  Bell,
  Gift,
  IceCream: IceCreamCone,
  Sparkles
};

function formatDate(value) {
  if (!value?.seconds) return "Just now";
  return new Date(value.seconds * 1000).toLocaleString();
}

function AnnouncementSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 2 }, (_, index) => (
        <Skeleton className="h-24 w-full rounded-[24px]" key={`announcement-skeleton-${index}`} />
      ))}
    </div>
  );
}

export function CustomerAnnouncementsCard({ announcements, loading }) {
  return (
    <Card className="glass-card-strong">
      <CardHeader className="space-y-2">
        <CardTitle className="font-display text-2xl">Announcements</CardTitle>
        <CardDescription>Fresh drops, flavor news, promos, and reward updates from Caya Scoops N Smile.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {loading ? <AnnouncementSkeleton /> : null}
        {!loading && !announcements.length ? (
          <div className="glass-panel rounded-[24px] px-5 py-4 text-sm text-muted-foreground">
            No announcements yet. Fresh updates and treat drops will appear here.
          </div>
        ) : null}
        {!loading && announcements.length
          ? announcements.map((item) => {
              const Icon = ICONS[item.typeKey] || Bell;
              return (
                <div className="glass-panel grid gap-3 rounded-[24px] px-5 py-4 md:grid-cols-[auto_1fr]" key={item.id}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{item.type}: {item.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              );
            })
          : null}
      </CardContent>
    </Card>
  );
}
