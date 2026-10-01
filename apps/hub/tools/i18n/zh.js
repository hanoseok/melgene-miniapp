/* Melgene 小应用 门户（hub）— 简体中文 (/zh/)。
 * privacy.introHtml 和 privacy.sections 正文为 HTML，其余为纯文本。
 * ui 供 script.js 使用，以 window.PAGE_I18N 内联到页面。
 * 禁止剧透：推荐文案只写每个应用的玩法和氛围，不引用实际题目或结果。 */
module.exports = {
  siteName: 'Melgene 小应用',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.zh.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: '小应用' },
  // 简体中文用系统黑体（苹方 / 微软雅黑 / 思源黑体）。Pretendard 缺少简体字（如「应」），不能排在前面。
  typography: {
    sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Source Han Sans SC', 'Pretendard', -apple-system, sans-serif",
    display: 'var(--font-sans)',
  },
  meta: {
    title: '免费小游戏·心理测试 | Melgene 小应用',
    description:
      '免下载、免注册，打开浏览器就能玩的免费小游戏和心理测试合集。鬼脚图抽签、转盘、前世测试等，每个小应用1分钟左右就能玩完。',
    ogTitle: 'Melgene 小应用｜免费小游戏·心理测试',
    ogDescription: '小游戏、心理测试、趣味创作，免下载免注册，点开就能玩，1分钟就能玩完。',
  },
  homeAria: 'Melgene 小应用首页',
  // 页眉下方的小号 <h1>：品牌名 + 真实搜索词
  h1: '免费小游戏·心理测试',
  // 今日小应用（轮播）。id 为 SITE_CONFIG.SITES 的 id（不存在的会跳过），3–6 个。
  curation: {
    h2: '今日小应用',
    items: [
      {
        id: 'merge',
        kicker: '小游戏',
        headline: '相同的碰一起，越合越大',
        blurb: '两个一样的相碰就会合成更大的，别让罐子溢出！',
      },
      {
        id: 'costume',
        kicker: '性格测试',
        headline: '今年万圣节你该扮成谁？',
        blurb: '回答几个情景题，找到最适合你的装扮。',
      },
      {
        id: 'ghost',
        kicker: '动手做',
        headline: '做一只专属小幽灵',
        blurb: '挑形状、表情和帽子，保存或发给朋友。',
      },
      {
        id: 'team',
        kicker: '随机分组',
        headline: '一键公平随机分组',
        blurb: '输入名字，选好组数，一点就分。',
      },
      {
        id: 'candy-catch',
        kicker: '1分钟万圣节游戏',
        headline: '接住从天而降的糖果！',
        blurb: '躲开蜘蛛，只收糖果，挑战最高分。',
      },
      {
        id: 'aura',
        kicker: '今日心理测试',
        headline: '你的气场是什么颜色？',
        blurb: '回答几个日常情境题，测出你的灵气颜色。',
      },
    ],
  },
  browse: {
    h2: '全部小应用',
    searchLabel: '搜索小应用',
    searchPlaceholder: '搜索小应用',
    catLabel: '分类',
    sortLabel: '排序',
  },
  ui: {
    cats: { all: '全部', game: '游戏', test: '心理测试', create: '创作', vote: '投票' },
    sorts: { popular: '最热门', rating: '评分最高', newest: '最新上线' },
    totalHtml: '累计游玩 <strong>{n} 次</strong>',
    play: '马上玩',
    newBadge: 'NEW',
    plays: '{n}次游玩',
    ratingAria: '评分 {avg}（满分 5 分），共 {votes} 人评分',
    prev: '上一个推荐',
    next: '下一个推荐',
    goTo: '查看第 {n} 个推荐',
    count: '{n}个',
    countOne: '1个',
    emptyCat: '这个分类暂时还没有小应用。',
    emptySearch: '没有找到与“{q}”相关的小应用，换个关键词或查看全部吧。',
    reset: '查看全部',
  },
  faqTitle: '常见问题',
  // 显示在门户底部（并输出 FAQPage JSON-LD）。简短，不剧透。
  faq: [
    [
      'Melgene 小应用是什么？',
      '这是一个免费小应用合集：可以和朋友比成绩、决定午饭吃什么的小游戏，无聊时测一测的心理测试，还有输入几项信息就能生成专属作品的创作应用。每个1分钟左右就能玩完，直接在浏览器里打开。',
    ],
    [
      '需要下载安装或注册吗？',
      '不需要。所有小游戏和心理测试都是网页，手机、平板、电脑的浏览器都能直接打开，把链接发给朋友，对方点开就能玩。常玩的话，可以用浏览器菜单里的“添加到主屏幕”，像应用一样放在桌面上。',
    ],
    [
      '会收集个人信息吗？',
      '不会。我们不会询问你的姓名、邮箱或手机号。爱心、评分和游玩次数都是按应用统计的匿名总数；只有创建分享链接时，才会保存显示该结果所需的输入内容。',
    ],
    [
      '多久上新一次？',
      '我们会根据当下的热门话题，持续上新小游戏和心理测试。新上线的应用会显示两周的 NEW 标记，按“最新上线”排序时排在最前面。',
    ],
  ],
  privacyLink: '隐私政策',
  og: {
    h1Html: '免费小游戏<br>心理测试合集',
    tag: '免下载，免注册，点开就能玩',
  },
  privacy: {
    title: '隐私政策 | Melgene 小应用',
    description: 'Melgene 小应用隐私政策：广告（Google AdSense）、匿名的游玩次数·爱心·评分、Cookie 与浏览器存储的使用说明。',
    h1: '隐私政策',
    introHtml:
      'Melgene 小应用（以下简称“本服务”）是无需注册即可使用的小应用合集。本服务尊重你的隐私，仅按以下说明处理运营所需的最少信息。',
    sections: [
      [
        '1. 我们不收集的信息',
        '本服务不会询问或收集姓名、邮箱、手机号、账号等个人信息。你在各个小应用中输入的内容，默认只在你自己的浏览器内处理。',
      ],
      [
        '2. 匿名的游玩次数、爱心和评分（Supabase）',
        '为了显示游玩次数、爱心和评分，我们只在 Supabase（数据库服务）中保存以下数据：每个小应用的累计总数（游玩次数和爱心数）、每个小应用的星级评分（1–5），以及按日期、小应用和语言统计的每日总数（页面浏览、完成次数、是否展示了广告）。为避免同一次访问在30秒内被重复计数，服务器会短暂保存经单向哈希处理的 IP 地址，并通常在一天内自动删除。为了让每个浏览器的评分只计一次，浏览器会生成一个随机标识，服务器只保存它的哈希值。创建分享链接时，只保存通过该链接显示同一结果所需的输入内容。以上数据均不会用于识别你的身份。',
      ],
      [
        '3. 广告（Google AdSense 自动广告）',
        '本服务通过 Google AdSense 自动广告展示广告，广告位置由 Google 自动决定。Google 及其合作伙伴可能使用 Cookie，根据你的兴趣展示广告。你可以在 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>中查看和更改个性化广告设置。',
      ],
      [
        '4. 访问统计（Google Analytics）',
        '本服务可能使用 Google Analytics（GA4）进行访问统计并改进服务。这些数据仅用于统计，不会识别你的个人身份。',
      ],
      [
        '5. Cookie 与浏览器存储',
        '你选择的语言、上次查看的分类和排序、你给出的评分等设置，只保存在你的浏览器（localStorage 以及记住语言的 Cookie）中。你可以随时在浏览器设置中删除或拒绝 Cookie 和网站数据。',
      ],
      ['6. 联系我们', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['7. 生效日期', '本政策自2026年9月26日起生效。'],
    ],
    back: '← 返回 Melgene 小应用',
  },
};
