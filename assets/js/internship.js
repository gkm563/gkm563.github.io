/**
 * APCSIP-2026: AMROHA POLICE CYBER SECURITY INTERNSHIP CONTROLLER
 * Handles scrollspy active states, progress bar, gallery filter, lightbox viewer modal
 */

document.addEventListener('DOMContentLoaded', () => {
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
});
