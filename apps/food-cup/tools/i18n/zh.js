/* 美食二选一·美食世界杯 — 简体中文 (/zh/)
 * 键结构与 en.js 相同。菜品 id、表情和对阵逻辑见 food-cup-core.js。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=ZCOOL+QingKe+HuangYou&display=swap',
    display: "'ZCOOL QingKe HuangYou', 'Unbounded'",
    displayWeight: 400,
    name: "'ZCOOL QingKe HuangYou'",
    nameWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '美食二选一·美食世界杯',
    description: '美食世界杯：两道菜里选一道更想吃的，一路淘汰到最后，剩下的就是你的本命美食。1分钟玩完的美食二选一小游戏，免费、无需下载，还能看到大家的真实选择比例。',
    ogTitle: '美食二选一🏆美食世界杯',
    ogDescription: '二选一15次，最后留下的是哪道菜？',
  },
  siteName: '美食世界杯',
  privacyLink: '隐私政策',

  start: {
    badge: '🍽️ 二选一·美食篇',
    h1Kicker: '美食二选一',
    h1Html: '笑到最后的<br><em>本命美食</em>是？',
    hook: '两道菜只能选一道。一路选下去，最后留下的就是你的最爱！',
    facts: '16道菜 · 选15次 · 1分钟',
    start: '开始美食世界杯 →',
  },

  play: {
    rounds: { r16: '16强', qf: '8强', sf: '半决赛', f: '决赛' },
    roundFmt: '{round} {n}/{total}',
    progressAria: '第{n}次选择，共{total}次',
    hint: '点你更想吃的那道',
    vs: 'VS',
    pickAria: '选{food}',
    same: '{pct}%的人和你选的一样',
  },

  result: {
    eyebrow: '你的本命美食',
    champPct: '另有{pct}%的玩家也让{food}夺冠',
    champFirst: '你是最早通关的人之一，暂时还没有统计。',
    fourTitle: '你的四强',
    retry: '再来一次（新对阵）',
    shareTitle: '美食二选一·美食世界杯',
    shareText: '我的本命美食是{emoji}{food}！你的是什么？',
  },

  foods: {
    pizza: '披萨',
    burger: '汉堡',
    sushi: '寿司',
    noodles: '牛肉面',
    chicken: '炸鸡',
    tacos: '塔可',
    pasta: '意面',
    curry: '咖喱饭',
    dumplings: '饺子',
    steak: '牛排',
    hotpot: '火锅',
    hotdog: '热狗',
    friedrice: '蛋炒饭',
    sandwich: '三明治',
    stew: '麻辣香锅',
    shrimp: '炸虾',
  },

  og: {
    brand: '🏆 美食世界杯',
    defaultKicker: '二选一·美食篇',
    defaultTitle: '笑到最后的本命美食是？',
    defaultDesc: '两道菜选一道 · 选出冠军 · 约1分钟',
  },

  faq: [
    { q: '美食世界杯怎么玩？', a: '16道菜会被随机排进对阵表。每场出现两道菜，点你更想吃的那道，它就晋级。16强、8强、半决赛、决赛一共选15次，最后留下的就是你的本命美食。' },
    { q: '选择比例是真的吗？', a: '是真的。每次选择只以匿名合计的形式记在服务器上，同一场对决每个浏览器只算一次。只有当足够多的人玩过同一场对决时才显示百分比，在那之前宁可不显示，也不会编造数字。' },
    { q: '可以再玩一次或分享结果吗？', a: '想玩几次都可以。每次对阵表都会重新打乱，对决也会不一样。用分享按钮把你的本命美食发给朋友，看看他们会选什么。' },
    { q: '为什么是这16道菜？', a: '从街头小吃到家常菜，这些都是世界各地都爱吃的美食。名字按中文里常用的叫法显示，但菜品在所有语言里都是同一道，所以比例汇总了各国玩家的选择。' },
  ],

  privacy: {
    title: '隐私政策 | 美食世界杯',
    description: '美食世界杯隐私政策：匿名选择统计、Cookie、广告和访问统计说明。',
    h1: '隐私政策',
    introHtml: '美食世界杯（以下简称“本服务”）尊重用户隐私，仅按照以下方针处理最少的必要信息。',
    sections: [
      ['1. 收集的信息', '本服务无需注册或登录即可使用。你的选择只会以不含姓名或个人身份信息的匿名合计（哪场对决哪道菜胜出、哪道菜被选为冠军）形式保存在服务器上。使用过程中可能会自动收集以下信息。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言设置和已计入的对决，并用于投放广告和分析使用情况。你可以在浏览器设置中拒绝或删除，但部分功能可能无法正常使用。'],
      ['3. 广告 (Google AdSense)', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据你以往访问本网站和其他网站的情况投放广告。详细信息和偏好设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 访问统计', '为改进服务，我们可能使用 Google Analytics (GA4) 以及仅按日期和语言记录合计数的自有统计（浏览量、完成次数、星级评分）。这些都不会识别你的个人身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自 2026年9月29日起生效。'],
    ],
    back: '← 返回美食世界杯',
  },
};
