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
Heslom chránená stránka pre officerov (worker `raidlead-dashboard`, D1 `wow-forever-sk`):
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

Verejná stránka guildy: **wow-forever.sk/raid/guild** (raidy, progress, DKP + účasť, loot). Dáta: `/raid/api/public`.
Osobná stránka hráča (Discord prihlásenie): **wow-forever.sk/raid/me** – DKP + história, účasť, attunementy, raidy so svojím sign-upom a SR, loot, wishlist, odznaky. Kalendár: **wow-forever.sk/raid/cal.ics**.
Nasadenie: pozri `raidlead-dashboard/README.md`.

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

## To do later
0. Klipy: Meliško (`sounds/melisko_*.mp3` už sú) + Balls of Steel (`sounds/balls_of_steel/`) – pridať a premenovať na `pull_/wipe_/kill_/join_…`.
1. Warcraft Logs setup: warcraftlogs.com → API Clients → create client (redirect URL `http://localhost`) → put ID/secret into `.env` → set `WCL_HOST` if your realm's logs are on another WCL site (e.g. classic.warcraftlogs.com).
2. Test evening with a few guildies; tune `timelines.json`; `/teach` your own calls.
3. Host 24/7 on a cheap VPS.
4. Nasadiť dashboard (`npx wrangler deploy`, secrets ADMIN_PASSWORD + BOT_KEY) a dať DASHBOARD_KEY botovi.
5. Nalinkovať verejnú stránku wow-forever.sk/raid/guild z menu webu.
6. Discord OAuth pre `/raid/me`: discord.com/developers → aplikácia → OAuth2 → Redirects: `https://wow-forever.sk/raid/auth/callback`; Client ID do `wrangler.toml` (`DISCORD_CLIENT_ID`), `npx wrangler secret put DISCORD_CLIENT_SECRET`, `npx wrangler deploy`.
7. Pozvať bota s právom Manage Roles (auto Raider rola).
