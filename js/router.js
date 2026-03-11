/* ============================================================
   REACTIVE PLYOMETRICS — ROUTER.JS
   Hash-based screen switching with transitions
   ============================================================ */

'use strict';

const SCREENS = ['home', 'calendar', 'warmup', 'session', 'trophies'];

/* ── Current screen tracker ── */
let _currentScreen = 'home';

/* ── Navigate to a screen ── */
function navigate(screenId, params = {}) {
  // Hide all screens
  SCREENS.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.remove('active');
  });

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });

  // Show the bottom nav (hidden during workout)
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = (screenId === 'session') ? 'none' : '';

  // Activate target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (!target) return;
  target.classList.add('active');
  _currentScreen = screenId;

  // Render screen content
  switch (screenId) {
    case 'home':     renderHome();    break;
    case 'calendar': renderCalendar(); break;
    case 'trophies': renderTrophies(); break;
    case 'session':
      if (params.week && params.dayKey) {
        startWorkoutSession(params.week, params.dayKey);
      } else {
        // No specific session params — start the next incomplete workout
        const next = getUpcomingSessions(1);
        const target = next.length ? next[0] : getAllSessions()[0];
        if (target) {
          startWorkoutSession(target.week, target.dayKey);
        } else {
          startWorkoutSession(null, null); // triggers fallback UI
        }
      }
      break;
    case 'warmup':   /* handled by session flow */  break;
  }

  // Scroll to top
  target.scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ── Hash change handler ── */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';

  // Patterns: #home, #calendar, #trophies
  // Special: #session-{week}-{dayKey}, #warmup-{week}-{dayKey}
  const sessionMatch = hash.match(/^(session|warmup)-(\d+)-(\w+)$/);
  if (sessionMatch) {
    const week = parseInt(sessionMatch[2]);
    const dayKey = sessionMatch[3];
    navigate('session', { week, dayKey });
    return;
  }

  if (SCREENS.includes(hash)) {
    navigate(hash);
  } else {
    navigate('home');
  }
}

/* ── Initialize router ── */
function initRouter() {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // handle initial hash
}

/* ── Render Home Screen ── */
function renderHome() {
  const el = document.getElementById('screen-home');
  if (!el) return;

  const state = getState();
  const currentWeek = getCurrentWeek();
  const phase = getPhase(currentWeek);
  const totalDone = getCompletedSessionCount();
  const totalSessions = getTotalSessions();
  const cycleProgress = Math.min(totalDone % totalSessions || 0, totalSessions);
  const progressPct = Math.round((cycleProgress / totalSessions) * 100);
  const streak = getStreakDays();
  const cycleNum = state.cyclesCompleted + 1;

  // Upcoming sessions (next 3 not-yet-done)
  const upcoming = getUpcomingSessions(3);

  el.innerHTML = `
    <div class="home-hero">
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-lg);">
        <div>
          <p class="label-sm" style="color:rgba(255,255,255,0.6); margin-bottom:4px;">REACTIVE PLYOMETRICS</p>
          <h1 class="home-hero-title">
            ${phase.name}<br>
            <span style="color:rgba(255,255,255,0.6); font-size:1.1rem; font-weight:500;">Week ${currentWeek} of 12</span>
          </h1>
        </div>
        ${streak > 1 ? `<div class="streak-badge">🔥 ${streak}d</div>` : ''}
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${totalDone}</div>
          <div class="stat-label">Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${currentWeek}</div>
          <div class="stat-label">Week</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${cycleNum}</div>
          <div class="stat-label">Cycle</div>
        </div>
      </div>

      <!-- Cycle progress bar -->
      <div class="week-progress">
        <div class="week-progress-header">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.6);">Cycle Progress</span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.8); font-weight:700;">${progressPct}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${progressPct}%"></div>
        </div>
      </div>

      <!-- Quick start next session -->
      ${upcoming.length ? `
        <button class="btn-primary" onclick="window.location.hash='#session-${upcoming[0].week}-${upcoming[0].dayKey}'">
          Start Today's Session ▶
        </button>` : `
        <div style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); border-radius:var(--radius-md); padding:var(--space-md); text-align:center;">
          <div style="font-size:1.5rem; margin-bottom:4px;">🎉</div>
          <div style="font-weight:700; color:var(--phase1);">All sessions complete!</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Check your trophy room</div>
        </div>
      `}
    </div>

    <div class="home-content">

      <!-- Today's badges -->
      ${state.earnedBadges.length ? `
        <div style="margin-bottom:var(--space-lg);">
          <div class="section-title">Latest Badge</div>
          <div style="display:flex; align-items:center; gap:var(--space-md); padding:var(--space-md); background:var(--bg-card); border:1px solid rgba(139,92,246,0.3); border-radius:var(--radius-lg);">
            <div style="width:64px; height:64px; flex-shrink:0;">
              ${buildBadgeSVG(state.earnedBadges[state.earnedBadges.length-1].cycle)}
            </div>
            <div>
              <div style="font-weight:700;">${getBadgeInfo(state.earnedBadges[state.earnedBadges.length-1].cycle).name}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Cycle ${state.earnedBadges[state.earnedBadges.length-1].cycle} Complete</div>
              <button class="btn-ghost" onclick="window.location.hash='#trophies'" style="font-size:0.75rem; padding:4px 0; margin-top:4px; color:var(--accent-purple);">View all badges →</button>
            </div>
          </div>
        </div>` : ''}

      <!-- Upcoming sessions -->
      ${upcoming.length ? `
        <div class="upcoming-sessions">
          <div class="section-title">Upcoming</div>
          ${upcoming.map(s => {
            const ph = getPhase(s.week);
            const sess = getSession(s.week, s.dayKey);
            return `
              <div class="session-item" onclick="window.location.hash='#session-${s.week}-${s.dayKey}'">
                <div class="session-day-badge ${ph.label}">
                  <span class="session-day-name">${s.dayKey.slice(0,3)}</span>
                  <span class="session-day-num">W${s.week}</span>
                </div>
                <div class="session-info">
                  <div class="session-title">${ph.name} · ${sess ? sess.exercises.length : 0} exercises</div>
                  <div class="session-meta">
                    ${sess ? sess.exercises.slice(0,3).map(e=>e.name).join(', ') + (sess.exercises.length > 3 ? '...' : '') : ''}
                  </div>
                </div>
                <div class="session-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
                </div>
              </div>
            `;
          }).join('')}
        </div>` : ''}

      <!-- Phase info card -->
      <div class="card card-glow-purple" style="margin-bottom:var(--space-lg);">
        <div class="flex items-center gap-md" style="margin-bottom:var(--space-sm);">
          <span class="phase-pill ${phase.label}">${phase.name}</span>
          <span style="font-size:0.8rem; color:var(--text-muted);">Weeks ${phase.weeks[0]}–${phase.weeks[phase.weeks.length-1]}</span>
        </div>
        <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6;">${phase.description}</p>
      </div>

      <!-- Reset button (settings) -->
      <div style="text-align:center; padding-bottom:var(--space-md);">
        <button class="btn-ghost" id="reset-btn" style="font-size:0.75rem; color:var(--text-muted);">
          Reset Progress
        </button>
      </div>
    </div>
  `;

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      resetState();
      renderHome();
    }
  });
}

/* ── Helper: get next N upcoming (not completed) sessions ── */
function getUpcomingSessions(n) {
  const result = [];
  for (let w = 1; w <= 12; w++) {
    const sched = SCHEDULE[w] || {};
    for (const day of ALL_DAYS) {
      if (sched[day] && !isSessionComplete(w, day)) {
        result.push({ week: w, dayKey: day });
        if (result.length >= n) return result;
      }
    }
  }
  return result;
}

/* ── Render Trophy Room ── */
function renderTrophies() {
  const el = document.getElementById('screen-trophies');
  if (!el) return;

  const state = getState();
  const cycles = [1, 2, 3, 4, 5];

  el.innerHTML = `
    <div class="trophies-header">
      <h1 class="display-md">Trophy Room</h1>
      <p style="color:rgba(255,255,255,0.7); font-size:0.875rem; margin-top:4px;">
        ${state.cyclesCompleted} cycle${state.cyclesCompleted !== 1 ? 's' : ''} completed
      </p>
    </div>

    <div style="padding: var(--space-md);">
      ${state.earnedBadges.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🏆</div>
          <h3 class="display-sm" style="margin-bottom:var(--space-sm);">No badges yet</h3>
          <p style="color:var(--text-muted); font-size:0.875rem;">Complete all 12 weeks to earn your first monster badge.</p>
        </div>
      ` : ''}

      <div class="badges-grid">
        ${cycles.map(cycle => {
          const earned = state.earnedBadges.find(b => b.cycle === cycle);
          const info = getBadgeInfo(cycle);
          const earnedDate = earned ? new Date(earned.ts).toLocaleDateString('en-US', {month:'short', year:'numeric'}) : null;
          return `
            <div class="badge-card${earned ? ' earned' : ' locked'}">
              <div class="badge-svg-wrapper float-anim" style="${earned ? '' : 'filter:grayscale(1) opacity(0.3); animation:none;'}">
                ${buildBadgeSVG(cycle)}
              </div>
              <div class="badge-name">${info.name}</div>
              <div class="badge-cycle-num">Cycle ${cycle}</div>
              ${earned ? `<div class="badge-earned-date">Earned ${earnedDate}</div>` : `<div class="badge-cycle-num" style="margin-top:4px;">Locked 🔒</div>`}
            </div>
          `;
        }).join('')}

        <!-- "And beyond" teaser -->
        <div class="badge-card" style="background:linear-gradient(135deg,rgba(239,68,68,0.05),rgba(124,58,237,0.05)); border-color:rgba(239,68,68,0.2);">
          <div style="font-size:3rem; margin-bottom:var(--space-sm);">👹</div>
          <div class="badge-name" style="color:var(--text-muted);">Beyond Apex</div>
          <div class="badge-cycle-num">Cycle 6+</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">The demon only grows stronger</div>
        </div>
      </div>

      <!-- Program progress -->
      <div class="card" style="margin-top:var(--space-md); text-align:center;">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:var(--space-sm);">Sessions Completed</div>
        <div style="font-family:var(--font-display); font-size:2rem; font-weight:800;">
          <span style="background:var(--gradient-purple-pink); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
            ${getCompletedSessionCount()}
          </span>
          <span style="color:var(--text-muted); font-size:1rem;"> / ${getTotalSessions()}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">per cycle</div>
      </div>
    </div>
  `;
}
