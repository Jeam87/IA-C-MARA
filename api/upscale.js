export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'POST'});
  try {
    const { image } = req.body; // base64
    if (!process.env.FAL_KEY) return res.status(500).json({error:'FAL_KEY no configurada en Vercel'});

    // 1. Convertir base64 a blob y subir a storage de fal
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const uploadRes = await fetch('https://rest.alpha.fal.ai/storage/upload', {
      method: 'POST',
      headers: { 'Authorization': `Key ${process.env.FAL_KEY}`, 'Content-Type': 'image/jpeg' },
      body: buffer
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson.url) throw new Error('Upload fal falló: '+JSON.stringify(uploadJson));
    const imageUrl = uploadJson.url;

    // 2. Llamar a Real-ESRGAN
    const runRes = await fetch('https://queue.fal.run/fal-ai/esrgan', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { image_url: imageUrl, scale: 2, model: "RealESRGAN_x4plus" }
      })
    });
    const runJson = await runRes.json();
    
    // esperar resultado
    let statusUrl = runJson.status_url || runJson.response?.url || runJson.detail;
    // polling simple
    let resultUrl = null;
    for(let i=0;i<20;i++){
      await new Promise(r=>setTimeout(r,1000));
      let s = await fetch(runJson.status_url, { headers: { 'Authorization': `Key ${process.env.FAL_KEY}` } });
      let sj = await s.json();
      if(sj.status==='COMPLETED' && sj.response?.image?.url){ resultUrl=sj.response.image.url; break; }
      if(sj.response?.image?.url){ resultUrl=sj.response.image.url; break; }
    }
    if(!resultUrl) resultUrl = runJson.response?.image?.url || runJson.image?.url;
    if(!resultUrl) throw new Error('No URL result: '+JSON.stringify(runJson));

    res.json({ url: resultUrl });
  } catch(e) {
    console.error(e);
    res.status(500).json({error: e.message});
  }
}
