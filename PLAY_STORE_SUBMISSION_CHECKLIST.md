# Caya Scoops N Smile Play Store Checklist

This project already has a Capacitor Android wrapper in:

`C:\Users\cindy\OneDrive\Documents\New project\capacitor-android`

## Current status

Ready now:
- Capacitor Android project exists
- App ID: `com.cayascoopsnsmile.customer`
- Live app URL is configured: `https://cayascoopsnsmile.com`
- Android wrapper now opens in customer-only app mode
- Camera permission is enabled for QR scanning
- Internet and network permissions are enabled
- Splash screen assets exist
- Launcher icon assets exist
- Privacy, refund, and support pages already exist in the website
- Compile SDK and target SDK are both set to `36`

Still required before Play Store submission:
- Build a signed release AAB
- Create or connect a release keystore
- Test the app on a real Android phone
- Test WiPay redirect and return on-device
- Test login, cart, checkout, QR scanning, and offline screen
- Prepare Play Store listing assets and text
- Prepare reviewer login/test notes

## Public policy URLs

Use these in Play Console:

- Privacy Policy: `https://cayascoopsnsmile.com/#privacy`
- Refund Policy: `https://cayascoopsnsmile.com/#refund-policy`
- Support Policy: `https://cayascoopsnsmile.com/#support-policy`

## Data Safety summary

The app uses:
- account information
- contact information
- date of birth
- address
- order history
- rewards activity
- support messages
- payment and order status
- security logs for staff/admin activity

It does not require putting secret WiPay keys in the frontend app.

## Play Console listing assets you should prepare

- App name: `Caya Scoops N Smile`
- Short description
- Full description
- App icon: 512 x 512
- Feature graphic: 1024 x 500
- Phone screenshots
- Optional tablet screenshots
- Support email: `cayascoopsnsmile@gmail.com`
- Support phone: `1 (868) 784-4920`
- Website: `https://cayascoopsnsmile.com`

## Suggested short description

Order desserts, earn rewards, track orders, and enjoy Caya Scoops N Smile on Android.

## Suggested full description

Caya Scoops N Smile brings your favorite desserts into one polished mobile app. Browse the menu, place orders, earn loyalty points, unlock rewards, track orders, and manage your customer profile in one easy experience.

Use the app to:
- order ice cream, bubble tea, fruit ice, popcorn, desserts, and party treats
- earn points and redeem rewards
- use referral codes and birthday rewards
- track your orders
- manage your profile and saved details

## Release build steps

From:

`C:\Users\cindy\OneDrive\Documents\New project\capacitor-android`

### 1. Install dependencies

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

### 2. Sync latest web changes into Android

```powershell
& "C:\Program Files\nodejs\npx.cmd" cap sync android
```

### 3. Open in Android Studio

```powershell
& "C:\Program Files\nodejs\npx.cmd" cap open android
```

### 4. In Android Studio

- open `Build > Generate Signed Bundle / APK`
- choose `Android App Bundle`
- create or select your keystore
- build the release bundle

Expected AAB output:

`C:\Users\cindy\OneDrive\Documents\New project\capacitor-android\android\app\build\outputs\bundle\release\app-release.aab`

## Real device test checklist

Test on a real Android phone before upload:

- app opens correctly
- sign up works
- sign in works
- cart updates correctly
- checkout works
- WiPay opens and returns correctly
- reward screens load
- party page loads
- QR/camera permission works
- offline page shows when network is off
- back button works naturally

## Reviewer notes

The Android wrapper is configured as a customer-only app. Staff and admin entry points should not be used in the Play Store build.

## Final submission reminder

Before uploading:
- confirm the live website is the latest version
- confirm Firebase Functions are deployed
- confirm WiPay flow works on phone
- confirm the signed AAB builds successfully
