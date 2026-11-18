/* Tests for the calculator core. Run:  node tools/test-calc.js */
"use strict";
const C = require("../assets/js/calc-core.js");
const cfg = require("../config.js");
const K = cfg.calculator, MSG = cfg.texts.ui.errors;

let failed = 0, count = 0;
function eq(name, got, want) {
  count++;
  const ok = (typeof want === "number" && typeof got === "number") ? (Number.isNaN(want) ? Number.isNaN(got) : Math.abs(got - want) < 1e-9) : got === want;
  if (!ok) { failed++; console.log("FAIL " + name + ": got " + got + ", want " + want); }
}
const row = (n, l, b, h, w) => ({ n, l, b, h, w });
const run = (rows, mode) => { const r = C.checkRows(rows, K.limits, MSG); return { r, t: C.totals(r.okValues), ch: r.state === "ok" ? C.chargeable(C.totals(r.okValues), mode, K.rules) : null }; };

/* number parsing */
eq("comma decimal", C.parseNum("12,5"), 12.5);
eq("dot decimal", C.parseNum("12.5"), 12.5);
eq("german thousands", C.parseNum("1.200"), 1200);
eq("german thousands + decimal", C.parseNum("1.234,5"), 1234.5);
eq("english thousands + decimal", C.parseNum("1,234.5"), 1234.5);
eq("spaces", C.parseNum(" 1 200 "), 1200);
eq("empty", C.parseNum("   "), null);
eq("null", C.parseNum(null), null);
eq("letters", C.parseNum("abc"), NaN);
eq("negative", C.parseNum("-5"), -5);
eq("negative message", C.checkRow(row("-5", "1", "1", "1", "1"), K.limits, MSG).errors.n, MSG.notPositive);
eq("minus only", C.parseNum("-"), NaN);
eq("exponent", C.parseNum("1e3"), NaN);
eq("two commas", C.parseNum("1,2,3"), NaN);
eq("two dots not thousands", C.parseNum("1.2.3"), NaN);
eq("only separator", C.parseNum(","), NaN);
eq("leading zero", C.parseNum("007"), 7);
eq("unit suffix", C.parseNum("12kg"), NaN);

/* air: example from the home page (4 cartons 60×40×40, 12 kg) */
let x = run([row("4", "60", "40", "40", "12")], "air");
eq("air gross", x.t.grossKg, 48);
eq("air volume kg", x.ch.volumeKg, 64);
eq("air chargeable", x.ch.value, 64);
eq("air basis", x.ch.basis, "volume");

/* air: heavy and small → actual weight counts */
x = run([row("1", "30", "30", "30", "80")], "air");
eq("air heavy chargeable", x.ch.value, 80);
eq("air heavy basis", x.ch.basis, "weight");

/* air: rounding up to 0.5 kg */
x = run([row("1", "50", "40", "31", "5")], "air");          // 62000/6000 = 10.333
eq("air round up to half", x.ch.value, 10.5);
x = run([row("1", "10", "10", "10", "10,5")], "air");       // exactly 10.5 stays
eq("air exact half stays", x.ch.value, 10.5);
x = run([row("1", "10", "10", "10", "10,51")], "air");
eq("air above half goes to full", x.ch.value, 11);
x = run([row("3", "10", "10", "10", "0,1")], "air");        // 0.3 kg → 0.5 (floating point: 3 × 0.1)
eq("air tiny", x.ch.value, 0.5);

/* sea: W/M */
x = run([row("2", "120", "80", "100", "300")], "sea");      // 1.92 m³, 0.6 t
eq("sea wm volume", x.ch.value, 1.92);
eq("sea basis volume", x.ch.basis, "volume");
x = run([row("1", "100", "100", "50", "2000")], "sea");     // 0.5 m³, 2 t
eq("sea wm weight", x.ch.value, 2);
eq("sea basis weight", x.ch.basis, "weight");

/* sea-air is calculated like air */
x = run([row("4", "60", "40", "40", "12")], "seaair");
eq("seaair like air", x.ch.value, 64);

/* several rows, empty rows ignored */
x = run([row("4", "60", "40", "40", "12"), row("", "", "", "", ""), row("1", "120", "80", "100", "250")], "air");
eq("multi state", x.r.state, "ok");
eq("multi pieces", x.t.pieces, 5);
eq("multi gross", x.t.grossKg, 298);
eq("multi chargeable", x.ch.value, 298);                    // volume kg 64 + 160 = 224 < 298

/* odd inputs */
eq("all empty", run([row("", "", "", "", "")], "air").r.state, "empty");
eq("no rows", run([], "air").r.state, "empty");
eq("incomplete", run([row("2", "60", "", "40", "12")], "air").r.state, "incomplete");
eq("zero", run([row("0", "60", "40", "40", "12")], "air").r.state, "invalid");
eq("zero weight", run([row("1", "60", "40", "40", "0")], "air").r.state, "invalid");
eq("negative", run([row("1", "-60", "40", "40", "12")], "air").r.state, "invalid");
eq("text", run([row("zwei", "60", "40", "40", "12")], "air").r.state, "invalid");
eq("fraction of a piece", run([row("1,5", "60", "40", "40", "12")], "air").r.state, "invalid");
eq("too many pieces", run([row("10000", "60", "40", "40", "12")], "air").r.state, "invalid");
eq("max pieces ok", run([row("9999", "60", "40", "40", "12")], "air").r.state, "ok");
eq("edge too long", run([row("1", "1201", "40", "40", "12")], "air").r.state, "invalid");
eq("edge at limit", run([row("1", "1200", "40", "40", "12")], "air").r.state, "ok");
eq("too heavy", run([row("1", "60", "40", "40", "30001")], "air").r.state, "invalid");
eq("one bad row blocks result", run([row("4", "60", "40", "40", "12"), row("1", "x", "1", "1", "1")], "air").r.state, "invalid");
eq("error message present", typeof C.checkRow(row("0", "1", "1", "1", "1"), K.limits, MSG).errors.n, "string");
eq("decimal dimensions", run([row("1", "60,5", "40,2", "40", "12,75")], "air").r.state, "ok");
eq("huge but valid stays finite", Number.isFinite(run([row("9999", "1200", "1200", "1200", "30000")], "sea").ch.value), true);

/* road freight: 1 m³ = rules.land.kgPerCbm kg */
x = run([row("1", "120", "80", "100", "100")], "land");     // 0.96 m³ → 319.68 kg by volume
eq("land volume", x.ch.value, Math.ceil(0.96 * K.rules.land.kgPerCbm));
eq("land basis volume", x.ch.basis, "volume");
x = run([row("1", "50", "50", "50", "400")], "land");
eq("land weight", x.ch.value, 400);

/* price range: flat amount + quantity × rate */
for (const [mode, lanes] of Object.entries(K.rates)) for (const [lane, r] of Object.entries(lanes)) {
  if (!r) continue;
  const pr = C.priceRange(64, r);
  eq(`price ${mode}.${lane} min below max`, pr.min < pr.max, true);
  eq(`price ${mode}.${lane} min rounded down`, pr.min <= (r.flatMin || 0) + 64 * r.min, true);
  eq(`price ${mode}.${lane} max rounded up`, pr.max >= (r.flatMax || 0) + 64 * r.max, true);
}
eq("flat added", C.priceRange(100, { min: 2, max: 3, flatMin: 50, flatMax: 80 }).min, 250);
eq("flat added max", C.priceRange(100, { min: 2, max: 3, flatMin: 50, flatMax: 80 }).max, 380);
eq("flat inverted → null", C.priceRange(100, { min: 2, max: 3, flatMin: 80, flatMax: 50 }), null);
eq("no rate → null", C.priceRange(64, null), null);
eq("broken rate → null", C.priceRange(64, { min: 0, max: 2 }), null);
eq("inverted rate → null", C.priceRange(64, { min: 3, max: 2 }), null);
eq("nice down", C.nice(110.72, false), 110);
eq("nice up", C.nice(230.4, true), 240);
eq("nice small", C.nice(0.865, false), 0.86);
eq("nice thousands", C.nice(12345, true), 13000);

/* every rate in the config has a source */
for (const [mode, dests] of Object.entries(K.rates)) for (const [d, r] of Object.entries(dests)) {
  if (r) eq(`rate ${mode}.${d} has a basis`, (Array.isArray(r.sources) && r.sources.every(id => !!cfg.sources[id])) || !!r.illustration, true);
}

console.log(failed ? `${failed} of ${count} tests FAILED` : `All ${count} tests passed`);
process.exit(failed ? 1 : 0);
