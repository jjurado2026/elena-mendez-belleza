/* Elena Méndez — home «Marcaje»: el marcaje del hero, la vitrina de novedades, medallas,
   opiniones, la tira del centro con su visor, la consulta que se compone, el horario en vivo y el mapa. */
(function () {
  'use strict';
  var d = document, EM = window.EM || { quieto: true, wa: function (t) { return 'https://wa.me/34682937011?text=' + encodeURIComponent(t); }, observar: function (el) { el.classList.add('visto'); } };
  var quieto = EM.quieto;
  var param = function (n) { var m = location.search.match(new RegExp('[?&]' + n + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : null; };
  var indexar = function (lista, modulo) { lista.forEach(function (el, i) { el.style.setProperty('--i', modulo ? i % modulo : i); }); };

  /* ── 1 · Hero: el marcaje ─────────────────────────────────────────── */
  var hero = d.querySelector('[data-hero]');
  if (hero) {
    var PANEL = {
      mirada: '<strong>Para tu mirada:</strong> ojeras sin cirugía, patas de gallo, bolsas, pestañas y cejas.',
      pomulos: '<strong>Para tus pómulos:</strong> ácido hialurónico, Radiesse y HIFU.',
      piel: '<strong>Para tu piel:</strong> manchas con Mesoestetic, láser ND-YAG, peelings, Dermapen con Indiba y La Cápsula del Tiempo.',
      labios: '<strong>Para tus labios:</strong> ácido hialurónico, sonrisa gingival y micropigmentación.',
      ovalo: '<strong>Para tu óvalo:</strong> hilos tensores, Endolift, HIFU y radiofrecuencia Indiba.',
      expresion: '<strong>Para tu expresión:</strong> arrugas dinámicas de frente y entrecejo, Karisma Rh Collagen y exosomas.'
    };
    var ORDEN = ['mirada', 'pomulos', 'piel', 'labios', 'ovalo', 'expresion'];
    var marcas = hero.querySelectorAll('.marca');
    var zonas = hero.querySelectorAll('.zona');
    var frases = hero.querySelectorAll('.hero__frase');
    var panel = hero.querySelector('[data-panel]');
    var filaZonas = hero.querySelector('.zonas');
    var actual = null, reloj = null, pausaHasta = 0, heroVisible = true, encima = false;
    var CICLO = 3600;

    var activar = function (z, porUsuario) {
      if (z === actual) return;
      marcas.forEach(function (m) { m.classList.toggle('es-activa', m.getAttribute('data-zona') === z); });
      zonas.forEach(function (li) {
        var on = li.getAttribute('data-zona') === z;
        li.classList.toggle('es-activa', on);
        li.querySelector('button').setAttribute('aria-pressed', String(on));
        // En móvil, la zona activa se asoma en su fila sin mover la página
        if (on && filaZonas && filaZonas.scrollWidth > filaZonas.clientWidth + 4) {
          var izq = li.offsetLeft - (filaZonas.clientWidth - li.offsetWidth) / 2;
          filaZonas.scrollTo({ left: Math.max(0, izq), behavior: quieto ? 'auto' : 'smooth' });
        }
      });
      frases.forEach(function (f) {
        if (f.getAttribute('data-zona') === z) { f.classList.remove('sale'); f.classList.add('es-activa'); }
        else if (f.classList.contains('es-activa')) {
          f.classList.remove('es-activa'); f.classList.add('sale');
          setTimeout(function () { f.classList.remove('sale'); }, 520);
        }
      });
      if (panel) {
        if (quieto || actual === null) panel.innerHTML = PANEL[z];
        else {
          panel.classList.add('cambia');
          setTimeout(function () { panel.innerHTML = PANEL[z]; panel.classList.remove('cambia'); }, 230);
        }
      }
      actual = z;
      if (porUsuario) pausaHasta = Date.now() + 9000;
    };

    var siguiente = function () {
      clearTimeout(reloj);
      if (quieto) return;
      reloj = setTimeout(function () {
        if (heroVisible && !encima && !d.hidden && Date.now() >= pausaHasta) {
          activar(ORDEN[(ORDEN.indexOf(actual) + 1) % ORDEN.length]);
        }
        siguiente();
      }, CICLO);
    };

    zonas.forEach(function (li) {
      var b = li.querySelector('button'), z = li.getAttribute('data-zona');
      b.addEventListener('click', function () { activar(z, true); });
      b.addEventListener('mouseenter', function () { activar(z, true); });
      b.addEventListener('focus', function () { activar(z, true); });
    });
    var escena = hero.querySelector('[data-escena]');
    escena.addEventListener('mouseenter', function () { encima = true; });
    escena.addEventListener('mouseleave', function () { encima = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: 0.25 }).observe(hero);
    }

    var inicial = param('zona');
    if (inicial && ORDEN.indexOf(inicial) < 0) inicial = null;
    if (quieto || inicial) {
      hero.classList.remove('entrando');
      activar(inicial || 'mirada');
    } else {
      // Entrada: la foto, los anillos, las líneas y el titular; después el médico marca la primera zona
      setTimeout(function () { activar('mirada'); }, 2300);
      setTimeout(function () { hero.classList.remove('entrando'); siguiente(); }, 2700);
    }
  }

  /* ── 2 · Novedades: carta y vitrina ───────────────────────────────── */
  var nov = d.querySelector('[data-novedades]');
  if (nov) {
    var caja = nov.querySelector('.nov');
    var filas = nov.querySelectorAll('.nov__fila');
    var medios = nov.querySelectorAll('.nov__medio');
    var nombre = nov.querySelector('[data-pie-nombre]');
    var botonNov = nov.querySelector('[data-nov-boton]');
    var nAct = 0, relojNov = null, novVisible = false, novEncima = false;
    var DUR = 6500;

    var mostrar = function (n) {
      filas.forEach(function (f, k) {
        var on = k === n;
        f.setAttribute('aria-pressed', String(on));
        f.parentNode.classList.toggle('es-activo', on);
      });
      medios.forEach(function (m, k) {
        var on = k === n;
        m.classList.toggle('es-activo', on);
        var v = m.querySelector('video');
        if (v) {
          if (on && !quieto && novVisible) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else if (!v.paused) v.pause();
        }
      });
      var fila = filas[n];
      var titulo = fila.querySelector('.nov__nombre').textContent;
      if (nombre) {
        if (quieto) nombre.textContent = titulo;
        else { nombre.classList.add('cambia'); setTimeout(function () { nombre.textContent = titulo; nombre.classList.remove('cambia'); }, 200); }
      }
      if (botonNov) {
        botonNov.href = EM.wa(fila.getAttribute('data-wa-texto'));
        botonNov.setAttribute('aria-label', 'Preguntar por WhatsApp por ' + titulo);
      }
      nAct = n;
      programar();
    };
    var programar = function () {
      clearTimeout(relojNov);
      caja.classList.remove('en-marcha');
      if (quieto || !novVisible || novEncima) return;
      void caja.offsetWidth;                     // reinicia la barra de progreso de la fila
      caja.classList.add('en-marcha');
      relojNov = setTimeout(function () { mostrar((nAct + 1) % filas.length); }, DUR);
    };
    caja.style.setProperty('--dur', DUR + 'ms');
    // Las fotos de la vitrina se piden cuando la sección se acerca (no con la primera vista)
    var cargarVitrina = function () {
      nov.querySelectorAll('.nov__medio img[data-src]').forEach(function (img) {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.src = img.dataset.src;
        img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
      });
    };
    if ('IntersectionObserver' in window) {
      var ioV = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { cargarVitrina(); ioV.disconnect(); } }, { rootMargin: '700px 0px' });
      ioV.observe(nov);
    } else cargarVitrina();
    filas.forEach(function (f, k) { f.addEventListener('click', function () { mostrar(k); }); });
    caja.addEventListener('mouseenter', function () { novEncima = true; programar(); });
    caja.addEventListener('mouseleave', function () { novEncima = false; programar(); });
    caja.addEventListener('focusin', function () { novEncima = true; programar(); });
    caja.addEventListener('focusout', function () { novEncima = false; programar(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        novVisible = es[0].isIntersecting;
        var v = medios[nAct].querySelector('video');
        if (v) { if (novVisible && !quieto) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
        programar();
      }, { threshold: 0.2 }).observe(caja);
    }
    mostrar(0);
  }

  /* ── 3 · Tratamientos: la tapa rosa se levanta al llegar ──────────── */
  var piezas = d.querySelectorAll('.pieza');
  indexar(piezas, 3);
  piezas.forEach(function (p) {
    if (!quieto) {
      var tapa = d.createElement('span'); tapa.className = 'tapa'; tapa.setAttribute('aria-hidden', 'true');
      p.querySelector('.pieza__foto').appendChild(tapa);
      p.classList.add('con-tapa');
    }
    EM.observar(p);
  });

  /* ── 4 · Medicina · 5 · Medallas · 6 · Opiniones · 7 · Cita · 8 · Regalo: entradas ── */
  indexar(d.querySelectorAll('.dato'));
  indexar(d.querySelectorAll('.medalla'));
  ['.datos', '.medallas', '[data-opiniones]', '[data-cita]', '[data-regalo]'].forEach(function (s) {
    d.querySelectorAll(s).forEach(EM.observar);
  });

  // Medallas: girar con clic o teclado (en ratón ya giran al pasar)
  d.querySelectorAll('.medalla__carta').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
  });

  /* ── 6 · Opiniones: una cita cada 6 s ─────────────────────────────── */
  var citas = d.querySelector('[data-citas]');
  if (citas) {
    var items = citas.querySelectorAll('.cita-op');
    var puntos = citas.querySelectorAll('.citas__puntos li');
    var cAct = 0, relojC = null, cVisible = false, cEncima = false;
    var irA = function (n) {
      cAct = (n + items.length) % items.length;
      items.forEach(function (it, k) { it.classList.toggle('es-activa', k === cAct); it.setAttribute('aria-hidden', String(k !== cAct)); });
      puntos.forEach(function (p, k) { p.classList.toggle('es-activo', k === cAct); p.classList.toggle('hecho', k < cAct); });
      rotar();
    };
    var rotar = function () {
      clearTimeout(relojC);
      citas.classList.remove('en-marcha');
      if (quieto || !cVisible || cEncima) return;
      void citas.offsetWidth;
      citas.classList.add('en-marcha');
      relojC = setTimeout(function () { irA(cAct + 1); }, 6000);
    };
    citas.querySelector('[data-citas-ant]').addEventListener('click', function () { irA(cAct - 1); });
    citas.querySelector('[data-citas-sig]').addEventListener('click', function () { irA(cAct + 1); });
    citas.addEventListener('mouseenter', function () { cEncima = true; rotar(); });
    citas.addEventListener('mouseleave', function () { cEncima = false; rotar(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { cVisible = es[0].isIntersecting; rotar(); }, { threshold: 0.3 }).observe(citas);
    }
    irA(0);
  }

  /* ── 7 · Cita: el mensaje de WhatsApp se compone marcando ─────────── */
  var form = d.querySelector('[data-consulta]');
  if (form) {
    var burbuja = d.querySelector('[data-burbuja]');
    var hora = d.querySelector('[data-burbuja-hora]');
    var oculto = form.querySelector('[data-consulta-texto]');
    var email = form.querySelector('[data-consulta-email]');
    var mensaje = function () {
      var que = (form.querySelector('input[name="que"]:checked') || {}).value || 'medicina estética facial';
      var cuando = (form.querySelector('input[name="cuando"]:checked') || {}).value || 'por la mañana';
      var nom = (form.querySelector('#consulta-nombre').value || '').trim().replace(/\s+/g, ' ');
      return (nom ? 'Hola, soy ' + nom + '. ' : 'Hola. ') + 'Me gustaría pedir una primera consulta gratuita para ' + que + ', mejor ' + cuando + '.';
    };
    var horaMadrid = function () {
      try { return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch (e) { return ''; }
    };
    var actualizar = function (latir) {
      var t = mensaje();
      oculto.value = t;
      if (email) email.href = 'mailto:elenamendez-belleza@hotmail.com?subject=' + encodeURIComponent('Primera consulta') + '&body=' + encodeURIComponent(t);
      if (burbuja) {
        if (quieto || !latir) burbuja.textContent = t;
        else {
          burbuja.classList.add('cambia');
          setTimeout(function () { burbuja.textContent = t; burbuja.classList.remove('cambia'); }, 140);
          var b = burbuja.parentNode; b.classList.remove('late'); void b.offsetWidth; b.classList.add('late');
        }
      }
      if (hora) hora.textContent = horaMadrid();
    };
    form.addEventListener('change', function () { actualizar(true); });
    var tecleo;
    form.querySelector('#consulta-nombre').addEventListener('input', function () { clearTimeout(tecleo); tecleo = setTimeout(function () { actualizar(true); }, 260); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      actualizar(false);
      window.open(EM.wa(mensaje()), '_blank', 'noopener');
    });
    actualizar(false);
  }

  /* ── 9 · El centro: la tira se desliza sola; al pulsar, el visor ──── */
  var tira = d.querySelector('[data-tira]');
  var visor = d.querySelector('[data-visor]');
  if (tira && visor) {
    var grupo = tira.querySelector('.tira__grupo');
    var fotos = Array.prototype.map.call(grupo.querySelectorAll('img'), function (img) {
      var mayor = (img.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(' ')[0]; }).pop() || img.src;
      return { src: mayor, alt: img.alt };
    });
    if (!quieto) {
      // Copia para que el bucle no tenga costura (oculta a lectores y al teclado)
      var copia = grupo.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      copia.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
      grupo.parentNode.appendChild(copia);
    }
    var vImg = visor.querySelector('[data-visor-img]'), vPie = visor.querySelector('[data-visor-pie]');
    var vAct = 0, precarga = new Image();
    var ver = function (n) {
      vAct = (n + fotos.length) % fotos.length;
      var f = fotos[vAct];
      var poner = function () { vImg.src = f.src; vImg.alt = f.alt; vPie.textContent = f.alt; };
      if (visor.open && !quieto) {
        vImg.classList.add('cambiando');
        var nueva = new Image(); nueva.src = f.src;
        var listo = function () { poner(); vImg.classList.remove('cambiando'); };
        (nueva.decode ? nueva.decode() : Promise.resolve()).then(listo, listo);
      } else poner();
      precarga.src = fotos[(vAct + 1) % fotos.length].src;
    };
    tira.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ampliar]');
      if (!b) return;
      ver(+b.getAttribute('data-ampliar'));
      if (typeof visor.showModal === 'function') visor.showModal(); else visor.setAttribute('open', '');
    });
    visor.querySelector('[data-visor-cerrar]').addEventListener('click', function () { visor.close ? visor.close() : visor.removeAttribute('open'); });
    visor.querySelector('[data-visor-ant]').addEventListener('click', function () { ver(vAct - 1); });
    visor.querySelector('[data-visor-sig]').addEventListener('click', function () { ver(vAct + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') ver(vAct - 1);
      if (e.key === 'ArrowRight') ver(vAct + 1);
    });
  }

  /* ── 9 · Horario en vivo (hora de Madrid; ?ahora=2026-10-26T18:30 para revisarlo) ── */
  var estado = d.querySelector('[data-estado]');
  if (estado) {
    var HORARIO = { 1: [600, 1200], 2: [600, 1200], 3: [600, 1200], 4: [600, 1200], 5: [600, 1200], 6: [600, 840], 0: null };
    var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var ahora = function () {
      var p = param('ahora');
      if (p) { var m = p.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); if (m) { var f = new Date(+m[1], +m[2] - 1, +m[3]); return { dia: f.getDay(), min: +m[4] * 60 + +m[5] }; } }
      try {
        var partes = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
        var v = {}; partes.forEach(function (x) { v[x.type] = x.value; });
        return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v.weekday), min: +v.hour * 60 + +v.minute };
      } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
    };
    var hhmm = function (m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
    var pintar = function () {
      var a = ahora(), h = HORARIO[a.dia], texto, abierto = false;
      if (h && a.min >= h[0] && a.min < h[1]) { abierto = true; texto = 'Abierto ahora, hasta las ' + hhmm(h[1]); }
      else {
        var dia = a.dia, salto = 0;
        if (h && a.min < h[0]) texto = 'Cerrado ahora. Abrimos hoy a las ' + hhmm(h[0]);
        else {
          do { dia = (dia + 1) % 7; salto++; } while (!HORARIO[dia] && salto < 7);
          texto = 'Cerrado ahora. Abrimos ' + (salto === 1 ? 'mañana' : 'el ' + DIAS[dia]) + ' a las ' + hhmm(HORARIO[dia][0]);
        }
      }
      estado.classList.toggle('abierto', abierto);
      estado.querySelector('[data-estado-texto]').textContent = texto;
      d.querySelectorAll('[data-horario] tr').forEach(function (tr) { tr.classList.toggle('hoy', +tr.getAttribute('data-dia') === a.dia); });
    };
    pintar();
    setInterval(pintar, 60000);
  }

  /* ── 9 · Mapa: se carga al pulsar (sin cookies de Google hasta entonces) ── */
  var mapa = d.querySelector('[data-mapa]');
  if (mapa) {
    mapa.querySelector('[data-cargar-mapa]').addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3030.4461280120277!2d-3.933160748910846!3d40.57590695376557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4177dc89f6e9c5%3A0xb214c9f1d158e8a6!2sCentro%20M%C3%A9dico%20Est%C3%A9tico%20Elena%20Mendez!5e0!3m2!1ses!2ses!4v1653559989848!5m2!1ses!2ses';
      f.title = 'Mapa: Centro Médico Estético Elena Méndez, C/ Nogal 1, Torrelodones';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      mapa.innerHTML = '';
      mapa.appendChild(f);
      f.focus();
    });
  }
})();
