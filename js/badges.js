/* ============================================================
   REACTIVE PLYOMETRICS — BADGES.JS
   Monster SVG generators + stick figure SVG builders + celebration
   ============================================================ */

'use strict';

/* ════════════════════════════════════════
   STICK FIGURE SVG BUILDERS
   Each returns an inline SVG string.
   All use viewBox="0 0 200 290"
   ════════════════════════════════════════ */

function buildStickFigureSVG(animKey, extraParts = '') {
  const cls = `anim-${animKey}`;
  return `
<svg class="stick-figure-svg ${cls}" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" data-phase="load">
  <defs>
    <filter id="fig-glow-${animKey}">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Ground line -->
  <line class="fig-ground" x1="20" y1="230" x2="180" y2="230"/>

  <!-- Figure root group (animated) -->
  <g class="fig-root" style="transform-origin: 100px 160px">
    <!-- Head -->
    <g class="fig-head-g">
      <circle class="fig-head" cx="100" cy="35" r="18"/>
    </g>
    <!-- Torso -->
    <line x1="100" y1="53" x2="100" y2="152"/>
    <!-- Arms (animated separately) -->
    <g class="fig-arm-l" style="transform-origin: 100px 85px">
      <line x1="100" y1="85" x2="62" y2="120"/>
    </g>
    <g class="fig-arm-r" style="transform-origin: 100px 85px">
      <line x1="100" y1="85" x2="138" y2="120"/>
    </g>
    <!-- Legs (animated separately) -->
    <g class="fig-leg-l" style="transform-origin: 100px 152px">
      <line x1="100" y1="152" x2="72" y2="225"/>
    </g>
    <g class="fig-leg-r" style="transform-origin: 100px 152px">
      <line x1="100" y1="152" x2="128" y2="225"/>
    </g>
    ${extraParts}
  </g>

  <!-- Phase indicators -->
  <g class="phase-indicators">
    <line class="pd-line" x1="42" y1="252" x2="100" y2="252"/>
    <line class="pd-line" x1="100" y1="252" x2="158" y2="252"/>
    <circle class="pd-dot pd-load"    cx="42"  cy="252" r="5"/>
    <circle class="pd-dot pd-explode" cx="100" cy="252" r="5"/>
    <circle class="pd-dot pd-catch"   cx="158" cy="252" r="5"/>
    <text class="pd-text pd-load-t"    x="42"  y="264">LOAD</text>
    <text class="pd-text pd-explode-t" x="100" y="264">EXPLODE</text>
    <text class="pd-text pd-catch-t"   x="158" y="264">CATCH</text>
  </g>
</svg>`;
}

/* Per-exercise SVGs with props */
const FIGURE_SVGS = {
  'squat-jump': () => buildStickFigureSVG('squat-jump'),

  'box-jump': () => buildStickFigureSVG('box-jump',
    `<!-- Box -->
     <rect class="fig-prop" x="70" y="190" width="60" height="35" rx="3"/>`),

  'broad-jump': () => buildStickFigureSVG('broad-jump',
    `<!-- Arrow direction -->
     <line class="fig-ground" x1="20" y1="230" x2="160" y2="230"/>
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="150" y1="225" x2="165" y2="230"/>
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="150" y1="235" x2="165" y2="230"/>`),

  'lateral-bound': () => buildStickFigureSVG('lateral-bound',
    `<!-- Left/right direction arrows -->
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="28" y1="226" x2="16" y2="230"/>
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="28" y1="234" x2="16" y2="230"/>
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="172" y1="226" x2="184" y2="230"/>
     <line style="stroke: var(--accent-blue); stroke-width:2; fill:none; stroke-linecap:round;" x1="172" y1="234" x2="184" y2="230"/>`),

  'depth-jump': () => buildStickFigureSVG('depth-jump',
    `<!-- Box to step off -->
     <rect class="fig-prop" x="55" y="192" width="45" height="35" rx="3"/>`),

  'clap-pushup': () => buildStickFigureSVG('clap-pushup',
    `<!-- Floor indicator for push-up position -->
     <line class="fig-ground" x1="10" y1="175" x2="190" y2="175"/>`),

  'wall-sit': () => `
<svg class="stick-figure-svg anim-wall-sit" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" data-phase="load">
  <!-- Wall -->
  <rect class="fig-prop" x="155" y="60" width="12" height="170" rx="2"/>
  <!-- Ground -->
  <line class="fig-ground" x1="20" y1="230" x2="180" y2="230"/>

  <!-- Static wall-sit figure -->
  <g class="fig-root anim-wall-sit" style="transform-origin: 100px 130px">
    <circle class="fig-head" cx="100" cy="55" r="18"/>
    <!-- Torso (upright) -->
    <line x1="100" y1="73" x2="100" y2="140"/>
    <!-- Arms down/relaxed -->
    <g class="fig-arm-l"><line x1="100" y1="95" x2="72" y2="130"/></g>
    <g class="fig-arm-r"><line x1="100" y1="95" x2="128" y2="130"/></g>
    <!-- Legs bent at 90 deg (sitting) -->
    <line x1="100" y1="140" x2="68" y2="175"/>  <!-- upper leg left -->
    <line x1="100" y1="140" x2="132" y2="175"/>  <!-- upper leg right -->
    <line x1="68" y1="175" x2="68" y2="228"/>   <!-- lower leg left (vertical) -->
    <line x1="132" y1="175" x2="132" y2="228"/>  <!-- lower leg right -->
  </g>

  <!-- Phase indicators -->
  <g class="phase-indicators">
    <line class="pd-line" x1="42" y1="252" x2="100" y2="252"/>
    <line class="pd-line" x1="100" y1="252" x2="158" y2="252"/>
    <circle class="pd-dot pd-load"    cx="42"  cy="252" r="5"/>
    <circle class="pd-dot pd-explode" cx="100" cy="252" r="5"/>
    <circle class="pd-dot pd-catch"   cx="158" cy="252" r="5"/>
    <text class="pd-text pd-load-t"    x="42"  y="264">LOAD</text>
    <text class="pd-text pd-explode-t" x="100" y="264">HOLD</text>
    <text class="pd-text pd-catch-t"   x="158" y="264">ENDURE</text>
  </g>
</svg>`,

  'plank': () => `
<svg class="stick-figure-svg anim-plank" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" data-phase="load">
  <line class="fig-ground" x1="20" y1="200" x2="180" y2="200"/>
  <!-- Plank position: horizontal body -->
  <g class="fig-root anim-plank" style="transform-origin: 100px 160px">
    <!-- head -->
    <circle class="fig-head" cx="58" cy="140" r="16"/>
    <!-- Horizontal torso -->
    <line x1="74" y1="148" x2="148" y2="170"/>
    <!-- Forearms on ground -->
    <line x1="78" y1="152" x2="72" y2="198"/>
    <line x1="90" y1="156" x2="84" y2="198"/>
    <!-- Legs -->
    <line x1="148" y1="170" x2="165" y2="197"/>
    <line x1="148" y1="170" x2="158" y2="198"/>
  </g>

  <g class="phase-indicators">
    <line class="pd-line" x1="42" y1="252" x2="100" y2="252"/>
    <line class="pd-line" x1="100" y1="252" x2="158" y2="252"/>
    <circle class="pd-dot pd-load"    cx="42"  cy="252" r="5"/>
    <circle class="pd-dot pd-explode" cx="100" cy="252" r="5"/>
    <circle class="pd-dot pd-catch"   cx="158" cy="252" r="5"/>
    <text class="pd-text pd-load-t"    x="42"  y="264">BRACE</text>
    <text class="pd-text pd-explode-t" x="100" y="264">HOLD</text>
    <text class="pd-text pd-catch-t"   x="158" y="264">ENDURE</text>
  </g>
</svg>`,

  'dead-hang': () => `
<svg class="stick-figure-svg anim-dead-hang" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" data-phase="load">
  <!-- Bar -->
  <line class="fig-prop" style="stroke-width: 6;" x1="30" y1="18" x2="170" y2="18"/>
  <!-- Vertical bar supports -->
  <line class="fig-prop" style="stroke-width: 3; opacity: 0.5;" x1="40" y1="5" x2="40" y2="20"/>
  <line class="fig-prop" style="stroke-width: 3; opacity: 0.5;" x1="160" y1="5" x2="160" y2="20"/>

  <!-- Figure hanging -->
  <g class="fig-root anim-dead-hang" style="transform-origin: 100px 40px">
    <!-- Arms up to bar -->
    <g class="fig-arm-l"><line x1="100" y1="72" x2="70" y2="20"/></g>
    <g class="fig-arm-r"><line x1="100" y1="72" x2="130" y2="20"/></g>
    <!-- Head -->
    <circle class="fig-head" cx="100" cy="90" r="18"/>
    <!-- Torso -->
    <line x1="100" y1="108" x2="100" y2="190"/>
    <!-- Legs hanging straight -->
    <g class="fig-leg-l"><line x1="100" y1="190" x2="82" y2="255"/></g>
    <g class="fig-leg-r"><line x1="100" y1="190" x2="118" y2="255"/></g>
  </g>

  <g class="phase-indicators">
    <line class="pd-line" x1="42" y1="272" x2="100" y2="272"/>
    <line class="pd-line" x1="100" y1="272" x2="158" y2="272"/>
    <circle class="pd-dot pd-load"    cx="42"  cy="272" r="5"/>
    <circle class="pd-dot pd-explode" cx="100" cy="272" r="5"/>
    <circle class="pd-dot pd-catch"   cx="158" cy="272" r="5"/>
    <text class="pd-text pd-load-t"    x="42"  y="284">GRIP</text>
    <text class="pd-text pd-explode-t" x="100" y="284">DEPRESS</text>
    <text class="pd-text pd-catch-t"   x="158" y="284">HOLD</text>
  </g>
</svg>`,

  'hurdle-hop': () => buildStickFigureSVG('hurdle-hop',
    `<!-- Hurdle -->
     <rect class="fig-prop" x="110" y="210" width="38" height="18" rx="2"/>
     <line class="fig-prop" x1="110" y1="228" x2="110" y2="230"/>
     <line class="fig-prop" x1="148" y1="228" x2="148" y2="230"/>`),

  'skater-bound': () => buildStickFigureSVG('skater-bound'),

  'sprint-start': () => buildStickFigureSVG('sprint-start'),
};

function getExerciseSVG(animKey) {
  const fn = FIGURE_SVGS[animKey];
  if (fn) return fn();
  return buildStickFigureSVG(animKey);
}

/* ════════════════════════════════════════
   MONSTER BADGE SVG GENERATORS
   All use viewBox="0 0 200 200"
   ════════════════════════════════════════ */

/* Cycle 1: Wobble — friendly lime green blob */
function buildBadge1(cycleNum = 1) {
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="badge-glow">
  <defs>
    <filter id="glow1">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Frame -->
  <circle cx="100" cy="100" r="90" fill="none" stroke="#84cc16" stroke-width="3" opacity="0.6"/>
  <circle cx="100" cy="100" r="84" fill="#0d1f0e" stroke="#84cc16" stroke-width="1.5" opacity="0.3"/>
  <!-- Body blob -->
  <ellipse cx="100" cy="108" rx="58" ry="60" fill="#1a2e0f" stroke="#84cc16" stroke-width="2.5"/>
  <!-- Nubs (tiny non-threatening bumps) -->
  <ellipse cx="76" cy="54" rx="9" ry="13" fill="#1a2e0f" stroke="#84cc16" stroke-width="2"/>
  <ellipse cx="124" cy="54" rx="9" ry="13" fill="#1a2e0f" stroke="#84cc16" stroke-width="2"/>
  <!-- Eyes (big friendly) -->
  <circle cx="80" cy="98" r="17" fill="#0a1a0a" stroke="#84cc16" stroke-width="2"/>
  <circle cx="120" cy="98" r="17" fill="#0a1a0a" stroke="#84cc16" stroke-width="2"/>
  <circle cx="80" cy="98" r="9" fill="#84cc16" opacity="0.9"/>
  <circle cx="120" cy="98" r="9" fill="#84cc16" opacity="0.9"/>
  <circle cx="80" cy="98" r="4" fill="#0a0a0a"/>
  <circle cx="120" cy="98" r="4" fill="#0a0a0a"/>
  <!-- Eye shine -->
  <circle cx="84" cy="94" r="2.5" fill="white" opacity="0.7"/>
  <circle cx="124" cy="94" r="2.5" fill="white" opacity="0.7"/>
  <!-- Smile -->
  <path d="M72 122 Q100 142 128 122" fill="none" stroke="#84cc16" stroke-width="3" stroke-linecap="round"/>
  <!-- Small teeth -->
  <line x1="92" y1="122" x2="92" y2="130" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="100" y1="124" x2="100" y2="133" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="108" y1="122" x2="108" y2="130" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cycle number -->
  <text x="100" y="178" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="800" fill="#84cc16" letter-spacing="2" opacity="0.9">CYCLE ${cycleNum}</text>
</svg>`;
}

/* Cycle 2: Fangs — amber, glowing eyes, white fangs */
function buildBadge2(cycleNum = 2) {
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="badge-glow-2">
  <defs>
    <filter id="glow2-eyes">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="amber-body" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#2d1800"/>
      <stop offset="100%" stop-color="#1a0f00"/>
    </radialGradient>
  </defs>
  <!-- Double ring frame -->
  <circle cx="100" cy="100" r="90" fill="none" stroke="#f59e0b" stroke-width="2.5" opacity="0.7"/>
  <circle cx="100" cy="100" r="83" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
  <!-- Body -->
  <ellipse cx="100" cy="108" rx="60" ry="62" fill="url(#amber-body)" stroke="#f59e0b" stroke-width="2.5"/>
  <!-- Nubs (bigger now) -->
  <ellipse cx="74" cy="52" rx="10" ry="15" fill="#1a0f00" stroke="#f59e0b" stroke-width="2.5"/>
  <ellipse cx="126" cy="52" rx="10" ry="15" fill="#1a0f00" stroke="#f59e0b" stroke-width="2.5"/>
  <!-- Eyes with glow -->
  <circle cx="78" cy="96" r="18" fill="#0d0800" stroke="#f59e0b" stroke-width="1.5" filter="url(#glow2-eyes)"/>
  <circle cx="122" cy="96" r="18" fill="#0d0800" stroke="#f59e0b" stroke-width="1.5" filter="url(#glow2-eyes)"/>
  <circle cx="78" cy="96" r="11" fill="#a3e635" opacity="0.95"/>
  <circle cx="122" cy="96" r="11" fill="#a3e635" opacity="0.95"/>
  <ellipse cx="78" cy="97" rx="5" ry="8" fill="#0a0a0a"/>
  <ellipse cx="122" cy="97" rx="5" ry="8" fill="#0a0a0a"/>
  <circle cx="82" cy="92" r="2.5" fill="white" opacity="0.8"/>
  <circle cx="126" cy="92" r="2.5" fill="white" opacity="0.8"/>
  <!-- Neutral/mean mouth line -->
  <path d="M74 122 Q100 128 126 122" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- White fangs -->
  <path d="M84 122 L80 142 L90 126" fill="#f8fafc" stroke="#f59e0b" stroke-width="1"/>
  <path d="M116 122 L120 142 L110 126" fill="#f8fafc" stroke="#f59e0b" stroke-width="1"/>
  <!-- Cycle number -->
  <text x="100" y="178" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="800" fill="#f59e0b" letter-spacing="2" opacity="0.9">CYCLE ${cycleNum}</text>
</svg>`;
}

/* Cycle 3: Berserker — red, triangular horns, armor collar, angry brows */
function buildBadge3(cycleNum = 3) {
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="badge-glow-3">
  <defs>
    <filter id="glow3-eyes">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Spiked frame polygon -->
  </defs>
  <!-- Spiked outer ring -->
  <polygon points="100,8 115,18 128,10 134,24 148,20 150,34 163,34 161,48 174,52 168,65 180,72 170,83 178,93 165,100 170,112 155,115 156,128 141,127 138,140 123,135 116,147 100,140 84,147 77,135 62,140 59,127 44,128 45,115 30,112 35,100 22,93 30,83 20,72 32,65 26,52 39,48 37,34 50,34 52,20 66,24 72,10 85,18" fill="#1a0000" stroke="#dc2626" stroke-width="2" stroke-linejoin="round"/>
  <!-- Body -->
  <ellipse cx="100" cy="110" rx="56" ry="58" fill="#1a0000" stroke="#dc2626" stroke-width="2.5"/>
  <!-- Sharp horns -->
  <polygon points="65,60 55,18 80,56" fill="#7f1d1d" stroke="#dc2626" stroke-width="1.5"/>
  <polygon points="135,60 145,18 120,56" fill="#7f1d1d" stroke="#dc2626" stroke-width="1.5"/>
  <!-- Horn highlights -->
  <line x1="65" y1="58" x2="58" y2="22" stroke="#ef4444" stroke-width="1" opacity="0.6"/>
  <line x1="135" y1="58" x2="142" y2="22" stroke="#ef4444" stroke-width="1" opacity="0.6"/>
  <!-- Angry brows -->
  <line x1="62" y1="82" x2="84" y2="90" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
  <line x1="138" y1="82" x2="116" y2="90" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
  <!-- Eyes (diamond-ish) with glow -->
  <polygon points="78,90 88,98 78,106 68,98" fill="#fb923c" filter="url(#glow3-eyes)"/>
  <polygon points="122,90 132,98 122,106 112,98" fill="#fb923c" filter="url(#glow3-eyes)"/>
  <circle cx="78" cy="98" r="4" fill="#0a0a0a"/>
  <circle cx="122" cy="98" r="4" fill="#0a0a0a"/>
  <circle cx="80" cy="95" r="2" fill="white" opacity="0.6"/>
  <circle cx="124" cy="95" r="2" fill="white" opacity="0.6"/>
  <!-- Mouth (scowl) -->
  <path d="M72 126 Q100 118 128 126" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <!-- Long sharp fangs -->
  <path d="M84 125 L78 150 L92 128" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
  <path d="M116 125 L122 150 L108 128" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
  <!-- Armor collar -->
  <path d="M55 143 Q100 135 145 143 L148 155 Q100 148 52 155 Z" fill="#374151" stroke="#6b7280" stroke-width="1.5"/>
  <!-- Rivets on armor -->
  <circle cx="70" cy="148" r="3" fill="#9ca3af"/>
  <circle cx="90" cy="145" r="3" fill="#9ca3af"/>
  <circle cx="110" cy="145" r="3" fill="#9ca3af"/>
  <circle cx="130" cy="148" r="3" fill="#9ca3af"/>
  <!-- Cycle number -->
  <text x="100" y="184" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800" fill="#ef4444" letter-spacing="2" opacity="0.9">CYCLE ${cycleNum}</text>
</svg>`;
}

/* Cycle 4: Dreadlord — purple, bat wings, 4 eyes, forked tongue */
function buildBadge4(cycleNum = 4) {
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="badge-glow-4">
  <defs>
    <filter id="glow4-eyes">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="purp-body" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#1e0a3c"/>
      <stop offset="100%" stop-color="#0d0520"/>
    </radialGradient>
  </defs>
  <!-- Bat wing left -->
  <path d="M15,80 Q22,55 38,68 Q28,85 40,105 Q28,115 30,130 Q10,120 15,80 Z" fill="#2d0f5a" stroke="#7c3aed" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="22" y1="78" x2="38" y2="105" stroke="#4c1d95" stroke-width="1"/>
  <line x1="28" y1="90" x2="40" y2="115" stroke="#4c1d95" stroke-width="1"/>
  <!-- Bat wing right -->
  <path d="M185,80 Q178,55 162,68 Q172,85 160,105 Q172,115 170,130 Q190,120 185,80 Z" fill="#2d0f5a" stroke="#7c3aed" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="178" y1="78" x2="162" y2="105" stroke="#4c1d95" stroke-width="1"/>
  <line x1="172" y1="90" x2="160" y2="115" stroke="#4c1d95" stroke-width="1"/>
  <!-- Frame -->
  <circle cx="100" cy="100" r="78" fill="url(#purp-body)" stroke="#7c3aed" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="72" fill="none" stroke="#a78bfa" stroke-width="0.8" opacity="0.3"/>
  <!-- Scale texture lines -->
  <path d="M60 80 Q100 72 140 80" fill="none" stroke="#4c1d95" stroke-width="1.5" opacity="0.5"/>
  <path d="M55 95 Q100 87 145 95" fill="none" stroke="#4c1d95" stroke-width="1.5" opacity="0.4"/>
  <path d="M58 110 Q100 102 142 110" fill="none" stroke="#4c1d95" stroke-width="1.5" opacity="0.3"/>
  <!-- 4 Eyes (2 main + 2 small inner) with glow -->
  <circle cx="74" cy="92" r="16" fill="#0d0520" stroke="#7c3aed" stroke-width="1.5"/>
  <circle cx="126" cy="92" r="16" fill="#0d0520" stroke="#7c3aed" stroke-width="1.5"/>
  <circle cx="74" cy="92" r="10" fill="#a855f7" filter="url(#glow4-eyes)" opacity="0.95"/>
  <circle cx="126" cy="92" r="10" fill="#a855f7" filter="url(#glow4-eyes)" opacity="0.95"/>
  <!-- Small inner eyes -->
  <circle cx="93" cy="86" r="7" fill="#0d0520" stroke="#7c3aed" stroke-width="1"/>
  <circle cx="107" cy="86" r="7" fill="#0d0520" stroke="#7c3aed" stroke-width="1"/>
  <circle cx="93" cy="86" r="4" fill="#c084fc" filter="url(#glow4-eyes)" opacity="0.9"/>
  <circle cx="107" cy="86" r="4" fill="#c084fc" filter="url(#glow4-eyes)" opacity="0.9"/>
  <!-- All pupils -->
  <ellipse cx="74" cy="93" rx="4" ry="7" fill="#0a0a0a"/>
  <ellipse cx="126" cy="93" rx="4" ry="7" fill="#0a0a0a"/>
  <circle cx="93" cy="87" r="2" fill="#0a0a0a"/>
  <circle cx="107" cy="87" r="2" fill="#0a0a0a"/>
  <!-- Eye shines -->
  <circle cx="78" cy="88" r="2.5" fill="white" opacity="0.7"/>
  <circle cx="130" cy="88" r="2.5" fill="white" opacity="0.7"/>
  <!-- Curved frown -->
  <path d="M70 122 Q100 114 130 122" fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
  <!-- Fangs -->
  <path d="M82 122 L77 146 L90 125" fill="#f0e6ff" stroke="#7c3aed" stroke-width="1"/>
  <path d="M118 122 L123 146 L110 125" fill="#f0e6ff" stroke="#7c3aed" stroke-width="1"/>
  <!-- Forked tongue -->
  <path d="M96 134 L100 154 L96 162" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <path d="M104 134 L100 154 L104 162" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <line x1="96" y1="134" x2="104" y2="134" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <!-- Cycle number -->
  <text x="100" y="190" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800" fill="#a78bfa" letter-spacing="2">CYCLE ${cycleNum}</text>
</svg>`;
}

/* Cycle 5+: Apex Predator — near-black, 6 eyes, massive horns, fire */
function buildBadge5(cycleNum = 5) {
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="badge-glow-5">
  <defs>
    <filter id="glow5-eyes">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="fire-blur">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <radialGradient id="apex-body" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#1a0000"/>
      <stop offset="100%" stop-color="#050505"/>
    </radialGradient>
  </defs>
  <!-- Fire/aura bg -->
  <ellipse cx="100" cy="105" rx="88" ry="90" fill="#1a0000" opacity="0.5" filter="url(#fire-blur)"/>
  <!-- Spiked frame (more spikes = more evil) -->
  <polygon points="100,5 110,14 122,8 126,19 138,16 139,28 150,28 148,40 159,43 154,55 165,60 157,71 166,78 155,85 161,94 148,97 151,108 137,108 137,120 123,116 118,127 100,120 82,127 77,116 63,120 63,108 49,108 52,97 39,94 45,85 34,78 43,71 35,60 46,55 41,43 52,40 50,28 61,28 62,16 74,19 78,8 90,14" fill="url(#apex-body)" stroke="#ef4444" stroke-width="1.5" stroke-linejoin="round"/>
  <!-- Massive curved horns -->
  <path d="M60,65 Q40,30 50,10 Q62,22 72,45 Q68,55 65,65 Z" fill="#3d0000" stroke="#ef4444" stroke-width="2"/>
  <path d="M50,12 Q55,18 62,30" fill="none" stroke="#7f1d1d" stroke-width="1.5" opacity="0.7"/>
  <path d="M140,65 Q160,30 150,10 Q138,22 128,45 Q132,55 135,65 Z" fill="#3d0000" stroke="#ef4444" stroke-width="2"/>
  <path d="M150,12 Q145,18 138,30" fill="none" stroke="#7f1d1d" stroke-width="1.5" opacity="0.7"/>
  <!-- Armor plates on face -->
  <path d="M55,80 L65,74 L75,80 L65,86 Z" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
  <path d="M125,80 L135,74 L145,80 L135,86 Z" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
  <path d="M85,64 L100,58 L115,64 L100,70 Z" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
  <!-- 6 Eyes: top row (small), bottom row (main) -->
  <!-- Top row (3 small eyes) -->
  <circle cx="72" cy="75" r="7" fill="#0d0000" stroke="#ef4444" stroke-width="1"/>
  <circle cx="100" cy="70" r="7" fill="#0d0000" stroke="#ef4444" stroke-width="1"/>
  <circle cx="128" cy="75" r="7" fill="#0d0000" stroke="#ef4444" stroke-width="1"/>
  <circle cx="72" cy="75" r="4" fill="#ef4444" filter="url(#glow5-eyes)" opacity="0.9"/>
  <circle cx="100" cy="70" r="4" fill="#ef4444" filter="url(#glow5-eyes)" opacity="0.9"/>
  <circle cx="128" cy="75" r="4" fill="#ef4444" filter="url(#glow5-eyes)" opacity="0.9"/>
  <!-- Bottom row (3 main eyes) -->
  <circle cx="72" cy="98" r="14" fill="#0d0000" stroke="#ef4444" stroke-width="1.5"/>
  <circle cx="100" cy="96" r="13" fill="#0d0000" stroke="#dc2626" stroke-width="1.5"/>
  <circle cx="128" cy="98" r="14" fill="#0d0000" stroke="#ef4444" stroke-width="1.5"/>
  <circle cx="72" cy="98" r="9" fill="#ef4444" filter="url(#glow5-eyes)"/>
  <circle cx="100" cy="96" r="8" fill="#dc2626" filter="url(#glow5-eyes)"/>
  <circle cx="128" cy="98" r="9" fill="#ef4444" filter="url(#glow5-eyes)"/>
  <!-- All pupils -->
  <ellipse cx="72" cy="99" rx="3" ry="6" fill="#000000"/>
  <ellipse cx="100" cy="97" rx="3" ry="6" fill="#000000"/>
  <ellipse cx="128" cy="99" rx="3" ry="6" fill="#000000"/>
  <circle cx="72" cy="75" r="2" fill="#000000"/>
  <circle cx="100" cy="70" r="2" fill="#000000"/>
  <circle cx="128" cy="75" r="2" fill="#000000"/>
  <!-- Mouth (jagged) -->
  <path d="M60 122 L68 116 L76 124 L84 116 L92 124 L100 116 L108 124 L116 116 L124 124 L132 116 L140 122" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Multiple fangs -->
  <path d="M72 122 L68 145 L80 124" fill="#f0e0e0" stroke="#ef4444" stroke-width="1"/>
  <path d="M90 124 L88 142 L96 126" fill="#f0e0e0" stroke="#ef4444" stroke-width="1"/>
  <path d="M110 124 L112 142 L104 126" fill="#f0e0e0" stroke="#ef4444" stroke-width="1"/>
  <path d="M128 122 L132 145 L120 124" fill="#f0e0e0" stroke="#ef4444" stroke-width="1"/>
  <!-- Forked tongue (wider) -->
  <path d="M94 136 L100 158 L94 168" fill="none" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M106 136 L100 158 L106 168" fill="none" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="94" y1="136" x2="106" y2="136" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Cycle number -->
  <text x="100" y="192" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800" fill="#ef4444" letter-spacing="2">CYCLE ${cycleNum}</text>
</svg>`;
}

/* ── Badge builder dispatcher ── */
function buildBadgeSVG(cycle) {
  const n = Math.max(1, cycle);
  if (n === 1) return buildBadge1(n);
  if (n === 2) return buildBadge2(n);
  if (n === 3) return buildBadge3(n);
  if (n === 4) return buildBadge4(n);
  return buildBadge5(n);
}

/* ── Badge display names ── */
const BADGE_INFO = [
  null, // index 0 unused
  { name: 'Wobble',        subtitle: 'Friendly but mean — you\'ve started something.' },
  { name: 'Fangs',         subtitle: 'Getting serious. The creature within grows.' },
  { name: 'Berserker',     subtitle: 'Horns out. No holding back now.' },
  { name: 'Dreadlord',     subtitle: 'Fear it. Four eyes and wings to match your power.' },
  { name: 'Apex Predator', subtitle: 'Full demon energy. The apex of reactive training.' },
];

function getBadgeInfo(cycle) {
  return BADGE_INFO[Math.min(cycle, BADGE_INFO.length - 1)] || BADGE_INFO[BADGE_INFO.length - 1];
}

/* ════════════════════════════════════════
   CELEBRATION
   ════════════════════════════════════════ */

function showBadgeCelebration(cycle, onDismiss) {
  const overlay = document.getElementById('badge-celebration');
  const badgeEl = document.getElementById('celebration-badge-svg');
  const subtitleEl = document.getElementById('celebration-subtitle');
  const dismissBtn = document.getElementById('celebration-dismiss');
  if (!overlay) return;

  const info = getBadgeInfo(cycle);
  badgeEl.innerHTML = buildBadgeSVG(cycle);
  subtitleEl.textContent = info ? info.subtitle : '';

  // Generate particles
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    particlesEl.innerHTML = '';
    const colors = ['#8b5cf6','#ec4899','#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle = Math.random() * 360;
      const dist = 100 + Math.random() * 250;
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 600;
      const size = 6 + Math.random() * 8;
      p.style.cssText = `
        left: 50%; top: 50%;
        width: ${size}px; height: ${size}px;
        background: ${color};
        --dx: ${dx}px; --dy: ${dy}px;
        animation-delay: ${delay}ms;
        animation-duration: ${1200 + Math.random() * 600}ms;
      `;
      particlesEl.appendChild(p);
    }
  }

  overlay.classList.remove('hidden');

  const dismiss = () => {
    overlay.classList.add('hidden');
    if (onDismiss) onDismiss();
  };

  dismissBtn.onclick = dismiss;

  // Also allow clicking overlay to dismiss (after delay)
  setTimeout(() => {
    overlay.addEventListener('click', function handler(e) {
      if (e.target === overlay) { dismiss(); overlay.removeEventListener('click', handler); }
    });
  }, 2000);
}
