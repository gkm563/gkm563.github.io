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

    // 7. Premium Spotlights & Visual Networks
    initSpotlightHover();
    initNetworkCanvas();
    initTerminalSimulator();
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

    // Recalculate and render contribution tab count badges
    updateFilterTabCounts();
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
        title: "T431649: Fix image option parsing inside tables (Parsoid Parser)",
        desc: "Investigated and proposed table layout image syntax corrections inside the Parsoid parsing service to resolve image positioning anomalies inside cells.",
        repo: "mediawiki/services/parsoid",
        type: "wikimedia",
        status: "Active / Reviewing",
        id: "T431649",
        link: "https://phabricator.wikimedia.org/T431649"
    },
    {
        title: "T431361: Show partial title matches in TextMatchEditCheck (VisualEditor)",
        desc: "Working on styling updates within VisualEditor to dynamically highlight partial regex matching strings inside the edit checking modules.",
        repo: "mediawiki/extensions/VisualEditor",
        type: "wikimedia",
        status: "Active / Reviewing",
        id: "T431361",
        link: "https://phabricator.wikimedia.org/T431361"
    },
    {
        title: "T431180: Translate special page to Ukrainian (MediaWiki Special pages)",
        desc: "Integrated localization configurations and interface keys to enable proper MediaStatistics translations on Ukrainian Wikipedia instances.",
        repo: "mediawiki/core",
        type: "translate",
        status: "Merged",
        id: "T431180",
        link: "https://phabricator.wikimedia.org/T431180"
    },
    {
        title: "T407336: Header buttons inside the quick tips dialog look inactive/disabled",
        desc: "Debugged and fixed icon styling attributes to restore contrast configurations on quick tips dialog headers in the HelpPanel UI layout.",
        repo: "mediawiki/extensions/GrowthExperiments",
        type: "wikimedia",
        status: "Active / Reviewing",
        id: "T407336",
        link: "https://phabricator.wikimedia.org/T407336"
    },
    {
        title: "T429172: Mark Experiment::setSchema as deprecated (TestKitchen)",
        desc: "Cleaned up deprecated APIs inside the TestKitchen extension, warning developers of upcoming removals and improving code hygiene.",
        repo: "mediawiki/extensions/TestKitchen",
        type: "wikimedia",
        status: "Merged",
        id: "T429172",
        link: "https://phabricator.wikimedia.org/T429172"
    },
    {
        title: "T426895: noreferences.py incorrectly inserts references template below footer templates",
        desc: "Implemented regression test coverage ensuring pywikibot correctly processes code and parser comments inside sections marked with no references.",
        repo: "pywikibot/core",
        type: "wikimedia",
        status: "Merged",
        id: "T426895",
        link: "https://phabricator.wikimedia.org/T426895"
    },
    {
        title: "T416226: Add gender support to growthexperiments-exception-no-mentored-text",
        desc: "Updated exception messaging in the GrowthExperiments mentorship onboarding tools to add proper gender conjugation and translation formats.",
        repo: "mediawiki/extensions/GrowthExperiments",
        type: "wikimedia",
        status: "Merged",
        id: "T416226",
        link: "https://phabricator.wikimedia.org/T416226"
    },
    {
        title: "style: Remove unnecessary opacity override for process dialog icons (GrowthExperiments)",
        desc: "Proposed style cleanup removing redundant CSS opacity overrides on dialog icons to preserve default OOUI visibility.",
        repo: "mediawiki/extensions/GrowthExperiments",
        type: "wikimedia",
        status: "Active / Reviewing",
        id: "Gerrit Patch",
        link: "https://gerrit.wikimedia.org/r/q/owner:gkmwin563@gmail.com"
    },
    {
        title: "T424875: Malformed URI on certain red links on page load (MinervaNeue)",
        desc: "Resolved client-side errors and page loading failures caused by malformed hash links or URI fragments inside Wikipedia's MinervaNeue mobile skin.",
        repo: "mediawiki/skins/MinervaNeue",
        type: "wikimedia",
        status: "Merged",
        id: "T424875",
        link: "https://phabricator.wikimedia.org/T424875"
    },
    {
        title: "T424124: Alias Special:MediaStats to Special:MediaStatistics (mediawiki/core)",
        desc: "Created developer and administrative alias shortcodes pointing directly to the Wikipedia MediaStatistics special page utility.",
        repo: "mediawiki/core",
        type: "wikimedia",
        status: "Merged",
        id: "T424124",
        link: "https://phabricator.wikimedia.org/T424124"
    },
    {
        title: "T424125: Alias Special:MuteUser to Special:Mute (mediawiki/core)",
        desc: "Implemented routing configuration aliases mapped to Wikipedia user muting control utilities to make site management commands cleaner.",
        repo: "mediawiki/core",
        type: "wikimedia",
        status: "Merged",
        id: "T424125",
        link: "https://phabricator.wikimedia.org/T424125"
    },
    {
        title: "T428848: Add Tsishingini (tsw) to translatewiki.net",
        desc: "Integrated Tsishingini language code and support configuration maps to translatewiki.net global translation portals.",
        repo: "translatewiki.net",
        type: "translate",
        status: "Merged",
        id: "T428848",
        link: "https://phabricator.wikimedia.org/T428848"
    },
    {
        title: "T423735: Adding Southern Uzbek (uzs) to Translatewiki",
        desc: "Added database mapping files and localization tables to fully register Southern Uzbek inside the global Translatewiki system.",
        repo: "translatewiki.net",
        type: "translate",
        status: "Merged",
        id: "T423735",
        link: "https://phabricator.wikimedia.org/T423735"
    },
    {
        title: "Add Southern Uzbek (uzs) to language-data (wikimedia/language-data)",
        desc: "Integrated configuration maps and language registry tables for Southern Uzbek (uzs) into Wikimedia's core global language dataset.",
        repo: "wikimedia/language-data",
        type: "git",
        status: "Merged",
        id: "GitHub PR #506",
        link: "https://github.com/wikimedia/language-data/pull/506"
    },
    {
        title: "Updating territory-language information from upstream automatically (wikimedia/language-data)",
        desc: "Synchronized territory-to-language metadata maps automatically from CLDR upstream data sources into the Wikimedia translation core repository.",
        repo: "wikimedia/language-data",
        type: "git",
        status: "Merged",
        id: "GitHub PR #505",
        link: "https://github.com/wikimedia/language-data/pull/505"
    },
    {
        title: "T431217: README: reconcile Node version guidance (Tiisu/SourceWiki)",
        desc: "Resolved inconsistent node environment configurations by updating the prerequites to state v18+ across the README.md documentation.",
        repo: "Tiisu/SourceWiki",
        type: "git",
        status: "Merged",
        id: "GitHub PR #2",
        link: "https://github.com/gkm563/SourceWiki"
    },
    {
        title: "T431215: Update the misleading footer text (Tiisu/SourceWiki)",
        desc: "Refined user-facing template text inside the project's footer component to display correct licensing information and links.",
        repo: "Tiisu/SourceWiki",
        type: "git",
        status: "Merged",
        id: "GitHub PR #3",
        link: "https://github.com/gkm563/SourceWiki"
    },
    {
        title: "T431216: Clean up commented-out / duplicate middleware in server.js (Tiisu/SourceWiki)",
        desc: "Improved backend performance and readability by cleaning up redundant and commented out server middleware blocks in the core Node codebase.",
        repo: "Tiisu/SourceWiki",
        type: "git",
        status: "Merged",
        id: "GitHub PR #4",
        link: "https://github.com/gkm563/SourceWiki"
    },
    {
        title: "T431210: Fix broken emoji (mojibake) in the Submission Form (Tiisu/SourceWiki)",
        desc: "Fixed rendering bug corrupting special emoji characters on form submissions by enforcing UTF-8 payload encoding headers on POST routes.",
        repo: "Tiisu/SourceWiki",
        type: "git",
        status: "Merged",
        id: "GitHub PR #5",
        link: "https://github.com/gkm563/SourceWiki"
    },
    {
        title: "fix(flight-animation): correct airplane offset-rotate from 90deg to -90deg",
        desc: "Corrected SVG offset rotation rules inside the interactive map flights tracker component to align the aircraft vector trajectory properly.",
        repo: "gkm563/gkm563.github.io",
        type: "git",
        status: "Merged",
        id: "GitHub PR #2",
        link: "https://github.com/gkm563/gkm563.github.io/pull/2"
    },
    {
        title: "Initialize Portfolio Structure & Translation Engine",
        desc: "Structured the index bento grid UI layout and loaded localized translation routing mechanisms dynamically on the browser client.",
        repo: "gkm563/gkm563.github.io",
        type: "git",
        status: "Merged",
        id: "GitHub PR #1",
        link: "https://github.com/gkm563/gkm563.github.io/pull/1"
    },
    {
        title: "Add Tsishingini (tsw) language metadata (wikimedia/language-data)",
        desc: "Integrated language profile parameters and locale mappings for Tsishingini (tsw) into Wikimedia's core global dataset.",
        repo: "wikimedia/language-data",
        type: "git",
        status: "Merged",
        id: "GitHub PR #503",
        link: "https://github.com/wikimedia/language-data/pull/503"
    },
    {
        title: "docs: add comprehensive README with features, db setup, and deployment (gkm563/uginotes)",
        desc: "Wrote exhaustive developer documentation outlining MongoDB database schemas, server configuration variables, and PM2 process manager deployment.",
        repo: "gkm563/uginotes",
        type: "git",
        status: "Merged",
        id: "GitHub PR #1",
        link: "https://github.com/gkm563/uginotes/pull/1"
    },
    {
        title: "Added complete frontend website (UDTech-India/buildx-india-website)",
        desc: "Developed and integrated responsive sections, modern sliders, and styled contact forms using HTML/CSS/JS for the BuildX India ecosystem.",
        repo: "UDTech-India/buildx-india-website",
        type: "git",
        status: "Merged",
        id: "GitHub PR #6",
        link: "https://github.com/UDTech-India/buildx-india-website/pull/6"
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
        
        let filtered;
        if (filter === 'all') {
            filtered = contributions;
        } else if (filter === 'merged') {
            filtered = contributions.filter(c => c.status === 'Merged' || c.status === 'Completed');
        } else {
            filtered = contributions.filter(c => c.type === filter);
        }

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

/* ==========================================
   Spotlight card cursor tracker
   ========================================== */
function initSpotlightHover() {
    const elements = document.querySelectorAll('.contrib-card, .step-card, .stat-card, .profile-badge-card');
    elements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================
   Canvas Network Particle Animation
   ========================================== */
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles = [];
    const maxParticles = 60;
    const connectionDist = 120;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.r = Math.random() * 2.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & Draw
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / connectionDist)})`;
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

/* ==========================================
   Interactive Terminal Simulator Console
   ========================================== */
function initTerminalSimulator() {
    const screen = document.getElementById('terminal-screen');
    const runBtn = document.getElementById('terminal-run-btn');
    const clearBtn = document.getElementById('terminal-clear-btn');
    if (!screen || !runBtn) return;

    let isRunning = false;
    let timerQueue = [];

    const simulationLines = [
        { type: 'input', text: 'git status' },
        { type: 'output', text: 'On branch master\nYour branch is up to date with \'origin/master\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\tmodified:   includes/Mentorship/MentorshipExceptions.php\n\nno changes added to commit (use "git add" and/or "git commit -a")' },
        { type: 'input', text: 'git diff' },
        { type: 'output', text: 'diff --git a/includes/Mentorship/MentorshipExceptions.php b/includes/Mentorship/MentorshipExceptions.php\nindex d8f498c..5e921a2 100644\n--- a/includes/Mentorship/MentorshipExceptions.php\n+++ b/includes/Mentorship/MentorshipExceptions.php\n<span class="diff-removed">- throw new MentorshipException( "No mentor found for user." );</span>\n<span class="diff-added">+ throw new MentorshipException( "No mentor found for user.", $genderSupport );</span>\n<span class="diff-added">+ // Added gender support exception message mapping to match localized translation profiles</span>' },
        { type: 'input', text: 'git add . && git commit -m "Add gender support to no mentored exception message"' },
        { type: 'output', text: '[master b291a24] Add gender support to no mentored exception message\n 1 file changed, 2 insertions(+), 1 deletion(-)' },
        { type: 'input', text: 'git review' },
        { type: 'output', text: 'Pushing to gerrit.wikimedia.org:refs/for/master...\nremote: Processing changes: ~\nremote: \nremote: New Change created: <span class="output-line success">https://gerrit.wikimedia.org/r/c/mediawiki/extensions/GrowthExperiments/+/912543</span> [NEW]\nremote: Gerrit review page opened successfully.' },
        { type: 'output', text: '<span class="output-line info">[Wikimedia CI] Running Jenkins automation builders...</span>\n[CI Runner] running phpunit unit tests... <span class="output-line success">PASSED</span>\n[CI Runner] running MediaWiki integration test suites... <span class="output-line success">PASSED</span>\n[CI Runner] Status: Verified +1 (Build Successful)' },
        { type: 'output', text: '<span class="output-line warning">Gerrit Reviewer (Cyndywikime): "Code looks clean. Need to add test cases inside MentorshipExceptionsTest.php."</span>' },
        { type: 'input', text: 'git commit --amend --no-edit && git review' },
        { type: 'output', text: 'Pushing to gerrit.wikimedia.org:refs/for/master...\nremote: Patch Set 2 uploaded.\n[CI Runner] running tests... <span class="output-line success">PASSED</span>\n[CI Runner] Verified +1' },
        { type: 'output', text: '<span class="output-line success">Gerrit Reviewer (Cyndywikime): Code-Review +2</span>\n<span class="output-line success">Gerrit: Change merged into master branch! 🎉</span>\nStatus: CLOSED (Merged & Deployed to Wikipedia Production)' }
    ];

    function typeCommand(text, containerEl, onDone) {
        let index = 0;
        function typeChar() {
            if (index < text.length) {
                containerEl.textContent += text.charAt(index);
                index++;
                const timeoutId = setTimeout(typeChar, 30 + Math.random() * 30);
                timerQueue.push(timeoutId);
            } else {
                if (onDone) onDone();
            }
        }
        typeChar();
    }

    function runSimulation() {
        if (isRunning) return;
        isRunning = true;
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        
        screen.innerHTML = '';
        
        let lineIndex = 0;
        
        function processNext() {
            if (lineIndex >= simulationLines.length) {
                isRunning = false;
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-play"></i> Run Simulation';
                return;
            }
            
            const item = simulationLines[lineIndex];
            const div = document.createElement('div');
            
            if (item.type === 'input') {
                div.className = 'term-line input-prompt';
                screen.appendChild(div);
                screen.scrollTo(0, screen.scrollHeight);
                
                typeCommand(item.text, div, () => {
                    lineIndex++;
                    const timeoutId = setTimeout(processNext, 600);
                    timerQueue.push(timeoutId);
                });
            } else {
                div.className = 'term-line output-line';
                div.innerHTML = item.text.replace(/\n/g, '<br>');
                screen.appendChild(div);
                screen.scrollTo(0, screen.scrollHeight);
                lineIndex++;
                const timeoutId = setTimeout(processNext, 1800);
                timerQueue.push(timeoutId);
            }
        }
        
        processNext();
    }

    function clearTerminal() {
        // Clear all running timeouts
        timerQueue.forEach(id => clearTimeout(id));
        timerQueue = [];
        
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<i class="fas fa-play"></i> Run Simulation';
        
        screen.innerHTML = `
            <div class="term-line output-line">Wikimedia Gerrit Pipeline Simulator initialized.</div>
            <div class="term-line output-line">Click \'Run Simulation\' to start the patch deployment workflow...</div>
        `;
    }

    runBtn.addEventListener('click', runSimulation);
    if (clearBtn) {
        clearBtn.addEventListener('click', clearTerminal);
    }
}

/* ==========================================
   Dynamic Tab Badging and Counting
   ========================================== */
function updateFilterTabCounts() {
    const tabs = document.querySelectorAll('.contrib-tab-btn');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        const filter = tab.getAttribute('data-filter');
        let count = 0;
        if (filter === 'all') {
            count = contributions.length;
        } else if (filter === 'merged') {
            count = contributions.filter(c => c.status === 'Merged' || c.status === 'Completed').length;
        } else {
            count = contributions.filter(c => c.type === filter).length;
        }
        
        // Remove existing badge
        const oldBadge = tab.querySelector('.tab-count');
        if (oldBadge) {
            oldBadge.remove();
        }
        
        const baseText = tab.innerHTML.trim();
        tab.innerHTML = `${baseText} <span class="tab-count">${count}</span>`;
    });
}
