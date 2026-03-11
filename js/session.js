/* ============================================================
   REACTIVE PLYOMETRICS — SESSION.JS
   Workout session state machine
   States: WARMUP → EXERCISE_INTRO → SET_ACTIVE → SET_REST
           → EXTRA_CREDIT_PROMPT → SESSION_SUMMARY → (BADGE_CELEBRATION)
   ============================================================ */

'use strict';

/* ── Session State ── */
let _sess = null;   // current session data (from getSession)
let _state = {      // session state machine
  phase: 'WARMUP',  // WARMUP | EXERCISE_INTRO | SET_ACTIVE | SET_REST | EXTRA_CREDIT_PROMPT | SESSION_SUMMARY
  exIdx: 0,         // current exercise index
  setIdx: 0,        // current set (0-based)
  isExtraCredit: false,
  extraCreditDone: false,
  warmupDone: false,
  warmupIdx: 0,
  completedExercises: [],
  startTime: null,
  figPlaying: true,
};
let _timer = null;
let _restTimer = null;

/* ── Public entry point ── */
function startWorkoutSession(week, dayKey) {
   const debug = document.getElementById('screen-session');

  if (debug) {
    debug.innerHTML = `
      <div style="padding:40px;color:white">
        <h2>DEBUG</h2>
        <div>Requested: ${week} / ${dayKey}</div>
        <div>Program Days: ${
          Object.keys((getState().program.weeks || {})[week] || {}).join(', ')
        }</div>
      </div>
    `;
  }

  // KEEP ALL YOUR EXISTING CODE BELOW;
  // Use dynamic program if available, fall back to static SCHEDULE
  const prog = getState().program;
  _sess = prog
    ? getDynamicSession(prog, week, dayKey)
    : getSession(week, dayKey);

  // Default to first scheduled workout if none found
  if (!_sess) {
    const all = prog ? getDynamicSessions(prog) : getAllSessions();
    for (const s of all) {
      _sess = prog
        ? getDynamicSession(prog, s.week, s.dayKey)
        : getSession(s.week, s.dayKey);
      if (_sess) break;
    }
  }

  if (!_sess) {
    console.error('Session not found', week, dayKey);
    return false;
  }

  // Clear any stale rest timer from a previous session
  if (_restTimer) { _restTimer.stop(); _restTimer = null; }
  if (_timer) { _timer.stop(); _timer = null; }

  _state = {
    phase: 'WARMUP',
    exIdx: 0,
    setIdx: 0,
    isExtraCredit: false,
    extraCreditDone: false,
    warmupDone: false,
    warmupIdx: 0,
    completedExercises: [],
    startTime: Date.now(),
    figPlaying: true,
  };

  patchState({ pendingSession: { week: _sess.week, dayKey: _sess.dayKey } });
  renderSessionScreen();
  return true;
}

/* ── Main renderer: picks sub-view based on state ── */
function renderSessionScreen() {
  const el = document.getElementById('screen-session');
  if (!el) return;

  // Requirement 4: always render something — never leave screen blank
  if (!_sess) {
    el.innerHTML = `
      <div style="padding:var(--space-xl); text-align:center; margin-top:var(--space-xl);">
        <div style="font-size:3rem; margin-bottom:var(--space-md);">🏋️</div>
        <h2 class="display-md" style="margin-bottom:var(--space-md);">No workout loaded</h2>
        <p style="color:var(--text-secondary); margin-bottom:var(--space-xl);">
          Choose a session from the calendar to get started.
        </p>
        <button class="btn-primary" onclick="window.location.hash='#calendar'">Open Calendar</button>
      </div>
    `;
    return;
  }

  // Requirement 3: initialize state safely if missing or corrupted
  if (!_state || !_state.phase) {
    _state = {
      phase: 'WARMUP',
      exIdx: 0,
      setIdx: 0,
      isExtraCredit: false,
      extraCreditDone: false,
      warmupDone: false,
      warmupIdx: 0,
      completedExercises: [],
      startTime: Date.now(),
      figPlaying: true,
    };
  }

  switch (_state.phase) {
    case 'WARMUP':              return renderWarmup(el);
    case 'EXERCISE_INTRO':      return renderExercise(el);
    case 'SET_ACTIVE':          return renderSetActive(el);
    case 'SET_REST':            return renderSetRest(el);
    case 'EXTRA_CREDIT_PROMPT': return renderExtraCreditPrompt(el);
    case 'SESSION_SUMMARY':     return renderSummary(el);
    default:
      // Unknown phase — reset to warmup instead of going blank
      _state.phase = 'WARMUP';
      return renderWarmup(el);
  }
}

/* ─────────────────────────── WARMUP ─────────────────────────── */
function renderWarmup(el) {
  if (_restTimer) { _restTimer.stop(); _restTimer = null; }
  if (_timer) { _timer.stop(); _timer = null; }

  const items = WARMUP_EXERCISES.map((wu, i) => `
    <div class="warmup-item${i < _state.warmupIdx ? ' done' : ''}" id="wu-item-${i}">
      <div class="warmup-check">${i < _state.warmupIdx ? '✓' : (i + 1)}</div>
      <div class="warmup-text">
        <div class="warmup-name">${wu.name}</div>
        <div class="warmup-reps">${wu.reps}</div>
      </div>
    </div>
  `).join('');

  const progress = Math.round((_state.warmupIdx / WARMUP_EXERCISES.length) * 100);
  const allDone = _state.warmupIdx >= WARMUP_EXERCISES.length;

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="warmup-screen">
      <div class="warmup-header">
        <div class="warmup-icon">🔥</div>
        <h1 class="display-md">Warm Up First</h1>
        <p style="color:rgba(255,255,255,0.7); font-size:0.9rem; margin-top:6px;">
          Week ${_sess.week} · ${_sess.dayKey} · <span class="text-${_sess.phase.label}">${_sess.phase.name}</span>
        </p>
      </div>
      <div class="warmup-content">
        <div class="warmup-list">
          ${items}
        </div>
        <button class="btn-primary" id="wu-btn">
          ${allDone ? 'Start Workout →' : (_state.warmupIdx === 0 ? 'Begin Warm-Up' : 'Next Exercise')}
        </button>
        <button class="btn-ghost" id="wu-skip" style="width:100%; margin-top:10px; text-align:center;">
          Skip warm-up
        </button>
      </div>
    </div>
  `;

  document.getElementById('wu-btn').addEventListener('click', () => {
    if (allDone) {
      _state.phase = 'EXERCISE_INTRO';
      renderSessionScreen();
    } else {
      // Mark current as done and animate
      const item = document.getElementById(`wu-item-${_state.warmupIdx}`);
      if (item) {
        item.classList.add('done');
        item.querySelector('.warmup-check').classList.add('check-animate');
        item.querySelector('.warmup-check').textContent = '✓';
      }
      _state.warmupIdx++;
      setTimeout(() => renderSessionScreen(), 200);
    }
  });

  document.getElementById('wu-skip').addEventListener('click', () => {
    _state.phase = 'EXERCISE_INTRO';
    renderSessionScreen();
  });
}

/* ─────────────────────── EXERCISE INTRO ─────────────────────── */
function renderExercise(el) {
  if (_restTimer) { _restTimer.stop(); _restTimer = null; }
  if (_timer) { _timer.stop(); _timer = null; }

  // Requirement 2: defensive access before touching exercise arrays
  const exercises = _state.isExtraCredit
    ? (_sess.extraCredit || [])
    : (_sess.exercises || []);
  const ex = exercises[_state.exIdx];
  if (!ex) {
    // End of exercises
    if (_state.isExtraCredit) {
      _state.phase = 'SESSION_SUMMARY';
      _state.extraCreditDone = true;
    } else {
      _state.phase = 'EXTRA_CREDIT_PROMPT';
    }
    return renderSessionScreen();
  }

  const totalEx = exercises.length;
  const exNum = _state.exIdx + 1;
  const mainLen = (_sess.exercises || []).length;
  const ecLen   = (_sess.extraCredit || []).length;
  const totalAll = mainLen + ecLen || 1;
  const doneCount = (_state.isExtraCredit ? mainLen : 0) + _state.exIdx;
  const progress = Math.round((doneCount / totalAll) * 100);

  const svgHtml = getExerciseSVG(ex.animKey || ex.id);
  const setsInfo = ex.type === 'timed'
    ? `${ex.sets} sets × ${fmtDuration(ex.duration)}`
    : `${ex.sets} sets × ${ex.reps} reps`;

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="session-header">
      <button class="btn-ghost" id="sess-back">← Back</button>
      <span class="session-counter">
        ${_state.isExtraCredit ? 'EC ' : ''}${exNum} / ${totalEx}
      </span>
      <span class="phase-pill ${_sess.phase.label}">${_sess.phase.name}</span>
    </div>
    <div class="exercise-card session-screen">
      <div class="exercise-name">${ex.name}</div>
      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:var(--space-md);">${setsInfo}</div>

      <!-- Stick figure -->
      <div class="figure-wrapper fig-wrapper${_state.figPlaying ? '' : ' paused'}" id="fig-wrapper">
        ${svgHtml}
        <div class="figure-controls">
          <button class="play-pause-btn" id="play-pause-btn">
            ${_state.figPlaying ?
              `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause` :
              `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Play`
            }
          </button>
        </div>
      </div>

      <!-- Description -->
      <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:var(--space-md); line-height:1.6;">${ex.description}</p>

      <!-- Coaching cue -->
      <div class="coaching-cue">
        <span class="cue-icon">⚡</span>
        <div>
          <div class="cue-label">Coach Says</div>
          <div class="cue-text">"${ex.cue}"</div>
        </div>
      </div>

      <!-- Modification -->
      <div class="modification-box">
        <span>💡</span>
        <span><strong>Easier:</strong> ${ex.modification}</span>
      </div>

      <button class="btn-primary" id="start-sets-btn">
        Start Sets →
      </button>
    </div>
  `;

  // Wire play/pause
  document.getElementById('play-pause-btn').addEventListener('click', () => {
    _state.figPlaying = !_state.figPlaying;
    const wrapper = document.getElementById('fig-wrapper');
    if (wrapper) wrapper.classList.toggle('paused', !_state.figPlaying);
    const btn = document.getElementById('play-pause-btn');
    if (btn) btn.innerHTML = _state.figPlaying
      ? `<svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`
      : `<svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;"><polygon points="5,3 19,12 5,21"/></svg> Play`;
  });

  document.getElementById('start-sets-btn').addEventListener('click', () => {
    _state.setIdx = 0;
    _state.phase = 'SET_ACTIVE';
    renderSessionScreen();
  });

  document.getElementById('sess-back').addEventListener('click', () => {
    if (_state.exIdx > 0) {
      _state.exIdx--;
      _state.phase = 'EXERCISE_INTRO';
    } else if (_state.isExtraCredit) {
      _state.isExtraCredit = false;
      _state.phase = 'EXTRA_CREDIT_PROMPT';
    } else {
      _state.phase = 'WARMUP';
    }
    renderSessionScreen();
  });

  // Animate phase indicators
  _startPhaseRotation(ex);
}

/* ── Phase rotation: cycles load→explode→catch on the SVG ── */
let _phaseInterval = null;
function _startPhaseRotation(ex) {
  clearInterval(_phaseInterval);
  const phases = ['load', 'explode', 'catch'];
  let idx = 0;
  // Timings per exercise type (ms per phase)
  const dur = ex.type === 'timed' ? 2000 : 1200;
  _phaseInterval = setInterval(() => {
    const svg = document.querySelector('.stick-figure-svg');
    if (svg) {
      svg.setAttribute('data-phase', phases[idx % phases.length]);
    }
    idx++;
  }, dur);
}

/* ─────────────────────── SET ACTIVE ─────────────────────── */
function renderSetActive(el) {
  clearInterval(_phaseInterval);
  if (_restTimer) { _restTimer.stop(); _restTimer = null; }
  if (_timer) { _timer.stop(); _timer = null; }

  // Requirement 2: defensive access before touching exercise arrays
  const exercises = _state.isExtraCredit
    ? (_sess.extraCredit || [])
    : (_sess.exercises || []);
  const ex = exercises[_state.exIdx];
  if (!ex) {
    // No exercise at this index — fall back to intro which handles end-of-list
    _state.phase = 'EXERCISE_INTRO';
    return renderSessionScreen();
  }

  const totalSets = ex.sets || 1;
  const currentSet = _state.setIdx + 1;
  const mainLen = (_sess.exercises || []).length;
  const ecLen   = (_sess.extraCredit || []).length;
  const totalAll = mainLen + ecLen || 1;
  const doneCount = (_state.isExtraCredit ? mainLen : 0) + _state.exIdx;
  const progress = Math.round((doneCount / totalAll) * 100);

  // Build set dots
  const setDots = Array.from({length: totalSets}, (_, i) => {
    let cls = 'set-dot';
    if (i < _state.setIdx) cls += ' done';
    else if (i === _state.setIdx) cls += ' current';
    return `<div class="${cls}">SET ${i+1}</div>`;
  }).join('');

  // Timed vs reps
  const isTimedEx = ex.type === 'timed';
  const actionArea = isTimedEx
    ? `<div class="timer-wrapper">
         ${createTimerRingSVG('session')}
         <button class="btn-ghost" id="timer-toggle-btn" style="margin-top:8px;">
           <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;display:inline;"><polygon points="5,3 19,12 5,21"/></svg>
           Tap to Start
         </button>
       </div>`
    : `<div class="rep-display">
         <div class="rep-target">${ex.reps}</div>
         <div class="rep-unit">REPS</div>
       </div>`;

  const svgHtml = getExerciseSVG(ex.animKey || ex.id);

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="session-header">
      <button class="btn-ghost" id="sess-back2">← Back</button>
      <span class="session-counter">${_state.isExtraCredit ? 'EC ' : ''}Set ${currentSet}/${totalSets}</span>
      <span class="phase-pill ${_sess.phase.label}">${_sess.phase.name}</span>
    </div>
    <div class="exercise-card session-screen">
      <div class="exercise-name">${ex.name}</div>

      <!-- Figure -->
      <div class="figure-wrapper fig-wrapper${_state.figPlaying ? '' : ' paused'}" id="fig-wrapper2" style="margin-bottom:var(--space-md);">
        ${svgHtml}
      </div>

      <!-- Coaching cue (compact) -->
      <div class="coaching-cue" style="margin-bottom:var(--space-md);">
        <span class="cue-icon">⚡</span>
        <div class="cue-text">"${ex.cue}"</div>
      </div>

      <!-- Set tracker -->
      <div class="set-tracker">
        <div class="set-tracker-label">Sets</div>
        <div class="set-dots">${setDots}</div>
      </div>

      ${actionArea}

      <button class="btn-primary" id="done-set-btn" style="margin-top:var(--space-md);">
        ${isTimedEx ? '✓ Timer Done' : `✓ Completed ${ex.reps} Reps`}
      </button>
    </div>
  `;

  // Start timer if timed exercise
  if (isTimedEx) {
    _timer = new CountdownTimer({
      totalSeconds: ex.duration,
      ringId: 'session',
      onTick: (rem) => {
        // Nothing extra needed
      },
      onComplete: () => {
        // Auto-advance
        const btn = document.getElementById('done-set-btn');
        if (btn) { btn.textContent = '✓ Time\'s Up! Next →'; btn.click(); }
      }
    });

    let timerStarted = false;
    const toggleBtn = document.getElementById('timer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (!timerStarted) {
          timerStarted = true;
          _timer.start();
          toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;display:inline;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
        } else if (_timer.isRunning()) {
          _timer.pause();
          toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;display:inline;"><polygon points="5,3 19,12 5,21"/></svg> Resume`;
        } else {
          _timer.resume();
          toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;display:inline;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
        }
      });
    }
  }

  document.getElementById('done-set-btn').addEventListener('click', () => {
    if (_timer) { _timer.stop(); _timer = null; }
    _state.completedExercises.push({ name: ex.name, set: currentSet });

    if (currentSet >= totalSets) {
      // All sets done for this exercise
      _state.exIdx++;
      _state.setIdx = 0;
      if (_state.isExtraCredit) {
        _state.phase = 'EXERCISE_INTRO'; // goes to next EC or ends
      } else {
        _state.phase = 'EXERCISE_INTRO';
      }
      renderSessionScreen();
    } else {
      // More sets: show rest timer
      _state.setIdx++;
      _state.phase = 'SET_REST';
      renderSessionScreen();
    }
  });

  document.getElementById('sess-back2').addEventListener('click', () => {
    if (_timer) { _timer.stop(); _timer = null; }
    _state.phase = 'EXERCISE_INTRO';
    renderSessionScreen();
  });

  _startPhaseRotation(ex);
}

/* ─────────────────────── SET REST ─────────────────────── */
function renderSetRest(el) {
  clearInterval(_phaseInterval);
  if (_timer) { _timer.stop(); _timer = null; }
  if (_restTimer) { _restTimer.stop(); _restTimer = null; }

  const exercises = _state.isExtraCredit ? _sess.extraCredit : _sess.exercises;
  const ex = exercises[_state.exIdx];
  const nextSetNum = _state.setIdx + 1;

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:60%"></div>
    </div>
    <div class="rest-timer">
      <div class="rest-label">Rest</div>
      <div class="rest-countdown" id="rest-count">20</div>
      <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:var(--space-xl);">
        Next up: <strong style="color:var(--text-primary);">${ex ? ex.name : ''} — Set ${nextSetNum}</strong>
      </p>
      <button class="btn-secondary" id="skip-rest" style="max-width:240px; margin:0 auto;">
        Skip Rest →
      </button>
    </div>
  `;

  _restTimer = new RestTimer({
    seconds: 20,
    elementId: 'rest-count',
    onComplete: () => {
      _state.phase = 'SET_ACTIVE';
      renderSessionScreen();
    }
  });
  _restTimer.start();

  document.getElementById('skip-rest').addEventListener('click', () => {
    _restTimer.skip();
  });
}

/* ─────────────────── EXTRA CREDIT PROMPT ─────────────────── */
function renderExtraCreditPrompt(el) {
  clearInterval(_phaseInterval);
  if (_timer) { _timer.stop(); _timer = null; }

  const hasEC = _sess.extraCredit && _sess.extraCredit.length > 0;

  if (!hasEC) {
    _state.phase = 'SESSION_SUMMARY';
    return renderSessionScreen();
  }

  const ecList = _sess.extraCredit.map(ex =>
    `<li style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border); font-size:0.875rem;">
       <span>${ex.name}</span><span style="color:var(--text-muted);">${fmtExercise(ex)}</span>
     </li>`
  ).join('');

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:88%"></div>
    </div>
    <div class="exercise-card session-screen" style="text-align:center; padding-top:var(--space-xl);">
      <div style="font-size:3rem; margin-bottom:var(--space-md);">⭐</div>
      <h2 class="display-md" style="margin-bottom:var(--space-sm);">Main Workout Complete!</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-xl);">Excellent work. Want to push further with extra credit?</p>
      <div class="extra-credit-banner" style="margin:0 0 var(--space-xl); text-align:left;">
        <div class="ec-title" style="margin-bottom:8px;">Extra Credit</div>
        <ul style="list-style:none;">${ecList}</ul>
      </div>
      <button class="btn-primary" id="do-ec-btn" style="margin-bottom:var(--space-md);">
        Do Extra Credit ⚡
      </button>
      <button class="btn-secondary" id="skip-ec-btn">
        Skip — I'm Done
      </button>
    </div>
  `;

  document.getElementById('do-ec-btn').addEventListener('click', () => {
    _state.isExtraCredit = true;
    _state.exIdx = 0;
    _state.setIdx = 0;
    _state.phase = 'EXERCISE_INTRO';
    renderSessionScreen();
  });

  document.getElementById('skip-ec-btn').addEventListener('click', () => {
    _state.phase = 'SESSION_SUMMARY';
    renderSessionScreen();
  });
}

/* ─────────────────────── SESSION SUMMARY ─────────────────────── */
function renderSummary(el) {
  clearInterval(_phaseInterval);
  if (_timer) { _timer.stop(); _timer = null; }

  const duration = Math.round((Date.now() - _state.startTime) / 60000);
  const totalSets = _state.completedExercises.length;
  const totalEx = (_sess.exercises.length) + (_state.extraCreditDone ? _sess.extraCredit.length : 0);

  // Mark session complete
  markSessionComplete(_sess.week, _sess.dayKey, _state.extraCreditDone);

  // Check for badge
  const badge = checkAndAwardBadge();

  // Build completed list
  const uniqueExNames = [...new Set((_sess.exercises).concat(_state.extraCreditDone ? _sess.extraCredit : []).map(e => e.name))];
  const exListHtml = uniqueExNames.map(name =>
    `<div class="completed-ex-item">
       <span class="completed-check">✓</span>
       <span>${name}</span>
     </div>`
  ).join('');

  el.innerHTML = `
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:100%"></div>
    </div>
    <div class="summary-screen">
      <div class="summary-emoji">🏆</div>
      <h1 class="display-lg gradient-text">Session Complete!</h1>
      <p style="color:var(--text-secondary); margin-top:8px;">Week ${_sess.week}, ${_sess.dayKey} · ${_sess.phase.name}</p>

      <div class="summary-stats-grid">
        <div class="summary-stat">
          <div class="summary-stat-num">${duration}<span style="font-size:1rem;">m</span></div>
          <div class="summary-stat-label">Duration</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-num">${totalEx}</div>
          <div class="summary-stat-label">Exercises</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-num">${totalSets}</div>
          <div class="summary-stat-label">Sets Done</div>
        </div>
      </div>

      ${_state.extraCreditDone ? `
        <div style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.3); border-radius:var(--radius-full); font-size:0.8rem; color:#fbbf24; margin-bottom:var(--space-md);">
          ⭐ Extra Credit Completed!
        </div>` : ''}

      <div class="completed-exercises-list">
        <div class="section-title">Completed</div>
        ${exListHtml}
      </div>

      <button class="btn-primary" id="summary-done-btn">
        Back to Home
      </button>
    </div>
  `;

  document.getElementById('summary-done-btn').addEventListener('click', () => {
    patchState({ pendingSession: null });
    if (badge) {
      // Badge earned → celebration → cycle complete screen
      showBadgeCelebration(badge.cycle, () => {
        navigate('cycle-complete', { cycle: badge.cycle });
      });
    } else {
      window.location.hash = '#home';
    }
  });

  // Auto-show badge celebration if earned
  if (badge) {
    setTimeout(() => {
      showBadgeCelebration(badge.cycle, () => {
        navigate('cycle-complete', { cycle: badge.cycle });
      });
    }, 1500);
  }
}
