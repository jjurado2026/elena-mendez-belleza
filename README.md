# Elena Méndez Medicina Estética — Propuesta de nueva homepage

Prototipo de homepage para **Elena Méndez** ([elenamendez-belleza.com](https://elenamendez-belleza.com/)), centro médico estético y de belleza en C/ Nogal 1, Torrelodones (Madrid), desde 2014. 4,7 en Treatwell con 298 opiniones.

**Prototipo:** https://jjurado2026.github.io/elena-mendez-belleza/

**El problema que resuelve:** su home actual tarda 6,3 s en pintar lo principal en un móvil con 4G lenta, el titular ocupa la primera pantalla entera del móvil sin un solo botón de cita y el chat de WhatsApp se abre solo y tapa casi la mitad de cada pantalla. La propuesta conserva su identidad (blanco y el oro de su logo), sus textos y todo su SEO, y lo convierte en un recorrido de conversión: **encuentra tu tratamiento, mira su precio y su promoción, y pide cita en tres pasos**.

**Estado:** home terminada. Caducidad real: envío el 31-oct-2026, visible hasta el 9-nov a las 23:59 de Madrid.

## v7 (ronda de cambios 7): subir el nivel, vigente

Tras comparar con Tikal, Don Chamberí, Second Bike, Lorena Campillo, Relax Store, Reggae School, OnWhite, Fiestas con Glamour y Velarque (`_interno/herramientas/otros.mjs`): la v6 no tenía estructura de hero, ni ritmo de color, y estaba casi todo centrado.

- **Hero:** retrato de la cabecera a la franja base, sin tocar; título, subtítulo, descripción y botones en un solo eje, con el mismo aire arriba y abajo (medido); franja base con sus acreditaciones, su financiación y sus opiniones.
- **Ritmo:** blanco; banda de su azul noche en la guía; marfil en opiniones; su rosa junto a la foto de Medicina estética.
- **Alineación:** todo a la izquierda, con cabeceras a dos columnas (título y texto sobre la misma línea base).
- **Remates:** barra superior con dirección, horario y teléfonos; filetes de oro; pie ordenado; Medicina estética con la foto llenando su mitad.
- **Movimiento:** entrada de menos de 1 s al cargar; hover que responde en menos de medio segundo; nada al bajar salvo un fundido en los títulos; el vídeo de «Novedades» es lo único que se mueve solo.

## v6 «Portada» (ronda de cambios 6): etiqueta `v6-home`

Rechazado el oro líquido («muy feo», «cortinas doradas»). Prima la elegancia, el acabado premium y la facilidad para una clientela en torno a los 50 años. Se mantienen sus textos y su SEO literales, su favicon, blanco y oro.

- **Hero:** su foto sin tocar, que se funde en el blanco, y su título a gran tamaño entrelazado con ella; descripción y botones en el blanco de la foto. Una sola entrada suave al cargar.
- **Movimiento:** scroll normal: nada se fija ni está ligado al scroll. Lo único que se mueve solo es el vídeo dentro de la palabra «Novedades», y solo mientras se ve. Lo demás responde a la persona (cursor, toque).
- **Promociones:** precio, texto y «Pedir cita» siempre a la vista, sin nada escondido bajo el cursor.
- **Novedades:** la palabra con su vídeo dentro, quieta; debajo sus tres novedades, con vídeo solo si se pulsa.
- **Tratamientos:** índice con sus 7 páginas; se elige con un clic. En móvil, acordeón.
- **Cita:** formulario clásico con etiquetas y teléfonos a la vista.
- **Bloques nuevos:** la guía «¿Qué te gustaría mejorar?» (de la preocupación a sus tratamientos) y sus opiniones reales de Treatwell (4,7 de 5, 298 opiniones). En el pie, su horario y «Cómo llegar».
- **Tipografía:** Melodrama solo en tamaños grandes (por debajo de unos 40 px su «t» se pierde); General Sans en el resto.

Pruebas: `_interno/herramientas/pruebas-v7.mjs` (ratón, teclado y toques reales; 22 tamaños), `pillados.mjs`, `medir-hero.mjs` (17 tamaños) y `verificar.mjs` con ruta absoluta.

## v5 «Oro líquido» (ronda de cambios 5): etiqueta `v5-home`

Rechazada la v4 («extremadamente básica», tipografía y hero sin interés), se rehace todo menos su identidad y su SEO: blanco y oro de su logo, sus textos literales y su favicon.

- **Hero:** oro líquido en tiempo real (WebGL, `assets/js/oro.js`) con su cara de marca en una ventana que se deforma; reacciona al cursor y, al bajar, inunda la pantalla y deja su descripción, sus acreditaciones y la financiación. Sin WebGL o con movimiento reducido: imagen fija.
- **Tipografía:** Melodrama (titulares grandes, peso 700) + General Sans (títulos pequeños y texto). Melodrama no se usa por debajo de unos 30 px: no se lee.
- **Promociones:** 8 a la vista; el oro se retira al llegar y vuelve desde el cursor con el detalle. En táctil, un toque abre el detalle (en móvil la fila crece para que quepa entero).
- **Novedades:** se entra por dentro de las letras de la palabra y pasan sus 3 novedades.
- **Tratamientos:** cilindro 3D con sus 7 páginas, foto y panel a cada lado, y su lista SEO literal.
- **Medicina estética:** su foto fija y la hoja blanca con su texto entero que sube encima. **Marcas:** monedas que giran con el scroll y quedan de frente.
- **Cita:** se escribe como una frase («Me llamo… y quiero cita para…») y va por correo; todos los «Pedir cita» llegan con la elección hecha.

Pruebas: `_interno/herramientas/pruebas-v5.mjs` (ratón, teclado y toques reales; 22 tamaños), `pillados.mjs`, `medir-hero.mjs` (17 tamaños) y `verificar.mjs` **con ruta absoluta**.

## v4 «A medida» (ronda de cambios 4): estructura de conversión, con su identidad y su SEO

La v1 «Marcaje» (`v1-home`), la v2 «Órbita de luz» (`v2-home`) y la v3 (blanco y oro, en el historial) se sustituyen por esta, hecha tras revisar su competencia (Dorsia, Clínica Menorca, SkinSpirit y guías de conversión del sector: `_interno/competencia.md`). Su identidad —blanco, el oro de su logo y su azul en los textos— con Gambetta (titulares y precios) y Urbanist. Embudo:

1. **Hero:** su foto entera sobre blanco, **su titular y su descripción, literales**, y el **buscador «¿Qué te gustaría mejorar?»**: ocho opciones (arrugas, labios, flacidez, manchas, vello, silueta, luminosidad, bienestar) que enseñan sus tratamientos con su precio o su promoción y convierten el botón en «Pedir cita para tus labios». Antes de elegir, las promociones del momento con precio. Confianza: 4,7 en Treatwell (298 opiniones), centro sanitario autorizado, desde 2014.
2. **Promociones en vales:** nueve vales dorados con la matriz de su cartel, línea de corte y su precio «desde» o su gancho; **todas a la vista** (728 px en escritorio) y **filtro por zona** (rostro, cuerpo, láser, medicina estética) que recoloca los vales deslizándose. Cada «Pedir cita» llega al formulario con esa promoción elegida.
3. **Novedades en un fichero:** Indiba Edna Pro Max y Endolift (sus vídeos) y Exosomas; cada ficha se da la vuelta hacia delante sobre su canto; avanza sola y se elige en el índice.
4. **Tratamientos y servicios…:** sus siete páginas en un mosaico de fotos y una pieza «¿No sabes cuál elegir? Te asesoramos» con cita, teléfono y WhatsApp; debajo, su lista de 15 tratamientos y sus 12 poblaciones (su bloque de SEO).
5. **Confianza:** su «Medicina Estética» entera con sus dos fotos, cuatro garantías (doctores con máster, SS01144, Centro Indiba, desde 2014) y «Trabajamos con las primeras marcas» con sus cinco acreditaciones en monedas que giran.
6. **¡Pide aquí tu cita!:** su paso a paso con sus frases (pides tu cita, te asesoramos, un plan a medida, financiación a medida) y la **cita en 3 pasos** (qué, cuándo, tus datos) en una pieza con su foto a la misma altura y sus opiniones de Treatwell encima, que se turnan. Por correo (en el prototipo abre el correo con la solicitud escrita); teléfono y WhatsApp a mano; dirección y horario debajo.
7. **Preguntas frecuentes** con sus datos (marcado FAQ para Google) y **Blog** compacto.

**Botones:** todos iguales en reposo (trazo fino); con el cursor, el oro nace del icono y se expande en círculo. Nada elegido de inicio; lo que elige la persona se queda marcado.

## Fotos y vídeos
Las suyas, sin retocar color. Las fotos con personas, ampliadas con IA (Real-ESRGAN, remacri) devolviéndoles el color del original; carteles e insignias, solo reescalados. La imagen de Dermapen + Indiba es una captura de móvil: se sirve solo el cartel. Vídeos: un fragmento de su vídeo de Indiba Edna Pro Max (solo el aparato) y su vídeo de Endolift en cabina.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools): el hero cabe entero en 17 tamaños, de 320×568 a 2560×1440 · title, H1, descripción, H2, lista y poblaciones, literales · buscador, filtro, fichero, «Pedir cita» con la elección hecha y la cita en 3 pasos, con ratón y clics reales (24 pruebas) · nada coloreado en reposo · ningún botón se queda «pillado» (17 casos) · sin desbordamiento horizontal · cero errores de JavaScript · con `prefers-reduced-motion` nada se mueve y todo se ve · solo se animan `transform` y `opacity`.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Gambetta (Fontshare, ITF Free Font License) y Urbanist (OFL), autoalojadas.

Parámetros útiles: `?ss` (sin animaciones, para capturas) · `?caducada` (simula la caducidad).

## Caducidad
**Provisional, como si se enviara el 27-oct-2026:** la propuesta se ve hasta el **jueves 5 de noviembre de 2026 a las 23:59** (hora de Madrid). Desde el 6, `index.html` lleva a `caducada.html`: «No puedes ver esta página porque han pasado más de 10 días desde su envío. Si sigues con interés, escríbeme a jjuradogarciadelrio@gmail.com.» y la home entera en miniatura. La fecha está en el primer `<script>` de `index.html` (`Date.UTC(2026, 10, 5, 23, 0)`): se ajusta al día real de envío. En local no caduca.

## Ver en local
```bash
cd prototype && python -m http.server 8000
```

## Publicar
```bash
git subtree push --prefix=prototype origin gh-pages
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
