// まるシマリバーシ「よびだし」の中継（Supabase Edge Function：uchinoaji プロジェクトに置く。表は rv_ だけ）
// 端末は 自分で作った id と secret で名乗る（ログインなし）。相手の id は、一度つながった相手どうしだけが知っている。
//   POST {op:"reg",  id, secret, name, sub | expo}  … 通知の宛先（Web Push の購読、またはアプリ版の Expo トークン）を登録・更新
//   POST {op:"call", id, secret, to, title, body, url, tag} … 相手に通知を送る
//   POST {op:"cancel", id, secret, to, tag}          … 呼び出しを取り消す（相手の通知を消す）
//   POST {op:"hint", r, n, fd, fp}                    … 招待の案内ページ：この端末で アプリを入れに行った、と一時的に記録（1時間）
//   POST {op:"accept", id, secret, to, name}          … 招待リンクを開いた：招待した人（to）に「とうろく」を伝える（通知を受けとれれば 通知も）
//   POST {op:"pending", id, secret}                   … 自分あての「とうろく」を受けとる（受けとったら消す）＋ いま自分を待っている人（waits）
//   POST {op:"claim", fp}                             … アプリを初めて開いた：さっきの招待があれば その部屋を返す（返したら消す）
//   POST {op:"wait", id, secret, to, room}            … to を 自分の部屋で 待っている（5秒ごとに 送りなおす）。to が 自分を待っていれば other で返す
//   POST {op:"peek", id, secret, to}                  … to が 自分を 待っているか（待っていれば other：{room}）
//   POST {op:"unwait", id, secret}                    … 待つのを やめた（2026-11-23：2人が同時に名前を押しても つながるように）
//   POST {op:"code", id, secret, name}                … お誘いの番号（6けた・24時間）を もらう。まだ使える番号が あれば 同じ番号（2026-11-26）
//   POST {op:"redeem", id, secret, code, name}        … お誘いの番号を入れた：番号を出した人に「とうろく」を伝える（accept と同じ）。{dev, name} を返す
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

// 許す呼び出し元：Web 版（GitHub Pages）・招待リンクの案内ページ（www.uchinoaji.com/rv）と、アプリ版の中の localhost（番号は毎回変わる）、手元の確認用
const ORIGINS = ["https://amane1234567jp-crypto.github.io", "https://www.uchinoaji.com"];
const originOk = (o: string) => ORIGINS.includes(o) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
let vapidReady = false;
async function vapid() {
  if (vapidReady) return;
  const { data } = await db.from("rv_config").select("k,v");
  const c = Object.fromEntries((data || []).map((r: { k: string; v: string }) => [r.k, r.v]));
  webpush.setVapidDetails(c.vapid_subject, c.vapid_public, c.vapid_private);
  vapidReady = true;
}
async function sha(s: string) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return Array.from(h, b => b.toString(16).padStart(2, "0")).join("");
}
const ok = (v: string) => typeof v === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(v);
const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

async function me(id: string, secret: string) {
  if (!ok(id) || !ok(secret)) return null;
  const { data, error } = await db.from("rv_devices").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.secret_hash !== await sha(secret)) return null;
  return data;
}

// 招待の引きつぎ（2026-11-15）：通信元（IP）と 端末のようす（画面の大きさ・OS・時間帯・言語）で照合する
const FP_KEYS = ["os", "w", "h", "dpr", "tz", "lang"];
function cleanFp(f: any) {
  const o: Record<string, string> = {};
  for (const k of FP_KEYS) o[k] = clip(f && f[k], 40);
  return o;
}
const same = (a: Record<string, string>, b: Record<string, string>, keys: string[]) => keys.every(k => a[k] && a[k] === b[k]);
async function handleInvite(b: Record<string, any>, ip: string) {
  await db.from("rv_invites").delete().lt("at", new Date(Date.now() - 3600e3).toISOString());
  const fp = cleanFp(b.fp);
  if (b.op === "hint") {
    if (!ok(String(b.r || "").padEnd(16, "_")) || String(b.r).length > 40) return [400, { error: "bad r" }];
    const { count } = await db.from("rv_invites").select("id", { count: "exact", head: true }).eq("ip", ip);
    if ((count || 0) > 20) return [429, { error: "too many" }];
    await db.from("rv_invites").delete().eq("ip", ip).eq("room", b.r);
    const fd = /^[A-Za-z0-9_-]{16,64}$/.test(String(b.fd || "")) ? String(b.fd) : "";
    const { error } = await db.from("rv_invites").insert({ ip, fp: { ...fp, fd }, room: b.r, name: clip(b.n, 20) });
    if (error) return [500, { error: error.message }];
    return [200, { ok: true }];
  }
  // claim：まず「同じ通信元 ＋ 同じ画面・OS・時間帯」、なければ「画面・OS・時間帯・言語が同じで 1件だけ」（携帯の通信元が変わったとき）
  const { data } = await db.from("rv_invites").select("*").order("at", { ascending: false }).limit(200);
  const rows = (data || []) as any[];
  let hit = ip && rows.find(r => r.ip === ip && same(r.fp, fp, ["os", "w", "h", "dpr", "tz"]));
  if (!hit) {
    const c = rows.filter(r => Date.now() - new Date(r.at).getTime() < 20 * 60e3 && same(r.fp, fp, ["os", "w", "h", "dpr", "tz", "lang"]));
    if (c.length === 1) hit = c[0];
  }
  if (!hit) return [200, { ok: false }];
  await db.from("rv_invites").delete().eq("id", hit.id);
  return [200, { ok: true, r: hit.room, n: hit.name, fd: (hit.fp && hit.fp.fd) || "" }];
}

// 「とうろく」を伝える（accept と redeem で つかう）。招待した人が アプリの通知を受けとれるなら しらせる（受けとれないときは 次に開いたとき pending で わかる）
async function pairUp(to: string, fromId: string, name: string, url: string) {
  const { error } = await db.from("rv_pairs").upsert({ to_id: to, from_id: fromId, name, at: new Date().toISOString() }, { onConflict: "to_id,from_id" });
  if (error) return error.message;
  const { data: t } = await db.from("rv_devices").select("id,sub").eq("id", to).maybeSingle();
  if (t && t.sub && t.sub.expo) {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({
        to: t.sub.expo, title: "テレビ電話リバーシ", body: `${name || "あいて"}が とうろく しました`, sound: "default", priority: "high", ttl: 3600, channelId: "call",
        data: { url, tag: "rv-accept", from: fromId, at: Date.now() } }) });
    } catch (e) { /* 通知できなくても 登録は残る */ }
  }
  return "";
}

async function handle(b: Record<string, any>, ip: string) {
  if (b.op === "reg") {
    if (!ok(b.id) || !ok(b.secret)) return [400, { error: "bad id" }];
    const h = await sha(b.secret);
    const { data: cur, error: e1 } = await db.from("rv_devices").select("secret_hash").eq("id", b.id).maybeSingle();
    if (e1) return [500, { error: e1.message }];
    if (cur && cur.secret_hash !== h) return [403, { error: "secret" }];
    // アプリ版は Expo のトークン（ExponentPushToken[...]）を sub の代わりに {expo} の形で持つ
    const expo = typeof b.expo === "string" && /^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$/.test(b.expo) ? { expo: b.expo } : null;
    const sub = expo || (b.sub && b.sub.endpoint && /^https:\/\//.test(b.sub.endpoint) ? b.sub : null);
    const row: Record<string, unknown> = { id: b.id, secret_hash: h, name: clip(b.name, 20), updated_at: new Date().toISOString() };
    if (sub || b.clear) row.sub = sub;
    const { error: e2 } = await db.from("rv_devices").upsert(row);
    if (e2) return [500, { error: e2.message }];
    return [200, { ok: true, push: !!sub }];
  }
  if (b.op === "accept") {
    const from = await me(b.id, b.secret);
    if (!from) return [403, { error: "who" }];
    if (!ok(b.to) || b.to === from.id) return [400, { error: "bad to" }];
    const name = clip(b.name || from.name, 20);
    const err = await pairUp(b.to, from.id, name, clip(b.url, 400));
    if (err) return [500, { error: err }];
    return [200, { ok: true }];
  }
  if (b.op === "code") {
    const meRow = await me(b.id, b.secret);
    if (!meRow) return [403, { error: "who" }];
    await db.from("rv_codes").delete().lt("at", new Date(Date.now() - 24 * 3600e3).toISOString());
    // あと1時間 以上 使える番号が あれば それを返す（何度 さそう画面を 開いても 同じ番号）
    const { data: cur } = await db.from("rv_codes").select("code,at").eq("host_id", meRow.id).gt("at", new Date(Date.now() - 23 * 3600e3).toISOString()).order("at", { ascending: false }).limit(1).maybeSingle();
    if (cur) { await db.from("rv_codes").update({ name: clip(b.name || meRow.name, 20) }).eq("code", cur.code); return [200, { ok: true, code: cur.code }]; }
    for (let i = 0; i < 8; i++) {
      const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
      const { error } = await db.from("rv_codes").insert({ code, host_id: meRow.id, name: clip(b.name || meRow.name, 20) });
      if (!error) return [200, { ok: true, code }];
    }
    return [500, { error: "code" }];
  }
  if (b.op === "redeem") {
    const from = await me(b.id, b.secret);
    if (!from) return [403, { error: "who" }];
    const code = String(b.code || "").replace(/\D/g, "");
    if (!/^[0-9]{6}$/.test(code)) return [400, { error: "bad code" }];
    // 当てずっぽう よけ：まちがいは 通信元ごとに 1時間 20回まで
    await db.from("rv_code_tries").delete().lt("at", new Date(Date.now() - 3600e3).toISOString());
    const { count } = await db.from("rv_code_tries").select("id", { count: "exact", head: true }).eq("ip", ip);
    if ((count || 0) >= 20) return [429, { error: "too many" }];
    const { data: row } = await db.from("rv_codes").select("code,host_id,name,at").eq("code", code).gt("at", new Date(Date.now() - 24 * 3600e3).toISOString()).maybeSingle();
    if (!row) { await db.from("rv_code_tries").insert({ ip }); return [200, { ok: false, reason: "nocode" }]; }
    if (row.host_id === from.id) return [200, { ok: false, reason: "self" }];
    const err = await pairUp(row.host_id, from.id, clip(b.name || from.name, 20), "");
    if (err) return [500, { error: err }];
    return [200, { ok: true, dev: row.host_id, name: row.name }];
  }
  if (b.op === "pending") {
    const meRow = await me(b.id, b.secret);
    if (!meRow) return [403, { error: "who" }];
    const { data } = await db.from("rv_pairs").select("from_id,name,at").eq("to_id", meRow.id).order("at", { ascending: true }).limit(20);
    if (data && data.length) await db.from("rv_pairs").delete().eq("to_id", meRow.id);
    // 自分を いま 待っている人（2026-11-26）：アプリを ひらいたら リンクなしでも その部屋に 入れるように。20秒 以内に 更新されたものだけ
    const { data: w } = await db.from("rv_waits").select("host_id,room,at").eq("to_id", meRow.id).gt("at", new Date(Date.now() - 20e3).toISOString()).limit(5);
    const ids = (w || []).map((r: any) => r.host_id);
    const { data: nm } = ids.length ? await db.from("rv_devices").select("id,name").in("id", ids) : { data: [] };
    const names = Object.fromEntries((nm || []).map((r: any) => [r.id, r.name]));
    const waits = (w || []).map((r: any) => ({ dev: r.host_id, room: r.room, name: names[r.host_id] || "" }));
    return [200, { ok: true, list: (data || []).map((r: any) => ({ dev: r.from_id, name: r.name })), waits }];
  }
  if (b.op === "wait" || b.op === "peek" || b.op === "unwait") {
    const meRow = await me(b.id, b.secret);
    if (!meRow) return [403, { error: "who" }];
    if (b.op === "unwait") { await db.from("rv_waits").delete().eq("host_id", meRow.id); return [200, { ok: true }]; }
    if (!ok(b.to) || b.to === meRow.id) return [400, { error: "bad to" }];
    if (b.op === "wait") {
      if (!/^[a-z0-9]{4,40}$/.test(String(b.room || ""))) return [400, { error: "bad room" }];
      const { error } = await db.from("rv_waits").upsert({ host_id: meRow.id, to_id: b.to, room: b.room, at: new Date().toISOString() });
      if (error) return [500, { error: error.message }];
    }
    // 相手が 自分を 待っているか（20秒 以内に 更新されたものだけ。古いのは 部屋が もう ない かもしれない）
    const { data } = await db.from("rv_waits").select("room,at").eq("host_id", b.to).eq("to_id", meRow.id).gt("at", new Date(Date.now() - 20e3).toISOString()).maybeSingle();
    return [200, { ok: true, other: data ? { room: data.room } : null }];
  }
  if (b.op === "call" || b.op === "cancel") {
    const from = await me(b.id, b.secret);
    if (!from) return [403, { error: "who" }];
    if (!ok(b.to)) return [400, { error: "bad to" }];
    // いたずら防止：1時間に 30回まで
    const since = new Date(from.calls_since).getTime(), now = Date.now();
    const fresh = now - since > 3600e3;
    const calls = fresh ? 1 : from.calls + 1;
    if (calls > 30) return [429, { error: "too many" }];
    await db.from("rv_devices").update({ calls, calls_since: fresh ? new Date().toISOString() : from.calls_since }).eq("id", from.id);
    const { data: to } = await db.from("rv_devices").select("id,sub").eq("id", b.to).maybeSingle();
    if (!to || !to.sub) return [200, { ok: false, reason: "nosub" }];
    const tag = clip(b.tag, 40);
    // アプリ版：Expo の送信 API へ（Expo が APNs／FCM に渡す）。取り消しは アプリ側で 90秒で消えるので送らない
    if (to.sub.expo) {
      if (b.op === "cancel") return [200, { ok: true }];
      const msg = {
        to: to.sub.expo, title: clip(b.title, 60), body: clip(b.body, 120), sound: "default", priority: "high", ttl: 90,
        channelId: "call", interruptionLevel: "time-sensitive", categoryId: "call",
        data: { url: clip(b.url, 400), tag, from: from.id, at: now },
      };
      try {
        const r = await fetch("https://exp.host/--/api/v2/push/send", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(msg) });
        const j = await r.json().catch(() => ({}));
        const t = j && j.data && (Array.isArray(j.data) ? j.data[0] : j.data);
        if (t && t.status === "ok") return [200, { ok: true }];
        const err = t && t.details && t.details.error;
        if (err === "DeviceNotRegistered") { await db.from("rv_devices").update({ sub: null }).eq("id", to.id); return [200, { ok: false, reason: "gone" }]; }
        return [200, { ok: false, reason: "expo " + (err || r.status) }];
      } catch (e) { return [200, { ok: false, reason: "expo net" }]; }
    }
    await vapid();
    const payload = JSON.stringify(b.op === "cancel"
      ? { cancel: true, tag }
      : { title: clip(b.title, 60), body: clip(b.body, 120), url: clip(b.url, 400), tag, from: from.id, at: now });
    try {
      await webpush.sendNotification(to.sub, payload, { TTL: 90, urgency: "high", topic: clip(b.tag, 32).replace(/[^A-Za-z0-9_-]/g, "") || undefined });
      return [200, { ok: true }];
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode || 0;
      if (code === 404 || code === 410) { await db.from("rv_devices").update({ sub: null }).eq("id", to.id); return [200, { ok: false, reason: "gone" }]; }
      return [200, { ok: false, reason: "push " + code }];
    }
  }
  return [400, { error: "op" }];
}

Deno.serve(async req => {
  const o = req.headers.get("origin") || "";
  const cors = { "Access-Control-Allow-Origin": originOk(o) ? o : ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return new Response("", { status: 405, headers: cors });
  let status = 500, body: unknown = { error: "server" };
  const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0] || "").trim().slice(0, 64);
  try {
    const b = await req.json();
    [status, body] = (b && (b.op === "hint" || b.op === "claim") ? await handleInvite(b, ip) : await handle(b, ip)) as [number, unknown];
    // うまくいかなかったときだけ 記録する（どの op が なぜ 失敗したか。端末の番号は 先頭6文字だけ）（2026-11-22）
    if (status >= 400) console.log(JSON.stringify({ op: b && b.op, status, error: (body as any) && (body as any).error, id: String((b && b.id) || "").slice(0, 6), to: String((b && b.to) || "").slice(0, 6) }));
  } catch (e) { body = { error: String(e).slice(0, 200) }; console.log(JSON.stringify({ status: 500, error: String(e).slice(0, 200) })); }
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
});
