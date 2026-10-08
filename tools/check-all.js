#!/usr/bin/env node
/**
 * 모든 모듈(apps/<id>/tools/check-*.js)의 검사를 차례로 돌린다. 새 앱은 check-*.js 만 두면 자동으로 들어온다.
 * 포털(hub)은 --layout(11개 언어 360/375 실측)까지. 마지막에 공통 tools/check-guides.js(가이드·신뢰 페이지).
 * 하나라도 실패하면 끝에 모아 알리고 exit 1.
 *
 * 실행: node tools/check-all.js              (모든 앱)
 *       node tools/check-all.js monster hub  (지정한 앱만)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const APPS = path.join(__dirname, '..', 'apps');
const only = process.argv.slice(2);
const ARGS = { 'hub/check-hub.js': ['--layout'] };

const failed = [];
let n = 0;
fs.readdirSync(APPS)
  .filter((d) => fs.existsSync(path.join(APPS, d, 'tools')) && (!only.length || only.includes(d)))
  .forEach((d) => {
    fs.readdirSync(path.join(APPS, d, 'tools'))
      .filter((f) => /^check-.*\.js$/.test(f))
      .sort()
      .forEach((f) => {
        const args = ARGS[`${d}/${f}`] || [];
        console.log(`\n$ (apps/${d}) node tools/${f} ${args.join(' ')}`.trimEnd());
        const r = spawnSync(process.execPath, [path.join('tools', f), ...args], { cwd: path.join(APPS, d), stdio: 'inherit' });
        n++;
        if (r.status !== 0) failed.push(`apps/${d}/tools/${f}`);
      });
  });

// 공통 검사: 긴 글 가이드(guide.html) + 포털 신뢰 페이지 (tools/check-guides.js, 지정한 앱만 돌릴 때는 그 앱들만)
console.log(`\n$ node tools/check-guides.js ${only.join(' ')}`.trimEnd());
const g = spawnSync(process.execPath, [path.join(__dirname, 'check-guides.js'), ...only], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
n++;
if (g.status !== 0) failed.push('tools/check-guides.js');

console.log(`\n=== check-all: ${n}개 중 ${n - failed.length}개 통과 ===`);
if (failed.length) {
  failed.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
}
