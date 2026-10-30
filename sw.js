const V='riwaq-v4',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','css/style.css','js/app.js','js/onboard.js','js/quran.js','js/pwa.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url),own=u.origin===location.origin,api=u.hostname==='api.alquran.cloud';if(!own&&!api)return;
e.respondWith(caches.open(V).then(c=>c.match(e.request,{ignoreSearch:own}).then(m=>{const n=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>m);return m||n})))});
