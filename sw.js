const V="ntrc-v8";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const req=e.request;
  const fresh=(req.mode==="navigate")
    ? new Request(req.url,{cache:"reload",credentials:"same-origin"})   // always ask the network for the page
    : req;
  e.respondWith(fetch(fresh).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(req,c).catch(()=>{}));return r;})
    .catch(()=>caches.match(req).then(m=>m||caches.match("./index.html"))));
});
