# Elena Méndez Medicina Estética — Propuesta de nueva homepage

Prototipo de homepage para **Elena Méndez** ([elenamendez-belleza.com](https://elenamendez-belleza.com/)), centro médico estético y de belleza en C/ Nogal 1, Torrelodones (Madrid), desde 2014. 4,7 en Treatwell con 298 opiniones.

**Prototipo:** https://jjurado2026.github.io/elena-mendez-belleza/

**El problema que resuelve:** su home actual tarda 6,3 s en pintar lo principal en un móvil con 4G lenta, el titular ocupa la primera pantalla entera del móvil sin un solo botón de cita y el chat de WhatsApp se abre solo y tapa casi la mitad de cada pantalla. La propuesta conserva su identidad (blanco y el oro de su logo), sus textos y todo su SEO, y lo ordena para que se vea primero lo que importa: **las promociones, las novedades y pedir cita por correo**.

## v3 (ronda de cambios 3): blanco y oro, su contenido y su SEO

La v1 «Marcaje» (etiqueta `v1-home`) y la v2 «Órbita de luz» (etiqueta `v2-home`) se cambiaron por esta, que parte de su web:

1. **Su identidad:** su favicon, blanco y el oro de su logo (sin amarillo ni fondos azules); su azul solo en titulares y texto. La firma, un doble filete de oro en el pie del hero, los marcos y la pieza de la cita.
2. **Hero:** su foto entera sobre blanco (en vertical, recortada a la cara) con **su titular y su descripción, literales**; «Ver promociones» y «Pedir cita»; sus cuatro insignias.
3. **Promociones:** las ocho a la vista a la vez, en una rejilla de 4 × 2 (2 columnas en el móvil), sin carrusel ni solapes; cada una con su imagen, su precio o su etiqueta, «Pedir cita» y «Leer más» a su entrada. Debajo, «Ver todas las promociones» y su frase de financiación.
4. **Novedades:** Indiba Edna Pro Max y Endolift con sus vídeos (en marcha mientras se ven) y Exosomas, cada una a su proporción y a la misma altura.
5. **Tratamientos y servicios de medicina estética avanzada en Torrelodones (Madrid):** «la carta», un índice de sus siete páginas que avanza solo; la foto de cada una se destapa con dos lamas de canto de oro, en paspartú, sin recortarla, con su lista de tratamientos y su enlace. Debajo, **su lista literal de tratamientos y sus doce poblaciones** (su bloque de SEO).
6. **Medicina estética:** su texto entero y su foto.
7. **Trabajamos con las primeras marcas:** su texto, su alta cosmética y sus cinco acreditaciones en medallas que giran.
8. **Blog** y **¡Pide aquí tu cita!:** foto y formulario en una sola pieza, a la misma altura. El formulario envía la solicitud por correo (nombre, teléfono, email opcional, el tratamiento ya elegido si se llega desde una promoción, franja y mensaje); en el prototipo abre el correo con la solicitud escrita.
9. **SEO intacto:** su `title`, su meta descripción, su H1, sus H2 (Promociones, Tratamientos y servicios…, Medicina estética, Blog, Trabajamos con las primeras marcas, ¡Pide aquí tu cita!) y enlaces a cada promoción, novedad, página de tratamiento y entrada del blog.

Fuera: la primera consulta gratis (no es una oferta suya: solo aparece de pasada en una promoción antigua), la órbita y los puntos sobre la cara, el bloque amarillo, las opiniones de Treatwell, el cheque regalo y el bloque del centro (dirección y horario, en el pie).

**Regla de botones:** ninguno va relleno en reposo; se rellena el que tiene el cursor. El elemento que recibe el cursor no se mueve nunca (se animan sus hijos).

## Fotos y vídeos
Las suyas, sin retocar color: las de su home en el mismo papel y la de cada promoción, novedad y página de tratamientos. Las fotos con personas se han ampliado con IA (Real-ESRGAN, modelo remacri) devolviéndoles el color exacto del original; carteles e insignias, solo reescalados. La imagen de Dermapen + Indiba es una captura de móvil: se sirve solo el cartel, sin las bandas blancas ni los botones del visor. Vídeos: un fragmento de su vídeo de Indiba Edna Pro Max (solo los planos del aparato) y su vídeo de Endolift en cabina.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools): **el hero cabe entero en 17 tamaños**, de 320×568 a 2560×1440, también en móvil apaisado y descontando la barra fija del móvil · su title, su H1, su descripción y sus H2, presentes · las 8 promociones a la vez y sin solapes · «Pedir cita» de una promoción deja ese tratamiento elegido en el formulario · el formulario avisa de lo que falta y prepara el correo · los vídeos en marcha al verse · la carta avanza sola y se elige al pasar el ratón · ningún botón se queda «pillado» · sin desbordamiento horizontal · cero errores de JavaScript · con `prefers-reduced-motion` nada se mueve y todo se ve · solo se animan `transform` y `opacity`.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Gilda Display y Urbanist autoalojadas.

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
