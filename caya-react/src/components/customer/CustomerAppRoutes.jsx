import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton.jsx";
import { CustomerCartPage } from "@/components/customer/CustomerCartPage.jsx";
import { CustomerCheckoutPage } from "@/components/customer/CustomerCheckoutPage.jsx";
import { CustomerHomePage } from "@/components/customer/CustomerHomePage.jsx";
import { CustomerMenuPage } from "@/components/customer/CustomerMenuPage.jsx";
import { CustomerOrdersPage } from "@/components/customer/CustomerOrdersPage.jsx";
import { CustomerProfilePage } from "@/components/customer/CustomerProfilePage.jsx";
import { CustomerRewardsPage } from "@/components/customer/CustomerRewardsPage.jsx";
import { useBusinessSettings } from "@/hooks/useBusinessSettings.js";
import { useCustomerAnnouncements } from "@/hooks/useCustomerAnnouncements.js";
import { useCustomerCart } from "@/hooks/useCustomerCart.js";
import { useCustomerConcierge } from "@/hooks/useCustomerConcierge.js";
import { useCustomerMenu } from "@/hooks/useCustomerMenu.js";
import { useCustomerOrders } from "@/hooks/useCustomerOrders.js";
import { useCustomerWallet } from "@/hooks/useCustomerWallet.js";
import { usePartyPackages } from "@/hooks/usePartyPackages.js";
import { usePaymentReturn } from "@/hooks/usePaymentReturn.js";
import { buildCustomerNotifications } from "@/lib/customer-home.js";
import { CUSTOMER_ROUTE_PATHS } from "@/lib/customer-routes.js";

export function CustomerAppRoutes({ onCartCountChange, onLogout, onProfileSaved, profile, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menu = useCustomerMenu();
  const cart = useCustomerCart();
  const { settings } = useBusinessSettings();
  const orders = useCustomerOrders(user);
  const paymentReturn = usePaymentReturn(orders.refresh);
  const wallet = useCustomerWallet(user, profile);
  const concierge = useCustomerConcierge(user);
  const partyPackages = usePartyPackages(menu);
  const announcements = useCustomerAnnouncements();
  const [preferredDeliveryAddress, setPreferredDeliveryAddress] = useState("");
  const notifications = buildCustomerNotifications(profile, wallet.wallet);

  useEffect(() => {
    onCartCountChange?.(cart.itemCount);
  }, [cart.itemCount, onCartCountChange]);

  const handleCheckoutComplete = (result) => {
    if (result?.mode === "cash") {
      orders.refresh();
      onProfileSaved?.({
        ...profile,
        points: Number(profile?.points || 0) + Number(result.earnedPoints || 0)
      });
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.home} />} />
        <Route path="/dashboard" element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.home} />} />
        <Route path={CUSTOMER_ROUTE_PATHS.auth} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.home} />} />
        <Route path={CUSTOMER_ROUTE_PATHS.trackOrder} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.orders} />} />
        <Route
          path={CUSTOMER_ROUTE_PATHS.home}
          element={
            <CustomerHomePage
              announcements={announcements}
              notifications={notifications}
              currencySymbol={settings.currencySymbol}
              paymentReturn={paymentReturn}
              profile={profile}
              user={user}
              wallet={wallet}
            />
          }
        />
        <Route path={CUSTOMER_ROUTE_PATHS.menu} element={<CustomerMenuPage cart={cart} menu={menu} partyPackages={partyPackages} settings={settings} />} />
        <Route path={CUSTOMER_ROUTE_PATHS.cart} element={<CustomerCartPage cart={cart} />} />
        <Route
          path={CUSTOMER_ROUTE_PATHS.profile}
          element={
            <CustomerProfilePage
              cart={cart}
              concierge={concierge}
              currencySymbol={settings.currencySymbol}
              onLogout={onLogout}
              onProfileSaved={onProfileSaved}
              onUseAddress={setPreferredDeliveryAddress}
              orders={orders}
              profile={profile}
              settings={settings}
              user={user}
              wallet={wallet}
            />
          }
        />
        <Route
          path={CUSTOMER_ROUTE_PATHS.orders}
          element={
            <CustomerOrdersPage
              cart={cart}
              concierge={concierge}
              currencySymbol={settings.currencySymbol}
              orders={orders}
              paymentReturn={paymentReturn}
              user={user}
            />
          }
        />
        <Route
          path={CUSTOMER_ROUTE_PATHS.rewards}
          element={
            <CustomerRewardsPage
              currencySymbol={settings.currencySymbol}
              onProfileSaved={onProfileSaved}
              profile={profile}
              settings={settings}
              user={user}
              wallet={wallet}
            />
          }
        />
        <Route
          path={CUSTOMER_ROUTE_PATHS.checkout}
          element={
            <CustomerCheckoutPage
              cart={cart}
              onCheckoutComplete={handleCheckoutComplete}
              preferredDeliveryAddress={preferredDeliveryAddress}
              profile={profile}
              user={user}
            />
          }
        />
        <Route path="*" element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.home} />} />
      </Routes>
      <FloatingCartButton count={cart.itemCount} onOpen={() => navigate(CUSTOMER_ROUTE_PATHS.cart, { state: { from: location.pathname } })} />
    </>
  );
}
