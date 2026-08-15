/**
 * GKM Portfolio — Premium GSAP Animation System
 * =================================================
 * Vanilla JS · GSAP 3 + ScrollTrigger
 * Handles: hero entrance, floating tech orbs, scroll reveals,
 * counter animations, magnetic cursor, SVG morphing, particle trail
 * 
 * Performance: requestAnimationFrame-based, passive listeners,
 * will-change hints, reduced-motion respects prefers-reduced-motion
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     0. Respect prefers-reduced-motion
  ───────────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────
     1. GSAP Plugin Registration
  ───────────────────────────────────────── */
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────
     2. Hero Entrance Timeline (staggered)
  ───────────────────────────────────────── */
  function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.75 } });

    tl.from('.hero-status-badge', { y: -16, opacity: 0, scale: 0.9 })
      .from('#hero h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.45')
      .from('#hero h2', { y: 25, opacity: 0 }, '-=0.55')
      .from('.cta-buttons', { y: 20, opacity: 0 }, '-=0.45')
      .from('.social-row', { y: 12, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero-profile-card', { x: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.1')
      .from('.floating-badge', { scale: 0, opacity: 0, stagger: 0.12, ease: 'back.out(1.7)', clearProps: 'all' }, '-=0.7')
      .from('.tech-orb', { scale: 0, opacity: 0, stagger: 0.1, ease: 'back.out(2)', clearProps: 'all' }, '-=0.5');
  }

  /* ─────────────────────────────────────────
     3. Floating Tech Orbs drift
  ───────────────────────────────────────── */
  function initFloatingOrbs() {
    const orbs = document.querySelectorAll('.tech-orb');
    orbs.forEach((orb, i) => {
      const dy = 10 + Math.random() * 12;
      const duration = 3.2 + Math.random() * 1.8;
      gsap.to(orb, { y: `-=${dy}`, duration, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4 });
    });
  }

  /* ─────────────────────────────────────────
     4. Floating Badges drift
  ───────────────────────────────────────── */
  function initFloatingBadgesDrift() {
    const badges = document.querySelectorAll('.floating-badge');
    badges.forEach((badge, i) => {
      gsap.to(badge, { y: -8 - i * 2, duration: 3 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.7 });
    });
  }

  /* ─────────────────────────────────────────
     5. ScrollTrigger Staggered Section Reveals
  ───────────────────────────────────────── */
  function initScrollReveals() {
    if (typeof ScrollTrigger === 'undefined') return;

    const cardGroups = [
      { selector: '#about .glass-card', stagger: 0.08 },
      { selector: '#skills .skill-category-card', stagger: 0.07 },
      { selector: '#projects .project-item-card', stagger: 0.09 },
      { selector: '#experience .glass-card', stagger: 0.1 },
      { selector: '#leadership .glass-card', stagger: 0.08 },
      { selector: '#achievements .glass-card', stagger: 0.07 },
      { selector: '#contact .glass-card', stagger: 0.1 },
    ];

    cardGroups.forEach(({ selector, stagger }) => {
      const els = document.querySelectorAll(selector);
      if (!els.length) return;
      gsap.from(els, {
        scrollTrigger: {
          trigger: els[0].closest('section') || els[0].parentElement,
          start: 'top 85%',
          once: true
        },
        y: 40, opacity: 0, duration: 0.65, stagger, ease: 'power2.out', clearProps: 'all'
      });
    });

    document.querySelectorAll('h2.section-title, .section-heading').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all'
      });
    });

    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.4, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val) + (el.dataset.suffix || ''); }
          });
        }
      });
    });

    document.querySelectorAll('.skill-bar-fill, [data-progress]').forEach(el => {
      const width = el.style.width || el.dataset.progress || '0%';
      el.style.width = '0%';
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        width, duration: 1, ease: 'power2.out'
      });
    });
  }

  /* ─────────────────────────────────────────
     6. Parallax on Hero Background Orbs
  ───────────────────────────────────────── */
  function initParallaxOrbs() {
    if (typeof ScrollTrigger === 'undefined') return;
    const orbs = document.querySelectorAll('.bg-glow-blue, .bg-glow-sky, .hero-bg-orb');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        y: 80 + i * 30, ease: 'none'
      });
    });
  }

  /* ─────────────────────────────────────────
     7. Magnetic Buttons
  ───────────────────────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ─────────────────────────────────────────
     8. SVG Animated Rings
  ───────────────────────────────────────── */
  function initSvgRings() {
    document.querySelectorAll('.gkm-ring').forEach((ring, i) => {
      gsap.to(ring, { rotation: 360, duration: 18 + i * 6, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    });
  }

  /* ─────────────────────────────────────────
     9. Cursor Dot Trail (Desktop Only)
  ───────────────────────────────────────── */
  function initCursorTrail() {
    if (window.innerWidth < 1024 || prefersReduced) return;
    const dot = document.getElementById('gkm-cursor-dot');
    const ring = document.getElementById('gkm-cursor-ring');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', (e) => {
      gsap.to(dot, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1, ease: 'none' });
      gsap.to(ring, { x: e.clientX - 14, y: e.clientY - 14, duration: 0.35, ease: 'power2.out' });
    }, { passive: true });

    document.addEventListener('mousedown', () => gsap.to(ring, { scale: 0.7, duration: 0.15 }));
    document.addEventListener('mouseup', () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }));
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 1.8, duration: 0.25 }));
      el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1, duration: 0.25 }));
    });
  }

  /* ─────────────────────────────────────────
     10. gkm-reveal class helper
  ───────────────────────────────────────── */
  function initRevealClass() {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('.gkm-reveal').forEach((el) => {
      const dir = el.dataset.revealDir || 'up';
      const fromProps = { opacity: 0 };
      if (dir === 'up')    fromProps.y = 35;
      if (dir === 'down')  fromProps.y = -25;
      if (dir === 'left')  fromProps.x = -35;
      if (dir === 'right') fromProps.x = 35;
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        ...fromProps,
        duration: 0.7,
        delay: parseFloat(el.dataset.revealDelay || 0),
        ease: 'power2.out',
        clearProps: 'all'
      });
    });
  }

  /* ─────────────────────────────────────────
     11. Nav link entrance
  ───────────────────────────────────────── */
  function initNavEntrance() {
    gsap.from('#navbar nav a', {
      y: -14, opacity: 0, duration: 0.5, stagger: 0.06,
      ease: 'power2.out', delay: 1.0, clearProps: 'all'
    });
  }

  /* ─────────────────────────────────────────
     BOOT
  ───────────────────────────────────────── */
  function boot() {
    if (prefersReduced) {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      return;
    }
    initHeroEntrance();
    initFloatingOrbs();
    initFloatingBadgesDrift();
    initScrollReveals();
    initParallaxOrbs();
    initMagnetic();
    initSvgRings();
    initCursorTrail();
    initRevealClass();
    initNavEntrance();
    if (typeof ScrollTrigger !== 'undefined') {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
