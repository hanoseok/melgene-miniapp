#!/usr/bin/env node
/**
 * 모든 사이트의 다국어 정적 페이지(+ sitemap)를 다시 생성하고 링크 검사까지 돌린다.
 * 언어를 추가/수정한 뒤 이것 하나만 실행하면 된다.
 *
 * 실행: node tools/gen-all.js          (HTML + sitemap + 링크 검사)
 *       node tools/gen-all.js --og     (+ 기본 언어 외 OG 이미지도 Chrome headless 로 재생성)
 */
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const run = (script, args = []) => {
  console.log(`\n$ node ${path.relative(ROOT, script)} ${args.join(' ')}`.trimEnd());
  execFileSync(process.execPath, [script, ...args], { stdio: 'inherit', cwd: path.dirname(path.dirname(script)) });
};

// 0) apps/*/app.config.js → shared/site.config.js 의 SITES (포털·다른 미니앱 목록이 이걸 읽으므로 맨 먼저)
run(path.join(ROOT, 'tools/gen-sites.js'));

// apps/<사이트>/tools/ 의 생성기를 자동으로 찾는다: gen-i18n.js (없으면 gen-results.js), --og 이면 gen-og.js.
// 새 미니앱은 폴더(+ app.config.js)만 만들고 이 규칙대로 생성기를 두면 된다. hub(포털)는 다른 사이트 뒤에 돈다.
const fs = require('fs');
const siteDirs = fs.readdirSync(path.join(ROOT, 'apps'))
  .filter((d) => fs.statSync(path.join(ROOT, 'apps', d)).isDirectory())
  .sort((a, b) => (a === 'hub') - (b === 'hub') || a.localeCompare(b));
const pick = (d, names) => names.map((n) => path.join(ROOT, 'apps', d, 'tools', n)).find((f) => fs.existsSync(f));

for (const d of siteDirs) {
  const gen = pick(d, ['gen-i18n.js', 'gen-results.js']);
  if (gen) run(gen);
  else console.log(`\n(건너뜀) apps/${d}: tools/gen-i18n.js 가 없다`);
}

if (process.argv.includes('--og')) {
  for (const d of siteDirs) {
    const og = pick(d, ['gen-og.js']);
    if (og) run(og);
  }
}

run(path.join(ROOT, 'tools/check-links.js'));
