/* ============================================================
   REACTIVE PLYOMETRICS — CALENDAR.JS
   12-week program calendar renderer and interactions
   ============================================================ */

'use strict';

let _calendarExpandedDay = null; // { week, dayKey }

/* ── Render the full calendar screen ── */
function renderCalendar() {
  const el = document.getElementById('screen-calendar');
  if (!el) return;

  el.innerHTML = `
    <div class="calendar-header">
      <div class="flex justify-between items-center">
        <h1 class="display-md">12-Week Program</h1>
        <span class="streak-badge">
          🔥 ${getStreakDays()} day streak
        </span>
      </div>
      <div class="calendar-legend">
        ${PHASES.map(p => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${p.color}"></div>
            <span>Phase ${p.id}</span>
          </div>
        `).join('')}
        <div class="legend-item">
          <div class="legend-dot" style="background: var(--text-muted)"></div>
          <span>Rest</span>
        </div>
      </div>
    </div>
    <div class="calendar-body">
      ${renderAllWeeks()}
    </div>
  `;

  // Attach click handlers
  el.querySelectorAll('.day-cell.workout').forEach(cell => {
    cell.addEventListener('click', () => {
      const week = parseInt(cell.dataset.week);
      const day = cell.dataset.day;
      toggleDayDetail(week, day, cell);
    });
  });
}

/* ── Render all 12 weeks ── */
function renderAllWeeks() {
  let html = '';
  for (let w = 1; w <= 12; w++) {
    const phase = getPhase(w);
    html += `
      <div class="week-block" id="week-block-${w}">
        <div class="week-label ${phase.label}">
          Week ${w} &nbsp;·&nbsp; ${phase.name}
        </div>
        <div class="day-grid" id="day-grid-${w}">
          ${renderWeekDays(w)}
        </div>
      </div>
    `;
  }
  return html;
}

/* ── Render day cells for one week ── */
function renderWeekDays(week) {
  const sched = SCHEDULE[week] || {};
  const phase = getPhase(week);
  const today = new Date();
  const startDate = getState().startDate;
  let html = '';

  ALL_DAYS.forEach((day, idx) => {
    const hasWorkout = !!sched[day];
    const done = hasWorkout && isSessionComplete(week, day);
    const isToday = calcIsToday(week, idx);

    let classes = 'day-cell';
    if (hasWorkout) {
      classes += ` workout ${phase.label}`;
      if (done) classes += ' completed';
      if (isToday) classes += ' today';
    } else {
      classes += ' rest';
    }

    const exCount = hasWorkout ? sched[day].exercises.length : 0;
    const label = DAY_LABELS[day] || day.slice(0,1);

    html += `
      <div class="${classes}"
           data-week="${week}" data-day="${day}"
           aria-label="${day} Week ${week}${hasWorkout ? ', '+exCount+' exercises' : ', Rest day'}">
        <span class="day-num">${label}</span>
        ${done ? '' : (hasWorkout ? `<span class="day-name">${exCount}ex</span>` : '<span class="day-name">rest</span>')}
      </div>
    `;
  });

  return html;
}

/* ── Toggle day detail panel ── */
function toggleDayDetail(week, dayKey, cellEl) {
  const gridEl = document.getElementById(`day-grid-${week}`);
  if (!gridEl) return;

  // Remove existing panel if any
  const existing = gridEl.querySelector('.day-detail-panel');
  const isSameDay = _calendarExpandedDay &&
    _calendarExpandedDay.week === week && _calendarExpandedDay.dayKey === dayKey;

  if (existing) {
    existing.remove();
    _calendarExpandedDay = null;
    if (isSameDay) return; // clicking same day closes it
  }

  _calendarExpandedDay = { week, dayKey };

  const session = getSession(week, dayKey);
  if (!session) return;

  const phase = session.phase;
  const done = isSessionComplete(week, dayKey);
  const exList = session.exercises.map(ex =>
    `<li>
       <span class="ex-name">${ex.name}</span>
       <span class="ex-sets">${fmtExercise(ex)}</span>
     </li>`
  ).join('');
  const ecList = session.extraCredit.length ? `
    <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border);">
      <span class="label-sm" style="color:var(--accent-purple); margin-bottom:6px; display:block;">Extra Credit</span>
      ${session.extraCredit.map(ex =>
        `<div style="display:flex; justify-content:space-between; padding:4px 0; font-size:0.8rem; color:var(--text-secondary);">
           <span>${ex.name}</span><span>${fmtExercise(ex)}</span>
         </div>`
      ).join('')}
    </div>` : '';

  const panel = document.createElement('div');
  panel.className = 'day-detail-panel';
  panel.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom:12px;">
      <div>
        <span class="phase-pill ${phase.label}">${phase.name}</span>
        <div class="day-detail-title" style="margin-top:6px;">${dayKey}, Week ${week}</div>
      </div>
      ${done ?
        '<span style="color: var(--phase1); font-size:1.4rem;">✓ Done</span>' :
        `<button class="btn-primary" style="width:auto; padding:10px 20px; font-size:0.875rem;"
                 onclick="startSession(${week},'${dayKey}')">Start</button>`
      }
    </div>
    <ul class="day-detail-exercises">${exList}</ul>
    ${ecList}
    ${session.extraCredit.length ? '' : ''}
  `;

  gridEl.appendChild(panel);

  // Smooth scroll to panel
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

/* ── Determine if a specific week/day index is "today" relative to program start ──
   This is approximate: maps program day to calendar real date. */
function calcIsToday(week, dayIndex) {
  const state = getState();
  if (!state.startDate) return false;
  const start = new Date(state.startDate);
  // week 1 = days 0-6, week 2 = days 7-13, etc.
  const progDay = (week - 1) * 7 + dayIndex;
  const targetDate = new Date(start);
  targetDate.setDate(start.getDate() + progDay);
  const today = new Date();
  return targetDate.toDateString() === today.toDateString();
}

/* ── Kick off a session from calendar ── */
function startSession(week, dayKey) {
  // Navigate to warmup screen
  window.location.hash = `#warmup-${week}-${dayKey}`;
}
