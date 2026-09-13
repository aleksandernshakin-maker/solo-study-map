const CACHE='solo-study-map-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./world-bg-v3.png','./icon-192.png','./icon-512.png','./ice-dragon.png','./gold-knight.png','./fire-demon.png','./forest-guardian.png','./shadow-wraith.png','./hell-lord.png','./final-boss.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).then(r=>{let c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))));
