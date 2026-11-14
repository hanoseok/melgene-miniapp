/* 随机排序 — 简体中文 (/zh/)。键结构与 en.js 相同，说明见 en.js 开头。 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@800&display=swap',
    display: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '随机排序 – 抽签排序，在线决定上台顺序',
    description: '免费在线随机排序工具：粘贴名单或用数字1到N，公平地排出汇报顺序、游戏顺序或值日表，从第1名到最后一名逐个揭晓。无需注册。',
    ogTitle: '随机排序 🔢 谁先来？',
    ogDescription: '把名单打乱成公平的顺序，再一张一张揭晓。',
  },
  siteName: '随机排序',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: '随机排序',
    h1Html: '谁<em>先来？</em>',
    hook: '写下名字，打乱一次，从第1名到最后一名的顺序就定好了。',
  },

  ui: {
    presetLabel: '这是什么顺序？',
    modeLabel: '名字或数字',
    modeNames: '名字',
    modeNumbers: '数字 1–N',
    namesLabel: '名字（每行一个）',
    namesPh: '子轩\n欣怡\n浩然\n雨萱',
    namesHint: '可以直接从微信群或表格复制粘贴，逗号、顿号也能分隔。',
    namesCount: '{n} / {max} 人',
    clear: '清空',
    numbersLabel: '到几号？',
    numbersDec: '减一',
    numbersInc: '加一',
    numbersHint: '把1到N的号码打乱，适合按学号或座位号排序。',
    numberItem: '{n}号',
    fromLabel: '揭晓方式',
    fromFirst: '从第1名',
    fromLast: '从最后',
    shuffle: '打乱顺序 🔀',
    fair: '用加密随机数只打乱一次 · 名字不会离开你的浏览器',
  },

  presets: [
    { label: '普通排序', heading: '随机顺序' },
    { label: '汇报顺序', heading: '上台汇报顺序' },
    { label: '游戏顺序', heading: '游戏出场顺序' },
    { label: '值日表', heading: '值日顺序' },
  ],

  errors: {
    namesFew: '请每行写一个名字，至少2个，或者切换到数字。',
    namesMany: '最多可以写40个名字。',
    numbersRange: '请选择2到40之间的数字。',
    badLink: '这个排序链接已损坏或不完整，无法显示。',
  },

  reveal: {
    progress: '已揭晓 {k} / {n}',
    tapHint: '点卡片或“下一个”。顺序在打乱时就已经定好了。',
    first: '开始揭晓 ▶',
    next: '下一个 ▶',
    done: '查看完整顺序',
    auto: '自动揭晓',
    autoStop: '暂停',
    showAll: '全部显示',
    soFar: '已揭晓',
    live: '第{k}位：{who}',
  },

  result: {
    sharedBadge: '🔢 收到的顺序',
    sharedNote: '这是保存在链接里的顺序，没有重新打乱。',
    summary: '共{n}人，从第1名到最后',
    copy: '复制为文字',
    copied: '已复制顺序',
    copyLink: '复制链接',
    linkCopied: '链接已复制，打开的人看到的都是同一个顺序。',
    linkTooLong: '名单太长放不进链接，已只复制页面地址。',
    edit: '修改名字',
    again: '再打乱一次 🔀',
    againShared: '重新打乱 / 我也来 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: '随机排序',
    shareText: '这是我们随机抽出的顺序 🔢',
  },

  og: {
    brand: '🔢 随机排序',
    kicker: '汇报 · 游戏 · 值日',
    title: '谁先来？公平抽签排序',
    desc: '输入名字，几秒排好第1到最后',
  },

  faq: [
    { q: '顺序真的公平吗？', a: '是的。按下打乱的那一刻，浏览器会用加密随机数（crypto.getRandomValues）配合拒绝采样和Fisher–Yates洗牌算法，每一种顺序出现的概率都一样。整个顺序在那时就定好了，卡片揭晓只是展示。' },
    { q: '和抽奖、抽签选人有什么不同？', a: '抽奖选出一个人就结束了。随机排序会给每个人从第1到最后排好位置，适合上台汇报、游戏轮次、发言顺序或值日表。' },
    { q: '从第1名揭晓还是从最后揭晓？', a: '从第1名开始，适合大家需要马上准备的时候。从最后开始更有悬念，因为第1名要到最后才揭晓。' },
    { q: '名字会被保存或上传吗？', a: '不会。名字只在你的浏览器里处理。为了下次方便，只在这台设备上保存最后一次的名单；分享链接只会把顺序带给你发送的人。' },
  ],

  privacy: {
    title: '隐私政策 | 随机排序',
    description: '随机排序隐私政策：名字和顺序只保留在你的浏览器中，以及Cookie、广告与统计的说明。',
    h1: '隐私政策',
    introHtml: '随机排序（以下简称“本服务”）尊重你的隐私，只处理下面列出的最少信息。',
    sections: [
      ['1. 收集的信息', '本服务无需账号或登录即可使用。你输入的名字或数字以及打乱后的顺序只在浏览器中处理，不会发送到我们的服务器。最后一次的名单保存在本设备浏览器的本地存储中。复制排序链接时，顺序会写进链接本身，只会分享给你发送的人。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言和设置、展示广告并了解使用情况。你可以在浏览器设置中拒绝或删除，但部分功能可能无法正常工作。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会根据你以往访问本网站和其他网站的记录，使用 Cookie 投放广告。详情和设置请见<a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及只保留各语言每日总数（页面浏览、开始和完成次数）的自有统计。这些都不会识别你的个人身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年11月15日起生效。'],
    ],
    back: '← 返回随机排序',
  },
};
