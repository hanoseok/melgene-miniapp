# 검색(SEO) — 11개 언어

목표: 미니앱·미니게임·심리테스트 같은 말로 각 나라 Google 에서 찾히게. 시작 화면에 SEO 글을 두지 않는다(티징 규칙) — 검색어는 title·메타·보이는 h1·OG·JSON-LD·(끝 화면/포털) FAQ 답에만.

## 제목 규칙

`<title>` = **현지 검색어(+짧은 훅)** + ` | ` + 브랜드(`G.brandOf(lang)`). 라틴 60자·CJK/태국 32자 안팎. 메타 설명 110~155자(CJK 60~90자): 무엇인지 + 무료·설치 없음·1분 같은 사실, 검색어 1~2번. OG 도 같은 뜻.

## 현지 검색어 표 (새 앱은 같은 방식으로 한 줄 추가)

| 앱 | en | ja | zh | ko | fr | de | th | vi | es | it | pt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 포털 | free mini games, personality tests | 無料ミニゲーム・心理テスト・診断 | 免费小游戏·心理测试 | 무료 미니게임·심리테스트·미니앱 | mini-jeux gratuits, tests de personnalité | kostenlose Minispiele, Persönlichkeitstests | มินิเกมฟรี แบบทดสอบจิตวิทยา | mini game miễn phí, trắc nghiệm tâm lý | minijuegos gratis, tests de personalidad | mini giochi gratis, test di personalità | minijogos grátis, testes de personalidade |
| ladder | ladder game, random picker, draw lots | あみだくじ | 鬼脚图 / 在线抽签 | 사다리타기 | tirage au sort (jeu de l'échelle) | Losentscheid / Leiterspiel | จับฉลาก เกมบันได | bốc thăm, trò chơi bậc thang | sorteo, juego de la escalera | gioco della scala / sorteggio | sorteio / jogo da escada |
| roulette | spin the wheel | ルーレット | 幸运转盘 | 돌림판 돌리기 | roue aléatoire | Glücksrad | วงล้อสุ่ม | vòng quay may mắn | ruleta aleatoria | ruota della fortuna | roleta aleatória |
| reaction | reaction time test | 反応速度テスト | 反应速度测试 | 반응속도 테스트 | test de réaction | Reaktionstest | ทดสอบปฏิกิริยา | kiểm tra phản xạ | test de reacción | test di reazione | teste de reação |
| balance | would you rather | 究極の選択・二択ゲーム | 二选一·终极选择 | 밸런스 게임 | tu préfères | Würdest du eher | เกมเลือกข้าง (Would you rather) | bạn chọn cái nào | ¿qué prefieres? | preferiresti | o que você prefere |
| past-life | past life test | 前世診断 | 前世测试 | 전생 테스트 | test vie antérieure | Früheres-Leben-Test | ทดสอบชาติที่แล้ว | trắc nghiệm kiếp trước | test de vidas pasadas | test vita precedente | teste de vida passada |
| life | life animation maker, life timeline | 人生アニメ・自分史 | 人生动画·人生时间轴 | 내 인생 애니메이션·인생 그래프 | ma vie en animation, frise de vie | Lebens-Animation, Lebenszeitstrahl | แอนิเมชันชีวิตฉัน | hoạt hình cuộc đời | animación de mi vida, línea de vida | animazione della mia vita | animação da minha vida |
| monster | which monster are you, Halloween personality test | モンスター診断・ハロウィン診断 | 万圣节怪物测试 | 할로윈 몬스터 테스트·나를 닮은 몬스터 | quel monstre es-tu, test Halloween | Welches Monster bist du, Halloween-Test | แบบทดสอบฮาโลวีน คุณคือปีศาจตัวไหน | bạn là quái vật nào, trắc nghiệm Halloween | ¿qué monstruo eres?, test de Halloween | che mostro sei? test di Halloween | que monstro você é? teste de Halloween |

`SITES[].title` (포털 아이콘 이름)도 이 검색어와 같은 이름으로 맞춘다.

## 기술 요소 (생성기 헬퍼)

- `G.hreflangTags` — 11개 언어 + x-default(en), 자기 canonical, `G.ogLocaleTags`, `<html lang>`.
- `G.appLd` — WebApplication(무료 Offer, inLanguage, applicationCategory) + BreadcrumbList(포털 → 앱). aggregateRating 금지(숫자는 서버 실제 값만, 정적 HTML 에 굳히지 않음). FAQPage 는 앱 페이지 금지(포털만 허용).
- `G.sitemapXml` — 모든 언어 URL + xhtml:link + lastmod. 배포 시 deploy-prep 이 `sitemap-index.xml`(모든 사이트맵)과 robots.txt 를 만든다.
- 영어 루트 전환 전 주소(`/<앱>/en/…`)는 배포 404 페이지가 새 주소로 넘긴다. 모르는 주소에 언어 폴더가 있으면(`/<앱>/it/…`) 그 언어 첫 화면으로.
- 방문자 지역 자동 이동(스킬 4번)은 봇·크롤러를 옮기지 않는다 → 언어별 주소가 각각 색인된다. en 루트는 x-default.

## Search Console

- 속성: `https://miniapp.melgene.com/` (URL 접두어, HTML 파일 인증 — deploy.env `GSC_FILES_miniapp`, 절대 지우지 않음). melgene.com 도메인 속성은 DNS TXT 필요(Spaceship, 회사망에서는 보안 게이트웨이 때문에 보류).
- 제출 사이트맵: `sitemap-index.xml`. 새 앱·큰 변경 후 URL 검사 → "색인 생성 요청"(하루 할당량 적음 — 포털·새 앱 첫 화면 위주).
- 실적(검색어·노출·클릭·나라)은 Search Console → 실적.
