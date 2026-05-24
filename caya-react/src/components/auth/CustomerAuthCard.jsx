import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { createCustomerAccount, getAuthErrorMessage, loginCustomer } from "@/lib/auth.js";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";

function LoginFields({ busy, register }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="login-email">Email</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
      </div>
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="login-password">Password</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password")}
        />
      </div>
      <Button
        className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_16px_32px_hsl(var(--shadow)/0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:from-primary/95 hover:to-primary hover:shadow-[0_20px_36px_hsl(var(--shadow)/0.22)]"
        size="lg"
        disabled={busy}
        type="submit"
      >
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>
    </div>
  );
}

function SignupFields({ busy, register }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="signup-email">Email</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
      </div>
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="signup-password">Password</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          {...register("password")}
        />
      </div>
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="signup-confirm-password">Confirm Password</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
        />
      </div>
      <div className="space-y-2.5">
        <Label className="text-sm font-medium text-foreground/90" htmlFor="signup-referral-code">Referral Code</Label>
        <Input
          className="h-12 border-border/95 bg-secondary/55 text-base shadow-[inset_0_1px_0_hsl(var(--background)/0.65)] focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          id="signup-referral-code"
          type="text"
          placeholder="Optional"
          {...register("referralCodeUsed")}
        />
      </div>
      <Button
        className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_16px_32px_hsl(var(--shadow)/0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:from-primary/95 hover:to-primary hover:shadow-[0_20px_36px_hsl(var(--shadow)/0.22)]"
        size="lg"
        disabled={busy}
        type="submit"
      >
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>
    </div>
  );
}

export function CustomerAuthCard({ defaultTab = "login", onAuthSuccess, surface = "card" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [busy, setBusy] = useState(false);
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const signupForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      referralCodeUsed: ""
    }
  });

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleLogin = loginForm.handleSubmit((values) => {
    setBusy(true);
    return loginCustomer(values)
      .then(() => {
        loginForm.reset();
        onAuthSuccess?.({
          mode: "login"
        });
      })
      .catch((error) => {
        toast.error(getAuthErrorMessage(error, "login"));
      })
      .finally(() => setBusy(false));
  });

  const handleSignup = signupForm.handleSubmit((values) => {
    setBusy(true);
    return createCustomerAccount(values)
      .then(() => {
        toast.success("Account created. Please complete your profile.");
        signupForm.reset();
        setActiveTab("login");
        onAuthSuccess?.({
          mode: "signup"
        });
      })
      .catch((error) => {
        toast.error(getAuthErrorMessage(error, "signup"));
      })
      .finally(() => setBusy(false));
  });

  const authContent = (
    <>
      {surface === "card" ? (
        <CardHeader className="space-y-2">
          <CardTitle className="font-display text-3xl">Customer access</CardTitle>
          <CardDescription>
            Sign in with your customer email, or create a fresh account and we&apos;ll bootstrap your profile safely.
          </CardDescription>
        </CardHeader>
      ) : null}
      <CardContent className={surface === "dialog" ? "px-0 pb-0 pt-1" : undefined}>
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-secondary/75 p-1.5">
            <TabsTrigger
              className="text-sm font-semibold text-foreground/55 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[0_10px_22px_hsl(var(--shadow)/0.12)]"
              value="login"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              className="text-sm font-semibold text-foreground/55 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[0_10px_22px_hsl(var(--shadow)/0.12)]"
              value="signup"
            >
              Create Account
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-5" value="login">
            <form className="space-y-4" onSubmit={handleLogin}>
              <LoginFields busy={busy} register={loginForm.register} />
            </form>
          </TabsContent>
          <TabsContent className="mt-5" value="signup">
            <form className="space-y-4" onSubmit={handleSignup}>
              <SignupFields busy={busy} register={signupForm.register} />
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );

  if (surface === "dialog") {
    return authContent;
  }

  return <Card className="bg-card/90">{authContent}</Card>;
}
