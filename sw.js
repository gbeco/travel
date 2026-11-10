const CACHE="danang-hoian-planner-v18";
const STATIC_ASSETS=[
  "./manifest.json","./firebase-config.js",
  "./assets/hero-vietnam.svg","./assets/stay-resort.svg",
  "./assets/next-lanterns.svg","./assets/weather-danang.svg"
];
const APP_SHELL=["./","./index.html","./styles.css","./app.js"];

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll([...APP_SHELL,...STATIC_ASSETS]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  const isAppShell = /(?:\/|\/index\.html|\/app\.js|\/styles\.css)$/.test(url.pathname);

  if(isAppShell){
    // Network-first prevents an old app.js/styles.css from surviving a deploy.
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:"no-store"});
        const cache=await caches.open(CACHE);
        cache.put(event.request,fresh.clone());
        return fresh;
      }catch(err){
        return (await caches.match(event.request)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try{
      const fresh=await fetch(event.request);
      const cache=await caches.open(CACHE);
      cache.put(event.request,fresh.clone());
      return fresh;
    }catch(err){
      return Response.error();
    }
  })());
});
