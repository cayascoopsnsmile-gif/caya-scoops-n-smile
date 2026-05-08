import { useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import TopBar from "./components/layout/TopBar";
import {
  AdminDashboard,
  AuthPanel,
  CartCheckout,
  ContactSupport,
  CustomerDashboard,
  TrackOrder
} from "./components/panels/AppPanels";
import {
  BestSellers,
  FeaturedProducts,
  Hero,
  HowItWorks,
  Newsletter,
  OccasionGrid,
  ReviewsSection,
  TrustSecurity
} from "./components/sections/MarketplaceSections";
import Shelf from "./components/store/Shelf";
import { productCatalog, productShelves } from "./data/catalog";
import { createCheckoutIntent } from "./lib/payment";

export default function App() {
  const [selectedValues, setSelectedValues] = useState(() =>
    Object.fromEntries(productCatalog.map((product) => [product.id, 10]))
  );
  const [cart, setCart] = useState([]);

  function handleValueChange(productId, value) {
    setSelectedValues((current) => ({ ...current, [productId]: value }));
  }

  function handleAddToCart(product) {
    const value = selectedValues[product.id] ?? 10;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.value === value);

      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.value === value ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...product, value, quantity: 1 }];
    });
  }

  function handleRemoveFromCart(product) {
    setCart((current) =>
      current.filter((item) => !(item.id === product.id && item.value === product.value))
    );
  }

  async function handleCheckout() {
    await createCheckoutIntent({
      items: cart,
      totalItems: cart.length
    });
  }

  return (
    <div className="min-h-screen bg-cream">
      <TopBar />
      <Header cartCount={cart.length} />
      <Hero />
      <FeaturedProducts
        selectedValues={selectedValues}
        onValueChange={handleValueChange}
        onAddToCart={handleAddToCart}
      />
      <BestSellers />
      <OccasionGrid />
      {productShelves.map((section) => (
        <Shelf
          key={section.title}
          title={section.title}
          description={section.description}
          items={section.items}
          selectedValues={selectedValues}
          onValueChange={handleValueChange}
          onAddToCart={handleAddToCart}
        />
      ))}
      <HowItWorks />
      <TrustSecurity />
      <ReviewsSection />
      <Newsletter />
      <AuthPanel />
      <CartCheckout cartItems={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />
      <TrackOrder />
      <CustomerDashboard />
      <AdminDashboard />
      <ContactSupport />
      <Footer />
    </div>
  );
}
