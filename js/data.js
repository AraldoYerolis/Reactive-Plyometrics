/* ============================================================
   REACTIVE PLYOMETRICS — DATA.JS
   Exercise library + 12-week program schedule
   ============================================================ */

'use strict';

/* ── Warm-up (shown before every session) ── */
const WARMUP_EXERCISES = [
  { id: 'leg-swings',   name: 'Leg Swings',    reps: '10 each side' },
  { id: 'hip-circles',  name: 'Hip Circles',   reps: '10 each direction' },
  { id: 'arm-circles',  name: 'Arm Circles',   reps: '15 forward / back' },
  { id: 'jumping-jacks',name: 'Jumping Jacks', reps: '20 reps' },
  { id: 'high-knees',   name: 'High Knees',    reps: '20 reps' },
];

/* ── Exercise Library ── */
const EXERCISES = {
  'squat-jump': {
    id: 'squat-jump',
    name: 'Squat Jump',
    type: 'reps',
    animKey: 'squat-jump',
    description: 'Perform a full squat then drive explosively through the heels to jump as high as possible. Land softly with bent knees and immediately lower into the next rep. Focus on minimizing ground contact time.',
    cue: 'Jump from your heels — not your toes.',
    modification: 'No-jump squat pulse; pause before each rep.',
    phases: [1,2,3],
  },
  'box-jump': {
    id: 'box-jump',
    name: 'Box Jump',
    type: 'reps',
    animKey: 'box-jump',
    description: 'Stand facing a box. Drop into a quarter squat, swing arms explosively, and jump to land softly with both feet on top. Step down one foot at a time.',
    cue: 'Land quiet — pretend the box is made of glass.',
    modification: 'Step up and down instead of jumping; reduce box height.',
    phases: [1,2,3],
  },
  'broad-jump': {
    id: 'broad-jump',
    name: 'Broad Jump',
    type: 'reps',
    animKey: 'broad-jump',
    description: 'Hinge at the hips, drive arms back, then explode forward for maximum horizontal distance. Stick the landing for one full second before resetting.',
    cue: 'Drive the arms like you\'re throwing them forward.',
    modification: 'Reduce jump distance; mark a shorter target line.',
    phases: [1,2,3],
  },
  'lateral-bound': {
    id: 'lateral-bound',
    name: 'Lateral Bound',
    type: 'reps',
    animKey: 'lateral-bound',
    description: 'Push off one foot to bound laterally, landing and balancing on the opposite foot. Pause briefly to control balance, then bound back. Develops frontal-plane power and ankle stability.',
    cue: 'Reach with the foot — not the body.',
    modification: 'Step laterally with smaller range; allow toe-touch on landing.',
    phases: [1,2,3],
  },
  'depth-jump': {
    id: 'depth-jump',
    name: 'Depth Jump',
    type: 'reps',
    animKey: 'depth-jump',
    description: 'Step off a box (do not jump off), and upon ground contact immediately explode upward as fast as possible. This trains the stretch-shortening cycle — the signature reactive drill.',
    cue: 'The ground is a hot plate — get off it instantly.',
    modification: 'Replace with squat jump; reduce box height to 6 inches.',
    phases: [2,3],
  },
  'clap-pushup': {
    id: 'clap-pushup',
    name: 'Clap Push-Up',
    type: 'reps',
    animKey: 'clap-pushup',
    description: 'Perform a push-up with maximum force through the press so hands leave the ground. Clap once in the air and return hands to catch position. Builds upper-body explosive power.',
    cue: 'Think push, not clap — the clap is just proof of power.',
    modification: 'Kneeling clap push-up; or hands-only lift without clap.',
    phases: [1,2,3],
  },
  'wall-sit': {
    id: 'wall-sit',
    name: 'Wall Sit',
    type: 'timed',
    animKey: 'wall-sit',
    description: 'Place your back flat against the wall with thighs parallel to the floor, knees at exactly 90 degrees. This isometric hold builds quad endurance that supports plyometric landings.',
    cue: 'Dig your heels into the floor — don\'t let them slide.',
    modification: 'Reduce angle to 120 degrees; shorter hold duration.',
    phases: [1,2,3],
  },
  'plank': {
    id: 'plank',
    name: 'Plank',
    type: 'timed',
    animKey: 'plank',
    description: 'Hold a forearm plank with body in a straight line from heels to head. Brace the core as though bracing for a punch. Builds anterior chain stability for force transmission during explosive movements.',
    cue: 'Squeeze your glutes as hard as your abs.',
    modification: 'Drop to knees; reduce duration to 20 seconds.',
    phases: [1,2,3],
  },
  'dead-hang': {
    id: 'dead-hang',
    name: 'Dead Hang',
    type: 'timed',
    animKey: 'dead-hang',
    description: 'Hang from a pull-up bar with shoulders depressed (pulled down, not shrugged). Decompresses the spine, builds grip strength, and develops shoulder girdle stability for upper-body plyometrics.',
    cue: 'Pull your shoulder blades down into your back pockets.',
    modification: 'Use a band for assistance; reduce hang time; use a lower bar.',
    phases: [1,2,3],
  },
  'hurdle-hop': {
    id: 'hurdle-hop',
    name: 'Hurdle Hop',
    type: 'reps',
    animKey: 'hurdle-hop',
    description: 'Jump over mini hurdles (6-12 inches) in a line with both feet, minimizing ground contact time. The rhythm should be rapid and consistent with stiff ankles doing most of the work.',
    cue: 'Ankle stiffness is the goal — let your calves do the work.',
    modification: 'No hurdles; perform a low two-foot hop in place; reduce hurdle height.',
    phases: [2,3],
  },
  'skater-bound': {
    id: 'skater-bound',
    name: 'Skater Bound',
    type: 'reps',
    animKey: 'skater-bound',
    description: 'A long lateral bound with a lower athletic position mimicking speed skater mechanics. Arm cross-swing and hip push are key. Develops elastic energy storage in the hip abductors.',
    cue: 'Low and wide — your hip pushes you, not your knee.',
    modification: 'Reduce stride length; allow small step instead of bound.',
    phases: [2,3],
  },
  'sprint-start': {
    id: 'sprint-start',
    name: 'Sprint Start',
    type: 'timed',
    animKey: 'sprint-start',
    description: 'From an athletic stance, drive explosively off the back foot. Focus on the first 3-5 steps: low angle, powerful push, rapid arm drive. Accelerate for 10 meters then walk back.',
    cue: 'Push the ground away behind you — not forward.',
    modification: 'Perform in place as high-knee drive; reduce to 50% effort.',
    phases: [3],
  },
};

/* ── Per-week sets/reps overrides ──
   Format: { exerciseId: { sets, reps?, duration? } }
   Any not listed use defaults below.
*/
const WEEK_DEFAULTS = {
  1: { sets: 3, jumpReps: 8,  boundReps: 6, timedDur: 30 },
  2: { sets: 3, jumpReps: 10, boundReps: 8, timedDur: 35 },
  3: { sets: 3, jumpReps: 10, boundReps: 8, timedDur: 40 },
  4: { sets: 2, jumpReps: 8,  boundReps: 6, timedDur: 30 }, // deload
  5: { sets: 3, jumpReps: 8,  boundReps: 8, timedDur: 40 },
  6: { sets: 4, jumpReps: 10, boundReps: 8, timedDur: 45 },
  7: { sets: 4, jumpReps: 10, boundReps: 10,timedDur: 45 },
  8: { sets: 2, jumpReps: 8,  boundReps: 8, timedDur: 30 }, // deload
  9: { sets: 4, jumpReps: 8,  boundReps: 10,timedDur: 45 },
  10:{ sets: 4, jumpReps: 10, boundReps: 10,timedDur: 50 },
  11:{ sets: 4, jumpReps: 10, boundReps: 12,timedDur: 55 },
  12:{ sets: 4, jumpReps: 12, boundReps: 12,timedDur: 60 },
};

function getExSets(week, exId, weekDefaultsOverride) {
  const wd = weekDefaultsOverride || WEEK_DEFAULTS;
  const d  = wd[week] || wd[1] || { sets: 3, jumpReps: 8, boundReps: 6, timedDur: 30 };
  const ex = EXERCISES[exId];
  if (!ex) return { sets: 3, reps: 8 };
  if (ex.type === 'timed') return { sets: d.sets, duration: d.timedDur };
  const jumpIds = ['squat-jump','box-jump','broad-jump','depth-jump','hurdle-hop'];
  return { sets: d.sets, reps: jumpIds.includes(exId) ? d.jumpReps : d.boundReps };
}

/* ── Dynamic program helpers (used when a generated program is active) ── */

function getDynamicSession(program, week, dayKey) {
  const sched = (program.weeks || {})[week];
  if (!sched || !sched[dayKey]) return null;
  const raw = sched[dayKey];
  const wd  = program.weekDefaults;
  const exercises   = raw.exercises.map(id => ({ ...EXERCISES[id], ...getExSets(week, id, wd) }));
  const extraCredit = (raw.extraCredit || []).map(id => ({ ...EXERCISES[id], ...getExSets(week, id, wd) }));
  return { week, dayKey, exercises, extraCredit, phase: getPhase(week) };
}

function getDynamicSessions(program) {
  const sessions = [];
  const weeks = program.weeks || {};
  for (let w = 1; w <= 12; w++) {
    const sched = weeks[w] || {};
    ALL_DAYS.forEach(day => {
      if (sched[day]) sessions.push({ week: w, dayKey: day });
    });
  }
  return sessions;
}

/* ── 12-Week Schedule ──
   Structure: SCHEDULE[week][dayKey] = { exercises: [...ids], extraCredit: [...ids] }
*/
const SCHEDULE = {
  1: {
    Mon: { exercises: ['squat-jump','broad-jump','lateral-bound','plank','wall-sit'],   extraCredit: ['dead-hang'] },
    Wed: { exercises: ['box-jump','clap-pushup','lateral-bound','plank','wall-sit'],    extraCredit: ['dead-hang'] },
    Fri: { exercises: ['squat-jump','broad-jump','box-jump','plank','dead-hang'],       extraCredit: ['wall-sit'] },
  },
  2: {
    Mon: { exercises: ['squat-jump','broad-jump','lateral-bound','plank','wall-sit'],   extraCredit: ['dead-hang'] },
    Wed: { exercises: ['box-jump','clap-pushup','lateral-bound','plank','dead-hang'],   extraCredit: ['wall-sit'] },
    Fri: { exercises: ['squat-jump','box-jump','clap-pushup','plank','wall-sit'],       extraCredit: ['dead-hang'] },
  },
  3: {
    Mon: { exercises: ['box-jump','squat-jump','lateral-bound','plank','wall-sit'],     extraCredit: ['dead-hang'] },
    Wed: { exercises: ['broad-jump','clap-pushup','lateral-bound','plank','dead-hang'], extraCredit: ['wall-sit'] },
    Fri: { exercises: ['box-jump','broad-jump','squat-jump','plank','wall-sit'],        extraCredit: ['clap-pushup'] },
  },
  4: { // deload
    Mon: { exercises: ['squat-jump','broad-jump','plank'],                              extraCredit: ['dead-hang'] },
    Wed: { exercises: ['lateral-bound','clap-pushup','wall-sit'],                       extraCredit: ['dead-hang'] },
    Fri: { exercises: ['box-jump','broad-jump','plank'],                                extraCredit: ['wall-sit'] },
  },
  5: {
    Mon: { exercises: ['depth-jump','squat-jump','hurdle-hop','plank','wall-sit'],      extraCredit: ['dead-hang'] },
    Wed: { exercises: ['depth-jump','lateral-bound','skater-bound','plank','wall-sit'], extraCredit: ['dead-hang'] },
    Fri: { exercises: ['box-jump','hurdle-hop','clap-pushup','plank','dead-hang'],      extraCredit: ['wall-sit'] },
  },
  6: {
    Mon: { exercises: ['depth-jump','hurdle-hop','squat-jump','plank','wall-sit'],      extraCredit: ['dead-hang'] },
    Wed: { exercises: ['skater-bound','lateral-bound','clap-pushup','plank','dead-hang'],extraCredit: ['wall-sit'] },
    Fri: { exercises: ['depth-jump','broad-jump','hurdle-hop','plank','wall-sit'],      extraCredit: ['dead-hang'] },
  },
  7: {
    Mon: { exercises: ['depth-jump','hurdle-hop','skater-bound','plank','wall-sit'],    extraCredit: ['dead-hang'] },
    Wed: { exercises: ['box-jump','depth-jump','clap-pushup','plank','dead-hang'],      extraCredit: ['wall-sit'] },
    Fri: { exercises: ['squat-jump','hurdle-hop','lateral-bound','plank','wall-sit'],   extraCredit: ['skater-bound'] },
  },
  8: { // deload
    Mon: { exercises: ['depth-jump','hurdle-hop','plank'],                              extraCredit: ['dead-hang'] },
    Wed: { exercises: ['skater-bound','lateral-bound','wall-sit'],                      extraCredit: ['dead-hang'] },
    Fri: { exercises: ['box-jump','broad-jump','plank'],                                extraCredit: ['wall-sit'] },
  },
  9: {
    Mon: { exercises: ['depth-jump','sprint-start','hurdle-hop','plank','wall-sit'],    extraCredit: ['skater-bound'] },
    Wed: { exercises: ['sprint-start','skater-bound','clap-pushup','plank','dead-hang'],extraCredit: ['hurdle-hop'] },
    Fri: { exercises: ['depth-jump','hurdle-hop','broad-jump','plank','wall-sit'],      extraCredit: ['sprint-start'] },
    Sat: { exercises: ['squat-jump','lateral-bound','clap-pushup','plank'],             extraCredit: ['dead-hang'] },
  },
  10: {
    Mon: { exercises: ['depth-jump','sprint-start','hurdle-hop','plank','wall-sit'],    extraCredit: ['skater-bound'] },
    Wed: { exercises: ['sprint-start','skater-bound','depth-jump','plank','dead-hang'], extraCredit: ['clap-pushup'] },
    Fri: { exercises: ['box-jump','hurdle-hop','sprint-start','plank','wall-sit'],      extraCredit: ['skater-bound'] },
    Sat: { exercises: ['squat-jump','broad-jump','clap-pushup','plank'],                extraCredit: ['dead-hang'] },
  },
  11: {
    Mon: { exercises: ['depth-jump','sprint-start','hurdle-hop','skater-bound','plank'],extraCredit: ['wall-sit'] },
    Wed: { exercises: ['sprint-start','depth-jump','clap-pushup','plank','dead-hang'],  extraCredit: ['skater-bound'] },
    Fri: { exercises: ['box-jump','hurdle-hop','sprint-start','broad-jump','plank'],    extraCredit: ['skater-bound'] },
    Sat: { exercises: ['squat-jump','lateral-bound','clap-pushup','plank','wall-sit'],  extraCredit: ['dead-hang'] },
  },
  12: {
    Mon: { exercises: ['box-jump','broad-jump','sprint-start','depth-jump'],            extraCredit: ['hurdle-hop'] },
    Wed: { exercises: ['squat-jump','skater-bound','hurdle-hop','plank'],               extraCredit: ['dead-hang'] },
    Fri: { exercises: ['depth-jump','sprint-start','lateral-bound','squat-jump','plank'],extraCredit: ['wall-sit'] },
    Sat: { exercises: ['dead-hang','plank','wall-sit'],                                 extraCredit: ['skater-bound'] },
  },
};

/* ── Phase info ── */
const PHASES = [
  { id: 1, name: 'Foundation',       weeks: [1,2,3,4],    color: '#22c55e', cssVar: 'phase1', label: 'p1', description: 'Building movement patterns and landing mechanics at low intensity.' },
  { id: 2, name: 'Development',      weeks: [5,6,7,8],    color: '#3b82f6', cssVar: 'phase2', label: 'p2', description: 'Progressive loading with reactive elements and combination drills.' },
  { id: 3, name: 'Peak Performance', weeks: [9,10,11,12], color: '#ef4444', cssVar: 'phase3', label: 'p3', description: 'Maximum intensity with sport-specific power and complex training.' },
];

/* ── Day keys in calendar order ── */
const ALL_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_LABELS = { Mon:'M', Tue:'T', Wed:'W', Thu:'Th', Fri:'F', Sat:'Sa', Sun:'Su' };

/* ── Helper: get phase for week ── */
function getPhase(week) {
  return PHASES.find(p => p.weeks.includes(week)) || PHASES[0];
}

/* ── Helper: get session data for a week+day ── */
function getSession(week, dayKey) {
  const sched = SCHEDULE[week];
  if (!sched || !sched[dayKey]) return null;
  const raw = sched[dayKey];
  const exercises = raw.exercises.map(id => {
    const ex = { ...EXERCISES[id], ...getExSets(week, id) };
    return ex;
  });
  const extraCredit = (raw.extraCredit || []).map(id => {
    const ex = { ...EXERCISES[id], ...getExSets(week, id) };
    return ex;
  });
  return { week, dayKey, exercises, extraCredit, phase: getPhase(week) };
}

/* ── Helper: get all sessions in order for the full program ── */
function getAllSessions() {
  const sessions = [];
  for (let w = 1; w <= 12; w++) {
    const sched = SCHEDULE[w] || {};
    ALL_DAYS.forEach(day => {
      if (sched[day]) sessions.push({ week: w, dayKey: day });
    });
  }
  return sessions;
}

/* ── Helper: count total workout sessions in program ── */
function getTotalSessions() {
  return getAllSessions().length;
}

/* ── Format duration ── */
function fmtDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds/60)}m ${seconds%60>0?seconds%60+'s':''}`.trim();
}

/* ── Format sets/reps string for display ── */
function fmtExercise(ex) {
  if (ex.type === 'timed') return `${ex.sets} × ${fmtDuration(ex.duration)}`;
  return `${ex.sets} × ${ex.reps} reps`;
}
