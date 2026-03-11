/* ============================================================
   REACTIVE PLYOMETRICS — CALENDAR.JS
   12-week program calendar renderer and interactions
   ============================================================ */

'use strict';

let _calendarExpandedDay = null; // { week, dayKey }

/* ── Render the full calendar screen ── */
function renderCalendar() {
  document.getElementById('dbg').innerText = 'RENDER CAL';
  const el = document.getElementById('screen-calendar');
  if (!el) return;

  // Use dynamic program if available
  const prog = getState().program;
  const profile = getState().profile || {};
  const levelLabel = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced', elite:'Elite' }[profile.experienceLevel] || '';

  el.innerHTML = `
    <div class="calendar-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="display-md">12-Week Program</h1>
          ${levelLabel ? `<p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${levelLabel} · ${(profile.goal || '').charAt(0).toUpperCase() + (profile.goal || '').slice(1)}</p>` : ''}
        </div>
        <span class="streak-badge">🔥 ${getStreakDays()} day streak</span>
      </div>
      <div class="calendar-legend">
        ${PHASES.map(p => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${p.color}"></div>
            <span>Phase ${p.id}</span>
          </div>
        `).join('')}
        <div class="legend-item">
          <div class="legend-dot" style="background:var(--text-muted)"></div>
          <span>Rest</span>
        </div>
      </div>
    </div>
    <div class="calendar-body">
      ${_renderAllWeeks(prog)}
    </div>
  `;

  // Attach click handlers
  el.querySelectorAll('.day-cell.workout').forEach(cell => {
    cell.addEventListener('click', () => {
      const week = parseInt(cell.dataset.week);
      const day  = cell.dataset.day;
      _toggleDayDetail(week, day, cell, prog);
    });
  });
}

/* ── Render all 12 weeks ── */
function _renderAllWeeks(prog) {
  let html = '';
  for (let w = 1; w <= 12; w++) {
    const phase = getPhase(w);
    html += `
      <div class="week-block" id="week-block-${w}">
        <div class="week-label ${phase.label}">
          Week ${w} &nbsp;·&nbsp; ${phase.name}
        </div>
        <div class="day-grid-cal" id="day-grid-${w}">
          ${_renderWeekDays(w, prog)}
        </div>
      </div>
    `;
  }
  return html;
}

/* ── Render day cells for one week ── */
function _renderWeekDays(week, prog) {
  const sched = prog ? (prog.weeks[week] || {}) : (SCHEDULE[week] || {});
  const phase = getPhase(week);
  let html = '';

  ALL_DAYS.forEach((day, idx) => {
    const hasWorkout = !!sched[day];
    const done       = hasWorkout && isSessionComplete(week, day);
    const isToday    = _calcIsToday(week, idx);

    let classes = 'day-cell';
    if (hasWorkout) {
      classes += ` workout ${phase.label}`;
      if (done)    classes += ' completed';
      if (isToday) classes += ' today';
    } else {
      classes += ' rest';
    }

    const dayData   = hasWorkout ? sched[day] : null;
    const isAmrap   = dayData && dayData.type === 'amrap';
    const exCount   = !isAmrap && dayData ? (dayData.exercises || []).length : 0;
    const amrapMin  = isAmrap ? Math.floor(dayData.timeCap / 60) : 0;
    const label     = DAY_LABELS[day] || day.slice(0, 1);
    const cellLabel = isAmrap ? `${amrapMin}m` : `${exCount}ex`;
    const ariaInfo  = isAmrap ? `, ${amrapMin}-min AMRAP` : (hasWorkout ? `, ${exCount} exercises` : ', Rest day');

    html += `
      <div class="${classes}"
           data-week="${week}" data-day="${day}"
           aria-label="${day} Week ${week}${ariaInfo}">
        <span class="day-num">${label}</span>
        ${done
          ? '<span class="day-check">✓</span>'
          : (hasWorkout
            ? `<span class="day-name">${cellLabel}</span>`
            : '<span class="day-name">rest</span>')}
      </div>
    `;
  });

  return html;
}

/* ── Toggle day detail panel ── */
function _toggleDayDetail(week, dayKey, cellEl, prog) {
  const gridEl = document.getElementById(`day-grid-${week}`);
  if (!gridEl) return;

  // Remove existing panel
  const existing  = gridEl.querySelector('.day-detail-panel');
  const isSameDay = _calendarExpandedDay &&
    _calendarExpandedDay.week === week && _calendarExpandedDay.dayKey === dayKey;

  if (existing) {
    existing.remove();
    _calendarExpandedDay = null;
    if (isSameDay) return;
  }

  _calendarExpandedDay = { week, dayKey };

  const session = prog
    ? getDynamicSession(prog, week, dayKey)
    : getSession(week, dayKey);
  if (!session) return;

  const phase = session.phase;
  const done  = isSessionComplete(week, dayKey);

  let bodyHtml;
  if (session.type === 'amrap') {
    const totalMin = Math.floor(session.timeCap / 60);
    const movList = (session.movements || []).map(m =>
      `<li>
         <span class="ex-name">${fmtMovement(m)}</span>
       </li>`
    ).join('');
    bodyHtml = `
      <div style="margin-bottom:8px;">
        <span class="label-sm" style="color:var(--accent-pink);">${totalMin} MIN AMRAP</span>
      </div>
      <ul class="day-detail-exercises">${movList}</ul>`;
  } else {
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
    bodyHtml = `<ul class="day-detail-exercises">${exList}</ul>${ecList}`;
  }

  const panel = document.createElement('div');
  panel.className = 'day-detail-panel';
  panel.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom:12px;">
      <div>
        <span class="phase-pill ${phase.label}">${phase.name}</span>
        <div class="day-detail-title" style="margin-top:6px;">${dayKey}, Week ${week}</div>
      </div>
      ${done
        ? '<span style="color:var(--phase1); font-size:1.4rem;">✓ Done</span>'
        : `<button class="btn-primary" style="width:auto; padding:10px 20px; font-size:0.875rem;"
                   onclick="startSession(${week},'${dayKey}')">Start</button>`}
    </div>
    ${bodyHtml}
  `;

  gridEl.appendChild(panel);
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

/* ── Approximate "is today" based on program start date ── */
function _calcIsToday(week, dayIndex) {
  const state = getState();
  if (!state.startDate) return false;
  const start   = new Date(state.startDate);
  const progDay = (week - 1) * 7 + dayIndex;
  const target  = new Date(start);
  target.setDate(start.getDate() + progDay);
  return target.toDateString() === new Date().toDateString();
}

/* ── Kick off a session from calendar ── */
function startSession(week, dayKey) {
  window.location.hash = `#session-${week}-${dayKey}`;
}
