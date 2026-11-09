# Progressive web app behavior

## Implemented pieces

- `src/app/manifest.ts` supplies the name, description, standalone display mode, portrait orientation, theme/background color, `/dashboard` start URL, and 192/512px icons.
- `src/app/layout.tsx` links the manifest and Apple web-app metadata/icons.
- `PWARegister` registers `/sw.js` after browser load only when `NODE_ENV === "production"`.
- `InstallPromptProvider` listens for the browser `beforeinstallprompt` and `appinstalled` events. `InstallAppButton` appears only when the browser exposes an install prompt and the app is not considered standalone.
- The focus page can open a document Picture-in-Picture mini timer in browsers that support `window.documentPictureInPicture`; it is not a PWA background timer.
- Focus completion plays a local MP3 unless browser local storage has `onestep-completion-sound=off`. There is no Web Push, Firebase Cloud Messaging, or Notification API implementation.

## Service-worker cache policy

`public/sw.js` uses cache name `onestep-cache-v2`.

1. Install pre-caches `/`, `/auth/login`, and `/auth/signup`.
2. Activate removes caches with a different name and claims clients.
3. Navigations use the network and fall back only to a precached public shell page; navigation responses are not added to Cache Storage.
4. Only same-origin static font, image, script, and style assets under `/_next/static/`, `/icons/`, and `/sounds/` are cacheable. API paths and requests with an `Authorization` header are excluded.
5. On static-asset network failure, it returns a matching cached asset or a network error. Authenticated/API responses are never used as the offline fallback.

This is not an offline-first implementation and does not deliberately cache all assets ahead of time. A successful public static response must first have been requested while online.

## Current risks and limits

- Dynamic pages and API responses are deliberately not cached. The JSON export endpoint also returns `Cache-Control: no-store`.
- Cache invalidation is manual through the hard-coded cache name. Cache name was incremented to v2 so older runtime entries are removed on activation.
- The worker does not implement background sync, offline writes, push events, notification events, or a precache manifest.
- The install prompt is browser-dependent and cannot be forced; iOS does not expose the same prompt event.
- The update prompt checks `/api/app-version` every five minutes and offers a page reload when its bundled version differs. It does not itself update the service-worker cache name.

Any cache-policy change should be tested in browser developer tools with Cache Storage inspection, authenticated navigation, an export attempt, offline behavior, and an old-service-worker upgrade path.
