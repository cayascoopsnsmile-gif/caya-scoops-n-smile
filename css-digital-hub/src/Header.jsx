import { navItems } from "../../data/catalog";

export default function Header({ cartCount }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-shell flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <img
              src="./assets/css-digital-hub-logo.png"
              alt="CSS Digital Hub logo"
              className="h-24 w-24 rounded-[1.75rem] border border-violet/10 bg-white object-cover p-1 shadow-panel sm:h-28 sm:w-28"
            />
            <div>
              <p className="font-display text-3xl text-ink sm:text-4xl">CSS Digital Hub</p>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Premium Digital Marketplace</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 lg:max-w-4xl lg:flex-row lg:items-center lg:justify-end">
            <label className="relative block flex-1 lg:max-w-xl">
              <span className="sr-only">Search for gift cards</span>
              <input
                type="text"
                placeholder="Search for gift cards"
                className="w-full rounded-full border border-slate-200 bg-mist px-5 py-3 text-sm outline-none transition focus:border-violet/40"
              />
            </label>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
              <a href="#auth" className="pill-link">
                Sign in
              </a>
              <a href="#checkout" className="pill-link">
                Cart ({cartCount})
              </a>
              <a href="#support" className="pill-link">
                Support
              </a>
              <a href="#track-order" className="pill-link">
                Track order
              </a>
            </div>
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="pill-link">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
