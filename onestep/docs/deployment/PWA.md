# Progressive web app behavior

## Implemented pieces

- `src/app/manifest.ts` supplies the name, description, standalone display mode, portrait orientation, theme/background color, `/dashboard` start URL, and 192/512px icons.
- `src/app/layout.tsx` links the manifest and Apple web-app metadata/icons.
- `PWARegister` registers `/sw.js` after browser load only when `NODE_ENV === "production"`.
- `InstallPromptProvider` listens for the browser `beforeinstallprompt` and `appinstalled` events. `InstallAppButton` appears only when the browser exposes an install prompt and the app is not considered standalone.
- The focus page can open a document Picture-in-Picture mini timer in browsers that support `window.documentPictureInPicture`; it is not a PWA background timer.
- Focus completion plays a local MP3 unless browser local storage has `onestep-completion-sound=off`. There is no Web Push, Firebase Cloud Messaging, or Notification API implementation.

## Service-worker cache policy

`public/sw.js` uses cache name `onestep-cache-v1`.

1. Install pre-caches `/`, `/auth/login`, and `/auth/signup`.
2. Activate removes caches with a different name and claims clients.
3. For same-origin `GET` requests, the worker attempts the network first, unconditionally puts a clone of the response in Cache Storage, and returns that response.
4. On network failure, it returns a matching cached response or the cached `/` response.

This is not an offline-first implementation and does not deliberately cache all assets ahead of time. A successful response must first have been requested while online.

## Current risks and limits

- The worker does not exclude authenticated pages, API responses, or the JSON export route. A same-origin GET response can therefore be written to Cache Storage, subject to browser caching rules. This should be reviewed before treating browser storage as free of personal data.
- Cache invalidation is manual through the hard-coded cache name. Changing application files without changing the cache name can leave prior runtime entries available until normal replacement/clearing behavior.
- The worker does not implement background sync, offline writes, push events, notification events, or a precache manifest.
- The install prompt is browser-dependent and cannot be forced; iOS does not expose the same prompt event.
- The update prompt checks `/api/app-version` every five minutes and offers a page reload when its bundled version differs. It does not itself update the service-worker cache name.

Any cache-policy change should be tested in browser developer tools with Cache Storage inspection, authenticated navigation, an export attempt, offline behavior, and an old-service-worker upgrade path.
