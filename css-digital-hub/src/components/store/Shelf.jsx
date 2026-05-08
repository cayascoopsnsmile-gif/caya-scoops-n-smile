import ProductCard from "./ProductCard";

export default function Shelf({ title, description, items, selectedValues, onValueChange, onAddToCart }) {
  return (
    <section className="py-8">
      <div className="container-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title text-ink">{title}</h2>
            <p className="section-copy mt-2">{description}</p>
          </div>
          <a href="#checkout" className="pill-link">
            Shop this shelf
          </a>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              selectedValue={selectedValues[item.id] ?? 10}
              onValueChange={onValueChange}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
