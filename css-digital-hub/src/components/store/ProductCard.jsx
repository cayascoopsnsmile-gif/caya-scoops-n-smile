import { valueOptions } from "../../data/catalog";
import { formatMoney } from "../../utils/formatMoney";

export default function ProductCard({ product, selectedValue, onValueChange, onAddToCart }) {
  return (
    <article className="surface-card group overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-luxe">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet">
          {product.category}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {product.imageLabel}
        </span>
      </div>
      <div className="mt-5 flex h-36 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-mist to-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet/10 text-sm font-semibold text-violet">
            {product.imageLabel}
          </div>
          <p className="mt-3 text-sm text-slate-500">Image placeholder</p>
        </div>
      </div>
      <h3 className="mt-5 font-display text-2xl text-ink">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{product.priceRange}</p>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Select value</label>
        <select
          value={selectedValue}
          onChange={(event) => onValueChange(product.id, Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet/40"
        >
          {valueOptions.map((amount) => (
            <option key={amount} value={amount}>
              {formatMoney(amount)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="button-outline flex-1">
          Buy now
        </button>
        <button type="button" className="button-violet flex-1" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
