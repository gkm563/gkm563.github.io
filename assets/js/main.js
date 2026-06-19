// Gautam Kumar Maurya's Portfolio Engine
// Consolidated interactive elements, voice narrator player, and AI twin chatbot

// === PORTFOLIO GLOBAL STATE ===
let currentLiCategory = 'All';
let linkedinCurrentSlide = 0;
let currentLang = 'en';

// === BILINGUAL TRANSLATION SWITCHER ===
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    
    // Toggle active class on language toggle buttons
    const btnEn = document.getElementById('lang-btn-en');
    const btnHi = document.getElementById('lang-btn-hi');
    if (btnEn && btnHi) {
        if (lang === 'hi') {
            btnEn.classList.remove('active');
            btnHi.classList.add('active');
            document.documentElement.lang = 'hi';
        } else {
            btnEn.classList.add('active');
            btnHi.classList.remove('active');
            document.documentElement.lang = 'en';
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

    // Refresh LinkedIn posts
    renderLinkedInPosts();
    
    // Refresh Wikipedia articles
    renderWikiArticles();
    
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
            loop: true
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

// Fetch posts dynamically from Juicer.io API feed with loading skeletons and custom error fallback
async function fetchLinkedInPosts() {
    const container = document.getElementById('linkedin-container');
    if (!container) return;

    // Render loading skeletons
    container.innerHTML = `
        <div class="linkedin-skeleton-loader" style="grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; width: 100%;">
            ${Array(3).fill().map(() => `
                <div class="skeleton-card">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="skeleton-avatar"></div>
                        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                            <div class="skeleton-line short"></div>
                            <div class="skeleton-line medium"></div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line medium"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                    <div class="skeleton-image"></div>
                </div>
            `).join('')}
        </div>
    `;

    try {
        const res = await fetch('https://www.juicer.io/api/feeds/gkm563');
        if (!res.ok) throw new Error('Network error or rate limit');
        
        const data = await res.json();
        const items = data.posts && data.posts.items ? data.posts.items : [];

        // Catch empty feed or Juicer invalid feed troubleshooting post
        if (items.length === 0 || (items.length === 1 && items[0].feed === 'invalid-feed')) {
            console.warn('Juicer feed is not active or invalid. Falling back to static cache.');
            renderLinkedInPosts();
            return;
        }

        const mappedPosts = items.map((item, index) => {
            const textContent = item.unformatted_message || (item.message ? item.message.replace(/<[^>]*>/g, '') : '');
            
            // Extract media image
            let imageUrl = item.image;
            if (!imageUrl && item.media && item.media.length > 0) {
                imageUrl = item.media[0].src || item.media[0].thumbnail;
            }

            // Extract date
            const dateStr = item.formatted_external_created_at || (item.external_created_at ? new Date(item.external_created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'Recent');

            return {
                id: item.id ? `li-${item.id}` : `li-live-${index}`,
                title: textContent.split('\n')[0].substring(0, 80) + '...',
                text: textContent,
                date: dateStr,
                category: categorizePost(textContent),
                image: imageUrl || null,
                link: item.full_url || 'https://www.linkedin.com/in/gkm563',
                stats: {
                    likes: item.likes || item.like_count || 0,
                    comments: item.comments || item.comment_count || 0
                }
            };
        });

        if (window.PORTFOLIO_DATA) {
            window.PORTFOLIO_DATA.linkedinPosts = mappedPosts;
        }
        renderLinkedInPosts();
    } catch (err) {
        console.error('LinkedIn feed sync error, using fallback:', err);
        renderLinkedInPosts();
    }
}

function renderLinkedInPosts() {
    const container = document.getElementById('linkedin-container');
    if (!container) return;
    container.innerHTML = '';

    // Reset slide position when rendering/refreshing categories
    linkedinCurrentSlide = 0;
    container.style.transform = 'translateX(0px)';

    const activeLang = localStorage.getItem('portfolio-lang') || 'en';
    let posts = [];
    if (activeLang === 'hi') {
        posts = window.PORTFOLIO_LINKEDIN_TRANSLATED.hi;
    } else {
        posts = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.linkedinPosts && window.PORTFOLIO_DATA.linkedinPosts.length > 0) 
            ? window.PORTFOLIO_DATA.linkedinPosts 
            : window.PORTFOLIO_LINKEDIN_TRANSLATED.en;
    }

    const filtered = posts.filter(post => {
        return currentLiCategory === 'All' || post.category === currentLiCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 3rem; width: 100%;">No LinkedIn highlights found for this category.</p>`;
        
        // Hide arrows and dots
        const prevBtn = document.getElementById('linkedin-prev-btn');
        const nextBtn = document.getElementById('linkedin-next-btn');
        const dotsContainer = document.getElementById('linkedin-dots-container');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.innerHTML = '';
        return;
    }

    // Render all filtered posts horizontally inside track
    filtered.forEach(post => {
        const card = document.createElement('div');
        card.className = 'linkedin-card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
            <div class="linkedin-header">
                <div class="linkedin-user">
                    <img src="assets/images/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya - Data Science & Full-Stack Developer" class="linkedin-avatar">
                    <div class="linkedin-user-info">
                        <h4>Gautam Kumar Maurya</h4>
                        <span>B.Tech CSE (Data Science) student | UIT Prayagraj • ${post.date || 'Recent'}</span>
                    </div>
                </div>
                <span class="linkedin-logo-icon"><i class="fab fa-linkedin"></i></span>
            </div>
            <div class="linkedin-body">
                <p>${post.text.replace(/\n/g, '<br>')}</p>
                ${post.image ? `
                    <div class="linkedin-image-wrapper">
                        <img src="${post.image}" alt="${post.title ? post.title.replace(/"/g, '&quot;') : 'Gautam Kumar Maurya LinkedIn highlight update'}" class="linkedin-image" loading="lazy">
                    </div>
                ` : ''}
            </div>
            <div class="linkedin-footer">
                <div class="linkedin-stats">
                    <span><i class="fas fa-thumbs-up"></i> ${post.stats.likes}</span>
                    <span><i class="fas fa-comment"></i> ${post.stats.comments}</span>
                </div>
                <a href="${post.link}" target="_blank" class="linkedin-btn">View on LinkedIn <i class="fas fa-external-link-alt"></i></a>
            </div>
        `;
        container.appendChild(card);
    });

    // Initialize/Update the slider layout metrics after content injection
    setTimeout(() => {
        updateLinkedInSlider();
        if (window.cacheSectionOffsets) {
            window.cacheSectionOffsets();
        }
    }, 100);
}

function filterLiCategory(category) {
    currentLiCategory = category;
    linkedinCurrentSlide = 0; // Reset slide index when category changes
    const tabs = document.querySelectorAll('#li-category-tabs .filter-tab');
    tabs.forEach(tab => {
        const onclickAttr = tab.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${category}'`) || onclickAttr.includes(`"${category}"`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    renderLinkedInPosts();
}

// Fetch live public repositories from GitHub API
async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    // Loading indicator skeletons
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

    try {
        const res = await fetch('https://api.github.com/users/gkm563/repos?sort=updated&per_page=30');
        if (!res.ok) throw new Error('GitHub API request failed');
        const repos = await res.json();

        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.name !== 'gkm563')
            .slice(0, 6);

        container.innerHTML = '';
        if (filteredRepos.length === 0) {
            renderFallbackGitHubRepos(container);
            return;
        }

        filteredRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-aos', 'fade-up');
            
            let langIcon = '<i class="fas fa-code"></i>';
            if (repo.language) {
                const lang = repo.language.toLowerCase();
                if (lang === 'typescript') langIcon = '<i class="fab fa-js" style="color: #3178c6;"></i>';
                else if (lang === 'javascript') langIcon = '<i class="fab fa-js" style="color: #f7df1e;"></i>';
                else if (lang === 'html') langIcon = '<i class="fab fa-html5" style="color: #e34f26;"></i>';
                else if (lang === 'css') langIcon = '<i class="fab fa-css3-alt" style="color: #1572b6;"></i>';
                else if (lang === 'php') langIcon = '<i class="fab fa-php" style="color: #777bb4;"></i>';
                else if (lang === 'python') langIcon = '<i class="fab fa-python" style="color: #3776ab;"></i>';
            }

            const desc = repo.description || 'No description provided. Click below to view the codebase on GitHub.';

            card.innerHTML = `
                <div class="project-content" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="project-icon">${langIcon}</div>
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #fff;">${repo.name}</h3>
                    <p style="font-size: 0.9rem; color: #94a3b8; flex-grow: 1; margin-bottom: 1.5rem; line-height: 1.6;">${desc}</p>
                    <div class="project-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                        <div class="tech-tags">
                            <span class="tech-tag" style="background: rgba(14, 165, 233, 0.1); color: var(--primary-color);">${repo.language || 'Code'}</span>
                            <span class="tech-tag" style="background: rgba(236, 72, 153, 0.1); color: var(--secondary-color);"><i class="fas fa-star" style="margin-right: 4px;"></i>${repo.stargazers_count}</span>
                        </div>
                        <a href="${repo.html_url}" class="project-link" target="_blank" style="font-size: 0.9rem; font-weight: 600; text-decoration: none; color: var(--secondary-color);">Repo Link <i class="fas fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        if (window.cacheSectionOffsets) {
            setTimeout(window.cacheSectionOffsets, 100);
        }
    } catch (err) {
        console.warn('GitHub repos load error, using static fallback:', err);
        renderFallbackGitHubRepos(container);
    }
}

function renderFallbackGitHubRepos(container) {
    const repos = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.githubRepos) ? window.PORTFOLIO_DATA.githubRepos : [];
    container.innerHTML = '';
    
    if (repos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 2rem;">No repositories available.</p>';
        return;
    }

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-aos', 'fade-up');
        
        let langIcon = '<i class="fas fa-code"></i>';
        if (repo.language) {
            const lang = repo.language.toLowerCase();
            if (lang === 'typescript') langIcon = '<i class="fab fa-js" style="color: #3178c6;"></i>';
            else if (lang === 'javascript') langIcon = '<i class="fab fa-js" style="color: #f7df1e;"></i>';
            else if (lang === 'html') langIcon = '<i class="fab fa-html5" style="color: #e34f26;"></i>';
            else if (lang === 'css') langIcon = '<i class="fab fa-css3-alt" style="color: #1572b6;"></i>';
            else if (lang === 'php') langIcon = '<i class="fab fa-php" style="color: #777bb4;"></i>';
            else if (lang === 'python') langIcon = '<i class="fab fa-python" style="color: #3776ab;"></i>';
        }

        card.innerHTML = `
            <div class="project-content" style="display: flex; flex-direction: column; height: 100%;">
                <div class="project-icon">${langIcon}</div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #fff;">${repo.name}</h3>
                <p style="font-size: 0.9rem; color: #94a3b8; flex-grow: 1; margin-bottom: 1.5rem; line-height: 1.6;">${repo.description}</p>
                <div class="project-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                    <div class="tech-tags">
                        <span class="tech-tag" style="background: rgba(14, 165, 233, 0.1); color: var(--primary-color);">${repo.language || 'Code'}</span>
                        <span class="tech-tag" style="background: rgba(236, 72, 153, 0.1); color: var(--secondary-color);"><i class="fas fa-star" style="margin-right: 4px;"></i>${repo.stargazers_count}</span>
                    </div>
                    <a href="${repo.html_url}" class="project-link" target="_blank" style="font-size: 0.9rem; font-weight: 600; text-decoration: none; color: var(--secondary-color);">Repo Link <i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    if (window.cacheSectionOffsets) {
        setTimeout(window.cacheSectionOffsets, 100);
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
    img.src = "assets/images/Gautam_Kumar_Maurya.jpg";
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
        const time = Date.now() * 0.001;

        // Perform mouth vertex displacement lip-sync calculations
        if (isAvatarSpeaking) {
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
        } else {
            // Reset coordinates
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

// === UNIFIED NARRATOR & SPEECH ENGINE ===
let avatarSpeechUtterance = null;
let isSpeaking = false; // synced with narrator

function speakAvatarText(text, onStartCallback, onEndCallback) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Strip HTML formatting
    const cleanText = text.replace(/<[^>]*>/g, '');
    avatarSpeechUtterance = new SpeechSynthesisUtterance(cleanText);

    const activeLang = localStorage.getItem('portfolio-lang') || 'en';

    // Apply voice preferences
    const voiceGenderSelect = document.getElementById('voice-gender');
    const selectedGender = voiceGenderSelect ? voiceGenderSelect.value : 'female';
    const voices = window.speechSynthesis.getVoices();

    let selectedVoice = null;
    if (activeLang === 'hi') {
        selectedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
    }
    
    if (!selectedVoice) {
        if (selectedGender === 'male') {
            selectedVoice = voices.find(v => v.name.toLowerCase().includes('google uk english male') || 
                                             v.name.toLowerCase().includes('david') ||
                                             v.name.toLowerCase().includes('male') ||
                                             v.lang.startsWith('en'));
        } else {
            selectedVoice = voices.find(v => v.name.toLowerCase().includes('google uk english female') || 
                                             v.name.toLowerCase().includes('zira') ||
                                             v.name.toLowerCase().includes('female') ||
                                             v.lang.startsWith('en'));
        }
    }

    if (selectedVoice) {
        avatarSpeechUtterance.voice = selectedVoice;
        avatarSpeechUtterance.lang = selectedVoice.lang;
    } else if (activeLang === 'hi') {
        avatarSpeechUtterance.lang = 'hi-IN';
    } else {
        avatarSpeechUtterance.lang = 'en-US';
    }

    avatarSpeechUtterance.rate = 1.0;
    avatarSpeechUtterance.pitch = selectedGender === 'male' ? 0.95 : 1.05;

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
    if (text === 'Tell me your story') userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_story;
    else if (text === 'What is PDFBAZI?') userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_pdfbazi;
    else if (text === 'Show hackathon wins') userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_wins;
    else if (text === 'How can we collaborate?') userDisplayMessage = window.PORTFOLIO_TRANSLATIONS[activeLang].chat_opt_collab;
    
    addChatMessage(userDisplayMessage, 'user');
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getChatResponse(text);
        addChatMessage(response, 'bot');
        speakAvatarText(response);
    }, 1000);
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
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getChatResponse(text);
        addChatMessage(response, 'bot');
        speakAvatarText(response);
    }, 1000);
}

function getChatResponse(query) {
    const activeLang = localStorage.getItem('portfolio-lang') || 'en';
    const q = query.toLowerCase();
    
    if (q.includes('story') || q.includes('journey') || q.includes('about') || q.includes('कहानी') || q.includes('सफर') || q.includes('परिचय')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_story;
    }
    if (q.includes('rooms') || q.includes('prayagrajrooms') || q.includes('room') || q.includes('कमरा') || q.includes('पीजी')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_rooms;
    }
    if (q.includes('campusclick') || q.includes('campus click') || q.includes('कॉलेज') || q.includes('कैंपस')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_campusclick;
    }
    if (q.includes('pdfbazi') || q.includes('pdf bazi') || q.includes('पीडीएफ')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_pdfbazi;
    }
    if (q.includes('buildx') || q.includes('build x') || q.includes('बिल्ड')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_buildx || window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_hackathon;
    }
    if (q.includes('hackathon') || q.includes('win') || q.includes('achieve') || q.includes('rank') || q.includes('जीत') || q.includes('सफलता') || q.includes('प्रथम') || q.includes('टॉपर')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_hackathon;
    }
    if (q.includes('open source') || q.includes('wikipedia') || q.includes('wikimedia') || q.includes('gerrit') || q.includes('विकिपीडिया') || q.includes('ओपन सोर्स')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_opensource;
    }
    if (q.includes('collaborate') || q.includes('connect') || q.includes('work') || q.includes('contact') || q.includes('संपर्क') || q.includes('सहयोग') || q.includes('काम')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_collaborate;
    }
    if (q.includes('freelance') || q.includes('earning') || q.includes('milestone') || q.includes('millets') || q.includes('कमाई') || q.includes('फ्रीलांस')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_freelance;
    }
    if (q.includes('skills') || q.includes('tech') || q.includes('languages') || q.includes('कौशल') || q.includes('तकनीक')) {
        return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_skills;
    }

    return window.PORTFOLIO_TRANSLATIONS[activeLang].chat_resp_default;
}

// === MAIN ENGINE INITIALIZER ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize active language
    const savedLang = localStorage.getItem('portfolio-lang') || 'en';
    setLanguage(savedLang);

    // 1. Initial renders
    fetchLinkedInPosts();
    fetchGitHubRepos();
    renderWikiArticles();
    initMatrixRain();
    initThreeDAvatar();

    // Wiki Search Input handler
    const wikiSearchInput = document.getElementById('wiki-search');
    if (wikiSearchInput) {
        wikiSearchInput.addEventListener('input', (e) => {
            wikiSearchQuery = e.target.value;
            renderWikiArticles();
        });
    }

    // LinkedIn Carousel Navigation handler
    const prevBtn = document.getElementById('linkedin-prev-btn');
    const nextBtn = document.getElementById('linkedin-next-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (linkedinCurrentSlide > 0) {
                linkedinCurrentSlide--;
                updateLinkedInSlider();
            }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const container = document.getElementById('linkedin-container');
            if (container) {
                const cards = container.querySelectorAll('.linkedin-card');
                const cardsPerView = getCardsPerView();
                const maxSlide = Math.max(0, cards.length - cardsPerView);
                if (linkedinCurrentSlide < maxSlide) {
                    linkedinCurrentSlide++;
                    updateLinkedInSlider();
                }
            }
        });
    }

    // Touch swipe support for LinkedIn Carousel
    const track = document.getElementById('linkedin-container');
    if (track) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            const cards = track.querySelectorAll('.linkedin-card');
            const cardsPerView = getCardsPerView();
            const maxSlide = Math.max(0, cards.length - cardsPerView);
            
            if (diff > swipeThreshold) {
                if (linkedinCurrentSlide < maxSlide) {
                    linkedinCurrentSlide++;
                    updateLinkedInSlider();
                }
            } else if (diff < -swipeThreshold) {
                if (linkedinCurrentSlide > 0) {
                    linkedinCurrentSlide--;
                    updateLinkedInSlider();
                }
            }
        }
    }
    
    // 2. Setup voice narrator and chatbot
    setupVoiceNarrator();
    setupChatbot();
    
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
        updateLinkedInSlider();
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cacheSectionOffsets();
            updateLinkedInSlider();
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

    // 8. Custom cursor tracker logic (Desktop only, lag-free via requestAnimationFrame and hardware acceleration)
    if (!('ontouchstart' in window)) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorFollower = document.querySelector('.cursor-follower');

        if (cursorDot && cursorFollower) {
            // Enable custom cursor styles to hide default cursor
            document.body.classList.add('custom-cursor-enabled');

            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let dotX = mouseX;
            let dotY = mouseY;
            let followerX = mouseX;
            let followerY = mouseY;
            let followerScale = 1;

            // Track mouse positions
            window.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Smooth cursor update loop using linear interpolation (lerp)
            function updateCursorPositions() {
                // Eliminate lag by setting dot position directly to match hardware mouse coordinates instantly
                dotX = mouseX;
                dotY = mouseY;
                followerX += (mouseX - followerX) * 0.15;
                followerY += (mouseY - followerY) * 0.15;

                cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
                cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(${followerScale})`;

                requestAnimationFrame(updateCursorPositions);
            }
            requestAnimationFrame(updateCursorPositions);

            // Toggle hover state class on body for all interactive elements
            const hoverTargets = 'a, button, input, textarea, select, .filter-tab, .quick-opt-btn, #chat-toggle, .narrator-btn, .logo';
            
            document.body.addEventListener('mouseover', e => {
                if (e.target.closest(hoverTargets)) {
                    followerScale = 1.5;
                    cursorFollower.classList.add('hovering');
                }
            });

            document.body.addEventListener('mouseout', e => {
                if (e.target.closest(hoverTargets) && !e.relatedTarget?.closest(hoverTargets)) {
                    followerScale = 1;
                    cursorFollower.classList.remove('hovering');
                }
            });
        }
    } else {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

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
            
            if (drop.glow || isLit || drop.highlightTimer > 0) {
                ctx.shadowBlur = isLit ? 15 : 8;
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
                if (drop.colorType === 'pink') {
                    ctx.fillStyle = `rgba(236, 72, 153, ${opacity})`; // Neon pink
                } else if (drop.colorType === 'cyan') {
                    ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`; // Cyber cyan
                } else {
                    ctx.fillStyle = `rgba(14, 165, 233, ${opacity})`; // Neon blue
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

// === LINKEDIN SLIDER HELPER FUNCTIONS ===
function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function updateLinkedInSlider() {
    const container = document.getElementById('linkedin-container');
    if (!container) return;
    const cards = container.querySelectorAll('.linkedin-card');
    if (cards.length === 0) return;

    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.gap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;

    const cardsPerView = getCardsPerView();
    const maxSlide = Math.max(0, cards.length - cardsPerView);
    
    if (linkedinCurrentSlide > maxSlide) {
        linkedinCurrentSlide = maxSlide;
    }
    if (linkedinCurrentSlide < 0) {
        linkedinCurrentSlide = 0;
    }

    // Slide track using computed coordinates
    const offset = linkedinCurrentSlide * (cardWidth + gap);
    container.style.transform = `translateX(-${offset}px)`;

    // Enable/disable navigation arrows
    const prevBtn = document.getElementById('linkedin-prev-btn');
    const nextBtn = document.getElementById('linkedin-next-btn');
    if (prevBtn) prevBtn.disabled = (linkedinCurrentSlide === 0);
    if (nextBtn) nextBtn.disabled = (linkedinCurrentSlide >= maxSlide);

    // Update dots indicator
    updateLinkedInDots(cards.length, cardsPerView);
}

function updateLinkedInDots(totalCards, cardsPerView) {
    const dotsContainer = document.getElementById('linkedin-dots-container');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    const maxSlide = Math.max(0, totalCards - cardsPerView);
    const prevBtn = document.getElementById('linkedin-prev-btn');
    const nextBtn = document.getElementById('linkedin-next-btn');

    if (maxSlide === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        dotsContainer.style.display = 'none';
        return;
    } else {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        dotsContainer.style.display = 'flex';
    }

    for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('div');
        dot.className = `linkedin-dot ${i === linkedinCurrentSlide ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            linkedinCurrentSlide = i;
            updateLinkedInSlider();
        });
        dotsContainer.appendChild(dot);
    }
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
        container.innerHTML = `<p style="text-align: center; color: #94a3b8; padding: 2rem;">${emptyMsg}</p>`;
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
