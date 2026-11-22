(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CalcCore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function parseNum(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).replace(/[\s  ]/g, "");
    if (s === "") return null;
    var neg = false;
    if (s.charAt(0) === "-" || s.charAt(0) === "−") { neg = true; s = s.slice(1); }
    if (!/^[0-9.,]+$/.test(s) || !/[0-9]/.test(s)) return NaN;
    var commas = (s.match(/,/g) || []).length;
    var dots = (s.match(/\./g) || []).length;
    if (commas && dots) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
        if (commas > 1) return NaN;
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        if (dots > 1) return NaN;
        s = s.replace(/,/g, "");
      }
    } else if (commas) {
      if (commas > 1) return NaN;
      s = s.replace(",", ".");
    } else if (dots) {
      if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
      else if (dots > 1) return NaN;
    }
    var n = Number(s);
    return isFinite(n) ? (neg ? -n : n) : NaN;
  }
  function fmt(n, decimals) {
    var loc = (typeof self !== "undefined" && self.SITE_DATA && self.SITE_DATA.locale) || "de-DE";
    return Number(n).toLocaleString(loc, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fill(template, map) {
    return String(template).replace(/\{(\w+)\}/g, function (m, k) { return k in map ? map[k] : m; });
  }
  var FIELDS = ["n", "l", "b", "h", "w"];
  function checkRow(raw, limits, msg) {
    var values = {}, errors = {}, filled = 0, missing = 0;
    FIELDS.forEach(function (f) {
      var x = parseNum(raw ? raw[f] : null);
      values[f] = x;
      if (x === null) { missing++; return; }
      filled++;
      if (isNaN(x)) { errors[f] = msg.notNumber; return; }
      if (x <= 0) { errors[f] = msg.notPositive; return; }
      if (f === "n") {
        if (Math.floor(x) !== x) errors[f] = msg.notInteger;
        else if (x > limits.maxPieces) errors[f] = fill(msg.tooManyPieces, { max: fmt(limits.maxPieces, 0) });
      } else if (f === "w") {
        if (x > limits.maxWeightPerPieceKg) errors[f] = fill(msg.tooHeavy, { max: fmt(limits.maxWeightPerPieceKg, 0) });
      } else if (x > limits.maxEdgeCm) {
        errors[f] = fill(msg.tooLong, { max: fmt(limits.maxEdgeCm, 0) });
      }
    });
    var status = "ok";
    if (filled === 0) status = "empty";
    else if (Object.keys(errors).length) status = "invalid";
    else if (missing) status = "incomplete";
    return { status: status, values: values, errors: errors };
  }
  function checkRows(rawRows, limits, msg) {
    var rows = (rawRows || []).map(function (r) { return checkRow(r, limits, msg); });
    var ok = rows.filter(function (r) { return r.status === "ok"; });
    var blocked = rows.some(function (r) { return r.status === "invalid" || r.status === "incomplete"; });
    return {
      rows: rows,
      okValues: ok.map(function (r) { return r.values; }),
      state: blocked ? (rows.some(function (r) { return r.status === "invalid"; }) ? "invalid" : "incomplete") : (ok.length ? "ok" : "empty")
    };
  }
  function ceilTo(x, step) {
    if (!step) return x;
    return Math.ceil(x / step - 1e-9) * step;
  }
  function totals(okValues) {
    var pieces = 0, grossKg = 0, volumeCm3 = 0;
    okValues.forEach(function (v) {
      pieces += v.n;
      grossKg += v.n * v.w;
      volumeCm3 += v.n * v.l * v.b * v.h;
    });
    return { pieces: pieces, grossKg: grossKg, volumeCm3: volumeCm3, cbm: volumeCm3 / 1e6 };
  }
  function chargeable(t, mode, rules) {
    if (mode === "sea") {
      var tons = t.grossKg / rules.sea.kgPerCbm;
      var wm = Math.max(t.cbm, tons);
      return { unit: "wm", value: wm, basis: tons > t.cbm ? "weight" : "volume", weightAsCbm: tons };
    }
    if (mode === "land") {
      var landVol = t.cbm * rules.land.kgPerCbm;
      var landRaw = Math.max(t.grossKg, landVol);
      return { unit: "kg", value: ceilTo(landRaw, rules.land.roundUpKg), raw: landRaw, volumeKg: landVol, basis: landVol > t.grossKg ? "volume" : "weight" };
    }
    var volKg = t.volumeCm3 / rules.air.divisor;
    var raw = Math.max(t.grossKg, volKg);
    return { unit: "kg", value: ceilTo(raw, rules.air.roundUpKg), raw: raw, volumeKg: volKg, basis: volKg > t.grossKg ? "volume" : "weight" };
  }
  function nice(x, up) {
    if (!(x > 0)) return 0;
    var mag = Math.pow(10, Math.floor(Math.log10(x)) - 1);
    return (up ? Math.ceil(x / mag - 1e-9) : Math.floor(x / mag + 1e-9)) * mag;
  }
  function priceRange(quantity, rate) {
    if (!rate || !(rate.min > 0) || !(rate.max >= rate.min)) return null;
    var fMin = rate.flatMin || 0, fMax = rate.flatMax || 0;
    if (fMin < 0 || fMax < fMin) return null;
    return { min: nice(fMin + quantity * rate.min, false), max: nice(fMax + quantity * rate.max, true) };
  }
  return { parseNum: parseNum, fmt: fmt, fill: fill, checkRow: checkRow, checkRows: checkRows, totals: totals, chargeable: chargeable, priceRange: priceRange, ceilTo: ceilTo, nice: nice, FIELDS: FIELDS };
});
