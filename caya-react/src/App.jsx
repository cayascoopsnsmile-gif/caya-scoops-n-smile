import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutAppSession } from "@/lib/staff-auth.js";
import { getPortalMode, isStaffPortalMode } from "@/lib/portal.js";
import { useCayaSession } from "@/hooks/useCayaSession.js";
import { StaffPortalShell } from "@/components/pos/StaffPortalShell.jsx";
import { CustomerShell } from "@/components/layout/CustomerShell.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { CUSTOMER_ROUTE_PATHS } from "@/lib/customer-routes.js";
import { AuthPage } from "@/components/customer/AuthPage.jsx";
import { TrackOrderPage } from "@/components/customer/TrackOrderPage.jsx";

const AdminDashboard = lazy(() =>
  import("@/components/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminDashboard }))
);
const CustomerAuthDialog = lazy(() =>
  import("@/components/auth/CustomerAuthDialog.jsx").then((module) => ({ default: module.CustomerAuthDialog }))
);
const CashierDashboard = lazy(() =>
  import("@/components/pos/CashierDashboard.jsx").then((module) => ({ default: module.CashierDashboard }))
);
const CustomerAppRoutes = lazy(() =>
  import("@/components/customer/CustomerAppRoutes.jsx").then((module) => ({ default: module.CustomerAppRoutes }))
);
const CustomerMarketingHome = lazy(() =>
  import("@/components/layout/CustomerMarketingHome.jsx").then((module) => ({ default: module.CustomerMarketingHome }))
);
const StaffLoginCard = lazy(() =>
  import("@/components/pos/StaffLoginCard.jsx").then((module) => ({ default: module.StaffLoginCard }))
);

function LoadingState() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const portalMode = getPortalMode();
  const { session, status, updateProfile } = useCayaSession(portalMode);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState("login");
  const [authRedirectTarget, setAuthRedirectTarget] = useState(CUSTOMER_ROUTE_PATHS.home);
  const [pendingAuthResolution, setPendingAuthResolution] = useState(null);
  const [customerCartCount, setCustomerCartCount] = useState(0);

  const handleLogout = () => {
    logoutAppSession()
      .then(() => {
        setCustomerCartCount(0);
        navigate("/", { replace: true });
        toast.success("Signed out.");
      })
      .catch((error) => toast.error(error?.message || "Could not sign out."));
  };

  if (isStaffPortalMode(portalMode)) {
    return (
      <StaffPortalShell>
        <Suspense fallback={<LoadingState />}>
          {status === "loading" ? <LoadingState /> : null}
          {status === "guest" ? <StaffLoginCard portalMode={portalMode} /> : null}
          {status === "authenticated" && portalMode === "admin" ? <AdminDashboard profile={session.profile} /> : null}
          {status === "authenticated" && portalMode !== "admin" ? (
            <CashierDashboard
              portalMode={portalMode}
              profile={session.profile}
              user={session.user}
            />
          ) : null}
        </Suspense>
      </StaffPortalShell>
    );
  }

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
    setAuthDialogTab("login");
  };

  const resolveAuthRedirectTarget = (context = {}) => {
    if (context.redirectTo) return context.redirectTo;
    if (context.source === "cart") return CUSTOMER_ROUTE_PATHS.cart;
    if (context.source === "product") return context.productPath || CUSTOMER_ROUTE_PATHS.menu;
    return CUSTOMER_ROUTE_PATHS.home;
  };

  const openAuthDialog = (tab, context = {}) => {
    setAuthDialogTab(tab);
    setAuthRedirectTarget(resolveAuthRedirectTarget(context));
    setAuthDialogOpen(true);
  };

  const openTrackOrder = () => {
    navigate(CUSTOMER_ROUTE_PATHS.trackOrder);
  };

  const handleCustomerAuthSuccess = ({ mode }) => {
    const redirectTo = authRedirectTarget || location.state?.from || CUSTOMER_ROUTE_PATHS.home;
    setPendingAuthResolution({
      redirectTo,
      showSuccessToast: mode === "login"
    });
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    if (authDialogOpen) {
      closeAuthDialog();
    }

    if (pendingAuthResolution) {
      const { redirectTo, showSuccessToast } = pendingAuthResolution;
      setPendingAuthResolution(null);
      if (showSuccessToast) {
        toast.success("Signed in successfully.");
      }
      navigate(redirectTo || CUSTOMER_ROUTE_PATHS.home, { replace: true });
      return;
    }

    if (location.pathname === CUSTOMER_ROUTE_PATHS.auth) {
      navigate(location.state?.from || CUSTOMER_ROUTE_PATHS.home, { replace: true });
    }
  }, [authDialogOpen, location.pathname, location.state, navigate, pendingAuthResolution, status]);

  return (
    <CustomerShell cartCount={customerCartCount} showMobileNav={status === "authenticated"}>
      <Suspense fallback={<LoadingState />}>
        {status === "loading" ? <LoadingState /> : null}
        {status === "guest" ? (
          <Routes>
            <Route
              path={CUSTOMER_ROUTE_PATHS.landing}
              element={<CustomerMarketingHome onOpenAuth={openAuthDialog} onTrackOrder={openTrackOrder} />}
            />
            <Route
              path={CUSTOMER_ROUTE_PATHS.home}
              element={<CustomerMarketingHome onOpenAuth={openAuthDialog} onTrackOrder={openTrackOrder} />}
            />
            <Route
              path={CUSTOMER_ROUTE_PATHS.auth}
              element={
                <AuthPage
                  defaultTab={location.state?.tab || "login"}
                  description="Sign in or create your account to order treats, earn rewards, and keep track of every sweet moment."
                  onAuthSuccess={handleCustomerAuthSuccess}
                  title="Sign in to Caya"
                />
              }
            />
            <Route path={CUSTOMER_ROUTE_PATHS.trackOrder} element={<TrackOrderPage />} />
            <Route path={CUSTOMER_ROUTE_PATHS.menu} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path={CUSTOMER_ROUTE_PATHS.cart} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path={CUSTOMER_ROUTE_PATHS.profile} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path={CUSTOMER_ROUTE_PATHS.orders} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path={CUSTOMER_ROUTE_PATHS.rewards} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path={CUSTOMER_ROUTE_PATHS.checkout} element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.auth} state={{ from: location.pathname, tab: "login" }} />} />
            <Route path="*" element={<Navigate replace to={CUSTOMER_ROUTE_PATHS.home} />} />
          </Routes>
        ) : null}
        {status === "authenticated" ? (
          <>
            {location.pathname === "/" ? <Navigate replace to={CUSTOMER_ROUTE_PATHS.home} /> : null}
            <CustomerAppRoutes
              onCartCountChange={setCustomerCartCount}
              onLogout={handleLogout}
              onProfileSaved={updateProfile}
              profile={session.profile}
              user={session.user}
            />
          </>
        ) : null}
        <CustomerAuthDialog
          defaultTab={authDialogTab}
          onAuthSuccess={handleCustomerAuthSuccess}
          onOpenChange={setAuthDialogOpen}
          open={authDialogOpen}
        />
      </Suspense>
    </CustomerShell>
  );
}
