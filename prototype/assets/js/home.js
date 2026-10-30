/* Elena Méndez — home v5 «Oro líquido»: la escena del oro (entrada, cursor e inundación al bajar), las
   promociones que se retiran del oro y lo llaman con el cursor, «Novedades» por dentro de sus letras,
   la rueda de tratamientos, las monedas y la cita escrita como una frase. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, EM = window.EM || { quieto: true, observar: function (el) { el.classList.add('visto'); } };
  var quieto = EM.quieto;
  var conRaton = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var CORREO = 'elenamendez-belleza@hotmail.com';
  var limita = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  var tramo = function (x, a, b) { var t = limita((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  var visible = function (el, cb, op) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, op || { threshold: 0 }).observe(el);
  };

  /* Botones: dentro de cada uno, tres gotas de oro que se unen al pasar */
  d.querySelectorAll('.boton').forEach(function (b) {
    var o = d.createElement('span');
    o.className = 'boton__oro';
    o.setAttribute('aria-hidden', 'true');
    o.innerHTML = '<i></i><i></i><i></i>';
    b.insertBefore(o, b.firstChild);
  });

  /* ── 1 · Oro líquido ─────────────────────────────────────────────────── */
  var oro = d.querySelector('[data-oro]');
  if (oro) {
    var lienzo = oro.querySelector('[data-oro-lienzo]');
    var foto = oro.querySelector('[data-oro-foto]');
    var hueco = oro.querySelector('[data-hueco]');
    var capaHero = oro.querySelector('[data-hero]');
    var capaTexto = oro.querySelector('[data-oro-texto]');
    var t1 = oro.querySelector('.oro__t1'), t2 = oro.querySelector('.oro__t2');
    var acciones = oro.querySelector('.oro__acciones');
    var motor = null, enPantalla = true, ultimo = 0, inicio = 0, raf = null;
    var cuenta = 0, acumulado = 0, bajadas = 0;

    // El titular entra palabra a palabra
    if (!quieto) {
      var n = 0;
      oro.querySelectorAll('[data-palabras]').forEach(function (s) {
        var ps = s.textContent.trim().split(/ +/);
        s.textContent = '';
        ps.forEach(function (w, i) {
          var c = d.createElement('span'), den = d.createElement('span');
          c.className = 'palabra';
          den.style.setProperty('--p', n++);
          den.textContent = w;
          c.appendChild(den);
          s.appendChild(c);
          if (i < ps.length - 1) s.appendChild(d.createTextNode(' '));
        });
      });
      oro.classList.add('entrando');
      setTimeout(function () { oro.classList.remove('entrando'); }, 4200);
    }

    var progreso = function () {
      var r = oro.getBoundingClientRect(), recorrido = r.height - lienzo.parentNode.offsetHeight;
      return recorrido > 0 ? limita(-r.top / recorrido, 0, 1) : 0;
    };
    var aplicarScroll = function (p) {
      if (quieto || !motor) return;
      motor.estado.f = tramo(p, .06, .62);
      var sal = tramo(p, .02, .2);
      t1.style.transform = 'translateX(' + (-sal * 9) + 'vw)';
      t2.style.transform = 'translateX(' + (sal * 9) + 'vw)';
      capaHero.style.opacity = String(1 - tramo(p, .06, .22));
      capaHero.style.visibility = p > .24 ? 'hidden' : '';
      var ent = tramo(p, .52, .7);
      capaTexto.style.opacity = String(ent);
      capaTexto.style.transform = 'translateY(' + ((1 - ent) * 40) + 'px)';
      capaTexto.style.visibility = ent > 0 ? 'visible' : 'hidden';
    };
    var bucle = function (ahora) {
      raf = null;
      if (!enPantalla || d.hidden) { ultimo = 0; return; }
      var dt = ultimo ? Math.min(.05, (ahora - ultimo) / 1000) : .016;
      if (ultimo && bajadas < 3) {
        acumulado += ahora - ultimo; cuenta++;
        if (cuenta === 40) { if (acumulado / 40 > 30) { motor.bajarCalidad(); bajadas++; } cuenta = 0; acumulado = 0; }
      }
      ultimo = ahora;
      motor.paso(dt);
      motor.estado.i = limita((ahora - inicio) / 2800, 0, 1);
      aplicarScroll(progreso());
      motor.pintar();
      raf = requestAnimationFrame(bucle);
    };
    var arrancar = function () { if (!raf && motor && !quieto && enPantalla) raf = requestAnimationFrame(bucle); };

    var sinGL = function () { html.classList.add('sin-gl'); capaTexto.style.visibility = ''; };
    var montar = function () {
      try { motor = window.OroLiquido && OroLiquido.crear(lienzo, foto, { hueco: hueco, quieto: quieto, t: 47 }); }
      catch (e) { motor = null; }
      if (!motor) { sinGL(); return; }
      html.classList.add('con-gl');
      inicio = performance.now();
      if (quieto) { motor.estado.i = 1; motor.pintar(); }
      else arrancar();
      var red;
      addEventListener('resize', function () { clearTimeout(red); red = setTimeout(function () { motor.medir(); if (quieto) motor.pintar(); }, 120); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { motor.medir(); if (quieto) motor.pintar(); });
      if (!quieto) {
        var escena = lienzo.parentNode;
        escena.addEventListener('pointermove', function (e) { motor.raton(e.clientX, e.clientY); });
        escena.addEventListener('pointerleave', function () { motor.fuera(); });
        escena.addEventListener('pointercancel', function () { motor.fuera(); });
        visible(oro, function (v) { enPantalla = v; if (v) { ultimo = 0; arrancar(); } });
        d.addEventListener('visibilitychange', function () { if (!d.hidden) { ultimo = 0; arrancar(); } });
      }
    };
    if (foto.complete && foto.naturalWidth) montar();
    else { foto.addEventListener('load', montar, { once: true }); foto.addEventListener('error', sinGL, { once: true }); }
  }

  /* ── 2 · Promociones: el oro se retira al llegar y vuelve desde el cursor ── */
  var promos = d.querySelector('[data-promos]');
  if (promos) {
    if (!quieto) html.classList.add('promos-cubiertas');
    EM.observar(promos);
    promos.querySelectorAll('.promo').forEach(function (c) {
      var punto = function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--px', (e.clientX - r.left) + 'px');
        c.style.setProperty('--py', (e.clientY - r.top) + 'px');
      };
      c.addEventListener('pointerenter', punto);
      // En pantallas táctiles, un toque abre su detalle (y otro lo cierra)
      c.addEventListener('click', function (e) {
        if (conRaton || e.target.closest('a')) return;
        punto(e);
        var abierta = c.classList.contains('abierta');
        promos.querySelectorAll('.abierta').forEach(function (o) { o.classList.remove('abierta'); });
        if (!abierta) c.classList.add('abierta');
      });
    });
  }

  /* ── 3 · Novedades: se entra por las letras y luego pasan sus tres novedades ── */
  var nov = d.querySelector('[data-nov]');
  var pasarNovedades = function () {};
  if (nov) {
    var mascara = nov.querySelector('[data-nov-mascara]');
    var pista = nov.querySelector('[data-nov-pista]');
    var letra = nov.querySelector('[data-nov-letra]');
    var videos = Array.prototype.slice.call(nov.querySelectorAll('.nov__panel')).map(function (p) { return p.querySelector('video'); });
    var novVisible = false, panelActual = -1;
    var origen = function () {
      // El zoom apunta al trazo grueso de la «d»: al crecer, el trazo llena la pantalla
      var w = mascara.getBoundingClientRect(), l = letra.getBoundingClientRect();
      mascara.style.transformOrigin = (l.left + l.width * .74 - w.left) + 'px ' + (l.top + l.height * .5 - w.top) + 'px';
    };
    var reproducir = function () {
      videos.forEach(function (v, k) {
        if (!v) return;
        if (k === panelActual && novVisible && !quieto) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    };
    if (quieto) { mascara.hidden = true; }
    else {
      pasarNovedades = function () {
        var r = nov.getBoundingClientRect(), rec = r.height - nov.firstElementChild.offsetHeight;
        var p = rec > 0 ? limita(-r.top / rec, 0, 1) : 0;
        var z = tramo(p, .02, .3);
        var escala = 1 + Math.pow(z, 2.6) * 70;
        mascara.style.transform = 'scale(' + escala.toFixed(3) + ')';
        mascara.style.opacity = String(1 - tramo(p, .27, .31));
        mascara.style.visibility = p > .31 ? 'hidden' : '';
        pista.style.setProperty('--texto', String(tramo(p, .29, .34)));
        // Paradas en cada panel y tránsito entre ellos
        var x = tramo(p, .46, .58) + tramo(p, .72, .84);
        pista.style.transform = 'translateX(' + (-x * 100 / 3).toFixed(3) + '%)';
        var actual = Math.round(x);
        if (actual !== panelActual) { panelActual = actual; reproducir(); }
      };
      origen();
      addEventListener('resize', origen);
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(origen);
    }
    visible(nov, function (v) { novVisible = v; reproducir(); if (quieto) videos.forEach(function (x) { if (x) x.preload = 'metadata'; }); });
  }

  /* ── 4 · La rueda: sus siete páginas en un cilindro de nombres ─────────── */
  var rueda = d.querySelector('[data-rueda]');
  if (rueda) {
    var NOMBRES = ['Medicina estética', 'Faciales', 'Corporales', 'Depilación láser', 'Micropigmentación', 'Espacio de salud', 'Otros tratamientos'];
    var cil = rueda.querySelector('[data-rueda-cilindro]');
    var marco = rueda.querySelector('[data-rueda-marco]');
    var fotos = rueda.querySelectorAll('.rueda__fotos img');
    var paneles = rueda.querySelectorAll('.rueda__panel');
    var CARAS = 14, PASO = 360 / CARAS, pos = 0, relojR = null, ruedaVisible = false, ruedaEncima = false;
    for (var k = 0; k < CARAS; k++) {
      var cara = d.createElement('div');
      cara.className = 'rueda__cara';
      cara.setAttribute('role', 'listitem');
      cara.style.setProperty('--a', (k * PASO) + 'deg');
      var bt = d.createElement('button');
      bt.type = 'button';
      bt.textContent = NOMBRES[k % 7];
      if (k >= 7) { cara.setAttribute('aria-hidden', 'true'); bt.tabIndex = -1; }
      (function (c) { bt.addEventListener('click', function () { irA(c, true); }); })(k);
      cara.appendChild(bt);
      cil.appendChild(cara);
    }
    var pintarR = function () {
      cil.style.setProperty('--giro', (-pos * PASO) + 'deg');
      var i = ((pos % 7) + 7) % 7;
      fotos.forEach(function (f, j) { f.classList.toggle('es-activa', j === i); });
      paneles.forEach(function (f, j) { f.classList.toggle('es-activa', j === i); });
    };
    var programarR = function () {
      clearTimeout(relojR);
      if (quieto || !ruedaVisible || ruedaEncima) return;
      relojR = setTimeout(function () { pos++; pintarR(); programarR(); }, 4200);
    };
    // Va a la cara por el camino más corto
    var irA = function (cara, elegida) {
      var actual = ((pos % CARAS) + CARAS) % CARAS, dif = cara - actual;
      if (dif > CARAS / 2) dif -= CARAS;
      if (dif < -CARAS / 2) dif += CARAS;
      pos += dif;
      pintarR();
      if (elegida) programarR();
    };
    rueda.addEventListener('mouseenter', function () { ruedaEncima = true; programarR(); });
    rueda.addEventListener('mouseleave', function () { ruedaEncima = false; programarR(); });
    marco.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    }, { passive: true });
    pintarR();
    visible(rueda, function (v) { ruedaVisible = v; programarR(); }, { threshold: .3 });
  }

  /* ── 5 · Monedas: giran con el scroll hasta quedar de frente ───────────── */
  var monedas = d.querySelector('[data-monedas]');
  var girarMonedas = function () {};
  if (monedas && !quieto) {
    var caras = monedas.querySelectorAll('.moneda__cara');
    var fichas = monedas.querySelectorAll('.moneda');
    girarMonedas = function () {
      var r = monedas.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      caras.forEach(function (c, i) {
        var p = limita((fichas[i].getBoundingClientRect().top - vh * .6) / (vh * .4), 0, 1);
        c.style.transform = p ? 'rotateY(' + (p * (540 + i * 72)).toFixed(1) + 'deg)' : '';
      });
    };
  }

  /* Lo que depende del scroll, una vez por fotograma */
  var pendiente = false;
  var alBajar = function () {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; pasarNovedades(); girarMonedas(); });
  };
  addEventListener('scroll', alBajar, { passive: true });
  addEventListener('resize', alBajar);
  alBajar();

  /* ── 6 · La cita, escrita como una frase; va por correo ────────────────── */
  var form = d.querySelector('[data-frase]');
  if (form) {
    var aviso = form.querySelector('[data-frase-aviso]');
    // Cada hueco mide lo que su texto, con la tipografía real
    var regla = d.createElement('canvas').getContext('2d');
    var mide = function (el, txt) { var cs = getComputedStyle(el); regla.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; return regla.measureText(txt).width; };
    var tope = function (px) { return Math.min(Math.ceil(px), form.clientWidth - 24) + 'px'; };
    var ajusta = function (el) { el.style.width = tope(mide(el, el.value || el.placeholder || '') + 12); };
    form.querySelectorAll('.frase__hueco input').forEach(function (i) { ajusta(i); i.addEventListener('input', function () { ajusta(i); i.closest('.frase__hueco').classList.remove('con-error'); }); });
    var interes = form.querySelector('[name="interes"]');
    var ajustaLista = function () {
      interes.style.width = tope(mide(interes, interes.options[interes.selectedIndex].text) * 1.02 + 34);
    };
    ajustaLista();
    interes.addEventListener('change', ajustaLista);
    var reajusta = function () { form.querySelectorAll('.frase__hueco input').forEach(ajusta); ajustaLista(); };
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(reajusta);
    addEventListener('resize', reajusta);
    form.addEventListener('change', function (e) { if (e.target.name === 'acepto') form.querySelector('.frase__acepto').classList.remove('con-error'); });

    d.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cita]');
      if (!a) return;
      var v = a.getAttribute('data-cita');
      if (Array.prototype.some.call(interes.options, function (o) { return o.value === v; })) { interes.value = v; ajustaLista(); }
      if (conRaton) setTimeout(function () { var n = form.querySelector('[name="nombre"]'); if (n && !n.value) n.focus({ preventScroll: true }); }, quieto ? 0 : 800);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var nombre = f.nombre.value.trim(), tel = f.telefono.value.trim(), email = f.email.value.trim(), que = f.interes.value;
      var falta = [];
      form.querySelectorAll('.con-error').forEach(function (x) { x.classList.remove('con-error'); });
      if (!nombre) { falta.push(f.nombre); f.nombre.closest('.frase__hueco').classList.add('con-error'); }
      if (tel.replace(/\D/g, '').length < 9) { falta.push(f.telefono); f.telefono.closest('.frase__hueco').classList.add('con-error'); }
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { falta.push(f.email); f.email.closest('.frase__hueco').classList.add('con-error'); }
      if (!f.acepto.checked) { falta.push(f.acepto); form.querySelector('.frase__acepto').classList.add('con-error'); }
      if (falta.length) {
        aviso.textContent = !nombre ? 'Falta tu nombre.' : tel.replace(/\D/g, '').length < 9 ? 'Falta un teléfono de 9 cifras.' : !f.acepto.checked ? 'Falta aceptar la política de privacidad.' : 'Revisa tu correo.';
        falta[0].focus();
        return;
      }
      var asunto = 'Cita' + (que ? ': ' + que : '') + ' (' + nombre + ')';
      var cuerpo = 'Me llamo ' + nombre + ' y quiero cita para ' + (que || 'lo que me aconsejéis') + '.\nPodéis llamarme al ' + tel + (email ? ' o escribirme a ' + email : '') + '.';
      location.href = 'mailto:' + CORREO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
      aviso.textContent = 'Se ha abierto tu correo con la cita escrita: solo tienes que enviarlo.';
    });
  }
})();
