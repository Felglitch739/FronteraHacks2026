const CACHE_NAME = 'aurafit-v3';
const ASSETS_TO_CACHE = ['/offline.html'];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                    // Ignore errors if some assets aren't available yet
                    console.log(
                        '[Service Worker] Some assets failed to cache, continuing...',
                    );
                });
            })
            .then(() => self.skipWaiting()),
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(
                                '[Service Worker] Deleting old cache:',
                                cacheName,
                            );
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

// Fetch event - prefer network, fallback to cache only if offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip hot reload and manifest requests during dev
    if (url.pathname === '/hot' || url.pathname.includes('manifest')) {
        return;
    }

    // Network first for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => {
                // Return cached version or offline response
                return caches.match(request).then((cachedResponse) => {
                    return (
                        cachedResponse ||
                        new Response('Offline', { status: 503 })
                    );
                });
            }),
        );
        return;
    }

    // Network first for static assets so CSS/JS updates immediately
    if (
        url.pathname.match(
            /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i,
        )
    ) {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    if (request.destination === 'image') {
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ddd" width="100" height="100"/></svg>',
                            {
                                headers: {
                                    'Content-Type': 'image/svg+xml',
                                },
                            },
                        );
                    }

                    return new Response('Offline', { status: 503 });
                });
            }),
        );
        return;
    }

    // Network first for pages so the UI always reflects the newest build
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match('/offline.html').then((cachedResponse) => {
                return (
                    cachedResponse || new Response('Offline', { status: 503 })
                );
            });
        }),
    );
});

// Push notification support
self.addEventListener('push', (event) => {
    let payload = {
        title: 'Aurafit',
        body: 'New notification',
        data: {
            timestamp: Date.now(),
            url: '/dashboard',
        },
    };

    if (event.data) {
        try {
            // Try normal JSON parse
            let parsed = event.data.json();

            // 🔥 Handle double-encoded JSON
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    console.warn('Double parse failed, using raw string');
                    payload.body = parsed;
                }
            }

            if (typeof parsed === 'object') {
                payload = {
                    title: parsed.title || payload.title,
                    body: parsed.body || payload.body,
                    data: {
                        ...payload.data,
                        ...(parsed.data || {}),
                    },
                };
            }
        } catch (err) {
            // Fallback: treat as text
            try {
                const textPayload = event.data.text();
                console.warn('Fallback to text:', textPayload);

                let parsedText;

                try {
                    parsedText = JSON.parse(textPayload);

                    payload = {
                        title: parsedText.title || payload.title,
                        body: parsedText.body || payload.body,
                        data: {
                            ...payload.data,
                            ...(parsedText.data || {}),
                        },
                    };
                } catch (e) {
                    // Raw string (not JSON at all)
                    payload.body = textPayload || payload.body;
                }
            } catch (e) {
                console.error('Failed to parse push payload completely');
            }
        }
    }

    const options = {
        body: payload.body,
        icon: '/android-icon-192x192.png',
        badge: '/favicon-96x96.png',
        vibrate: [100, 50, 100],
        data: payload.data,
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if ('focus' in client) {
                        client.navigate(targetUrl);
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }

                return undefined;
            }),
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-food-entries') {
        event.waitUntil(
            // Retry syncing food entries
            fetch('/api/sync-food-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch((err) => {
                console.log('[Service Worker] Background sync failed:', err);
            }),
        );
    }
});
