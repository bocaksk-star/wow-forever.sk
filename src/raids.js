// Raidy a stratégie k bossom — vlastný slovenský text. Mechaniky vychádzajú z pôvodného
// vanilla WoW; WoW Forever môže bossov doladiť, po štarte texty upresníme.

export const raids = [
  {
    slug: 'molten-core',
    name: 'Molten Core',
    short: 'MC',
    status: 'Klasický raid — vo Forever zatiaľ nepotvrdený',
    players: 40,
    where: 'Blackrock Mountain (vstup cez Blackrock Depths)',
    attune: 'Quest „Attunement to the Core" — v Blackrock Depths nájdeš Core Fragment pri lávovom jazere pred Molten Core a odovzdáš Lothosovi Riftwakerovi pri vstupe. Potom ťa teleportuje priamo dnu.',
    resist: 'Fire Resistance. Cieľ pre tankov ~150+, pre ostatných čo najviac bez straty základných statov. Oranžové lektvary (Greater Fire Protection Potion) sú povinné na Ragnarosa.',
    perex: 'Prvý veľký 40-man raid. Desať bossov v lávových jaskyniach pod Blackrock Mountain — ideálne miesto, kde sa guilda naučí hrať spolu.',
    intro: `<p>Molten Core je o disciplíne, nie o zložitých mechanikách. Väčšinu wipov spôsobí nepozornosť: niekto stojí v ohni, decursery nestíhajú, niekto pullne druhú skupinu trashu. Dva hlavné pravidlá: <strong>decurse/dispel okamžite</strong> a <strong>nikto nedáva DPS skôr, ako tank má aggro</strong>.</p>
<p><strong>Runy:</strong> Po zabití bossov sa dajú uhasiť runy (treba Aqual Quintessence z questu v Azshare), ktoré podmieňujú spawn Majordoma. Bez uhasenia všetkých 7 rún sa Majordomo neobjaví.</p>
<p><strong>Trash:</strong> Core Houndy sa navzájom oživujú — musia zomrieť do ~10 sekúnd od seba, inak sa zdvihnú. Zabíjajte ich AoE naraz. Firelordy nechajte tankovať ďalej od raidu kvôli Lava Spawnom.</p>`,
    bosses: [
      { slug: 'lucifron', name: 'Lucifron', body: `<p>Prvý boss, prichádza s dvoma Flamewaker Protectormi. Protektori majú Dominate Mind (ovládnu hráča) — tankujte ich ďalej od sebou, zabite ich prví.</p>
<ul>
<li><strong>Impending Doom</strong> — kliatba, po 10 s dá veľké tmavé dmg. Decurse ihneď, mágovia a druidi majú na starosti celý raid.</li>
<li><strong>Lucifron's Curse</strong> — zdvojnásobí cenu many/rage/energie. Tiež decurse.</li>
<li>Priesti dispelujú Shadow Shock, ale priorita sú kliatby.</li>
</ul>
<p><em>Tank:</em> Lucifrona ťahaj bokom, ťažké je len prežitie prvých sekúnd, keď sú všetky tri mobky nahnevané na jedného.</p>` },
      { slug: 'magmadar', name: 'Magmadar', body: `<p>Veľký core hound. Dve mechaniky: <strong>Frenzy</strong> (hunter musí Tranquilizing Shotom ihneď zrušiť, inak tank padá) a <strong>Panic</strong> (fear na všetkých v okolí).</p>
<ul>
<li>Hunteri: rotácia na Tranq Shot, minimálne dvaja s pevným poradím. Frenzy prichádza približne každých 15 s.</li>
<li>Tank: Fear Ward od dwarf priesta alebo Berserker Rage pred Panic. Ak tank padne na fear, off-tank preberá.</li>
<li>Všetci: Magmadar pľuje <strong>Lava Bomb</strong> na náhodných hráčov — vytvára oheň na zemi, okamžite z neho vyjdi.</li>
<li>Melee stojí pri zadných nohách, nie pred hlavou.</li>
</ul>` },
      { slug: 'gehennas', name: 'Gehennas', body: `<p>Prichádza s dvoma Flamewakermi, ktoré treba zabiť ako prvé (majú Fist of Ragnaros — stun). Potom boss.</p>
<ul>
<li><strong>Gehennas' Curse</strong> — znižuje liečenie o 75 %. Decurse má absolútnu prioritu, inak healeri nestíhajú tankov.</li>
<li><strong>Rain of Fire</strong> — oheň na zemi, vyjdi z neho.</li>
<li><strong>Shadow Bolt</strong> na náhodných hráčov, nič sa s tým nerobí, len sa lieči.</li>
</ul>
<p>Jednoduchý boss, ak decurseri fungujú. Ak sa raid wipuje, je to takmer vždy neodstránená kliatba.</p>` },
      { slug: 'garr', name: 'Garr', body: `<p>Garr má 8 Firesworn addov. Každý add po smrti vybuchne (Eruption — knockback a dmg okolo) a Garr po každom mŕtvom addovi získa buff (viac dmg a rýchlosť).</p>
<ul>
<li>Warlocki <strong>banishujú</strong> addov — ideálne 5–6 banishnutých a ostatné sa tankujú a zabíjajú postupne.</li>
<li>Addy zabíjajte ďalej od ostatných, výbuch zasiahne okolie. Melee odstupuje, keď add ide dole.</li>
<li>Garra tankuje main tank celý čas na mieste — Magnetic Pull priťahuje hráčov k nemu, tak sa nenechajte vytiahnuť.</li>
<li>Poradie: addy jeden po druhom, Garr naposledy. Nie naopak.</li>
</ul>` },
      { slug: 'baron-geddon', name: 'Baron Geddon', body: `<p>Boss, ktorý vás naučí reagovať. <strong>Living Bomb</strong> — náhodný hráč sa stane bombou a po 8 s vybuchne, vyhadzuje okolie do vzduchu. Označený hráč MUSÍ odbehnúť od raidu (dohodnuté miesto bokom).</p>
<ul>
<li><strong>Inferno</strong> — Geddon má aura dmg v okolí niekoľko sekúnd. Melee od neho odbieha, keď sa zacastí.</li>
<li><strong>Ignite Mana</strong> — pálí manu všetkým s manou okolo. Healeri a casteri stoja na max dosah.</li>
<li>Pri ~2 % HP Geddon <strong>vybuchne</strong> (Armageddon) — všetci preč, dobijú ho rangeri.</li>
</ul>
<p>Tip pre bombu: nech má každý pripravené tlačidlo na odbeh, bez diskusie. Jedna neskorá bomba = 10 mŕtvych.</p>` },
      { slug: 'shazzrah', name: 'Shazzrah', body: `<p>Mág-boss. <strong>Blink</strong> — teleportuje sa na náhodného hráča a zresetuje aggro, takže tank musí ihneď znova taunt-ovať a ostatní na sekundu zastavia DPS.</p>
<ul>
<li><strong>Shazzrah's Curse</strong> — hráč dostáva 100 % viac mágie. Decurse.</li>
<li><strong>Arcane Explosion</strong> okolo seba — melee drží odstup medzi výbuchmi, ranger stojí ďalej.</li>
<li><strong>Counterspell</strong> — casteri nekastujú dlhé cooldowny pri blinku.</li>
<li>Po blinku ho tankujú tí, ku komu skočil — druhý/tretí tank stojí rozmiestnený medzi raidom.</li>
</ul>` },
      { slug: 'sulfuron-harbinger', name: 'Sulfuron Harbinger', body: `<p>Prichádza so 4 Flamewaker Priestmi, ktorí sa navzájom liečia. Kľúč: <strong>interrupty</strong> a rozťahať ich od seba.</p>
<ul>
<li>Každý priest má svojho tanka a skupinu, zabíjajú sa po jednom, zvyšok sa interruptuje (Kick, Shield Bash, Counterspell, Earth Shock).</li>
<li>Priesti majú Shadow Word: Pain na raid — dispel.</li>
<li>Sulfuron samotný: <strong>Inspire</strong> (buffuje seba a addov — spell steal nie je, len ich zabite skôr), <strong>Demoralizing Shout</strong> a <strong>Flame Spear</strong>.</li>
<li>Keď sú priesti dole, boss je ľahký.</li>
</ul>` },
      { slug: 'golemagg', name: 'Golemagg the Incinerator', body: `<p>DPS check s dvoma Core Ragermi, ktorí sa <strong>liečia na plné</strong>, keď majú menej ako 50 % HP a sú vo vzdialenosti od Golemagga. Preto sa Ragery nezabíjajú — zomrú automaticky po Golemaggovi.</p>
<ul>
<li>Dva off-tanky odvedú Ragerov ďalej od raidu a držia ich. Nikto na ne nedáva DPS.</li>
<li>Main tank Golemagg: <strong>Magma Splash</strong> stackuje dmg na tankovi — tanky sa striedajú po ~10 stackoch.</li>
<li><strong>Pyroblast</strong> na náhodného hráča — fire resistance pomáha.</li>
<li>Pri 10 % <strong>Enrage</strong> — healeri šetria mana na posledný úsek.</li>
</ul>` },
      { slug: 'majordomo-executus', name: 'Majordomo Executus', body: `<p>Objaví sa len po uhasení všetkých 7 rún. Sám sa nedá zabiť — treba zabiť jeho 8 addov (4 Healeri, 4 Elite). Potom sa vzdá a otvorí prístup k Ragnarosovi.</p>
<ul>
<li>Addy sa <strong>striedajú v Magic Reflection a Damage Shield</strong> — sledujte, ktorý má aký štít. Casteri nekastujú na add s reflexiou, melee nebije add s damage shieldom.</li>
<li><strong>Healeri prví</strong> — liečia ostatných. Interruptujte ich.</li>
<li>Majordomo dáva <strong>Teleport</strong> do ohňa niekomu z raidu — rýchlo von, a <strong>Aegis of Ragnaros</strong> (štít na addoch).</li>
<li>Toto je boss, kde sa oplatí mať sheep/shackle na addoch, ktoré ešte nebijete.</li>
</ul>` },
      { slug: 'ragnaros', name: 'Ragnaros', body: `<p>Finálny boss. Má 2 fázy: 3 minúty Ragnaros, potom <strong>Sons of Flame</strong> (8 elementálov) na 90 s, a znova boss.</p>
<ul>
<li><strong>Wrath of Ragnaros</strong> — knockback melee do vzduchu. Melee sa po ňom rýchlo vracia, nebite z vonkajšej strany plošiny (padnete do lávy).</li>
<li><strong>Lava Burst / Elemental Fire</strong> — dmg v oblastiach, nestojte pred ním.</li>
<li><strong>Hammer of Ragnaros</strong> — hodí kladivo na hráča s najvyšším threatom okrem tankov. Healeri pozor na threat.</li>
<li><strong>Sons of Flame</strong>: AoE a frost nova, warlocki banish, mágovia frost. Nech vás nezastihnú rozdelených — všetci sa stiahnu k tankom.</li>
<li>Fire protection lektvary a Greater Fire Protection na všetkých, Fire Resistance Aura paladinov/Totem šamanov.</li>
</ul>
<p>Tip: ak Sons prídu dvakrát, je to DPS problém — zrýchlite poradie a popovať cooldowny na začiatku.</p>` },
    ],
  },
  {
    slug: 'onyxia',
    name: 'Onyxia',
    short: 'Ony',
    status: 'Vo Forever od 9. decembra 2026',
    players: 40,
    where: `Onyxia's Lair, Dustwallow Marsh`,
    attune: `Dlhý reťazec questov — Horda „Drakefire Amulet" z Thrallovej linky (Warlord's Command → … → Rend v UBRS), Aliancia linka cez Stormwind (Dragonkin Menace → … → Marshal Windsor). Po jeho dokončení dostaneš Drakefire Amulet.`,
    resist: 'Fire Resistance pomáha, ale nie je nutná ako na Ragnarosa. Hlavne sa vyhýbať ohňu.',
    perex: 'Jeden boss, tri fázy a najlepší test raidovej disciplíny v starom Azerothe. Onyxia odpúšťa málo — jedna chyba v pozícii a hlbokým dychom zomrie polovica raidu.',
    intro: `<p>Onyxia je legenda vďaka pozíciám. Celý boj je o tom, kde stojíš. <strong>Nikdy nestoj pred ňou</strong> (Flame Breath) ani <strong>za ňou</strong> (Tail Sweep — vyhodí ťa do whelpov). Správne miesto je bokom, pri nohe.</p>
<p>Pred bojom si rozdeľte: kto tankuje, kto stojí kde v 2. fáze, kto má na starosti whelpov. Pred pullom vyčistite jaskyňu od trashu.</p>`,
    bosses: [
      { slug: 'faza-1', name: 'Fáza 1 (100 – 65 %)', body: `<p>Onyxia na zemi. Tank ju zatiahne k zadnej stene a <strong>otočí hlavou k stene</strong> (tank stojí medzi ňou a stenou). Raid stojí po bokoch, nikto za chvostom ani pred hlavou.</p>
<ul>
<li><strong>Flame Breath</strong> — kužeľ dopredu. Nikto pred hlavou okrem tanka.</li>
<li><strong>Tail Sweep</strong> — za ňou. Kto tam stojí, odletí do whelpov.</li>
<li><strong>Wing Buffet</strong> — knockback a reset threatu. Tank si šetrí taunt, DPS po ňom na 2 s zastaví.</li>
<li>Melee stojí pri predných nohách, rangeri na stranách.</li>
</ul>` },
      { slug: 'faza-2', name: 'Fáza 2 (65 – 40 %)', body: `<p>Onyxia vzlietne. Toto je fáza, kde sa raidy wipujú.</p>
<ul>
<li><strong>Deep Breath</strong> — „Onyxia takes a deep breath…" — zapáli celú jednu časť miestnosti. Keď to vidíš, bež na najbližšiu stranu, kde nie je lava (strany miestnosti sú bezpečné, stred nie).</li>
<li><strong>Fireball</strong> — na náhodného hráča. Rozostupy, nech sa dmg nešíri.</li>
<li><strong>Whelpy</strong> — vybiehajú z bočných jaskýň. Off-tanky + AoE (mág Blizzard/Arcane Explosion, warlock Hellfire) ich zabijú. Nech sa nerozbehnú k healerom.</li>
<li>Rangeri DPS celú fázu. Hunteri a casteri — tu sa rozhoduje rýchlosť.</li>
</ul>
<p>Pravidlo: čím viac hráčov stojí bokom (nie v strede), tým menej deep breathov pôjde do raidu.</p>` },
      { slug: 'faza-3', name: 'Fáza 3 (40 – 0 %)', body: `<p>Pristáva, všetko z fázy 1 + <strong>Bellowing Roar</strong> (AoE fear na celý raid) a <strong>Eruption</strong> — zem pod raidom horí.</p>
<ul>
<li>Fear Ward na tankovi, Tremor Totem pri melee, Berserker Rage pripravený. Fear uprostred ohňa = smrť, takže hneď po feare vybehnúť z erupcie.</li>
<li>Whelpy stále prichádzajú — AoE skupina ostáva pri jaskyniach.</li>
<li>Healeri si držia manu práve na túto fázu. Nemíňajte ju v 2. fáze zbytočne.</li>
</ul>
<p>Keď padne, hlava Onyxie sa vešia v Orgrimmare / Stormwinde a celý server dostane buff. Tradičná odmena pre guildu.</p>` },
    ],
  },
  {
    slug: 'blackwing-lair',
    name: 'Blackwing Lair',
    short: 'BWL',
    status: 'Klasický raid — vo Forever zatiaľ nepotvrdený',
    players: 40,
    where: 'Blackrock Spire (vstup z vrcholu Upper Blackrock Spire)',
    attune: `Quest „Blackhand's Command" — v Upper Blackrock Spire dotkneš sa orbu za Generálom Drakkisathom (posledný boss UBRS). Treba to spraviť každému.`,
    resist: 'Fire Resistance ešte viac ako v MC. Na Vaelastrasza, Firemawa a Chromaggusa (podľa bréthov) je vysoký FR nutnosť. Bez ~150+ FR na všetkých sa BWL hrať nedá.',
    perex: 'Druhý 40-man raid, Nefarianov brloh. Oveľa náročnejšie mechaniky než Molten Core — tu už raid musí reagovať na náhodné veci a hrať ako jedno telo.',
    intro: `<p>BWL je pre guildu, ktorá má MC na farme. Bossovia sú citliví na pozície, vedia zmeniť „pravidlá" uprostred boja (Chromaggus, Nefarian) a trash je ťažší než niektoré MC bossy. Pri prvom prechode si rátajte s mnohými wipmi na Razorgora a Vaela.</p>
<p><strong>Trash:</strong> Death Talon Wyrmguardi majú spellov podľa triedy, ktorá ich bije (Shadow, Fire…), Blackwing Warlocki privolávajú Felguardov. Po každom bossovi bude trash pokojnejší.</p>`,
    bosses: [
      { slug: 'razorgore', name: 'Razorgore the Untamed', body: `<p>Dvojfázový boss. V 1. fáze <strong>ovládaš Razorgora cez orb</strong> a ničíš vajcia (30 kusov), kým raid drží prichádzajúcich mobov (orci, draconidi). V 2. fáze sa Razorgore uvoľní a bijete ho normálne.</p>
<ul>
<li><strong>Kontrola orbu</strong> — 1–2 hráči sa striedajú pri orbe (ovládanie trvá 90 s, prerušiť sa dá). Ovládaný Razorgore má Destroy Egg (zničiť vajce) a Conflagration (fear na mobov).</li>
<li>Raid zabíja <strong>mobov v rohoch</strong>: kasteri Blackwing Mage prví (Shadow Bolty), warriori sa tankujú. Shackle, sheep, fear — všetko používajte.</li>
<li>Keď sú všetky vajcia zničené, moby zmiznú a Razorgore sa pustí — tank ho preberá. Pozor na <strong>Conflagration</strong> (fear) a <strong>Fireball Volley</strong>.</li>
</ul>
<p>Najdôležitejšie: nenechať zomrieť hráča pri orbe a nenechať Razorgora dostať aggro počas ovládania (resetuje sa).</p>` },
      { slug: 'vaelastrasz', name: 'Vaelastrasz the Corrupt', body: `<p>DPS race. Vael dá celému raidu <strong>Essence of the Red</strong> — nekonečná mana/rage/energia 3 minúty. Zabite ho do 3 minút, inak enrage.</p>
<ul>
<li><strong>Burning Adrenaline</strong> — hráč dostane buff: dvojnásobný dmg, instant casty, ale po 20 s <strong>vybuchne</strong> a zomrie. Označený hráč dá maximum DPS a odbehne od raidu, aby výbuch nezabil ostatných.</li>
<li>Tankov to zasiahne tiež — preto treba <strong>3–4 tankov v poradí</strong>, ktorí si ho postupne preberajú.</li>
<li><strong>Flame Breath</strong> pred ním a <strong>Fire Nova</strong> okolo — melee sú v ohni stále, preto FR a healeri plný výkon.</li>
<li><strong>Cleave</strong> — nestoj pred ním.</li>
</ul>
<p>Pri 3 minútach treba cez 15k DPS celkovo (vanilla hodnoty). Potion, cooldowny, všetko hneď od začiatku.</p>` },
      { slug: 'broodlord', name: 'Broodlord Lashlayer', body: `<p>Po suppression room (ťažký trash s Suppression Devices, ktoré treba vypínať) prichádza Broodlord.</p>
<ul>
<li><strong>Mortal Strike</strong> — znižuje liečenie tanka o 50 %. Nedá sa dispel, len cez to preliečiť.</li>
<li><strong>Blast Wave</strong> — knockback a dmg okolo. Melee stojí pri nohách, rangeri stoja ďalej.</li>
<li><strong>Bone Shield</strong> — chvíľu berie menej dmg. Neplytvať cooldownami.</li>
<li>Tankujte ho na schodoch — raid stojí dole, Broodlorda si tank odnesie hore.</li>
</ul>` },
      { slug: 'firemaw', name: 'Firemaw', body: `<p>Prvý z troch drakov. Všetci traja majú <strong>Wing Buffet</strong> (knockback + threat reset) a <strong>Flame Buffet</strong> — stackujúci fire debuff na všetkých v dohľade.</p>
<ul>
<li>Flame Buffet stackuje a každý stack zvyšuje fire dmg — <strong>line of sight</strong>: rangeri a healeri sa schovajú za stĺpy/steny a vychádzajú len keď sa stacky resetnú.</li>
<li>Melee berú stacky stále — preto najvyšší FR v raidu na melee.</li>
<li>Wing Buffet: tanky striedajú, vždy jeden za hlavou v zálohe. Po buffete taunt.</li>
<li><strong>Shadow Flame</strong> — kužeľ pred ním. Nestoj pred ním, ak nemáš Onyxia Scale Cloak (bez neho je to instant smrť).</li>
</ul>` },
      { slug: 'ebonroc', name: 'Ebonroc', body: `<p>Druhý drak. Rovnaké Wing Buffet a Shadow Flame ako Firemaw, plus <strong>Shadow of Ebonroc</strong> — debuff na tankovi, pri ktorom sa Ebonroc lieči, keď bije tanka.</p>
<ul>
<li>Keď tank dostane Shadow of Ebonroc, <strong>druhý tank ihneď taunt-uje</strong> a prvý ustúpi. Potrebujete 3 tankov s čistým poradím.</li>
<li>Onyxia Scale Cloak na každom — Shadow Flame.</li>
<li>Jednoduchšie ako Firemaw, ak funguje rotácia tankov.</li>
</ul>` },
      { slug: 'flamegor', name: 'Flamegor', body: `<p>Tretí drak. Wing Buffet, Shadow Flame a <strong>Frenzy</strong> — hunteri Tranquilizing Shot rovnako ako na Magmadarovi.</p>
<ul>
<li><strong>Fire Nova</strong> — AoE okolo neho. Melee, zvlášť bez FR, to pocítia.</li>
<li>Hunteri: dvaja s rotáciou na Frenzy, neskorý Tranq = mŕtvy tank.</li>
<li>Tanky striedanie po Wing Buffete ako u ostatných.</li>
</ul>` },
      { slug: 'chromaggus', name: 'Chromaggus', body: `<p>Dvojhlavý „pes" s mechanikami, ktoré sa menia každý týždeň: 2 z 5 <strong>Breathov</strong> a 5 <strong>Brood Afflictions</strong> (po jednom za každý dračí rod).</p>
<ul>
<li><strong>Breathy</strong> (každý ~60 s, striedajú sa): Incinerate (fire), Corrosive Acid (nature + armor), Frost Burn (frost), Time Lapse (stun + threat), Ignite Flesh (fire bleed). Podľa týždňa sa prispôsobí resist gear.</li>
<li><strong>Brood Afflictions</strong>: Red (fire dmg, dá sa cure), Green (nature, Abolish/Cure Poison), Blue (frost, slow — Dispel Magic), Black (bezbranný vs. fire — Cure Disease), Bronze (náhodné stuny — jediná sa nedispelluje, len Hourglass Sand z trashu).</li>
<li>Ak má hráč <strong>všetkých 5</strong> naraz, stane sa z neho drakonid a bije raid. Preto neprestajne dispelovať — každý hráč hlási, čo má.</li>
<li><strong>Frenzy</strong> — Tranq Shot.</li>
<li>Pri 20 % <strong>Enrage</strong> — všetko na posledný úsek.</li>
</ul>
<p>Prvý „skutočne ťažký" boss v BWL. Nacvičte dispely na trashi vopred.</p>` },
      { slug: 'nefarian', name: 'Nefarian', body: `<p>Finálny boss, tri fázy. V 1. fáze prichádzajú drakonidi, v 2. Nefarian pristáva a hádže <strong>Class Calls</strong>, v 3. (20 %) oživí kosti drakonidov.</p>
<ul>
<li><strong>Fáza 1</strong> — z dvoch strán prichádzajú drakonidi (2 náhodné rody podľa týždňa) + Chromatic Drakonidy. AoE a tankovať v stredovom priestore. Trvá, kým nezabijete 42 kusov.</li>
<li><strong>Fáza 2</strong> — Nefarian. <strong>Shadow Flame</strong> (Onyxia Scale Cloak povinný), <strong>Bellowing Roar</strong> (fear), <strong>Veil of Shadow</strong> (znižuje liečenie na tankovi — dispel/cleanse).</li>
<li><strong>Class Calls</strong> každých ~30 s: Warriori sa zmenia na Berserker stance a nedajú si pomôcť, Mágovia polymorfujú seba/ostatných, Priestom liečenie škodí, Hunterom sa láme luk (odložiť pred callom), Warlocki spawnú infernalov, Druidi ostanú v cat forme, Šamani spawnú skazené totemy (hneď ich zabite), Paladini dajú Nefarianovi Blessing of Protection (melee ho chvíľu nemôže biť — casteri pokračujú), Rogue sa teleportnú k nemu a sú rootnutí. Každá trieda si musí vedieť, čo robiť.</li>
<li><strong>Fáza 3</strong> (20 %) — <strong>Raise Skeletons</strong>: kostry zo zabitých drakonidov. AoE tank, všetci ostatní na bossa. Posledný tlak.</li>
</ul>
<p>Nefarian je skúška, či raid vie reagovať na vlastnú triedu. Pri Class Calloch je lepšie, keď raid leader povie nahlas, čo nastalo — presne na to máme <a href="/raidy/raidlead">RaidLead</a>.</p>` },
    ],
  },
];

// Nové raidy Forever — stratégie doplníme po štarte, keď budú známe mechaniky.
export const upcomingRaids = [
  { name: 'Barrow Deeps', players: 10, note: 'Nový raid pod Hyjalom. Otvára sa 9. decembra 2026.' },
  { name: 'Hyjal Summit', players: 20, note: 'Nový raid na vrchole Hyjalu. Otvára sa 9. decembra 2026.' },
];

export const raidBySlug = (slug) => raids.find((r) => r.slug === slug);
