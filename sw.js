// BUAI · trabajador en segundo plano: guarda la app para abrirla sin conexión y muestra avisos.
const CACHE = 'buai-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icono-192.png', './icono-512.png', './icono.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); });
// Avisos enviados desde el servidor (versión real: "tu libro vence mañana", "tu reserva está lista")
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { titulo: 'Bibliotecas UAI', texto: 'Tienes un aviso nuevo.' };
  e.waitUntil(self.registration.showNotification(d.titulo, { body: d.texto, icon: 'icono-192.png', badge: 'icono-192.png' }));
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(clients.openWindow('./index.html#prestamos')); });
