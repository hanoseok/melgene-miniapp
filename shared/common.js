// 모든 사이트 공통 스크립트: 지역 언어 자동 이동, 광고 주입, GA4, 공유/복사, 토스트, 크로스 프로모, 언어 전환.
// site.config.js, i18n.js 보다 뒤에 로드되어야 한다. window.SITE_CONFIG / window.SITE_I18N 을 읽는다.
// UI 문자열은 페이지의 <html lang> 으로 고른다.
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var I18N = window.SITE_I18N || {};
  var DEFAULT_LANG = I18N.DEFAULT_LOCALE || 'en';
  var FALLBACK_STRINGS = { copied: 'Link copied!', ad: 'Ad' };

  var LANG = (document.documentElement.getAttribute('lang') || DEFAULT_LANG).toLowerCase().split('-')[0];
  window.PAGE_LANG = LANG;

  function stringsFor(lang) {
    var all = I18N.STRINGS || {};
    return all[lang] || all[DEFAULT_LANG] || FALLBACK_STRINGS;
  }
  var S = stringsFor(LANG);
  function t(key) { return S[key] != null ? S[key] : (FALLBACK_STRINGS[key] || key); }
  window.t = t;

  // ---------------------------------------------------------------
  // 0) 방문자 지역 → 그 나라 언어 페이지로 자동 이동 (가능한 한 빨리: 이 파일이 읽히는 즉시, 화면 그리기 전에)
  //    - 기본 언어(en, 사이트 루트) 페이지에서만, 방문자가 언어를 직접 고른 적이 없을 때만(lang_pref / mg_lang).
  //    - 크롤러·자동화 브라우저(navigator.webdriver)는 절대 옮기지 않는다 → Google 은 언어별 주소를 그대로 색인.
  //    - ?lang=<코드> 는 그 언어를 고른 것으로 기억하고 이동하지 않는다. #nolang 은 이번만 이동하지 않는다.
  //    - 나라: Supabase RPC client_country()(Cloudflare cf-ipcountry, 저장 안 함, 세션 동안 sessionStorage 캐시, 1.2초 제한)
  //      → 모르면 브라우저 언어의 지역(ko-KR → KR) → 그래도 모르거나 영어권이면 영어 그대로.
  //    - 이동할 주소는 이 페이지의 언어 선택(상대 주소) 또는 hreflang 링크에서 찾고, 쿼리·해시는 그대로 넘긴다.
  // ---------------------------------------------------------------
  var PREF_KEY = 'lang_pref';
  var PREF_KEYS = [PREF_KEY, 'mg_lang'];
  var GEO_CACHE = 'mg_cc';
  var GEO_TIMEOUT = 1200;
  var BOT_UA = /(^|[^a-z])bot([^a-z]|$)|[a-z]bot\/|crawl|spider|slurp|googlebot|google-inspectiontool|mediapartners|adsbot|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|exabot|facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|pinterest|slackbot|discordbot|telegrambot|whatsapp|skypeuripreview|embedly|quora link preview|applebot|petalbot|semrush|ahrefs|mj12bot|dotbot|headlesschrome|lighthouse|pagespeed|gtmetrix|prerender|phantomjs|puppeteer|playwright/i;
  // 나라 → 언어 (없는 나라 = 영어). BE·LU·CH 는 브라우저 언어를 조금 본다.
  var COUNTRY_LANG = {};
  (function () {
    function set(lang, list) { list.split(' ').forEach(function (c) { COUNTRY_LANG[c] = lang; }); }
    set('ko', 'KR');
    set('ja', 'JP');
    set('zh', 'CN TW HK MO SG');
    set('fr', 'FR BE MC LU SN CI CM ML BF NE TG BJ GA CG CD MG');
    set('de', 'DE AT LI CH');
    set('th', 'TH');
    set('vi', 'VN');
    set('es', 'ES MX AR CO CL PE VE EC GT CU BO DO HN PY SV NI CR PA UY PR');
    set('it', 'IT SM VA');
    set('pt', 'PT BR AO MZ CV GW ST TL');
  })();

  function savePref(lang) {
    try { localStorage.setItem(PREF_KEY, lang); } catch (e) { /* noop */ }
  }
  function hasPref() {
    for (var i = 0; i < PREF_KEYS.length; i++) {
      try { if (localStorage.getItem(PREF_KEYS[i])) return true; } catch (e) { return true; } // 저장소를 못 쓰면 옮기지 않는다
    }
    return false;
  }
  function navLangs() {
    var l = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    return Array.prototype.map.call(l, function (x) { return String(x || ''); });
  }
  function isBot() {
    if (navigator.webdriver) return true;
    return BOT_UA.test(navigator.userAgent || '');
  }
  function knownLang(code) {
    var locs = I18N.LOCALES || [];
    for (var i = 0; i < locs.length; i++) if (locs[i].code === code) return true;
    return false;
  }
  function langForCountry(cc) {
    cc = String(cc || '').toUpperCase();
    var lang = COUNTRY_LANG[cc];
    if (!lang) return null;
    var first = (navLangs()[0] || '').toLowerCase().split(/[-_]/)[0];
    if (cc === 'CH') lang = first === 'fr' || first === 'it' ? first : 'de';
    else if (cc === 'BE' || cc === 'LU') lang = first === 'de' ? 'de' : 'fr';
    return knownLang(lang) ? lang : null;
  }
  window.mgLangForCountry = langForCountry;
  // 브라우저 언어 목록에서 첫 지역 표시(ko-KR → KR, es-419 같은 숫자 지역은 건너뜀)
  function navCountry() {
    var l = navLangs();
    for (var i = 0; i < l.length; i++) {
      var m = /^[a-z]{2,3}(?:[-_][A-Za-z]{4})?[-_]([A-Za-z]{2})(?:[-_]|$)/.exec(l[i]);
      if (m) return m[1].toUpperCase();
    }
    return null;
  }
  function supaBase() {
    var h = window.location.hostname;
    if (!h || h === 'localhost' || /^127\./.test(h) || h === '[::1]') {
      try { return localStorage.getItem('mg_supa_url') || ''; } catch (e) { return ''; }
    }
    return CFG.SUPABASE_URL || '';
  }
  // 서버가 본 나라 코드 → callback('KR' | null). 세션 동안 기억한다('-' = 모름).
  function serverCountry(cb) {
    var cached = null;
    try { cached = sessionStorage.getItem(GEO_CACHE); } catch (e) { /* noop */ }
    if (cached) { cb(cached === '-' ? null : cached); return; }
    var base = supaBase(), key = CFG.SUPABASE_ANON_KEY || (base && base !== (CFG.SUPABASE_URL || '') ? 'local-mock' : '');
    if (!base || !key || !window.fetch) { cb(null); return; }
    var done = false;
    function finish(cc) {
      cc = /^[A-Z]{2}$/.test(String(cc || '')) ? cc : null;
      try { sessionStorage.setItem(GEO_CACHE, cc || '-'); } catch (e) { /* noop */ } // 늦게 와도 다음 페이지를 위해 기억
      if (done) return;
      done = true;
      cb(cc);
    }
    var ctrl = window.AbortController ? new AbortController() : null;
    setTimeout(function () { if (!done) { done = true; cb(null); } }, GEO_TIMEOUT); // 늦으면 브라우저 언어로 판단(응답은 계속 기다려 캐시)
    setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    var headers = { apikey: key, 'Content-Type': 'application/json' };
    if (/^eyJ/.test(key)) headers.Authorization = 'Bearer ' + key;
    fetch(base.replace(/\/$/, '') + '/rest/v1/rpc/client_country', {
      method: 'POST', headers: headers, body: '{}', signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cc) { finish(typeof cc === 'string' ? cc.toUpperCase() : null); })
      .catch(function () { if (!done) { done = true; cb(null); } });
  }
  // 같은 페이지의 다른 언어 주소 (언어 선택의 상대 주소 → 없으면 hreflang 링크)
  function altUrl(lang) {
    var opt = document.querySelector('.lang-switch option[data-hreflang="' + lang + '"]');
    var href = opt && opt.value;
    if (!href) {
      var link = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
      href = link && link.getAttribute('href');
    }
    if (!href) return null;
    var u;
    try { u = new URL(href, window.location.href); } catch (e) { return null; }
    if (!u.search) u.search = window.location.search;
    if (!u.hash) u.hash = window.location.hash;
    return u.href === window.location.href ? null : u.href;
  }
  // 판단이 끝날 때까지 조회수·플레이 기록(initStats)을 미룬다 — 옮겨 갈 페이지를 두 번 세지 않게.
  var geoWait = [];
  var geoSettled = false;
  function geoDone() {
    if (geoSettled) return;
    geoSettled = true;
    geoWait.splice(0).forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
  }
  function afterGeo(fn) { if (geoSettled) fn(); else geoWait.push(fn); }
  function regionRedirect() {
    if (LANG !== DEFAULT_LANG) return geoDone();
    var q = null;
    try { q = new URLSearchParams(window.location.search).get('lang'); } catch (e) { q = null; }
    if (q != null) { if (knownLang(q)) savePref(q); return geoDone(); } // ?lang=<코드>: 직접 고른 것으로
    if (/^#nolang\b/.test(window.location.hash)) return geoDone();
    if (hasPref() || isBot()) return geoDone();
    serverCountry(function (cc) {
      var lang = cc ? langForCountry(cc) : langForCountry(navCountry());
      var url = lang && lang !== DEFAULT_LANG ? altUrl(lang) : null;
      if (url) { window.location.replace(url); return; }
      geoDone();
    });
  }
  try { regionRedirect(); } catch (e) { geoDone(); /* 이동 실패는 그냥 영어 페이지 */ }

  // SITES 항목의 언어별 제목/설명/주소
  function pick(v, lang) {
    if (v == null || typeof v === 'string') return v || '';
    return v[lang] != null ? v[lang] : (v[DEFAULT_LANG] || '');
  }
  function localizeSite(s, lang) {
    lang = lang || LANG;
    var href = (s.paths && s.paths[lang]) ||
      (I18N.localePath ? I18N.localePath(s.path, lang) : s.path);
    return { id: s.id, emoji: s.emoji, title: pick(s.title, lang), desc: pick(s.desc, lang), href: href };
  }
  window.localizeSite = localizeSite;

  // ---------------------------------------------------------------
  // 1) 광고: 따로 광고 자리를 잡지 않는다. AdSense 자동 광고(Auto ads) 스크립트는
  //    deploy-prep.sh 가 배포본 <head>에 직접 넣는다(deploy.env 의 ADSENSE_CLIENT).
  //    구글이 페이지를 보고 알아서 위치를 정한다.
  // ---------------------------------------------------------------
  function initAds() { initInlineAds(); }

  // 앱 중간 광고: <div class="mg-ad"></div> 를 둔 자리에 광고 단위를 하나 넣는다.
  // 화면에 실제로 보일 때(너비가 생길 때) 불러오고, 광고가 없으면(unfilled) 자리째 숨긴다 — 빈 칸을 남기지 않는다.
  // 게시자 ID는 배포 때 <head>의 google-adsense-account 메타에서 읽는다. localhost 에서는 부르지 않는다.
  function adClient() {
    var m = document.querySelector('meta[name="google-adsense-account"]');
    return m ? m.getAttribute('content') : '';
  }
  function renderAd(el) {
    if (!el || el.getAttribute('data-mg-ad-ready')) return;
    var client = adClient();
    var slot = CFG.AD_SLOT_MID;
    var host = window.location.hostname;
    if (!client || !slot || !host || host === 'localhost' || /^127\./.test(host)) return;
    if (!el.offsetWidth) return; // 아직 안 보이는 자리 — 보일 때 다시 시도
    el.setAttribute('data-mg-ad-ready', '1');
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', client);
    ins.setAttribute('data-ad-slot', slot);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    el.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* noop */ }
  }
  window.renderAd = renderAd;
  var adIO = null;
  function observeAd(el) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { renderAd(el); return; }
    if (!adIO) {
      adIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { renderAd(en.target); if (en.target.getAttribute('data-mg-ad-ready')) adIO.unobserve(en.target); }
        });
      }, { rootMargin: '200px 0px' });
    }
    adIO.observe(el);
  }
  window.observeAd = observeAd;
  function initInlineAds() {
    Array.prototype.forEach.call(document.querySelectorAll('.mg-ad'), observeAd);
  }

  // ---------------------------------------------------------------
  // 2) GA4
  // ---------------------------------------------------------------
  function initAnalytics() {
    var id = CFG.GA4_ID && CFG.GA4_ID.trim();
    var gtag = null;
    if (id) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      gtag = function () { window.dataLayer.push(arguments); };
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', id);
    }

    // 모든 track() 이벤트는 Supabase 하루 합계(daily_stats)에도 +1 된다.
    var site = currentSiteId();
    window.track = function (event, params) {
      if (gtag) { try { gtag('event', event, params || {}); } catch (e) { /* noop */ } }
      if (window.supa && site) window.supa.bump(event, site);
    };
    afterGeo(function () { initStats(site); }); // 지역 자동 이동을 할 페이지는 세지 않는다
  }

  // 지금 페이지가 어느 사이트인지: SITE_CONFIG.SITES 의 주소와 비교. 없으면 루트 도메인 = hub.
  // localhost 등 개발 환경에서는 통계를 보내지 않는다.
  function currentSiteId() {
    var host = window.location.hostname;
    if (!host || host === 'localhost' || /^127\.|^\[?::1/.test(host)) return null;
    var here = window.location.host + window.location.pathname;
    var sites = CFG.SITES || [];
    for (var i = 0; i < sites.length; i++) {
      var base = String(sites[i].path || '').replace(/^https?:\/\//, '');
      if (base && here.indexOf(base) === 0) return sites[i].id;
    }
    return 'hub';
  }

  // 페이지 조회수 + 자동 광고 채움 여부(구글이 붙이는 data-ad-status 값을 읽기만 한다).
  // 유입 경로 분류 (주소는 저장하지 않고 종류만): 사이트 안 이동이면 null
  var SEARCH_ENGINES = [
    ['google', /(^|\.)google\.[a-z.]+$/], ['naver', /(^|\.)naver\.com$/], ['daum', /(^|\.)daum\.net$/],
    ['bing', /(^|\.)bing\.com$/], ['yahoo', /(^|\.)yahoo\.(com|co\.jp)$/], ['duckduckgo', /(^|\.)duckduckgo\.com$/],
    ['baidu', /(^|\.)baidu\.com$/], ['yandex', /(^|\.)yandex\.[a-z.]+$/], ['coccoc', /(^|\.)coccoc\.com$/], ['ecosia', /(^|\.)ecosia\.org$/]
  ];
  var SOCIAL = [
    ['x', /(^|\.)(t\.co|x\.com|twitter\.com)$/], ['facebook', /(^|\.)(facebook\.com|fb\.com|fb\.me)$/],
    ['instagram', /(^|\.)instagram\.com$/], ['threads', /(^|\.)threads\.(net|com)$/], ['tiktok', /(^|\.)tiktok\.com$/],
    ['kakao', /(^|\.)kakao\.com$/], ['line', /(^|\.)line\.me$/], ['whatsapp', /(^|\.)whatsapp\.com$/],
    ['youtube', /(^|\.)(youtube\.com|youtu\.be)$/], ['reddit', /(^|\.)reddit\.com$/]
  ];
  function trafficSource(ref, selfHost) {
    if (!ref) return 'in_direct';
    var host;
    try { host = new URL(ref).hostname.toLowerCase(); } catch (e) { return 'in_other'; }
    if (!host || host === selfHost || /(^|\.)melgene\.com$/.test(host)) return null;
    for (var i = 0; i < SEARCH_ENGINES.length; i++) if (SEARCH_ENGINES[i][1].test(host)) return 'in_search_' + SEARCH_ENGINES[i][0];
    for (var j = 0; j < SOCIAL.length; j++) if (SOCIAL[j][1].test(host)) return 'in_social_' + SOCIAL[j][0];
    return 'in_other';
  }
  window.trafficSource = trafficSource;

  function initStats(site) {
    if (!site || !window.supa || !window.supa.enabled()) return;
    window.supa.bump('pv', site);
    var src = trafficSource(document.referrer, window.location.hostname);
    if (src) window.supa.bump(src, site); // 밖에서 들어온 첫 페이지만 (검색/SNS/직접/기타)
    if (site !== 'hub' && window.supa.play) window.supa.play(site); // 플레이 수 = 앱에 들어온 수 (30초 중복 제외)
    if (!window.MutationObserver) return;
    var seen = [];
    function check(el) {
      var st = el.getAttribute && el.getAttribute('data-ad-status');
      if ((st === 'filled' || st === 'unfilled') && seen.indexOf(el) < 0) {
        seen.push(el);
        window.supa.bump(st === 'filled' ? 'ad_filled' : 'ad_unfilled', site);
      }
    }
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'attributes') check(m.target);
        else m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function (n) {
          if (n.nodeType === 1 && n.matches && n.matches('ins.adsbygoogle')) check(n);
        });
      });
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-ad-status'] });
  }

  // ---------------------------------------------------------------
  // 3) 토스트
  // ---------------------------------------------------------------
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('_toast');
    if (!el) {
      el = document.createElement('div');
      el.id = '_toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 2200);
  }
  window.toast = toast;

  // ---------------------------------------------------------------
  // 4) 공유
  // ---------------------------------------------------------------
  function share(opts) {
    opts = opts || {};
    var title = opts.title || document.title;
    var text = opts.text || '';
    var url = opts.url || window.location.href;

    if (navigator.share) {
      navigator.share({ title: title, text: text, url: url }).catch(function () {});
      return;
    }
    // 공유 시트가 없으면 문구 + 링크를 함께 복사한다 (문구가 없으면 링크만)
    copyLink(text ? text + '\n' + url : url);
  }
  window.share = share;

  function copyLink(url) {
    url = url || window.location.href;
    var done = function () { toast(t('copied')); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () {
        fallbackCopy(url, done);
      });
    } else {
      fallbackCopy(url, done);
    }
  }
  window.copyLink = copyLink;

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    if (cb) cb();
  }

  function shareTwitterUrl(opts) {
    opts = opts || {};
    var text = opts.text || document.title;
    var url = opts.url || window.location.href;
    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
  }
  window.shareTwitterUrl = shareTwitterUrl;

  function shareFacebookUrl(opts) {
    opts = opts || {};
    var url = opts.url || window.location.href;
    return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
  }
  window.shareFacebookUrl = shareFacebookUrl;

  // ---------------------------------------------------------------
  // 5) 크로스 프로모 ("다른 테스트 해보기")
  // ---------------------------------------------------------------
  function renderMoreTests(currentId, hostEl) {
    var host = hostEl || document.getElementById('more-tests');
    if (!host) return;
    var wrap = hostEl ? host : (host.closest('.more-tests-section') || host);
    var sites = (CFG.SITES || []).filter(function (s) { return s.id !== currentId; });
    if (!sites.length) { wrap.style.display = 'none'; return; }

    host.innerHTML = '';
    sites.forEach(function (site) {
      var s = localizeSite(site);
      var a = document.createElement('a');
      a.className = 'more-test-card';
      a.href = s.href;
      a.innerHTML =
        '<span class="more-test-emoji">' + s.emoji + '</span>' +
        '<span class="more-test-body">' +
        '<span class="more-test-title">' + s.title + '</span>' +
        '<span class="more-test-desc">' + s.desc + '</span>' +
        '</span>' +
        '<span class="more-test-arrow">→</span>';
      host.appendChild(a);
    });
  }
  window.renderMoreTests = renderMoreTests;

  // ---------------------------------------------------------------
  // 6) 언어 전환 (.lang-switch). 고르면 그 선택을 기억한다(lang_pref) — 그 뒤로는 지역 자동 이동을 하지 않는다.
  // ---------------------------------------------------------------
  function initLangSwitch() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang-switch select'), function (sel) {
      sel.addEventListener('change', function () {
        var opt = sel.options[sel.selectedIndex];
        if (!opt) return;
        var code = opt.getAttribute('data-hreflang');
        savePref(code);
        // 공유 링크(#d=..., ?s=...)처럼 주소에 상태가 있으면 다른 언어 페이지로도 그대로 넘긴다
        var url = opt.value;
        if (window.location.search && url.indexOf('?') === -1) url += window.location.search;
        if (window.location.hash && window.location.hash.length > 1 && url.indexOf('#') === -1) url += window.location.hash;
        if (window.track) window.track('lang_' + code);
        window.location.href = url;
      });
    });
  }

  // ---------------------------------------------------------------
  // init
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // 별점 위젯: <div data-mg-rating="사이트id"></div> (값이 비면 현재 사이트)
  // 별 5개 + "★ 4.6 · 123명 평가 · 1,234명 참여". 누르면 Supabase(app_ratings)에 저장된다.
  // 결과 화면이 나중에 생기는 앱은 window.renderRating(el) 또는 window.initRatings() 를 부른다.
  // ---------------------------------------------------------------
  function fmtN(n) { try { return Number(n).toLocaleString(LANG); } catch (e) { return String(n); } }
  function fill(str, map) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  window.mgFormat = { num: fmtN, fill: fill };

  // 하트 버튼: 여러 번 누를 수 있다. 같은 앱·같은 IP 는 30초 안에 다시 세지 않는다(서버 판정).
  // <button data-mg-heart="사이트id"></button> 또는 별점 위젯 안에 자동으로 들어간다.
  function heartButton(site, initial) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mg-heart';
    btn.setAttribute('aria-label', t('heartAria'));
    var icon = document.createElement('span');
    icon.className = 'mg-heart-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '♥';
    var num = document.createElement('span');
    num.className = 'mg-heart-num';
    btn.appendChild(icon);
    btn.appendChild(num);
    var count = typeof initial === 'number' ? initial : null;
    function show() {
      num.textContent = count == null ? '' : fmtN(count);
      btn.title = count == null ? t('heartAria') : fill(t('heartCount'), { n: fmtN(count) });
    }
    btn.setCount = function (n) { count = n; show(); };
    btn.addEventListener('click', function () {
      btn.classList.remove('is-pop');
      void btn.offsetWidth; // 애니메이션 다시 시작
      btn.classList.add('is-pop');
      btn.classList.add('is-on');
      if (window.track) window.track('heart');
      if (!window.supa || !window.supa.enabled()) return;
      window.supa.heart(site).then(function (r) {
        if (!r) return;
        count = r.hearts;
        show(); // 30초 안에 다시 누르면 서버가 세지 않을 뿐, 따로 안내하지 않는다
      });
    });
    show();
    return btn;
  }
  function renderHeart(el, site) {
    site = site || el.getAttribute('data-mg-heart') || currentSiteId();
    if (!site || el.getAttribute('data-mg-ready')) return;
    el.setAttribute('data-mg-ready', '1');
    var btn = heartButton(site);
    el.appendChild(btn);
    if (window.supa && window.supa.enabled()) {
      window.supa.summary().then(function (m) { btn.setCount(m && m[site] ? m[site].hearts : 0); });
    }
  }
  window.renderHeart = renderHeart;

  // 공유 데이터: 앱마다 window.setShareData({ title, text, url }) 또는 함수(→ 객체/Promise)를 등록한다.
  // 등록이 없으면 페이지 제목·설명·canonical 을 쓴다.
  var shareProvider = null;
  window.setShareData = function (objOrFn) { shareProvider = objOrFn; };
  function getShareData() {
    var d = typeof shareProvider === 'function' ? shareProvider() : shareProvider;
    return Promise.resolve(d).then(function (v) {
      v = v || {};
      var desc = document.querySelector('meta[name="description"]');
      var canon = document.querySelector('link[rel="canonical"]');
      return {
        title: v.title || document.title,
        text: v.text != null ? v.text : (desc ? desc.getAttribute('content') : ''),
        url: v.url || window.location.href || (canon ? canon.href : '')
      };
    });
  }
  window.getShareData = getShareData;

  function shareRow() {
    var row = document.createElement('div');
    row.className = 'mg-share';
    function btn(kind, label, onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mg-share-btn mg-share-' + kind;
      b.textContent = label;
      if (kind !== 'native' && kind !== 'copy') b.setAttribute('aria-label', fill(t('shareAria'), { name: label }));
      b.addEventListener('click', function () {
        if (window.track) window.track('share_' + kind);
        onClick();
      });
      row.appendChild(b);
      return b;
    }
    function openWin(url) { window.open(url, '_blank', 'noopener,noreferrer,width=600,height=560'); }
    btn('native', t('shareNative'), function () { getShareData().then(share); });
    btn('copy', t('shareCopy'), function () { getShareData().then(function (d) { copyLink(d.url); }); });
    btn('x', t('shareX'), function () { getShareData().then(function (d) { openWin(shareTwitterUrl(d)); }); });
    btn('fb', t('shareFb'), function () { getShareData().then(function (d) { openWin(shareFacebookUrl(d)); }); });
    btn('line', t('shareLine'), function () {
      getShareData().then(function (d) {
        openWin('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(d.url) + '&text=' + encodeURIComponent(d.text || d.title));
      });
    });
    return row;
  }

  function renderRating(el, site) {
    site = site || el.getAttribute('data-mg-rating') || currentSiteId();
    if (!site || el.getAttribute('data-mg-ready')) return;
    el.setAttribute('data-mg-ready', '1');
    el.classList.add('mg-rating');
    var key = 'mg_rated_' + site;
    var mine = 0;
    try { mine = parseInt(localStorage.getItem(key), 10) || 0; } catch (e) { /* noop */ }
    var cur = { plays: 0, avg: null, votes: 0 };

    var title = document.createElement('p');
    title.className = 'mg-rating-title';
    title.textContent = t('rateTitle');
    var stars = document.createElement('div');
    stars.className = 'mg-rating-stars';
    stars.setAttribute('role', 'radiogroup');
    stars.setAttribute('aria-label', t('rateTitle'));
    var meta = document.createElement('p');
    meta.className = 'mg-rating-meta';

    var btns = [];
    function paint(n) {
      btns.forEach(function (b, i) {
        b.classList.toggle('is-on', i < n);
        b.setAttribute('aria-checked', i + 1 === mine ? 'true' : 'false');
      });
    }
    function showMeta() {
      var parts = [];
      // 단수형(rateMetaOne/playedByOne)이 있는 언어만 1일 때 바꾼다
      var rk = cur.votes === 1 && S.rateMetaOne ? 'rateMetaOne' : 'rateMeta';
      var pk = cur.plays === 1 && S.playedByOne ? 'playedByOne' : 'playedBy';
      parts.push(cur.votes ? fill(t(rk), { avg: (cur.avg || 0).toFixed(1), votes: fmtN(cur.votes) }) : t('rateFirst'));
      if (cur.plays) parts.push(fill(t(pk), { n: fmtN(cur.plays) }));
      if (mine) parts.push(fill(t('rateYours'), { n: mine }));
      meta.textContent = parts.join(' · ');
    }
    function choose(n) {
      var first = !mine;
      mine = n;
      try { localStorage.setItem(key, String(n)); } catch (e) { /* noop */ }
      paint(n);
      showMeta();
      toast(t('rateThanks'));
      if (window.track) window.track('rate_' + n);
      if (window.supa) {
        window.supa.rate(site, n).then(function (r) {
          if (r) { cur.avg = Number(r.avg_stars); cur.votes = Number(r.votes); }
          else if (first) { cur.votes += 1; }
          showMeta();
        });
      }
    }
    for (var i = 1; i <= 5; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mg-star';
        b.textContent = '★';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', fill(t('starLabel'), { n: n }));
        b.addEventListener('click', function () { choose(n); });
        b.addEventListener('mouseenter', function () { paint(n); });
        b.addEventListener('focus', function () { paint(n); });
        btns.push(b);
        stars.appendChild(b);
      })(i);
    }
    stars.addEventListener('mouseleave', function () { paint(mine); });

    var heart = heartButton(site);
    var row = document.createElement('div');
    row.className = 'mg-rating-row';
    row.appendChild(stars);
    row.appendChild(heart);

    el.innerHTML = '';
    el.appendChild(title);
    el.appendChild(row);
    el.appendChild(meta);
    if (el.hasAttribute('data-mg-social')) el.appendChild(shareRow());
    paint(mine);
    showMeta();
    if (window.supa && window.supa.enabled()) {
      window.supa.summary().then(function (m) {
        heart.setCount(m && m[site] ? m[site].hearts : 0);
        if (m && m[site]) { cur = m[site]; showMeta(); }
      });
    }
  }
  // ---------------------------------------------------------------
  // 끝 화면 공통 컴포넌트: 앱 결과 바로 아래에 <div data-mg-end="사이트id"></div>
  //   ① 별점 + 하트  ② 광고  ③ 공유(링크 복사·X·Instagram·TikTok·Facebook·메신저)  ④ 자주 묻는 질문  ⑤ 다시 하기  ⑥ 다른 미니앱
  // 자주 묻는 질문은 끝 화면에서만 보여준다: 생성기가 G.scriptJson('MG_FAQ', [{ q, a }, ...]) 로 넣거나 window.setFaq([...]).
  // (스포일러 금지 — 질문·결과를 인용하지 않는 짧은 안내만)
  // 메신저는 페이지 언어로 고른다: ko → 카카오톡, ja·th → LINE, 그 밖(en·zh·fr·de·vi·es·it·pt) → WhatsApp.
  // 공유 내용: window.setShareData(...), 다시 하기: window.setRetry(fn | url | { label, action }).
  // ---------------------------------------------------------------
  var retryAction = null;
  function faqBlock(items) {
    var sec = document.createElement('section');
    sec.className = 'mg-end-faq';
    if (!items || !items.length) { sec.hidden = true; return sec; }
    var h = document.createElement('p');
    h.className = 'mg-end-h';
    h.textContent = t('faqTitle');
    sec.appendChild(h);
    items.forEach(function (it) {
      if (!it || !it.q) return;
      var d = document.createElement('details');
      d.className = 'mg-faq';
      var sm = document.createElement('summary');
      sm.textContent = it.q;
      var a = document.createElement('p');
      a.textContent = it.a || '';
      d.appendChild(sm);
      d.appendChild(a);
      d.addEventListener('toggle', function () { if (d.open && window.track) window.track('faq_open'); });
      sec.appendChild(d);
    });
    return sec;
  }
  window.setFaq = function (items) {
    window.MG_FAQ = items;
    Array.prototype.forEach.call(document.querySelectorAll('.mg-end-faq'), function (old) {
      old.parentNode.replaceChild(faqBlock(items), old);
    });
  };
  window.setRetry = function (v) {
    retryAction = v;
    if (v && typeof v === 'object' && v.label) {
      Array.prototype.forEach.call(document.querySelectorAll('.mg-end-retry'), function (b) { b.textContent = v.label; });
    }
  };

  var ICONS = {
    copy: '<path d="M10 14a4 4 0 0 1 0-5.7l2.8-2.8a4 4 0 0 1 5.7 5.7l-1.4 1.4M14 10a4 4 0 0 1 0 5.7l-2.8 2.8a4 4 0 0 1-5.7-5.7l1.4-1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    x: '<path d="M4 4l16 16M20 4L4 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.5 2.6 2.2 4.3 5 4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    fb: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5H17.7V4.4A21 21 0 0 0 15.3 4.3c-2.4 0-4 1.4-4 4.1v2.1H8.6v3h2.7V21" fill="currentColor"/>',
    kakao: '<path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 5.9l-.9 3.3c-.1.3.3.6.6.4l3.9-2.6c.4 0 .8.1 1.2.1 5 0 9-3.1 9-7s-4-7.1-9-7.1z" fill="currentColor"/>',
    line: '<path d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.6 3.2 6.6 7.5 7.1.3.1.7.2.8.5.1.2 0 .6 0 .9l-.1.8c0 .2-.2.9.8.5s5.4-3.2 7.4-5.5C20.8 13.6 21 12.2 21 10.7c0-4-4-7.2-9-7.2z" fill="currentColor"/>',
    whatsapp: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8.5c.3 2.9 2.6 5.3 5.5 5.9l1.2-1.2-1.8-.9-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.9-1.8z" fill="currentColor"/>'
  };
  function icon(name) {
    return '<svg class="mg-sico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  function messenger() {
    if (LANG === 'ko') return 'kakao';
    if (LANG === 'ja' || LANG === 'th') return 'line';
    return 'whatsapp';
  }
  function openWin(url) { window.open(url, '_blank', 'noopener,noreferrer,width=600,height=640'); }
  // 웹 공유 주소가 없는 앱(Instagram·TikTok·카카오톡): 휴대폰 공유 시트 → 없으면 링크 복사 + 안내
  function viaSheetOrCopy(appName) {
    getShareData().then(function (d) {
      if (navigator.share) { navigator.share({ title: d.title, text: d.text, url: d.url }).catch(function () {}); return; }
      copyText(d.text ? d.text + '\n' + d.url : d.url, fill(t('shareGuide'), { app: appName }));
    });
  }
  function copyText(text, msg) {
    var done = function () { toast(msg || t('copied')); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    else fallbackCopy(text, done);
  }
  function kakaoShare() {
    // 카카오 JavaScript 키가 설정되면 정식 카카오톡 공유, 없으면 공유 시트/복사
    var key = CFG.KAKAO_JS_KEY;
    if (!key) { viaSheetOrCopy(t('shareKakao')); return; }
    function send() {
      getShareData().then(function (d) {
        try {
          if (!window.Kakao.isInitialized()) window.Kakao.init(key);
          window.Kakao.Share.sendDefault({ objectType: 'text', text: (d.text || d.title).slice(0, 190), link: { mobileWebUrl: d.url, webUrl: d.url } });
        } catch (e) { viaSheetOrCopy(t('shareKakao')); }
      });
    }
    if (window.Kakao) { send(); return; }
    var sc = document.createElement('script');
    sc.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
    sc.onload = send;
    sc.onerror = function () { viaSheetOrCopy(t('shareKakao')); };
    document.head.appendChild(sc);
  }
  function endShareRow() {
    var box = document.createElement('div');
    box.className = 'mg-end-share';
    var h = document.createElement('p');
    h.className = 'mg-end-h';
    h.textContent = t('shareTitle');
    box.appendChild(h);
    var row = document.createElement('div');
    row.className = 'mg-share mg-share-6';
    function btn(kind, label, onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mg-share-btn mg-share-' + kind;
      b.innerHTML = icon(kind) + '<span class="mg-share-label"></span>';
      b.querySelector('.mg-share-label').textContent = label;
      b.addEventListener('click', function () { if (window.track) window.track('share_' + kind); onClick(); });
      row.appendChild(b);
    }
    btn('copy', t('shareCopy'), function () { getShareData().then(function (d) { copyText(d.url); }); });
    btn('x', t('shareX'), function () { getShareData().then(function (d) { openWin(shareTwitterUrl(d)); }); });
    btn('instagram', t('shareInstagram'), function () { viaSheetOrCopy(t('shareInstagram')); });
    btn('tiktok', t('shareTiktok'), function () { viaSheetOrCopy(t('shareTiktok')); });
    btn('fb', t('shareFb'), function () { getShareData().then(function (d) { openWin(shareFacebookUrl(d)); }); });
    var m = messenger();
    if (m === 'kakao') btn('kakao', t('shareKakao'), kakaoShare);
    else if (m === 'line') btn('line', t('shareLine'), function () {
      getShareData().then(function (d) { openWin('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(d.url) + '&text=' + encodeURIComponent(d.text || d.title)); });
    });
    else btn('whatsapp', t('shareWhatsapp'), function () {
      getShareData().then(function (d) { openWin('https://wa.me/?text=' + encodeURIComponent((d.text ? d.text + ' ' : '') + d.url)); });
    });
    box.appendChild(row);
    return box;
  }
  function renderEnd(el, site) {
    site = site || el.getAttribute('data-mg-end') || currentSiteId();
    if (!site || el.getAttribute('data-mg-end-ready')) return;
    el.setAttribute('data-mg-end-ready', '1');
    el.classList.add('mg-end');
    el.innerHTML = '';
    // ① 별점 + 하트
    var rate = document.createElement('div');
    rate.setAttribute('data-mg-rating', site);
    el.appendChild(rate);
    renderRating(rate, site);
    // ② 광고 (보일 때 불러오고, 광고가 없으면 자리째 숨김)
    var ad = document.createElement('div');
    ad.className = 'mg-ad';
    el.appendChild(ad);
    observeAd(ad);
    // ③ 공유
    el.appendChild(endShareRow());
    // ④ 자주 묻는 질문
    el.appendChild(faqBlock(window.MG_FAQ));
    // ⑤ 다시 하기
    var retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'mg-end-retry';
    var r = retryAction;
    retry.textContent = (r && typeof r === 'object' && r.label) || el.getAttribute('data-retry-label') || t('retry');
    retry.addEventListener('click', function () {
      if (window.track) window.track('retry');
      var a = retryAction && typeof retryAction === 'object' ? retryAction.action : retryAction;
      if (typeof a === 'function') { a(); return; }
      var href = (typeof a === 'string' && a) || el.getAttribute('data-retry-href');
      if (href) { window.location.href = href; return; }
      window.location.href = window.location.pathname; // 해시·쿼리 없이 처음부터
    });
    el.appendChild(retry);
    // ⑥ 다른 미니앱
    var more = document.createElement('section');
    more.className = 'mg-end-more';
    var mh = document.createElement('p');
    mh.className = 'mg-end-h';
    mh.textContent = t('moreTitle');
    var list = document.createElement('div');
    list.className = 'mg-end-more-list';
    more.appendChild(mh);
    more.appendChild(list);
    el.appendChild(more);
    renderMoreTests(site, list);
  }
  window.renderEnd = renderEnd;

  // <div data-mg-social="사이트id"></div> = 별점 + 하트 + 공유(공통). data-mg-rating 은 공유 없이 별점 + 하트.
  function renderSocial(el, site) { renderRating(el, site || el.getAttribute('data-mg-social')); }
  window.renderSocial = renderSocial;
  function initRatings() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-mg-end]'), function (el) { renderEnd(el); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mg-social]'), function (el) { renderSocial(el); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mg-rating]'), function (el) { renderRating(el); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mg-heart]'), function (el) { renderHeart(el); });
  }
  window.renderRating = renderRating;
  window.initRatings = initRatings;

  function init() {
    initAds();
    initAnalytics();
    initLangSwitch();
    initRatings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
