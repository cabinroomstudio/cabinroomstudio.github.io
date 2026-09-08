/* ============================================================
   Cabin Room Studio — main.js
   Plain ES2020, no dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }


  /* ---- Cursor dot field + trailing aurora ---------------
     The smoothness comes from easing toward a target inside a
     rAF loop — never from writing styles in the event handler.
     The loop parks itself once it settles.                  */

  function initCursor() {
    var dots = $('.dot-field');
    var aurora = $('.aurora');
    if (!dots || !aurora || !finePointer || reduceMotion) return;

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var px = tx, py = ty, ax = tx, ay = ty;
    var running = false, live = false;

    function frame() {
      px += (tx - px) * 0.16;  py += (ty - py) * 0.16;   // dots track closely
      ax += (tx - ax) * 0.07;  ay += (ty - ay) * 0.07;   // aurora lags -> depth

      root.style.setProperty('--px', px.toFixed(1) + 'px');
      root.style.setProperty('--py', py.toFixed(1) + 'px');
      root.style.setProperty('--ax', ax.toFixed(1) + 'px');
      root.style.setProperty('--ay', ay.toFixed(1) + 'px');

      if (Math.abs(tx - px) < 0.1 && Math.abs(ty - py) < 0.1 &&
          Math.abs(tx - ax) < 0.1 && Math.abs(ty - ay) < 0.1) {
        running = false;               // settled — stop burning frames
        return;
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!live) {
        live = true;
        dots.classList.add('is-live');
        aurora.classList.add('is-live');
      }
      start();
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      dots.classList.remove('is-live');
      aurora.classList.remove('is-live');
      live = false;
    });
  }


  /* ---- Scroll reveal ------------------------------------ */

  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }


  /* ---- Nav: scrolled state, progress rail, active link --- */

  function initNav() {
    var nav = $('.nav');
    if (!nav) return;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle('is-scrolled', y > 24);
      root.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : '0');
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();

    // active section highlighting
    var links = $$('.nav-links a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var watched = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = a;
      watched.push(section);
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var active = byId[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach(function (s) { spy.observe(s); });
  }


  /* ---- Mobile drawer ------------------------------------ */

  function initDrawer() {
    var toggle = $('.nav-toggle');
    var drawer = $('.drawer');
    if (!toggle || !drawer) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      drawer.removeAttribute('inert');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = $('a, button', drawer);
      if (first) first.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    toggle.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });

    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;

      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      // keep focus inside the drawer while it is open
      var focusables = $$('a[href], button:not([disabled])', drawer);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    drawer.setAttribute('inert', '');
  }


  /* ---- Card spotlight border ---------------------------- */

  function initSpotlight() {
    if (!finePointer) return;
    $$('.card--spot').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }


  /* ---- Count-up stats ----------------------------------- */

  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function settle(el) {
      el.textContent = parseFloat(el.dataset.count) + (el.dataset.suffix || '');
    }

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';

      var dur = 1400, t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // No animation wanted, or no observer available: show the real
    // numbers straight away rather than risk them sticking at zero.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nums.forEach(settle);
      return;
    }

    // Belt and braces: if the observer has not reported within a few
    // seconds (throttled rendering, background tab), just set the values.
    var fallback = setTimeout(function () {
      nums.forEach(function (el) { if (el.textContent === '0') settle(el); });
    }, 3000);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        clearTimeout(fallback);
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }


  /* ---- FAQ accordion ------------------------------------ */

  function initFaq() {
    var items = $$('.faq-item');

    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      var btn = $('.faq-q', item);
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    items.forEach(function (item) {
      var btn = $('.faq-q', item);
      if (!btn) return;

      btn.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (other) { setOpen(other, false); });   // accordion
        setOpen(item, willOpen);
      });
    });
  }


  /* ---- Roadmap ------------------------------------------
     The curved connector threads a bezier through every node
     centre. Carried over from the original site.            */

  function initRoadmap() {
    var track = $('.roadmap-track');
    var svg = $('.roadmap-svg');
    var path = $('.roadmap-path');
    if (!track) return;

    function draw() {
      if (!path || !svg) return;
      if (window.innerWidth <= 768) return;   // vertical timeline on phones

      var box = track.getBoundingClientRect();
      svg.setAttribute('width', box.width);
      svg.setAttribute('height', box.height);
      svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

      var points = $$('.rm-node', track).map(function (node) {
        var r = node.getBoundingClientRect();
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
      }).filter(function (p) { return !isNaN(p[0]); });

      if (points.length < 2) { path.setAttribute('d', ''); return; }

      var d = 'M ' + points[0][0] + ' ' + points[0][1];
      for (var i = 1; i < points.length; i++) {
        var x0 = points[i - 1][0], y0 = points[i - 1][1];
        var x1 = points[i][0], y1 = points[i][1];
        var mx = (x0 + x1) / 2;
        d += ' C ' + mx + ' ' + y0 + ', ' + mx + ' ' + y1 + ', ' + x1 + ' ' + y1;
      }
      path.setAttribute('d', d);

      var len = path.getTotalLength ? path.getTotalLength() : 1400;
      path.style.strokeDasharray = len;
      if (!svg.classList.contains('is-visible')) path.style.strokeDashoffset = len;
    }

    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(draw, 120);
    });
    window.addEventListener('load', draw);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    setTimeout(draw, 100);

    var items = $$('.rm-item', track);

    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.2 });
      items.forEach(function (item, i) {
        item.style.transitionDelay = Math.min(i * 80, 320) + 'ms';
        io.observe(item);
      });

      var lineIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (svg) svg.classList.add('is-visible');
          if (path) path.style.strokeDashoffset = '0';
          lineIo.disconnect();
        });
      }, { threshold: 0.1 });
      lineIo.observe(track);
    } else {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      if (svg) svg.classList.add('is-visible');
    }

    // popovers: click and keyboard, not hover alone
    items.forEach(function (item) {
      var node = $('.rm-node', item);
      if (!node || item.classList.contains('rm-item--more')) return;

      node.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var n = $('.rm-node', other);
          if (n) n.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          node.setAttribute('aria-expanded', 'true');
        }
      });

      node.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        item.classList.remove('is-open');
        node.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function () {
      items.forEach(function (item) {
        item.classList.remove('is-open');
        var n = $('.rm-node', item);
        if (n && n.hasAttribute('aria-expanded')) n.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ---- Screenshot lightbox ------------------------------ */

  function initLightbox() {
    var box = $('.lightbox');
    var img = $('.lightbox-img');
    var count = $('.lightbox-count');
    var shots = $$('.shot');
    if (!box || !img || !shots.length) return;

    var sources = shots.map(function (s) {
      var i = $('img', s);
      return { src: i.getAttribute('src'), alt: i.getAttribute('alt') };
    });
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + sources.length) % sources.length;
      img.src = sources[index].src;
      img.alt = sources[index].alt;
      if (count) count.textContent = (index + 1) + ' / ' + sources.length;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var close = $('.lightbox-close', box);
      if (close) close.focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (shot, i) {
      shot.addEventListener('click', function () { open(i); });
    });

    var closeBtn = $('.lightbox-close', box);
    var prevBtn = $('.lightbox-btn--prev', box);
    var nextBtn = $('.lightbox-btn--next', box);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });

    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }


  /* ---- Hero parallax ------------------------------------ */

  function initParallax() {
    var phone = $('.hero-phone');
    if (!phone || reduceMotion) return;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        phone.style.setProperty('--parallax', (y * 0.09).toFixed(1) + 'px');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }


  /* ---- Contact form ------------------------------------- */

  function initForm() {
    var form = $('#contact-form');
    if (!form) return;

    var btn = $('.form-submit', form);
    var status = $('.form-status', form);
    var label = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot — a real person never fills this in
      var hp = form.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) return;

      if (!form.reportValidity()) return;

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending';
      status.textContent = '';
      status.className = 'form-status';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (!result.success) throw new Error(result.message || 'Request failed');
          status.textContent = 'Thanks — message sent. We usually reply within a day or two.';
          status.classList.add('is-ok');
          form.reset();
        })
        .catch(function () {
          status.textContent = 'That did not send. Email us directly at cabinroomstudio42@gmail.com.';
          status.classList.add('is-err');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }


  /* ---- Footer year -------------------------------------- */

  function initYear() {
    var el = $('.js-year');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ---- Boot --------------------------------------------- */

  function boot() {
    initCursor();
    initReveal();
    initNav();
    initDrawer();
    initSpotlight();
    initCounters();
    initFaq();
    initRoadmap();
    initLightbox();
    initParallax();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
