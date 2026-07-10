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
        { type: 'output', text: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\tmodified:   src/wt2html/parser.js\n\nno changes added to commit (use "git add" and/or "git commit -a")' },
        { type: 'input', text: 'git diff' },
        { type: 'output', text: 'diff --git a/src/wt2html/parser.js b/src/wt2html/parser.js\nindex a73df21..8b23c91 100644\n--- a/src/wt2html/parser.js\n+++ b/src/wt2html/parser.js\n<span class="diff-removed">- if (node.type === "image" &amp;&amp; node.parent.type === "table") {</span>\n<span class="diff-added">+ if (node.type === "image" &amp;&amp; node.parent &amp;&amp; node.parent.type === "table") {</span>\n<span class="diff-added">+     // Safe fallback for image syntax parsed within table attribute fields</span>\n<span class="diff-added">+     return parseImageSafely(node);</span>\n<span class="diff-added">+ }</span>' },
        { type: 'input', text: 'git add . && git commit -m "fix(table-parser): prevent crash on image syntax in table cells (T431649)"' },
        { type: 'output', text: '[main c829dfa] fix(table-parser): prevent crash on image syntax in table cells (T431649)\n 1 file changed, 4 insertions(+), 1 deletion(-)' },
        { type: 'input', text: 'git review' },
        { type: 'output', text: 'Pushing to gerrit.wikimedia.org:refs/for/main...\nremote: Processing changes: ~\nremote: \nremote: New Change created: <span class="output-line success">https://gerrit.wikimedia.org/r/c/mediawiki/services/parsoid/+/987254</span> [NEW]\nremote: Task T431649 parsed from commit message and linked successfully.' },
        { type: 'output', text: '<span class="output-line info">[Wikimedia CI] Launching validation builders...</span>\n[CI Runner] running eslint... <span class="output-line success">PASSED</span>\n[CI Runner] running npm test (unit tests)... <span class="output-line success">PASSED</span>\n[CI Runner] running parsoid parser regression tests... <span class="output-line success">PASSED</span>\n[CI Runner] Verified +1 (build successful)' },
        { type: 'output', text: '<span class="output-line warning">Gerrit Reviewer (S. Penfold): "Good catch. Please extract inline checks to a helper function."</span>' },
        { type: 'input', text: 'git commit --amend --no-edit && git review' },
        { type: 'output', text: 'Pushing to gerrit.wikimedia.org:refs/for/main...\nremote: Patch Set 2 uploaded.\n[CI Runner] rerunning tests... <span class="output-line success">PASSED</span>\n[CI Runner] Verified +1' },
        { type: 'output', text: '<span class="output-line success">Gerrit Reviewer (S. Penfold): Code-Review +2</span>\n<span class="output-line success">Gerrit: Change merged into master branch! 🎉</span>\nStatus: CLOSED (Merged & Deployed to Wikipedia Production)' }
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
