# Web de Privvmat3oo con estadisticas en vivo

Contenido:
- index.html: la pagina (ingles/espanol)
- api/stats.js: servidor pequeno que pide a Roblox jugadores, visitas, favoritos, likes y la imagen del juego
- assets/: tu avatar

## Subir a Vercel (opcion 1: GitHub, sin instalar nada)
1. Crea una cuenta en github.com y un repositorio nuevo (ej. "mi-web").
2. En el repositorio: "Add file" > "Upload files" y sube TODO el contenido de esta carpeta (index.html, package.json, carpeta api y carpeta assets). Confirma con "Commit".
3. Entra a vercel.com, inicia sesion con GitHub, pulsa "Add New" > "Project", elige el repositorio y pulsa "Deploy".
4. En un minuto tendras tu link (algo.vercel.app). Las estadisticas se actualizan solas cada minuto.

## Opcion 2: con la terminal (PC)
1. Instala Node.js, luego: npm i -g vercel
2. Dentro de esta carpeta: vercel   (sigue las preguntas)  y despues: vercel --prod

## Cambiar de juego
En api/stats.js cambia PLACE_ID por el place id del juego (el numero que aparece en el link roblox.com/games/NUMERO).
