/* Packstück-Zeilen: gemeinsam für Rechner und Anfrageformular.
   Packstuecke.mount(container, { onChange }) → { getRaw(), setRaw(rows), check(showAll) } */
(function () {
  "use strict";
  var D = window.SITE_DATA, C = window.CalcCore;
  var UI = D.ui.row, LIM = D.calculator.limits;
  var seq = 0;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  function mount(container, opts) {
    opts = opts || {};
    var rowsEl = container;
    var addBtn = el("button", { type: "button", "class": "btn-text" }, UI.add);
    rowsEl.insertAdjacentElement("afterend", addBtn);

    function changed() { if (opts.onChange) opts.onChange(); }

    function addRow(values) {
      if (rowsEl.children.length >= LIM.maxRows) return;
      var id = "ps" + (++seq);
      var row = el("div", { "class": "row", role: "group" });
      C.FIELDS.forEach(function (f) {
        var wrap = el("div", { "class": "f-" + f });
        var label = el("label", { "for": id + f }, UI[f]);
        var input = el("input", { type: "text", id: id + f, "data-f": f, inputmode: f === "n" ? "numeric" : "decimal", autocomplete: "off", maxlength: "12" });
        if (values && values[f] != null) { input.value = String(values[f]).slice(0, 12); if (input.value !== "") input.dataset.touched = "1"; }
        input.addEventListener("input", function () { input.dataset.touched = "1"; changed(); });
        input.addEventListener("blur", function () { if (input.value !== "") input.dataset.touched = "1"; changed(); });
        wrap.appendChild(label); wrap.appendChild(input); row.appendChild(wrap);
      });
      var rm = el("button", { type: "button", "class": "row-remove", "aria-label": UI.remove, title: UI.remove }, "×");
      rm.addEventListener("click", function () { row.remove(); renumber(); changed(); });
      row.appendChild(rm);
      var err = el("p", { "class": "row-error", role: "alert", hidden: "" });
      row.appendChild(err);
      rowsEl.appendChild(row);
      renumber();
    }

    function renumber() {
      var rows = rowsEl.querySelectorAll(".row");
      rows.forEach(function (r, i) {
        r.setAttribute("aria-label", C.fill(UI.rowName, { i: i + 1 }));
        r.querySelector(".row-remove").disabled = rows.length === 1;
      });
      addBtn.hidden = rows.length >= LIM.maxRows;
    }

    function getRaw() {
      return Array.prototype.map.call(rowsEl.querySelectorAll(".row"), function (r) {
        var o = {};
        r.querySelectorAll("input").forEach(function (i) { o[i.dataset.f] = i.value; });
        return o;
      });
    }

    function setRaw(rows) {
      rowsEl.innerHTML = "";
      (rows && rows.length ? rows : [null]).slice(0, LIM.maxRows).forEach(function (r) { addRow(r); });
    }

    /* Prüft alle Zeilen und zeigt Fehler an. showAll = auch unberührte Felder markieren. */
    function check(showAll) {
      var res = C.checkRows(getRaw(), LIM, D.ui.errors);
      rowsEl.querySelectorAll(".row").forEach(function (r, i) {
        var info = res.rows[i], messages = [];
        var inputs = Array.prototype.slice.call(r.querySelectorAll("input"));
        inputs.forEach(function (input, idx) {
          var f = input.dataset.f, msg = info.errors[f];
          var show = msg && (showAll || input.dataset.touched);
          var empty = input.value.trim() === "";
          /* leeres Feld, obwohl ein späteres Feld der Zeile schon ausgefüllt ist */
          var skipped = empty && inputs.slice(idx + 1).some(function (x) { return x.value.trim() !== ""; });
          var missing = empty && (skipped || (showAll && info.status !== "empty"));
          if (show || missing) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
          if (show) messages.push(UI[f] + ": " + msg);
          else if (missing) messages.push(UI[f] + ": " + D.ui.errors.missing);
        });
        var err = r.querySelector(".row-error");
        err.textContent = messages.join("\n");
        err.hidden = messages.length === 0;
      });
      return res;
    }

    addBtn.addEventListener("click", function () {
      addRow(null);
      var last = rowsEl.lastElementChild;
      if (last) last.querySelector("input").focus();
      changed();
    });

    setRaw(null);
    return { getRaw: getRaw, setRaw: setRaw, check: check };
  }

  /* Übergabe Rechner → Formular über den URL-Anker (bleibt im Browser, wird nicht an den Server gesendet). */
  function encode(state) { return "#s=" + encodeURIComponent(JSON.stringify(state)); }
  function decode(hash) {
    try {
      if (!hash || hash.indexOf("#s=") !== 0) return null;
      var o = JSON.parse(decodeURIComponent(hash.slice(3)));
      if (!o || typeof o !== "object" || !Array.isArray(o.r)) return null;
      var clean = function (v) { return typeof v === "string" || typeof v === "number" ? String(v).slice(0, 12) : ""; };
      return {
        m: typeof o.m === "string" ? o.m.slice(0, 10) : "",
        f: typeof o.f === "string" ? o.f.slice(0, 10) : "",
        d: typeof o.d === "string" ? o.d.slice(0, 10) : "",
        r: o.r.slice(0, LIM.maxRows).filter(function (x) { return x && typeof x === "object"; }).map(function (x) {
          return { n: clean(x.n), l: clean(x.l), b: clean(x.b), h: clean(x.h), w: clean(x.w) };
        })
      };
    } catch (e) { return null; }
  }

  window.Packstuecke = { mount: mount, encode: encode, decode: decode, el: el };
})();
