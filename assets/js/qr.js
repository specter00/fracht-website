(function (root) {
  "use strict";
  var ECC_PER_BLOCK = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
  var NUM_BLOCKS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
  var FORMAT_ECL_M = 0;
  function rawDataModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  function dataCodewords(ver) { return Math.floor(rawDataModules(ver) / 8) - ECC_PER_BLOCK[ver] * NUM_BLOCKS[ver]; }
  function utf8(text) {
    var s = unescape(encodeURIComponent(text)), out = [];
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
  function rsDivisor(degree) {
    var r = [], root = 1, i, j;
    for (i = 0; i < degree - 1; i++) r.push(0);
    r.push(1);
    for (i = 0; i < degree; i++) {
      for (j = 0; j < r.length; j++) {
        r[j] = gfMul(r[j], root);
        if (j + 1 < r.length) r[j] ^= r[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return r;
  }
  function rsRemainder(data, divisor) {
    var r = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ r.shift();
      r.push(0);
      divisor.forEach(function (coef, i) { r[i] ^= gfMul(coef, factor); });
    });
    return r;
  }
  function matrix(text, opts) {
    opts = opts || {};
    var bytes = utf8(text), ver, cap;
    for (ver = opts.version || 1; ver <= 40; ver++) {
      cap = dataCodewords(ver) * 8;
      if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= cap) break;
    }
    if (ver > 40) throw new Error("QR: text too long");
    var size = ver * 4 + 17;
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4);
    put(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, cap - bits.length));
    put(0, (8 - bits.length % 8) % 8);
    for (var pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) put(pad, 8);
    var data = [];
    for (var b = 0; b < bits.length; b += 8) data.push(parseInt(bits.slice(b, b + 8).join(""), 2));
    var numBlocks = NUM_BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver];
    var raw = Math.floor(rawDataModules(ver) / 8);
    var numShort = numBlocks - raw % numBlocks, shortLen = Math.floor(raw / numBlocks);
    var div = rsDivisor(eccLen), blocks = [], k = 0, i, j;
    for (i = 0; i < numBlocks; i++) {
      var dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1));
      k += dat.length;
      var ecc = rsRemainder(dat, div);
      if (i < numShort) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    var codewords = [];
    for (i = 0; i < blocks[0].length; i++) {
      for (j = 0; j < blocks.length; j++) {
        if (i !== shortLen - eccLen || j >= numShort) codewords.push(blocks[j][i]);
      }
    }
    var mod = [], fn = [];
    for (i = 0; i < size; i++) { mod.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function setFn(x, y, dark) { mod[y][x] = dark; fn[y][x] = true; }
    for (i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    [[3, 3], [size - 4, 3], [3, size - 4]].forEach(function (c) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy)), x = c[0] + dx, y = c[1] + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) setFn(x, y, d !== 2 && d !== 4);
      }
    });
    var align = [];
    if (ver > 1) {
      var n = Math.floor(ver / 7) + 2;
      var step = Math.floor((ver * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
      for (var pos = size - 7; align.length < n - 1; pos -= step) align.unshift(pos);
      align.unshift(6);
    }
    align.forEach(function (ax, ai) {
      align.forEach(function (ay, aj) {
        if ((ai === 0 && aj === 0) || (ai === 0 && aj === align.length - 1) || (ai === align.length - 1 && aj === 0)) return;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) setFn(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      });
    });
    function drawFormat(mask) {
      var d = FORMAT_ECL_M << 3 | mask, rem = d;
      for (var t = 0; t < 10; t++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var f = (d << 10 | rem) ^ 0x5412;
      function bit(q) { return ((f >>> q) & 1) !== 0; }
      for (var q = 0; q <= 5; q++) setFn(8, q, bit(q));
      setFn(8, 7, bit(6)); setFn(8, 8, bit(7)); setFn(7, 8, bit(8));
      for (q = 9; q < 15; q++) setFn(14 - q, 8, bit(q));
      for (q = 0; q < 8; q++) setFn(size - 1 - q, 8, bit(q));
      for (q = 8; q < 15; q++) setFn(8, size - 15 + q, bit(q));
      setFn(8, size - 8, true);
    }
    drawFormat(0);
    if (ver >= 7) {
      var rem = ver;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vb = ver << 12 | rem;
      for (i = 0; i < 18; i++) {
        var on = ((vb >>> i) & 1) !== 0, a = size - 11 + i % 3, c = Math.floor(i / 3);
        setFn(a, c, on); setFn(c, a, on);
      }
    }
    var bitIdx = 0, total = codewords.length * 8;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (j = 0; j < 2; j++) {
          var x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
          if (!fn[y][x] && bitIdx < total) {
            mod[y][x] = ((codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) !== 0;
            bitIdx++;
          }
        }
      }
    }
    function applyMask(m) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        if (fn[y][x]) continue;
        var inv;
        switch (m) {
          case 0: inv = (x + y) % 2 === 0; break;
          case 1: inv = y % 2 === 0; break;
          case 2: inv = x % 3 === 0; break;
          case 3: inv = (x + y) % 3 === 0; break;
          case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: inv = x * y % 2 + x * y % 3 === 0; break;
          case 6: inv = (x * y % 2 + x * y % 3) % 2 === 0; break;
          default: inv = ((x + y) % 2 + x * y % 3) % 2 === 0;
        }
        if (inv) mod[y][x] = !mod[y][x];
      }
    }
    function penalty() {
      var score = 0, x, y, dark = 0;
      function addHistory(len, hist) { if (hist[0] === 0) len += size; hist.pop(); hist.unshift(len); }
      function countFinder(h) {
        var n = h[1], core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n;
        return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0);
      }
      function terminate(color, len, hist) {
        if (color) { addHistory(len, hist); len = 0; }
        addHistory(len + size, hist);
        return countFinder(hist);
      }
      function line(get) {
        for (var a = 0; a < size; a++) {
          var color = false, run = 0, hist = [0, 0, 0, 0, 0, 0, 0];
          for (var b = 0; b < size; b++) {
            if (get(a, b) === color) {
              run++;
              if (run === 5) score += 3; else if (run > 5) score++;
            } else {
              addHistory(run, hist);
              if (!color) score += countFinder(hist) * 40;
              color = get(a, b);
              run = 1;
            }
          }
          score += terminate(color, run, hist) * 40;
        }
      }
      line(function (a, b) { return mod[a][b]; });
      line(function (a, b) { return mod[b][a]; });
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = mod[y][x];
        if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) score += 3;
      }
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (mod[y][x]) dark++;
      var totalMods = size * size;
      score += (Math.ceil(Math.abs(dark * 20 - totalMods * 10) / totalMods) - 1) * 10;
      return score;
    }
    var best = opts.mask;
    if (best == null) {
      var min = Infinity;
      for (var m = 0; m < 8; m++) {
        applyMask(m); drawFormat(m);
        var p = penalty();
        if (p < min) { min = p; best = m; }
        applyMask(m);
      }
    }
    applyMask(best);
    drawFormat(best);
    return mod;
  }
  function svg(text, opts) {
    opts = opts || {};
    var m = matrix(text), border = opts.border == null ? 2 : opts.border, size = m.length + border * 2, d = "";
    m.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        if (!row[x]) continue;
        var start = x;
        while (x + 1 < row.length && row[x + 1]) x++;
        d += "M" + (start + border) + " " + (y + border) + "h" + (x - start + 1) + "v1h-" + (x - start + 1) + "z";
      }
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
      '<rect width="' + size + '" height="' + size + '" fill="' + (opts.light || "#fff") + '"/>' +
      '<path d="' + d + '" fill="' + (opts.dark || "#000") + '"/></svg>';
  }
  var api = { svg: svg, matrix: matrix };
  if (typeof module === "object" && module.exports) module.exports = api; else root.QRCode = api;
})(this);
