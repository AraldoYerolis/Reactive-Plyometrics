/* ============================================================
   REACTIVE PLYOMETRICS — STATE.JS
   localStorage persistence and state management
   ============================================================ */

'use strict';

const RP_KEY = 'rp_v1';

const DEFAULT_STATE = {
  version: 1,
  startDate: null,           // ISO date string, set on first use
  cyclesCompleted: 0,        // how many full 12-week cycles done
  completedSessions: {},     // { "w1-Mon": { ts, extraCredit } }
  earnedBadges: [],          // [{ cycle, ts, name }]
  pendingSession: null,      // { week, dayKey } - session in progress
};

let _state = null;

/* ── Load from localStorage or initialize ── */
function _load() {
  try {
    const raw = localStorage.getItem(RP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge with defaults to handle version upgrades
      _state = Object.assign({}, DEFAULT_STATE, parsed);
    } else {
      _state = { ...DEFAULT_STATE, startDate: new Date().toISOString().slice(0,10) };
      _save();
    }
  } catch(e) {
    console.warn('[RP] localStorage load failed, using defaults', e);
    _state = { ...DEFAULT_STATE, startDate: new Date().toISOString().slice(0,10) };
  }
}

/* ── Persist to localStorage ── */
function _save() {
  try {
    localStorage.setItem(RP_KEY, JSON.stringify(_state));
  } catch(e) {
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
  // Deep merge one level
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
  _state = { ...DEFAULT_STATE, startDate: new Date().toISOString().slice(0,10) };
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
  const total = getTotalSessions();        // from data.js
  const done  = getCompletedSessionCount();
  const cycleSessionsDone = done % total;
  const newCycle = Math.floor(done / total);

  // Award badge if we just completed a cycle
  if (newCycle > _state.cyclesCompleted) {
    const cycle = newCycle;
    _state.cyclesCompleted = cycle;
    const badge = { cycle, ts: Date.now(), name: BADGE_NAMES[Math.min(cycle, 5)] };
    _state.earnedBadges.push(badge);
    _save();
    return badge;   // caller shows celebration
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
  // Determine which week the user is currently on based on completed sessions
  // Go through weeks 1-12, find first week with an incomplete workout day
  for (let w = 1; w <= 12; w++) {
    const sched = SCHEDULE[w] || {};
    const days = Object.keys(sched);
    const allDone = days.every(d => isSessionComplete(w, d));
    if (!allDone) return w;
  }
  return 12; // all done
}

function getStreakDays() {
  if (!_state) _load();
  const sessions = Object.values(_state.completedSessions);
  if (!sessions.length) return 0;
  // Sort by timestamp desc
  sessions.sort((a,b) => b.ts - a.ts);
  const now = Date.now();
  let streak = 0;
  let prevDay = null;
  for (const s of sessions) {
    const dayStart = new Date(s.ts);
    dayStart.setHours(0,0,0,0);
    const dayKey = dayStart.getTime();
    if (prevDay === null) {
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const diffDays = Math.floor((todayStart - dayStart) / 86400000);
      if (diffDays > 1) break; // last session was more than yesterday
      streak = 1;
      prevDay = dayKey;
    } else {
      const diff = Math.floor((prevDay - dayKey) / 86400000);
      if (diff === 1) { streak++; prevDay = dayKey; }
      else break;
    }
  }
  return streak;
}

/* Badge names (used in checkAndAwardBadge) */
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
    _state.startDate = new Date().toISOString().slice(0,10);
    _save();
  }
})();
