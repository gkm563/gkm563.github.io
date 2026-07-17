/* ==========================================
   AIT Bangkok Global Innovation Internship
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

    const dictionary = window.PORTFOLIO_TRANSLATIONS && window.PORTFOLIO_TRANSLATIONS[lang];
    if (!dictionary) return;

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
            }
        } else {
            btnEn.classList.add('active');
            btnHi.classList.remove('active');
            if (slider) {
                slider.style.transform = 'translateX(0)';
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

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                
                timelineCards.forEach(c => c.classList.remove('active-focus'));
                navItems.forEach(n => {
                    n.classList.remove('active', 'active-blue', 'active-red', 'active-yellow', 'active-green');
                });

                entry.target.classList.add('active-focus');

                let themeColorClass = 'active-blue';
                if (entry.target.classList.contains('day-theme-red')) {
                    themeColorClass = 'active-red';
                } else if (entry.target.classList.contains('day-theme-yellow')) {
                    themeColorClass = 'active-yellow';
                } else if (entry.target.classList.contains('day-theme-green') || entry.target.id === 'program-roster' || entry.target.id === 'reflection-section') {
                    themeColorClass = 'active-green';
                }

                const matchingNavItem = document.querySelector(`.day-nav-item[data-day="${targetId}"]`);
                if (matchingNavItem) {
                    matchingNavItem.classList.add('active', themeColorClass);

                    const listContainer = document.querySelector('.day-nav-list');
                    if (listContainer) {
                        const listRect = listContainer.getBoundingClientRect();
                        const navRect = matchingNavItem.getBoundingClientRect();
                        
                        if (window.innerWidth <= 1024) {
                            listContainer.scrollTo({
                                left: listContainer.scrollLeft + (navRect.left - listRect.left) - (listRect.width / 2) + (navRect.width / 2),
                                behavior: 'smooth'
                            });
                        } else {
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

    const scrollLinks = document.querySelectorAll('.day-nav-item a, .hero-scroll-prompt, .main-nav ul li a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSel = link.getAttribute('href');
            const targetEl = document.querySelector(targetSel);

            if (targetEl) {
                const offset = window.innerWidth <= 1024 ? 150 : 110;
                const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    const listContainer = document.querySelector('.day-nav-list');
    if (listContainer) {
        listContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            window.scrollBy(0, e.deltaY);
        }, { passive: false });
    }
}

/* ==========================================
   Header Scroll spy
   ========================================== */
function initMainHeaderScrollSpy() {
    const mainHeader = document.getElementById('main-header');
    if (!mainHeader) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Highlight main header navigation links based on scroll intersection
    const sections = [
        document.getElementById('selection-journey'),
        document.getElementById('journey-section'),
        document.getElementById('innovation-project'),
        document.getElementById('program-roster'),
        document.getElementById('gallery-section'),
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
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Clear active state when at the top of the page (Hero section)
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

    const closeLightbox = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

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
            navigate(-1);
        } else if (touchStartX - touchEndX > swipeThreshold) {
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

    if (hamburger && mainNav && navUL) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navUL.classList.toggle('active');
        });

        const navLinks = mainNav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navUL.classList.remove('active');
            });
        });
    }
}

/* ==========================================
   Gallery Section Filtering & Rendering Logic
   ========================================== */
let allCatalogImages = [];
let currentImagesList = [];
let renderedCount = 0;
const itemsPerPage = 12;
let currentCategory = 'all';

function getAITCaption(i) {
    const captions = {
        1: "Arriving at Bangkok Airport - Embarking on the International Journey ✈️🇹🇭",
        2: "AIT Bangkok Main Campus Landmark and Welcome Banner 🏛️",
        3: "Orientation & Program Onboarding Briefing Session",
        4: "Exploring the academic facilities and green campus of AIT Bangkok",
        5: "Day 1 - Program structure briefing and introductory session",
        6: "Day 2 - Cultural learning seminar on Thai traditions and community values",
        7: "Day 2 - AI and technology mapping session with Dr. Chutiporn Anutariya",
        8: "Day 3 - Hands-on Prompt Engineering activity sessions with Dr. Rishi Jain",
        9: "Day 3 - Spatial mapping analysis and Ubiquitous GIS introduction",
        10: "Day 4 - Clean data curation processes in Exploratory Data Analysis",
        11: "Day 4 - Mobile data collection activities using EpiCollect5 platform",
        12: "Day 5 - Technical campus visit to KMITL Research Center",
        13: "Day 5 - Custom automation designs inside KMITL Robotics Research Lab",
        14: "Day 5 - Interacting with lab engineers and discussing smart IoT controls",
        15: "Day 6 - Transition skills in 'Campus to Corporate' lecture",
        16: "Day 6 - Reflecting on cross-cultural professional standards & Namaste values"
    };

    if (captions[i]) return captions[i];

    if (i % 7 === 0) return `Gautam Kumar Maurya (GKM) during hands-on lab experimentation and discussion (#${i})`;
    if (i % 5 === 0) return `AIT Bangkok - Technical Session & Practical Research Moment (#${i})`;
    if (i % 4 === 0) return `Global Innovation Internship - Team Collaboration & Group Activities (#${i})`;
    if (i % 3 === 0) return `Exploring Bangkok and cultural landmarks during the internship trip (#${i})`;
    return `Gautam Kumar Maurya (GKM) - Global Innovation Internship (GIIP-2026) Learning Moment (#${i})`;
}

function generateCatalog() {
    const personal = [];

    // 1. Add Mentors & Special images
    const specialImages = [
        { file: 'chutiporn Mentor AIT THAILAND (1).jpg', caption: 'Dr. Chutiporn Anutariya mentoring on Semantic Web and AI Mapping', category: 'mentors' },
        { file: 'Mentor 1 sir AIT THAILAND (2).jpg', caption: 'Interacting with AIT Faculty during Technical Onboarding', category: 'mentors' },
        { file: 'prapas Mentor AIT THAILAND (3).jpg', caption: 'Dr. Prapas explaining advanced research methodologies', category: 'mentors' },
        { file: 'Mentor 2 mam AIT THAILAND (4).jpg', caption: 'Collaborative project review with senior AIT researchers', category: 'mentors' },
        { file: 'nitin tripathi Mentor AIT THAILAND (5).jpg', caption: 'Discussion with Dr. Nitin K. Tripathi on GIS and Remote Sensing', category: 'mentors' },
        { file: 'rishi Mentor AIT THAILAND (6).jpg', caption: 'Dr. Rishi Jain leading a hands-on workshop on Prompt Engineering', category: 'mentors' },
        { file: 'manisha bose.jpg', caption: 'Interactive lecture session with Dr. Manisha Bose', category: 'mentors' },
        { file: 'culture mentor thailand.jpg', caption: 'Cross-cultural learning and community alignment session', category: 'mentors' },
        { file: 'Asian_Institute_of_Technology-Logo.png', caption: 'Asian Institute of Technology (AIT) Bangkok, Thailand', category: 'mentors' }
    ];

    specialImages.forEach(img => {
        personal.push({
            src: `assets/images/ait-bangkok/${img.file}`,
            alt: img.caption,
            category: img.category,
            caption: img.caption
        });
    });

    // 2. Add Renamed SEO-Optimized Journey & Moments Images (146 items)
    for (let i = 1; i <= 146; i++) {
        // Distribute images between 'journey' and 'gkm' categories
        const category = (i % 2 === 1) ? 'journey' : 'gkm';
        const altText = (category === 'journey') 
            ? `Gautam Kumar Maurya (GKM) - AIT Bangkok Thailand Cyber Security and AI Global Innovation Internship Moment #${i}`
            : `Gautam Kumar Maurya (GKM) - Personal moments during AIT Bangkok Thailand Internship #${i}`;

        personal.push({
            src: `assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-${i}.jpg`,
            alt: altText,
            category: category,
            caption: getAITCaption(i)
        });
    }

    allCatalogImages = personal;
}

function initGalleryFilters() {
    generateCatalog();
    initArchivePanel();
}

function initArchivePanel() {
    const grid = document.getElementById('dynamic-gallery-grid');
    const filterButtons = document.querySelectorAll('.gallery-tab-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const shuffleBtn = document.getElementById('gallery-shuffle-btn');

    if (!grid) return;

    function setArchiveCategory(category) {
        currentCategory = category;
        grid.innerHTML = '';
        renderedCount = 0;

        if (category === 'all') {
            currentImagesList = [...allCatalogImages];
        } else {
            currentImagesList = allCatalogImages.filter(img => img.category === category);
        }

        // Ensure Gautam's specific image is always 1st in the list if present
        const targetSrc = 'assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-145.jpg';
        const targetIndex = currentImagesList.findIndex(img => img.src === targetSrc);
        if (targetIndex > -1) {
            const [targetImage] = currentImagesList.splice(targetIndex, 1);
            currentImagesList.unshift(targetImage);
        }

        renderArchiveBatch();
    }

    // Direct initialization of active tab on load
    setArchiveCategory('all');

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
            const icon = shuffleBtn.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => { icon.style.transform = ''; }, 400);
            }

            currentImagesList = shuffleArray(currentImagesList);
            grid.innerHTML = '';
            renderedCount = 0;
            renderArchiveBatch();
        });
    }
}

function shuffleArray(array) {
    const arr = [...array];
    const targetSrc = 'assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-145.jpg';
    
    // Find the target image if present
    const targetIndex = arr.findIndex(img => img.src === targetSrc);
    
    if (targetIndex > -1) {
        // Extract the target image
        const [targetImage] = arr.splice(targetIndex, 1);
        
        // Shuffle the rest of the array
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        
        // Put the target image back at the front (1st position)
        arr.unshift(targetImage);
        return arr;
    } else {
        // Normal shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}

function renderArchiveBatch() {
    const grid = document.getElementById('dynamic-gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!grid) return;

    const start = renderedCount;
    const end = Math.min(start + itemsPerPage, currentImagesList.length);

    for (let i = start; i < end; i++) {
        const item = currentImagesList[i];
        const card = document.createElement('div');
        card.className = 'gallery-image-wrapper';
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-index', i);
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', (i - start) * 50);
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <img src="${item.src}" alt="${item.alt}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="image-placeholder-hud" style="display:none;">
                <i class="fas fa-image"></i>
                <span>GIIP Moment</span>
            </div>
            <div class="hud-image-overlay">
                <i class="fas fa-expand"></i>
                <span>${item.caption}</span>
            </div>
        `;

        const currentIndex = i;
        card.addEventListener('click', () => {
            activeGalleryImages = currentImagesList;
            openLightbox(currentIndex);
        });

        grid.appendChild(card);
    }

    renderedCount = end;

    if (loadMoreBtn) {
        if (renderedCount >= currentImagesList.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}
