import { CSS } from './style.js';
import { news, guides, classes, races, polls, LAUNCH_UTC, RAIDS_DATE } from './content.js';
import { TALENT_TREES, greedyAllocate, BUILD_PLAN, FOREVER_CHANGES } from './talents.js';

// ---------- pomocné ----------
const MES = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
const skDate = (iso) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d}. ${MES[m - 1]} ${y}`; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const truncate = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).trimEnd() + '…');
const classBySlug = Object.fromEntries(classes.map((c) => [c.slug, c]));

const FACTIONS = { A: 'Aliancia', H: 'Horda' };
const REALMS = ['Normal', 'PvP', 'RP', 'Hardcore'];
const FOCUS = ['PvE raidy', 'PvP', 'RP', 'Casual / social', 'Hardcore', 'Levelovanie'];
const LANGS = ['SK', 'CZ', 'SK + CZ'];

const LOGO = `<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><circle cx="21" cy="10" r="6" fill="#E2AE4C"/><circle cx="23.5" cy="8.5" r="5" fill="#0F1528"/><path d="M2 28 L11 13 L16 20 L20 15 L30 28 Z" fill="#6A9BEB" opacity=".9"/><path d="M11 13 L13.5 17 L11.5 16.2 L9.6 18 Z" fill="#E8E2D3"/></svg>`;
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0F1528"/><circle cx="21" cy="10" r="6" fill="#E2AE4C"/><circle cx="23.5" cy="8.5" r="5" fill="#0F1528"/><path d="M2 28 L11 13 L16 20 L20 15 L30 28 Z" fill="#6A9BEB"/></svg>`);

// ---------- ikony ----------
const svg = (inner, size = 18, extra = '') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" ${extra}>${inner}</svg>`;
const S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

const NAV_ICON = {
  novinky: svg(`<rect x="3" y="5" width="14" height="16" rx="1" ${S}/><line x1="7" y1="9" x2="13" y2="9" ${S}/><line x1="7" y1="13" x2="13" y2="13" ${S}/><line x1="7" y1="17" x2="11" y2="17" ${S}/><path d="M17 8h3a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2h-2" ${S}/>`, 21),
  navody: svg(`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" ${S}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" ${S}/>`, 21),
  triedy: svg(`<path d="M12 2 20 5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" ${S}/>`, 21),
  rasy: svg(`<circle cx="9" cy="8" r="3.2" ${S}/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" ${S}/><circle cx="17" cy="9" r="2.6" ${S}/><path d="M15.5 14.3c2.6.3 4.5 2.6 4.5 5.7" ${S}/>`, 21),
  guildy: svg(`<path d="M5 21V4" ${S}/><path d="M5 4l13 3-13 3" ${S}/>`, 21),
  'o-nas': svg(`<circle cx="12" cy="12" r="9" ${S}/><line x1="12" y1="11" x2="12" y2="16" ${S}/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/>`, 21),
  edicie: svg(`<path d="M12 2 21 11l-9.5 9.5a1.5 1.5 0 0 1-2.1 0L3 14.1a1.5 1.5 0 0 1 0-2.1z" ${S}/><circle cx="16" cy="7" r="1.6" fill="currentColor"/>`, 21),
  faq: svg(`<circle cx="12" cy="12" r="9" ${S}/><path d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.2.9-1.2 1.8" ${S}/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>`, 21),
  guilda: svg(`<path d="M12 2.5 14 8l5.8.5-4.4 3.8L16.8 18 12 14.8 7.2 18l1.4-5.7L4.2 8.5 10 8z" ${S}/>`, 21),
  ankety: svg(`<path d="M5 19V10M12 19V5M19 19v-7" ${S}/><path d="M3 19h18" ${S}/>`, 21),
  talenty: svg(`<path d="M12 3v18M12 3 7 8M12 3l5 5" ${S}/><circle cx="12" cy="15" r="4" ${S}/>`, 21),
  buildy: svg(`<path d="M4 19h16" ${S}/><rect x="5" y="12" width="4" height="7" ${S}/><rect x="10" y="7" width="4" height="12" ${S}/><rect x="15" y="10" width="4" height="9" ${S}/>`, 21),
};

const GUIDE_ICON = {
  'ako-zacat': svg(`<path d="M5 3v18l15-9z" fill="currentColor" stroke="none"/>`, 20),
  'forever-vs-classic': svg(`<path d="M12 3v18M4 7l-2.5 5a3 3 0 0 0 5.5 0zM20 7l-2.5 5a3 3 0 0 0 5.5 0zM4 7h16M8 21h8" ${S}/>`, 20),
  'edicie-a-ceny': svg(`<circle cx="9" cy="9" r="6.5" ${S}/><circle cx="15" cy="15" r="6.5" ${S}/>`, 20),
  'novy-obsah': svg(`<path d="M9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5 9 3z" ${S}/><path d="M9 3v15M15 5.5v15" ${S}/>`, 20),
  faq: NAV_ICON.faq,
};
const guideIcon = (slug) => GUIDE_ICON[slug] || svg(`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" ${S}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" ${S}/>`, 20);

// Polished badge-style class icons: a ringed medallion (shared backdrop) around an original
// thematic glyph per class — richer silhouettes than plain line art, still hand-drawn SVG paths.
const badge = (glyph, size = 24) => svg(`<circle cx="12" cy="12" r="10.6" fill="currentColor" opacity=".07"/><circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".5"/>${glyph}`, size);
const CLASS_ICON = {
  warrior: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M7.2 4.6 11 8.4 8.6 10.8 4.8 7z" fill="currentColor" stroke="none"/>
    <line x1="8.6" y1="10.8" x2="16.5" y2="18.7" ${S} stroke-width="2"/>
    <path d="M16.8 4.6 13 8.4 15.4 10.8 19.2 7z" fill="currentColor" stroke="none" opacity=".85"/>
    <line x1="15.4" y1="10.8" x2="7.5" y2="18.7" ${S} stroke-width="2" opacity=".85"/>
    <circle cx="12" cy="13.8" r="1.1" fill="currentColor" stroke="none"/>
  </g>`),
  paladin: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3.4v2.6M8.4 5.3l1.6 2M15.6 5.3l-1.6 2" ${S}/>
    <rect x="7.6" y="7.2" width="8.8" height="4.6" rx="1" fill="currentColor" stroke="none"/>
    <line x1="12" y1="11.8" x2="12" y2="20" ${S} stroke-width="2.1"/>
  </g>`),
  hunter: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M6.3 4C5.5 9 5.5 15 6.3 20" ${S}/>
    <path d="M6.3 4c5 1.8 7.4 6 7.4 8s-2.4 6.2-7.4 8" ${S}/>
    <line x1="6.3" y1="12" x2="18.5" y2="12" ${S}/>
    <path d="M16 9.3 19.3 12 16 14.7z" fill="currentColor" stroke="none"/>
  </g>`),
  rogue: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <line x1="5.2" y1="18.5" x2="13.8" y2="6.3" ${S} stroke-width="1.8"/>
    <path d="M11.6 5 15.6 4l1 4-2.9 1.6-2.4-2z" fill="currentColor" stroke="none"/>
    <path d="M5.2 18.5 7 16.3" ${S} stroke-width="1.8"/>
    <line x1="18.8" y1="18.5" x2="10.2" y2="6.3" ${S} stroke-width="1.8" opacity=".85"/>
    <path d="M12.4 5 8.4 4l-1 4 2.9 1.6 2.4-2z" fill="currentColor" stroke="none" opacity=".85"/>
    <path d="M18.8 18.5 17 16.3" ${S} stroke-width="1.8" opacity=".85"/>
  </g>`),
  priest: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5.6" fill="currentColor" opacity=".12"/>
    <path d="M12 4.8v3.4M12 15.8v3.4M4.8 12h3.4M15.8 12h3.4M6.9 6.9l2.4 2.4M14.7 14.7l2.4 2.4M17.1 6.9l-2.4 2.4M9.3 14.7l-2.4 2.4" ${S}/>
    <circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none"/>
  </g>`),
  shaman: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.4 3.6 7 13h4.3l-1.1 7.4L17.2 11h-4.3z" fill="currentColor" stroke="none"/>
    <path d="M6 19.4c1.6-1 4-1 6 0 2-1 4.4-1 6 0" ${S} opacity=".6"/>
  </g>`),
  mage: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="7.6" ${S} opacity=".45"/>
    <path d="M12 5.5 13.6 10.4 18.5 12 13.6 13.6 12 18.5 10.4 13.6 5.5 12 10.4 10.4z" fill="currentColor" stroke="none"/>
  </g>`),
  warlock: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 4c2.3 2.8-.8 3.8-.8 6.5a2.8 2.8 0 1 0 5.6 0c0-1-.5-1.8-1-2.6 2 1.6 3.5 4 3.5 6.7a7.3 7.3 0 1 1-14.6 0C4.7 10 8 7 12 4z" fill="currentColor" stroke="none"/>
    <path d="M9.4 15.6q2.6 2 5.2 0" ${S} opacity=".6"/>
  </g>`),
  druid: badge(`<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.3 14.1A8.4 8.4 0 1 1 10.3 4.1a6.5 6.5 0 0 0 10 10z" fill="currentColor" stroke="none"/>
  </g>`),
};

// Vlastné originálne ikony pre vetvy talentovej kalkulačky (jedna na tematický kľúč, zdieľaná naprieč triedami).
const TREE_ICON = {
  sword: svg(`<line x1="5" y1="19" x2="17" y2="7" ${S}/><path d="M13 5l6 6" ${S}/><line x1="4" y1="20" x2="6" y2="18" ${S}/>`, 20),
  'flame-fist': svg(`<path d="M12 3c2 3-1 4-1 7a3 3 0 1 0 6 0c0-1-.5-2-1-3 2 1.5 4 4.3 4 7.5a7 7 0 1 1-14 0C6 9 9 7 12 3z" fill="currentColor" stroke="none"/>`, 20),
  shield: svg(`<path d="M12 3 20 6v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" ${S}/>`, 20),
  sunburst: svg(`<circle cx="12" cy="12" r="4" ${S}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17 17l2 2M19 4.9l-2 2M6.9 17l-2 2" ${S}/>`, 20),
  warhammer: svg(`<rect x="7" y="4" width="10" height="6" rx="1" ${S}/><line x1="12" y1="10" x2="12" y2="21" ${S}/>`, 20),
  paw: svg(`<circle cx="12" cy="15" r="4" ${S}/><circle cx="6" cy="9" r="2" ${S}/><circle cx="18" cy="9" r="2" ${S}/><circle cx="9.3" cy="5.3" r="1.8" ${S}/><circle cx="14.7" cy="5.3" r="1.8" ${S}/>`, 20),
  bow: svg(`<path d="M6 3c0 7 0 11 0 18" ${S}/><path d="M6 3c7 2 9 7 9 9s-2 7-9 9" ${S}/><line x1="6" y1="12" x2="19" y2="12" ${S}/>`, 20),
  trap: svg(`<circle cx="12" cy="12" r="8" ${S}/><path d="M6.5 7.5l11 11M17.5 7.5l-11 11" ${S}/>`, 20),
  'dagger-drip': svg(`<line x1="12" y1="2" x2="12" y2="16" ${S}/><line x1="8" y1="5" x2="16" y2="5" ${S}/><path d="M12 16l-2 3 2 3 2-3z" fill="currentColor" stroke="none"/>`, 20),
  'twin-blades': svg(`<line x1="4" y1="20" x2="14" y2="4" ${S}/><line x1="20" y1="20" x2="10" y2="4" ${S}/>`, 20),
  mask: svg(`<path d="M4 9c0-4 4-6 8-6s8 2 8 6-3 11-8 11-8-7-8-11z" ${S}/><circle cx="9" cy="10" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.3" fill="currentColor" stroke="none"/>`, 20),
  'warding-cross': svg(`<path d="M12 2v20M4 9h16" ${S}/><circle cx="12" cy="12" r="9" ${S}/>`, 20),
  'crescent-eye': svg(`<path d="M15 3a9 9 0 1 0 6 15 7 7 0 0 1-6-15z" fill="currentColor" stroke="none"/>`, 20),
  lightning: svg(`<path d="M13 2 4 14h6l-1 8 10-13h-7l1-7z" fill="currentColor" stroke="none"/>`, 20),
  'fist-spark': svg(`<path d="M8 13V9a4 4 0 0 1 8 0v4" ${S}/><path d="M5 13h14l-1 4a4 4 0 0 1-4 3h-4a4 4 0 0 1-4-3z" ${S}/>`, 20),
  droplet: svg(`<path d="M12 3c4 5 7 9 7 12.5a7 7 0 1 1-14 0C5 12 8 8 12 3z" ${S}/>`, 20),
  'star-burst': svg(`<path d="M12 2l2.2 7.3L21 11l-6.8 1.7L12 20l-2.2-7.3L3 11l6.8-1.7z" fill="currentColor" stroke="none"/>`, 20),
  flame: svg(`<path d="M12 2c2 3-1 4-1 7a3 3 0 1 0 6 0c0-1-.5-2-1-3 2 1.5 4 4.3 4 7.5a7 7 0 1 1-14 0C6 9 9 7 12 2z" fill="currentColor" stroke="none"/>`, 20),
  snowflake: svg(`<path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" ${S}/>`, 20),
  'skull-wisp': svg(`<circle cx="12" cy="10" r="7" ${S}/><path d="M9 10h.01M15 10h.01" ${S}/><path d="M9 15c1 1 2 1 3 1s2 0 3-1" ${S}/><line x1="12" y1="17" x2="12" y2="21" ${S}/>`, 20),
  'demon-horns': svg(`<path d="M12 11c-2-5-7-7-9-6 1 3 3 5 6 6M12 11c2-5 7-7 9-6-1 3-3 5-6 6" ${S}/><circle cx="12" cy="14" r="5" ${S}/>`, 20),
  fireball: svg(`<circle cx="12" cy="13" r="6" fill="currentColor" stroke="none"/><path d="M12 2c1 3-1 4-1 6" ${S}/>`, 20),
  'moon-sun': svg(`<circle cx="9" cy="12" r="6" ${S}/><path d="M17 7a5 5 0 1 0 0 10 6 6 0 0 1 0-10z" fill="currentColor" stroke="none"/>`, 20),
  claw: svg(`<path d="M5 20 11 6M10 20 15 6M15 20 19 8" ${S}/>`, 20),
};

const ROLE_ICON = {
  Tank: svg(`<path d="M12 2 19 4.6v5.6c0 4.6-3.2 7.9-7 9.3-3.8-1.4-7-4.7-7-9.3V4.6z" ${S}/>`, 15),
  Heal: svg(`<circle cx="12" cy="12" r="8.5" ${S}/><line x1="12" y1="8" x2="12" y2="16" ${S}/><line x1="8" y1="12" x2="16" y2="12" ${S}/>`, 15),
  DPS: svg(`<g transform="rotate(45 12 12)"><line x1="12" y1="3" x2="12" y2="15" ${S}/><line x1="9" y1="15" x2="15" y2="15" ${S}/><line x1="12" y1="15" x2="12" y2="19" ${S}/></g>`, 15),
};
const roleIcons = (roles) => roles.map((r) => `<span class="role"><span class="ic">${ROLE_ICON[r] || ''}</span>${r}</span>`).join('');

// ---------- zdieľanie ----------
const SHARE_ICON = {
  x: svg(`<path d="M4 4l16 16M20 4L4 20" ${S}/>`, 16),
  facebook: svg(`<path d="M14.5 21v-7.8h2.7l.4-3.2h-3.1V8c0-.9.3-1.6 1.7-1.6h1.6V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.4H8.3v3.2h2.9V21h3.3z" fill="currentColor" stroke="none"/>`, 16),
  discord: svg(`<path d="M5 8.5c0-2.3 3-4 7-4s7 1.7 7 4c0 3-1.5 9.5-2.3 10.5-.6.8-3.2 1.3-4.7.3M5 8.5c0 3 1.5 9.5 2.3 10.5.6.8 3.2 1.3 4.7.3" ${S}/><circle cx="9.3" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.7" cy="11.5" r="1.1" fill="currentColor" stroke="none"/>`, 16),
};
function shareButtons(url, title) {
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  return `<div class="share-row"><span class="share-label">Zdieľať:</span><a class="share-btn" href="${tw}" target="_blank" rel="noopener" aria-label="Zdieľať na X">${SHARE_ICON.x}</a><a class="share-btn" href="${fb}" target="_blank" rel="noopener" aria-label="Zdieľať na Facebooku">${SHARE_ICON.facebook}</a></div>`;
}

const FACTION_ICON = {
  A: svg(`<path d="M12 2 20 5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" ${S}/><path d="M9 13c1-3 1-6 0-8M15 13c-1-3-1-6 0-8" ${S}/>`, 14),
  H: svg(`<path d="M5 4l6 8-6 8M19 4l-6 8 6 8" ${S}/>`, 14),
};

const MENU = svg(`<line x1="3" y1="6" x2="21" y2="6" ${S}/><line x1="3" y1="12" x2="21" y2="12" ${S}/><line x1="3" y1="18" x2="21" y2="18" ${S}/>`, 22);

// ---------- dekoratívna grafika (pôvodná, inšpirovaná fantasy settingom) ----------
function heroArt() {
  return `<svg viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0A0E1F"/><stop offset="42%" stop-color="#171F3E"/><stop offset="68%" stop-color="#3C2E52"/><stop offset="85%" stop-color="#6B4A3A"/><stop offset="100%" stop-color="#2A1B14"/></linearGradient>
  <radialGradient id="sunglow" cx="50%" cy="100%" r="70%"><stop offset="0%" stop-color="#F0CB82" stop-opacity=".45"/><stop offset="100%" stop-color="#F0CB82" stop-opacity="0"/></radialGradient>
  <radialGradient id="moonglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F0CB82" stop-opacity=".6"/><stop offset="100%" stop-color="#F0CB82" stop-opacity="0"/></radialGradient>
  <radialGradient id="treeglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#7FB4F2" stop-opacity=".65"/><stop offset="100%" stop-color="#7FB4F2" stop-opacity="0"/></radialGradient>
  <radialGradient id="fog" cx="50%" cy="100%" r="80%"><stop offset="0%" stop-color="#0A0E1F" stop-opacity=".85"/><stop offset="100%" stop-color="#0A0E1F" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="460" fill="url(#sky)"/>
<ellipse cx="600" cy="400" rx="700" ry="220" fill="url(#sunglow)"/>
<circle cx="965" cy="90" r="100" fill="url(#moonglow)"/>
<circle cx="965" cy="90" r="34" fill="#F3E6C4"/>
<circle cx="954" cy="80" r="6" fill="#D8C491" opacity=".5"/><circle cx="978" cy="102" r="4" fill="#D8C491" opacity=".4"/>
${[[90,60,.9],[180,110,.6],[260,50,.7],[340,140,.5],[420,80,.8],[520,40,.6],[610,100,.4],[700,35,.7],[790,150,.5],[850,55,.9],[1080,70,.6],[1140,130,.5],[60,190,.4],[300,25,.5],[1100,25,.7]].map(([x,y,o])=>`<circle cx="${x}" cy="${y}" r="${1+o}" fill="#fff" opacity="${o*.8}"/>`).join('')}
<path d="M0 260 L70 200 140 250 230 160 320 240 410 190 520 260 610 210 720 270 830 200 930 260 1030 210 1120 250 1200 220 1200 460 0 460 Z" fill="#0D0A1C"/>
<path d="M0 260 L70 200 140 250 230 160 320 240 410 190 520 260 610 210 720 270 830 200 930 260 1030 210 1120 250 1200 220" fill="none" stroke="#5B4030" stroke-width="2" opacity=".55"/>
<g>
  <path d="M470 260 L520 95 575 215 615 140 665 260 Z" fill="#160F28"/>
  <path d="M520 95 L537 132 572 115 548 152 572 215 537 170 520 182 Z" fill="#F0CB82" opacity=".85"/>
  <path d="M470 260 L520 95 575 215 615 140 665 260" fill="none" stroke="#8A6A3E" stroke-width="1.5" opacity=".5"/>
  <ellipse cx="540" cy="95" rx="78" ry="46" fill="url(#treeglow)"/>
  <path d="M540 95 C522 95 511 108 515 123 C493 130 491 156 513 163 C506 178 522 193 542 187 C557 200 582 193 582 174 C602 171 604 147 584 139 C591 121 573 104 553 110 C551 99 547 95 540 95Z" fill="#0C0F22" stroke="#7FB4F2" stroke-width="1.3" opacity=".95"/>
  <line x1="540" y1="187" x2="540" y2="260" stroke="#0C0F22" stroke-width="8"/>
  <line x1="540" y1="187" x2="540" y2="260" stroke="#7FB4F2" stroke-width="1" opacity=".3"/>
</g>
<path d="M0 320 L90 275 190 330 280 285 390 340 480 295 590 340 690 285 800 340 900 295 1000 340 1100 295 1200 325 1200 460 0 460 Z" fill="#171029" opacity=".92"/>
<rect width="1200" height="460" fill="url(#fog)"/>
</svg>`;
}

// Hlavný znak webu — pôvodný medailón (mesiac nad horami), nie je prevzatý z Blizzardu.
function crestBadge() {
  return `<svg width="168" height="168" viewBox="0 0 120 120" aria-hidden="true">
<defs>
  <radialGradient id="crestGlow" cx="50%" cy="38%" r="62%"><stop offset="0%" stop-color="#E2AE4C" stop-opacity=".38"/><stop offset="100%" stop-color="#E2AE4C" stop-opacity="0"/></radialGradient>
  <linearGradient id="crestRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F0CB82"/><stop offset="100%" stop-color="#A9802F"/></linearGradient>
  <clipPath id="crestClip"><circle cx="60" cy="60" r="50"/></clipPath>
</defs>
<circle cx="60" cy="60" r="58" fill="url(#crestGlow)"/>
<g clip-path="url(#crestClip)">
  <circle cx="60" cy="60" r="50" fill="#121833"/>
  <circle cx="68" cy="40" r="20" fill="#F3E6C4"/>
  <circle cx="74" cy="35" r="16.5" fill="#121833"/>
  <circle cx="40" cy="26" r="1.4" fill="#F3E6C4" opacity=".7"/><circle cx="90" cy="20" r="1" fill="#F3E6C4" opacity=".6"/><circle cx="98" cy="46" r="1.2" fill="#F3E6C4" opacity=".6"/>
  <path d="M8 96 L34 48 50 72 66 54 84 66 112 96Z" fill="#6A9BEB"/>
  <path d="M34 48 L40 58 36 56 30 64Z" fill="#E8E2D3" opacity=".9"/>
  <path d="M66 54 L71 62 68 60.5 63 66Z" fill="#E8E2D3" opacity=".75"/>
</g>
<circle cx="60" cy="60" r="50" fill="none" stroke="url(#crestRim)" stroke-width="2.4"/>
<circle cx="60" cy="60" r="44.5" fill="none" stroke="#E2AE4C" stroke-width="1" opacity=".4"/>
<g fill="#E2AE4C"><circle cx="60" cy="7.5" r="2.3"/><circle cx="60" cy="112.5" r="2.3"/><circle cx="7.5" cy="60" r="2.3"/><circle cx="112.5" cy="60" r="2.3"/></g>
</svg>`;
}

const DIVIDER = svg(`<path d="M2 12 L9 12" ${S}/><path d="M23 12 L16 12" ${S}/><path d="M12 7 L15 12 12 17 9 12Z" fill="currentColor" stroke="none"/>`, 24, 'class="ornament"');

// ---------- SEO: zdieľací obrázok (Open Graph / Twitter), schema.org dáta ----------
// 1200x630 karta v štýle webu (ten istý medailón ako v hero), žiadne cudzie assety.
function ogImage() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="ogBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#171E3C"/><stop offset="100%" stop-color="#0B0F1E"/></linearGradient>
  <radialGradient id="ogGlow" cx="50%" cy="28%" r="55%"><stop offset="0%" stop-color="#E2AE4C" stop-opacity=".3"/><stop offset="100%" stop-color="#E2AE4C" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#ogBg)"/>
<rect width="1200" height="630" fill="url(#ogGlow)"/>
<circle cx="1010" cy="110" r="90" fill="#F3E6C4" opacity=".92"/><circle cx="1038" cy="96" r="74" fill="#0B0F1E"/>
<path d="M0 470 L130 410 280 470 420 400 580 470 720 400 880 470 1030 410 1200 450 1200 630 0 630 Z" fill="#171029" opacity=".92"/>
<g transform="translate(500,46) scale(1.19)">${crestBadge()}</g>
<text x="600" y="430" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="72" fill="#F3E6C4">WoW <tspan fill="#E2AE4C">Forever</tspan></text>
<text x="600" y="480" text-anchor="middle" font-family="Georgia,serif" font-size="27" letter-spacing="2" fill="#9AA3C2">WORLD OF WARCRAFT: FOREVER PO SLOVENSKY</text>
</svg>`;
}

// Základná identita webu pre vyhľadávače (zobrazí sa na každej indexovanej stránke).
function siteJsonLd(origin) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WoW Forever SK',
    alternateName: 'WoW Forever SK – World of Warcraft: Forever po slovensky',
    url: origin,
    inLanguage: 'sk',
    description: 'Slovenský fanúšikovský web o World of Warcraft: Forever — novinky, návody, class, rasy a adresár CZ/SK guild.',
    publisher: { '@type': 'Organization', name: 'WoW Forever SK', url: origin, logo: `${origin}/og.svg` },
  })}</script>`;
}

// Breadcrumby sa odvodia z cesty; detailné stránky (novinky/návody/class) dostanú nadradenú sekciu.
const BREADCRUMB_PARENTS = [
  ['/novinky/', '/novinky', 'Novinky'],
  ['/navody/', '/navody', 'Návody'],
  ['/triedy/', '/triedy', 'Class'],
];
function breadcrumbJsonLd(path, title, origin) {
  if (!title) return '';
  const crumbs = [{ name: 'Domov', url: `${origin}/` }];
  const parent = BREADCRUMB_PARENTS.find(([prefix, parentPath]) => path.startsWith(prefix) && path !== parentPath);
  if (parent) crumbs.push({ name: parent[2], url: `${origin}${parent[1]}` });
  crumbs.push({ name: title, url: `${origin}${path}` });
  const itemListElement = crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url }));
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement })}</script>`;
}

function newsArticleJsonLd(n, origin) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    description: n.perex,
    datePublished: n.date,
    dateModified: n.date,
    inLanguage: 'sk',
    image: [`${origin}/og.svg`],
    author: { '@type': 'Organization', name: 'WoW Forever SK' },
    publisher: { '@type': 'Organization', name: 'WoW Forever SK', logo: { '@type': 'ImageObject', url: `${origin}/og.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${origin}/novinky/${n.slug}` },
  })}</script>`;
}

// FAQ návod má formát <h2>otázka</h2><p>odpoveď</p> — vytiahne páry na FAQPage schému.
function faqJsonLd(body) {
  const qas = [...body.matchAll(/<h2>(.*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/g)].map(([, q, a]) => ({
    '@type': 'Question',
    name: q.replace(/<[^>]+>/g, ''),
    acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') },
  }));
  if (!qas.length) return '';
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qas })}</script>`;
}

function itemListJsonLd(items, origin, pathPrefix) {
  const sep = pathPrefix.endsWith('#') ? '' : '/';
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: `${origin}${pathPrefix}${sep}${it.slug}` })),
  })}</script>`;
}

// Samostatná ilustrácia pre fixné pozadie: veža na útese, polár. žiara, drak na oblohe.
function worldArt() {
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090A18"/><stop offset="38%" stop-color="#121433"/><stop offset="70%" stop-color="#1B2048"/><stop offset="100%" stop-color="#232A52"/></linearGradient>
  <linearGradient id="auroraA" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#7FE3C0" stop-opacity="0"/><stop offset="50%" stop-color="#7FE3C0" stop-opacity=".40"/><stop offset="100%" stop-color="#7FE3C0" stop-opacity="0"/></linearGradient>
  <linearGradient id="auroraB" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#B98CE6" stop-opacity="0"/><stop offset="50%" stop-color="#B98CE6" stop-opacity=".32"/><stop offset="100%" stop-color="#B98CE6" stop-opacity="0"/></linearGradient>
  <linearGradient id="auroraC" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#E2AE4C" stop-opacity="0"/><stop offset="50%" stop-color="#E2AE4C" stop-opacity=".22"/><stop offset="100%" stop-color="#E2AE4C" stop-opacity="0"/></linearGradient>
  <radialGradient id="wmoon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F0CB82" stop-opacity=".55"/><stop offset="100%" stop-color="#F0CB82" stop-opacity="0"/></radialGradient>
  <linearGradient id="far3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1B2142"/><stop offset="100%" stop-color="#141A36"/></linearGradient>
  <linearGradient id="far2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#141A36"/><stop offset="100%" stop-color="#0E1329"/></linearGradient>
  <linearGradient id="far1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0C0F22"/><stop offset="100%" stop-color="#080A18"/></linearGradient>
  <radialGradient id="wfog" cx="50%" cy="100%" r="85%"><stop offset="0%" stop-color="#090A18" stop-opacity=".92"/><stop offset="100%" stop-color="#090A18" stop-opacity="0"/></radialGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect width="1600" height="900" fill="url(#wsky)"/>
<g filter="url(#soft)">
  <path d="M250 190 C 450 110, 650 230, 850 150 S 1250 110, 1500 210" fill="none" stroke="url(#auroraA)" stroke-width="85" stroke-linecap="round"/>
  <path d="M220 260 C 430 320, 650 180, 880 260 S 1280 320, 1480 240" fill="none" stroke="url(#auroraB)" stroke-width="70" stroke-linecap="round"/>
  <path d="M300 130 C 480 170, 700 90, 920 140 S 1300 150, 1450 110" fill="none" stroke="url(#auroraC)" stroke-width="60" stroke-linecap="round"/>
</g>
<circle cx="800" cy="150" r="140" fill="url(#wmoon)"/>
<circle cx="800" cy="150" r="50" fill="#F3E6C4"/>
<circle cx="782" cy="134" r="9" fill="#DCC697" opacity=".5"/><circle cx="818" cy="166" r="6" fill="#DCC697" opacity=".42"/><circle cx="815" cy="130" r="4" fill="#DCC697" opacity=".38"/>
${[[90,70,.8],[180,150,.5],[280,90,.7],[380,200,.4],[480,60,.6],[600,220,.5],[680,70,.8],[920,220,.5],[1020,80,.7],[1120,170,.4],[1220,60,.8],[1320,210,.5],[1420,100,.7],[1520,180,.4],[60,260,.5],[1550,280,.5],[950,60,.6],[1090,40,.5]].map(([x,y,o])=>`<circle cx="${x}" cy="${y}" r="${1+o*1.2}" fill="#fff" opacity="${o*.85}"/>`).join('')}
<line x1="560" y1="80" x2="700" y2="150" stroke="#F0E2BE" stroke-width="2" opacity=".75"/>
<line x1="700" y1="150" x2="690" y2="141" stroke="#F0E2BE" stroke-width="2" opacity=".45"/>
<g opacity=".5" fill="#0A0D1E">
  <path d="M520 230 Q560 205 600 230 Q635 212 670 234 Q690 224 710 236 L710 260 Q640 244 580 258 Q545 248 520 258 Z"/>
</g>
<g transform="translate(980 190) scale(1.1)" opacity=".75" fill="#0A0D1E">
  <path d="M0 10 C 40 -16, 90 -14, 140 14 C 110 8, 90 20, 70 16 C 50 24, 26 10, 0 10 Z"/>
</g>
<path d="M0 430 L120 360 240 420 360 330 480 410 600 350 720 430 840 360 960 420 1080 340 1200 420 1320 360 1440 410 1600 370 1600 900 0 900 Z" fill="url(#far3)"/>
<path d="M0 500 L140 440 260 495 400 420 540 490 660 430 800 500 940 430 1080 495 1220 430 1360 490 1500 440 1600 480 1600 900 0 900 Z" fill="url(#far2)" opacity=".92"/>
<g>
  <path d="M750 500 L800 300 835 420 860 360 900 500 Z" fill="url(#far1)"/>
  <path d="M800 300 L812 335 835 325 820 352 835 420 Z" fill="#8A6A3E" opacity=".55"/>
  <rect x="788" y="330" width="26" height="100" fill="#07091A"/>
  <rect x="792" y="350" width="18" height="60" fill="#0A0D1E" stroke="#5B4030" stroke-width="1" opacity=".6"/>
  <rect x="796" y="362" width="4" height="7" fill="#E2AE4C" opacity=".85"/>
  <rect x="804" y="380" width="4" height="7" fill="#E2AE4C" opacity=".6"/>
  <path d="M782 330 L801 296 820 330 Z" fill="#07091A"/>
  <rect x="799" y="280" width="4" height="20" fill="#07091A"/>
</g>
<path d="M0 560 L150 505 280 555 420 495 560 550 700 500 840 555 980 495 1120 550 1260 500 1400 545 1600 520 1600 900 0 900 Z" fill="url(#far1)"/>
<rect width="1600" height="900" fill="url(#wfog)"/>
</svg>`;
}

const CREST = svg(`<path d="M16 2 28 7v9c0 9-5 14.5-12 17-7-2.5-12-8-12-17V7z" ${S}/><path d="M16 9v16M10 14l12 6M22 14l-12 6" stroke="currentColor" stroke-width="1.1" opacity=".55" fill="none"/><circle cx="16" cy="14" r="3" fill="currentColor"/>`, 30, 'class="crest"');
const CAL_ICON = svg(`<rect x="3" y="4.5" width="18" height="16" rx="2.5" ${S}/><line x1="3" y1="9.5" x2="21" y2="9.5" ${S}/><line x1="7" y1="2.5" x2="7" y2="6.5" ${S}/><line x1="17" y1="2.5" x2="17" y2="6.5" ${S}/>`, 17);
const GUILD_ICON = svg(`<path d="M5 21V4" ${S}/><path d="M5 4l13 3-13 3" ${S}/>`, 26);

const POLL_OPT_ICON = {
  pve: svg(`<path d="M12 2 20 5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" ${S}/>`, 18),
  pvp: svg(`<path d="M3 21 15 9M21 3 9 15" ${S}/><path d="M3 3l3 3M21 21l-3-3" ${S}/>`, 18),
  rp: svg(`<path d="M3 5.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9.5L5 19v-3.5H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" ${S}/>`, 18),
  casual: svg(`<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor" stroke="none"/>`, 18),
  hardcore: svg(`<circle cx="12" cy="9.5" r="6" ${S}/><path d="M9 15 8 21h2l.5-2h3l.5 2h2l-1-6" ${S}/><circle cx="9.5" cy="9" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/>`, 18),
  normal: svg(`<circle cx="12" cy="12" r="7.5" ${S}/>`, 18),
  '?': svg(`<circle cx="12" cy="12" r="9" ${S}/><path d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.2.9-1.2 1.8" ${S}/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>`, 18),
};
const pollOptIcon = (pollSlug, optSlug) => (pollSlug === 'trieda' && CLASS_ICON[optSlug]) || (pollSlug === 'frakcia' && FACTION_ICON[optSlug]) || POLL_OPT_ICON[optSlug] || '';

const NAV = [
  ['/novinky', 'Novinky', 'novinky'],
  { label: 'Návody', ic: 'navody', items: [
    ['/navody', 'Všetky návody', 'navody'],
    ['/triedy', 'Class', 'triedy'],
    ['/rasy', 'Rasy', 'rasy'],
    ['/navody/talenty', 'Talent Calculator', 'talenty'],
    ['/navody/buildy', 'Odporúčané buildy', 'buildy'],
    ['/navody/edicie-a-ceny', 'Edície', 'edicie'],
    ['/navody/faq', 'FAQ', 'faq'],
  ] },
  { label: 'Guildy', ic: 'guildy', items: [
    ['/guildy', 'Adresár CZ/SK', 'guildy'],
    ['/guilda', 'Naša guilda', 'guilda'],
    ['/guildy/pridat', 'Pridať guildu', 'guildy'],
  ] },
  ['/ankety', 'Ankety', 'ankety'],
  ['/o-nas', 'O webe', 'o-nas'],
];

const navActive = (href, path) => path === href || path.startsWith(href + '/');

function page({ title, desc, path, body, origin, noindex, jsonLd }) {
  const full = title ? `${title} | WoW Forever SK` : 'WoW Forever SK – novinky, návody a guildy po slovensky';
  const d = desc || 'Slovenský fan web o World of Warcraft: Forever. Novinky, návody, Class, rasy a adresár CZ/SK guild.';
  const ogImg = `${origin}/og.svg`;
  const structuredData = noindex ? '' : `${siteJsonLd(origin)}${breadcrumbJsonLd(path, title, origin)}${jsonLd || ''}`;
  const navItem = (entry) => {
    if (Array.isArray(entry)) {
      const [href, label, ic] = entry;
      return `<a href="${href}"${navActive(href, path) ? ' aria-current="page"' : ''}><span class="ic">${NAV_ICON[ic]}</span>${label}</a>`;
    }
    const childActive = entry.items.some(([href]) => navActive(href, path));
    const sub = entry.items.map(([href, label, ic]) => `<a href="${href}"${navActive(href, path) ? ' aria-current="page"' : ''}><span class="ic">${NAV_ICON[ic]}</span>${label}</a>`).join('');
    return `<div class="navgroup${childActive ? ' current' : ''}"><button type="button" class="navgroup-trigger" aria-haspopup="true"${childActive ? ' aria-current="page"' : ''}><span class="ic">${NAV_ICON[entry.ic]}</span>${entry.label}<span class="caret">▾</span></button><div class="dropdown">${sub}</div></div>`;
  };
  const nav = NAV.map(navItem).join('');
  const isHome = path === '/';
  const lang = `<div class="lang" aria-label="Jazyk verzie">
    <a href="/" class="on" title="Slovenská verzia">SK</a><span>/</span><a href="/cz" title="Česká verzia (pripravujeme)">CZ</a>
  </div>`;
  return `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title><meta name="description" content="${esc(d)}">
<link rel="canonical" href="${origin}${path}"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(d)}"><meta property="og:type" content="website"><meta property="og:locale" content="sk_SK"><meta property="og:site_name" content="WoW Forever SK"><meta property="og:url" content="${origin}${path}">
<meta property="og:image" content="${ogImg}"><meta property="og:image:type" content="image/svg+xml"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="WoW Forever SK — World of Warcraft: Forever po slovensky">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(full)}"><meta name="twitter:description" content="${esc(d)}"><meta name="twitter:image" content="${ogImg}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="${FAVICON}"><meta name="theme-color" content="#0F1528">
<link rel="alternate" type="application/rss+xml" title="WoW Forever SK — Novinky" href="${origin}/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Marcellus&display=swap&subset=latin-ext" rel="stylesheet">
${structuredData}
<style>${CSS}</style></head><body${isHome ? ' class="home"' : ''}>
<div class="world-bg" aria-hidden="true">${worldArt()}</div>
<div class="embers" aria-hidden="true">${[8,22,37,52,67,81,94].map((l,i)=>`<i style="left:${l}%;animation-duration:${14+i*3}s;animation-delay:${i*-2.3}s;--dx:${(i%2?1:-1)*(10+i*4)}px"></i>`).join('')}</div>
<a class="skip" href="#obsah">Preskočiť na obsah</a>
<header class="top"><div class="wrap">
  <a class="brand" href="/">${LOGO}WoW <span>Forever</span> SK</a>
  <button class="navtoggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${MENU}</button>
  <nav class="nav" id="site-nav" aria-label="Hlavná navigácia">${nav}</nav>
  ${lang}
</div></header>
<main id="obsah"><div class="wrap">${body}</div></main>
<footer><div class="wrap"><div class="footer-top"><span class="ic">${CREST}</span><span class="brand-sm">WoW <span>Forever</span> SK</span></div><div>WoW Forever SK je neoficiálny fanúšikovský web. Nie je spojený so spoločnosťou Blizzard Entertainment.</div><div>World of Warcraft a Blizzard Entertainment sú ochranné známky spoločnosti Blizzard Entertainment, Inc.</div></div></footer>
<script>(()=>{const b=document.querySelector('.navtoggle'),n=document.getElementById('site-nav');if(!b||!n)return;b.addEventListener('click',()=>{const open=n.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false');});n.addEventListener('click',e=>{if(e.target.tagName==='A')n.classList.remove('open');});})();</script>
${isHome ? `<script>(()=>{const f=()=>{document.body.classList.toggle('scrolled', window.scrollY>160);};f();addEventListener('scroll',f,{passive:true});})();</script>` : ''}
</body></html>`;
}

const html = (s, status = 200, extra = {}) => new Response(s, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300', ...extra } });

// ---------- hlasujúci (cookie) ----------
const getCookie = (request, name) => {
  const h = request.headers.get('cookie') || '';
  const m = h.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
};
function voterFrom(request) {
  const existing = getCookie(request, 'voter');
  if (existing) return { voter: existing, setCookie: null };
  const voter = crypto.randomUUID();
  return { voter, setCookie: `voter=${voter}; Max-Age=31536000; Path=/; SameSite=Lax` };
}

// ---------- odpočet (questlog) ----------
function countdownParts(target, now) {
  let ms = Math.max(0, Date.parse(target) - now);
  const d = Math.floor(ms / 864e5); ms -= d * 864e5;
  const h = Math.floor(ms / 36e5); ms -= h * 36e5;
  const m = Math.floor(ms / 6e4);
  return { d, h, m };
}

function questCard(now) {
  const launchPassed = now >= Date.parse(LAUNCH_UTC);
  const raidsAt = RAIDS_DATE + 'T00:00:00Z';
  const target = launchPassed ? raidsAt : LAUNCH_UTC;
  const done = launchPassed && now >= Date.parse(raidsAt);
  const { d, h, m } = countdownParts(target, now);
  const title = launchPassed ? 'Úloha: Na vrchol Hyjalu' : 'Úloha: Návrat do Azerothu';
  const text = launchPassed
    ? 'Azeroth je otvorený. Prvé raidy Barrow Deeps a Hyjal Summit sa otvárajú 9. decembra. Dovtedy treba dosiahnuť level 60 a zohnať partiu.'
    : 'Brány sa otvárajú o polnoci zo 4. na 5. novembra. Priprav si meno postavy, vyber class a nájdi guildu, aby si nešiel do Azerothu sám.';
  const CD_ICON = {
    d: svg(`<rect x="3" y="4.5" width="18" height="16" rx="2.5" ${S}/><line x1="3" y1="9.5" x2="21" y2="9.5" ${S}/><line x1="7" y1="2.5" x2="7" y2="6.5" ${S}/><line x1="17" y1="2.5" x2="17" y2="6.5" ${S}/>`, 18),
    h: svg(`<circle cx="12" cy="12.5" r="8.5" ${S}/><path d="M12 7.5v5.3l3.6 2.2" ${S}/>`, 18),
    m: svg(`<path d="M6 3h12M6 21h12" ${S}/><path d="M7 3c0 4.5 3 6 5 7.5C10 12 7 13.5 7 18v3M17 3c0 4.5-3 6-5 7.5 2 1.5 5 3 5 7.5v3" ${S}/>`, 18),
  };
  const cd = (u, n, label) => `<div class="cd"><span class="ic">${CD_ICON[u]}</span><b data-u="${u}">${n}</b><small>${label}</small></div>`;
  const objectives = done
    ? '<p class="done">Úloha splnená. Raidy sú otvorené.</p>'
    : `<h3><span class="sparkle">✦</span> Zostáva</h3><div class="countdown" data-target="${target}">${cd('d', d, 'dní')}<span class="sep">:</span>${cd('h', h, 'hod')}<span class="sep">:</span>${cd('m', m, 'min')}</div>`;
  return `<aside class="quest" aria-label="Odpočet do spustenia">
<h2>${title}</h2><p>${text}</p>${objectives}
<div class="reward"><div class="slot" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 26 26"><path d="M13 2 L16 10 L24 10 L17.5 15 L20 23 L13 18 L6 23 L8.5 15 L2 10 L10 10 Z" fill="#E2AE4C"/></svg></div>
<div><b>Odmena:</b> level 60, navždy.</div></div>
<script>(()=>{const u=document.querySelector('.quest .countdown');if(!u)return;const t=Date.parse(u.dataset.target);const bump=el=>{el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');};const f=()=>{let s=Math.max(0,t-Date.now());const d=Math.floor(s/864e5);s-=d*864e5;const h=Math.floor(s/36e5);s-=h*36e5;const m=Math.floor(s/6e4);[['d',d],['h',h],['m',m]].forEach(([k,v])=>{const el=u.querySelector('[data-u='+k+']');if(el.textContent!=String(v)){el.textContent=v;bump(el);}});};f();setInterval(f,15000);})();</script>
</aside>`;
}

// ---------- stránky ----------
const MES_SKR = ['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec'];

function home(origin, now, guildRows, recruitCount = 0, pd = { counts: {}, mine: {} }) {
  const latest = news.slice(0, 4).map((n, i) => newsItem(n, i === 0)).join('');
  const g = guides.slice(0, 4).map((x) => `<a class="guide-card" href="/navody/${x.slug}"><span class="ic">${guideIcon(x.slug)}</span><div><b>${esc(x.title)}</b><p>${esc(x.perex)}</p></div></a>`).join('');
  const guildBlock = guildRows.length
    ? `<ul class="guild-list">${guildRows.map((r) => `<li><a href="/guildy"><span class="tag ${r.faction === 'A' ? 'a' : 'h'}">${FACTIONS[r.faction] || ''}</span><div><b>${esc(r.name)}</b><p>${esc(r.realm)} · ${esc(r.focus)} · ${esc(r.lang)}</p></div></a></li>`).join('')}</ul>`
    : `<div class="empty"><span class="ic">${GUILD_ICON}</span><p>Zatiaľ tu nie je žiadna guilda. Buďte prví.</p><a class="btn ghost" href="/guildy/pridat">Pridať guildu</a></div>`;

  const timeline = [
    { date: '2026-10-21', label: 'do 21. októbra', text: 'Beta test' },
    { date: '2026-11-03', label: '27. okt. – 3. nov.', text: 'Rezervácia mien pre majiteľov balíkov' },
    { date: '2026-11-05', label: '5. novembra 0:00', text: 'Spustenie hry (u nás)' },
    { date: '2026-12-09', label: '9. decembra', text: 'Raidy Barrow Deeps, Hyjal Summit a Onyxia' },
    { date: '2027-01-15', label: 'zima 2026', text: 'Hardcore realmy' },
  ];
  const nextIdx = timeline.findIndex((t) => Date.parse(t.date + 'T23:59:59Z') >= now);
  const dates = timeline.map((t, i) => {
    const state = i < nextIdx ? 'past' : i === nextIdx ? 'next' : 'upcoming';
    return `<li class="${state}"><span class="dot"></span><b>${t.label}${i === nextIdx ? '<em>čoskoro</em>' : ''}</b><span>${t.text}</span></li>`;
  }).join('');

  const cameo = classes.map((c, i) => `<a href="/triedy/${c.slug}" style="--c:${c.color};--d:${(i * 0.18).toFixed(2)}s;--e:${(1.15 + i * 0.07).toFixed(2)}s"><span class="badge">${CLASS_ICON[c.slug]}</span><span class="name">${c.name}</span></a>`).join('');
  const frakciaPoll = pollBySlug.frakcia;
  const myFrakciaVote = pd.mine[frakciaPoll.slug];

  const body = `
<section class="hero">
  <div class="hero-bg">${heroArt()}</div>
  <div class="hero-fade"></div>
  <div class="hero-emblem">
    <div class="crest-badge">${crestBadge()}</div>
    <h1><span class="rule">${DIVIDER}</span><span class="word-wow">WoW</span> <em>Forever</em><b>SK</b><span class="rule">${DIVIDER}</span></h1>
    <p class="hero-tagline">World of Warcraft: Forever po slovensky</p>
  </div>
  <div class="hero-grid">
  <div>
    <p class="lead">Novinky, návody a adresár slovenských a českých guild pre novú verziu WoW, ktorá ostane na leveli 60 navždy.</p>
    <div class="btns"><a class="btn primary" href="/guildy"><span class="ic">${NAV_ICON.guildy}</span>Nájsť guildu</a><a class="btn ghost" href="/navody/ako-zacat"><span class="ic">${NAV_ICON.navody}</span>Ako začať</a></div>
  </div>
  ${questCard(now)}
  </div>
</section>
<nav class="cameo" aria-label="Rýchly výber Class">${cameo}</nav>
<section class="section">
  <a class="guildcta" href="/guilda">
    <span class="ic">${NAV_ICON.guilda}</span>
    <div><b>Zakladáme vlastnú guildu</b><p>Budeme ju viesť a hrať s vami od prvého dňa. Prihlás sa teraz, dáme ti vedieť, keď spustíme nábor naostro.${recruitCount > 0 ? ` <strong>${recruitCount} ${recruitCount === 1 ? 'hráč sa' : recruitCount < 5 ? 'hráči sa' : 'hráčov sa'} už prihlásilo.</strong>` : ''}</p></div>
    <span class="go">Prihlásiť sa →</span>
  </a>
</section>
<section class="section">
  <div class="section-head"><h2><span class="ic">${DIVIDER}</span>Najnovšie správy</h2><a href="/novinky">Všetky novinky</a></div>
  <ul class="newslist">${latest}</ul>
</section>
<section class="section two">
  <div>
    <div class="section-head"><h2><span class="ic">${DIVIDER}</span>Návody</h2><a href="/navody">Všetky</a></div>
    <div class="guide-grid">${g}</div>
  </div>
  <div>
    <div class="section-head"><h2><span class="ic">${DIVIDER}</span>Dôležité dátumy</h2></div>
    <ul class="timeline">${dates}</ul>
    <div class="section-head" style="margin-top:32px"><h2><span class="ic">${DIVIDER}</span>Nové guildy</h2><a href="/guildy">Adresár</a></div>
    ${guildBlock}
  </div>
</section>
<section class="section">
  <div class="section-head"><h2><span class="ic">${DIVIDER}</span>Anketa</h2><a href="/ankety">Všetky ankety</a></div>
  <div class="poll-grid one">${pollCard(frakciaPoll, pd.counts[frakciaPoll.slug] || {}, myFrakciaVote, { back: '/' })}</div>
</section>`;
  return page({ path: '/', body, origin });
}

const newsItem = (n, highlight) => {
  const [y, m, d] = n.date.slice(0, 10).split('-').map(Number);
  return `<li${highlight ? ' class="new"' : ''}><div class="dbadge"><b>${d}</b><span>${MES_SKR[m - 1]}</span></div><div><a class="t" href="/novinky/${n.slug}">${esc(n.title)}${highlight ? '<span class="pill-new">Nové</span>' : ''}</a><p>${esc(n.perex)}</p></div></li>`;
};

function newsList(origin) {
  const body = `<h1>Novinky</h1><p class="lead">Správy o WoW Forever po slovensky, s odkazmi na pôvodné zdroje.</p><ul class="newslist">${news.map(newsItem).join('')}</ul>`;
  return page({ title: 'Novinky', desc: 'Najnovšie správy o World of Warcraft: Forever po slovensky.', path: '/novinky', body, origin });
}

function newsDetail(n, origin) {
  const src = n.sources?.length ? `<div class="sources"><b>Zdroje</b><ul>${n.sources.map(([t, u]) => `<li><a href="${u}" rel="noopener" target="_blank">${esc(t)}</a></li>`).join('')}</ul></div>` : '';
  const body = `<a class="back" href="/novinky">Späť na novinky</a><article class="prose"><h1>${esc(n.title)}</h1><p class="meta"><time datetime="${n.date}">${skDate(n.date)}</time></p><p class="lead">${esc(n.perex)}</p>${n.body}${shareButtons(`${origin}/novinky/${n.slug}`, n.title)}${src}</article>`;
  return page({ title: n.title, desc: n.perex, path: `/novinky/${n.slug}`, body, origin, jsonLd: newsArticleJsonLd(n, origin) });
}

function guideList(origin) {
  const body = `<h1>Návody</h1><p class="lead">Všetko, čo potrebujete vedieť pred štartom a v prvých týždňoch.</p><ul class="linklist"><li><a href="/triedy">Class</a><p>Deväť class-ov, ich úlohy v skupine a ktoré rasy ich môžu hrať.</p></li><li><a href="/rasy">Rasy</a><p>Osem pôvodných rás, nová Skyborne a všetky nové kombinácie.</p></li><li><a href="/navody/talenty">Talent Calculator</a><p>Vlastná kalkulačka — rozdeľ 51 bodov a zdieľaj build odkazom.</p></li><li><a href="/navody/buildy">Odporúčané buildy</a><p>Levelovacie a raidové buildy pre každý class, rovno v kalkulačke.</p></li>${guides.map((x) => `<li><a href="/navody/${x.slug}">${esc(x.title)}</a><p>${esc(x.perex)}</p></li>`).join('')}</ul>`;
  return page({ title: 'Návody', desc: 'Slovenské návody k World of Warcraft: Forever — talenty, kalkulačka, buildy, class a rasy.', path: '/navody', body, origin });
}

function guideDetail(g, origin) {
  const body = `<a class="back" href="/navody">Späť na návody</a><article class="prose"><h1>${esc(g.title)}</h1><p class="lead">${esc(g.perex)}</p><div class="tablewrap">${g.body}</div>${shareButtons(`${origin}/navody/${g.slug}`, g.title)}</article>`;
  return page({ title: g.title, desc: g.perex, path: `/navody/${g.slug}`, body, origin, jsonLd: g.slug === 'faq' ? faqJsonLd(g.body) : '' });
}

function racesForClass(slug) {
  return races.filter((r) => r.classes.includes(slug));
}

function classList(origin) {
  const tiles = classes.map((c) => `<a class="tile" href="/triedy/${c.slug}" style="--c:${c.color}"><div class="tile-head"><span class="badge" style="--c:${c.color}">${CLASS_ICON[c.slug] || ''}</span><h3>${c.name}</h3></div><p class="sub">${c.sk[0].toUpperCase() + c.sk.slice(1)}</p><p class="roles">${roleIcons(c.roles)}</p></a>`).join('');
  const body = `<h1>Class</h1><p class="lead">Deväť pôvodných class-ov. Vo Forever majú prepracované talenty, aby bola hrateľná každá špecializácia, a niektoré rasy dostali nové kombinácie.</p><div class="grid">${tiles}</div>
<h2>Ktorá rasa môže hrať ktorý class</h2>${matrix()}`;
  return page({ title: 'Class', desc: 'Prehľad všetkých 9 class vo World of Warcraft: Forever — warrior, paladin, hunter, rogue, priest, shaman, mage, warlock a druid. Úlohy v skupine a dostupné rasy.', path: '/triedy', body, origin, jsonLd: itemListJsonLd(classes, origin, '/triedy') });
}

function matrix() {
  const head = `<tr><th>Rasa</th>${classes.map((c) => `<th title="${c.name}">${c.name}</th>`).join('')}</tr>`;
  const rows = races.map((r) => `<tr><td>${esc(r.name)}</td>${classes.map((c) => {
    if (!r.classes.includes(c.slug)) return '<td class="no" aria-label="nie">–</td>';
    const isNew = r.newClasses.includes(c.slug);
    return `<td class="${isNew ? 'new' : 'yes'}" aria-label="${isNew ? 'áno, nové' : 'áno'}">${isNew ? 'nové' : '✓'}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="tablewrap"><table class="table matrix"><thead>${head}</thead><tbody>${rows}</tbody></table></div>
<p class="meta">„Nové“ = kombinácia, ktorá v pôvodnom Classicu nebola. Podľa Warcraft Wiki k 8. 10. 2026, počas bety sa ešte môže zmeniť. Skyborne: mág len za Alianciu, šaman len za Hordu.</p>`;
}

function classDetail(c, origin) {
  const rs = racesForClass(c.slug).map((r) => {
    const fac = r.faction === 'AH' ? '<span class="tag a">Aliancia</span><span class="tag h">Horda</span>' : `<span class="tag ${r.faction.toLowerCase()}">${FACTIONS[r.faction]}</span>`;
    return `<li><a href="/rasy#${r.slug}">${esc(r.name)}</a> ${fac}${r.newClasses.includes(c.slug) && r.slug !== 'skyborne' ? '<span class="tag new">nová kombinácia</span>' : ''}</li>`;
  }).join('');
  const body = `<a class="back" href="/triedy">Späť na Class</a><article class="prose">
<div class="detail-head"><span class="badge xl" style="--c:${c.color}">${CLASS_ICON[c.slug] || ''}</span><div><h1 style="color:${c.color};margin:0">${c.name}</h1><p class="sub" style="margin:.2em 0 0">${c.sk[0].toUpperCase() + c.sk.slice(1)}</p></div></div>
<p class="lead">${esc(c.desc)}</p>
<div class="tablewrap"><table><tbody><tr><th>Úloha v skupine</th><td class="roles">${roleIcons(c.roles)}</td></tr><tr><th>Brnenie</th><td>${c.armor}</td></tr></tbody></table></div>
<h2>Rasy, ktoré môžu hrať ${c.name}</h2><ul>${rs}</ul>
<p class="btns"><a class="btn ghost" href="/navody/talenty#${c.slug}"><span class="ic">${NAV_ICON.talenty}</span>Talent Calculator</a><a class="btn ghost" href="/navody/buildy#${c.slug}"><span class="ic">${NAV_ICON.buildy}</span>Odporúčané buildy</a></p>
<p class="meta">Presná rotácia sa doladí po štarte, keď budú talenty z bety finálne. Build body vyššie sú orientačné.</p></article>`;
  return page({ title: `${c.name} (${c.sk})`, desc: `${c.name} (${c.sk}) vo World of Warcraft: Forever. ${truncate(c.desc, 135)}`, path: `/triedy/${c.slug}`, body, origin });
}

function raceList(origin) {
  const tiles = races.map((r) => {
    const fac = r.faction === 'AH'
      ? `<span class="tag a">${FACTION_ICON.A}Aliancia</span><span class="tag h">${FACTION_ICON.H}Horda</span>`
      : `<span class="tag ${r.faction.toLowerCase()}">${FACTION_ICON[r.faction]}${FACTIONS[r.faction]}</span>`;
    const cls = r.classes.map((s) => `<span class="tag cls${r.newClasses.includes(s) && r.slug !== 'skyborne' ? ' new' : ''}"><span class="ic">${CLASS_ICON[s] || ''}</span>${classBySlug[s].name}</span>`).join('');
    return `<div class="tile" id="${r.slug}" style="--c:${r.faction === 'A' ? 'var(--alliance)' : r.faction === 'H' ? 'var(--horde)' : 'var(--gold)'}"><h3>${esc(r.name)}</h3><p>Štart: ${esc(r.start)}</p><div>${fac}</div><div>${cls}</div>${r.note ? `<p style="margin-top:8px">${esc(r.note)}</p>` : ''}</div>`;
  }).join('');
  const body = `<h1>Rasy</h1><p class="lead">Osem pôvodných rás a nová rasa Skyborne, ktorá si frakciu vyberá sama. Zlatou sú označené nové kombinácie rasy a class-u.</p><div class="grid">${tiles}</div><p class="meta" style="margin-top:20px">Podľa Warcraft Wiki k 8. 10. 2026, počas bety sa ešte môže zmeniť. Viac o Skyborne v <a href="/novinky/skyborne-nova-rasa">článku</a>.</p>`;
  return page({ title: 'Rasy', desc: 'Všetkých 9 rás vo World of Warcraft: Forever — Human, Dwarf, Night Elf, Gnome, Orc, Undead, Tauren, Troll a nová rasa Skyborne. Nové kombinácie rasy a class-u.', path: '/rasy', body, origin, jsonLd: itemListJsonLd(races.map((r) => ({ slug: r.slug, name: r.name })), origin, '/rasy#') });
}

// ---------- talent calculator (English UI — see conversation: calculator content is kept in English) ----------
const RESET_ICON = svg(`<path d="M4 4v6h6" ${S}/><path d="M5.5 15a8 8 0 1 0 2-10.5L4 10" ${S}/>`, 15);
const LINK_ICON = svg(`<path d="M9.5 14.5 14.5 9.5" ${S}/><path d="M11 6.5 13 4.5a4 4 0 0 1 5.7 5.7L16.5 12.3" ${S}/><path d="M13 17.5 11 19.5a4 4 0 0 1-5.7-5.7L7.5 11.7" ${S}/>`, 15);

function talentCalc(origin) {
  const tabs = classes.map((c) => `<button type="button" class="tcal-tab" data-class="${c.slug}" style="--c:${c.color}"><span class="ic">${CLASS_ICON[c.slug] || ''}</span>${c.name}</button>`).join('');
  const panels = classes.map((c, ci) => {
    const data = TALENT_TREES[c.slug];
    const trees = data.trees.map((tree, ti) => {
      const maxTier = Math.max(...tree.talents.map((t) => t.t));
      const tiers = Array.from({ length: maxTier + 1 }, (_, tier) => {
        const nodes = tree.talents.map((tal, idx) => (tal.t !== tier ? '' : `<button type="button" class="tnode" data-tree="${ti}" data-idx="${idx}" data-max="${tal.max}" data-tier="${tier}" data-rank="0" title="${esc(tal.d)}"><span class="tn-name">${esc(tal.name)}</span><span class="tn-pips">${'○'.repeat(tal.max)}</span><span class="tn-rank">0/${tal.max}</span></button>`)).join('');
        return `<div class="ttier">${nodes}</div>`;
      }).join('');
      return `<div class="ttree" data-tree-panel="${ti}"><div class="ttree-head"><span class="ic">${TREE_ICON[tree.icon] || ''}</span><h3>${esc(tree.name)}</h3><span data-tree-points="${ti}">0</span></div><div class="ttier-wrap">${tiers}</div></div>`;
    }).join('');
    const fc = FOREVER_CHANGES[c.slug];
    const changesHtml = fc ? `<div class="tcal-changes"><h4>Forever zmeny — ${esc(fc.label)} <span class="meta">(${esc(fc.source)})</span></h4><ul>${fc.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>` : '';
    return `<div class="tcal-panel" data-class-panel="${c.slug}"${ci === 0 ? '' : ' hidden'}>
<div class="tcal-summary"><div><b data-total-points>0</b> / 51 points · recommended level <b data-total-level>10</b></div><div class="tcal-actions"><button type="button" class="btn ghost sm" data-reset-all><span class="ic">${RESET_ICON}</span>Reset</button><button type="button" class="btn ghost sm" data-copy-link><span class="ic">${LINK_ICON}</span><span class="btn-label">Copy link</span></button><button type="button" class="btn ghost sm" data-discord-share title="Copies a Discord-friendly summary of this build"><span class="ic">${SHARE_ICON.discord}</span><span class="btn-label">Share to Discord</span></button></div></div>
<div class="tcal-trees">${trees}</div>
${changesHtml}
</div>`;
  }).join('');
  const generalChanges = FOREVER_CHANGES.general;
  const body = `<h1>Talent Calculator</h1><p class="lead">Our own talent calculator for World of Warcraft: Forever — spend 51 points across three trees for any class and share your build with a link. Click to add a point, Shift+click or right-click to remove one.</p>
<div class="tcal-changes" style="margin-bottom:18px"><h4>Forever zmeny — ${esc(generalChanges.label)} <span class="meta">(${esc(generalChanges.source)})</span></h4><ul>${generalChanges.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
<div class="tcal"><div class="tcal-tabs" role="tablist">${tabs}</div>${panels}</div>
<p class="meta" style="margin-top:20px">Talent names, trees and point thresholds are the real WoW Forever beta data, not vanilla WoW's. Effect descriptions are our own short wording, not copied tooltips. Each class tab also lists other Forever-specific mechanic changes we found. See also the <a href="/navody/buildy">recommended builds</a> (in Slovak).</p>
<script>(()=>{
const root=document.querySelector('.tcal');
if(!root) return;
const tabs=[...root.querySelectorAll('.tcal-tab')];
const panels=[...root.querySelectorAll('.tcal-panel')];
function showClass(slug){
  tabs.forEach(t=>t.classList.toggle('on', t.dataset.class===slug));
  panels.forEach(p=>{ p.hidden = p.dataset.classPanel!==slug; });
}
function treePoints(tree){ return [...tree.querySelectorAll('.tnode')].reduce((s,n)=>s+ +n.dataset.rank,0); }
function totalPoints(panel){ return [...panel.querySelectorAll('.tnode')].reduce((s,n)=>s+ +n.dataset.rank,0); }
function setRank(node, rank){
  rank=Math.max(0,Math.min(+node.dataset.max, rank));
  node.dataset.rank=rank;
  node.querySelector('.tn-rank').textContent=rank+'/'+node.dataset.max;
  node.querySelector('.tn-pips').textContent='●'.repeat(rank)+'○'.repeat(node.dataset.max-rank);
  node.classList.toggle('filled', rank>0);
}
function validateTree(tree){
  let changed=true;
  while(changed){
    changed=false;
    const pts=treePoints(tree);
    tree.querySelectorAll('.tnode').forEach(n=>{
      const tier=+n.dataset.tier;
      if(+n.dataset.rank>0 && pts<tier*5){ setRank(n,0); changed=true; }
    });
  }
}
function update(panel){
  let total=0;
  panel.querySelectorAll('.ttree').forEach(tree=>{
    const pts=treePoints(tree);
    total+=pts;
    tree.querySelector('[data-tree-points]').textContent=pts;
    tree.querySelectorAll('.tnode').forEach(n=>{
      const tier=+n.dataset.tier;
      n.classList.toggle('locked', tier>0 && pts<tier*5 && +n.dataset.rank===0);
    });
  });
  panel.querySelector('[data-total-points]').textContent=total;
  panel.querySelector('[data-total-level]').textContent= total===0?10:Math.min(60,total+9);
}
function syncHash(panel){
  const slug=panel.dataset.classPanel;
  const parts=[...panel.querySelectorAll('.ttree')].map(tree=>[...tree.querySelectorAll('.tnode')].map(n=>n.dataset.rank).join(''));
  history.replaceState(null,'','#'+slug+':'+parts.join('-'));
}
function applyHash(){
  const h=location.hash.slice(1);
  if(!h) return;
  const i=h.indexOf(':');
  const slug=i===-1?h:h.slice(0,i);
  const data=i===-1?'':h.slice(i+1);
  const panel=root.querySelector('.tcal-panel[data-class-panel="'+slug+'"]');
  if(!panel) return;
  showClass(slug);
  if(data){
    const parts=data.split('-');
    [...panel.querySelectorAll('.ttree')].forEach((tree,ti)=>{
      const digits=parts[ti]||'';
      [...tree.querySelectorAll('.tnode')].forEach((n,idx)=>setRank(n, +(digits[idx]||0)));
    });
  }
  update(panel);
}
function handleDelta(e, delta){
  const node=e.target.closest('.tnode');
  if(!node) return;
  e.preventDefault();
  const panel=node.closest('.tcal-panel');
  const tree=node.closest('.ttree');
  const tier=+node.dataset.tier;
  const pts=treePoints(tree);
  const rank=+node.dataset.rank;
  if(delta>0){
    if(pts<tier*5 || rank>=+node.dataset.max || totalPoints(panel)>=51) return;
    setRank(node, rank+1);
  } else {
    if(rank<=0) return;
    setRank(node, rank-1);
    validateTree(tree);
  }
  update(panel);
  syncHash(panel);
}
root.addEventListener('click', e=>{ if(e.target.closest('.tcal-tab')) return; handleDelta(e, e.shiftKey?-1:1); });
root.addEventListener('contextmenu', e=>{ if(e.target.closest('.tnode')) handleDelta(e,-1); });
tabs.forEach(t=>t.addEventListener('click', ()=>{ showClass(t.dataset.class); history.replaceState(null,'',location.pathname); }));
document.querySelectorAll('[data-reset-all]').forEach(btn=>btn.addEventListener('click', ()=>{
  const panel=btn.closest('.tcal-panel');
  panel.querySelectorAll('.tnode').forEach(n=>setRank(n,0));
  update(panel); syncHash(panel);
}));
document.querySelectorAll('[data-copy-link]').forEach(btn=>btn.addEventListener('click', async ()=>{
  syncHash(btn.closest('.tcal-panel'));
  const label=btn.querySelector('.btn-label');
  try{ await navigator.clipboard.writeText(location.href); label.textContent='Copied!'; setTimeout(()=>label.textContent='Copy link',1500); }catch(err){}
}));
function discordText(panel){
  const slug=panel.dataset.classPanel;
  const tabBtn=root.querySelector('.tcal-tab[data-class="'+slug+'"]');
  const className=tabBtn?tabBtn.textContent.trim():slug;
  const total=panel.querySelector('[data-total-points]').textContent;
  const level=panel.querySelector('[data-total-level]').textContent;
  const lines=['**'+className+' build** — '+total+'/51 points (level '+level+')'];
  panel.querySelectorAll('.ttree').forEach(tree=>{
    const name=tree.querySelector('h3').textContent.trim();
    const picks=[...tree.querySelectorAll('.tnode')].filter(n=>+n.dataset.rank>0).map(n=>n.querySelector('.tn-name').textContent.trim()+' ('+n.dataset.rank+'/'+n.dataset.max+')');
    if(picks.length) lines.push('**'+name+':** '+picks.join(', '));
  });
  lines.push(location.href);
  return lines.join('\\n');
}
document.querySelectorAll('[data-discord-share]').forEach(btn=>btn.addEventListener('click', async ()=>{
  const panel=btn.closest('.tcal-panel');
  syncHash(panel);
  const text=discordText(panel);
  const label=btn.querySelector('.btn-label');
  try{ await navigator.clipboard.writeText(text); label.textContent='Copied!'; setTimeout(()=>label.textContent='Share to Discord',1500); }catch(err){}
}));
panels.forEach(p=>{ p.querySelectorAll('.tnode').forEach(n=>setRank(n,0)); update(p); });
if(location.hash) applyHash(); else showClass('${classes[0].slug}');
})();</script>`;
  return page({ title: 'Talent Calculator', desc: 'Our own talent calculator for World of Warcraft: Forever. Spend 51 points, test builds for every class and share them with a link.', path: '/navody/talenty', body, origin });
}

// ---------- odporúčané buildy ----------
function buildsGuide(origin) {
  const rows = BUILD_PLAN.map((b) => {
    const c = classBySlug[b.slug];
    return `<tr><td><span class="ic">${CLASS_ICON[b.slug] || ''}</span>${c.name}</td><td><a href="/navody/talenty#${b.slug}:${greedyAllocate(b.slug, b.level.order).hash}">${esc(b.level.label)}</a></td><td><a href="/navody/talenty#${b.slug}:${greedyAllocate(b.slug, b.raid.order).hash}">${esc(b.raid.label)}</a></td></tr>`;
  }).join('');
  const sections = BUILD_PLAN.map((b) => {
    const c = classBySlug[b.slug];
    const block = (role, info) => {
      const a = greedyAllocate(b.slug, info.order);
      const treeNames = TALENT_TREES[b.slug].trees.map((t) => t.name);
      const picksHtml = a.picks.map((treePicks, ti) => treePicks.length ? `<li><b>${esc(treeNames[ti])}:</b> ${treePicks.map((p) => `${esc(p.name)} (${p.rank}/${p.max})`).join(', ')}</li>` : '').join('');
      return `<div class="build-block"><h4 style="color:${c.color}">${esc(role)} — ${esc(info.label)}</h4><p>${esc(info.note)}</p><ul class="build-picks">${picksHtml}</ul><a class="btn ghost sm" href="/navody/talenty#${b.slug}:${a.hash}">Otvoriť v kalkulačke →</a></div>`;
    };
    return `<article class="prose build-card" id="${b.slug}"><div class="detail-head"><span class="badge xl" style="--c:${c.color}">${CLASS_ICON[b.slug] || ''}</span><h2 style="color:${c.color};margin:0">${c.name}</h2></div><div class="build-grid">${block('Levelovanie', b.level)}${block('Raid', b.raid)}</div></article>`;
  }).join('');
  const body = `<h1>Odporúčané buildy</h1><p class="lead">Orientačné talentové buildy pre levelovanie a raid, inšpirované komunitnými špecializáciami (napr. Wowhead Classic, Icy Veins). Presné čísla sa od zdrojov líšia — naša <a href="/navody/talenty">kalkulačka talentov</a> má vlastný, zjednodušený strom. Každý build si môžeš otvoriť priamo v kalkulačke a doladiť podľa seba.</p>
<h2>Stručný prehľad</h2>
<div class="tablewrap"><table class="table"><thead><tr><th>Class</th><th>Levelovanie</th><th>Raid</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2>Podrobnejšie</h2>
${sections}`;
  return page({ title: 'Odporúčané buildy', desc: 'Odporúčané talentové buildy pre levelovanie a raid pre všetkých 9 class vo World of Warcraft: Forever, s odkazom priamo do kalkulačky talentov.', path: '/navody/buildy', body, origin });
}

function about(origin) {
  const body = `<article class="prose"><h1>O webe</h1>
<p class="lead">WoW Forever SK je slovenský fanúšikovský web pre hráčov World of Warcraft: Forever.</p>
<p>Hra je len v angličtine a slovenských zdrojov je málo. Chceme mať na jednom mieste novinky, návody a kontakty na slovenské a české guildy.</p>
<p>Novinky píšeme vlastnými slovami a pri každej uvádzame zdroj. Ak nájdete chybu alebo chcete prispieť návodom, ozvite sa.</p>
<h2>Kontakt</h2><p>E-mail: <a href="mailto:bocak.sk@gmail.com">bocak.sk@gmail.com</a></p>
<h2>Právne</h2><p>Nie sme spojení so spoločnosťou Blizzard Entertainment. World of Warcraft a súvisiace názvy sú ochranné známky Blizzard Entertainment, Inc. Údaje o guildách zadávajú samotní hráči; kontakt z formulára nezverejňujeme.</p></article>`;
  return page({ title: 'O webe', path: '/o-nas', body, origin });
}

function notFound(origin) {
  return html(page({ title: 'Stránka sa nenašla', path: '/404', origin, noindex: true, body: `<article class="prose"><h1>Táto cesta nikam nevedie</h1><p class="lead">Stránka neexistuje alebo bola presunutá.</p><p><a class="btn ghost" href="/">Na úvod</a></p></article>` }), 404);
}

function czStub(origin) {
  return html(page({ title: 'Česká verzia', path: '/cz', origin, noindex: true, body: `<article class="prose"><h1>Česká verzia sa pripravuje</h1><p class="lead">Pracujeme na českom preklade webu. Zatiaľ si pozrite slovenskú verziu.</p><p><a class="btn ghost" href="/">Na slovenskú verziu</a></p></article>` }));
}

// ---------- guildy ----------
const opt = (list, sel, labels) => list.map((v) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(labels ? labels[v] : v)}</option>`).join('');

async function guildList(env, url, origin) {
  const f = { faction: url.searchParams.get('frakcia') || '', realm: url.searchParams.get('realm') || '', focus: url.searchParams.get('zameranie') || '', lang: url.searchParams.get('jazyk') || '' };
  let rows = [];
  let dbErr = false;
  try {
    const where = ["status = 'approved'"]; const args = [];
    if (f.faction) { where.push('faction = ?'); args.push(f.faction); }
    if (f.realm) { where.push('realm = ?'); args.push(f.realm); }
    if (f.focus) { where.push('focus = ?'); args.push(f.focus); }
    if (f.lang) { where.push('lang = ?'); args.push(f.lang); }
    const r = await env.DB.prepare(`SELECT * FROM guilds WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT 200`).bind(...args).all();
    rows = r.results || [];
  } catch (e) { dbErr = true; }
  const anyFilter = Object.values(f).some(Boolean);
  const cards = rows.map((g) => `<article class="guild"><h3>${esc(g.name)}</h3>
<div class="row"><span class="tag ${g.faction === 'A' ? 'a' : 'h'}">${FACTIONS[g.faction] || ''}</span><span>Realm: ${esc(g.realm)}</span><span>${esc(g.focus)}</span><span>Jazyk: ${esc(g.lang)}</span>${g.raid_times ? `<span>Hráme: ${esc(g.raid_times)}</span>` : ''}</div>
${g.description ? `<p>${esc(g.description)}</p>` : ''}${g.discord ? `<p><a href="${esc(g.discord)}" rel="noopener nofollow" target="_blank">Discord guildy</a></p>` : ''}</article>`).join('');
  const empty = dbErr
    ? '<div class="notice err">Adresár sa teraz nepodarilo načítať. Skúste to o chvíľu znova.</div>'
    : anyFilter
      ? '<div class="empty"><p>Týmto filtrom nezodpovedá žiadna guilda.</p><a class="btn ghost" href="/guildy">Zrušiť filtre</a></div>'
      : '<div class="empty"><p>Adresár je zatiaľ prázdny. Vediete guildu? Pridajte ju ako prvá.</p><a class="btn primary" href="/guildy/pridat">Pridať guildu</a></div>';
  const body = `<h1>Guildy CZ/SK</h1><p class="lead">Slovenské a české guildy pre WoW Forever. Vyberte si podľa frakcie, realmu a toho, čo chcete hrať.</p>
<p><a class="btn primary" href="/guildy/pridat">Pridať guildu</a></p>
<form class="filters" method="get" action="/guildy">
<label>Frakcia<select name="frakcia"><option value="">Všetky</option>${opt(['A', 'H'], f.faction, FACTIONS)}</select></label>
<label>Realm<select name="realm"><option value="">Všetky</option>${opt(REALMS, f.realm)}</select></label>
<label>Zameranie<select name="zameranie"><option value="">Všetky</option>${opt(FOCUS, f.focus)}</select></label>
<label>Jazyk<select name="jazyk"><option value="">Všetky</option>${opt(LANGS, f.lang)}</select></label>
<button class="btn ghost" type="submit">Filtrovať</button></form>
<div class="guilds">${cards || empty}</div>`;
  return page({ title: 'Guildy CZ/SK', desc: 'Adresár slovenských a českých guild pre World of Warcraft: Forever.', path: '/guildy', body, origin });
}

function guildForm(origin, state = {}) {
  const v = state.values || {};
  const msg = state.ok
    ? '<div class="notice">Ďakujeme. Guildu skontrolujeme a do 24 hodín ju zverejníme v adresári.</div>'
    : state.error ? `<div class="notice err">${esc(state.error)}</div>` : '';
  const body = `<a class="back" href="/guildy">Späť na adresár</a><h1>Pridať guildu</h1><p class="lead">Zápis je zadarmo. Guildu pred zverejnením skontrolujeme.</p>${msg}
<form class="form" method="post" action="/guildy/pridat">
<label class="f"><span>Názov guildy *</span><input name="name" required maxlength="60" value="${esc(v.name)}"></label>
<div class="pair">
<label class="f"><span>Frakcia *</span><select name="faction" required><option value="">Vyberte</option>${opt(['A', 'H'], v.faction, FACTIONS)}</select></label>
<label class="f"><span>Realm *</span><select name="realm" required><option value="">Vyberte</option>${opt(REALMS, v.realm)}</select><small>Hardcore realmy prídu v zime 2026.</small></label>
</div>
<div class="pair">
<label class="f"><span>Zameranie *</span><select name="focus" required><option value="">Vyberte</option>${opt(FOCUS, v.focus)}</select></label>
<label class="f"><span>Jazyk *</span><select name="lang" required><option value="">Vyberte</option>${opt(LANGS, v.lang)}</select></label>
</div>
<label class="f"><span>Kedy hráte</span><input name="raid_times" maxlength="120" placeholder="napr. raidy st a ne 20:00–23:00" value="${esc(v.raid_times)}"></label>
<label class="f"><span>Pozvánka na Discord</span><input name="discord" type="url" maxlength="120" placeholder="https://discord.gg/..." value="${esc(v.discord)}"></label>
<label class="f"><span>Popis</span><textarea name="description" maxlength="500" placeholder="Koho hľadáte, aká je atmosféra, aké máte ciele.">${esc(v.description)}</textarea><small>Najviac 500 znakov.</small></label>
<label class="f"><span>Kontakt pre nás *</span><input name="contact" required maxlength="100" placeholder="e-mail alebo Discord meno" value="${esc(v.contact)}"><small>Nezverejňujeme. Použijeme ho, len ak budeme mať k zápisu otázku.</small></label>
<label class="hp" aria-hidden="true">Web<input name="web" tabindex="-1" autocomplete="off"></label>
<input type="hidden" name="t" value="${Date.now()}">
<div><button class="btn primary" type="submit">Odoslať guildu</button></div>
</form>`;
  return page({ title: 'Pridať guildu', desc: 'Pridajte svoju slovenskú alebo českú guildu do adresára WoW Forever SK.', path: '/guildy/pridat', body, origin });
}

async function submitGuild(request, env, origin) {
  const fd = await request.formData();
  const v = Object.fromEntries(['name', 'faction', 'realm', 'focus', 'lang', 'raid_times', 'discord', 'description', 'contact', 'web', 't'].map((k) => [k, String(fd.get(k) || '').trim()]));
  // ochrana proti botom: skryté pole a príliš rýchle odoslanie
  if (v.web || Date.now() - Number(v.t || 0) < 3000) return html(guildForm(origin, { ok: true }));
  const err = (m) => html(guildForm(origin, { error: m, values: v }), 400);
  if (!v.name || v.name.length > 60) return err('Zadajte názov guildy (najviac 60 znakov).');
  if (!FACTIONS[v.faction]) return err('Vyberte frakciu.');
  if (!REALMS.includes(v.realm)) return err('Vyberte typ realmu.');
  if (!FOCUS.includes(v.focus)) return err('Vyberte zameranie guildy.');
  if (!LANGS.includes(v.lang)) return err('Vyberte jazyk guildy.');
  if (!v.contact || v.contact.length > 100) return err('Zadajte kontakt, aby sme sa vám mohli ozvať.');
  if (v.discord && !/^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+$/.test(v.discord)) return err('Odkaz na Discord musí začínať https://discord.gg/ alebo https://discord.com/invite/.');
  if (v.raid_times.length > 120 || v.description.length > 500) return err('Text je príliš dlhý.');
  try {
    await env.DB.prepare(`INSERT INTO guilds (name, faction, realm, focus, lang, raid_times, discord, description, contact) VALUES (?,?,?,?,?,?,?,?,?)`)
      .bind(v.name, v.faction, v.realm, v.focus, v.lang, v.raid_times || null, v.discord || null, v.description || null, v.contact).run();
  } catch (e) {
    return err('Guildu sa nepodarilo uložiť. Skúste to o chvíľu znova.');
  }
  return Response.redirect(`${origin}/guildy/pridat?ok=1`, 303);
}

// ---------- naša guilda ----------
const CLASS_OPT = classes.map((c) => `<option value="${esc(c.slug)}">${esc(c.name)} (${esc(c.sk)})</option>`).join('');

function guildaPage(origin, count, state = {}) {
  const v = state.values || {};
  const msg = state.ok
    ? '<div class="notice">Si v tom! Ozveme sa ti cez zadaný kontakt, keď budeme guildu spúšťať naostro.</div>'
    : state.error ? `<div class="notice err">${esc(state.error)}</div>` : '';
  const countLine = count > 0 ? `<p class="signup-count"><span class="ic">${NAV_ICON.guilda}</span>${count} ${count === 1 ? 'hráč sa' : count < 5 ? 'hráči sa' : 'hráčov sa'} už prihlásilo</p>` : '';
  const body = `<article class="prose">
<h1>Zakladáme vlastnú guildu</h1>
<p class="lead">Keď 4. – 5. novembra štartuje WoW Forever, ideme hrať aj my a guildu povedieme sami. Prihlás sa teraz, nech si medzi prvými, komu dáme vedieť, keď spustíme nábor naostro – ešte pred štartom.</p>
${countLine}
${msg}
<form class="form" method="post" action="/guilda">
<label class="f"><span>Prezývka</span><input name="nick" maxlength="40" placeholder="ako ťa budeme volať" value="${esc(v.nick)}"></label>
<div class="pair">
<label class="f"><span>Frakcia *</span><select name="faction" required><option value="">Vyberte</option><option value="A"${v.faction === 'A' ? ' selected' : ''}>Aliancia</option><option value="H"${v.faction === 'H' ? ' selected' : ''}>Horda</option><option value="?"${v.faction === '?' ? ' selected' : ''}>Ešte neviem</option></select></label>
<label class="f"><span>Class</span><select name="class"><option value="">Ešte neviem</option>${CLASS_OPT}</select></label>
</div>
<label class="f"><span>Zameranie</span><select name="focus"><option value="">Ešte neviem</option>${opt(FOCUS, v.focus)}</select></label>
<label class="f"><span>Odkaz pre nás</span><textarea name="note" maxlength="500" placeholder="skúsenosti, s kým chceš hrať, čokoľvek">${esc(v.note)}</textarea></label>
<label class="f"><span>Kontakt *</span><input name="contact" required maxlength="100" placeholder="Discord meno alebo e-mail" value="${esc(v.contact)}"><small>Len na to, aby sme ťa vedeli osloviť pri nábore. Nikde ho nezverejníme.</small></label>
<label class="hp" aria-hidden="true">Web<input name="web" tabindex="-1" autocomplete="off"></label>
<input type="hidden" name="t" value="${Date.now()}">
<div><button class="btn primary" type="submit">Prihlásiť sa do guildy</button></div>
</form>
</article>`;
  return page({ title: 'Naša guilda', desc: 'Zakladáme vlastnú guildu pre WoW Forever. Prihlás sa a dáme ti vedieť, keď spustíme nábor.', path: '/guilda', body, origin });
}

async function submitRecruit(request, env, origin) {
  const fd = await request.formData();
  const v = Object.fromEntries(['nick', 'faction', 'class', 'focus', 'note', 'contact', 'web', 't'].map((k) => [k, String(fd.get(k) || '').trim()]));
  if (v.web || Date.now() - Number(v.t || 0) < 3000) return html(guildaPage(origin, 0, { ok: true }));
  const err = (m) => html(guildaPage(origin, 0, { error: m, values: v }), 400);
  if (!['A', 'H', '?'].includes(v.faction)) return err('Vyberte frakciu.');
  if (!v.contact || v.contact.length > 100) return err('Zadajte kontakt, aby sme sa vám mohli ozvať.');
  if (v.nick.length > 40) return err('Prezývka je príliš dlhá.');
  if (v.note.length > 500) return err('Odkaz je príliš dlhý.');
  if (v.class && !classes.some((c) => c.slug === v.class)) v.class = '';
  if (v.focus && !FOCUS.includes(v.focus)) v.focus = '';
  try {
    await env.DB.prepare(`INSERT INTO recruits (nick, faction, class, focus, note, contact) VALUES (?,?,?,?,?,?)`)
      .bind(v.nick || null, v.faction, v.class || null, v.focus || null, v.note || null, v.contact).run();
  } catch (e) {
    return err('Nepodarilo sa to uložiť. Skúste to o chvíľu znova.');
  }
  return Response.redirect(`${origin}/guilda?ok=1`, 303);
}

// ---------- ankety ----------
const pollBySlug = Object.fromEntries(polls.map((p) => [p.slug, p]));
const skPlural = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

function pollResults(poll, counts = {}) {
  const total = poll.options.reduce((s, o) => s + (counts[o.slug] || 0), 0);
  const bars = poll.options
    .map((o) => ({ ...o, c: counts[o.slug] || 0 }))
    .sort((a, b) => b.c - a.c)
    .map((o) => {
      const pct = total ? Math.round((o.c / total) * 100) : 0;
      return `<li><span class="opt"><span class="ic">${pollOptIcon(poll.slug, o.slug)}</span>${esc(o.label)}</span><span class="bar"><span class="fill" style="width:${pct}%"></span></span><span class="pct">${pct}&nbsp;%</span></li>`;
    }).join('');
  return `<ul class="poll-bars">${bars}</ul><p class="poll-total">${total} ${skPlural(total, 'hlas', 'hlasy', 'hlasov')}</p>`;
}

function pollVoteForm(poll, back) {
  const opts = poll.options.map((o) => `<button class="poll-opt" type="submit" name="option" value="${esc(o.slug)}"><span class="ic">${pollOptIcon(poll.slug, o.slug)}</span>${esc(o.label)}</button>`).join('');
  return `<form class="poll-form" method="post" action="/ankety"><input type="hidden" name="poll" value="${poll.slug}"><input type="hidden" name="back" value="${esc(back)}">${opts}</form>`;
}

function pollCard(poll, counts, myVote, { back = '/ankety', edit = false } = {}) {
  const voted = myVote && !edit;
  return `<div class="poll-card" id="anketa-${poll.slug}">
    <h3><span class="ic">${NAV_ICON.ankety}</span>${esc(poll.question)}</h3>
    ${voted ? `${pollResults(poll, counts)}<a class="change-vote" href="${back === '/' ? '/ankety' : back}?edit=${poll.slug}#anketa-${poll.slug}">Zmeniť hlas</a>` : pollVoteForm(poll, back)}
  </div>`;
}

async function pollData(env, voter) {
  const counts = {};
  const mine = {};
  try {
    const { results = [] } = await env.DB.prepare(`SELECT poll, option_slug, COUNT(*) c FROM poll_votes GROUP BY poll, option_slug`).all();
    for (const r of results) (counts[r.poll] ||= {})[r.option_slug] = r.c;
  } catch (e) {}
  if (voter) {
    try {
      const { results = [] } = await env.DB.prepare(`SELECT poll, option_slug FROM poll_votes WHERE voter=?`).bind(voter).all();
      for (const r of results) mine[r.poll] = r.option_slug;
    } catch (e) {}
  }
  return { counts, mine };
}

function pollsPage(origin, { counts, mine }, editSlug) {
  const cards = polls.map((p) => pollCard(p, counts[p.slug] || {}, mine[p.slug], { back: '/ankety', edit: editSlug === p.slug })).join('');
  const body = `<h1>Ankety</h1><p class="lead">Zisťujeme, ako budeme hrať. Hlasuj — výsledky sa počítajú naživo, hlas vieš kedykoľvek zmeniť.</p><div class="poll-grid">${cards}</div>`;
  return page({ title: 'Ankety', desc: 'Hlasuj v anketách o WoW Forever: Class, frakcia, štýl hry a typ realmu.', path: '/ankety', body, origin });
}

async function submitVote(request, env, origin) {
  const fd = await request.formData();
  const pollSlug = String(fd.get('poll') || '');
  const option = String(fd.get('option') || '');
  const back = String(fd.get('back') || '/ankety');
  const poll = pollBySlug[pollSlug];
  const { voter, setCookie } = voterFrom(request);
  const headers = setCookie ? { 'set-cookie': setCookie } : {};
  if (poll && poll.options.some((o) => o.slug === option)) {
    try {
      await env.DB.prepare(`INSERT INTO poll_votes (poll, option_slug, voter) VALUES (?,?,?) ON CONFLICT(poll,voter) DO UPDATE SET option_slug=excluded.option_slug, created_at=datetime('now')`)
        .bind(pollSlug, option, voter).run();
    } catch (e) {}
  }
  const safeBack = back.startsWith('/') ? back : '/ankety';
  return new Response(null, { status: 303, headers: { location: `${origin}${safeBack === '/' ? '/' : safeBack}#anketa-${pollSlug}`, ...headers } });
}

// ---------- administrácia ----------
async function admin(request, env, url, origin) {
  const key = request.method === 'POST' ? String((await request.clone().formData()).get('key') || '') : url.searchParams.get('key') || '';
  let adminKey = env.ADMIN_KEY;
  if (!adminKey) { try { adminKey = (await env.DB.prepare(`SELECT value FROM settings WHERE key='admin_key'`).first())?.value; } catch (e) {} }
  if (!adminKey || key !== adminKey) return html(page({ title: 'Administrácia', path: '/admin', origin, noindex: true, body: '<h1>Administrácia</h1><p class="lead">Chýba alebo nesedí kľúč.</p>' }), 401, { 'cache-control': 'no-store' });
  if (request.method === 'POST') {
    const fd = await request.formData();
    const id = Number(fd.get('id')); const act = String(fd.get('act'));
    if (act === 'approve') await env.DB.prepare(`UPDATE guilds SET status='approved' WHERE id=?`).bind(id).run();
    if (act === 'reject') await env.DB.prepare(`UPDATE guilds SET status='rejected' WHERE id=?`).bind(id).run();
    if (act === 'delete') await env.DB.prepare(`DELETE FROM guilds WHERE id=?`).bind(id).run();
    if (act === 'recruit_delete') await env.DB.prepare(`DELETE FROM recruits WHERE id=?`).bind(id).run();
    return Response.redirect(`${origin}/admin?key=${encodeURIComponent(key)}`, 303);
  }
  const { results = [] } = await env.DB.prepare(`SELECT * FROM guilds ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, created_at DESC LIMIT 300`).all();
  const { results: recruits = [] } = await env.DB.prepare(`SELECT * FROM recruits ORDER BY created_at DESC LIMIT 500`).all();
  const btn = (id, act, label) => `<form method="post" style="display:inline"><input type="hidden" name="key" value="${esc(key)}"><input type="hidden" name="id" value="${id}"><input type="hidden" name="act" value="${act}"><button class="btn ghost" style="padding:6px 12px;font-size:.9rem">${label}</button></form>`;
  const rows = results.map((g) => `<tr><td>${g.id}</td><td><b>${esc(g.name)}</b><br><span class="meta">${esc(g.description || '')}</span></td><td>${FACTIONS[g.faction]}, ${esc(g.realm)}, ${esc(g.focus)}, ${esc(g.lang)}</td><td>${esc(g.contact)}<br>${esc(g.discord || '')}</td><td>${esc(g.status)}<br><span class="meta">${esc(g.created_at)}</span></td><td>${g.status !== 'approved' ? btn(g.id, 'approve', 'Schváliť') : ''} ${g.status !== 'rejected' ? btn(g.id, 'reject', 'Zamietnuť') : ''} ${btn(g.id, 'delete', 'Zmazať')}</td></tr>`).join('');
  const classBySlugAdmin = Object.fromEntries(classes.map((c) => [c.slug, c.name]));
  const recruitRows = recruits.map((r) => `<tr><td>${r.id}</td><td>${esc(r.nick || '—')}</td><td>${FACTIONS[r.faction] || 'Neviem'}</td><td>${esc(classBySlugAdmin[r.class] || '—')}</td><td>${esc(r.focus || '—')}</td><td>${esc(r.contact)}</td><td><span class="meta">${esc(r.note || '')}</span></td><td><span class="meta">${esc(r.created_at)}</span></td><td>${btn(r.id, 'recruit_delete', 'Zmazať')}</td></tr>`).join('');
  const body = `<h1>Administrácia guild</h1><p class="lead">Čakajúce zápisy sú hore.</p><div class="tablewrap"><table class="table"><thead><tr><th>#</th><th>Guilda</th><th>Info</th><th>Kontakt</th><th>Stav</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="6">Zatiaľ žiadne zápisy.</td></tr>'}</tbody></table></div>
<h2>Prihlásení do našej guildy (${recruits.length})</h2><div class="tablewrap"><table class="table"><thead><tr><th>#</th><th>Prezývka</th><th>Frakcia</th><th>Class</th><th>Zameranie</th><th>Kontakt</th><th>Odkaz</th><th>Kedy</th><th></th></tr></thead><tbody>${recruitRows || '<tr><td colspan="9">Zatiaľ sa nikto neprihlásil.</td></tr>'}</tbody></table></div>`;
  return html(page({ title: 'Administrácia', path: '/admin', origin, noindex: true, body }), 200, { 'cache-control': 'no-store' });
}

// ---------- sitemap ----------
function sitemap(origin) {
  const newest = news[0]?.date.slice(0, 10);
  const entries = [
    { p: '/', prio: '1.0', lastmod: newest },
    { p: '/novinky', prio: '0.9', lastmod: newest },
    { p: '/navody', prio: '0.8' },
    { p: '/triedy', prio: '0.8' },
    { p: '/rasy', prio: '0.8' },
    { p: '/navody/talenty', prio: '0.8' },
    { p: '/navody/buildy', prio: '0.8' },
    { p: '/guildy', prio: '0.7' },
    { p: '/guildy/pridat', prio: '0.5' },
    { p: '/guilda', prio: '0.6' },
    { p: '/ankety', prio: '0.6' },
    { p: '/o-nas', prio: '0.3' },
    ...news.map((n) => ({ p: `/novinky/${n.slug}`, prio: '0.7', lastmod: n.date.slice(0, 10) })),
    ...guides.map((g) => ({ p: `/navody/${g.slug}`, prio: '0.7' })),
    ...classes.map((c) => ({ p: `/triedy/${c.slug}`, prio: '0.6' })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((e) => `<url><loc>${origin}${e.p}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<priority>${e.prio}</priority></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

// ---------- RSS feed ----------
function rssFeed(origin) {
  const escXml = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const toRfc822 = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00Z`).toUTCString();
  const items = news.map((n) => `<item><title>${escXml(n.title)}</title><link>${origin}/novinky/${n.slug}</link><guid isPermaLink="true">${origin}/novinky/${n.slug}</guid><pubDate>${toRfc822(n.date)}</pubDate><description>${escXml(n.perex)}</description></item>`).join('');
  const lastBuild = news[0] ? toRfc822(news[0].date) : new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>WoW Forever SK — Novinky</title><link>${origin}/novinky</link><description>Správy o World of Warcraft: Forever po slovensky.</description><language>sk</language><lastBuildDate>${lastBuild}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

// ---------- router ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) { url.hostname = url.hostname.slice(4); return Response.redirect(url.toString(), 301); }
    const origin = url.origin;
    let path = url.pathname.replace(/\/+$/, '') || '/';
    const now = Date.now();
    const m = (re) => path.match(re);

    if (path === '/robots.txt') return new Response(`User-agent: *\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`, { headers: { 'content-type': 'text/plain' } });
    if (path === '/sitemap.xml') return sitemap(origin);
    if (path === '/rss.xml') return rssFeed(origin);
    if (path === '/og.svg') return new Response(ogImage(), { headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
    if (path === '/admin') return admin(request, env, url, origin);
    if (path === '/guildy/pridat') {
      if (request.method === 'POST') return submitGuild(request, env, origin);
      return html(guildForm(origin, { ok: url.searchParams.get('ok') === '1' }), 200, { 'cache-control': 'no-store' });
    }
    if (path === '/guilda') {
      if (request.method === 'POST') return submitRecruit(request, env, origin);
      let count = 0;
      try { count = (await env.DB.prepare(`SELECT COUNT(*) AS c FROM recruits`).first())?.c || 0; } catch (e) {}
      return html(guildaPage(origin, count, { ok: url.searchParams.get('ok') === '1' }), 200, { 'cache-control': 'no-store' });
    }
    if (path === '/ankety') {
      if (request.method === 'POST') return submitVote(request, env, origin);
      const { voter, setCookie } = voterFrom(request);
      const pd = await pollData(env, voter);
      const headers = { 'cache-control': 'no-store', ...(setCookie ? { 'set-cookie': setCookie } : {}) };
      return html(pollsPage(origin, pd, url.searchParams.get('edit')), 200, headers);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });

    if (path === '/') {
      let rows = [];
      let recruitCount = 0;
      const { voter, setCookie } = voterFrom(request);
      const pd = await pollData(env, voter);
      try { rows = (await env.DB.prepare(`SELECT name, faction, realm, focus, lang FROM guilds WHERE status='approved' ORDER BY created_at DESC LIMIT 4`).all()).results || []; } catch (e) {}
      try { recruitCount = (await env.DB.prepare(`SELECT COUNT(*) AS c FROM recruits`).first())?.c || 0; } catch (e) {}
      const headers = { 'cache-control': 'no-store', ...(setCookie ? { 'set-cookie': setCookie } : {}) };
      return html(home(origin, now, rows, recruitCount, pd), 200, headers);
    }
    if (path === '/novinky') return html(newsList(origin));
    if (path === '/navody') return html(guideList(origin));
    if (path === '/triedy') return html(classList(origin));
    if (path === '/rasy') return html(raceList(origin));
    if (path === '/navody/talenty') return html(talentCalc(origin));
    if (path === '/navody/buildy') return html(buildsGuide(origin));
    if (path === '/o-nas') return html(about(origin));
    if (path === '/cz') return czStub(origin);
    if (path === '/guildy') return html(await guildList(env, url, origin), 200, { 'cache-control': 'public, max-age=60' });
    let r;
    if ((r = m(/^\/novinky\/([a-z0-9-]+)$/))) { const n = news.find((x) => x.slug === r[1]); if (n) return html(newsDetail(n, origin)); }
    if ((r = m(/^\/navody\/([a-z0-9-]+)$/))) { const g = guides.find((x) => x.slug === r[1]); if (g) return html(guideDetail(g, origin)); }
    if ((r = m(/^\/triedy\/([a-z0-9-]+)$/))) { const c = classBySlug[r[1]]; if (c) return html(classDetail(c, origin)); }
    return notFound(origin);
  },
};
