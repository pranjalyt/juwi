// ============================================================
// JUWI Sponsor.js — Talent Scout Dashboard Logic
// ============================================================

// ── Mock Talent Data ──────────────────────────────────────────
// Ranked by individuals (not teams) — code complexity + tech score
const TALENT_DATA = [
  {
    id: 1, rank: 1, name: 'Aditya Sharma', college: 'IIT Delhi', team: 'Null Pointers',
    primaryStack: ['Rust', 'Next.js', 'PostgreSQL'],
    complexity: 5, codeScore: 94, techScore: 91, presentScore: 72, total: 257,
    tier: 'elite',
    stackCategory: 'backend',
    github: 'github.com/adityasharma',
    role: 'Full-stack Lead',
    bio: 'Built a zero-copy event streaming engine in Rust for their hackathon project. Rare low-level programming skills for a 3rd-year student. Contributions visible across 14 repos.',
    highlights: ['Authored a custom B-tree in Rust from scratch', 'Zero-dependency WebSocket server in Go', 'Contributed to a 1k-star OSS project'],
    openTo: ['Full-time', 'Internship', 'Freelance'],
  },
  {
    id: 2, rank: 2, name: 'Priya Anand', college: 'IIT Kanpur', team: 'Quantum Leap',
    primaryStack: ['PyTorch', 'FastAPI', 'Next.js'],
    complexity: 5, codeScore: 91, techScore: 95, presentScore: 80, total: 266,
    tier: 'elite',
    stackCategory: 'python',
    github: 'github.com/priyanand',
    role: 'ML Research Lead',
    bio: 'Implemented a custom transformer attention layer from scratch — no Hugging Face. The model hit 89% F1 on a custom dataset within 24 hours. First-year PhD track student.',
    highlights: ['Custom transformer written in NumPy + PyTorch', 'Published a Paper at NeurIPS workshop', 'Fine-tuned LLaMA-3.2 on 8GB VRAM'],
    openTo: ['Research Role', 'Internship'],
  },
  {
    id: 3, rank: 3, name: 'Rohan Mehta', college: 'RKGIT', team: 'Team Rocket',
    primaryStack: ['React', 'FastAPI', 'OpenAI API'],
    complexity: 4, codeScore: 85, techScore: 82, presentScore: 88, total: 255,
    tier: 'strong',
    stackCategory: 'js',
    github: 'github.com/rohanmehta',
    role: 'Frontend Lead',
    bio: 'Built a fully custom design system for the hackathon in under 6 hours. React components are well-typed with TypeScript, accessible, and test-covered. Eye for detail.',
    highlights: ['Custom component library (Zero Tailwind)', 'Lighthouse score: 98 performance', 'Implemented real-time collaboration via CRDTs'],
    openTo: ['Full-time', 'Internship'],
  },
  {
    id: 4, rank: 4, name: 'Sneha Kapoor', college: 'NIT Agra', team: 'Kernel Panic',
    primaryStack: ['Go', 'gRPC', 'React'],
    complexity: 4, codeScore: 83, techScore: 86, presentScore: 70, total: 239,
    tier: 'strong',
    stackCategory: 'backend',
    github: 'github.com/snehakapoor',
    role: 'Backend Architect',
    bio: 'Architected a multi-service gRPC backend in Go that handled 10k req/s in a local load test. Clean separation of concerns, good DI patterns. Quiet contributor, massive output.',
    highlights: ['gRPC service mesh with health checks', 'Redis-backed session management', 'Custom CI/CD pipeline in GitHub Actions'],
    openTo: ['Full-time', 'Internship'],
  },
  {
    id: 5, rank: 5, name: 'Aryan Dubey', college: 'RKGIT', team: 'ByteForce',
    primaryStack: ['Vue.js', 'Django', 'TensorFlow'],
    complexity: 4, codeScore: 79, techScore: 77, presentScore: 84, total: 240,
    tier: 'strong',
    stackCategory: 'python',
    github: 'github.com/aryandubey',
    role: 'Product & AI Dev',
    bio: 'Strong product instinct. Trained a CNN-based disease classifier that works offline on mobile. Django REST API is clean but needs error handling. Great communicator.',
    highlights: ['TFLite model < 4MB', 'Offline-first mobile app', 'Shipped 3 projects in the past 6 months'],
    openTo: ['Internship', 'Part-time'],
  },
  {
    id: 6, rank: 6, name: 'Ishaan Malhotra', college: 'AKTU', team: 'AlgoAlchemists',
    primaryStack: ['Flutter', 'Firebase', 'TFLite'],
    complexity: 3, codeScore: 71, techScore: 68, presentScore: 82, total: 221,
    tier: 'rising',
    stackCategory: 'mobile',
    github: 'github.com/ishaanmalhotra',
    role: 'Mobile Dev',
    bio: 'First hackathon. Built a functional sign-language translator on Flutter. The core idea is compelling and the execution is solid for a beginner. High-growth trajectory.',
    highlights: ['First public GitHub project', 'Clean Flutter architecture', 'Self-taught in 8 months'],
    openTo: ['Internship'],
  },
  {
    id: 7, rank: 7, name: 'Kavya Nair', college: 'GLA Univ', team: 'The Debuggers',
    primaryStack: ['Spring Boot', 'Angular', 'MySQL'],
    complexity: 3, codeScore: 68, techScore: 65, presentScore: 60, total: 193,
    tier: 'rising',
    stackCategory: 'backend',
    github: 'github.com/kavyanair',
    role: 'Backend Dev',
    bio: 'Solid understanding of Spring Boot patterns. Code is somewhat verbose but structured. Has more potential than the final project score suggests — team dynamics held her back.',
    highlights: ['JWT authentication from scratch', 'REST API with proper versioning', 'Good test coverage (76%)'],
    openTo: ['Internship'],
  },
  {
    id: 8, rank: 8, name: 'Dev Patel', college: 'AKTU', team: 'Stack Overflow',
    primaryStack: ['JavaScript', 'HTML/CSS', 'localStorage'],
    complexity: 2, codeScore: 55, techScore: 50, presentScore: 78, total: 183,
    tier: 'rising',
    stackCategory: 'js',
    github: 'github.com/devpatel',
    role: 'Frontend Dev',
    bio: 'Excellent UI instincts. Produced a polished mental health app with vanilla JS. Limited backend experience, but the front-end work is surprisingly mature for someone with no framework.',
    highlights: ['Zero-dependency mood tracking chart', 'Accessible UI (WCAG 2.1 AA)', 'Clean semantic HTML structure'],
    openTo: ['Internship'],
  },
];

// ── State ─────────────────────────────────────────────────────
let bookmarks   = new Set();
let activeFilter = { tier: 'all', search: '', stack: '' };
let selectedId  = null;

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'default') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  if (type === 'success') el.style.background = 'var(--success)';
  if (type === 'danger')  el.style.background = 'var(--danger)';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 3500);
}

// ── Complexity blocks ─────────────────────────────────────────
function complexityHTML(n) {
  return `<div class="complexity-blocks">${[1,2,3,4,5].map(i =>
    `<div class="block ${i <= n ? 'filled' : ''}"></div>`
  ).join('')}</div>`;
}

// ── Tier config ───────────────────────────────────────────────
const TIER_CFG = {
  elite:  ['badge-accent',  '<i class="ti ti-trophy"></i> Elite'],
  strong: ['badge-blue',    '<i class="ti ti-star"></i> Strong'],
  rising: ['badge-success', '<i class="ti ti-trending-up"></i> Rising'],
};

// ── Filter & render table ─────────────────────────────────────
function filterTable() {
  activeFilter.search = document.getElementById('searchInput').value.toLowerCase();
  activeFilter.stack  = document.getElementById('stackFilter').value;
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
    if (activeFilter.stack && t.stackCategory !== activeFilter.stack)  return false;
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
      <tr style="cursor:pointer;${selectedId===t.id?'background:var(--surface-2);':''}" onclick="showDetail(${t.id})">
        <td><div class="rank-num ${isTop?'top':''}">${t.rank}</div></td>
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
          <button class="bookmark-btn" onclick="event.stopPropagation();toggleBookmark(${t.id})" title="${isBookmarked?'Remove bookmark':'Bookmark'}">
            ${isBookmarked ? '<i class="ti ti-bookmark" style="color:var(--accent);"></i>' : '<i class="ti ti-bookmark-off"></i>'}
          </button>
          <button class="interest-btn ${isBookmarked?'active':''}" onclick="event.stopPropagation();expressInterest(${t.id})">
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
  const t = TALENT_DATA.find(x => x.id === id);
  bookmarks.add(id);
  document.getElementById('bookmarked').textContent = bookmarks.size;
  renderTable();
  toast(`Interest expressed for ${t.name} — they'll be notified.`, 'success');
}

// ── Detail Panel ──────────────────────────────────────────────
function showDetail(id) {
  selectedId = id;
  renderTable();
  const t  = TALENT_DATA.find(x => x.id === id);
  const [cls, label] = TIER_CFG[t.tier];
  document.getElementById('detailPanel').innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
      <div>
        <div class="rank-num top" style="margin-bottom:10px;width:44px;height:44px;font-size:1.1rem;">${t.rank}</div>
        <h3 style="margin-bottom:4px;">${t.name}</h3>
        <p style="font-size:.875rem;">${t.role} · ${t.college}</p>
      </div>
      <span class="badge ${cls}">${label}</span>
    </div>

    <div class="skill-pills" style="margin-bottom:16px;">
      ${t.primaryStack.map(s => `<span class="skill-pill">${s}</span>`).join('')}
    </div>

    <p style="font-size:.875rem;line-height:1.75;color:var(--text-2);margin-bottom:20px;">${t.bio}</p>

    <div class="divider"></div>

    <div style="margin:16px 0;">
      <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:10px;">Code Complexity</p>
      <div style="display:flex;align-items:center;gap:10px;">
        ${complexityHTML(t.complexity)}
        <span style="font-size:.875rem;font-weight:700;color:var(--accent);">${t.codeScore} / 100</span>
      </div>
    </div>

    <!-- Score bars -->
    <div style="margin-bottom:16px;">
      ${[['Code Quality', t.codeScore,'#C17B5C'],['Tech Depth', t.techScore,'#D4A853'],['Presentation', t.presentScore,'#7B9E87']].map(([n,v,c]) => `
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
        ${t.highlights.map(h => `<li style="font-size:.84rem;color:var(--text-2);display:flex;gap:8px;"><span style="color:var(--accent);">▸</span>${h}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom:20px;">
      <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:8px;">Open To</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${t.openTo.map(o => `<span class="badge badge-blue">${o}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" style="flex:1;" onclick="expressInterest(${t.id})">
        ${bookmarks.has(t.id) ? '<i class="ti ti-check"></i> Interested' : '<i class="ti ti-briefcase"></i> Express Interest'}
      </button>
      <a href="https://${t.github}" target="_blank" class="btn btn-outline" style="flex:1;">View GitHub →</a>
    </div>
  `;
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('totalCandidates').textContent = TALENT_DATA.length;
  document.getElementById('topTier').textContent = TALENT_DATA.filter(t => t.tier === 'elite').length;
}

// ── Init ──────────────────────────────────────────────────────
updateStats();
renderTable();
