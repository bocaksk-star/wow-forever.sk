import os
import pathlib
import discord
from discord import app_commands
from dotenv import load_dotenv
import anthropic

load_dotenv()
DISCORD_TOKEN = os.environ["DISCORD_TOKEN"]
GUILD_ID = os.getenv("GUILD_ID")  # optional: instant command sync to your server
MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5")

STRAT_DIR = pathlib.Path(__file__).parent / "strategies"
STRAT_DIR.mkdir(exist_ok=True)

claude = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

# ---------------- SETTINGS (changed from the web dashboard) ----------------
import json

SETTINGS_FILE = pathlib.Path(__file__).parent / "settings.json"
DEFAULT_SETTINGS = {
    "voice": "female" if os.getenv("TTS_VOICE", "").endswith("ViktoriaNeural") else "male",
    "dkp_approval": True,
    "reminders": True,
    "event_sounds": True,
    "bid_seconds": int(os.getenv("BID_SECONDS", "60")),
    "announce_channel": os.getenv("ANNOUNCE_CHANNEL_ID", ""),
    "attendance_dkp": 10,   # DKP každému prítomnému pri uzavretí raidu (0 = vypnuté)
    "sr_limit": 1,          # koľko soft reservov má hráč na raid
    "dm_reminders": True,   # súkromné pripomienky pred raidom
    "auto_role": True,      # rola Raider po sign-upe
    "meme_mode": True,      # hlášky pri pull / wipe / kill
    "mvp_minutes": 10,      # hlasovanie o MVP po raide (0 = vypnuté)
    "mvp_dkp": 5,           # bonus DKP pre MVP
    "trivia_dkp": 0,        # DKP za správnu trivia odpoveď
}
VOICES = {"male": "sk-SK-LukasNeural", "female": "sk-SK-ViktoriaNeural"}


def get_settings() -> dict:
    s = dict(DEFAULT_SETTINGS)
    if SETTINGS_FILE.exists():
        s.update(json.loads(SETTINGS_FILE.read_text(encoding="utf-8")))
    return s


def set_setting(key: str, value):
    if key not in DEFAULT_SETTINGS:
        raise ValueError(f"unknown setting {key}")
    if key == "voice" and value not in VOICES:
        raise ValueError("voice must be male/female")
    if key == "bid_seconds":
        value = max(10, min(600, int(value)))
    if key == "attendance_dkp":
        value = max(0, min(1000, int(value)))
    if key == "sr_limit":
        value = max(0, min(5, int(value)))
    if key == "mvp_minutes":
        value = max(0, min(120, int(value)))
    if key == "mvp_dkp":
        value = max(0, min(1000, int(value)))
    if key == "trivia_dkp":
        value = max(0, min(100, int(value)))
    if key in ("dkp_approval", "reminders", "event_sounds", "dm_reminders", "auto_role", "meme_mode"):
        value = bool(value)
    s = get_settings()
    s[key] = value
    SETTINGS_FILE.write_text(json.dumps(s, indent=2, ensure_ascii=False), encoding="utf-8")


def slug(name: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in name.lower()).strip("-")


def list_bosses() -> list[str]:
    return sorted(p.stem for p in STRAT_DIR.glob("*.md"))


def load_strat(boss: str) -> str | None:
    p = STRAT_DIR / f"{slug(boss)}.md"
    return p.read_text(encoding="utf-8") if p.exists() else None


def all_strats() -> str:
    return "\n\n".join(
        f"=== {p.stem} ===\n{p.read_text(encoding='utf-8')}" for p in sorted(STRAT_DIR.glob("*.md"))
    )


SYSTEM = (
    "You are RaidLead, the raid leader bot of a World of Warcraft guild on Discord. "
    "Answer ONLY from the guild's strategy notes below; they are the guild's agreed tactics. "
    "If the notes don't cover something, say so and suggest the officers teach you with /teach. "
    "Be short and clear, like a raid leader on comms: bullet points, role-specific when asked. "
    "Reply in the same language the player writes in (Slovak or English).\n\n"
    "STRATEGY NOTES:\n"
)


def ask_claude(question: str, notes: str) -> str:
    msg = claude.messages.create(
        model=MODEL,
        max_tokens=800,
        system=SYSTEM + (notes or "(no strategies taught yet)"),
        messages=[{"role": "user", "content": question}],
    )
    return msg.content[0].text[:1990]


intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)


async def boss_autocomplete(_: discord.Interaction, current: str):
    return [app_commands.Choice(name=b, value=b) for b in list_bosses() if current.lower() in b][:25]


@tree.command(name="strat", description="Show the strategy for a boss")
@app_commands.autocomplete(boss=boss_autocomplete)
async def strat(inter: discord.Interaction, boss: str):
    text = load_strat(boss)
    if not text:
        await inter.response.send_message(f"No strategy for **{boss}** yet. Known: {', '.join(list_bosses()) or 'none'}")
        return
    await inter.response.send_message(f"**{boss}**\n{text[:1900]}")


@tree.command(name="ask", description="Ask the raid leader anything about our tactics")
async def ask(inter: discord.Interaction, question: str):
    await inter.response.defer(thinking=True)
    answer = await client.loop.run_in_executor(None, ask_claude, question, all_strats())
    await inter.followup.send(answer)


@tree.command(name="teach", description="(Officers) Add a tactic note to a boss")
@app_commands.autocomplete(boss=boss_autocomplete)
@app_commands.checks.has_permissions(manage_messages=True)
async def teach(inter: discord.Interaction, boss: str, note: str):
    p = STRAT_DIR / f"{slug(boss)}.md"
    with p.open("a", encoding="utf-8") as f:
        f.write(f"\n- {note}  (taught by {inter.user.display_name})")
    await inter.response.send_message(f"Got it, saved to **{slug(boss)}**: {note}")


@teach.error
async def teach_error(inter: discord.Interaction, err):
    await inter.response.send_message("Only officers can teach me tactics.", ephemeral=True)


# ---------------- RAID SIGN-UPS ----------------
import json
import uuid

RAIDS_FILE = pathlib.Path(__file__).parent / "raids.json"
RAID_BOSSES = {
    "Molten Core": ["lucifron", "magmadar", "gehennas", "garr", "shazzrah", "baron-geddon",
                    "golemagg", "sulfuron-harbinger", "majordomo-executus", "ragnaros"],
    "Blackwing Lair": ["razorgore", "vaelastrasz", "broodlord-lashlayer", "firemaw", "ebonroc",
                       "flamegor", "chromaggus", "nefarian"],
    "Onyxia": ["onyxia"],
}
ROLES = {"tank": "🛡️ Tank", "healer": "💚 Healer", "dps": "⚔️ DPS", "absent": "❌ Absent"}
CLASSES = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman", "Mage", "Warlock", "Druid"]


def load_raids() -> dict:
    return json.loads(RAIDS_FILE.read_text(encoding="utf-8")) if RAIDS_FILE.exists() else {}


_dirty = {"v": True}  # tells the dashboard sync loop there is something new to push


def save_raids(raids: dict):
    RAIDS_FILE.write_text(json.dumps(raids, indent=2, ensure_ascii=False), encoding="utf-8")
    _dirty["v"] = True


def raid_embed(raid: dict) -> discord.Embed:
    closed = raid.get("closed")
    e = discord.Embed(title=f"{raid['name']} — {raid['time']}" + (" (uzavretý)" if closed else ""),
                      color=0x7F8C8D if closed else 0xE67E22,
                      description=raid.get("note") or "Click your role, then pick your class.")
    for key, label in ROLES.items():
        people = [f"{p['name']} ({p.get('reason') or p['cls']})" for p in raid["signups"].values() if p["role"] == key]
        e.add_field(name=f"{label} ({len(people)})", value="\n".join(people) or "—", inline=True)
    return e


def signup_view(raid_id: str) -> discord.ui.View:
    v = discord.ui.View(timeout=None)
    for key, label in ROLES.items():
        style = discord.ButtonStyle.danger if key == "absent" else discord.ButtonStyle.secondary
        v.add_item(discord.ui.Button(label=label, style=style, custom_id=f"role:{raid_id}:{key}"))
    return v


def class_view(raid_id: str, role: str) -> discord.ui.View:
    v = discord.ui.View(timeout=120)
    v.add_item(discord.ui.Select(
        placeholder="Your class",
        custom_id=f"cls:{raid_id}:{role}",
        options=[discord.SelectOption(label=c, value=c) for c in CLASSES],
    ))
    return v


@tree.command(name="raid", description="(Officers) Post a raid sign-up")
@app_commands.choices(raid=[app_commands.Choice(name=n, value=n) for n in RAID_BOSSES])
@app_commands.describe(time="napr. 10.10. 20:00 (potom bot sám pripomenie 60 a 15 min vopred)")
@app_commands.checks.has_permissions(manage_messages=True)
async def raid_cmd(inter: discord.Interaction, raid: app_commands.Choice[str], time: str, note: str = ""):
    await inter.response.send_message(f"📝 Posielam sign-up pre **{raid.value}**…", ephemeral=True)
    await post_raid(inter.channel, raid.value, time, note)


async def post_raid(channel, name: str, time: str, note: str = "") -> str:
    raids = load_raids()
    rid = uuid.uuid4().hex[:8]
    raids[rid] = {"name": name, "time": time, "note": note, "signups": {},
                  "channel": channel.id, "message": None,
                  "ts": parse_raid_time(time), "reminded": []}
    msg = await channel.send(embed=raid_embed(raids[rid]), view=signup_view(rid))
    raids[rid]["message"] = msg.id
    save_raids(raids)
    return rid


@raid_cmd.error
async def raid_error(inter: discord.Interaction, err):
    await inter.response.send_message("Only officers can create raids.", ephemeral=True)


async def refresh_card(raid: dict):
    try:
        ch = client.get_channel(raid["channel"]) or await client.fetch_channel(raid["channel"])
        msg = await ch.fetch_message(raid["message"])
        if raid.get("closed"):
            await msg.edit(embed=raid_embed(raid), view=None)
        else:
            await msg.edit(embed=raid_embed(raid))
    except discord.HTTPException:
        pass


@client.event
async def on_interaction(inter: discord.Interaction):
    if inter.type != discord.InteractionType.component:
        return
    cid = inter.data.get("custom_id", "")
    kind, _, rest = cid.partition(":")
    if kind == "mvp":
        await handle_mvp_vote(inter, rest)
        return
    if kind not in ("role", "cls"):
        return
    rid, role = rest.split(":")
    raids = load_raids()
    raid = raids.get(rid)
    if not raid:
        await inter.response.send_message("This raid no longer exists.", ephemeral=True)
        return
    if raid.get("closed"):
        await inter.response.send_message("Tento raid je už uzavretý.", ephemeral=True)
        return
    uid = str(inter.user.id)
    if kind == "role":
        if role == "absent":
            raid["signups"][uid] = {"name": inter.user.display_name, "role": "absent", "cls": "-"}
            save_raids(raids)
            await inter.response.send_message("Marked as absent.", ephemeral=True)
            await refresh_card(raid)
        else:
            prof = load_profiles().get(uid, {})
            if prof.get("cls"):
                raid["signups"][uid] = {"name": prof.get("character") or inter.user.display_name,
                                        "role": role, "cls": prof["cls"]}
                save_raids(raids)
                await inter.response.send_message(
                    f"✅ Prihlásený: **{ROLES[role]} – {prof['cls']}** (z profilu, zmena cez /profile)", ephemeral=True)
                await refresh_card(raid)
                await grant_raider_role(inter.user)
                return
            await inter.response.send_message(f"Signing up as **{ROLES[role]}** — pick your class:",
                                              view=class_view(rid, role), ephemeral=True)
    else:
        cls = inter.data["values"][0]
        raid["signups"][uid] = {"name": inter.user.display_name, "role": role, "cls": cls}
        save_raids(raids)
        await inter.response.edit_message(content=f"✅ Signed up: **{ROLES[role]} – {cls}**", view=None)
        await refresh_card(raid)
        await grant_raider_role(inter.user)


def latest_raid() -> tuple[str, dict] | tuple[None, None]:
    raids = load_raids()
    if not raids:
        return None, None
    rid = list(raids)[-1]
    return rid, raids[rid]


@tree.command(name="roster", description="Show the roster of the latest raid")
async def roster(inter: discord.Interaction):
    _, raid = latest_raid()
    if not raid:
        await inter.response.send_message("No raid posted yet. Officers: use /raid.")
        return
    await inter.response.send_message(embed=raid_embed(raid))


def assign_claude(raid: dict) -> str:
    players = [p for p in raid["signups"].values() if p["role"] != "absent"]
    roster_txt = "\n".join(f"- {p['name']}: {p['role']} {p['cls']}" for p in players)
    strats = "\n\n".join(f"=== {b} ===\n{load_strat(b) or ''}" for b in RAID_BOSSES[raid["name"]])
    msg = claude.messages.create(
        model=MODEL,
        max_tokens=1500,
        system=("You are RaidLead, a WoW raid leader. Using the strategy notes and the roster, "
                "write boss-by-boss assignments for tonight: main/off tanks, healer targets, "
                "and class jobs the notes require (e.g. Tranquilizing Shot hunters, banish warlocks, "
                "decursers, interrupt rotation, Fear Ward). Use ONLY people on the roster, by name. "
                "If a job can't be covered by the roster, flag it. Short lines, Discord markdown, "
                "Slovak if most names/notes look Slovak, otherwise English.\n\nSTRATEGY NOTES:\n" + strats),
        messages=[{"role": "user", "content": f"Raid: {raid['name']} at {raid['time']}\nRoster:\n{roster_txt}"}],
    )
    return msg.content[0].text


@tree.command(name="assign", description="(Officers) Generate boss assignments from the latest roster")
@app_commands.checks.has_permissions(manage_messages=True)
async def assign(inter: discord.Interaction):
    _, raid = latest_raid()
    if not raid or not [p for p in raid["signups"].values() if p["role"] != "absent"]:
        await inter.response.send_message("No sign-ups yet.")
        return
    await inter.response.defer(thinking=True)
    text = await client.loop.run_in_executor(None, assign_claude, raid)
    chunks = [text[i:i + 1990] for i in range(0, len(text), 1990)]
    await inter.followup.send(f"**Assignments – {raid['name']}**\n" + chunks[0])
    for c in chunks[1:]:
        await inter.followup.send(c)


@assign.error
async def assign_error(inter: discord.Interaction, err):
    await inter.response.send_message("Only officers can assign.", ephemeral=True)


# ---------------- LIVE CALLOUTS ----------------
import asyncio
import time as _time

TIMELINES_FILE = pathlib.Path(__file__).parent / "timelines.json"
VOICE_TTS = os.getenv("TTS_CALLOUTS", "1") == "1"  # Discord reads callouts aloud to players with TTS on
active_pulls: dict[int, dict] = {}  # channel_id -> {"task", "boss", "start"}


def load_timelines() -> dict:
    return json.loads(TIMELINES_FILE.read_text(encoding="utf-8")) if TIMELINES_FILE.exists() else {}


def build_schedule(events: list, limit: int = 900) -> list[tuple[float, str]]:
    sched = []
    for ev in events:
        t = ev["first"]
        while t <= limit:
            if ev.get("warn"):
                sched.append((t - ev["warn"], f"⚠️ Za {ev['warn']} sekúnd: {ev['text']}"))
            sched.append((t, f"🔥 **{ev['text']}**"))
            if not ev.get("every"):
                break
            t += ev["every"]
    return sorted(s for s in sched if s[0] >= 0)


async def run_pull(channel, schedule: list, start: float):
    for at, text in schedule:
        delay = start + at - _time.monotonic()
        if delay > 0:
            await asyncio.sleep(delay)
        spoke = await speak(channel.guild, text)
        await channel.send(text, tts=VOICE_TTS and not spoke)


# --- spoken callouts in voice (edge-tts, free neural voices) ---
import hashlib

TTS_CACHE = pathlib.Path(__file__).parent / "tts_cache"
TTS_CACHE.mkdir(exist_ok=True)


def clean_for_speech(text: str) -> str:
    text = re.sub(r"[*_`~>#|]", "", text)
    text = re.sub(r"[^\w\s.,!?:;%()/'\"-]", "", text)  # drop emoji
    return re.sub(r"\s+", " ", text).strip()


async def speak(guild, text: str) -> bool:
    """Say text in the bot's voice channel. Returns True if spoken."""
    vc = guild.voice_client if guild else None
    if not vc or not vc.is_connected():
        return False
    try:
        import edge_tts
    except ImportError:
        return False
    line = clean_for_speech(text)
    if not line:
        return False
    voice = VOICES[get_settings()["voice"]]
    path = TTS_CACHE / f"{hashlib.md5((voice + line).encode()).hexdigest()}.mp3"
    if not path.exists():
        try:
            await edge_tts.Communicate(line, voice, rate="+15%").save(str(path))
        except Exception:
            return False
    if vc.is_playing():
        vc.stop()
    vc.play(discord.FFmpegPCMAudio(str(path)))
    return True


@tree.command(name="say", description="(Officers) Bot says a line out loud in voice")
@app_commands.checks.has_permissions(manage_messages=True)
async def say(inter: discord.Interaction, text: str):
    ok = await speak(inter.guild, text)
    await inter.response.send_message(f"🗣️ {text}" if ok else "I'm not in voice (use /join) or edge-tts isn't installed.",
                                      ephemeral=not ok)


async def timeline_boss_autocomplete(_: discord.Interaction, current: str):
    return [app_commands.Choice(name=b, value=b) for b in load_timelines()
            if not b.startswith("_") and current.lower() in b][:25]


def stop_pull(channel_id: int) -> bool:
    p = active_pulls.pop(channel_id, None)
    if p:
        p["task"].cancel()
    return bool(p)


@tree.command(name="pull", description="(Officers) Start live callouts for a boss")
@app_commands.autocomplete(boss=timeline_boss_autocomplete)
@app_commands.checks.has_permissions(manage_messages=True)
async def pull(inter: discord.Interaction, boss: str, countdown: int = 5):
    tl = load_timelines().get(slug(boss))
    if not tl:
        await inter.response.send_message(f"No timeline for **{boss}**.", ephemeral=True)
        return
    stop_pull(inter.channel_id)
    await inter.response.send_message(f"⏳ **{boss}** pull in {countdown}...", tts=VOICE_TTS)
    await asyncio.sleep(max(0, countdown))
    await inter.channel.send(f"⚔️ **PULL! {boss}**" + (f"\n_{tl['notes']}_" if tl.get("notes") else ""), tts=VOICE_TTS)
    play_event(inter.guild, "pull")
    await meme_quip(inter.channel, inter.guild, "pull", say_it=False)
    start = _time.monotonic()
    task =asyncio.create_task(run_pull(inter.channel, build_schedule(tl.get("events", [])), start))
    active_pulls[inter.channel_id] = {"task": task, "boss": slug(boss), "start": start}


@tree.command(name="phase", description="(Officers) Announce a phase change for the current pull")
@app_commands.checks.has_permissions(manage_messages=True)
async def phase(inter: discord.Interaction, number: int):
    p = active_pulls.get(inter.channel_id)
    if not p:
        await inter.response.send_message("No active pull here. Use /pull first.", ephemeral=True)
        return
    text = load_timelines().get(p["boss"], {}).get("phases", {}).get(str(number), f"PHASE {number}!")
    spoke = await speak(inter.guild, text)
    await inter.response.send_message(f"📢 **{text}**", tts=VOICE_TTS and not spoke)


@tree.command(name="wipe", description="(Officers) Stop callouts (wipe or kill)")
@app_commands.checks.has_permissions(manage_messages=True)
async def wipe(inter: discord.Interaction, killed: bool = False):
    p = active_pulls.get(inter.channel_id)
    took = f" ({int(_time.monotonic() - p['start'])}s)" if p else ""
    if killed and p:
        _, kraid = open_raid()
        record_kill(p["boss"], [u for u, _ in raid_players(kraid or latest_raid()[1])])
    stop_pull(inter.channel_id)
    msg = f"🎉 **Boss down!**{took} GG!" if killed else f"💀 Wipe{took}. Run back, rebuff, we go again."
    await inter.response.send_message(msg)
    play_event(inter.guild, "kill" if killed else "wipe")
    await meme_quip(inter.channel, inter.guild, "kill" if killed else "wipe")


for _cmd in (pull, phase, wipe):
    @_cmd.error
    async def _officer_only(inter: discord.Interaction, err):
        if not inter.response.is_done():
            await inter.response.send_message("Only officers can run pulls.", ephemeral=True)


# ---------------- SOUNDBOARD (voice clips) ----------------
import random

SOUND_DIR = pathlib.Path(__file__).parent / "sounds"
SOUND_DIR.mkdir(exist_ok=True)
AUDIO_EXT = (".mp3", ".ogg", ".wav", ".m4a")


def sound_files(prefix: str = "") -> list[pathlib.Path]:
    """All clips, including sound packs in subfolders (e.g. sounds/balls_of_steel/)."""
    return sorted(p for p in SOUND_DIR.rglob("*")
                  if p.suffix.lower() in AUDIO_EXT and p.stem.lower().startswith(prefix.lower()))


def clip_name(p: pathlib.Path) -> str:
    rel = p.relative_to(SOUND_DIR).with_suffix("")
    return rel.as_posix()  # "melisko_1" or "balls_of_steel/come_get_some"


def voice_for(guild: discord.Guild | None) -> discord.VoiceClient | None:
    return guild.voice_client if guild else None


def play_file(guild: discord.Guild | None, path: pathlib.Path) -> bool:
    vc = voice_for(guild)
    if not vc or not vc.is_connected():
        return False
    if vc.is_playing():
        vc.stop()
    vc.play(discord.PCMVolumeTransformer(discord.FFmpegPCMAudio(str(path)), volume=0.8))
    return True


def play_event(guild: discord.Guild | None, event: str) -> bool:
    """Play a random clip whose filename starts with the event name (pull, wipe, kill, death...)."""
    if not get_settings()["event_sounds"]:
        return False
    files = sound_files(event)
    return bool(files) and play_file(guild, random.choice(files))


@tree.command(name="join", description="Bot joins your voice channel (for sounds)")
async def join(inter: discord.Interaction):
    if not inter.user.voice or not inter.user.voice.channel:
        await inter.response.send_message("Join a voice channel first.", ephemeral=True)
        return
    ch = inter.user.voice.channel
    vc = voice_for(inter.guild)
    if vc:
        await vc.move_to(ch)
    else:
        await ch.connect()
    _dirty["v"] = True
    await inter.response.send_message(f"🔊 Joined **{ch.name}**.")
    play_event(inter.guild, "join")


@tree.command(name="leave", description="Bot leaves the voice channel")
async def leave(inter: discord.Interaction):
    vc = voice_for(inter.guild)
    if vc:
        await vc.disconnect()
    _dirty["v"] = True
    await inter.response.send_message("👋 Left voice.")


async def sound_autocomplete(_: discord.Interaction, current: str):
    return [app_commands.Choice(name=clip_name(p)[:100], value=clip_name(p)[:100])
            for p in sound_files() if current.lower() in clip_name(p).lower()][:25]


@tree.command(name="sound", description="Play a voice clip")
@app_commands.autocomplete(name=sound_autocomplete)
async def sound(inter: discord.Interaction, name: str):
    match = [p for p in sound_files() if name.lower() in (clip_name(p).lower(), p.stem.lower())]
    if not match:
        await inter.response.send_message(f"No clip **{name}**. Use /sounds to list them.", ephemeral=True)
        return
    ok = play_file(inter.guild, match[0])
    await inter.response.send_message(f"🔊 {name}" if ok else "I'm not in voice. Use /join first.",
                                      ephemeral=not ok)


@tree.command(name="sounds", description="List all voice clips")
async def sounds(inter: discord.Interaction):
    packs: dict[str, list[str]] = {}
    for p in sound_files():
        pack = p.parent.name if p.parent != SOUND_DIR else "základné"
        packs.setdefault(pack, []).append(p.stem)
    text = "\n".join(f"**{k}**: {', '.join(v)}" for k, v in packs.items())
    await inter.response.send_message("🎵 " + (text or "No clips yet. Put audio files into the sounds folder.")[:1900],
                                      ephemeral=True)


# ---------------- WARCRAFT LOGS ANALYSIS ----------------
import re
import aiohttp

WCL_ID = os.getenv("WCL_CLIENT_ID")
WCL_SECRET = os.getenv("WCL_CLIENT_SECRET")
WCL_HOST = os.getenv("WCL_HOST", "https://www.warcraftlogs.com")  # same API serves classic/fresh logs
_wcl_token = {"value": None, "exp": 0}


async def wcl_query(session: aiohttp.ClientSession, query: str, variables: dict) -> dict:
    if not _wcl_token["value"] or _wcl_token["exp"] < _time.time() + 60:
        async with session.post(f"{WCL_HOST}/oauth/token", data={"grant_type": "client_credentials"},
                                auth=aiohttp.BasicAuth(WCL_ID, WCL_SECRET)) as r:
            r.raise_for_status()
            tok = await r.json()
        _wcl_token.update(value=tok["access_token"], exp=_time.time() + tok["expires_in"])
    async with session.post(f"{WCL_HOST}/api/v2/client", json={"query": query, "variables": variables},
                            headers={"Authorization": f"Bearer {_wcl_token['value']}"}) as r:
        r.raise_for_status()
        data = await r.json()
    if data.get("errors"):
        raise RuntimeError(data["errors"][0]["message"])
    return data["data"]


FIGHTS_Q = """query($code:String!){reportData{report(code:$code){title
  fights(killType:Encounters){id name kill startTime endTime fightPercentage}}}}"""
DETAIL_Q = """query($code:String!,$f:[Int]!){reportData{report(code:$code){
  deaths:table(dataType:Deaths,fightIDs:$f)
  taken:table(dataType:DamageTaken,fightIDs:$f,hostilityType:Friendlies)
  done:table(dataType:DamageDone,fightIDs:$f)}}}"""


def summarize_tables(fight: dict, d: dict) -> str:
    deaths = d["deaths"]["data"].get("entries", [])
    death_lines = [
        f"- {e.get('name')} ({e.get('type')}) at {int((e.get('timestamp', fight['startTime']) - fight['startTime']) / 1000)}s, "
        f"killed by {(e.get('killingBlow') or {}).get('name', '?')}"
        for e in deaths
    ]
    taken = sorted(d["taken"]["data"].get("entries", []), key=lambda e: -e.get("total", 0))[:12]
    taken_lines = [f"- {e.get('name')}: {e.get('total', 0):,} damage taken (ability)" for e in taken]
    done = sorted(d["done"]["data"].get("entries", []), key=lambda e: -e.get("total", 0))[:15]
    secs = max(1, (fight["endTime"] - fight["startTime"]) / 1000)
    done_lines = [f"- {e.get('name')} ({e.get('type')}): {int(e.get('total', 0) / secs)} DPS" for e in done]
    return (f"Fight: {fight['name']} — {'KILL' if fight['kill'] else 'WIPE at ' + str(round((fight.get('fightPercentage') or 0) / 100, 1)) + '%'}"
            f", duration {int(secs)}s\n\nDEATHS (in order):\n" + ("\n".join(death_lines) or "none") +
            "\n\nDAMAGE TAKEN BY ABILITY:\n" + "\n".join(taken_lines) +
            "\n\nDPS:\n" + "\n".join(done_lines))


def analyze_claude(summary: str, boss_slug: str) -> str:
    msg = claude.messages.create(
        model=MODEL,
        max_tokens=1200,
        system=("You are RaidLead, a WoW raid leader reviewing a Warcraft Logs pull. Compare what happened "
                "with the guild's strategy notes. Output: 1) why we wiped/what went well (1-2 lines), "
                "2) key mistakes by NAME and what each should do differently, 3) top 3 fixes for the next pull. "
                "Be direct but friendly, like a good raid leader. Discord markdown, short. "
                "Slovak if names look Slovak, otherwise English.\n\nSTRATEGY NOTES:\n"
                + (load_strat(boss_slug) or "(no notes for this boss)")),
        messages=[{"role": "user", "content": summary}],
    )
    return msg.content[0].text


@tree.command(name="log", description="Analyze a Warcraft Logs pull (paste report link)")
async def log_cmd(inter: discord.Interaction, link: str, fight: int | None = None):
    if not (WCL_ID and WCL_SECRET):
        await inter.response.send_message("Warcraft Logs isn't set up yet (WCL_CLIENT_ID / WCL_CLIENT_SECRET in .env).")
        return
    m = re.search(r"reports/([A-Za-z0-9]+)", link)
    if not m:
        await inter.response.send_message("That doesn't look like a Warcraft Logs report link.", ephemeral=True)
        return
    code = m.group(1)
    fm = re.search(r"fight=(\d+)", link)
    await inter.response.defer(thinking=True)
    try:
        async with aiohttp.ClientSession() as s:
            rep = (await wcl_query(s, FIGHTS_Q, {"code": code}))["reportData"]["report"]
            fights = rep["fights"]
            if not fights:
                await inter.followup.send("No boss pulls found in this log.")
                return
            want = fight or (int(fm.group(1)) if fm else None)
            f = next((x for x in fights if x["id"] == want), fights[-1])
            details = (await wcl_query(s, DETAIL_Q, {"code": code, "f": [f["id"]]}))["reportData"]["report"]
    except Exception as e:
        await inter.followup.send(f"Couldn't read the log: {e}")
        return
    summary = summarize_tables(f, details)
    text = await client.loop.run_in_executor(None, analyze_claude, summary, slug(f["name"]))
    header = f"**📊 {f['name']} – {'KILL' if f['kill'] else 'WIPE'}** (pull #{f['id']})\n"
    out = header + text
    for i in range(0, len(out), 1990):
        await inter.followup.send(out[i:i + 1990])


# ---------------- RAID REMINDERS ----------------
from datetime import datetime
from zoneinfo import ZoneInfo
from discord.ext import tasks

TZ = ZoneInfo(os.getenv("TZ_NAME", "Europe/Bratislava"))
RAID_ROLE_ID = os.getenv("RAID_ROLE_ID")  # optional: role to ping (e.g. @Raiders)
REMINDERS = [(60, "⏰ **{name}** začína o hodinu ({time})! Ešte nie ste prihlásení? Kliknite na sign-up kartu. Prihlásených: {count}."),
             (15, "⚔️ **{name}** o 15 minút! Na voice, buffy, flasky, opravené gear. {mentions}")]


def parse_raid_time(text: str) -> float | None:
    text = text.strip()
    now = datetime.now(TZ)
    for fmt in ("%d.%m.%Y %H:%M", "%Y-%m-%d %H:%M", "%d.%m. %H:%M", "%d.%m %H:%M"):
        try:
            dt = datetime.strptime(text, fmt)
            if "%Y" not in fmt:
                dt = dt.replace(year=now.year)
            return dt.replace(tzinfo=TZ).timestamp()
        except ValueError:
            continue
    return None


@tasks.loop(minutes=1)
async def reminder_loop():
    if not get_settings()["reminders"]:
        return
    raids = load_raids()
    now = _time.time()
    changed = False
    for raid in raids.values():
        ts = raid.get("ts")
        if not ts or now > ts:
            continue
        for minutes, template in REMINDERS:
            key = f"{minutes}m"
            if key in raid.setdefault("reminded", []) or now < ts - minutes * 60:
                continue
            raid["reminded"].append(key)
            changed = True
            going = [uid for uid, p in raid["signups"].items() if p["role"] != "absent"]
            text = template.format(name=raid["name"], time=raid["time"], count=len(going),
                                   mentions=" ".join(f"<@{u}>" for u in going))
            if minutes == 15:
                text += consumes_text(raid["name"])
            if minutes == 60:
                text = (f"<@&{_role_cache['id']}> " if _role_cache["id"] else "@here ") + text
            try:
                ch = client.get_channel(raid["channel"]) or await client.fetch_channel(raid["channel"])
                await ch.send(text, allowed_mentions=discord.AllowedMentions(everyone=True, roles=True, users=True))
            except discord.HTTPException:
                pass
            for u, p in raid["signups"].items():
                if p["role"] == "absent":
                    continue
                if minutes == 60:
                    dm = (f"⏰ **{raid['name']}** začína o hodinu ({raid['time']}). Si prihlásený ako "
                          f"{ROLES[p['role']]} – {p['cls']}. Nestihneš? Napíš v Discorde `/absent reason:`.")
                else:
                    dm = f"⚔️ **{raid['name']}** o 15 minút! Pripoj sa na voice." + consumes_text(raid["name"])
                await dm_user(u, dm)
    if changed:
        save_raids(raids)


# ---------------- DKP / LOOT ----------------
DKP_FILE = pathlib.Path(__file__).parent / "dkp.json"
LEDGER_FILE = pathlib.Path(__file__).parent / "ledger.json"  # pending approvals + loot history
open_bids: dict[int, dict] = {}  # channel_id -> {"item", "min", "ends", "bids": {uid: (amount, name)}}


def load_dkp() -> dict:
    return json.loads(DKP_FILE.read_text(encoding="utf-8")) if DKP_FILE.exists() else {}


def save_dkp(d: dict):
    DKP_FILE.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
    _dirty["v"] = True


def load_ledger() -> dict:
    led = json.loads(LEDGER_FILE.read_text(encoding="utf-8")) if LEDGER_FILE.exists() else {}
    led.setdefault("pending", [])
    led.setdefault("loot_history", [])
    return led


def save_ledger(led: dict):
    led["loot_history"] = led["loot_history"][-200:]
    LEDGER_FILE.write_text(json.dumps(led, indent=2, ensure_ascii=False), encoding="utf-8")
    _dirty["v"] = True


def dkp_change(d: dict, uid: str, name: str, amount: int, reason: str):
    p = d.setdefault(uid, {"name": name, "points": 0, "history": []})
    p["name"] = name
    p["points"] += amount
    p["history"].append({"t": int(_time.time()), "amount": amount, "reason": reason})
    p["history"] = p["history"][-100:]


def apply_dkp(players: list[tuple[str, str]], amount: int, reason: str, force: bool = False,
              loot_item: str | None = None) -> str:
    """Give DKP now, or queue it for dashboard approval. Returns 'applied' or 'pending'."""
    led = load_ledger()
    if loot_item:
        uid, name = players[0]
        led["loot_history"].append({"item": loot_item, "uid": uid, "name": name, "amount": -amount,
                                    "t": int(_time.time()), "status": "pending"})
    if get_settings()["dkp_approval"] and not force:
        led["pending"].append({
            "id": uuid.uuid4().hex[:8], "players": players, "amount": amount, "reason": reason,
            "item": loot_item, "t": int(_time.time()),
        })
        save_ledger(led)
        return "pending"
    d = load_dkp()
    for uid, name in players:
        dkp_change(d, uid, name, amount, reason)
    save_dkp(d)
    if loot_item:
        led["loot_history"][-1]["status"] = "approved"
    save_ledger(led)
    return "applied"


def resolve_pending(pid: str, approve: bool) -> str:
    led = load_ledger()
    entry = next((p for p in led["pending"] if p["id"] == pid), None)
    if not entry:
        raise ValueError("položka už neexistuje")
    led["pending"].remove(entry)
    if approve:
        d = load_dkp()
        for uid, name in entry["players"]:
            dkp_change(d, uid, name, entry["amount"], entry["reason"])
        save_dkp(d)
    if entry.get("item"):
        for l in reversed(led["loot_history"]):
            if l["item"] == entry["item"] and l["status"] == "pending":
                l["status"] = "approved" if approve else "rejected"
                break
    save_ledger(led)
    who = entry["players"][0][1] + (f" +{len(entry['players']) - 1}" if len(entry["players"]) > 1 else "")
    return f"{'schválené' if approve else 'zamietnuté'}: {who} {entry['amount']:+} ({entry['reason']})"


def raid_players(raid: dict | None) -> list[tuple[str, str]]:
    return [(u, p["name"]) for u, p in (raid or {}).get("signups", {}).items() if p["role"] != "absent"]


dkp_group = app_commands.Group(name="dkp", description="DKP body a loot")


@dkp_group.command(name="show", description="Tvoje (alebo niečie) DKP a posledné zmeny")
async def dkp_show(inter: discord.Interaction, player: discord.Member | None = None):
    who = player or inter.user
    p = load_dkp().get(str(who.id))
    if not p:
        await inter.response.send_message(f"**{who.display_name}** má 0 DKP.")
        return
    hist = "\n".join(f"`{h['amount']:+}` {h['reason']}" for h in reversed(p["history"][-8:]))
    await inter.response.send_message(f"**{p['name']}: {p['points']} DKP**\n{hist}")


@dkp_group.command(name="top", description="Rebríček DKP")
async def dkp_top(inter: discord.Interaction):
    d = sorted(load_dkp().values(), key=lambda p: -p["points"])[:20]
    lines = [f"{i}. **{p['name']}** – {p['points']}" for i, p in enumerate(d, 1)]
    await inter.response.send_message("🏆 **DKP rebríček**\n" + ("\n".join(lines) or "Zatiaľ nikto."))


@dkp_group.command(name="award", description="(Officeri) Pridaj/uber DKP hráčovi, alebo celému raidu")
@app_commands.checks.has_permissions(manage_messages=True)
async def dkp_award(inter: discord.Interaction, amount: int, reason: str, player: discord.Member | None = None):
    if player:
        players = [(str(player.id), player.display_name)]
        label = f"**{player.display_name}**"
    else:
        players = raid_players(latest_raid()[1])
        if not players:
            await inter.response.send_message("Žiadny raid s prihlásenými. Zadaj `player:`.", ephemeral=True)
            return
        label = f"Celý raid ({len(players)} hráčov)"
    status = apply_dkp(players, amount, reason)
    tail = " – ⏳ čaká na schválenie v dashboarde" if status == "pending" else ""
    await inter.response.send_message(f"💰 {label} {amount:+} DKP ({reason}){tail}")


async def run_auction(channel, item: str, min_bid: int = 0):
    if channel.id in open_bids:
        await channel.send("Tu už beží bidovanie.")
        return
    secs = get_settings()["bid_seconds"]
    open_bids[channel.id] = {"item": item, "min": min_bid, "ends": int(_time.time()) + secs, "bids": {}}
    _dirty["v"] = True
    info = item_info(item) or {}
    holders = sr_holders(item)
    extra = (f"\n📌 SR: {', '.join(holders)}" if holders else "") + (f"\nℹ️ Priorita: {info['prio']}" if info.get("prio") else "")
    await channel.send(f"💎 **Bidovanie: {item}** – {secs} s. Bid cez `/dkp bid amount:` (min {min_bid}). Bidy sú tajné.{extra}{wl_text(item)}")
    await speak(channel.guild, f"Bidovanie na {item}")
    await asyncio.sleep(secs)
    auction = open_bids.pop(channel.id, None)
    _dirty["v"] = True
    if not auction or not auction["bids"]:
        await channel.send(f"Nikto nebidoval na **{item}**.")
        return
    ranked = sorted(auction["bids"].items(), key=lambda kv: -kv[1][0])
    uid, (amount, name) = ranked[0]
    status = apply_dkp([(uid, name)], -amount, f"Loot: {item}", loot_item=item)
    fulfilled = fulfill_wishlist(uid, item)
    others = ", ".join(f"{n} {a}" for _, (a, n) in ranked[1:5])
    tail = ("\n⏳ _Odpočet DKP čaká na schválenie officerom._" if status == "pending" else "") \
        + ("\n🎯 Wishlist splnený!" if fulfilled else "")
    await channel.send(f"🎉 **{item}** získava <@{uid}> za **{amount} DKP**!"
                       + (f"\n_Ďalšie bidy: {others}_" if others else "") + tail)
    await speak(channel.guild, f"{item} získava {name}")


@dkp_group.command(name="loot", description="(Officeri) Otvor bidovanie na item")
@app_commands.checks.has_permissions(manage_messages=True)
async def dkp_loot(inter: discord.Interaction, item: str, min_bid: int = 0):
    await inter.response.send_message(f"Otváram bidovanie na **{item}**…", ephemeral=True)
    await run_auction(inter.channel, item, min_bid)


@dkp_group.command(name="bid", description="Bidni na aktuálny item (tajne)")
async def dkp_bid(inter: discord.Interaction, amount: int):
    auction = open_bids.get(inter.channel_id)
    if not auction:
        await inter.response.send_message("Teraz nebeží žiadne bidovanie.", ephemeral=True)
        return
    have = load_dkp().get(str(inter.user.id), {}).get("points", 0)
    if amount < auction["min"] or amount > have:
        await inter.response.send_message(f"Bid musí byť od {auction['min']} do {have} (tvoje DKP).", ephemeral=True)
        return
    auction["bids"][str(inter.user.id)] = (amount, inter.user.display_name)
    _dirty["v"] = True
    await inter.response.send_message(f"✅ Tvoj bid {amount} na **{auction['item']}** je zapísaný.", ephemeral=True)


@dkp_award.error
@dkp_loot.error
async def dkp_officer_error(inter: discord.Interaction, err):
    if not inter.response.is_done():
        await inter.response.send_message("Len officeri.", ephemeral=True)


tree.add_command(dkp_group)


# ---------------- ATTENDANCE, PROGRESS & STATS ----------------
ATTENDANCE_FILE = pathlib.Path(__file__).parent / "attendance.json"
KILLS_FILE = pathlib.Path(__file__).parent / "kills.json"


def load_json(path: pathlib.Path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def save_json(path: pathlib.Path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    _dirty["v"] = True


def close_raid(rid: str, force: bool) -> str:
    """Close a raid: lock sign-ups, record attendance, give attendance DKP."""
    raids = load_raids()
    raid = raids.get(rid)
    if not raid:
        raise ValueError("raid neexistuje")
    if raid.get("closed"):
        return f"{raid['name']} už bol uzavretý"
    raid["closed"] = True
    save_raids(raids)
    players = raid_players(raid)
    att = load_json(ATTENDANCE_FILE, {})
    att[rid] = {"name": raid["name"], "time": raid["time"], "ts": raid.get("ts") or int(_time.time()),
                "players": dict(players),
                "excused": [u for u, p in raid["signups"].items() if p["role"] == "absent" and p.get("reason")]}
    save_json(ATTENDANCE_FILE, att)
    bonus = get_settings()["attendance_dkp"]
    tail = ""
    if bonus and players:
        status = apply_dkp(players, bonus, f"Účasť: {raid['name']} {raid['time']}", force=force)
        tail = f", +{bonus} DKP" + (" (čaká na schválenie)" if status == "pending" else "")
    return f"{raid['name']} uzavretý, prítomných {len(players)}{tail}"


def record_kill(boss: str, uids=()):
    kills = load_json(KILLS_FILE, {})
    k = kills.setdefault(boss, {"count": 0, "first": int(_time.time()), "last": 0})
    k["count"] += 1
    k["last"] = int(_time.time())
    k["by"] = sorted(set(k.get("by", [])) | set(uids))
    save_json(KILLS_FILE, kills)


def player_stats() -> dict:
    """uid -> {name, attended, total, pct, loot}"""
    att = load_json(ATTENDANCE_FILE, {})
    recent = sorted(att.values(), key=lambda r: r["ts"])[-20:]  # last 20 closed raids
    total = len(recent)
    stats: dict[str, dict] = {}
    for r in recent:
        for uid, name in r["players"].items():
            s = stats.setdefault(uid, {"name": name, "attended": 0})
            s["attended"] += 1
            s["name"] = name
    for l in load_ledger()["loot_history"]:
        if l["status"] == "approved":
            s = stats.setdefault(l["uid"], {"name": l["name"], "attended": 0})
            s.setdefault("loot", []).append(l["item"])
    excused: dict[str, int] = {}
    for r in recent:
        for u in r.get("excused", []):
            excused[u] = excused.get(u, 0) + 1
    for uid_, s in stats.items():
        t = max(total - excused.get(uid_, 0), s["attended"])
        s["total"] = t
        s["pct"] = round(100 * s["attended"] / t) if t else 0
        s.setdefault("loot", [])
    return stats


@tree.command(name="raidend", description="(Officeri) Uzavri posledný raid: dochádzka + DKP za účasť")
@app_commands.checks.has_permissions(manage_messages=True)
async def raidend(inter: discord.Interaction):
    raids = load_raids()
    open_ids = [rid for rid, r in raids.items() if not r.get("closed")]
    if not open_ids:
        await inter.response.send_message("Nie je otvorený žiadny raid.", ephemeral=True)
        return
    rid = open_ids[-1]
    msg = close_raid(rid, force=False)
    await refresh_card(load_raids()[rid])
    await inter.response.send_message(f"🏁 {msg}")
    await start_mvp(rid)


@raidend.error
async def raidend_error(inter: discord.Interaction, err):
    if not inter.response.is_done():
        await inter.response.send_message("Len officeri.", ephemeral=True)


@tree.command(name="stats", description="Dochádzka a loot hráča")
async def stats_cmd(inter: discord.Interaction, player: discord.Member | None = None):
    who = player or inter.user
    s = player_stats().get(str(who.id))
    if not s:
        await inter.response.send_message(f"**{who.display_name}** zatiaľ nemá zapísanú účasť.")
        return
    loot = ", ".join(s["loot"][-5:]) or "nič"
    await inter.response.send_message(
        f"📊 **{s['name']}** – účasť {s['attended']}/{s['total']} ({s['pct']} %) z posledných raidov\n🎁 Loot: {loot}")


@tree.command(name="progress", description="Guild progress – zabití bossovia")
async def progress_cmd(inter: discord.Interaction):
    kills = load_json(KILLS_FILE, {})
    lines = []
    for raid, bosses in RAID_BOSSES.items():
        done = sum(1 for b in bosses if b in kills)
        lines.append(f"**{raid}** {done}/{len(bosses)} " + " ".join("✅" if b in kills else "⬜" for b in bosses))
    await inter.response.send_message("🏆 **Guild progress**\n" + "\n".join(lines))


# ---------------- SOFT RESERVE & LOOT RULES ----------------
LOOT_FILE = pathlib.Path(__file__).parent / "loot.json"


def loot_table() -> dict:
    return {k: v for k, v in load_json(LOOT_FILE, {}).items() if not k.startswith("_")}


def item_info(item: str) -> dict | None:
    for items in loot_table().values():
        for it in items:
            if it["item"].lower() == item.lower():
                return it
    return None


def open_raid() -> tuple[str, dict] | tuple[None, None]:
    raids = load_raids()
    for rid in reversed(list(raids)):
        if not raids[rid].get("closed"):
            return rid, raids[rid]
    return None, None


def sr_holders(item: str) -> list[str]:
    _, raid = open_raid()
    if not raid:
        _, raid = latest_raid()
    return [v["name"] for v in (raid or {}).get("sr", {}).values()
            if any(i.lower() == item.lower() for i in v["items"])]


async def sr_autocomplete(_: discord.Interaction, current: str):
    _, raid = open_raid()
    items = loot_table().get(raid["name"], []) if raid else [i for v in loot_table().values() for i in v]
    return [app_commands.Choice(name=i["item"][:100], value=i["item"][:100])
            for i in items if current.lower() in i["item"].lower()][:25]


@tree.command(name="sr", description="Soft reserve: rezervuj si item na najbližší raid")
@app_commands.autocomplete(item=sr_autocomplete)
async def sr_cmd(inter: discord.Interaction, item: str):
    rid, raid = open_raid()
    if not raid:
        await inter.response.send_message("Nie je otvorený žiadny raid.", ephemeral=True)
        return
    limit = get_settings()["sr_limit"]
    if limit == 0:
        await inter.response.send_message("Soft reserve je vypnutý.", ephemeral=True)
        return
    uid = str(inter.user.id)
    raids = load_raids()
    entry = raids[rid].setdefault("sr", {}).setdefault(uid, {"name": inter.user.display_name, "items": []})
    if item in entry["items"]:
        await inter.response.send_message("Tento item už máš rezervovaný.", ephemeral=True)
        return
    replaced = ""
    if len(entry["items"]) >= limit:
        replaced = entry["items"].pop(0)
    entry["items"].append(item)
    save_raids(raids)
    info = item_info(item)
    prio = f"\nℹ️ Priorita guildy: {info['prio']}" if info and info.get("prio") else ""
    extra = f" (nahradil **{replaced}**)" if replaced else ""
    await inter.response.send_message(f"📌 SR na **{raid['name']}**: **{item}**{extra}{prio}", ephemeral=True)


@tree.command(name="srlist", description="Zoznam soft reservov na najbližší raid")
async def srlist(inter: discord.Interaction):
    _, raid = open_raid()
    if not raid or not raid.get("sr"):
        await inter.response.send_message("Zatiaľ žiadne soft reservy.")
        return
    by_item: dict[str, list[str]] = {}
    for v in raid["sr"].values():
        for i in v["items"]:
            by_item.setdefault(i, []).append(v["name"])
    lines = [f"**{i}** – {', '.join(n)}" + (" ⚔️" if len(n) > 1 else "") for i, n in sorted(by_item.items())]
    await inter.response.send_message(f"📌 **Soft reserve – {raid['name']}**\n" + "\n".join(lines)[:1900])


@tree.command(name="srclear", description="Zruš svoje soft reservy")
async def srclear(inter: discord.Interaction):
    rid, raid = open_raid()
    if raid:
        raids = load_raids()
        raids[rid].get("sr", {}).pop(str(inter.user.id), None)
        save_raids(raids)
    await inter.response.send_message("🗑️ Tvoje SR sú zrušené.", ephemeral=True)


@tree.command(name="prio", description="Loot priorita guildy pre item")
@app_commands.autocomplete(item=sr_autocomplete)
async def prio_cmd(inter: discord.Interaction, item: str):
    info = item_info(item)
    holders = sr_holders(item)
    txt = f"**{item}**\nPriorita: {info.get('prio') if info and info.get('prio') else 'bez pravidla (DKP rozhoduje)'}"
    if holders:
        txt += f"\nSR: {', '.join(holders)}"
    await inter.response.send_message(txt)


# ---------------- PLAYER PROFILES ----------------
PROFILES_FILE = pathlib.Path(__file__).parent / "profiles.json"
ATTUNES = {"mc": "Molten Core (Attunement to the Core)", "ony": "Onyxia (Drakefire Amulet)",
           "bwl": "Blackwing Lair (Blackhand's Command)"}


def load_profiles() -> dict:
    return load_json(PROFILES_FILE, {})


@tree.command(name="profile", description="Nastav svoju postavu (meno, trieda, spec, rola)")
@app_commands.choices(cls=[app_commands.Choice(name=c, value=c) for c in CLASSES],
                      role=[app_commands.Choice(name=v, value=k) for k, v in ROLES.items() if k != "absent"])
async def profile_cmd(inter: discord.Interaction, character: str, cls: app_commands.Choice[str],
                      role: app_commands.Choice[str], spec: str = ""):
    profs = load_profiles()
    p = profs.setdefault(str(inter.user.id), {"attunes": {}})
    p.update({"discord": inter.user.display_name, "character": character[:40], "cls": cls.value,
              "role": role.value, "spec": spec[:40]})
    save_json(PROFILES_FILE, profs)
    await inter.response.send_message(
        f"✅ Profil uložený: **{character}** – {spec} {cls.value} ({ROLES[role.value]}). "
        "Pri sign-upe ti trieda vyskočí sama.", ephemeral=True)


@tree.command(name="attune", description="Označ splnený attunement")
@app_commands.choices(raid=[app_commands.Choice(name=v, value=k) for k, v in ATTUNES.items()])
async def attune_cmd(inter: discord.Interaction, raid: app_commands.Choice[str], done: bool = True):
    profs = load_profiles()
    p = profs.setdefault(str(inter.user.id), {"attunes": {}, "discord": inter.user.display_name})
    p.setdefault("attunes", {})[raid.value] = done
    save_json(PROFILES_FILE, profs)
    await inter.response.send_message(f"{'✅' if done else '⬜'} {raid.name}", ephemeral=True)


@tree.command(name="me", description="Tvoj profil: postava, DKP, účasť, loot, attunementy")
async def me_cmd(inter: discord.Interaction, player: discord.Member | None = None):
    who = player or inter.user
    uid = str(who.id)
    p = load_profiles().get(uid, {})
    dkp = load_dkp().get(uid, {}).get("points", 0)
    s = player_stats().get(uid, {"attended": 0, "total": 0, "pct": 0, "loot": []})
    _, raid = open_raid()
    srs = (raid or {}).get("sr", {}).get(uid, {}).get("items", [])
    e = discord.Embed(title=p.get("character") or who.display_name, color=0xD9A441,
                      description=f"{p.get('spec', '')} {p.get('cls', '?')} · {ROLES.get(p.get('role'), '?')}".strip())
    e.add_field(name="💰 DKP", value=str(dkp))
    e.add_field(name="📊 Účasť", value=f"{s['attended']}/{s['total']} ({s['pct']} %)")
    e.add_field(name="🔑 Attunementy", value="\n".join(
        f"{'✅' if p.get('attunes', {}).get(k) else '⬜'} {v.split(' (')[0]}" for k, v in ATTUNES.items()), inline=False)
    e.add_field(name="🎁 Loot", value=", ".join(s["loot"][-6:]) or "zatiaľ nič", inline=False)
    if srs:
        e.add_field(name="📌 Soft reserve", value=", ".join(srs), inline=False)
    if not p:
        e.set_footer(text="Nastav si postavu cez /profile")
    await inter.response.send_message(embed=e)


# ---------------- PLAYER EXTRAS ----------------
# DM pripomienky, /absent, rola Raider, wishlist, trade, MVP, odznaky, trivia, meme-mód, /guide, /calendar
PLAYERS_FILE = pathlib.Path(__file__).parent / "players.json"
ACH_FILE = pathlib.Path(__file__).parent / "achievements.json"
TRIVIA_FILE = pathlib.Path(__file__).parent / "trivia.json"
QUIPS_FILE = pathlib.Path(__file__).parent / "quips.json"
GUIDES_FILE = pathlib.Path(__file__).parent / "guides.json"
_role_cache = {"id": RAID_ROLE_ID}


def load_players() -> dict:
    return load_json(PLAYERS_FILE, {})


def get_player(players: dict, uid: str) -> dict:
    p = players.setdefault(uid, {})
    p.setdefault("wishlist", [])
    p.setdefault("mvp", 0)
    p.setdefault("trivia", 0)
    p.setdefault("wish_done", 0)
    p.setdefault("dm_off", False)
    return p


# ----- Raider role -----
async def raider_role(guild: discord.Guild | None):
    if not guild or not get_settings()["auto_role"]:
        return None
    rid = _role_cache["id"]
    role = guild.get_role(int(rid)) if rid else discord.utils.get(guild.roles, name="Raider")
    if role is None:
        try:
            role = await guild.create_role(name="Raider", mentionable=True, colour=discord.Colour.gold(),
                                           reason="RaidLead: automatická rola pre prihlásených")
        except discord.HTTPException:
            return None
    _role_cache["id"] = str(role.id)
    return role


async def grant_raider_role(member):
    try:
        role = await raider_role(member.guild)
        if role and role not in member.roles:
            await member.add_roles(role, reason="Prihlásený na raid")
    except Exception as e:
        print("raider role:", e)


# ----- DM -----
async def dm_user(uid: str, text: str):
    if not get_settings()["dm_reminders"] or get_player(load_players(), uid)["dm_off"]:
        return
    try:
        user = client.get_user(int(uid)) or await client.fetch_user(int(uid))
        await user.send(text[:1990])
    except (discord.HTTPException, ValueError):
        pass


def consumes_text(raid_name: str) -> str:
    items = load_json(GUIDES_FILE, {}).get("consumes", {}).get(raid_name, [])
    return ("\n🧪 **Doniesť:** " + ", ".join(items)) if items else ""


@tree.command(name="dm", description="Zapni/vypni súkromné pripomienky raidov od bota")
async def dm_cmd(inter: discord.Interaction, enabled: bool):
    players = load_players()
    get_player(players, str(inter.user.id))["dm_off"] = not enabled
    save_json(PLAYERS_FILE, players)
    await inter.response.send_message("📬 DM pripomienky " + ("zapnuté." if enabled else "vypnuté."), ephemeral=True)


# ----- Absent -----
@tree.command(name="absent", description="Ospravedlň sa z najbližšieho raidu (účasť sa ti nezníži)")
async def absent_cmd(inter: discord.Interaction, reason: str):
    rid, raid = open_raid()
    if not raid:
        await inter.response.send_message("Nie je otvorený žiadny raid.", ephemeral=True)
        return
    raids = load_raids()
    raids[rid]["signups"][str(inter.user.id)] = {"name": inter.user.display_name, "role": "absent",
                                                  "cls": "-", "reason": reason[:80]}
    save_raids(raids)
    await inter.response.send_message(f"📝 Ospravedlnený z **{raid['name']}** ({raid['time']}): {reason[:80]}", ephemeral=True)
    await refresh_card(raids[rid])


# ----- Wishlist -----
async def item_autocomplete(_: discord.Interaction, current: str):
    items = sorted({i["item"] for v in loot_table().values() for i in v})
    return [app_commands.Choice(name=i[:100], value=i[:100]) for i in items if current.lower() in i.lower()][:25]


wishlist_group = app_commands.Group(name="wishlist", description="Zoznam želaní: bot ťa pingne, keď item padne")


@wishlist_group.command(name="add", description="Pridaj item do wishlistu")
@app_commands.autocomplete(item=item_autocomplete)
async def wl_add(inter: discord.Interaction, item: str):
    players = load_players()
    p = get_player(players, str(inter.user.id))
    if any(i.lower() == item.lower() for i in p["wishlist"]):
        await inter.response.send_message("Tento item už máš na wishliste.", ephemeral=True)
        return
    if len(p["wishlist"]) >= 10:
        await inter.response.send_message("Wishlist je plný (max 10). Odober niečo cez `/wishlist remove`.", ephemeral=True)
        return
    p["wishlist"].append(item)
    save_json(PLAYERS_FILE, players)
    await inter.response.send_message(f"🎯 Pridané: **{item}** ({len(p['wishlist'])}/10)", ephemeral=True)


@wishlist_group.command(name="remove", description="Odober item z wishlistu")
async def wl_remove(inter: discord.Interaction, item: str):
    players = load_players()
    p = get_player(players, str(inter.user.id))
    before = len(p["wishlist"])
    p["wishlist"] = [i for i in p["wishlist"] if i.lower() != item.lower()]
    save_json(PLAYERS_FILE, players)
    await inter.response.send_message("🗑️ Odobraté." if len(p["wishlist"]) < before else "Taký item na wishliste nemáš.", ephemeral=True)


@wishlist_group.command(name="show", description="Ukáž svoj wishlist")
async def wl_show(inter: discord.Interaction):
    p = get_player(load_players(), str(inter.user.id))
    await inter.response.send_message("🎯 **Wishlist:** " + (", ".join(p["wishlist"]) or "prázdny"), ephemeral=True)


tree.add_command(wishlist_group)


def wishlisters(item: str) -> list[str]:
    return [uid for uid, p in load_players().items() if any(i.lower() == item.lower() for i in p.get("wishlist", []))]


def wl_text(item: str) -> str:
    users = wishlisters(item)
    return ("\n🎯 Wishlist: " + " ".join(f"<@{u}>" for u in users)) if users else ""


def fulfill_wishlist(uid: str, item: str) -> bool:
    players = load_players()
    p = get_player(players, uid)
    if not any(i.lower() == item.lower() for i in p["wishlist"]):
        return False
    p["wishlist"] = [i for i in p["wishlist"] if i.lower() != item.lower()]
    p["wish_done"] += 1
    save_json(PLAYERS_FILE, players)
    return True


# ----- Trade -----
@tree.command(name="trade", description="Daj svoj loot item inému hráčovi (voliteľne za DKP)")
async def trade_cmd(inter: discord.Interaction, player: discord.Member, item: str, dkp: int = 0):
    uid, to = str(inter.user.id), str(player.id)
    if uid == to or player.bot:
        await inter.response.send_message("Toto nejde.", ephemeral=True)
        return
    if dkp < 0 or dkp > load_dkp().get(to, {}).get("points", 0):
        await inter.response.send_message(f"{player.display_name} nemá {dkp} DKP.", ephemeral=True)
        return
    led = load_ledger()
    mine = next((l for l in reversed(led["loot_history"])
                 if l["uid"] == uid and l["status"] == "approved" and l["item"].lower() == item.lower()), None)
    if not mine:
        await inter.response.send_message("Tento item nemáš zapísaný (pozri `/me`).", ephemeral=True)
        return
    mine["status"] = "traded"
    led["loot_history"].append({"item": mine["item"], "uid": to, "name": player.display_name, "amount": dkp,
                                "t": int(_time.time()), "status": "approved", "trade_from": inter.user.display_name})
    save_ledger(led)
    tail = ""
    if dkp:
        apply_dkp([(to, player.display_name)], -dkp, f"Trade: {mine['item']} od {inter.user.display_name}")
        apply_dkp([(uid, inter.user.display_name)], dkp, f"Trade: {mine['item']} pre {player.display_name}")
        tail = f" za **{dkp} DKP**"
    await inter.response.send_message(f"🤝 **{inter.user.display_name}** dal **{mine['item']}** hráčovi {player.mention}{tail}.")


# ----- MVP -----
async def start_mvp(rid: str):
    mins = get_settings()["mvp_minutes"]
    raids = load_raids()
    raid = raids.get(rid)
    players = raid_players(raid) if raid else []
    if not mins or len(players) < 3:
        return
    ch = await get_text_channel(raid["channel"])
    if not ch:
        return
    raid["mvp_ends"] = int(_time.time()) + mins * 60
    raid["mvp_votes"] = {}
    save_raids(raids)
    view = discord.ui.View(timeout=None)
    view.add_item(discord.ui.Select(
        placeholder="Kto bol MVP raidu?", custom_id=f"mvp:{rid}",
        options=[discord.SelectOption(label=name[:100], value=uid) for uid, name in players[:25]]))
    await ch.send(f"⭐ **MVP raidu – {raid['name']}**\nHlasuj za hráča, ktorý ťa dnes najviac podržal. "
                  f"Hlasovanie končí o {mins} min. (Za seba hlasovať nejde.)", view=view)


async def handle_mvp_vote(inter: discord.Interaction, rid: str):
    raids = load_raids()
    raid = raids.get(rid)
    if not raid or raid.get("mvp_done") or not raid.get("mvp_ends"):
        await inter.response.send_message("Hlasovanie už skončilo.", ephemeral=True)
        return
    voter = str(inter.user.id)
    if raid["signups"].get(voter, {}).get("role", "absent") == "absent":
        await inter.response.send_message("Hlasovať môžu len účastníci raidu.", ephemeral=True)
        return
    choice = inter.data["values"][0]
    if choice == voter:
        await inter.response.send_message("Za seba hlasovať nejde 😉", ephemeral=True)
        return
    raid.setdefault("mvp_votes", {})[voter] = choice
    save_raids(raids)
    await inter.response.send_message("✅ Hlas zapísaný (môžeš ho do konca hlasovania zmeniť).", ephemeral=True)


async def finalize_mvps():
    raids = load_raids()
    changed = False
    for rid, raid in raids.items():
        if not raid.get("mvp_ends") or raid.get("mvp_done") or _time.time() < raid["mvp_ends"]:
            continue
        raid["mvp_done"] = True
        changed = True
        ch = await get_text_channel(raid["channel"])
        tally: dict[str, int] = {}
        for c in raid.get("mvp_votes", {}).values():
            tally[c] = tally.get(c, 0) + 1
        if not tally:
            if ch:
                await ch.send(f"⭐ MVP raidu **{raid['name']}**: nikto nehlasoval.")
            continue
        top = max(tally.values())
        winners = [(u, raid["signups"][u]["name"]) for u, c in tally.items() if c == top and u in raid["signups"]]
        players = load_players()
        for u, _ in winners:
            get_player(players, u)["mvp"] += 1
        save_json(PLAYERS_FILE, players)
        bonus = get_settings()["mvp_dkp"]
        if bonus and winners:
            apply_dkp(winners, bonus, f"MVP: {raid['name']}")
        if ch:
            names = ", ".join(f"<@{u}>" for u, _ in winners)
            await ch.send(f"🏆 **MVP raidu {raid['name']}:** {names} ({top} hlasov)" + (f" – +{bonus} DKP" if bonus else ""))
    if changed:
        save_raids(raids)


# ----- Achievements -----
ACH_DEFS = {
    "first_raid": ("🌱", "Prvý raid", "Zúčastni sa prvého raidu"),
    "veteran": ("🎖️", "Veterán", "10 odraidovaných raidov"),
    "iron": ("💯", "Železná účasť", "100 % účasť (aspoň 5 raidov)"),
    "first_loot": ("🎁", "Prvý loot", "Získaj prvý item"),
    "loot5": ("💎", "Zberateľ", "Získaj 5 itemov"),
    "dkp100": ("💰", "Stovkár", "Maj aspoň 100 DKP"),
    "dkp500": ("🏦", "Bankár", "Maj aspoň 500 DKP"),
    "mvp": ("⭐", "MVP", "Vyhraj MVP raidu"),
    "mvp3": ("🌟", "Hviezda raidu", "3× MVP"),
    "trivia5": ("🧠", "Znalec bossov", "5 správnych odpovedí v trivia"),
    "trivia20": ("🎓", "Profesor", "20 správnych odpovedí v trivia"),
    "wish": ("🎯", "Wishlist splnený", "Získaj item zo svojho wishlistu"),
    "ony": ("🐉", "Onyxia down", "Buď pri killi Onyxie"),
    "rag": ("🔥", "Ragnaros down", "Buď pri killi Ragnarosa"),
    "nef": ("👑", "Nefarian down", "Buď pri killi Nefariana"),
    "attuned": ("🔑", "Pripravený", "Maj všetky 3 attunementy"),
}


def compute_ach(uid: str, stats: dict, dkp: dict, players: dict, profiles: dict, kills: dict) -> set[str]:
    s, p, pr = stats.get(uid, {}), players.get(uid, {}), profiles.get(uid, {})
    got = set()
    if s.get("attended", 0) >= 1: got.add("first_raid")
    if s.get("attended", 0) >= 10: got.add("veteran")
    if s.get("total", 0) >= 5 and s.get("pct") == 100: got.add("iron")
    n = len(s.get("loot", []))
    if n >= 1: got.add("first_loot")
    if n >= 5: got.add("loot5")
    pts = dkp.get(uid, {}).get("points", 0)
    if pts >= 100: got.add("dkp100")
    if pts >= 500: got.add("dkp500")
    if p.get("mvp", 0) >= 1: got.add("mvp")
    if p.get("mvp", 0) >= 3: got.add("mvp3")
    if p.get("trivia", 0) >= 5: got.add("trivia5")
    if p.get("trivia", 0) >= 20: got.add("trivia20")
    if p.get("wish_done", 0) >= 1: got.add("wish")
    for key, boss in (("ony", "onyxia"), ("rag", "ragnaros"), ("nef", "nefarian")):
        if uid in kills.get(boss, {}).get("by", []): got.add(key)
    if all(pr.get("attunes", {}).get(k) for k in ATTUNES): got.add("attuned")
    return got


async def announce_new_achievements():
    stats, dkp, players = player_stats(), load_dkp(), load_players()
    profiles, kills = load_profiles(), load_json(KILLS_FILE, {})
    have = load_json(ACH_FILE, {})
    new_lines = []
    for uid in set(stats) | set(dkp) | set(players) | set(profiles):
        mine = have.setdefault(uid, {})
        for key in compute_ach(uid, stats, dkp, players, profiles, kills):
            if key not in mine:
                mine[key] = int(_time.time())
                icon, name, _ = ACH_DEFS[key]
                new_lines.append(f"{icon} <@{uid}> získal odznak **{name}**!")
    if new_lines:
        save_json(ACH_FILE, have)
        ch = await get_text_channel(None)
        if ch:
            await ch.send("🏅 **Nové odznaky**\n" + "\n".join(new_lines[:15]),
                          allowed_mentions=discord.AllowedMentions(users=True))


# ----- Trivia -----
class TriviaView(discord.ui.View):
    def __init__(self, q: dict):
        super().__init__(timeout=30)
        self.q, self.answered, self.winner, self.msg = q, set(), None, None
        opts = list(enumerate(q["options"]))
        random.shuffle(opts)
        self.correct = next(i for i, (orig, _) in enumerate(opts) if orig == q["answer"])
        for i, (_, text) in enumerate(opts):
            b = discord.ui.Button(label=f"{'ABCD'[i]}) {text}"[:80], style=discord.ButtonStyle.secondary)
            b.callback = self._cb(i)
            self.add_item(b)
        self.correct_text = opts[self.correct][1]

    def _cb(self, i: int):
        async def cb(inter: discord.Interaction):
            uid = str(inter.user.id)
            if self.winner:
                await inter.response.send_message(f"Už vyhral {self.winner.display_name}.", ephemeral=True)
                return
            if uid in self.answered:
                await inter.response.send_message("Už si odpovedal.", ephemeral=True)
                return
            self.answered.add(uid)
            if i != self.correct:
                await inter.response.send_message("❌ Nie.", ephemeral=True)
                return
            self.winner = inter.user
            players = load_players()
            get_player(players, uid)["trivia"] += 1
            save_json(PLAYERS_FILE, players)
            bonus = get_settings()["trivia_dkp"]
            if bonus:
                apply_dkp([(uid, inter.user.display_name)], bonus, "Trivia")
            for c in self.children:
                c.disabled = True
            await inter.response.send_message(
                f"✅ **{inter.user.display_name}** má správne: **{self.correct_text}**. {self.q['explain']}"
                + (f" (+{bonus} DKP)" if bonus else ""))
            await inter.message.edit(view=self)
            self.stop()
        return cb

    async def on_timeout(self):
        if self.winner or not self.msg:
            return
        for c in self.children:
            c.disabled = True
        try:
            await self.msg.edit(view=self)
            await self.msg.channel.send(f"⏰ Nikto nehádal správne. Odpoveď: **{self.correct_text}**. {self.q['explain']}")
        except discord.HTTPException:
            pass


async def post_trivia(channel) -> bool:
    qs = load_json(TRIVIA_FILE, [])
    if not qs:
        return False
    q = random.choice(qs)
    view = TriviaView(q)
    view.msg = await channel.send(f"🧠 **Raid trivia:** {q['q']}\n_Prvá správna odpoveď získa bod. 30 sekúnd!_", view=view)
    return True


trivia_group = app_commands.Group(name="trivia", description="Raid trivia")


@trivia_group.command(name="start", description="(Officeri) Pošli trivia otázku")
@app_commands.checks.has_permissions(manage_messages=True)
async def trivia_start(inter: discord.Interaction):
    await inter.response.send_message("🧠 Posielam otázku…", ephemeral=True)
    await post_trivia(inter.channel)


@trivia_group.command(name="top", description="Rebríček trivia")
async def trivia_top(inter: discord.Interaction):
    ranked = sorted(((p.get("trivia", 0), uid) for uid, p in load_players().items() if p.get("trivia", 0)), reverse=True)[:10]
    lines = [f"{i}. <@{u}> – {n}" for i, (n, u) in enumerate(ranked, 1)]
    await inter.response.send_message("🧠 **Trivia rebríček**\n" + ("\n".join(lines) or "Zatiaľ nikto."),
                                      allowed_mentions=discord.AllowedMentions.none())


@trivia_start.error
async def trivia_officer_error(inter: discord.Interaction, err):
    if not inter.response.is_done():
        await inter.response.send_message("Len officeri.", ephemeral=True)


tree.add_command(trivia_group)


# ----- Meme mode -----
async def meme_quip(channel, guild, kind: str, say_it: bool = True):
    if not get_settings()["meme_mode"]:
        return
    lines = load_json(QUIPS_FILE, {}).get(kind, [])
    if not lines:
        return
    line = random.choice(lines)
    await channel.send(f"💬 _{line}_")
    vc = guild.voice_client if guild else None
    if say_it and not (vc and vc.is_playing()):
        await speak(guild, line)


# ----- Guide & calendar -----
@tree.command(name="guide", description="Sprievodca: ako sa pripraviť na raid")
@app_commands.choices(topic=[app_commands.Choice(name="Molten Core", value="mc"),
                             app_commands.Choice(name="Onyxia", value="ony"),
                             app_commands.Choice(name="Blackwing Lair", value="bwl"),
                             app_commands.Choice(name="Začiatočník", value="newbie")])
async def guide_cmd(inter: discord.Interaction, topic: app_commands.Choice[str]):
    g = load_json(GUIDES_FILE, {}).get(topic.value)
    if not g:
        await inter.response.send_message("Tento sprievodca zatiaľ chýba.", ephemeral=True)
        return
    e = discord.Embed(title=g["title"], description=g["text"], color=0xD9A441)
    raid_name = {"mc": "Molten Core", "ony": "Onyxia", "bwl": "Blackwing Lair"}.get(topic.value)
    if raid_name:
        e.add_field(name="Bossovia", value=", ".join(b.replace("-", " ").title() for b in RAID_BOSSES[raid_name]), inline=False)
        cons = load_json(GUIDES_FILE, {}).get("consumes", {}).get(raid_name, [])
        if cons:
            e.add_field(name="🧪 Consumables", value="\n".join(f"• {c}" for c in cons), inline=False)
    await inter.response.send_message(embed=e, ephemeral=True)


@tree.command(name="calendar", description="Raidy v tvojom kalendári (Google / Apple / Outlook)")
async def calendar_cmd(inter: discord.Interaction):
    host = DASHBOARD_URL.replace("https://", "").replace("http://", "")
    await inter.response.send_message(
        "📅 **Raidy v kalendári** (aktualizuje sa samo, aj s časovou zónou)\n"
        f"• Google Calendar: <https://calendar.google.com/calendar/render?cid=webcal://{host}/cal.ics>\n"
        f"• Apple / Outlook: `webcal://{host}/cal.ics`\n"
        f"• Súbor .ics: <{DASHBOARD_URL}/cal.ics>", ephemeral=True)


@tree.command(name="web", description="Tvoj profil na webe (DKP, účasť, odznaky) a verejná stránka guildy")
async def web_cmd(inter: discord.Interaction):
    await inter.response.send_message(f"🌐 Môj profil: <{DASHBOARD_URL}/me>\n🏆 Guild stránka: <{DASHBOARD_URL}/guild>", ephemeral=True)


@tree.command(name="achievements", description="Tvoje odznaky")
async def ach_cmd(inter: discord.Interaction, player: discord.Member | None = None):
    who = player or inter.user
    mine = load_json(ACH_FILE, {}).get(str(who.id), {})
    lines = [f"{ACH_DEFS[k][0]} **{ACH_DEFS[k][1]}** – {ACH_DEFS[k][2]}" for k in ACH_DEFS if k in mine]
    locked = [f"▫️ {ACH_DEFS[k][1]}" for k in ACH_DEFS if k not in mine]
    await inter.response.send_message(
        f"🏅 **Odznaky – {who.display_name}** ({len(mine)}/{len(ACH_DEFS)})\n" + ("\n".join(lines) or "Zatiaľ žiadne.")
        + ("\n\n_Zamknuté:_ " + ", ".join(locked) if locked else ""), ephemeral=True)


@tasks.loop(minutes=1)
async def housekeeping_loop():
    try:
        await finalize_mvps()
        await announce_new_achievements()
    except Exception as e:
        print("housekeeping:", e)


def players_state() -> dict:
    ach = load_json(ACH_FILE, {})
    players = load_players()
    return {u: {"wishlist": players.get(u, {}).get("wishlist", []), "mvp": players.get(u, {}).get("mvp", 0),
                "trivia": players.get(u, {}).get("trivia", 0), "ach": sorted(ach.get(u, {}))}
            for u in set(players) | set(ach)}


# ---------------- WEB DASHBOARD SYNC (wow-forever.sk/raid) ----------------
DASHBOARD_URL = os.getenv("DASHBOARD_URL", "https://wow-forever.sk/raid").rstrip("/")
DASHBOARD_KEY = os.getenv("DASHBOARD_KEY")


def main_guild() -> discord.Guild | None:
    if GUILD_ID:
        g = client.get_guild(int(GUILD_ID))
        if g:
            return g
    return client.guilds[0] if client.guilds else None


async def get_text_channel(channel_id) -> discord.abc.Messageable | None:
    cid = channel_id or get_settings()["announce_channel"]
    if not cid:
        _, raid = latest_raid()
        cid = raid and raid.get("channel")
    if not cid:
        return None
    try:
        return client.get_channel(int(cid)) or await client.fetch_channel(int(cid))
    except (discord.HTTPException, ValueError):
        return None


def build_state() -> dict:
    g = main_guild()
    me = g.me if g else None
    vc = g.voice_client if g else None
    led = load_ledger()
    pending = [{"id": p["id"], "uid": p["players"][0][0], "name": p["players"][0][1], "count": len(p["players"]),
                "amount": p["amount"], "reason": p["reason"], "item": p.get("item"), "t": p["t"]}
               for p in led["pending"]]
    dkp = {u: {"name": p["name"], "points": p["points"], "history": p["history"][-10:]} for u, p in load_dkp().items()}
    raids = dict(list(load_raids().items())[-15:])
    auction = next(({"item": a["item"], "ends": a["ends"], "bids": len(a["bids"])} for a in open_bids.values()), None)
    channels = []
    if g and me:
        channels = [{"id": str(c.id), "name": c.name} for c in g.text_channels
                    if c.permissions_for(me).send_messages][:100]
    return {
        "bot": {"name": str(client.user) if client.user else "",
                "voice_channel": vc.channel.name if vc and vc.is_connected() else None},
        "raids": raids, "dkp": dkp, "pending": pending, "loot_history": led["loot_history"][-50:],
        "settings": get_settings(), "channels": channels, "auction": auction,
        "stats": player_stats(), "kills": load_json(KILLS_FILE, {}), "profiles": load_profiles(),
        "raid_bosses": RAID_BOSSES,
        "players": players_state(),
        "ach_defs": {k: {"icon": v[0], "name": v[1], "desc": v[2]} for k, v in ACH_DEFS.items()},
    }


async def execute_action(a: dict) -> str:
    t = a.get("type")
    g = main_guild()
    if t == "approve" or t == "reject":
        return resolve_pending(str(a["pid"]), t == "approve")
    if t == "setting":
        set_setting(a["key"], a["value"])
        _dirty["v"] = True
        return f"{a['key']} = {a['value']}"
    if t == "say":
        if not await speak(g, a["text"]):
            raise RuntimeError("bot nie je vo voice (/join)")
        return "povedané"
    if t == "announce":
        ch = await get_text_channel(a.get("channel"))
        if not ch:
            raise RuntimeError("chýba kanál – nastav ho v Nastaveniach")
        ping = {"here": "@here ", "role": f"<@&{_role_cache['id']}> " if _role_cache["id"] else "@here "}.get(a.get("ping") or "", "")
        await ch.send(f"{ping}📢 {a['text']}"[:2000],
                      allowed_mentions=discord.AllowedMentions(everyone=True, roles=True, users=False))
        if a.get("speak"):
            await speak(g, a["text"])
        return f"poslané do #{getattr(ch, 'name', '?')}"
    if t == "raid_create":
        if a["name"] not in RAID_BOSSES:
            raise ValueError("neznámy raid")
        ch = await get_text_channel(a.get("channel"))
        if not ch:
            raise RuntimeError("chýba kanál")
        await post_raid(ch, a["name"], a["time"], a.get("note", ""))
        return f"sign-up v #{getattr(ch, 'name', '?')}"
    if t == "raid_close":
        msg = close_raid(a["rid"], force=True)
        await refresh_card(load_raids()[a["rid"]])
        await start_mvp(a["rid"])
        return msg
    if t == "signup_remove":
        raids = load_raids()
        raid = raids.get(a["rid"])
        if not raid or a["uid"] not in raid["signups"]:
            raise ValueError("prihláška neexistuje")
        name = raid["signups"].pop(a["uid"])["name"]
        save_raids(raids)
        await refresh_card(raid)
        return f"{name} odstránený"
    if t == "award":
        amount, reason = int(a["amount"]), str(a.get("reason") or "Dashboard")
        if a.get("uid"):
            d = load_dkp()
            name = d.get(a["uid"], {}).get("name", a["uid"])
            players = [(a["uid"], name)]
        else:
            raids = load_raids()
            raid = raids.get(a["raid"]) if a.get("raid") else latest_raid()[1]
            players = raid_players(raid)
            if not players:
                raise ValueError("raid nemá prihlásených")
        apply_dkp(players, amount, reason, force=True)  # officer on dashboard = already approved
        return f"{len(players)} hráč(ov) {amount:+} DKP"
    if t == "loot_open":
        ch = await get_text_channel(a.get("channel"))
        if not ch:
            raise RuntimeError("chýba kanál")
        asyncio.create_task(run_auction(ch, a["item"], int(a.get("min") or 0)))
        return f"bidovanie v #{getattr(ch, 'name', '?')}"
    if t == "trivia":
        ch = await get_text_channel(a.get("channel"))
        if not ch or not await post_trivia(ch):
            raise RuntimeError("chýba kanál alebo trivia.json")
        return "otázka poslaná"
    raise ValueError(f"neznáma akcia {t}")


_last_push = {"t": 0.0}


@tasks.loop(seconds=8)
async def dashboard_loop():
    if not DASHBOARD_KEY:
        return
    headers = {"authorization": f"Bearer {DASHBOARD_KEY}"}
    try:
        async with aiohttp.ClientSession(headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as s:
            async with s.get(f"{DASHBOARD_URL}/api/bot/outbox") as r:
                actions = (await r.json()).get("actions", []) if r.status == 200 else []
            results = []
            for a in actions:
                try:
                    results.append({"id": a["id"], "ok": True, "message": await execute_action(a)})
                except Exception as e:
                    results.append({"id": a["id"], "ok": False, "message": str(e)})
            if results:
                await s.post(f"{DASHBOARD_URL}/api/bot/ack", json={"results": results})
                _dirty["v"] = True
            if _dirty["v"] or _time.time() - _last_push["t"] > 45:
                _dirty["v"] = False
                _last_push["t"] = _time.time()
                await s.post(f"{DASHBOARD_URL}/api/bot/state", data=json.dumps(build_state(), ensure_ascii=False),
                             headers={"content-type": "application/json"})
    except Exception as e:
        print("dashboard sync:", e)


@client.event
async def on_ready():
    if not reminder_loop.is_running():
        reminder_loop.start()
    if not dashboard_loop.is_running():
        dashboard_loop.start()
    if not housekeeping_loop.is_running():
        housekeeping_loop.start()
    if GUILD_ID:
        g = discord.Object(id=int(GUILD_ID))
        tree.copy_global_to(guild=g)
        await tree.sync(guild=g)
    else:
        await tree.sync()
    print(f"RaidLead online as {client.user}")


client.run(DISCORD_TOKEN)
