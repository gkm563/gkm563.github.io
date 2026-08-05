/**
 * AIT Bangkok Global Innovation Internship Program (GIIP 2026)
 * Research-Grade Interactive Script Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProgressBar();
  initScrollSpy();
  initGalleryFilters();
  initLightbox();
  initMobileMenu();
  init3DTiltCards();
  initGSAPAnimations();
  initMagneticButtons();
});

/* Theme Toggle Handler */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  }

  toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });
}

/* Top Scroll Progress Bar */
function initProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ScrollSpy Active Link Highlighting */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateSpy, { passive: true });
  window.addEventListener('resize', updateSpy);
  window.addEventListener('hashchange', updateSpy);
  updateSpy();
}

/* GSAP ScrollTrigger Entrance Animations */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTL.from('.hero-institution-badge', { y: 20, opacity: 0, delay: 0.1, clearProps: 'all' })
        .from('.hero-title', { y: 25, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-subtitle', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.domain-pill', { scale: 0.85, opacity: 0, stagger: 0.05, clearProps: 'all' }, '-=0.5')
        .from('.hero-actions', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-live-status', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.floating-badge', { scale: 0.85, opacity: 0, stagger: 0.1, clearProps: 'all' }, '-=0.6');

  // Fail-safe Section Reveal using ScrollTrigger
  const sectionSelectors = ['#overview', '#timeline', '#learning', '#journey', '#project', '#mentors', '#gallery', '#reflection'];

  sectionSelectors.forEach(secId => {
    const secEl = document.querySelector(secId);
    if (!secEl) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: secEl,
        start: 'top 90%',
        onEnter: () => {
          const cards = secEl.querySelectorAll('.domain-card, .day-card, .mentor-card, .hero-stat-card, .gallery-item, .tech-chip');
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

/* 3D Perspective Tilt Cards */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.domain-card, .day-card, .mentor-card, .hero-stat-card, .floating-badge');

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

/* Magnetic Button Hover Interaction */
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;

  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .back-portfolio-btn');

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

/* Gallery Filtering System */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Lightbox Modal System */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const galleryImgs = document.querySelectorAll('.gallery-item img, .day-image');

  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modal.classList.add('active');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}
