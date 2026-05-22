import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { currency } from "@/lib/customer-experience.js";

export function CustomerCartItemCard({ cart, index, item }) {
  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_20px_48px_rgba(84,31,104,0.12)] backdrop-blur-xl">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-semibold">{item.displayName}</p>
            <p className="text-sm text-muted-foreground">{currency(item.price)} each</p>
            {item.itemType === "party_package" ? (
              <div className="grid gap-1 text-sm text-muted-foreground">
                <p>{`${item.eventDate || "Date pending"} ${item.eventTime || ""}`.trim()}</p>
                <p>{item.contactName || "Event contact pending"}</p>
                <p>{(item.selectedDessertTreats || []).map((treat) => (treat.flavor ? `${treat.productName} - ${treat.flavor}` : treat.productName)).join(" • ")}</p>
              </div>
            ) : null}
          </div>
          <Button onClick={() => cart.removeItem(index)} size="icon" type="button" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          {item.itemType !== "party_package" ? (
            <div className="flex items-center gap-2">
              <Button onClick={() => cart.updateQuantity(index, -1)} size="icon" type="button" variant="outline">
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-11 min-w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/65 text-sm font-semibold">
                {item.quantity}
              </div>
              <Button onClick={() => cart.updateQuantity(index, 1)} size="icon" type="button" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/20 bg-white/65 px-4 py-2 text-sm font-medium text-muted-foreground">
              One event booking
            </div>
          )}
          <p className="font-semibold">{currency(item.price * item.quantity)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
