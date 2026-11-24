/* UP Police APCSIP-2026 — Amroha case file interactions */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ----------------------------------------------------------------------
     Bangkok clock (ICT, UTC+7)
     ---------------------------------------------------------------------- */
  var clockEl = $('#istTime');
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
        clockEl.textContent = fmt.format(now);
      } else {
        var ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
        clockEl.textContent = ('0' + ist.getHours()).slice(-2) + ':' + ('0' + ist.getMinutes()).slice(-2);
      }
    };
    tickClock();
    window.setInterval(tickClock, 20000);
  }

  /* ----------------------------------------------------------------------
     Section scrollspy (own nav + chapter rail)
     ---------------------------------------------------------------------- */
  var navItems = $$('.nav-item');
  var rail = $('#uppRail');
  var railLinks = $$('#uppRail a');
  var sectionIds = ['brief', 'clearance', 'journal', 'domains', 'caseroom', 'experts', 'honors', 'gallery', 'faq'];
  var heroScene = $('.upp-hero__scene');
  var scrollTicking = false;

  function syncChrome() {
    var y = window.scrollY || window.pageYOffset || 0;
    var probe = y + window.innerHeight * 0.35;
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
    if (rail) rail.classList.toggle('is-visible', y > window.innerHeight * 0.6);

    if (heroScene && !reduceMotion.matches && y < window.innerHeight * 1.3) {
      heroScene.style.transform = 'translate3d(0,' + Math.round(y * 0.1) + 'px,0)';
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(syncChrome);
    }
  }, { passive: true });
  window.addEventListener('resize', syncChrome, { passive: true });
  syncChrome();

  /* ----------------------------------------------------------------------
     Journal: day rail, scrollspy and progress
     ---------------------------------------------------------------------- */
  var days = $$('.day');
  var dayLinks = $$('[data-day-link]');
  var dayNow = $('#dayNow');
  var dayFill = $('#dayFill');
  var dayIndexList = $('#dayIndex');

  function setDay(id) {
    var idx = -1;
    days.forEach(function (d, i) {
      var on = d.id === id;
      d.classList.toggle('is-active', on);
      if (on) idx = i;
    });
    dayLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-day-link') === id);
    });
    if (idx > -1) {
      if (dayNow) dayNow.textContent = ('0' + (idx + 1)).slice(-2);
      if (dayFill) dayFill.style.height = (((idx + 1) / days.length) * 100) + '%';
    }
  }

  function scrollDayLinkIntoView(link) {
    if (!dayIndexList || !link) return;
    if (dayIndexList.scrollWidth <= dayIndexList.clientWidth + 4) return;
    var target = link.offsetLeft - dayIndexList.clientWidth / 2 + link.clientWidth / 2;
    dayIndexList.scrollTo({ left: Math.max(0, target), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  if (days.length && 'IntersectionObserver' in window) {
    var dayIO = new IntersectionObserver(function () {
      var line = window.innerHeight * 0.42;
      var best = null;
      days.forEach(function (d) {
        var rect = d.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) best = d;
      });
      if (!best) return;
      setDay(best.id);
      scrollDayLinkIntoView($('[data-day-link="' + best.id + '"]'));
    }, { rootMargin: '-36% 0px -52% 0px', threshold: 0 });
    days.forEach(function (d) { dayIO.observe(d); });
  } else if (days.length) {
    setDay(days[0].id);
  }

  function flashDay(el) {
    if (!el) return;
    el.classList.add('is-flash');
    window.setTimeout(function () { el.classList.remove('is-flash'); }, 2200);
  }

  dayLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('data-day-link');
      setDay(id);
      window.setTimeout(function () { flashDay(document.getElementById(id)); }, 420);
    });
  });

  function flashFromHash() {
    var id = (window.location.hash || '').replace('#', '');
    if (!/^day-\d{2}$/.test(id)) return;
    var el = document.getElementById(id);
    if (!el) return;
    setDay(id);
    window.setTimeout(function () { flashDay(el); }, 260);
  }
  window.addEventListener('hashchange', flashFromHash);
  window.setTimeout(flashFromHash, 120);

  /* ----------------------------------------------------------------------
     Lightbox (day photos + gallery, honours visible filters)
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
    var scopeEl = source && source.closest('[data-lb-scope]');
    var scope;
    if (scopeEl) {
      scope = '[data-lb-scope="' + scopeEl.getAttribute('data-lb-scope') + '"]';
    } else {
      scope = source && source.closest('.gal') ? '#gallery' : '#journal';
    }
    return $$(scope + ' [data-photo]').filter(function (trigger) {
      var gal = trigger.closest('.gal');
      return !gal || !gal.classList.contains('is-hidden');
    }).map(function (trigger) {
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
     Gallery filters
     ---------------------------------------------------------------------- */
  var galChips = $$('.gal-chip');
  var galItems = $$('#gallery .gal');
  var galShown = $('#galShown');

  galChips.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      galChips.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var shown = 0;
      galItems.forEach(function (item) {
        var show = key === 'all' || item.getAttribute('data-cat') === key;
        item.classList.toggle('is-hidden', !show);
        item.classList.remove('is-in');
        if (show) {
          shown++;
          void item.offsetWidth;
          item.classList.add('is-in');
        }
      });
      if (galShown) galShown.textContent = shown;
    });
  });

  /* ----------------------------------------------------------------------
     SOC alert ticker (decorative)
     ---------------------------------------------------------------------- */
  var alertEl = $('#socAlerts');
  if (alertEl && !reduceMotion.matches) {
    var alerts = 4;
    window.setInterval(function () {
      alerts = alerts >= 12 ? 1 : alerts + 1;
      alertEl.textContent = ('0' + alerts).slice(-2);
    }, 3800);
  }

  /* ----------------------------------------------------------------------
     Hero collage pointer drift
     ---------------------------------------------------------------------- */
  var collage = $('.upp-hero__collage');
  var hero = $('.upp-hero');
  if (collage && hero && finePointer.matches && !reduceMotion.matches) {
    hero.addEventListener('mousemove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      collage.style.setProperty('--mx', x.toFixed(3));
      collage.style.setProperty('--my', y.toFixed(3));
    });
    hero.addEventListener('mouseleave', function () {
      collage.style.setProperty('--mx', '0');
      collage.style.setProperty('--my', '0');
    });
  }

  /* ----------------------------------------------------------------------
     Copy share link
     ---------------------------------------------------------------------- */
  var copyBtn = $('#copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = copyBtn.getAttribute('data-url') || window.location.href;
      var done = function () {
        var label = copyBtn.querySelector('span');
        if (!label) return;
        var original = label.textContent;
        label.textContent = 'Copied';
        window.setTimeout(function () { label.textContent = original; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done, function () {});
      }
    });
  }

  /* ----------------------------------------------------------------------
     Pause SVG motion paths when reduced motion is requested
     ---------------------------------------------------------------------- */
  if (reduceMotion.matches) {
    $$('svg').forEach(function (svg) {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });
  }
})();
