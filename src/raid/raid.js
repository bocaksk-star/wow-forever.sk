import DASHBOARD from "./dashboard.html";
import GUILD from "./guild.html";
import PLAYER from "./player.html";

const ACTIONS = new Set([
  "announce", "approve", "reject", "award", "setting",
  "raid_create", "raid_close", "signup_remove", "loot_open", "say", "trivia",
]);
const SESSION_HOURS = 12;

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function makeSession(env) {
  const exp = Date.now() + SESSION_HOURS * 3600e3;
  return `${exp}.${await hmac(env.ADMIN_PASSWORD + ":rl-session", String(exp))}`;
}

async function isAdmin(req, env) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)rl_session=([^;]+)/);
  if (!m || !env.ADMIN_PASSWORD) return false;
  const [exp, sig] = m[1].split(".");
  if (!exp || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(env.ADMIN_PASSWORD + ":rl-session", exp));
}

// ---------- player sessions (Discord login) ----------
const PLAYER_HOURS = 24 * 14;
const b64 = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
const secretFor = (env, label) => `${env.BOT_KEY || ""}|${env.ADMIN_PASSWORD || ""}|${label}`;

async function makePlayerSession(env, user) {
  const payload = b64({ id: user.id, name: user.global_name || user.username, avatar: user.avatar || "", exp: Date.now() + PLAYER_HOURS * 3600e3 });
  return `${payload}.${await hmac(secretFor(env, "player"), payload)}`;
}

async function getPlayer(req, env) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)pl_session=([^;]+)/);
  if (!m || !env.BOT_KEY) return null;
  const [payload, sig] = m[1].split(".");
  if (!payload || !safeEqual(sig, await hmac(secretFor(env, "player"), payload))) return null;
  try {
    const u = unb64(payload);
    return u.exp > Date.now() ? u : null;
  } catch { return null; }
}

function cookie(name, value, maxAge) {
  return `${name}=${value}; Path=/raid; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

// ---------- calendar (.ics) ----------
const icsEsc = (t) => String(t ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const icsDate = (ts) => new Date(ts * 1000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function buildIcs(raids, host) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WoW Forever//RaidLead//SK", "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:WoW Forever raidy", "X-WR-TIMEZONE:Europe/Bratislava"];
  for (const r of raids) {
    if (!r.ts || r.closed) continue;
    lines.push("BEGIN:VEVENT", `UID:${r.id}@${host}`, `DTSTAMP:${icsDate(Date.now() / 1000)}`,
      `DTSTART:${icsDate(r.ts)}`, `DTEND:${icsDate(r.ts + 3 * 3600)}`,
      `SUMMARY:${icsEsc("⚔️ " + r.name)}`,
      `DESCRIPTION:${icsEsc((r.note ? r.note + "\n" : "") + "Sign-up v Discorde. Moj profil: https://" + host + "/raid/me")}`,
      "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(r.name + " o hodinu")}`, "END:VALARM",
      "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function isBot(req, env) {
  const auth = req.headers.get("authorization") || "";
  return !!env.BOT_KEY && safeEqual(auth, `Bearer ${env.BOT_KEY}`);
}

async function getState(env) {
  const row = await env.DB.prepare("SELECT v, t FROM rl_state WHERE k = 'bot'").first();
  if (!row) return { state: null, updated: 0 };
  return { state: JSON.parse(row.v), updated: row.t };
}

// RaidLead dashboard + verejné stránky guildy (DKP, raidy, profil hráča) — žije pod /raid.
// Zlúčené z pôvodného samostatného workera raidlead-dashboard do webu wow-forever.sk.
// Vracia Response, alebo null ak cesta nepatrí sem.
export async function handleRaid(req, env, url, path) {
  {

    // ---------- dashboard page ----------
    if (path === "/raid" && req.method === "GET") {
      return new Response(DASHBOARD, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
    }

    // ---------- login / logout ----------
    if (path === "/raid/api/login" && req.method === "POST") {
      const { password } = await req.json().catch(() => ({}));
      if (!env.ADMIN_PASSWORD || !safeEqual(String(password || ""), env.ADMIN_PASSWORD)) {
        await new Promise((r) => setTimeout(r, 800));
        return json({ ok: false, error: "Nesprávne heslo" }, 401);
      }
      return json({ ok: true }, 200, {
        "set-cookie": `rl_session=${await makeSession(env)}; Path=/raid; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`,
      });
    }
    if (path === "/raid/api/logout" && req.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": "rl_session=; Path=/raid; Max-Age=0" });
    }

    // ---------- public data for the website (no secrets) ----------
    if (path === "/raid/api/public" && req.method === "GET") {
      const { state, updated } = await getState(env);
      const profiles = state?.profiles || {};
      const raids = Object.entries(state?.raids || {}).map(([id, r]) => ({
        id, name: r.name, time: r.time, ts: r.ts, note: r.note || "", closed: !!r.closed,
        signups: Object.values(r.signups || {}).map((p) => ({ name: p.name, role: p.role, cls: p.cls })),
      }));
      const stats = state?.stats || {};
      const defs = state?.ach_defs || {};
      const dkp = Object.entries(state?.dkp || {})
        .map(([uid, p]) => ({
          name: profiles[uid]?.character || p.name, cls: profiles[uid]?.cls || "",
          points: p.points, attendance: stats[uid]?.pct ?? null,
          badges: (state?.players?.[uid]?.ach || []).map((k) => ({ icon: defs[k]?.icon || "", name: defs[k]?.name || k })),
        }))
        .sort((a, b) => b.points - a.points);
      const loot = (state?.loot_history || []).filter((l) => l.status === "approved").slice(-15).reverse()
        .map((l) => ({ item: l.item, name: profiles[l.uid]?.character || l.name, amount: l.amount, t: l.t }));
      const kills = state?.kills || {};
      const progress = Object.entries(state?.raid_bosses || {}).map(([raid, bosses]) => ({
        raid, total: bosses.length,
        bosses: bosses.map((b) => ({ boss: b, killed: !!kills[b], count: kills[b]?.count || 0 })),
      }));
      return json({ updated, raids, dkp, loot, progress }, 200, { "access-control-allow-origin": "*" });
    }

    // ---------- public guild page ----------
    if (path === "/raid/guild" && req.method === "GET") {
      return new Response(GUILD, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
      });
    }

    // ---------- public calendar ----------
    if (path === "/raid/cal.ics" && req.method === "GET") {
      const { state } = await getState(env);
      const raids = Object.entries(state?.raids || {}).map(([id, r]) => ({ id, ...r }));
      return new Response(buildIcs(raids, url.host), {
        headers: { "content-type": "text/calendar; charset=utf-8", "cache-control": "public, max-age=300",
          "content-disposition": 'inline; filename="raidy.ics"' },
      });
    }

    // ---------- player pages (Discord login) ----------
    if (path === "/raid/me" && req.method === "GET") {
      return new Response(PLAYER, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    }
    if (path === "/raid/login" && req.method === "GET") {
      if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
        return new Response("Discord prihlásenie ešte nie je nastavené (DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET).", { status: 503 });
      }
      const nonce = crypto.randomUUID();
      const auth = new URL("https://discord.com/oauth2/authorize");
      auth.search = new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, response_type: "code", scope: "identify",
        redirect_uri: `${url.origin}/raid/auth/callback`, state: nonce, prompt: "none" }).toString();
      return new Response(null, { status: 302, headers: { location: auth.toString(), "set-cookie": cookie("pl_state", nonce, 600) } });
    }
    if (path === "/raid/auth/callback" && req.method === "GET") {
      const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)pl_state=([^;]+)/);
      const code = url.searchParams.get("code");
      if (!m || !code || !safeEqual(m[1], url.searchParams.get("state") || "")) {
        return new Response("Prihlásenie zlyhalo (neplatný stav). Skús to znova.", { status: 400 });
      }
      const tok = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code", code, redirect_uri: `${url.origin}/raid/auth/callback` }),
      }).then((r) => r.json()).catch(() => ({}));
      if (!tok.access_token) return new Response("Prihlásenie zlyhalo (Discord odmietol kód).", { status: 400 });
      const user = await fetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${tok.access_token}` } })
        .then((r) => r.json()).catch(() => ({}));
      if (!user.id) return new Response("Prihlásenie zlyhalo (nepodarilo sa načítať profil).", { status: 400 });
      const headers = new Headers({ location: "/raid/me" });
      headers.append("set-cookie", cookie("pl_session", await makePlayerSession(env, user), PLAYER_HOURS * 3600));
      headers.append("set-cookie", cookie("pl_state", "", 0));
      return new Response(null, { status: 302, headers });
    }
    if (path === "/raid/api/pl-logout" && req.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": cookie("pl_session", "", 0) });
    }
    if (path === "/raid/api/me" && req.method === "GET") {
      const u = await getPlayer(req, env);
      if (!u) return json({ login: true }, 401);
      const { state, updated } = await getState(env);
      if (!state) return json({ user: u, known: false, updated });
      const uid = u.id;
      const stats = state.stats?.[uid] || null;
      const profile = state.profiles?.[uid] || null;
      const dkp = state.dkp?.[uid] || null;
      const extra = state.players?.[uid] || {};
      const raids = Object.entries(state.raids || {}).map(([id, r]) => ({
        id, name: r.name, time: r.time, ts: r.ts, note: r.note || "", closed: !!r.closed,
        mine: r.signups?.[uid] ? { role: r.signups[uid].role, cls: r.signups[uid].cls, reason: r.signups[uid].reason || "" } : null,
        sr: r.sr?.[uid]?.items || [], going: Object.values(r.signups || {}).filter((p) => p.role !== "absent").length,
      })).filter((r) => !r.closed).sort((a, b) => (a.ts || 9e12) - (b.ts || 9e12));
      const loot = (state.loot_history || []).filter((l) => l.uid === uid && l.status === "approved").slice(-15).reverse()
        .map((l) => ({ item: l.item, amount: l.amount, t: l.t, from: l.trade_from || "" }));
      return json({
        user: u, known: !!(stats || profile || dkp || extra.ach?.length), updated,
        profile, dkp: dkp ? { points: dkp.points, history: (dkp.history || []).slice(-10).reverse() } : { points: 0, history: [] },
        stats, loot, raids, wishlist: extra.wishlist || [], mvp: extra.mvp || 0, trivia: extra.trivia || 0,
        ach: extra.ach || [], ach_defs: state.ach_defs || {},
        rank: (() => { const all = Object.entries(state.dkp || {}).sort((a, b) => b[1].points - a[1].points).map(([k]) => k);
          const i = all.indexOf(uid); return i < 0 ? null : { pos: i + 1, of: all.length }; })(),
      });
    }

    // ---------- bot endpoints ----------
    if (path.startsWith("/raid/api/bot/")) {
      if (!isBot(req, env)) return json({ error: "unauthorized" }, 401);
      if (path === "/raid/api/bot/state" && req.method === "POST") {
        const body = await req.text();
        if (body.length > 900_000) return json({ error: "too large" }, 413);
        JSON.parse(body); // validate
        await env.DB.prepare("INSERT INTO rl_state (k, v, t) VALUES ('bot', ?1, ?2) ON CONFLICT(k) DO UPDATE SET v = ?1, t = ?2")
          .bind(body, Date.now()).run();
        return json({ ok: true });
      }
      if (path === "/raid/api/bot/outbox" && req.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, action FROM rl_outbox WHERE status = 'queued' ORDER BY id LIMIT 25").all();
        return json({ actions: results.map((r) => ({ id: r.id, ...JSON.parse(r.action) })) });
      }
      if (path === "/raid/api/bot/ack" && req.method === "POST") {
        const { results = [] } = await req.json();
        const stmt = env.DB.prepare("UPDATE rl_outbox SET status = ?1, result = ?2, done = ?3 WHERE id = ?4");
        await env.DB.batch(results.map((r) =>
          stmt.bind(r.ok ? "done" : "failed", String(r.message || "").slice(0, 500), Date.now(), r.id)));
        return json({ ok: true });
      }
      return json({ error: "not found" }, 404);
    }

    // ---------- admin endpoints ----------
    if (path.startsWith("/raid/api/")) {
      if (!(await isAdmin(req, env))) return json({ error: "login required" }, 401);

      if (path === "/raid/api/state" && req.method === "GET") {
        const { state, updated } = await getState(env);
        const { results } = await env.DB.prepare(
          "SELECT id, action, status, result, created, done FROM rl_outbox ORDER BY id DESC LIMIT 40").all();
        return json({
          state, updated, online: Date.now() - updated < 90_000,
          log: results.map((r) => ({ ...r, action: JSON.parse(r.action) })),
        });
      }
      if (path === "/raid/api/action" && req.method === "POST") {
        const action = await req.json().catch(() => null);
        if (!action || !ACTIONS.has(action.type)) return json({ error: "neznáma akcia" }, 400);
        const raw = JSON.stringify(action);
        if (raw.length > 4000) return json({ error: "príliš dlhé" }, 413);
        const r = await env.DB.prepare("INSERT INTO rl_outbox (action, created) VALUES (?1, ?2)")
          .bind(raw, Date.now()).run();
        return json({ ok: true, id: r.meta.last_row_id });
      }
      return json({ error: "not found" }, 404);
    }

    return null;
  }
}
