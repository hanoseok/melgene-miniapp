/**
 * 간판·허브·OG 제목의 글자 폭 추정(em) — 생성기(gen-i18n.js, gen-og.js) 공용. 배포되지 않는다.
 * CSS 는 이 값으로 "한 줄에 들어가는 가장 큰 글자 크기"를 계산한다 → 언어별 CSS 규칙이 필요 없다.
 * 굵은 간판체(Black Han Sans / Dela Gothic One) 기준: 전각(한글·가나·한자) 1em, 라틴 대문자 0.76em,
 * 소문자·숫자 0.66em, 공백 0.3em, 문장부호 0.4em, 그 밖(태국어·키릴 등) 0.68em
 */
function emWidth(text) {
  let w = 0;
  for (const ch of String(text)) {
    if (/[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯]/.test(ch)) w += 1;
    else if (/\s/.test(ch)) w += 0.3;
    else if (/[A-Z]/.test(ch)) w += 0.76;
    else if (/[a-z0-9]/.test(ch)) w += 0.66;
    else if (/[!-/:-@[-`{-~]/.test(ch)) w += 0.4;
    else w += 0.68;
  }
  return Math.max(1, Math.round(w * 100) / 100);
}
module.exports = { emWidth };
