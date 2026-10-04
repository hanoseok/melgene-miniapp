/* 抛硬币 — 简体中文。键结构与 en.js 相同(见注释)。 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe'",
    displayWeight: 400,
    sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '抛硬币：在线决定正面还是反面',
    description: '拿不定主意就抛硬币，在线决定正面还是反面。两面的名字可以自己改成任何选项，也可以掷1到3个骰子。免费，无需注册。',
    ogTitle: '抛硬币 🪙 正面反面 · 掷骰子',
    ogDescription: '抛一枚硬币或掷骰子，马上做决定。',
  },
  siteName: '抛硬币',
  privacyLink: '隐私政策',

  start: {
    badge: '🪙 最公平的决定方式',
    h1Kicker: '抛硬币',
    h1Html: '正面还是反面？<br>让<em>硬币</em>来决定',
    hook: '写下两个选项，抛一次硬币，落在哪边就选哪个。也可以改掷骰子。',
    facts: '硬币和骰子 · 两面名字随便改 · 每次都公平',
    start: '开始抛 →',
  },

  tool: {
    title: '来抛一下',
    tabCoin: '硬币',
    tabDice: '骰子',
    namesLabel: '给两面起名字',
    namesHint: '默认是“正面”和“反面”。可以改成你的选项，比如火锅和烧烤。',
    sideA: '正面',
    sideB: '反面',
    fieldA: '第一面的名字',
    fieldB: '第二面的名字',
    throwCoin: '抛硬币 🪙',
    diceLabel: '掷几个骰子？',
    rollDice: '掷骰子 🎲',
  },

  count: { other: '本次已抛 {n} 次' },
  countDice: { other: '本次已掷 {n} 次' },

  result: {
    titleCoin: '结果是',
    titleDice: '点数是',
    sum: '合计 {n}',
    tallyTitle: '本次记录',
    tallySide: '{name} {n}',
    againCoin: '再抛一次',
    againDice: '再掷一次',
    change: '返回设置',
    shareTitle: '抛硬币 – 正面还是反面',
    shareTextCoin: '我抛了一枚硬币，结果是「{name}」🪙',
    shareTextDice: '我掷了骰子，点数是 {n} 🎲',
  },

  og: {
    brand: '🪙 抛硬币',
    kicker: '正面还是反面 · 硬币和骰子',
    title: '正面还是反面？',
    desc: '抛硬币 · 掷骰子 · 一次公平地决定',
  },

  faq: [
    { q: '抛硬币怎么用？', a: '需要的话先给两面起名字，然后点“抛硬币”。结果会先抽出来，硬币只是转到那一面给你看，所以屏幕上显示的就是真实结果。切换到“骰子”标签可以掷1到3个六面骰子。' },
    { q: '真的公平吗？', a: '是的。结果由浏览器的加密随机数(crypto.getRandomValues)加拒绝抽样得出，正面和反面、骰子的每一点概率都完全相同。旋转的硬币和滚动的骰子只是动画效果。' },
    { q: '可以不用正面反面，换成自己的选项吗？', a: '可以。在硬币上方的输入框里填两个名字就行，比如“火锅”和“烧烤”，结果会显示胜出一方的名字。把输入框清空就会恢复默认名字。' },
    { q: '结果页的次数是什么意思？', a: '是你打开这个页面后亲手抛(掷)的次数，以及每一面出现的次数。刷新页面会重新计数，也不会发送到任何地方。' },
  ],

  privacy: {
    title: '隐私政策 | 抛硬币',
    description: '抛硬币的隐私政策：你输入的名字只在浏览器中处理，以及 Cookie、广告和访问统计的说明。',
    h1: '隐私政策',
    introHtml: '抛硬币(以下简称“本服务”)尊重您的隐私，仅按以下方式处理必要的最少信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录即可使用。您输入的名字和抛出的结果只在您的浏览器中处理，不会发送到我们的服务器。但在使用过程中，下列信息可能会被自动收集。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言设置、展示广告以及分析使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能因此无法正常使用。'],
      ['3. 广告服务(Google AdSense)', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据您此前访问本网站和其他网站的记录投放广告。您可以在 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a> 中了解详情并更改偏好。'],
      ['4. 访问统计', '为改进服务，我们可能使用 Google Analytics(GA4)以及只保留每日各语言合计数的自有统计(浏览量、抛掷次数、星级评分)。这些数据不会识别您的个人身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年10月5日起生效。'],
    ],
    back: '← 返回抛硬币',
  },
};
