import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.jsx";

export function CustomerCartEmptyState() {
  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_20px_48px_rgba(84,31,104,0.12)] backdrop-blur-xl">
      <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <div className="space-y-1">
          <p className="font-medium">Your cart is empty.</p>
          <p className="text-sm text-muted-foreground">Start with a flavor-picked treat and it will land here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
