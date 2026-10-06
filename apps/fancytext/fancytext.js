/* apps/fancytext/fancytext.js — 시작(티징) → 글 입력 + 스타일 목록(누르면 복사) → 첫 복사 뒤 공통 끝 화면
 * 변환은 fancytext-core.js(FANCYTEXT_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 스타일 목록 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 첫 복사 뒤 끝 화면(data-mg-end)이 나오고 입력 화면 광고는 숨는다.
 * 기록: 시작 버튼을 누를 때 track('start') 한 번, 첫 복사 때 track('done') 한 번(다른 글 꾸미기로 새로 시작하면 다시 한 번씩).
 * 숫자: 서버 숫자는 쓰지 않는다. 입력한 글은 이 브라우저 안에서만 쓰고 저장·전송하지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.FANCYTEXT_APP (text(), copied(), state())
 */
(function () {
  'use strict';

  var CORE = window.FANCYTEXT_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.make || {};
  var R = UI.result || {};
  var NAMES = UI.names || {};

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), make: $('screen-make'), startBtn: $('start-btn'),
    input: $('text-input'), count: $('char-count'), clear: $('clear-btn'), note: $('latin-note'),
    fontsHead: $('fonts-head'), fontList: $('font-list'), decoHead: $('deco-head'), decoList: $('deco-list'),
    endWrap: $('end-wrap'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var copiedOnce = false;   // 이번 판에서 이미 복사했는지(done 기록·끝 화면 표시)
  var lastCopied = '';

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function toast(m) { if (window.toast) window.toast(m); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.make.hidden = name !== 'make';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 목록
  function row(item, preview) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ft-row' + (preview ? ' is-preview' : '');
    b.setAttribute('data-style', item.id);
    var name = document.createElement('span');
    name.className = 'ft-name';
    name.textContent = NAMES[item.id] || item.id;
    var out = document.createElement('span');
    out.className = 'ft-out';
    out.textContent = item.out;
    b.appendChild(name);
    b.appendChild(out);
    b.addEventListener('click', function () { copy(item.out, b); });
    li.appendChild(b);
    return li;
  }
  function fill(ul, head, items, preview) {
    ul.textContent = '';
    items.forEach(function (it) { ul.appendChild(row(it, preview)); });
    ul.hidden = head.hidden = !items.length;
  }
  function render() {
    var raw = CORE.clean(els.input.value);
    var typed = !!raw.trim();
    var text = typed ? raw : P.sample;
    var items = CORE.list(text);
    var fonts = items.filter(function (i) { return i.group === 'font'; });
    var decos = items.filter(function (i) { return i.group === 'deco'; });
    fill(els.fontList, els.fontsHead, fonts, !typed);
    fill(els.decoList, els.decoHead, decos, !typed);
    els.note.hidden = !typed || CORE.hasLatin(raw);
    els.count.textContent = Array.from(els.input.value).length + ' / ' + CORE.MAX_INPUT;
  }

  // ---------------------------------------------------------------- 복사
  function done() {
    if (copiedOnce) return;
    copiedOnce = true;
    track('done');
    els.make.classList.add('is-done');
    els.endWrap.hidden = false;
  }
  function copy(text, btn) {
    if (!els.input.value.trim()) { toast(P.needText); els.input.focus(); return; }
    var ok = function () {
      lastCopied = text;
      toast(R.copied);
      markCopied(btn);
      done();
    };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast(R.copyFail); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  }
  function markCopied(btn) {
    Array.prototype.forEach.call(document.querySelectorAll('.ft-row.is-copied'), function (b) { b.classList.remove('is-copied'); });
    btn.classList.add('is-copied');
  }

  // ---------------------------------------------------------------- 시작 · 새로 하기 · 공유
  function begin() {
    show('make');
    render();
    track('start');
    els.input.focus();
  }
  function again() {
    els.input.value = '';
    copiedOnce = false;
    lastCopied = '';
    els.make.classList.remove('is-done');
    els.endWrap.hidden = true;
    begin();
  }
  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      return { title: R.shareTitle, text: R.shareText, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: again });

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', begin);
  els.input.addEventListener('input', render);
  els.clear.addEventListener('click', function () { els.input.value = ''; render(); els.input.focus(); });

  window.FANCYTEXT_APP = {
    text: function () { return els.input.value; },
    copied: function () { return lastCopied || null; },
    state: function () { return { done: copiedOnce }; }
  };

  render();
  show('start');
})();
