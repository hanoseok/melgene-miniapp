/* 万圣节接糖果游戏 — 简体中文 (/zh/)
 * 键结构与 en.js 相同。游戏规则与计分在 candy-catch-core.js。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe', 'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '万圣节接糖果游戏 - 免费小游戏',
    description: '万圣节接糖果游戏：左右移动南瓜桶接住掉落的糖果，躲开蜘蛛和幽灵，连击刷高分。一局50秒，免费、无需下载。',
    ogTitle: '万圣节接糖果游戏 🍬 你能接到多少分？',
    ogDescription: '天上下起了糖果雨。50秒、3条命，你的南瓜桶能装多满？',
  },
  siteName: '万圣节接糖果',
  privacyLink: '隐私政策',

  start: {
    badge: '🎃 不给糖就捣蛋 · 街机',
    h1Kicker: '万圣节接糖果游戏',
    h1Html: '你能接住<br><em>多少糖果</em>？',
    hook: '今晚下起了糖果雨。在时间结束前装满你的桶——不过，掉下来的可不全是甜的。',
    how: { move: '拖动或 ← →', catch: '接住糖果', avoid: '躲开吓人的' },
    facts: '50秒 · 3条命 · 连击加分',
    start: '开始接糖果 →',
  },

  play: {
    score: '得分',
    time: '时间',
    lives: '生命',
    livesAria: '剩余生命 {n}',
    combo: '连击 ×{n}',
    pause: '暂停',
    paused: '已暂停',
    resume: '继续',
    go: '开始！',
    fieldAria: '游戏区域。拖动、移动鼠标或用方向键移动南瓜桶。',
  },

  result: {
    timeUp: '时间到！',
    outOfLives: '生命用完了！',
    points: '分',
    best: '最高 {n}分',
    newBest: '刷新纪录！',
    caught: '接住的糖果',
    streak: '最高连击',
    top: '前 {n}%',
    beat: '高于 {pct}% 的玩家',
    beatAll: '比目前所有成绩都高',
    others: '与其他 {n} 个成绩比较',
    comparing: '正在和其他玩家比较…',
    retry: '再玩一次',
    shareTitle: '万圣节接糖果游戏',
    shareText: '我在万圣节接糖果游戏拿了{score}分🍬 你能超过我吗？',
  },

  og: {
    brand: '🍬 万圣节接糖果',
    defaultKicker: '免费万圣节小游戏',
    defaultTitle: '你能接住多少糖果？',
    defaultDesc: '移动南瓜桶 · 接住糖果 · 50秒',
  },

  faq: [
    { q: '怎么玩？', a: '在游戏区域用手指拖动、移动鼠标，或按住 ← → 方向键来移动南瓜桶。接住掉下来的糖果，避开吓人的东西。一局50秒，或3条命用完就结束。' },
    { q: '得分和连击怎么算？', a: '每种糖果都有分数，越稀有、越华丽的糖果分数越高。连续接住糖果会累积连击，连击越长倍数越高。漏接糖果或接到吓人的东西，连击就会归零。' },
    { q: '显示的“前 %”是真实数据吗？', a: '是的。每局结束后，只会把你的分数匿名发送到服务器，和其他玩家的成绩比较。只有存在可以比较的真实成绩时才显示百分比，否则什么都不显示。' },
    { q: '游戏为什么自己停了？', a: '切换到其他标签页或应用时，游戏会自动暂停，离开期间不会丢命。点「继续」就能接着玩。你的最高分保存在这个浏览器里。' },
  ],

  privacy: {
    title: '隐私政策 | 万圣节接糖果游戏',
    description: '万圣节接糖果游戏隐私政策：匿名分数、Cookie、广告与访问统计。',
    h1: '隐私政策',
    introHtml: '万圣节接糖果游戏（以下简称“本服务”）尊重您的隐私，仅按照以下方针处理最少量的信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录即可使用。每局结束时，只有您的分数（按10分取整）会以匿名合计的形式保存到服务器，不附带姓名或任何个人识别信息。但在使用过程中，可能会自动收集以下信息。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和最高分，并用于投放广告和分析使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您此前访问本网站和其他网站的情况投放广告。详情及个性化设置请访问 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 访问统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及只保留按日期和语言汇总数据的自有统计（浏览量、开始与完成次数、星级评分）。不会收集可识别个人身份的信息。'],
      ['5. 联系我们', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年9月30日起生效。'],
    ],
    back: '← 返回万圣节接糖果游戏',
  },
};
