export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const {image_base64}=req.body;

  // sube tu imagen a fal
  const falRes=await fetch('https://queue.fal.run/fal-ai/esrgan', {
    method:'POST',
    headers:{
      'Authorization':`Key ${process.env.FAL_KEY}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      image_url: image_base64, // base64 directo
      scale: 2,
      model: "RealESRGAN_x4plus" // IA REAL
    })
  });
  const data=await falRes.json();
  res.json(data);
}
