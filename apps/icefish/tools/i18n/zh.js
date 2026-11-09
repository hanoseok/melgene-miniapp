/* Ice Fishing — zh (冰钓游戏)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "冰钓游戏 · 冰上钓鱼小游戏",
    "description": "冰钓游戏：在冰封湖面的冰洞里放下鱼线，鱼儿咬钩后控制拉力慢慢收线，别让线断掉。60秒能钓多少分？手机电脑都能玩。",
    "ogTitle": "冰钓游戏 🎣 60秒能钓上几条鱼？",
    "ogDescription": "从冰洞放下鱼线，等鱼咬钩再轻轻收线。拉得太猛，线就会断。"
  },
  "siteName": "冰钓游戏",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "🎣 冰封的湖面，一个小冰洞",
    "h1Kicker": "冰钓游戏",
    "h1Html": "放下鱼线<br><em>把鱼拉上来</em>",
    "hook": "冰面下有东西在游。把鱼钩放到合适的深度，感觉到鱼咬钩的一拽，就趁鱼线还没断，轻轻把它收上来。",
    "how": {
      "lower": "按住放下鱼钩",
      "reel": "鱼咬钩后按住收线",
      "red": "拉力变红就松手"
    },
    "start": "开始钓鱼 →",
    "facts": "每局60秒 · 手机电脑都能玩 · 刷新纪录"
  },
  "play": {
    "score": "得分",
    "time": "时间",
    "secUnit": "秒",
    "pause": "暂停",
    "paused": "已暂停",
    "resume": "继续钓鱼",
    "hint": "按住冰面下方放下鱼线",
    "fieldAria": "冰封湖面：按住想要的深度放下鱼钩，鱼咬钩后按住收线",
    "bite": "咬钩了！",
    "catchPop": "{fish} +{n}",
    "snap": "线断了！",
    "escape": "鱼跑了",
    "timeUp": "时间到！"
  },
  "fish": {
    "minnow": "小银鱼",
    "perch": "鲈鱼",
    "trout": "鳟鱼",
    "pike": "狗鱼",
    "golden": "黄金鱼",
    "boot": "破靴子"
  },
  "result": {
    "over": "本局渔获",
    "unit": "分",
    "newBest": "刷新个人纪录！",
    "best": "个人最佳：{n} 分",
    "caught": "钓到的鱼",
    "snapped": "断线次数",
    "bestCatch": "最大收获：{fish}",
    "noCatch": "这次一条也没钓到",
    "tierLabel": "你的钓手等级",
    "tiers": [
      "🧊 冻手新人",
      "🪝 凿冰学徒",
      "🐟 耐心钓手",
      "🎣 冰面常客",
      "⭐ 懂鱼的高手",
      "🏆 冰湖传说"
    ],
    "top": "前 {n}%",
    "beat": "超过 {pct}% 的钓手",
    "beatAll": "超过目前所有钓手",
    "others": "与其他 {n} 局成绩比较",
    "comparing": "正在和其他钓手比较…",
    "shareTitle": "冰钓游戏",
    "shareText": "我在冰钓游戏60秒里钓了 {n} 分 🎣 {tier}。你能超过我吗？",
    "retry": "再钓一局"
  },
  "og": {
    "brand": "🎣 冰钓游戏",
    "defaultKicker": "在线冰钓小游戏",
    "defaultTitle": "60秒能钓上几条鱼？",
    "defaultDesc": "放线 · 咬钩 · 别把线拉断"
  },
  "faq": [
    {
      "q": "怎么放下鱼线？",
      "a": "按住冰面下方水里的任意位置，鱼钩会移动到你按住的深度，松手就停在那里。电脑上也可以按住 ↓、↑ 键。不同的鱼喜欢不同的深度，多试几层吧。"
    },
    {
      "q": "怎么收线？",
      "a": "鱼咬钩后按住就会收线，右侧的拉力条会上升。拉力条进入红色区域时先松手让线放松，再继续按住。拉力条满了线就会断；放得太松太久，鱼就会脱钩。"
    },
    {
      "q": "为什么不同的鱼分数不一样？",
      "a": "越大、住得越深的鱼力气越大，分数也越高，偶尔出现的黄金鱼分数最高。破靴子之类的垃圾很好拉上来，但是 0 分。个人最佳会保存在这个浏览器里。"
    },
    {
      "q": "切换到别的标签页会怎样？",
      "a": "离开页面或锁屏时游戏会自动暂停，时间也会停止。点“继续钓鱼”（或按 P 键）就能从刚才的地方接着玩。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 冰钓游戏",
    "description": "冰钓游戏隐私政策：匿名成绩、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "冰钓游戏（以下简称“本服务”）尊重您的隐私，只处理下文所述的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。每局结束时，只会把得分以匿名计数的方式发送到服务器，不附带姓名或任何个人识别信息。使用过程中可能会自动收集下列信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 和浏览器本地存储来记住语言和最佳成绩、展示广告以及了解使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您以往访问本网站和其他网站的记录投放广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只保留各语言每日总数的自有统计（页面浏览、开始和完成的局数、星级评分）。这些都不会识别您的个人身份。"
      ],
      [
        "5. 联系我们",
        "如对本政策有任何疑问，请联系网站运营者。"
      ],
      [
        "6. 生效日期",
        "本政策自 2026 年 11 月 10 日起生效。"
      ]
    ],
    "back": "← 返回冰钓游戏"
  }
};
