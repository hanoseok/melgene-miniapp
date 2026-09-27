#!/usr/bin/env node
/**
 * 미니앱 모듈(apps/<id>/app.config.js)을 모아 shared/site.config.js 의 SITES 목록을 다시 쓴다.
 * 브라우저는 site.config.js 를 그냥 <script> 로 읽으므로 목록을 그 파일 안에 생성해 둔다
 * (SITE_CONFIG 모양은 그대로 — 포털·끝 화면·생성기가 모두 SITE_CONFIG.SITES 를 읽는다).
 *
 * 새 앱 = apps/<id>/ 폴더 + app.config.js 하나. 여기(중앙)에는 고칠 것이 없다.
 * 순서: added(오래된 날 먼저) → order(같은 날 안에서, 없으면 뒤) → id.
 *
 * 실행: node tools/gen-sites.js          (다시 쓰기, gen-all.js 가 맨 먼저 부른다)
 *       node tools/gen-sites.js --check  (최신이 아니면 실패 — deploy-prep.sh 가 부른다)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPS = path.join(ROOT, 'apps');
const CONFIG = path.join(ROOT, 'shared', 'site.config.js');
const LOCALES = require(path.join(ROOT, 'shared', 'i18n.js')).LOCALES.map((l) => l.code);
const BEGIN = '  // <sites:generated> apps/*/app.config.js 에서 node tools/gen-sites.js 가 만든다. 여기를 손으로 고치지 않는다.';
const END = '  // </sites:generated>';

function loadApps() {
  const errors = [];
  const list = fs.readdirSync(APPS)
    .filter((d) => fs.existsSync(path.join(APPS, d, 'app.config.js')))
    .map((d) => {
      const file = path.join(APPS, d, 'app.config.js');
      delete require.cache[require.resolve(file)];
      const c = require(file);
      const bad = (m) => errors.push(`apps/${d}/app.config.js: ${m}`);
      if (c.id !== d) bad(`id '${c.id}' 가 폴더 이름 '${d}' 와 다르다`);
      if (!/^[a-z0-9-]{1,32}$/.test(d)) bad('id 는 ^[a-z0-9-]{1,32}$');
      ['emoji', 'category', 'added', 'path'].forEach((k) => { if (!c[k]) bad(`${k} 없음`); });
      if (c.added && !/^\d{4}-\d{2}-\d{2}$/.test(c.added)) bad('added 는 YYYY-MM-DD');
      if (c.path && c.path !== `https://${d}.example.com/`) bad(`path 는 https://${d}.example.com/ (deploy-prep 이 실제 주소로 바꾼다)`);
      ['title', 'desc'].forEach((k) => {
        const miss = LOCALES.filter((l) => !(c[k] && c[k][l]));
        if (miss.length) bad(`${k} 에 없는 언어: ${miss.join(', ')}`);
      });
      return c;
    });
  if (errors.length) {
    errors.forEach((e) => console.error('  ✗ ' + e));
    process.exit(1);
  }
  const ord = (c) => (typeof c.order === 'number' ? c.order : Infinity);
  return list.sort((a, b) => a.added.localeCompare(b.added) || ord(a) - ord(b) || a.id.localeCompare(b.id));
}

// site.config.js 원래 손글씨 모양 그대로: 짧은 문자열만 담은 객체는 한 줄, 긴 문구(desc)는 여러 줄.
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const lit = (v) => (typeof v === 'string' ? q(v) : JSON.stringify(v));
function value(v, ind) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return lit(v);
  const ents = Object.entries(v);
  if (ents.every(([, x]) => typeof x === 'string' && x.length <= 40)) {
    return `{ ${ents.map(([k, x]) => `${k}: ${lit(x)}`).join(', ')} }`;
  }
  return `{\n${ents.map(([k, x]) => `${ind}  ${k}: ${value(x, ind + '  ')},`).join('\n')}\n${ind}}`;
}
function render(apps) {
  const ind = '      ';
  const items = apps.map((c) => {
    const body = Object.entries(c)
      .filter(([k]) => k !== 'order') // 정렬용, 브라우저에는 안 보낸다
      .map(([k, v]) => `${ind}${k}: ${value(v, ind)},`)
      .join('\n');
    return `    {\n${body}\n    },`;
  });
  return `${BEGIN}\n  SITES: [\n${items.join('\n')}\n  ],\n${END}`;
}

const src = fs.readFileSync(CONFIG, 'utf8');
const a = src.indexOf(BEGIN);
const b = src.indexOf(END);
if (a < 0 || b < a) {
  console.error(`shared/site.config.js 에 생성 구역 표시(<sites:generated> … </sites:generated>)가 없다`);
  process.exit(1);
}
const apps = loadApps();
const next = src.slice(0, a) + render(apps) + src.slice(b + END.length);

if (process.argv.includes('--check')) {
  if (next !== src) {
    console.error('!! shared/site.config.js 의 SITES 가 apps/*/app.config.js 와 다르다 → node tools/gen-all.js');
    process.exit(1);
  }
  console.log(`SITES 최신 (앱 ${apps.length}개)`);
} else {
  if (next !== src) fs.writeFileSync(CONFIG, next);
  console.log(`SITES ${next !== src ? '다시 씀' : '변경 없음'} (앱 ${apps.length}개: ${apps.map((c) => c.id).join(', ')})`);
}
