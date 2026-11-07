// ski 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/ski/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'ski',
  emoji: '⛷️',
  category: 'game',
  added: '2026-11-08',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://ski.example.com/',
  title: {
    ko: '스키 활강',
    en: 'Ski Downhill',
    ja: 'スキーゲーム',
    zh: '滑雪游戏',
    fr: 'Jeu de ski',
    de: 'Skispiel',
    th: 'เกมสกี',
    vi: 'Trượt tuyết',
    es: 'Juego de esquí',
    it: 'Gioco di sci',
    pt: 'Jogo de esqui',
    ru: 'Горные лыжи',
  },
  desc: {
    ko: '끝없는 설산 슬로프를 내려가며 나무·바위·눈사람을 피하고 기문을 통과해 보너스를 모으는 스키 게임.',
    en: 'Steer down an endless snowy slope, dodge trees, rocks and snowmen, and ski through slalom gates for bonus meters.',
    ja: '終わりのないゲレンデを滑り降り、木や岩や雪だるまをよけて旗門をくぐるスキーゲーム。',
    zh: '沿着无尽雪道一路向下，躲开松树、岩石和雪人，穿过旗门拿奖励米数的滑雪游戏。',
    fr: 'Dévale une piste sans fin, évite sapins, rochers et bonshommes de neige, et passe les portes de slalom pour des mètres bonus.',
    de: 'Fahr eine endlose Piste hinab, weich Tannen, Felsen und Schneemännern aus und fahr durch Slalomtore für Bonusmeter.',
    th: 'ไถลลงลานหิมะไม่รู้จบ หลบต้นสน ก้อนหิน และตุ๊กตาหิมะ แล้วลอดธงสลาลอมเพื่อเก็บระยะโบนัส',
    vi: 'Lao xuống con dốc tuyết bất tận, né cây thông, đá và người tuyết, luồn qua cổng cờ slalom để cộng mét thưởng.',
    es: 'Baja por una pista nevada sin fin, esquiva pinos, rocas y muñecos de nieve, y pasa por las puertas de eslalon.',
    it: 'Scendi lungo una pista innevata senza fine, schiva abeti, rocce e pupazzi di neve e infila le porte dello slalom.',
    pt: 'Desça uma pista de neve sem fim, desvie de pinheiros, pedras e bonecos de neve e passe pelas portas de slalom.',
    ru: 'Мчись по бесконечному склону, объезжай ёлки, камни и снеговиков и проходи слаломные ворота за бонусные метры.',
  },
};
