# 홍보 기록 (PROMO_LOG)

규칙: melgene-ops §8. 홍보했으면 **언제 · 어디에 · 어떻게 · 왜** 를 한 줄 이상으로 남긴다.

| 날짜 | 채널(URL) | 어떻게(글 요약·링크) | 왜 | 결과 |
|---|---|---|---|---|
| 2026-10-04 | (조사만, 게시 안 함) | 홍보 채널 조사. 후보: Reddit r/SideProject(주간 "Share your project" 스레드)·r/WebGames·r/playmygame·r/indiegaming, 디스콰이엇(disquiet.io), GeekNews(news.hada.io Show GN), 클리앙 '내가 만든 프로그램', X(트위터) | 개발 완료 후 사용자 유입이 광고 수익의 전제라서(사용자 지시 2026-10-04) | **게시 못 함**: reddit.com 은 브라우저 도구에서 접근 차단, disquiet.io 는 로그인 안 됨(계정 생성·비밀번호 입력은 금지). 사용자가 해당 채널에 로그인해 두면 이어서 게시 |

## 바로 쓸 수 있는 홍보 문안 (진짜 숫자 없이, 스팸 아니게 채널 규칙 확인 후)

- **한국어(디스콰이엇·클리앙)**: "광고 수익형 미니앱 사이트를 만들고 있어요 — 할로윈 수박게임, 할로윈 코스튬 추천, 할로윈 파티 초대장, 오늘 뭐 먹지 등 설치·가입 없이 1~2분. 12개 언어 지원. https://melgene.com — 써 보시고 불편한 점 알려 주세요."
- **English (r/SideProject 주간 스레드·r/WebGames)**: "I'm building Melgene Apps: free mini games, personality tests and tools that run in the browser (no sign-up, 12 languages). Latest: a Halloween Suika-style merge game and a party invitation maker. https://melgene.com — feedback welcome."
- 지킬 것(melgene-ops §8): 채널 규칙 먼저 읽기, 같은 글 복붙 금지, 채널별 간격, 가짜 후기·숫자 금지.
| 2026-10-04 | IndexNow (api.indexnow.org → Bing·Naver·Yandex 등) | 키 파일(도메인 루트/<키>.txt, deploy.env INDEXNOW_KEY)을 배포하고 miniapp.melgene.com 34개 주소(포털·신규 game2048·lovestyle 12개 언어 포함)와 melgene.com 포털 제출 | 로그인 없이 검색 노출을 앞당기려고(사용자 요청) | 둘 다 HTTP 202 접수 |
