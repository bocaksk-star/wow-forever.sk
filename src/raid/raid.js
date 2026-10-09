// RaidLead dashboard + verejné stránky guildy (DKP, raidy, profil hráča) — žije pod /raid.
// Zlúčené z pôvodného samostatného workera raidlead-dashboard do webu wow-forever.sk.
//
// Model: bot je zdroj pravdy (JSON súbory). Každých pár sekúnd pushne celý stav do rl_state
// a vyberie si z rl_outbox akcie, ktoré má vykonať (z admin dashboardu aj od hráčov z webu).
// Webové účty (Google / Discord) sú v rl_accounts a mapujú sa na Discord ID hráča.

import DASHBOARD from "./dashboard.html";
import GUILD from "./guild.html";
import PLAYER from "./player.html";

const ADMIN_ACTIONS = new Set([
  "announce", "approve", "reject", "award", "setting",
  "raid_create", "raid_close", "signup_remove", "signup", "loot_open", "say", "trivia", "profile_set",
]);
const CLASSES = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman", "Mage", "Warlock", "Druid"];
const ROLES = ["tank", "healer", "dps", "absent"];
const ATTUNES = { mc: "Molten Core", ony: "Onyxia", bwl: "Blackwing Lair" };
const SESSION_HOURS = 12;
const PLAYER_HOURS = 24 * 14;

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
const html = (body, cache = "no-store") => new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache } });
const redirect = (location, extraHeaders = []) => {
  const h = new Headers({ location });
  for (const [k, v] of extraHeaders) h.append(k, v);
  return new Response(null, { status: 302, headers: h });
};

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

const getCookie = (req, name) => (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] || "";
const cookie = (name, value, maxAge, sameSite = "Lax") => `${name}=${value}; Path=/raid; HttpOnly; Secure; SameSite=${sameSite}; Max-Age=${maxAge}`;

// ---------- admin session ----------
async function makeSession(env) {
  const exp = Date.now() + SESSION_HOURS * 3600e3;
  return `${exp}.${await hmac(env.ADMIN_PASSWORD + ":rl-session", String(exp))}`;
}
async function isAdmin(req, env) {
  const v = getCookie(req, "rl_session");
  if (!v || !env.ADMIN_PASSWORD) return false;
  const [exp, sig] = v.split(".");
  if (!exp || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(env.ADMIN_PASSWORD + ":rl-session", exp));
}

// ---------- player sessions (Google / Discord) ----------
const b64 = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
const secretFor = (env, label) => `${env.BOT_KEY || ""}|${env.ADMIN_PASSWORD || ""}|${label}`;

// session payload: { acct: 'google:<sub>' | 'discord:<id>', id: discordUid|null, name, avatar, exp }
async function makePlayerSession(env, u) {
  const payload = b64({ acct: u.acct, id: u.id || null, name: u.name, avatar: u.avatar || "", exp: Date.now() + PLAYER_HOURS * 3600e3 });
  return `${payload}.${await hmac(secretFor(env, "player"), payload)}`;
}
async function getPlayer(req, env) {
  const v = getCookie(req, "pl_session");
  if (!v || !env.BOT_KEY) return null;
  const [payload, sig] = v.split(".");
  if (!payload || !safeEqual(sig, await hmac(secretFor(env, "player"), payload))) return null;
  try {
    const u = unb64(payload);
    return u.exp > Date.now() ? u : null;
  } catch { return null; }
}
const sessionHeaders = async (env, u) => [["set-cookie", cookie("pl_session", await makePlayerSession(env, u), PLAYER_HOURS * 3600)]];

// ---------- accounts (D1 rl_accounts) ----------
async function getAccount(env, acct) {
  return env.DB.prepare("SELECT acct, discord_uid, name, email, avatar, created, linked FROM rl_accounts WHERE acct = ?1").bind(acct).first();
}
async function upsertAccount(env, { acct, name, email, avatar, discordUid }) {
  await env.DB.prepare(`INSERT INTO rl_accounts (acct, discord_uid, name, email, avatar, created, linked)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      ON CONFLICT(acct) DO UPDATE SET name = ?3, email = COALESCE(?4, email), avatar = ?5,
        discord_uid = COALESCE(?2, discord_uid), linked = COALESCE(?7, linked)`)
    .bind(acct, discordUid || null, name, email || null, avatar || "", Date.now(), discordUid ? Date.now() : null).run();
  return getAccount(env, acct);
}
async function linkAccount(env, acct, discordUid) {
  await env.DB.prepare("UPDATE rl_accounts SET discord_uid = ?2, linked = ?3 WHERE acct = ?1").bind(acct, discordUid, Date.now()).run();
}

// ---------- OAuth: Discord ----------
async function discordExchange(env, code, redirectUri) {
  const tok = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  }).then((r) => r.json()).catch(() => ({}));
  if (!tok.access_token) return null;
  const user = await fetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${tok.access_token}` } })
    .then((r) => r.json()).catch(() => ({}));
  return user.id ? user : null;
}

// ---------- OAuth: Google ----------
async function googleExchange(env, code, redirectUri) {
  const tok = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  }).then((r) => r.json()).catch(() => ({}));
  if (!tok.id_token) return null;
  // id_token prišiel priamo z Googlu cez TLS (token endpoint), stačí dekódovať payload
  try {
    const payload = unb64(tok.id_token.split(".")[1]);
    if (!payload.sub || !payload.aud || payload.aud !== env.GOOGLE_CLIENT_ID) return null;
    return payload;
  } catch { return null; }
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
      `DESCRIPTION:${icsEsc((r.note ? r.note + "\n" : "") + "Sign-up: https://" + host + "/raid/me")}`,
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

async function queueAction(env, action) {
  const raw = JSON.stringify(action);
  if (raw.length > 4000) throw new Error("príliš dlhé");
  const r = await env.DB.prepare("INSERT INTO rl_outbox (action, created) VALUES (?1, ?2)").bind(raw, Date.now()).run();
  return r.meta.last_row_id;
}

const publicRaids = (state) => Object.entries(state?.raids || {}).map(([id, r]) => ({
  id, name: r.name, time: r.time, ts: r.ts, note: r.note || "", closed: !!r.closed,
  signups: Object.values(r.signups || {}).map((p) => ({ name: p.name, role: p.role, cls: p.cls })),
}));

// Vracia Response, alebo null ak cesta nepatrí sem.
export async function handleRaid(req, env, url, path) {
  const origin = url.origin;

  // ---------- dashboard page ----------
  if (path === "/raid" && req.method === "GET") return html(DASHBOARD);

  // ---------- admin login / logout ----------
  if (path === "/raid/api/login" && req.method === "POST") {
    const { password } = await req.json().catch(() => ({}));
    if (!env.ADMIN_PASSWORD || !safeEqual(String(password || ""), env.ADMIN_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 800));
      return json({ ok: false, error: "Nesprávne heslo" }, 401);
    }
    return json({ ok: true }, 200, { "set-cookie": cookie("rl_session", await makeSession(env), SESSION_HOURS * 3600, "Strict") });
  }
  if (path === "/raid/api/logout" && req.method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": "rl_session=; Path=/raid; Max-Age=0" });
  }

  // ---------- public data for the website (no secrets) ----------
  if (path === "/raid/api/public" && req.method === "GET") {
    const { state, updated } = await getState(env);
    const profiles = state?.profiles || {};
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
    return json({ updated, raids: publicRaids(state), dkp, loot, progress }, 200, { "access-control-allow-origin": "*" });
  }

  if (path === "/raid/guild" && req.method === "GET") return html(GUILD, "public, max-age=60");

  if (path === "/raid/cal.ics" && req.method === "GET") {
    const { state } = await getState(env);
    const raids = Object.entries(state?.raids || {}).map(([id, r]) => ({ id, ...r }));
    return new Response(buildIcs(raids, url.host), {
      headers: { "content-type": "text/calendar; charset=utf-8", "cache-control": "public, max-age=300",
        "content-disposition": 'inline; filename="raidy.ics"' },
    });
  }

  // ---------- player page + login ----------
  if (path === "/raid/me" && req.method === "GET") return html(PLAYER);

  if (path === "/raid/login" && req.method === "GET") {
    // Discord login (alebo prepojenie, ak je hráč prihlásený cez Google)
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
      return new Response("Discord prihlásenie ešte nie je nastavené (DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET).", { status: 503 });
    }
    const nonce = crypto.randomUUID();
    const auth = new URL("https://discord.com/oauth2/authorize");
    auth.search = new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, response_type: "code", scope: "identify",
      redirect_uri: `${origin}/raid/auth/callback`, state: nonce }).toString();
    return redirect(auth.toString(), [["set-cookie", cookie("pl_state", nonce, 600)]]);
  }
  if (path === "/raid/auth/callback" && req.method === "GET") {
    const code = url.searchParams.get("code");
    const st = getCookie(req, "pl_state");
    if (!st || !code || !safeEqual(st, url.searchParams.get("state") || "")) {
      return new Response("Prihlásenie zlyhalo (neplatný stav). Skús to znova.", { status: 400 });
    }
    const user = await discordExchange(env, code, `${origin}/raid/auth/callback`);
    if (!user) return new Response("Prihlásenie cez Discord zlyhalo. Skús to znova.", { status: 400 });
    const avatar = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : "";
    const current = await getPlayer(req, env);
    let session;
    if (current && current.acct.startsWith("google:") && !current.id) {
      // prepojenie Google účtu s Discordom
      await linkAccount(env, current.acct, user.id);
      session = { ...current, id: user.id };
    } else {
      await upsertAccount(env, { acct: `discord:${user.id}`, name: user.global_name || user.username, avatar, discordUid: user.id });
      session = { acct: `discord:${user.id}`, id: user.id, name: user.global_name || user.username, avatar };
    }
    return redirect("/raid/me", [...(await sessionHeaders(env, session)), ["set-cookie", cookie("pl_state", "", 0)]]);
  }

  if (path === "/raid/login/google" && req.method === "GET") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return new Response("Google prihlásenie ešte nie je nastavené (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).", { status: 503 });
    }
    const nonce = crypto.randomUUID();
    const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    auth.search = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, response_type: "code", scope: "openid email profile",
      redirect_uri: `${origin}/raid/auth/google`, state: nonce, prompt: "select_account" }).toString();
    return redirect(auth.toString(), [["set-cookie", cookie("pl_state", nonce, 600)]]);
  }
  if (path === "/raid/auth/google" && req.method === "GET") {
    const code = url.searchParams.get("code");
    const st = getCookie(req, "pl_state");
    if (!st || !code || !safeEqual(st, url.searchParams.get("state") || "")) {
      return new Response("Prihlásenie zlyhalo (neplatný stav). Skús to znova.", { status: 400 });
    }
    const g = await googleExchange(env, code, `${origin}/raid/auth/google`);
    if (!g) return new Response("Prihlásenie cez Google zlyhalo. Skús to znova.", { status: 400 });
    const acct = `google:${g.sub}`;
    const row = await upsertAccount(env, { acct, name: g.name || g.email || "hráč", email: g.email || null, avatar: g.picture || "" });
    const session = { acct, id: row?.discord_uid || null, name: row?.name || g.name, avatar: g.picture || "" };
    return redirect("/raid/me", [...(await sessionHeaders(env, session)), ["set-cookie", cookie("pl_state", "", 0)]]);
  }

  if (path === "/raid/api/pl-logout" && req.method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": cookie("pl_session", "", 0) });
  }

  // prepojenie cez kód z Discordu (/link)
  if (path === "/raid/api/link" && req.method === "POST") {
    const u = await getPlayer(req, env);
    if (!u) return json({ error: "login required" }, 401);
    if (u.id) return json({ ok: true, already: true });
    const { code } = await req.json().catch(() => ({}));
    const c = String(code || "").trim().toUpperCase();
    const { state } = await getState(env);
    const entry = state?.link_codes?.[c];
    if (!c || !entry || (entry.exp || 0) * 1000 < Date.now()) {
      await new Promise((r) => setTimeout(r, 600));
      return json({ ok: false, error: "Neplatný alebo expirovaný kód. V Discorde napíš /link a skús to znova." }, 400);
    }
    await linkAccount(env, u.acct, String(entry.uid));
    await queueAction(env, { type: "link_done", code: c });
    const session = { ...u, id: String(entry.uid) };
    return json({ ok: true, name: entry.name }, 200, Object.fromEntries(await sessionHeaders(env, session)));
  }

  // ---------- player API ----------
  if (path === "/raid/api/me" && req.method === "GET") {
    const u = await getPlayer(req, env);
    if (!u) return json({ login: true, google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET), discord: !!(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) }, 401);
    const { state, updated } = await getState(env);
    const online = Date.now() - updated < 90_000;
    const base = { user: { name: u.name, avatar: u.avatar, acct: u.acct.split(":")[0] }, linked: !!u.id, updated, online,
      discord: !!(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET), classes: CLASSES, attunes: ATTUNES,
      sr_limit: state?.settings?.sr_limit ?? 1 };
    if (!u.id) return json({ ...base, known: false });
    if (!state) return json({ ...base, known: false });
    const uid = u.id;
    const stats = state.stats?.[uid] || null;
    const profile = state.profiles?.[uid] || null;
    const dkp = state.dkp?.[uid] || null;
    const extra = state.players?.[uid] || {};
    const raids = Object.entries(state.raids || {}).map(([id, r]) => {
      const counts = { tank: 0, healer: 0, dps: 0, absent: 0 };
      for (const p of Object.values(r.signups || {})) counts[p.role] = (counts[p.role] || 0) + 1;
      return {
        id, name: r.name, time: r.time, ts: r.ts, note: r.note || "", closed: !!r.closed, counts,
        mine: r.signups?.[uid] ? { role: r.signups[uid].role, cls: r.signups[uid].cls, reason: r.signups[uid].reason || "" } : null,
        sr: r.sr?.[uid]?.items || [],
        roster: Object.values(r.signups || {}).filter((p) => p.role !== "absent").map((p) => ({ name: p.name, role: p.role, cls: p.cls })),
      };
    }).filter((r) => !r.closed).sort((a, b) => (a.ts || 9e12) - (b.ts || 9e12));
    const loot = (state.loot_history || []).filter((l) => l.uid === uid && l.status === "approved").slice(-15).reverse()
      .map((l) => ({ item: l.item, amount: l.amount, t: l.t, from: l.trade_from || "" }));
    const all = Object.entries(state.dkp || {}).sort((a, b) => b[1].points - a[1].points).map(([k]) => k);
    const i = all.indexOf(uid);
    return json({
      ...base, known: !!(stats || profile || dkp || extra.ach?.length),
      profile, dkp: dkp ? { points: dkp.points, history: (dkp.history || []).slice(-10).reverse() } : { points: 0, history: [] },
      stats, loot, raids, wishlist: extra.wishlist || [], mvp: extra.mvp || 0, trivia: extra.trivia || 0,
      ach: extra.ach || [], ach_defs: state.ach_defs || {},
      rank: i < 0 ? null : { pos: i + 1, of: all.length },
    });
  }

  // akcie hráča (prihlásenie na raid, profil, SR, wishlist) → outbox pre bota
  if (path.startsWith("/raid/api/my/") && req.method === "POST") {
    const u = await getPlayer(req, env);
    if (!u) return json({ error: "login required" }, 401);
    if (!u.id) return json({ error: "Najprv si prepoj Discord účet." }, 403);
    const body = await req.json().catch(() => ({}));
    const uid = u.id, name = u.name;
    const str = (v, n = 60) => String(v ?? "").trim().slice(0, n);
    let action;
    switch (path) {
      case "/raid/api/my/signup": {
        const role = str(body.role, 10), cls = str(body.cls, 20), rid = str(body.rid, 20);
        if (!rid || !ROLES.includes(role)) return json({ error: "neplatná rola" }, 400);
        if (role !== "absent" && cls && !CLASSES.includes(cls)) return json({ error: "neplatná trieda" }, 400);
        action = { type: "signup", rid, uid, name, role, cls: cls || null, reason: str(body.reason, 80) };
        break;
      }
      case "/raid/api/my/signup-remove":
        action = { type: "signup_remove", rid: str(body.rid, 20), uid };
        break;
      case "/raid/api/my/profile": {
        const cls = str(body.cls, 20), role = str(body.role, 10);
        if (cls && !CLASSES.includes(cls)) return json({ error: "neplatná trieda" }, 400);
        if (role && (!ROLES.includes(role) || role === "absent")) return json({ error: "neplatná rola" }, 400);
        action = { type: "profile_set", uid, discord: name, character: str(body.character, 40) || null,
          cls: cls || null, role: role || null, spec: str(body.spec, 40) };
        break;
      }
      case "/raid/api/my/attune":
        if (!ATTUNES[body.key]) return json({ error: "neznámy attunement" }, 400);
        action = { type: "attune_set", uid, key: body.key, done: !!body.done };
        break;
      case "/raid/api/my/sr":
        action = { type: "sr_set", rid: str(body.rid, 20), uid, name, items: (Array.isArray(body.items) ? body.items : []).map((i) => str(i)).filter(Boolean).slice(0, 5) };
        break;
      case "/raid/api/my/wishlist":
        action = { type: "wishlist_set", uid, items: (Array.isArray(body.items) ? body.items : []).map((i) => str(i)).filter(Boolean).slice(0, 10) };
        break;
      default:
        return json({ error: "not found" }, 404);
    }
    const id = await queueAction(env, action);
    const { updated } = await getState(env);
    return json({ ok: true, id, online: Date.now() - updated < 90_000 });
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
      const accounts = (await env.DB.prepare("SELECT acct, discord_uid, name, email, created, linked FROM rl_accounts ORDER BY created DESC LIMIT 200").all()).results;
      return json({
        state, updated, online: Date.now() - updated < 90_000,
        log: results.map((r) => ({ ...r, action: JSON.parse(r.action) })),
        accounts: accounts.map((a) => ({ ...a, provider: a.acct.split(":")[0], email: a.email ? a.email.replace(/^(.{2}).*(@.*)$/, "$1…$2") : "" })),
        auth: { google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET), discord: !!(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) },
      });
    }
    if (path === "/raid/api/action" && req.method === "POST") {
      const action = await req.json().catch(() => null);
      if (!action || !ADMIN_ACTIONS.has(action.type)) return json({ error: "neznáma akcia" }, 400);
      const id = await queueAction(env, action);
      return json({ ok: true, id });
    }
    if (path === "/raid/api/account" && req.method === "POST") {
      const { acct, op, discord_uid } = await req.json().catch(() => ({}));
      if (!acct) return json({ error: "chýba účet" }, 400);
      if (op === "unlink") await env.DB.prepare("UPDATE rl_accounts SET discord_uid = NULL, linked = NULL WHERE acct = ?1").bind(acct).run();
      else if (op === "link" && /^\d{5,25}$/.test(String(discord_uid || ""))) await linkAccount(env, acct, String(discord_uid));
      else if (op === "delete") await env.DB.prepare("DELETE FROM rl_accounts WHERE acct = ?1").bind(acct).run();
      else return json({ error: "neznáma operácia" }, 400);
      return json({ ok: true });
    }
    return json({ error: "not found" }, 404);
  }

  return null;
}
