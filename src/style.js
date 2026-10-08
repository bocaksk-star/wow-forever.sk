export const CSS = `
:root{
  --night:#0F1528; --surface:#18203A; --surface-2:#1F2948; --line:#2D3860;
  --text:#E8E2D3; --muted:#A1A9C2; --gold:#E2AE4C; --gold-soft:#F0CB82;
  --alliance:#6A9BEB; --horde:#E0644D; --parchment:#EBDFC2; --parchment-2:#DFD0AC; --ink:#35261A; --ink-soft:#6B5338;
  --display:'Marcellus', Georgia, serif; --body:'Alegreya Sans', 'Segoe UI', sans-serif;
  --measure:68ch;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--night);color:var(--text);font-family:var(--body);font-size:1.125rem;line-height:1.6}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;
  background:radial-gradient(ellipse 80% 50% at 70% -10%, rgba(106,155,235,.16), transparent 60%),
             radial-gradient(ellipse 60% 40% at 0% 0%, rgba(226,174,76,.07), transparent 60%)}

/* Fixná krajina na pozadí — mesiac a hory ostávajú pri scrollovaní */
.world-bg{position:fixed;inset:0;z-index:-2;opacity:.6;filter:saturate(.85);transition:opacity 1.3s ease}
.world-bg svg{width:100%;height:100%;display:block}
.world-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg, rgba(10,14,28,.15) 0%, rgba(10,14,28,.55) 55%, var(--night) 100%)}
@media (max-width:720px){.world-bg{opacity:.4}}
/* Na hlavnej stránke sa mesiac/krajina ukáže až po scrollnutí */
body.home .world-bg{opacity:0}
body.home.scrolled .world-bg{opacity:.6}
@media (max-width:720px){body.home.scrolled .world-bg{opacity:.4}}
a{color:var(--gold-soft);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{color:var(--gold)}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:2px}
img{max-width:100%}
.wrap{max-width:1400px;margin:0 auto;padding:0 32px}
.bleed{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}
@media (max-width:900px){.wrap{padding:0 18px}}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:12px;background:var(--gold);color:var(--night);padding:8px 12px;z-index:9}

/* Hlavička */
.ic{display:inline-flex;flex:none}
.ic svg{display:block}
.top{background:#0C1022;position:sticky;top:0;z-index:5}
.top .wrap{max-width:none;display:flex;align-items:center;gap:24px;min-height:64px;flex-wrap:wrap;padding:0 24px}
.brand{font-family:var(--display);font-size:1.45rem;color:var(--text);text-decoration:none;letter-spacing:.01em;display:flex;align-items:center;gap:10px;transition:color .15s}
.brand:hover{color:var(--gold-soft)}
.brand svg{flex:none}
.brand span{color:var(--gold)}
.navtoggle{display:none;margin-left:auto;background:none;border:1px solid var(--line);border-radius:6px;color:var(--text);padding:7px;cursor:pointer}
.navtoggle:hover{border-color:var(--gold)}
.nav{display:flex;align-items:center;gap:4px 6px;flex-wrap:wrap;margin-left:auto}
.nav>a,.navgroup-trigger{color:var(--muted);text-decoration:none;font-size:1rem;padding:8px 10px;border-radius:7px;display:inline-flex;align-items:center;gap:7px;transition:color .15s,background .15s;position:relative;background:none;border:none;font:inherit;cursor:pointer}
.nav>a::after,.navgroup-trigger::after{content:"";position:absolute;left:10px;right:10px;bottom:3px;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:center;transition:transform .2s ease}
.nav>a .ic,.navgroup-trigger .ic{opacity:.7;transition:opacity .15s,transform .2s,filter .2s}
.nav>a:hover,.nav>a[aria-current="page"],.navgroup-trigger:hover,.navgroup-trigger[aria-current="page"],.navgroup.current>.navgroup-trigger{color:var(--text)}
.nav>a:hover::after,.nav>a[aria-current="page"]::after,.navgroup-trigger:hover::after,.navgroup-trigger[aria-current="page"]::after,.navgroup.current>.navgroup-trigger::after{transform:scaleX(1)}
.nav>a:hover .ic,.nav>a[aria-current="page"] .ic,.navgroup-trigger:hover .ic,.navgroup-trigger[aria-current="page"] .ic{opacity:1;color:var(--gold-soft);transform:scale(1.15);filter:drop-shadow(0 0 5px rgba(226,174,76,.55))}
.caret{font-size:.65em;opacity:.6;margin-left:-2px;transition:transform .2s}
.navgroup{position:relative}
.navgroup .dropdown{position:absolute;top:100%;left:0;margin-top:4px;min-width:200px;background:#141A33;border:1px solid var(--line);border-radius:10px;padding:6px;box-shadow:0 18px 36px rgba(0,0,0,.45);
  opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .16s ease,transform .16s ease,visibility .16s;z-index:6}
.navgroup:hover .dropdown,.navgroup:focus-within .dropdown{opacity:1;visibility:visible;transform:translateY(0)}
.navgroup:hover .caret,.navgroup:focus-within .caret{transform:rotate(180deg)}
.dropdown a{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:7px;color:var(--muted);text-decoration:none;font-size:.96rem;white-space:nowrap;transition:background .15s,color .15s}
.dropdown a:hover,.dropdown a[aria-current="page"]{background:var(--surface-2);color:var(--gold-soft)}
.dropdown a .ic{opacity:.8}
.lang{display:flex;align-items:center;gap:6px;font-family:var(--display);font-size:.85rem;letter-spacing:.04em;margin-left:14px;padding-left:14px;border-left:1px solid var(--line)}
.lang a{color:var(--muted);text-decoration:none;padding:3px 5px;border-radius:5px;transition:color .15s,background .15s}
.lang a:hover{color:var(--text)}
.lang a.on{color:var(--night);background:var(--gold-soft)}
.lang span{color:var(--line)}
@media (max-width:860px){
  .top{position:static}
  .navtoggle{display:inline-flex}
  .nav{margin-left:0;width:100%;max-height:0;overflow:hidden;flex-direction:column;align-items:stretch;gap:2px;transition:max-height .3s ease}
  .nav.open{max-height:900px;padding-bottom:10px}
  .nav>a,.navgroup-trigger{width:100%;padding:10px 4px;border-bottom:1px solid var(--line);border-radius:0;justify-content:flex-start}
  .nav>a::after,.navgroup-trigger::after{display:none}
  .nav>a[aria-current="page"],.nav>a:hover,.navgroup-trigger:hover{background:var(--surface)}
  .navgroup .dropdown{position:static;opacity:1;visibility:visible;transform:none;box-shadow:none;border:none;background:none;margin:0 0 0 14px;padding:0;display:none}
  .navgroup.current .dropdown,.navgroup:focus-within .dropdown{display:block}
  .navgroup-trigger{width:100%}
  .caret{margin-left:auto}
  .lang{margin-left:auto;padding-left:0;border-left:none}
}

/* Typografia */
h1,h2,h3{font-family:var(--display);font-weight:400;line-height:1.2;color:var(--text)}
h1{font-size:clamp(2rem,4.5vw,3rem);margin:0 0 .4em}
h2{font-size:1.6rem;margin:2em 0 .5em}
h3{font-size:1.25rem;margin:1.5em 0 .4em}
.lead{font-size:1.25rem;color:var(--muted);max-width:var(--measure);margin:0 0 1.5em}
.prose{max-width:var(--measure)}
.prose p,.prose li{color:var(--text)}
.prose li{margin:.3em 0}
.prose strong{color:#fff;font-weight:700}
.prose table,.table{width:100%;border-collapse:collapse;margin:1.2em 0;font-size:1rem}
.prose th,.prose td,.table th,.table td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.prose th,.table th{color:var(--muted);font-weight:500}
.tablewrap{overflow-x:auto}
main{padding:40px 0 80px}
.meta{color:var(--muted);font-size:.95rem}
.back{display:inline-block;margin-bottom:18px;font-size:1rem}

/* Hero: questlog, full-bleed */
.hero{position:relative;overflow:hidden;width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:0;margin-bottom:56px;padding:76px 0 68px}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg svg{width:100%;height:100%;display:block}
.hero-fade{position:absolute;inset:0;z-index:1;
  background:
    linear-gradient(180deg, #0C1022 0, rgba(12,16,34,0) 110px),
    linear-gradient(0deg, var(--night) 0, rgba(15,21,40,0) 130px),
    linear-gradient(100deg, rgba(8,11,22,.88) 0%, rgba(8,11,22,.6) 32%, rgba(8,11,22,.18) 58%, rgba(8,11,22,.1) 100%)}
.hero-grid{position:relative;z-index:2;max-width:1400px;margin:0 auto;padding:0 32px;display:grid;grid-template-columns:1.15fr .85fr;gap:64px;align-items:center}
@media (max-width:900px){.hero{padding:48px 0}.hero-grid{grid-template-columns:1fr;gap:28px;padding:0 18px}}
.hero .lead{margin-bottom:1.2em;font-size:1.35rem;max-width:42ch}

/* Centrálne logo/znak webu v hero sekcii */
.hero-emblem{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;max-width:1400px;margin:0 auto 40px;padding:0 32px}
@media (max-width:900px){.hero-emblem{padding:0 18px;margin-bottom:28px}}
.crest-badge{filter:drop-shadow(0 8px 20px rgba(0,0,0,.5));animation:crestIn 1.1s cubic-bezier(.22,1,.36,1) both}
.hero-emblem h1{display:flex;align-items:flex-end;justify-content:center;gap:16px;margin:4px 0 0;font-family:var(--display);font-weight:400;
  font-size:clamp(1.9rem,4.4vw,3.1rem);letter-spacing:.02em;color:var(--text);text-shadow:0 2px 24px rgba(0,0,0,.5)}
.hero-emblem h1 em{font-style:normal;background:linear-gradient(180deg, var(--gold-soft), var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent;
  display:inline-block;animation:slideInR .7s cubic-bezier(.22,1,.36,1) .68s both}
.hero-emblem h1 .word-wow{display:inline-block;animation:slideInL .7s cubic-bezier(.22,1,.36,1) .58s both}
.hero-emblem h1 b{font-weight:400;font-size:.38em;letter-spacing:.16em;color:var(--gold-soft);align-self:center;margin-left:2px;padding:3px 9px;border:1px solid rgba(226,174,76,.5);border-radius:6px;background:rgba(226,174,76,.08);
  display:inline-block;animation:popIn .5s cubic-bezier(.22,1,.36,1) .92s both}
.hero-emblem .rule{display:inline-flex;color:var(--gold);opacity:.75;align-self:center}
.hero-emblem h1 .rule:first-child{animation:slideInL .6s ease-out .48s both}
.hero-emblem h1 .rule:last-child{animation:slideInR .6s ease-out .82s both}
.hero-tagline{margin:2px 0 0;color:var(--muted);font-size:1.02rem;letter-spacing:.03em;animation:fadeUp .7s ease-out 1.05s both}
@media (max-width:640px){.hero-emblem h1{flex-wrap:wrap;gap:8px 10px}.hero-emblem .rule{display:none}}
@keyframes crestIn{0%{opacity:0;transform:scale(.3) rotate(-10deg)}65%{opacity:1;transform:scale(1.1) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes slideInL{0%{opacity:0;transform:translateX(-36px)}100%{opacity:1;transform:translateX(0)}}
@keyframes slideInR{0%{opacity:0;transform:translateX(36px)}100%{opacity:1;transform:translateX(0)}}
@keyframes popIn{0%{opacity:0;transform:scale(.5)}100%{opacity:1;transform:scale(1)}}
@keyframes fadeUp{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
@media (prefers-reduced-motion: reduce){.crest-badge,.hero-emblem h1 *,.hero-tagline{animation:none !important}}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:6px;font-weight:700;text-decoration:none;font-size:1.05rem;border:1px solid var(--gold);transition:background .15s,transform .15s,box-shadow .15s}
.btn.primary{background:var(--gold);color:#1A1306}
.btn.primary:hover{background:var(--gold-soft);color:#1A1306;transform:translateY(-1px);box-shadow:0 8px 20px rgba(226,174,76,.25)}
.btn.ghost{color:var(--gold-soft)}
.btn.ghost:hover{background:rgba(226,174,76,.1);transform:translateY(-1px)}

.quest{background:var(--parchment);color:var(--ink);border-radius:4px;padding:28px 30px 24px;position:relative;
  box-shadow:0 0 0 6px #2A2216,0 0 0 7px #8E6B35,0 24px 60px rgba(0,0,0,.45);
  background-image:radial-gradient(ellipse at 20% 0%,rgba(255,255,255,.45),transparent 50%),radial-gradient(ellipse at 100% 100%,rgba(140,100,50,.18),transparent 55%)}
.quest h2{font-family:var(--display);color:#5A3A12;font-size:1.55rem;margin:0 0 .5em}
.quest p{margin:0 0 1em;font-size:1.05rem;line-height:1.5}
.quest h3{font-family:var(--display);color:#5A3A12;font-size:1.05rem;margin:1.1em 0 .6em;display:flex;align-items:center;gap:7px}
.sparkle{display:inline-block;color:var(--gold);animation:sparkle 2.4s ease-in-out infinite}
@keyframes sparkle{0%,100%{opacity:.5;transform:scale(.85) rotate(0deg)}50%{opacity:1;transform:scale(1.15) rotate(15deg)}}
.countdown{display:flex;align-items:center;gap:8px}
.cd{flex:1;text-align:center;background:linear-gradient(180deg,#FFFBF0,#F1DFB4);border:2px solid #9C7A44;border-radius:12px;padding:10px 6px 9px;box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 3px 8px rgba(58,36,10,.18);transition:transform .2s}
.cd .ic{color:#8A6A2E;opacity:.8;margin-bottom:2px}
.cd b{display:block;font-family:var(--display);font-size:1.9rem;line-height:1;color:#2E1D08;font-variant-numeric:tabular-nums}
.cd b.tick{animation:tickbump .4s ease}
@keyframes tickbump{0%{transform:scale(1)}35%{transform:scale(1.22);color:#8E5A12}100%{transform:scale(1)}}
.cd small{display:block;margin-top:3px;font-size:.68rem;letter-spacing:.07em;text-transform:uppercase;color:#6B5338}
.sep{font-family:var(--display);font-size:1.6rem;color:#9C7A44;opacity:.6;margin-top:-16px}
.quest .reward{display:flex;gap:12px;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid rgba(90,58,18,.3);font-size:1rem}
.quest .reward .slot{width:44px;height:44px;border-radius:6px;background:#2A2216;border:2px solid #A88540;display:grid;place-items:center;flex:none}
.quest .done{font-family:var(--display);font-size:1.3rem;color:#3A240A}

/* Sekcie homepage */
.section{padding:8px 0 40px}
.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;border-bottom:1px solid var(--line);margin-bottom:8px}
.section-head h2{margin:0 0 .4em;display:flex;align-items:center;gap:10px;letter-spacing:.015em}
.ornament{color:var(--gold);opacity:.85}

/* Cameo pás tried — animované ikony inšpirované výberom postavy */
.cameo{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 6px;padding:18px 10px;margin:28px 0 4px}
.cameo a{--c:var(--gold);display:flex;flex-direction:column;align-items:center;gap:6px;width:72px;text-decoration:none;color:var(--muted);opacity:0;
  animation-name:cameoIn,bob;animation-duration:.6s,3.6s;animation-timing-function:cubic-bezier(.22,1,.36,1),ease-in-out;
  animation-delay:var(--e,0s),calc(var(--e,0s) + .6s + var(--d,0s));animation-fill-mode:both,none;animation-iteration-count:1,infinite}
@keyframes cameoIn{0%{opacity:0;transform:translateY(16px) scale(.7)}100%{opacity:1;transform:translateY(0) scale(1)}}
.cameo .badge{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:var(--c);background:color-mix(in srgb, var(--c) 14%, var(--surface));
  border:1px solid color-mix(in srgb, var(--c) 45%, var(--line));transition:transform .18s,box-shadow .18s,border-color .18s}
.cameo a:hover .badge{transform:scale(1.14) translateY(-2px);box-shadow:0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent),0 8px 18px rgba(0,0,0,.35);border-color:var(--c)}
.cameo span.name{font-size:.74rem;letter-spacing:.02em;transition:color .15s}
.cameo a:hover span.name{color:var(--c)}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@media (prefers-reduced-motion: reduce){.cameo a{animation:none;opacity:1}}

.guildcta{display:flex;align-items:center;gap:18px;padding:20px 24px;border-radius:12px;text-decoration:none;color:var(--text);
  background:linear-gradient(120deg, rgba(226,174,76,.14), rgba(106,155,235,.08)), var(--surface);
  border:1px solid rgba(226,174,76,.4);transition:transform .15s,box-shadow .15s,border-color .15s}
.guildcta:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,0,0,.32);border-color:rgba(226,174,76,.7)}
.guildcta .ic{flex:none;color:var(--gold);background:rgba(226,174,76,.14);border:1px solid rgba(226,174,76,.4);border-radius:10px;width:46px;height:46px;display:grid;place-items:center}
.guildcta b{font-family:var(--display);font-weight:400;font-size:1.25rem;color:var(--text)}
.guildcta p{margin:.25em 0 0;color:var(--muted);font-size:.98rem}
.guildcta p strong{color:var(--gold-soft);font-weight:600}
.guildcta .go{margin-left:auto;flex:none;font-family:var(--display);color:var(--gold-soft);white-space:nowrap}
@media (max-width:640px){.guildcta{flex-wrap:wrap}.guildcta .go{margin-left:62px}}
.signup-count{display:inline-flex;align-items:center;gap:8px;color:var(--gold-soft);font-size:.98rem;margin:0 0 1em}
.signup-count .ic{opacity:.9}
.newslist{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.newslist li{padding:16px 18px;border:1px solid var(--line);border-radius:10px;background:var(--surface);display:grid;grid-template-columns:62px 1fr;gap:18px;align-items:start;transition:transform .15s,background .15s,box-shadow .15s,border-color .15s}
.newslist li:hover{background:var(--surface-2);transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.3)}
.newslist li.new{border-color:rgba(226,174,76,.5)}
@media (max-width:600px){.newslist li{grid-template-columns:48px 1fr;gap:12px;padding:14px}}
.dbadge{display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:8px 0 6px;line-height:1}
.newslist li.new .dbadge{background:color-mix(in srgb, var(--gold) 16%, var(--surface-2));border-color:rgba(226,174,76,.55)}
.dbadge b{font-family:var(--display);font-size:1.5rem;color:var(--gold-soft);font-weight:400}
.dbadge span{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:2px}
.newslist a.t{font-family:var(--display);font-size:1.25rem;color:var(--text);text-decoration:none;line-height:1.3;display:inline-flex;align-items:center;flex-wrap:wrap;gap:10px}
.newslist a.t:hover{color:var(--gold-soft)}
.newslist p{margin:.4em 0 0;color:var(--muted);font-size:1rem}
.pill-new{font-family:var(--body);font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--night);background:var(--gold-soft);padding:2px 8px;border-radius:99px}

.two{display:grid;grid-template-columns:1fr 1fr;gap:40px}
@media (max-width:860px){.two{grid-template-columns:1fr}}
.linklist{list-style:none;padding:0;margin:0}
.linklist li{padding:14px 0;border-bottom:1px solid var(--line)}
.linklist a{font-family:var(--display);font-size:1.2rem;text-decoration:none;color:var(--text)}
.linklist a:hover{color:var(--gold-soft)}
.linklist p{margin:.2em 0 0;color:var(--muted);font-size:1rem}

.guide-grid{display:grid;gap:12px}
.guide-card{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border:1px solid var(--line);border-radius:10px;background:var(--surface);text-decoration:none;color:var(--text);transition:transform .15s,background .15s,box-shadow .15s}
.guide-card:hover{background:var(--surface-2);transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.3)}
.guide-card .ic{flex:none;margin-top:2px;color:var(--gold-soft);opacity:.9}
.guide-card b{display:block;font-family:var(--display);font-weight:400;font-size:1.1rem}
.guide-card p{margin:.3em 0 0;color:var(--muted);font-size:.95rem}

.timeline{list-style:none;margin:0;padding:0 0 0 20px;border-left:2px solid var(--line);display:grid;gap:18px}
.timeline li{position:relative}
.timeline .dot{position:absolute;left:-26px;top:3px;width:10px;height:10px;border-radius:99px;background:var(--line);border:2px solid var(--night)}
.timeline li.past{opacity:.5}
.timeline li.next .dot{background:var(--gold);box-shadow:0 0 0 4px rgba(226,174,76,.22)}
.timeline b{display:flex;align-items:center;gap:8px;color:var(--gold-soft);font-weight:500}
.timeline li.past b{color:var(--muted)}
.timeline em{font-style:normal;font-size:.68rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--night);background:var(--gold-soft);padding:2px 7px;border-radius:99px}
.timeline span{display:block;color:var(--muted);font-size:.95rem;margin-top:2px}

.guild-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.guild-list a{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);text-decoration:none;color:var(--text);transition:transform .15s,background .15s}
.guild-list a:hover{background:var(--surface-2);transform:translateY(-2px)}
.guild-list b{display:block;font-family:var(--display);font-weight:400;font-size:1.05rem}
.guild-list p{margin:.15em 0 0;color:var(--muted);font-size:.9rem}
.guild-list .tag{margin:0;flex:none}

/* Ankety */
.poll-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:16px}
.poll-grid.one{grid-template-columns:1fr;max-width:620px}
.poll-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:20px 22px}
.poll-card h3{margin:0 0 14px;display:flex;align-items:center;gap:9px;font-size:1.1rem}
.poll-card h3 .ic{color:var(--gold-soft);opacity:.9}
.poll-form{display:flex;flex-wrap:wrap;gap:8px}
.poll-opt{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:.95rem;color:var(--text);background:var(--surface-2);border:1px solid var(--line);border-radius:99px;padding:8px 15px;cursor:pointer;transition:border-color .15s,background .15s,transform .15s}
.poll-opt:hover{border-color:var(--gold);background:color-mix(in srgb, var(--gold) 12%, var(--surface-2));transform:translateY(-1px)}
.poll-opt .ic{color:var(--gold-soft);opacity:.85}
.poll-bars{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.poll-bars li{display:grid;grid-template-columns:140px 1fr 48px;align-items:center;gap:10px}
@media (max-width:480px){.poll-bars li{grid-template-columns:110px 1fr 40px;font-size:.92rem}}
.poll-bars .opt{display:flex;align-items:center;gap:7px;color:var(--text);font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.poll-bars .opt .ic{color:var(--gold-soft);opacity:.85;flex:none}
.poll-bars .bar{height:10px;border-radius:99px;background:var(--surface-2);overflow:hidden}
.poll-bars .fill{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg, var(--gold) 0%, var(--gold-soft) 100%);transition:width .5s ease}
.poll-bars .pct{text-align:right;color:var(--muted);font-size:.9rem;font-variant-numeric:tabular-nums}
.poll-total{margin:12px 0 0;color:var(--muted);font-size:.88rem}
.change-vote{display:inline-block;margin-top:8px;font-size:.88rem;color:var(--muted)}
.change-vote:hover{color:var(--gold-soft)}

/* Triedy a rasy */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin-top:20px}
.tile{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--c,var(--gold));border-radius:8px;padding:16px 18px;text-decoration:none;color:var(--text);display:block;transition:transform .15s,background .15s,box-shadow .15s}
a.tile:hover{background:var(--surface-2);transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.35)}
.tile h3{margin:0;font-size:1.3rem;color:var(--c,var(--text))}
.tile p{margin:0;color:var(--muted);font-size:.98rem}
.tile p.sub{margin:2px 0 8px}
.tile-head{display:flex;align-items:center;gap:10px;margin-bottom:2px}
.badge{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;flex:none;color:var(--c,var(--gold));background:color-mix(in srgb, var(--c,var(--gold)) 16%, var(--surface-2));border:1px solid color-mix(in srgb, var(--c,var(--gold)) 45%, var(--line))}
.badge.xl{width:52px;height:52px;border-radius:10px}
.badge.xl svg{width:28px;height:28px}
.detail-head{display:flex;align-items:center;gap:16px;margin-bottom:.3em}
.roles{display:flex;flex-wrap:wrap;gap:10px}
.role{display:inline-flex;align-items:center;gap:5px;font-size:.92rem;color:var(--muted)}
.role .ic{color:var(--gold-soft);opacity:.9}
td.roles{padding-top:12px}
.tag{display:inline-flex;align-items:center;gap:5px;font-size:.85rem;padding:2px 10px;border-radius:99px;border:1px solid var(--line);color:var(--muted);margin:6px 4px 0 0}
.tag .ic{opacity:.85}
.tag.a{color:var(--alliance);border-color:rgba(106,155,235,.5)}
.tag.h{color:var(--horde);border-color:rgba(224,100,77,.5)}
.tag.new{color:var(--gold-soft);border-color:rgba(226,174,76,.55)}
.tag.cls{color:var(--muted)}
.matrix td.yes{color:var(--text)}
.matrix td.new{color:var(--gold-soft);font-weight:700}
.matrix td.no{color:var(--line)}
.matrix th:first-child,.matrix td:first-child{white-space:nowrap}

/* Guildy */
.filters{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 8px;align-items:end}
.filters label{display:grid;gap:4px;font-size:.9rem;color:var(--muted)}
select,input,textarea{font:inherit;font-size:1rem;color:var(--text);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:9px 11px;min-width:0}
textarea{min-height:110px;resize:vertical}
select:focus,input:focus,textarea:focus{border-color:var(--gold);outline:none;box-shadow:0 0 0 3px rgba(226,174,76,.2)}
.guilds{display:grid;gap:14px;margin-top:18px}
.guild{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:18px 20px}
.guild h3{margin:0;font-size:1.35rem}
.guild p{margin:.5em 0 0;color:var(--text);font-size:1rem}
.guild .row{display:flex;flex-wrap:wrap;gap:4px 16px;color:var(--muted);font-size:.95rem;margin-top:8px}
.empty{border:1px dashed var(--line);border-radius:10px;padding:28px;text-align:center;color:var(--muted);display:grid;justify-items:center}
.empty .ic{color:var(--gold-soft);opacity:.6;margin-bottom:8px}
.empty p{margin:0 0 14px}
.form{display:grid;gap:16px;max-width:640px;margin-top:20px}
.form .f{display:grid;gap:6px}
.form .f span{font-size:.98rem}
.form .f small{color:var(--muted);font-size:.88rem}
.form .pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:600px){.form .pair{grid-template-columns:1fr}}
.hp{position:absolute;left:-9999px}
.notice{border-left:3px solid var(--gold);background:var(--surface);padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0}
.notice.err{border-color:var(--horde)}
button.btn{cursor:pointer;font-family:inherit}

/* Zdroje a pätička */
.sources{margin-top:2.5em;padding-top:1em;border-top:1px solid var(--line);font-size:.95rem;color:var(--muted)}
.sources ul{padding-left:1.1em}
footer{border-top:1px solid var(--line);padding:28px 0 40px;color:var(--muted);font-size:.92rem}
footer .wrap{display:grid;gap:8px}
.footer-top{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.crest{color:var(--gold)}
.brand-sm{font-family:var(--display);font-size:1.1rem;color:var(--text)}
.brand-sm span{color:var(--gold)}

/* Jemné iskry na pozadí */
.embers{position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden}
.embers i{position:absolute;bottom:-10px;width:3px;height:3px;border-radius:50%;background:var(--gold-soft);opacity:0;box-shadow:0 0 6px 1px rgba(226,174,76,.6);animation:rise linear infinite}
@keyframes rise{0%{transform:translateY(0) translateX(0);opacity:0}8%{opacity:.75}92%{opacity:.3}100%{transform:translateY(-110vh) translateX(var(--dx,20px));opacity:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;
