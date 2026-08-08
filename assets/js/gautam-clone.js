/**
 * GAUTAM AI CLONE — INTERACTIVE FLOATING CHAT WIDGET & AI ENGINE
 * Author: Gautam Kumar Maurya (gkm563)
 */

class GautamAIClone {
  constructor() {
    this.isOpen = false;
    this.isVoiceEnabled = false;
    this.isThinking = false;
    this.synth = window.speechSynthesis || null;
    this.init();
  }

  init() {
    this.injectDOM();
    this.bindEvents();
    this.renderInitialMessage();
  }

  injectDOM() {
    if (document.getElementById('gkm-clone-root')) return;

    const root = document.createElement('div');
    root.id = 'gkm-clone-root';
    root.innerHTML = `
      <!-- FAB Floating Trigger Button -->
      <div class="gkm-clone-fab" id="gkm-clone-fab" title="Chat with Gautam's AI Clone">
        <div class="gkm-fab-avatar-wrapper">
          <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam AI Clone" class="gkm-fab-avatar">
          <div class="gkm-fab-status-dot"></div>
        </div>
        <div class="gkm-fab-text">
          <span class="gkm-fab-title">Ask Gautam AI</span>
          <span class="gkm-fab-subtitle">Digital Clone · Online</span>
        </div>
      </div>

      <!-- Main Chat Drawer Window -->
      <div class="gkm-clone-window" id="gkm-clone-window">
        <!-- Header -->
        <div class="gkm-clone-header">
          <div class="gkm-header-user">
            <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya" class="gkm-header-avatar">
            <div>
              <div class="gkm-header-name">
                <span>Gautam's AI Clone</span>
                <i class="fa-solid fa-circle-check" style="color: #3B82F6; font-size: 13px;" title="Verified Official Clone"></i>
              </div>
              <div class="gkm-header-role">
                <span class="status-dot-live" style="width: 7px; height: 7px; background: #10B981; border-radius: 50%; display: inline-block;"></span>
                <span>AI Persona · Real-Time Knowledge</span>
              </div>
            </div>
          </div>
          <div class="gkm-header-actions">
            <button class="gkm-header-btn" id="gkm-voice-btn" title="Toggle Voice Text-to-Speech">
              <i class="fa-solid fa-volume-xmark"></i>
            </button>
            <button class="gkm-header-btn" id="gkm-close-btn" title="Close Chat">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Messages Stream -->
        <div class="gkm-clone-messages" id="gkm-clone-messages"></div>

        <!-- Suggested Prompt Chips -->
        <div class="gkm-quick-prompts" id="gkm-quick-prompts">
          <span class="gkm-prompt-chip" data-prompt="Who is Gautam Kumar Maurya?">👋 Who is Gautam?</span>
          <span class="gkm-prompt-chip" data-prompt="Tell me about Gautam's UP Police Cyber Security Internship">🛡️ UP Police Fellowship</span>
          <span class="gkm-prompt-chip" data-prompt="What research did Gautam do at AIT Bangkok?">🇹🇭 AIT Bangkok Fellowship</span>
          <span class="gkm-prompt-chip" data-prompt="Show Gautam's open source Wikimedia & Gerrit contributions">🌐 Open Source Patches</span>
          <span class="gkm-prompt-chip" data-prompt="What are Gautam's academic toppers & awards?">🏆 Topper Awards</span>
          <span class="gkm-prompt-chip" data-prompt="How can I contact or hire Gautam?">✉️ Contact Gautam</span>
        </div>

        <!-- Input Area -->
        <div class="gkm-clone-input-area">
          <input type="text" class="gkm-clone-input" id="gkm-clone-input" placeholder="Ask me anything about Gautam..." autocomplete="off">
          <button class="gkm-send-btn" id="gkm-send-btn" title="Send Message">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  bindEvents() {
    const fab = document.getElementById('gkm-clone-fab');
    const windowEl = document.getElementById('gkm-clone-window');
    const closeBtn = document.getElementById('gkm-close-btn');
    const voiceBtn = document.getElementById('gkm-voice-btn');
    const sendBtn = document.getElementById('gkm-send-btn');
    const input = document.getElementById('gkm-clone-input');
    const promptsContainer = document.getElementById('gkm-quick-prompts');

    fab.addEventListener('click', () => this.toggleWindow());
    closeBtn.addEventListener('click', () => this.toggleWindow(false));

    voiceBtn.addEventListener('click', () => {
      this.isVoiceEnabled = !this.isVoiceEnabled;
      voiceBtn.innerHTML = this.isVoiceEnabled
        ? `<i class="fa-solid fa-volume-high" style="color: #3B82F6;"></i>`
        : `<i class="fa-solid fa-volume-xmark"></i>`;
      if (!this.isVoiceEnabled && this.synth) {
        this.synth.cancel();
      }
    });

    sendBtn.addEventListener('click', () => this.handleSendMessage());

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    promptsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.gkm-prompt-chip');
      if (chip) {
        const promptText = chip.getAttribute('data-prompt');
        input.value = promptText;
        this.handleSendMessage();
      }
    });
  }

    // Also bind any page buttons with class .open-gautam-ai-btn
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.open-gautam-ai-btn, [data-open-gautam-ai]');
      if (openBtn) {
        e.preventDefault();
        this.toggleWindow(true);
      }
    });
  }

  toggleWindow(forceState) {
    const windowEl = document.getElementById('gkm-clone-window');
    if (!windowEl) return;
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      windowEl.classList.add('active');
      const input = document.getElementById('gkm-clone-input');
      if (input) input.focus();
    } else {
      windowEl.classList.remove('active');
      if (this.synth) this.synth.cancel();
    }
  }

  renderInitialMessage() {
    const messagesContainer = document.getElementById('gkm-clone-messages');
    if (!messagesContainer || messagesContainer.children.length > 0) return;

    const greeting = `Hi there! 👋 I am **Gautam's AI Digital Clone**.

I have complete knowledge about Gautam Kumar Maurya's engineering portfolio, research fellowships, academic awards, cyber security work, and open-source contributions.

Feel free to ask me anything or click a topic below!`;

    this.appendMessage('bot', greeting);
  }

  async handleSendMessage() {
    const input = document.getElementById('gkm-clone-input');
    const query = input.value.trim();
    if (!query || this.isThinking) return;

    input.value = '';
    this.appendMessage('user', query);
    this.showTypingIndicator();

    this.isThinking = true;

    try {
      // 1. Try Generative AI Endpoint with timeout
      const aiReply = await this.fetchGenerativeAIReply(query);
      this.hideTypingIndicator();
      this.appendMessage('bot', aiReply);
      if (this.isVoiceEnabled) this.speakText(aiReply);
    } catch (err) {
      console.warn("AI API fallback triggered:", err);
      // 2. Fallback to Local Semantic Intent Matcher
      const localReply = this.getLocalSemanticReply(query);
      this.hideTypingIndicator();
      this.appendMessage('bot', localReply);
      if (this.isVoiceEnabled) this.speakText(localReply);
    } finally {
      this.isThinking = false;
    }
  }

  async fetchGenerativeAIReply(query) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // Try POST request to Pollinations AI API
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: GAUTAM_SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        model: 'openai',
        jsonMode: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`AI API HTTP Error ${response.status}`);
    const text = await response.text();
    if (!text || text.length < 5) throw new Error("Empty AI Response");
    return text.trim();
  }

  getLocalSemanticReply(query) {
    const q = query.toLowerCase();

    // 1. Contact / Phone Number / Email / LinkedIn / Socials (Handles typos like linkeidn, conctact, etc.)
    if (/contact|conctact|phone|number|mobile|call|whatsapp|email|mail|linkedin|linkeidn|linkdin|reach|connect|social/.test(q)) {
      return `✉️ **Gautam's Direct Contact & Social Links**

• **Phone / WhatsApp**: [+91 9125563563](https://api.whatsapp.com/send?phone=919125563563&text=Hi%20Gautam!)
• **LinkedIn**: [linkedin.com/in/gkm563](https://www.linkedin.com/in/gkm563/)
• **Email**: [gkmwin563@gmail.com](mailto:gkmwin563@gmail.com)
• **GitHub**: [github.com/gkm563](https://github.com/gkm563)
• **Medium**: [medium.com/@gkm563](https://medium.com/@gkm563)

Feel free to reach out directly via WhatsApp or Email for collaborations, tech roles, or consulting!`;
    }

    // 2. All Internships / Fellowships / Experience (Handles typos like interhsip, intern, etc.)
    if (/intern|internship|interhsip|fellowship|experience|work|police|amroha|ait|bangkok|thailand/.test(q)) {
      return `🎓 **Gautam's Research Fellowships & Internships**

1. 🛡️ **UP Police Cyber Security Fellowship (APCSIP-2026)**:
   • 15-day government digital investigation fellowship with Amroha Police Cyber Crime Cell (under DSP Anjali Kataria).
   • Handled Digital Forensics, OSINT Reconnaissance, CDR Sorting, and Threat Analysis.
   • **Awarded Best Content Creator Award**. Explore the [UP Police Fellowship Page](up-police-internship.html).

2. 🇹🇭 **AIT Bangkok Global Innovation Internship (GIIP-2026)**:
   • 15-day international research fellowship at Asian Institute of Technology, Pathum Thani, Thailand.
   • Researched Agentic AI, Ubiquitous GIS, Drone Telemetry, and built the **BusSetu Transit Platform** capstone.
   • Read the full daily research logs on the [AIT Bangkok Fellowship Page](ait-global-innovation-internship.html).`;
    }

    // 3. Recent Activity / Latest Updates / Current Work
    if (/recent|activity|latest|update|updates|current|doing|now|news|happen/.test(q)) {
      return `🚀 **Gautam's Recent Activities & Latest Highlights**

• 🇹🇭 **Completed GIIP-2026 Fellowship at AIT Bangkok, Thailand**: Researching Agentic AI, Ubiquitous GIS, and Drone Telemetry.
• 🛡️ **UP Police Cyber Fellowship Award**: Won **Best Content Creator Award** at Amroha Police Cyber Crime Cell.
• 🌐 **MediaWiki Core Production Patches**: Merged 15+ Gerrit patches into MediaWiki Core, UploadWizard, and MinervaNeue skin.
• 🏆 **Vice President Leadership**: Heading events at GeeksforGeeks Student Chapter (UIT Prayagraj).`;
    }

    // 4. Who is Gautam / Bio / Intro
    if (/who|about|intro|bio|gkm|gautam|profile/.test(q)) {
      return `**Gautam Kumar Maurya (gkm563)** is a Full-Stack AI Engineer, Data Scientist, and Cybersecurity Researcher.

Highlights:
• **Rank 1 Academic Scholar**: CSE (Data Science) Branch Topper at UIT Prayagraj & AKTU Rank 5.
• **Vice President**: GeeksforGeeks Student Chapter UIT Prayagraj.
• **Research Fellowships**: AIT Bangkok (Thailand) & UP Police Cyber Crime Cell.
• **Open Source**: 15+ merged production patches in MediaWiki Core (Wikipedia).`;
    }

    // 5. Academic Ranks & Awards
    if (/award|awards|topper|rank|aktu|mnit|up board|school|college|marks|gpa/.test(q)) {
      return `🏆 **Academic Honors & Excellence Awards**

• **AKTU Branch Topper**: 1st Rank in CSE (Data Science) & Rank 5 overall at UIT Prayagraj.
• **MNIT Academic Topper Honor**: Awarded by MNIT Professor for securing **1st Rank (School Academic Topper)** & **100% Attendance**.
• **UP Board District Topper Award**: Honored by the Chairman, Director & Secretary (सचिव - माध्यमिक शिक्षा परिषद्) of UP Board for academic excellence.
• **GSA Mega Event Award**: Honored on stage by Principal Sir, DSW & HODs for co-organizing a 650+ attendee tech conference.`;
    }

    // 6. Projects & Open Source
    if (/project|projects|bussetu|prayagrajrooms|gerrit|wikimedia|mediawiki|patch|code/.test(q)) {
      return `💻 **Top Projects & Open Source Work**

• **BusSetu AI Transit Platform**: AI-assisted public bus navigation & route analytics capstone built at AIT Bangkok.
• **PrayagrajRooms**: Hyper-local student housing discovery portal in Prayagraj.
• **MediaWiki Core Patches**: 15+ merged production commits powering Wikipedia (UploadWizard, MinervaNeue, Pywikibot).`;
    }

    // Smart contextual dynamic fallback (No repetitive static menus!)
    return `Regarding "${query.trim()}": Gautam Kumar Maurya is a **1st Rank CSE Scholar at UIT Prayagraj**, **UP Police Cyber Security Fellow**, **AIT Bangkok Fellow**, and **Open-Source MediaWiki Developer**.

You can reach Gautam directly via **Phone/WhatsApp at [+91 9125563563](https://api.whatsapp.com/send?phone=919125563563)** or **LinkedIn at [linkedin.com/in/gkm563](https://www.linkedin.com/in/gkm563/)**!`;
  }

  appendMessage(sender, text) {
    const messagesContainer = document.getElementById('gkm-clone-messages');
    if (!messagesContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `gkm-msg ${sender}`;

    const avatarSrc = sender === 'bot'
      ? 'assets/images/profile/Gautam_Kumar_Maurya.jpg'
      : 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';

    const formattedText = this.formatMarkdown(text);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      <img src="${avatarSrc}" alt="${sender}" class="gkm-msg-avatar">
      <div>
        <div class="gkm-msg-bubble">${formattedText}</div>
        <span class="gkm-msg-time">${timeStr}</span>
      </div>
    `;

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('gkm-clone-messages');
    if (!messagesContainer) return;
    const typingDiv = document.createElement('div');
    typingDiv.id = 'gkm-typing-indicator';
    typingDiv.className = 'gkm-msg bot';
    typingDiv.innerHTML = `
      <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam AI" class="gkm-msg-avatar">
      <div class="gkm-msg-bubble">
        <div class="gkm-typing-dots">
          <div class="gkm-typing-dot"></div>
          <div class="gkm-typing-dot"></div>
          <div class="gkm-typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('gkm-typing-indicator');
    if (indicator) indicator.remove();
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #3B82F6; text-decoration: underline; font-weight: 600;">$1</a>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  speakText(text) {
    if (!this.synth) return;
    this.synth.cancel();
    const cleanText = text.replace(/[*#_~`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    this.synth.speak(utterance);
  }
}

// Failsafe auto-initialization
function initGautamAI() {
  if (!window.gautamAI) {
    window.gautamAI = new GautamAIClone();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGautamAI);
} else {
  initGautamAI();
}
