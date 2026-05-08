# Firebase Security Rules

This project now has Firestore rules in:

`firestore.rules`

The Firebase config points to those rules in:

`firebase.json`

## Deploy Rules

Install Firebase CLI if needed:

```powershell
npm install -g firebase-tools
```

Then deploy only Firestore rules:

```powershell
cd "C:\Users\cindy\OneDrive\Documents\New project"
firebase login
firebase deploy --only firestore:rules
```

## Important Security Note

The current app uses Firebase Auth for customer accounts, but cashier/admin login IDs
are checked in the browser from the `staffRoles` collection.

Because Firestore rules cannot trust a browser-only cashier session, `staffRoles` read
access must remain open until staff login is moved to Firebase Auth custom claims or a
backend Cloud Function login flow.

Recommended next security upgrade:

1. Create Firebase Auth accounts for staff.
2. Add custom claims such as `admin`, `manager`, and `cashier`.
3. Update rules to check `request.auth.token.role`.
4. Close public reads on `staffRoles`.

## Quick Manual Tests After Deploy

- Customer can log in and see their own dashboard.
- Customer cannot see another customer's private profile.
- Customer can place an order.
- Admin owner email can load customers, sales, menu, rewards, and reports.
- Admin owner email can edit menu/settings.
- Staff login still opens with current compatibility rules.
