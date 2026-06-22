/* ==========================================
   UP Police Cyber Security Internship Journey
   Interactive Page Control Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Active Language State
    initLanguageSync();

    // 2. Setup Sticky Day Highlighting (Scroll-spy)
    initScrollSpy();

    // 3. Setup Interactive Lightbox Modal
    initLightbox();

    // 4. Mobile Menu Navigation (Header Toggle)
    initMobileNav();
});

/* ==========================================
   Language Synchronization Logic
   ========================================== */
function initLanguageSync() {
    // Retrieve stored language preference from portfolio home settings
    let currentLang = localStorage.getItem('portfolio-lang') || 'en';
    
    // Apply initial language
    applySubpageLanguage(currentLang);

    // Sync button slider styling matching active language
    updateLanguageSwitcherUI(currentLang);
}

function applySubpageLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('portfolio-lang', lang);

    // Look up static translation dictionary
    const dictionary = window.PORTFOLIO_TRANSLATIONS && window.PORTFOLIO_TRANSLATIONS[lang];
    if (!dictionary) return;

    // Apply translations to elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = dictionary[key];
        
        if (translation !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });
}

function changeSubpageLanguage(lang) {
    applySubpageLanguage(lang);
    updateLanguageSwitcherUI(lang);
}

// Expose globally for onclick attributes in navigation
window.changeLanguage = changeSubpageLanguage;

function updateLanguageSwitcherUI(lang) {
    const btnEn = document.getElementById('lang-btn-en');
    const btnHi = document.getElementById('lang-btn-hi');
    const slider = document.querySelector('.lang-switch-slider');

    if (btnEn && btnHi) {
        if (lang === 'hi') {
            btnEn.classList.remove('active');
            btnHi.classList.add('active');
            if (slider) {
                slider.style.transform = 'translateX(100%)';
                slider.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))';
            }
        } else {
            btnEn.classList.add('active');
            btnHi.classList.remove('active');
            if (slider) {
                slider.style.transform = 'translateX(0)';
                slider.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            }
        }
    }
}

/* ==========================================
   Scroll-spy Timeline Day Highlighting
   ========================================== */
function initScrollSpy() {
    const timelineCards = document.querySelectorAll('.timeline-card-wrapper');
    const navItems = document.querySelectorAll('.day-nav-item');

    if (timelineCards.length === 0 || navItems.length === 0) return;

    // Setup intersection observer to detect center-focus timeline card
    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -45% 0px', // focused in center of screen
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                
                // Clear active states
                timelineCards.forEach(c => c.classList.remove('active-focus'));
                navItems.forEach(n => n.classList.remove('active'));

                // Set active focus on target card
                entry.target.classList.add('active-focus');

                // Set active state on sidebar item
                const matchingNavItem = document.querySelector(`.day-nav-item[data-day="${targetId}"]`);
                if (matchingNavItem) {
                    matchingNavItem.classList.add('active');

                    // Center active element in mobile horizontal subnav
                    const listContainer = document.querySelector('.day-nav-list');
                    if (listContainer && window.innerWidth <= 1024) {
                        const listRect = listContainer.getBoundingClientRect();
                        const navRect = matchingNavItem.getBoundingClientRect();
                        
                        // Scroll horizontally to match focus index
                        listContainer.scrollTo({
                            left: listContainer.scrollLeft + (navRect.left - listRect.left) - (listRect.width / 2) + (navRect.width / 2),
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    }, observerOptions);

    timelineCards.forEach(card => observer.observe(card));

    // Smooth scrolling link events
    const scrollLinks = document.querySelectorAll('.day-nav-item a, .hero-scroll-prompt');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSel = link.getAttribute('href');
            const targetEl = document.querySelector(targetSel);

            if (targetEl) {
                // Header offset deduction
                const offset = window.innerWidth <= 1024 ? 150 : 110;
                const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   Interactive Photo Lightbox Modal
   ========================================== */
function initLightbox() {
    // Create Lightbox Markup Programmatically if not exists
    let modal = document.getElementById('lightbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'lightbox-modal';
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <div class="lightbox-content-wrapper">
                <button class="lightbox-close-btn" aria-label="Close Lightbox"><i class="fas fa-times"></i></button>
                <img class="lightbox-image" src="" alt="Zoomed view">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const lightboxImg = modal.querySelector('.lightbox-image');
    const lightboxCap = modal.querySelector('.lightbox-caption');
    const closeBtn = modal.querySelector('.lightbox-close-btn');

    // Add click events to gallery thumbnails
    const thumbnails = document.querySelectorAll('.gallery-image-wrapper');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imgEl = thumb.querySelector('img');
            const captionText = thumb.querySelector('.hud-image-overlay span').textContent;
            
            if (imgEl) {
                lightboxImg.src = imgEl.src;
                lightboxImg.alt = imgEl.alt;
                lightboxCap.textContent = captionText;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scroll
            }
        });
    });

    // Close lightbox actions
    const closeLightbox = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ==========================================
   Mobile Nav Menu Toggle Sync
   ========================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const header = document.getElementById('main-header');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close when clicking nav link
        const navLinks = mainNav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}
