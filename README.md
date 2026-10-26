# Elena Méndez Medicina Estética — Propuesta de nueva homepage

Prototipo de homepage para **Elena Méndez** ([elenamendez-belleza.com](https://elenamendez-belleza.com/)), centro médico estético y de belleza en C/ Nogal 1, Torrelodones (Madrid), desde 2014. 4,7 en Treatwell con 298 opiniones.

**Prototipo:** https://jjurado2026.github.io/elena-mendez-belleza/

**El problema que resuelve:** su home actual tarda 6,3 s en pintar lo principal en un móvil con 4G lenta, el titular ocupa la primera pantalla entera del móvil sin un solo botón de cita, el chat de WhatsApp se abre solo y tapa casi la mitad de cada pantalla, y no dice dónde está ni cuándo abre. Tampoco enseña sus 298 opiniones, sus precios (que sí están en sus carteles) ni las 17 fotos reales de su centro.

## Dirección estética: «Marcaje»

Antes de tratar, el médico estético estudia la cara y la marca con lápiz blanco: puntos donde va a trabajar y vectores hacia donde levantará el tejido. La home abre con **su cara de marca entera** (la misma modelo de su fachada y su sala de espera) y **el marcaje dibujándose encima**: anillos en expresión, mirada, pómulos, piel, labios y óvalo, unidos por una línea a su etiqueta. El titular cambia con la zona que se ilumina —«Rejuvenece tu mirada», «Realza tus labios», «Redefine tu óvalo»… *sin cirugía*— y cada zona enseña sus tratamientos. Es la firma y, a la vez, un buscador por zona en la primera pantalla.

- **Color:** blanco clínico (la foto del hero tiene fondo blanco puro y se funde con la página), el **azul noche `#2F3854`** de sus titulares, el **oro `#F4D058`** de su logo (sobre azul) y su **rosa `#F2DCEA`** en los fondos cálidos.
- **Tipografía:** **Gilda Display** en titulares (elegante y legible a la primera) y **Urbanist** en texto e interfaz (geométrica, como las letras de su logo).
- El marcaje solo aparece en dos sitios: el hero y la consulta, donde se elige marcando.

## La home, de arriba abajo
1. **Cabecera fija** con su logo centrado (rehecho nítido a partir de la captura de su web), los tratamientos a un lado y el centro al otro; enlaces a sus páginas reales. En móvil, menú a pantalla completa y barra fija Llamar · WhatsApp · Cómo llegar.
2. **Hero «Marcaje»:** su cara de marca, seis zonas que se recorren solas o al pasar el ratón, titular que cambia, primera consulta gratis por WhatsApp, teléfono, 4,7 en Treatwell y sus cuatro insignias.
3. **Novedades y promociones:** carta de ocho novedades (Indiba Edna Pro Max, Endolift, Exosomas, HIFU, láser de manchas, depilación láser, labios, La Cápsula del Tiempo) con sus precios «desde» y una vitrina que enseña su vídeo, su cartel o su foto; avanza sola y cada una se pregunta por WhatsApp con el mensaje escrito.
4. **Tratamientos:** sus siete páginas con la foto de cada una; la tapa rosa se levanta al llegar.
5. **Medicina estética, en manos de médicos:** autorización sanitaria SS01144, médicos con máster, primera consulta gratis y financiación, con un sello sanitario que gira.
6. **Solo primeras marcas:** sus cinco acreditaciones como medallas que giran para contar su historia, y la cinta de marcas.
7. **Opiniones:** 4,7 sobre 5 en Treatwell (298), las estrellas se llenan y sus reseñas literales se suceden.
8. **Tu primera consulta es gratis:** se marca qué interesa y cuándo, y el mensaje de WhatsApp se escribe solo.
9. **Regala un tratamiento:** su cheque regalo se desenvuelve al llegar; novias y comuniones y Tratamiento Flash.
10. **El centro y cómo llegar:** tira de fotos reales del centro que se desliza sola (con visor), fachada y vídeo, horario con hoy marcado y abierto/cerrado en vivo, mapa al pulsar.
11. **Blog:** sus tres entradas de 2026 sobre medicina estética.

## Fotos y vídeos
Las suyas, sin recortar ni retocar color: las de su home en el mismo papel (hero, «Medicina Estética», «Pide aquí tu cita», productos Mesoestetic, promociones, insignias y blog), la de cada página de tratamientos y las de su galería y su ficha de Treatwell. Las fotos con personas se han ampliado con IA (Real-ESRGAN, modelo remacri) devolviéndoles el color exacto del original; los carteles e insignias, solo reescalados. Vídeos: un fragmento de su vídeo de Indiba Edna Pro Max (solo los planos del aparato; las escenas de recepción y doctora de ese vídeo están hechas con IA) y su vídeo de Endolift en cabina.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools): **el hero cabe entero en 17 tamaños**, de 320×568 a 2560×1440, también en móvil apaisado y descontando la barra fija del móvil · sin desbordamiento horizontal · las fotos a su proporción · un solo `h1`, todas las imágenes con `alt` · cero errores de JavaScript · con `prefers-reduced-motion` nada se mueve y todo se ve · solo se animan `transform` y `opacity` · las interacciones probadas con ratón y clics reales.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Gilda Display y Urbanist autoalojadas (77 KB).

Parámetros útiles: `?ss` (sin animaciones, para capturas) · `?zona=labios` (fija la zona del hero) · `?ahora=2026-10-26T18:00` (fija la hora de Madrid del estado abierto/cerrado) · `?caducada` (simula la caducidad).

## Caducidad
**Provisional, como si se enviara el 26-oct-2026:** la propuesta se ve hasta el **miércoles 4 de noviembre de 2026 a las 23:59** (hora de Madrid). Desde el 5, `index.html` lleva a `caducada.html`: «No puedes ver esta página porque han pasado más de 10 días desde su envío. Si sigues con interés, escríbeme a jjuradogarciadelrio@gmail.com.» y la home entera en miniatura. La fecha está en el primer `<script>` de `index.html` (`Date.UTC(2026, 10, 4, 23, 0)`): se ajusta al día real de envío. En local no caduca.

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
