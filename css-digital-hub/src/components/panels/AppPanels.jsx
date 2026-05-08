import { useMemo } from "react";
import { adminSummary, adminTables, customerOrders, purchasedCodes } from "../../data/catalog";
import { firebaseIsReady } from "../../lib/firebase";
import { formatMoney } from "../../utils/formatMoney";

export function AuthPanel() {
  const authReady = firebaseIsReady();

  return (
    <section id="auth" className="py-10">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Sign up / Login</p>
          <h2 className="section-title mt-2">Customer access and secure account entry</h2>
          <p className="section-copy">
            This panel is prepared for Firebase Authentication so customers can access order history, purchased codes,
            and dashboard delivery after payment confirmation.
          </p>
        </div>
        <div className="surface-card p-8">
          <div className="grid gap-4">
            <input type="email" placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input type="password" placeholder="Password" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className="button-violet">
                Sign in
              </button>
              <button type="button" className="button-outline">
                Create account
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Firebase status: <span className="font-semibold text-slate-700">{authReady ? "Configured" : "Awaiting environment variables"}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CartCheckout({ cartItems, onRemove, onCheckout }) {
  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.value * item.quantity, 0), [cartItems]);

  return (
    <section id="checkout" className="py-10">
      <div className="container-shell grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Cart</p>
              <h2 className="section-title mt-2 text-ink">Your gift card cart</h2>
            </div>
            <span className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-slate-600">{cartItems.length} items</span>
          </div>
          <div className="mt-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-[1.75rem] bg-mist p-6 text-slate-600">No items in cart yet.</div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.value}`} className="rounded-[1.75rem] border border-slate-100 bg-mist p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">{item.category}</p>
                      <h3 className="mt-2 font-display text-2xl text-ink">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Selected value: {formatMoney(item.value)} · Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-ink">{formatMoney(item.value * item.quantity)}</span>
                      <button type="button" onClick={() => onRemove(item)} className="button-outline px-4 py-2">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="surface-card p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Checkout page</p>
          <h2 className="section-title mt-2 text-ink">Payment and delivery placeholder</h2>
          <div className="mt-6 grid gap-4">
            <input type="text" placeholder="Recipient name" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input type="email" placeholder="Recipient email" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <option>Placeholder card payment</option>
              <option>Bank transfer placeholder</option>
              <option>Wallet placeholder</option>
            </select>
            <textarea placeholder="Order notes" className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <div className="rounded-[1.5rem] bg-mist p-5">
              <p className="text-sm text-slate-500">Estimated total</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{formatMoney(total)}</p>
              <p className="mt-3 text-sm text-slate-500">
                Digital codes must only display after payment confirmation. Payment flow is currently placeholder-ready.
              </p>
            </div>
            <button type="button" className="button-violet w-full" onClick={onCheckout}>
              Continue to payment placeholder
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrackOrder() {
  return (
    <section id="track-order" className="py-10">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Track order</p>
          <h2 className="section-title mt-2">Find a gift card order quickly</h2>
          <p className="section-copy">Prepared for order tracking by order number, email, or payment reference.</p>
        </div>
        <div className="surface-card p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="text" placeholder="Order number" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input type="email" placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <button type="button" className="button-violet mt-4">
            Track order
          </button>
        </div>
      </div>
    </section>
  );
}

export function CustomerDashboard() {
  return (
    <section id="customer-dashboard" className="py-10">
      <div className="container-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Customer dashboard</p>
        <h2 className="section-title mt-2">Order history and purchased codes</h2>
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-8">
            <div className="flex items-center gap-4">
              <img
                src="./assets/css-digital-hub-logo.png"
                alt="CSS Digital Hub logo"
                className="h-16 w-16 rounded-2xl border border-violet/10 bg-white p-1 shadow-sm"
              />
              <div>
                <h3 className="font-display text-2xl text-ink">CSS Premium Customer</h3>
                <p className="text-sm text-slate-500">Order history, purchased codes, and account access</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {customerOrders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] bg-mist p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">{order.status}</p>
                  <h4 className="mt-2 font-display text-xl text-ink">{order.item}</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    {order.id} · {order.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card p-8">
            <h3 className="font-display text-2xl text-ink">Purchased codes</h3>
            <div className="mt-6 space-y-4">
              {purchasedCodes.map((code) => (
                <div key={code.id} className="rounded-[1.75rem] border border-slate-100 bg-mist p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">{code.status}</p>
                      <h4 className="mt-2 font-display text-xl text-ink">{code.item}</h4>
                      <p className="mt-2 text-sm text-slate-500">{code.amount}</p>
                    </div>
                    <button type="button" className="button-gold">
                      Download code
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                      <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Code</span>
                      <strong className="mt-2 block text-ink">{code.code}</strong>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                      <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">PIN</span>
                      <strong className="mt-2 block text-ink">{code.pin}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AdminDashboard() {
  return (
    <section id="admin-dashboard" className="py-10">
      <div className="container-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Admin dashboard</p>
        <h2 className="section-title mt-2">Operations, product management, and delivery monitoring</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {adminSummary.map((card) => (
            <div key={card.label} className="surface-card p-6">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-8">
            <h3 className="font-display text-2xl text-ink">Admin controls</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Add / edit / delete products",
                "Manage categories",
                "Manage orders",
                "Update prices and margins",
                "View customers",
                "Delivery logs",
                "Failed orders",
                "EZ PIN API preparation"
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-mist p-5 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card p-8">
            <h3 className="font-display text-2xl text-ink">Operational tables</h3>
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet">Orders</h4>
                <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-slate-100">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {adminTables.orders.map((row) => (
                        <tr key={row.join("-")} className="border-t border-slate-100 bg-white first:border-t-0">
                          {row.map((cell) => (
                            <td key={cell} className="px-4 py-4 text-slate-600">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet">Delivery logs</h4>
                <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-slate-100">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {adminTables.deliveryLogs.map((row) => (
                        <tr key={row.join("-")} className="border-t border-slate-100 bg-white first:border-t-0">
                          {row.map((cell) => (
                            <td key={cell} className="px-4 py-4 text-slate-600">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSupport() {
  return (
    <section id="support" className="py-10">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet">Support</p>
          <h2 className="section-title mt-2">Track orders, get help, and contact support</h2>
          <p className="section-copy">
            This area is prepared for customer support flows, order tracking, contact forms, and delivery issue handling.
          </p>
        </div>
        <div className="surface-card p-8">
          <div className="grid gap-4">
            <input type="text" placeholder="Full name" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input type="email" placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea placeholder="How can we help?" className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <button type="button" className="button-violet">
              Send support request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
