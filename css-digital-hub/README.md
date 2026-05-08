# CSS Digital Hub

Luxury React + Tailwind-style digital storefront for premium gift cards and E-PIN commerce.

## Preview locally

Run:

```powershell
node preview-server.js
```

Then open `http://localhost:8090`.

## Structure

- `index.html` boots the app and Tailwind theme.
- `src/App.js` composes the main page sections.
- `src/components/` contains modular UI sections.
- `src/data/siteData.js` contains catalog and dashboard mock data.
- `src/styles.css` provides custom premium surface styling and motion.

## Future integration hooks

- Replace mock product data with EZ PIN API catalog responses.
- Connect auth forms to Firebase Auth or another identity provider.
- Wire contact and checkout flows to payment and messaging backends.
- Expand customer and admin sections into route-based dashboards.
