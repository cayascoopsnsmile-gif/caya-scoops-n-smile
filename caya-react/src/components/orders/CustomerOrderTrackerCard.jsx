import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { currency } from "@/lib/customer-experience.js";

function formatDate(value) {
  if (!value?.seconds) return "N/A";
  return new Date(value.seconds * 1000).toLocaleString();
}

export function CustomerOrderTrackerCard({ currencySymbol, orders }) {
  const [reference, setReference] = useState("");
  const [searchedReference, setSearchedReference] = useState("");

  const matchedOrder = useMemo(() => {
    const searchValue = String(searchedReference || "").trim().toLowerCase();
    if (!searchValue) return null;

    return (
      orders.find((order) =>
        [order.receiptNumber, order.paymentReference].some((value) => String(value || "").trim().toLowerCase() === searchValue)
      ) || false
    );
  }, [orders, searchedReference]);

  const handleSearch = () => {
    setSearchedReference(reference);
  };

  return (
    <Card className="glass-card-strong">
      <CardHeader className="space-y-2">
        <CardTitle className="font-display text-2xl">Track by reference</CardTitle>
        <CardDescription>Enter a receipt number or order reference to jump straight to the matching order on your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            onChange={(event) => setReference(event.target.value)}
            placeholder="Receipt or order reference"
            value={reference}
          />
          <Button className="gap-2" onClick={handleSearch} type="button">
            <Search className="h-4 w-4" />
            Find order
          </Button>
        </div>

        {searchedReference && matchedOrder === false ? (
          <div className="glass-panel rounded-[24px] px-5 py-4 text-sm text-muted-foreground">
            No matching order was found on your account for <span className="font-semibold text-foreground">{searchedReference}</span>.
          </div>
        ) : null}

        {matchedOrder ? (
          <div className="glass-panel grid gap-4 rounded-[24px] px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-lg font-semibold">{matchedOrder.receiptNumber || matchedOrder.paymentReference || "Order"}</p>
                <p className="text-sm text-muted-foreground">{formatDate(matchedOrder.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{matchedOrder.status || "Pending"}</Badge>
                <Badge variant="outline">{matchedOrder.paymentStatus || "Pending"}</Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium">{matchedOrder.paymentMethod || "N/A"} / {matchedOrder.paymentStatus || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Requested time</p>
                <p className="font-medium">{matchedOrder.requestedTime || "As soon as possible"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Order total</p>
              <p className="text-2xl font-semibold">{currency(matchedOrder.total, currencySymbol)}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
