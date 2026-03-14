/* JUWI — AI-Augmented Decision Support System */

// ── Icons (inline SVGs) ─────────────────────────────────────
const ICONS = { home: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, trophy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`, users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`, clipboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`, mic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`, play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`, pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`, check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`, plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`, x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`, arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`, arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`, barChart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`, messageSquare: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, zap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, target: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`, award: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`, logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`, brain: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`, calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, hash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`, sliders: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>` };
function icon(n) { return ICONS[n] || ''; }

// ── Mock Data — Per-competition structure ────────────────────
const COMPETITIONS = [
  {
    id: 1, name: 'HackNITR 6.0', date: '2026-03-15', status: 'active',
    tags: ['Hackathon', 'Tech'],
    rubric: [
      { id: 1, name: 'Innovation', maxPoints: 10 }, { id: 2, name: 'Technical Depth', maxPoints: 10 },
      { id: 3, name: 'Design & UX', maxPoints: 10 }, { id: 4, name: 'Feasibility', maxPoints: 10 },
      { id: 5, name: 'Presentation', maxPoints: 10 }
    ],
    teams: [
      { id: 1, name: 'NeuralNexus', members: ['Aryan', 'Kavya', 'Riya'], project: 'AI-powered waste segregation', score: 42 },
      { id: 2, name: 'CodeCrafters', members: ['Kabir', 'Ananya', 'Vivaan'], project: 'Decentralized voting platform', score: 39 },
      { id: 3, name: 'PixelPioneers', members: ['Ishaan', 'Diya', 'Saanvi'], project: 'AR-based campus navigation', score: 37 },
      { id: 4, name: 'ByteForge', members: ['Reyansh', 'Aisha', 'Meera'], project: 'Smart energy monitoring dashboard', score: 35 },
      { id: 5, name: 'QuantumLeap', members: ['Aarav', 'Prisha', 'Nisha'], project: 'Quantum-safe encryption toolkit', score: 34 },
      { id: 6, name: 'DataDrifters', members: ['Rohan', 'Tanya', 'Sneha'], project: 'Predictive analytics for agriculture', score: 31 }
    ]
  },
  {
    id: 2, name: 'Nrityotsav 2026', date: '2026-04-10', status: 'active',
    tags: ['Dance', 'Cultural'],
    rubric: [
      { id: 1, name: 'Choreography', maxPoints: 10 }, { id: 2, name: 'Expression', maxPoints: 10 },
      { id: 3, name: 'Synchronization', maxPoints: 10 }, { id: 4, name: 'Costume & Stage Presence', maxPoints: 10 }
    ],
    teams: [
      { id: 1, name: 'Tarangini', members: ['Ananya', 'Prisha', 'Diya'], project: 'Contemporary Bharatanatyam fusion', score: 36 },
      { id: 2, name: 'Nritya Kala', members: ['Kavya', 'Sneha', 'Mira'], project: 'Classical Kathak ensemble', score: 33 },
      { id: 3, name: 'Rhythm Republic', members: ['Riya', 'Simran', 'Avni'], project: 'Bollywood-street dance mashup', score: 30 }
    ]
  },
  {
    id: 3, name: 'DebateX Finals', date: '2026-05-01', status: 'upcoming',
    tags: ['Debate', 'Oratory'],
    rubric: [
      { id: 1, name: 'Argumentation', maxPoints: 15 }, { id: 2, name: 'Rebuttal Quality', maxPoints: 10 },
      { id: 3, name: 'Delivery & Rhetoric', maxPoints: 10 }, { id: 4, name: 'Evidence & Research', maxPoints: 15 }
    ],
    teams: []
  }
];

// Transcript templates keyed by primary tag
const TRANSCRIPT_FLAVORS = {
  Hackathon: [
    'We identified that 60% of household waste is incorrectly sorted at source.',
    'Our solution uses a lightweight MobileNet-v3 model running on-device for real-time classification.',
    'The app gives instant visual feedback with a simple, distraction-free interface.',
    'We partnered with two municipal corporations for a pilot deployment across 500 households.',
    'Early data shows a 40% improvement in correct segregation within the first week.',
    'The model was fine-tuned on 12,000 Indian waste images covering regional packaging.',
    'We designed the flow to require zero onboarding for first-time users.',
    'Our backend runs on a serverless architecture, keeping costs under two thousand rupees per month.',
    'The gamification layer rewards consistent users with municipality-backed incentives.',
    'We believe this can scale to tier-2 and tier-3 cities where waste management is most critical.'
  ],
  Dance: [
    'The opening sequence blends classical Bharatanatyam mudras with contemporary movement vocabulary.',
    'Each transition was choreographed to precisely match the rhythmic cycle of the talam.',
    'The group maintains perfect formation throughout the complex jathi sequence.',
    'Facial expressions convey the narrative arc from devotion through longing to celebration.',
    'The finale incorporates a dramatic tempo shift with synchronized lifts and floor work.',
    'Costume palette shifts mid-performance to represent the seasonal theme.',
    'Footwork precision during the alarippu section demonstrates rigorous classical training.',
    'Spatial awareness across the 12-meter stage is exceptional with no crowding.',
    'The lighting cues complement transitions without overpowering the dancers.',
    'Audience engagement peaks during the improvised jugalbandi between the leads.'
  ],
  Debate: [
    'The proposition establishes a clear framework grounded in utilitarian ethics.',
    'Evidence cited from the 2025 WHO report directly supports the core claim.',
    'The rebuttalist identifies a critical gap in the causal chain of the opposition argument.',
    'Analogies drawn from historical trade policy make the abstract point accessible.',
    'The closing summary effectively reframes the debate around the strongest line of argument.',
    'Cross-examination reveals an inconsistency between the first and second opposition speeches.',
    'Statistical literacy is high with proper contextualization of percentages.',
    'Rhetorical pacing builds momentum towards the key policy recommendation.',
    'The team pre-empts the strongest counter-argument before it can be raised.',
    'Final rebuttal distills three complex points into a single memorable takeaway.'
  ],
  default: [
    'The team presents a compelling opening statement establishing the problem context.',
    'Technical implementation details demonstrate strong foundational understanding.',
    'The presentation maintains consistent energy and audience engagement.',
    'Evidence of real-world validation strengthens the overall narrative.',
    'The team addresses potential limitations proactively with thoughtful mitigation strategies.',
    'Creative elements distinguish this entry from conventional approaches.',
    'Time management across the presentation is well-calibrated.',
    'The Q&A responses are precise and demonstrate deep domain knowledge.',
    'Visual aids complement rather than distract from the spoken content.',
    'The closing statement ties back effectively to the opening thesis.'
  ]
};

function getTranscriptLines(comp) {
  const primaryTag = (comp.tags && comp.tags[0]) || 'default';
  const texts = TRANSCRIPT_FLAVORS[primaryTag] || TRANSCRIPT_FLAVORS.default;
  const rubric = comp.rubric || [];
  return texts.map((text, i) => ({
    time: `${Math.floor((i * 7 + 4) / 60)}:${String((i * 7 + 4) % 60).padStart(2, '0')}`,
    text,
    tag: rubric.length ? rubric[i % rubric.length].name : 'General'
  }));
}

const FEEDBACK_DATA = {
  strengths: ['Strong problem-solution fit with clear evidence of real-world validation through the pilot program.', 'Technical architecture is well-considered \u2014 on-device inference avoids latency and privacy concerns.', 'Regional customization of the training dataset shows depth of understanding.', 'Cost-conscious design with serverless backend demonstrates mature engineering thinking.'],
  improvements: ['The pitch could benefit from a clearer revenue model \u2014 the path to sustainability was not fully articulated.', 'Consider addressing edge cases like mixed-material items or items not in the current training set.', 'The gamification strategy lacked specifics on user retention beyond initial novelty.', 'A brief competitive analysis would strengthen the positioning.'],
  nuances: ['The 40% improvement figure lacked clarification on measurement methodology or baseline conditions.', 'Scaling to tier-2/3 cities was proposed but infrastructure challenges were not addressed.', 'Update deployment strategies for model retraining were not discussed.'],
  judgeRemarks: [{ judge: 'Pranjal', text: 'Impressive problem framing and real deployment data. The team clearly understands the domain, but needs to tighten the business narrative.' }, { judge: 'Aditi', text: 'Clean presentation, good pacing. The technical depth is there, but I wanted to hear more about failure modes and edge cases.' }]
};

// ── State ────────────────────────────────────────────────────
const STATE = {
  currentView: 'landing', currentUser: null, userRole: null,
  // Admin
  selectedCompId: null, adminDetailTab: 'rubric',
  // Judge
  judgeCompId: null, judgeCurrentTeam: 0,
  audioPlaying: false, audioTimer: 0, audioInterval: null,
  transcriptInterval: null, transcriptIndex: 0,
  judgeScores: {}, judgeRemarks: '', vibeScore: 5, scoredTeams: new Set(),
  // Student
  studentTab: 'leaderboard', feedbackLoaded: false, feedbackLoading: false,
  modal: null
};

function getComp(id) { return COMPETITIONS.find(c => c.id === id); }

// ── Router ──────────────────────────────────────────────────
function navigate(view, opts = {}) {
  STATE.currentView = view;
  if (opts.role) { STATE.userRole = opts.role; STATE.currentUser = 'Pranjal'; }
  if (opts.tab !== undefined) {
    if (view === 'student') STATE.studentTab = opts.tab;
  }
  render();
}
function logout() {
  Object.assign(STATE, {
    currentUser: null, userRole: null, selectedCompId: null,
    judgeCompId: null, judgeCurrentTeam: 0, audioPlaying: false, audioTimer: 0,
    transcriptIndex: 0, feedbackLoaded: false, feedbackLoading: false,
    judgeScores: {}, judgeRemarks: '', vibeScore: 5, scoredTeams: new Set()
  });
  clearInterval(STATE.audioInterval); clearInterval(STATE.transcriptInterval);
  STATE.audioInterval = null; STATE.transcriptInterval = null;
  navigate('landing');
}

// ── Render ───────────────────────────────────────────────────
const app = document.getElementById('app');
function render() {
  let html = STATE.currentView === 'landing' ? renderLanding() : (renderNav() + renderDashboard());
  app.innerHTML = html;
  app.querySelector('.view-enter')?.offsetHeight;
  bindEvents();
}

function renderNav() {
  const r = STATE.userRole;
  const label = r === 'admin' ? 'Organizer' : r === 'judge' ? 'Judge' : 'Student';
  let links = '';
  if (r === 'student') {
    links = `<button class="nav-link ${STATE.studentTab === 'leaderboard' ? 'active' : ''}" data-action="student-tab" data-tab="leaderboard">Leaderboard</button>
    <button class="nav-link ${STATE.studentTab === 'feedback' ? 'active' : ''}" data-action="student-tab" data-tab="feedback">Feedback</button>`;
  }
  return `<nav class="nav"><div class="nav-inner">
    <div class="nav-logo" data-action="home">Juwi <span class="dot-sep">by</span> <img src="dot-logo.png" alt="Dot" class="dot-logo-img" /></div>
    <div class="nav-links">${links}</div>
    <div class="nav-user"><span class="text-sm">${label}</span><div class="nav-user-avatar">P</div>
    <button class="btn-icon" data-action="logout" title="Sign out">${icon('logout')}</button></div>
  </div></nav>`;
}

function renderDashboard() {
  let c = '';
  if (STATE.currentView === 'admin') c = renderAdmin();
  else if (STATE.currentView === 'judge') c = renderJudge();
  else if (STATE.currentView === 'student') c = renderStudent();
  return `<div class="main-content view-enter" style="margin-left:0">${c}</div>`;
}

// ── Landing ──────────────────────────────────────────────────
function renderLanding() {
  return `<nav class="nav landing-nav"><div class="nav-inner"><div class="nav-logo">Juwi <span class="dot-sep">by</span> <img src="dot-logo.png" alt="Dot" class="dot-logo-img" /></div><div></div></div></nav>
  <main class="landing view-enter">
    <section class="hero">
      <div class="hero-eyebrow">Introducing Juwi</div>
      <h1>AI-Augmented Judging for the Top 1%</h1>
      <p>A decision-support system that eliminates bias, combats judge fatigue, and surfaces the teams that truly deserve to win. A product of Dot.</p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" data-action="login" data-role="admin">Enter as Admin ${icon('arrowRight')}</button>
        <button class="btn btn-secondary btn-lg" data-action="login" data-role="judge">Enter as Judge</button>
        <button class="btn btn-secondary btn-lg" data-action="login" data-role="student">Enter as Student</button>
      </div>
    </section>
    <section class="features-section"><div class="features-header"><h2>Built for real-world judging</h2>
    <p>Juwi rethinks the competition judging pipeline with surgical precision and responsible AI.</p></div>
    <div class="features-grid container">
      <div class="card feature-card"><div class="feature-icon">${icon('brain')}</div><h3>Combats Judge Fatigue</h3><p>After the 15th pitch, scores drift. Juwi provides an AI-anchored reference score alongside the judge's manual input, keeping evaluations consistent from first pitch to last.</p></div>
      <div class="card feature-card"><div class="feature-icon">${icon('shield')}</div><h3>Prompt Injection Defense</h3><p>Teams that load pitches with buzzwords and fluff get flagged. Our analysis layer maps spoken claims to the rubric, rewarding substance over style.</p></div>
      <div class="card feature-card"><div class="feature-icon">${icon('target')}</div><h3>Cost-Efficient Deep Analysis</h3><p>Running full AI analysis on every team is expensive and wasteful. Juwi runs deep analysis only on the top 20% of manually scored teams, cutting API costs by up to 80%.</p></div>
    </div></section>
    <section class="cta-section"><div class="cta-box"><h2>Experience the demo</h2><p>Sign in with one of the three roles to explore Juwi's interface and capabilities.</p>
    <div class="cta-roles">
      <button class="btn btn-primary" data-action="login" data-role="admin">${icon('settings')} Admin</button>
      <button class="btn btn-secondary" data-action="login" data-role="judge">${icon('clipboard')} Judge</button>
      <button class="btn btn-secondary" data-action="login" data-role="student">${icon('award')} Student</button>
    </div></div></section>
  </main>`;
}

// ── Admin ────────────────────────────────────────────────────
function renderAdmin() {
  if (STATE.selectedCompId) return renderAdminDetail();
  return renderAdminGrid();
}

function renderAdminGrid() {
  const totalTeams = COMPETITIONS.reduce((s, c) => s + c.teams.length, 0);
  return `<div class="container">
    <div class="page-header"><h1>Organizer Dashboard</h1><p>Welcome back, Pranjal. Manage competitions, rubrics, and teams.</p></div>
    <div class="stats-row">
      <div class="card stat-card"><div class="stat-label">Competitions</div><div class="stat-value">${COMPETITIONS.length}</div></div>
      <div class="card stat-card"><div class="stat-label">Total Teams</div><div class="stat-value">${totalTeams}</div></div>
      <div class="card stat-card"><div class="stat-label">Active</div><div class="stat-value">${COMPETITIONS.filter(c => c.status === 'active').length}</div></div>
    </div>
    <div class="flex justify-between items-center mb-4"><h2>Competitions</h2>
    <button class="btn btn-primary btn-sm" data-action="add-competition">${icon('plus')} New Competition</button></div>
    <div class="comp-grid">
      ${COMPETITIONS.map(c => `<div class="card comp-card" data-action="select-comp" data-id="${c.id}">
        <div class="comp-card-header"><h3>${c.name}</h3><span class="badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'}">${c.status}</span></div>
        <div class="tag-list">${c.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>
        <div class="comp-card-meta"><span>${icon('calendar')} ${c.date}</span><span>${icon('users')} ${c.teams.length} teams</span><span>${icon('sliders')} ${c.rubric.length} criteria</span></div>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderAdminDetail() {
  const comp = getComp(STATE.selectedCompId); if (!comp) return '';
  const tab = STATE.adminDetailTab;
  const maxPts = comp.rubric.reduce((s, r) => s + r.maxPoints, 0);
  return `<div class="container">
    <div class="breadcrumb"><button class="breadcrumb-back" data-action="admin-back">${icon('arrowLeft')} Competitions</button>
    <span class="breadcrumb-sep">${icon('chevronRight') || '/'}</span><span class="breadcrumb-current">${comp.name}</span></div>
    <div class="comp-detail-header"><h1>${comp.name}</h1><div class="tag-list">${comp.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div></div>
    <p class="text-secondary text-sm mb-4">${comp.date} &middot; ${comp.status} &middot; ${comp.rubric.length} criteria &middot; ${maxPts} max pts</p>
    <div class="comp-detail-tabs">
      <button class="comp-detail-tab ${tab === 'rubric' ? 'active' : ''}" data-action="admin-detail-tab" data-tab="rubric">${icon('sliders')} Rubric</button>
      <button class="comp-detail-tab ${tab === 'teams' ? 'active' : ''}" data-action="admin-detail-tab" data-tab="teams">${icon('users')} Teams</button>
    </div>
    ${tab === 'rubric' ? renderAdminRubric(comp) : renderAdminTeams(comp)}
  </div>`;
}

function renderAdminRubric(comp) {
  return `<h3 class="mb-4">Build Rubric</h3>
  <div class="rubric-builder">${comp.rubric.map(r => `<div class="rubric-item">
    <span class="rubric-name">${r.name}</span><span class="rubric-pts">${r.maxPoints} pts</span>
    <button class="btn-icon" data-action="remove-rubric" data-rid="${r.id}" title="Remove">${icon('x')}</button>
  </div>`).join('')}</div>
  <div class="rubric-add-row">
    <input class="input" id="rubric-name-input" placeholder="Criterion name (e.g. Choreography)" />
    <input class="input input-small" id="rubric-pts-input" type="number" placeholder="Pts" min="1" max="100" value="10" />
    <button class="btn btn-primary btn-sm" data-action="add-rubric">${icon('plus')} Add</button>
  </div>`;
}

function renderAdminTeams(comp) {
  return `<div class="flex justify-between items-center mb-4"><h3>Registered Teams</h3>
  <button class="btn btn-primary btn-sm" data-action="add-team">${icon('plus')} Add Team</button></div>
  <div class="team-list">${comp.teams.map(t => `<div class="team-item"><div class="team-info">
    <div class="team-name">${t.name}</div><div class="team-members">${t.members.join(', ')} &mdash; ${t.project}</div>
  </div><span class="badge badge-neutral">${t.members.length} members</span></div>`).join('')}
  ${comp.teams.length === 0 ? '<p class="text-sm text-tertiary" style="text-align:center;padding:24px">No teams registered yet.</p>' : ''}
  </div>`;
}

// ── Judge ────────────────────────────────────────────────────
function renderJudge() {
  if (!STATE.judgeCompId) return renderJudgeSelector();
  return renderJudgeScoring();
}

function renderJudgeSelector() {
  const activeComps = COMPETITIONS.filter(c => c.status === 'active' && c.teams.length > 0);
  return `<div class="container"><div class="page-header"><h1>Judge Panel</h1><p>Welcome, Pranjal. Select a competition to begin judging.</p></div>
  <div class="judge-selector"><h2>Select Competition</h2><p>Choose the competition you are assigned to judge.</p>
  <div class="judge-comp-list">${activeComps.map(c => `<div class="card judge-comp-item" data-action="judge-select-comp" data-id="${c.id}">
    <div class="judge-comp-info"><h3>${c.name}</h3><div class="text-sm text-secondary">${c.date}</div>
    <div class="tag-list">${c.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div></div>
    <div class="judge-comp-meta"><div style="font-weight:600">${c.teams.length} teams</div><div>${c.rubric.length} criteria</div></div>
  </div>`).join('')}
  ${activeComps.length === 0 ? '<p class="text-sm text-tertiary" style="text-align:center;padding:24px">No active competitions with teams available.</p>' : ''}
  </div></div></div>`;
}

function renderJudgeScoring() {
  const comp = getComp(STATE.judgeCompId); if (!comp) return '';
  const team = comp.teams[STATE.judgeCurrentTeam]; if (!team) return '';
  const rubric = comp.rubric;
  if (Object.keys(STATE.judgeScores).length === 0) rubric.forEach(r => { STATE.judgeScores[r.id] = Math.floor(r.maxPoints / 2); });
  const maxTotal = rubric.reduce((s, r) => s + r.maxPoints, 0) + 10;
  const totalManual = Object.values(STATE.judgeScores).reduce((a, b) => a + b, 0);
  const totalWithVibe = totalManual + Number(STATE.vibeScore);
  const isScored = STATE.scoredTeams.has(`${comp.id}-${team.id}`);
  const timerStr = formatTime(STATE.audioTimer);
  return `<div class="container">
    <div class="breadcrumb"><button class="breadcrumb-back" data-action="judge-back">${icon('arrowLeft')} Competitions</button>
    <span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${comp.name}</span></div>
    <div class="page-header"><h1>Judge Panel</h1><p>Scoring for ${comp.name}. Team ${STATE.judgeCurrentTeam + 1} of ${comp.teams.length}.</p></div>
    <div class="judge-live-header"><div class="judge-team-label"><div class="judge-team-indicator"></div>
    <div><h3 style="margin-bottom:2px">${team.name}</h3><span class="text-sm text-secondary">${team.members.join(', ')} &mdash; ${team.project}</span></div></div>
    <div class="flex items-center" style="gap:8px">
      <button class="btn btn-secondary btn-sm" data-action="prev-team" ${STATE.judgeCurrentTeam === 0 ? 'disabled style="opacity:0.4;pointer-events:none"' : ''}>Prev</button>
      <button class="btn btn-secondary btn-sm" data-action="next-team" ${STATE.judgeCurrentTeam === comp.teams.length - 1 ? 'disabled style="opacity:0.4;pointer-events:none"' : ''}>Next</button>
    </div></div>
    <div class="judge-two-col"><div>
      <div class="card audio-section">
        <div class="flex items-center justify-between"><h3 style="font-size:0.8125rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-tertiary)">Live Audio Pitch</h3>
        <span class="badge ${STATE.audioPlaying ? 'badge-success' : 'badge-neutral'}">${STATE.audioPlaying ? 'Recording' : 'Paused'}</span></div>
        <div class="audio-wave-container" id="audio-wave">${Array.from({ length: 40 }, () => `<div class="audio-bar" style="height:${STATE.audioPlaying ? Math.random() * 50 + 10 : 6}px"></div>`).join('')}</div>
        <div class="audio-controls"><button class="btn btn-primary btn-sm" data-action="toggle-audio" id="audio-toggle-btn">${STATE.audioPlaying ? icon('pause') : icon('play')} ${STATE.audioPlaying ? 'Pause' : 'Play'}</button><span class="audio-timer">${timerStr}</span></div>
      </div>
      <div class="card transcript-section mt-4" id="transcript-panel"><h3>AI Rubric Mapping</h3><div class="transcript-feed" id="transcript-feed">${renderTranscriptLines()}</div></div>
    </div><div>
      <div class="card scoring-section">
        <h3 style="font-size:0.8125rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-tertiary);margin-bottom:20px">Manual Scoring</h3>
        <div class="scoring-sliders">${rubric.map(r => `<div class="slider-group"><div class="slider-header">
          <span class="slider-label">${r.name}</span><span class="slider-value" id="score-val-${r.id}">${STATE.judgeScores[r.id] || 0}</span></div>
          <input type="range" min="0" max="${r.maxPoints}" value="${STATE.judgeScores[r.id] || 0}" data-action="score-slider" data-id="${r.id}" />
        </div>`).join('')}</div>
        <div class="divider"></div>
        <div class="vibe-score-row"><div class="slider-group"><div class="slider-header"><span class="slider-label">Vibe Score</span>
        <span class="slider-value" id="vibe-val">${STATE.vibeScore}</span></div>
        <input type="range" min="0" max="10" value="${STATE.vibeScore}" data-action="vibe-slider" /></div></div>
        <div class="judge-remarks mt-4"><div class="input-group"><label>Judge's Remarks</label>
        <textarea class="input" id="judge-remarks" placeholder="Add any additional observations...">${STATE.judgeRemarks}</textarea></div></div>
        <div class="finalize-row"><div class="total-score">${totalWithVibe} <span>/ ${maxTotal}</span></div>
        <button class="btn ${isScored ? 'btn-secondary' : 'btn-accent'}" data-action="finalize-score" ${isScored ? 'disabled style="opacity:0.6;pointer-events:none"' : ''}>${isScored ? icon('check') + ' Scored' : icon('check') + ' Finalize Score'}</button></div>
      </div>
    </div></div>
  </div>`;
}

function renderTranscriptLines() {
  const comp = getComp(STATE.judgeCompId);
  if (!comp) return '<p class="text-sm text-tertiary" style="text-align:center;padding:20px 0">Play audio to see live rubric mapping.</p>';
  const allLines = getTranscriptLines(comp);
  const lines = allLines.slice(0, STATE.transcriptIndex);
  if (lines.length === 0) return '<p class="text-sm text-tertiary" style="text-align:center;padding:20px 0">Play audio to see live rubric mapping.</p>';
  return lines.map(l => `<div class="transcript-line"><span class="transcript-time">${l.time}</span>
    <span class="transcript-text">${l.text} <span class="transcript-tag">${l.tag}</span></span></div>`).join('');
}
function formatTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// ── Student ──────────────────────────────────────────────────
function renderStudent() {
  return `<div class="container"><div class="page-header"><h1>Student Portal</h1><p>Welcome, Pranjal. View your results and detailed feedback.</p></div>
  ${STATE.studentTab === 'leaderboard' ? renderLeaderboard() : renderFeedback()}</div>`;
}

function renderLeaderboard() {
  const comp = COMPETITIONS.find(c => c.status === 'active' && c.teams.length > 0) || COMPETITIONS[0];
  const sorted = [...comp.teams].sort((a, b) => b.score - a.score);
  const maxScore = comp.rubric.reduce((s, r) => s + r.maxPoints, 0) + 10;
  const topTeams = sorted.slice(0, 5);
  return `<div class="flex justify-between items-center mb-4"><h2>Leaderboard &mdash; ${comp.name}</h2><span class="badge badge-neutral">Top 5</span></div>
  <div class="card" style="padding:0;overflow:hidden"><table class="leaderboard-table"><thead><tr><th class="rank-col">Rank</th><th>Team</th><th>Project</th><th>Members</th><th class="score-bar-cell">Score</th></tr></thead><tbody>
  ${topTeams.map((t, i) => `<tr><td><span class="rank-badge rank-${i < 3 ? i + 1 : 'other'}">${i + 1}</span></td>
    <td style="font-weight:600">${t.name}</td><td class="text-secondary text-sm">${t.project}</td>
    <td class="text-sm">${t.members.join(', ')}</td><td><div class="score-bar-wrap">
    <div class="score-bar-track"><div class="score-bar-fill" style="width:${(t.score / maxScore * 100).toFixed(1)}%"></div></div>
    <span class="score-bar-num">${t.score}</span></div></td></tr>`).join('')}
  </tbody></table></div>`;
}

function renderFeedback() {
  if (STATE.feedbackLoading) return `<div class="card feedback-loading"><div class="spinner"></div><p class="text-sm text-secondary">Generating detailed AI feedback...</p></div>`;
  if (!STATE.feedbackLoaded) return `<div class="card feedback-prompt"><h2>Detailed Feedback</h2><p>Get AI-generated analysis of your team's pitch, including strengths, improvement areas, and nuances identified during evaluation.</p>
    <button class="btn btn-primary btn-lg" data-action="generate-feedback">${icon('zap')} Generate Detailed Feedback</button></div>`;
  return `<div class="feedback-content"><div class="flex justify-between items-center mb-6"><div><h2>Feedback for NeuralNexus</h2>
    <p class="text-sm text-secondary mt-2">AI-generated analysis based on pitch transcript, rubric mapping, and judge evaluations.</p></div>
    <span class="badge badge-success">AI Analysis Complete</span></div>
    <div class="card feedback-section"><h3>${icon('check')} Strengths</h3><ul class="feedback-list">${FEEDBACK_DATA.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>
    <div class="card feedback-section"><h3>${icon('target')} Areas for Improvement</h3><ul class="feedback-list">${FEEDBACK_DATA.improvements.map(s => `<li>${s}</li>`).join('')}</ul></div>
    <div class="card feedback-section"><h3>${icon('brain')} Nuances & Observations</h3><ul class="feedback-list">${FEEDBACK_DATA.nuances.map(s => `<li>${s}</li>`).join('')}</ul></div>
    <div class="card feedback-section"><h3>${icon('messageSquare')} Judge Remarks</h3><div class="flex flex-col" style="gap:16px">
    ${FEEDBACK_DATA.judgeRemarks.map(r => `<div class="judge-remark-card">"${r.text}"<div class="judge-remark-author">&mdash; ${r.judge}</div></div>`).join('')}</div></div></div>`;
}

// ── Modal ────────────────────────────────────────────────────
let _modalTags = [];

function showModal(type) {
  STATE.modal = type;
  _modalTags = [];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'modal-overlay';
  let content = '';
  if (type === 'add-competition') {
    content = `<div class="modal"><div class="modal-header"><h2>New Competition</h2><button class="btn-icon" data-action="close-modal">${icon('x')}</button></div>
    <div class="modal-body">
      <div class="input-group"><label>Competition Name</label><input class="input" id="modal-comp-name" placeholder="e.g. HackNITR 7.0" /></div>
      <div class="input-group"><label>Date</label><input class="input" id="modal-comp-date" type="date" /></div>
      <div class="input-group"><label>Tags</label>
        <div class="tag-chip-input-wrap" id="tag-input-wrap"><input id="modal-tag-input" placeholder="Type a tag and press Enter" /></div>
        <span class="text-xs text-tertiary">Press Enter to add tags like Hackathon, Dance, Debate</span>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="save-competition">Create</button></div></div>`;
  } else if (type === 'add-team') {
    content = `<div class="modal"><div class="modal-header"><h2>Add Team</h2><button class="btn-icon" data-action="close-modal">${icon('x')}</button></div>
    <div class="modal-body">
      <div class="input-group"><label>Team Name</label><input class="input" id="modal-team-name" placeholder="e.g. PixelPioneers" /></div>
      <div class="input-group"><label>Members (comma separated)</label><input class="input" id="modal-team-members" placeholder="e.g. Aryan, Kavya, Riya" /></div>
      <div class="input-group"><label>Project Title</label><input class="input" id="modal-team-project" placeholder="e.g. AI-powered waste sorting" /></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="save-team">Add Team</button></div></div>`;
  }
  overlay.innerHTML = content;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  bindModalEvents();
}

function closeModal() { const o = document.getElementById('modal-overlay'); if (o) o.remove(); STATE.modal = null; _modalTags = []; }

function renderModalTags() {
  const wrap = document.getElementById('tag-input-wrap'); if (!wrap) return;
  const input = wrap.querySelector('input');
  wrap.innerHTML = _modalTags.map((t, i) => `<span class="tag-chip">${t}<span class="tag-remove" data-tag-idx="${i}">&times;</span></span>`).join('');
  const newInput = document.createElement('input');
  newInput.id = 'modal-tag-input'; newInput.placeholder = _modalTags.length ? '' : 'Type a tag and press Enter';
  wrap.appendChild(newInput);
  newInput.focus();
  newInput.addEventListener('keydown', handleTagKeydown);
  wrap.querySelectorAll('.tag-remove').forEach(el => {
    el.addEventListener('click', () => { _modalTags.splice(parseInt(el.dataset.tagIdx), 1); renderModalTags(); });
  });
}

function handleTagKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const v = e.target.value.trim().replace(/^#/, '');
    if (v && !_modalTags.includes(v)) { _modalTags.push(v); renderModalTags(); }
  } else if (e.key === 'Backspace' && !e.target.value && _modalTags.length) {
    _modalTags.pop(); renderModalTags();
  }
}

// ── Toast ────────────────────────────────────────────────────
function showToast(msg) {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Audio Simulation ─────────────────────────────────────────
function toggleAudio() {
  STATE.audioPlaying = !STATE.audioPlaying;
  if (STATE.audioPlaying) {
    STATE.audioInterval = setInterval(() => {
      STATE.audioTimer++;
      const el = document.querySelector('.audio-timer'); if (el) el.textContent = formatTime(STATE.audioTimer);
      document.querySelectorAll('.audio-bar').forEach(b => { b.style.height = `${Math.random() * 50 + 10}px`; });
    }, 1000);
    const comp = getComp(STATE.judgeCompId);
    const totalLines = comp ? getTranscriptLines(comp).length : 10;
    STATE.transcriptInterval = setInterval(() => {
      if (STATE.transcriptIndex < totalLines) {
        STATE.transcriptIndex++;
        const feed = document.getElementById('transcript-feed');
        if (feed) { feed.innerHTML = renderTranscriptLines(); const p = document.getElementById('transcript-panel'); if (p) p.scrollTop = p.scrollHeight; }
      } else clearInterval(STATE.transcriptInterval);
    }, 3500);
    const btn = document.getElementById('audio-toggle-btn'); if (btn) btn.innerHTML = `${icon('pause')} Pause`;
    const badge = document.querySelector('.audio-section .badge'); if (badge) { badge.className = 'badge badge-success'; badge.textContent = 'Recording'; }
  } else {
    clearInterval(STATE.audioInterval); clearInterval(STATE.transcriptInterval);
    STATE.audioInterval = null; STATE.transcriptInterval = null;
    document.querySelectorAll('.audio-bar').forEach(b => { b.style.height = '6px'; });
    const btn = document.getElementById('audio-toggle-btn'); if (btn) btn.innerHTML = `${icon('play')} Play`;
    const badge = document.querySelector('.audio-section .badge'); if (badge) { badge.className = 'badge badge-neutral'; badge.textContent = 'Paused'; }
  }
}

function stopAudioAndTranscript() {
  STATE.audioPlaying = false; clearInterval(STATE.audioInterval); clearInterval(STATE.transcriptInterval);
  STATE.audioInterval = null; STATE.transcriptInterval = null;
}
function resetJudgeState() {
  STATE.transcriptIndex = 0; STATE.audioTimer = 0; STATE.judgeScores = {}; STATE.judgeRemarks = ''; STATE.vibeScore = 5;
}
function updateTotalScore() {
  const comp = getComp(STATE.judgeCompId); if (!comp) return;
  const total = Object.values(STATE.judgeScores).reduce((a, b) => a + b, 0) + Number(STATE.vibeScore);
  const max = comp.rubric.reduce((s, r) => s + r.maxPoints, 0) + 10;
  const el = document.querySelector('.total-score'); if (el) el.innerHTML = `${total} <span>/ ${max}</span>`;
}

// ── Event Binding ────────────────────────────────────────────
function bindEvents() {
  document.querySelectorAll('[data-action]').forEach(el => {
    const a = el.dataset.action;
    if (a === 'login') el.addEventListener('click', () => { const r = el.dataset.role; navigate(r === 'admin' ? 'admin' : r === 'judge' ? 'judge' : 'student', { role: r }); });
    if (a === 'home' || a === 'logout') el.addEventListener('click', () => logout());
    if (a === 'student-tab') el.addEventListener('click', () => navigate('student', { role: 'student', tab: el.dataset.tab }));
    if (a === 'select-comp') el.addEventListener('click', () => { STATE.selectedCompId = parseInt(el.dataset.id); STATE.adminDetailTab = 'rubric'; render(); });
    if (a === 'admin-back') el.addEventListener('click', () => { STATE.selectedCompId = null; render(); });
    if (a === 'admin-detail-tab') el.addEventListener('click', () => { STATE.adminDetailTab = el.dataset.tab; render(); });
    if (a === 'add-competition') el.addEventListener('click', () => showModal('add-competition'));
    if (a === 'add-team') el.addEventListener('click', () => showModal('add-team'));
    if (a === 'add-rubric') el.addEventListener('click', () => {
      const comp = getComp(STATE.selectedCompId); if (!comp) return;
      const n = document.getElementById('rubric-name-input')?.value.trim();
      const p = parseInt(document.getElementById('rubric-pts-input')?.value) || 10;
      if (n) { comp.rubric.push({ id: Date.now(), name: n, maxPoints: p }); render(); showToast(`"${n}" added to rubric`); }
    });
    if (a === 'remove-rubric') el.addEventListener('click', () => {
      const comp = getComp(STATE.selectedCompId); if (!comp) return;
      const rid = parseInt(el.dataset.rid); const idx = comp.rubric.findIndex(r => r.id === rid);
      if (idx !== -1) { const nm = comp.rubric[idx].name; comp.rubric.splice(idx, 1); render(); showToast(`"${nm}" removed`); }
    });
    if (a === 'judge-select-comp') el.addEventListener('click', () => { STATE.judgeCompId = parseInt(el.dataset.id); STATE.judgeCurrentTeam = 0; resetJudgeState(); render(); });
    if (a === 'judge-back') el.addEventListener('click', () => { stopAudioAndTranscript(); STATE.judgeCompId = null; resetJudgeState(); render(); });
    if (a === 'toggle-audio') el.addEventListener('click', () => toggleAudio());
    if (a === 'score-slider') el.addEventListener('input', () => { STATE.judgeScores[el.dataset.id] = parseInt(el.value); const v = document.getElementById(`score-val-${el.dataset.id}`); if (v) v.textContent = el.value; updateTotalScore(); });
    if (a === 'vibe-slider') el.addEventListener('input', () => { STATE.vibeScore = parseInt(el.value); const v = document.getElementById('vibe-val'); if (v) v.textContent = el.value; updateTotalScore(); });
    if (a === 'finalize-score') el.addEventListener('click', () => {
      const comp = getComp(STATE.judgeCompId); if (!comp) return;
      const team = comp.teams[STATE.judgeCurrentTeam];
      const total = Object.values(STATE.judgeScores).reduce((a, b) => a + b, 0) + Number(STATE.vibeScore);
      team.score = total; STATE.judgeRemarks = document.getElementById('judge-remarks')?.value || '';
      STATE.scoredTeams.add(`${comp.id}-${team.id}`); render(); showToast(`Score finalized for ${team.name}: ${total} pts`);
    });
    if (a === 'prev-team') el.addEventListener('click', () => { if (STATE.judgeCurrentTeam > 0) { stopAudioAndTranscript(); STATE.judgeCurrentTeam--; resetJudgeState(); render(); } });
    if (a === 'next-team') el.addEventListener('click', () => { const comp = getComp(STATE.judgeCompId); if (comp && STATE.judgeCurrentTeam < comp.teams.length - 1) { stopAudioAndTranscript(); STATE.judgeCurrentTeam++; resetJudgeState(); render(); } });
    if (a === 'generate-feedback') el.addEventListener('click', () => { STATE.feedbackLoading = true; render(); setTimeout(() => { STATE.feedbackLoading = false; STATE.feedbackLoaded = true; render(); }, 2200); });
  });
}

function bindModalEvents() {
  document.querySelectorAll('[data-action="close-modal"]').forEach(el => el.addEventListener('click', () => closeModal()));
  const tagInput = document.getElementById('modal-tag-input');
  if (tagInput) tagInput.addEventListener('keydown', handleTagKeydown);
  const saveComp = document.querySelector('[data-action="save-competition"]');
  if (saveComp) saveComp.addEventListener('click', () => {
    const name = document.getElementById('modal-comp-name')?.value.trim();
    const date = document.getElementById('modal-comp-date')?.value;
    if (name) {
      COMPETITIONS.push({ id: Date.now(), name, date: date || 'TBD', status: 'upcoming', tags: [..._modalTags], rubric: [], teams: [] });
      closeModal(); render(); showToast(`"${name}" created`);
    }
  });
  const saveTeam = document.querySelector('[data-action="save-team"]');
  if (saveTeam) saveTeam.addEventListener('click', () => {
    const comp = getComp(STATE.selectedCompId); if (!comp) return;
    const name = document.getElementById('modal-team-name')?.value.trim();
    const members = document.getElementById('modal-team-members')?.value.split(',').map(m => m.trim()).filter(Boolean);
    const project = document.getElementById('modal-team-project')?.value.trim();
    if (name && members.length > 0) { comp.teams.push({ id: Date.now(), name, members, project: project || 'Untitled', score: 0 }); closeModal(); render(); showToast(`Team "${name}" added`); }
  });
}

// ── Boot ─────────────────────────────────────────────────────
render();
