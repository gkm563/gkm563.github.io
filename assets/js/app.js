/**
 * Gautam Kumar Maurya — Modern Portfolio Application Script (2026)
 * Lightweight, fast, vanilla JS handling interactions, tabs, theme, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --------------------------------------------------
  // 1. Unified Theme Switcher (Dark / Light Synchronized)
  // --------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('portfolio-theme') || localStorage.getItem('gkm_theme') || 'light';

  const applyGlobalTheme = (t) => {
    const isDark = t === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark', 'dark-theme');
      if (document.body) document.body.classList.add('dark', 'dark-theme');
    } else {
      document.documentElement.classList.remove('dark', 'dark-theme');
      if (document.body) document.body.classList.remove('dark', 'dark-theme');
    }
    try {
      localStorage.setItem('portfolio-theme', t);
      localStorage.setItem('gkm_theme', t);
    } catch (e) {}
  };

  applyGlobalTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      themeToggleBtn.classList.remove('theme-spin-anim');
      void themeToggleBtn.offsetWidth; // trigger reflow
      themeToggleBtn.classList.add('theme-spin-anim');
      setTimeout(() => themeToggleBtn.classList.remove('theme-spin-anim'), 600);

      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const nextTheme = isCurrentlyDark ? 'light' : 'dark';
      applyGlobalTheme(nextTheme);
    });
  }

  // Cross-tab / cross-page sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio-theme' || e.key === 'gkm_theme') {
      if (e.newValue === 'dark' || e.newValue === 'light') {
        applyGlobalTheme(e.newValue);
      }
    }
  });

  // --------------------------------------------------
  // 2. Floating Animated Glass Capsule Navbar & Scroll Progress
  // --------------------------------------------------
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    const scrollPos = window.scrollY;
    
    if (navbar) {
      if (scrollPos > 35) {
        navbar.classList.add('floating-nav-active');
      } else {
        navbar.classList.remove('floating-nav-active');
      }
    }

    if (progressBar) {
      const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = winHeight > 0 ? (scrollPos / winHeight) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    }

    // Scroll-Spy Link Highlight
    if (sections.length > 0 && navLinks.length > 0) {
      let currentSectionId = '';
      sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 140;
        const sectionHeight = sec.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // --------------------------------------------------
  // 3. Mobile Navigation Drawer Toggle
  // --------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.add('translate-x-full');
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.add('translate-x-full');
      }
    });
  });

  // --------------------------------------------------
  // 4. Skills Category Tabs Filter
  // --------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'block';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------
  // 5. Projects Category Tabs Filter
  // --------------------------------------------------
  const projectTabs = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-item-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory.includes(category)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------
  // 6. Contact Form Submission (Formspree AJAX)
  // --------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin inline w-4 h-4 mr-2"></i> Sending...`;
        if (window.lucide) window.lucide.createIcons();
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.className = 'mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            formStatus.innerHTML = '✨ Thank you! Your message has been sent successfully. Gautam will get back to you shortly.';
            formStatus.classList.remove('hidden');
          }
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
          formStatus.innerHTML = '⚠️ Oops! Something went wrong. Please email directly to <a href="mailto:gkmwin563@gmail.com" class="underline">gkmwin563@gmail.com</a>';
          formStatus.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // --------------------------------------------------
  // 7. Copy Link Toast Functionality
  // --------------------------------------------------
  const shareBtn = document.getElementById('share-copy-btn');
  const toastMsg = document.getElementById('toast-notification');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('https://gkm563.github.io/').then(() => {
        if (toastMsg) {
          toastMsg.classList.add('show');
          setTimeout(() => {
            toastMsg.classList.remove('show');
          }, 3000);
        }
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }

  // --------------------------------------------------
  // 8. 3D Perspective Card Tilt (kept for profile card)
  // --------------------------------------------------
  init3DTiltCards();

  // --------------------------------------------------
  // 9. Leadership Section Grid Toggle
  // --------------------------------------------------
  const toggleLeadershipBtn = document.getElementById('toggle-leadership-btn');
  const additionalLeadership = document.getElementById('additional-leadership');

  if (toggleLeadershipBtn && additionalLeadership) {
    toggleLeadershipBtn.addEventListener('click', () => {
      const isHidden = additionalLeadership.classList.contains('hidden');
      const textSpan = toggleLeadershipBtn.querySelector('span');
      const icon = toggleLeadershipBtn.querySelector('i') || toggleLeadershipBtn.querySelector('[data-lucide]');

      if (isHidden) {
        additionalLeadership.classList.remove('hidden');
        // Small delay to allow display block changes to register in browser flow
        setTimeout(() => {
          additionalLeadership.style.maxHeight = '2000px';
          additionalLeadership.style.opacity = '1';
        }, 10);
        if (textSpan) textSpan.textContent = 'Hide Additional Roles';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        additionalLeadership.style.maxHeight = '0px';
        additionalLeadership.style.opacity = '0';
        setTimeout(() => {
          additionalLeadership.classList.add('hidden');
        }, 500);
        if (textSpan) textSpan.textContent = 'Show Other Community & Ambassador Roles';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  }

  // --------------------------------------------------
  // 10. FAQ Accordion Handler
  // --------------------------------------------------
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = toggle.querySelector('.faq-icon');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          const otherItem = otherToggle.closest('.faq-item');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherToggle.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle clicked item
      toggle.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // NOTE: GSAP animations and magnetic buttons are handled
  // by assets/js/gkm-animations.js (loaded after this file)
});

/* 3D Perspective Card Tilt */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.glass-card, .hover-elevate, .floating-badge');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* GSAP ScrollTrigger Animations */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTL.from('.gradient-badge', { y: 20, opacity: 0, delay: 0.1, clearProps: 'all' })
        .from('#hero h1', { y: 25, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('#hero p', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('#hero .flex-wrap', { y: 15, opacity: 0, clearProps: 'all' }, '-=0.5')
        .from('.floating-badge', { scale: 0.85, opacity: 0, stagger: 0.1, clearProps: 'all' }, '-=0.6');

  // Fail-safe Section Reveal using ScrollTrigger
  const sectionSelectors = ['#about', '#skills', '#projects', '#experience', '#leadership', '#achievements', '#technical-focus', '#contact'];

  sectionSelectors.forEach(secId => {
    const secEl = document.querySelector(secId);
    if (!secEl) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: secEl,
        start: 'top 90%',
        onEnter: () => {
          const cards = secEl.querySelectorAll('.glass-card, .project-item-card, .skill-category-card');
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

  const magneticBtns = document.querySelectorAll('a.bg-blue-600, button.bg-blue-600, a.bg-emerald-600, a.bg-sky-600');

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
