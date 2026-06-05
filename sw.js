const CACHE_NAME = 'subash-portfolio-cache-v1';
const ASSETS = [
    './index-v2.html',
    './index.html',
    './Subash_Uduwaka_CV1.pdf',
    './404.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request).catch(() => {
                // If offline and request is an HTML page, route to index-v2.html
                if (e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
