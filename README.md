# Elena Méndez Medicina Estética — Propuesta de nueva homepage

Prototipo de homepage para **Elena Méndez** ([elenamendez-belleza.com](https://elenamendez-belleza.com/)), centro médico estético y de belleza en C/ Nogal 1, Torrelodones (Madrid), desde 2014. 4,7 en Treatwell con 298 opiniones.

**Prototipo:** https://jjurado2026.github.io/elena-mendez-belleza/

**El problema que resuelve:** su home actual tarda 6,3 s en pintar lo principal en un móvil con 4G lenta, el titular ocupa la primera pantalla entera del móvil sin un solo botón de cita, el chat de WhatsApp se abre solo y tapa casi la mitad de cada pantalla, y no dice dónde está ni cuándo abre. Tampoco enseña sus 298 opiniones, sus precios (que sí están en sus carteles) ni las 17 fotos reales de su centro.

## Dirección estética: «Órbita de luz» (v2, ronda de cambios 1)

La v1 «Marcaje» (etiqueta `v1-home`) se juzgó básica. La v2 conserva sus colores, sus fotos y sus textos y lo pone todo en movimiento:

1. **Barra amarilla** como la de su web (primera consulta gratis, teléfonos, WhatsApp) y cabecera fija con el logo centrado.
2. **Hero «Órbita de luz»:** escenario azul noche con brillos de oro y rosa, chispas y su lema en grande al fondo. Su cara de marca aparece en un **arco con doble filete de oro** que se abre como unas lamas; encima, el marcaje del médico y un escáner de luz. Las seis zonas (mirada, labios, óvalo, piel, pómulos, expresión) **giran en órbita alrededor del arco**: la que pasa por delante cambia el titular letra a letra («Rejuvenece tu mirada… sin cirugía») y al pulsar una, la órbita la trae al frente. Tarjetas flotantes (4,7 en Treatwell, primera consulta gratis, desde 2014), tres llamadas a la acción y una cinta de promociones con precio, cada una a WhatsApp.
3. **Novedades en un carrusel 3D** con sus vídeos (Indiba Edna Pro Max, Endolift), carteles y fotos; avanza solo, se arrastra y cada una tiene su «Lo quiero».
4. **Tratamientos como índice grande**: la foto de cada página flota junto al cursor y cada fila tiene «Pedir cita».
5. **Banda amarilla** con su lista literal de tratamientos en dos cintas, su frase de financiación y un sello giratorio «Pide tu cita».
6. **Medicina estética** con sus dos fotos de la home (la de labios rojos y la de los doctores) y el sello sanitario que gira.
7. **Solo primeras marcas**: medallas que entran girando como monedas y giran al pasar para contar su historia.
8. **Opiniones**: el 4,7 grande, las estrellas que se llenan y sus reseñas en dos cintas.
9. **Consulta gratis**: ninguna opción marcada de inicio; se pinta de azul la que tiene el cursor y el mensaje de WhatsApp se escribe solo.
10. Regalo, el centro (tira de fotos reales con visor, horario en vivo, mapa) y blog, como en la v1.

**Regla de hover:** el elemento que recibe el cursor no se mueve nunca (se animan sus hijos), y el texto de la zona activa del hero tiene altura fija, para que ningún botón «baile» bajo el cursor ni se quede pillado.

## Fotos y vídeos
Las suyas, sin recortar ni retocar color: las de su home en el mismo papel (hero, «Medicina Estética», «Pide aquí tu cita», productos Mesoestetic, promociones, insignias y blog), la de cada página de tratamientos y las de su galería y su ficha de Treatwell. Las fotos con personas se han ampliado con IA (Real-ESRGAN, modelo remacri) devolviéndoles el color exacto del original; los carteles e insignias, solo reescalados. Vídeos: un fragmento de su vídeo de Indiba Edna Pro Max (solo los planos del aparato; las escenas de recepción y doctora de ese vídeo están hechas con IA) y su vídeo de Endolift en cabina.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools): **el hero cabe entero en 17 tamaños**, de 320×568 a 2560×1440, también en móvil apaisado y descontando la barra fija del móvil · sin desbordamiento horizontal · las fotos a su proporción · un solo `h1`, todas las imágenes con `alt` · cero errores de JavaScript · con `prefers-reduced-motion` nada se mueve y todo se ve · solo se animan `transform` y `opacity` · las interacciones probadas con ratón y clics reales.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Gilda Display y Urbanist autoalojadas (77 KB).

Parámetros útiles: `?ss` (sin animaciones, para capturas) · `?zona=labios` (fija la zona del hero) · `?ahora=2026-10-26T18:00` (fija la hora de Madrid del estado abierto/cerrado) · `?caducada` (simula la caducidad).

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
