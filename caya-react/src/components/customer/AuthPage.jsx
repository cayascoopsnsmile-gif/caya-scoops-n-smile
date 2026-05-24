import { CustomerAuthCard } from "@/components/auth/CustomerAuthCard.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const FALLBACK_LOGO_URL = "/assets/caya-logo-updated.jpeg";

export function AuthPage({
  defaultTab = "login",
  description = "Sign in to order your favorites, track your sweet rewards, and pick up where you left off.",
  onAuthSuccess,
  title = "Customer access"
}) {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-6">
      <Card className="bg-card/92 shadow-card">
        <CardHeader className="space-y-4 text-center">
          <img
            alt="Caya Scoops N Smile logo"
            className="h-14 w-auto self-center drop-shadow-[0_14px_28px_hsl(var(--shadow)/0.14)] md:h-20"
            decoding="async"
            loading="lazy"
            src={FALLBACK_LOGO_URL}
          />
          <div className="space-y-2">
            <CardTitle className="font-display text-3xl">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed md:text-sm">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <CustomerAuthCard defaultTab={defaultTab} onAuthSuccess={onAuthSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
