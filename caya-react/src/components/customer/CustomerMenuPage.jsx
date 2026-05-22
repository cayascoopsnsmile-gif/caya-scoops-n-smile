import { CustomerMenuSection } from "@/components/menu/CustomerMenuSection.jsx";
import { CustomerPartyPackagesSection } from "@/components/party/CustomerPartyPackagesSection.jsx";

export function CustomerMenuPage({ cart, menu, partyPackages, settings }) {
  return (
    <div className="grid gap-6">
      <CustomerMenuSection cart={cart} menu={menu} />
      <CustomerPartyPackagesSection cart={cart} partyPackages={partyPackages} settings={settings} />
    </div>
  );
}
