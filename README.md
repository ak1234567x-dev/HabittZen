# HabitZen starter

Luxury black/gold responsive web app starter with:
- Habit list and daily completion stored in browser local storage
- Fitness session log and optional weight entry stored locally
- Recovery urge check-in, breathing timer and private local journal
- PWA manifest/service worker
- Planned ₹31/month Premium modal (no payment processing)
- Capacitor configuration starter for Android packaging

## Important limitations
This is a front-end starter, not a production service. It has no real account system, secure cloud sync, subscription verification, payment gateway, analytics backend, or device-wide website blocking. Data is browser-local and can be lost when browser data is cleared. The journal is not encrypted; avoid shared devices. The streak display is only a simple demo placeholder, not a historical streak calculation.

## Preview locally
Open `index.html` in a modern browser. For PWA/service worker testing, serve the folder over localhost or HTTPS.

## Publish a static demo
1. Create a GitHub repository and upload these files.
2. In repository Settings → Pages, choose a branch and root folder as the publishing source.
3. Wait for GitHub Pages to publish and use the URL shown in Settings → Pages.

**Hosting policy note:** GitHub Pages is intended for static sites and is not permitted as free hosting for a site primarily operating as a commercial business or SaaS. Use it for a portfolio/demo or public project page only; choose suitable app hosting before launching paid subscriptions or a commercial service. See https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Android packaging
Capacitor is the intended route to package the web experience as an Android app. It requires Node.js and Android Studio/Android SDK for building. These files are only the starter; the native Android project and build/signing process still need to be generated and tested.

Official docs: https://capacitorjs.com/docs
- Install Node.js (Capacitor v8 requires Node 22+).
- In a terminal in this folder, install Capacitor packages, initialize/sync the Android platform and open it in Android Studio following the official guide.
- Test the Android app on a physical device before release.

A Play Store release may require a developer account fee, privacy policy, store listing, app signing and policy compliance. Pricing/requirements can change; check Google Play Console before publishing.

## Before charging ₹31/month
Choose app-appropriate hosting and a backend; implement authentication, database access controls, server-side payment verification, subscription entitlements, privacy policy, data export/deletion and security testing. Do not trust a client-side “Premium” flag as proof of payment.

## Branding
The interface, favicon and app icon use HabitZen branding. GitHub may still appear in the hosting URL (`github.io`) and browser address bar. A custom domain can replace the hosting URL if configured and purchased separately; it does not remove the browser's normal address bar. No Floot/Replit logo is included in this source project.
