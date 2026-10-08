import { CSS } from './style.js';
import { news, guides, classes, races, LAUNCH_UTC, RAIDS_DATE } from './content.js';

// ---------- pomocné ----------
const MES = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
const skDate = (iso) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d}. ${MES[m - 1]} ${y}`; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
};

const GUIDE_ICON = {
  'ako-zacat': svg(`<path d="M5 3v18l15-9z" fill="currentColor" stroke="none"/>`, 20),
  'forever-vs-classic': svg(`<path d="M12 3v18M4 7l-2.5 5a3 3 0 0 0 5.5 0zM20 7l-2.5 5a3 3 0 0 0 5.5 0zM4 7h16M8 21h8" ${S}/>`, 20),
  'edicie-a-ceny': svg(`<circle cx="9" cy="9" r="6.5" ${S}/><circle cx="15" cy="15" r="6.5" ${S}/>`, 20),
  'novy-obsah': svg(`<path d="M9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5 9 3z" ${S}/><path d="M9 3v15M15 5.5v15" ${S}/>`, 20),
  faq: NAV_ICON.faq,
};
const guideIcon = (slug) => GUIDE_ICON[slug] || svg(`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" ${S}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" ${S}/>`, 20);

const CLASS_ICON = {
  warrior: svg(`<g transform="rotate(45 12 12)"><line x1="12" y1="2" x2="12" y2="15" ${S}/><line x1="8.5" y1="15" x2="15.5" y2="15" ${S}/><line x1="12" y1="15" x2="12" y2="20" ${S}/><circle cx="12" cy="20.5" r="1.3" fill="currentColor"/></g>`, 22),
  paladin: svg(`<rect x="7.5" y="2.5" width="9" height="5" rx="1" transform="rotate(45 12 5)" ${S}/><line x1="9.5" y1="8" x2="2" y2="21" ${S}/>`, 22),
  hunter: svg(`<path d="M6 2C6 2 10 11.5 6 21" ${S}/><line x1="6" y1="2" x2="21" y2="17" ${S}/><path d="M17 13l4 4-4 4" ${S}/>`, 22),
  rogue: svg(`<line x1="5" y1="20" x2="17" y2="8" ${S}/><path d="M14 5l5 5-3 1-2-2z" fill="currentColor" stroke="none"/><line x1="5" y1="20" x2="3" y2="22" ${S}/>`, 22),
  priest: svg(`<circle cx="12" cy="12" r="8.5" ${S}/><line x1="12" y1="7.5" x2="12" y2="16.5" ${S}/><line x1="7.5" y1="12" x2="16.5" y2="12" ${S}/>`, 22),
  shaman: svg(`<path d="M13 2 4 14h6l-1 8 10-13h-7l1-7z" fill="currentColor" stroke="none"/>`, 22),
  mage: svg(`<path d="M12 2l2.2 7.3L21 11l-6.8 1.7L12 20l-2.2-7.3L3 11l6.8-1.7z" fill="currentColor" stroke="none"/>`, 22),
  warlock: svg(`<path d="M12 2c2 3-1 4-1 7a3 3 0 1 0 6 0c0-1-.5-2-1-3 2 1.5 4 4.3 4 7.5a7 7 0 1 1-14 0C6 8 9 6 12 2z" fill="currentColor" stroke="none"/>`, 22),
  druid: svg(`<path d="M4 20C4 10 12 4 20 4c0 8-6 16-16 16z" ${S}/><line x1="4" y1="20" x2="14" y2="10" ${S}/>`, 22),
};

const ROLE_ICON = {
  Tank: svg(`<path d="M12 2 19 4.6v5.6c0 4.6-3.2 7.9-7 9.3-3.8-1.4-7-4.7-7-9.3V4.6z" ${S}/>`, 15),
  Heal: svg(`<circle cx="12" cy="12" r="8.5" ${S}/><line x1="12" y1="8" x2="12" y2="16" ${S}/><line x1="8" y1="12" x2="16" y2="12" ${S}/>`, 15),
  DPS: svg(`<g transform="rotate(45 12 12)"><line x1="12" y1="3" x2="12" y2="15" ${S}/><line x1="9" y1="15" x2="15" y2="15" ${S}/><line x1="12" y1="15" x2="12" y2="19" ${S}/></g>`, 15),
};
const roleIcons = (roles) => roles.map((r) => `<span class="role"><span class="ic">${ROLE_ICON[r] || ''}</span>${r}</span>`).join('');

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

const DIVIDER = svg(`<path d="M2 12 L9 12" ${S}/><path d="M23 12 L16 12" ${S}/><path d="M12 7 L15 12 12 17 9 12Z" fill="currentColor" stroke="none"/>`, 24, 'class="ornament"');

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

const NAV = [['/novinky', 'Novinky', 'novinky'], ['/navody', 'Návody', 'navody'], ['/triedy', 'Classy', 'triedy'], ['/rasy', 'Rasy', 'rasy'], ['/navody/edicie-a-ceny', 'Edície', 'edicie'], ['/guildy', 'Guildy CZ/SK', 'guildy'], ['/guilda', 'Naša guilda', 'guilda'], ['/navody/faq', 'FAQ', 'faq'], ['/o-nas', 'O webe', 'o-nas']];

function page({ title, desc, path, body, origin, noindex }) {
  const full = title ? `${title} | WoW Forever SK` : 'WoW Forever SK – novinky, návody a guildy po slovensky';
  const d = desc || 'Slovenský fan web o World of Warcraft: Forever. Novinky, návody, triedy, rasy a adresár CZ/SK guild.';
  const nav = NAV.map(([href, label, ic]) => `<a href="${href}"${path === href || path.startsWith(href + '/') ? ' aria-current="page"' : ''}><span class="ic">${NAV_ICON[ic]}</span>${label}</a>`).join('');
  const isHome = path === '/';
  const lang = `<div class="lang" aria-label="Jazyk verzie">
    <a href="/" class="on" title="Slovenská verzia">SK</a><span>/</span><a href="/cz" title="Česká verzia (pripravujeme)">CZ</a>
  </div>`;
  return `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title><meta name="description" content="${esc(d)}">
<link rel="canonical" href="${origin}${path}"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(d)}"><meta property="og:type" content="website"><meta property="og:locale" content="sk_SK">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="${FAVICON}"><meta name="theme-color" content="#0F1528">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Marcellus&display=swap&subset=latin-ext" rel="stylesheet">
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
    : 'Brány sa otvárajú o polnoci zo 4. na 5. novembra. Priprav si meno postavy, vyber triedu a nájdi guildu, aby si nešiel do Azerothu sám.';
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

function home(origin, now, guildRows, recruitCount = 0) {
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

  const body = `
<section class="hero">
  <div class="hero-bg">${heroArt()}</div>
  <div class="hero-fade"></div>
  <div class="hero-grid">
  <div>
    <h1>World of Warcraft: Forever po slovensky</h1>
    <p class="lead">Novinky, návody a adresár slovenských a českých guild pre novú verziu WoW, ktorá ostane na leveli 60 navždy.</p>
    <div class="btns"><a class="btn primary" href="/guildy"><span class="ic">${NAV_ICON.guildy}</span>Nájsť guildu</a><a class="btn ghost" href="/navody/ako-zacat"><span class="ic">${NAV_ICON.navody}</span>Ako začať</a></div>
  </div>
  ${questCard(now)}
  </div>
</section>
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
  const body = `<a class="back" href="/novinky">Späť na novinky</a><article class="prose"><h1>${esc(n.title)}</h1><p class="meta"><time datetime="${n.date}">${skDate(n.date)}</time></p><p class="lead">${esc(n.perex)}</p>${n.body}${src}</article>`;
  return page({ title: n.title, desc: n.perex, path: `/novinky/${n.slug}`, body, origin });
}

function guideList(origin) {
  const body = `<h1>Návody</h1><p class="lead">Všetko, čo potrebujete vedieť pred štartom a v prvých týždňoch.</p><ul class="linklist">${guides.map((x) => `<li><a href="/navody/${x.slug}">${esc(x.title)}</a><p>${esc(x.perex)}</p></li>`).join('')}<li><a href="/triedy">Triedy</a><p>Deväť tried, ich úlohy v skupine a ktoré rasy ich môžu hrať.</p></li><li><a href="/rasy">Rasy</a><p>Osem pôvodných rás, nová Skyborne a všetky nové kombinácie.</p></li></ul>`;
  return page({ title: 'Návody', desc: 'Slovenské návody k World of Warcraft: Forever.', path: '/navody', body, origin });
}

function guideDetail(g, origin) {
  const body = `<a class="back" href="/navody">Späť na návody</a><article class="prose"><h1>${esc(g.title)}</h1><p class="lead">${esc(g.perex)}</p><div class="tablewrap">${g.body}</div></article>`;
  return page({ title: g.title, desc: g.perex, path: `/navody/${g.slug}`, body, origin });
}

function racesForClass(slug) {
  return races.filter((r) => r.classes.includes(slug));
}

function classList(origin) {
  const tiles = classes.map((c) => `<a class="tile" href="/triedy/${c.slug}" style="--c:${c.color}"><div class="tile-head"><span class="badge" style="--c:${c.color}">${CLASS_ICON[c.slug] || ''}</span><h3>${c.name}</h3></div><p class="sub">${c.sk[0].toUpperCase() + c.sk.slice(1)}</p><p class="roles">${roleIcons(c.roles)}</p></a>`).join('');
  const body = `<h1>Triedy</h1><p class="lead">Deväť pôvodných tried. Vo Forever majú prepracované talenty, aby bola hrateľná každá špecializácia, a niektoré rasy dostali nové kombinácie.</p><div class="grid">${tiles}</div>
<h2>Ktorá rasa môže hrať ktorú triedu</h2>${matrix()}`;
  return page({ title: 'Triedy', desc: 'Prehľad tried vo WoW Forever: úlohy v skupine a dostupné rasy.', path: '/triedy', body, origin });
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
  const body = `<a class="back" href="/triedy">Späť na triedy</a><article class="prose">
<div class="detail-head"><span class="badge xl" style="--c:${c.color}">${CLASS_ICON[c.slug] || ''}</span><div><h1 style="color:${c.color};margin:0">${c.name}</h1><p class="sub" style="margin:.2em 0 0">${c.sk[0].toUpperCase() + c.sk.slice(1)}</p></div></div>
<p class="lead">${esc(c.desc)}</p>
<div class="tablewrap"><table><tbody><tr><th>Úloha v skupine</th><td class="roles">${roleIcons(c.roles)}</td></tr><tr><th>Brnenie</th><td>${c.armor}</td></tr></tbody></table></div>
<h2>Rasy, ktoré môžu hrať ${c.name}</h2><ul>${rs}</ul>
<p class="meta">Podrobný návod k talentom a rotácii doplníme po štarte, keď budú talenty z bety finálne.</p></article>`;
  return page({ title: `${c.name} (${c.sk})`, desc: `${c.name} vo WoW Forever: úloha v skupine, brnenie a dostupné rasy.`, path: `/triedy/${c.slug}`, body, origin });
}

function raceList(origin) {
  const tiles = races.map((r) => {
    const fac = r.faction === 'AH'
      ? `<span class="tag a">${FACTION_ICON.A}Aliancia</span><span class="tag h">${FACTION_ICON.H}Horda</span>`
      : `<span class="tag ${r.faction.toLowerCase()}">${FACTION_ICON[r.faction]}${FACTIONS[r.faction]}</span>`;
    const cls = r.classes.map((s) => `<span class="tag cls${r.newClasses.includes(s) && r.slug !== 'skyborne' ? ' new' : ''}"><span class="ic">${CLASS_ICON[s] || ''}</span>${classBySlug[s].name}</span>`).join('');
    return `<div class="tile" id="${r.slug}" style="--c:${r.faction === 'A' ? 'var(--alliance)' : r.faction === 'H' ? 'var(--horde)' : 'var(--gold)'}"><h3>${esc(r.name)}</h3><p>Štart: ${esc(r.start)}</p><div>${fac}</div><div>${cls}</div>${r.note ? `<p style="margin-top:8px">${esc(r.note)}</p>` : ''}</div>`;
  }).join('');
  const body = `<h1>Rasy</h1><p class="lead">Osem pôvodných rás a nová rasa Skyborne, ktorá si frakciu vyberá sama. Zlatou sú označené nové kombinácie rasy a triedy.</p><div class="grid">${tiles}</div><p class="meta" style="margin-top:20px">Podľa Warcraft Wiki k 8. 10. 2026, počas bety sa ešte môže zmeniť. Viac o Skyborne v <a href="/novinky/skyborne-nova-rasa">článku</a>.</p>`;
  return page({ title: 'Rasy', desc: 'Rasy vo WoW Forever vrátane novej rasy Skyborne a nových kombinácií s triedami.', path: '/rasy', body, origin });
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
<label class="f"><span>Trieda</span><select name="class"><option value="">Ešte neviem</option>${CLASS_OPT}</select></label>
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
<h2>Prihlásení do našej guildy (${recruits.length})</h2><div class="tablewrap"><table class="table"><thead><tr><th>#</th><th>Prezývka</th><th>Frakcia</th><th>Trieda</th><th>Zameranie</th><th>Kontakt</th><th>Odkaz</th><th>Kedy</th><th></th></tr></thead><tbody>${recruitRows || '<tr><td colspan="9">Zatiaľ sa nikto neprihlásil.</td></tr>'}</tbody></table></div>`;
  return html(page({ title: 'Administrácia', path: '/admin', origin, noindex: true, body }), 200, { 'cache-control': 'no-store' });
}

// ---------- sitemap ----------
function sitemap(origin) {
  const paths = ['/', '/novinky', '/navody', '/triedy', '/rasy', '/guildy', '/guildy/pridat', '/guilda', '/o-nas',
    ...news.map((n) => `/novinky/${n.slug}`), ...guides.map((g) => `/navody/${g.slug}`), ...classes.map((c) => `/triedy/${c.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
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
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });

    if (path === '/') {
      let rows = [];
      let recruitCount = 0;
      try { rows = (await env.DB.prepare(`SELECT name, faction, realm, focus, lang FROM guilds WHERE status='approved' ORDER BY created_at DESC LIMIT 4`).all()).results || []; } catch (e) {}
      try { recruitCount = (await env.DB.prepare(`SELECT COUNT(*) AS c FROM recruits`).first())?.c || 0; } catch (e) {}
      return html(home(origin, now, rows, recruitCount), 200, { 'cache-control': 'public, max-age=60' });
    }
    if (path === '/novinky') return html(newsList(origin));
    if (path === '/navody') return html(guideList(origin));
    if (path === '/triedy') return html(classList(origin));
    if (path === '/rasy') return html(raceList(origin));
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
