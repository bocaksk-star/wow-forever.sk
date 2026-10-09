# RaidLead – AI raid leader pre Discord

Python bot (discord.py + Claude API), ktorý vedie raidy našej guildy vo WoW Forever.
Zoznam príkazov: [COMMANDS.md](COMMANDS.md). Stratégie k bossom: `strategies/*.md`
(verejná verzia je na webe: https://wow-forever.sk/raidy).

## Spustenie
```
cd bot
pip install -r requirements.txt      # + FFmpeg pre voice (winget install ffmpeg)
copy .env.example .env               # doplniť DISCORD_TOKEN, ANTHROPIC_API_KEY, GUILD_ID, …
python bot.py
```

## Web dashboard – wow-forever.sk/raid
Dashboard už nie je samostatný worker – je súčasťou webu (`src/raid/`) a nasadí sa
s každým pushom na `main`. Rovnaká D1 databáza (`rl_state`, `rl_outbox`).

- `/raid` – admin dashboard pre officerov (heslo = secret `ADMIN_PASSWORD`)
- `/raid/guild` – verejná stránka guildy: raidy, progress, DKP rebríček, loot
- `/raid/me` – osobná stránka hráča (Discord prihlásenie)
- `/raid/cal.ics` – kalendár raidov
- `/raid/api/public` – verejné dáta (JSON)

Jednorazové nastavenie (Cloudflare → Workers → wow-forever-sk → Settings → Variables and Secrets):
1. `ADMIN_PASSWORD` – heslo do dashboardu.
2. `BOT_KEY` – dlhý náhodný reťazec. Ten istý daj do `bot/.env` ako `DASHBOARD_KEY`
   (`DASHBOARD_URL=https://wow-forever.sk/raid`). Reštart bota → v dashboarde svieti „online“.
3. Discord prihlásenie: discord.com/developers → aplikácia bota → OAuth2 → Redirects:
   `https://wow-forever.sk/raid/auth/callback`; Client ID do `wrangler.toml` (`DISCORD_CLIENT_ID`),
   Client Secret ako secret `DISCORD_CLIENT_SECRET`.

## Čo sa necommituje (.gitignore)
`.env`, runtime JSON (dkp, raids, attendance, …) a zvukové klipy v `sounds/` (repo je verejné,
klipy sú bez licencie – ostávajú len lokálne).
