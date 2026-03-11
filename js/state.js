/* ============================================================
   REACTIVE PLYOMETRICS — STATE.JS
   localStorage persistence and state management (schema v2)
   ============================================================ */

'use strict';

const RP_KEY = 'rp_v1';

const DEFAULT_STATE = {
  version: 2,
  onboardingComplete: false,
  startDate: null,
  cyclesCompleted: 0,
  completedSessions: {},     // { "w1-Mon": { ts, extraCredit } }
  earnedBadges: [],          // [{ cycle, ts, name }]
  pendingSession: null,      // { week, dayKey } – session in progress
  profile: {
    experienceLevel: 'beginner', // beginner | intermediate | advanced | elite
    goal: 'general',             // speed | power | agility | general
    daysPerWeek: 3,
    selectedDays: ['Mon', 'Wed', 'Fri'],
  },
  program: null,             // generated 12-week program object
  cycleHistory: [],          // [{ cycle, profile, startedAt, completedAt }]
};

let _state = null;

/* ── Load from localStorage or initialize ── */
function _load() {
  try {
    const raw = localStorage.getItem(RP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate v1 → v2: inject new fields without wiping progress
      if (!parsed.version || parsed.version < 2) {
        parsed.version           = 2;
        parsed.onboardingComplete = parsed.onboardingComplete || false;
        parsed.profile            = parsed.profile || { ...DEFAULT_STATE.profile };
        parsed.program            = parsed.program || null;
        parsed.cycleHistory       = parsed.cycleHistory || [];
      }
      _state = Object.assign({}, DEFAULT_STATE, parsed);
      // Always deep-merge profile to fill any missing keys added in future versions
      _state.profile = Object.assign({}, DEFAULT_STATE.profile, _state.profile);
    } else {
      _state = { ...DEFAULT_STATE, startDate: new Date().toISOString().slice(0, 10) };
      _state.profile = { ...DEFAULT_STATE.profile };
      _save();
    }
  } catch (e) {
    console.warn('[RP] localStorage load failed, using defaults', e);
    _state = { ...DEFAULT_STATE, startDate: new Date().toISOString().slice(0, 10) };
    _state.profile = { ...DEFAULT_STATE.profile };
  }
}

/* ── Persist to localStorage ── */
function _save() {
  try {
    localStorage.setItem(RP_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn('[RP] localStorage save failed', e);
  }
}

/* ── Public API ── */
function getState() {
  if (!_state) _load();
  return _state;
}

function patchState(patch) {
  if (!_state) _load();
  for (const key of Object.keys(patch)) {
    if (patch[key] !== null && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
      _state[key] = Object.assign({}, _state[key] || {}, patch[key]);
    } else {
      _state[key] = patch[key];
    }
  }
  _save();
  return _state;
}

function resetState() {
  _state = {
    ...DEFAULT_STATE,
    startDate: new Date().toISOString().slice(0, 10),
    profile: { ...DEFAULT_STATE.profile },
  };
  _save();
  return _state;
}

/* ── Session helpers ── */
function markSessionComplete(week, dayKey, extraCreditDone) {
  if (!_state) _load();
  const key = `w${week}-${dayKey}`;
  _state.completedSessions[key] = { ts: Date.now(), extraCredit: !!extraCreditDone };
  _save();
}

function isSessionComplete(week, dayKey) {
  if (!_state) _load();
  return !!_state.completedSessions[`w${week}-${dayKey}`];
}

/* ── Cycle / Badge helpers ── */
function getCompletedSessionCount() {
  if (!_state) _load();
  return Object.keys(_state.completedSessions).length;
}

function checkAndAwardBadge() {
  if (!_state) _load();
  // Use dynamic program session count if available
  const prog  = _state.program;
  const total = prog ? getDynamicSessions(prog).length : getTotalSessions();
  if (!total) return null;

  const done     = getCompletedSessionCount();
  const newCycle = Math.floor(done / total);

  if (newCycle > _state.cyclesCompleted) {
    const cycle = newCycle;
    _state.cyclesCompleted = cycle;
    const badge = { cycle, ts: Date.now(), name: BADGE_NAMES[Math.min(cycle, 5)] };
    _state.earnedBadges.push(badge);
    _save();
    return badge;
  }
  return null;
}

function hasBadge(cycle) {
  if (!_state) _load();
  return _state.earnedBadges.some(b => b.cycle === cycle);
}

/* ── Stats helpers ── */
function getCurrentWeek() {
  if (!_state) _load();
  const prog = _state.program;
  for (let w = 1; w <= 12; w++) {
    const sched = prog ? (prog.weeks[w] || {}) : (SCHEDULE[w] || {});
    const days  = Object.keys(sched);
    if (!days.length) continue;
    const allDone = days.every(d => isSessionComplete(w, d));
    if (!allDone) return w;
  }
  return 12;
}

function getStreakDays() {
  if (!_state) _load();
  const sessions = Object.values(_state.completedSessions);
  if (!sessions.length) return 0;
  sessions.sort((a, b) => b.ts - a.ts);
  let streak   = 0;
  let prevDay  = null;
  for (const s of sessions) {
    const dayStart = new Date(s.ts);
    dayStart.setHours(0, 0, 0, 0);
    const dayKey = dayStart.getTime();
    if (prevDay === null) {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((todayStart - dayStart) / 86400000);
      if (diffDays > 1) break;
      streak  = 1;
      prevDay = dayKey;
    } else {
      const diff = Math.floor((prevDay - dayKey) / 86400000);
      if (diff === 1) { streak++; prevDay = dayKey; }
      else break;
    }
  }
  return streak;
}

/* ── Cycle history helpers ── */
function startNewCycle() {
  if (!_state) _load();
  const profile     = _state.profile || DEFAULT_STATE.profile;
  const cycleNum    = (_state.cyclesCompleted || 0) + 1;

  // Archive current cycle
  _state.cycleHistory = _state.cycleHistory || [];
  _state.cycleHistory.push({
    cycle: cycleNum - 1,
    profile: { ...profile },
    completedAt: Date.now(),
    sessionsCompleted: Object.keys(_state.completedSessions).length,
  });

  // Reset completed sessions for the new cycle
  _state.completedSessions = {};

  // Generate new program with incremented cycle number
  const newProgram = generateProgram({ ...profile, cycleNum });
  _state.program  = newProgram;
  _save();
  return newProgram;
}

/* ── Badge names ── */
const BADGE_NAMES = {
  1: 'Wobble',
  2: 'Fangs',
  3: 'Berserker',
  4: 'Dreadlord',
  5: 'Apex Predator',
};

/* ── Initialize on load ── */
(function init() {
  _load();
  if (!_state.startDate) {
    _state.startDate = new Date().toISOString().slice(0, 10);
    _save();
  }
})();
