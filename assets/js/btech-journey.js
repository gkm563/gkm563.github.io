/**
 * GAUTAM KUMAR MAURYA (gkm563) — B.TECH JOURNEY INTERACTIVE CONTROLLER
 * Handles view switching, filtering, modal deep-dives, and theme sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof JOURNEY_DATA === 'undefined') {
    console.error('JOURNEY_DATA not loaded!');
    return;
  }

  const state = {
    viewMode: 'timeline', // 'timeline' | 'year' | 'category'
    statusFilter: 'all',  // 'all' | 'completed' | 'current' | 'planned'
    theme: localStorage.getItem('gkm_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  };

  // Initialize UI
  applyTheme(state.theme);
  renderMetrics();
  renderSkillEvolution();
  renderJourneyFeed();
  setupEventListeners();
});

/* 1. Theme Toggle */
function applyTheme(theme) {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  if (theme === 'dark') {
    html.classList.add('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
  } else {
    html.classList.remove('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
  }
  localStorage.setItem('gkm_theme', theme);
}

/* 2. Render Verified Metrics Bar */
function renderMetrics() {
  const milestones = JOURNEY_DATA.milestones || [];
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const currentCount = milestones.filter(m => m.status === 'current').length;
  const majorAwardsCount = milestones.filter(m => m.category === 'Award' || m.category === 'Internship' || m.category === 'Open Source').length;

  const statsContainer = document.getElementById('journey-stats-container');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stat-box">
      <div class="stat-number">4 Years</div>
      <div class="stat-label">B.Tech Degree Duration</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${milestones.length}</div>
      <div class="stat-label">Documented Milestones</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${completedCount}</div>
      <div class="stat-label">✓ Completed Achievements</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${majorAwardsCount}</div>
      <div class="stat-label">Fellowships & State Awards</div>
    </div>
  `;
}

/* 3. Render Skill Evolution Matrix */
function renderSkillEvolution() {
  const container = document.getElementById('skill-phases-container');
  if (!container || !JOURNEY_DATA.skillEvolution) return;

  container.innerHTML = JOURNEY_DATA.skillEvolution.map(phase => {
    const skillBadges = phase.skills.map(s => {
      const levelClass = getLevelClass(s.level);
      return `
        <span class="skill-tag">
          <span>${s.name}</span>
          <span class="level-badge ${levelClass}">${s.level}</span>
        </span>
      `;
    }).join('');

    return `
      <div class="skill-phase-card">
        <div class="skill-phase-title">${phase.phaseTitle}</div>
        <span class="skill-phase-period">${phase.period}</span>
        <div class="skill-tags-list">
          ${skillBadges}
        </div>
      </div>
    `;
  }).join('');
}

function getLevelClass(level) {
  if (level.includes('Explored')) return 'level-explored';
  if (level.includes('Learning')) return 'level-learning';
  if (level.includes('Built')) return 'level-built';
  if (level.includes('Production')) return 'level-production';
  if (level.includes('Contributed')) return 'level-contributed';
  return 'level-built';
}

/* 4. Render Journey Feed (Timeline / Year / Category Views) */
function renderJourneyFeed() {
  const streamContainer = document.getElementById('journey-stream-container');
  if (!streamContainer) return;

  const milestones = filterMilestones();

  if (milestones.length === 0) {
    streamContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--j-text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
        <p style="font-weight: 600;">No milestones found for the selected filter.</p>
      </div>
    `;
    return;
  }

  // Render vertical timeline cards
  streamContainer.innerHTML = `
    <div class="timeline-spine"></div>
    ${milestones.map((m, idx) => createMilestoneCardHTML(m, idx)).join('')}
  `;

  // Bind card clicks for modal deep dive
  document.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger modal if clicking a direct external link
      if (e.target.closest('a')) return;
      const milestoneId = card.getAttribute('data-id');
      openMilestoneModal(milestoneId);
    });
  });
}

function filterMilestones() {
  const milestones = JOURNEY_DATA.milestones || [];
  const statusFilter = window.currentStatusFilter || 'all';

  return milestones.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });
}

function createMilestoneCardHTML(m, idx) {
  const statusHTML = getStatusBadgeHTML(m.status);
  const evidenceLinks = getEvidenceLinksHTML(m.evidence);

  return `
    <div class="journey-card-wrapper">
      <div class="timeline-node-dot"></div>
      <div class="journey-card" data-id="${m.id}" style="cursor: pointer;">
        <div class="card-top-meta">
          <span class="category-badge">${m.category}</span>
          ${statusHTML}
          <span class="card-date">${m.startDate} – ${m.endDate}</span>
        </div>
        <h3 class="card-title">${m.title}</h3>
        <p class="card-desc">${m.shortDescription}</p>

        <!-- Context & Story Breakdown -->
        <div class="growth-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-label">What Happened</span>
            <span class="breakdown-val">${m.whatHappened}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Why It Mattered</span>
            <span class="breakdown-val">${m.whyItMattered}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Key Learning</span>
            <span class="breakdown-val">${m.whatILearned}</span>
          </div>
        </div>

        ${evidenceLinks ? `<div class="card-evidence-bar">${evidenceLinks}</div>` : ''}
      </div>
    </div>
  `;
}

function getStatusBadgeHTML(status) {
  if (status === 'completed') {
    return `<span class="status-badge status-completed"><i class="fa-solid fa-check"></i> Completed</span>`;
  }
  if (status === 'current') {
    return `<span class="status-badge status-current"><span class="status-dot-pulse" style="width: 6px; height: 6px; display: inline-block;"></span> Current</span>`;
  }
  return `<span class="status-badge status-planned"><i class="fa-regular fa-clock"></i> Planned Roadmap</span>`;
}

function getEvidenceLinksHTML(evidence) {
  if (!evidence) return '';
  let html = '';

  if (evidence.links && evidence.links.length > 0) {
    evidence.links.forEach(l => {
      html += `<a href="${l}" target="_blank" class="evidence-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Full Report</a>`;
    });
  }
  if (evidence.github) {
    html += `<a href="${evidence.github}" target="_blank" class="evidence-link"><i class="fa-brands fa-github"></i> GitHub</a>`;
  }
  if (evidence.certificate) {
    html += `<a href="${evidence.certificate}" target="_blank" class="evidence-link"><i class="fa-solid fa-award"></i> Certificate</a>`;
  }
  if (evidence.linkedin) {
    html += `<a href="${evidence.linkedin}" target="_blank" class="evidence-link"><i class="fa-brands fa-linkedin"></i> LinkedIn Post</a>`;
  }
  return html;
}

/* 5. Modal Deep Dive Drawer */
function openMilestoneModal(id) {
  const m = JOURNEY_DATA.milestones.find(item => item.id === id);
  if (!m) return;

  const modal = document.getElementById('journey-modal');
  const content = document.getElementById('modal-content-inner');
  if (!modal || !content) return;

  const statusHTML = getStatusBadgeHTML(m.status);
  const evidenceLinks = getEvidenceLinksHTML(m.evidence);
  const skillPills = m.skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ');

  content.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; items-center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
      <span class="category-badge">${m.category}</span>
      ${statusHTML}
      <span class="card-date" style="font-size: 13px;">${m.startDate} – ${m.endDate}</span>
    </div>
    <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; color: var(--j-text-primary);">${m.title}</h2>
    
    <div style="font-size: 13px; color: var(--j-accent); font-weight: 700; margin-bottom: 16px;">
      <i class="fa-solid fa-building-columns"></i> ${m.organization} · ${m.role} (${m.location})
    </div>

    <p style="font-size: 15px; color: var(--j-text-secondary); line-height: 1.6; margin-bottom: 24px;">${m.fullDescription}</p>

    <div class="growth-breakdown" style="margin-bottom: 24px;">
      <div class="breakdown-item">
        <span class="breakdown-label">Detailed Story</span>
        <span class="breakdown-val">${m.whatHappened}</span>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Strategic Importance</span>
        <span class="breakdown-val">${m.whyItMattered}</span>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Skill & Technical Growth</span>
        <span class="breakdown-val">${m.whatILearned}</span>
      </div>
      <div class="breakdown-item">
        <span class="breakdown-label">Long-Term Impact</span>
        <span class="breakdown-val">${m.impact}</span>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <span class="breakdown-label" style="margin-bottom: 8px;">Associated Technologies & Competencies</span>
      <div class="skill-tags-list">${skillPills}</div>
    </div>

    ${evidenceLinks ? `<div><span class="breakdown-label" style="margin-bottom: 8px;">Verified Evidence & Documents</span><div class="card-evidence-bar">${evidenceLinks}</div></div>` : ''}
  `;

  modal.classList.add('active');
}

function closeMilestoneModal() {
  const modal = document.getElementById('journey-modal');
  if (modal) modal.classList.remove('active');
}

/* 6. Event Listeners Setup */
function setupEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = localStorage.getItem('gkm_theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Filter Buttons
  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.currentStatusFilter = btn.getAttribute('data-status-filter');
      renderJourneyFeed();
    });
  });

  // Modal Close
  const closeBtn = document.getElementById('modal-close-btn');
  const modal = document.getElementById('journey-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeMilestoneModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeMilestoneModal();
    });
  }
}
