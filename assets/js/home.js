/* Elena Méndez — home v2 «Órbita de luz»: la órbita de zonas del hero, el carrusel 3D de novedades,
   el índice con foto flotante, las cintas sin costura, medallas, la consulta que se compone,
   la tira del centro con su visor, el horario en vivo y el mapa. */
(function () {
  'use strict';
  var d = document, EM = window.EM || { quieto: true, wa: function (t) { return 'https://wa.me/34682937011?text=' + encodeURIComponent(t); }, observar: function (el) { el.classList.add('visto'); } };
  var quieto = EM.quieto;
  var param = function (n) { var m = location.search.match(new RegExp('[?&]' + n + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : null; };
  var indexar = function (lista, modulo) { Array.prototype.forEach.call(lista, function (el, i) { el.style.setProperty('--i', modulo ? i % modulo : i); }); };
  var conRaton = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var visible = function (el, cb, opciones) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, opciones || { threshold: 0.15 }).observe(el);
  };

  /* ── Cintas que se deslizan solas: tantas copias como hagan falta para no ver la costura ── */
  if (!quieto) {
    d.querySelectorAll('[data-duplica]').forEach(function (pista) {
      var grupo = pista.firstElementChild;
      if (!grupo) return;
      var ancho = grupo.getBoundingClientRect().width || 1;
      var copias = Math.max(2, Math.ceil((window.innerWidth * 1.15) / ancho) + 1);
      for (var k = 1; k < copias; k++) {
        var c = grupo.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = -1; });
        c.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
        pista.appendChild(c);
      }
      pista.style.setProperty('--copias', copias);
    });
  }

  /* ── 1 · Hero: la órbita de zonas ─────────────────────────────────── */
  var hero = d.querySelector('[data-hero]');
  if (hero) {
    var PANEL = {
      mirada: '<strong>Para tu mirada:</strong> ojeras sin cirugía, patas de gallo, bolsas, pestañas y cejas.',
      labios: '<strong>Para tus labios:</strong> ácido hialurónico, sonrisa gingival y micropigmentación.',
      ovalo: '<strong>Para tu óvalo:</strong> hilos tensores, Endolift, HIFU y radiofrecuencia Indiba.',
      piel: '<strong>Para tu piel:</strong> manchas con Mesoestetic, láser ND-YAG, peelings, Dermapen con Indiba y La Cápsula del Tiempo.',
      pomulos: '<strong>Para tus pómulos:</strong> ácido hialurónico, Radiesse y HIFU.',
      expresion: '<strong>Para tu expresión:</strong> arrugas dinámicas de frente y entrecejo, Karisma Rh Collagen y exosomas.'
    };
    var escenario = hero.querySelector('[data-escenario]');
    var arco = hero.querySelector('[data-arco]');
    var astros = Array.prototype.slice.call(hero.querySelectorAll('.astro'));
    var marcas = hero.querySelectorAll('.marca');
    var frases = hero.querySelectorAll('.hero__frase');
    var panel = hero.querySelector('[data-panel]');
    var N = astros.length, PASO = Math.PI * 2 / N;
    var actual = null;

    // Cada frase, letra a letra (para que cambie con movimiento propio)
    frases.forEach(function (f) {
      f.classList.remove('es-activa');
      Array.prototype.forEach.call(f.children, function (linea) {
        var txt = linea.textContent;
        linea.textContent = '';
        Array.prototype.forEach.call(txt, function (ch, i) {
          var s = d.createElement('span');
          s.className = 'letra';
          s.style.setProperty('--c', i);
          s.textContent = ch;
          linea.appendChild(s);
        });
      });
    });

    var activar = function (z) {
      if (z === actual) return;
      marcas.forEach(function (m) { m.classList.toggle('es-activa', m.getAttribute('data-zona') === z); });
      astros.forEach(function (a) {
        var on = a.getAttribute('data-zona') === z;
        a.classList.toggle('es-activa', on);
        a.querySelector('button').setAttribute('aria-pressed', String(on));
      });
      frases.forEach(function (f) {
        if (f.getAttribute('data-zona') === z) { f.classList.remove('sale'); f.classList.add('es-activa'); }
        else if (f.classList.contains('es-activa')) {
          f.classList.remove('es-activa'); f.classList.add('sale');
          setTimeout(function () { f.classList.remove('sale'); }, 700);
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
    };

    // Geometría de la elipse: alrededor del arco, como un anillo; delante pasa por el pie del arco
    var G = {};
    var medir = function () {
      var e = escenario.getBoundingClientRect(), a = arco.getBoundingClientRect();
      var anchoAstro = 120;
      G.cx = a.left - e.left + a.width / 2;
      G.cy = a.top - e.top + a.height * 0.58;
      G.rx = Math.min(a.width / 2 + anchoAstro * 0.5, e.width / 2 - 10);
      G.ry = a.height * 0.43;
    };
    var ang = Math.PI / 2;            // la zona 0 (mirada) empieza delante
    var objetivo = null, crecer = quieto ? 1 : 0;
    var colocar = function () {
      var delanteMax = -2, quien = null;
      astros.forEach(function (a, i) {
        var t = ang + i * PASO;
        var s = Math.sin(t), c = Math.cos(t);
        var x = G.cx + G.rx * c * crecer, y = G.cy + G.ry * s * crecer;
        var p = (s + 1) / 2;                                     // 0 detrás, 1 delante
        var esc = (0.84 + 0.21 * p) * (0.4 + 0.6 * crecer);     // detrás, nunca por debajo de 44 px de diana
        a.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + esc.toFixed(3) + ')';
        a.style.opacity = ((0.42 + 0.58 * p) * crecer).toFixed(3);
        a.classList.toggle('delante', s > -0.2);
        if (s > delanteMax) { delanteMax = s; quien = a.getAttribute('data-zona'); }
      });
      return quien;
    };

    var heroVisible = true, encima = false, ultimo = 0, rafHero = null, inicio = 0;
    var VUELTA = 42000;               // una vuelta entera, en ms
    var bucle = function (ahora) {
      rafHero = null;
      if (!heroVisible || d.hidden) { ultimo = 0; return; }
      var dt = ultimo ? Math.min(64, ahora - ultimo) : 16;
      ultimo = ahora;
      if (crecer < 1) {                                           // las zonas salen del arco a su órbita
        var q = Math.min(1, (ahora - inicio) / 1300);
        crecer = 1 - Math.pow(1 - q, 3);
      }
      if (objetivo !== null) {                                    // girar hasta traer al frente la zona pulsada
        var dif = objetivo - ang;
        ang += dif * Math.min(1, dt / 160);
        if (Math.abs(dif) < 0.002) { ang = objetivo; objetivo = null; }
      } else if (!encima) {
        ang += (Math.PI * 2) * (dt / VUELTA);
      }
      var delante = colocar();
      if (delante && !encima && objetivo === null) activar(delante);
      rafHero = requestAnimationFrame(bucle);
    };
    var arrancar = function () { if (!quieto && !rafHero && heroVisible) rafHero = requestAnimationFrame(bucle); };

    var alFrente = function (i) {
      var meta = Math.PI / 2 - i * PASO;
      var vueltas = Math.round((ang - meta) / (Math.PI * 2));
      meta += vueltas * Math.PI * 2;
      if (meta - ang > Math.PI) meta -= Math.PI * 2;
      if (ang - meta > Math.PI) meta += Math.PI * 2;
      return meta;
    };

    astros.forEach(function (a, i) {
      var b = a.querySelector('button'), z = a.getAttribute('data-zona');
      b.addEventListener('mouseenter', function () { activar(z); });
      b.addEventListener('focus', function () { activar(z); });
      b.addEventListener('click', function () {
        activar(z);
        if (quieto) { ang = alFrente(i); colocar(); }
        else { objetivo = alFrente(i); arrancar(); }
      });
    });
    escenario.addEventListener('mouseenter', function () { encima = true; });
    escenario.addEventListener('mouseleave', function () { encima = false; });

    medir();
    var inicial = param('zona');
    var iIni = Math.max(0, astros.findIndex(function (a) { return a.getAttribute('data-zona') === inicial; }));
    if (quieto || inicial) {
      ang = alFrente(iIni); crecer = 1;
      colocar();
      activar(astros[iIni].getAttribute('data-zona'));
    } else {
      colocar();
      setTimeout(function () { activar('mirada'); }, 350);
      setTimeout(function () { inicio = performance.now(); arrancar(); }, 2000);
    }
    var redimensionar;
    addEventListener('resize', function () { clearTimeout(redimensionar); redimensionar = setTimeout(function () { medir(); colocar(); }, 120); });
    visible(hero, function (v) { heroVisible = v; if (v) arrancar(); }, { threshold: 0.05 });
    d.addEventListener('visibilitychange', function () { if (!d.hidden) { ultimo = 0; arrancar(); } });
  }

  /* ── 2 · Novedades: carrusel 3D ───────────────────────────────────── */
  var car = d.querySelector('[data-carrusel]');
  if (car) {
    var tarjetas = Array.prototype.slice.call(car.querySelectorAll('.tarjeta'));
    var puntos = car.querySelector('[data-carrusel-puntos]');
    var NT = tarjetas.length, cAct = 0, relojCar = null, carVisible = false, carEncima = false;
    var DUR = 5200;
    tarjetas.forEach(function () { puntos.appendChild(d.createElement('li')); });
    var listaPuntos = puntos.querySelectorAll('li');
    car.style.setProperty('--dur', DUR + 'ms');

    var cargarFotos = function () {
      car.querySelectorAll('img[data-src]').forEach(function (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); });
    };
    var colocarCar = function () {
      var w = tarjetas[0].offsetWidth, movil = window.innerWidth < 900;
      tarjetas.forEach(function (t, i) {
        var o = ((i - cAct) % NT + NT) % NT;
        if (o > NT / 2) o -= NT;
        var abs = Math.abs(o);
        var x = o * w * (movil ? 0.8 : 0.72);
        var z = -abs * (movil ? 130 : 180);
        var giro = -o * (movil ? 22 : 30);
        var seVe = abs <= (movil ? 1 : 2);
        t.style.transform = 'translateX(' + x.toFixed(1) + 'px) translateZ(' + z + 'px) rotateY(' + giro + 'deg)';
        t.style.opacity = seVe ? '1' : '0';
        t.style.zIndex = String(20 - abs);
        t.style.setProperty('--velo', abs ? Math.min(0.35 + abs * 0.25, 0.9).toFixed(2) : '0');
        t.classList.toggle('es-activa', o === 0);
        t.setAttribute('aria-hidden', String(o !== 0));
        t.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = o === 0 ? 0 : -1; });
        var v = t.querySelector('video');
        if (v) {
          if (o === 0 && carVisible && !quieto) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else if (!v.paused) v.pause();
        }
      });
      listaPuntos.forEach(function (p, k) { p.classList.toggle('es-activo', k === cAct); });
    };
    var programarCar = function () {
      clearTimeout(relojCar);
      car.classList.remove('en-marcha');
      if (quieto || !carVisible || carEncima) return;
      void car.offsetWidth;
      car.classList.add('en-marcha');
      relojCar = setTimeout(function () { ir(cAct + 1); }, DUR);
    };
    var ir = function (n) { cAct = (n + NT) % NT; colocarCar(); programarCar(); };

    car.querySelector('[data-carrusel-ant]').addEventListener('click', function () { ir(cAct - 1); });
    car.querySelector('[data-carrusel-sig]').addEventListener('click', function () { ir(cAct + 1); });
    tarjetas.forEach(function (t, i) {
      t.addEventListener('click', function (e) { if (!t.classList.contains('es-activa')) { e.preventDefault(); ir(i); } });
    });
    car.addEventListener('mouseenter', function () { carEncima = true; programarCar(); });
    car.addEventListener('mouseleave', function () { carEncima = false; programarCar(); });
    car.addEventListener('focusin', function () { carEncima = true; programarCar(); });
    car.addEventListener('focusout', function () { carEncima = false; programarCar(); });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { ir(cAct + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { ir(cAct - 1); e.preventDefault(); }
    });
    // Arrastrar o deslizar con el dedo
    var x0 = null;
    var escena = car.querySelector('[data-escena-carrusel]');
    escena.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    escena.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) ir(cAct + (dx < 0 ? 1 : -1));
    });
    escena.addEventListener('pointercancel', function () { x0 = null; });

    visible(car, function (v) { if (v) cargarFotos(); }, { rootMargin: '700px 0px', threshold: 0 });
    visible(car, function (v) { carVisible = v; colocarCar(); programarCar(); }, { threshold: 0.25 });
    addEventListener('resize', function () { colocarCar(); });
    colocarCar();
  }

  /* ── 3 · Tratamientos: la foto de cada página flota junto al cursor ─ */
  var indice = d.querySelector('[data-indice]');
  var flot = d.querySelector('[data-flotante]');
  var filas = d.querySelectorAll('.indice__fila');
  indexar(filas);
  filas.forEach(EM.observar);
  if (indice && flot && conRaton && !quieto) {
    var cuerpo = flot.querySelector('.flotante__cuerpo');
    var capas = [flot.querySelector('[data-flotante-a]'), flot.querySelector('[data-flotante-b]')];
    var capa = 0, fx = 0, fy = 0, tx = 0, ty = 0, dentro = false, rafF = null, primera = true;
    var bucleF = function () {
      fx += (tx - fx) * 0.16; fy += (ty - fy) * 0.16;
      var inclina = Math.max(-6, Math.min(6, (tx - fx) * 0.05));
      flot.style.transform = 'translate3d(' + fx.toFixed(1) + 'px,' + fy.toFixed(1) + 'px,0) rotate(' + inclina.toFixed(2) + 'deg)';
      if (dentro || Math.abs(tx - fx) > 0.5 || Math.abs(ty - fy) > 0.5) rafF = requestAnimationFrame(bucleF); else rafF = null;
    };
    indice.querySelectorAll('.indice__enlace').forEach(function (en) {
      var apuntar = function (e) {
        var r = en.getBoundingClientRect();
        var w = flot.offsetWidth, h = flot.offsetHeight;
        tx = Math.min(e.clientX + 36, r.right - w - 8);           // nunca sobre el botón «Pedir cita»
        tx = Math.max(r.left, tx);
        ty = e.clientY - h - 22;                                  // por encima del cursor: el nombre señalado se sigue leyendo
      };
      en.addEventListener('pointerenter', function (e) {
        var src = en.getAttribute('data-flota');
        capa = 1 - capa;
        capas[capa].src = src;
        capas[capa].classList.add('activa');
        capas[1 - capa].classList.remove('activa');
        cuerpo.style.setProperty('--r', en.getAttribute('data-flota-r') || '1.6');
        apuntar(e);
        if (primera || !flot.classList.contains('visible')) { fx = tx; fy = ty; primera = false; }
        dentro = true;
        flot.classList.add('visible');
        if (!rafF) rafF = requestAnimationFrame(bucleF);
      });
      en.addEventListener('pointermove', apuntar);
      en.addEventListener('pointerleave', function () { dentro = false; flot.classList.remove('visible'); });
    });
    addEventListener('scroll', function () { if (!dentro) return; dentro = false; flot.classList.remove('visible'); }, { passive: true });
  }

  /* ── Entradas al llegar ───────────────────────────────────────────── */
  indexar(d.querySelectorAll('.dato'));
  indexar(d.querySelectorAll('.medalla'));
  ['.datos', '.medallas', '[data-medicina]', '[data-opiniones]', '[data-cita]', '[data-regalo]'].forEach(function (s) {
    d.querySelectorAll(s).forEach(EM.observar);
  });

  // Medallas: con ratón giran al pasar (por dentro: el botón no se mueve); en pantallas táctiles, al tocar
  d.querySelectorAll('.medalla__boton').forEach(function (b) {
    b.addEventListener('click', function () {
      if (conRaton) return;
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    });
  });

  /* ── 8 · Cita: el mensaje de WhatsApp se compone marcando (nada marcado de inicio) ── */
  var form = d.querySelector('[data-consulta]');
  if (form) {
    var burbuja = d.querySelector('[data-burbuja]');
    var hora = d.querySelector('[data-burbuja-hora]');
    var oculto = form.querySelector('[data-consulta-texto]');
    var email = form.querySelector('[data-consulta-email]');
    var mensaje = function () {
      var que = (form.querySelector('input[name="que"]:checked') || {}).value;
      var cuando = (form.querySelector('input[name="cuando"]:checked') || {}).value;
      var nom = (form.querySelector('#consulta-nombre').value || '').trim().replace(/\s+/g, ' ');
      var t = nom ? 'Hola, soy ' + nom + '. ' : 'Hola. ';
      t += 'Me gustaría pedir una primera consulta gratuita';
      if (que) t += ' para ' + que;
      if (cuando) t += ', mejor ' + cuando;
      return t + '.';
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

  /* ── 10 · El centro: la tira se desliza sola; al pulsar, el visor ──── */
  var tira = d.querySelector('[data-tira]');
  var visor = d.querySelector('[data-visor]');
  if (tira && visor) {
    var grupoTira = tira.querySelector('.tira__grupo');
    var fotos = Array.prototype.map.call(grupoTira.querySelectorAll('img'), function (img) {
      var mayor = (img.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(' ')[0]; }).pop() || img.src;
      return { src: mayor, alt: img.alt };
    });
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

  /* ── 10 · Horario en vivo (hora de Madrid; ?ahora=2026-10-26T18:30 para revisarlo) ── */
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

  /* ── 10 · Mapa: se carga al pulsar (sin cookies de Google hasta entonces) ── */
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
