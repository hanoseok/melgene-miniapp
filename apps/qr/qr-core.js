/* apps/qr/qr-core.js — QR 코드 인코더 (ISO/IEC 18004, 외부 라이브러리 없음) + 내용 만들기·색 대비·SVG 도우미.
 * UMD: 브라우저(window.QR_CORE) + Node(module.exports, tools/check-qr.js) 공용. 언어 문구 없음.
 *
 * 인코더:
 *   - 모드: 숫자(numeric) · 영숫자(alphanumeric, 0-9 A-Z 공백 $%*+-./:) · 바이트(UTF-8). 내용 전체에 맞는 가장 촘촘한 한 가지 모드를 고른다.
 *   - 버전 1~40 자동(가장 작은 버전), 오류 정정 L/M/Q/H, Reed–Solomon(GF(256), 다항식 0x11D), 블록 나누기·끼워 넣기(interleave).
 *   - 마스크 8개 모두 그려 보고 벌점(N1 3 · N2 3 · N3 40 · N4 10)이 가장 낮은 것. 형식 정보(BCH 0x537, XOR 0x5412) · 버전 정보(v7+, BCH 0x1F25).
 *   - ECI 머리말은 넣지 않는다(바이트 모드 UTF-8 — 휴대폰 카메라 앱들이 UTF-8 로 읽는다).
 * 결과: { version, size, ecc, mask, mode, modules: [[bool]] (modules[y][x], true = 검은 칸) }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.QR_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ECC_LEVELS = ['L', 'M', 'Q', 'H'];
  var ECC_ORD = { L: 0, M: 1, Q: 2, H: 3 };
  var ECC_FORMAT = { L: 1, M: 0, Q: 3, H: 2 }; // 형식 정보의 2비트
  var MIN_VERSION = 1;
  var MAX_VERSION = 40;

  // 블록마다 오류 정정 코드워드 수 [L, M, Q, H][version] (index 0 은 쓰지 않음)
  var ECC_CODEWORDS_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];
  // 오류 정정 블록 수 [L, M, Q, H][version]
  var NUM_ERROR_CORRECTION_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];

  var MODES = {
    numeric: { bits: 0x1, cc: [10, 12, 14] },
    alphanumeric: { bits: 0x2, cc: [9, 11, 13] },
    byte: { bits: 0x4, cc: [8, 16, 16] }
  };
  var ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
  var PENALTY_N1 = 3, PENALTY_N2 = 3, PENALTY_N3 = 40, PENALTY_N4 = 10;

  function fail(code, msg) { var e = new Error(msg || code); e.code = code; return e; }
  function getBit(x, i) { return ((x >>> i) & 1) !== 0; }

  // ---------------------------------------------------------------- 글자 → 바이트
  function utf8Bytes(str) {
    var out = [];
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
        var d = s.charCodeAt(i + 1);
        if (d >= 0xDC00 && d <= 0xDFFF) { c = 0x10000 + ((c - 0xD800) << 10) + (d - 0xDC00); i++; }
        else c = 0xFFFD;
      } else if (c >= 0xD800 && c <= 0xDFFF) c = 0xFFFD; // 짝 없는 서로게이트
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  function pickMode(text) {
    if (/^[0-9]*$/.test(text)) return 'numeric';
    var ok = true;
    for (var i = 0; i < text.length && ok; i++) if (ALNUM.indexOf(text.charAt(i)) < 0) ok = false;
    return ok ? 'alphanumeric' : 'byte';
  }

  // 모드에 맞춰 데이터 비트를 만든다 → { mode, count(문자 수 필드 값), bits: [0/1] }
  function makeSegment(text, mode) {
    var bits = [];
    var push = function (val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    var count;
    if (mode === 'numeric') {
      count = text.length;
      for (var i = 0; i < text.length; i += 3) {
        var g = text.substr(i, 3);
        push(parseInt(g, 10), g.length * 3 + 1);
      }
    } else if (mode === 'alphanumeric') {
      count = text.length;
      for (var j = 0; j + 1 < text.length; j += 2) push(ALNUM.indexOf(text.charAt(j)) * 45 + ALNUM.indexOf(text.charAt(j + 1)), 11);
      if (text.length % 2) push(ALNUM.indexOf(text.charAt(text.length - 1)), 6);
    } else {
      var bytes = utf8Bytes(text);
      count = bytes.length;
      bytes.forEach(function (b) { push(b, 8); });
    }
    return { mode: mode, count: count, bits: bits };
  }

  function ccIndex(version) { return version <= 9 ? 0 : version <= 26 ? 1 : 2; }
  function charCountBits(mode, version) { return MODES[mode].cc[ccIndex(version)]; }

  // ---------------------------------------------------------------- 표에서 나오는 수
  function numRawDataModules(ver) {
    var result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }
  function numDataCodewords(ver, ecc) {
    var e = ECC_ORD[ecc];
    return Math.floor(numRawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[e][ver] * NUM_ERROR_CORRECTION_BLOCKS[e][ver];
  }
  // 이 버전·수준·모드에 넣을 수 있는 최대 문자 수(바이트 모드는 바이트 수)
  function capacity(ver, ecc, mode) {
    var bits = numDataCodewords(ver, ecc) * 8 - 4 - charCountBits(mode, ver);
    if (bits < 0) return 0;
    var n;
    if (mode === 'numeric') n = Math.floor(bits / 10) * 3 + (bits % 10 >= 7 ? 2 : bits % 10 >= 4 ? 1 : 0);
    else if (mode === 'alphanumeric') n = Math.floor(bits / 11) * 2 + (bits % 11 >= 6 ? 1 : 0);
    else n = Math.floor(bits / 8);
    return Math.min(n, (1 << charCountBits(mode, ver)) - 1);
  }
  function alignmentPositions(ver) {
    if (ver === 1) return [];
    var size = ver * 4 + 17;
    var numAlign = Math.floor(ver / 7) + 2;
    var step = Math.floor((ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
    var result = [6];
    for (var pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
    return result;
  }

  // ---------------------------------------------------------------- Reed–Solomon (GF(2^8), 0x11D)
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xFF;
  }
  // 생성 다항식 (x - α^0)(x - α^1)…(x - α^(n-1)) 의 계수(최고차 1 은 빼고, 높은 차수부터)
  function rsDivisor(degree) {
    var result = [];
    for (var i = 0; i < degree - 1; i++) result.push(0);
    result.push(1);
    var r = 1;
    for (var k = 0; k < degree; k++) {
      for (var j = 0; j < result.length; j++) {
        result[j] = gfMul(result[j], r);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      r = gfMul(r, 0x02);
    }
    return result;
  }
  function rsRemainder(data, divisor) {
    var result = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      for (var i = 0; i < divisor.length; i++) result[i] ^= gfMul(divisor[i], factor);
    });
    return result;
  }

  // ---------------------------------------------------------------- 데이터 코드워드
  // 내용 → { mode, version, data: [코드워드] } (버전 범위 안에서 들어가는 가장 작은 버전)
  function dataCodewords(text, ecc, opts) {
    opts = opts || {};
    var mode = opts.mode || pickMode(text);
    if (mode === 'numeric' && !/^[0-9]*$/.test(text)) throw fail('BAD_MODE', 'not numeric');
    if (mode === 'alphanumeric' && pickMode(text) === 'byte') throw fail('BAD_MODE', 'not alphanumeric');
    var seg = makeSegment(text, mode);
    var minV = opts.minVersion || MIN_VERSION, maxV = opts.maxVersion || MAX_VERSION;
    var version = 0;
    for (var v = minV; v <= maxV; v++) {
      var ccb = charCountBits(mode, v);
      if (seg.count >= (1 << ccb)) continue;
      if (4 + ccb + seg.bits.length <= numDataCodewords(v, ecc) * 8) { version = v; break; }
    }
    if (!version) throw fail('TOO_LONG', 'data too long');
    var bits = [];
    var push = function (val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    push(MODES[mode].bits, 4);
    push(seg.count, charCountBits(mode, version));
    for (var i = 0; i < seg.bits.length; i++) bits.push(seg.bits[i]);
    var capBits = numDataCodewords(version, ecc) * 8;
    push(0, Math.min(4, capBits - bits.length)); // 종료 표시
    push(0, (8 - bits.length % 8) % 8);
    var data = [];
    for (var k = 0; k < bits.length; k += 8) {
      var byte = 0;
      for (var b = 0; b < 8; b++) byte = (byte << 1) | bits[k + b];
      data.push(byte);
    }
    for (var pad = 0xEC; data.length < capBits / 8; pad ^= 0xEC ^ 0x11) data.push(pad);
    return { mode: mode, version: version, data: data, count: seg.count };
  }

  // 블록마다 RS 를 붙이고 끼워 넣는다 → 최종 코드워드 순서
  function addEccAndInterleave(data, ver, ecc) {
    var e = ECC_ORD[ecc];
    var numBlocks = NUM_ERROR_CORRECTION_BLOCKS[e][ver];
    var blockEccLen = ECC_CODEWORDS_PER_BLOCK[e][ver];
    var rawCodewords = Math.floor(numRawDataModules(ver) / 8);
    var numShortBlocks = numBlocks - rawCodewords % numBlocks;
    var shortBlockLen = Math.floor(rawCodewords / numBlocks);
    if (data.length !== numDataCodewords(ver, ecc)) throw fail('INTERNAL', 'data length');
    var blocks = [];
    var div = rsDivisor(blockEccLen);
    for (var i = 0, k = 0; i < numBlocks; i++) {
      var dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
      k += dat.length;
      var eccBytes = rsRemainder(dat, div);
      if (i < numShortBlocks) dat.push(0);
      blocks.push(dat.concat(eccBytes));
    }
    var result = [];
    for (var c = 0; c < blocks[0].length; c++) {
      for (var j = 0; j < blocks.length; j++) {
        if (c !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(blocks[j][c]);
      }
    }
    if (result.length !== rawCodewords) throw fail('INTERNAL', 'interleave length');
    return result;
  }

  // ---------------------------------------------------------------- 형식·버전 정보 (BCH)
  function formatBits(ecc, mask) {
    var data = (ECC_FORMAT[ecc] << 3) | mask;
    var rem = data;
    for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    return ((data << 10) | rem) ^ 0x5412; // 15비트
  }
  function versionBits(ver) {
    var rem = ver;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    return (ver << 12) | rem; // 18비트
  }

  // ---------------------------------------------------------------- 행렬 그리기
  function Matrix(ver, ecc) {
    this.version = ver;
    this.ecc = ecc;
    this.size = ver * 4 + 17;
    this.modules = [];
    this.isFunction = [];
    for (var y = 0; y < this.size; y++) {
      this.modules.push(new Array(this.size).fill(false));
      this.isFunction.push(new Array(this.size).fill(false));
    }
  }
  Matrix.prototype.setFunc = function (x, y, dark) { this.modules[y][x] = dark; this.isFunction[y][x] = true; };
  Matrix.prototype.drawFunctionPatterns = function () {
    var size = this.size;
    for (var i = 0; i < size; i++) { this.setFunc(6, i, i % 2 === 0); this.setFunc(i, 6, i % 2 === 0); }
    this.drawFinder(3, 3); this.drawFinder(size - 4, 3); this.drawFinder(3, size - 4);
    var pos = alignmentPositions(this.version);
    var n = pos.length;
    for (var a = 0; a < n; a++) {
      for (var b = 0; b < n; b++) {
        if ((a === 0 && b === 0) || (a === 0 && b === n - 1) || (a === n - 1 && b === 0)) continue;
        this.drawAlignment(pos[a], pos[b]);
      }
    }
    this.drawFormat(0); // 자리 잡기(마스크 고른 뒤 다시 그림)
    this.drawVersion();
  };
  Matrix.prototype.drawFinder = function (x, y) {
    for (var dy = -4; dy <= 4; dy++) {
      for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy));
        var xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setFunc(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  };
  Matrix.prototype.drawAlignment = function (x, y) {
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) this.setFunc(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  };
  Matrix.prototype.drawFormat = function (mask) {
    var bits = formatBits(this.ecc, mask);
    var size = this.size, i;
    // 왼쪽 위 둘레
    for (i = 0; i <= 5; i++) this.setFunc(8, i, getBit(bits, i));
    this.setFunc(8, 7, getBit(bits, 6));
    this.setFunc(8, 8, getBit(bits, 7));
    this.setFunc(7, 8, getBit(bits, 8));
    for (i = 9; i < 15; i++) this.setFunc(14 - i, 8, getBit(bits, i));
    // 오른쪽 위 · 왼쪽 아래 사본
    for (i = 0; i < 8; i++) this.setFunc(size - 1 - i, 8, getBit(bits, i));
    for (i = 8; i < 15; i++) this.setFunc(8, size - 15 + i, getBit(bits, i));
    this.setFunc(8, size - 8, true); // 늘 검은 칸(dark module)
  };
  Matrix.prototype.drawVersion = function () {
    if (this.version < 7) return;
    var bits = versionBits(this.version);
    for (var i = 0; i < 18; i++) {
      var bit = getBit(bits, i);
      var a = this.size - 11 + i % 3, b = Math.floor(i / 3);
      this.setFunc(a, b, bit);
      this.setFunc(b, a, bit);
    }
  };
  Matrix.prototype.drawCodewords = function (data) {
    var size = this.size, i = 0, total = data.length * 8;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5; // 세로 타이밍 줄은 건너뛴다
      for (var vert = 0; vert < size; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j;
          var upward = ((right + 1) & 2) === 0;
          var y = upward ? size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < total) {
            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
          // 남는 칸(remainder bits)은 false 그대로
        }
      }
    }
    if (i !== total) throw fail('INTERNAL', 'codeword placement');
  };
  function maskHit(mask, x, y) {
    switch (mask) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
      case 5: return (x * y) % 2 + (x * y) % 3 === 0;
      case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0;
      case 7: return ((x + y) % 2 + (x * y) % 3) % 2 === 0;
      default: throw fail('BAD_MASK', 'mask');
    }
  }
  Matrix.prototype.applyMask = function (mask) {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if (!this.isFunction[y][x] && maskHit(mask, x, y)) this.modules[y][x] = !this.modules[y][x];
      }
    }
  };
  // 벌점 (ISO 18004 8.8.2: N1 같은 색 5칸+, N2 2×2, N3 1:1:3:1:1 찾기 무늬 닮은꼴, N4 검은 칸 비율)
  Matrix.prototype.penalty = function () {
    var size = this.size, m = this.modules, result = 0, x, y;
    var addHistory = function (len, hist) {
      if (hist[0] === 0) len += size; // 처음 흰 줄 = 바깥 여백
      hist.pop();
      hist.unshift(len);
    };
    var countPatterns = function (h) {
      var n = h[1];
      var core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n;
      return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0);
    };
    var terminate = function (color, len, hist) {
      if (color) { addHistory(len, hist); len = 0; }
      len += size; // 끝 흰 줄 = 바깥 여백
      addHistory(len, hist);
      return countPatterns(hist);
    };
    var line = function (get) {
      var runColor = false, run = 0, hist = [0, 0, 0, 0, 0, 0, 0], r = 0;
      for (var i = 0; i < size; i++) {
        if (get(i) === runColor) {
          run++;
          if (run === 5) r += PENALTY_N1;
          else if (run > 5) r++;
        } else {
          addHistory(run, hist);
          if (!runColor) r += countPatterns(hist) * PENALTY_N3;
          runColor = get(i);
          run = 1;
        }
      }
      return r + terminate(runColor, run, hist) * PENALTY_N3;
    };
    for (y = 0; y < size; y++) result += line(function (i) { return m[y][i]; });
    for (x = 0; x < size; x++) result += line(function (i) { return m[i][x]; });
    for (y = 0; y < size - 1; y++) {
      for (x = 0; x < size - 1; x++) {
        var c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) result += PENALTY_N2;
      }
    }
    var dark = 0;
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (m[y][x]) dark++;
    var total = size * size;
    var k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * PENALTY_N4;
    return result;
  };

  // 기능 무늬(찾기·타이밍·정렬·형식·버전 자리) 위치 — 검사용
  function functionMask(ver) {
    var mx = new Matrix(ver, 'L');
    mx.drawFunctionPatterns();
    return mx.isFunction;
  }

  // ---------------------------------------------------------------- 공개 API
  // opts: { ecc: 'L'|'M'|'Q'|'H' (기본 M), minVersion, maxVersion, mask: 0~7 (기본 자동), mode }
  function encode(text, opts) {
    opts = opts || {};
    text = String(text == null ? '' : text);
    var ecc = ECC_ORD.hasOwnProperty(opts.ecc) ? opts.ecc : 'M';
    var minV = Math.max(MIN_VERSION, Math.min(MAX_VERSION, opts.minVersion | 0 || MIN_VERSION));
    var maxV = Math.max(minV, Math.min(MAX_VERSION, opts.maxVersion | 0 || MAX_VERSION));
    var dc = dataCodewords(text, ecc, { minVersion: minV, maxVersion: maxV, mode: opts.mode });
    var all = addEccAndInterleave(dc.data, dc.version, ecc);
    var mx = new Matrix(dc.version, ecc);
    mx.drawFunctionPatterns();
    mx.drawCodewords(all);
    var mask = opts.mask;
    var scores = null;
    if (!(mask >= 0 && mask <= 7)) {
      var best = Infinity;
      scores = [];
      for (var i = 0; i < 8; i++) {
        mx.applyMask(i);
        mx.drawFormat(i);
        var p = mx.penalty();
        scores.push(p);
        if (p < best) { best = p; mask = i; }
        mx.applyMask(i); // 되돌리기 (XOR)
      }
    }
    mx.applyMask(mask);
    mx.drawFormat(mask);
    return {
      version: dc.version, size: mx.size, ecc: ecc, mask: mask, mode: dc.mode, count: dc.count,
      dataCodewords: dc.data.length, modules: mx.modules, penalties: scores
    };
  }

  // ---------------------------------------------------------------- 내용(payload) 만들기
  var TYPES = ['link', 'text', 'wifi', 'email', 'phone'];
  var WIFI_AUTH = ['WPA', 'WEP', 'nopass'];
  function escapeWifi(s) { return String(s == null ? '' : s).replace(/([\\;,:"])/g, '\\$1'); }
  function wifiPayload(f) {
    f = f || {};
    var auth = WIFI_AUTH.indexOf(f.auth) >= 0 ? f.auth : 'WPA';
    var ssid = String(f.ssid || '');
    if (!ssid) return '';
    var s = 'WIFI:T:' + auth + ';S:' + escapeWifi(ssid) + ';';
    if (auth !== 'nopass') s += 'P:' + escapeWifi(f.password || '') + ';';
    if (f.hidden) s += 'H:true;';
    return s + ';';
  }
  function linkPayload(s) {
    s = String(s || '').trim();
    if (!s) return '';
    if (/^[a-z][a-z0-9+.\-]*:/i.test(s)) return s;               // 이미 scheme 이 있음 (https:, mailto:, …)
    if (/^[^\s\/?#@]+\.[a-z]{2,}([\/?#:].*)?$/i.test(s) || /^localhost(:\d+)?([\/?#].*)?$/i.test(s)) return 'https://' + s; // example.com/… → https://
    return s;
  }
  function emailPayload(f) {
    f = f || {};
    var to = String(f.to || '').replace(/\s+/g, '');
    if (!to) return '';
    var q = [];
    if (f.subject) q.push('subject=' + encodeURIComponent(f.subject));
    if (f.body) q.push('body=' + encodeURIComponent(f.body));
    return 'mailto:' + to + (q.length ? '?' + q.join('&') : '');
  }
  function phonePayload(s) {
    var raw = String(s || '').trim();
    var digits = raw.replace(/[^\d*#]/g, '');
    if (!digits) return '';
    return 'tel:' + (/^\s*\+/.test(raw) ? '+' : '') + digits;
  }
  function buildPayload(type, f) {
    f = f || {};
    switch (type) {
      case 'link': return linkPayload(f.link);
      case 'text': return String(f.text || '');
      case 'wifi': return wifiPayload(f);
      case 'email': return emailPayload(f);
      case 'phone': return phonePayload(f.phone);
      default: return '';
    }
  }

  // ---------------------------------------------------------------- 색
  function parseHex(hex) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  function luminance(hex) {
    var c = parseHex(hex);
    if (!c) return null;
    var lin = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  }
  function contrastRatio(a, b) {
    var la = luminance(a), lb = luminance(b);
    if (la == null || lb == null) return 1;
    var hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  }
  // 스캔 잘 되는지: 대비 4 이상 + 칸이 바탕보다 어두워야(밝은 칸 = 일부 앱이 못 읽음)
  var MIN_CONTRAST = 4;
  function colorCheck(fg, bg) {
    var ratio = contrastRatio(fg, bg);
    var inverted = luminance(fg) > luminance(bg);
    return { ratio: ratio, low: ratio < MIN_CONTRAST, inverted: inverted, ok: ratio >= MIN_CONTRAST && !inverted };
  }

  // ---------------------------------------------------------------- SVG · 래스터 도우미
  function toSvg(qr, o) {
    o = o || {};
    var margin = Math.max(0, o.margin == null ? 4 : o.margin | 0);
    var n = qr.size + margin * 2;
    var px = o.px || n * 8;
    var fg = parseHex(o.fg) ? '#' + String(o.fg).replace('#', '') : '#000000';
    var bg = parseHex(o.bg) ? '#' + String(o.bg).replace('#', '') : '#ffffff';
    var d = [];
    for (var y = 0; y < qr.size; y++) {
      var row = qr.modules[y];
      for (var x = 0; x < qr.size; x++) {
        if (!row[x]) continue;
        var run = 1;
        while (x + run < qr.size && row[x + run]) run++;
        d.push('M' + (x + margin) + ' ' + (y + margin) + 'h' + run + 'v1h-' + run + 'z');
        x += run - 1;
      }
    }
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="' + px + '" height="' + px + '" shape-rendering="crispEdges">' +
      '<rect width="' + n + '" height="' + n + '" fill="' + bg + '"/>' +
      '<path fill="' + fg + '" d="' + d.join('') + '"/></svg>\n';
  }
  // 칸 하나의 픽셀 경계(정수) — 이음새 없이 정확히 px 크기로 그리기 위함
  function cellEdges(count, px) {
    var e = [];
    for (var i = 0; i <= count; i++) e.push(Math.round(i * px / count));
    return e;
  }

  return {
    ECC_LEVELS: ECC_LEVELS, MIN_VERSION: MIN_VERSION, MAX_VERSION: MAX_VERSION, TYPES: TYPES, WIFI_AUTH: WIFI_AUTH, MIN_CONTRAST: MIN_CONTRAST,
    encode: encode, capacity: capacity, pickMode: pickMode, utf8Bytes: utf8Bytes,
    buildPayload: buildPayload, wifiPayload: wifiPayload, escapeWifi: escapeWifi, linkPayload: linkPayload, emailPayload: emailPayload, phonePayload: phonePayload,
    parseHex: parseHex, luminance: luminance, contrastRatio: contrastRatio, colorCheck: colorCheck,
    toSvg: toSvg, cellEdges: cellEdges,
    // 검사용 내부
    _: {
      gfMul: gfMul, rsDivisor: rsDivisor, rsRemainder: rsRemainder, formatBits: formatBits, versionBits: versionBits,
      alignmentPositions: alignmentPositions, numRawDataModules: numRawDataModules, numDataCodewords: numDataCodewords,
      dataCodewords: dataCodewords, addEccAndInterleave: addEccAndInterleave, maskHit: maskHit, functionMask: functionMask,
      ECC_CODEWORDS_PER_BLOCK: ECC_CODEWORDS_PER_BLOCK, NUM_ERROR_CORRECTION_BLOCKS: NUM_ERROR_CORRECTION_BLOCKS
    }
  };
});
