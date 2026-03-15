// ============================================================
// JUWI Student.js — Student Portal Logic
// ============================================================

// ── Palette definitions ───────────────────────────────────────
const PALETTES = {
  warm: { from: '#C17B5C', to: '#D4A853', text: '#fff' },
  ocean: { from: '#5C7BC1', to: '#5FAD8A', text: '#fff' },
  midnight: { from: '#1c1c1e', to: '#5C7BC1', text: '#fff' },
  rose: { from: '#C15C8A', to: '#D4A853', text: '#fff' },
  forest: { from: '#4A7C59', to: '#A3B899', text: '#fff' },
};

const CHART_COLORS = ['#C17B5C', '#D4A853', '#7B9E87', '#5C7BC1', '#C15C8A'];

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'default') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  if (type === 'success') el.style.background = 'var(--success)';
  if (type === 'danger') el.style.background = 'var(--danger)';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 3800);
}

// ── Confetti ──────────────────────────────────────────────────
function fireConfetti() {
  const colors = ['#C17B5C', '#D4A853', '#7B9E87', '#5C7BC1', '#C15C8A', '#fff', '#D4A853'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 10 + 6}px;
      height: ${Math.random() * 10 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 2 + 2.5}s;
      animation-delay: ${Math.random() * 1.2}s;
      opacity: ${Math.random() * .6 + .4};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

// ── State ─────────────────────────────────────────────────────
let ALL_RESULTS = []; // Store the DB globally for the dropdown
const formData = {};

// // ── Main router ───────────────────────────────────────────────
// function init() {
//   const submitted = localStorage.getItem('juwi_student_submission');
//   const unlock = localStorage.getItem('juwi_unlock');
//   const isUnlocked = unlock && new Date(unlock) <= new Date();

//   if (isUnlocked && submitted) {
//     renderResults(JSON.parse(submitted));
//   } else if (submitted) {
//     renderLockedState(unlock);
//   } else {
//     renderForm();
//   }
// }

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
    formData.name = document.getElementById('f-name').value.trim();
    formData.team = document.getElementById('f-team').value.trim();
    formData.college = document.getElementById('f-college').value.trim();
    formData.email = document.getElementById('f-email').value.trim();
    formData.members = document.getElementById('f-members').value.trim();
  }
  if (n === 3) {
    if (!document.getElementById('f-title').value.trim() ||
      !document.getElementById('f-github').value.trim() ||
      !document.getElementById('f-abstract').value.trim()) {
      toast('Please complete all project fields.', 'danger'); return;
    }
    formData.title = document.getElementById('f-title').value.trim();
    formData.github = document.getElementById('f-github').value.trim();
    formData.stack = document.getElementById('f-stack').value.trim();
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
  ['s1', 's2', 's3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'step ' + (i + 1 < n ? 'done' : i + 1 === n ? 'active' : '');
  });
}

function handleDrag(e, zone) { e.preventDefault(); document.getElementById(zone).classList.add('dragover'); }
function clearDrag(zone) { document.getElementById(zone).classList.remove('dragover'); }
function handleDrop(e, zone, inputId) {
  e.preventDefault(); clearDrag(zone);
  const input = document.getElementById(inputId);
  if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; fileSelected(zone, input); }
}
function fileSelected(zone, input) {
  const zone_el = document.getElementById(zone);
  zone_el.innerHTML = `<div class="upload-icon"><i class="ti ti-circle-check" style="color:var(--success);"></i></div><p><strong>${input.files[0].name}</strong></p><p>${(input.files[0].size / 1024 / 1024).toFixed(2)} MB</p>`;
}

async function submitForm() {
  if (!document.getElementById('f-terms').checked) {
    toast('Please accept the declaration.', 'danger'); return;
  }

  // Grab the button and put it in a loading state
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ti ti-loader" style="animation: spin 1s linear infinite;"></i> AI is Triaging...';
  btn.disabled = true;

  // 1. Package the data EXACTLY how Python's Pydantic model expects it
  const payload = {
    id: Math.floor(Math.random() * 100000),
    name: formData.team || "Unknown Team",          // Fallback prevents 422
    college: formData.college || "Unknown College", // Fallback prevents 422
    description: formData.abstract || "No description provided.", // Fallback
    stack: formData.stack || "Not specified",       // Fallback
    github: formData.github || ""
  };

  console.log("🚀 SENDING PAYLOAD:", payload); // Let's log it just to be safe!

  try {
    // 2. Send it to your FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Inject the spinning animation CSS safely if it doesn't exist
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      // Save local state for lock screen
      const submission = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('juwi_student_submission', JSON.stringify(submission));

      // 3. Show Success Screen
      document.getElementById('mainWrap').innerHTML = `
        <div class="submit-success reveal">
          <div style="font-size:3rem;margin-bottom:20px;color:var(--accent);"><i class="ti ti-rocket"></i></div>
          <h2 style="margin-bottom:12px;">Project Submitted!</h2>
          <p style="max-width:400px;margin-inline:auto;">Your project was received and evaluated by the AI Judge. Score: <strong style="color:var(--accent);">${data.team.score}</strong></p>
          <div style="margin-top:32px;background:var(--surface-2);border-radius:var(--radius-sm);padding:20px;max-width:360px;margin-inline:auto;">
            <p style="font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px;">Submission ID</p>
            <code style="font-size:1.1rem;color:var(--accent);font-weight:700;">#JW-${payload.id}</code>
          </div>
          <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="init()">View Live Status</button>
          </div>
        </div>
      `;
      toast('AI Triage Complete!', 'success');

    } else {
      throw new Error(data.message || "Backend failed to triage.");
    }
  } catch (err) {
    console.error("Submission Error:", err);
    toast('Error: Could not process submission. Check console.', 'danger');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ── Main router & DB Fetcher ──────────────────────────────────
async function init() {
  const submittedStr = localStorage.getItem('juwi_student_submission');
  const unlockISO = localStorage.getItem('juwi_unlock');
  const isUnlocked = unlockISO && new Date(unlockISO) <= new Date();

  if (isUnlocked) {
    // 1. Put UI in loading state
    document.getElementById('mainWrap').innerHTML = `
      <div style="text-align:center; padding: 80px 20px;">
        <i class="ti ti-loader" style="animation: spin 1s linear infinite; font-size: 3rem; color: var(--accent); margin-bottom: 20px; display: inline-block;"></i>
        <h2>Decrypting Global Results...</h2>
      </div>
    `;

    // 2. Fetch ALL teams from Python SQLite
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/teams");
      const data = await res.json();

      if (data.status === "success") {
        ALL_RESULTS = data.teams;

        // Read the Phase Toggle from the Admin Panel
        const currentPhase = parseInt(localStorage.getItem('juwi_phase') || '1');

        if (currentPhase === 2) {
          renderPhase2Results();
        } else {
          renderPhase1Results();
        }
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
      toast("Error: Could not reach Juwi backend.", "danger");
    }
  } else if (submittedStr) {
    renderLockedState(unlockISO);
  } else {
    renderForm();
  }
}

// ── LOCKED STATE ──────────────────────────────────────────────
function renderLockedState(unlockISO) {
  const unlockDate = unlockISO ? new Date(unlockISO) : null;
  document.getElementById('statusBadge').textContent = 'Judging in Progress';
  document.getElementById('statusBadge').className = 'badge badge-warning';
  document.getElementById('mainWrap').innerHTML = `
    <div class="locked-overlay">
      <div class="lock-icon"><i class="ti ti-lock"></i></div>
      <div>
        <h2 class="mb-8">Your Submission is In!</h2>
        <p style="max-width:440px;margin-inline:auto;">The Judges and the AI are currently reviewing the repositories. Come back when the countdown hits zero to view the Global Leaderboard!</p>
      </div>
      ${unlockDate ? `
        <div class="card text-center" style="padding:32px 48px; margin-top: 20px;">
          <p style="font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:12px;">Results Unlock In</p>
          <div class="countdown-display" id="countdown">
            <div class="countdown-unit"><span class="countdown-number" id="cd-h">--</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-unit"><span class="countdown-number" id="cd-m">--</span><span class="countdown-label">Mins</span></div>
            <div class="countdown-unit"><span class="countdown-number" id="cd-s">--</span><span class="countdown-label">Secs</span></div>
          </div>
        </div>
      ` : `<p style="color:var(--text-3); margin-top: 20px;">Unlock time not yet set by admin.</p>`}
      <button class="btn btn-outline btn-sm" style="margin-top: 30px;" onclick="resetStudent()">Submit Another Project</button>
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
    const fmt = n => String(n).padStart(2, '0');
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

// ── PHASE 1 RESULTS: SELECTION LIST ───────────────────────────
function renderPhase1Results() {
  const cfg = JSON.parse(localStorage.getItem('juwi_config') || '{}');
  const organizer = cfg.organizer || 'The Organizers';

  document.getElementById('statusBadge').textContent = 'Phase 1 Results';
  document.getElementById('statusBadge').className = 'badge badge-success';

  const selectedTeams = ALL_RESULTS.filter(t => t.status === 'selected' || t.bucket === 'AUTO_ACCEPT');

  fireConfetti();

  let listHTML = selectedTeams.map(t => `
    <div class="card pop-in" style="padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--accent);">
      <div>
        <h3 style="margin-bottom: 4px;">${t.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-2);">${t.college}</p>
      </div>
      <span class="badge badge-success"><i class="ti ti-check"></i> Selected</span>
    </div>
  `).join('');

  if (selectedTeams.length === 0) listHTML = `<p style="text-align:center; color: var(--text-3);">No teams have been selected yet.</p>`;

  document.getElementById('mainWrap').innerHTML = `
    <div style="text-align: center; margin-bottom: 40px; padding: 40px 20px; background: linear-gradient(135deg, var(--surface-2), var(--surface)); border-radius: var(--radius); border: 1px solid var(--border);">
      <div style="font-size: 3rem; color: var(--accent); margin-bottom: 15px;">🎉</div>
      <h1 style="font-size: 2.2rem; margin-bottom: 10px;">Phase 1 Results are Out!</h1>
      <p style="color: var(--text-2); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
        <strong>${organizer}</strong> congratulates the following teams for making it through the AI Triage. Prepare for Phase 2!
      </p>
    </div>
    
    <div style="display: grid; gap: 12px; max-width: 800px; margin: 0 auto;">
      ${listHTML}
    </div>

    <div style="margin-top:40px;text-align:center;">
      <button class="btn btn-outline" onclick="resetStudent()">Submit Another Team (Demo Reset)</button>
    </div>
  `;
}

// ── PHASE 2 RESULTS: PODIUM & ON-DEMAND AI ────────────────────
function renderPhase2Results() {
  const pal = PALETTES[localStorage.getItem('juwi_palette') || 'warm'];
  const cfg = JSON.parse(localStorage.getItem('juwi_config') || '{}');
  const tplRaw = localStorage.getItem('juwi_banner_template') || 'We Congratulate [Team] on achieving [Rank] Prize in [Hackathon] organized by [Organizer]!';

  document.getElementById('statusBadge').textContent = 'Final Results';
  document.getElementById('statusBadge').className = 'badge badge-success';

  const rankedTeams = [...ALL_RESULTS].sort((a, b) => {
    const scoreA = a.phase2_total !== null ? a.phase2_total : -1;
    const scoreB = b.phase2_total !== null ? b.phase2_total : -1;
    return scoreB - scoreA;
  });

  const top3 = rankedTeams.slice(0, 3);

  fireConfetti();
  setTimeout(fireConfetti, 1200);

  let podiumHTML = `<div class="podium-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">`;

  top3.forEach((team, index) => {
    if (team.phase2_total === null) return;
    const rankStr = index === 0 ? '1st' : index === 1 ? '2nd' : '3rd';
    const bannerText = tplRaw.replace('[Team]', team.name).replace('[Rank]', rankStr).replace('[Hackathon]', cfg.hackName || 'Hackathon').replace('[Organizer]', cfg.organizer || 'Juwi');
    const bg = index === 0 ? `linear-gradient(135deg,${pal.from},${pal.to})` : 'var(--surface-2)';
    const color = index === 0 ? 'white' : 'var(--text)';

    podiumHTML += `
      <div class="card text-center pop-in" style="background: ${bg}; color: ${color}; border: ${index === 0 ? 'none' : '1px solid var(--border)'};">
        <div style="font-size: 3rem; margin-bottom: 10px;">${index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}</div>
        <h3 style="color: ${color};">${team.name}</h3>
        <p style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 15px;">${rankStr} Place Champion</p>
        ${index === 0 ? `<p style="font-weight: 700; font-size: 0.9rem;">${bannerText}</p>` : ''}
        <div style="margin-top: 15px; font-weight: 900; font-size: 1.5rem;">${team.phase2_total} <span style="font-size: 0.8rem; font-weight: 500; opacity: 0.7;">/50 pts</span></div>
      </div>
    `;
  });
  podiumHTML += `</div>`;

  const alphabetizedTeams = [...ALL_RESULTS].sort((a, b) => a.name.localeCompare(b.name));
  let optionsHTML = `<option value="">Select your team name...</option>`;
  alphabetizedTeams.forEach(t => {
    optionsHTML += `<option value="${t.id}">${t.name} (${t.college})</option>`;
  });

  document.getElementById('mainWrap').innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Hackathon Results</h1>
      <p style="color: var(--text-2);">Congratulations to everyone who participated. Building something from scratch is the real victory.</p>
    </div>

    ${podiumHTML}

    <div class="divider"></div>

    <div style="text-align: center; margin-top: 40px;">
      <button class="btn btn-primary btn-lg" onclick="document.getElementById('remarksSection').style.display='block'; this.style.display='none';">
        <i class="ti ti-scan"></i> Show My Remarks & AI Feedback
      </button>
    </div>

    <div id="remarksSection" class="card pop-in" style="display: none; margin-top: 20px; background: linear-gradient(to bottom, var(--surface), var(--surface-2));">
      <h2 style="text-align: center; margin-bottom: 20px;">Analyze Your Performance</h2>
      <select id="teamFeedbackSelect" class="form-control" style="max-width: 400px; margin: 0 auto 30px; display: block; font-size: 1.1rem; padding: 12px;" onchange="triggerAIAnalysis(this.value)">
        ${optionsHTML}
      </select>

      <div id="feedbackContainer" style="display: none; padding-top: 20px; border-top: 1px dashed var(--border);">
        </div>
    </div>

    <div style="margin-top:40px;text-align:center;">
      <button class="btn btn-outline" onclick="resetStudent()">Submit Another Team (Demo Reset)</button>
    </div>
  `;
}

// ── ON-DEMAND AI ANALYZER ─────────────────────────────────────
async function triggerAIAnalysis(teamId) {
  const container = document.getElementById('feedbackContainer');
  if (!teamId) {
    container.style.display = 'none';
    return;
  }

  const team = ALL_RESULTS.find(t => String(t.id) === String(teamId));
  if (!team) return;

  const isFinalist = team.phase2_total !== null;

  // 1. Show the Loading UI while the AI reads the repo
  container.style.display = 'block';
  container.className = 'pop-in';
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <div>
        <h3 style="margin-bottom: 4px; color: var(--accent);">${team.name}</h3>
        <span class="badge ${isFinalist ? 'badge-success' : 'badge-neutral'}">${isFinalist ? 'Phase 2 Finalist' : 'Phase 1 Participant'}</span>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.8rem; font-weight: 800; line-height: 1;">${isFinalist ? team.phase2_total : team.score}</div>
        <div style="font-size: 0.75rem; color: var(--text-3); text-transform: uppercase;">${isFinalist ? 'Final Points' : 'Triage Score'}</div>
      </div>
    </div>

    ${team.remarks ? `
    <div class="card mb-16" style="background: var(--surface); border-left: 3px solid var(--accent);">
      <h4 style="margin-bottom: 8px;"><i class="ti ti-message-2"></i> Judge's Live Remarks</h4>
      <p style="font-size: 1.05rem; font-style: italic; color: var(--text-2);">"${team.remarks}"</p>
    </div>` : ''}

    <div id="ai-deep-dive" style="text-align:center; padding: 40px 20px; background: var(--surface-2); border-radius: var(--radius-sm); border: 1px dashed var(--accent);">
      <i class="ti ti-scan" style="font-size: 2.5rem; color: var(--accent); animation: pulse 1.5s infinite;"></i>
      <h3 style="margin-top: 15px;">AI is scanning the repository...</h3>
      <p style="color: var(--text-3); font-size: 0.9rem;">Generating personalized pros, cons, and improvement vectors.</p>
    </div>
  `;

  // Inject Pulse CSS
  if (!document.getElementById('pulse-css')) {
    const style = document.createElement('style');
    style.id = 'pulse-css';
    style.innerHTML = `@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }`;
    document.head.appendChild(style);
  }

  // 2. Ping the Python Backend `/analyze-repo` endpoint!
  try {
    const githubURL = team.github !== '#' ? team.github : 'https://github.com/placeholder';
    const response = await fetch(`http://127.0.0.1:8000/analyze-repo?github_url=${encodeURIComponent(githubURL)}`);
    const aiData = await response.json();

    // 3. Inject the AI Results
    document.getElementById('ai-deep-dive').innerHTML = `
      <h3 style="margin-bottom: 16px; text-align: left;"><i class="ti ti-cpu"></i> Deep AI Repository Analysis</h3>
      <div class="feedback-grid" style="text-align: left;">
        <div class="feedback-card" style="background: var(--surface);">
          <h4 style="margin-bottom: 8px;"><i class="ti ti-circle-check" style="color:var(--success);"></i> Strengths Identified</h4>
          <p class="feedback-content" style="white-space: pre-line;">${aiData.pros || '• Solid fundamental structure'}</p>
        </div>
        
        <div class="feedback-card" style="background: var(--surface);">
          <h4 style="margin-bottom: 8px;"><i class="ti ti-alert-triangle" style="color:var(--danger);"></i> Areas for Improvement</h4>
          <p class="feedback-content" style="white-space: pre-line;">${aiData.cons || '• Testing coverage could be improved'}</p>
        </div>
        
        <div class="feedback-card" style="background: var(--surface); grid-column: 1 / -1;">
          <h4 style="margin-bottom: 8px;"><i class="ti ti-rocket" style="color:var(--accent-3);"></i> Suggested Next Steps</h4>
          <ul style="padding-left: 20px; color: var(--text-2); font-size: 0.9rem;">
            ${(aiData.questions || [{ q: "Implement robust CI/CD pipelines." }]).map(q => `<li style="margin-bottom: 6px;">${q.q}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("AI Analysis failed:", err);
    document.getElementById('ai-deep-dive').innerHTML = `
      <h4 style="color: var(--danger);"><i class="ti ti-alert-circle"></i> AI Analysis Unavailable</h4>
      <p style="color: var(--text-3); font-size: 0.9rem;">Could not reach the repository or backend AI engine.</p>
    `;
  }
}

function resetStudent() {
  localStorage.removeItem('juwi_student_submission');
  init();
}

// ── Init ──────────────────────────────────────────────────────
init();