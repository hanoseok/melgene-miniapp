/* apps/snowflake/snowflake.js — 눈꽃 만들기 화면 동작 + canvas 그림 + PNG 저장 + 공유.
 * 선택지·무작위·인코딩은 snowflake-core.js(SNOWFLAKE_CORE), 문구는 페이지에 인라인된 PAGE_I18N(언어별)과 생성된 HTML.
 * 흐름: 시작(티징) → 만들기(canvas 한 장 + 슬라이더 3개 + 도구 버튼) → 끝 화면(공통 data-mg-end).
 * 받은 링크(#d=)는 바로 끝 화면에서 그 눈꽃을 보여 준다("나도 만들기"). 받은 링크는 기록하지 않는다.
 * 기록: 시작 버튼 track('start') 1번, 결과(끝 화면 도달 또는 저장 완료) track('done') 1번. 다시 하기 = 새 판 → 다시 한 번씩.
 * 움직임 줄이기(prefers-reduced-motion)면 피어나는 애니메이션 없이 바로 그린다.
 * 서버 전송 없음. 저장은 canvas → PNG(1080×1080) 다운로드(휴대폰은 공유 시트).
 */
(function () {
  'use strict';

  var CORE = window.SNOWFLAKE_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var R = UI.result || {};
  var ST = E.status || {};
  var BTN = E.buttons || {};
  var LBL = E.labels || {};
  var LV = E.levels || {};
  var SHAPE_NAMES = E.shapes || {};
  var PAL_NAMES = E.palettes || [];
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var GROW_MS = 1400;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), canvas: $('flake-canvas'), endCanvas: $('end-canvas'),
    n: $('in-n'), c: $('in-c'), z: $('in-z'),
    outN: $('out-n'), outC: $('out-c'), outZ: $('out-z'),
    newBtn: $('new-btn'), shapeBtn: $('shape-btn'), shapeName: $('shape-name'),
    colorBtn: $('color-btn'), colorName: $('color-name'),
    saveBtn: $('save-btn'), shareBtn: $('share-btn'), doneBtn: $('done-btn'),
    status: $('edit-status'),
    endEyebrow: $('end-eyebrow'), endTitle: $('end-title'), endSave: $('end-save'),
    endEdit: $('end-edit'), endStatus: $('end-status')
  };

  var man = null;        // 지금 만들고 있는 눈꽃 (정규화된 파라미터)
  var friend = false;    // 받은 링크로 연 그림인가
  var doneSent = false;  // 이번 판의 track('done') 을 보냈는가
  var prims = null;      // 가지 도형 목록 (man 이 바뀔 때만 다시 만든다)
  var primsKey = '';
  var center = CORE.centerPrims();

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function status(el, msg, bad) {
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('is-bad', !!bad);
  }
  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.end.hidden = name !== 'end';
  }

  // ---------------------------------------------------------------
  // 그림: canvas 한 장에 눈꽃을 그린다
  // ---------------------------------------------------------------
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function palette(p) { return CORE.PALETTES[p.k]; }
  function getPrims(p) {
    var key = [p.s, p.n, p.c, p.z, p.h].join(',');
    if (key !== primsKey) { prims = CORE.armPrims(p); primsKey = key; }
    return prims;
  }
  function drawPrims(ctx, list, prog) {
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      var f = clamp01((prog - q.at) / 0.25);
      if (f <= 0) continue;
      if (q.t === 'l') {
        ctx.lineWidth = q.w;
        ctx.beginPath();
        ctx.moveTo(q.a[0], q.a[1]);
        ctx.lineTo(q.a[0] + (q.a[2] - q.a[0]) * f, q.a[1] + (q.a[3] - q.a[1]) * f);
        ctx.stroke();
      } else {
        ctx.beginPath();
        q.pts.forEach(function (pt, j) {
          var x = q.c[0] + (pt[0] - q.c[0]) * f;
          var y = q.c[1] + (pt[1] - q.c[1]) * f;
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        });
        ctx.closePath();
        if (q.f) ctx.fill(); else { ctx.lineWidth = 3; ctx.stroke(); }
      }
    }
  }
  // prog: 0 ~ 1 (1 = 다 자란 그림). 같은 p 는 항상 같은 그림이다.
  function paint(cv, p, prog) {
    var ctx = cv.getContext('2d');
    var pal = palette(p);
    var S = CORE.SIZE;
    var C = CORE.C;
    var list = getPrims(p);
    ctx.clearRect(0, 0, S, S);
    var g = ctx.createLinearGradient(0, 0, S * 0.35, S);
    g.addColorStop(0, pal.bg[0]);
    g.addColorStop(1, pal.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = pal.accent;
    CORE.sparkles(p.s).forEach(function (sp) {
      ctx.globalAlpha = sp.a;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, CORE.TAU);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(C, C);
    ctx.strokeStyle = pal.ink;
    ctx.fillStyle = pal.ink;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (var k = 0; k < 6; k++) {
      for (var m = 0; m < 2; m++) {
        ctx.save();
        ctx.rotate(k * Math.PI / 3);
        if (m) ctx.scale(-1, 1);
        drawPrims(ctx, list, prog);
        ctx.restore();
      }
    }
    drawPrims(ctx, center, prog);
    ctx.restore();

    ctx.fillStyle = pal.accent;
    ctx.font = '700 36px ' + (getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(UI.siteName || '', C, S - 26);
  }
  // 애니메이션: 피어나듯 자란다. 움직임 줄이기면 바로 그린다.
  function grow(cv, p) {
    cv.__anim = (cv.__anim || 0) + 1;
    var id = cv.__anim;
    if (REDUCED.matches || !window.requestAnimationFrame) { paint(cv, p, 1); return; }
    var t0 = null;
    var step = function (now) {
      if (id !== cv.__anim) return;
      if (t0 === null) t0 = now;
      var q = clamp01((now - t0) / GROW_MS);
      paint(cv, p, 1 - Math.pow(1 - q, 3));
      if (q < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    // 화면 갱신이 멈춘 탭(백그라운드 등)에서도 최종 그림은 반드시 그려진다
    window.setTimeout(function () {
      if (id !== cv.__anim) return;
      cv.__anim += 1; // 남아 있는 프레임 콜백을 끊고 최종 그림으로 고정
      paint(cv, p, 1);
    }, GROW_MS + 250);
  }
  function still(cv, p) {
    cv.__anim = (cv.__anim || 0) + 1; // 진행 중인 애니메이션을 멈춘다
    paint(cv, p, 1);
  }

  // ---------------------------------------------------------------
  // 만들기 화면
  // ---------------------------------------------------------------
  function shapeLabel() { return SHAPE_NAMES[CORE.SHAPES[man.h]] || CORE.SHAPES[man.h]; }
  function paletteLabel() { return PAL_NAMES[man.k] || CORE.PALETTES[man.k].id; }
  function syncControls() {
    els.n.value = man.n;
    els.c.value = man.c;
    els.z.value = man.z;
    els.outN.textContent = String(man.n);
    els.outC.textContent = (LV.complexity || [])[man.c - 1] || String(man.c);
    els.outZ.textContent = (LV.size || [])[man.z] || String(man.z);
    els.shapeName.textContent = shapeLabel();
    els.colorName.textContent = paletteLabel();
  }
  function redrawEdit(animate) {
    syncControls();
    if (animate) grow(els.canvas, man); else still(els.canvas, man);
  }
  function startRun() {
    doneSent = false;
    friend = false;
    man = CORE.fresh(CORE.randomSeed());
    show('edit');
    redrawEdit(true);
    window.scrollTo(0, 0);
  }

  // 눈꽃 공유 주소: 언어 없는 주소 + #d=
  function shareUrl() {
    var base = String(window.mgCleanUrl ? window.mgCleanUrl(window.location.href) : window.location.href).split('#')[0];
    var code = man ? CORE.encode(man) : null;
    return code ? base + '#d=' + code : base;
  }
  function shareLink() {
    var url = shareUrl();
    var title = R.shareTitle || document.title;
    var text = R.shareText || '';
    if (navigator.share) {
      navigator.share({ title: title, text: text, url: url }).then(function () {
        status(els.status, ST.shared || ST.copied);
      }, function () { /* 사용자가 취소 */ });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        status(els.status, ST.copied);
      }, function () { status(els.status, ST.copyFail, true); });
      return;
    }
    status(els.status, ST.copyFail, true);
  }

  // ---------------------------------------------------------------
  // 저장 (PNG 1080×1080)
  // ---------------------------------------------------------------
  function makePng(p) {
    return new Promise(function (resolve, reject) {
      var cv = document.createElement('canvas');
      cv.width = CORE.SIZE;
      cv.height = CORE.SIZE;
      paint(cv, p, 1);
      cv.toBlob(function (blob) {
        if (blob && blob.size) resolve(blob); else reject(new Error('empty image'));
      }, 'image/png');
    });
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  // 저장 완료 시 이번 판의 done 을 보낸다(공유 링크로 연 그림은 제외)
  function markDone() {
    if (friend || doneSent) return;
    doneSent = true;
    track('done');
  }
  function savePng(p, statusEl) {
    status(statusEl, ST.saving);
    var name = (R.fileName || 'snowflake') + '-' + p.s.toString(16) + '.png';
    return makePng(p).then(function (blob) {
      var file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        return navigator.share({ files: [file], title: R.shareTitle || '' }).then(function () {
          status(statusEl, ST.saved);
          return true;
        }, function () {
          download(blob, name);
          status(statusEl, ST.saved);
          return true;
        });
      }
      download(blob, name);
      status(statusEl, ST.saved);
      return true;
    }).then(function (ok) {
      if (ok) markDone();
      return ok;
    }).catch(function () {
      status(statusEl, ST.saveFail, true);
      return false;
    });
  }

  // ---------------------------------------------------------------
  // 끝 화면 (공통 data-mg-end 가 결과 아래에 붙는다)
  // ---------------------------------------------------------------
  function showEnd(p, isFriend) {
    friend = isFriend;
    man = CORE.copy(p);
    show('end');
    els.endEyebrow.textContent = isFriend ? (R.eyebrowFriend || '') : (R.eyebrowMine || '');
    els.endTitle.textContent = els.endEyebrow.textContent;
    els.endEdit.hidden = isFriend;
    els.endStatus.textContent = '';
    if (window.setRetry) {
      if (isFriend) {
        window.setRetry({ label: R.retryFriend, action: function () { window.location.href = window.location.pathname; } });
      } else {
        window.setRetry({ label: R.retry, action: startRun });
      }
    }
    grow(els.endCanvas, man);
    if (!isFriend) markDone();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------
  // 버튼·슬라이더
  // ---------------------------------------------------------------
  els.startBtn.addEventListener('click', function () {
    track('start');
    startRun();
  });
  [['n', els.n], ['c', els.c], ['z', els.z]].forEach(function (pair) {
    pair[1].addEventListener('input', function () {
      man[pair[0]] = Number(pair[1].value);
      redrawEdit(false);
    });
  });
  els.newBtn.addEventListener('click', function () {
    man.s = CORE.randomSeed();
    redrawEdit(true);
  });
  els.shapeBtn.addEventListener('click', function () {
    man.h = (man.h + 1) % CORE.SHAPES.length;
    redrawEdit(true);
  });
  els.colorBtn.addEventListener('click', function () {
    man.k = (man.k + 1) % CORE.PALETTES.length;
    redrawEdit(false);
  });
  els.saveBtn.addEventListener('click', function () { savePng(man, els.status); });
  els.shareBtn.addEventListener('click', shareLink);
  els.doneBtn.addEventListener('click', function () { showEnd(man, false); });
  els.endSave.addEventListener('click', function () { savePng(man, els.endStatus); });
  els.endEdit.addEventListener('click', function () {
    show('edit');
    redrawEdit(false);
    window.scrollTo(0, 0);
  });

  if (window.setShareData) {
    window.setShareData(function () {
      return { title: R.shareTitle || document.title, text: R.shareText || '', url: shareUrl() };
    });
  }

  // 글꼴이 준비되면 글자(브랜드 문구)가 들어간 그림을 다시 그린다
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (man && !els.end.hidden) still(els.endCanvas, man);
      if (man && !els.edit.hidden) still(els.canvas, man);
    });
  }

  // ---------------------------------------------------------------
  // 시작: 받은 링크(#d=)면 끝 화면으로, 아니면 시작 화면
  // ---------------------------------------------------------------
  function openFromHash() {
    var h = window.location.hash || '';
    var shared = /^#d=/.test(h) ? CORE.decode(h.slice(3)) : null;
    if (shared) {
      showEnd(shared, true);
      return true;
    }
    return false;
  }
  // 이미 열린 페이지에서 주소의 #d= 만 바뀌어도 받은 그림을 보여 준다
  window.addEventListener('hashchange', function () { openFromHash(); });
  if (!openFromHash()) show('start');
})();
