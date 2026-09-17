import { fal } from "@fal-ai/serverless-client";
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  try{
    const { image } = req.body;
    const result = await fal.subscribe("fal-ai/esrgan", {
      input: { image_url: image, scale: 2, model: "RealESRGAN_x4plus" },
      credentials: process.env.FAL_KEY
    });
    res.json({ url: result.image.url });
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
