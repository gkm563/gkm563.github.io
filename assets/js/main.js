// Gautam Kumar Maurya's Portfolio Engine
// Consolidated interactive elements, voice narrator player, and AI twin chatbot

// === PORTFOLIO GLOBAL STATE ===
let currentLiCategory = 'All';
let linkedinCurrentSlide = 0;

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

    const posts = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.linkedinPosts) ? window.PORTFOLIO_DATA.linkedinPosts : [];

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
        const text = tab.textContent.trim();
        const targetText = category === 'All' ? 'All Activity' : (category === 'Behind the Scenes' ? 'Behind the Scenes' : category);
        if (text === targetText) {
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
let speechUtterance = null;
let isSpeaking = false;

function setupVoiceNarrator() {
    const playBtn = document.getElementById('narrator-play-btn');
    const stopBtn = document.getElementById('narrator-stop-btn');
    const pulseDot = document.getElementById('voice-pulse');
    const visualizer = document.getElementById('voice-visualizer');
    const voiceGenderSelect = document.getElementById('voice-gender');

    if (!playBtn) return;
    
    playBtn.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.pause();
            isSpeaking = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            pulseDot.classList.remove('active');
            visualizer.classList.remove('active');
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                isSpeaking = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                pulseDot.classList.add('active');
                visualizer.classList.add('active');
            } else {
                speakNarrator();
            }
        }
    });

    stopBtn.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        stopBtn.disabled = true;
        pulseDot.classList.remove('active');
        visualizer.classList.remove('active');
    });

    function speakNarrator() {
        window.speechSynthesis.cancel();
        
        const scriptText = "Hello there! I'm Gautam Kumar Maurya. Welcome to my digital portfolio! I am currently a B.Tech Computer Science and Engineering student at United Institute of Technology, Prayagraj, specializing in Data Science. I am an open source contributor with Wikimedia, a co-founder of the startup initiative PrayagrajRooms, and I love building full-stack applications with AI workflows. Feel free to explore my projects, check out my LinkedIn updates feed, or have a chat with my AI twin chatbot floating at the bottom right!";
        
        speechUtterance = new SpeechSynthesisUtterance(scriptText);
        
        const voices = window.speechSynthesis.getVoices();
        const selectedGender = voiceGenderSelect.value;
        
        let selectedVoice = null;
        if (selectedGender === 'male') {
            selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('google uk english male') || 
                                                 voice.name.toLowerCase().includes('david') ||
                                                 voice.name.toLowerCase().includes('male') ||
                                                 voice.name.toLowerCase().includes('en-us') && voice.name.toLowerCase().includes('guy') ||
                                                 voice.name.toLowerCase().includes('natural') && voice.lang.startsWith('en'));
        } else {
            selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('google uk english female') || 
                                                 voice.name.toLowerCase().includes('zira') ||
                                                 voice.name.toLowerCase().includes('female') ||
                                                 voice.name.toLowerCase().includes('en-us') && voice.name.toLowerCase().includes('jessa') ||
                                                 voice.lang.startsWith('en'));
        }

        if (selectedVoice) {
            speechUtterance.voice = selectedVoice;
        }
        
        speechUtterance.rate = 1.0;
        speechUtterance.pitch = selectedGender === 'male' ? 0.95 : 1.05;
        
        speechUtterance.onstart = () => {
            isSpeaking = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            stopBtn.disabled = false;
            pulseDot.classList.add('active');
            visualizer.classList.add('active');
        };

        speechUtterance.onend = () => {
            isSpeaking = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            stopBtn.disabled = true;
            pulseDot.classList.remove('active');
            visualizer.classList.remove('active');
        };

        speechUtterance.onerror = () => {
            isSpeaking = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            stopBtn.disabled = true;
            pulseDot.classList.remove('active');
            visualizer.classList.remove('active');
        };

        window.speechSynthesis.speak(speechUtterance);
    }
}

if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

// === AI TWIN CHATBOT LOGIC ===
function setupChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');

    if (!chatToggle) return;
    
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        const badge = chatToggle.querySelector('.badge');
        if (badge) badge.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
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
    addChatMessage(text, 'user');
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getChatResponse(text);
        addChatMessage(response, 'bot');
    }, 1000);
}

function handleChatSubmit(e) {
    e.preventDefault();
    const chatInput = document.getElementById('chat-user-input');
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    addChatMessage(text, 'user');
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getChatResponse(text);
        addChatMessage(response, 'bot');
    }, 1000);
}

function getChatResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('story') || q.includes('journey') || q.includes('about')) {
        return "I am currently pursuing my B.Tech in Computer Science & Engineering (specializing in Data Science) at UIT Prayagraj. I love building real, useful products, solving problems in DSA, and contributing to open-source systems. Tech is my vehicle for creating local and global impact!";
    }
    if (q.includes('rooms') || q.includes('prayagrajrooms') || q.includes('room')) {
        return "<b>PrayagrajRooms</b> is a startup Praveen and I co-founded! We are building a verified search platform that connects outstation students directly with PG and room owners in Prayagraj without intermediaries. It solves a huge local pain point.";
    }
    if (q.includes('campusclick') || q.includes('campus click')) {
        return "<b>CampusClick</b> is an event and announcement student platform built using standard full-stack web tools to improve event coordination, teacher notifications, and student engagement in college campus environments.";
    }
    if (q.includes('pdfbazi') || q.includes('pdf bazi')) {
        return "<b>PDFBAZI</b> is an all-in-one PDF utility tool to merge, split, watermark, and compress documents locally, prioritizing browser-side user privacy and high rendering speeds.";
    }
    if (q.includes('buildx') || q.includes('build x')) {
        return "I designed and deployed the official hackathon website for **BuildX India 2026**. I also served on the technical management team, coordinating participant registrations and portal metrics.";
    }
    if (q.includes('hackathon') || q.includes('win') || q.includes('achieve') || q.includes('first rank')) {
        return "🏆 Achievements include securing <b>1st Place</b> in WebDie (ENIGMA XIII), <b>1st Place</b> in GDG Quiz, and <b>1st Place</b> in the WikiClub UIT Contribution Sprint! Academically, I ranked <b>Top 5 (Rank 5)</b> in B.Tech 1st Year (1st Semester) under AKTU university.";
    }
    if (q.includes('open source') || q.includes('wikipedia') || q.includes('wikimedia') || q.includes('gerrit') || q.includes('phabricator')) {
        return "I am an active contributor to the **Wikimedia** ecosystem and Wikipedia. I have multiple merged patches and ongoing reviews using professional Gerrit and Phabricator collaboration workflows.";
    }
    if (q.includes('collaborate') || q.includes('connect') || q.includes('work') || q.includes('contact')) {
        return "Let's work together! You can message me on <a href='https://linkedin.com/in/gkm563' target='_blank' style='color:#0ea5e9; font-weight:600;'>LinkedIn</a> or email me at <a href='mailto:maurgk212104@gmail.com' style='color:#ec4899; font-weight:600;'>maurgk212104@gmail.com</a>. You can also use the contact form on this page!";
    }
    if (q.includes('freelance') || q.includes('earning') || q.includes('milestone') || q.includes('millets')) {
        return "Yes! I do freelance full-stack work. For example, I built the digital outreach page and catalog optimization interface for <b>Vindhya Millets</b>, a government-supported startup.";
    }
    if (q.includes('skills') || q.includes('tech') || q.includes('languages')) {
        return "My tech arsenal includes Python, C++, C, Java, JavaScript, TypeScript, React, Next.js, Django, Node.js, PHP, MySQL, MongoDB, Docker, Git, OpenCV, and cybersecurity tools.";
    }

    return "That's an interesting question! I am Gautam's Digital Twin, so I might not have all the details. Would you like to drop the real Gautam an email via the Contact Form? Or you can message him on LinkedIn!";
}

// === MAIN ENGINE INITIALIZER ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial renders
    fetchLinkedInPosts();
    fetchGitHubRepos();
    initMatrixRain();

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

    // 4. Initialize Typed.js subtitle strings
    const typed = new Typed('#typed-subtitle', {
        strings: [
            'AI & Data Science Engineer | Building Scalable AI Solutions',
            'Technical Community Leader & Open Source Contributor',
            'B.Tech CSE (Data Science) @ UIT Prayagraj',
            'Co-founder @ PrayagrajRooms PG Startup',
            'Technical Head @ GFG UIT & UDTech India',
            'Active Patches Merged in Wikimedia & Wikipedia Core'
        ],
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 1500,
        loop: true
    });

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
                // Lerp formula: current + (target - current) * speed
                dotX += (mouseX - dotX) * 0.25;
                dotY += (mouseY - dotY) * 0.25;
                followerX += (mouseX - followerX) * 0.12;
                followerY += (mouseY - followerY) * 0.12;

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
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
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
                    formStatus.innerHTML = '<p class="success">Message sent successfully! Thank you.</p>';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = `<p class="error">${data["errors"].map(error => error["message"]).join(", ")}</p>`;
                        } else {
                            formStatus.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
                        }
                    });
                }
            } catch (error) {
                formStatus.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        }
        form.addEventListener("submit", handleSubmit);
    }
});

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
