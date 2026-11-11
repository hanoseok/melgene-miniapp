/* 惩罚翻牌 — 简体中文 (/zh/ 目录，语言由 Cookie 与已保存的设置决定)
 * 逻辑在 penalty-core.js，页面所有文字只写在这个文件里。以 Html 结尾的键可含 HTML（仅 <br>、<em>、<a>）。
 * 页面：开始（一句话介绍 + 开始按钮 + 广告）→ 设置（人数、惩罚牌数、惩罚内容、姓名）→ 翻牌（背面朝上的牌）→ 结束（谁受罚 + 公共结束页）。
 * 常见问题只在公共结束页显示。{n} {k} 等占位符保持原样。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap',
    display: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '惩罚 抽签 翻牌 — 聚会惩罚怎么定',
    description: '聚会、喝酒、年会时决定惩罚的免费翻牌工具。选好人数和惩罚牌数，一张张翻开背面的牌，看看这一轮轮到谁。无需注册。',
    ogTitle: '惩罚翻牌 🃏 翻开卡牌，决定惩罚',
    ogDescription: '聚会惩罚随机抽签，在浏览器里公平洗牌。',
  },
  siteName: '惩罚翻牌',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: '惩罚翻牌',
    h1Html: '一张张翻开牌<br><em>决定谁受罚</em>',
    hook: '每人面前一张背面朝上的牌。其中几张藏着惩罚，其余安全。这一轮轮到谁？',
  },

  ui: {
    playersLabel: '参加人数',
    playersDec: '减少一人',
    playersInc: '增加一人',
    penaltyLabel: '惩罚牌张数',
    penaltyDec: '减少一张惩罚牌',
    penaltyInc: '增加一张惩罚牌',
    penaltyHint: '默认约为人数的三分之一，可以自己改。',
    itemsLabel: '惩罚内容',
    itemsHint: '每行一个惩罚。惩罚牌会从这个列表里随机、不按顺序抽取。可以随意修改。',
    itemsPh: '唱一首歌\n说一句祝酒词',
    resetItems: '恢复示例惩罚',
    itemsCount: '{count} 条',
    namesBtn: '+ 填写参加者姓名（可选）',
    namesLabel: '姓名（按翻牌顺序）',
    namesPh: '小明\n小红\n阿强',
    namesHint: '留空时显示为“1号、2号、3号”。姓名少于人数也没关系。',
    start: '洗牌 🃏',
    begin: '开始',
    setupTitle: '设置',
    fair: '在浏览器中用加密随机数洗一次牌 · 不会把任何内容发送到服务器',
  },

  errors: {
    playersRange: '参加人数请选择 2 到 12 人。',
    penaltiesRange: '惩罚牌可以从 1 张到与人数相同的张数。',
    itemsEmpty: '请至少写一条惩罚内容。',
    itemsTooMany: '惩罚内容最多 30 条。',
    namesTooMany: '姓名比人数多。请删除一些姓名或增加人数。',
    badLink: '这个结果链接已损坏或不完整，无法显示任何内容。',
  },

  draw: {
    progress: '已翻 {done}/{n} 张',
    left: '剩余 {n} 张',
    turn: '下一位：{who}',
    turnNum: '第 {k} 位',
    numbered: '{k}号',
    pick: '随便点一张背面朝上的牌。所有牌在洗牌时就已经定好了。',
    gridAria: '背面朝上的惩罚牌',
    cardAria: '第 {k} 张牌，背面',
    penaltyTag: '受罚！',
    safeTag: '安全',
    revealPenalty: '{who}：{text}',
    revealSafe: '{who} 这次安全',
    revealNone: '点一张牌，结果会显示在这里。',
    flipAll: '一次全部翻开',
    reshuffle: '重新洗牌',
    seeResults: '查看结果',
    done: '所有牌都翻开了。',
    live: '{who}：{text}',
    liveSafe: '{who}：安全',
  },

  result: {
    heading: '本轮惩罚结果',
    sharedBadge: '🃏 分享的结果',
    sharedNote: '这是链接里保存的结果，不会重新洗牌。',
    summary: '受罚 {k} 人 · 安全 {s} 人',
    summaryMany: '受罚 {k} 人 · 安全 {s} 人',
    listHead: '受罚的人和惩罚',
    safeList: '安全：{names}',
    copy: '复制为文字',
    copied: '结果已复制',
    copyLink: '复制结果链接',
    linkCopied: '链接已复制。打开的人会看到完全相同的结果。',
    again: '我也来试试',
    edit: '修改设置',
    textTitle: '🃏 惩罚翻牌 结果',
    textSafe: '安全',
    shareTitle: '惩罚翻牌',
    shareText: '一起翻开卡牌，决定聚会惩罚 🃏',
  },

  og: {
    brand: '🃏 惩罚翻牌',
    kicker: '聚会惩罚抽签',
    title: '翻开卡牌，决定惩罚',
    desc: '随机公平，几秒钟就能定',
    sample: '唱一首歌',
  },

  defaults: [
    '唱一首歌（只唱副歌也行）',
    '说一句简短的祝酒词',
    '做一个可爱的撒娇姿势',
    '给左边的人倒一杯水',
    '跳 10 秒机器人舞',
    '自我介绍再加一句',
    '播放右边的人选的一首歌',
    '讲一个关于自己的笑话',
    '用电影预告片的声音读下一句话',
    '一次猜中下一位的最爱歌曲',
  ],

  faq: [
    { q: '洗牌真的公平吗？', a: '是的。点击洗牌时，牌会用浏览器的加密随机数（crypto.getRandomValues）一次性排好，使用拒绝采样和 Fisher–Yates 洗牌法。那一刻所有牌都已确定，所以点哪一张概率都一样。' },
    { q: '惩罚的文字是怎么来的？', a: '每张惩罚牌会从惩罚列表中随机、不按顺序抽取一条。如果列表比惩罚牌少，就会把打乱的列表重复使用。洗牌之前，可以先改成适合你们的内容。' },
    { q: '可以拒绝惩罚吗？', a: '可以。惩罚只是为了好玩，任何时候都可以拒绝。如果有人不想做，可以换一条内容，或者大家一起选一个更轻松的。' },
    { q: '怎样把结果分享给群里的朋友？', a: '在结果页点“复制为文字”可以粘贴到聊天里，或者点“复制结果链接”。链接里保存了这次的结果，打开的人会看到同样的牌，不会重新抽取。' },
  ],

  privacy: {
    title: '隐私政策 | 惩罚翻牌',
    description: '惩罚翻牌的隐私政策：姓名、惩罚内容和结果只保存在您的浏览器中，并说明 Cookie、广告与统计。',
    h1: '隐私政策',
    introHtml: '惩罚翻牌（以下简称“本服务”）尊重您的隐私，仅处理以下说明的最少量信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录即可使用。您输入的参加者姓名、惩罚内容和结果只在您的浏览器中处理，不会发送到我们的服务器。您最近一次的设置会保存在设备的浏览器本地存储中，可随时在浏览器中删除。复制结果链接时，姓名、惩罚内容和结果会写入链接本身，只有您发送链接的对象才能看到。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言和设置、显示广告，以及了解服务的使用情况。您可以在浏览器设置中拒绝或删除，但这样部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会根据您之前访问本站及其他网站的记录，使用 Cookie 投放广告。更多信息及偏好设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及我们自己的汇总计数器，后者只按语言保存每日总数（页面访问、开始与完成次数）。这些数据都无法识别您的个人身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自 2026 年 11 月 11 日起生效。'],
    ],
    back: '← 返回惩罚翻牌',
  },
};
