# RaidLead – Commands & To-Do

## Setup – ako pridať bota na server
1. **Vytvor bota:** discord.com/developers/applications → New Application → Bot → Reset Token → token do `.env` ako `DISCORD_TOKEN`.
2. **Pozvi na server:** OAuth2 → URL Generator → Scopes: `bot`, `applications.commands` → Permissions: Send Messages, Embed Links, Read Message History, Send TTS Messages, Connect, Speak → otvor odkaz → vyber server → Authorize (treba právo Manage Server).
3. **GUILD_ID:** Discord → Settings → Advanced → Developer Mode ON → pravý klik na server → Copy Server ID → do `.env`. (Príkazy sa potom objavia hneď.)
4. **Inštalácia:** FFmpeg (`winget install ffmpeg`), potom `pip install -r requirements.txt`.
5. **Spusti:** `python bot.py` → čakaj na `RaidLead online as …`.
6. **Do voice kanála:** pripoj sa do voice → v texte napíš `/join` → test `/sound name:melisko_1`.

Meliško klipy: `sounds/melisko_1..4.mp3` (z Lethal Company módu, bez licencie – len pre guildu). Premenuj na `pull_…`/`wipe_…`/`kill_…` pre auto-play.

## Strategy
| Command | Who | What it does |
|---|---|---|
| `/ask question:` | everyone | Ask anything about tactics; answers from the guild's strategies, in your language |
| `/strat boss:` | everyone | Show the full strategy for a boss |
| `/teach boss: note:` | officers | Add a tactic note to a boss (bot uses it from then on) |

## Raid sign-ups
| Command | Who | What it does |
|---|---|---|
| `/raid raid: time: note:` | officers | Post a sign-up card (Tank / Healer / DPS / Absent + class picker). Čas napr. `10.10. 20:00` → automatické pripomienky 60 a 15 min vopred |
| `/roster` | everyone | Show the latest raid's sign-ups |
| `/assign` | officers | AI writes boss-by-boss jobs (tanks, heal targets, Tranq Shot, banish, decurse…) from the roster |

## Dochádzka, štatistiky, progress
| Command | Who | What it does |
|---|---|---|
| `/raidend` | officers | Uzavrie otvorený raid: zapíše dochádzku, prítomní dostanú DKP za účasť (nastaviteľné) |
| `/stats player:` | everyone | Účasť (% z posledných 20 raidov) a loot hráča |
| `/progress` | everyone | Zabití bossovia MC/BWL/Ony (zapisuje sa pri `/wipe killed:True`) |

## Soft reserve & loot pravidlá
| Command | Who | What it does |
|---|---|---|
| `/sr item:` | everyone | Rezervuj item na najbližší raid (limit v nastaveniach, default 1) |
| `/srlist` | everyone | Kto si čo rezervoval (⚔️ = viac ľudí na 1 item) |
| `/srclear` | everyone | Zruš svoje SR |
| `/prio item:` | everyone | Dohodnutá priorita guildy + kto má SR |

Pri `/dkp loot` bot automaticky ukáže SR a prioritu itemu. Itemy a priority sú v `loot.json` (dopĺňajte).

## Profil hráča
| Command | Who | What it does |
|---|---|---|
| `/profile character: cls: role: spec:` | everyone | Nastav postavu; pri sign-upe sa trieda vyplní sama |
| `/attune raid: done:` | everyone | Označ attunement (MC, Onyxia, BWL) |
| `/me player:` | everyone | Profil: postava, DKP, účasť, loot, attunementy, SR |

## Live fight
| Command | Who | What it does |
|---|---|---|
| `/pull boss: countdown:` | officers | Countdown, then timed callouts (TTS) from `timelines.json` |
| `/phase number:` | officers | Announce a phase change (e.g. Onyxia P2/P3) |
| `/wipe killed:` | officers | Stop callouts; `killed:True` posts "Boss down!" with fight time |

## Voice & sounds
| Command | Who | What it does |
|---|---|---|
| `/join` | everyone | Bot joins your voice channel |
| `/leave` | everyone | Bot leaves voice |
| `/sound name:` | everyone | Play a clip from the `sounds` folder |
| `/sounds` | everyone | List all clips |

Sound packy = podpriečinky v `sounds/` (napr. `sounds/balls_of_steel/`), clip sa volá `pack/názov`.
Auto-play by file name in `sounds/` (aj v packoch): `pull*` on /pull, `wipe*` on /wipe, `kill*` on a kill, `join*` on /join (random if several).
Needs FFmpeg installed on the machine running the bot.

## Hlas (slovenský raid leader)
| Command | Who | What it does |
|---|---|---|
| `/say text:` | officers | Bot povie vetu nahlas vo voice |

Keď je bot vo voice (`/join`), callouty z `/pull` a `/phase` hovorí nahlas slovenským hlasom. Mužský/ženský hlas sa prepína v dashboarde → Nastavenia.

## DKP / loot
| Command | Who | What it does |
|---|---|---|
| `/dkp show player:` | everyone | DKP a posledné zmeny |
| `/dkp top` | everyone | Rebríček |
| `/dkp award amount: reason: player:` | officers | Pridá/uberie body; bez `player` celému prihlásenému raidu. Ide na schválenie do dashboardu |
| `/dkp loot item: min_bid:` | officers | Otvorí tajné bidovanie (60 s), víťazovi odpočíta DKP |
| `/dkp bid amount:` | everyone | Tajný bid na aktuálny item |

## Web dashboard – wow-forever.sk/raid
**Od 9. 10. 2026 je dashboard súčasťou webu** (repo `bocaksk-star/wow-forever.sk`, priečinok `src/raid/`), nie samostatný worker. Nasadí sa s každým pushom na `main`. Bot je v tom istom repe v `bot/`.
Heslom chránená stránka pre officerov (D1 `wow-forever-sk`, tabuľky `rl_state`, `rl_outbox`):
- **Prehľad** – najbližší raid, čakajúce schválenia, DKP top 5, rýchla správa / povedať vo voice
- **Raidy** – vytvoriť raid (bot pošle sign-up), vidieť prihlásených, odstrániť hráča, uzavrieť raid, DKP celému raidu
- **Schvaľovanie** – DKP a loot z Discordu sa pripíšu až po ✓ (dá sa vypnúť)
- **DKP** – pridať/ubrať body, rebríček
- **Loot** – spustiť bidovanie, história lootu
- **Oznámenia** – správa do kanála s @here/rolou, voliteľne aj nahlas
- **Nastavenia** – mužský/ženský hlas, schvaľovanie, pripomienky, Meliško zvuky, dĺžka bidovania, kanál
- **Štatistiky** – účasť %, loot, postavy, attunementy všetkých hráčov
- **História** – čo dashboard poslal botovi a výsledok
- Nastavenia navyše: DKP za účasť, počet soft reservov, DM pripomienky, auto Raider rola, meme mód, MVP minúty + bonus, trivia DKP
- Tlačidlo **Trivia** spustí kvíz v kanáli

Verejná stránka guildy: **wow-forever.sk/raid/guild** (raidy, progress, DKP + účasť, loot) – v menu webu pod Raidy. Dáta: `/raid/api/public`.
Osobná stránka hráča (Discord prihlásenie): **wow-forever.sk/raid/me** – DKP + história, účasť, attunementy, raidy so svojím sign-upom a SR, loot, wishlist, odznaky. Kalendár: **wow-forever.sk/raid/cal.ics**.
Stratégie k bossom sú verejne aj na webe: **wow-forever.sk/raidy** (MC, Onyxia, BWL), info o bote: **wow-forever.sk/raidy/raidlead**.

## Webový účet hráča – wow-forever.sk/raid/me
Hráč sa prihlási cez **Google** alebo **Discord** a všetko robí na webe: sign-up na raid (tank/healer/DPS/absent + trieda), soft reserve, postava a spec, attunementy, wishlist; vidí DKP + históriu, poradie, účasť, odznaky a loot. Discord ostáva na živé vedenie raidu (hlášky, pully, body).
- Google účet treba raz prepojiť s Discordom: v Discorde `/link` → 6-znakový kód → zadať na webe (alebo tlačidlo „Prepojiť cez Discord“, ak je Discord OAuth nastavený). Bez prepojenia sa nedá prihlásiť na raid.
- Akcie z webu idú cez `rl_outbox` do bota (`signup`, `signup_remove`, `profile_set`, `attune_set`, `sr_set`, `wishlist_set`, `link_done`); bot ich vykoná do ~8 s a prekreslí Discord kartu raidu. Ak je bot offline, čakajú vo fronte.
- Admin dashboard má záložku **Web účty** (prepojiť/odpojiť Discord ID, zmazať účet) a v karte raidu vie officer **prihlásiť hráča** ručne.
- Webové účty: D1 tabuľka `rl_accounts` (acct `google:<sub>` / `discord:<id>` → `discord_uid`).

| Command | Who | What it does |
|---|---|---|
| `/link` | everyone | Kód na prepojenie webového účtu s Discordom (platí 15 min) |

## Hráčske extra
| Command | Who | What it does |
|---|---|---|
| `/absent reason:` | everyone | Ospravedlním sa z najbližšieho raidu – účasť sa mi nezníži |
| `/wishlist add\|remove\|show` | everyone | Zoznam želaných itemov; bot ťa označí, keď ide takýto item do bidovania, a po výhre ho zo zoznamu zmaže |
| `/trade player: item: dkp:` | everyone | Daj svoj loot item inému hráčovi (voliteľne za DKP) |
| `/trivia start` / `/trivia top` | officers / everyone | Raid trivia kvíz (tlačidlá), správna odpoveď = bonus DKP (nastaviteľné, default 0); rebríček |
| `/guide topic:` | everyone | Sprievodca MC / Onyxia / BWL / začiatočník + consumables checklist |
| `/calendar` | everyone | Odkaz na .ics kalendár (Google / Apple / Outlook), raidy sa pridajú automaticky |
| `/web` | everyone | Odkaz na osobnú stránku `wow-forever.sk/raid/me` |
| `/achievements player:` | everyone | 16 odznakov (prvý raid, 100 % účasť, MVP, trivia majster…) |
| `/dm enabled:` | everyone | Zapni/vypni si súkromné DM pripomienky |

Automaticky:
- **DM pripomienky** pred raidom (nastavenie `dm_reminders`) + consumables checklist v pripomienke.
- **Raider rola** sa pridelí pri prihlásení (nastavenie `auto_role`) – bot musí mať právo **Manage Roles** a jeho rola musí byť nad Raider rolou.
- **MVP hlasovanie** po `/raidend` (`mvp_minutes`, bonus `mvp_dkp`) – hlasuje sa tlačidlami, víťaz dostane DKP.
- **Odznaky** sa vyhlasujú v kanáli automaticky.
- **Meme mód** (`meme_mode`) – bot občas okomentuje wipe vtipnou hláškou (`quips.json`).

## After the fight
| Command | Who | What it does |
|---|---|---|
| `/log link: fight:` | everyone | Analyze a Warcraft Logs pull: deaths, mistakes by name, top 3 fixes |

"Officers" = anyone with the Discord permission **Manage Messages**.

## Files
- `.env` – keys (DISCORD_TOKEN, ANTHROPIC_API_KEY, GUILD_ID, TTS_CALLOUTS, RAID_ROLE_ID, DASHBOARD_URL, DASHBOARD_KEY, ANNOUNCE_CHANNEL_ID, WCL_CLIENT_ID, WCL_CLIENT_SECRET, WCL_HOST)
- `strategies/*.md` – one file per boss (19: Onyxia, Molten Core, Blackwing Lair)
- `timelines.json` – callout timings, tune after real pulls
- `sounds/` – voice clips (see sounds/README.txt)
- `dkp.json` – DKP body (automaticky)
- `attendance.json`, `kills.json`, `profiles.json` – dochádzka, progress, profily
- `loot.json` – itemy a priority pre SR
- `ledger.json` – čakajúce schválenia + história lootu
- `settings.json` – nastavenia z dashboardu
- `raids.json` – sign-ups (created automatically)
- `players.json`, `achievements.json`, `trivia.json`, `quips.json`, `guides.json`, `timelines.json` – hráčske extra a obsah (trivia, hlášky, sprievodcovia, consumables)

## To do later (roadmapa)
**Nasadenie (iba Marian):**
1. Cloudflare → Workers & Pages → `wow-forever-sk` → Settings → Variables and Secrets:
   `ADMIN_PASSWORD`, `BOT_KEY` (ten istý do `bot/.env` ako `DASHBOARD_KEY`, `DASHBOARD_URL=https://wow-forever.sk/raid`).
2. **Google login**: console.cloud.google.com → APIs & Services → Credentials → Create OAuth client ID (Web application) → Authorized redirect URI `https://wow-forever.sk/raid/auth/google` → Client ID do `wrangler.toml` (`GOOGLE_CLIENT_ID`), Client Secret ako secret `GOOGLE_CLIENT_SECRET`. (OAuth consent screen: External, scope email/profile/openid.)
3. **Discord login** (voliteľné, kód `/link` funguje aj bez toho): discord.com/developers → aplikácia bota → OAuth2 → Redirects `https://wow-forever.sk/raid/auth/callback` → Client ID do `wrangler.toml` (`DISCORD_CLIENT_ID`), Client Secret ako secret `DISCORD_CLIENT_SECRET`.
4. Warcraft Logs: warcraftlogs.com → API Clients → create client (redirect `http://localhost`) → `WCL_CLIENT_ID` / `WCL_CLIENT_SECRET` do `.env`, prípadne `WCL_HOST`.
5. Klipy: Meliško (`sounds/melisko_*.mp3`) + Balls of Steel → premenovať na `pull_/wipe_/kill_/join_…` (ostávajú lokálne, necommitujú sa).
6. Host bota 24/7 na VPS (beží z `bot/`), pozvať s právom Manage Roles.
7. Testovací večer s guildou, doladiť `timelines.json`, `/teach` vlastné callouty.

**Ďalší vývoj (web + bot):**
- Verejná stránka guildy `/raid/guild` v dizajne webu (teraz samostatná stránka), prepojiť s `/raidy` stratégiami (boss → link).
- Raid detail na webe: roster podľa rolí, kto má SR na čo, attunement check prihlásených (kto nemá attune = varovanie).
- Notifikácie: e-mail (Google účet) pred raidom; pripomienka, že nie si prihlásený.
- Loot: wishlist ↔ loot.json priority, história bidov na webe, „kto čo vyhral“ po raide.
- DKP pravidlá verejne na webe (za účasť, za boss kill, decay) – stránka `/raidy/dkp`.
- Stratégie z bota (`strategies/*.md`) a z webu (`src/raids.js`) zjednotiť do jedného zdroja.
- Nové raidy Forever (Barrow Deeps, Hyjal Summit) do `RAID_BOSSES` + stratégie po štarte 9. 12.
- Bot: `/raid` z webu bez Discord kanála? (vyžaduje kanál) → nastavenie predvoleného kanála v dashboarde už je.
