/**
 * ai-twin.js — Gautam's AI Twin Engine
 * =====================================
 * Powered by Google Gemini 2.0 Flash (free tier: 1,500 req/day).
 * Reads from window.GKM_KNOWLEDGE (gautam-knowledge.js).
 *
 * Features:
 *  - Real Gemini AI responses (not hardcoded keyword matching)
 *  - Multi-turn conversation memory (last 10 turns)
 *  - Source citations with clickable links
 *  - Hindi + English bilingual support (auto-detects language)
 *  - First-time API key setup via in-chat prompt
 *  - Graceful fallback to legacy keyword matcher if API fails
 */

// ─── Config ────────────────────────────────────────────────────────────────────

const AI_TWIN_CONFIG = {
    MODEL: 'gemini-2.5-flash',
    API_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
    MAX_HISTORY_TURNS: 10,
    STORAGE_KEY_APIKEY: 'gkm-ai-twin-key',
    // Pre-configured API key — works out of the box
    HARDCODED_API_KEY: 'AIzaSyDLBAay_bhs8z81FaX2g5d21RBWM32kWzU',
    TEMPERATURE: 0.75,
    MAX_OUTPUT_TOKENS: 600,
};

// ─── State ─────────────────────────────────────────────────────────────────────

window.AI_TWIN_STATE = {
    conversationHistory: [],
    apiKeyConfirmed: true,
};

// ─── API Key Management ────────────────────────────────────────────────────────

function getStoredApiKey() {
    // Use localStorage override if set, otherwise use the pre-configured key
    return localStorage.getItem(AI_TWIN_CONFIG.STORAGE_KEY_APIKEY) || AI_TWIN_CONFIG.HARDCODED_API_KEY;
}

function saveApiKey(key) {
    localStorage.setItem(AI_TWIN_CONFIG.STORAGE_KEY_APIKEY, key.trim());
}

function clearApiKey() {
    localStorage.removeItem(AI_TWIN_CONFIG.STORAGE_KEY_APIKEY);
}

// ─── System Prompt Builder ─────────────────────────────────────────────────────

function buildSystemPrompt() {
    const K = window.GKM_KNOWLEDGE;
    if (!K) return "You are Gautam Kumar Maurya's AI Twin. Answer questions about him based on your best knowledge.";

    const projectsList = K.projects.map(p =>
        `• ${p.name} (${p.tagline}): ${p.description} — GitHub: ${p.github}${p.live ? ', Live: ' + p.live : ''}`
    ).join('\n');

    const achievementsList = K.achievements.map(a =>
        `• ${a.title}${a.date ? ' (' + a.date + ')' : ''}: ${a.detail} [Source: ${a.source}]`
    ).join('\n');

    const communityList = K.communityRoles.map(c =>
        `• ${c.org} — ${c.role}: ${c.impact} [Source: ${c.source}]`
    ).join('\n');

    const wikiArticlesList = K.openSource.articles.map(a =>
        `• ${a.title} (${a.hindi}) — Link: ${a.link} — Date: ${a.date}`
    ).join('\n');

    const linkedinList = K.linkedinHighlights.map(l =>
        `• ${l.title} (${l.date}, ${l.likes} likes): ${l.summary} — ${l.link}`
    ).join('\n');

    const internshipDays = K.internship.dailyLogs.map(d =>
        `• ${d.day} — ${d.title}: Morning: ${d.morning} | Afternoon: ${d.afternoon} | Learning: ${d.learning}${d.linkedinLog ? ' | LinkedIn: ' + d.linkedinLog : ''}`
    ).join('\n');

    const selectionSteps = K.internship.selectionProcess.join('\n');

    let thailandInternshipDays = "";
    let thailandSelectionSteps = "";
    if (K.thailandInternship) {
        thailandInternshipDays = K.thailandInternship.dailyLogs.map(d =>
            `• ${d.day} — ${d.title}: Morning: ${d.morning} | Afternoon: ${d.afternoon} | Learning: ${d.learning}${d.linkedinLog ? ' | LinkedIn: ' + d.linkedinLog : ''}`
        ).join('\n');
        thailandSelectionSteps = K.thailandInternship.selectionProcess.join('\n');
    }

    return `You are the AI Twin of Gautam Kumar Maurya (GKM). You speak AS Gautam in first person ("I", "my", "me").

## Who I am
${K.identity.bio}

Full Name: ${K.identity.fullName} | Username: ${K.identity.username}
Email: ${K.identity.email} | Location: ${K.identity.location}
College: ${K.identity.college} | Degree: ${K.identity.degree}
University: ${K.identity.university} | LinkedIn Followers: ${K.identity.linkedinFollowers}

## My Online Profiles (ALWAYS cite these as sources)
- 🌐 Portfolio: ${K.sources.portfolio}
- 💻 GitHub: ${K.sources.github}
- 💼 LinkedIn: ${K.sources.linkedin}
- 🔵 GDG Profile: ${K.sources.gdg}
- 📖 Wikipedia: ${K.sources.wikipedia}
- 🚔 UP Police Internship Page: ${K.sources.upPoliceInternship}
- 🇹🇭 Thailand AIT Internship Page: ${K.sources.thailandInternship}
- ✉️ Email: ${K.contact.email}

## My Projects (with GitHub & live links)
${projectsList}

## My Achievements & Wins
${achievementsList}

## My Community Roles & Leadership
${communityList}

## My Technical Skills
Frontend: ${K.skills.frontend.join(', ')}
Backend: ${K.skills.backend.join(', ')}
AI/ML & Cybersecurity: ${K.skills.aiml.join(', ')}
DevOps & Tools: ${K.skills.devops.join(', ')}
Languages: ${K.skills.languages.join(', ')}

## My Open Source Contributions (Wikipedia)
Summary: ${K.openSource.summary}
Wikipedia Username: ${K.openSource.wikiUsername}
Wikipedia Profile: ${K.openSource.wikiProfile}
Stats: ${K.openSource.stats.articlesContributed} articles, ${K.openSource.stats.patchesMerged} patches merged, ${K.openSource.stats.contestsJoined} contests

Articles I contributed to (Hindi Wikipedia) with links:
${wikiArticlesList}

Review Pipeline I use: ${K.openSource.tools.join(', ')}

## My Internship 1 — APCSIP-2026 (UP Police Cybersecurity Cell)
Full Name: ${K.internship.fullName}
Organization: ${K.internship.organization}
Venue: ${K.internship.venue}
Duration: ${K.internship.duration} | Arrival: ${K.internship.arrivalDate}
Full Internship Page: ${K.internship.detailsPage}

Selection Process (how I got in):
${selectionSteps}

Day-by-Day Logs:
${internshipDays}

Tools I used during internship: ${K.internship.toolsStudied.join(', ')}
Topics covered: ${K.internship.topicsLearned.join(', ')}

## My Internship 2 — GIIP-2026 (Global Innovation at AIT Bangkok, Thailand)
Full Name: ${K.thailandInternship.fullName}
Organization: ${K.thailandInternship.organization}
Venue: ${K.thailandInternship.venue}
Duration: ${K.thailandInternship.duration}
Full Internship Page: ${K.thailandInternship.detailsPage}

Selection Process (how I got in):
${thailandSelectionSteps}

Day-by-Day Logs:
${thailandInternshipDays}

Tools/Topics studied: ${K.thailandInternship.topicsLearned.join(', ')}

## My LinkedIn Posts (Real highlights)
${linkedinList}

## My Services
${K.services.join(', ')}

## Education
${K.education.current.institution} | ${K.education.current.degree} | ${K.education.current.university}
Duration: ${K.education.current.duration} | Academic rank: ${K.education.current.rank}

## Contact
Email: ${K.contact.email} | LinkedIn: ${K.contact.linkedin} | GitHub: ${K.contact.github}

---

## YOUR RULES (follow ALL strictly):
1. Always reply in the SAME language the user writes in. Hindi → Hindi. English → English. Hinglish → Hinglish.
2. Speak in FIRST PERSON as Gautam ("I built...", "My project...", "I won...").
3. At the end of EVERY response, include a "📌 Sources:" section with 1-3 most relevant clickable links, formatted as: [Label](URL)
4. Be warm, enthusiastic, and specific — use real data (ranks, dates, project names, tech stacks, day numbers from internship, Wikipedia article titles).
5. Format with **bold** for key terms, project names, achievements.
6. For internship questions, reference specific day numbers and topics (e.g., "On Day 2, I learned OSINT...").
7. For Wikipedia questions, cite the specific article titles and links.
8. If unsure about something, say so honestly and direct to email or LinkedIn.
9. Keep answers concise but rich — 4-8 sentences + the 📌 Sources line.`;
}

// ─── Gemini API Call ───────────────────────────────────────────────────────────

async function callGeminiAPI(apiKey, conversationHistory, systemPrompt) {
    const url = `${AI_TWIN_CONFIG.API_BASE}/${AI_TWIN_CONFIG.MODEL}:generateContent?key=${apiKey}`;

    const body = {
        system_instruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: conversationHistory,
        generationConfig: {
            temperature: AI_TWIN_CONFIG.TEMPERATURE,
            maxOutputTokens: AI_TWIN_CONFIG.MAX_OUTPUT_TOKENS,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
}

// ─── Response Formatter ────────────────────────────────────────────────────────

function formatAIResponse(rawText) {
    // Convert markdown to HTML for chat bubbles
    let html = rawText
        // Bold: **text**
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic: *text*
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Convert [Label](URL) to <a> tags
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#0ea5e9;font-weight:600;text-decoration:underline;">$1</a>')
        // Bullet points: • or -
        .replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul style="margin:0.5rem 0 0.5rem 1rem;padding:0;list-style:disc;">$1</ul>')
        // Newlines to <br>
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

    // Style the sources section
    html = html.replace(
        /📌\s*Sources?:/gi,
        '<div style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.1);font-size:0.8rem;color:#94a3b8;">📌 <strong>Sources:</strong>'
    );

    // If the sources section was replaced, close the div
    if (html.includes('📌 <strong>Sources:</strong>') && !html.includes('</div>')) {
        html += '</div>';
    } else if (html.includes('📌 <strong>Sources:</strong>')) {
        // Close the div at the end
        const idx = html.lastIndexOf('📌 <strong>Sources:</strong>');
        const afterSources = html.substring(idx);
        // Add a closing div if not present
        if (!afterSources.includes('</div>')) {
            html = html.slice(0, idx) + html.slice(idx) + '</div>';
        }
    }

    return html;
}

// ─── Main Entry Point ──────────────────────────────────────────────────────────

async function getAIResponse(userMessage) {
    const state = window.AI_TWIN_STATE;
    const K = window.GKM_KNOWLEDGE;

    // ── Get API key (hardcoded or from localStorage override) ──
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        return formatAIResponse(`❌ API key missing. Please contact Gautam at [maurgk212104@gmail.com](mailto:maurgk212104@gmail.com).`);
    }

    // ── Add user message to history ──
    state.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    // ── Trim history to max turns ──
    const maxMessages = AI_TWIN_CONFIG.MAX_HISTORY_TURNS * 2;
    if (state.conversationHistory.length > maxMessages) {
        state.conversationHistory = state.conversationHistory.slice(-maxMessages);
    }

    // ── Build system prompt ──
    const systemPrompt = buildSystemPrompt();

    try {
        // ── Call Gemini ──
        const rawText = await callGeminiAPI(apiKey, state.conversationHistory, systemPrompt);

        if (!rawText) throw new Error('Empty response from Gemini');

        // ── Add model response to history ──
        state.conversationHistory.push({
            role: 'model',
            parts: [{ text: rawText }]
        });

        return formatAIResponse(rawText);

    } catch (err) {
        console.error('[AI Twin] Gemini API error:', err.message);
        state.conversationHistory.pop();

        if (err.message.includes('QUOTA_EXCEEDED') || err.message.includes('quota')) {
            return `<span style="color:#fbbf24;">⚡ Daily API quota reached.</span> The free tier resets every 24 hours. Meanwhile, feel free to <a href="mailto:${K?.identity?.email || 'maurgk212104@gmail.com'}" style="color:#0ea5e9;font-weight:600;">contact Gautam via Email</a> or visit his <a href="${K?.sources?.github || 'https://github.com/gkm563'}" target="_blank" style="color:#0ea5e9;font-weight:600;">GitHub profile</a>!`;
        }

        // ── Fallback to legacy keyword matcher ──
        console.warn('[AI Twin] Falling back to legacy keyword matcher');
        if (typeof getChatResponse === 'function') {
            return getChatResponse(userMessage);
        }
        return formatAIResponse(`I'm having a quick technical hiccup! You can reach Gautam directly at [maurgk212104@gmail.com](mailto:maurgk212104@gmail.com) or on [GitHub](${K?.sources?.github || 'https://github.com/gkm563'}).\n\n📌 Sources: [Portfolio](https://gkm563.github.io) · [GitHub](https://github.com/gkm563)`);
    }
}

// ─── Expose reset function for debugging ──────────────────────────────────────

window.AI_TWIN_RESET = function() {
    clearApiKey();
    window.AI_TWIN_STATE.conversationHistory = [];
    window.AI_TWIN_STATE.isWaitingForKey = false;
    console.log('[AI Twin] Reset complete. Key cleared, history cleared.');
};
