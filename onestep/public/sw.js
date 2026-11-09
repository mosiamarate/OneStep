const CACHE_NAME = "onestep-cache-v2";

const APP_SHELL = [
  "/",
  "/auth/login",
  "/auth/signup",
];

const STATIC_ASSET_PREFIXES = ["/_next/static/", "/icons/", "/sounds/"];

function isPublicStaticAsset(request, url) {
  return (
    !request.headers.has("authorization") &&
    !url.pathname.startsWith("/api/") &&
    ["font", "image", "script", "style"].includes(request.destination) &&
    STATIC_ASSET_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedShell = await caches.match(event.request);
        return cachedShell || caches.match("/");
      })
    );
    return;
  }

  if (!isPublicStaticAsset(event.request, url)) return;

  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        if (response.ok && response.type === "basic") {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          } catch {
            console.warn("Unable to cache public static asset.");
          }
        }

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || Response.error();
      })
  );
});