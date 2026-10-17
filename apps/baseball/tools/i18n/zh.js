/* 猜数字 (숫자 야구 / number baseball) — zh
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=ZCOOL+KuaiLe&display=swap",
    "display": "'ZCOOL KuaiLe', 'Fredoka'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "猜数字 1A2B – 数字猜谜游戏",
    "description": "免费猜数字（1A2B / Bulls and Cows）：根据“位置对、数字对”的提示，猜出电脑设定的 3 位或 4 位不重复数字，分难度记录最佳成绩。",
    "ogTitle": "猜数字 ⚾ 你能猜出秘密数字吗？",
    "ogDescription": "一个各位数字都不重复的秘密数字。看提示一步步推理，用最少的次数猜中。"
  },
  "siteName": "猜数字 1A2B",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "⚾ 数字棒球 · 1A2B",
    "h1Kicker": "猜数字",
    "h1Html": "猜出秘密<br><em>数字</em>吧",
    "hook": "电脑想好了一个各位数字都不重复的秘密数字。输入你的猜测，根据提示一步步推理出答案。",
    "how": "位置对＝数字和位置都对 · 数字对＝数字对位置不对 · 全错＝都不对",
    "levelLabel": "选择位数",
    "levels": {
      "d3": "3 位数",
      "d4": "4 位数"
    },
    "levelSub": {
      "d3": "经典",
      "d4": "进阶"
    },
    "timer": "显示计时",
    "start": "开始 →"
  },
  "play": {
    "tries": "次数",
    "time": "用时",
    "slotAria": "第 {n} 位",
    "enter": "猜",
    "del": "删除",
    "giveUp": "放弃",
    "giveUpSure": "再点一次显示答案",
    "historyTitle": "我的猜测",
    "historyEmpty": "输入数字，开始第一次猜测。",
    "errLen": "请输入 {n} 位数字",
    "errDup": "数字不能重复",
    "errAgain": "这个数字已经猜过了",
    "strike": "位置对",
    "ball": "数字对",
    "out": "全错",
    "legend": "位置对：数字和位置都对 · 数字对：数字对位置不对"
  },
  "result": {
    "done": "猜对了！",
    "gaveUp": "答案是",
    "triesCaption": "次数",
    "timeLabel": "用时",
    "secretLabel": "秘密数字",
    "sec": "秒",
    "best": "本难度最佳：{n} 次",
    "newBest": "刷新个人最佳！",
    "top": "前 {n}%",
    "beat": "次数比 {pct}% 的玩家更少",
    "beatAll": "次数比目前所有记录都少",
    "others": "已与本难度的另外 {n} 条记录比较",
    "comparing": "正在与其他玩家比较…",
    "retry": "再来一局",
    "shareTitle": "猜数字 – 你能猜出秘密数字吗？",
    "shareText": "我用 {n} 次猜出了 {d} 位数字 ⚾ 你能比我更少吗？"
  },
  "og": {
    "brand": "⚾ 猜数字",
    "defaultKicker": "免费猜数字游戏",
    "defaultTitle": "你能猜出秘密数字吗？",
    "defaultDesc": "位置对 · 数字对 · 全错"
  },
  "faq": [
    {
      "q": "猜数字（1A2B）怎么玩？",
      "a": "电脑会想好一个各位数字都不相同的秘密数字。输入位数相同、也不重复的数字，然后点“猜”。数字和位置都对是“位置对”（A），只有数字对是“数字对”（B），都不对就是“全错”。所有位置都对就赢了。"
    },
    {
      "q": "秘密数字能以 0 开头吗？数字会重复吗？",
      "a": "可以以 0 开头，比如 072，但同一个数字不会出现两次。你输入的猜测也不能有重复数字。已经猜过的数字不会再计数，只有新的猜测才会增加次数。"
    },
    {
      "q": "有提示按钮或次数限制吗？",
      "a": "没有提示，也没有次数限制。这是纯推理游戏，用的次数越少越好。卡住了可以点“放弃”查看答案并开始新的一局。计时器默认不显示，打开后才会出现。"
    },
    {
      "q": "3 位数和 4 位数有什么区别？",
      "a": "3 位数共有 720 种可能的秘密数字，4 位数多得多，每一种出现的概率相同。最佳成绩按难度分别保存在这个浏览器里。"
    },
    {
      "q": "“前 %”是怎么算出来的？",
      "a": "猜对后，会把你的次数与同一难度其他玩家的真实成绩比较。如果还没有其他成绩可比，就不会显示。放弃的局不计入。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 猜数字",
    "description": "猜数字（1A2B）游戏隐私政策：匿名记录、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "猜数字（以下简称“本服务”）尊重您的隐私，仅处理下文所述的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。猜对一局后，只会把难度和猜测次数作为匿名统计发送到服务器，不附带姓名或任何个人身份信息。使用过程中，可能会如下文所述自动收集部分信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和最佳纪录、展示广告并了解使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您以往访问本网站和其他网站的情况投放广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及仅保留各语言每日总数（页面浏览、开始与完成的游戏、星级评分）的自有统计。这些信息无法识别您的个人身份。"
      ],
      [
        "5. 联系方式",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "6. 生效日期",
        "本政策自 2026 年 10 月 18 日起生效。"
      ]
    ],
    "back": "← 返回猜数字"
  }
};
