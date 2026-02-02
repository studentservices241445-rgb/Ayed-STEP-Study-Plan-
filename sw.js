// sw.js (v3)
const CACHE='ayed-step-planner-v3';
const CORE=[
'./','./index.html','./test.html','./results.html','./quiz.html','./progress.html','./faq.html','./support.html','./privacy.html','./terms.html','./offline.html','./print.html',
'./assets/styles.css','./assets/app.js','./assets/site-data.js','./assets/test.js','./assets/results.js','./assets/quiz.js','./assets/progress.js','./assets/support.js','./assets/print.js',
'./assets/questions.json','./assets/icon.svg','./manifest.json'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)));self.clients.claim();})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    try{
      const net=await fetch(e.request);
      const c=await caches.open(CACHE); c.put(e.request, net.clone());
      return net;
    }catch(err){
      return (await caches.match(e.request)) || (await caches.match('./offline.html'));
    }
  })());
});