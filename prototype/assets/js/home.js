/* Elena Méndez — home v4 «A medida»: la entrada del hero, el buscador «¿Qué te gustaría mejorar?»,
   el filtro de los vales, el fichero de novedades, los «Pedir cita» que dejan elegido el tratamiento,
   la cita en 3 pasos (por correo), las opiniones que se turnan y las monedas. */
(function () {
  'use strict';
  var d = document, EM = window.EM || { quieto: true, observar: function (el) { el.classList.add('visto'); } };
  var quieto = EM.quieto;
  var conRaton = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var CORREO = 'elenamendez-belleza@hotmail.com';
  var visible = function (el, cb, opciones) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, opciones || { threshold: 0.15 }).observe(el);
  };
  var indexar = function (lista) { Array.prototype.forEach.call(lista, function (el, k) { el.style.setProperty('--k', k); }); };

  /* Lo que se puede mejorar: sus tratamientos (de sus páginas), con precio o etiqueta si la tienen */
  var MEJORAS = {
    arrugas: { titulo: 'Para tus arrugas', cta: 'para tus arrugas', valor: 'Arrugas',
      items: [['Relleno de arrugas dinámicas'], ['Karisma Rh Collagen'], ['Dermapen + Indiba', 'novedad']] },
    labios: { titulo: 'Para tus labios', cta: 'para tus labios', valor: 'Labios',
      items: [['Ácido hialurónico en labios', 'promoción del mes'], ['Micropigmentación de labios']] },
    flacidez: { titulo: 'Para la flacidez', cta: 'para la flacidez', valor: 'Flacidez',
      items: [['HIFU', 'desde 99 €'], ['Endolift', 'novedad'], ['Indiba Edna Pro Max', 'novedad'], ['Hilos tensores']] },
    manchas: { titulo: 'Para tus manchas', cta: 'para tus manchas', valor: 'Manchas',
      items: [['Nanoláser STP y láser ND-YAG', 'desde 69 €'], ['Despigmentación con Mesoestetic'], ['Peelings']] },
    vello: { titulo: 'Para el vello, en cualquier piel', cta: 'de depilación láser', valor: 'Depilación láser',
      items: [['Láser de diodo SLD e IPL SHR', 'desde 19,90 €'], ['Indoloro']] },
    silueta: { titulo: 'Para tu silueta', cta: 'para tu silueta', valor: 'Silueta',
      items: [['Bodyshock de Mesoestetic'], ['Maderoterapia'], ['Ultracavitación'], ['Dieta proteinada con control médico']] },
    piel: { titulo: 'Para la luminosidad de tu piel', cta: 'para tu piel', valor: 'Luminosidad de la piel',
      items: [['Exosomas', 'novedad'], ['La Cápsula del Tiempo', 'exclusiva'], ['Peelings de Mesoestetic']] },
    bienestar: { titulo: 'Para tu bienestar', cta: 'de bienestar', valor: 'Bienestar y masajes',
      items: [['Masajes relajantes y terapéuticos'], ['Kobido'], ['Piedras volcánicas'], ['Reflexología']] }
  };

  /* ── 1 · Hero: su titular sube palabra a palabra ─────────────────────── */
  var hero = d.querySelector('[data-hero]');
  if (hero) {
    indexar(hero.querySelectorAll('.buscador__opciones li'));
    if (quieto) hero.classList.remove('entrando');
    else {
      var h1 = hero.querySelector('.hero__titulo');
      var palabras = h1.textContent.trim().split(/\s+/);
      h1.textContent = '';
      palabras.forEach(function (w, i) {
        var caja = d.createElement('span'), dentro = d.createElement('span');
        caja.className = 'palabra';
        caja.style.setProperty('--p', i);
        dentro.textContent = w;
        caja.appendChild(dentro);
        h1.appendChild(caja);
        if (i < palabras.length - 1) h1.appendChild(d.createTextNode(' '));
      });
      setTimeout(function () { hero.classList.remove('entrando'); }, 3400);
    }
  }

  /* ── 2 · El buscador: al elegir, sus tratamientos y el «Pedir cita» ya dirigido ── */
  var buscador = d.querySelector('[data-buscador]');
  var ctaHero = d.querySelector('[data-cita-hero]');
  var mejoraElegida = null;
  if (buscador) {
    var respuesta = buscador.querySelector('[data-respuesta]');
    var opciones = buscador.querySelectorAll('[data-mejora]');
    opciones.forEach(function (b) {
      b.addEventListener('click', function () {
        var clave = b.getAttribute('data-mejora'), m = MEJORAS[clave];
        mejoraElegida = clave;
        opciones.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        var html = '<div class="respuesta"><p class="respuesta__titulo">' + m.titulo + '</p><ul class="respuesta__lista">';
        m.items.forEach(function (it, k) { html += '<li class="respuesta__item" style="--k:' + k + '">' + it[0] + (it[1] ? ' <b>' + it[1] + '</b>' : '') + '</li>'; });
        respuesta.innerHTML = html + '</ul></div>';
        ctaHero.querySelector('[data-cita-hero-texto]').textContent = 'Pedir cita ' + m.cta;
      });
    });
  }

  /* ── 3 · Promociones: filtro por zona; los vales se recolocan deslizándose ── */
  var filtro = d.querySelector('[data-filtro]');
  var vales = Array.prototype.slice.call(d.querySelectorAll('.vale'));
  if (filtro && vales.length) {
    var cuantas = filtro.querySelector('[data-filtro-cuantas]');
    var botonesFiltro = filtro.querySelectorAll('[data-zona]');
    var NOMBRES = { rostro: 'de rostro', cuerpo: 'de cuerpo', laser: 'de láser', medicina: 'de medicina estética' };
    var aplicar = function (zona) {
      var antes = new Map();
      vales.forEach(function (v) { if (!v.hidden) antes.set(v, v.getBoundingClientRect()); });
      var quedan = vales.filter(function (v) { return !zona || v.getAttribute('data-zonas').split(' ').indexOf(zona) > -1; });
      var salen = vales.filter(function (v) { return !v.hidden && quedan.indexOf(v) === -1; });
      var recolocar = function () {
        salen.forEach(function (v) { v.hidden = true; v.classList.remove('sale'); });
        quedan.forEach(function (v) { v.hidden = false; v.classList.add('visto'); });
        if (quieto) return;
        quedan.forEach(function (v) {
          var a = antes.get(v), b = v.getBoundingClientRect();
          v.style.transition = 'none';
          v.style.transform = a ? 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)' : 'scale(.92)';
          v.style.opacity = a ? '1' : '0';
        });
        void d.body.offsetWidth;
        quedan.forEach(function (v) {
          v.style.transition = 'transform .7s var(--sale), opacity .4s linear';
          v.style.transform = '';
          v.style.opacity = '';
        });
      };
      if (quieto || !salen.length) recolocar();
      else { salen.forEach(function (v) { v.classList.add('sale'); }); setTimeout(recolocar, 230); }
      cuantas.textContent = quedan.length + (quedan.length === 1 ? ' promoción' : ' promociones') + (zona ? ' ' + NOMBRES[zona] : '');
    };
    botonesFiltro.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        botonesFiltro.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b && on)); });
        aplicar(on ? b.getAttribute('data-zona') : null);
      });
    });
  }

  /* ── 4 · Novedades: el fichero avanza solo; se elige en el índice ───── */
  var seccionNov = d.querySelector('#novedades');
  var fichero = d.querySelector('[data-fichero]');
  if (fichero) {
    var pestanas = Array.prototype.slice.call(d.querySelectorAll('[data-fichero-indice] [role="tab"]'));
    var fichas = pestanas.map(function (p) { return d.getElementById(p.getAttribute('aria-controls')); });
    var actN = 0, relojN = null, novVisible = false, novEncima = false, DUR_N = 8000;
    seccionNov.style.setProperty('--dur', DUR_N + 'ms');
    var videos = function () {
      fichas.forEach(function (f, k) {
        var v = f.querySelector('video');
        if (!v) return;
        if (k === actN && novVisible && !quieto) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    };
    var programarN = function () {
      clearTimeout(relojN);
      seccionNov.classList.remove('en-marcha');
      if (quieto || !novVisible || novEncima) return;
      void seccionNov.offsetWidth;
      seccionNov.classList.add('en-marcha');
      relojN = setTimeout(function () { mostrar(actN + 1); }, DUR_N);
    };
    var mostrar = function (i, elegida, foco) {
      var antes = actN;
      actN = (i + fichas.length) % fichas.length;
      pestanas.forEach(function (p, k) {
        var on = k === actN;
        p.setAttribute('aria-selected', String(on));
        p.tabIndex = on ? 0 : -1;
        p.classList.toggle('elegida', on && !!elegida);
      });
      fichas.forEach(function (f, k) {
        f.classList.remove('sale');
        if (k === actN) f.classList.add('es-activa');
        else if (k === antes && antes !== actN) { f.classList.remove('es-activa'); f.classList.add('sale'); }
        else f.classList.remove('es-activa');
      });
      if (foco) pestanas[actN].focus();
      videos();
      programarN();
    };
    pestanas.forEach(function (p, i) {
      p.addEventListener('click', function () { if (i !== actN) mostrar(i, true); else p.classList.add('elegida'); });
      p.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = actN + 1;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') n = actN - 1;
        if (n !== null) { e.preventDefault(); mostrar(n, true, true); }
      });
    });
    seccionNov.addEventListener('mouseenter', function () { novEncima = true; programarN(); });
    seccionNov.addEventListener('mouseleave', function () { novEncima = false; programarN(); });
    visible(fichero, function (v) { novVisible = v; videos(); programarN(); }, { threshold: 0.35 });
  }

  /* ── 5 · La cita en 3 pasos ──────────────────────────────────────────── */
  var form = d.querySelector('[data-asistente]');
  var irAPaso = function () {};
  if (form) {
    var pasos = Array.prototype.slice.call(form.querySelectorAll('[data-paso]'));
    var etapas = form.querySelectorAll('[data-etapa]');
    var barra = form.querySelector('[data-progreso]');
    var eleccion = form.querySelector('[data-eleccion]');
    var eleccionTexto = form.querySelector('[data-eleccion-texto]');
    var hecho = form.querySelector('[data-hecho]');
    var interes = form.querySelector('[name="interes"]');
    var paso = 1;
    var queElige = function () {
      var r = form.querySelector('[name="mejora"]:checked');
      return interes.value || (r ? r.value : '');
    };
    var pintarEleccion = function () {
      var q = queElige();
      eleccion.hidden = !q || paso === 1;
      eleccionTexto.textContent = q;
    };
    irAPaso = function (n, enfocar) {
      var antes = paso;
      paso = n;
      pasos.forEach(function (p) {
        var k = +p.getAttribute('data-paso');
        p.classList.toggle('es-activo', k === n);
        p.classList.toggle('atras', k < n);
      });
      hecho.hidden = true;
      etapas.forEach(function (e) {
        var k = +e.getAttribute('data-etapa');
        e.classList.toggle('actual', k === n);
        e.classList.toggle('hecha', k < n);
      });
      barra.style.setProperty('--avance', (n / 3).toFixed(4));
      pintarEleccion();
      if (enfocar && antes !== n) {
        var primero = pasos[n - 1].querySelector('input:not([type="radio"]), textarea, select, input[type="radio"]');
        if (primero) primero.focus({ preventScroll: true });
      }
    };
    // Elegir algo en el paso 1 deja lo otro sin elegir (o una zona o un tratamiento concreto)
    form.querySelectorAll('[name="mejora"]').forEach(function (r) { r.addEventListener('change', function () { interes.value = ''; }); });
    interes.addEventListener('change', function () { form.querySelectorAll('[name="mejora"]').forEach(function (r) { r.checked = false; }); });
    form.querySelectorAll('[data-siguiente]').forEach(function (b) { b.addEventListener('click', function () { irAPaso(paso + 1, true); }); });
    form.querySelectorAll('[data-atras]').forEach(function (b) { b.addEventListener('click', function () { irAPaso(paso - 1, true); }); });
    form.querySelector('[data-cambiar]').addEventListener('click', function () { irAPaso(1, true); });
    form.querySelector('[data-otra]').addEventListener('click', function () { form.reset(); irAPaso(1, true); });

    var quitarError = function (campo) {
      campo.classList.remove('campo--error');
      var m = campo.querySelector('.campo__error');
      if (m) m.remove();
      campo.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
    };
    var ponerError = function (el, texto) {
      var campo = el.closest('.campo');
      quitarError(campo);
      campo.classList.add('campo--error');
      var m = d.createElement('p');
      m.className = 'campo__error';
      m.id = 'error-' + el.name;
      m.textContent = texto;
      campo.appendChild(m);
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', m.id);
      return el;
    };
    form.addEventListener('input', function (e) { var c = e.target.closest('.campo'); if (c && c.classList.contains('campo--error')) quitarError(c); });
    form.addEventListener('change', function (e) { var c = e.target.closest('.campo'); if (c && c.classList.contains('campo--error')) quitarError(c); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (paso < 3) { irAPaso(paso + 1, true); return; }        // Intro en los pasos 1 y 2: al siguiente
      var f = form.elements;
      var nombre = f.nombre.value.trim(), tel = f.telefono.value.trim(), email = f.email.value.trim();
      var que = queElige(), cuando = (form.querySelector('[name="cuando"]:checked') || {}).value || '', mensaje = f.mensaje.value.trim();
      form.querySelectorAll('.campo--error').forEach(quitarError);
      var errores = [];
      if (!nombre) errores.push(ponerError(f.nombre, 'Escribe tu nombre.'));
      if (tel.replace(/\D/g, '').length < 9) errores.push(ponerError(f.telefono, 'Escribe un teléfono de 9 cifras para poder llamarte.'));
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errores.push(ponerError(f.email, 'Revisa el email: le falta algo.'));
      if (!f.acepto.checked) errores.push(ponerError(f.acepto, 'Acepta la política de privacidad para poder enviarla.'));
      if (errores.length) { errores[0].focus(); return; }
      var asunto = 'Solicitud de cita' + (que ? ': ' + que : '') + ' (' + nombre + ')';
      var lineas = ['Hola, me gustaría pedir cita' + (que ? ' (' + que + ')' : '') + (cuando ? ', mejor ' + cuando : '') + '.', '', 'Nombre: ' + nombre, 'Teléfono: ' + tel];
      if (email) lineas.push('Email: ' + email);
      if (mensaje) lineas.push('', mensaje);
      location.href = 'mailto:' + CORREO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(lineas.join('\n'));
      pasos.forEach(function (p) { p.classList.remove('es-activo'); });
      eleccion.hidden = true;
      etapas.forEach(function (e) { e.classList.remove('actual'); e.classList.add('hecha'); });
      barra.style.setProperty('--avance', '1');
      form.querySelector('[data-hecho-titulo]').textContent = '¡Listo, ' + nombre.split(' ')[0] + '!';
      hecho.hidden = false;
      hecho.focus({ preventScroll: true });
    });
    irAPaso(1);
  }

  /* ── 6 · Todos los «Pedir cita» que saben de qué: el formulario ya lo trae elegido ── */
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cita], [data-cita-hero]');
    if (!a || !form) return;
    var valor = null;
    if (a.hasAttribute('data-cita')) {
      valor = a.getAttribute('data-cita');
      var hay = Array.prototype.some.call(form.querySelector('[name="interes"]').options, function (o) { return o.value === valor; });
      if (hay) { form.querySelector('[name="interes"]').value = valor; form.querySelectorAll('[name="mejora"]').forEach(function (r) { r.checked = false; }); }
      else valor = null;
    } else if (mejoraElegida) {
      valor = MEJORAS[mejoraElegida].valor;
      form.querySelector('[name="interes"]').value = '';
      form.querySelectorAll('[name="mejora"]').forEach(function (r) { r.checked = r.value === valor; });
    }
    irAPaso(valor ? 2 : 1);
    // Con ratón, el foco espera en el primer campo del paso (en el móvil no, para no abrir el teclado)
    if (conRaton) setTimeout(function () { var p = form.querySelector('.paso.es-activo input, .paso.es-activo select'); if (p) p.focus({ preventScroll: true }); }, quieto ? 0 : 800);
  });

  /* ── 7 · Sus opiniones se turnan sobre la foto ───────────────────────── */
  var citas = d.querySelectorAll('.opinion');
  if (citas.length > 1 && !quieto) {
    var actO = 0, relojO = null;
    var turno = function () {
      citas[actO].classList.remove('es-activa');
      actO = (actO + 1) % citas.length;
      citas[actO].classList.add('es-activa');
    };
    visible(d.querySelector('[data-opiniones]'), function (v) { clearInterval(relojO); if (v) relojO = setInterval(turno, 6000); }, { threshold: 0.3 });
  }

  /* ── 8 · Entradas al llegar: monedas, paso a paso, pieza de la cita ── */
  ['[data-monedas]', '[data-pasos]', '.cita__pieza'].forEach(function (s) { var el = d.querySelector(s); if (el) EM.observar(el); });
})();
