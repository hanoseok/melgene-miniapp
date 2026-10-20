/* Snake Game — zh (/zh/) — same key structure as en.js. Rules and scoring: snake-core.js. */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lilita+One&family=ZCOOL+KuaiLe&display=swap",
    "display": "'ZCOOL KuaiLe', 'Lilita One'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "贪吃蛇游戏 - 免费在线小游戏",
    "description": "贪吃蛇游戏：滑动屏幕或用方向键控制小蛇吃苹果、不断变长，撞墙或咬到自己的尾巴就结束。免费、无需下载，网页直接玩。",
    "ogTitle": "贪吃蛇游戏 🐍 你能长多长？",
    "ogDescription": "经典贪吃蛇。每吃一个苹果就更快一点。你能撑多久？"
  },
  "siteName": "贪吃蛇",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "🐍 经典街机",
    "h1Kicker": "贪吃蛇游戏",
    "h1Html": "吃苹果变长<br><em>别撞墙！</em>",
    "hook": "控制小蛇去吃苹果。每吃一口就更长、也更快一点。拐错一次就结束了。",
    "how": {
      "move": "滑动或方向键",
      "eat": "吃苹果",
      "avoid": "躲开墙和尾巴"
    },
    "facts": "越来越快 · 撞墙就输 · 挑战最高分",
    "start": "开始游戏 →"
  },
  "play": {
    "score": "得分",
    "best": "最高",
    "paused": "已暂停",
    "resume": "继续",
    "go": "开始！",
    "fieldAria": "游戏区域。滑动或使用方向键、W A S D 控制小蛇。",
    "pause": "暂停"
  },
  "result": {
    "wall": "撞到墙了！",
    "self": "咬到自己的尾巴了！",
    "full": "棋盘吃满了，太完美了！",
    "ate": "吃到的苹果",
    "level": "达到的速度等级",
    "shareTitle": "贪吃蛇游戏",
    "shareText": "我在贪吃蛇里得了{score}分！🐍 你能超过我吗？",
    "points": "分",
    "best": "最高 {n}分",
    "newBest": "刷新纪录！",
    "top": "前 {n}%",
    "beat": "高于 {pct}% 的玩家",
    "beatAll": "比目前所有成绩都高",
    "others": "与其他 {n} 个成绩比较",
    "comparing": "正在和其他玩家比较…",
    "retry": "再玩一次"
  },
  "og": {
    "brand": "🐍 贪吃蛇游戏",
    "defaultKicker": "免费经典街机游戏",
    "defaultTitle": "你的小蛇能长多长？",
    "defaultDesc": "滑动转向 · 吃苹果 · 别撞墙"
  },
  "faq": [
    {
      "q": "怎么玩？",
      "a": "在游戏区域朝任意方向滑动，或按方向键、W A S D。小蛇会一直前进，你要控制方向去吃苹果。每吃一个苹果就变长一格，撞到墙或咬到自己的尾巴，这一局就结束。"
    },
    {
      "q": "为什么越来越快？",
      "a": "每吃几个苹果就会升一级速度：小蛇走得更快，一个苹果的得分也会多一点。速度升到一定程度就不再提高，所以游戏始终可以玩下去。"
    },
    {
      "q": "“超过多少玩家”是真的吗？",
      "a": "是真的。一局结束后，只会把你的分数匿名发送到服务器，与其他玩家的分数比较。只有存在真实记录可比较时才会显示，否则什么都不显示。"
    },
    {
      "q": "游戏为什么自己暂停了？",
      "a": "切换到其他标签页或应用时游戏会自动暂停，所以你离开时不会撞墙。点“继续”就能接着玩。最高分保存在当前浏览器里。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 贪吃蛇",
    "description": "贪吃蛇游戏隐私政策：匿名分数、Cookie、广告与访问统计。",
    "h1": "隐私政策",
    "introHtml": "贪吃蛇游戏（以下简称“本服务”）尊重您的隐私，仅按照以下方针处理最少量的信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。每局结束时，只有您的分数（按10分取整）会以匿名合计的形式保存到服务器，不附带姓名或任何个人识别信息。但在使用过程中，可能会自动收集以下信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和最高分，并用于投放广告和分析使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您此前访问本网站和其他网站的情况投放广告。详情及个性化设置请访问 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 访问统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只保留按日期和语言汇总数据的自有统计（浏览量、开始与完成次数、星级评分）。不会收集可识别个人身份的信息。"
      ],
      [
        "5. 联系我们",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "6. 生效日期",
        "本政策自2026年10月21日起生效。"
      ]
    ],
    "back": "← 返回贪吃蛇游戏"
  }
};
