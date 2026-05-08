import {
  bestSellers,
  featuredProducts,
  heroSearchSuggestions,
  marketplaceTabs,
  occasions
} from "../../data/catalog";
import ProductCard from "../store/ProductCard";

export function Hero() {
  return (
    <section className="bg-hero">
      <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex rounded-full bg-violet/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-violet">
            Trusted digital marketplace
          </div>
          <h1 className="mt-6 font-display text-5xl leading-tight text-ink sm:text-6xl">
            Buy Digital Gift Cards From Trusted Brands
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            CSS Digital Hub is a premium marketplace for digital gift cards, gaming cards, app store cards, digital
            vouchers, E-PINs, and prepaid digital products with clean shopping and secure dashboard delivery.
          </p>
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-panel">
            <label className="block">
              <span className="sr-only">Search for gift cards</span>
              <input
                type="text"
                placeholder="Search for gift cards"
                className="w-full rounded-full border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-violet/40"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {heroSearchSuggestions.map((item) => (
                <span key={item} className="rounded-full bg-mist px-3 py-2 text-xs font-semibold text-slate-500">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#gift-cards" className="button-violet">
              Shop gift cards
            </a>
            <a href="#business" className="button-outline">
              Explore business gifting
            </a>
          </div>
        </div>
        <div className="surface-card overflow-hidden p-6">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-plum via-violet to-lilac p-8 text-white">
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="rounded-[2rem] border border-white/15 bg-black/15 p-3 shadow-2xl backdrop-blur">
                <img
                  src="./assets/css-digital-hub-logo.png"
                  alt="CSS Digital Hub logo"
                  className="h-40 w-40 rounded-[1.5rem] object-cover sm:h-52 sm:w-52"
                />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Featured collection</p>
            <h2 className="mt-4 font-display text-4xl">Luxury digital gifting with instant code access</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Built for modern shoppers, premium rewards, and future EZ PIN supplier integration with customer dashboard
              delivery after payment confirmation.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/12 p-4">
                <p className="text-sm text-white/70">Best sellers</p>
                <p className="mt-2 text-xl font-semibold">Visa, Amazon, PlayStation</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/12 p-4">
                <p className="text-sm text-white/70">Security</p>
                <p className="mt-2 text-xl font-semibold">Codes shown only after payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts({ selectedValues, onValueChange, onAddToCart }) {
  return (
    <section className="py-8" id="gift-cards">
      <div className="container-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Featured products</p>
            <h2 className="section-title">Premium digital gift cards ready to shop</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {marketplaceTabs.map((item) => (
              <span key={item} className="pill-link">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedValue={selectedValues[product.id] ?? 10}
              onValueChange={onValueChange}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestSellers() {
  return (
    <section className="py-8">
      <div className="container-shell">
        <div className="surface-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Best sellers</p>
              <h2 className="section-title mt-2 text-ink">What customers buy most</h2>
            </div>
            <a href="#checkout" className="button-outline">
              View cart
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {bestSellers.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-slate-100 bg-mist p-5 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-violet shadow-sm">
                  {item.split(" ")[0]}
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function OccasionGrid() {
  return (
    <section className="py-8">
      <div className="container-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Cards for every occasion</p>
        <h2 className="section-title mt-2">Shop by celebration, category, or gifting moment</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {occasions.map((occasion) => (
            <div
              key={occasion}
              className="surface-card flex min-h-28 items-center justify-center bg-gradient-to-br from-white to-mist px-4 text-center text-sm font-semibold text-slate-700"
            >
              {occasion}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    "Search and choose a trusted gift card category or brand.",
    "Select a value, add to cart, and move through secure placeholder checkout.",
    "After payment confirmation, issued codes appear in the customer dashboard."
  ];

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="surface-card p-8 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">How it works</p>
          <h2 className="section-title mt-2">Fast, secure, and easy to shop</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[1.75rem] border border-slate-100 bg-mist p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet text-sm font-bold text-white">
                  0{index + 1}
                </span>
                <p className="mt-5 text-base leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSecurity() {
  const items = [
    "Firebase-ready auth and data layer",
    "Supplier API keys kept server-side only",
    "Digital codes shown only after payment confirmation",
    "Prepared for EZ PIN integration and delivery logging"
  ];

  return (
    <section className="py-8">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Trust and security</p>
          <h2 className="section-title mt-2">Built to feel safe, trustworthy, and premium</h2>
          <p className="section-copy">
            CSS Digital Hub is prepared for secure digital product delivery, customer dashboards, order monitoring,
            future supplier API orchestration, and production-style operational workflows.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="surface-card p-6">
              <p className="text-sm font-semibold text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-8">
      <div className="container-shell">
        <div className="surface-card p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Customer reviews</p>
          <h2 className="section-title mt-2">Social proof placeholder</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              "Smooth checkout and fast delivery.",
              "A premium-looking gift card store.",
              "Perfect structure for business gifting."
            ].map((quote, index) => (
              <blockquote key={quote} className="rounded-[1.75rem] bg-mist p-6">
                <p className="text-base leading-7 text-slate-700">"{quote}"</p>
                <footer className="mt-4 text-sm font-semibold text-slate-500">Reviewer {index + 1}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="py-8">
      <div className="container-shell">
        <div className="surface-card flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Newsletter signup</p>
            <h2 className="section-title mt-2 text-ink">Get offers, best sellers, and new digital card drops</h2>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm outline-none transition focus:border-violet/40"
            />
            <button type="button" className="button-violet">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
