/* build.js – turns config.js into the static site.
   Run:  node build.js
   Writes: index.html, rechner.html, export-faq.html, anfrage.html, impressum.html, datenschutz.html,
           assets/js/data.js, SOURCES.md
   Needs only Node.js, no packages. */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const c = require("./config.js");
const T = require("./src/templates.js");

const PH = "PLATZHALTER";
const isPh = v => typeof v === "string" && v.startsWith(PH);

/* ---------- text helpers ---------- */

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function lookup(pathStr) {
  const v = pathStr.split(".").reduce((o, k) => (o == null ? undefined : o[k]), c);
  if (typeof v !== "string") throw new Error(`Token {{${pathStr}}} does not point to a text value in config.js`);
  return v;
}

const LINK_OK = /^(https?:\/\/[^\s"<>]+|[a-z0-9-]+\.html(#[\w-]+)?|#[\w-]+)$/;

/* Text → HTML: escapes, then {{tokens}}, [[nowrap]] and [label](href). */
function tx(text) {
  let s = esc(text);
  s = s.replace(/\[\[(.+?)\]\]/g, '<span class="nb">$1</span>');
  for (const word of (c.site.keepTogether || [])) s = s.split(word).join(`<span class="nb">${word}</span>`);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
    if (!LINK_OK.test(href)) throw new Error("Link target not allowed in config text: " + href);
    return `<a href="${href}"${href.startsWith("http") ? ' rel="noopener"' : ""}>${label}</a>`;
  });
  s = s.replace(/\{\{([\w.]+)\}\}/g, (m, p) => {
    const v = lookup(p);
    return isPh(v) ? `<span class="ph">${esc(v)}</span>` : esc(v);
  });
  return s;
}

/* Text → plain text, safe inside an attribute or <title>. */
function plain(text) {
  let s = String(text).replace(/\[\[(.+?)\]\]/g, "$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  s = s.replace(/\{\{([\w.]+)\}\}/g, (m, p) => lookup(p));
  return esc(s);
}

/* A config value that may be a placeholder: placeholder → pink chip, otherwise normal text. */
const val = v => (isPh(v) ? `<span class="ph">${esc(v)}</span>` : tx(v));

const h = { esc, tx, plain, val, isPh };

/* ---------- checks ---------- */

function fail(msg) { console.error("\nBUILD STOPPED: " + msg + "\n"); process.exit(1); }

const k = c.calculator;
const countryIds = k.countries.map(x => x.id);
[k.defaultFrom, k.defaultTo].forEach(id => { if (!countryIds.includes(id)) fail(`calculator.defaultFrom/defaultTo: "${id}" is not in calculator.countries.`); });
let anyRate = false;
const rateList = []; // [mode, lane, rate]
for (const mode of k.modes) {
  for (const [lane, r] of Object.entries(k.rates[mode.id] || {})) {
    const [from, to] = lane.split("-");
    if (!countryIds.includes(from) || !countryIds.includes(to)) fail(`calculator.rates.${mode.id}: lane "${lane}" must be "FROM-TO" with ids from calculator.countries.`);
    if (r === null) continue;
    anyRate = true;
    rateList.push([mode, lane, r]);
    if (!(r.min > 0) || !(r.max >= r.min)) fail(`calculator.rates.${mode.id}.${lane}: min/max are not a valid range.`);
    if (!r.currency || !r.per || !r.scope) fail(`calculator.rates.${mode.id}.${lane}: currency, per and scope are required.`);
    if ((!Array.isArray(r.sources) || !r.sources.length) && !r.illustration) fail(`calculator.rates.${mode.id}.${lane}: a rate needs at least one source id, or an "illustration" note saying how the example value was derived.`);
    (r.sources || []).forEach(id => { if (!c.sources[id]) fail(`calculator.rates.${mode.id}.${lane}: unknown source id "${id}".`); });
    if ((r.flatMin || 0) < 0 || (r.flatMax || 0) < (r.flatMin || 0)) fail(`calculator.rates.${mode.id}.${lane}: flatMin/flatMax are not a valid range.`);
  }
}
if (anyRate && !k.marketDate) fail("calculator.marketDate must be set when a rate is given.");
const faqItems = c.texts.faq.groups.flatMap(g => g.items);
if (new Set(faqItems.map(i => i.id)).size !== faqItems.length) fail("FAQ: every id must be unique.");
for (const item of faqItems) {
  if (!item.id || !item.q || !Array.isArray(item.a)) fail("Every FAQ item needs id, q and a.");
  if (!Array.isArray(item.sources) || !item.sources.length) fail(`FAQ "${item.id}": every answer needs at least one source id.`);
  item.sources.forEach(id => { if (!c.sources[id]) fail(`FAQ "${item.id}": unknown source id "${id}".`); });
}

for (const g of c.texts.checklist.groups) for (const item of g.items) {
  if (isPh(item.text)) continue; // open placeholder, listed below
  if (!Array.isArray(item.sources) || !item.sources.length) fail(`Checklist "${item.name}": every item needs at least one source id.`);
  item.sources.forEach(id => { if (!c.sources[id]) fail(`Checklist "${item.name}": unknown source id "${id}".`); });
}

/* ---------- pages ---------- */

const email = isPh(c.operator.email) ? "" : c.operator.email;
/* The form script only goes live once everything it needs is filled in. Until then the form uses the mail program. */
const scriptReady = !!c.form.endpoint && !!email && !isPh(c.form.fromEmail) && !isPh(c.operator.name) && !isPh(c.operator.phone);
c.form.activeEndpoint = scriptReady ? c.form.endpoint : "";
const pages = {
  "index.html": T.home(c, h),
  "rechner.html": T.rechner(c, h),
  "export-faq.html": T.faq(c, h),
  "checkliste.html": T.checkliste(c, h),
  "anfrage.html": T.anfrage(c, h, email ? "mailto:" + encodeURI(email) : "#"),
  "impressum.html": T.imprint(c, h),
  "datenschutz.html": T.privacy(c, h)
};
for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(ROOT, file), html, "utf8");

/* ---------- runtime data for the calculator and the form ---------- */

const usedSources = {};
for (const mode of Object.values(k.rates)) for (const r of Object.values(mode)) if (r) (r.sources || []).forEach(id => { usedSources[id] = { publisher: c.sources[id].publisher, label: c.sources[id].label || c.sources[id].publisher, title: c.sources[id].title, url: c.sources[id].url }; });

const data = {
  calculator: k,
  sources: usedSources,
  ui: c.texts.ui,
  form: { endpoint: c.form.activeEndpoint, email, subject: c.form.subject },
  request: { labels: c.texts.request.labels, sections: c.texts.request.sections },
  trustName: c.trust.name
};
fs.writeFileSync(path.join(ROOT, "assets/js/data.js"),
  "/* GENERATED by build.js from config.js. Do not edit. */\nwindow.SITE_DATA = " + JSON.stringify(data, null, 1) + ";\n", "utf8");

/* ---------- SOURCES.md ---------- */

const md = [];
md.push("# Sources", "", "Generated by `node build.js` from the `sources` list in `config.js`. Do not edit this file; edit `config.js`.", "");
md.push("Every figure and factual statement on the site refers to one of these entries. Anything without a source is shown on the site as a visible placeholder.", "");
md.push("## Rate ranges in the calculator", "");
md.push(`Market date shown on the site: ${k.marketDate || "(none, no rates set)"}`, "");
if (!rateList.length) md.push("No rates set: the calculator shows the chargeable weight only, on every lane.");
else {
  md.push("Lanes not listed show the weight only.", "", "| Mode | Lane | Range | Covers | Sources |", "|---|---|---|---|---|");
  for (const [mode, lane, r] of rateList)
    md.push(`| ${mode.label} | ${lane} | ${r.flatMax ? `${r.flatMin}–${r.flatMax} ${r.currency} per shipment + ` : ""}${r.min}–${r.max} ${r.currency} per ${r.per === "kg" ? "kg chargeable weight" : "W/M (m³ or 1,000 kg)"} | ${r.scope} | ${(r.sources || []).join(", ") || "–"}${r.illustration ? ` (illustration: ${r.illustration})` : ""} |`);
}
md.push("", "## Calculation rules", "");
md.push(`- Air freight volumetric weight: cm³ / ${k.rules.air.divisor}, chargeable weight rounded up to ${k.rules.air.roundUpKg} kg. Sources: ${(k.rules.air.sources || []).join(", ") || "–"}`);
md.push(`- Sea freight (LCL) W/M: 1 m³ = ${k.rules.sea.kgPerCbm} kg, the larger value counts. Sources: ${(k.rules.sea.sources || []).join(", ") || "–"}`);
md.push(`- Road freight: 1 m³ = ${k.rules.land.kgPerCbm} kg, the larger value counts, rounded up to ${k.rules.land.roundUpKg} kg. Sources: ${(k.rules.land.sources || []).join(", ") || "–"}`);
md.push("", "## FAQ", "");
if (!faqItems.length) md.push("(no FAQ entries yet)");
for (const g of c.texts.faq.groups) for (const item of g.items) md.push(`- **${g.title}: ${item.q}** → ${item.sources.join(", ")}`);
md.push("", "## Document checklist", "");
for (const g of c.texts.checklist.groups) for (const item of g.items) md.push(`- **${g.title}: ${item.name}** → ${(item.sources || []).join(", ") || "(placeholder, no source yet)"}`);
md.push("", "## Source list", "");
for (const [id, s] of Object.entries(c.sources)) {
  md.push(`### ${id}`, "");
  md.push(`- Publisher: ${s.publisher}`, `- Title: ${s.title}`, `- URL: ${s.url || "(document on file, not online)"}`, `- Accessed: ${s.accessed}`, `- Supports: ${s.supports}`);
  if (s.quote) md.push(`- Quote: "${s.quote}"`);
  if (s.note) md.push(`- Note: ${s.note}`);
  md.push("");
}
fs.writeFileSync(path.join(ROOT, "SOURCES.md"), md.join("\n"), "utf8");

/* ---------- report open placeholders ---------- */

const open = [];
(function walk(o, p) {
  if (isPh(o)) { open.push([p, o]); return; }
  if (o && typeof o === "object") for (const [key, v] of Object.entries(o)) walk(v, p ? p + "." + key : key);
})(c, "");
const relevant = open.filter(([p]) => !(p === "form.fromEmail" && !c.form.endpoint));

/* ---------- settings for the form script (api/anfrage.php) ---------- */

const resolve = text => String(text).replace(/\{\{([\w.]+)\}\}/g, (m, p) => lookup(p));
const apiCfg = {
  enabled: scriptReady,
  to: scriptReady ? email : "",
  from: scriptReady ? c.form.fromEmail : "",
  site: c.site.name,
  subject: c.form.subject,
  confirmSubject: c.form.confirmation.subject,
  confirmBody: scriptReady ? c.form.confirmation.body.map(resolve).join("\n") : "",
  maxPerWindow: c.form.maxPerWindow,
  windowSeconds: c.form.windowSeconds
};
fs.mkdirSync(path.join(ROOT, "api"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "api/config.php"),
  "<?php\n// GENERATED by build.js from config.js. Do not edit.\n// Settings as base64-encoded JSON, so no character needs escaping.\nreturn json_decode(base64_decode('" + Buffer.from(JSON.stringify(apiCfg), "utf8").toString("base64") + "'), true);\n", "utf8");

console.log(`Built ${Object.keys(pages).length} pages, assets/js/data.js and SOURCES.md.`);
console.log(c.site.noindex ? "site.noindex is true: pages tell search engines not to index them." : "site.noindex is false: pages may be indexed.");
console.log(c.form.endpoint ? "Form: sends to " + c.form.endpoint + (scriptReady ? "" : " (script is switched off until operator.name, operator.phone, operator.email and form.fromEmail are filled; visitors get the mail-program fallback)") : "Form: no endpoint set, using the mailto fallback" + (email ? "." : " (operator.email is still a placeholder, so visitors can only copy the text)."));
if (relevant.length) {
  console.log(`\nOpen placeholders in config.js (${relevant.length}):`);
  relevant.forEach(([p, v]) => console.log(`  - ${p}: ${v.replace(/^PLATZHALTER:?\s*/, "")}`));
} else {
  console.log("\nNo open placeholders.");
}
