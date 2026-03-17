// ============================================================
// JUWI Judge.js — Judge Portal Logic
// ============================================================

// ── Mock data ─────────────────────────────────────────────────
// ============================================================
// JUWI Judge.js — Dynamic API Integration
// ============================================================

// ── Global State (No more hardcoded teams!) ──────────────────
let MODERATE_TEAMS = [];
let currentTeamIndex = 0;
let isAudioActive = false;
let currentTeam = null;
let scores = {};

// Keep your PROS_CONS here for Phase 2 for now
const PROS_CONS = {
  3: { pros: '• Strong architecture', cons: '• Missing tests' }
};

// ── Audio Engine Variables ──────────────────────────────────────
let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;
let microphone;
let isSpeaking = false;
let silenceTimer = null;
let chunkStartTime = 0;

const SILENCE_THRESHOLD = 15;
const SILENCE_DURATION = 1500;
const MIN_CHUNK_TIME = 15000;

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

// ── Phase detection ───────────────────────────────────────────
async function initPhase() {
  const phase = parseInt(localStorage.getItem('juwi_phase') || '1');
  const tag = document.getElementById('phaseTagJudge');

  if (phase === 2) {
    if (tag) { tag.textContent = 'Phase 2: Live Finals'; tag.className = 'phase-indicator phase-2'; }
    document.getElementById('phase1View').style.display = 'none';
    document.getElementById('phase2View').style.display = 'block';

    // For Phase 2, we just load the whole database to get our accepted teams
    await fetchAllTeamsForPhase2();
  } else {
    if (tag) { tag.textContent = 'Phase 1: Mass Triage'; tag.className = 'phase-indicator phase-1'; }

    // FETCH REAL TEAMS FROM BACKEND!
    await fetchTriageQueue();
  }
}

// ── PHASE 1: DYNAMIC QUEUE ────────────────────────────────────
async function fetchTriageQueue() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/moderate-teams");
    const data = await res.json();

    if (data.status === "success") {
      MODERATE_TEAMS = data.queue; // Load the real Python MOCK_DATABASE!
      currentTeamIndex = 0;

      if (MODERATE_TEAMS.length === 0) {
        showQueueComplete();
      } else {
        renderRapidCard();
      }
    }
  } catch (err) {
    console.error("Failed to fetch queue", err);
    toast("Error: Could not reach Juwi Backend", "danger");
  }
}

function renderRapidCard() {
  const total = MODERATE_TEAMS.length;
  const t = MODERATE_TEAMS[currentTeamIndex];
  if (!t) return;

  document.getElementById('queueCounter').textContent = `Team ${currentTeamIndex + 1} of ${total}`;
  document.getElementById('queueFraction').textContent = `${currentTeamIndex + 1} / ${total}`;
  document.getElementById('queueProgress').style.width = `${((currentTeamIndex + 1) / total) * 100}%`;

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

async function decideTeam(decision) {
  const t = MODERATE_TEAMS[currentTeamIndex];

  try {
    // SEND THE JUDGE'S CLICK TO THE PYTHON BACKEND!
    const response = await fetch("http://127.0.0.1:8000/api/team-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: t.id, decision: decision })
    });

    if (response.ok) {
      toast(`${t.name} → ${decision === 'selected' ? 'Selected' : 'Rejected'}`, decision === 'selected' ? 'success' : 'danger');
    }
  } catch (err) {
    console.error("Failed to save decision", err);
    toast("Backend error: Decision not saved.", "danger");
  }

  nextInQueue();
}

function skipTeam() { toast('Skipped — will revisit.'); nextInQueue(); }

function nextInQueue() {
  currentTeamIndex++;
  if (currentTeamIndex >= MODERATE_TEAMS.length) {
    showQueueComplete();
  } else {
    renderRapidCard();
  }
}

function showQueueComplete() {
  document.getElementById('phase1View').innerHTML = `
    <div class="card text-center" style="padding:60px;">
      <div style="font-size:3rem;margin-bottom:20px;color:var(--accent);"><i class="ti ti-circle-check"></i></div>
      <h2>Review Queue Complete</h2>
      <p style="margin-top:8px;max-width:400px;margin-inline:auto;">You've processed all moderate teams. Go to the Admin portal to proceed to Phase 2.</p>
      <button class="btn btn-primary" style="margin-top:24px;" onclick="jumpToPhase2()">Force Jump to Phase 2 →</button>
    </div>`;
}

function jumpToPhase2() {
  localStorage.setItem('juwi_phase', '2');
  location.reload();
}

// Quick helper to not break Phase 2
async function fetchAllTeamsForPhase2() {
  try {
    // Fetch ALL teams from the backend
    const res = await fetch("http://127.0.0.1:8000/api/admin/teams");
    const data = await res.json();

    if (data.status === "success") {
      // Filter ONLY the ones that the Judge selected in Phase 1 (or were auto-accepted)
      MODERATE_TEAMS = data.teams.filter(t => t.status === 'selected' || t.bucket === 'AUTO_ACCEPT');
      initPhase2();
    }
  } catch (e) {
    console.error("Failed to fetch Phase 2 teams", e);
    toast("Error loading Phase 2 teams from DB.", "danger");
  }
}

// ── PHASE 2 ───────────────────────────────────────────────────
function initPhase2() {
  // We no longer check localStorage. We use the real DB array.
  const select = document.getElementById('teamSelect');
  select.innerHTML = '<option value="">Select a team to judge…</option>';

  if (MODERATE_TEAMS.length === 0) {
    select.innerHTML = '<option value="">No teams pushed to Phase 2 yet...</option>';
  }

  MODERATE_TEAMS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name + (t.college ? ` (${t.college})` : '');
    select.appendChild(opt);
  });

  buildRubricSliders();
}

function buildRubricSliders() {
  const rubrics = JSON.parse(localStorage.getItem('juwi_rubrics') || '[]');
  const defaults = [
    { id: 1, name: 'Innovation', weight: 10 },
    { id: 2, name: 'Technical Depth', weight: 10 },
    { id: 3, name: 'Code Quality', weight: 10 },
    { id: 4, name: 'Presentation', weight: 10 },
    { id: 5, name: 'UI/UX Design', weight: 10 },
  ];
  const list = rubrics.length ? rubrics : defaults;
  const max = list.reduce((a, b) => a + b.weight, 0);
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
  // Reset the timer input for the new team
  const timeInput = document.getElementById('presentationTime');
  if (timeInput) {
    timeInput.value = '';
    document.getElementById('penaltyWarning').style.display = 'none';
  }
}

function updateScore(id, max, val) {
  scores[id] = { val: +val, max };
  document.getElementById(`sv-${id}`).textContent = val;
  recalcTotal();
}

function recalcTotal() {
  // 1. Calculate Base Score from the sliders
  let baseTotal = Object.values(scores).reduce((a, b) => a + b.val, 0);

  // 2. Time Penalty Logic
  const timeInput = document.getElementById('presentationTime');
  const timeVal = timeInput && timeInput.value ? parseFloat(timeInput.value) : 0;
  const LIMIT = 5;
  let penalty = 0;

  const warningEl = document.getElementById('penaltyWarning');

  if (timeVal > LIMIT) {
    // Calculate how many extra minutes they took (capping the penalty at 5 extra minutes)
    const extraMinutes = Math.min(Math.ceil(timeVal - LIMIT), 5);

    // 10% penalty per extra minute (e.g., 2 extra mins = 0.20 multiplier)
    const penaltyMultiplier = extraMinutes * 0.10;

    // Apply penalty to the base score
    penalty = Math.floor(baseTotal * penaltyMultiplier);

    if (warningEl) {
      warningEl.style.display = 'block';
      warningEl.textContent = `⚠️ Overtime: +${extraMinutes} min. Penalty: -${penalty} pts`;
    }
  } else {
    // Within time limit, clear warnings
    if (warningEl) warningEl.style.display = 'none';
  }

  // 3. Calculate Final Score
  const finalTotal = Math.max(0, baseTotal - penalty); // Ensure score never drops below 0

  // 4. Update the Big Number UI
  const totalDisplay = document.getElementById('totalScore');
  if (totalDisplay) {
    totalDisplay.textContent = finalTotal;
    // Make the text turn red if a penalty is applied
    totalDisplay.style.color = penalty > 0 ? "var(--danger)" : "white";
  }

  return finalTotal; // Return this so the submit function can use it!
}

async function loadTeamContext() {
  // Grab the ID as a string, don't use parseInt!
  const tid = document.getElementById('teamSelect').value;
  if (!tid) return;

  // Force both sides to be strings just to be 100% safe
  currentTeam = MODERATE_TEAMS.find(t => String(t.id) === String(tid));

  if (currentTeam) {
    console.log("✅ Loading Context for:", currentTeam.name);
    // 1. Show the layout and basic details
    document.getElementById('judgeLayout').style.display = 'grid';

    const ab = document.getElementById('abstractPreview');
    if (ab) {
      ab.style.display = 'block';
      ab.textContent = currentTeam.abstract;
    }

    const ghLink = document.getElementById('githubLink');
    if (ghLink) ghLink.href = currentTeam.github;

    // 2. Put the UI in a "Loading" state so we know Qwen is thinking
    document.getElementById('prosBox').textContent = "🤖 AI is reading the codebase...";
    document.getElementById('consBox').textContent = "🤖 AI is reading the codebase...";
    document.getElementById('attackFeed').innerHTML = "<div style='padding:20px; text-align:center;'>Scanning GitHub Repo...</div>";

    toast(`Analyzing ${currentTeam.name}'s Repo...`);

    // 3. Fetch the REAL AI analysis from your FastAPI backend
    try {
      const response = await fetch(`http://127.0.0.1:8000/analyze-repo?github_url=${currentTeam.github}`);
      const data = await response.json();

      // 4. Inject the real AI results into your UI!
      document.getElementById('prosBox').style.whiteSpace = 'pre-line';
      document.getElementById('consBox').style.whiteSpace = 'pre-line';
      document.getElementById('prosBox').textContent = data.pros;
      document.getElementById('consBox').textContent = data.cons;

      const feed = document.getElementById('attackFeed');
      feed.innerHTML = data.questions.map(a => `
        <div class="attack-item">
          <strong><i class="ti ti-bolt" style="color:var(--accent);"></i> ${a.tag}</strong>
          ${a.q}
        </div>
      `).join('');

      // --- 🤖 NEW: AUTO-MOVE THE SLIDERS! ---
      if (data.scores_out_of_100) {
        const sliderWraps = document.querySelectorAll('.slider-wrap');
        sliderWraps.forEach(wrap => {
          const nameEl = wrap.querySelector('.slider-header span:first-child');
          const inputEl = wrap.querySelector('input[type="range"]');
          if (!nameEl || !inputEl) return;

          const name = nameEl.textContent.trim().toLowerCase();
          let percentage = null;

          // Map the AI's JSON output to the physical sliders on the screen
          if (name.includes('innovation')) percentage = data.scores_out_of_100['Innovation'];
          else if (name.includes('tech') || name.includes('depth')) percentage = data.scores_out_of_100['Technical Depth'];
          else if (name.includes('code') || name.includes('quality')) percentage = data.scores_out_of_100['Code Quality'];

          // If the AI scored this category, move the slider
          if (percentage !== null && percentage !== undefined) {
            const maxVal = parseInt(inputEl.max);
            const id = inputEl.id.replace('sl-', '');

            // Calculate the score based on the max slider value (e.g., 50% of 50 max points = 25)
            const calculatedVal = Math.round((percentage / 100) * maxVal);

            // Physically move the slider handle
            inputEl.value = calculatedVal;

            // Update the global math and the text span
            updateScore(id, maxVal, calculatedVal);

            // Add a subtle glowing animation so the Judge knows the AI did it
            inputEl.style.transition = "box-shadow 0.3s ease";
            inputEl.style.boxShadow = "0 0 12px var(--accent)";
            setTimeout(() => inputEl.style.boxShadow = "none", 2500);
          }
        });
        toast("🤖 AI auto-filled technical scores based on codebase!", "success");
      } else {
        toast("✅ AI Repo Analysis Complete!", "success");
      }
      // ----------------------------------------

    } catch (err) {
      console.error("Failed to fetch repo analysis", err);
      toast("Error reaching AI Backend", "danger");
    }

    //   // FOR TESTING: Override ByteForce's GitHub with Autotantra so the AI can actually read code
    //   if (currentTeam.name === "ByteForce") {
    //     currentTeam.github = "https://github.com/pranjalyt/autotantra";
    //   }

    //   document.getElementById('judgeLayout').style.display = 'grid';
    //   if (currentTeam.abstract) {
    //     const ab = document.getElementById('abstractPreview');
    //     ab.style.display = 'block';
    //     ab.textContent = currentTeam.abstract;
    //   }
    //   if (currentTeam.github) {
    //     document.getElementById('githubLink').href = currentTeam.github;
    //   }
    //   toast(`Context loaded: ${currentTeam.name}`);
    // }

  }
}

    // ── REAL Juwi Audio & AI Integration ────────────────────────

    async function toggleAudio() {
      isAudioActive = !isAudioActive;
      const btn = document.getElementById('audioToggle');
      const dot = document.getElementById('recDot');

      if (isAudioActive) {
        btn.innerHTML = '<i class="ti ti-player-stop"></i> Stop Audio';
        btn.classList.add('pulse-btn');
        dot.className = 'rec-dot active';

        // Clear the fake data
        document.getElementById('attackFeed').innerHTML = '';
        document.getElementById('bsDetail').textContent = "Listening for technical claims...";

        toast('Live audio activated. Juwi is listening.', 'success');
        await setupAudio();
      } else {
        btn.innerHTML = '<i class="ti ti-microphone"></i> Enable Live Audio';
        btn.classList.remove('pulse-btn');
        dot.className = 'rec-dot inactive';

        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        toast('Audio stopped.');
      }
    }

    async function setupAudio() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      mediaRecorder.onstart = () => { chunkStartTime = Date.now(); };
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (audioChunks.length === 0) return;
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];

        if (isAudioActive) {
          mediaRecorder.start();
        }
        sendToJuwiEngine(audioBlob);
      };

      function checkSilence() {
        if (!isAudioActive) return;

        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((a, b) => a + b, 0);
        let averageVolume = sum / bufferLength;

        if (averageVolume > SILENCE_THRESHOLD) {
          if (!isSpeaking) {
            isSpeaking = true;
            document.getElementById('bsDetail').textContent = "🗣️ Student is speaking...";
            if (mediaRecorder.state === 'inactive') mediaRecorder.start();
          }
          clearTimeout(silenceTimer);
        } else {
          if (isSpeaking) {
            silenceTimer = setTimeout(() => {
              let timeElapsed = Date.now() - chunkStartTime;
              if (timeElapsed > MIN_CHUNK_TIME) {
                isSpeaking = false;
                document.getElementById('bsDetail').textContent = "⏸️ Checking facts against GitHub...";
                if (mediaRecorder.state === 'recording') mediaRecorder.stop();
              }
            }, SILENCE_DURATION);
          }
        }
        requestAnimationFrame(checkSilence);
      }
      checkSilence();
    }

    async function sendToJuwiEngine(audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "chunk.wav");

      // Pass the actual Team's GitHub URL dynamically!
      if (currentTeam && currentTeam.github) {
        formData.append("github_url", currentTeam.github);
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/process-audio", {
          method: "POST",
          body: formData
        });
        const data = await response.json();

        if (data.status === "success") {
          renderAIDataToUI(data);
        }
      } catch (error) {
        console.error("Juwi API Error:", error);
        document.getElementById('bsDetail').textContent = "Failed to reach Juwi Backend.";
      }
    }

    function renderAIDataToUI(data) {
      // 1. ALWAYS reset the UI status first so it never gets stuck!
      document.getElementById('bsDetail').textContent = "Listening for technical claims...";

      // 2. Safely grab the feed element
      const feed = document.getElementById('attackFeed');

      // 3. Show the raw transcript so the Judge knows the mic is working!
      if (data.transcript && data.transcript.trim() !== "") {
        feed.innerHTML = `
      <div class="attack-item" style="background: var(--surface-2); border-left: 2px solid var(--text-3); margin-bottom: 12px;">
        <strong>🎙️ Heard:</strong> <span style="font-style: italic; color: var(--text-2);">"${data.transcript}"</span>
      </div>
    ` + feed.innerHTML;
      }

      // 4. If the AI didn't find any fact-checkable claims, stop here.
      if (!data.verified_claims || data.verified_claims.length === 0) {
        return;
      }

      // 5. Process the claims if they exist
      let attacksHTML = "";
      let totalClaims = data.verified_claims.length;
      let trueCount = 0;

      data.verified_claims.forEach(vc => {
        let icon = '⚠️'; let color = 'var(--text-3)';

        if (vc.verdict === 'TRUE') {
          icon = '✅'; color = 'var(--success)'; trueCount++;
        } else if (vc.verdict === 'FALSE' || vc.verdict === 'EXAGGERATED') {
          icon = '❌'; color = 'var(--danger)';
        }

        attacksHTML += `
        <div class="attack-item" style="border-left: 3px solid ${color}; margin-bottom: 12px;">
            <strong>${icon} [${vc.verdict}] CLAIM: "${vc.claim}"</strong>
            <span style="display:block; margin-top:4px;">🤖 <span style="color:var(--text-2);">${vc.explanation}</span></span>
        </div>`;
      });

      // 6. Update the B.S. Meter!
      let truthScore = Math.round((trueCount / totalClaims) * 100);
      document.getElementById('bsBar').style.width = truthScore + '%';
      document.getElementById('bsScore').textContent = truthScore + '% Valid';

      if (truthScore < 50) {
        document.getElementById('bsBar').style.background = 'var(--danger)';
        document.getElementById('bsDetail').textContent = "High B.S. detected! Ask the attack questions below.";
      } else {
        document.getElementById('bsBar').style.background = 'linear-gradient(90deg,var(--success),var(--accent-3))';
        document.getElementById('bsDetail').textContent = "Claims appear mostly consistent with codebase.";
      }

      // 7. Append new claims to the feed below the transcript
      feed.innerHTML = attacksHTML + feed.innerHTML;
    }

    // ── END REAL Juwi Integration ────────────────────────

    function generateProsCons() {
      const tid = currentTeam ? currentTeam.id : 3;
      const pc = PROS_CONS[tid] || { pros: '• Strong concept\n• Good presentation', cons: '• Limited testing\n• Scalability not addressed' };
      document.getElementById('prosBox').style.whiteSpace = 'pre-line';
      document.getElementById('consBox').style.whiteSpace = 'pre-line';
      document.getElementById('prosBox').textContent = pc.pros;
      document.getElementById('consBox').textContent = pc.cons;
      toast('Pros & Cons generated!', 'success');
    }

    async function submitScore() {
      if (!currentTeam) { toast('Load a team first.', 'danger'); return; }

      // Use the new recalcTotal() function that includes the time penalty!
      const finalTotal = recalcTotal();
      const remarks = document.getElementById('remarksBox').value;

      // Package up all the judge's hard work into a JSON payload
      const payload = {
        teamId: currentTeam.id,
        teamName: currentTeam.name,
        scores: scores,
        total: finalTotal, // <--- Saves the strictly penalized score!
        remarks: remarks,
        pros: document.getElementById('prosBox').textContent,
        cons: document.getElementById('consBox').textContent
      };

      try {
        // Send the payload to the FastAPI backend!
        const response = await fetch("http://127.0.0.1:8000/submit-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          toast(`✓ Score securely submitted for ${currentTeam.name}!`, 'success');

          // Still save to localStorage just as a backup for the frontend
          const saved = JSON.parse(localStorage.getItem('juwi_scores') || '{}');
          saved[currentTeam.id] = { ...payload, timestamp: new Date().toISOString() };
          localStorage.setItem('juwi_scores', JSON.stringify(saved));
        }
      } catch (error) {
        console.error("Score submission failed:", error);
        toast("Backend error: Could not save score.", "danger");
      }
    }


    // ── PDF Slide Analysis & Markdown Parsing ────────────────────────

    async function analyzeSlides(event) {
      const file = event.target.files[0];
      if (!file) return;

      const modal = document.getElementById('slideModal');
      const resultDiv = document.getElementById('slideAnalysisResult');

      // Open modal in loading state
      modal.style.display = 'flex';
      resultDiv.innerHTML = `
    <div style="text-align:center; padding: 40px;">
      <i class="ti ti-loader" style="font-size: 2.5rem; color: var(--accent); animation: spin 1s linear infinite;"></i>
      <h3 style="margin-top: 16px;">Juwi is reading the PDF...</h3>
      <p style="color: var(--text-3); font-size: .85rem;">Extracting text and scanning for prompt injections.</p>
    </div>
  `;

      // Inject spin animation if it doesn't exist
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:8000/analyze-slides", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.status === "success") {
          resultDiv.innerHTML = parseMarkdown(data.slide_analysis);
          toast('Slide analysis complete!', 'success');
        } else if (data.status === "error" && data.message.includes("SECURITY")) {
          // Handle the Security Firewall rejection beautifully
          resultDiv.innerHTML = `
        <div style="background: rgba(220, 53, 69, 0.1); border-left: 4px solid var(--danger); padding: 20px; border-radius: var(--radius-sm);">
          <h3 style="color: var(--danger); margin-bottom: 8px;"><i class="ti ti-shield-x"></i> Security Alert</h3>
          <p>${data.message}</p>
        </div>
      `;
          toast('Security threat detected.', 'danger');
        } else {
          resultDiv.innerHTML = `<p style="color: var(--text-3); text-align:center; margin-top: 20px;">${data.message}</p>`;
        }
      } catch (error) {
        console.error("PDF Analysis Error:", error);
        resultDiv.innerHTML = `<div style="color: var(--danger); text-align:center;">Failed to reach the AI backend. Check if Python is running.</div>`;
      }

      // Reset the file input so you can upload the same file again if needed
      event.target.value = '';
    }

    // Lightweight Markdown Parser
    function parseMarkdown(md) {
      let html = md;
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text);">$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      html = html.replace(/^\* (.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>');
      html = html.replace(/^\d+\.\s(.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>');
      html = html.replace(/\n/g, '<br>');
      return `<div style="font-family: system-ui, sans-serif;">${html}</div>`;
    }

// ── Init ──────────────────────────────────────────────────────
initPhase();