/* Road to Wiki Cohort 2 — journey ledger interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var supportsIO = 'IntersectionObserver' in window;

  /* ----------------------------------------------------------------------
     IST clock (Meta-wiki meta: all deadlines ran on IST)
     ---------------------------------------------------------------------- */
  var clockEl = $('#wikiClock');
  if (clockEl) {
    var fmt = null;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
      });
    } catch (err) { fmt = null; }
    var tickClock = function () {
      var now = new Date();
      if (fmt) {
        clockEl.textContent = fmt.format(now) + ' IST';
      } else {
        var ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
        clockEl.textContent = ('0' + ist.getHours()).slice(-2) + ':' + ('0' + ist.getMinutes()).slice(-2) + ' IST';
      }
    };
    tickClock();
    window.setInterval(tickClock, 20000);
  }

  /* ----------------------------------------------------------------------
     Scrollspy (header nav + chapter rail)
     ---------------------------------------------------------------------- */
  var navItems = $$('.nav-item');
  var rail = $('#wkRail');
  var railLinks = $$('#wkRail a');
  var sectionIds = ['journey', 'phases', 'patches', 'mentors', 'conclave', 'awards', 'people', 'dispatches', 'verify', 'faq'];
  var ticking = false;

  function syncChrome() {
    var y = window.scrollY || window.pageYOffset || 0;
    var probe = y + window.innerHeight * 0.34;
    var current = '';

    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (el && el.offsetTop <= probe) current = sectionIds[i];
    }

    navItems.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
    railLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-section') === current);
    });
    if (rail) rail.classList.toggle('is-visible', y > window.innerHeight * 0.55);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(syncChrome);
    }
  }, { passive: true });
  window.addEventListener('resize', syncChrome, { passive: true });
  syncChrome();

  /* ----------------------------------------------------------------------
     Phase tabs (three gates of the program)
     ---------------------------------------------------------------------- */
  var tabs = $$('.wk-tab');
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
     Dispatch ledger: filters + search
     ---------------------------------------------------------------------- */
  var chips = $$('.wk-chip');
  var dispatches = $$('.wk-dispatch');
  var searchInput = $('#dispatchSearch');
  var shownEl = $('#dispatchShown');
  var totalEl = $('#dispatchTotal');
  var noRes = $('#dispatchNoResults');
  var activeFilter = 'all';

  if (totalEl) totalEl.textContent = ('0' + dispatches.length).slice(-2);

  function applyDispatches() {
    if (!dispatches.length) return;
    var term = (searchInput && searchInput.value || '').trim().toLowerCase();
    var shown = 0;
    dispatches.forEach(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var hay = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent.toLowerCase();
      var okCat = activeFilter === 'all' || cat === activeFilter;
      var okTerm = !term || hay.indexOf(term) > -1;
      var show = okCat && okTerm;
      card.classList.toggle('is-hidden', !show);
      if (show) shown++;
    });
    if (shownEl) shownEl.textContent = ('0' + shown).slice(-2);
    if (noRes) noRes.hidden = shown !== 0;
  }

  chips.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      activeFilter = btn.getAttribute('data-filter') || 'all';
      chips.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      applyDispatches();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyDispatches);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { searchInput.value = ''; applyDispatches(); }
    });
  }

  /* ----------------------------------------------------------------------
     Lightbox (scoped photo galleries)
     ---------------------------------------------------------------------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCount = $('#lbCount');
  var lbCaption = $('#lbCaption');
  var lbSub = $('#lbSub');
  var lbPrev = $('#lbPrev');
  var lbNext = $('#lbNext');
  var lbClose = $('[data-lb-close]');
  var currentList = [];
  var currentIndex = 0;
  var lastTrigger = null;

  function collectPhotos(source) {
    var scopeEl = source.closest('[data-lb-scope]');
    if (!scopeEl) return [];
    var name = scopeEl.getAttribute('data-lb-scope');
    return $$('[data-lb-scope="' + name + '"] [data-photo]').map(function (trigger) {
      return {
        trigger: trigger,
        src: trigger.getAttribute('data-photo'),
        caption: trigger.getAttribute('data-caption') || '',
        sub: trigger.getAttribute('data-sub') || '',
        alt: trigger.getAttribute('aria-label') || trigger.getAttribute('data-caption') || ''
      };
    });
  }

  function renderPhoto() {
    var photo = currentList[currentIndex];
    if (!photo) return;
    lbImg.src = photo.src;
    lbImg.alt = photo.alt;
    lbCaption.textContent = photo.caption;
    lbSub.textContent = photo.sub;
    lbCount.textContent = ('0' + (currentIndex + 1)).slice(-2) + ' / ' + ('0' + currentList.length).slice(-2);
  }

  function openLightbox(trigger) {
    if (!lb || typeof lb.showModal !== 'function') return;
    currentList = collectPhotos(trigger);
    if (!currentList.length) return;
    currentIndex = 0;
    currentList.forEach(function (p, i) { if (p.trigger === trigger) currentIndex = i; });
    lastTrigger = trigger;
    renderPhoto();
    lb.showModal();
    root.classList.add('modal-open');
  }

  function closeLightbox() {
    if (!lb || !lb.open) return;
    lb.close();
  }

  function stepLightbox(dir) {
    if (!currentList.length) return;
    currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
    renderPhoto();
  }

  $$('[data-photo]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(trigger);
    });
  });

  if (lb) {
    lb.addEventListener('close', function () {
      root.classList.remove('modal-open');
      lbImg.removeAttribute('src');
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });
    lb.addEventListener('click', function (event) {
      if (event.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (!lb.open) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); stepLightbox(-1); }
      if (event.key === 'Escape') { event.preventDefault(); closeLightbox(); }
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { stepLightbox(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { stepLightbox(1); });
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  var reveals = $$('.wk-reveal');
  if (supportsIO && !reduceMotion.matches) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ----------------------------------------------------------------------
     Hero collage: slight pointer drift
     ---------------------------------------------------------------------- */
  var collage = $('.wk-collage');
  var hero = $('.wk-hero');
  if (collage && hero && !reduceMotion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var drift = function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      collage.style.setProperty('--mx', (x * 8).toFixed(2) + 'px');
      collage.style.setProperty('--my', (y * 8).toFixed(2) + 'px');
    };
    hero.addEventListener('mousemove', drift);
    hero.addEventListener('mouseleave', function () {
      collage.style.setProperty('--mx', '0px');
      collage.style.setProperty('--my', '0px');
    });
  }

  /* ----------------------------------------------------------------------
     Copy share link
     ---------------------------------------------------------------------- */
  var copyBtn = $('#copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = copyBtn.getAttribute('data-url') || window.location.href;
      var label = copyBtn.querySelector('span');
      var done = function () {
        if (!label) return;
        var original = label.textContent;
        label.textContent = 'Link copied';
        window.setTimeout(function () { label.textContent = original; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done, function () {});
      } else if (label) {
        label.textContent = 'Copy failed';
        window.setTimeout(function () { label.textContent = 'Copy link'; }, 1800);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Pause decorative SVG animation when reduced motion is requested
     ---------------------------------------------------------------------- */
  if (reduceMotion.matches) {
    $$('svg').forEach(function (svg) {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });
  }
})();
