# luna native app

React Native app built with Expo SDK 58. The Vite design prototype remains in the repository root; this folder contains the native implementation.

## Local development

```sh
npm ci
npx expo start
```

Use Expo Go for UI iteration where the SDK is supported, or create a development build for native video playback. `npm run typecheck` checks TypeScript; `npx expo export --platform all` compiles the Android and iOS JavaScript bundles.

## Mobile builds

EAS Build produces the installable native binaries:

- `preview`: Android APK for internal testing; iOS internal distribution build.
- `production`: Android AAB for Google Play; signed iOS IPA for App Store Connect.

The GitHub Actions workflow **Expo app CI** runs type checks, UI tests, and Android/iOS bundle exports. **EAS mobile builds** runs manually and waits for the selected cloud builds, then downloads the APK/IPA/AAB as GitHub Actions artifacts. Add an `EXPO_TOKEN` repository secret, create/link the app to an Expo account with `npx eas-cli@latest init`, and configure signing credentials in EAS. For Ad Hoc iOS preview installs, register test devices in the Expo account first. Store distribution requires the matching Apple Developer and Google Play accounts and signing setup.

Before release, replace the example identifiers `com.luna.streaming` with identifiers owned by the publisher, add final app icons/splash artwork, connect an authorized HLS/DRM source, and complete privacy/store metadata. The current video player uses a public sample clip for UI demonstration only.

Run `npm install` once after changing dependencies and commit the generated `package-lock.json`; CI uses `npm install` until that lockfile is present.
