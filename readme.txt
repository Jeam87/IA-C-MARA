# Foto Pro IA

Esta versión conserva la cámara y añade una mejora de fotografía mediante IA real.

## Qué hace
- Captura hasta la resolución que entregue la cámara.
- Comparación ANTES / DESPUÉS.
- Botón "MEJORAR CON IA".
- Super-resolución IA 2x o 4x.
- Guardado de la imagen mejorada.
- El token de IA permanece en el servidor, no en el HTML.

## Instalación
1. Instala Node.js 20+.
2. Abre una terminal en esta carpeta.
3. Ejecuta:
   npm install
4. Configura tu token de Replicate como variable de entorno:
   - Windows PowerShell: `$env:REPLICATE_API_TOKEN="TU_TOKEN"`
   - Linux/Mac: `export REPLICATE_API_TOKEN="TU_TOKEN"`
5. Ejecuta:
   npm start
6. Abre http://localhost:3000

El modelo utilizado es `google/upscaler`, un modelo de super-resolución por IA. El proveedor indica que admite 2x o 4x y actualmente publica un precio de $0.02 por imagen de salida. Verifica el precio vigente antes de ponerlo en producción.
