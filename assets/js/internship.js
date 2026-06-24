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

    // 5. Setup Interactive Photo Gallery Filters
    initGalleryFilters();
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
    const timelineCards = document.querySelectorAll('.timeline-card-wrapper, #selection-journey, #gallery-section, #program-roster, #reflection-section');
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

/* ==========================================
   Gallery Section Filtering & Rendering Logic
   ========================================== */
let allCatalogImages = [];
let currentImagesList = [];
let renderedCount = 0;
const itemsPerPage = 16;

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateCatalog() {
    // 1. Personal Journey Photos (92 items: 1 PNG, 91 JPGs)
    const personal = [];
    for (let i = 1; i <= 91; i++) {
        personal.push({
            src: `assets/images/GKM563 - Personal/Gautam_Kumar_Maurya (${i}).jpg`,
            alt: `APCSIP Journey Moment #${i}`,
            category: 'journey',
            caption: `Journey Moment #${i} - Gautam's Experience`
        });
    }
    personal.push({
        src: `assets/images/GKM563 - Personal/Gautam_Kumar_Maurya (1).png`,
        alt: `APCSIP Journey Highlight`,
        category: 'journey',
        caption: `Journey Highlight - Gautam's Onboarding`
    });

    // 2. Slide Photos (146 items)
    const slides = [];
    for (let i = 1; i <= 146; i++) {
        slides.push({
            src: `assets/images/Slides-photo/Slides-Gautam_Kumar_Maurya (${i}).jpg`,
            alt: `Training Lecture Presentation Slide #${i}`,
            category: 'slides',
            caption: `Cybersecurity Training Slide #${i}`
        });
    }

    // 3. Mentors & Leadership
    const mentors = [
        { src: 'assets/images/APCSIP -2026.jpg', alt: 'APCSIP-2026 Official Logo', category: 'mentors', caption: 'APCSIP-2026 Official Logo' },
        { src: 'assets/images/Anjali Kataria, DSP.jpg', alt: 'DSP Anjali Kataria', category: 'mentors', caption: 'DSP Anjali Kataria - Chief Organizer & Head of Cyber Crime Cell' },
        { src: 'assets/images/Bhanu Sharma - Co-ordinator APSCSIP.jpg', alt: 'Bhanu Sharma', category: 'mentors', caption: 'Bhanu Sharma - Program Coordinator' },
        { src: 'assets/images/Rakshit Tandon - cyber security expert india, cyber security consultant.jpg', alt: 'Rakshit Tandon', category: 'mentors', caption: 'Rakshit Tandon - Senior Cybersecurity Expert & Advisor' },
        { src: 'assets/images/amit dubey cyber expert.webp', alt: 'Amit Dubey', category: 'mentors', caption: 'Amit Dubey - Cyber Crime Investigator & Speaker' },
        { src: 'assets/images/Saumay Srivastava Cybersecurity  Threat Intelligence Researcher  Darkweb.jpg', alt: 'Saumay Srivastava', category: 'mentors', caption: 'Saumay Srivastava - Darkweb Analyst & OSINT Mentor' },
        { src: 'assets/images/Yugal Pathal Digital Forensics & Incident Response (DFIR) specialist.jpg', alt: 'Yugal Pathal', category: 'mentors', caption: 'Yugal Pathal - DFIR Specialist Mentor' },
        { src: 'assets/images/nitinpandey.jpg', alt: 'Nitin Pandey', category: 'mentors', caption: 'Nitin Pandey - Cybersecurity Speaker & Network Auditor' },
        { src: 'assets/images/Kailash D Agrawal Payment Security Consultant.jpg', alt: 'Kailash D Agrawal', category: 'mentors', caption: 'Kailash D Agrawal - Financial Fraud Advisor' },
        { src: 'assets/images/pakhi garg lawyer.webp', alt: 'Pakhi Garg', category: 'mentors', caption: 'Pakhi Garg - Cyber Law & DPDP Compliance Advisor' },
        { src: 'assets/images/yash chavhan - web3.jpg', alt: 'Yash Chavhan', category: 'mentors', caption: 'Yash Chavhan - Web3 Security Lead' },
        { src: 'assets/images/Ansh Sharma.jpg', alt: 'Ansh Sharma', category: 'mentors', caption: 'Ansh Sharma - Student Organizing Committee Coordinator' },
        { src: 'assets/images/Manoj Kushwaha.jpg', alt: 'Manoj Kushwaha', category: 'mentors', caption: 'Manoj Kushwaha - Student Technical Coordinator' },
        { src: 'assets/images/Vikash Kumar.jpg', alt: 'Vikash Kumar', category: 'mentors', caption: 'Vikash Kumar - Student Logistical Flow Coordinator' },
        { src: 'assets/images/up-police-logo-uttar-pradesh-police-up-police-logo-11563421838xjer0uaxol.png', alt: 'UP Police Logo', category: 'mentors', caption: 'UP Police Official Seal' },
        { src: 'assets/images/UP GOV.webp', alt: 'UP Gov Logo', category: 'mentors', caption: 'Government of Uttar Pradesh Official Logo' }
    ];

    allCatalogImages = {
        journey: personal,
        slides: slides,
        mentors: mentors
    };
}

function initGalleryFilters() {
    generateCatalog();

    const grid = document.getElementById('dynamic-gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loader = document.getElementById('gallery-loader');
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');

    if (!grid) return;

    // Load a category's images list
    const setCategory = (category) => {
        currentCategory = category;
        grid.innerHTML = '';
        renderedCount = 0;

        let list = [];
        if (category === 'all') {
            const combined = [
                ...allCatalogImages.journey,
                ...allCatalogImages.slides,
                ...allCatalogImages.mentors
            ];
            list = shuffleArray(combined);
        } else {
            list = shuffleArray(allCatalogImages[category]);
        }

        currentImagesList = list;
        activeGalleryImages = currentImagesList;

        renderNextBatch();
    };

    const renderNextBatch = () => {
        if (loader) loader.style.display = 'inline-block';
        if (loadMoreBtn) loadMoreBtn.disabled = true;

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

            activeGalleryImages = currentImagesList.slice(0, renderedCount);

            if (loader) loader.style.display = 'none';
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                if (renderedCount >= currentImagesList.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                }
            }
        }, 300);
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            setCategory(category);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderNextBatch);
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-image-wrapper');
        if (item) {
            const index = parseInt(item.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                openLightbox(index);
            }
        }
    });

    setCategory('all');
}
