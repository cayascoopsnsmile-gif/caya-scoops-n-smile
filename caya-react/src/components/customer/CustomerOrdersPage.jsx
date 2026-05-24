import { CustomerOrderHistory } from "@/components/orders/CustomerOrderHistory.jsx";
import { CustomerOrderTrackerCard } from "@/components/orders/CustomerOrderTrackerCard.jsx";
import { PaymentReturnBanner } from "@/components/orders/PaymentReturnBanner.jsx";

export function CustomerOrdersPage({ cart, concierge, currencySymbol, orders, paymentReturn, user }) {
  return (
    <div className="grid gap-6">
      <PaymentReturnBanner banner={paymentReturn.banner} onDismiss={paymentReturn.dismiss} />
      <CustomerOrderTrackerCard currencySymbol={currencySymbol} orders={orders.orders} />
      <CustomerOrderHistory
        cart={cart}
        concierge={concierge}
        currencySymbol={currencySymbol}
        loading={orders.loading}
        onRefresh={orders.refresh}
        orders={orders.orders}
        user={user}
      />
    </div>
  );
}
