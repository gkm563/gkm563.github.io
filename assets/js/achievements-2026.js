(function () {
  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var supportsIO = 'IntersectionObserver' in window;

  /* ----------------------------------------------------------------------
     Count-ups (decimals + suffix friendly)
     ---------------------------------------------------------------------- */
  var counters = $$('[data-countup]');
  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    var target = parseFloat(el.getAttribute('data-countup'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduceMotion.matches) { el.textContent = target.toFixed(decimals); return; }
    var start = null;
    var duration = 1400;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) window.requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    window.requestAnimationFrame(frame);
  }
  if (supportsIO && !reduceMotion.matches) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Archive: filters + search
     ---------------------------------------------------------------------- */
  var grid = $('#honorGrid');
  var cards = $$('.honor-card', grid);
  var chips = $$('.ach-chip');
  var search = $('#achSearch');
  var searchWrap = $('#achSearchWrap');
  var clearBtn = $('#achSearchClear');
  var shownEl = $('#achShown');
  var totalEl = $('#achTotal');
  var countWrap = $('#achCount');
  var empty = $('#achEmpty');
  var resetBtn = $('#achReset');
  var total = cards.length;
  var activeCat = 'all';
  var searchTimer = null;

  if (totalEl) totalEl.textContent = String(total);

  function animateIn(card, index) {
    if (reduceMotion.matches) return;
    card.classList.remove('is-entering');
    void card.offsetWidth;
    card.style.animationDelay = Math.min(index, 14) * 26 + 'ms';
    card.classList.add('is-entering');
  }

  function applyFilters(animate) {
    var q = (search && search.value ? search.value : '').trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var catOk = activeCat === 'all' || card.dataset.cat === activeCat;
      var textOk = !q || (card.dataset.search || '').indexOf(q) !== -1;
      var show = catOk && textOk;
      card.classList.toggle('is-hidden', !show);
      card.hidden = !show;
      if (show) {
        if (animate) animateIn(card, shown);
        shown++;
      }
    });
    if (shownEl) shownEl.textContent = String(shown);
    if (empty) empty.classList.toggle('is-visible', shown === 0);
    if (grid) grid.setAttribute('aria-busy', 'false');
    if (countWrap) {
      countWrap.setAttribute(
        'data-state',
        shown === total && !q && activeCat === 'all' ? 'all' : 'filtered'
      );
    }
    if (searchWrap) searchWrap.classList.toggle('has-value', !!q);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeCat = chip.getAttribute('data-filter') || 'all';
      chips.forEach(function (other) {
        var on = other === chip;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      applyFilters(true);
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { applyFilters(true); }, 130);
    });
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && search.value) {
        search.value = '';
        applyFilters(true);
      }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (search) {
        search.value = '';
        search.focus();
        applyFilters(true);
      }
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      activeCat = 'all';
      if (search) search.value = '';
      chips.forEach(function (chip) {
        var on = chip.getAttribute('data-filter') === 'all';
        chip.classList.toggle('is-active', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      applyFilters(true);
      var archive = $('#archive');
      if (archive) archive.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  }

  grid && grid.addEventListener('animationend', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('honor-card')) {
      e.target.classList.remove('is-entering');
      e.target.style.animationDelay = '';
    }
  });

  applyFilters(false);

  /* ----------------------------------------------------------------------
     Deep links: scroll + flash a record
     ---------------------------------------------------------------------- */
  function focusHash() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    if (!raw) return;
    var id;
    try { id = decodeURIComponent(raw); } catch (e) { id = raw; }
    var el = document.getElementById(id);
    if (!el || !el.classList.contains('honor-card')) return;

    if (el.classList.contains('is-hidden')) {
      activeCat = 'all';
      if (search) search.value = '';
      chips.forEach(function (chip) {
        var on = chip.getAttribute('data-filter') === 'all';
        chip.classList.toggle('is-active', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      applyFilters(false);
    }
    window.setTimeout(function () {
      el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
      el.classList.remove('is-flash');
      void el.offsetWidth;
      el.classList.add('is-flash');
      window.setTimeout(function () { el.classList.remove('is-flash'); }, 2800);
      try { el.focus({ preventScroll: true }); } catch (e) {}
    }, 300);
  }
  focusHash();
  window.addEventListener('hashchange', focusHash);

  /* ----------------------------------------------------------------------
     Lightbox
     ---------------------------------------------------------------------- */  var dialog = $('#lightbox');
  var zoomBtns = $$('.honor-card__zoom');
  var photos = zoomBtns.map(function (btn) {
    return {
      src: btn.getAttribute('data-photo'),
      alt: btn.getAttribute('aria-label') || '',
      caption: btn.getAttribute('data-caption') || '',
      sub: btn.getAttribute('data-sub') || ''
    };
  });
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCaption');
  var lbSub = $('#lbSub');
  var lbCount = $('#lbCount');
  var index = 0;

  function render(i) {
    if (!photos.length) return;
    index = (i + photos.length) % photos.length;
    var item = photos[index];
    if (lbImg) {
      lbImg.src = item.src;
      lbImg.alt = item.alt || item.caption;
    }
    if (lbCap) lbCap.textContent = item.caption;
    if (lbSub) lbSub.textContent = item.sub;
    if (lbCount) lbCount.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
  }

  function openLightbox(i) {
    if (!dialog || !photos.length) return;
    render(i);
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    root.classList.add('modal-open');
  }

  function closeLightbox() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    root.classList.remove('modal-open');
  }

  zoomBtns.forEach(function (btn, idx) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(idx);
    });
  });

  if (dialog) {
    $$('[data-lb-close]', dialog).forEach(function (btn) {
      btn.addEventListener('click', closeLightbox);
    });
    var prev = $('#lbPrev');
    var next = $('#lbNext');
    if (prev) prev.addEventListener('click', function () { render(index - 1); });
    if (next) next.addEventListener('click', function () { render(index + 1); });
    dialog.addEventListener('close', function () { root.classList.remove('modal-open'); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeLightbox();
    });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); render(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); render(index + 1); }
    });
  }
})();
