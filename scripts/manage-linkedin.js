#!/usr/bin/env node
/**
 * manage-linkedin.js
 * ==================
 * A local Node.js CLI tool to manage your portfolio's LinkedIn posts.
 * No paid APIs. No scraping risks. 100% in your control.
 *
 * Usage:
 *   node scripts/manage-linkedin.js
 *
 * Features:
 *   1. Add a post manually (type text + details in the terminal)
 *   2. List all current posts
 *   3. Delete a post by ID
 *   4. Auto-translate English text to Hindi using the free Google Translate API
 *
 * The script writes directly to assets/data/linkedin.json
 */

const fs   = require('fs');
const path = require('path');
const http = require('https');
const readline = require('readline');

const DB_PATH = path.join(__dirname, '..', 'assets', 'data', 'linkedin.json');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function loadDB() {
    if (!fs.existsSync(DB_PATH)) {
        return { en: [], hi: [] };
    }
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch {
        console.error('❌ Error reading linkedin.json. File may be corrupt.');
        process.exit(1);
    }
}

function saveDB(data) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(existingPosts) {
    const maxId = existingPosts.reduce((max, p) => {
        const num = parseInt((p.id || '').replace('li-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `li-${maxId + 1}`;
}

function categorize(text) {
    const t = text.toLowerCase();
    if (t.includes('earn') || t.includes('freelance') || t.includes('salary') || t.includes('revenue') || t.includes('paid')) return 'Earnings';
    if (t.includes('hack') || t.includes('competition') || t.includes('contest') || t.includes('buildx')) return 'Hackathons';
    if (t.includes('rank') || t.includes('award') || t.includes('won') || t.includes('prize') || t.includes('topper') || t.includes('1st place')) return 'Achievements';
    if (t.includes('event') || t.includes('conference') || t.includes('meetup') || t.includes('iit') || t.includes('college')) return 'Events';
    if (t.includes('behind') || t.includes('bts') || t.includes('behind the scenes') || t.includes('late night')) return 'Behind the Scenes';
    return 'Events';
}

// ─── Google Translate (free unofficial endpoint) ───────────────────────────────

function translateToHindi(text) {
    return new Promise((resolve) => {
        const encoded = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encoded}`;

        http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(raw);
                    const translated = json[0].map(seg => seg[0]).join('');
                    resolve(translated);
                } catch {
                    console.warn('⚠️  Translation failed, using English text as fallback.');
                    resolve(text);
                }
            });
        }).on('error', () => {
            console.warn('⚠️  No internet for translation. Using English text as fallback.');
            resolve(text);
        });
    });
}

// ─── Interactive Prompts ────────────────────────────────────────────────────────

function ask(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}

function printSeparator() {
    console.log('\n' + '─'.repeat(60) + '\n');
}

// ─── Commands ──────────────────────────────────────────────────────────────────

async function addPost(rl) {
    printSeparator();
    console.log('📝  ADD A NEW LINKEDIN POST\n');

    const db = loadDB();

    const text = await ask(rl, 'Paste the full post text (press Enter twice when done):\n> ');
    if (!text.trim()) { console.log('❌ Empty post. Aborting.'); return; }

    const dateRaw = await ask(rl, '\nDate (e.g. June 26, 2026) [leave blank = today]: ');
    const date = dateRaw.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const linkRaw = await ask(rl, '\nLinkedIn post URL [leave blank = profile link]: ');
    const link = linkRaw.trim() || 'https://www.linkedin.com/in/gkm563';

    const likesRaw = await ask(rl, '\nLike count [default 0]: ');
    const commentsRaw = await ask(rl, 'Comment count [default 0]: ');

    const likes = parseInt(likesRaw) || 0;
    const comments = parseInt(commentsRaw) || 0;

    const category = categorize(text);
    console.log(`\n🏷️  Auto-detected category: "${category}"`);
    const catOverride = await ask(rl, 'Override category? (Earnings / Hackathons / Achievements / Events / Behind the Scenes) [leave blank to accept]: ');
    const finalCategory = catOverride.trim() || category;

    const id = generateId(db.en);
    const title = text.split('\n')[0].substring(0, 90) + (text.length > 90 ? '...' : '');

    const enPost = { id, title, text: text.trim(), date, category: finalCategory, image: null, link, stats: { likes, comments } };

    console.log('\n🌐  Translating to Hindi...');
    const hiText  = await translateToHindi(text.trim());
    const hiTitle = hiText.split('\n')[0].substring(0, 90) + (hiText.length > 90 ? '...' : '');
    const hiDate  = await translateToHindi(date);

    const hiPost = { id, title: hiTitle, text: hiText, date: hiDate, category: finalCategory, image: null, link, stats: { likes, comments } };

    // Prepend so newest posts appear first
    db.en.unshift(enPost);
    db.hi.unshift(hiPost);

    saveDB(db);
    console.log(`\n✅  Post "${title}" added successfully (ID: ${id})!`);
    console.log(`   Saved to: ${DB_PATH}`);
}

function listPosts(db) {
    printSeparator();
    console.log('📋  CURRENT LINKEDIN POSTS\n');
    if (db.en.length === 0) {
        console.log('No posts yet. Use option 1 to add one!');
        return;
    }
    db.en.forEach((p, i) => {
        console.log(`  [${i + 1}] ID: ${p.id}  |  Category: ${p.category}  |  Date: ${p.date}`);
        console.log(`      "${p.title.substring(0, 70)}..."\n`);
    });
}

async function deletePost(rl, db) {
    printSeparator();
    listPosts(db);
    const input = await ask(rl, '\nEnter the Post ID to delete (e.g. li-3), or press Enter to cancel: ');
    const id = input.trim();
    if (!id) { console.log('Cancelled.'); return; }

    const enBefore = db.en.length;
    db.en = db.en.filter(p => p.id !== id);
    db.hi = db.hi.filter(p => p.id !== id);

    if (db.en.length === enBefore) {
        console.log(`❌  No post found with ID "${id}".`);
    } else {
        saveDB(db);
        console.log(`✅  Post "${id}" deleted successfully.`);
    }
}

// ─── Main Menu ─────────────────────────────────────────────────────────────────

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    printSeparator();
    console.log('🔗  GKM Portfolio — LinkedIn Post Manager');
    console.log('   (No Juicer. No paid API. Fully local & bilingual.)\n');

    const db = loadDB();
    console.log(`   Currently stored: ${db.en.length} post(s) in linkedin.json`);

    printSeparator();
    console.log('  1. ➕  Add a new post (with auto Hindi translation)');
    console.log('  2. 📋  List all posts');
    console.log('  3. 🗑️   Delete a post by ID');
    console.log('  4. ❌  Exit\n');

    const choice = await ask(rl, 'Choose an option (1-4): ');

    switch (choice.trim()) {
        case '1':
            await addPost(rl);
            break;
        case '2':
            listPosts(db);
            break;
        case '3':
            await deletePost(rl, db);
            break;
        default:
            console.log('👋  Exiting. Your portfolio stays fresh!');
    }

    rl.close();
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
