/**
 * OPEN SOURCE IMPACT REPORT & WIKIMEDIA CONTRIBUTOR PROFILE CONTROLLER
 * Handles scrollspy navigation, theme switching, canvas particle background,
 * Gerrit review simulator, category tab filters, and lightbox modal photo viewer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // 2. Light / Dark Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const applyTheme = (theme) => {
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      if (icon) icon.className = 'fas fa-sun';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      if (icon) icon.className = 'fas fa-moon';
    }
  };

  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('portfolio-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  // 3. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // 4. Scrollspy Active Section Highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Hero Particle Canvas Animation
  initNetworkCanvas();

  // 6. Gerrit Review Terminal Simulator
  initTerminalSimulator();

  // 7. Contributions Category Filtering
  initContributionsFilter();

  // 8. Gallery Lightbox Modal
  initLightboxModal();

  // 9. Stats CountUp Animation
  initStatsCountUp();
});

/* Canvas Network Animation */
function initNetworkCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - dist / 110)})`;
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

/* Terminal Simulator */
function initTerminalSimulator() {
  const terminalScreen = document.getElementById('terminal-screen');
  const runBtn = document.getElementById('term-run-btn');
  const clearBtn = document.getElementById('term-clear-btn');
  if (!terminalScreen || !runBtn) return;

  const simulationLines = [
    { type: 'input', text: 'git status' },
    { type: 'output', text: 'On branch master\nYour branch is up to date with \'origin/master\'.\nChanges not staged for commit:\n\tmodified:   extensions/GrowthExperiments/MentorshipExceptions.php' },
    { type: 'input', text: 'git diff' },
    { type: 'output', text: 'diff --git a/MentorshipExceptions.php b/MentorshipExceptions.php\n- throw new MentorshipException( "No mentor found." );\n+ throw new MentorshipException( "No mentor found for user.", $genderSupport );' },
    { type: 'input', text: 'git commit -m "T416226: Add gender support to mentored exception message"' },
    { type: 'output', text: '[master 416226a] T416226: Add gender support to mentored exception message\n 1 file changed, 2 insertions(+), 1 deletion(-)' },
    { type: 'input', text: 'git review' },
    { type: 'output', text: 'Pushing patchset to gerrit.wikimedia.org:refs/for/master...\nNew Change created: https://gerrit.wikimedia.org/r/c/mediawiki/extensions/GrowthExperiments/+/1289010' },
    { type: 'success', text: '[Wikimedia CI Runner] Unit tests & PHPStan validation: PASSED (+1)' },
    { type: 'warning', text: 'Reviewer (MediaWiki Maintainer): Code-Review +2 (Looks clean and compliant!)' },
    { type: 'success', text: 'Change MERGED into MediaWiki production branch! Deployed to Wikipedia servers worldwide. 🎉' }
  ];

  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    terminalScreen.innerHTML = '';

    let index = 0;
    function printNextLine() {
      if (index >= simulationLines.length) {
        isRunning = false;
        runBtn.disabled = false;
        return;
      }

      const item = simulationLines[index];
      const div = document.createElement('div');

      if (item.type === 'input') {
        div.className = 'term-line term-input';
        div.textContent = item.text;
      } else if (item.type === 'success') {
        div.className = 'term-line term-success';
        div.textContent = item.text;
      } else if (item.type === 'warning') {
        div.className = 'term-line term-warning';
        div.textContent = item.text;
      } else {
        div.className = 'term-line term-output';
        div.textContent = item.text;
      }

      terminalScreen.appendChild(div);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      index++;

      setTimeout(printNextLine, 800);
    }

    printNextLine();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalScreen.innerHTML = '<div class="term-line term-output">Terminal initialized. Click "Run Gerrit Simulation" to start.</div>';
    });
  }
}

/* Contributions Filter */
function initContributionsFilter() {
  const tabBtns = document.querySelectorAll('.contrib-tab-btn');
  const cards = document.querySelectorAll('.contrib-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const status = card.getAttribute('data-status');

        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'merged' && status === 'merged') {
          card.style.display = 'flex';
        } else if (cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Lightbox Modal */
function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Open Source Moment';
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* Stats CountUp Animation */
function initStatsCountUp() {
  const nums = document.querySelectorAll('.metric-num');
  if (nums.length === 0) return;

  let animated = false;
  window.addEventListener('scroll', () => {
    if (animated) return;
    const heroSection = document.getElementById('hero');
    if (heroSection && window.scrollY > heroSection.offsetHeight / 3) {
      animated = true;
      nums.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            num.textContent = target + (num.getAttribute('data-target').includes('+') ? '+' : '');
            clearInterval(timer);
          } else {
            num.textContent = current + '+';
          }
        }, 30);
      });
    }
  });
}
