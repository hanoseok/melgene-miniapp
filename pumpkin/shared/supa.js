/* Supabase 공유 링크/카운터 클라이언트 (supabase-js 없이 PostgREST RPC를 fetch로 부른다).
 * SITE_CONFIG.SUPABASE_URL / SUPABASE_ANON_KEY 가 비어 있으면 모든 함수가 null을 돌려주고,
 * 각 사이트는 기존 URL 해시(#d=) 공유로 그대로 동작한다.
 * 테이블/함수 정의: supabase/migrations/20260926000000_shares.sql
 */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var summaryPromise = null;

  // 로컬 개발(localhost)에서는 운영 DB를 건드리지 않는다: 기본은 꺼짐.
  // 테스트할 때는 node tools/mock-supa.js 를 띄우고 localStorage.mg_supa_url = 'http://localhost:8799'.
  function baseUrl() {
    var h = window.location.hostname;
    if (!h || h === 'localhost' || /^127\./.test(h) || h === '[::1]') {
      try { return localStorage.getItem('mg_supa_url') || ''; } catch (e) { return ''; }
    }
    return cfg.SUPABASE_URL || '';
  }

  // 로컬 mock(localStorage.mg_supa_url)이면 설정 키가 비어 있어도 된다 — mock 은 키를 검사하지 않는다.
  function apiKey() {
    if (cfg.SUPABASE_ANON_KEY) return cfg.SUPABASE_ANON_KEY;
    return baseUrl() && baseUrl() !== (cfg.SUPABASE_URL || '') ? 'local-mock' : '';
  }

  function enabled() {
    return !!(baseUrl() && apiKey());
  }

  function rpc(name, body) {
    if (!enabled()) return Promise.resolve(null);
    var headers = { apikey: apiKey(), 'Content-Type': 'application/json' };
    // 예전 anon 키(JWT)는 Authorization에도 넣는다. 새 publishable 키(sb_publishable_...)는 apikey만 쓴다.
    if (/^eyJ/.test(apiKey())) headers.Authorization = 'Bearer ' + apiKey();
    return fetch(baseUrl().replace(/\/$/, '') + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  }

  window.supa = {
    enabled: enabled,

    // 입력값을 저장하고 짧은 id를 돌려준다. 실패하면 null → 호출하는 쪽은 해시 링크로 대체한다.
    createShare: function (site, payload) {
      var lang = document.documentElement.lang || 'ko';
      return rpc('create_share', { p_site: site, p_lang: lang, p_payload: payload })
        .then(function (id) { return typeof id === 'string' ? id : null; });
    },

    // 짧은 id로 저장된 입력값을 불러온다 (조회수 +1). 없으면 null.
    getShare: function (id) {
      if (!/^[A-Za-z0-9_-]{6,16}$/.test(id || '')) return Promise.resolve(null);
      return rpc('get_share', { p_id: id })
        .then(function (rows) { return rows && rows[0] ? rows[0] : null; });
    },

    // 사이트별 누적 생성 수. 실패하면 null → 숫자를 숨긴다.
    count: function (site) {
      return rpc('share_count', { p_site: site })
        .then(function (n) { return typeof n === 'number' ? n : null; });
    },

    // 하루 합계 통계 +1 (광고 채움·조회수·행동). 응답을 기다리지 않고 페이지를 떠나도 전송되게 keepalive.
    bump: function (kind, site) {
      if (!enabled() || !site) return;
      kind = String(kind || '').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 32);
      if (!kind) return;
      var headers = { apikey: apiKey(), 'Content-Type': 'application/json' };
      if (/^eyJ/.test(apiKey())) headers.Authorization = 'Bearer ' + apiKey();
      try {
        fetch(baseUrl().replace(/\/$/, '') + '/rest/v1/rpc/bump_stat', {
          method: 'POST', headers: headers, keepalive: true,
          body: JSON.stringify({ p_site: site, p_lang: document.documentElement.lang || 'ko', p_kind: kind })
        }).catch(function () {});
      } catch (e) { /* noop */ }
    },

    // 이 브라우저의 임의 id (별점 중복 방지용, 서버에는 md5만 저장된다)
    uid: function () {
      var k = 'mg_uid', v = null;
      try { v = localStorage.getItem(k); } catch (e) { /* noop */ }
      if (!v || !/^[A-Za-z0-9_-]{8,64}$/.test(v)) {
        var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        v = '';
        for (var i = 0; i < 22; i++) v += a.charAt(Math.floor(Math.random() * a.length));
        try { localStorage.setItem(k, v); } catch (e) { /* noop */ }
      }
      return v;
    },

    // 별점 주기(1~5). 다시 주면 바뀐다. → { site_id, avg_stars, votes } 또는 null
    rate: function (site, stars) {
      return rpc('rate_app', { p_site: site, p_voter: window.supa.uid(), p_stars: stars })
        .then(function (rows) { return rows && rows[0] ? rows[0] : null; });
    },

    // 앱별 참여 수·별점 요약 → { <site>: { plays, avg, votes } }. 아직 기록이 없으면 {}, 실패(꺼짐·오류)면 null.
    // 페이지당 한 번만 부른다.
    summary: function () {
      if (!summaryPromise) {
        summaryPromise = rpc('app_summary', {}).then(function (rows) {
          if (!Array.isArray(rows)) return null;
          var map = {};
          (rows || []).forEach(function (r) {
            map[r.site_id] = {
              plays: Number(r.plays) || 0,
              avg: r.avg_stars == null ? null : Number(r.avg_stars),
              votes: Number(r.votes) || 0,
              hearts: Number(r.hearts) || 0,
              score: Number(r.score) || 0 // 인기도 = 하트×10 + 별점 합 + 플레이
            };
          });
          return map;
        });
      }
      return summaryPromise;
    },

    // 플레이(앱에 들어옴) +1 → { plays, counted } 또는 null. 같은 앱·같은 IP 는 30초 안에 다시 세지 않는다(서버 판정).
    play: function (site) {
      return rpc('play_app', { p_site: site }).then(function (rows) {
        return rows && rows[0] ? { plays: Number(rows[0].plays) || 0, counted: !!rows[0].counted } : null;
      });
    },

    // 하트 보내기 → { hearts, counted } 또는 null. 같은 앱·같은 IP 는 30초 안에 다시 세지 않는다(서버 판정).
    heart: function (site) {
      return rpc('heart_app', { p_site: site }).then(function (rows) {
        return rows && rows[0] ? { hearts: Number(rows[0].hearts) || 0, counted: !!rows[0].counted } : null;
      });
    },

    // 투표 (밸런스 게임 등) → [{ option, votes }] (그 질문의 선택지별 합계) 또는 null
    vote: function (poll, qid, opt) {
      return rpc('poll_vote', { p_poll: poll, p_qid: qid, p_opt: opt });
    },
    pollResults: function (poll) {
      return rpc('poll_results', { p_poll: poll });
    },

    // 점수 분포 (반응속도 등). bucket 은 정수 구간(예: 10ms 단위). → [{ score_bucket, players }]
    submitScore: function (game, bucket) {
      return rpc('submit_score', { p_game: game, p_bucket: bucket });
    },
    scoreDistribution: function (game) {
      return rpc('score_distribution', { p_game: game });
    },

    // 현재 페이지 주소에 ?s=<id> 를 붙인 공유 URL
    shareUrl: function (id) {
      var u = new URL(location.href);
      u.hash = '';
      u.search = '?s=' + encodeURIComponent(id);
      return u.toString();
    },

    // 현재 URL의 ?s= 값
    currentShareId: function () {
      try { return new URL(location.href).searchParams.get('s'); } catch (e) { return null; }
    }
  };
})();
