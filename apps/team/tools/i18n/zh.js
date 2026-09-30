/* 随机分组工具 — 简体中文 (/zh/)
 * 键结构与 en.js 相同。队伍动物 id、表情、颜色和洗牌逻辑在 team-core.js。
 */
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
    title: '随机分组工具 - 在线公平分队',
    description: '随机分组工具：粘贴名单，选择组数或每组人数，一键公平随机分组，各组人数最多差1人。组长分到不同组，结果用链接原样分享。免费，无需注册。',
    ogTitle: '随机分组工具 🎲 在线公平分队',
    ogDescription: '粘贴名单，点一下打乱，几秒就分好组，结果还能用链接原样分享。',
  },
  siteName: '随机分组工具',
  privacyLink: '隐私政策',

  start: {
    badge: '🎲 分组不再吵架',
    h1Kicker: '随机分组工具',
    h1Html: '谁会和你<br><em>分到一组</em>？',
    hook: '粘贴名单，点一下打乱，让运气来分组。公平公正，没人有意见。',
    facts: '最多60人 · 组长分开 · 结果可分享',
    start: '开始分组 →',
  },

  input: {
    title: '谁来参加？',
    namesLabel: '名单',
    namesHint: '每行一个名字，或用逗号隔开。组长在名字前加 * 。',
    placeholder: '王伟\n李娜\n*张敏\n刘洋，陈静，杨磊',
    sample: '示例名单',
    clear: '清空',
    tooMany: '只使用前 {max} 个名字。',
    needMore: '请至少输入 2 个名字。',
    modeLabel: '分组方式',
    modeTeams: '按组数',
    modeSize: '按每组人数',
    minus: '减少',
    plus: '增加',
    previewEq: '{k}组 × 每组{size}人',
    previewRange: '{k}组 × 每组{min}–{max}人',
    leaders: '组长（*）分到不同组',
    leadersCount: '已标记组长：{n}人',
    leadersNone: '在名字前加 * 就是组长',
    shuffle: '随机分组 🎲',
  },

  result: {
    shuffling: '正在打乱…',
    title: '分组结果',
    sharedTitle: '分享来的分组',
    sharedNote: '有人把这个分组结果分享给了你。',
    captain: '组长',
    rename: '换队名',
    again: '重新分组',
    edit: '修改名单',
    copy: '复制为文字',
    copied: '分组已复制！',
    makeOwn: '我也来分组',
    badShare: '这个链接无效，在这里重新分组吧。',
    shareTitle: '随机分组工具 - 在线公平分队',
    shareText: '我们随机分好的{k}个组 🎲',
  },

  people: { other: '{n}人' },

  teams: {
    tiger: '老虎队',
    eagle: '雄鹰队',
    shark: '鲨鱼队',
    wolf: '狼队',
    fox: '狐狸队',
    panda: '熊猫队',
    lion: '狮子队',
    owl: '猫头鹰队',
    dolphin: '海豚队',
    bear: '棕熊队',
    rabbit: '兔子队',
    penguin: '企鹅队',
    dragon: '飞龙队',
    unicorn: '独角兽队',
    octopus: '章鱼队',
    frog: '青蛙队',
    koala: '考拉队',
    parrot: '鹦鹉队',
    bee: '蜜蜂队',
    turtle: '海龟队',
  },

  sample: ['王伟', '李娜', '张敏', '刘洋', '陈静', '杨磊', '赵婷', '黄强', '周杰', '吴芳', '徐浩', '孙丽'],

  og: {
    brand: '🎲 随机分组工具',
    kicker: '输入名单 · 自动分组',
    title: '谁会和你分到一组？',
    desc: '几秒公平分组 · 组长分开 · 结果可分享',
  },

  faq: [
    { q: '怎样把名单分成几组？', a: '每行输入一个名字，或用逗号隔开（最多60人）。选好组数或每组人数，点“随机分组”就行。各组人数最多只差1人。' },
    { q: '分组真的公平吗？', a: '是的。我们用浏览器的密码学随机数（crypto.getRandomValues）和 Fisher–Yates 洗牌算法打乱，每一种分法出现的概率完全相同。我们和任何人都无法操控结果。' },
    { q: '组长怎么设置？', a: '在名字前加 * 标记组长，并打开“组长分到不同组”。系统会先把组长每组分一个，再把其他人打乱放进去。组长比组数多时，会有组分到两位组长。' },
    { q: '分享链接里有什么？', a: '链接本身就带着名单和分组结果，打开的人看到的是完全一样的结果。服务器上不保存任何内容。你上次输入的名单只保存在这个浏览器里，方便下次不用重新输入。' },
  ],

  privacy: {
    title: '隐私政策 | 随机分组工具',
    description: '随机分组工具隐私政策：名单只在浏览器中处理，Cookie、广告与访问统计说明。',
    h1: '隐私政策',
    introHtml: '随机分组工具（以下简称“本服务”）尊重您的隐私，仅按以下政策处理必要的最少信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录即可使用。您输入的名字只在您的浏览器中处理，不会发送到我们的服务器。分享结果时，名字和分组会写进链接本身，任何拿到链接的人都能看到。使用过程中可能会自动收集以下信息。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和上次输入的名单、展示广告以及了解服务的使用情况。您可以在浏览器设置中拒绝或删除，但部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据您对本网站及其他网站的访问记录投放广告。详情及偏好设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 访问统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及只按日期、语言记录总数的自有统计（浏览量、分组次数、星级评分），不会收集可识别个人身份的信息。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自 2026年10月1日起生效。'],
    ],
    back: '← 返回随机分组工具',
  },
};
