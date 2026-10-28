/* Elena Méndez — home v3: la entrada del hero, los «Pedir cita» que dejan elegido el tratamiento en el
   formulario, los vídeos de las novedades, la carta de tratamientos, las medallas y la cita por correo. */
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

  /* ── 1 · Hero: su titular sube palabra a palabra ─────────────────────── */
  var hero = d.querySelector('[data-hero]');
  if (hero) {
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
      // Acabada la entrada, la foto pasa a respirar despacio
      setTimeout(function () { hero.classList.remove('entrando'); }, 3400);
    }
  }

  /* ── 2 · «Pedir cita» desde una promoción, una novedad o un tratamiento:
     baja al formulario con ese tratamiento ya elegido ─────────────────── */
  var form = d.querySelector('[data-cita-form]');
  var interes = form && form.querySelector('[name="interes"]');
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cita]');
    if (!a || !interes) return;
    var v = a.getAttribute('data-cita');
    var hay = Array.prototype.some.call(interes.options, function (o) { return o.value === v; });
    if (!hay) return;
    interes.value = v;
    var campo = interes.closest('.campo');
    campo.classList.remove('recien');
    void campo.offsetWidth;
    campo.classList.add('recien');
    setTimeout(function () { campo.classList.remove('recien'); }, 2600);
    // Con ratón, el cursor de escritura ya espera en el nombre (en el móvil no, para no abrir el teclado)
    if (conRaton) setTimeout(function () { var n = form.querySelector('[name="nombre"]'); if (n && !n.value) n.focus({ preventScroll: true }); }, quieto ? 0 : 750);
  });

  /* ── 3 · Novedades: sus vídeos, en marcha solo mientras se ven ───────── */
  if (!quieto) {
    d.querySelectorAll('[data-video]').forEach(function (v) {
      visible(v, function (si) {
        if (si) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else if (!v.paused) v.pause();
      }, { threshold: 0.3 });
    });
  }

  /* ── 4 · La carta de tratamientos: pestañas que avanzan solas ────────── */
  var carta = d.querySelector('[data-carta]');
  if (carta) {
    var pestanas = Array.prototype.slice.call(carta.querySelectorAll('[role="tab"]'));
    var paneles = pestanas.map(function (p) { return d.getElementById(p.getAttribute('aria-controls')); });
    var indice = carta.querySelector('.carta__indice');
    var act = 0, reloj = null, cartaVisible = false, cartaEncima = false, DUR = 6500;
    carta.style.setProperty('--dur', DUR + 'ms');
    var programar = function () {
      clearTimeout(reloj);
      carta.classList.remove('en-marcha');
      if (quieto || !cartaVisible || cartaEncima) return;
      void carta.offsetWidth;
      carta.classList.add('en-marcha');
      reloj = setTimeout(function () { activar(act + 1); }, DUR);
    };
    // elegida: la que ha elegido la persona (no la que trae la carta al avanzar sola)
    var activar = function (i, foco, elegida) {
      act = (i + pestanas.length) % pestanas.length;
      pestanas.forEach(function (p, k) {
        var on = k === act;
        p.setAttribute('aria-selected', String(on));
        p.classList.toggle('elegida', on && !!elegida);
        p.tabIndex = on ? 0 : -1;
        paneles[k].classList.toggle('es-activo', on);
      });
      if (foco) pestanas[act].focus();
      // En el móvil, la pestaña activa se ve dentro de su fila (sin mover la página)
      if (indice.scrollWidth > indice.clientWidth + 2) {
        var p = pestanas[act];
        indice.scrollTo({ left: p.offsetLeft - (indice.clientWidth - p.offsetWidth) / 2, behavior: quieto ? 'auto' : 'smooth' });
      }
      programar();
    };
    pestanas.forEach(function (p, i) {
      p.addEventListener('click', function () { activar(i, false, true); });
      // Con ratón, basta con pasar por encima (solo cuenta moverlo de verdad)
      p.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && i !== act) activar(i, false, true); });
      p.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = act + 1;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') n = act - 1;
        else if (k === 'Home') n = 0;
        else if (k === 'End') n = pestanas.length - 1;
        if (n !== null) { e.preventDefault(); activar(n, true, true); }
      });
    });
    carta.addEventListener('mouseenter', function () { cartaEncima = true; programar(); });
    carta.addEventListener('mouseleave', function () { cartaEncima = false; programar(); });
    carta.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) { cartaEncima = true; programar(); } });
    carta.addEventListener('focusout', function () { if (!carta.matches(':hover')) { cartaEncima = false; programar(); } });
    // La primera foto se destapa al llegar a la carta (sin JS o con «quieto», ya está a la vista)
    if (!quieto) paneles[0].classList.remove('es-activo');
    visible(carta, function (v) {
      cartaVisible = v;
      if (v && !carta.querySelector('.carta__panel.es-activo')) paneles[act].classList.add('es-activo');
      programar();
    }, { threshold: 0.3 });
  }

  /* ── 5 · Medallas: al pasar giran solas (CSS); en pantallas táctiles, con un toque ── */
  var medallas = d.querySelector('[data-medallas]');
  if (medallas) {
    EM.observar(medallas);
    medallas.querySelectorAll('.medalla__boton').forEach(function (b) {
      b.addEventListener('click', function () {
        if (conRaton) return;
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      });
    });
  }

  /* ── 6 · ¡Pide aquí tu cita!: comprueba lo esencial y la envía por correo ── */
  if (form) {
    var aviso = form.querySelector('[data-cita-aviso]');
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
      var f = form.elements;
      var nombre = f.nombre.value.trim(), tel = f.telefono.value.trim(), email = f.email.value.trim();
      var que = f.interes.value, cuando = (form.querySelector('[name="cuando"]:checked') || {}).value || '';
      var mensaje = f.mensaje.value.trim();
      var errores = [];
      form.querySelectorAll('.campo--error').forEach(quitarError);
      if (!nombre) errores.push(ponerError(f.nombre, 'Escribe tu nombre.'));
      if (tel.replace(/\D/g, '').length < 9) errores.push(ponerError(f.telefono, 'Escribe un teléfono de 9 cifras para poder llamarte.'));
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errores.push(ponerError(f.email, 'Revisa el email: le falta algo.'));
      if (!f.acepto.checked) errores.push(ponerError(f.acepto, 'Acepta la política de privacidad para poder enviarla.'));
      if (errores.length) { aviso.textContent = ''; errores[0].focus(); return; }

      var asunto = 'Solicitud de cita' + (que ? ': ' + que : '') + ' (' + nombre + ')';
      var lineas = ['Hola, me gustaría pedir cita' + (que ? ' para ' + que : '') + (cuando ? ', mejor ' + cuando : '') + '.', '',
        'Nombre: ' + nombre, 'Teléfono: ' + tel];
      if (email) lineas.push('Email: ' + email);
      if (mensaje) lineas.push('', mensaje);
      location.href = 'mailto:' + CORREO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(lineas.join('\n'));
      aviso.textContent = 'Gracias, ' + nombre.split(' ')[0] + '. Se ha abierto tu correo con la solicitud ya escrita para Elena Méndez: solo tienes que pulsar «Enviar».';
    });
  }
})();
