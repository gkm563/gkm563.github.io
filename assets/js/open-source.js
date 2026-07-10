/* ==========================================
   Open Source Contributions page logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Active Language State
    initLanguageSync();

    // 2. Setup Sticky Navigation Scroll-spy Highlight
    initScrollSpy();

    // 2.5. Sticky Header Effect
    initHeaderScroll();

    // 3. Mobile Menu Navigation (Header Toggle)
    initMobileNav();

    // 4. Render and Filter Contributions
    initContributionsArchive();

    // 5. Stats CountUp Animation on Scroll
    initStatsCountUp();
    
    // 6. Interactive Stepper Animations
    initStepperInteraction();
});

/* ==========================================
   Language Synchronization Logic
   ========================================== */
function initLanguageSync() {
    let currentLang = localStorage.getItem('portfolio-lang') || 'en';
    applySubpageLanguage(currentLang);
    updateLanguageSwitcherUI(currentLang);
}

function applySubpageLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('portfolio-lang', lang);

    const dictionary = window.OPEN_SOURCE_TRANSLATIONS && window.OPEN_SOURCE_TRANSLATIONS[lang];
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
   Scroll-spy Navigation Day Highlighting
   ========================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.main-nav ul li a[href^="#"]');

    if (sections.length === 0 || navItems.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // Smooth scroll for nav links
    const scrollLinks = document.querySelectorAll('.main-nav ul li a[href^="#"], .hero-scroll-prompt');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSel = link.getAttribute('href');
            const targetEl = document.querySelector(targetSel);

            if (targetEl) {
                const offset = 100;
                const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initHeaderScroll() {
    const mainHeader = document.getElementById('main-header');
    if (!mainHeader) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });
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
   Contributions rendering and filtering logic
   ========================================== */
const contributions = [
    {
        title: "T431649: Error parsing image syntax in table (Parsoid Parser)",
        desc: "Fixed a critical parsing bug in MediaWiki's Parsoid parsing engine where certain image syntax configurations inside complex wikitext tables caused parser crashes.",
        repo: "mediawiki/services/parsoid",
        type: "wikimedia",
        status: "Merged & Deployed",
        id: "T431649",
        link: "https://phabricator.wikimedia.org/T431649"
    },
    {
        title: "T426338: Accessors for WFFunctionCall internals (WikiFunctions)",
        desc: "Implemented clean accessor methods for internal states and properties of WFFunctionCall within the WikiFunctions codebase, supporting modular extension access.",
        repo: "mediawiki/extensions/WikiFunctions",
        type: "wikimedia",
        status: "Merged & Deployed",
        id: "T426338",
        link: "https://phabricator.wikimedia.org/T426338"
    },
    {
        title: "T431180: Special page localization to Ukrainian",
        desc: "Added translation assets and configured interface support for MediaWiki special page translation into Ukrainian, boosting internationalization reach.",
        repo: "translatewiki.net",
        type: "translate",
        status: "Merged & Deployed",
        id: "T431180",
        link: "https://phabricator.wikimedia.org/T431180"
    },
    {
        title: "T423735: Adding Southern Uzbek (uzs) to Translatewiki",
        desc: "Integrated the Southern Uzbek language code and configuration mappings to the global Translatewiki system, enabling translation pipelines for the language.",
        repo: "translatewiki.net",
        type: "translate",
        status: "Merged & Deployed",
        id: "T423735",
        link: "https://phabricator.wikimedia.org/T423735"
    },
    {
        title: "MediaWiki Core Parser improvements & localization scripts",
        desc: "Contributed various configuration patches and localization script setups to streamline the parsing of multi-language wikitext variables.",
        repo: "mediawiki/core",
        type: "wikimedia",
        status: "Merged",
        id: "Gerrit Patchset",
        link: "https://gerrit.wikimedia.org/r/q/owner:gkmwin563@gmail.com"
    },
    {
        title: "WikiFunctions Automation & CI/CD runner pipelines",
        desc: "Configured automated test runners and validation scripts inside the WikiFunctions extension for robust Continuous Integration checks.",
        repo: "gitlab.com/gkm563",
        type: "git",
        status: "Completed",
        id: "GitLab CI",
        link: "https://gitlab.com/gkm563"
    },
    {
        title: "Custom Developer Tools and Open-Source Automation Shell Scripts",
        desc: "Created and open-sourced automation scripts for setting up local MediaWiki instances and automating patch submissions via Git review.",
        repo: "github.com/gkm563",
        type: "git",
        status: "Active",
        id: "GitHub Repo",
        link: "https://github.com/gkm563"
    }
];

function initContributionsArchive() {
    const grid = document.getElementById('contributions-grid');
    const filterBtns = document.querySelectorAll('.contrib-tab-btn');
    if (!grid) return;

    function renderContributions(filter = 'all') {
        grid.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? contributions 
            : contributions.filter(c => c.type === filter);

        filtered.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'contrib-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', index * 100);
            
            let iconClass = 'fa-code-branch';
            if (item.type === 'wikimedia') iconClass = 'fa-wikipedia-w';
            else if (item.type === 'translate') iconClass = 'fa-language';
            else if (item.repo.includes('github')) iconClass = 'fa-github';
            else if (item.repo.includes('gitlab')) iconClass = 'fa-gitlab';

            card.innerHTML = `
                <div class="contrib-card-glow"></div>
                <div class="contrib-card-header">
                    <span class="contrib-badge badge-${item.type}">
                        <i class="fas ${iconClass}"></i> ${item.repo}
                    </span>
                    <span class="contrib-status">${item.status}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="contrib-card-footer">
                    <span class="contrib-id"><i class="fas fa-hashtag"></i> ${item.id}</span>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="contrib-link">
                        View Details <i class="fas fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });

        // Initialize vanilla tilt on cards if available
        if (window.VanillaTilt) {
            VanillaTilt.init(document.querySelectorAll('.contrib-card'), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.15
            });
        }
    }

    renderContributions('all');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderContributions(filter);
        });
    });
}

/* ==========================================
   Stats CountUp Animation
   ========================================== */
function initStatsCountUp() {
    const statsSection = document.getElementById('stats');
    const numbers = document.querySelectorAll('.stat-number');
    if (!statsSection || numbers.length === 0) return;

    let animated = false;

    const countUp = () => {
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 1500; // ms
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const current = Math.floor(easeProgress * target);
                
                num.textContent = current + (num.getAttribute('data-target').includes('+') || target > 100 ? '+' : '');
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    num.textContent = num.getAttribute('data-target');
                }
            };
            
            requestAnimationFrame(animate);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                countUp();
                animated = true;
            }
        });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
}

/* ==========================================
   Stepper Pipeline Interactive Highlights
   ========================================== */
function initStepperInteraction() {
    const steps = document.querySelectorAll('.step-card');
    if (steps.length === 0) return;

    steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            steps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
        });
    });
}
