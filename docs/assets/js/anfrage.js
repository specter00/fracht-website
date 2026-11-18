/* Anfrageformular: prüft die Eingaben, baut den Anfragetext und sendet ihn
   an form.endpoint (config.js) oder öffnet das E-Mail-Programm (mailto). */
(function () {
  "use strict";
  var D = window.SITE_DATA, C = window.CalcCore, P = window.Packstuecke;
  var K = D.calculator, U = D.ui.form, L = D.request.labels, S = D.request.sections;
  var form = document.getElementById("anfrage-form");
  if (!form) return;
  var F = form.elements;
  var statusEl = document.getElementById("form-status");
  var summary = document.getElementById("summary");
  var summaryText = document.getElementById("summary-text");
  var rowsError = document.getElementById("rows-error");
  var consentError = document.getElementById("consent-error");
  var OTHER = "OTHER";
  var countryPairs = [["fromCountry", "fromCountryOther"], ["destCountry", "destCountryOther"]];

  var rows = P.mount(document.getElementById("rows"), { onChange: function () { rows.check(false); rowsError.hidden = true; } });

  /* ----- Übernahme aus dem Rechner ----- */
  var handed = P.decode(window.location.hash);
  if (handed) {
    if (handed.r.length) rows.setRaw(handed.r);
    var mi = K.modes.map(function (m) { return m.id; }).indexOf(handed.m);
    if (mi >= 0 && F.mode.options[mi]) F.mode.selectedIndex = mi;
    if (known(handed.f)) F.fromCountry.value = handed.f;
    if (known(handed.d)) F.destCountry.value = handed.d;
    var note = document.getElementById("from-calc");
    note.textContent = U.fromCalculator;
    note.hidden = false;
    rows.check(false);
  }

  function known(id) { return K.countries.some(function (x) { return x.id === id; }); }
  /* "Anderes Land" shows a free text field below the list */
  function syncOther() {
    countryPairs.forEach(function (p) { document.getElementById("wrap-" + p[1]).hidden = F[p[0]].value !== OTHER; });
  }
  countryPairs.forEach(function (p) { F[p[0]].addEventListener("change", syncOther); });
  syncOther();
  function countryText(p) {
    var sel = F[p[0]], opt = sel.options[sel.selectedIndex], label = opt ? opt.text : "";
    return sel.value === OTHER && val(p[1]) ? label + " (" + val(p[1]) + ")" : label;
  }

  /* ----- Prüfung ----- */
  function setError(input, msg) {
    var id = "e-" + input.name, p = document.getElementById(id);
    if (!msg) { input.removeAttribute("aria-invalid"); if (p) p.remove(); return; }
    input.setAttribute("aria-invalid", "true");
    if (!p) { p = P.el("p", { "class": "field-error", id: id, role: "alert" }); input.insertAdjacentElement("afterend", p); }
    p.textContent = msg;
  }

  function val(name) { var e = F[name]; return e && typeof e.value === "string" ? e.value.trim() : ""; }

  function validate() {
    var first = null;
    Array.prototype.forEach.call(form.querySelectorAll("input[required], textarea[required], select[required]"), function (input) {
      if (input.type === "checkbox") return;
      var v = input.value.trim(), msg = "";
      if (!v) msg = U.required;
      else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = U.emailInvalid;
      setError(input, msg);
      if (msg && !first) first = input;
    });
    var res = rows.check(true);
    var rowsOk = res.state === "ok";
    rowsError.textContent = rowsOk ? "" : U.packagesRequired;
    rowsError.hidden = rowsOk;
    if (!rowsOk && !first) first = document.querySelector("#rows input");
    var consentOk = F.consent.checked;
    consentError.textContent = consentOk ? "" : U.consentRequired;
    consentError.hidden = consentOk;
    if (!consentOk && !first) first = F.consent;
    return { ok: !first, first: first, rows: res };
  }

  /* ----- Anfragetext ----- */
  function buildText(res) {
    var out = [D.form.subject, ""];
    function block(title, pairs) {
      var lines = pairs.filter(function (p) { return p[1]; }).map(function (p) { return p[0] + ": " + p[1]; });
      if (lines.length) { out.push(title.toUpperCase()); out = out.concat(lines); out.push(""); }
    }
    block(S.contact, [[L.company, val("company")], [L.name, val("name")], [L.email, val("email")], [L.phone, val("phone")]]);
    block(S.route, [[L.fromCountry, countryText(countryPairs[0])], [L.origin, val("origin")], [L.destCountry, countryText(countryPairs[1])], [L.destCity, val("destCity")],
      [L.receiver, val("receiver")], [L.mode, val("mode")], [L.incoterm, val("incoterm")]]);
    block(S.goods, [[L.goods, val("goods")], [L.hsCode, val("hsCode")], [L.value, val("value") ? val("value") + " " + val("currency") : ""],
      [L.dangerous, val("dangerous")], [L.dangerousNote, val("dangerousNote")], [L.packaging, val("packaging")], [L.stackable, val("stackable")]]);

    out.push(S.packages.toUpperCase());
    res.okValues.forEach(function (v, i) {
      out.push((i + 1) + ") " + C.fmt(v.n, 0) + " × " + [v.l, v.b, v.h].map(function (x) { return C.fmt(x, 1).replace(/,0$/, ""); }).join(" × ") + " cm, je " + C.fmt(v.w, 1).replace(/,0$/, "") + " kg");
    });
    var t = C.totals(res.okValues);
    out.push("Summe: " + C.fmt(t.pieces, 0) + " Packstücke, " + C.fmt(t.grossKg, 1) + " kg, " + C.fmt(t.cbm, 3) + " m³");
    var air = C.chargeable(t, "air", K.rules), sea = C.chargeable(t, "sea", K.rules), land = C.chargeable(t, "land", K.rules);
    var mi = F.mode.selectedIndex;
    /* Reihenfolge der Auswahl: 0 Luft, 1 See, 2 Sea-Air, 3 Land, 4 Empfehlung */
    if (mi === 0 || mi === 2 || mi === 4) out.push("Frachtpflichtiges Gewicht Luftfracht (1 : " + C.fmt(K.rules.air.divisor, 0) + "): " + C.fmt(air.value, 1) + " kg");
    if (mi === 1 || mi === 4) out.push("Frachtpflichtige Menge Seefracht (W/M): " + C.fmt(sea.value, 3) + " m³");
    if (mi === 3) out.push("Frachtpflichtiges Gewicht Landweg (1 m³ = " + C.fmt(K.rules.land.kgPerCbm, 0) + " kg): " + C.fmt(land.value, 0) + " kg");
    out.push("");

    block(S.timing, [[L.readyDate, val("readyDate")], [L.deadline, val("deadline")], [L.message, val("message")]]);
    out.push("Übermittlung an " + D.trustName + " in Dubai: eingewilligt");
    return out.join("\n");
  }

  function status(msg, kind) {
    statusEl.textContent = msg;
    if (kind) statusEl.setAttribute("data-kind", kind); else statusEl.removeAttribute("data-kind");
    statusEl.hidden = !msg;
  }

  function showSummary(text) { summaryText.value = text; summary.hidden = false; }

  function openMail(text) {
    showSummary(text);
    if (!D.form.email) { status(U.noEmail, "error"); return; }
    status(U.mailOpened);
    window.location.href = "mailto:" + encodeURIComponent(D.form.email).replace(/%40/g, "@") + "?subject=" + encodeURIComponent(D.form.subject) + "&body=" + encodeURIComponent(text);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var check = validate();
    if (!check.ok) {
      status(U.fixErrors, "error");
      if (check.first && check.first.focus) check.first.focus();
      return;
    }
    var text = buildText(check.rows);
    if (D.demo) { status(U.demo, "ok"); showSummary(text); return; } // demo build: never send
    if (val("website")) { status(U.sent, "ok"); return; } // Honeypot: Bots bekommen eine Scheinbestätigung
    if (!D.form.endpoint) { openMail(text); return; }

    var btn = document.getElementById("submit-btn");
    btn.disabled = true;
    status(U.sending);
    fetch(D.form.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ replyTo: val("email"), name: val("name"), company: val("company"), message: text, consent: true, website: val("website") })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      status(U.sent, "ok");
      form.reset(); rows.setRaw(null); syncOther();
    }).catch(function () {
      status(U.sendFailed, "error");
      showSummary(text);
      mailBtn.hidden = !D.form.email;
    }).then(function () { btn.disabled = false; });
  });

  var mailBtn = document.getElementById("mail-btn");
  mailBtn.addEventListener("click", function () { openMail(summaryText.value); });

  document.getElementById("copy-btn").addEventListener("click", function () {
    var done = function () { status(U.copied, "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText.value).then(done, function () { summaryText.select(); });
    } else {
      summaryText.select();
      try { document.execCommand("copy"); done(); } catch (err) { /* Text bleibt markiert */ }
    }
  });
})();
