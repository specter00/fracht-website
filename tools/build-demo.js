/* Builds the demo version to send around.  Run:  node tools/build-demo.js
   Output: docs/  (GitHub Pages can serve this folder; a copy of the site with a "Demo-Version" banner on every page; the form sends nothing).
   Leaves out the form script, config.js and SOURCES.md. Prints the file list for publishing. */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs");
const c = require("../config.js");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

execFileSync(process.execPath, [path.join(ROOT, "build.js")], { cwd: ROOT, stdio: "ignore" });

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const PAGES = ["index.html", "rechner.html", "export-faq.html", "checkliste.html", "anfrage.html", "impressum.html", "datenschutz.html"];
const banner = `<div class="demo-banner" role="note"><div class="wrap">${esc(c.site.demo.banner)}</div></div>\n`;

function must(s, find, label) { if (!s.includes(find)) throw new Error("demo build: " + label + " not found"); return s; }

for (const page of PAGES) {
  let s = fs.readFileSync(path.join(ROOT, page), "utf8");
  must(s, '<header class="site-header">', page + " header");
  s = s.replace('<header class="site-header">', banner + '<header class="site-header">');
  if (!s.includes('name="robots"')) s = s.replace("</head>", '<meta name="robots" content="noindex, nofollow">\n</head>');
  if (page === "anfrage.html") {
    s = s.replace(/(<button type="submit"[^>]*id="submit-btn">)[^<]*(<\/button>)/, `$1${esc(c.texts.request.submitDemo)}$2`);
    s = s.replace(/(id="submit-btn">[^<]*<\/button>)\s*<p class="hint">[\s\S]*?<\/p>/, "$1");
  }
  fs.writeFileSync(path.join(OUT, page), s, "utf8");
}

const ASSETS = [
  "assets/css/site.css",
  "assets/js/calc-core.js", "assets/js/packstuecke.js", "assets/js/rechner.js", "assets/js/anfrage.js", "assets/js/data.js",
  "assets/img/logo-mark.png", "assets/img/logo-full.png", "assets/img/foto-paletten.jpg", "assets/img/foto-lager.jpg"
];
for (const rel of ASSETS) {
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
  fs.copyFileSync(path.join(ROOT, rel), path.join(OUT, rel));
}
fs.appendFileSync(path.join(OUT, "assets/js/data.js"),
  "/* Demo version: the form never sends. */\nwindow.SITE_DATA.demo = true;\nwindow.SITE_DATA.form.endpoint = \"\";\nwindow.SITE_DATA.form.email = \"\";\n", "utf8");

fs.writeFileSync(path.join(OUT, ".nojekyll"), "", "utf8"); // GitHub Pages: serve files as they are
fs.writeFileSync(path.join(OUT, "LIESMICH.txt"), [
  "Website-Demo (Entwurf)",
  "",
  "1. ZIP-Datei zuerst entpacken: Rechtsklick > Alle extrahieren (Mac: doppelklicken).",
  "2. Im entpackten Ordner index.html doppelklicken. Die Seite öffnet sich im Browser.",
  "",
  "Läuft ohne Internet auf Computer und Laptop. Auf dem Handy bitte die PDF-Vorschau ansehen.",
  "Demo-Version mit Platzhaltern. Über das Formular werden keine Anfragen versendet.",
  ""
].join("\r\n"), "utf8");

const files = {};
for (const rel of PAGES.filter(p => p !== "index.html").concat(ASSETS)) files[rel] = rel;
console.log("Demo built in docs/ (" + (PAGES.length + ASSETS.length) + " files).");
console.log(JSON.stringify(files));
