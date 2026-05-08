# Caya Scoops N Smile Capacitor Android

This Android wrapper loads the live app at:

`https://cayascoopsnsmile.com`

For the Play Store customer app, the wrapper now opens the site in customer-only mode using:

`https://cayascoopsnsmile.com/?portal=customer&androidApp=1`

## What is configured

- Capacitor Android app name: `Caya Scoops N Smile`
- App ID: `com.cayascoopsnsmile.customer`
- Live site loading through Capacitor `server.url`
- Customer-only app mode for the Android wrapper
- In-app navigation for normal web links
- External app handoff only when needed (for non-http/https links)
- Android back button support
- Offline fallback screen
- Internet, network state, and camera permissions
- Splash screen styling and branded app icon resources

## Project files

- Capacitor config: `capacitor.config.json`
- Android project: `android`
- Offline fallback assets: `www`

## Commands

Install dependencies:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

Sync changes into Android:

```powershell
& "C:\Program Files\nodejs\npx.cmd" cap sync android
```

Open in Android Studio:

```powershell
& "C:\Program Files\nodejs\npx.cmd" cap open android
```

Build debug APK:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_SDK_ROOT="$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleDebug
```

Expected APK output:

`android\app\build\outputs\apk\debug\app-debug.apk`

Build release AAB:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_SDK_ROOT="$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat bundleRelease
```

Expected AAB output:

`android\app\build\outputs\bundle\release\app-release.aab`

## Important Play Store notes

- Add your release signing config in Android Studio before Play Store submission.
- Test WiPay redirect and return on a real Android phone.
- Test QR scanning/camera access on-device.
- Keep API keys in Firebase/backend only.
- If the live website changes, run `cap sync android` again before rebuilding.
