import express from "express";
import multer from "multer";
import Replicate from "replicate";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

app.use(express.static(__dirname));

app.post("/api/enhance", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({error:"Falta configurar REPLICATE_API_TOKEN en el servidor."});
    }
    if (!req.file) return res.status(400).json({error:"No se recibió la fotografía."});

    const scale = req.body.scale === "x4" ? "x4" : "x2";
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const output = await replicate.run("google/upscaler", {
      input: {
        image: dataUri,
        upscale_factor: scale,
        compression_quality: 92
      }
    });

    const url = typeof output === "string" ? output : output?.url?.() || output?.url;
    if (!url) throw new Error("La IA no devolvió una imagen.");
    res.json({url});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:e.message || "Error procesando la imagen con IA."});
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Foto Pro IA funcionando en http://localhost:${process.env.PORT || 3000}`)
);
