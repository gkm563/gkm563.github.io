// Gautam Kumar Maurya's Portfolio Engine
// Consolidated interactive elements, voice narrator player, and AI twin chatbot

// === PORTFOLIO GLOBAL STATE ===
let currentLang = 'en';

// === BILINGUAL TRANSLATION SWITCHER ===
function setLanguage(lang) {
    lang = 'en';
    currentLang = 'en';
    localStorage.setItem('portfolio-lang', 'en');
    
    // Toggle active class on language toggle buttons
    const btnEn = document.getElementById('lang-btn-en');
    const btnHi = document.getElementById('lang-btn-hi');
    const slider = document.querySelector('.lang-switch-slider');
    if (btnEn && btnHi) {
        if (lang === 'hi') {
            btnEn.classList.remove('active');
            btnHi.classList.add('active');
            document.documentElement.lang = 'hi';
            if (slider) {
                slider.style.transform = 'translateX(100%)';
                slider.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))';
            }
        } else {
            btnEn.classList.add('active');
            btnHi.classList.remove('active');
            document.documentElement.lang = 'en';
            if (slider) {
                slider.style.transform = 'translateX(0)';
                slider.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            }
        }
    }

    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = window.PORTFOLIO_TRANSLATIONS[lang] && window.PORTFOLIO_TRANSLATIONS[lang][key];
        if (translation !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });

    // Refresh Typed.js subtitle strings
    refreshTypedSubtitles(lang);

    // Refresh Wikipedia articles
    renderWikiArticles();
    
    // Refresh GitHub repositories
    if (typeof renderGithubRepos === 'function') {
        renderGithubRepos();
    }
    
    // Reset contact form status message to clear previous state messages
    const formStatus = document.getElementById('form-status');
    if (formStatus) formStatus.innerHTML = '';
}

function changeLanguage(lang) {
    setLanguage(lang);
}

// Expose functions globally for HTML onclick handlers
window.changeLanguage = changeLanguage;
window.setLanguage = setLanguage;

function refreshTypedSubtitles(lang) {
    if (window.typedInstance) {
        window.typedInstance.destroy();
    }
    
    const strings = window.PORTFOLIO_TRANSLATIONS[lang] && window.PORTFOLIO_TRANSLATIONS[lang].hero_typed_strings;
    if (strings && document.getElementById('typed-subtitle')) {
        window.typedInstance = new Typed('#typed-subtitle', {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 1500,
            loop: true,
            contentType: null
        });
    }
}

// === LINKEDIN HIGHLIGHTS LOGIC ===
// Categorize posts automatically using keywords/hashtags
function categorizePost(text) {
    const lower = (text || '').toLowerCase();
    if (lower.includes('hackathon') || lower.includes('buildx') || lower.includes('sprint') || lower.includes('compete') || lower.includes('quiz') || lower.includes('code jam')) {
        return 'Hackathons';
    }
    if (lower.includes('earn') || lower.includes('freelance') || lower.includes('vindhya millets') || lower.includes('millets') || lower.includes('rooms') || lower.includes('prayagrajrooms') || lower.includes('startup') || lower.includes('co-founded') || lower.includes('founder') || lower.includes('founded') || lower.includes('founder')) {
        return 'Earnings';
    }
    if (lower.includes('rank') || lower.includes('won') || lower.includes('winner') || lower.includes('1st') || lower.includes('topper') || lower.includes('aktu') || lower.includes('board') || lower.includes('academic') || lower.includes('distinction') || lower.includes('exam') || lower.includes('honored') || lower.includes('percentage') || lower.includes('marksheet')) {
        return 'Achievements';
    }
    if (lower.includes('event') || lower.includes('meetup') || lower.includes('session') || lower.includes('organized') || lower.includes('attended') || lower.includes('speaker') || lower.includes('gdg') || lower.includes('gfg') || lower.includes('ambassador') || lower.includes('talk') || lower.includes('hack') || lower.includes('coordinator') || lower.includes('leadership')) {
        return 'Events';
    }
    return 'Behind the Scenes';
}


// Fetch live public repositories from GitHub API
// === GITHUB REPOSITORIES STATE AND ACTIONS ===
let githubReposData = [];
let githubLangFilter = 'All';
let githubSearchVal = '';
let githubVisibleLimit = 6;

function formatGithubDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-US', {
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return '';
    }
}

function getLanguageClass(lang) {
    if (!lang) return 'other';
    const lower = lang.toLowerCase();
    if (lower.includes('python')) return 'python';
    if (lower.includes('javascript')) return 'javascript';
    if (lower.includes('typescript')) return 'typescript';
    if (lower.includes('html') || lower.includes('css')) return 'htmlcss';
    if (lower.includes('php')) return 'php';
    return 'other';
}

function getLanguageIcon(lang) {
    if (!lang) return '<i class="fas fa-code"></i>';
    const lower = lang.toLowerCase();
    if (lower === 'typescript') return '<i class="fab fa-js" style="color: #3178c6;"></i>';
    if (lower === 'javascript') return '<i class="fab fa-js" style="color: #f7df1e;"></i>';
    if (lower === 'html') return '<i class="fab fa-html5" style="color: #e34f26;"></i>';
    if (lower === 'css') return '<i class="fab fa-css3-alt" style="color: #1572b6;"></i>';
    if (lower === 'php') return '<i class="fab fa-php" style="color: #777bb4;"></i>';
    if (lower === 'python') return '<i class="fab fa-python" style="color: #3776ab;"></i>';
    return '<i class="fas fa-code"></i>';
}

function filterReposData() {
    return githubReposData.filter(repo => {
        let langMatch = true;
        if (githubLangFilter !== 'All') {
            const repoLang = (repo.language || '').toLowerCase();
            if (githubLangFilter === 'Python') {
                langMatch = repoLang.includes('python');
            } else if (githubLangFilter === 'JavaScript') {
                langMatch = repoLang.includes('javascript');
            } else if (githubLangFilter === 'TypeScript') {
                langMatch = repoLang.includes('typescript');
            } else if (githubLangFilter === 'HTMLCSS') {
                langMatch = repoLang.includes('html') || repoLang.includes('css');
            } else if (githubLangFilter === 'Other') {
                langMatch = !repoLang.includes('python') && 
                            !repoLang.includes('javascript') && 
                            !repoLang.includes('typescript') && 
                            !repoLang.includes('html') && 
                            !repoLang.includes('css');
            }
        }

        let searchMatch = true;
        if (githubSearchVal.trim() !== '') {
            const query = githubSearchVal.toLowerCase();
            const name = (repo.name || '').toLowerCase();
            const desc = (repo.description || '').toLowerCase();
            searchMatch = name.includes(query) || desc.includes(query);
        }

        return langMatch && searchMatch;
    });
}

function renderGithubRepos() {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    container.innerHTML = '';
    const filtered = filterReposData();

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem; width: 100%;">${currentLang === 'hi' ? 'कोई रिपॉजिटरी नहीं मिली।' : 'No matching repositories found.'}</p>`;
        
        const paginationContainer = document.getElementById('github-pagination-container');
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }

    const sliced = filtered.slice(0, githubVisibleLimit);

    sliced.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card github-repo-card';
        card.setAttribute('data-aos', 'fade-up');
        
        const langIcon = getLanguageIcon(repo.language);
        const langClass = getLanguageClass(repo.language);
        const desc = repo.description || (currentLang === 'hi' ? 'कोई विवरण उपलब्ध नहीं है।' : 'No description provided. Click below to view the codebase on GitHub.');
        const formattedDate = formatGithubDate(repo.updated_at);

        card.innerHTML = `
            <div class="project-content" style="display: flex; flex-direction: column; height: 100%;">
                <div class="project-icon">${langIcon}</div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-color); text-align: left;">${repo.name}</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary); flex-grow: 1; margin-bottom: 1.5rem; line-height: 1.6; text-align: left;">${desc}</p>
                
                <div class="github-repo-stats" style="margin-bottom: 1rem;">
                    <span class="github-repo-stat stars" title="${currentLang === 'hi' ? 'तारे' : 'Stars'}"><i class="fas fa-star"></i> ${repo.stargazers_count || 0}</span>
                    <span class="github-repo-stat forks" title="${currentLang === 'hi' ? 'फोर्क्स' : 'Forks'}"><i class="fas fa-code-branch"></i> ${repo.forks_count || 0}</span>
                    ${formattedDate ? `<span class="github-repo-stat updated" title="${currentLang === 'hi' ? 'अंतिम अपडेट' : 'Last Updated'}"><i class="fas fa-clock"></i> ${formattedDate}</span>` : ''}
                </div>

                <div class="project-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                    <div class="tech-tags">
                        <span class="tech-tag lang-badge ${langClass}">${repo.language || 'Code'}</span>
                    </div>
                    <a href="${repo.html_url}" class="project-link" target="_blank" style="font-size: 0.9rem; font-weight: 600; text-decoration: none; color: var(--secondary-color);">${currentLang === 'hi' ? 'रिपो लिंक' : 'Repo Link'} <i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const paginationContainer = document.getElementById('github-pagination-container');
    const toggleBtn = document.getElementById('github-toggle-btn');
    const toggleBtnText = document.getElementById('github-toggle-btn-text');
    const toggleBtnIcon = document.getElementById('github-toggle-btn-icon');

    if (paginationContainer && toggleBtn && toggleBtnText && toggleBtnIcon) {
        if (filtered.length > 6) {
            paginationContainer.style.display = 'block';
            if (githubVisibleLimit >= filtered.length) {
                toggleBtnText.setAttribute('data-translate', 'github_show_less');
                toggleBtnText.innerText = currentLang === 'hi' ? 'कम दिखाएं' : 'Show Less';
                toggleBtnIcon.className = 'fas fa-chevron-up';
            } else {
                toggleBtnText.setAttribute('data-translate', 'github_show_more');
                toggleBtnText.innerText = currentLang === 'hi' ? 'और रिपॉजिटरी दिखाएं' : 'Show More Repositories';
                toggleBtnIcon.className = 'fas fa-chevron-down';
            }
        } else {
            paginationContainer.style.display = 'none';
        }
    }

    if (window.cacheSectionOffsets) {
        setTimeout(window.cacheSectionOffsets, 100);
    }
}

function handleGithubSearch(value) {
    githubSearchVal = value;
    githubVisibleLimit = 6;
    renderGithubRepos();
}

function filterGithubLanguage(lang) {
    githubLangFilter = lang;
    githubVisibleLimit = 6;
    
    const tabs = document.querySelectorAll('#github-language-tabs .github-filter-tab');
    tabs.forEach(tab => {
        const onclickAttr = tab.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${lang}'`) || onclickAttr.includes(`"${lang}"`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    renderGithubRepos();
}

function toggleGithubReposVisibility() {
    const filtered = filterReposData();
    if (githubVisibleLimit >= filtered.length) {
        githubVisibleLimit = 6;
    } else {
        githubVisibleLimit = filtered.length;
    }
    renderGithubRepos();
}

window.handleGithubSearch = handleGithubSearch;
window.filterGithubLanguage = filterGithubLanguage;
window.toggleGithubReposVisibility = toggleGithubReposVisibility;

async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    container.innerHTML = Array(3).fill().map(() => `
        <div class="skeleton-card">
            <div class="skeleton-avatar" style="border-radius: 8px;"></div>
            <div class="skeleton-line heading"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line medium"></div>
            <div style="display: flex; justify-content: space-between; margin-top: auto; padding-top: 1rem; width: 100%;">
                <div class="skeleton-line short" style="height: 12px;"></div>
                <div class="skeleton-line short" style="height: 12px; width: 20%;"></div>
            </div>
        </div>
    `).join('');

    // --- SessionStorage cache: avoid re-fetching on every page load ---
    const CACHE_KEY = 'gkm_github_repos';
    const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
                githubReposData = data;
                renderGithubRepos();
                return;
            }
        }
    } catch (_) { /* ignore cache read errors */ }

    // --- Fetch with timeout ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
        const res = await fetch('https://api.github.com/users/gkm563/repos?sort=updated&per_page=30', {
            signal: controller.signal,
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const repos = await res.json();

        githubReposData = repos.filter(repo => !repo.fork && repo.name !== 'gkm563');

        // Cache the result
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: githubReposData, timestamp: Date.now() }));
        } catch (_) { /* ignore cache write errors */ }

        renderGithubRepos();
    } catch (err) {
        clearTimeout(timeoutId);
        // Silently fall back to static data — no error noise for the user
        githubReposData = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.githubRepos) ? window.PORTFOLIO_DATA.githubRepos : [];
        renderGithubRepos();
    }
}

// === VOICE NARRATOR LOGIC ===
// === 3D CYBERNETIC AVATAR ENGINE ===
// === 3D CYBERNETIC AVATAR ENGINE ===
let isAvatarSpeaking = false;
let activeAvatarScenes = [];
let targetMouseX = 0;
let targetMouseY = 0;
let faceTextureShared = null; // cache texture
let wasSpeaking = false;

function initThreeDAvatar() {
    const toggleCanvas = document.getElementById('avatar-toggle-canvas');
    const chatCanvas = document.getElementById('avatar-chat-canvas');

    activeAvatarScenes = []; // Reset list

    // Crop face from photo and load as texture
    createCroppedFaceTexture((texture) => {
        faceTextureShared = texture;
        // Apply texture to any already initialized materials
        activeAvatarScenes.forEach(inst => {
            if (inst.faceMesh && inst.faceMesh.material) {
                inst.faceMesh.material.map = texture;
                inst.faceMesh.material.needsUpdate = true;
            }
        });
    });

    if (toggleCanvas) {
        setupSingleAvatarInstance(toggleCanvas, { size: 60, zoom: 2.2, rotateSpeed: 0.01 });
    }
    if (chatCanvas) {
        setupSingleAvatarInstance(chatCanvas, { size: 36, zoom: 2.0, rotateSpeed: 0.008 });
    }

    // Capture cursor coordinate offsets
    window.removeEventListener('mousemove', onAvatarMouseMove);
    window.addEventListener('mousemove', onAvatarMouseMove);
    
    // Start animation loop
    animateThreeDAvatars();
}

function onAvatarMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}

// Cropping canvas helper
function createCroppedFaceTexture(callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "assets/images/profile/Gautam_Kumar_Maurya.jpg";
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 512;
        canvas.width = size;
        canvas.height = size;

        // Crop coordinates centered on Gautam's face in the photo
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        
        // Estimating face location in 1:1 image: Center X=0.50, Y=0.285, Radius=0.18
        const faceX = w * 0.50;
        const faceY = h * 0.285;
        const faceRadius = w * 0.18;

        ctx.clearRect(0, 0, size, size);

        // Circular feather mask
        const grad = ctx.createRadialGradient(size/2, size/2, size/2 * 0.72, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.fill();

        // Overlay photo
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(
            img,
            faceX - faceRadius,
            faceY - faceRadius,
            faceRadius * 2,
            faceRadius * 2,
            0,
            0,
            size,
            size
        );
        
        ctx.globalCompositeOperation = 'source-over';

        const texture = new THREE.CanvasTexture(canvas);
        callback(texture);
    };
    img.onerror = () => {
        console.error("Failed to load Gautam's photo for 3D model mapping.");
    };
}

function setupSingleAvatarInstance(canvas, options) {
    if (!window.THREE) return;
    
    const width = options.size || 60;
    const height = options.size || 60;

    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = options.zoom || 2.5;

    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Sculpted Face Plane Geometry (16x16 grid coordinates)
    const faceGeom = new THREE.PlaneGeometry(1.2, 1.2, 16, 16);
    const pos = faceGeom.attributes.position;
    
    // Mathematically sculpt 3D depth details
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        
        let z = 0;
        
        // Round face edges backwards
        z += 0.22 * (1.0 - (x * x) / (0.6 * 0.6));
        
        // Nose bridge ridge
        const noseWidth = 0.14;
        if (Math.abs(x) < noseWidth && y > -0.2 && y < 0.26) {
            const noseFactor = 1.0 - Math.abs(x) / noseWidth;
            const noseTip = 1.0 - Math.abs(y - 0.05) / 0.25;
            z += 0.15 * noseFactor * Math.max(0, noseTip);
        }
        
        // Cheeks rounding
        if (Math.abs(x) > 0.2 && Math.abs(x) < 0.5 && y > -0.15 && y < 0.15) {
            z += 0.04 * (1.0 - Math.abs(y) / 0.15);
        }
        
        // Chin protrusion
        if (Math.abs(x) < 0.18 && y < -0.3 && y > -0.5) {
            const chinFactor = 1.0 - Math.abs(x) / 0.18;
            z += 0.04 * chinFactor;
        }

        // Eye socket depressions
        if (Math.abs(y - 0.16) < 0.08 && Math.abs(x) > 0.16 && Math.abs(x) < 0.36) {
            z -= 0.03;
        }
        
        pos.setZ(i, z);
    }
    
    // Save sculpted coordinates as base positions
    const sculptedPositions = new Float32Array(pos.array);
    faceGeom.computeVertexNormals();

    // Material with photo mapping
    const faceMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
        map: faceTextureShared || null
    });
    
    const faceMesh = new THREE.Mesh(faceGeom, faceMat);
    avatarGroup.add(faceMesh);

    // Glowing cybernetic wireframe grid overlay
    const wireGeom = faceGeom.clone();
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    avatarGroup.add(wireMesh);

    // Tilted scan loop scanner ring
    const ringGeom = new THREE.TorusGeometry(1.05, 0.015, 8, 36);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const scannerRing = new THREE.Mesh(ringGeom, ringMat);
    scannerRing.rotation.x = Math.PI / 2.3;
    avatarGroup.add(scannerRing);

    // Floating orbital neon particles
    const particleCount = 25;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 2.8;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.0 - 0.5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xec4899,
        size: 0.035,
        transparent: true,
        opacity: 0.7
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    avatarGroup.add(particles);

    activeAvatarScenes.push({
        canvas,
        renderer,
        scene,
        camera,
        avatarGroup,
        faceMesh,
        faceGeom,
        wireMesh,
        wireGeom,
        sculptedPositions,
        scannerRing,
        options,
        currentMouseX: 0,
        currentMouseY: 0
    });
}

// Single animation loop tracker to prevent stacking
let avatarAnimFrameId = null;
function animateThreeDAvatars() {
    if (avatarAnimFrameId) cancelAnimationFrame(avatarAnimFrameId);
    
    function renderLoop() {
        avatarAnimFrameId = requestAnimationFrame(renderLoop);

        const chatWindow = document.getElementById('chat-window');
        const isChatActive = chatWindow ? chatWindow.classList.contains('active') : false;
        const time = Date.now() * 0.001;        // Perform mouth vertex displacement lip-sync calculations
        if (isAvatarSpeaking) {
            wasSpeaking = true;
            const volSim = Math.abs(Math.sin(time * 25)) * 0.75 + Math.random() * 0.25;
            const mouthCenterY = -0.22;
            const mouthRadius = 0.20;

            activeAvatarScenes.forEach(inst => {
                if (!inst.faceGeom) return;
                const pos = inst.faceGeom.attributes.position;

                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i);
                    const y = pos.getY(i);
                    const baseSlot = i * 3;
                    const sculptedY = inst.sculptedPositions[baseSlot + 1];
                    const sculptedZ = inst.sculptedPositions[baseSlot + 2];

                    const dx = x;
                    const dy = y - mouthCenterY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouthRadius) {
                        const factor = (1.0 - dist / mouthRadius) * volSim * 0.08;
                        // Displace Y down (jaw open), Z forward (lips speak)
                        pos.setY(i, sculptedY - factor);
                        pos.setZ(i, sculptedZ + factor * 0.5);
                    } else {
                        pos.setY(i, sculptedY);
                        pos.setZ(i, sculptedZ);
                    }
                }
                pos.needsUpdate = true;
                inst.faceGeom.computeVertexNormals();
                
                // Sync grid overlay
                if (inst.wireGeom) {
                    const wPos = inst.wireGeom.attributes.position;
                    for (let i = 0; i < wPos.count; i++) {
                        wPos.setY(i, pos.getY(i));
                        wPos.setZ(i, pos.getZ(i));
                    }
                    wPos.needsUpdate = true;
                    inst.wireGeom.computeVertexNormals();
                }
            });
        } else if (wasSpeaking) {
            wasSpeaking = false;
            // Reset coordinates exactly once when speaking stops to prevent idle CPU load
            activeAvatarScenes.forEach(inst => {
                if (!inst.faceGeom) return;
                const pos = inst.faceGeom.attributes.position;
                for (let i = 0; i < pos.count; i++) {
                    const baseSlot = i * 3;
                    pos.setY(i, inst.sculptedPositions[baseSlot + 1]);
                    pos.setZ(i, inst.sculptedPositions[baseSlot + 2]);
                }
                pos.needsUpdate = true;
                inst.faceGeom.computeVertexNormals();
                
                if (inst.wireGeom) {
                    const wPos = inst.wireGeom.attributes.position;
                    for (let i = 0; i < wPos.count; i++) {
                        const baseSlot = i * 3;
                        wPos.setY(i, inst.sculptedPositions[baseSlot + 1]);
                        wPos.setZ(i, inst.sculptedPositions[baseSlot + 2]);
                    }
                    wPos.needsUpdate = true;
                    inst.wireGeom.computeVertexNormals();
                }
            });
        }

        activeAvatarScenes.forEach(inst => {
            const isToggleCanvas = inst.canvas.id === 'avatar-toggle-canvas';
            
            // Performance throttle: don't render hidden elements
            if (isToggleCanvas && isChatActive) return;
            if (!isToggleCanvas && !isChatActive) return;

            // Rotate scanner ring
            inst.scannerRing.rotation.z += 0.015;

            // Interpolate look-at cursor
            inst.currentMouseX += (targetMouseX - inst.currentMouseX) * 0.08;
            inst.currentMouseY += (targetMouseY - inst.currentMouseY) * 0.08;

            // Apply rotation matrices
            inst.avatarGroup.rotation.y = inst.currentMouseX * 0.35 + (time * 0.1);
            inst.avatarGroup.rotation.x = -inst.currentMouseY * 0.22;

            // Jitter face slightly when speaking
            if (isAvatarSpeaking) {
                const talkShift = Math.sin(time * 12) * 0.5 + 0.5;
                inst.wireMesh.material.color.setHSL(0.55 + talkShift * 0.15, 0.9, 0.5);
            } else {
                inst.wireMesh.material.color.setHex(0x0ea5e9);
            }

            inst.renderer.render(inst.scene, inst.camera);
        });
    }
    
    renderLoop();
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE 3D TECH UNIVERSE (Hero Background)
═══════════════════════════════════════════════════════ */
function initHero3DUniverse() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    const parent = canvas.parentElement;
    let width = parent.clientWidth;
    let height = parent.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5); // Neon Cyan
    dirLight1.position.set(5, 5, 2);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.5); // Neon Purple
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const group = new THREE.Group();
    scene.add(group);

    // Shared materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.8 });

    // 1. MACBOOK (Laptop)
    const laptopGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), bodyMat);
    baseMesh.position.y = -0.2;
    laptopGroup.add(baseMesh);
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.04), bodyMat);
    lidMesh.position.set(0, 0.15, -0.38);
    lidMesh.rotation.x = -0.15;
    laptopGroup.add(lidMesh);
    const innerScreen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.01), screenMat);
    innerScreen.position.set(0, 0.15, -0.35);
    innerScreen.rotation.x = -0.15;
    laptopGroup.add(innerScreen);
    laptopGroup.position.set(-2.8, 1.2, -1);
    group.add(laptopGroup);

    // 2. MECHANICAL KEYBOARD
    const keyboardGroup = new THREE.Group();
    const keybBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.3), bodyMat);
    keyboardGroup.add(keybBase);
    const keybPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.02, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 })
    );
    keybPlate.position.y = 0.03;
    keyboardGroup.add(keybPlate);
    keyboardGroup.position.set(-1.8, 0.5, -1.2);
    group.add(keyboardGroup);

    // 3. MONITOR
    const monitorGroup = new THREE.Group();
    const standMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), bodyMat);
    standMesh.position.y = -0.3;
    monitorGroup.add(standMesh);
    const monitorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 12), bodyMat);
    monitorBase.position.y = -0.52;
    monitorGroup.add(monitorBase);
    const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.72, 0.05), bodyMat);
    monitorGroup.add(monitorScreen);
    const monitorFace = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.64, 0.01), screenMat);
    monitorFace.position.z = 0.03;
    monitorGroup.add(monitorFace);
    monitorGroup.position.set(-1.8, 2.0, -1.5);
    group.add(monitorGroup);

    // 4. DATABASE CYLINDER
    const dbGroup = new THREE.Group();
    const dbMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.9, roughness: 0.15 });
    for (let i = 0; i < 3; i++) {
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.18, 16), dbMat);
        seg.position.y = (i - 1) * 0.24;
        dbGroup.add(seg);
    }
    dbGroup.position.set(2.8, 1.2, -1);
    group.add(dbGroup);

    // 5. SERVER RACK
    const serverGroup = new THREE.Group();
    const serverMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const serverChassis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), serverMat);
    serverGroup.add(serverChassis);
    const ledMatOn = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledMatOff = new THREE.MeshBasicMaterial({ color: 0x064e3b });
    const leds = [];
    for (let i = 0; i < 3; i++) {
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledMatOn);
        led.position.set(0.12, 0.2 - (i * 0.18), 0.26);
        serverGroup.add(led);
        leds.push(led);
    }
    serverGroup.position.set(-2.8, -1.2, -1);
    group.add(serverGroup);

    // 6. GIT BRANCH
    const gitGroup = new THREE.Group();
    const gitMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.2 });
    const node1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), gitMat);
    node1.position.set(-0.25, 0.2, 0);
    const node2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), gitMat);
    node2.position.set(0.25, 0.2, 0);
    const node3 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), gitMat);
    node3.position.set(0, -0.2, 0);
    gitGroup.add(node1, node2, node3);
    gitGroup.position.set(1.9, 0, -1);
    group.add(gitGroup);

    // 7. CLOUD
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9, transparent: true, opacity: 0.8 });
    const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), cloudMat);
    const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), cloudMat);
    s2.position.set(-0.3, -0.05, 0);
    const s3 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), cloudMat);
    s3.position.set(0.3, -0.05, 0);
    cloudGroup.add(s1, s2, s3);
    cloudGroup.position.set(-1.9, 0, -1);
    group.add(cloudGroup);

    // 8. AI CHIP
    const chipGroup = new THREE.Group();
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.05), boardMat);
    chipGroup.add(board);
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.08), goldMat);
    chipGroup.add(core);
    chipGroup.position.set(2.8, -1.2, -1);
    group.add(chipGroup);

    // 9. CUBE
    const cubeMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1, transmission: 0.6 });
    const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), cubeMat);
    cube1.position.set(-1.2, 1.8, -1.5);
    const cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), cubeMat);
    cube2.position.set(1.2, -1.8, -1.5);
    group.add(cube1, cube2);

    // 10. WIREFRAME SPHERE
    const wireframeSphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.2, 1),
        new THREE.MeshBasicMaterial({ color: 0x334155, wireframe: true, transparent: true, opacity: 0.15 })
    );
    wireframeSphere.position.set(0, 0, -3);
    scene.add(wireframeSphere);

    // Track mouse coordinates for subtle parallax
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Resize handler
    window.addEventListener('resize', () => {
        width = parent.clientWidth;
        height = parent.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            group.visible = false;
            renderer.clear();
            return;
        }
        group.visible = true;

        // Slow rotations
        laptopGroup.rotation.y = time * 0.04;
        laptopGroup.rotation.x = Math.sin(time * 0.2) * 0.08;
        
        keyboardGroup.rotation.y = time * 0.03;
        keyboardGroup.rotation.z = Math.cos(time * 0.25) * 0.04;

        monitorGroup.rotation.y = time * 0.035;
        monitorGroup.rotation.x = Math.sin(time * 0.15) * 0.05;

        dbGroup.rotation.y = -time * 0.045;
        dbGroup.rotation.z = Math.cos(time * 0.2) * 0.05;

        serverGroup.rotation.y = time * 0.03;
        
        chipGroup.rotation.x = Math.sin(time * 0.25) * 0.08;
        chipGroup.rotation.y = -time * 0.04;

        gitGroup.rotation.y = time * 0.05;
        cloudGroup.rotation.y = Math.sin(time * 0.15) * 0.08;

        cube1.rotation.set(time * 0.15, time * 0.1, 0);
        cube2.rotation.set(time * 0.1, time * 0.15, 0);
        wireframeSphere.rotation.y = time * 0.015;

        // Slow floating bobs
        laptopGroup.position.y = 1.2 + Math.sin(time + 1) * 0.12;
        keyboardGroup.position.y = 0.5 + Math.sin(time + 1.8) * 0.1;
        monitorGroup.position.y = 2.0 + Math.sin(time + 2.5) * 0.15;
        dbGroup.position.y = 1.2 + Math.sin(time + 2) * 0.12;
        serverGroup.position.y = -1.2 + Math.sin(time + 3) * 0.12;
        chipGroup.position.y = -1.2 + Math.sin(time + 4) * 0.12;
        gitGroup.position.y = Math.sin(time * 0.8) * 0.08;
        cloudGroup.position.y = Math.sin(time * 0.6) * 0.08;

        // Flash server LEDs
        leds.forEach((led, idx) => {
            const val = Math.sin(time * 8 + idx) > 0;
            led.material = val ? ledMatOn : ledMatOff;
        });

        // Parallax drift
        group.position.x += (mouseX * 0.5 - group.position.x) * 0.05;
        group.position.y += (-mouseY * 0.5 - group.position.y) * 0.05;

        renderer.render(scene, camera);
    }
    animate();
}

// === UNIFIED NARRATOR & SPEECH ENGINE ===
let avatarSpeechUtterance = null;
let isSpeaking = false; // synced with narrator

function speakAvatarText(text, onStartCallback, onEndCallback) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean text: strip HTML and clean up special characters
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/📌[\s\S]*$/gi, '').trim();
    if (!cleanText) return;

    avatarSpeechUtterance = new SpeechSynthesisUtterance(cleanText);
    const activeLang = localStorage.getItem('portfolio-lang') || 'en';
    const voices = window.speechSynthesis.getVoices();

    let selectedVoice = null;

    if (activeLang === 'hi') {
        // Target high-quality Hindi voices first
        selectedVoice = voices.find(v => 
            v.lang.startsWith('hi') || 
            v.name.toLowerCase().includes('hindi') || 
            v.name.toLowerCase().includes('madhur') ||
            v.name.toLowerCase().includes('hemant')
        );
    }

    // Default to male voices since it is Gautam's AI Twin
    if (!selectedVoice) {
        selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes('google uk english male') || 
            v.name.toLowerCase().includes('google us english male') || 
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('ravi') ||
            v.name.toLowerCase().includes('harsh') ||
            (v.name.toLowerCase().includes('male') && v.lang.startsWith('en'))
        );
    }

    // Fallbacks
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US') || v.lang.startsWith('en'));
    }

    if (selectedVoice) {
        avatarSpeechUtterance.voice = selectedVoice;
        avatarSpeechUtterance.lang = selectedVoice.lang;
    } else {
        avatarSpeechUtterance.lang = activeLang === 'hi' ? 'hi-IN' : 'en-US';
    }

    // Fine-tune tone parameters
    avatarSpeechUtterance.rate = 1.05; // slightly faster for dynamic feel
    avatarSpeechUtterance.pitch = 0.95; // slightly lower pitch for a masculine tone

    avatarSpeechUtterance.onstart = () => {
        isAvatarSpeaking = true;
        toggleVoiceWaveform(true);
        if (onStartCallback) onStartCallback();
    };

    avatarSpeechUtterance.onend = () => {
        isAvatarSpeaking = false;
        toggleVoiceWaveform(false);
        if (onEndCallback) onEndCallback();
    };

    avatarSpeechUtterance.onerror = () => {
        isAvatarSpeaking = false;
        toggleVoiceWaveform(false);
        if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(avatarSpeechUtterance);
}

function toggleVoiceWaveform(show) {
    const wave = document.getElementById('chat-voice-wave');
    if (wave) {
        if (show) wave.classList.add('active');
        else wave.classList.remove('active');
    }
}

// === VOICE NARRATOR LOGIC ===
function setupVoiceNarrator() {
    const playBtn = document.getElementById('narrator-play-btn');
    const stopBtn = document.getElementById('narrator-stop-btn');
    const pulseDot = document.getElementById('voice-pulse');
    const visualizer = document.getElementById('voice-visualizer');

    if (!playBtn) return;
    
    playBtn.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.pause();
            isSpeaking = false;
            isAvatarSpeaking = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            pulseDot.classList.remove('active');
            visualizer.classList.remove('active');
            toggleVoiceWaveform(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                isSpeaking = true;
                isAvatarSpeaking = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                pulseDot.classList.add('active');
                visualizer.classList.add('active');
                toggleVoiceWaveform(true);
            } else {
                speakNarrator();
            }
        }
    });

    stopBtn.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        isAvatarSpeaking = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        stopBtn.disabled = true;
        pulseDot.classList.remove('active');
        visualizer.classList.remove('active');
        toggleVoiceWaveform(false);
    });

    function speakNarrator() {
        const activeLang = localStorage.getItem('portfolio-lang') || 'en';
        const scriptText = window.PORTFOLIO_TRANSLATIONS[activeLang].narrator_script;
        
        speakAvatarText(
            scriptText,
            () => {
                isSpeaking = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                stopBtn.disabled = false;
                pulseDot.classList.add('active');
                visualizer.classList.add('active');
            },
            () => {
                isSpeaking = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                stopBtn.disabled = true;
                pulseDot.classList.remove('active');
                visualizer.classList.remove('active');
            }
        );
    }
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
        // Force refresh 3D scenes if they exist
        if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
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

// === AI TWIN CHATBOT LOGIC ===
function setupChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');

    if (!chatToggle) return;
    
    // Inject the audio wave visualizer next to status
    const headerInfo = document.querySelector('.chat-header-info');
    if (headerInfo) {
        let wave = document.getElementById('chat-voice-wave');
        if (!wave) {
            wave = document.createElement('div');
            wave.className = 'chat-audio-wave';
            wave.id = 'chat-voice-wave';
            wave.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
            headerInfo.appendChild(wave);
        }
    }
    
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        const badge = chatToggle.querySelector('.badge');
        if (badge) badge.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    });

    // Settings drawer toggle
    const settingsBtn = document.getElementById('chat-settings-btn');
    const settingsDrawer = document.getElementById('chat-settings-drawer');
    const keyInput = document.getElementById('chat-api-key-input');
    const saveKeyBtn = document.getElementById('chat-api-key-save');
    const clearKeyBtn = document.getElementById('chat-api-key-clear');

    if (settingsBtn && settingsDrawer) {
        settingsBtn.addEventListener('click', () => {
            const isHidden = settingsDrawer.style.display === 'none' || settingsDrawer.style.display === '';
            settingsDrawer.style.display = isHidden ? 'block' : 'none';
            if (isHidden && keyInput) {
                // Load existing key
                keyInput.value = localStorage.getItem('gkm-ai-twin-key') || '';
            }
        });
    }

    if (saveKeyBtn && keyInput) {
        saveKeyBtn.addEventListener('click', () => {
            const key = keyInput.value.trim();
            if (key) {
                localStorage.setItem('gkm-ai-twin-key', key);
                alert('API Key saved successfully! Gautam\'s twin will now use your key.');
                if (settingsDrawer) settingsDrawer.style.display = 'none';
                if (window.AI_TWIN_RESET) window.AI_TWIN_RESET(); // reset conversation state
            } else {
                alert('Please enter a valid key.');
            }
        });
    }

    if (clearKeyBtn) {
        clearKeyBtn.addEventListener('click', () => {
            localStorage.removeItem('gkm-ai-twin-key');
            if (keyInput) keyInput.value = '';
            alert('API Key cleared. The twin will now use fallback responses.');
            if (settingsDrawer) settingsDrawer.style.display = 'none';
            if (window.AI_TWIN_RESET) window.AI_TWIN_RESET(); // reset conversation state
        });
    }
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble bot chat-typing-indicator';
    indicator.id = 'chat-typing';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing');
    if (indicator) indicator.remove();
}

function sendQuickMessage(text) {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    let userDisplayMessage = text;
    const activeLang = localStorage.getItem('portfolio-lang') || 'en';
    if (text === 'Tell me your story') {
        userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_story;
    } else if (text === 'Tell me about your AIT Thailand Internship') {
        userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_ait || "Thailand Internship 🇹🇭";
    } else if (text === 'Tell me about your UP Police Cybersecurity Internship') {
        userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_upp || "UP Police Internship 🚔";
    } else if (text === 'Show hackathon wins') {
        userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_wins;
    } else if (text === 'How can I collaborate?') {
        userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_collab;
    }
    
    addChatMessage(userDisplayMessage, 'user');
    showTypingIndicator();
    
    // Use Gemini-powered AI Twin if available, else fall back to keyword matcher
    if (typeof getAIResponse === 'function') {
        getAIResponse(text).then(response => {
            removeTypingIndicator();
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        }).catch(() => {
            removeTypingIndicator();
            const response = getChatResponse(text);
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        });
    } else {
        setTimeout(() => {
            removeTypingIndicator();
            const response = getChatResponse(text);
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        }, 1000);
    }
}

function handleChatSubmit(e) {
    e.preventDefault();
    const chatInput = document.getElementById('chat-user-input');
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    addChatMessage(text, 'user');
    showTypingIndicator();

    // Use Gemini-powered AI Twin if available, else fall back to keyword matcher
    if (typeof getAIResponse === 'function') {
        getAIResponse(text).then(response => {
            removeTypingIndicator();
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        }).catch(() => {
            removeTypingIndicator();
            const response = getChatResponse(text);
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        });
    } else {
        setTimeout(() => {
            removeTypingIndicator();
            const response = getChatResponse(text);
            addChatMessage(response, 'bot');
            speakAvatarText(response.replace(/<[^>]*>/g, ''));
        }, 1000);
    }
}

function getChatResponse(query) {
    const K = window.GKM_KNOWLEDGE;
    const q = query.toLowerCase();
    
    // 1. Thailand Internship
    if (q.includes('thailand') || q.includes('bangkok') || q.includes('ait') || q.includes('giip') || q.includes('thailand internship')) {
        let resp = `I completed the **Global Innovation Internship Program (GIIP-2026)** at the **Asian Institute of Technology (AIT) in Bangkok, Thailand** (28 June – 12 July 2026).<br><br>`;
        resp += `To get selected, I cleared a rigorous screening process, scoring **92% accuracy** in the Hitbullseye offline assessment at UIT, followed by a panel interview at UCER.<br><br>`;
        resp += `During the 15 days, I worked on advanced technology modules:<br>`;
        resp += `• **Prompt Engineering** and **Ubiquitous GIS** (spatial location mapping)<br>`;
        resp += `• **Exploratory Data Analysis (EDA)** and field data collection using **EpiCollect5**<br>`;
        resp += `• **QGIS** data layer mapping, **Power BI** dashboards, and cloud **CCM Systems**<br>`;
        resp += `• **Agentic AI Frameworks** under Dr. Chaklam Silpasuwanchai<br>`;
        resp += `• **UAV (Drone) Flight Planning** and photogrammetry stitching.<br><br>`;
        resp += `My final project was **BusSetu** (a transit optimization dashboard), which I presented to the AIT academic panel. It was a life-changing global research experience!`;
        resp += `<br><br>📌 **Sources:** [Thailand Internship Page](${K?.sources?.thailandInternship || './ait-global-innovation-internship.html'}) · [LinkedIn Profile](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'})`;
        return resp;
    }
    
    // 2. UP Police Internship
    if (q.includes('police') || q.includes('cyber') || q.includes('amroha') || q.includes('apcsip') || q.includes('police internship') || q.includes('up police')) {
        let resp = `I completed a 12-day **Cyber Security & Digital Forensics Internship (APCSIP-2026)** with the **Uttar Pradesh Police Cyber Crime Cell** (Amroha Cell) in June 2026.<br><br>`;
        resp += `I got in by clearing a competitive 3-stage selection: application shortlisting, and a **50-MCQ screening test** on cybersecurity, IT, and general awareness.<br><br>`;
        resp += `Here is what I worked on day-by-day:<br>`;
        resp += `• **OSINT & Recon:** Footprinting using Maltego, Shodan, and Canary Tokens.<br>`;
        resp += `• **Telecom Forensics:** Analysing Call Detail Records (CDR) and IPDR data to trace suspects.<br>`;
        resp += `• **Forensic Tools:** Studied Cellebrite UFED, MSAB XRY, and data recovery methods.<br>`;
        resp += `• **Financial Cybercrimes:** UPI fraud, SIM swapping, and banking nodal protocols.<br><br>`;
        resp += `During this program, I refined my group contribution and settlement tracker **TripSync** to comply with professional digital forensics audit trail standards.`;
        resp += `<br><br>📌 **Sources:** [UP Police Internship Page](${K?.sources?.upPoliceInternship || './up-police-internship.html'}) · [TripSync Live](${K?.sources?.tripsyncApp || 'https://tripsync-gkm.vercel.app'})`;
        return resp;
    }
    
    // 3. Hackathons & Achievements
    if (q.includes('hackathon') || q.includes('win') || q.includes('achieve') || q.includes('rank') || q.includes('award') || q.includes('first place') || q.includes('top')) {
        let resp = `I love competing in high-pressure technical environments! Here are my key wins and academic ranks:<br><br>`;
        resp += `• **AKTU University Rank 5:** Ranked 5th college-wide in my B.Tech 1st Year examinations (UIT).<br>`;
        resp += `• **Rank 1 in Data Structures:** Top-ranked student in DSA at UIT.<br>`;
        resp += `• **1st Place — WebDie (ENIGMA XIII):** Won the web development hackathon.<br>`;
        resp += `• **1st Place — WikiClub UIT Contribution Sprint:** Merged **7 core patches** to Wikipedia core systems in 1 week.<br>`;
        resp += `• **1st Place — GDG Campus Technical Quiz:** Won the Google Developer Group quiz.<br>`;
        resp += `• **Technical Team Lead — BuildX India 2026:** Designed and scaled the official portal for the hackathon.<br><br>`;
        resp += `These experiences taught me how to scale features and collaborate under tight deadlines.`;
        resp += `<br><br>📌 **Sources:** [LinkedIn Highlights](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'}) · [BuildX Code](${K?.projects?.[6]?.github || 'https://github.com/gkm563/buildx-india-website-personal'})`;
        return resp;
    }
    
    // 4. Collaboration & Contact
    if (q.includes('collaborate') || q.includes('connect') || q.includes('work') || q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach out')) {
        let resp = `I would love to collaborate, work together on projects, or discuss freelance opportunities!<br><br>`;
        resp += `Here are the best ways to reach me directly:<br>`;
        resp += `• ✉️ **Email:** [maurgk212104@gmail.com](mailto:maurgk212104@gmail.com)<br>`;
        resp += `• 💼 **LinkedIn:** [Gautam Kumar Maurya on LinkedIn](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'}) (19K+ followers)<br>`;
        resp += `• 💻 **GitHub:** [gkm563 on GitHub](${K?.sources?.github || 'https://github.com/gkm563'})<br><br>`;
        resp += `Feel free to fill out the contact form at the bottom of the page, and I will get back to you within 24 hours!`;
        resp += `<br><br>📌 **Sources:** [Portfolio Contact](#contact) · [LinkedIn Profile](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'})`;
        return resp;
    }

    // 5. PDFBAZI
    if (q.includes('pdfbazi') || q.includes('pdf bazi') || q.includes('pdf')) {
        let resp = `**PDFBAZI** is a privacy-first, client-side web application I built to edit, split, merge, compress, and watermark PDF documents.<br><br>`;
        resp += `Unlike other online tools that require uploading documents to remote servers, **PDFBAZI runs 100% locally** in your browser. No files are ever sent over the network, ensuring complete confidentiality for sensitive data.<br><br>`;
        resp += `• **Tech Stack:** Python, JavaScript, HTML5/CSS3.`;
        resp += `<br><br>📌 **Sources:** [PDFBAZI Repository](${K?.projects?.[3]?.github || 'https://github.com/gkm563/PDFBAZI'})`;
        return resp;
    }

    // 6. PrayagrajRooms
    if (q.includes('rooms') || q.includes('prayagrajrooms') || q.includes('housing') || q.includes('pg') || q.includes('hostel')) {
        let resp = `I co-founded **PrayagrajRooms** to solve the student housing crisis in Prayagraj.<br><br>`;
        resp += `Outstation B.Tech students faced high brokerage charges and false property descriptions. I built a verified direct-contact web portal where students connect with local landlords broker-free, saving them thousands of rupees.<br><br>`;
        resp += `• **Tech Stack:** HTML/CSS, JavaScript, Firebase authentication and real-time database.`;
        resp += `<br><br>📌 **Sources:** [PrayagrajRooms Site](https://prayagrajrooms.com) · [GitHub Profile](${K?.sources?.github || 'https://github.com/gkm563'})`;
        return resp;
    }

    // 7. Open Source / Wikipedia
    if (q.includes('open source') || q.includes('wikipedia') || q.includes('wikimedia') || q.includes('gerrit') || q.includes('patches') || q.includes('abstract wikipedia')) {
        let resp = `I am an active contributor to the **Wikimedia Foundation** (Wikipedia core systems) and won 1st Place in the WikiClub UIT Open Source sprint.<br><br>`;
        resp += `Here are some of my merged code patches:<br>`;
        resp += `• **Abstract Wikipedia:** Implemented getters/encapsulation in the Function Orchestrator (WFFunctionCall) — MR 684.<br>`;
        resp += `• **MinervaNeue Skin:** Added malformed URI fragment handling in TitleUtil to prevent mobile crashes.<br>`;
        resp += `• **GrowthExperiments:** Added i18n grammatical gender support for mentor messages.<br>`;
        resp += `• **MediaWiki Core:** Contributed discoverability aliases for MediaStats and MuteUser.<br><br>`;
        resp += `Contributing to production systems running globally has helped me master git-review, Gerrit, Phabricator, and rigorous code styling.`;
        resp += `<br><br>📌 **Sources:** [Open Source Journey Page](./open-source-contributions.html) · [Wikimedia Gerrit Profile](https://gerrit.wikimedia.org/r/q/owner:gkmwin563@gmail.com)`;
        return resp;
    }

    // 8. Skills
    if (q.includes('skills') || q.includes('tech') || q.includes('languages') || q.includes('frameworks') || q.includes('databases')) {
        let resp = `Here is my current technical skillset:<br><br>`;
        resp += `• **Languages:** C++, Python, JavaScript, TypeScript, PHP, SQL.<br>`;
        resp += `• **Frontend:** React.js, Next.js, HTML5/CSS3, Tailwind CSS, Three.js, AOS Animations.<br>`;
        resp += `• **Backend & DB:** Node.js, Django, PHP, MySQL, MongoDB, Firebase, PostgreSQL.<br>`;
        resp += `• **AI/ML & Cybersecurity:** LangChain, Agentic AI architectures, OpenCV, OSINT tools (Maltego, Shodan).<br>`;
        resp += `• **DevOps & Tools:** Git/GitHub, Docker, Vercel, Netlify, Gerrit, Phabricator.`;
        resp += `<br><br>📌 **Sources:** [LinkedIn Profile](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'})`;
        return resp;
    }

    // 9. Main Story / Biography
    if (q.includes('story') || q.includes('journey') || q.includes('about') || q.includes('bio') || q.includes('who are you')) {
        let resp = `I am **Gautam Kumar Maurya (GKM)**, a B.Tech CSE (Data Science) student at United Institute of Technology, Prayagraj.<br><br>`;
        resp += `I serve as **CTO at two startups (Vidnya and PrayagrajRooms)** and lead major student communities like GeeksforGeeks UIT (580+ members), Google Student Ambassadors (650+ members), and Google Developer Groups (GDG) on Campus.<br><br>`;
        resp += `Academically, I ranked **Rank 5 university-wide under AKTU** and hold Rank 1 in Data Structures at UIT. I am also an active Wikimedia open-source contributor, and recently completed two prestigious programs: a cybersecurity internship with the **Uttar Pradesh Police Cyber Cell** and a global research internship at the **Asian Institute of Technology (AIT) in Bangkok, Thailand**.<br><br>`;
        resp += `I focus on building secure, scalable, and community-driven products that solve real-world problems.`;
        resp += `<br><br>📌 **Sources:** [Portfolio Home](#hero) · [LinkedIn Profile](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'})`;
        return resp;
    }

    // Default Fallback
    let resp = `That's an interesting question! As Gautam's AI Twin, I have a copy of his main journey, but for specific technical inquiries or personal chats, it is best to email him directly at [maurgk212104@gmail.com](mailto:maurgk212104@gmail.com) or connect on [LinkedIn](${K?.sources?.linkedin || 'https://linkedin.com/in/gkm563'}).<br><br>`;
    resp += `Feel free to ask me about my **Thailand Internship**, **UP Police Internship**, **Wiki Contributions**, **Hackathons**, or co-founding **PrayagrajRooms**!`;
    resp += `<br><br>📌 **Sources:** [Portfolio Home](#hero) · [GitHub Profile](${K?.sources?.github || 'https://github.com/gkm563'})`;
    return resp;
}

// === MAIN ENGINE INITIALIZER ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize active language
    const savedLang = 'en';
    setLanguage(savedLang);

    // 1. Initial renders
    fetchGitHubRepos();
    renderWikiArticles();
    initMatrixRain();
    initThreeDAvatar();
    initHero3DUniverse();

    // Wiki Search Input handler
    const wikiSearchInput = document.getElementById('wiki-search');
    if (wikiSearchInput) {
        wikiSearchInput.addEventListener('input', (e) => {
            wikiSearchQuery = e.target.value;
            renderWikiArticles();
        });
    }


    // 2. Setup voice narrator and chatbot
    setupVoiceNarrator();
    setupChatbot();
    initThemeToggle();
    
    // Setup Profile Share Widget copy functionality
    const copyLinkBtn = document.getElementById('share-copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const shareUrl = window.location.origin + window.location.pathname;
            navigator.clipboard.writeText(shareUrl).then(() => {
                const toast = document.getElementById('share-toast');
                if (toast) {
                    toast.classList.add('active');
                    setTimeout(() => {
                        toast.classList.remove('active');
                    }, 3000);
                }
            }).catch(err => {
                console.error('Could not copy link to clipboard: ', err);
            });
        });
    }
    
    // 3. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 80,
    });

    // 4. Subtitles handled by language switcher initialization

    // 5. Hamburger toggle menu
    const hamburger = document.getElementById('hamburger');
    const navUL = document.querySelector('.main-nav ul');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (hamburger && navUL) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navUL.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navUL.classList.remove('active');
            });
        });
    }

    // 6. Glowing card cursor tracker effect with event delegation (handles dynamic cards and prevents layout thrashing)
    let activeCard = null;
    let activeCardRect = null;

    document.addEventListener('mouseover', e => {
        const card = e.target.closest('.skill-card, .project-card, .service-card, .linkedin-card');
        if (card && card !== activeCard) {
            activeCard = card;
            activeCardRect = card.getBoundingClientRect();
        }
    });

    document.addEventListener('mousemove', e => {
        if (activeCard) {
            if (!activeCardRect) {
                activeCardRect = activeCard.getBoundingClientRect();
            }
            const x = e.clientX - activeCardRect.left;
            const y = e.clientY - activeCardRect.top;
            activeCard.style.setProperty('--mouse-x', `${x}px`);
            activeCard.style.setProperty('--mouse-y', `${y}px`);
        }
    });

    document.addEventListener('mouseout', e => {
        const card = e.target.closest('.skill-card, .project-card, .service-card, .linkedin-card');
        if (card && (!e.relatedTarget || !e.relatedTarget.closest('.skill-card, .project-card, .service-card, .linkedin-card') || e.relatedTarget.closest('.skill-card, .project-card, .service-card, .linkedin-card') !== card)) {
            activeCard = null;
            activeCardRect = null;
        }
    });

    // 7. Scrolled header, Scroll Progress, Scroll Spy & Scroll-to-Top (cached offsets & passive event listener)
    const header = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const sections = document.querySelectorAll('section, .section-wrapper');

    let cachedSections = [];
    function cacheSectionOffsets() {
        cachedSections = Array.from(sections).map(section => {
            let sectionId = '';
            if (section.id) {
                sectionId = section.id;
            } else {
                const firstSec = section.querySelector('section');
                if (firstSec && firstSec.id) {
                    sectionId = firstSec.id;
                }
            }
            return {
                id: sectionId,
                top: section.offsetTop - 120, // offset for nav header height
                height: section.offsetHeight
            };
        });
    }

    // Expose cached sections update helper globally
    window.cacheSectionOffsets = cacheSectionOffsets;

    // Initial cache run
    cacheSectionOffsets();

    // Rebuild cache and update slider position on window load and debounced resize
    window.addEventListener('load', () => {
        cacheSectionOffsets();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cacheSectionOffsets();
        }, 150);
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header Scrolled Background
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress Bar
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
            const percentage = (scrollY / totalScrollHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = percentage + '%';
            }
        }

        // Scroll Spy Active Section Highlighting via cached offsets
        let currentSectionId = '';
        for (let i = 0; i < cachedSections.length; i++) {
            const sec = cachedSections[i];
            if (scrollY >= sec.top && scrollY < sec.top + sec.height) {
                currentSectionId = sec.id;
                break;
            }
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}` || (currentSectionId === 'linkedin-section' && href === '#linkedin-section')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Scroll-to-Top Button visibility
        if (scrollToTopBtn) {
            if (scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }

        // Close mobile menu if user scrolls while it's open
        if (hamburger && navUL && navUL.classList.contains('active')) {
            hamburger.classList.remove('active');
            navUL.classList.remove('active');
        }
    }, { passive: true });

    // Scroll-to-Top click handler
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Custom cursor tracker logic (Removed to restore default browser cursor pointer)

    // 9. Contact Formspree handler
    const form = document.getElementById("fs-frm");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (form && submitBtn) {
        async function handleSubmit(event) {
            event.preventDefault();
            
            submitBtn.disabled = true;
            const activeLang = localStorage.getItem('portfolio-lang') || 'en';
            const sendingText = activeLang === 'hi' ? 'भेज रहा हूँ...' : 'Sending...';
            submitBtn.innerHTML = `${sendingText} <i class="fas fa-spinner fa-spin"></i>`;
            formStatus.innerHTML = '';
            
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const successMsg = activeLang === 'hi' 
                        ? 'संदेश सफलतापूर्वक भेजा गया! धन्यवाद।' 
                        : 'Message sent successfully! Thank you.';
                    formStatus.innerHTML = `<p class="success">${successMsg}</p>`;
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = `<p class="error">${data["errors"].map(error => error["message"]).join(", ")}</p>`;
                        } else {
                            const errorMsg = activeLang === 'hi'
                                ? 'कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।'
                                : 'Something went wrong. Please try again.';
                            formStatus.innerHTML = `<p class="error">${errorMsg}</p>`;
                        }
                    });
                }
            } catch (error) {
                const errorMsg = activeLang === 'hi'
                    ? 'कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।'
                    : 'Something went wrong. Please try again.';
                formStatus.innerHTML = `<p class="error">${errorMsg}</p>`;
            } finally {
                submitBtn.disabled = false;
                const sendBtnText = window.PORTFOLIO_TRANSLATIONS[activeLang].contact_btn_email;
                submitBtn.innerHTML = `<span data-translate="contact_btn_email">${sendBtnText}</span> <i class="fas fa-paper-plane"></i>`;
            }
        }
        form.addEventListener("submit", handleSubmit);
    }

    // 10. Initialize 3D Card Parallax Tilt (vanilla-tilt)
    if (window.VanillaTilt && !('ontouchstart' in window)) {
        // Very gentle tilt for large bento cards to prevent layout overlap
        VanillaTilt.init(document.querySelectorAll('.bento-card'), {
            max: 3,              // Tamed rotation for large bento elements
            speed: 400,
            glare: true,
            'max-glare': 0.12,
            scale: 1.006,        // Minimal scale to prevent layout overlap
            perspective: 1200,   // High perspective for a subtle depth
            gyroscope: false
        });

        // Balanced tilt for standard cards
        VanillaTilt.init(document.querySelectorAll('.skill-card, .project-card, .linkedin-card, .premium-timeline-card, .os-stat-card, .os-feature-card, .os-feed-card, .about-highlight-card, .terminal-card'), {
            max: 6,              // Reduced from 10 to keep it professional
            speed: 400,
            glare: true,
            'max-glare': 0.15,
            scale: 1.01,
            perspective: 1000,
            gyroscope: false
        });

        VanillaTilt.init(document.querySelectorAll('.footer-social-links a'), {
            max: 10,             // Tamed social buttons
            speed: 300,
            glare: true,
            'max-glare': 0.3,
            scale: 1.1,
            perspective: 800,
            gyroscope: false
        });
    }

    // 9.5 Project Tabs event delegation
    document.addEventListener('click', e => {
        const tabBtn = e.target.closest('.project-tab-btn');
        if (tabBtn) {
            e.preventDefault();
            const card = tabBtn.closest('.project-card');
            if (card) {
                // Deactivate all tab buttons in this card
                card.querySelectorAll('.project-tab-btn').forEach(btn => btn.classList.remove('active'));
                // Activate clicked button
                tabBtn.classList.add('active');
                
                // Hide all tab contents in this card
                card.querySelectorAll('.project-tab-content').forEach(content => content.classList.remove('active'));
                
                // Show clicked tab content
                const tabId = tabBtn.getAttribute('data-tab');
                const targetContent = card.querySelector(`#tripsync-${tabId}`) || card.querySelector(`[id$="${tabId}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        }
    });
});

// Global WhatsApp Message redirection helper
function sendWhatsAppMessage() {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput || !emailInput || !messageInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        const activeLang = localStorage.getItem('portfolio-lang') || 'en';
        const alertMsg = activeLang === 'hi' 
            ? 'कृपया व्हाट्सएप पर भेजने से पहले नाम, ईमेल और संदेश भरें!' 
            : 'Please fill in Name, Email, and Message before sending via WhatsApp!';
        alert(alertMsg);
        return;
    }

    // TODO: Replace with your real WhatsApp number including country code (no + or spaces), e.g., "918318029013"
    const phone = "91XXXXXXXXXX"; 
    
    // Format a premium, readable markdown text for WhatsApp
    const text = `*💼 PORTFOLIO INQUIRY*\n\n*👤 Name:* ${name}\n*✉️ Email:* ${email}\n\n*💬 Message:*\n${message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
}
window.sendWhatsAppMessage = sendWhatsAppMessage;

// === MATRIX DIGITAL CODE RAIN ENGINE ===
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Rich set of characters: Katakana, Greek, math, binary, and developer syntax tokens
    const charSets = [
        "01", // Binary
        "{}[]()<>=>&&||!=?+-*/%^", // Coding syntax
        "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ", // Classic Matrix Katakana
        "αβγδεζηθικλμνξοπρστυφχψω", // Greek
        "π∑∫√∞≈≠" // Math
    ];
    const chars = charSets.join("").split("");

    // Setup multi-layered drops to create a 3D depth effect
    let drops = [];
    
    function initDrops() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // We will define columns based on a base grid size
        const baseGrid = 16;
        const columns = Math.floor(width / baseGrid);
        drops = [];
        
        for (let i = 0; i < columns; i++) {
            // Assign each column to one of 3 depth layers: 0 (back), 1 (mid), 2 (front)
            const layer = Math.random() < 0.2 ? 2 : (Math.random() < 0.5 ? 1 : 0);
            
            let fontSize, speedMult, baseOpacity, glow;
            if (layer === 2) {
                fontSize = 18;      // Large front layer
                speedMult = 1.6;     // Fast
                baseOpacity = 0.75; // Highly visible
                glow = true;
            } else if (layer === 1) {
                fontSize = 13;      // Mid layer
                speedMult = 1.0;     // Normal
                baseOpacity = 0.45; // Moderate visibility
                glow = false;
            } else {
                fontSize = 9;       // Back layer
                speedMult = 0.5;     // Slow
                baseOpacity = 0.2;  // Faint background
                glow = false;
            }

            drops.push({
                x: i * baseGrid,
                y: Math.random() * -height, // Random starting position off-screen
                layer: layer,
                fontSize: fontSize,
                speed: speedMult * (0.8 + Math.random() * 0.4), // randomize speed slightly
                baseOpacity: baseOpacity,
                opacity: baseOpacity,
                glow: glow,
                charIndex: Math.floor(Math.random() * chars.length),
                colorType: i % 4 === 0 ? 'pink' : (i % 4 === 1 ? 'cyan' : 'blue'), // Palette variety
                highlightTimer: 0 // For mouse interaction flare
            });
        }
    }
    
    initDrops();

    // Mouse coordinates tracker
    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Clear mouse when it leaves screen
    window.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initDrops, 150);
    });

    // Throttled draw at 30 FPS for low CPU/GPU load
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function render(timestamp) {
        requestAnimationFrame(render);

        const delta = timestamp - lastTime;
        if (delta < interval) return;
        lastTime = timestamp - (delta % interval);

        // Trail fade background clear
        ctx.fillStyle = 'rgba(2, 6, 23, 0.16)'; // Matches portfolio background dark color
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];

            // Change character code periodically
            if (Math.random() > 0.85) {
                drop.charIndex = Math.floor(Math.random() * chars.length);
            }
            const text = chars[drop.charIndex];

            // Mouse Interaction: If the drop falls close to the cursor, trigger a cyber-flare!
            const dx = drop.x - mouseX;
            const dy = drop.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let isLit = false;
            if (distance < 120) {
                isLit = true;
                drop.highlightTimer = 10; // flare duration
            }

            if (drop.highlightTimer > 0) {
                drop.highlightTimer--;
            }

            // Render glowing head or standard trail character
            const isHead = Math.random() > 0.97;
            
            // Set drawing state based on depth & mouse flare
            ctx.font = `bold ${drop.fontSize}px 'Courier New', Courier, monospace`;
            
            if (isLit || drop.highlightTimer > 0) {
                ctx.shadowBlur = 6; // Reduced shadow blur size for performance
                ctx.shadowColor = drop.colorType === 'pink' ? '#ec4899' : (drop.colorType === 'cyan' ? '#06b6d4' : '#0ea5e9');
            } else {
                ctx.shadowBlur = 0;
            }

            // Pick color style
            let opacity = drop.baseOpacity;
            if (isLit) {
                opacity = 0.95; // Brighten up under cursor
            } else if (drop.highlightTimer > 0) {
                opacity = drop.baseOpacity + (0.95 - drop.baseOpacity) * (drop.highlightTimer / 10);
            }

            if (isHead) {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.2})`;
            } else {
                // Use slightly brighter colors for glows without shadowBlur overhead to maintain visual impact
                const neonOpacity = drop.glow ? opacity * 1.3 : opacity;
                if (drop.colorType === 'pink') {
                    ctx.fillStyle = `rgba(244, 114, 182, ${neonOpacity})`; // Brighter pink
                } else if (drop.colorType === 'cyan') {
                    ctx.fillStyle = `rgba(34, 211, 238, ${neonOpacity})`; // Brighter cyan
                } else {
                    ctx.fillStyle = `rgba(56, 189, 248, ${neonOpacity})`; // Brighter sky blue
                }
            }

            ctx.fillText(text, drop.x, drop.y);

            // Move drops down based on speed
            const speed = drop.speed * (isLit ? 1.8 : 1.0); // speed up slightly when flared by mouse
            drop.y += drop.fontSize * speed * 0.45;

            // Reset drop loop
            if (drop.y > height && Math.random() > 0.975) {
                drop.y = -drop.fontSize * 2;
                drop.speed = (drop.layer === 2 ? 1.6 : (drop.layer === 1 ? 1.0 : 0.5)) * (0.8 + Math.random() * 0.4);
                drop.charIndex = Math.floor(Math.random() * chars.length);
                drop.highlightTimer = 0;
            }
        }
        
        // Reset shadow blur for other canvas draws to be clean
        ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
}

// === WIKI EXPLORER STATE & ENGINE ===
let currentWikiCategory = 'All';
let wikiSearchQuery = '';

function renderWikiArticles() {
    const container = document.getElementById('wiki-articles-container');
    if (!container) return;

    const activeLang = localStorage.getItem('portfolio-lang') || 'en';
    const articles = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.wikiArticles) ? window.PORTFOLIO_DATA.wikiArticles : [];

    container.innerHTML = '';
    
    // Filter articles
    const filteredArticles = articles.filter(art => {
        const matchesCategory = (currentWikiCategory === 'All' || art.category === currentWikiCategory);
        const q = wikiSearchQuery.toLowerCase().trim();
        const matchesSearch = (!q || 
            art.titleHi.toLowerCase().includes(q) || 
            art.titleEn.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
    });

    if (filteredArticles.length === 0) {
        const emptyMsg = activeLang === 'hi' ? 'कोई लेख नहीं मिला।' : 'No matching articles found.';
        container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">${emptyMsg}</p>`;
        return;
    }

    filteredArticles.forEach(art => {
        const item = document.createElement('a');
        item.className = `os-feed-item cat-${art.category || 'general'}`;
        item.href = `https://hi.wikipedia.org/wiki/${encodeURIComponent(art.titleHi)}`;
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        
        const displayTitle = activeLang === 'hi' 
            ? `<strong class="wiki-title-primary">${art.titleHi}</strong> <span class="wiki-title-secondary">(${art.titleEn})</span>`
            : `<strong class="wiki-title-primary">${art.titleEn}</strong> <span class="wiki-title-secondary">(${art.titleHi})</span>`;
            
        const ptsText = window.PORTFOLIO_TRANSLATIONS[activeLang].os_pts || 'pts';
        
        item.innerHTML = `
            <div class="wiki-item-info">
                <span class="wiki-icon"><i class="fab fa-wikipedia-w"></i></span>
                <div class="wiki-text">
                    <div class="wiki-title-wrapper">${displayTitle}</div>
                    <div class="wiki-meta">${art.date}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
                <span class="wiki-pts-badge"><i class="fas fa-plus"></i> ${art.points} ${ptsText}</span>
                <span class="wiki-status-badge">Live</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function filterWikiCategory(category) {
    currentWikiCategory = category;
    
    // Update active tab styles
    const tabs = document.querySelectorAll('#wiki-category-tabs .wiki-filter-tab');
    tabs.forEach(tab => {
        const onclickAttr = tab.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${category}'`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    renderWikiArticles();
}

window.renderWikiArticles = renderWikiArticles;
window.filterWikiCategory = filterWikiCategory;
