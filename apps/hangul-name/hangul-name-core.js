/* apps/hangul-name/hangul-name-core.js — 내 이름 한글로: 언어 무관 변환 로직 (UMD: 브라우저 window.HANGUL_NAME_CORE + Node 검사 공용)
 *   convert(text) → { ok, input, hangul, roman, words: [{ src, latin, hangul, source, blocks: [{ h, r }] }] } | { ok: false, reason: 'empty' | 'invalid' }
 *   1) 사전(DICT): 자주 쓰는 이름·성 ~250개의 표준 외래어 표기(국립국어원 외래어 표기법 기준, 이름에서 널리 쓰는 표기 우선).
 *   2) 규칙: 그 밖의 라틴 글자 → 발음 단위(자음·모음·반모음)로 나누고 → 한글 음절(0xAC00 + (L*21+V)*28+T)로 조립.
 *      키릴 문자 → 먼저 라틴 글자로 옮긴 뒤(cyrToLatin) 소리 나는 대로 규칙(ph 모드). 일본어 가나 → 가나 표(일본어 표기법). 한글 → 그대로.
 *   결과는 언제나 같다(무작위 없음). 어떤 입력에도 예외를 던지지 않는다. 입력은 40자까지.
 *   모든 계산은 이 브라우저 안에서만 한다(이름을 서버로 보내지 않음).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HANGUL_NAME_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_INPUT = 40;
  var STYLES = ['brush', 'cute', 'bold', 'classic'];
  // 이름 카드 글꼴 (한글 글리프가 있는 Google Fonts — unicode-range 조각이라 쓰는 글자만 내려받는다)
  var CARD_FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gaegu:wght@700&family=Nanum+Brush+Script&family=Nanum+Myeongjo:wght@800&display=swap';
  var CARD_FONTS = {
    brush: { family: 'Nanum Brush Script', weight: 400 },
    cute: { family: 'Gaegu', weight: 700 },
    bold: { family: 'Black Han Sans', weight: 400 },
    classic: { family: 'Nanum Myeongjo', weight: 800 }
  };

  // ------------------------------------------------------------------ 한글 음절
  // 초성 19: ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ / 중성 21: ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ / 종성 28
  var ROM_L = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
  var ROM_V = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
  var ROM_T = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
  var V = { a: 0, ae: 1, ya: 2, yae: 3, eo: 4, e: 5, yeo: 6, ye: 7, o: 8, wa: 9, wae: 10, oe: 11, yo: 12, u: 13, wo: 14, we: 15, wi: 16, yu: 17, eu: 18, ui: 19, i: 20 };
  var IEUNG = 11;
  // 발음 단위 → 초성
  var ONSET = { p: 17, b: 7, t: 16, d: 3, k: 15, g: 0, f: 17, v: 7, s: 9, z: 12, sh: 9, j: 12, ch: 14, h: 18, m: 6, n: 2, l: 5, r: 5, th: 9, ts: 14, ng: IEUNG };
  // 받침으로 쓸 수 있는 소리 (외래어 표기법: 받침은 ㄱㄴㄹㅁㅂㅅㅇ 만)
  var SONORANT_T = { m: 16, n: 4, ng: 21, l: 8 };
  var STOP_T = { p: 17, t: 19, k: 1 };

  function syl(L, Vi, T) { return String.fromCharCode(0xAC00 + (L * 21 + Vi) * 28 + (T || 0)); }
  function isSyllable(ch) { var c = String(ch).charCodeAt(0); return String(ch).length === 1 && c >= 0xAC00 && c <= 0xD7A3; }
  function romanizeBlock(ch) {
    if (!isSyllable(ch)) return '';
    var c = ch.charCodeAt(0) - 0xAC00;
    return ROM_L[Math.floor(c / 588)] + ROM_V[Math.floor((c % 588) / 28)] + ROM_T[c % 28];
  }
  // 음절마다 로마자 (앞 음절 받침이 ㄹ 이면 이 음절의 첫소리 ㄹ 은 l: 올리비아 ol-li-bi-a)
  function blocksOf(h) {
    var prevT = 0;
    return Array.from(h).filter(isSyllable).map(function (ch) {
      var c = ch.charCodeAt(0) - 0xAC00;
      var r = romanizeBlock(ch);
      if (prevT === 8 && Math.floor(c / 588) === 5) r = 'l' + r.slice(1);
      prevT = c % 28;
      return { h: ch, r: r };
    });
  }

  // ------------------------------------------------------------------ 사전 (소문자 라틴 글자 키 → 한글)
  var DICT = {
    // 남자 이름
    john: '존', james: '제임스', michael: '마이클', david: '데이비드', william: '윌리엄', robert: '로버트', richard: '리처드',
    joseph: '조지프', thomas: '토머스', charles: '찰스', christopher: '크리스토퍼', daniel: '대니얼', matthew: '매슈',
    anthony: '앤서니', mark: '마크', paul: '폴', steven: '스티븐', stephen: '스티븐', andrew: '앤드루', kevin: '케빈',
    brian: '브라이언', george: '조지', edward: '에드워드', ryan: '라이언', jacob: '제이컵', ethan: '이선', noah: '노아',
    liam: '리엄', lucas: '루카스', mason: '메이슨', logan: '로건', oliver: '올리버', elijah: '일라이자', aiden: '에이든',
    jack: '잭', henry: '헨리', alexander: '알렉산더', sebastian: '세바스티안', benjamin: '벤저민', samuel: '새뮤얼',
    leo: '레오', luke: '루크', adam: '애덤', peter: '피터', harry: '해리', oscar: '오스카', max: '맥스', alex: '알렉스',
    eric: '에릭', tom: '톰', tim: '팀', sam: '샘', nick: '닉', ben: '벤', josh: '조시', joshua: '조슈아', nathan: '네이선',
    jason: '제이슨', justin: '저스틴', brandon: '브랜던', tyler: '타일러', dylan: '딜런', aaron: '에런', adrian: '에이드리언',
    patrick: '패트릭', simon: '사이먼', martin: '마틴', victor: '빅터', hugo: '휴고', felix: '펠릭스', jonathan: '조너선',
    kyle: '카일', sean: '숀', shawn: '숀', ian: '이언', owen: '오언', connor: '코너', isaac: '아이작', gabriel: '가브리엘',
    raphael: '라파엘', theo: '테오', julian: '줄리언', kai: '카이', arthur: '아서', jake: '제이크', mike: '마이크',
    chris: '크리스', steve: '스티브', tony: '토니', neil: '닐', keith: '키스', hugh: '휴', rene: '르네', carlos: '카를로스',
    juan: '후안', jose: '호세', luis: '루이스', miguel: '미겔', javier: '하비에르', pablo: '파블로', diego: '디에고',
    alejandro: '알레한드로', antonio: '안토니오', jorge: '호르헤', felipe: '펠리페', marco: '마르코', giuseppe: '주세페',
    luca: '루카', francesco: '프란체스코', matteo: '마테오', lorenzo: '로렌초', dante: '단테', pierre: '피에르', jean: '장',
    louis: '루이', francois: '프랑수아', antoine: '앙투안', nicolas: '니콜라', hans: '한스', klaus: '클라우스',
    stefan: '슈테판', jonas: '요나스', ivan: '이반', dmitri: '드미트리', dmitry: '드미트리', dmitriy: '드미트리',
    sergei: '세르게이', sergey: '세르게이', alexei: '알렉세이', aleksei: '알렉세이', aleksey: '알렉세이',
    aleksandr: '알렉산드르', vladimir: '블라디미르', mohammed: '무함마드', muhammad: '무함마드', mohammad: '무함마드',
    mohamed: '무함마드', ahmed: '아흐메드', ali: '알리', omar: '오마르', hassan: '하산', yusuf: '유수프', ibrahim: '이브라힘',
    raj: '라즈', arjun: '아르준', rahul: '라훌', wei: '웨이', hiroshi: '히로시', kenji: '겐지', takumi: '다쿠미',
    haruto: '하루토', yuki: '유키', minh: '민', somchai: '솜차이', xavier: '사비에르',
    // 여자 이름
    mary: '메리', patricia: '퍼트리샤', jennifer: '제니퍼', linda: '린다', elizabeth: '엘리자베스', barbara: '바버라',
    susan: '수전', jessica: '제시카', sarah: '세라', karen: '캐런', lisa: '리사', nancy: '낸시', emily: '에밀리',
    emma: '엠마', olivia: '올리비아', sophia: '소피아', sofia: '소피아', sophie: '소피', isabella: '이사벨라', ava: '에이바',
    mia: '미아', amelia: '아멜리아', charlotte: '샬럿', harper: '하퍼', evelyn: '에벌린', abigail: '애비게일', ella: '엘라',
    grace: '그레이스', chloe: '클로이', lily: '릴리', hannah: '해나', anna: '안나', ana: '아나', maria: '마리아',
    mariya: '마리야', marie: '마리', julia: '줄리아', laura: '로라', lucy: '루시', alice: '앨리스', zoe: '조이', ellie: '엘리',
    rachel: '레이철', rebecca: '레베카', amanda: '어맨다', ashley: '애슐리', megan: '메건', nicole: '니콜',
    stephanie: '스테퍼니', natalie: '내털리', victoria: '빅토리아', michelle: '미셸', kate: '케이트', katherine: '캐서린',
    catherine: '캐서린', amy: '에이미', anne: '앤', jane: '제인', helen: '헬렌', diana: '다이애나', claire: '클레어',
    eva: '에바', elena: '엘레나', yelena: '옐레나', lucia: '루시아', valentina: '발렌티나', camila: '카밀라',
    isabel: '이사벨', carmen: '카르멘', lea: '레아', manon: '마농', camille: '카미유', chiara: '키아라', giulia: '줄리아',
    francesca: '프란체스카', leonie: '레오니', anastasia: '아나스타시야', anastasiya: '아나스타시야', natasha: '나타샤',
    olga: '올가', tatiana: '타티야나', tatyana: '타티야나', svetlana: '스베틀라나', ekaterina: '예카테리나',
    yekaterina: '예카테리나', natalia: '나탈리야', natalya: '나탈리야', fatima: '파티마', aisha: '아이샤', layla: '레일라',
    priya: '프리야', ananya: '아나냐', mei: '메이', sakura: '사쿠라', yui: '유이', hana: '하나', aoi: '아오이', linh: '린',
    mai: '마이', emilia: '에밀리아', jasmine: '재스민', rose: '로즈', ruby: '루비', ivy: '아이비', luna: '루나',
    stella: '스텔라', aurora: '오로라', nora: '노라', penelope: '퍼넬러피', scarlett: '스칼릿', madison: '매디슨',
    jordan: '조던', morgan: '모건', riley: '라일리', bella: '벨라', sara: '사라', jenny: '제니', heidi: '하이디', wyatt: '와이엇', walter: '월터', mcdonald: '맥도널드', gordon: '고든', harrison: '해리슨', margot: '마르고', hazel: '헤이즐', jasper: '재스퍼', violet: '바이올렛',
    // 성
    smith: '스미스', johnson: '존슨', williams: '윌리엄스', brown: '브라운', jones: '존스', miller: '밀러', davis: '데이비스',
    wilson: '윌슨', anderson: '앤더슨', taylor: '테일러', moore: '무어', jackson: '잭슨', white: '화이트', harris: '해리스',
    thompson: '톰프슨', garcia: '가르시아', martinez: '마르티네스', rodriguez: '로드리게스', hernandez: '에르난데스',
    lopez: '로페스', gonzalez: '곤살레스', perez: '페레스', sanchez: '산체스', fernandez: '페르난데스', gomez: '고메스',
    diaz: '디아스', torres: '토레스', ramirez: '라미레스', flores: '플로레스', clark: '클라크', lewis: '루이스', walker: '워커',
    hall: '홀', young: '영', king: '킹', wright: '라이트', scott: '스콧', green: '그린', baker: '베이커', adams: '애덤스',
    nelson: '넬슨', hill: '힐', campbell: '캠벨', mitchell: '미첼', roberts: '로버츠', carter: '카터', evans: '에번스',
    turner: '터너', parker: '파커', collins: '콜린스', murphy: '머피', cook: '쿡', kelly: '켈리', rossi: '로시', russo: '루소',
    ferrari: '페라리', bianchi: '비안키', romano: '로마노', muller: '뮐러', mueller: '뮐러', schmidt: '슈미트',
    schneider: '슈나이더', fischer: '피셔', weber: '베버', meyer: '마이어', wagner: '바그너', becker: '베커',
    dubois: '뒤부아', bernard: '베르나르', moreau: '모로', laurent: '로랑', dupont: '뒤퐁', silva: '실바', santos: '산투스',
    oliveira: '올리베이라', souza: '소자', costa: '코스타', pereira: '페레이라', ferreira: '페헤이라', ivanov: '이바노프',
    petrov: '페트로프', smirnov: '스미르노프', nguyen: '응우옌', tran: '쩐', pham: '팜', tanaka: '다나카', suzuki: '스즈키',
    sato: '사토', takahashi: '다카하시', watanabe: '와타나베', yamamoto: '야마모토', nakamura: '나카무라',
    kobayashi: '고바야시', wang: '왕', zhang: '장', liu: '류', chen: '천', yang: '양', huang: '황', zhao: '자오', wu: '우',
    patel: '파텔', singh: '싱', kumar: '쿠마르', sharma: '샤르마', khan: '칸', cohen: '코언', jensen: '옌센', hansen: '한센',
    nielsen: '닐센', andersson: '안데르손', johansson: '요한손', kowalski: '코발스키', novak: '노바크', yilmaz: '일마즈',
    lee: '리', li: '리',
    // 로마자로 쓴 한국 성 — 원래 한글로
    kim: '김', park: '박', choi: '최', jung: '정', kang: '강', cho: '조', yoon: '윤', jang: '장', lim: '임', han: '한',
    shin: '신', song: '송', kwon: '권', hwang: '황', ahn: '안', oh: '오', seo: '서', yoo: '유', moon: '문', bae: '배'
  };

  // ------------------------------------------------------------------ 글자 정리
  function clean(s) {
    var t = String(s == null ? '' : s);
    try { t = t.normalize('NFC'); } catch (e) { /* 오래된 브라우저 */ }
    t = Array.from(t).map(function (ch) { var c = ch.codePointAt(0); return c < 32 || (c >= 127 && c < 160) || (c >= 0x200b && c <= 0x200f) || (c >= 0x2028 && c <= 0x202e) || (c >= 0x2060 && c <= 0x206f) || c === 0xfeff ? ' ' : ch; }).join('').replace(/\s+/g, ' ').trim();
    return Array.from(t).slice(0, MAX_INPUT).join('').trim();
  }
  // 라틴 글자 → 사전·규칙용 키 (악센트 제거, 소문자 a-z 만)
  function latinKey(s) {
    var t = String(s).replace(/ß/g, 'ss').replace(/[æÆ]/g, 'ae').replace(/[øØ]/g, 'o').replace(/[œŒ]/g, 'oe')
      .replace(/[łŁ]/g, 'l').replace(/[đĐðÐ]/g, 'd').replace(/[þÞ]/g, 'th').replace(/ı/g, 'i')
      .replace(/[ñÑ]/g, 'ny').replace(/[çÇ]/g, 's');
    try { t = t.normalize('NFD'); } catch (e) { /* noop */ }
    return t.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  }

  // ------------------------------------------------------------------ 키릴 → 라틴
  var CYR = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g', 'ў': 'u'
  };
  function cyrToLatin(word) {
    var out = '';
    var chars = Array.from(String(word).toLowerCase());
    for (var i = 0; i < chars.length; i++) {
      var c = chars[i];
      if (c === 'е') {
        var prev = i ? chars[i - 1] : '';
        out += (!prev || /[аеёиоуыэюяіїєъь]/.test(prev)) ? 'ye' : 'e';
      } else if ((c === 'ь' || c === 'ъ') && /[яюёеиі]/.test(chars[i + 1] || '')) {
        out += 'i'; // Наталья → Nataliya 나탈리야
        if (chars[i + 1] === 'е') { out += 'ye'; i++; }
      } else if (Object.prototype.hasOwnProperty.call(CYR, c)) out += CYR[c];
    }
    return out;
  }
  function capWord(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  // ------------------------------------------------------------------ 규칙: 라틴 글자 → 발음 단위
  // 단위: { c: 자음 } | { v: 모음 번호, short: 짧은 모음? } | { g: 'w' | 'y' } (반모음)
  // mode 'en' = 영어식 이름 규칙(묵음 e, r 생략, 짧은 모음 뒤 p·t·k 받침…), 'ph' = 소리 나는 대로(키릴 문자에서 옮긴 글)
  var VOW = 'aeiou';
  function isVowelCh(c) { return !!c && VOW.indexOf(c) >= 0; }

  function tokenize(word, mode) {
    var en = mode === 'en';
    var s = word;
    var magic = -1;
    if (en) {
      s = s.replace(/^mc(?=[a-z])/, 'mac').replace(/aa/g, 'a').replace(/^kn/, 'n').replace(/^wr/, 'r').replace(/^ps/, 's').replace(/^pn/, 'n').replace(/mb$/, 'm').replace(/gh$/, '').replace(/gn$/, 'n');
      // 묵음 e: 자음 + e 로 끝나고 앞에 다른 모음이 있으면 e 는 읽지 않는다 (Kate, Mike, Nicole)
      if (s.length >= 3 && s.charAt(s.length - 1) === 'e' && !isVowelCh(s.charAt(s.length - 2)) && s.charAt(s.length - 2) !== 'y' && /[aeiouy]/.test(s.slice(0, -2))) {
        var stem = s.slice(0, -1);
        if (/c$/.test(stem)) stem = stem.slice(0, -1) + 's';
        else if (/g$/.test(stem) && !/ng$/.test(stem)) stem = stem.slice(0, -1) + 'j';
        // 모음 하나 + 자음 하나 + e (한 음절 말) → 긴 모음 (Kate 케이트, Mike 마이크, Steve 스티브)
        var m = /^[^aeiouy]*([aeiouy])[^aeiouy]$/.exec(stem);
        if (m) magic = stem.indexOf(m[1]);
        s = stem;
      }
    } else {
      s = s.replace(/shch/g, 'sh').replace(/iy$/, 'i');
      s = s.replace(/zh$/, 'sh').replace(/([bvdgz])$/, function (c) { return { b: 'p', v: 'f', d: 't', g: 'k', z: 's' }[c]; });
    }
    var n = s.length;
    // 로망스어처럼 a·i·o 로 끝나는 이름은 r 을 읽는다 (Leonardo 레오나르도, Carla 카를라, Marta 마르타)
    var rKeep = !en || /[aio]$/.test(s);
    // 모음 덩어리 수 (ㅐ 규칙용: 한 음절 영어 이름)
    var groups = (s.replace(/^y(?=[aeiou])/, '').match(/[aeiouy]+/g) || []).length;
    var U = [];
    var i = 0;
    function at(k) { return k < n && k >= 0 ? s.charAt(k) : ''; }
    function vowelAt(k) { var c = at(k); return isVowelCh(c) || (c === 'y' && !isVowelCh(at(k + 1))); }
    function C(c) { U.push({ c: c }); }
    function Vw(v, short) { U.push({ v: v, short: !!short }); }
    function Gl(g) { U.push({ g: g }); }

    while (i < n) {
      var ch = at(i);
      var r2 = s.substr(i, 2);
      var r3 = s.substr(i, 3);
      // ---------------- 모음
      if (isVowelCh(ch) || (ch === 'y' && i > 0 && !isVowelCh(at(i + 1)))) {
        var nxt = at(i + 1);
        var after = at(i + 2);
        if (en && r3 === 'eau') { Vw(V.o); i += 3; continue; }
        if (en && (r2 === 'au' || r2 === 'aw')) { Vw(V.o); i += 2; continue; }
        if ((r2 === 'ai' || r2 === 'ay') && !(r2 === 'ay' && isVowelCh(after))) {
          if (en) { Vw(V.e); Vw(V.i); } else { Vw(V.a); Gl('y'); if (!isVowelCh(after)) U[U.length - 1] = { v: V.i, short: false }; }
          i += 2; continue;
        }
        if (r2 === 'ey' && !isVowelCh(after)) {
          if (en && i + 2 === n) Vw(V.i); else { Vw(V.e); Vw(V.i); }
          i += 2; continue;
        }
        if ((r2 === 'oy' || r2 === 'uy') && !isVowelCh(after)) { Vw(ch === 'o' ? V.o : V.u); Vw(V.i); i += 2; continue; }
        if (en) {
          if (r2 === 'ei') { Vw(V.e); Vw(V.i); i += 2; continue; }
          if (r2 === 'oi') { Vw(V.o); Vw(V.i); i += 2; continue; }
          if (r2 === 'ee') { Vw(V.i); i += 2; continue; }
          if (r2 === 'ea' && after && !isVowelCh(after) && after !== 'h' && after !== 'r' && !/[aeiouy]/.test(s.slice(i + 3))) { Vw(V.i); i += 2; continue; }
          if (r2 === 'ie' && i + 2 === n) { Vw(V.i); i += 2; continue; }
          if (r2 === 'oo' || r2 === 'ou') { Vw(V.u); i += 2; continue; }
          if (r2 === 'ow' && !isVowelCh(after)) { Vw(V.o); i += 2; continue; }
          if (r2 === 'oe' && i + 2 === n) { Vw(V.o); i += 2; continue; }
          if (r2 === 'ue' && i + 2 === n) { Vw(V.u); i += 2; continue; }
          if (r2 === 'ew') {
            var pc = U.length && U[U.length - 1].c;
            if (pc === 'r' || pc === 'l' || pc === 'j' || pc === 'ch') Vw(V.u); else { Gl('y'); Vw(V.u); }
            i += 2; continue;
          }
          if (r2 === 'eu' && i === 0) { Gl('y'); Vw(V.u); i += 2; continue; } // Eugene 유진
          // r 소리가 붙은 모음: 뒤에 모음이 없으면 r 은 읽지 않는다 (영국식: Peter 피터, Carter 카터)
          if (!rKeep && nxt === 'r' && !isVowelCh(after) && after !== 'y' && !(after === 'r' && isVowelCh(at(i + 3))) && ch !== 'y') {
            var j = i + 2;
            while (at(j) === 'r') j++;
            if (ch === 'a') Vw(V.a);
            else if (ch === 'o' && j === n) {
              // 끝의 -or: 약한 소리(Taylor 테일러)면 어, 아니면 오르 (Thor 토르, Igor 이고르)
              if (groups >= 2 && 'lntscy'.indexOf(at(i - 1)) >= 0) Vw(V.eo);
              else { Vw(V.o); C('r'); U[U.length - 1].keep = true; }
            } else if (ch === 'o') Vw(V.o);
            else Vw(V.eo);
            i = j; continue;
          }
        }
        // 홑모음
        if (i === magic) {
          if (ch === 'a') { Vw(V.e); Vw(V.i); }
          else if (ch === 'i' || ch === 'y') { Vw(V.a); Vw(V.i); }
          else if (ch === 'o') Vw(V.o);
          else if (ch === 'e') Vw(V.i);
          else {
            var pu = U.length && U[U.length - 1].c;
            if (pu === 'r' || pu === 'l' || pu === 'j' || pu === 'ch') Vw(V.u); else { Gl('y'); Vw(V.u); }
          }
          i++; continue;
        }
        var closed = !!nxt && !isVowelCh(nxt) && nxt !== 'y' && nxt !== 'w' && nxt !== 'h';
        if (ch === 'a') Vw(en && groups === 1 && closed ? V.ae : V.a, true);
        else if (ch === 'e') Vw(V.e, true);
        else if (ch === 'i' || ch === 'y') Vw(V.i, true);
        else if (ch === 'o') Vw(en && groups >= 2 && i === n - 2 && at(i - 1) === 's' && nxt === 'n' ? V.eu : V.o, true); // Harrison 해리슨
        else Vw(V.u, true);
        i++; continue;
      }
      // ---------------- 반모음 y · w
      // y: 맨 앞이나 모음 뒤에서 모음 앞이면 반모음(Yasmin 야스민, Maya 마야), 자음 뒤면 모음 이(Arya 아리아)
      if (ch === 'y') { if (isVowelCh(at(i + 1)) && (i === 0 || !en || isVowelCh(at(i - 1)))) Gl('y'); else Vw(V.i, true); i++; continue; }
      if (ch === 'w') {
        if (isVowelCh(at(i + 1))) Gl('w');
        else if (!U.length || U[U.length - 1].v == null) Vw(V.u);
        i++; continue;
      }
      // ---------------- 자음 (긴 것부터)
      if (en && r3 === 'sch') { C('sh'); i += 3; continue; }
      if (r3 === 'tch') { C('ch'); i += 3; continue; }
      if (r2 === 'ch') { C(en && (at(i + 2) === 'r' || at(i + 2) === 'l') ? 'k' : 'ch'); i += 2; continue; }
      if (r2 === 'sh') { C('sh'); i += 2; continue; }
      if (r2 === 'zh') { C('j'); i += 2; continue; }
      if (r2 === 'kh') { C('h'); i += 2; continue; }
      if (r2 === 'th') { C(en ? 'th' : 't'); i += 2; continue; }
      if (r2 === 'ph') { C('f'); i += 2; continue; }
      if (r2 === 'gh') { if (!U.length) C('g'); i += 2; continue; }
      if (r2 === 'wh') { if (isVowelCh(at(i + 2))) Gl('w'); i += 2; continue; }
      if (r2 === 'rh') { C('r'); i += 2; continue; }
      if (r2 === 'ck') { C('k'); i += 2; continue; }
      if (r2 === 'qu') { C('k'); if (isVowelCh(at(i + 2))) Gl('w'); i += 2; continue; }
      if (r2 === 'ts' || r2 === 'tz') { C('ts'); i += 2; continue; }
      if (r2 === 'dz') { C('j'); i += 2; continue; }
      if (r2 === 'ng') {
        var a2 = at(i + 2);
        if (en && (a2 === 'e' || a2 === 'i' || a2 === 'y')) { C('n'); i += 1; continue; } // Angela 안젤라
        C('ng');
        i += isVowelCh(a2) || a2 === 'r' || a2 === 'l' ? 1 : 2; // Bingo 빙고 · Ingrid 잉그리드
        continue;
      }
      if (r2 === 'nk') { C('ng'); i += 1; continue; }
      if (ch === 'x') { if (!U.length) C('z'); else { C('k'); C('s'); } i++; continue; }
      if (ch === 'q') { C('k'); i++; continue; }
      if (ch === 'c') { var cn = at(i + 1); C(en && (cn === 'e' || cn === 'i' || cn === 'y') ? 's' : 'k'); i += cn === 'c' ? 2 : 1; continue; }
      if (ch === 'g') { var gn = at(i + 1); C(en && (gn === 'e' || gn === 'i' || gn === 'y') && i > 0 ? 'j' : 'g'); i += gn === 'g' ? 2 : 1; continue; }
      if (ch === 'h') {
        // 모음 뒤에서 모음 앞이 아니면 읽지 않는다 (Sarah 세라, Noah 노아)
        if (isVowelCh(at(i + 1)) || !U.length) C('h');
        i++; continue;
      }
      if ('bdfjklmnprstvz'.indexOf(ch) >= 0) {
        // 겹자음: mm·nn 이 모음 사이면 두 번 (Emma 엠마, Anna 안나), 그 밖엔 한 번
        if (at(i + 1) === ch) {
          if ((ch === 'm' || ch === 'n') && U.length && isVowelCh(at(i + 2))) { C(ch); C(ch); }
          else C(ch);
          i += 2; continue;
        }
        C(ch);
        if (ch === 'r' && rKeep) U[U.length - 1].keep = true;
        i++; continue;
      }
      i++; // 모르는 글자는 건너뛴다
    }
    return U;
  }

  // 반모음 + 모음 → 겹모음
  var GLIDE_W = { 0: V.wa, 1: V.wae, 4: V.wo, 5: V.we, 20: V.wi, 8: V.wo, 13: V.u, 18: V.u };
  var GLIDE_Y = { 0: V.ya, 1: V.yae, 4: V.yeo, 5: V.ye, 8: V.yo, 13: V.yu, 20: V.i, 18: V.i };
  function glide(g, v) { var t = g === 'w' ? GLIDE_W : GLIDE_Y; return t[v] != null ? t[v] : v; }

  // 발음 단위 → 한글 음절
  function assemble(U, mode) {
    var en = mode === 'en';
    var B = [];
    function last() { return B[B.length - 1]; }
    for (var i = 0; i < U.length; i++) {
      var u = U[i];
      if (u.c) {
        var nx = U[i + 1];
        var vi = nx && nx.v != null ? i + 1 : (nx && nx.g && U[i + 2] && U[i + 2].v != null ? i + 2 : -1);
        if (vi >= 0 && u.c !== 'ng') {
          var vv = U[vi].v;
          if (nx.g) {
            vv = glide(nx.g, vv);
          }
          if (u.c === 'sh') vv = glide('y', vv);
          // 모음 사이·자음 뒤의 l → ㄹㄹ (Olivia 올리비아, Clara 클라라)
          if (u.c === 'l' && last() && !last().T) last().T = 8;
          B.push({ L: ONSET[u.c], V: vv, T: 0, open: true, short: U[vi].short });
          i = vi; continue;
        }
        var lb = last();
        var nextC = U[i + 1] && U[i + 1].c ? U[i + 1].c : '';
        var atEnd = i === U.length - 1;
        var vowelBefore = lb && lb.open && !lb.T;
        if (u.c === 'r' && en && vowelBefore && !u.keep) continue; // 모음 뒤 r 생략
        if (SONORANT_T[u.c] != null) {
          if (vowelBefore) { lb.T = SONORANT_T[u.c]; continue; }
          if (u.c === 'ng') { B.push({ L: IEUNG, V: V.eu, T: 21, open: false }); continue; }
        }
        if (STOP_T[u.c] != null && vowelBefore && lb.short && (en || (u.c === 'k' && nextC === 's')) &&
          (atEnd || (nextC && 'lrmn'.indexOf(nextC) < 0 && nextC !== 'ng'))) { lb.T = STOP_T[u.c]; continue; }
        // 남은 자음 → 으 (sh·ch·j 가 끝이면 이, sh 가 자음 앞이면 슈)
        var vw = V.eu;
        if (atEnd && (u.c === 'sh' || u.c === 'ch' || u.c === 'j')) vw = V.i;
        else if (u.c === 'sh') vw = V.u;
        B.push({ L: ONSET[u.c] != null ? ONSET[u.c] : IEUNG, V: vw, T: 0, open: false });
      } else if (u.g) {
        var nv = U[i + 1];
        if (nv && nv.v != null) { B.push({ L: IEUNG, V: glide(u.g, nv.v), T: 0, open: true, short: nv.short }); i++; continue; }
        B.push({ L: IEUNG, V: u.g === 'w' ? V.u : V.i, T: 0, open: true });
      } else {
        B.push({ L: IEUNG, V: u.v, T: 0, open: true, short: u.short });
      }
    }
    return B.map(function (b) { return syl(b.L, b.V, b.T); }).join('');
  }

  function ruleLatin(key, mode) {
    if (!key) return '';
    return assemble(tokenize(key, mode || 'en'), mode || 'en');
  }

  // ------------------------------------------------------------------ 가나 → 한글 (일본어 표기법: 첫 글자 か·た·ち 행은 예사소리, 장음 표기 안 함, ん=ㄴ, っ=ㅅ)
  var KANA = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o', 'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so', 'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no', 'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo', 'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro', 'わ': 'wa', 'ゐ': 'i', 'ゑ': 'e', 'を': 'o',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go', 'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do', 'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po', 'ゔ': 'vu',
    'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o', 'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo', 'ゎ': 'wa'
  };
  var SMALL_Y = { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o' };
  var SMALL_V = { 'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o' };
  function toHira(ch) { var c = ch.charCodeAt(0); return c >= 0x30a1 && c <= 0x30f6 ? String.fromCharCode(c - 0x60) : ch; }
  function romajiSyl(r, first) {
    var vw = r.charAt(r.length - 1);
    var c = r.slice(0, -1);
    var g = '';
    if (c.length > 1 && c.charAt(c.length - 1) === 'y') { g = 'y'; c = c.slice(0, -1); }
    if (c === 'y' || c === 'w') { g = c; c = ''; }
    var vi = { a: V.a, i: V.i, u: V.u, e: V.e, o: V.o }[vw];
    if (vi == null) return null;
    var L;
    switch (c) {
      case '': L = IEUNG; break;
      case 'k': L = first ? 0 : 15; break;
      case 'g': L = 0; break;
      case 's': L = 9; if (vw === 'u') vi = V.eu; break;
      case 'sh': L = 9; vi = glide('y', vi); break;
      case 'z': L = 12; if (vw === 'u') vi = V.eu; break;
      case 'j': L = 12; break;
      case 't': L = first ? 3 : 16; break;
      case 'ch': L = first ? 12 : 14; break;
      case 'ts': L = 10; if (vw === 'u') vi = V.eu; break;
      case 'd': L = 3; break;
      case 'n': L = 2; break;
      case 'h': L = 18; break;
      case 'f': L = vw === 'u' ? 18 : 17; break;
      case 'b': case 'v': L = 7; break;
      case 'p': L = 17; break;
      case 'm': L = 6; break;
      case 'r': L = 5; break;
      default: return null;
    }
    if (g) vi = glide(g, vi);
    return { L: L, V: vi, T: 0, vow: vw };
  }
  function kanaToHangul(run) {
    var chars = Array.from(run).map(toHira);
    var B = [];
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      var lb = B[B.length - 1];
      if (ch === 'ー' || ch === '〜') continue; // 장음은 적지 않는다
      if (ch === 'ん') { if (lb && !lb.T) lb.T = 4; else B.push({ L: IEUNG, V: V.eu, T: 4, vow: 'n' }); continue; }
      if (ch === 'っ') { if (lb && !lb.T && i < chars.length - 1) lb.T = 19; continue; }
      var r = KANA[ch];
      if (!r) continue;
      // 장음: お단 뒤 う·お, う단 뒤 う 는 적지 않는다 (とうきょう 도쿄, ゆうき 유키)
      if (lb && !lb.T && ((ch === 'う' && (lb.vow === 'o' || lb.vow === 'u')) || (ch === 'お' && lb.vow === 'o'))) continue;
      var nx = chars[i + 1];
      if (nx && SMALL_Y[nx] && /i$/.test(r) && r.length > 1) {
        var base = r.slice(0, -1);
        r = (base === 'sh' || base === 'ch' || base === 'j' ? base : base + 'y') + SMALL_Y[nx];
        i++;
      } else if (nx && SMALL_V[nx] && r.length >= 1) {
        var bc = r.slice(0, -1);
        if (r === 'u') bc = 'w';
        if (r === 'tsu') bc = 'ts';
        r = bc + SMALL_V[nx];
        i++;
      }
      var s = romajiSyl(r, B.length === 0);
      if (s) B.push(s);
    }
    return B.map(function (b) { return syl(b.L, b.V, b.T); }).join('');
  }

  // ------------------------------------------------------------------ 한 단어 변환
  function scriptOf(ch) {
    var c = ch.codePointAt(0);
    if (c >= 0xAC00 && c <= 0xD7A3) return 'hangul';
    if ((c >= 0x3041 && c <= 0x30ff && c !== 0x30fb) || c === 0x30fc) return 'kana';
    if (c >= 0x0400 && c <= 0x04ff) return 'cyrillic';
    if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || (c >= 0xc0 && c <= 0x24f && c !== 0xd7 && c !== 0xf7) || (c >= 0x1e00 && c <= 0x1eff)) return 'latin';
    return '';
  }
  function runsOf(word) {
    var runs = [];
    Array.from(word).forEach(function (ch) {
      var sc = scriptOf(ch);
      if (!sc) return;
      var lr = runs[runs.length - 1];
      if (lr && lr.script === sc) lr.text += ch; else runs.push({ script: sc, text: ch });
    });
    return runs;
  }
  function convertRun(run) {
    if (run.script === 'hangul') return { hangul: run.text, source: 'hangul' };
    if (run.script === 'kana') return { hangul: kanaToHangul(run.text), source: 'kana' };
    var latin = run.script === 'cyrillic' ? cyrToLatin(run.text) : run.text;
    var key = latinKey(latin);
    if (!key) return { hangul: '', source: run.script };
    if (Object.prototype.hasOwnProperty.call(DICT, key)) return { hangul: DICT[key], source: 'dict', latin: run.script === 'cyrillic' ? capWord(latin) : '' };
    return { hangul: ruleLatin(key, run.script === 'cyrillic' ? 'ph' : 'en'), source: run.script === 'cyrillic' ? 'cyrillic' : 'rule', latin: run.script === 'cyrillic' ? capWord(latin) : '' };
  }
  function convertWord(word) {
    var runs = runsOf(word);
    var h = '';
    var src = '';
    var latin = '';
    runs.forEach(function (r) {
      var x = convertRun(r);
      h += x.hangul;
      if (!src && x.hangul) src = x.source;
      if (x.latin) latin += x.latin;
    });
    h = Array.from(h).filter(isSyllable).join('');
    if (!h) return null;
    return { src: word, latin: latin, hangul: h, source: src, blocks: blocksOf(h) };
  }

  // ------------------------------------------------------------------ 공개 API
  function convert(input) {
    try {
      if (input != null && typeof input !== 'string' && typeof input !== 'number') return { ok: false, reason: 'invalid', input: '' };
      var text = clean(input);
      if (!text) return { ok: false, reason: 'empty', input: '' };
      var words = text.split(/[\s\-‐‑–—_.,·・/\\|+&]+/).filter(Boolean);
      var out = [];
      words.forEach(function (w) { var r = convertWord(w); if (r) out.push(r); });
      if (!out.length) return { ok: false, reason: 'invalid', input: text };
      return {
        ok: true,
        input: text,
        hangul: out.map(function (w) { return w.hangul; }).join(' '),
        roman: out.map(function (w) { return w.blocks.map(function (b) { return b.r; }).join('-'); }).join(' '),
        words: out
      };
    } catch (e) {
      return { ok: false, reason: 'invalid', input: '' };
    }
  }

  // 공유 링크 (#d=…) — UTF-8 안전 base64url, { v:1, n: 이름, s: 카드 스타일 }
  function b64urlEncode(str) {
    var bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(str) : Buffer.from(str, 'utf8');
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    var b64 = typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  function encode(name, style) {
    var n = clean(name);
    if (!n) return '';
    var s = STYLES.indexOf(style);
    return b64urlEncode(JSON.stringify({ v: 1, n: n, s: s < 0 ? 0 : s }));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > 400 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || p.v !== 1 || typeof p.n !== 'string') return null;
      var n = clean(p.n);
      if (!n || !convert(n).ok) return null;
      var si = typeof p.s === 'number' && p.s >= 0 && p.s < STYLES.length ? Math.floor(p.s) : 0;
      return { name: n, style: STYLES[si] };
    } catch (e) {
      return null;
    }
  }

  return {
    MAX_INPUT: MAX_INPUT,
    STYLES: STYLES,
    CARD_FONTS: CARD_FONTS,
    CARD_FONTS_CSS: CARD_FONTS_CSS,
    DICT: DICT,
    clean: clean,
    convert: convert,
    latinKey: latinKey,
    cyrToLatin: cyrToLatin,
    ruleLatin: ruleLatin,
    kanaToHangul: kanaToHangul,
    romanizeBlock: romanizeBlock,
    isSyllable: isSyllable,
    encode: encode,
    decode: decode
  };
});
