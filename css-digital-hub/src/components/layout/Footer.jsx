function FooterColumn({ title, items }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-white/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 bg-footer text-white">
      <div className="container-shell grid gap-8 py-14 lg:grid-cols-[1.2fr_repeat(4,0.7fr)]">
        <div>
          <div className="flex items-center gap-5">
            <img
              src="./assets/css-digital-hub-logo.png"
              alt="CSS Digital Hub logo"
              className="h-24 w-24 rounded-[1.75rem] border border-white/15 bg-white/10 object-cover p-1 sm:h-28 sm:w-28"
            />
            <div>
              <p className="font-display text-3xl sm:text-4xl">CSS Digital Hub</p>
              <p className="text-sm text-white/70">Luxury digital gift cards and prepaid products</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Premium digital marketplace for gift cards, gaming cards, app store cards, E-PINs, and digital vouchers
            with customer dashboards and supplier API preparation.
          </p>
          <div className="mt-6 flex gap-3">
            {["FB", "IG", "X", "TT"].map((item) => (
              <span key={item} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold">
                {item}
              </span>
            ))}
          </div>
        </div>
        <FooterColumn title="About" items={["Company", "Business gifting", "Marketplace", "Track order"]} />
        <FooterColumn title="Support" items={["Help center", "Contact", "Order support", "Balance help"]} />
        <FooterColumn title="Legal" items={["Privacy", "Terms", "Refund policy", "Supplier policy"]} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Newsletter</p>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
            />
            <button type="button" className="button-gold w-full">
              Sign up
            </button>
          </div>
          <p className="mt-4 text-sm text-white/70">support@cssdigitalhub.com</p>
          <p className="text-sm text-white/70">+1 (868) 555-0142</p>
        </div>
      </div>
    </footer>
  );
}
