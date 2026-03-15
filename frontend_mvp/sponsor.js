// ============================================================
// JUWI Sponsor.js — Talent Scout Dashboard Logic
// ============================================================

// ── Mock Talent Data ──────────────────────────────────────────
// Ranked by individuals (not teams) — code complexity + tech score
let TALENT_DATA = [];

// ── State ─────────────────────────────────────────────────────
let bookmarks = new Set();
let activeFilter = { tier: 'all', search: '', stack: '' };
let selectedId = null;

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'default') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = 'toast';
  if (type === 'success') el.style.background = 'var(--success)';
  if (type === 'danger') el.style.background = 'var(--danger)';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 3500);
}

// ── Fetch Live Hackathon Data from AI Backend ─────────────────
async function fetchTalent() {
  try {
    // We hit the admin teams endpoint so sponsors can scout EVERYONE
    const response = await fetch("http://127.0.0.1:8000/api/admin/teams");
    const data = await response.json();

    if (data.status === "success") {
      // Translate the Team data into "Talent/Scout" metrics!
      TALENT_DATA = data.teams.map((t, index) => {

        // 1. Calculate Tiers based on AI Score
        let calculatedTier = 'rising';
        if (t.score >= 75) calculatedTier = 'elite';
        else if (t.score >= 55) calculatedTier = 'strong';

        // 2. Guess the Stack Category for the filter dropdown
        let cat = 'backend';
        const s = (t.stack || '').toLowerCase();
        if (s.includes('react') || s.includes('vue') || s.includes('js') || s.includes('html')) cat = 'js';
        if (s.includes('python') || s.includes('pytorch') || s.includes('ai') || s.includes('ml')) cat = 'python';
        if (s.includes('flutter') || s.includes('mobile')) cat = 'mobile';

        return {
          id: t.id,
          rank: 0, // Will sort below
          name: t.name,
          college: t.college || 'Web Submission',
          team: 'Hackathon Team',
          primaryStack: t.stack ? t.stack.split(/[,·]/).map(str => str.trim()) : ['Unknown'],

          // --- THE MAGIC: REAL AI SCORES (with fallbacks for older hardcoded data) ---
          complexity: t.complexity_score || Math.max(1, Math.min(5, Math.ceil(t.score / 20))),
          codeScore: t.code_quality || t.score,
          techScore: t.tech_depth || t.score,
          presentScore: t.presentation || t.score,
          total: t.score,

          tier: calculatedTier,
          stackCategory: cat,
          github: t.github || '#',
          role: 'Full Project Team',
          bio: t.abstract || 'Project currently under development in the hackathon.',
          highlights: Array.isArray(t.bullets) && t.bullets.length > 0 ? t.bullets : ['Actively building MVP', 'Pending final review'],
          openTo: ['Sponsorship', 'Hiring', 'Incubation']
        };
      });

      // Sort by score and assign ranks
      TALENT_DATA.sort((a, b) => b.total - a.total);
      TALENT_DATA.forEach((t, i) => t.rank = i + 1);

      updateStats();
      renderTable();
    }
  } catch (err) {
    console.error("Failed to sync live talent", err);
    toast("Error reaching Juwi Backend", "danger");
  }
}

// ── Complexity blocks ─────────────────────────────────────────
function complexityHTML(n) {
  return `<div class="complexity-blocks">${[1, 2, 3, 4, 5].map(i =>
    `<div class="block ${i <= n ? 'filled' : ''}"></div>`
  ).join('')}</div>`;
}

// ── Tier config ───────────────────────────────────────────────
const TIER_CFG = {
  elite: ['badge-accent', '<i class="ti ti-trophy"></i> Elite'],
  strong: ['badge-blue', '<i class="ti ti-star"></i> Strong'],
  rising: ['badge-success', '<i class="ti ti-trending-up"></i> Rising'],
};

// ── Filter & render table ─────────────────────────────────────
function filterTable() {
  activeFilter.search = document.getElementById('searchInput').value.toLowerCase();
  activeFilter.stack = document.getElementById('stackFilter').value;
  renderTable();
}

document.getElementById('tierFilter').addEventListener('click', e => {
  const tab = e.target.closest('.tab-item');
  if (!tab) return;
  document.querySelectorAll('#tierFilter .tab-item').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeFilter.tier = tab.dataset.tier;
  renderTable();
});

function renderTable() {
  let data = TALENT_DATA.filter(t => {
    if (activeFilter.tier !== 'all' && t.tier !== activeFilter.tier) return false;
    if (activeFilter.stack && t.stackCategory !== activeFilter.stack) return false;
    if (activeFilter.search) {
      const hay = `${t.name} ${t.college} ${t.primaryStack.join(' ')} ${t.team}`.toLowerCase();
      if (!hay.includes(activeFilter.search)) return false;
    }
    return true;
  });

  const [cls, label] = ['tier'];
  const tbody = document.getElementById('talentBody');
  tbody.innerHTML = data.map((t, i) => {
    const [cls, label] = TIER_CFG[t.tier];
    const isTop = t.rank <= 3;
    const isBookmarked = bookmarks.has(t.id);
    return `
      <tr style="cursor:pointer;${selectedId === t.id ? 'background:var(--surface-2);' : ''}" onclick="showDetail('${t.id}')">
        <td><div class="rank-num ${isTop ? 'top' : ''}">${t.rank}</div></td>
        <td><strong>${t.name}</strong><br><span style="font-size:.75rem;color:var(--text-3);">${t.team}</span></td>
        <td style="font-size:.875rem;">${t.college}</td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${t.primaryStack.map(s => `<span class="skill-pill">${s}</span>`).join('')}
          </div>
        </td>
        <td>${complexityHTML(t.complexity)}</td>
        <td><span class="badge ${cls}">${label}</span></td>
        <td>
          <button class="bookmark-btn" onclick="event.stopPropagation();toggleBookmark('${t.id}')" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}">
            ${isBookmarked ? '<i class="ti ti-bookmark" style="color:var(--accent);"></i>' : '<i class="ti ti-bookmark-off"></i>'}
          </button>
          <button class="interest-btn ${isBookmarked ? 'active' : ''}" onclick="event.stopPropagation();expressInterest('${t.id}')">
            ${isBookmarked ? '✓ Interested' : 'Express Interest'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">No candidates match your filters.</td></tr>`;
  }
}

// ── Bookmark ──────────────────────────────────────────────────
function toggleBookmark(id) {
  if (bookmarks.has(id)) bookmarks.delete(id);
  else { bookmarks.add(id); toast('Candidate bookmarked!', 'success'); }
  document.getElementById('bookmarked').textContent = bookmarks.size;
  renderTable();
}

function expressInterest(id) {
  const t = TALENT_DATA.find(x => x.id == id);
  bookmarks.add(id);
  document.getElementById('bookmarked').textContent = bookmarks.size;
  renderTable();
  toast(`Interest expressed for ${t.name} — they'll be notified.`, 'success');
}

// ── Detail Panel ──────────────────────────────────────────────
function showDetail(id) {
  try {
    console.log("🖱️ Clicked Team ID:", id); // Debugging

    selectedId = id;
    renderTable(); // Highlights the row

    // 1. Safely find the team using double equals
    const t = TALENT_DATA.find(x => x.id == id);

    // 2. If for some reason it can't find the team, stop here instead of crashing
    if (!t) {
      console.error("❌ Could not find team with ID:", id);
      toast("Error: Team data not found.", "danger");
      return;
    }

    console.log("✅ Found Team Data:", t); // Debugging

    // 3. Safe fallbacks for arrays (This is usually what causes silent crashes!)
    const safeHighlights = Array.isArray(t.highlights) && t.highlights.length > 0
      ? t.highlights
      : ['Actively building MVP', 'Pending final review'];

    const safeStack = Array.isArray(t.primaryStack) ? t.primaryStack : ['Unknown'];
    const safeOpenTo = Array.isArray(t.openTo) ? t.openTo : ['Sponsorship'];

    const [cls, label] = TIER_CFG[t.tier] || ['badge-blue', 'Strong'];

    // 4. Render the HTML
    document.getElementById('detailPanel').innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
        <div>
          <div class="rank-num top" style="margin-bottom:10px;width:44px;height:44px;font-size:1.1rem;">${t.rank || '-'}</div>
          <h3 style="margin-bottom:4px;">${t.name}</h3>
          <p style="font-size:.875rem;">${t.role} · ${t.college}</p>
        </div>
        <span class="badge ${cls}">${label}</span>
      </div>

      <div class="skill-pills" style="margin-bottom:16px;">
        ${safeStack.map(s => `<span class="skill-pill">${s}</span>`).join('')}
      </div>

      <p style="font-size:.875rem;line-height:1.75;color:var(--text-2);margin-bottom:20px;">${t.bio}</p>

      <div class="divider"></div>

      <div style="margin:16px 0;">
        <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:10px;">Code Complexity</p>
        <div style="display:flex;align-items:center;gap:10px;">
          ${complexityHTML(t.complexity || 3)}
          <span style="font-size:.875rem;font-weight:700;color:var(--accent);">${t.codeScore || 50} / 100</span>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        ${[['Code Quality', t.codeScore || 50, '#C17B5C'], ['Tech Depth', t.techScore || 50, '#D4A853'], ['Presentation', t.presentScore || 50, '#7B9E87']].map(([n, v, c]) => `
          <div class="chart-row" style="margin-bottom:10px;">
            <div class="chart-label" style="width:90px;font-size:.8rem;">${n}</div>
            <div class="chart-track"><div class="chart-fill" style="width:${v}%;background:${c};"></div></div>
            <div class="chart-score">${v}</div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <div style="margin-bottom:16px;">
        <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:8px;">Key Highlights</p>
        <ul style="list-style:none;display:grid;gap:6px;">
          ${safeHighlights.map(h => `<li style="font-size:.84rem;color:var(--text-2);display:flex;gap:8px;"><span style="color:var(--accent);">▸</span>${h}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom:20px;">
        <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:8px;">Open To</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${safeOpenTo.map(o => `<span class="badge badge-blue">${o}</span>`).join('')}
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" style="flex:1;" onclick="expressInterest('${t.id}')">
          ${bookmarks.has(t.id) ? '<i class="ti ti-check"></i> Interested' : '<i class="ti ti-briefcase"></i> Express Interest'}
        </button>
        <a href="${t.github !== '#' && !t.github.startsWith('http') ? 'https://' + t.github : t.github}" target="_blank" class="btn btn-outline" style="flex:1;">View GitHub →</a>
      </div>
    `;
  } catch (err) {
    console.error("🔥 CRASH IN showDetail:", err);
    toast("Error rendering profile. Check console.", "danger");
  }
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('totalCandidates').textContent = TALENT_DATA.length;
  document.getElementById('topTier').textContent = TALENT_DATA.filter(t => t.tier === 'elite').length;
}

// ── Init ──────────────────────────────────────────────────────
fetchTalent();
// Automatically refresh the scout board every 10 seconds!
setInterval(fetchTalent, 10000);