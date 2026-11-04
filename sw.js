// Автономная работа: страница сохраняется при первом открытии и обновляется при наличии сети
var CACHE = 'shturman-v4', FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n !== CACHE; }).map(function(n){ return caches.delete(n); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request, { ignoreSearch: true }).then(function(hit){
      var net = fetch(e.request).then(function(r){ if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; });
      if (hit) { net.catch(function(){}); return hit; }
      return net.catch(function(){ return e.request.mode === 'navigate' ? c.match('./index.html') : Response.error(); });
    });
  }));
});
