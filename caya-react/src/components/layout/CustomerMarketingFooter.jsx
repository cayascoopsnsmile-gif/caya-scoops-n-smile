import { Mail, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const FALLBACK_LOGO_URL = "/assets/caya-logo-updated.jpeg";

function FooterLinkGroup({ links, title }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <Button
            key={link.label}
            className="h-auto justify-start px-0 py-0 text-left text-sm text-foreground/80 hover:text-foreground"
            onClick={link.onClick}
            type="button"
            variant="link"
          >
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ContactButton({ children, onClick }) {
  return (
    <Button
      className="h-10 justify-start rounded-2xl border-border bg-card text-foreground hover:bg-secondary"
      onClick={onClick}
      type="button"
      variant="outline"
    >
      {children}
    </Button>
  );
}

export function CustomerMarketingFooter({ onOpenAuth, onTrackOrder }) {
  const noop = () => undefined;

  return (
    <footer className="grid gap-5 rounded-2xl border border-border/70 bg-secondary/75 p-5 text-foreground shadow-card md:gap-6 md:p-6">
      <div className="space-y-3">
        <img
          alt="Caya Scoops N Smile logo"
          className="h-14 w-auto drop-shadow-[0_14px_28px_hsl(var(--shadow)/0.16)] md:h-20"
          decoding="async"
          loading="lazy"
          src={FALLBACK_LOGO_URL}
        />
        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold md:text-2xl">Caya Scoops N Smile</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Premium dessert treats, rewards, and ordering for every sweet occasion.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ContactButton onClick={noop}>
          <MessageCircleMore className="h-4 w-4" />
          WhatsApp
        </ContactButton>
        <ContactButton onClick={noop}>
          <Mail className="h-4 w-4" />
          cayascoopsnsmile@gmail.com
        </ContactButton>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
        <FooterLinkGroup
          links={[
            { label: "Menu", onClick: noop },
            { label: "Specials", onClick: noop },
            { label: "Catering", onClick: noop }
          ]}
          title="About"
        />
        <FooterLinkGroup
          links={[
            { label: "Sign In", onClick: () => onOpenAuth("login", { redirectTo: "/home" }) },
            { label: "Order Tracker", onClick: onTrackOrder },
            { label: "Rewards", onClick: () => onOpenAuth("signup", { redirectTo: "/rewards" }) }
          ]}
          title="Contact"
        />
        <div className="col-span-2 md:col-span-1">
          <FooterLinkGroup
            links={[
              { label: "Terms", onClick: noop },
              { label: "Privacy", onClick: noop },
              { label: "Refund Policy", onClick: noop },
              { label: "Support Policy", onClick: noop }
            ]}
            title="Policies"
          />
        </div>
      </div>

      <Separator className="bg-border/80" />

      <p className="text-xs text-muted-foreground">© 2026 Caya Scoops N Smile. All rights reserved.</p>
    </footer>
  );
}
