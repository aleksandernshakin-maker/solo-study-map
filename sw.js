const VERSION='solo-study-map-final-r1-2026-09-13';
const CACHE=`${VERSION}-shell`;
const SHELL=['./','./index.html','./style.css','./app.js','./layout-worker.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('solo-study-map-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try{
      const response=await fetch(event.request);
      if(response && response.ok && SHELL.some(p=>url.pathname.endsWith(p.replace('./','/')))){
        const cache=await caches.open(CACHE); cache.put(event.request,response.clone());
      }
      return response;
    }catch(err){
      if(event.request.mode==='navigate') return (await caches.match('./index.html')) || Response.error();
      throw err;
    }
  })());
});
self.addEventListener('message',event=>{ if(event.data?.type==='SKIP_WAITING') self.skipWaiting(); });
