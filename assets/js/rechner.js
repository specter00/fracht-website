/* Richtwert-Rechner: Oberfläche. Gerechnet wird in calc-core.js, Sätze und Texte kommen aus data.js (config.js). */
(function () {
  "use strict";
  var D = window.SITE_DATA, C = window.CalcCore, P = window.Packstuecke;
  var K = D.calculator, U = D.ui.calc, el = P.el;
  var form = document.getElementById("rechner-form");
  var out = document.getElementById("result-body");
  if (!form || !out) return;

  var rows = P.mount(document.getElementById("rows"), { onChange: render });
  form.addEventListener("change", render);

  /* Zustand aus dem URL-Anker übernehmen (z. B. beim Zurückgehen aus dem Formular) */
  var handed = P.decode(window.location.hash);
  if (handed) {
    if (handed.r.length) rows.setRaw(handed.r);
    var radio = form.querySelector("input[name=mode][value=\"" + handed.m.replace(/[^a-z]/g, "") + "\"]");
    if (radio) radio.checked = true;
    if (known(handed.f)) form.elements.from.value = handed.f;
    if (known(handed.d)) form.elements.dest.value = handed.d;
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  function known(id) { return K.countries.some(function (x) { return x.id === id; }); }
  function mode() { var r = form.querySelector('input[name="mode"]:checked'); return r ? r.value : K.modes[0].id; }
  function from() { return form.elements.from.value; }
  function dest() { return form.elements.dest.value; }

  function line(dl, label, value) {
    var d = el("div"); d.appendChild(el("dt", null, label)); d.appendChild(el("dd", null, value)); dl.appendChild(d);
  }

  function render() {
    var res = rows.check(false);
    out.textContent = "";
    if (res.state !== "ok") {
      out.appendChild(el("p", { "class": "result-empty" }, U[res.state]));
      return;
    }
    var m = mode(), t = C.totals(res.okValues), ch = C.chargeable(t, m, K.rules);
    var isKg = ch.unit === "kg", isLand = m === "land";
    var kgRule = isLand ? K.rules.land : K.rules.air;

    out.appendChild(el("p", { "class": "result-label" }, isKg ? U.chargeableKg : U.chargeableWm));
    var dec = isLand ? 0 : (isKg ? 1 : 3);
    var fig = el("p", { "class": "result-figure" }, C.fmt(ch.value, dec) + " ");
    fig.appendChild(el("span", null, isKg ? U.unitKg : U.unitWm));
    out.appendChild(fig);

    var basis = isKg
      ? C.fill(ch.basis === "volume" ? (isLand ? U.basisLandVolume : U.basisAirVolume) : (isLand ? U.basisLandWeight : U.basisAirWeight), { step: C.fmt(kgRule.roundUpKg, kgRule.roundUpKg < 1 ? 1 : 0) })
      : (ch.basis === "volume" ? U.basisSeaVolume : U.basisSeaWeight);
    out.appendChild(el("p", { "class": "result-basis" }, basis));
    if (m === "seaair") out.appendChild(el("p", { "class": "result-basis" }, U.seaAirNote));

    var dl = el("dl", { "class": "result-dl" });
    line(dl, U.pieces, C.fmt(t.pieces, 0));
    line(dl, U.gross, C.fmt(t.grossKg, 1) + " kg");
    line(dl, U.volume, C.fmt(t.cbm, 3) + " m³");
    if (isLand) line(dl, C.fill(U.volumeWeightLand, { kg: C.fmt(K.rules.land.kgPerCbm, 0) }), C.fmt(ch.volumeKg, 1) + " kg");
    else if (isKg) line(dl, C.fill(U.volumeWeight, { divisor: C.fmt(K.rules.air.divisor, 0) }), C.fmt(ch.volumeKg, 1) + " kg");
    else line(dl, U.weightAsCbm, C.fmt(ch.weightAsCbm, 3) + " m³");
    out.appendChild(dl);

    var rate = (K.rates[m] || {})[from() + "-" + dest()] || null;
    var range = rate ? C.priceRange(ch.value, rate) : null;
    if (range) {
      var price = el("div", { "class": "price" });
      price.appendChild(el("h3", null, U.priceTitle));
      var bar = el("div", { "class": "price-bar" });
      bar.appendChild(el("span", null, U.priceBadge + (K.display.marketDate ? " (" + C.fill(U.marketDate, { date: K.marketDate }) + ")" : "")));
      price.appendChild(bar);
      var ends = el("div", { "class": "price-ends" });
      var lo = el("div", null, C.fmt(range.min, range.min < 10 ? 2 : 0) + " " + rate.currency); lo.insertBefore(el("small", null, U.from), lo.firstChild);
      var hi = el("div", null, C.fmt(range.max, range.max < 10 ? 2 : 0) + " " + rate.currency); hi.insertBefore(el("small", null, U.to), hi.firstChild);
      ends.appendChild(lo); ends.appendChild(hi);
      price.appendChild(ends);
      var unit = isKg ? U.unitKg : "m³";
      var basisMap = { qty: C.fmt(ch.value, dec), unit: unit, min: C.fmt(rate.min, 2), max: C.fmt(rate.max, 2), currency: rate.currency,
        flatMin: C.fmt(rate.flatMin || 0, 0), flatMax: C.fmt(rate.flatMax || 0, 0) };
      price.appendChild(el("p", { "class": "price-meta" }, C.fill(rate.flatMax ? U.priceBasisFlat : U.priceBasis, basisMap)));
      price.appendChild(el("p", { "class": "price-meta" }, rate.scope));
      var src = el("p", { "class": "price-meta" }, U.priceSource + ": ");
      (rate.sources || []).forEach(function (id, i) {
        var s = D.sources[id]; if (!s) return;
        if (i) src.appendChild(document.createTextNode("; "));
        if (s.url) { var a = el("a", { href: s.url, rel: "noopener" }, s.label || s.publisher); a.title = s.title; src.appendChild(a); }
        else src.appendChild(document.createTextNode(s.label || s.publisher));
      });
      if (K.display.sources) price.appendChild(src);
      price.appendChild(el("p", { "class": "price-disclaimer" }, U.priceDisclaimer + (rate.illustration ? " " + U.illustrationNote : "")));
      out.appendChild(price);
    } else {
      out.appendChild(el("p", { "class": "no-rate" }, U.noRate + " " + U.ratedLanes));
    }

    /* Request button right below the range: the real price comes with the offer */
    var raw = rows.getRaw().filter(function (r) { return C.FIELDS.some(function (f) { return String(r[f]).trim() !== ""; }); });
    var cta = el("div", { "class": "price-cta" });
    cta.appendChild(el("p", null, U.ctaText));
    cta.appendChild(el("a", { "class": "btn btn-primary", href: "anfrage.html" + P.encode({ m: m, f: from(), d: dest(), r: raw }) }, U.handover));
    out.appendChild(cta);

    var drivers = el("div", { "class": "drivers" });
    drivers.appendChild(el("h3", null, U.driversTitle));
    var ul = el("ul");
    K.drivers.forEach(function (d) { ul.appendChild(el("li", null, d)); });
    drivers.appendChild(ul);
    out.appendChild(drivers);
  }

  render();
})();
