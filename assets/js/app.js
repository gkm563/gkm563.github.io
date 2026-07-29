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
  // 1. Theme Switcher (Dark / Light)
  // --------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('portfolio-theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    });
  }

  // --------------------------------------------------
  // 2. Sticky Navbar Glass & Scroll Progress
  // --------------------------------------------------
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Glass shadow on scroll
    if (navbar) {
      if (scrollPos > 20) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    }

    // Progress bar fill
    if (progressBar) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }

    // ScrollSpy active link highlighting
    highlightActiveNavLink();
  });

  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
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
  }

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
});
