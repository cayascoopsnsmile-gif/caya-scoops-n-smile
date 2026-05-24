import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";

export function CustomerNotificationsCard({ notifications }) {
  return (
    <Card className="glass-card">
      <CardHeader className="space-y-2">
        <CardTitle className="font-display text-2xl">Notifications</CardTitle>
        <CardDescription>Quick reward, referral, and account notices based on your current customer profile.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {notifications.map((item) => (
          <div className="glass-panel flex items-start gap-3 rounded-[24px] px-4 py-4" key={item.id}>
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
