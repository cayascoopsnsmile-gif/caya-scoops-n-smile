# Cloudflare Pages Deployment

This project is ready to move the frontend to Cloudflare Pages while keeping Firebase for:

- Authentication
- Firestore
- Storage

## What is already prepared

- SPA fallback routing via [`_redirects`](C:\Users\cindy\OneDrive\Documents\New project\_redirects)
- Cloudflare Pages headers via [`_headers`](C:\Users\cindy\OneDrive\Documents\New project\_headers)
- HTTPS-only asset references in the app shells
- Subdomain-aware origin helpers in:
  - [`C:\Users\cindy\OneDrive\Documents\New project\index.html`](C:\Users\cindy\OneDrive\Documents\New project\index.html)
  - [`C:\Users\cindy\OneDrive\Documents\New project\customer-apk.html`](C:\Users\cindy\OneDrive\Documents\New project\customer-apk.html)

## Cloudflare Pages project settings

When creating the Pages project from GitHub:

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`
- Root directory: `/` (project root)

## GitHub integration

Official docs:

- [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)

## Custom domains

Attach these to the Pages project:

- `cayascoopsnsmile.com`
- `www.cayascoopsnsmile.com`

If you later want subdomain-specific frontends, also attach:

- `app.cayascoopsnsmile.com`
- `pos.cayascoopsnsmile.com`
- `admin.cayascoopsnsmile.com`

Official docs:

- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Firebase Auth authorized domains

In Firebase Console -> Authentication -> Settings -> Authorized domains, add:

- `cayascoopsnsmile.com`
- `www.cayascoopsnsmile.com`
- `app.cayascoopsnsmile.com`
- `pos.cayascoopsnsmile.com`
- `admin.cayascoopsnsmile.com`
- `caya-scoops-n-smile-5026d.web.app`
- `caya-scoops-n-smile-5026d.firebaseapp.com`

## DNS cleanup after Pages is live

In Cloudflare DNS, remove old Firebase Hosting records for the website frontend once Pages is active.

Typical old Firebase records to remove if present:

- A / AAAA / CNAME records pointing frontend traffic to Firebase Hosting
- verification records created only for Firebase Hosting custom domains

Do **not** remove records used by:

- email
- other services
- Firebase / Google verification that you still need for backend ownership

## Notes

- Firebase Hosting is no longer needed for the frontend once Pages is serving production traffic.
- Firebase backend services can continue working normally behind Cloudflare Pages.
