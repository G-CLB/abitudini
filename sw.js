// Service worker: salva i file nel telefono per usare l'app offline.
// IMPORTANTE: se modifichi index.html, cambia il numero di VERSIONE qui sotto,
// altrimenti il telefono continua a usare la copia vecchia.
const VERSIONE = 'abitudini-v2';
const FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
