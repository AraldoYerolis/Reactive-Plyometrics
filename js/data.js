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

  /* ── CrossFit / AMRAP exercises ── */
  'run': {
    id: 'run',
    name: 'Run',
    type: 'distance',
    animKey: 'run',
    description: 'Run at a steady, sustainable pace — not a sprint. Breathe rhythmically and stay tall. This is your transition between rounds; control your effort so you have gas left for the bar work.',
    cue: 'Find your pace and own it — every meter counts.',
    modification: 'Walk or reduce distance by 50%.',
  },
  'bench-press': {
    id: 'bench-press',
    name: 'Bench Press',
    type: 'reps',
    animKey: 'bench-press',
    description: 'Lie flat on the bench, feet planted. Grip just outside shoulder width, lower the bar under control to your chest, then press explosively to lockout. In AMRAP, prioritize a weight you can cycle for all reps unbroken.',
    cue: 'Squeeze the bar like you\'re trying to bend it — it activates your lats.',
    modification: 'Reduce weight; switch to dumbbell press if needed.',
  },
  'pull-ups': {
    id: 'pull-ups',
    name: 'Pull-Ups',
    type: 'reps',
    animKey: 'pull-ups',
    description: 'Dead hang at the bottom, full lockout between reps. Drive your elbows toward your hips to initiate, chin clears the bar at the top. Kipping is allowed — prioritize consistent reps over strict.',
    cue: 'Drive elbows to your hips — think "elbows to pockets".',
    modification: 'Use a band for assistance; substitute ring rows.',
  },
  'push-ups': {
    id: 'push-ups',
    name: 'Push-Ups',
    type: 'reps',
    animKey: 'push-ups',
    description: 'Full range of motion — chest touches the floor at the bottom, full lockout at the top. Keep your hips level and core braced throughout. Break into small sets rather than grinding ugly reps.',
    cue: 'Tight plank the whole time — no worming.',
    modification: 'Drop to knees; elevate hands on a box.',
  },
  'ghd-sit-up': {
    id: 'ghd-sit-up',
    name: 'GHD Sit-Up',
    type: 'reps',
    animKey: 'ghd-sit-up',
    description: 'On the GHD machine, lower your torso back past horizontal — arms extended overhead — then sit up explosively, reaching forward past your toes. This trains full hip flexor range and builds core power absent from floor sit-ups.',
    cue: 'Control the descent; let gravity load the hip flexors.',
    modification: 'Sub Ab-Mat Sit-Ups if no GHD available.',
  },
  'ab-mat-sit-up': {
    id: 'ab-mat-sit-up',
    name: 'Ab-Mat Sit-Up',
    type: 'reps',
    animKey: 'ab-mat-sit-up',
    description: 'Place an ab-mat under your lower back, butterfly your legs (soles of feet together). Touch the mat behind your head at the bottom, sit all the way up and touch your toes at the top. Full range of motion matters.',
    cue: 'Reach your fingertips to your toes at the top of every rep.',
    modification: 'Standard sit-up without ab-mat; reduce range of motion.',
  },
  'kettlebell-swing': {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    type: 'reps',
    animKey: 'kettlebell-swing',
    description: 'American swing: hinge at the hips, swing the KB between your legs, then drive hips explosively to swing the bell overhead to lockout. Power is generated by the hip snap — not your arms or shoulders.',
    cue: 'Hips drive, arms guide — you are not doing a front raise.',
    modification: 'Russian swing (hip height only); use a lighter kettlebell.',
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

  // AMRAP session (CrossFit program)
  if (raw.type === 'amrap') {
    const movements = raw.movements.map(m => {
      const ex = EXERCISES[m.id] || {};
      return { ...ex, ...m, name: ex.name || m.id };
    });
    return { type: 'amrap', week, dayKey, timeCap: raw.timeCap, movements, phase: getPhase(week) };
  }

  // Standard plyometrics session
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
    Object.keys(sched).forEach(day => {
      sessions.push({ week: w, dayKey: day });
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

/* ── CrossFit 12-Week AMRAP Schedule ──
   5 days/week (Mon–Fri). Each session: { timeCap (seconds), movements[] }
   movements: { id, reps?, dist?, altId? }
   altId = substitute when user has no GHD.
   Phase 1 (Wks 1–4): Foundation · 20–30 min AMRAPs · lower reps
   Phase 2 (Wks 5–8): Development · 30–40 min AMRAPs · moderate reps
   Phase 3 (Wks 9–12): Peak · 40–50 min AMRAPs · full volume
*/
const CROSSFIT_SCHEDULE = {
  1: {
    Mon: { timeCap: 1200, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 10 },
      { id: 'pull-ups', reps: 10 },
      { id: 'ghd-sit-up', reps: 15, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
    Tue: { timeCap: 900, movements: [
      { id: 'push-ups', reps: 12 },
      { id: 'pull-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 15 },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
    Wed: { timeCap: 1200, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 10 },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
    Thu: { timeCap: 1080, movements: [
      { id: 'kettlebell-swing', reps: 15 },
      { id: 'push-ups', reps: 12 },
      { id: 'ab-mat-sit-up', reps: 15 },
    ]},
    Fri: { timeCap: 1500, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ghd-sit-up', reps: 15, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
  },
  2: {
    Mon: { timeCap: 1320, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ghd-sit-up', reps: 15, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
    Tue: { timeCap: 900, movements: [
      { id: 'push-ups', reps: 15 },
      { id: 'pull-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 15 },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
    Wed: { timeCap: 1320, movements: [
      { id: 'run', dist: 500 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
    Thu: { timeCap: 1200, movements: [
      { id: 'kettlebell-swing', reps: 18 },
      { id: 'push-ups', reps: 12 },
      { id: 'ab-mat-sit-up', reps: 15 },
    ]},
    Fri: { timeCap: 1680, movements: [
      { id: 'run', dist: 500 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ghd-sit-up', reps: 15, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
  },
  3: {
    Mon: { timeCap: 1500, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ghd-sit-up', reps: 18, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
    Tue: { timeCap: 1080, movements: [
      { id: 'push-ups', reps: 15 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ab-mat-sit-up', reps: 18 },
    ]},
    Wed: { timeCap: 1500, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
    Thu: { timeCap: 1200, movements: [
      { id: 'kettlebell-swing', reps: 20 },
      { id: 'push-ups', reps: 12 },
      { id: 'ab-mat-sit-up', reps: 18 },
    ]},
    Fri: { timeCap: 1800, movements: [
      { id: 'run', dist: 500 },
      { id: 'bench-press', reps: 13 },
      { id: 'pull-ups', reps: 13 },
      { id: 'ghd-sit-up', reps: 18, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
  },
  4: { // Deload week
    Mon: { timeCap: 900, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 8 },
      { id: 'pull-ups', reps: 8 },
      { id: 'ab-mat-sit-up', reps: 12 },
    ]},
    Tue: { timeCap: 720, movements: [
      { id: 'push-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 12 },
      { id: 'kettlebell-swing', reps: 10 },
    ]},
    Wed: { timeCap: 900, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 10 },
      { id: 'pull-ups', reps: 10 },
    ]},
    Thu: { timeCap: 900, movements: [
      { id: 'kettlebell-swing', reps: 12 },
      { id: 'push-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 12 },
    ]},
    Fri: { timeCap: 1200, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 10 },
      { id: 'pull-ups', reps: 10 },
      { id: 'ghd-sit-up', reps: 12, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 12 },
    ]},
  },
  5: {
    Mon: { timeCap: 1800, movements: [
      { id: 'run', dist: 500 },
      { id: 'bench-press', reps: 13 },
      { id: 'pull-ups', reps: 13 },
      { id: 'ghd-sit-up', reps: 18, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 18 },
    ]},
    Tue: { timeCap: 1200, movements: [
      { id: 'push-ups', reps: 18 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 18 },
    ]},
    Wed: { timeCap: 1800, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 14 },
      { id: 'pull-ups', reps: 14 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 1500, movements: [
      { id: 'kettlebell-swing', reps: 20 },
      { id: 'push-ups', reps: 14 },
      { id: 'ab-mat-sit-up', reps: 18 },
    ]},
    Fri: { timeCap: 2100, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 14 },
      { id: 'pull-ups', reps: 14 },
      { id: 'ghd-sit-up', reps: 18, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  6: {
    Mon: { timeCap: 1920, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 14 },
      { id: 'pull-ups', reps: 14 },
      { id: 'ghd-sit-up', reps: 18, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1200, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 18 },
    ]},
    Wed: { timeCap: 1920, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 1500, movements: [
      { id: 'kettlebell-swing', reps: 20 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 2280, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 14 },
      { id: 'pull-ups', reps: 14 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  7: {
    Mon: { timeCap: 2100, movements: [
      { id: 'run', dist: 600 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1320, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Wed: { timeCap: 2100, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 1680, movements: [
      { id: 'kettlebell-swing', reps: 20 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 2400, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  8: { // Deload week
    Mon: { timeCap: 1200, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 10 },
      { id: 'pull-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 15 },
    ]},
    Tue: { timeCap: 900, movements: [
      { id: 'push-ups', reps: 12 },
      { id: 'ab-mat-sit-up', reps: 15 },
      { id: 'kettlebell-swing', reps: 12 },
    ]},
    Wed: { timeCap: 1200, movements: [
      { id: 'run', dist: 400 },
      { id: 'bench-press', reps: 10 },
      { id: 'pull-ups', reps: 10 },
    ]},
    Thu: { timeCap: 1080, movements: [
      { id: 'kettlebell-swing', reps: 15 },
      { id: 'push-ups', reps: 10 },
      { id: 'ab-mat-sit-up', reps: 15 },
    ]},
    Fri: { timeCap: 1500, movements: [
      { id: 'run', dist: 500 },
      { id: 'bench-press', reps: 12 },
      { id: 'pull-ups', reps: 12 },
      { id: 'ghd-sit-up', reps: 15, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 15 },
    ]},
  },
  9: {
    Mon: { timeCap: 2400, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1500, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 18 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Wed: { timeCap: 2400, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 1800, movements: [
      { id: 'kettlebell-swing', reps: 25 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 2700, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  10: {
    Mon: { timeCap: 2520, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1500, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 18 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Wed: { timeCap: 2520, movements: [
      { id: 'run', dist: 800 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 1800, movements: [
      { id: 'kettlebell-swing', reps: 25 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 2880, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  11: {
    Mon: { timeCap: 2700, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1680, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 18 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Wed: { timeCap: 2700, movements: [
      { id: 'run', dist: 800 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 2100, movements: [
      { id: 'kettlebell-swing', reps: 25 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 3000, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
  12: {
    Mon: { timeCap: 3000, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Tue: { timeCap: 1800, movements: [
      { id: 'push-ups', reps: 20 },
      { id: 'pull-ups', reps: 20 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Wed: { timeCap: 3000, movements: [
      { id: 'run', dist: 800 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
    Thu: { timeCap: 2100, movements: [
      { id: 'kettlebell-swing', reps: 25 },
      { id: 'push-ups', reps: 15 },
      { id: 'ab-mat-sit-up', reps: 20 },
    ]},
    Fri: { timeCap: 3000, movements: [
      { id: 'run', dist: 700 },
      { id: 'bench-press', reps: 15 },
      { id: 'pull-ups', reps: 15 },
      { id: 'ghd-sit-up', reps: 20, altId: 'ab-mat-sit-up' },
      { id: 'kettlebell-swing', reps: 20 },
    ]},
  },
};

/* ── Get an AMRAP session from the CrossFit schedule ── */
function getAmrapSession(week, dayKey, hasGhd) {
  const sched = CROSSFIT_SCHEDULE[week];
  if (!sched || !sched[dayKey]) return null;
  const raw = sched[dayKey];
  const movements = raw.movements.map(m => {
    // Swap GHD for Ab-Mat if user has no GHD
    if (!hasGhd && m.altId) {
      const altEx = EXERCISES[m.altId] || {};
      return { ...m, id: m.altId, name: altEx.name || m.altId, altId: undefined };
    }
    const ex = EXERCISES[m.id] || {};
    return { ...m, name: ex.name || m.id };
  });
  return {
    type: 'amrap',
    week,
    dayKey,
    timeCap: raw.timeCap,
    movements,
    phase: getPhase(week),
  };
}

/* ── Format AMRAP time cap for display ── */
function fmtTimeCap(seconds) {
  const m = Math.floor(seconds / 60);
  return `${m} min AMRAP`;
}

/* ── Format a movement label for display (reps or distance) ── */
function fmtMovement(m) {
  if (m.dist) return `${m.dist}m Run`;
  return `${m.reps} ${m.name || m.id}`;
}

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
