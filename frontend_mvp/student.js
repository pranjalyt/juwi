// ============================================================
// JUWI Student.js — Student Portal Logic
// ============================================================

// ── Palette definitions ───────────────────────────────────────
const PALETTES = {
  warm:     { from: '#C17B5C', to: '#D4A853', text: '#fff' },
  ocean:    { from: '#5C7BC1', to: '#5FAD8A', text: '#fff' },
  midnight: { from: '#1c1c1e', to: '#5C7BC1', text: '#fff' },
  rose:     { from: '#C15C8A', to: '#D4A853', text: '#fff' },
  forest:   { from: '#4A7C59', to: '#A3B899', text: '#fff' },
};

const CHART_COLORS = ['#C17B5C','#D4A853','#7B9E87','#5C7BC1','#C15C8A'];

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'default') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  if (type === 'success') el.style.background = 'var(--success)';
  if (type === 'danger')  el.style.background = 'var(--danger)';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 3800);
}

// ── Confetti ──────────────────────────────────────────────────
function fireConfetti() {
  const colors = ['#C17B5C','#D4A853','#7B9E87','#5C7BC1','#C15C8A','#fff','#D4A853'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.cssText = `
      left: ${Math.random()*100}vw;
      width: ${Math.random()*10+6}px;
      height: ${Math.random()*10+6}px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration: ${Math.random()*2+2.5}s;
      animation-delay: ${Math.random()*1.2}s;
      opacity: ${Math.random()*.6+.4};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

// ── State ─────────────────────────────────────────────────────
let currentStep = 1;
const formData = {};

// ── Main router ───────────────────────────────────────────────
function init() {
  const submitted = localStorage.getItem('juwi_student_submission');
  const unlock    = localStorage.getItem('juwi_unlock');
  const isUnlocked = unlock && new Date(unlock) <= new Date();

  if (isUnlocked && submitted) {
    renderResults(JSON.parse(submitted));
  } else if (submitted) {
    renderLockedState(unlock);
  } else {
    renderForm();
  }
}

// ── SUBMISSION FORM ───────────────────────────────────────────
function renderForm() {
  document.getElementById('mainWrap').innerHTML = `
    <div style="max-width:680px;margin:0 auto;">
      <div class="section-header mb-32">
        <h2>Submit Your Project</h2>
        <p>Fill in your details to register your team for AI-augmented judging.</p>
      </div>
      <div class="step-bar">
        <div class="step done" id="s1"></div>
        <div class="step"      id="s2"></div>
        <div class="step"      id="s3"></div>
      </div>
      <!-- Step 1 -->
      <div id="step-1" class="card reveal">
        <h3 class="mb-24"><i class="ti ti-users"></i> Team Information</h3>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Your Full Name</label>
            <input id="f-name" type="text" class="form-control" placeholder="e.g. Priya Sharma">
          </div>
          <div class="form-group">
            <label class="form-label">Team Name</label>
            <input id="f-team" type="text" class="form-control" placeholder="e.g. Team Rocket">
          </div>
          <div class="form-group">
            <label class="form-label">College / Institution</label>
            <input id="f-college" type="text" class="form-control" placeholder="e.g. RKGIT, Ghaziabad">
          </div>
          <div class="form-group">
            <label class="form-label">Contact Email</label>
            <input id="f-email" type="email" class="form-control" placeholder="you@college.edu">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Team Members (comma-separated)</label>
          <input id="f-members" type="text" class="form-control" placeholder="Alice, Bob, Carol">
        </div>
        <button class="btn btn-primary" onclick="goStep(2)">Continue → Team Project</button>
      </div>
      <!-- Step 2 -->
      <div id="step-2" class="card reveal" style="display:none;">
        <h3 class="mb-24"><i class="ti ti-folder-open"></i> Project Submission</h3>
        <div class="form-group">
          <label class="form-label">Project Title</label>
          <input id="f-title" type="text" class="form-control" placeholder="What did you build?">
        </div>
        <div class="form-group">
          <label class="form-label">GitHub Repository URL</label>
          <input id="f-github" type="url" class="form-control" placeholder="https://github.com/team/project">
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack (comma-separated)</label>
          <input id="f-stack" type="text" class="form-control" placeholder="React, FastAPI, PostgreSQL">
        </div>
        <div class="form-group">
          <label class="form-label">Abstract (250–500 words)</label>
          <textarea id="f-abstract" class="form-control" rows="6" placeholder="Describe your project, the problem it solves, your approach, and key achievements…"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">PPT / Presentation</label>
          <div class="upload-zone" id="pptZone" onclick="document.getElementById('f-ppt').click();" ondragover="handleDrag(event,'pptZone')" ondragleave="clearDrag('pptZone')" ondrop="handleDrop(event,'pptZone','f-ppt')">
            <div class="upload-icon"><i class="ti ti-presentation"></i></div>
            <p><strong>Click to upload</strong> or drag & drop your PPT/PDF</p>
            <p>Max 50 MB</p>
          </div>
          <input type="file" id="f-ppt" accept=".ppt,.pptx,.pdf" style="display:none;" onchange="fileSelected('pptZone', this)">
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="goStep(1)">← Back</button>
          <button class="btn btn-primary" onclick="goStep(3)">Continue → Review</button>
        </div>
      </div>
      <!-- Step 3 -->
      <div id="step-3" class="card reveal" style="display:none;">
        <h3 class="mb-24"><i class="ti ti-circle-check"></i> Review &amp; Submit</h3>
        <div id="review-summary" style="background:var(--surface-2);border-radius:var(--radius-sm);padding:20px;margin-bottom:20px;"></div>
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:.875rem;margin-bottom:20px;">
          <input type="checkbox" id="f-terms" style="accent-color:var(--accent);width:16px;height:16px;margin-top:2px;">
          I confirm that all submitted work is original and my team's own effort.
        </label>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="goStep(2)">← Back</button>
          <button class="btn btn-accent btn-lg" onclick="submitForm()"><i class="ti ti-rocket"></i> Submit Project</button>
        </div>
      </div>
    </div>
  `;
}

function goStep(n) {
  if (n === 2) {
    if (!document.getElementById('f-name').value.trim() ||
        !document.getElementById('f-team').value.trim() ||
        !document.getElementById('f-college').value.trim()) {
      toast('Please fill in all team info fields.', 'danger'); return;
    }
    formData.name    = document.getElementById('f-name').value.trim();
    formData.team    = document.getElementById('f-team').value.trim();
    formData.college = document.getElementById('f-college').value.trim();
    formData.email   = document.getElementById('f-email').value.trim();
    formData.members = document.getElementById('f-members').value.trim();
  }
  if (n === 3) {
    if (!document.getElementById('f-title').value.trim() ||
        !document.getElementById('f-github').value.trim() ||
        !document.getElementById('f-abstract').value.trim()) {
      toast('Please complete all project fields.', 'danger'); return;
    }
    formData.title    = document.getElementById('f-title').value.trim();
    formData.github   = document.getElementById('f-github').value.trim();
    formData.stack    = document.getElementById('f-stack').value.trim();
    formData.abstract = document.getElementById('f-abstract').value.trim();
    // Build review
    document.getElementById('review-summary').innerHTML = `
      <div style="display:grid;gap:10px;">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);">Team</span>
          <span style="font-weight:600;">${formData.team}</span>
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);">College</span>
          <span>${formData.college}</span>
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);">Project</span>
          <span>${formData.title}</span>
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);">Stack</span>
          <span>${formData.stack}</span>
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);">GitHub</span>
          <a href="${formData.github}" target="_blank" style="color:var(--accent);font-size:.875rem;">${formData.github}</a>
        </div>
      </div>
    `;
  }
  currentStep = n;
  document.querySelectorAll('[id^="step-"]').forEach(el => el.style.display = 'none');
  document.getElementById(`step-${n}`).style.display = 'block';
  // Update step bar
  ['s1','s2','s3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'step ' + (i + 1 < n ? 'done' : i + 1 === n ? 'active' : '');
  });
}

function handleDrag(e, zone) { e.preventDefault(); document.getElementById(zone).classList.add('dragover'); }
function clearDrag(zone)      { document.getElementById(zone).classList.remove('dragover'); }
function handleDrop(e, zone, inputId) {
  e.preventDefault(); clearDrag(zone);
  const input = document.getElementById(inputId);
  if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; fileSelected(zone, input); }
}
function fileSelected(zone, input) {
  const zone_el = document.getElementById(zone);
  zone_el.innerHTML = `<div class="upload-icon"><i class="ti ti-circle-check" style="color:var(--success);"></i></div><p><strong>${input.files[0].name}</strong></p><p>${(input.files[0].size/1024/1024).toFixed(2)} MB</p>`;
}

function submitForm() {
  if (!document.getElementById('f-terms').checked) {
    toast('Please accept the declaration.', 'danger'); return;
  }
  const btn = event.target;
  btn.textContent = 'Submitting…'; btn.disabled = true;

  // Mock API call
  setTimeout(() => {
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
      // Mock scores from a "judge" for demo:
      scores: { Innovation: 8, 'Technical Depth': 7, 'Code Quality': 9, Presentation: 8, 'UI/UX Design': 7 },
      total: 39, maxTotal: 50,
      rank: '2nd',
      remarks: 'Outstanding technical execution. The codebase showed real depth. Some edge cases in the API remain unhandled but the core product is extremely solid.',
      pros: '• Clean, modular codebase\n• Real-world problem with massive impact\n• Strong demo with live data',
      cons: '• Missing error boundaries\n• Scalability not addressed beyond MVP\n• Accuracy metric not independently verified',
      improvement: 'Focus on writing comprehensive test coverage and deploying to a real environment before the next hackathon. The product vision is strong — the execution just needs hardening.',
    };
    localStorage.setItem('juwi_student_submission', JSON.stringify(submission));
    document.getElementById('mainWrap').innerHTML = `
      <div class="submit-success reveal">
        <div style="font-size:3rem;margin-bottom:20px;color:var(--accent);"><i class="ti ti-rocket"></i></div>
        <h2 style="margin-bottom:12px;">Project Submitted!</h2>
        <p style="max-width:400px;margin-inline:auto;">Your project has been received. Results will unlock at the scheduled time — check back here!</p>
        <div style="margin-top:32px;background:var(--surface-2);border-radius:var(--radius-sm);padding:20px;max-width:360px;margin-inline:auto;">
          <p style="font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px;">Submission ID</p>
          <code style="font-size:1.1rem;color:var(--accent);font-weight:700;">#JW-${Math.random().toString(36).substr(2,8).toUpperCase()}</code>
        </div>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="init()">View Results Dashboard</button>
        </div>
      </div>
    `;
  }, 1800);
}

// ── LOCKED STATE ──────────────────────────────────────────────
function renderLockedState(unlockISO) {
  const unlockDate = unlockISO ? new Date(unlockISO) : null;
  document.getElementById('statusBadge').textContent = 'Submission Received';
  document.getElementById('statusBadge').className   = 'badge badge-warning';
  document.getElementById('mainWrap').innerHTML = `
    <div class="locked-overlay">
      <div class="lock-icon"><i class="ti ti-lock"></i></div>
      <div>
        <h2 class="mb-8">Your Submission is In!</h2>
        <p style="max-width:440px;margin-inline:auto;">Results will go live at the scheduled time. The judges are hard at work. Come back when the countdown hits zero!</p>
      </div>
      ${unlockDate ? `
        <div class="card text-center" style="padding:32px 48px;">
          <p style="font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:12px;">Results Unlock In</p>
          <div class="countdown-display" id="countdown">
            <div class="countdown-unit"><span class="countdown-number" id="cd-h">--</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-unit"><span class="countdown-number" id="cd-m">--</span><span class="countdown-label">Mins</span></div>
            <div class="countdown-unit"><span class="countdown-number" id="cd-s">--</span><span class="countdown-label">Secs</span></div>
          </div>
          <p style="font-size:.8rem;color:var(--text-3);">${unlockDate.toLocaleString()}</p>
        </div>
      ` : `<p style="color:var(--text-3);">Unlock time not yet set by admin.</p>`}
    </div>
  `;
  if (unlockDate) startCountdown(unlockDate);
}

function startCountdown(target) {
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) { init(); return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2,'0');
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (hEl) hEl.textContent = fmt(h);
    if (mEl) mEl.textContent = fmt(m);
    if (sEl) sEl.textContent = fmt(s);
    setTimeout(tick, 1000);
  }
  tick();
}

// ── RESULTS ───────────────────────────────────────────────────
function renderResults(sub) {
  const pal = PALETTES[localStorage.getItem('juwi_palette') || 'warm'];
  const cfg = JSON.parse(localStorage.getItem('juwi_config') || '{}');
  const tplRaw = localStorage.getItem('juwi_banner_template') ||
    'We Congratulate [Team] on achieving [Rank] Prize in [Hackathon] organized by [Organizer]!';
  const banner = tplRaw
    .replace('[Team]', sub.team || 'Your Team')
    .replace('[Rank]', sub.rank || '2nd')
    .replace('[Hackathon]', cfg.hackName || 'BuildFest 2025')
    .replace('[Organizer]', cfg.organizer || 'Juwi');

  document.getElementById('statusBadge').textContent = 'Results Live';
  document.getElementById('statusBadge').className   = 'badge badge-success';

  fireConfetti();
  setTimeout(fireConfetti, 1200);

  const scoreEntries = Object.entries(sub.scores || {});
  const chartHTML = scoreEntries.map(([k, v], i) => {
    const max  = sub.maxTotal / scoreEntries.length;
    const pct  = Math.round((v / max) * 100);
    return `
      <div class="chart-row">
        <div class="chart-label">${k}</div>
        <div class="chart-track">
          <div class="chart-fill" style="width:${pct}%;background:${CHART_COLORS[i % CHART_COLORS.length]};"></div>
        </div>
        <div class="chart-score">${v}</div>
      </div>
    `;
  }).join('');

  document.getElementById('mainWrap').innerHTML = `
    <!-- Trophy Hero -->
    <div class="results-hero pop-in" style="background:linear-gradient(135deg,${pal.from},${pal.to});margin-bottom:32px;">
      <span class="trophy"><i class="ti ti-trophy"></i></span>
      <h1 class="shimmer-text">${banner}</h1>
      <p>presented by <strong>Juwi</strong> · AI-Augmented Judging Platform</p>
      <div class="rank-badge">${sub.rank || '2nd'} Place</div>
    </div>

    <!-- Score Overview -->
    <div class="grid-2 mb-24">
      <div class="stat-pill reveal reveal-delay-1">
        <span class="stat-number" style="color:var(--accent);">${sub.total || 39}<span style="font-size:1.25rem;color:var(--text-3);">/${sub.maxTotal || 50}</span></span>
        <span class="stat-label">Total Score</span>
      </div>
      <div class="stat-pill reveal reveal-delay-2">
        <span class="stat-number" style="color:var(--accent-2);">${sub.rank || '2nd'}</span>
        <span class="stat-label">Final Rank</span>
      </div>
    </div>

    <!-- Score Breakdown Bar Chart -->
    <div class="card mb-24 reveal reveal-delay-2">
      <h3 class="mb-16"><i class="ti ti-chart-bar"></i> Score Breakdown</h3>
      ${chartHTML}
    </div>

    <!-- Feedback cards -->
    <h3 class="mb-16 reveal reveal-delay-3"><i class="ti ti-message-circle"></i> Personalized Feedback</h3>
    <div class="feedback-grid">
      <div class="feedback-card reveal reveal-delay-3">
        <h4><i class="ti ti-message-2"></i> Judge Remarks</h4>
        <p class="feedback-content">${sub.remarks || 'Great work overall.'}</p>
      </div>
      <div class="feedback-card reveal reveal-delay-3">
        <h4><i class="ti ti-circle-check" style="color:var(--success);"></i> Strengths</h4>
        <p class="feedback-content">${sub.pros || '• Strong concept'}</p>
      </div>
      <div class="feedback-card reveal reveal-delay-4">
        <h4><i class="ti ti-alert-triangle" style="color:var(--accent-3);"></i> Areas to Improve</h4>
        <p class="feedback-content">${sub.cons || '• Add tests'}</p>
      </div>
      <div class="feedback-card reveal reveal-delay-4">
        <h4><i class="ti ti-rocket" style="color:var(--accent);"></i> Next Steps</h4>
        <p class="feedback-content">${sub.improvement || 'Keep building!'}</p>
      </div>
    </div>

    <div style="margin-top:40px;text-align:center;">
      <button class="btn btn-outline" onclick="resetStudent()">Submit Another Team (Demo Reset)</button>
    </div>
  `;
}

function resetStudent() {
  localStorage.removeItem('juwi_student_submission');
  init();
}

// ── Init ──────────────────────────────────────────────────────
init();
