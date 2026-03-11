/* ============================================================
   REACTIVE PLYOMETRICS — GENERATOR.JS
   Adaptive program generation based on user profile + cycle
   ============================================================ */

'use strict';

/* ── Exercise pools by experience level and phase ── */
const LEVEL_POOLS = {
  beginner: {
    phase1: ['squat-jump', 'broad-jump', 'lateral-bound', 'plank', 'wall-sit'],
    phase2: ['squat-jump', 'box-jump', 'lateral-bound', 'clap-pushup', 'plank', 'wall-sit'],
    phase3: ['box-jump', 'broad-jump', 'lateral-bound', 'clap-pushup', 'plank', 'wall-sit'],
    extras: ['dead-hang', 'wall-sit', 'plank'],
  },
  intermediate: {
    phase1: ['squat-jump', 'broad-jump', 'box-jump', 'lateral-bound', 'plank', 'wall-sit'],
    phase2: ['box-jump', 'hurdle-hop', 'lateral-bound', 'clap-pushup', 'plank', 'dead-hang'],
    phase3: ['depth-jump', 'hurdle-hop', 'broad-jump', 'clap-pushup', 'plank', 'wall-sit'],
    extras: ['dead-hang', 'wall-sit', 'clap-pushup'],
  },
  advanced: {
    phase1: ['squat-jump', 'broad-jump', 'box-jump', 'lateral-bound', 'clap-pushup', 'plank'],
    phase2: ['depth-jump', 'hurdle-hop', 'skater-bound', 'clap-pushup', 'plank', 'dead-hang'],
    phase3: ['depth-jump', 'hurdle-hop', 'skater-bound', 'broad-jump', 'plank', 'wall-sit'],
    extras: ['dead-hang', 'wall-sit', 'skater-bound'],
  },
  elite: {
    phase1: ['box-jump', 'squat-jump', 'lateral-bound', 'broad-jump', 'clap-pushup', 'plank'],
    phase2: ['depth-jump', 'hurdle-hop', 'skater-bound', 'clap-pushup', 'plank', 'dead-hang'],
    phase3: ['depth-jump', 'sprint-start', 'hurdle-hop', 'skater-bound', 'clap-pushup', 'plank'],
    extras: ['dead-hang', 'wall-sit', 'sprint-start'],
  },
};

/* ── Goal emphasis: these exercises are prioritized in session ordering ── */
const GOAL_FOCUS = {
  speed:   ['sprint-start', 'hurdle-hop', 'depth-jump', 'squat-jump'],
  power:   ['box-jump', 'squat-jump', 'depth-jump', 'broad-jump'],
  agility: ['lateral-bound', 'skater-bound', 'hurdle-hop', 'squat-jump'],
  general: ['squat-jump', 'broad-jump', 'lateral-bound', 'box-jump'],
};

/* ── Timed exercises (always include at least one per session) ── */
const TIMED_IDS = ['plank', 'wall-sit', 'dead-hang', 'sprint-start'];

/* ── Base volume by experience level ── */
const BASE_VOLUME = {
  beginner:     { sets: 2, jumpReps: 6,  boundReps: 5,  timedDur: 20 },
  intermediate: { sets: 3, jumpReps: 8,  boundReps: 6,  timedDur: 30 },
  advanced:     { sets: 3, jumpReps: 10, boundReps: 8,  timedDur: 40 },
  elite:        { sets: 4, jumpReps: 12, boundReps: 10, timedDur: 50 },
};

/* ── Compute week-level volume defaults ── */
function computeWeekDefaults(week, level, cycleNum) {
  const base = BASE_VOLUME[level] || BASE_VOLUME.beginner;

  // Deload weeks: week 4 and 8 get reduced volume
  const isDeload = (week === 4 || week === 8);

  // Phase bonus (0 for wks 1-4, +1 for 5-8, +2 for 9-12)
  const phase = week <= 4 ? 0 : week <= 8 ? 1 : 2;

  // Progressive overload within cycle
  const weekBonus = isDeload ? -1 : Math.floor(week / 3);
  const durBonus  = isDeload ? -5 : phase * 5 + Math.floor(week / 3) * 2;

  // Cycle multiplier — capped at cycle 5 (+4)
  const cycleMod = Math.min(cycleNum - 1, 4);

  return {
    sets:      Math.max(1, Math.min(base.sets + (isDeload ? -1 : phase) + Math.floor(cycleMod * 0.5), 6)),
    jumpReps:  Math.max(3, base.jumpReps  + weekBonus + cycleMod),
    boundReps: Math.max(3, base.boundReps + weekBonus + cycleMod),
    timedDur:  Math.max(10, base.timedDur + durBonus  + cycleMod * 5),
  };
}

/* ── Pick exercises for one session ── */
function pickSessionExercises(pool, sessionIndex, totalSessions) {
  // Goal-ordered pool: rotate by sessionIndex for variety across the week
  const count = Math.min(5, pool.length);
  const offset = (sessionIndex * 2) % Math.max(pool.length, 1);
  const selected = [];

  for (let i = 0; i < count && selected.length < count; i++) {
    const id = pool[(offset + i) % pool.length];
    if (!selected.includes(id)) selected.push(id);
  }

  // Fill to count if pool is small
  let fill = 0;
  while (selected.length < count && fill < pool.length * 2) {
    const id = pool[fill % pool.length];
    if (!selected.includes(id)) selected.push(id);
    fill++;
  }

  // Guarantee at least 1 timed exercise
  const hasTimed = selected.some(id => TIMED_IDS.includes(id));
  if (!hasTimed) {
    const timedInPool = TIMED_IDS.find(id => pool.includes(id));
    if (timedInPool && selected.length > 0) {
      selected[selected.length - 1] = timedInPool;
    }
  }

  return selected;
}

/* ── Reorder pool by goal emphasis ── */
function applyGoalEmphasis(pool, goal) {
  const focus = GOAL_FOCUS[goal] || [];
  const focused = focus.filter(id => pool.includes(id));
  const rest = pool.filter(id => !focused.includes(id));
  return [...focused, ...rest];
}

/* ── Pick extra credit exercise ── */
function pickExtraCredit(extras, mainExercises, sessionIndex) {
  // Rotate through extras, avoiding repetition with main exercises
  for (let i = 0; i < extras.length; i++) {
    const id = extras[(sessionIndex + i) % extras.length];
    if (!mainExercises.includes(id)) return [id];
  }
  return [extras[sessionIndex % extras.length]];
}

/* ── Main entry point ── */
function generateProgram({ experienceLevel, goal, daysPerWeek, selectedDays, cycleNum = 1 }) {
  const level = experienceLevel || 'beginner';
  const goalKey = goal || 'general';
  const days = (selectedDays && selectedDays.length >= 1)
    ? selectedDays.slice(0, daysPerWeek || 3)
    : ['Mon', 'Wed', 'Fri'];

  const weeks = {};
  const weekDefaults = {};

  for (let w = 1; w <= 12; w++) {
    // Determine phase pool
    const phaseKey = w <= 4 ? 'phase1' : w <= 8 ? 'phase2' : 'phase3';
    const rawPool = (LEVEL_POOLS[level] || LEVEL_POOLS.beginner)[phaseKey] || [];
    const extras  = (LEVEL_POOLS[level] || LEVEL_POOLS.beginner).extras || ['plank'];

    // Apply goal emphasis
    const orderedPool = applyGoalEmphasis(rawPool, goalKey);

    // Compute week defaults
    weekDefaults[w] = computeWeekDefaults(w, level, cycleNum);

    // Generate each training day for this week
    const weekSchedule = {};
    days.forEach((day, i) => {
      const mainExercises = pickSessionExercises(orderedPool, i, days.length);
      const extraCredit   = pickExtraCredit(extras, mainExercises, i);
      weekSchedule[day]   = { exercises: mainExercises, extraCredit };
    });

    weeks[w] = weekSchedule;
  }

  return {
    weeks,
    weekDefaults,
    metadata: {
      experienceLevel: level,
      goal: goalKey,
      daysPerWeek: days.length,
      selectedDays: days,
      cycleNum,
      generatedAt: Date.now(),
    },
  };
}

/* ── CrossFit program: wraps CROSSFIT_SCHEDULE into the standard program format ── */
function generateCrossfitProgram({ hasGhd = true, cycleNum = 1 }) {
  const weeks = {};
  const weekDefaults = {};

  for (let w = 1; w <= 12; w++) {
    const sched = CROSSFIT_SCHEDULE[w] || {};
    const weekSched = {};

    Object.keys(sched).forEach(day => {
      const raw = sched[day];
      const movements = raw.movements.map(m => {
        if (!hasGhd && m.altId) {
          return { ...m, id: m.altId, altId: undefined };
        }
        return { ...m };
      });
      weekSched[day] = {
        type: 'amrap',
        timeCap: raw.timeCap,
        movements,
      };
    });

    weeks[w] = weekSched;

    // Week defaults still needed for badge/session-count helpers
    weekDefaults[w] = WEEK_DEFAULTS[w] || WEEK_DEFAULTS[1];
  }

  return {
    weeks,
    weekDefaults,
    metadata: {
      workoutStyle: 'crossfit',
      hasGhd,
      cycleNum,
      generatedAt: Date.now(),
    },
  };
}

/* ── Describe what changes next cycle (for cycle-complete screen) ── */
function describeNextCycle(cycleNum, profile) {
  const level  = profile.experienceLevel || 'beginner';
  const next   = cycleNum + 1;
  const base   = BASE_VOLUME[level] || BASE_VOLUME.beginner;
  const mod    = Math.min(next - 1, 4);
  const lines  = [];

  // Volume change
  const setIncrease = Math.floor(mod * 0.5) - Math.floor((mod - 1) * 0.5);
  if (setIncrease > 0)   lines.push(`+${setIncrease} set per exercise`);
  lines.push(`+1 rep/exercise across all weeks`);
  if (cycleNum >= 2)     lines.push(`+5s on timed holds`);

  // Exercise unlock
  const unlockMap = {
    2: { beginner: 'Box Jump', intermediate: 'Hurdle Hop', advanced: 'Depth Jump', elite: 'Sprint Start' },
    3: { beginner: 'Hurdle Hop', intermediate: 'Depth Jump', advanced: 'Sprint Start', elite: 'Max-intensity combos' },
    4: { beginner: 'Depth Jump', intermediate: 'Skater Bound + Sprint Start', advanced: 'Full elite pool', elite: 'Peak volume' },
  };
  const unlock = (unlockMap[next] || {})[level];
  if (unlock) lines.push(`New focus: ${unlock}`);

  return lines;
}
