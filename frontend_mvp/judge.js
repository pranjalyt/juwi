// ============================================================
// JUWI Judge.js — Judge Portal Logic
// ============================================================

// ── Mock data ─────────────────────────────────────────────────
const MODERATE_TEAMS = [
  {
    id: 3, name: 'ByteForce', college: 'NIT Agra',
    stack: 'Vue.js · Django · Redis',
    bullets: [
      'AI-powered crop disease detection app using CNN on mobile.',
      'Uses Django REST backend with Redis cache for real-time alerts.',
      'Vue.js PWA front-end with offline support via Service Workers.',
    ],
    abstract: 'ByteForce is building a farmer-first mobile platform that detects crop disease from a photo using a fine-tuned CNN model. The system alerts nearby extension officers in real time via a Redis pub/sub backbone. Their Vue PWA works offline, making it viable in rural connectivity-poor zones.',
    github: 'https://github.com/example/byteforce',
    score: 61,
  },
  {
    id: 4, name: 'AlgoAlchemists', college: 'RKGIT',
    stack: 'Flutter · Firebase · TensorFlow Lite',
    bullets: [
      'Sign-language-to-text translator running on-device with TFLite.',
      'Flutter cross-platform app, live transcription streamed to Firebase.',
      'Claimed 94% accuracy — code review shows only 60% test coverage.',
    ],
    abstract: 'AlgoAlchemists aim to bridge the communication gap for the deaf community using a real-time sign language translator. The TFLite model runs entirely on-device (Edge AI). Firebase Firestore syncs live transcriptions across caregiver devices.',
    github: 'https://github.com/example/algoalchemists',
    score: 55,
  },
  {
    id: 5, name: 'Stack Overflow', college: 'AKTU',
    stack: 'HTML · CSS · Vanilla JS',
    bullets: [
      'Mental health check-in tool with mood tracking via emoji input.',
      'Pure front-end only — no backend, no data persistence beyond local storage.',
      'Clean UI but limited technical depth for a hackathon stage.',
    ],
    abstract: 'Stack Overflow built a browser-based mental health companion that takes a 3-question daily check-in and plots mood trends. No server required — all data is local. Simple, accessible, and well-designed but thin on tech complexity.',
    github: 'https://github.com/example/stackoverflow',
    score: 49,
  },
];

const ATTACK_QUESTIONS = {
  3: [
    { tag: 'Security', q: 'Your Redis pub/sub is not authenticated. What happens if a bad actor subscribes to your alert channel?' },
    { tag: 'Scalability', q: 'How does your CNN handle images taken in low-light conditions? What\'s your data augmentation strategy?' },
    { tag: 'Code Smell', q: 'Your Django views.py is 800 lines. What patterns would you use to refactor this in production?' },
  ],
  4: [
    { tag: 'Accuracy Claim', q: 'You claim 94% accuracy but your test suite only covers 60% of gesture classes. How did you measure this?' },
    { tag: 'Model Size', q: 'What is the model size on-device? How does it affect battery life on a mid-range phone?' },
    { tag: 'Latency', q: 'Firebase Firestore sync latency in rural 2G areas could exceed 5 seconds. What\'s your fallback?' },
  ],
  5: [
    { tag: 'Data Privacy', q: 'localStorage is readable by any JS on the page. How are you protecting sensitive mental health data?' },
    { tag: 'Accessibility', q: 'Your emoji input has no keyboard or screen reader support. How would you fix this?' },
    { tag: 'Scale', q: 'How would you add a backend if you needed to support clinical counsellors tracking hundreds of patients?' },
  ],
};

const PROS_CONS = {
  3: {
    pros: '• Strong real-world problem relevance\n• Offline-first architecture is technically sound\n• Django REST API is well-structured',
    cons: '• Redis not secured in demo environment\n• CNN model accuracy not independently benchmarked\n• No error handling on mobile upload failures',
  },
  4: {
    pros: '• On-device inference is impressive for a 24hr hack\n• Flutter cross-platform execution works smoothly\n• Problem statement is impactful',
    cons: '• Accuracy claims are inflated (94% vs actual 60% test coverage)\n• Firebase keys are hardcoded in the repo\n• Model not quantized — 180MB on device',
  },
  5: {
    pros: '• Accessible UI with clean color contrast\n• Mood trend graph is well-executed in vanilla JS\n• Zero-dependency approach is admirable',
    cons: '• No real data security — localStorage is plaintext\n• Solution is front-end only — not production-scalable\n• Minimal technical innovation',
  },
};

let currentTeamIndex = 0;
let isAudioActive = false;
let currentTeam = null;
let scores = {};

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

// ── Phase detection ───────────────────────────────────────────
function initPhase() {
  const phase = parseInt(localStorage.getItem('juwi_phase') || '1');
  const tag   = document.getElementById('phaseTagJudge');
  if (phase === 2) {
    tag.textContent  = 'Phase 2: Live Finals';
    tag.className    = 'phase-indicator phase-2';
    document.getElementById('phase1View').style.display = 'none';
    document.getElementById('phase2View').style.display = 'block';
    initPhase2();
  } else {
    tag.textContent = 'Phase 1: Mass Triage';
    tag.className   = 'phase-indicator phase-1';
    renderRapidCard();
  }
}

// ── PHASE 1 ───────────────────────────────────────────────────
function renderRapidCard() {
  const total = MODERATE_TEAMS.length;
  const t     = MODERATE_TEAMS[currentTeamIndex];
  document.getElementById('queueCounter').textContent   = `Team ${currentTeamIndex + 1} of ${total}`;
  document.getElementById('queueFraction').textContent  = `${currentTeamIndex + 1} / ${total}`;
  document.getElementById('queueProgress').style.width  = `${((currentTeamIndex + 1) / total) * 100}%`;
  document.getElementById('rapidCard').innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h3 style="margin-bottom:4px;">${t.name}</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge badge-neutral">${t.college}</span>
          <span class="badge badge-blue">AI Score: ${t.score}</span>
        </div>
      </div>
      <span class="badge badge-accent" style="font-size:.7rem;">${t.stack}</span>
    </div>
    <p style="font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;">AI Summary (3 Key Points)</p>
    <ul class="bullet-list">
      ${t.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
    <div class="rapid-actions">
      <button class="btn btn-success" style="flex:1;" onclick="decideTeam('selected')"><i class="ti ti-check"></i> Select</button>
      <button class="btn btn-danger"  style="flex:1;" onclick="decideTeam('rejected')"><i class="ti ti-x"></i> Reject</button>
      <button class="btn btn-outline" onclick="skipTeam()">Skip →</button>
    </div>
  `;
}

function decideTeam(decision) {
  const t = MODERATE_TEAMS[currentTeamIndex];
  const teams = JSON.parse(localStorage.getItem('juwi_teams') || '[]');
  const target = teams.find(x => x.id === t.id);
  if (target) { target.status = decision; localStorage.setItem('juwi_teams', JSON.stringify(teams)); }
  toast(`${t.name} → ${decision === 'selected' ? 'Selected' : 'Rejected'}`, decision === 'selected' ? 'success' : 'danger');
  nextInQueue();
}

function skipTeam() { toast('Skipped — will revisit.'); nextInQueue(); }

function nextInQueue() {
  currentTeamIndex++;
  if (currentTeamIndex >= MODERATE_TEAMS.length) {
    document.getElementById('phase1View').innerHTML = `
      <div class="card text-center" style="padding:60px;">
        <div style="font-size:3rem;margin-bottom:20px;color:var(--accent);"><i class="ti ti-circle-check"></i></div>
        <h2>Review Queue Complete</h2>
        <p style="margin-top:8px;max-width:400px;margin-inline:auto;">You've processed all moderate teams. Go to the Admin portal to proceed to Phase 2.</p>
        <a href="admin.html" class="btn btn-primary" style="margin-top:24px;">Back to Admin →</a>
      </div>`;
  } else {
    renderRapidCard();
  }
}

// ── PHASE 2 ───────────────────────────────────────────────────
function initPhase2() {
  const teams = JSON.parse(localStorage.getItem('juwi_teams') || '[]');
  const sel   = teams.length ? teams.filter(t => t.status === 'selected') :
    [{ id: 1, name: 'Team Rocket' }, { id: 6, name: 'Quantum Leap' }, { id: 9, name: 'Kernel Panic' }];
  const select = document.getElementById('teamSelect');
  sel.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id; opt.textContent = t.name;
    select.appendChild(opt);
  });
  buildRubricSliders();
}

function buildRubricSliders() {
  const rubrics = JSON.parse(localStorage.getItem('juwi_rubrics') || '[]');
  const defaults = [
    { id: 1, name: 'Innovation',      weight: 10 },
    { id: 2, name: 'Technical Depth', weight: 10 },
    { id: 3, name: 'Code Quality',    weight: 10 },
    { id: 4, name: 'Presentation',    weight: 10 },
    { id: 5, name: 'UI/UX Design',    weight: 10 },
  ];
  const list = rubrics.length ? rubrics : defaults;
  const max  = list.reduce((a, b) => a + b.weight, 0);
  document.getElementById('scoreMax').textContent = `/ ${max}`;
  document.getElementById('rubricSliders').innerHTML = `
    <h4 style="margin-bottom:16px;"><i class="ti ti-target"></i> Scoring Rubric</h4>
    ${list.map(r => `
      <div class="slider-wrap" style="margin-bottom:18px;">
        <div class="slider-header">
          <span style="font-size:.85rem;font-weight:600;">${r.name}</span>
          <span class="slider-value" id="sv-${r.id}">0</span>
        </div>
        <input type="range" min="0" max="${r.weight}" value="0" id="sl-${r.id}"
               oninput="updateScore(${r.id}, ${r.weight}, this.value)">
        <div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-3);">
          <span>0</span><span>${r.weight}</span>
        </div>
      </div>
    `).join('')}
  `;
  scores = {};
  list.forEach(r => scores[r.id] = { val: 0, max: r.weight });
  recalcTotal();
}

function updateScore(id, max, val) {
  scores[id] = { val: +val, max };
  document.getElementById(`sv-${id}`).textContent = val;
  recalcTotal();
}

function recalcTotal() {
  const total = Object.values(scores).reduce((a, b) => a + b.val, 0);
  document.getElementById('totalScore').textContent = total;
}

function loadTeamContext() {
  const tid = parseInt(document.getElementById('teamSelect').value);
  if (!tid) return;
  currentTeam = MODERATE_TEAMS.find(t => t.id === tid) || {
    id: tid, name: document.querySelector(`#teamSelect option[value="${tid}"]`)?.textContent || 'Team',
    abstract: 'A powerful AI project with real-world impact. The team demonstrated strong technical depth and polished execution.',
    github: 'https://github.com/example/team',
    stack: 'React · FastAPI · PostgreSQL',
  };
  document.getElementById('judgeLayout').style.display = 'grid';
  if (currentTeam.abstract) {
    const ab = document.getElementById('abstractPreview');
    ab.style.display = 'block';
    ab.textContent = currentTeam.abstract;
  }
  if (currentTeam.github) {
    document.getElementById('githubLink').href = currentTeam.github;
  }
  toast(`Context loaded: ${currentTeam.name}`);
}

// ── Audio toggle ──────────────────────────────────────────────
function toggleAudio() {
  isAudioActive = !isAudioActive;
  const btn = document.getElementById('audioToggle');
  const dot = document.getElementById('recDot');
  if (isAudioActive) {
    btn.innerHTML = '<i class="ti ti-player-stop"></i> Stop Audio';
    btn.classList.add('pulse-btn');
    dot.className = 'rec-dot active';
    simulateBsDetector();
    generateAttacks();
    toast('Live audio activated.', 'success');
  } else {
    btn.innerHTML = '<i class="ti ti-microphone"></i> Enable Live Audio';
    btn.classList.remove('pulse-btn');
    dot.className = 'rec-dot inactive';
    toast('Audio stopped.');
  }
}

function simulateBsDetector() {
  if (!isAudioActive) return;
  let val = Math.floor(Math.random() * 40) + 40;
  document.getElementById('bsBar').style.width   = val + '%';
  document.getElementById('bsScore').textContent = val + '%';
  document.getElementById('bsDetail').textContent =
    val > 70 ? 'Claims appear consistent with codebase.' :
    val > 50 ? 'Some claims are partially unverifiable.' :
               'Multiple claims appear unsupported by code.';
  setTimeout(() => { if (isAudioActive) simulateBsDetector(); }, 6000);
}

function generateAttacks() {
  const tid   = currentTeam ? currentTeam.id : 3;
  const q     = (ATTACK_QUESTIONS[tid] || ATTACK_QUESTIONS[3]);
  const feed  = document.getElementById('attackFeed');
  feed.innerHTML = q.map(a => `
    <div class="attack-item">
      <strong><i class="ti ti-bolt" style="color:var(--accent);"></i> ${a.tag}</strong>
      ${a.q}
    </div>
  `).join('');
}

function generateProsCons() {
  const tid = currentTeam ? currentTeam.id : 3;
  const pc  = PROS_CONS[tid] || { pros: '• Strong concept\n• Good presentation', cons: '• Limited testing\n• Scalability not addressed' };
  document.getElementById('prosBox').style.whiteSpace = 'pre-line';
  document.getElementById('consBox').style.whiteSpace = 'pre-line';
  document.getElementById('prosBox').textContent = pc.pros;
  document.getElementById('consBox').textContent = pc.cons;
  toast('Pros & Cons generated!', 'success');
}

function submitScore() {
  if (!currentTeam) { toast('Load a team first.', 'danger'); return; }
  const total   = Object.values(scores).reduce((a, b) => a + b.val, 0);
  const remarks = document.getElementById('remarksBox').value;
  const saved   = JSON.parse(localStorage.getItem('juwi_scores') || '{}');
  saved[currentTeam.id] = {
    teamName: currentTeam.name,
    scores, total,
    remarks,
    pros:  document.getElementById('prosBox').textContent,
    cons:  document.getElementById('consBox').textContent,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('juwi_scores', JSON.stringify(saved));
  toast(`✓ Score submitted for ${currentTeam.name}!`, 'success');
}

// ── Init ──────────────────────────────────────────────────────
initPhase();
