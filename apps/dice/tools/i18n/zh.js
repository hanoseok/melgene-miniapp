/* Dice Roller — 简体中文。键结构与 en.js 相同(见注释)。 */
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
    title: '在线掷骰子 – 骰子模拟器',
    description: '在线掷骰子，点一下就行。一次可掷1到6个骰子，除了经典的d6，还能选桌游常用的d4、d8、d10、d12和d20，点数总和立刻显示。公平随机，免费，无需注册。',
    ogTitle: '掷骰子 🎲 在线骰子模拟器',
    ogDescription: '一次掷1到6个骰子，d6到d20都有，点一下就出总和。',
  },
  siteName: '掷骰子',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: '在线掷骰子',
    h1Html: '摇一摇，掷出去<br>让<em>骰子</em>来决定',
    hook: '选好骰子数量和种类，掷就完事了。玩桌游、跑团，或者决定谁去洗碗，都用得上。',
  },

  ui: {
    dieLetter: 'd',
    countLabel: '掷几个骰子？',
    typeLabel: '骰子种类',
    typeHint: 'd6就是最常见的六面骰。d4到d20是跑团等桌游用的。',
    roll: '掷骰子 🎲',
    rolling: '骰子滚动中…',
    keyHint: '小提示：按空格键也能掷',
    idle: '准备好了就掷吧',
    total: '总和 {n}',
    trayLabel: '骰盘',
    live: '掷出了 {values}，总和 {total}。',
    liveOne: '掷出了 {values}。',
    fair: '每一面出现的概率完全相同（加密级随机数）',
  },

  history: {
    title: '最近10次结果',
    note: '只在本页面打开期间保留。',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: '再掷一次',
    shareTitle: '掷骰子 – 在线掷骰子',
    shareText: '我掷了{dice}，结果是 {values} = {total} 🎲',
    shareTextOne: '我掷了{dice}，结果是 {values} 🎲',
  },

  og: {
    brand: '🎲 掷骰子',
    kicker: '1到6个骰子 · d4到d20',
    title: '在线掷骰子',
    desc: '点一下，每个骰子的点数和总和一目了然',
  },

  faq: [
    { q: '掷骰子的结果真的随机、公平吗？', a: '是的。每个结果都来自浏览器的加密级随机数生成器（crypto.getRandomValues），并使用拒绝采样，所以没有哪一面会比其他面哪怕多一点点机会。结果在动画开始前就已经确定，滚动效果只是为了好看。' },
    { q: '一次最多能掷几个骰子？', a: '每次可以掷1到6个，种类相同。骰盘会显示每个骰子的点数和总和，最近10次结果在页面打开期间会留在一个小列表里。' },
    { q: 'd4、d8、d10、d12和d20是什么？', a: '它们分别是4面、8面、10面、12面和20面的骰子，常用于《龙与地下城》等桌面角色扮演游戏（跑团）。d后面的数字表示面数，所以d20会掷出1到20，2d6表示两个六面骰。' },
    { q: '玩桌游的时候能用吗？', a: '当然可以。骰子丢了、盒子里的骰子不够用，或者和朋友视频通话一起玩的时候都可以用。用键盘的话，按空格键就能快速掷骰。' },
  ],

  privacy: {
    title: '隐私政策 | 掷骰子',
    description: '掷骰子的隐私政策：掷骰结果只保留在你的浏览器中；以及关于Cookie、广告和统计的说明。',
    h1: '隐私政策',
    introHtml: '掷骰子（以下简称“本服务”）尊重您的隐私，仅处理下文所述的最少信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册账号或登录即可使用。您的骰子设置和结果仅在您的浏览器中处理，不会发送到我们的服务器。但在您使用本服务的过程中，可能会自动收集以下所述的部分信息。'],
      ['2. Cookie及类似技术', '本服务可能使用Cookie和浏览器的本地存储来记住您的语言、展示广告并了解本服务的使用情况。您可以在浏览器设置中拒绝或删除它们；这样做可能导致部分功能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过Google AdSense展示广告。Google及其合作伙伴可能会使用Cookie，根据您以往对本网站及其他网站的访问来投放广告。您可以在<a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>中了解详情并更改偏好。'],
      ['4. 统计', '为了改进本服务，我们可能会使用Google Analytics（GA4）以及仅按语言保存每日总数（页面浏览量、掷骰次数、星级评分）的自有统计计数器。这些信息都不会识别您的个人身份。'],
      ['5. 联系我们', '如果您对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年10月9日起生效。'],
    ],
    back: '← 返回掷骰子',
  },
};
