/**
 * APCSIP-2026: AMROHA POLICE CYBER SECURITY INTERNSHIP CONTROLLER
 * Handles scrollspy active states, progress bar, gallery filter, lightbox viewer modal,
 * GSAP ScrollTrigger reveals, 3D perspective card tilt, and magnetic button pull.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Light / Dark Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  const applyTheme = (theme) => {
    const darkIcon = themeToggleBtn ? themeToggleBtn.querySelector('.dark-icon') : null;
    const lightIcon = themeToggleBtn ? themeToggleBtn.querySelector('.light-icon') : null;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark', 'dark-theme');
      document.body.classList.add('dark', 'dark-theme');
      if (darkIcon) darkIcon.style.display = 'none';
      if (lightIcon) lightIcon.style.display = 'inline-block';
    } else {
      document.documentElement.classList.remove('dark', 'dark-theme');
      document.body.classList.remove('dark', 'dark-theme');
      if (darkIcon) darkIcon.style.display = 'inline-block';
      if (lightIcon) lightIcon.style.display = 'none';
    }
  };

  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('dark-theme');
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('portfolio-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  // 1. Scroll Progress Bar Update
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const cyberNav = document.getElementById('cyber-nav');

  if (mobileToggle && cyberNav) {
    mobileToggle.addEventListener('click', () => {
      cyberNav.classList.toggle('active');
    });
  }

  // 3. Operations Log Sidebar Scrollspy Navigation
  const opsNavItems = document.querySelectorAll('.ops-nav-item');
  const opsCards = document.querySelectorAll('.ops-card');

  if (opsCards.length > 0 && opsNavItems.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      opsCards.forEach(card => {
        const cardTop = card.offsetTop - 180;
        if (window.scrollY >= cardTop) {
          currentSectionId = card.getAttribute('id');
        }
      });

      opsNavItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${currentSectionId}`) {
          item.classList.add('active');
        }
      });
    });
  }

  // 4. Lightbox Modal Gallery Viewer
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Forensic Evidence Photo';
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 5. Gallery Filter Switcher
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
  const allGalleryItems = document.querySelectorAll('.gallery-item');

  galleryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      allGalleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. 3D Perspective Card Tilt
  init3DTiltCards();

  // 7. GSAP Animations & Section Reveals
  initGSAPAnimations();

  // 8. Magnetic Button Hover Pull
  initMagneticButtons();
});

/* 3D Perspective Card Tilt */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.ops-card, .domain-card, .pipeline-card, .stat-cyber-card, .floating-badge');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* GSAP Animations & Section Reveals */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTL.from('.gov-badge', { y: 20, opacity: 0, delay: 0.1, clearProps: 'all' })
        .from('.hero-title', { y: 25, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-subtitle', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-actions', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.floating-badge', { scale: 0.85, opacity: 0, stagger: 0.1, clearProps: 'all' }, '-=0.6');

  // Fail-safe Section Reveal using ScrollTrigger
  const sections = document.querySelectorAll('section[id]');

  sections.forEach(sec => {
    if (!sec || sec.id === 'hero') return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 90%',
        onEnter: () => {
          const cards = sec.querySelectorAll('.pipeline-card, .domain-card, .ops-card, .gallery-item, .officer-card');
          if (cards.length > 0) {
            gsap.from(cards, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'all'
            });
          }
        },
        once: true
      });
    }
  });

  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }
}

/* Magnetic Button Hover Interaction */
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;

  const magneticBtns = document.querySelectorAll('.btn-cyber-primary, .btn-cyber-secondary, .back-home-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.22,
        y: y * 0.22,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}
