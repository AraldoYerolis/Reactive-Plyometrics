/* ============================================================
   REACTIVE PLYOMETRICS — ONBOARDING.JS
   5-step first-run wizard: Welcome → Level → Goal → Frequency → Generate
   ============================================================ */

'use strict';

/* ── Wizard state ── */
let _step = 0;
let _picks = {
  experienceLevel: null,
  goal: null,
  daysPerWeek: 3,
  selectedDays: ['Mon', 'Wed', 'Fri'],
};

const LEVEL_INFO = [
  { key: 'beginner',     label: 'Beginner',     icon: '🌱', desc: '0–6 months · New to jumping & bounding' },
  { key: 'intermediate', label: 'Intermediate',  icon: '⚡', desc: '6–18 months · Comfortable with basics' },
  { key: 'advanced',     label: 'Advanced',      icon: '🔥', desc: '1.5–3 years · Regular explosive training' },
  { key: 'elite',        label: 'Elite',         icon: '💀', desc: '3+ years · Competitive or high-performance' },
];

const GOAL_INFO = [
  { key: 'speed',   label: 'Speed',   icon: '⚡', desc: 'Sprint faster · Accelerate explosively' },
  { key: 'power',   label: 'Power',   icon: '💥', desc: 'Jump higher · Move more force' },
  { key: 'agility', label: 'Agility', icon: '🌀', desc: 'Change direction · React faster' },
  { key: 'general', label: 'General', icon: '🏅', desc: 'Balanced athletic performance' },
];

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_ABBR  = { Mon:'M', Tue:'T', Wed:'W', Thu:'Th', Fri:'F', Sat:'Sa', Sun:'Su' };

/* ── Entry point called from router ── */
function renderOnboarding() {
  const el = document.getElementById('screen-onboarding');
  if (!el) return;

  // Restore in-progress picks from state if user is returning
  const saved = getState().profile;
  if (saved && saved.experienceLevel) {
    _picks.experienceLevel = _picks.experienceLevel || saved.experienceLevel;
    _picks.goal            = _picks.goal            || saved.goal;
    _picks.daysPerWeek     = _picks.daysPerWeek     || saved.daysPerWeek;
    _picks.selectedDays    = _picks.selectedDays.length ? _picks.selectedDays : saved.selectedDays;
  }

  switch (_step) {
    case 0: return _renderWelcome(el);
    case 1: return _renderLevel(el);
    case 2: return _renderGoal(el);
    case 3: return _renderFrequency(el);
    case 4: return _renderGenerate(el);
  }
}

/* ── Step 0: Welcome ── */
function _renderWelcome(el) {
  el.innerHTML = `
    <div class="onb-screen">
      <div class="onb-logo">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px;">
          <circle cx="30" cy="30" r="28" fill="url(#onbGrad)" opacity="0.15"/>
          <circle cx="30" cy="30" r="28" stroke="url(#onbGrad)" stroke-width="2"/>
          <path d="M22 42 L30 18 L38 42" stroke="url(#onbGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M20 34 L40 34" stroke="url(#onbGrad)" stroke-width="3" stroke-linecap="round"/>
          <defs>
            <linearGradient id="onbGrad" x1="0" y1="0" x2="60" y2="60">
              <stop offset="0%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#ec4899"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 class="onb-title gradient-text">Reactive<br>Plyometrics</h1>
      <p class="onb-subtitle">Your adaptive 12-week explosive power program — personalized to your level and goals.</p>

      <div class="onb-feature-list">
        <div class="onb-feature"><span class="onb-feature-icon">🎯</span><span>Tailored to your experience & goals</span></div>
        <div class="onb-feature"><span class="onb-feature-icon">📅</span><span>Train 3–7 days per week, your schedule</span></div>
        <div class="onb-feature"><span class="onb-feature-icon">🏆</span><span>Earn monster badges as you level up</span></div>
        <div class="onb-feature"><span class="onb-feature-icon">📈</span><span>Program gets harder every cycle</span></div>
      </div>

      <button class="btn-primary onb-cta" id="onb-next">Get Started →</button>
    </div>
  `;

  document.getElementById('onb-next').addEventListener('click', () => {
    _step = 1;
    renderOnboarding();
  });
}

/* ── Step 1: Experience Level ── */
function _renderLevel(el) {
  el.innerHTML = `
    <div class="onb-screen">
      ${_stepIndicator(1)}
      <h2 class="onb-step-title">Experience Level</h2>
      <p class="onb-step-sub">How experienced are you with explosive jump training?</p>
      <div class="onb-cards" id="level-cards">
        ${LEVEL_INFO.map(l => `
          <div class="onb-card${_picks.experienceLevel === l.key ? ' selected' : ''}" data-key="${l.key}">
            <span class="onb-card-icon">${l.icon}</span>
            <div class="onb-card-body">
              <div class="onb-card-label">${l.label}</div>
              <div class="onb-card-desc">${l.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn-primary onb-cta${_picks.experienceLevel ? '' : ' disabled'}" id="onb-next"
        ${_picks.experienceLevel ? '' : 'disabled'}>Continue →</button>
      <button class="btn-ghost onb-back" id="onb-back">← Back</button>
    </div>
  `;

  document.getElementById('level-cards').addEventListener('click', (e) => {
    const card = e.target.closest('.onb-card');
    if (!card) return;
    _picks.experienceLevel = card.dataset.key;
    document.querySelectorAll('#level-cards .onb-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const btn = document.getElementById('onb-next');
    btn.disabled = false;
    btn.classList.remove('disabled');
  });

  document.getElementById('onb-next').addEventListener('click', () => {
    if (!_picks.experienceLevel) return;
    _step = 2;
    renderOnboarding();
  });

  document.getElementById('onb-back').addEventListener('click', () => {
    _step = 0;
    renderOnboarding();
  });
}

/* ── Step 2: Goal ── */
function _renderGoal(el) {
  el.innerHTML = `
    <div class="onb-screen">
      ${_stepIndicator(2)}
      <h2 class="onb-step-title">Primary Goal</h2>
      <p class="onb-step-sub">What do you want to develop most?</p>
      <div class="onb-cards" id="goal-cards">
        ${GOAL_INFO.map(g => `
          <div class="onb-card${_picks.goal === g.key ? ' selected' : ''}" data-key="${g.key}">
            <span class="onb-card-icon">${g.icon}</span>
            <div class="onb-card-body">
              <div class="onb-card-label">${g.label}</div>
              <div class="onb-card-desc">${g.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn-primary onb-cta${_picks.goal ? '' : ' disabled'}" id="onb-next"
        ${_picks.goal ? '' : 'disabled'}>Continue →</button>
      <button class="btn-ghost onb-back" id="onb-back">← Back</button>
    </div>
  `;

  document.getElementById('goal-cards').addEventListener('click', (e) => {
    const card = e.target.closest('.onb-card');
    if (!card) return;
    _picks.goal = card.dataset.key;
    document.querySelectorAll('#goal-cards .onb-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const btn = document.getElementById('onb-next');
    btn.disabled = false;
    btn.classList.remove('disabled');
  });

  document.getElementById('onb-next').addEventListener('click', () => {
    if (!_picks.goal) return;
    _step = 3;
    renderOnboarding();
  });

  document.getElementById('onb-back').addEventListener('click', () => {
    _step = 1;
    renderOnboarding();
  });
}

/* ── Step 3: Training Frequency ── */
function _renderFrequency(el) {
  const _renderDayGrid = () => {
    return DAY_ORDER.map(day => {
      const on = _picks.selectedDays.includes(day);
      return `<button class="day-chip${on ? ' active' : ''}" data-day="${day}">${DAY_ABBR[day]}</button>`;
    }).join('');
  };

  el.innerHTML = `
    <div class="onb-screen">
      ${_stepIndicator(3)}
      <h2 class="onb-step-title">Training Schedule</h2>
      <p class="onb-step-sub">How many days per week can you train?</p>

      <div class="freq-picker">
        <button class="freq-btn" id="freq-down" ${_picks.daysPerWeek <= 3 ? 'disabled' : ''}>−</button>
        <div class="freq-display">
          <span class="freq-number" id="freq-num">${_picks.daysPerWeek}</span>
          <span class="freq-label">days / week</span>
        </div>
        <button class="freq-btn" id="freq-up" ${_picks.daysPerWeek >= 7 ? 'disabled' : ''}>+</button>
      </div>

      <p class="onb-step-sub" style="margin-top:var(--space-lg);">Select your training days</p>
      <div class="day-grid" id="day-grid">
        ${_renderDayGrid()}
      </div>
      <p class="freq-hint" id="freq-hint" style="font-size:0.78rem; color:var(--text-muted); text-align:center; margin-top:8px;">
        ${_picks.selectedDays.length} day${_picks.selectedDays.length !== 1 ? 's' : ''} selected
      </p>

      <button class="btn-primary onb-cta" id="onb-next">Continue →</button>
      <button class="btn-ghost onb-back" id="onb-back">← Back</button>
    </div>
  `;

  document.getElementById('freq-down').addEventListener('click', () => {
    if (_picks.daysPerWeek > 3) {
      _picks.daysPerWeek--;
      // Remove last selected day if too many
      while (_picks.selectedDays.length > _picks.daysPerWeek) {
        _picks.selectedDays.pop();
      }
      _step = 3;
      renderOnboarding();
    }
  });

  document.getElementById('freq-up').addEventListener('click', () => {
    if (_picks.daysPerWeek < 7) {
      _picks.daysPerWeek++;
      // Auto-select next available day if not enough selected
      if (_picks.selectedDays.length < _picks.daysPerWeek) {
        const next = DAY_ORDER.find(d => !_picks.selectedDays.includes(d));
        if (next) _picks.selectedDays.push(next);
      }
      _step = 3;
      renderOnboarding();
    }
  });

  document.getElementById('day-grid').addEventListener('click', (e) => {
    const chip = e.target.closest('.day-chip');
    if (!chip) return;
    const day = chip.dataset.day;
    const idx = _picks.selectedDays.indexOf(day);
    if (idx >= 0) {
      // Deselect — enforce minimum
      if (_picks.selectedDays.length <= _picks.daysPerWeek) return; // can't go below target
      _picks.selectedDays.splice(idx, 1);
    } else {
      // Select — enforce maximum
      if (_picks.selectedDays.length >= 7) return;
      _picks.selectedDays.push(day);
      // Keep selectedDays in calendar order
      _picks.selectedDays.sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
      // Sync daysPerWeek up if user adds days beyond current slider
      if (_picks.selectedDays.length > _picks.daysPerWeek) {
        _picks.daysPerWeek = _picks.selectedDays.length;
      }
    }
    _step = 3;
    renderOnboarding();
  });

  document.getElementById('onb-next').addEventListener('click', () => {
    if (_picks.selectedDays.length < 1) return;
    _picks.daysPerWeek = _picks.selectedDays.length;
    _step = 4;
    renderOnboarding();
  });

  document.getElementById('onb-back').addEventListener('click', () => {
    _step = 2;
    renderOnboarding();
  });
}

/* ── Step 4: Review + Generate ── */
function _renderGenerate(el) {
  const levelLabel = (LEVEL_INFO.find(l => l.key === _picks.experienceLevel) || {}).label || '—';
  const goalLabel  = (GOAL_INFO.find(g => g.key === _picks.goal) || {}).label || '—';
  const daysStr    = _picks.selectedDays.join(' · ');

  el.innerHTML = `
    <div class="onb-screen">
      ${_stepIndicator(4)}
      <h2 class="onb-step-title">Your Program</h2>
      <p class="onb-step-sub">Everything looks good — let's generate your custom 12-week plan.</p>

      <div class="onb-summary-card">
        <div class="onb-summary-row">
          <span class="onb-summary-label">Level</span>
          <span class="onb-summary-value">${levelLabel}</span>
        </div>
        <div class="onb-summary-row">
          <span class="onb-summary-label">Goal</span>
          <span class="onb-summary-value">${goalLabel}</span>
        </div>
        <div class="onb-summary-row">
          <span class="onb-summary-label">Days / week</span>
          <span class="onb-summary-value">${_picks.daysPerWeek}</span>
        </div>
        <div class="onb-summary-row">
          <span class="onb-summary-label">Training days</span>
          <span class="onb-summary-value" style="font-size:0.85rem;">${daysStr}</span>
        </div>
      </div>

      <div class="onb-program-preview">
        <div class="onb-preview-label">Program preview</div>
        <div class="onb-preview-phases">
          <div class="onb-phase-chip p1">Weeks 1–4<br><span>Foundation</span></div>
          <div class="onb-phase-chip p2">Weeks 5–8<br><span>Development</span></div>
          <div class="onb-phase-chip p3">Weeks 9–12<br><span>Peak</span></div>
        </div>
      </div>

      <button class="btn-primary onb-cta" id="onb-generate">Generate My Program ✦</button>
      <button class="btn-ghost onb-back" id="onb-back">← Back</button>
    </div>
  `;

  document.getElementById('onb-generate').addEventListener('click', () => {
    _finishOnboarding();
  });

  document.getElementById('onb-back').addEventListener('click', () => {
    _step = 3;
    renderOnboarding();
  });
}

/* ── Finish: generate program, save state, navigate home ── */
function _finishOnboarding() {
  const profile = {
    experienceLevel: _picks.experienceLevel || 'beginner',
    goal:            _picks.goal            || 'general',
    daysPerWeek:     _picks.daysPerWeek     || 3,
    selectedDays:    [..._picks.selectedDays],
  };

  const program = generateProgram({ ...profile, cycleNum: 1 });

  patchState({
    onboardingComplete: true,
    profile,
    program,
    completedSessions: {},
    cyclesCompleted: 0,
    earnedBadges: [],
  });

  // Reset step for next use (e.g. if settings re-triggers onboarding)
  _step = 0;

  window.location.hash = '#home';
}

/* ── Helper: step indicator dots ── */
function _stepIndicator(current) {
  const steps = [1, 2, 3, 4];
  const dots = steps.map(s =>
    `<div class="onb-dot${s === current ? ' active' : s < current ? ' done' : ''}"></div>`
  ).join('');
  return `<div class="onb-steps">${dots}</div>`;
}
