/* ============================================================
   REACTIVE PLYOMETRICS — APP.JS
   Boot, nav wiring, initialization
   ============================================================ */

'use strict';

/* ── Boot ── */
(function boot() {
  document.getElementById('dbg').innerText = 'BOOT OK';
  // Wire bottom nav buttons
  document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      window.location.hash = '#' + screen;
    });
  });

  // Initialize router (handles initial hash)
  initRouter();
  document.getElementById('dbg').innerText = 'ROUTER INIT';

  // First-run check: redirect to onboarding if not completed
  const state = getState();
  if (!state.onboardingComplete) {
    // Don't interrupt if already on onboarding
    const hash = window.location.hash.replace('#', '');
    if (hash !== 'onboarding') {
      window.location.hash = '#onboarding';
    }
  } else {
    // Clear any stale pending session from a previous crash
    if (state.pendingSession) {
      patchState({ pendingSession: null });
    }
  }

  console.log('[RP] Reactive Plyometrics v2 loaded. State version:', state.version);
})();

/* ── Prevent double-tap zoom on mobile ── */
let lastTouch = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  if (now - lastTouch < 300) {
    e.preventDefault();
  }
  lastTouch = now;
}, { passive: false });

/* ── Prevent pull-to-refresh accidentally ── */
document.addEventListener('touchmove', function(e) {
  if (e.scale !== 1) e.preventDefault();
}, { passive: false });
