/**
 * OPEN SOURCE IMPACT REPORT & WIKIMEDIA CONTRIBUTOR PROFILE CONTROLLER
 * Handles scrollspy navigation, theme switching, canvas particle background,
 * Gerrit review simulator, category tab filters, and lightbox modal photo viewer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // 1b. Floating Capsule Navbar on Scroll
  const mainHeader = document.getElementById('main-header');
  if (mainHeader && !document.getElementById('oss-floating-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'oss-floating-styles';
    styleEl.innerHTML = `
      .main-header {
        transition: top 0.45s cubic-bezier(0.34,1.56,0.64,1),
                    left 0.45s cubic-bezier(0.34,1.56,0.64,1),
                    right 0.45s cubic-bezier(0.34,1.56,0.64,1),
                    border-radius 0.45s cubic-bezier(0.34,1.56,0.64,1),
                    background 0.45s ease,
                    box-shadow 0.45s ease !important;
        will-change: transform;
      }
      .main-header.nav-float {
        top: 0.75rem !important;
        left: 1rem !important;
        right: 1rem !important;
        width: auto !important;
        max-width: 72rem !important;
        margin-left: auto !important;
        margin-right: auto !important;
        border-radius: 1.25rem !important;
        background: rgba(255,255,255,0.88) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1px solid rgba(226,232,240,0.85) !important;
        box-shadow: 0 20px 45px -10px rgba(0,0,0,0.12), 0 0 20px rgba(37,99,235,0.08) !important;
      }
      html.dark-theme .main-header.nav-float,
      body.dark-theme .main-header.nav-float {
        background: rgba(9,13,22,0.92) !important;
        border: 1px solid rgba(255,255,255,0.10) !important;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 25px rgba(59,130,246,0.12) !important;
      }
      @media (max-width: 640px) {
        .main-header.nav-float {
          top: 0.5rem !important;
          left: 0.5rem !important;
          right: 0.5rem !important;
          border-radius: 1rem !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainHeader.classList.add('nav-float');
      } else {
        mainHeader.classList.remove('nav-float');
      }
    }, { passive: true });
  }

  // 2. Light / Dark Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const applyTheme = (theme) => {
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark', 'dark-theme');
      document.body.classList.add('dark', 'dark-theme');
      if (icon) icon.className = 'fas fa-sun';
    } else {
      document.documentElement.classList.remove('dark', 'dark-theme');
      document.body.classList.remove('dark', 'dark-theme');
      if (icon) icon.className = 'fas fa-moon';
    }
    try {
      localStorage.setItem('portfolio-theme', theme);
      localStorage.setItem('gkm_theme', theme);
    } catch (e) {}
  };

  const savedTheme = localStorage.getItem('portfolio-theme') || localStorage.getItem('gkm_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('dark-theme');
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio-theme' || e.key === 'gkm_theme') {
      if (e.newValue) applyTheme(e.newValue);
    }
  });

  // 3. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (mainNav.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    const drawerLinks = mainNav.querySelectorAll('.nav-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 4. Scrollspy Active Section Highlighting
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateScrollspy = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    // Fallback for top of page if before first section or at hero
    if (!currentId && window.scrollY < 300 && sections.length > 0) {
      currentId = 'hero';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateScrollspy, { passive: true });
  window.addEventListener('resize', updateScrollspy);
  window.addEventListener('hashchange', updateScrollspy);
  updateScrollspy();

  // 5. Hero Particle Canvas Animation
  initNetworkCanvas();

  // 6. Contributions Category Filtering
  initContributionsFilter();

  // 7. Gallery Lightbox Modal
  initLightboxModal();

  // 8. Stats CountUp Animation
  initStatsCountUp();

  // 9. 3D Perspective Tilt Cards
  init3DTiltCards();

  // 10. GSAP ScrollTrigger Entrance Animations
  initGSAPAnimations();

  // 11. Magnetic Button Hover Pull
  initMagneticButtons();

  // 12. Collapsible Details & Task Accordion
  initCollapsibleDetails();

  // 13. Phabricator Live Activity Feed Toggle
  initPhabricatorFeed();
});

/* GSAP ScrollTrigger Animations */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTL.from('.hero-badge', { y: 20, opacity: 0, delay: 0.1, clearProps: 'all' })
        .from('.hero-title', { y: 25, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-subtitle', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-actions', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.hero-live-status', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.floating-badge', { scale: 0.85, opacity: 0, stagger: 0.1, clearProps: 'all' }, '-=0.6')
        .from('.metric-card', { y: 25, opacity: 0, stagger: 0.06, clearProps: 'all' }, '-=0.5');

  // Fail-safe section reveal using ScrollTrigger without locking opacity:0
  const sectionSelectors = ['#journey', '#recognition', '#phabricator-profile', '#contributions', '#ecosystem', '#community', '#gallery', '#future'];

  sectionSelectors.forEach(secId => {
    const secEl = document.querySelector(secId);
    if (!secEl) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: secEl,
        start: 'top 90%',
        onEnter: () => {
          const cards = secEl.querySelectorAll('.journey-card, .recog-card, .contrib-card, .gallery-item, .phab-card, .phab-feed-card');
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

  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .back-home-btn, .theme-toggle-btn');

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

/* 3D Perspective Tilt Card Interaction */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.metric-card, .journey-card, .contrib-card, .recognition-banner, .hero-logo-box');

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

/* Canvas Network Animation */
function initNetworkCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });
}

/* Contributions Filter */
function initContributionsFilter() {
  const tabBtns = document.querySelectorAll('.contrib-tab-btn');
  const cards = document.querySelectorAll('.contrib-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const status = card.getAttribute('data-status');

        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'merged' && status === 'merged') {
          card.style.display = 'flex';
        } else if (cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Lightbox Modal */
function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Open Source Moment';
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* Stats CountUp Animation */
function initStatsCountUp() {
  const nums = document.querySelectorAll('.metric-num');
  if (nums.length === 0) return;

  let animated = false;
  window.addEventListener('scroll', () => {
    if (animated) return;
    const heroSection = document.getElementById('hero');
    if (heroSection && window.scrollY > heroSection.offsetHeight / 3) {
      animated = true;
      nums.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            num.textContent = target + (num.getAttribute('data-target').includes('+') ? '+' : '');
            clearInterval(timer);
          } else {
            num.textContent = current + '+';
          }
        }, 30);
      });
    }
  });
}

/* Collapsible Details & Task Accordion */
function initCollapsibleDetails() {
  const cardsList = document.querySelectorAll('.contrib-card');
  cardsList.forEach(card => {
    const toggleBtn = card.querySelector('.contrib-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = card.classList.toggle('expanded');
        const text = toggleBtn.querySelector('span');
        if (text) {
          text.textContent = isExpanded ? 'Hide Details' : 'Technical Details';
        }
      });
    }
  });

  const inspectAllBtn = document.getElementById('btn-inspect-all');
  if (inspectAllBtn) {
    inspectAllBtn.addEventListener('click', () => {
      const isExpanded = inspectAllBtn.classList.toggle('active');
      const textEl = inspectAllBtn.querySelector('span');
      const iconEl = inspectAllBtn.querySelector('i');
      
      cardsList.forEach(card => {
        const toggleBtn = card.querySelector('.contrib-toggle-btn');
        const text = toggleBtn ? toggleBtn.querySelector('span') : null;
        
        if (isExpanded) {
          card.classList.add('expanded');
          if (text) text.textContent = 'Hide Details';
        } else {
          card.classList.remove('expanded');
          if (text) text.textContent = 'Technical Details';
        }
      });

      if (textEl) textEl.textContent = isExpanded ? 'Collapse All Details' : 'Expand All Details';
      if (iconEl) iconEl.className = isExpanded ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    });
  }
}

/* Phabricator Live Activity Feed Toggle */
function initPhabricatorFeed() {
  const showMoreBtn = document.getElementById('phab-show-more-btn');
  const hiddenActivities = document.querySelectorAll('.phab-timeline-item.hidden-activity');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const isExpanded = showMoreBtn.classList.toggle('expanded');
      hiddenActivities.forEach(item => {
        item.style.display = isExpanded ? 'block' : 'none';
      });
      const text = showMoreBtn.querySelector('span');
      if (text) {
        text.textContent = isExpanded ? 'Show Less Activities' : 'Show More Activities';
      }
    });
  }
}
