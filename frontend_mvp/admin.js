// ============================================================
// JUWI Admin.js — Admin Control Center Logic
// ============================================================

// ── State ────────────────────────────────────────────────────
const state = {
  phase: 1,
  rubrics: [
    { id: 1, name: 'Innovation', weight: 10 },
    { id: 2, name: 'Technical Depth', weight: 10 },
    { id: 3, name: 'Code Quality', weight: 10 },
    { id: 4, name: 'Presentation', weight: 10 },
    { id: 5, name: 'UI/UX Design', weight: 10 },
  ],
  teams: [],
  palette: 'warm',
  unlockTime: null,
  countdownInterval: null,
};

// // ── Mocked Team Data ──────────────────────────────────────────
// const MOCK_TEAMS = [
//   { id: 1, name: 'Team Rocket', college: 'RKGIT', stack: 'React, FastAPI, OpenAI', score: 88, status: 'selected' },
//   { id: 2, name: 'Null Pointers', college: 'IIT Delhi', stack: 'Next.js, Rust, PostgreSQL', score: 76, status: 'selected' },
//   { id: 3, name: 'ByteForce', college: 'NIT Agra', stack: 'Vue.js, Django, Redis', score: 61, status: 'moderate' },
//   { id: 4, name: 'AlgoAlchemists', college: 'RKGIT', stack: 'Flutter, Firebase', score: 55, status: 'moderate' },
//   { id: 5, name: 'Stack Overflow', college: 'AKTU', stack: 'HTML, CSS, JS', score: 49, status: 'moderate' },
//   { id: 6, name: 'Quantum Leap', college: 'IIT Kanpur', stack: 'PyTorch, FastAPI, Next.js', score: 92, status: 'selected' },
//   { id: 7, name: 'The Debuggers', college: 'GLA Univ', stack: 'Spring Boot, Angular', score: 35, status: 'rejected' },
//   { id: 8, name: 'Ctrl+Alt+Del', college: 'AKTU', stack: 'WordPress', score: 22, status: 'rejected' },
//   { id: 9, name: 'Kernel Panic', college: 'NIT Agra', stack: 'Go, gRPC, React', score: 81, status: 'selected' },
//   { id: 10, name: 'Zero Day', college: 'IIT Delhi', stack: 'C++, Qt, MQTT', score: 44, status: 'rejected' },
// ];


// ── Workspace/Hackathon Switcher ──────────────────────────────
async function loadWorkspaces() {
  const dd = document.getElementById('hackathonDropdown');
  try {
    // 1. Get the currently active hackathon
    const activeRes = await fetch("http://127.0.0.1:8000/api/admin/current-hackathon");
    if (!activeRes.ok) throw new Error("Backend offline");
    const activeData = await activeRes.json();
    const current = activeData.active_hackathon;

    // 2. Get the list of ALL hackathons that have teams
    const listRes = await fetch("http://127.0.0.1:8000/api/admin/hackathons");
    const listData = await listRes.json();

    // 3. THE FIX: Merge them! Guarantee the 'current' one is always in the list.
    const allHacks = new Set(listData.hackathons);
    allHacks.add(current);
    const uniqueHacks = Array.from(allHacks);

    // 4. Populate the dropdown
    dd.innerHTML = uniqueHacks.map(h =>
      `<option value="${h}" ${h === current ? 'selected' : ''}>${h}</option>`
    ).join('');

  } catch (e) {
    console.error(e);
    dd.innerHTML = `<option value="">⚠️ Server Offline</option>`;
  }
}

async function switchWorkspace(name) {
  if (!name) return;
  await fetch("http://127.0.0.1:8000/api/admin/set-hackathon", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hackathon_name: name })
  });

  toast(`Workspace switched to: ${name}`, 'success');

  // Update the Setup Input box so it matches
  document.getElementById('hackName').value = name;

  // Refresh the table data!
  runTriage();
}

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  if (type === 'success') el.style.background = 'var(--success)';
  if (type === 'danger') el.style.background = 'var(--danger)';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ── Sidebar navigation ────────────────────────────────────────
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('panel-' + link.dataset.target).classList.add('active');
  });
});

// ── Phase Toggle ──────────────────────────────────────────────
const phaseToggle = document.getElementById('phaseToggle');
const phaseTag = document.getElementById('phaseTag');

phaseToggle.addEventListener('change', () => {
  state.phase = phaseToggle.checked ? 2 : 1;
  phaseTag.textContent = state.phase === 1 ? 'Phase 1: Mass Triage' : 'Phase 2: Live Finals';
  phaseTag.className = state.phase === 1 ? 'phase-indicator phase-1' : 'phase-indicator phase-2';
  localStorage.setItem('juwi_phase', state.phase);
  toast(`Switched to Phase ${state.phase}`, 'success');
});

// ── Setup ─────────────────────────────────────────────────────
async function saveSetup() {
  const name = document.getElementById('hackName').value.trim();
  const org = document.getElementById('organizer').value.trim();
  runTriage();
  loadWorkspaces();
  if (!name || !org) { toast('Please fill in all required fields.', 'danger'); return; }

  const config = {
    hackName: name,
    organizer: org,
    maxTeams: document.getElementById('maxTeams').value,
    reqPPT: document.getElementById('req-ppt').checked,
    reqAbstract: document.getElementById('req-abstract').checked,
    reqGithub: document.getElementById('req-github').checked,
    reqDemo: document.getElementById('req-demo').checked,
  };

  // 1. Save UI settings locally
  localStorage.setItem('juwi_config', JSON.stringify(config));

  try {
    // 2. TELL THE PYTHON BRAIN TO SWITCH HACKATHONS
    await fetch("http://127.0.0.1:8000/api/admin/set-hackathon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hackathon_name: name })
    });

    // 3. Reset the Phase Switch to Phase 1
    document.getElementById('phaseToggle').checked = false;
    document.getElementById('phaseTag').textContent = 'Phase 1: Mass Triage';
    document.getElementById('phaseTag').className = 'phase-indicator phase-1';
    localStorage.setItem('juwi_phase', 1);

    // 4. Clear the Student's locked screen so they can submit to the new event
    localStorage.removeItem('juwi_student_submission');

    // 5. Refresh the Admin tables (They will instantly turn blank for the new event!)
    loadDashboardStats();
    loadModerateQueue();

    toast(`✓ Workspace switched to: ${name}`, 'success');
  } catch (e) {
    console.error(e);
    toast("Backend offline. Could not switch hackathon.", "danger");
  }
}

// ── Rubric ────────────────────────────────────────────────────
function renderRubrics() {
  const list = document.getElementById('rubric-list');
  const total = state.rubrics.reduce((a, b) => a + b.weight, 0);
  list.innerHTML = state.rubrics.map(r => `
    <div class="rubric-item" data-id="${r.id}">
      <input type="text" class="form-control" value="${r.name}" style="max-width:220px;"
             onchange="updateRubric(${r.id}, 'name', this.value)">
      <span style="font-size:.8rem;color:var(--text-3);white-space:nowrap;">out of</span>
      <input type="number" class="form-control" value="${r.weight}" min="1" max="20" style="width:72px;"
             onchange="updateRubric(${r.id}, 'weight', +this.value)">
      <span style="font-size:.8rem;color:var(--text-3);">pts</span>
      <button class="rubric-delete" onclick="removeRubric(${r.id})">×</button>
    </div>
  `).join('');
  document.getElementById('rubric-summary').innerHTML =
    `<span class="badge badge-accent">Total: ${total} pts across ${state.rubrics.length} criteria</span>`;
}

function addRubricItem() {
  const val = document.getElementById('newCriterion').value.trim();
  if (!val) { toast('Enter a criterion name.', 'danger'); return; }
  state.rubrics.push({ id: Date.now(), name: val, weight: 10 });
  document.getElementById('newCriterion').value = '';
  renderRubrics();
}

function removeRubric(id) {
  state.rubrics = state.rubrics.filter(r => r.id !== id);
  renderRubrics();
}

function updateRubric(id, field, val) {
  const r = state.rubrics.find(r => r.id === id);
  if (r) { r[field] = val; renderRubrics(); }
}

function saveRubric() {
  localStorage.setItem('juwi_rubrics', JSON.stringify(state.rubrics));
  toast('✓ Rubric locked and saved!', 'success');
}

// ── AI Triage ─────────────────────────────────────────────────
let currentFilter = 'all';

async function runTriage() {
  const btn = document.querySelector('[onclick="runTriage()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" style="animation: spin 1s linear infinite;"></i> Syncing with AI Backend...';

  try {
    // 1. Fetch the REAL database from Python!
    const response = await fetch("http://127.0.0.1:8000/api/admin/teams");
    const data = await response.json();

    if (data.status === "success") {
      state.teams = data.teams;
      updateTriageStats();
      renderTriageTable(currentFilter);
      toast('✓ Live hackathon data synced!', 'success');

      // Inject spin animation safely if it doesn't exist
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }
    }
  } catch (err) {
    console.error("Failed to fetch triage data", err);
    toast('Error: Could not reach backend.', 'danger');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-cpu"></i> Refresh Live Data';
  }
}

function updateTriageStats() {
  document.getElementById('st-selected').textContent = state.teams.filter(t => t.status === 'selected').length;
  // Note: Backend uses 'pending' for Moderate teams
  document.getElementById('st-moderate').textContent = state.teams.filter(t => t.status === 'pending').length;
  document.getElementById('st-rejected').textContent = state.teams.filter(t => t.status === 'rejected').length;
}

function renderTriageTable(filter = currentFilter) {
  currentFilter = filter;
  // Map frontend filter tabs to backend status text
  const statusMap = { 'all': 'all', 'selected': 'selected', 'moderate': 'pending', 'rejected': 'rejected' };
  const targetStatus = statusMap[filter];

  const shown = targetStatus === 'all' ? state.teams : state.teams.filter(t => t.status === targetStatus);
  const tbody = document.getElementById('triage-tbody');

  if (!shown.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">No teams found in this category.</td></tr>`;
    return;
  }

  tbody.innerHTML = shown.map((t, i) => {
    let cls = 'badge-warning'; let label = '<i class="ti ti-alert-triangle"></i> Moderate';
    if (t.status === 'selected') { cls = 'badge-success'; label = '<i class="ti ti-circle-check"></i> Selected'; }
    if (t.status === 'rejected') { cls = 'badge-danger'; label = '<i class="ti ti-circle-x"></i> Rejected'; }

    return `<tr>
      <td style="color:var(--text-3);font-size:.8rem;">${i + 1}</td>
      <td><strong>${t.name}</strong></td>
      <td>${t.college}</td>
      <td><span style="font-size:.8rem;">${t.stack}</span></td>
      <td><strong style="color:var(--accent);">${t.score}</strong></td>
      <td><span class="badge ${cls}">${label}</span></td>
      <td>
        <select class="form-control" style="padding:6px 10px;font-size:.8rem;" onchange="overrideStatus(${t.id}, this.value)">
          <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Moderate</option>
          <option value="selected" ${t.status === 'selected' ? 'selected' : ''}>Select</option>
          <option value="rejected" ${t.status === 'rejected' ? 'selected' : ''}>Reject</option>
        </select>
      </td>
    </tr>`;
  }).join('');
}

async function overrideStatus(id, newStatus) {
  try {
    // 2. Send the Admin's manual override straight to the Python backend
    const response = await fetch("http://127.0.0.1:8000/api/team-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: id, decision: newStatus })
    });

    if (response.ok) {
      const t = state.teams.find(t => t.id === id);
      if (t) t.status = newStatus;
      updateTriageStats();
      renderTriageTable(currentFilter);
      toast('Backend status updated.', 'success');
    }
  } catch (err) {
    toast('Failed to update backend.', 'danger');
  }
}

// Attach event listeners to the filter tabs
document.getElementById('triage-filter').addEventListener('click', e => {
  const tab = e.target.closest('.tab-item');
  if (!tab) return;
  document.querySelectorAll('#triage-filter .tab-item').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderTriageTable(tab.dataset.filter);
});

// ── Branding ──────────────────────────────────────────────────
document.querySelectorAll('.swatch').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    state.palette = s.dataset.palette;
    localStorage.setItem('juwi_palette', state.palette);
    toast(`Theme set: ${s.title}`, 'success');
  });
});

function scheduleResults() {
  const d = document.getElementById('unlockDate').value;
  const t = document.getElementById('unlockTime').value;
  if (!d || !t) { toast('Pick a date and time first.', 'danger'); return; }
  const unlockAt = new Date(`${d}T${t}`);
  if (unlockAt <= new Date()) { toast('Unlock time must be in the future.', 'danger'); return; }
  localStorage.setItem('juwi_unlock', unlockAt.toISOString());
  state.unlockTime = unlockAt;
  document.getElementById('schedule-status').textContent =
    `<i class="ti ti-clock"></i> Results scheduled for ${unlockAt.toLocaleString()}`;
  toast('Results scheduled!', 'success');
}

function unlockNow() {
  localStorage.setItem('juwi_unlock', new Date(Date.now() - 1000).toISOString());
  toast('Results unlocked for testing!', 'success');
}

function previewBanner() {
  const tpl = document.getElementById('bannerTemplate').value;
  const cfg = JSON.parse(localStorage.getItem('juwi_config') || '{}');
  const preview = tpl
    .replace('[Team]', cfg.hackName ? 'Team Rocket' : 'Team Rocket')
    .replace('[Rank]', '1st')
    .replace('[Hackathon]', cfg.hackName || 'BuildFest 2025')
    .replace('[Organizer]', cfg.organizer || 'RKGIT');
  document.getElementById('banner-preview-text').textContent = preview;
  document.getElementById('banner-preview-wrap').style.display = 'block';
}

// ── Init ──────────────────────────────────────────────────────
renderRubrics();
updateTriageStats();
const savedPhase = parseInt(localStorage.getItem('juwi_phase') || '1');
if (savedPhase === 2) { phaseToggle.checked = true; phaseToggle.dispatchEvent(new Event('change')); }
const savedConfig = JSON.parse(localStorage.getItem('juwi_config') || '{}');
if (savedConfig.hackName) document.getElementById('hackName').value = savedConfig.hackName;
if (savedConfig.organizer) document.getElementById('organizer').value = savedConfig.organizer;
if (savedConfig.maxTeams) document.getElementById('maxTeams').value = savedConfig.maxTeams;

loadWorkspaces();