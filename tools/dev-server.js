/* Local preview server.  Run:  node tools/dev-server.js   →  http://localhost:4173
   Serves the static files and stands in for api/anfrage.php (PHP does not run locally).
   The stand-in applies the same checks as the PHP script and, instead of sending e-mail,
   writes both mails as text files to _preview/outbox/. It is for testing only. */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT) || 4173;
const OUTBOX = path.join(ROOT, "_preview", "outbox");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".md": "text/plain; charset=utf-8", ".json": "application/json" };
const ACCEPT = process.argv.includes("--accept"); // accept requests even while placeholders are open (testing only)
const recent = [];
const isPh = v => typeof v === "string" && v.startsWith("PLATZHALTER");

function json(res, code, data) { res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(JSON.stringify(data)); }
const clean = (v, max) => (typeof v === "string" ? v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, max) : "");
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, " ").trim();

function handleForm(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });
  delete require.cache[require.resolve("../config.js")];
  const c = require("../config.js");
  const ready = !isPh(c.operator.email) && !isPh(c.form.fromEmail) && !isPh(c.operator.name) && !isPh(c.operator.phone);
  if (!ready && !ACCEPT) return json(res, 503, { ok: false, error: "not_configured" });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return json(res, 403, { ok: false, error: "wrong_origin" });
  let raw = "";
  req.on("data", chunk => { raw += chunk; if (raw.length > 20000) { json(res, 413, { ok: false, error: "too_large" }); req.destroy(); } });
  req.on("end", () => {
    if (res.writableEnded) return;
    let input;
    try { input = JSON.parse(raw); } catch (e) { return json(res, 400, { ok: false, error: "bad_request" }); }
    if (!input || typeof input !== "object") return json(res, 400, { ok: false, error: "bad_request" });
    if (clean(input.website, 200) !== "") return json(res, 200, { ok: true });
    const email = oneLine(input.replyTo, 254), name = oneLine(input.name, 120), company = oneLine(input.company, 120), message = clean(input.message, 6000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !name || !company || message.length < 40 || input.consent !== true) return json(res, 422, { ok: false, error: "invalid" });
    const now = Date.now(), windowMs = c.form.windowSeconds * 1000;
    while (recent.length && recent[0] <= now - windowMs) recent.shift();
    if (recent.length >= c.form.maxPerWindow) return json(res, 429, { ok: false, error: "too_many_requests" });
    recent.push(now);
    fs.mkdirSync(OUTBOX, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const confirm = c.form.confirmation.body.join("\n").replace(/\{\{([\w.]+)\}\}/g, (m, p) => p.split(".").reduce((o, k) => (o == null ? "" : o[k]), c));
    fs.writeFileSync(path.join(OUTBOX, stamp + ".txt"),
      `=== Mail 1: request to the operator ===\nTo: ${c.operator.email}\nReply-To: ${email}\nSubject: ${c.form.subject}: ${company}\n\n${message}\n\n` +
      `=== Mail 2: confirmation to the sender ===\nTo: ${email}\nSubject: ${c.form.confirmation.subject}\n\n${confirm}\n`, "utf8");
    json(res, 200, { ok: true });
  });
}

const OPEN = process.argv.includes("--open"); // open the site in the default browser once the server runs
const URL_HOME = `http://localhost:${PORT}/`;
function openBrowser() {
  if (!OPEN) return;
  const { spawn } = require("child_process");
  const cmd = process.platform === "win32" ? ["cmd", ["/c", "start", "", URL_HOME]] : process.platform === "darwin" ? ["open", [URL_HOME]] : ["xdg-open", [URL_HOME]];
  spawn(cmd[0], cmd[1], { detached: true, stdio: "ignore" }).unref();
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/anfrage.php") return handleForm(req, res);
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(404); return res.end("Not found"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : data);
  });
});
server.on("error", err => {
  if (err.code === "EADDRINUSE") {
    console.log(`The preview is already running: ${URL_HOME}`);
    openBrowser();
    process.exit(0);
  }
  throw err;
});
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Preview: ${URL_HOME}  (form requests are written to _preview/outbox/)`);
  openBrowser();
});
