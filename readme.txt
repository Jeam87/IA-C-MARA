# Foto Pro

Cámara web (PWA) pensada para tomar fotos nítidas y con aspecto profesional desde el celular, sin necesitar servidor ni cuentas externas. Funciona sin internet después de abrirla una vez.

## Qué hace
- Toma la foto real del sensor (hasta unos 12 MP) en lugar de capturar un fotograma de video.
- Modo Pro: toma una ráfaga de 3 fotos y se queda solo con la más nítida, para reducir fotos movidas.
- Look cámara profesional: nitidez fina, contraste local, balance de blancos suave, curva de contraste y color un poco más rico.
- HDR opcional (apagado por defecto): 3 exposiciones fusionadas. Requiere quedarse quieto unos 2 segundos.
- Enfoque y medición de luz automáticos: sobre la cara si la detecta, y si no, en el centro. Al tocar la pantalla manda lo que tocaste.
- Detector de caras (MediaPipe): dibuja un cuadro verde sobre las caras. Solo detecta caras; no detecta lentes ni cambia la calidad de la foto.
- Control de exposición (EV), zoom, cambio de cámara, linterna y marca de agua opcional.
- Guardar en Fotos mediante el menú de compartir del celular, o descargar el archivo.

## Archivos
- index.html: la aplicación completa.
- sw.js: guarda la app en el celular para que abra sin internet.
- manifest.json: permite instalarla como app (Instalar app / Añadir a pantalla principal).
- icon-192.png, icon-512.png, logo-512.png: íconos y logo.
- server.js, package.json: servidor opcional para probar en la computadora.

## Cómo usarla
1. Sube todos los archivos a tu hosting, juntos en la misma carpeta. Debe abrirse por https (la cámara lo exige).
2. Abre la app con internet y espera a que aparezca "IA lista". Ahí se guarda todo en el celular.
3. Cierra y vuelve a abrir. Desde ese momento funciona también sin internet.
4. Opcional: en el menú de Chrome elige "Instalar app" para tener el ícono en la pantalla principal.

## Probar en la computadora
1. Instala Node.js 20+.
2. En esta carpeta ejecuta: npm install
3. Ejecuta: npm start
4. Abre http://localhost:3000

## Notas
- Para actualizar, reemplaza index.html. El celular toma la versión nueva cuando tiene internet.
- Algunas funciones (HDR, enfoque automático, exposición) dependen de que el celular las permita desde Chrome. Si no, la foto sale como una foto normal.
- La primera vez necesita internet para descargar el detector de caras.
- Guardar en Fotos abre el menú de compartir: elige "Guardar imagen" o "Galería". Una página web no puede escribir directo en la galería.
- El servidor con Replicate (server.js, ruta /api/enhance) viene de una versión anterior y esta app ya no lo usa. No hace falta configurar ningún token.
