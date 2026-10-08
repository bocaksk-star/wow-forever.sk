// Český obsah webu wow-forever.sk — vlastní, původní český text (ne strojový překlad slovenštiny).
// Zámerně jen klíčové evergreen stránky, ne celý web; zbytek webu zůstává slovensky.

export const czHome = {
  title: 'World of Warcraft: Forever česky — novinky a návody',
  desc: 'Český přehled o World of Warcraft: Forever — nová „Classic Plus" verze WoW, která zůstává na levelu 60 napořád. Datum vydání, novinky a odkaz na slovenské návody a adresář guild.',
  body: `
<h1>World of Warcraft: Forever — česky</h1>
<p class="lead">World of Warcraft: Forever je nová, třetí samostatná větev WoW vedle moderní hry a Classicu. Odehrává se v původním vanilla Azerothu, level zůstává napořád na 60 a hra postupně přibývá do šířky — nikoliv přes datadisky.</p>
<h2>Kdy hra vychází</h2>
<p>WoW Forever vychází <strong>4. listopadu 2026 v 15:00 PST</strong>, což je v Česku a na Slovensku <strong>půlnoc ze 4. na 5. listopadu</strong>. Ke hraní stačí běžné předplatné WoW nebo Game Time — žádná samostatná koupě hry není potřeba.</p>
<h2>Co je ve Forever nového</h2>
<ul>
<li>Více než 1000 nových questů a nové zóny (Mount Hyjal, Zephras Isle, Riverglades a další)</li>
<li>Devět nových dungeonů a dva nové raidy, které se otevírají postupně po startu</li>
<li>Nová rasa <strong>Skyborne</strong>, která si sama volí frakci (Aliance, nebo Horda)</li>
<li>Přepracované talenty, aby byla hratelná každá specializace</li>
<li>Jeden velký „mega-realm" na pravidla (Normal, PvP, RP) v každém regionu</li>
</ul>
<h2>Čeština a slovenština</h2>
<p>Samotná hra vyjde pouze v angličtině. Tento web proto přináší alespoň novinky a návody ve slovenštině — jazyce, kterému čeští hráči bez problémů rozumí — a tuto stránku navíc i česky. Postupně přidáváme další česky psaný obsah.</p>
<div class="btns"><a class="btn primary" href="/cz/navody/jak-zacit">Jak začít hrát (česky)</a><a class="btn ghost" href="/guildy">Adresář CZ/SK guild</a></div>
<h2>Časté otázky</h2>
<p>Odpovědi na nejčastější otázky — musím si hru kupovat, přenese se postava z Classicu a další — najdete v naší <a href="/cz/navody/caste-otazky">česky psané FAQ</a>.</p>
<h2>Více obsahu</h2>
<p>Zbytek webu — aktuální novinky, přehled všech devíti povolání, ras a vlastní talentová kalkulačka — je zatím ve slovenštině, která je pro české hráče snadno srozumitelná. Najdete je přes <a href="/">slovenskou verzi webu</a>.</p>`,
};

export const czGuides = [
  {
    slug: 'jak-zacit',
    skSlug: 'ako-zacat',
    title: 'Jak začít hrát WoW Forever',
    perex: 'Od účtu Battle.net po první quest: co potřebujete a na co si dát pozor první večer.',
    body: `
<p>WoW Forever není samostatná hra ke koupi. Stačí aktivní předplatné WoW nebo Game Time, které platí pro všechny verze WoW najednou.</p>
<h2>Co potřebujete</h2>
<ol>
<li><strong>Účet Battle.net.</strong> Pokud hrajete Classic nebo moderní WoW, už ho máte.</li>
<li><strong>Předplatné nebo Game Time.</strong> Koupíte na Battle.net, cena je stejná jako u běžného WoW.</li>
<li><strong>Launcher Battle.net.</strong> V horním rozbalovacím menu nad tlačítkem „Hrát" vyberte verzi <em>World of Warcraft: Forever</em> a nainstalujte ji.</li>
</ol>
<h2>První večer</h2>
<ol>
<li><strong>Vyberte typ realmu.</strong> V Evropě bude jeden velký realm na každá pravidla: Normal, PvP nebo RP. Hardcore přijde později.</li>
<li><strong>Vytvořte postavu.</strong> Ve Forever má postava jméno i příjmení. Pokud nevíte, jaké povolání zvolit, podívejte se na <a href="/triedy">přehled povolání</a> (slovensky).</li>
<li><strong>Najděte si guildu.</strong> Ve vanilla světě se věci dělají společně. Slovenské a české guildy jsou v našem <a href="/guildy">adresáři</a>.</li>
</ol>
<h2>Na co si zvyknout</h2>
<ul>
<li>Neexistuje létání ani level scaling. Zóny mají pevný level a cesty trvají.</li>
<li>Level 60 je strop napořád. Dohnat ostatní se dá jen levelováním.</li>
<li>Na EU realmech se v chatu mluví hlavně anglicky. S guildou se domluvíte na Discordu.</li>
<li>Start bude přeplněný. Počítejte s frontami při přihlášení a plnými startovními zónami.</li>
</ul>`,
  },
  {
    slug: 'caste-otazky',
    skSlug: 'faq',
    title: 'Časté otázky o WoW Forever',
    perex: 'Krátké odpovědi na to, co se ptá každý, kdo o Forever slyší poprvé.',
    body: `
<h2>Kdy přesně vychází?</h2>
<p>4. listopadu 2026 v 15:00 PST. V Česku a na Slovensku je to půlnoc ze středy 4. na čtvrtek 5. listopadu.</p>
<h2>Musím si hru koupit?</h2>
<p>Ne. Stačí předplatné WoW nebo Game Time. Kupuje se jen rasa Skyborne a kosmetika v balíčcích.</p>
<h2>Přenesu si postavu z Classicu?</h2>
<p>Ne. Forever začíná od nuly a postavy z jiných verzí WoW se sem nedají přenést.</p>
<h2>Přenese se postup z bety?</h2>
<p>Ne. Beta realmy se po skončení bety smažou.</p>
<h2>Bude level vyšší než 60?</h2>
<p>Ne. Blizzard mluví o levelu 60 napořád a novém obsahu do šířky.</p>
<h2>Bude Hardcore?</h2>
<p>Ano, podle roadmapy v zimě 2026. Při startu budou realmy Normal, PvP a RP.</p>
<h2>Je hra v češtině nebo slovenštině?</h2>
<p>Ne. Hra je v angličtině. Proto děláme tento web: novinky a návody slovensky, vybrané stránky i česky.</p>
<h2>Kde najdu slovenskou nebo českou guildu?</h2>
<p>V našem <a href="/guildy">adresáři CZ/SK guild</a>. Pokud guildu vedete, <a href="/guildy/pridat">přidejte ji</a> zdarma.</p>`,
  },
];
