/* Skarby wiedzy. Nowa wersja zmienia VERSION, żeby stary schowek zszedł z drogi. */
const VERSION = "skarb-v7";
const SHELL_CACHE = `${VERSION}-shell`;
const PHOTO_CACHE = `${VERSION}-photos`;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./css/theme.css",
  "./css/fonts.css",
  "./js/actions.js",
  "./js/audience.js",
  "./js/avatars.js",
  "./js/dom.js",
  "./js/geo-info.js",
  "./js/main.js",
  "./js/progress.js",
  "./js/registry.js",
  "./js/review.js",
  "./js/rewards.js",
  "./js/sky.js",
  "./js/storage.js",
  "./js/util.js",
  "./js/views.js",
  "./js/xp.js",
  "./js/data/breeds.js",
  "./js/data/countries.js",
  "./js/data/poland.js",
  "./js/data/poland-map.js",
  "./js/data/spelling.js",
  "./js/data/spelling-hard.js",
  "./js/data/spelling-more.js",
  "./js/modules/geography.js",
  "./js/modules/math.js",
  "./js/modules/poland.js",
  "./js/modules/spelling.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/art/favicon.svg",
  "./assets/art/gwiazda.svg",
  "./assets/art/gwiazda-pusta.svg",
  "./assets/art/przedmiot-geografia.svg",
  "./assets/art/przedmiot-historia.svg",
  "./assets/art/przedmiot-matematyka.svg",
  "./assets/art/przedmiot-polski.svg",
  "./assets/art/przedmiot-przyroda.svg",
  "./assets/art/wyprawa.svg",
  "./assets/avatars/kot.svg",
  "./assets/avatars/pies.svg",
  "./assets/avatars/niedzwiedz.svg",
  "./assets/avatars/dinozaur.svg",
  "./assets/avatars/komputer.svg",
  "./assets/avatars/gora.svg",
  "./assets/avatars/genealog.svg",
  "./assets/avatars/kwiat.svg",
  "./assets/avatars/owoc.svg",
  "./assets/avatars/rodzic.svg",
  "./assets/fonts/fredoka-latin-600.woff2",
  "./assets/fonts/fredoka-latin-700.woff2",
  "./assets/fonts/fredoka-latin-ext-600.woff2",
  "./assets/fonts/fredoka-latin-ext-700.woff2",
  "./assets/fonts/outfit-latin-400.woff2",
  "./assets/fonts/outfit-latin-ext-400.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== SHELL_CACHE && key !== PHOTO_CACHE)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isCode(url) {
  return url.pathname.endsWith(".js")
    || url.pathname.endsWith(".css")
    || url.pathname.endsWith(".html")
    || url.pathname.endsWith(".webmanifest")
    || url.pathname.endsWith("/");
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request) || await cache.match("./index.html");
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(PHOTO_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate" || isCode(url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.pathname.includes("/assets/")) {
    event.respondWith(cacheFirst(request));
  }
});
