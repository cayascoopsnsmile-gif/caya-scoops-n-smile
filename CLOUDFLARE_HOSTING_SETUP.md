# Cloudflare Hosting Setup

This project is prepared to sit behind Cloudflare while keeping Firebase Hosting, Firebase Auth, Firestore, and Cloud Functions as the backend.

## Subdomains

Point these hostnames to the same hosted frontend:

- `cayascoopsnsmile.com`
- `app.cayascoopsnsmile.com`
- `pos.cayascoopsnsmile.com`
- `admin.cayascoopsnsmile.com`

Recommended routing behavior:

- `cayascoopsnsmile.com` -> customer website shell
- `app.cayascoopsnsmile.com` -> APK/mobile shell
- `pos.cayascoopsnsmile.com` -> POS/cashier shell
- `admin.cayascoopsnsmile.com` -> admin dashboard shell

## Cloudflare DNS

Create DNS records for the root domain and the three subdomains. If you continue using Firebase Hosting, use the Firebase Hosting DNS targets for each hostname and keep Cloudflare proxy enabled only after the records validate cleanly.

## Cloudflare SSL

Use:

- SSL/TLS mode: `Full (strict)`

Recommended:

- Always Use HTTPS: `On`
- Automatic HTTPS Rewrites: `On`

## Firebase Auth

Firebase Auth must allow every production hostname in the Firebase Console.

Add these Authorized Domains:

- `cayascoopsnsmile.com`
- `app.cayascoopsnsmile.com`
- `pos.cayascoopsnsmile.com`
- `admin.cayascoopsnsmile.com`
- `caya-scoops-n-smile-5026d.web.app`
- `caya-scoops-n-smile-5026d.firebaseapp.com`

Without this, sign-in can fail across subdomains even if hosting works.

## Cloud Functions / CORS

The backend now accepts production HTTPS requests from:

- `https://cayascoopsnsmile.com`
- `https://app.cayascoopsnsmile.com`
- `https://pos.cayascoopsnsmile.com`
- `https://admin.cayascoopsnsmile.com`
- Firebase Hosting fallback domains

Optional environment variable for extra origins:

- `ALLOWED_CORS_ORIGINS`

Format:

```text
https://example.com,https://another.example.com
```

## SPA Routing

SPA fallback is enabled in `firebase.json`:

- all routes rewrite to `/index.html`

That supports direct loads on routes and hash-free navigation behind Cloudflare.

## Cache Strategy

Configured in `firebase.json`:

- long cache for images/fonts/static assets
- revalidate HTML immediately
- HSTS and basic security headers for HTML responses

This keeps images fast while ensuring content pages refresh properly.

## APK / WebView

The app shells now choose the correct canonical origin when loaded from:

- `app.cayascoopsnsmile.com`
- `pos.cayascoopsnsmile.com`
- `admin.cayascoopsnsmile.com`
- Firebase Hosting fallback domains

That helps:

- WiPay return URLs
- cross-subdomain app links
- mobile webview stability

## Final Checks

Before switching traffic fully through Cloudflare:

1. Confirm all four domains resolve over HTTPS
2. Confirm Firebase Auth Authorized Domains include all four domains
3. Test customer login
4. Test admin login
5. Test cashier login
6. Test one checkout flow
7. Test one APK/webview flow
