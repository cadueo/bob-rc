// Bob RC: guarda a casca do app para abrir rapido; dados (GitHub) sempre da rede.
// cache:"no-cache" = sempre confere com o GitHub Pages (que manda guardar 10 min); offline cai na copia guardada.
const CASCA = "bobrc-v10";
const ARQ = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CASCA).then(c => c.addAll(ARQ))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CASCA).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== "GET") return;
  e.respondWith(fetch(e.request.url, { cache: "no-cache" }).then(r => { const c = r.clone(); caches.open(CASCA).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
