export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'POST'});
  try {
    const { image } = req.body; 
    if (!process.env.FAL_KEY) return res.status(500).json({error:'FAL_KEY no configurada en Vercel'});

    const FAL_KEY = process.env.FAL_KEY.trim();
    
    // INTENTO 1: Pasar directo el base64 como data URI (fal lo acepta si es < 5MB)
    // Si falla, hacemos el flujo de 2 pasos
    let imageUrl = image; // el base64 ya viene como data:image/jpeg;base64,...

    let runRes, runJson;
    try {
      runRes = await fetch('https://queue.fal.run/fal-ai/esrgan', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { image_url: imageUrl, scale: 2 }
        })
      });
      runJson = await runRes.json();
    } catch(e){ runJson = null; }

    // Si fal no aceptó el base64 directo, subimos por storage
    if (!runJson || runJson.detail || !runJson.request_id) {
      // 1. Iniciar subida
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      const initRes = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_name: "pastel.jpg", content_type: "image/jpeg" })
      });
      const initJson = await initRes.json();
      if (!initJson.upload_url) throw new Error('Init upload falló: '+JSON.stringify(initJson));

      // 2. Subir bytes al URL firmado
      await fetch(initJson.upload_url, { method: 'PUT', body: buffer, headers: { 'Content-Type': 'image/jpeg' } });
      
      imageUrl = initJson.file_url;

      // 3. Ahora sí correr ESRGAN
      runRes = await fetch('https://queue.fal.run/fal-ai/esrgan', {
        method: 'POST',
        headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { image_url: imageUrl, scale: 2 } })
      });
      runJson = await runRes.json();
    }

    if (!runJson.request_id && !runJson.response) throw new Error(JSON.stringify(runJson));

    // Esperar resultado (polling)
    let resultUrl = runJson.response?.image?.url;
    if (!resultUrl && runJson.status_url) {
      for(let i=0;i<25;i++){
        await new Promise(r=>setTimeout(r,1500));
        let s = await fetch(runJson.status_url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
        let sj = await s.json();
        if(sj.status==='COMPLETED' || sj.response?.image?.url){
          resultUrl = sj.response?.image?.url || sj.response?.image_url || sj.response?.image;
          if(resultUrl) break;
        }
      }
    }
    resultUrl = resultUrl || runJson.response?.image?.url;
    if(!resultUrl) throw new Error('Sin URL final: '+JSON.stringify(runJson));

    res.json({ url: resultUrl });
  } catch(e) {
    console.error(e);
    res.status(500).json({error: e.message});
  }
} 
