// Recibe lo que se comparte desde otras apps (por ejemplo un audio de WhatsApp)
// y lo deja guardado para que el formulario lo levante. No guarda la web en caché:
// así siempre se ve la última versión publicada.
const CAJA = 'un-mate-juntas-compartido';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'POST' || !url.pathname.endsWith('/compartir')) return;
  e.respondWith((async () => {
    const datos = await e.request.formData();
    const caja = await caches.open(CAJA);
    for (const k of await caja.keys()) await caja.delete(k);
    const archivos = datos.getAll('archivos').filter((f) => f && f.size);
    for (const [i, f] of archivos.entries()) {
      await caja.put(new Request(`compartido-${i}`), new Response(f, {
        headers: { 'Content-Type': f.type || 'application/octet-stream', 'X-Nombre': encodeURIComponent(f.name || `archivo-${i}`) },
      }));
    }
    const texto = [datos.get('titulo'), datos.get('texto')].filter(Boolean).join('\n').trim();
    if (texto) await caja.put(new Request('compartido-texto'), new Response(texto));
    return Response.redirect(new URL('./#nuevo/compartido', self.registration.scope).href, 303);
  })());
});
