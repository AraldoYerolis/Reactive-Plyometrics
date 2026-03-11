/* ============================================================
   REACTIVE PLYOMETRICS — APP.JS
   Boot, nav wiring, initialization
   ============================================================ */

'use strict';

/* ── Boot ── */
(function boot() {
  // Wire bottom nav buttons
  document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      window.location.hash = '#' + screen;
    });
  });

  // Initialize router (handles initial hash)
  initRouter();

  // If there's a pending session in state (app closed mid-session), resume it
  const state = getState();
  if (state.pendingSession) {
    const { week, dayKey } = state.pendingSession;
    // Don't auto-resume; just clear so user can restart cleanly
    patchState({ pendingSession: null });
  }

  // Handle Google Fonts offline fallback gracefully (already using system fonts as fallback in CSS)
  console.log('[RP] Reactive Plyometrics loaded. State version:', state.version);
})();

/* ── Service Worker (optional, for offline support) ── */
// No service worker needed per requirements (localStorage only)

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
