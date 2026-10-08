# wow-forever.sk

Slovenský fan web o World of Warcraft: Forever. Jeden Cloudflare Worker + D1 databáza `wow-forever-sk` (už vytvorená, tabuľka `guilds` je hotová).

## Nasadenie

1. **Doména do Cloudflare:** v Cloudflare dashboarde *Add a site* → `wow-forever.sk` (Free plán). U registrátora zmeň nameservery na tie dva, ktoré ti Cloudflare ukáže. Počkaj, kým bude zóna *Active*.
2. V tomto priečinku:
   ```
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put ADMIN_KEY
   ```
   Deploy pripojí `wow-forever.sk` aj `www.wow-forever.sk` (www sa presmeruje bez www).

Ak doména v Cloudflare ešte nie je aktívna, zakomentuj `routes` vo `wrangler.toml` a nasaď najprv na workers.dev.

## Správa

- Schvaľovanie guild: `https://wow-forever.sk/admin?key=TVOJ_ADMIN_KEY`
- Novinky, návody, triedy a rasy: `src/content.js` (novinky najnovšie hore), potom `npx wrangler deploy`.
- Lokálne: `npx wrangler d1 execute wow-forever-sk --local --file=schema.sql`, `.dev.vars` s `ADMIN_KEY=...`, `npx wrangler dev`.
