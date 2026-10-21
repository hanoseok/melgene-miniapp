/* 动物赛跑抽签 — 简体中文。键结构与 en.js 相同。 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '动物赛跑抽签 – 在线赛跑随机决定',
    description: '用动物赛跑来抽签！输入2到10个名字，每人一只小动物各跑一条跑道。第一名胜出，或者最后一名请喝咖啡。公平随机，免费，无需注册。',
    ogTitle: '动物赛跑抽签 🏁 这次谁请咖啡？',
    ogDescription: '输入名字，让小动物们站上起跑线，用一场赛跑来决定。第一名胜出，或最后一名请客。',
  },
  siteName: '动物赛跑抽签',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: '动物赛跑抽签',
    h1Html: '选不出来？<br><em>让小动物们跑一场</em>',
    hook: '谁请咖啡？谁先来？把大家放上跑道，看比赛结果吧。',
  },

  ui: {
    modeLabel: '怎么决定？',
    modeWin: '🏆 第一名胜出',
    modeLose: '☕ 最后一名请客',
    countLabel: '参赛人数',
    countValue: '{n} 人',
    less: '减少人数',
    more: '增加人数',
    namesLabel: '谁来参赛？',
    namesHint: '空着的跑道会用默认名字。小动物只是好玩，不影响任何人的概率。',
    playerN: '选手{n}',
    nameAria: '第{n}跑道的名字',
    start: '开跑！🏁',
    fair: '开跑前用 crypto 随机数公平决定名次 · 名字只保存在本设备',
    trackAria: '赛道',
    go: '跑！',
    bannerWin: '🏆 最先冲线的人胜出',
    bannerLose: '☕ 最后冲线的人请客',
    liveStart: '三、二、一，跑！比赛开始了。',
  },

  errors: {
    tooFew: '至少需要2名选手。',
    tooMany: '赛道最多容纳10名选手。',
    badLink: '链接已损坏，没有读取到名字。',
  },

  result: {
    winKicker: '第一名是',
    winTitle: '{name} 赢了！🏆',
    winSub: '第一个冲过终点线。',
    loseKicker: '最后冲线的是',
    loseTitle: '{name} 最后一名',
    loseSub: '运气不好！这轮咖啡由 {name} 请客 ☕',
    rankingTitle: '冲线顺序',
    tagWin: '胜出',
    tagLose: '请客 ☕',
    edit: '修改名字',
    shareNames: '复制带名字的链接',
    linkCopied: '链接已复制，打开后就是同样的选手，可以直接开跑。',
    sharedNote: '已从分享链接读取选手。准备好就开跑！',
    history: '最近的比赛',
    historyClear: '清除',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} 人',
    liveWin: '{name} 第一个冲线。',
    liveLose: '{name} 最后一个冲线。',
    again: '再跑一次 🏁',
    shareTitle: '动物赛跑抽签',
    shareText: '选不出来？让小动物们跑一场来决定 🏁',
  },

  og: {
    brand: '🏁 动物赛跑抽签',
    kicker: '赛跑抽签 · 2到10人',
    title: '让小动物们跑一场来决定',
    desc: '第一名胜出，或最后一名请喝咖啡',
  },

  faq: [
    { q: '真的是公平随机吗？', a: '是的。按下开跑的那一刻，会用浏览器的加密随机数（crypto.getRandomValues）、拒绝采样和 Fisher–Yates 洗牌一次性决定全部冲线顺序。每种顺序的概率完全相同，画面里的比赛只是把它演出来。' },
    { q: '动物或跑道会影响概率吗？', a: '不会。小动物按跑道顺序分配，只是为了好玩。在这里兔子不比乌龟快，第1跑道和第10跑道的概率也一样。' },
    { q: '为什么每次都跑得这么胶着？', a: '为了好看。名次决定后，动画会加入冲刺和踉跄，并根据模式让争夺第一名或最后一名的位置特别接近。动画不会改变名次。' },
    { q: '可以把同样的选手发给朋友吗？', a: '可以。点“复制带名字的链接”，链接里只有名字和模式，不含结果。打开的人会重新跑一场。最近的结果只保存在本设备。' },
  ],

  privacy: {
    title: '隐私政策 | 动物赛跑抽签',
    description: '动物赛跑抽签隐私政策：名字和结果只在浏览器中处理，以及 Cookie、广告与统计说明。',
    h1: '隐私政策',
    introHtml: '动物赛跑抽签（以下简称“本服务”）尊重您的隐私，仅处理下文所述的最少信息。',
    sections: [
      ['1. 收集的信息', '本服务无需注册或登录即可使用。您输入的名字只在浏览器中处理，不会发送到我们的服务器。最后一次输入的名字和最近10次结果可能会保存在本设备浏览器的本地存储（localStorage）中，方便下次使用。复制带名字的链接时，名字只写在链接里，只会分享给您发送的对象。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言和设置、展示广告以及了解使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会根据您以往访问本网站和其他网站的情况，使用 Cookie 投放广告。详情及设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 统计', '为改进服务，我们可能使用 Google Analytics（GA4），以及只按语言记录每日总数的自有统计（页面浏览、比赛开始与完成次数、星级评分）。这些信息无法识别您的个人身份。'],
      ['5. 联系我们', '如对本政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年10月22日起生效。'],
    ],
    back: '← 返回动物赛跑抽签',
  },
};
