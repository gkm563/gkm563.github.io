/* ==========================================
   UP Police Cyber Security Internship Journey
   Interactive Page Control Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Active Language State
    initLanguageSync();

    // 2. Setup Sticky Day Highlighting (Scroll-spy)
    initScrollSpy();

    // 2.5. Setup Main Header Scroll-spy Highlight
    initMainHeaderScrollSpy();

    // 3. Setup Interactive Lightbox Modal
    initLightbox();

    // 4. Mobile Menu Navigation (Header Toggle)
    initMobileNav();

    // 5. Setup Interactive Photo Gallery Filters
    initGalleryFilters();

    // 5.5. Setup LinkedIn Post Carousel
    initLinkedinCarousel();

    // 5.6. Setup Light/Dark Theme Toggling
    initThemeToggle();

    // 6. Setup Premium Cursor Spotlight Hover Effect
    document.querySelectorAll('.timeline-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

/* ==========================================
   Language Synchronization Logic
   ========================================== */
function initLanguageSync() {
    let currentLang = 'en';
    applySubpageLanguage(currentLang);
}

function applySubpageLanguage(lang) {
    lang = 'en';
    document.documentElement.lang = 'en';
    localStorage.setItem('portfolio-lang', 'en');

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
                navItems.forEach(n => {
                    n.classList.remove('active', 'active-blue', 'active-red', 'active-yellow', 'active-green');
                });

                // Set active focus on target card
                entry.target.classList.add('active-focus');

                // Determine active theme color class
                let themeColorClass = 'active-blue'; // default blue
                if (entry.target.classList.contains('day-theme-red')) {
                    themeColorClass = 'active-red';
                } else if (entry.target.classList.contains('day-theme-yellow')) {
                    themeColorClass = 'active-yellow';
                } else if (entry.target.classList.contains('day-theme-green') || entry.target.id === 'program-roster' || entry.target.id === 'reflection-section') {
                    themeColorClass = 'active-green';
                }

                // Set active state on sidebar item
                const matchingNavItem = document.querySelector(`.day-nav-item[data-day="${targetId}"]`);
                if (matchingNavItem) {
                    matchingNavItem.classList.add('active', themeColorClass);

                    // Center active element in mobile horizontal subnav
                    const listContainer = document.querySelector('.day-nav-list');
                    if (listContainer) {
                        const listRect = listContainer.getBoundingClientRect();
                        const navRect = matchingNavItem.getBoundingClientRect();
                        
                        if (window.innerWidth <= 1024) {
                            // Scroll horizontally to match focus index on mobile
                            listContainer.scrollTo({
                                left: listContainer.scrollLeft + (navRect.left - listRect.left) - (listRect.width / 2) + (navRect.width / 2),
                                behavior: 'smooth'
                            });
                        } else {
                            // Scroll vertically to match focus index on desktop sidebar
                            listContainer.scrollTo({
                                top: listContainer.scrollTop + (navRect.top - listRect.top) - (listRect.height / 2) + (navRect.height / 2),
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
        });
    }, observerOptions);

    timelineCards.forEach(card => observer.observe(card));

    // Smooth scrolling link events
    const scrollLinks = document.querySelectorAll('.day-nav-item a, .hero-scroll-prompt, .main-nav ul li a[href^="#"]');
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

    // Forward scroll events from day-nav-list directly to window so the entire page scrolls
    const listContainer = document.querySelector('.day-nav-list');
    if (listContainer) {
        listContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            window.scrollBy(0, e.deltaY);
        }, { passive: false });
    }
}

/* ==========================================
   Interactive Photo Lightbox Modal
   ========================================== */
let activeGalleryImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
    let modal = document.getElementById('lightbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'lightbox-modal';
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <div class="lightbox-content-wrapper">
                <button class="lightbox-close-btn" aria-label="Close Lightbox"><i class="fas fa-times"></i></button>
                <button class="lightbox-nav-btn prev-btn" aria-label="Previous Image"><i class="fas fa-chevron-left"></i></button>
                <img class="lightbox-image" src="" alt="Zoomed view">
                <button class="lightbox-nav-btn next-btn" aria-label="Next Image"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-caption"></div>
                <div class="lightbox-index-indicator"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const closeBtn = modal.querySelector('.lightbox-close-btn');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');

    // Close actions
    const closeLightbox = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on click outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Navigation actions
    const navigate = (direction) => {
        if (activeGalleryImages.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + direction + activeGalleryImages.length) % activeGalleryImages.length;
        updateLightboxContent();
    };

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    });

    // Swipe gestures for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    const contentWrapper = modal.querySelector('.lightbox-content-wrapper');

    contentWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    contentWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right -> prev image
            navigate(-1);
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left -> next image
            navigate(1);
        }
    };
}

function openLightbox(index) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    
    currentLightboxIndex = index;
    updateLightboxContent();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxContent() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || activeGalleryImages.length === 0) return;

    const imgEl = modal.querySelector('.lightbox-image');
    const capEl = modal.querySelector('.lightbox-caption');
    const indEl = modal.querySelector('.lightbox-index-indicator');
    
    const activeItem = activeGalleryImages[currentLightboxIndex];
    
    imgEl.src = activeItem.src;
    imgEl.alt = activeItem.alt;
    capEl.textContent = activeItem.caption;
    indEl.textContent = `${currentLightboxIndex + 1} / ${activeGalleryImages.length}`;
}

/* ==========================================
   Mobile Nav Menu Toggle Sync
   ========================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navUL = mainNav ? mainNav.querySelector('ul') : null;
    const header = document.getElementById('main-header');

    if (hamburger && mainNav && navUL) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navUL.classList.toggle('active');  // toggle on ul, matching CSS selector .main-nav ul.active
        });

        // Close when clicking nav link
        const navLinks = mainNav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navUL.classList.remove('active');
            });
        });
    }

    // Shrink header on scroll — also close mobile menu on scroll
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        // Close mobile menu if user scrolls while it's open
        if (hamburger && navUL && navUL.classList.contains('active')) {
            hamburger.classList.remove('active');
            navUL.classList.remove('active');
        }
    });
}

/* ==========================================
   Gallery Section Filtering, Slider & Rendering Logic
   ========================================== */
let allCatalogImages = [];
let currentImagesList = [];
let renderedCount = 0;
const itemsPerPage = 18;
let currentCategory = 'journey';

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateCatalog() {
    // 1. Personal Journey Photos (92 items originally, skipping the 6 moved to slides)
    const personal = [];
    const skippedJourneyIndexes = [1, 2, 3, 16, 87];
    for (let i = 1; i <= 91; i++) {
        if (skippedJourneyIndexes.includes(i)) continue;
        personal.push({
            src: `assets/images/up-police/moments/Gautam_Kumar_Maurya (${i}).jpg`,
            alt: `APCSIP Journey Moment #${i}`,
            category: 'journey',
            caption: `Journey Moment #${i} - Gautam's Experience`
        });
    }
    // Gautam_Kumar_Maurya (1).png was also moved to slides, so we do not push it to personal journey photos.

    // 2. Slide Photos (146 items from loop + 6 items moved from GKM563 - Personal)
    const slides = [];
    for (let i = 1; i <= 146; i++) {
        slides.push({
            src: `assets/images/up-police/moments/slides/Slides-Gautam_Kumar_Maurya (${i}).jpg`,
            alt: `Training Lecture Presentation Slide #${i}`,
            category: 'slides',
            caption: `Cybersecurity Training Slide #${i}`
        });
    }

    // Add the specific slides moved from GKM563 - Personal
    const movedToSlides = [
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (1).jpg', caption: 'Cybersecurity training presentation slide' },
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (1).png', caption: 'Cybersecurity lecture overview' },
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (2).jpg', caption: 'Cybersecurity expert training concepts' },
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (3).jpg', caption: 'Cyber forensics and threat intelligence slide' },
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (16).jpg', caption: 'Vulnerability assessment and pentesting concepts' },
        { src: 'assets/images/up-police/moments/slides/Gautam_Kumar_Maurya (87).jpg', caption: 'Mobile data extraction steps presentation' }
    ];

    movedToSlides.forEach((item, idx) => {
        slides.push({
            src: item.src,
            alt: `Training Lecture Presentation Slide - Additional ${idx + 1}`,
            category: 'slides',
            caption: item.caption
        });
    });

    allCatalogImages = {
        journey: personal,
        slides: slides
    };
}

function initGalleryFilters() {
    generateCatalog();

    // Initialize direct simple gallery panel
    initArchivePanel();
}

function initArchivePanel() {
    const grid = document.getElementById('dynamic-gallery-grid');
    const filterButtons = document.querySelectorAll('.gallery-tab-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const shuffleBtn = document.getElementById('gallery-shuffle-btn');

    if (!grid) return;

    // Direct initialization of active tab on load
    setArchiveCategory('journey');

    function setArchiveCategory(category) {
        currentCategory = category;
        grid.innerHTML = '';
        renderedCount = 0;

        triggerArchiveFilter();
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            setArchiveCategory(category);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderArchiveBatch);
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            // Animate spin on the shuffle icon
            const icon = shuffleBtn.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => { icon.style.transform = ''; }, 400);
            }

            // Shuffle and re-render
            currentImagesList = shuffleArray(currentImagesList);
            grid.innerHTML = '';
            renderedCount = 0;
            renderArchiveBatch();
        });
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-image-wrapper');
        if (item) {
            const index = parseInt(item.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                activeGalleryImages = currentImagesList;
                openLightbox(index);
            }
        }
    });
}

function triggerArchiveFilter() {
    const grid = document.getElementById('dynamic-gallery-grid');
    if (!grid) return;

    // Load and automatically shuffle the category images list on load/reload/switch
    let list = shuffleArray(allCatalogImages[currentCategory] || []);

    currentImagesList = list;
    grid.innerHTML = '';
    renderedCount = 0;

    renderArchiveBatch();
}

function renderArchiveBatch() {
    const grid = document.getElementById('dynamic-gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loader = document.getElementById('gallery-loader');
    
    if (!grid) return;

    if (loader) loader.style.display = 'inline-block';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    setTimeout(() => {
        const nextBatchLimit = Math.min(renderedCount + itemsPerPage, currentImagesList.length);
        let htmlContent = '';

        for (let i = renderedCount; i < nextBatchLimit; i++) {
            const imgObj = currentImagesList[i];
            htmlContent += `
                <div class="gallery-image-wrapper" data-category="${imgObj.category}" data-index="${i}" data-aos="zoom-in" data-aos-delay="${(i - renderedCount) * 50}">
                    <img src="${imgObj.src}" alt="${imgObj.alt}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="image-placeholder-hud" style="display:none;">
                        <i class="fas fa-image"></i>
                        <span>APCSIP Moment</span>
                    </div>
                    <div class="hud-image-overlay">
                        <i class="fas fa-expand"></i>
                        <span>${imgObj.caption}</span>
                    </div>
                </div>
            `;
        }

        grid.insertAdjacentHTML('beforeend', htmlContent);
        renderedCount = nextBatchLimit;

        if (window.AOS) {
            window.AOS.refresh();
        }

        if (loader) loader.style.display = 'none';
        if (loadMoreBtn) {
            if (renderedCount >= currentImagesList.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
                loadMoreBtn.disabled = false;
            }
        }
    }, 200);
}

/* ==========================================
   Main Header Scroll-Spy Link Highlighting
   ========================================== */
function initMainHeaderScrollSpy() {
    const sections = [
        document.getElementById('selection-journey'),
        document.getElementById('journey-section'),
        document.getElementById('awards-section'),
        document.getElementById('linkedin-section'),
        document.getElementById('gallery-section'),
        document.getElementById('program-roster'),
        document.getElementById('reflection-section')
    ].filter(el => el !== null);

    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}` || ((id === 'awards-section' || id === 'linkedin-section') && href === '#awards-section')) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Clear active state when at the top of the page
    window.addEventListener('scroll', () => {
        if (window.scrollY < 200) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') !== 'index.html') {
                    link.classList.remove('active');
                }
            });
        }
    });
}

/* ==========================================
   LinkedIn Post Grid Slider / Carousel Logic
   ========================================== */
function initLinkedinCarousel() {
    const track = document.querySelector('.linkedin-carousel-track');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track) return;

    const cards = track.querySelectorAll('.linkedin-post-card');
    if (cards.length === 0) return;

    let cardsPerPage = getCardsPerPage();
    let numPages = Math.ceil(cards.length / cardsPerPage);

    function getCardsPerPage() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        cardsPerPage = getCardsPerPage();
        numPages = Math.ceil(cards.length / cardsPerPage);
        
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const scrollAmount = i * cardsPerPage * getCardWidth();
                track.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
            dotsContainer.appendChild(dot);
        }
    }

    function getCardWidth() {
        const firstCard = cards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return cardWidth + gap;
    }

    
    // Scroll handlers for buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const currentScroll = track.scrollLeft;
            const cardWidth = getCardWidth();
            const maxScroll = track.scrollWidth - track.clientWidth;
            const targetScroll = currentScroll - cardWidth * cardsPerPage;
            
            if (currentScroll <= 10) {
                // Loop to the end
                track.scrollTo({
                    left: maxScroll,
                    behavior: 'smooth'
                });
            } else {
                track.scrollTo({
                    left: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
            }
        });

        nextBtn.addEventListener('click', () => {
            const currentScroll = track.scrollLeft;
            const cardWidth = getCardWidth();
            const maxScroll = track.scrollWidth - track.clientWidth;
            const targetScroll = currentScroll + cardWidth * cardsPerPage;
            
            if (currentScroll >= maxScroll - 10) {
                // Loop back to start
                track.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                track.scrollTo({
                    left: Math.min(maxScroll, targetScroll),
                    behavior: 'smooth'
                });
            }
        });
    }

    // Update active dot on scroll
    track.addEventListener('scroll', () => {
        if (!dotsContainer) return;
        const cardWidth = getCardWidth();
        const activeIndex = Math.round(track.scrollLeft / (cardWidth * cardsPerPage));
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });

    createDots();
    window.addEventListener('resize', createDots);
}

// === THEME MANAGER (LIGHT/DARK) ===
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const applyTheme = (theme) => {
        const icon = toggleBtn.querySelector('i');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.body.classList.add('dark-theme');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.body.classList.remove('dark-theme');
            if (icon) {
                icon.className = 'fas fa-moon';
            }
        }
    };

    // Load saved preference or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    applyTheme(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark-theme') || document.body.classList.contains('dark-theme');
        const nextTheme = isCurrentlyDark ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', nextTheme);
        applyTheme(nextTheme);
    });
}
