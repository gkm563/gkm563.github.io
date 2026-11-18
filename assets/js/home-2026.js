/* ==========================================================================
   GKM PORTFOLIO 2026 — homepage interactions
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var supportsIO = 'IntersectionObserver' in window;

  /* ----------------------------------------------------------------------
     Theme
     ---------------------------------------------------------------------- */
  var themeToggle = $('#themeToggle');
  var metaTheme = $$('meta[name="theme-color"]');

  function syncThemeUI() {
    var dark = root.classList.contains('dark');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    metaTheme.forEach(function (m) { m.setAttribute('content', dark ? '#0d0f13' : '#f2efe7'); });
  }

  function setTheme(dark, persist) {
    root.classList.toggle('dark', dark);
    root.classList.toggle('dark-theme', dark);
    if (persist) {
      try {
        localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
        localStorage.setItem('gkm_theme', dark ? 'dark' : 'light');
      } catch (e) {}
    }
    syncThemeUI();
  }

  syncThemeUI();
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(!root.classList.contains('dark'), true);
      if (window.gautamAI && typeof window.gautamAI.updateTheme === 'function') window.gautamAI.updateTheme();
    });
  }

  /* ----------------------------------------------------------------------
     Header, progress bar, rail, active links
     ---------------------------------------------------------------------- */
  var header = $('#siteHeader');
  var progress = $('#scrollProgress');
  var rail = $('#chapterRail');
  var navLinks = $$('.nav-link');
  var railLinks = $$('.rail a');
  var watched = ['about', 'work', 'opensource', 'journey', 'skills', 'leadership', 'recognition', 'events', 'dossiers', 'contact'];
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (progress) progress.style.transform = 'scaleX(' + Math.min(1, y / max) + ')';
    if (rail) rail.classList.toggle('is-visible', y > window.innerHeight * 0.55);

    var probe = y + window.innerHeight * 0.32;
    var current = '';
    for (var i = 0; i < watched.length; i++) {
      var el = document.getElementById(watched[i]);
      if (el && el.offsetTop <= probe) current = watched[i];
    }

    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
    railLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-rail') === current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     Full-screen index menu
     ---------------------------------------------------------------------- */
  var menu = $('#siteMenu');
  var menuOpen = $('#menuOpen');
  var menuClose = $('#menuClose');
  var lastFocus = null;

  function focusables(container) {
    return $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function openMenu() {
    if (!menu) return;
    lastFocus = menuOpen || document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    root.classList.add('menu-open');
    if (menuOpen) menuOpen.setAttribute('aria-expanded', 'true');
    window.setTimeout(function () { if (menuClose) menuClose.focus(); }, 60);
  }

  function closeMenu(restore) {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    root.classList.remove('menu-open');
    if (menuOpen) menuOpen.setAttribute('aria-expanded', 'false');
    if (restore !== false && lastFocus) lastFocus.focus();
    if (restore === false && menuOpen) menuOpen.focus();
  }

  if (menuOpen) menuOpen.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', function () { closeMenu(); });
  if (menu) {
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {
        var items = focusables(menu);
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ----------------------------------------------------------------------
     Reveals, split headings, counters
     ---------------------------------------------------------------------- */
  function splitWords(el) {
    var index = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentNode && node.parentNode.closest && node.parentNode.closest('.sr-only')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(' ')); return; }
        var outer = document.createElement('span');
        outer.className = 'word';
        var inner = document.createElement('span');
        inner.textContent = chunk;
        inner.style.setProperty('--i', index++);
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  $$('[data-split]').forEach(function (el) {
    if (!reduceMotion.matches) splitWords(el);
    else el.classList.add('is-in');
  });

  var revealEls = $$('[data-reveal], [data-split], .feature, .media-in');

  if (supportsIO && !reduceMotion.matches) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  var counters = $$('[data-count]');
  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduceMotion.matches) { el.textContent = formatNumber(target); return; }
    var start = null;
    var duration = 1250;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(target * eased);
      if (p < 1) window.requestAnimationFrame(frame);
      else el.textContent = formatNumber(target);
    }
    window.requestAnimationFrame(frame);
  }

  if (supportsIO) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Project filters
     ---------------------------------------------------------------------- */
  var filters = $$('.filters .filter');
  var projects = $$('.catalogue .proj');

  filters.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      projects.forEach(function (p) {
        var show = key === 'all' || p.getAttribute('data-cat') === key;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ----------------------------------------------------------------------
     Journey tabs
     ---------------------------------------------------------------------- */
  var tabs = $$('.tabs .tab');
  if (tabs.length) {
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function selectTab(tab, focus) {
      tabs.forEach(function (t, i) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
        if (panels[i]) {
          panels[i].hidden = !on;
          panels[i].classList.toggle('is-hidden-panel', !on);
        }
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });

    selectTab(tabs[0], false);
  }

  /* ----------------------------------------------------------------------
     Hero title + stage
     ---------------------------------------------------------------------- */
  var heroTitle = $('.hero-title');
  if (heroTitle) {
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { heroTitle.classList.add('is-in'); }, 120);
    });
  }

  var stage = $('.hero-stage');
  var stageFloat = $('.stage-float');
  if (stage && stageFloat && finePointer.matches && !reduceMotion.matches) {
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      stageFloat.style.transform = 'perspective(900px) rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 4).toFixed(2) + 'deg) translateY(-2px)';
    });
    stage.addEventListener('mouseleave', function () { stageFloat.style.transform = ''; });
  }

  /* ----------------------------------------------------------------------
     Hero canvas — blueprint node network
     ---------------------------------------------------------------------- */
  var canvas = $('#heroCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dots = [];
    var rafId = null;
    var visible = true;
    var w = 0, h = 0, dpr = 1;
    var pointer = { x: -999, y: -999 };

    function themeInk() {
      var dark = root.classList.contains('dark');
      return {
        line: dark ? 'rgba(120, 148, 255, 0.16)' : 'rgba(39, 69, 238, 0.12)',
        dot: dark ? 'rgba(150, 170, 255, 0.8)' : 'rgba(39, 69, 238, 0.55)',
        accent: dark ? 'rgba(242, 169, 59, 0.85)' : 'rgba(236, 154, 22, 0.8)'
      };
    }

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.max(16, Math.min(58, Math.round((w * h) / 22000)));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: Math.random() < 0.12 ? 2.1 : 1.2,
          accent: Math.random() < 0.1
        });
      }
    }

    function draw(animate) {
      if (!w || !h) return;
      var ink = themeInk();
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.7;

      for (var i = 0; i < dots.length; i++) {
        var a = dots[i];
        for (var j = i + 1; j < dots.length; j++) {
          var b = dots[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            ctx.strokeStyle = ink.line;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (pointer.x > -100) {
          var px = a.x - pointer.x;
          var py = a.y - pointer.y;
          var pd = Math.sqrt(px * px + py * py);
          if (pd < 170) {
            ctx.strokeStyle = ink.line;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
            a.vx += (px / pd) * 0.006;
            a.vy += (py / pd) * 0.006;
          }
        }
        ctx.fillStyle = a.accent ? ink.accent : ink.dot;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!animate) return;
      dots.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.996;
        p.vy *= 0.996;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      });
    }

    function loop() {
      draw(true);
      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (rafId || reduceMotion.matches) return;
      rafId = window.requestAnimationFrame(loop);
    }

    function stop() {
      if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; }
    }

    size();
    draw(!reduceMotion.matches);
    if (!reduceMotion.matches) start();

    window.addEventListener('resize', function () {
      size();
      draw(!reduceMotion.matches);
    }, { passive: true });

    var heroSection = $('#hero');
    var pointerTarget = heroSection || canvas;
    pointerTarget.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    });
    pointerTarget.addEventListener('pointerleave', function () { pointer.x = pointer.y = -999; });

    if (supportsIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.02 }).observe(canvas);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    themeToggle && themeToggle.addEventListener('click', function () {
      window.requestAnimationFrame(function () { draw(!reduceMotion.matches); });
    });
  }

  /* ----------------------------------------------------------------------
     Copy email
     ---------------------------------------------------------------------- */
  var copyBtn = $('#copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-email');
      var label = copyBtn.querySelector('span');
      function done() {
        copyBtn.classList.add('is-copied');
        if (label) label.textContent = 'Copied';
        window.setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          if (label) label.textContent = 'Copy';
        }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () { fallback(); });
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Contact form
     ---------------------------------------------------------------------- */
  var form = $('#contactForm');
  var status = $('#formStatus');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action');
      var data = new FormData(form);
      var submit = form.querySelector('button[type="submit"]');

      if (!action || action.indexOf('formspree.io') === -1) {
        status.textContent = 'Form endpoint missing — email gkmwin563@gmail.com directly.';
        return;
      }

      if (submit) { submit.disabled = true; submit.querySelector('span').textContent = 'Sending…'; }
      status.textContent = '';

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        status.textContent = 'Message sent — I usually reply within 24 hours.';
        if (submit) submit.querySelector('span').textContent = 'Message sent';
        window.setTimeout(function () {
          if (submit) { submit.disabled = false; submit.querySelector('span').textContent = 'Send message'; }
        }, 4000);
      }).catch(function () {
        status.textContent = 'Could not reach the form service. Opening your mail app instead…';
        if (submit) { submit.disabled = false; submit.querySelector('span').textContent = 'Send message'; }
        var subject = encodeURIComponent('Portfolio enquiry — ' + (data.get('name') || 'Website visitor'));
        var body = encodeURIComponent((data.get('message') || '') + '\n\n' + (data.get('email') || ''));
        window.setTimeout(function () {
          window.location.href = 'mailto:gkmwin563@gmail.com?subject=' + subject + '&body=' + body;
        }, 700);
      });
    });
  }

  /* ----------------------------------------------------------------------
     AI clone trigger
     ---------------------------------------------------------------------- */
  var cloneTrigger = $('#cloneTrigger');
  if (cloneTrigger) {
    cloneTrigger.addEventListener('click', function () {
      if (window.gautamAI && typeof window.gautamAI.toggleWindow === 'function') {
        window.gautamAI.toggleWindow(true);
        return;
      }
      var fab = document.getElementById('gkm-clone-fab');
      if (fab) { fab.click(); return; }
      var original = cloneTrigger.innerHTML;
      cloneTrigger.textContent = 'Loading clone…';
      window.setTimeout(function () { cloneTrigger.innerHTML = original; }, 1600);
    });
  }

  /* ----------------------------------------------------------------------
     Line reveal decorations
     ---------------------------------------------------------------------- */
  $$('.reveal-line').forEach(function (el) {
    if (!supportsIO) { el.classList.add('is-in'); return; }
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      el.classList.add('is-in');
      obs.disconnect();
    }, { threshold: 0.6 }).observe(el);
  });

  /* ----------------------------------------------------------------------
     Smooth anchor focus management
     ---------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  });
})();
