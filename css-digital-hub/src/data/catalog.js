export const heroSearchSuggestions = [
  "Visa gift card",
  "PlayStation card",
  "Netflix eGift",
  "Apple App Store",
  "Digital vouchers"
];

export const navItems = [
  "Gift Cards",
  "Gaming Cards",
  "App Store Cards",
  "Digital Vouchers",
  "E-PINs",
  "Business",
  "Support"
];

export const marketplaceTabs = [
  "Visa",
  "Mastercard",
  "eGift",
  "Physical",
  "Multi-brand",
  "Top up",
  "Business"
];

export const featuredProducts = [
  {
    id: "visa-virtual",
    name: "CSS Virtual Visa Gift Card",
    category: "Gift Cards",
    priceRange: "US$10 - US$100",
    imageLabel: "Virtual Visa"
  },
  {
    id: "mastercard-digital",
    name: "Mastercard Digital Gift Card",
    category: "Gift Cards",
    priceRange: "US$10 - US$100",
    imageLabel: "Mastercard"
  },
  {
    id: "amazon-egift",
    name: "Amazon eGift Card",
    category: "Digital Vouchers",
    priceRange: "US$10 - US$100",
    imageLabel: "Amazon"
  },
  {
    id: "playstation-store",
    name: "PlayStation Store Card",
    category: "Gaming Cards",
    priceRange: "US$10 - US$100",
    imageLabel: "PS Store"
  }
];

export const bestSellers = [
  "Steam Wallet",
  "Roblox Card",
  "Netflix eGift",
  "Google Play",
  "Apple App Store",
  "Xbox Gift Card"
];

export const occasions = [
  "Birthday",
  "Thank You",
  "Graduation",
  "Wedding",
  "New Home",
  "Travel",
  "Rewards",
  "Team Gifts"
];

export const productShelves = [
  {
    title: "Most Popular Gift Cards",
    description: "Top-selling gift cards customers trust for instant gifting, rewards, and quick purchases.",
    items: featuredProducts
  },
  {
    title: "Gaming Gift Cards",
    description: "Prepaid gaming value for console, mobile, wallet, and subscription-based purchases.",
    items: [
      {
        id: "steam",
        name: "Steam Wallet Code",
        category: "Gaming Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Steam"
      },
      {
        id: "xbox",
        name: "Xbox Gift Card",
        category: "Gaming Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Xbox"
      },
      {
        id: "roblox",
        name: "Roblox Gift Card",
        category: "Gaming Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Roblox"
      }
    ]
  },
  {
    title: "App Store Cards",
    description: "Digital value for apps, subscriptions, games, and content across leading app ecosystems.",
    items: [
      {
        id: "apple",
        name: "Apple App Store Card",
        category: "App Store Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Apple"
      },
      {
        id: "google",
        name: "Google Play Gift Card",
        category: "App Store Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Google Play"
      },
      {
        id: "nintendo",
        name: "Nintendo eShop Card",
        category: "Gaming Cards",
        priceRange: "US$10 - US$100",
        imageLabel: "Nintendo"
      }
    ]
  },
  {
    title: "Digital Vouchers",
    description: "Flexible digital vouchers for retail, entertainment, telecom, and lifestyle purchases.",
    items: [
      {
        id: "spotify",
        name: "Spotify Premium Voucher",
        category: "Digital Vouchers",
        priceRange: "US$10 - US$100",
        imageLabel: "Spotify"
      },
      {
        id: "netflix",
        name: "Netflix Gift Card",
        category: "Digital Vouchers",
        priceRange: "US$10 - US$100",
        imageLabel: "Netflix"
      },
      {
        id: "digicel",
        name: "Digicel Top-Up E-PIN",
        category: "E-PINs",
        priceRange: "US$10 - US$100",
        imageLabel: "Top-Up"
      }
    ]
  }
];

export const productCatalog = [
  ...featuredProducts,
  ...productShelves.flatMap((section) => section.items)
];

export const valueOptions = [10, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100];

export const customerOrders = [
  {
    id: "CSS-84021",
    item: "PlayStation Store Card",
    amount: "US$50",
    status: "Delivered"
  },
  {
    id: "CSS-84022",
    item: "Amazon eGift Card",
    amount: "US$25",
    status: "Processing"
  }
];

export const purchasedCodes = [
  {
    id: "CODE-001",
    item: "PlayStation Store Card",
    amount: "US$50",
    code: "PSN-84TK-19QW-66AZ",
    pin: "9921",
    status: "Available"
  },
  {
    id: "CODE-002",
    item: "Steam Wallet Code",
    amount: "US$25",
    code: "STM-24LP-71ZX-51KD",
    pin: "4410",
    status: "Downloaded"
  }
];

export const adminSummary = [
  { label: "Products", value: "126" },
  { label: "Orders", value: "342" },
  { label: "Customers", value: "209" },
  { label: "Failed Orders", value: "04" }
];

export const adminTables = {
  orders: [
    ["CSS-84021", "PlayStation Store Card", "Delivered"],
    ["CSS-84022", "Amazon eGift Card", "Processing"],
    ["CSS-84023", "Netflix Gift Card", "Failed"]
  ],
  deliveryLogs: [
    ["Gift card issued", "CSS-84021", "Customer dashboard"],
    ["Payment placeholder approved", "CSS-84022", "Awaiting code issue"],
    ["Supplier sync failed", "CSS-84023", "Needs retry"]
  ]
};
