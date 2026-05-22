import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { currency } from "@/lib/customer-experience.js";

export function CustomerCartSummaryCard({ cart, onCheckout }) {
  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_20px_48px_rgba(84,31,104,0.12)] backdrop-blur-xl">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-xl font-semibold">{currency(cart.subtotal)}</p>
        </div>
        <Button className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_16px_34px_rgba(123,44,191,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(123,44,191,0.26)] sm:w-auto" disabled={!cart.items.length} onClick={onCheckout} type="button">
          Continue to checkout
        </Button>
      </CardContent>
    </Card>
  );
}
