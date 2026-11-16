/* apps/advent/advent.js — 어드벤트 캘린더 만들기: 시작(티징) → 편집기(디자인·이름·24칸 메시지(🎲·빈 칸 채우기)) → 끝 화면(링크·복사·이미지·미리보기 + 공통 끝 화면)
 * 디자인·날짜·검증·공유 인코딩은 advent-core.js(AD_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 받은 링크(#d=)는 끝 화면 자리에 캘린더: 받는 사람 기기 날짜가 12월 N일 이상인 문만 열린다(잠긴 문은 흔들리고 "N일 뒤" 안내).
 *   연 문은 localStorage(advent_open_<링크 해시>)에 기억. start/done 은 세지 않는다(award 와 같음), 다시 하기 = "나도 만들기".
 * 미리보기(모든 문 열림)는 만든 사람만 — 편집기·끝 화면 버튼으로만 들어간다(링크로는 열 수 없음).
 * 기록: 편집기에서 처음 입력할 때 track('start') 한 번, 링크를 만들 때 track('done') 한 번.
 * 메시지는 서버로 보내지 않는다(링크 안에만). 쓰던 캘린더는 localStorage(advent_draft)에만 잠깐 둔다.
 * 사용자 글은 textContent·input.value 로만 쓴다(innerHTML 금지). 이미지 저장은 문 번호만 그린다(메시지 없음).
 * 디버그/검사용 읽기 전용 핸들: window.AD_APP (cal(), link(), lastImage, now 바꾸기 — setNow)
 */
(function () {
  'use strict';

  var CORE = window.AD_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.calendar || {};
  var R = UI.result || {};
  var IDEAS = UI.ideas || [];
  var LANG = UI.lang || 'en';
  var DRAFT_KEY = 'advent_draft';
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji"';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), preview: $('screen-preview'), end: $('screen-end'),
    startBtn: $('start-btn'), themes: $('themes'), to: $('f-to'), from: $('f-from'), days: $('days'), count: $('day-count'),
    fillBtn: $('fill-btn'), editStatus: $('edit-status'), previewBtn: $('preview-btn'), createBtn: $('create-btn'),
    previewGrid: $('preview-grid'), previewBack: $('preview-back'),
    mine: $('end-mine'), linkBox: $('link-box'), copyBtn: $('copy-btn'), endStatus: $('end-status'), eyebrow: $('end-eyebrow'),
    saveBtn: $('save-btn'), endPreviewBtn: $('end-preview-btn'), editBtn: $('edit-btn'),
    friend: $('end-friend'), calFor: $('cal-for'), calFrom: $('cal-from'), calStatus: $('cal-status'), calGrid: $('cal-grid'), makeOwn: $('make-own'),
    modal: $('door-modal'), modalEmoji: $('modal-emoji'), modalTitle: $('modal-title'), modalMsg: $('modal-msg'), modalClose: $('modal-close'),
    year: $('year')
  };
  var inputs = Array.prototype.slice.call(els.days.querySelectorAll('.ad-day-input'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var cal = CORE.defaults();
  var created = null;     // 링크를 만든 캘린더
  var link = '';          // 만든 링크
  var friendCal = null;   // 받은 캘린더
  var friendEnc = '';
  var friend = false;
  var opened = [];        // 받은 캘린더에서 연 문 (localStorage)
  var previewOpened = []; // 미리보기에서 연 문 (저장 안 함)
  var previewFrom = 'edit';
  var started = false;    // track('start') 는 한 판에 한 번
  var doneSent = false;   // track('done') 도 한 판에 한 번
  var saving = false;
  var lastFocus = null;
  var nowOverride = null;
  var app = {
    lastImage: null,
    cal: function () { return CORE.copy(cal); },
    link: function () { return link; },
    setNow: function (d) { nowOverride = d ? new Date(d) : null; if (friend && friendCal) renderFriend(); }
  };
  window.AD_APP = app;

  function now() { return nowOverride ? new Date(nowOverride.getTime()) : new Date(); }
  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function baseUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0];
  }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.preview.hidden = name !== 'preview';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 쓰던 캘린더 (localStorage, 이 기기에만)
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(cal)); } catch (e) { /* noop */ }
  }
  function loadDraft() {
    try { var raw = localStorage.getItem(DRAFT_KEY); return raw ? CORE.normalize(JSON.parse(raw)) : null; } catch (e) { return null; }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 편집기
  function markStarted() {
    if (!started) { started = true; doneSent = false; track('start'); }
  }
  function readInputs() {
    cal.to = CORE.cleanText(els.to.value, CORE.LIMITS.to);
    cal.fr = CORE.cleanText(els.from.value, CORE.LIMITS.fr);
    inputs.forEach(function (el, i) { cal.m[i] = CORE.cleanText(el.value, CORE.LIMITS.m); });
    updateCount();
  }
  function updateCount() {
    var n = CORE.filled(cal);
    els.count.textContent = fmt(E.counter, { n: n });
    els.count.classList.toggle('is-full', n === CORE.DAYS);
  }
  function fillInputs() {
    els.to.value = cal.to;
    els.from.value = cal.fr;
    inputs.forEach(function (el, i) { el.value = cal.m[i] || ''; });
    updateCount();
    syncChips();
  }
  function syncChips() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.ad-theme'), function (b) {
      var on = Number(b.getAttribute('data-t')) === cal.t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function editStatus(msg) { els.editStatus.textContent = msg || ''; }
  function startEditor(fresh) {
    var draft = fresh ? null : loadDraft();
    cal = draft || CORE.defaults();
    if (fresh) clearDraft();
    editStatus('');
    fillInputs();
    show('edit');
  }
  // 🎲: 다른 칸에 이미 쓴 문구는 피해서 하나 고른다
  function pickIdea(day) {
    var used = cal.m.filter(Boolean);
    var pool = IDEAS.filter(function (s) { return used.indexOf(CORE.cleanText(s, CORE.LIMITS.m)) < 0; });
    if (!pool.length) pool = IDEAS.slice();
    if (!pool.length) return '';
    var cur = cal.m[day - 1];
    var choice = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && CORE.cleanText(choice, CORE.LIMITS.m) === cur) choice = pool[(pool.indexOf(choice) + 1) % pool.length];
    return CORE.cleanText(choice, CORE.LIMITS.m);
  }
  function diceDay(day) {
    markStarted();
    readInputs();
    var v = pickIdea(day);
    if (!v) return;
    inputs[day - 1].value = v;
    readInputs();
    saveDraft();
    editStatus('');
    track('ad_dice');
  }
  function fillEmpty() {
    markStarted();
    readInputs();
    var n = 0;
    inputs.forEach(function (el, i) {
      if (cal.m[i]) return;
      var v = pickIdea(i + 1);
      if (!v) return;
      el.value = v;
      cal.m[i] = v;
      n++;
    });
    readInputs();
    saveDraft();
    editStatus('');
    if (n) track('ad_fill', { n: n });
  }

  // ---------------------------------------------------------------- 문 격자 (받은 캘린더 · 미리보기)
  function buildGrid(container, x, mode) {
    while (container.firstChild) container.removeChild(container.firstChild);
    var th = CORE.THEMES[x.t] || CORE.THEMES[0];
    var root = container.closest ? container.closest('.ad-cal') : null;
    if (root) {
      CORE.THEMES.forEach(function (t) { root.classList.remove('th-' + t.id); });
      root.classList.add('th-' + th.id);
    }
    var s = CORE.season(now());
    var order = CORE.layout(CORE.seedOf(x));
    var list = mode === 'preview' ? previewOpened : opened;
    order.forEach(function (day) {
      var unlocked = mode === 'preview' || CORE.doorUnlocked(day, now());
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ad-door' + (unlocked ? '' : ' is-locked') + (list.indexOf(day) >= 0 ? ' is-open' : '') + (mode !== 'preview' && s.phase === 'during' && s.day === day ? ' is-today' : '') + (day === CORE.DAYS ? ' is-last' : '');
      b.setAttribute('data-day', String(day));
      b.setAttribute('aria-label', fmt(C.doorAria, { day: day }));
      var inside = document.createElement('span');
      inside.className = 'ad-door-inside';
      inside.setAttribute('aria-hidden', 'true');
      inside.textContent = x.m[day - 1] ? '💌' : CORE.TREATS[day - 1];
      var front = document.createElement('span');
      front.className = 'ad-door-front';
      front.setAttribute('aria-hidden', 'true');
      var num = document.createElement('span');
      num.className = 'ad-door-num';
      num.textContent = String(day);
      front.appendChild(num);
      b.appendChild(inside);
      b.appendChild(front);
      container.appendChild(b);
    });
  }
  function onDoor(container, x, mode, e) {
    var b = e.target.closest ? e.target.closest('.ad-door') : null;
    if (!b || !container.contains(b)) return;
    var day = Number(b.getAttribute('data-day'));
    var unlocked = mode === 'preview' || CORE.doorUnlocked(day, now());
    if (!unlocked) {
      var n = CORE.daysUntil(day, now());
      els.calStatus.textContent = fmt(CORE.plural(C.locked, n, LANG), { day: day, n: n, date: CORE.decDate(day, LANG) });
      b.classList.remove('is-shake');
      if (!REDUCED.matches) {
        void b.offsetWidth; // 애니메이션 다시 시작
        b.classList.add('is-shake');
        window.setTimeout(function () { b.classList.remove('is-shake'); }, 500);
      }
      track('ad_locked');
      return;
    }
    var list = mode === 'preview' ? previewOpened : opened;
    var fresh = list.indexOf(day) < 0;
    if (fresh) {
      list.push(day);
      b.classList.add('is-open');
      if (mode !== 'preview') {
        try { localStorage.setItem(CORE.storeKey(friendEnc), JSON.stringify(opened)); } catch (err) { /* noop */ }
        track('ad_door');
      }
    }
    lastFocus = b;
    var delay = fresh && !REDUCED.matches ? 650 : 0;
    window.setTimeout(function () { openModal(day, x); }, delay);
  }
  els.calGrid.addEventListener('click', function (e) { if (friendCal) onDoor(els.calGrid, friendCal, 'live', e); });
  els.previewGrid.addEventListener('click', function (e) { var x = previewData(); if (x) onDoor(els.previewGrid, x, 'preview', e); });

  // ---------------------------------------------------------------- 메시지 창
  function openModal(day, x) {
    var msg = x.m[day - 1];
    els.modalEmoji.textContent = msg ? '💌' : CORE.TREATS[day - 1];
    els.modalTitle.textContent = fmt(C.dayTitle, { date: CORE.decDate(day, LANG), day: day });
    els.modalMsg.textContent = msg || C.treat;
    els.modalMsg.classList.toggle('is-treat', !msg);
    els.modal.hidden = false;
    els.modal.classList.toggle('is-anim', !REDUCED.matches);
    els.modalClose.focus();
  }
  function closeModal() {
    if (els.modal.hidden) return;
    els.modal.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  els.modalClose.addEventListener('click', closeModal);
  els.modal.addEventListener('click', function (e) { if (e.target === els.modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // ---------------------------------------------------------------- 미리보기 (만든 사람만)
  var previewCal = null;
  function previewData() { return previewCal; }
  function openPreview(from) {
    if (from === 'edit') readInputs();
    previewCal = CORE.copy(from === 'end' && created ? created : cal);
    previewFrom = from;
    previewOpened = [];
    buildGrid(els.previewGrid, previewCal, 'preview');
    show('preview');
    track('ad_preview');
  }
  els.previewBack.addEventListener('click', function () {
    closeModal();
    show(previewFrom === 'end' ? 'end' : 'edit');
  });

  // ---------------------------------------------------------------- 링크 만들기 → 끝 화면(만든 사람)
  function createLink() {
    readInputs();
    var x = CORE.normalize(cal);
    if (!x) return;
    if (!CORE.filled(x)) {
      editStatus(E.needOne);
      var first = inputs[0];
      if (first) first.focus();
      return;
    }
    var enc = CORE.encode(x);
    if (!enc) return;
    markStarted();
    cal = x;
    created = CORE.copy(x);
    link = baseUrl() + '#d=' + enc;
    saveDraft();
    showMine();
    if (!doneSent) { doneSent = true; track('done'); }
    track('ad_create', { t: x.t, n: CORE.filled(x), len: enc.length });
  }
  function endStatus(msg, bad) {
    els.endStatus.textContent = msg || '';
    els.endStatus.classList.toggle('is-bad', !!bad);
  }
  function showMine() {
    friend = false;
    els.mine.hidden = false;
    els.friend.hidden = true;
    els.linkBox.value = link;
    endStatus('');
    if (window.setRetry) window.setRetry({ label: R.retry, action: newCalendar });
    show('end');
  }
  function copyLink() {
    if (!link) return;
    var done = function () { endStatus(R.copied); track('ad_copy'); };
    var fallback = function () {
      try {
        els.linkBox.focus();
        els.linkBox.select();
        if (document.execCommand && document.execCommand('copy')) { done(); return; }
      } catch (e) { /* noop */ }
      endStatus(R.copyFail, true);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, fallback);
    else fallback();
  }
  function newCalendar() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    closeModal();
    friend = false;
    friendCal = null;
    created = null;
    link = '';
    started = false;
    startEditor(true);
  }

  // ---------------------------------------------------------------- 받은 캘린더
  function statusText() {
    var s = CORE.season(now());
    if (s.phase === 'after') return C.after;
    if (s.phase === 'during') return fmt(C.during, { date: CORE.decDate(s.day, LANG) });
    var n = CORE.daysUntil(1, now());
    return fmt(CORE.plural(C.before, n, LANG), { n: n, date: CORE.decDate(1, LANG) });
  }
  function renderFriend() {
    els.calFor.textContent = friendCal.to ? fmt(C.forName, { name: friendCal.to }) : C.forNone;
    els.calFrom.textContent = friendCal.fr ? fmt(C.fromName, { name: friendCal.fr }) : '';
    els.calFrom.hidden = !friendCal.fr;
    els.calStatus.textContent = statusText();
    buildGrid(els.calGrid, friendCal, 'live');
  }
  function showFriend(x, enc) {
    closeModal();
    friend = true;
    friendCal = CORE.copy(x);
    friendEnc = enc;
    opened = [];
    try { opened = CORE.parseOpened(localStorage.getItem(CORE.storeKey(enc)) || '[]'); } catch (e) { opened = []; }
    els.mine.hidden = true;
    els.friend.hidden = false;
    renderFriend();
    if (window.setRetry) window.setRetry({ label: R.retryFriend, action: newCalendar });
    show('end');
    track('ad_open_shared');
  }

  // ---------------------------------------------------------------- 이미지 저장 (문 번호만 — 메시지는 그리지 않는다)
  var IW = 1080;
  var IH = 1350;
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawImage(cv, x) {
    var th = CORE.THEMES[x.t] || CORE.THEMES[0];
    cv.width = IW;
    cv.height = IH;
    var ctx = cv.getContext('2d');
    var fam = (window.getComputedStyle(els.eyebrow).fontFamily || 'sans-serif') + ',' + EMOJI;
    var g = ctx.createLinearGradient(0, 0, 0, IH);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(1, th.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, IW, IH);
    // 눈송이 점 (같은 캘린더 = 같은 그림)
    var s = (CORE.seedOf(x) || 7) >>> 0;
    var rnd = function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    for (var i = 0; i < 120; i++) {
      ctx.globalAlpha = 0.25 + rnd() * 0.5;
      ctx.fillStyle = th.deco[i % th.deco.length];
      ctx.beginPath(); ctx.arc(rnd() * IW, rnd() * IH, 2 + rnd() * 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 제목 + 받는 사람
    var heading = C.heading || '';
    var size = 84;
    ctx.font = '900 ' + size + 'px ' + fam;
    while (ctx.measureText(heading).width > IW - 140 && size > 40) { size -= 4; ctx.font = '900 ' + size + 'px ' + fam; }
    ctx.fillStyle = th.accent;
    ctx.fillText(heading, IW / 2, 120);
    if (x.to) {
      ctx.font = '800 46px ' + fam;
      ctx.fillStyle = th.id === 'candy' ? '#7a2a48' : '#ffffff';
      ctx.fillText(fmt(C.forName, { name: x.to }), IW / 2, 196, IW - 160);
    }
    // 문 4 × 6
    var cols = 4;
    var gap = 22;
    var left = 70;
    var top = 262;
    var cw = (IW - left * 2 - gap * (cols - 1)) / cols;
    var ch = (IH - top - 110 - gap * 5) / 6;
    CORE.layout(CORE.seedOf(x)).forEach(function (day, k) {
      var cx = left + (k % cols) * (cw + gap);
      var cy = top + Math.floor(k / cols) * (ch + gap);
      var dg = ctx.createLinearGradient(cx, cy, cx, cy + ch);
      dg.addColorStop(0, th.door[0]);
      dg.addColorStop(1, th.door[1]);
      ctx.fillStyle = dg;
      roundRect(ctx, cx, cy, cw, ch, 18);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = th.frame;
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      roundRect(ctx, cx + 10, cy + 10, cw - 20, ch - 20, 10);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = th.num;
      ctx.font = '900 ' + (day === CORE.DAYS ? 72 : 62) + 'px ' + fam;
      ctx.fillText(String(day), cx + cw / 2, cy + ch / 2 + 4);
      if (day === CORE.DAYS) { ctx.font = '34px ' + EMOJI; ctx.fillText('⭐', cx + cw - 26, cy + 26); }
    });
    // 맨 아래 주소
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = th.id === 'candy' ? '#7a2a48' : '#ffffff';
    ctx.font = '700 26px ' + fam;
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText('🎄 ' + host, IW / 2, IH - 54, IW - 120);
    ctx.globalAlpha = 1;
  }
  function makePng(x) {
    return new Promise(function (resolve, reject) {
      try {
        var cv = document.createElement('canvas');
        drawImage(cv, x);
        cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
      } catch (e) { reject(e); }
    });
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function saveImage() {
    if (saving || !created) return;
    saving = true;
    els.saveBtn.disabled = true;
    endStatus(R.saving);
    var x = CORE.copy(created);
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () { return makePng(x); }).then(function (blob) {
      var name = (R.fileName || 'advent-calendar') + '.png';
      app.lastImage = { w: IW, h: IH, size: blob.size, type: blob.type };
      var file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
      var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
          endStatus(R.saved);
          track('ad_save', { via: 'share' });
        }, function (err) {
          if (err && err.name === 'AbortError') { endStatus(''); return; }
          download(blob, name);
          endStatus(R.saved);
          track('ad_save', { via: 'download' });
        });
      }
      download(blob, name);
      endStatus(R.saved);
      track('ad_save', { via: 'download' });
      return null;
    }).catch(function () {
      endStatus(R.saveFail, true);
      track('ad_save_fail');
    }).then(function () {
      saving = false;
      els.saveBtn.disabled = false;
    });
  }

  // ---------------------------------------------------------------- 공유 링크 읽기
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    var enc = h.slice(3);
    var x = CORE.decode(enc);
    return x ? { x: x, enc: enc } : null;
  }

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { startEditor(false); });
  els.themes.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.ad-theme') : null;
    if (!b) return;
    markStarted();
    cal.t = Number(b.getAttribute('data-t'));
    syncChips();
    saveDraft();
  });
  els.themes.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = CORE.THEMES.length;
    cal.t = (cal.t + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    syncChips();
    saveDraft();
    var btn = els.themes.querySelector('.ad-theme[data-t="' + cal.t + '"]');
    if (btn) btn.focus();
    e.preventDefault();
  });
  var LIM = { 'f-to': CORE.LIMITS.to, 'f-from': CORE.LIMITS.fr };
  [els.to, els.from].concat(inputs).forEach(function (el) {
    var max = LIM[el.id] || CORE.LIMITS.m;
    el.addEventListener('input', function () { markStarted(); readInputs(); saveDraft(); editStatus(''); });
    el.addEventListener('blur', function () {
      el.value = CORE.cleanText(el.value, max);
      readInputs();
      saveDraft();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      var all = [els.to, els.from].concat(inputs);
      var next = all[all.indexOf(el) + 1];
      if (next) next.focus(); else el.blur();
    });
  });
  els.days.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.ad-dice') : null;
    if (b) diceDay(Number(b.getAttribute('data-day')));
  });
  els.fillBtn.addEventListener('click', fillEmpty);
  els.previewBtn.addEventListener('click', function () { openPreview('edit'); });
  els.createBtn.addEventListener('click', createLink);
  els.copyBtn.addEventListener('click', copyLink);
  els.linkBox.addEventListener('focus', function () { els.linkBox.select(); });
  els.saveBtn.addEventListener('click', saveImage);
  els.endPreviewBtn.addEventListener('click', function () { openPreview('end'); });
  els.editBtn.addEventListener('click', function () {
    cal = CORE.copy(created || cal);
    fillInputs();
    editStatus('');
    show('edit');
  });
  els.makeOwn.addEventListener('click', function () { track('ad_make_own'); newCalendar(); });

  // 공통 끝 화면: 만든 사람 = 만든 링크 · 받은 사람 = 메시지 없는 앱 주소(나도 만들기)
  if (window.setShareData) {
    window.setShareData(function () {
      if (friend) return { title: R.shareTitle, text: R.shareTextFriend, url: baseUrl() };
      return { title: R.shareTitle, text: R.shareText, url: link || baseUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: newCalendar });

  window.addEventListener('hashchange', function () {
    var h = readHash();
    if (h && h.enc !== friendEnc) showFriend(h.x, h.enc);
  });

  var initial = readHash();
  if (initial) showFriend(initial.x, initial.enc);
  else show('start');
})();
