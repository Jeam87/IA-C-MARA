const C='fotopro-v1',V='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
const PRE=[V+'vision_bundle.mjs',V+'wasm/vision_wasm_internal.js',V+'wasm/vision_wasm_internal.wasm','https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(SHELL);await Promise.allSettled(PRE.map(u=>c.add(u)))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const guardar=(r,res)=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.pathname.startsWith('/api/'))return;
  if(/jsdelivr\.net|storage\.googleapis\.com/.test(u.hostname)){
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>guardar(r,res))));return;
  }
  if(u.origin===location.origin){
    const red=fetch(r).then(res=>guardar(r,res));
    e.respondWith(Promise.race([red,new Promise((_,no)=>setTimeout(no,3000))]).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
  }
});
