/* ============================================================
   REACTIVE PLYOMETRICS — ROUTER.JS
   Hash-based screen switching with transitions
   ============================================================ */

'use strict';

const SCREENS = ['home', 'calendar', 'warmup', 'session', 'trophies', 'onboarding', 'settings', 'cycle-complete'];

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

  // Hide bottom nav during workout or onboarding
  const nav = document.getElementById('bottom-nav');
  const hideNav = screenId === 'session' || screenId === 'onboarding';
  if (nav) nav.style.display = hideNav ? 'none' : '';

  // Activate target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (!target) return;
  target.classList.add('active');
  document.getElementById('dbg').innerText = 'NAV ' + screenId;
  _currentScreen = screenId;

  // Render screen content
  switch (screenId) {
    case 'home':           renderHome();           break;
    case 'calendar':       renderCalendar();       break;
    case 'trophies':       renderTrophies();       break;
    case 'settings':       renderSettings();       break;
    case 'onboarding':     renderOnboarding();     break;
    case 'cycle-complete': renderCycleComplete(params); break;
    case 'session': {
      const ok = startWorkoutSession(params.week, params.dayKey);
      if (!ok) {
        const prog2 = getState().program;
        const all2 = prog2 ? getDynamicSessions(prog2) : getAllSessions();
        if (all2.length) startWorkoutSession(all2[0].week, all2[0].dayKey);
        else window.location.hash = 'home';
      }
      break;
    }
    case 'warmup': /* handled by session flow */ break;
  }

  // Scroll to top
  target.scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ── Hash change handler ── */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';

  // Special: #session-{week}-{dayKey}, #warmup-{week}-{dayKey}
  const sessionMatch = hash.match(/^(session|warmup)-(\d+)-(\w+)$/);
  if (sessionMatch) {
    const week   = parseInt(sessionMatch[2]);
    const dayKey = sessionMatch[3];
    navigate('session', { week, dayKey });
    return;
  }

  const sessionMatch = hash.match(/^session-(\d+)-(\w+)$/);
  if (sessionMatch) {
    navigate('session', { week: Number(sessionMatch[1]), dayKey: sessionMatch[2] });
  } else if (SCREENS.includes(hash)) {
    navigate(hash);
  } else {
    navigate('home');
  }
}

/* ── Initialize router ── */
function initRouter() {
  document.getElementById('dbg').innerText = 'INIT ROUTER START';
  window.addEventListener('hashchange', handleHashChange);
  document.getElementById('dbg').innerText = 'STATE OK';
  document.getElementById('dbg').innerText = 'ABOUT TO NAV';
  handleHashChange(); // handle initial hash
}

/* ── Render Home Screen ── */
function renderHome() {
  document.getElementById('dbg').innerText = 'RENDER HOME';
  const el = document.getElementById('screen-home');
  if (!el) return;

  const state        = getState();
  const currentWeek  = getCurrentWeek();
  const phase        = getPhase(currentWeek);
  const totalDone    = getCompletedSessionCount();
  const prog         = state.program;
  const allSessions  = prog ? getDynamicSessions(prog) : getAllSessions();
  const totalSessions = allSessions.length || getTotalSessions();
  const cycleProgress = Math.min(totalDone % totalSessions || 0, totalSessions);
  const progressPct  = Math.round((cycleProgress / totalSessions) * 100);
  const streak       = getStreakDays();
  const cycleNum     = (state.cyclesCompleted || 0) + 1;
  const profile      = state.profile || {};
  const levelLabel   = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced', elite:'Elite' }[profile.experienceLevel] || '';
  const goalLabel    = { speed:'Speed', power:'Power', agility:'Agility', general:'General' }[profile.goal] || '';

  const upcoming = prog
    ? getDynamicSessions(prog)
        .filter(s => !isSessionComplete(s.week, s.dayKey))
        .slice(0, 3)
    : getUpcomingSessions(3);

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
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          ${streak > 1 ? `<div class="streak-badge">🔥 ${streak}d</div>` : ''}
          <button class="btn-icon" id="settings-btn" aria-label="Settings" style="width:38px;height:38px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
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

      <!-- Quick start -->
      ${upcoming.length ? `
        <button class="btn-primary" onclick="window.location.hash='session-${upcoming[0].week}-${upcoming[0].dayKey}'">
          Start Next Session ▶
        </button>` : `
        <div style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); border-radius:var(--radius-md); padding:var(--space-md); text-align:center;">
          <div style="font-size:1.5rem; margin-bottom:4px;">🎉</div>
          <div style="font-weight:700; color:var(--phase1);">All sessions complete!</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Check your trophy room</div>
        </div>
      `}
    </div>

    <div class="home-content">

      <!-- Profile chip -->
      ${levelLabel ? `
        <div style="display:flex; gap:8px; margin-bottom:var(--space-lg); flex-wrap:wrap;">
          <div class="chip">${levelLabel}</div>
          <div class="chip">${goalLabel}</div>
          <div class="chip">${(state.profile.selectedDays || []).join(' · ')}</div>
        </div>` : ''}

      <!-- Latest badge -->
      ${state.earnedBadges && state.earnedBadges.length ? `
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
            const ph   = getPhase(s.week);
            const prog2 = getState().program;
            const sess = prog2 ? getDynamicSession(prog2, s.week, s.dayKey) : getSession(s.week, s.dayKey);
            return `
              <div class="session-item" onclick="window.location.hash='session-${s.week}-${s.dayKey}'">
                <div class="session-day-badge ${ph.label}">
                  <span class="session-day-name">${s.dayKey.slice(0,3)}</span>
                  <span class="session-day-num">W${s.week}</span>
                </div>
                <div class="session-info">
                  <div class="session-title">${ph.name} · ${sess ? sess.exercises.length : 0} exercises</div>
                  <div class="session-meta">
                    ${sess ? sess.exercises.slice(0,3).map(e => e.name).join(', ') + (sess.exercises.length > 3 ? '…' : '') : ''}
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

      <!-- Reset button -->
      <div style="text-align:center; padding-bottom:var(--space-md);">
        <button class="btn-ghost" id="reset-btn" style="font-size:0.75rem; color:var(--text-muted);">
          Reset Progress
        </button>
      </div>
    </div>
  `;

  document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.hash = '#settings';
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      resetState();
      renderHome();
    }
  });
}

/* ── Helper: get next N upcoming (not completed) sessions ── */
function getUpcomingSessions(n) {
  const prog = getState().program;
  const all  = prog ? getDynamicSessions(prog) : getAllSessions();
  const result = [];
  for (const s of all) {
    if (!isSessionComplete(s.week, s.dayKey)) {
      result.push(s);
      if (result.length >= n) break;
    }
  }
  return result;
}

/* ── Render Settings Screen ── */
function renderSettings() {
  const el = document.getElementById('screen-settings');
  if (!el) return;

  const state   = getState();
  const profile = state.profile || {};
  const days    = profile.selectedDays || ['Mon', 'Wed', 'Fri'];
  const dpw     = profile.daysPerWeek  || 3;

  const LEVEL_INFO2 = [
    { key: 'beginner',     label: 'Beginner',     icon: '🌱' },
    { key: 'intermediate', label: 'Intermediate',  icon: '⚡' },
    { key: 'advanced',     label: 'Advanced',      icon: '🔥' },
    { key: 'elite',        label: 'Elite',         icon: '💀' },
  ];
  const GOAL_INFO2 = [
    { key: 'speed',   label: 'Speed',   icon: '⚡' },
    { key: 'power',   label: 'Power',   icon: '💥' },
    { key: 'agility', label: 'Agility', icon: '🌀' },
    { key: 'general', label: 'General', icon: '🏅' },
  ];
  const DAY_ORDER2 = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const DAY_ABBR2  = { Mon:'M', Tue:'T', Wed:'W', Thu:'Th', Fri:'F', Sat:'Sa', Sun:'Su' };

  el.innerHTML = `
    <div class="settings-screen">
      <div class="settings-header">
        <button class="btn-ghost" id="settings-back">← Back</button>
        <h1 class="display-sm">Settings</h1>
        <div style="width:60px;"></div>
      </div>

      <!-- Experience Level -->
      <div class="settings-section">
        <div class="section-title">Experience Level</div>
        <div class="settings-chips" id="s-level-chips">
          ${LEVEL_INFO2.map(l => `
            <div class="settings-chip${profile.experienceLevel === l.key ? ' selected' : ''}" data-key="${l.key}">
              ${l.icon} ${l.label}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Goal -->
      <div class="settings-section">
        <div class="section-title">Primary Goal</div>
        <div class="settings-chips" id="s-goal-chips">
          ${GOAL_INFO2.map(g => `
            <div class="settings-chip${profile.goal === g.key ? ' selected' : ''}" data-key="${g.key}">
              ${g.icon} ${g.label}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Frequency -->
      <div class="settings-section">
        <div class="section-title">Training Days</div>
        <div class="day-grid" id="s-day-grid">
          ${DAY_ORDER2.map(day => {
            const on = days.includes(day);
            return `<button class="day-chip${on ? ' active' : ''}" data-day="${day}">${DAY_ABBR2[day]}</button>`;
          }).join('')}
        </div>
        <p style="font-size:0.78rem; color:var(--text-muted); margin-top:8px;" id="s-day-hint">
          ${days.length} day${days.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <!-- Actions -->
      <div class="settings-section">
        <button class="btn-primary" id="s-regenerate" style="margin-bottom:var(--space-md);">
          Regenerate Program ✦
        </button>
        <button class="btn-secondary" id="s-reset" style="margin-bottom:var(--space-md);">
          Reset All Progress
        </button>
      </div>
    </div>
  `;

  // Track temp edits
  let tempLevel = profile.experienceLevel;
  let tempGoal  = profile.goal;
  let tempDays  = [...days];

  document.getElementById('s-level-chips').addEventListener('click', e => {
    const chip = e.target.closest('.settings-chip');
    if (!chip) return;
    tempLevel = chip.dataset.key;
    document.querySelectorAll('#s-level-chips .settings-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });

  document.getElementById('s-goal-chips').addEventListener('click', e => {
    const chip = e.target.closest('.settings-chip');
    if (!chip) return;
    tempGoal = chip.dataset.key;
    document.querySelectorAll('#s-goal-chips .settings-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });

  document.getElementById('s-day-grid').addEventListener('click', e => {
    const chip = e.target.closest('.day-chip');
    if (!chip) return;
    const day = chip.dataset.day;
    const idx = tempDays.indexOf(day);
    if (idx >= 0) {
      if (tempDays.length <= 3) return; // enforce minimum 3
      tempDays.splice(idx, 1);
    } else {
      tempDays.push(day);
      tempDays.sort((a, b) => DAY_ORDER2.indexOf(a) - DAY_ORDER2.indexOf(b));
    }
    chip.classList.toggle('active', !chip.classList.contains('active'));
    document.getElementById('s-day-hint').textContent =
      `${tempDays.length} day${tempDays.length !== 1 ? 's' : ''} selected`;
  });

  document.getElementById('s-regenerate').addEventListener('click', () => {
    if (!confirm('Regenerate your program with the new settings? Current week progress will be kept.')) return;
    const newProfile = {
      experienceLevel: tempLevel,
      goal:            tempGoal,
      daysPerWeek:     tempDays.length,
      selectedDays:    tempDays,
    };
    const cycleNum  = (getState().cyclesCompleted || 0) + 1;
    const newProg   = generateProgram({ ...newProfile, cycleNum });
    patchState({ profile: newProfile, program: newProg });
    window.location.hash = '#home';
  });

  document.getElementById('s-reset').addEventListener('click', () => {
    if (!confirm('Reset ALL progress? Your badges and completed sessions will be lost. Cannot be undone.')) return;
    resetState();
    window.location.hash = '#onboarding';
  });

  document.getElementById('settings-back').addEventListener('click', () => {
    window.location.hash = '#home';
  });
}

/* ── Render Cycle Complete Screen ── */
function renderCycleComplete(params = {}) {
  const el = document.getElementById('screen-cycle-complete');
  if (!el) return;

  const state    = getState();
  const cycle    = params.cycle || state.cyclesCompleted || 1;
  const nextCycle = cycle + 1;
  const profile  = state.profile || {};
  const badgeInfo = getBadgeInfo(cycle);
  const changes  = describeNextCycle(cycle, profile);

  el.innerHTML = `
    <div class="cycle-complete-screen">
      <div class="cycle-complete-header">
        <div class="cycle-complete-label">Cycle ${cycle} Complete!</div>
        <h1 class="display-lg gradient-text" style="margin-top:8px;">You did it.</h1>
      </div>

      <div class="cycle-badge-display float-anim">
        ${buildBadgeSVG(cycle)}
        <div class="cycle-badge-name">${badgeInfo.name}</div>
      </div>

      <div class="cycle-stats-grid">
        <div class="cycle-stat">
          <div class="cycle-stat-num">${Object.keys(state.completedSessions || {}).length}</div>
          <div class="cycle-stat-label">Sessions</div>
        </div>
        <div class="cycle-stat">
          <div class="cycle-stat-num">12</div>
          <div class="cycle-stat-label">Weeks</div>
        </div>
        <div class="cycle-stat">
          <div class="cycle-stat-num">${cycle}</div>
          <div class="cycle-stat-label">Cycles</div>
        </div>
      </div>

      ${changes.length ? `
        <div class="cycle-next-preview">
          <div class="cycle-next-label">Cycle ${nextCycle} — What's New</div>
          ${changes.map(c => `
            <div class="cycle-next-item">
              <span class="cycle-next-bullet">↑</span>
              <span>${c}</span>
            </div>
          `).join('')}
        </div>` : ''}

      <button class="btn-primary" id="begin-next-cycle" style="margin-top:var(--space-xl);">
        Begin Cycle ${nextCycle} →
      </button>
    </div>
  `;

  document.getElementById('begin-next-cycle').addEventListener('click', () => {
    startNewCycle();
    window.location.hash = '#home';
  });
}

/* ── Render Trophy Room ── */
function renderTrophies() {
  document.getElementById('dbg').innerText = 'RENDER TROPHIES';
  const el = document.getElementById('screen-trophies');
  if (!el) return;

  const state  = getState();
  const cycles = [1, 2, 3, 4, 5];
  const prog   = state.program;
  const allSessions = prog ? getDynamicSessions(prog) : getAllSessions();

  el.innerHTML = `
    <div class="trophies-header">
      <h1 class="display-md">Trophy Room</h1>
      <p style="color:rgba(255,255,255,0.7); font-size:0.875rem; margin-top:4px;">
        ${state.cyclesCompleted || 0} cycle${(state.cyclesCompleted || 0) !== 1 ? 's' : ''} completed
      </p>
    </div>

    <div style="padding:var(--space-md);">
      ${(!state.earnedBadges || !state.earnedBadges.length) ? `
        <div class="empty-state">
          <div class="empty-state-icon">🏆</div>
          <h3 class="display-sm" style="margin-bottom:var(--space-sm);">No badges yet</h3>
          <p style="color:var(--text-muted); font-size:0.875rem;">Complete all 12 weeks to earn your first monster badge.</p>
        </div>
      ` : ''}

      <div class="badges-grid">
        ${cycles.map(cycle => {
          const earned = (state.earnedBadges || []).find(b => b.cycle === cycle);
          const info   = getBadgeInfo(cycle);
          const earnedDate = earned ? new Date(earned.ts).toLocaleDateString('en-US', {month:'short', year:'numeric'}) : null;
          return `
            <div class="badge-card${earned ? ' earned' : ' locked'}">
              <div class="badge-svg-wrapper float-anim" style="${earned ? '' : 'filter:grayscale(1) opacity(0.3); animation:none;'}">
                ${buildBadgeSVG(cycle)}
              </div>
              <div class="badge-name">${info.name}</div>
              <div class="badge-cycle-num">Cycle ${cycle}</div>
              ${earned
                ? `<div class="badge-earned-date">Earned ${earnedDate}</div>`
                : `<div class="badge-cycle-num" style="margin-top:4px;">Locked 🔒</div>`}
            </div>
          `;
        }).join('')}

        <!-- Beyond Apex teaser -->
        <div class="badge-card" style="background:linear-gradient(135deg,rgba(239,68,68,0.05),rgba(124,58,237,0.05)); border-color:rgba(239,68,68,0.2);">
          <div style="font-size:3rem; margin-bottom:var(--space-sm);">👹</div>
          <div class="badge-name" style="color:var(--text-muted);">Beyond Apex</div>
          <div class="badge-cycle-num">Cycle 6+</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">The demon only grows stronger</div>
        </div>
      </div>

      <!-- Cycle history -->
      ${(state.cycleHistory || []).length ? `
        <div class="section-title" style="margin-top:var(--space-lg);">Cycle History</div>
        ${(state.cycleHistory || []).map(c => `
          <div style="display:flex; justify-content:space-between; padding:var(--space-sm) 0; border-bottom:1px solid var(--border); font-size:0.875rem;">
            <span>Cycle ${c.cycle || 0} — ${c.profile ? c.profile.experienceLevel : ''}/${c.profile ? c.profile.goal : ''}</span>
            <span style="color:var(--text-muted);">${c.sessionsCompleted || 0} sessions</span>
          </div>
        `).join('')}
      ` : ''}

      <!-- Program progress -->
      <div class="card" style="margin-top:var(--space-md); text-align:center;">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:var(--space-sm);">Sessions Completed</div>
        <div style="font-family:var(--font-display); font-size:2rem; font-weight:800;">
          <span style="background:var(--gradient-purple-pink); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
            ${getCompletedSessionCount()}
          </span>
          <span style="color:var(--text-muted); font-size:1rem;"> / ${allSessions.length || getTotalSessions()}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">per cycle</div>
      </div>
    </div>
  `;
}
