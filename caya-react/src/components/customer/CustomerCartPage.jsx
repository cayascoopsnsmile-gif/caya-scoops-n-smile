import { useNavigate } from "react-router-dom";
import { CustomerCartItemsList } from "@/components/cart/CustomerCartItemsList.jsx";
import { CustomerCartSummaryCard } from "@/components/cart/CustomerCartSummaryCard.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { CUSTOMER_ROUTE_PATHS } from "@/lib/customer-routes.js";

export function CustomerCartPage({ cart }) {
  const navigate = useNavigate();

  return (
    <Card className="rounded-[32px] border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(84,31,104,0.14)] backdrop-blur-xl">
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          Cart
        </Badge>
        <CardTitle className="font-display text-2xl">Your cart</CardTitle>
        <CardDescription>Review every scoop, chiller, and party treat before you continue to checkout.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <CustomerCartItemsList cart={cart} />
        <CustomerCartSummaryCard cart={cart} onCheckout={() => navigate(CUSTOMER_ROUTE_PATHS.checkout)} />
      </CardContent>
    </Card>
  );
}
