import { CustomerAuthCard } from "@/components/auth/CustomerAuthCard.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";

const FALLBACK_LOGO_URL = "/assets/caya-logo-updated.jpeg";

export function CustomerAuthDialog({ defaultTab, onAuthSuccess, onOpenChange, open }) {
  const title = defaultTab === "signup" ? "Create your Caya account" : "Sign in to your Caya account";
  const description =
    defaultTab === "signup"
      ? "Unlock rewards, faster checkout, order history, and party package booking from one sweet customer account."
      : "Sign in to order your favorites, track your sweet rewards, and pick up where you left off.";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="w-[92%] max-w-[420px] gap-5 rounded-[28px] border-border/90 bg-card/95 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_28px_80px_hsl(var(--shadow)/0.2)] sm:p-6 sm:pt-7"
        overlayClassName="bg-foreground/18 backdrop-blur-[10px]"
      >
        <DialogHeader className="space-y-4">
          <img
            alt="Caya Scoops N Smile logo"
            className="h-16 w-auto self-center drop-shadow-[0_18px_32px_hsl(var(--shadow)/0.18)] md:h-[5.5rem]"
            decoding="async"
            loading="lazy"
            src={FALLBACK_LOGO_URL}
          />
          <DialogTitle className="text-center font-display text-[1.9rem] leading-tight md:text-[2.05rem]">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm leading-6 md:text-[0.95rem]">{description}</DialogDescription>
        </DialogHeader>
        <CustomerAuthCard defaultTab={defaultTab} onAuthSuccess={onAuthSuccess} surface="dialog" />
      </DialogContent>
    </Dialog>
  );
}
