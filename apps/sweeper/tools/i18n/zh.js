/* 扫雷 — zh (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&family=ZCOOL+QingKe+HuangYou&display=swap',
    display: "'ZCOOL QingKe HuangYou', 'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: '扫雷 – 免费在线扫雷游戏',
    description: '在线玩扫雷：根据数字推理地雷位置，打开所有安全格子。初级、中级、高级三种难度，第一下一定安全。免费，无需下载。',
    ogTitle: '扫雷 💣 你能多快清完雷区？',
    ogDescription: '浏览器里的经典扫雷：三种尺寸，第一步必定安全，还有计时等你挑战。',
  },
  siteName: '扫雷',
  privacyLink: '隐私政策',
  start: {
    badge: '💣 经典益智 · 3个难度',
    h1Kicker: '扫雷',
    h1Html: '避开地雷<br><em>清空</em>整片雷区',
    hook: '数字告诉你周围藏着几颗雷。仔细推理，给危险的格子插上旗子，在时间溜走之前清完整个雷区。',
    how: { reveal: '点按翻开', flag: '长按插旗', chord: '点数字翻开周围' },
    facts: '第一下一定安全',
    diffLabel: '选择难度',
    diffs: { beginner: '初级', intermediate: '中级', expert: '高级' },
    start: '开始游戏 →',
  },
  play: {
    mines: '地雷',
    time: '用时',
    digMode: '翻开',
    flagMode: '插旗',
    boardAria: '扫雷棋盘。点按格子翻开，长按或使用插旗模式标记地雷。',
    paused: '已暂停 · 点按继续',
    aHidden: '未翻开的格子',
    aFlag: '已插旗的格子',
    aMine: '地雷',
    aNum: '周围有{n}颗雷',
  },
  result: {
    win: '雷区清空！',
    lose: '轰！',
    sec: '秒',
    timeLabel: '用时',
    clearedLabel: '翻开比例',
    best: '最佳：{t}',
    newBest: '刷新最佳纪录！',
    top: '前{n}%',
    beat: '比{pct}%的玩家更快',
    beatAll: '比目前所有成绩都快',
    others: '与其他{n}个成绩比较',
    comparing: '正在与其他玩家比较…',
    retry: '再来一局',
    shareTitle: '扫雷 – 你能清完雷区吗？',
    shareWin: '我用{time}秒通关了扫雷{diff}！💣 你能超过我吗？',
    shareLose: '扫雷{diff}翻开了{pct}%就踩雷了 💥 你能做得更好吗？',
  },
  og: { brand: '💣 扫雷', defaultKicker: '免费益智游戏', defaultTitle: '你能清完雷区吗？', defaultDesc: '插旗标雷 · 挑战计时' },
  faq: [
    {
      q: '扫雷怎么玩？',
      a: '点按格子把它翻开。数字表示周围八个格子里藏着几颗雷。根据数字推理出雷的位置并插旗，翻开所有不是雷的格子就赢了。',
    },
    {
      q: '手机上怎么插旗？',
      a: '长按格子片刻，或者把棋盘上方的“翻开/插旗”按钮切换成插旗模式再点按。在电脑上也可以右键，或在选中的格子上按 F 键。',
    },
    {
      q: '点按数字会发生什么？',
      a: '如果数字周围插的旗子数量与数字相同，点按这个数字就能一次翻开周围剩下的格子。如果有旗子插错了，那一格会爆炸，所以先确认再点。',
    },
    {
      q: '第一下真的一定安全吗？',
      a: '是的。地雷在你第一次点按之后才布置，不会放在那一格及其紧邻的格子上，所以一开始总能翻开一小片。计时从第一下开始，离开标签页会自动暂停。',
    },
  ],
  privacy: {
    "title": "隐私政策 | 扫雷",
    "description": "扫雷隐私政策：匿名用时、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "扫雷（以下简称“本服务”）尊重您的隐私，只处理下文所述的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。赢得一局后，只会把难度和用时（按 0.5 秒取整）以匿名统计的形式发送到服务器，不附带姓名或任何个人身份信息。使用本服务时，可能会按下文所述自动收集部分信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和最高分、展示广告以及了解使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能因此无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您过去访问本网站和其他网站的情况展示广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为了改进本服务，我们可能使用 Google Analytics（GA4）以及只保留各语言每日合计（页面浏览、开始与完成的游戏、星级评分）的自有统计。这些信息无法识别您的个人身份。"
      ],
      [
        "5. 联系方式",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "6. 生效日期",
        "本政策自 2026 年 10 月 10 日起生效。"
      ]
    ],
    "back": "← 返回扫雷"
  },
};
