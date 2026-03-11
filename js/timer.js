/* ============================================================
   REACTIVE PLYOMETRICS — TIMER.JS
   Countdown timer with SVG ring + rep counter
   ============================================================ */

'use strict';

/* ── Timer Ring SVG generator ── */
function createTimerRingSVG(id = 'main') {
  const r = 68;
  const circ = 2 * Math.PI * r;
  return `
<svg class="timer-ring-svg" viewBox="0 0 160 160" aria-hidden="true">
  <defs>
    <linearGradient id="timerGradient-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <circle class="timer-ring-bg" cx="80" cy="80" r="${r}"/>
  <circle
    class="timer-ring-fill"
    id="timer-ring-fill-${id}"
    cx="80" cy="80" r="${r}"
    stroke="url(#timerGradient-${id})"
    stroke-dasharray="${circ}"
    stroke-dashoffset="0"
  />
  <text class="timer-seconds" id="timer-seconds-${id}" x="80" y="76">0</text>
  <text class="timer-label-text" id="timer-label-${id}" x="80" y="96">SEC</text>
</svg>`;
}

/* ── CountdownTimer class ── */
class CountdownTimer {
  constructor({ totalSeconds, ringId = 'main', onTick, onComplete, onStart }) {
    this.totalSeconds = totalSeconds;
    this.remaining = totalSeconds;
    this.ringId = ringId;
    this.onTick = onTick || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onStart = onStart || (() => {});
    this._interval = null;
    this._running = false;
    this._circ = 2 * Math.PI * 68;
  }

  _updateDOM() {
    const secEl  = document.getElementById(`timer-seconds-${this.ringId}`);
    const fillEl = document.getElementById(`timer-ring-fill-${this.ringId}`);
    if (!secEl || !fillEl) return;

    secEl.textContent = this.remaining;
    const pct = this.remaining / this.totalSeconds;
    const offset = this._circ * (1 - pct);
    fillEl.style.strokeDashoffset = offset;

    // Color shift: green → yellow → red as time decreases
    if (pct > 0.5) {
      fillEl.style.stroke = `url(#timerGradient-${this.ringId})`;
    } else if (pct > 0.25) {
      fillEl.style.stroke = '#f59e0b';
    } else {
      fillEl.style.stroke = '#ef4444';
    }
  }

  start() {
    if (this._running) return;
    this._running = true;
    this.onStart();
    this._updateDOM();
    this._interval = setInterval(() => {
      this.remaining--;
      this._updateDOM();
      this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  pause() {
    if (!this._running) return;
    this._running = false;
    clearInterval(this._interval);
    this._interval = null;
  }

  resume() {
    if (this._running || this.remaining <= 0) return;
    this.start();
  }

  stop() {
    this._running = false;
    clearInterval(this._interval);
    this._interval = null;
  }

  reset() {
    this.stop();
    this.remaining = this.totalSeconds;
    this._updateDOM();
  }

  isRunning() { return this._running; }
  isDone() { return this.remaining <= 0; }
}

/* ── RestTimer: compact inline countdown (no ring) ── */
class RestTimer {
  constructor({ seconds, onComplete, elementId }) {
    this.seconds = seconds;
    this.remaining = seconds;
    this.onComplete = onComplete || (() => {});
    this.elementId = elementId;
    this._interval = null;
  }

  start() {
    this._updateEl();
    this._interval = setInterval(() => {
      this.remaining--;
      this._updateEl();
      if (this.remaining <= 0) {
        clearInterval(this._interval);
        this.onComplete();
      }
    }, 1000);
  }

  skip() {
    clearInterval(this._interval);
    this.remaining = 0;
    this.onComplete();
  }

  _updateEl() {
    const el = document.getElementById(this.elementId);
    if (el) el.textContent = this.remaining;
  }
}
