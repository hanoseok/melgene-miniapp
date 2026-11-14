/* Snowball Fight — zh (打雪仗游戏)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "打雪仗游戏 – 扔雪球、快躲闪、砸中他",
    "description": "免费在线打雪仗游戏：朝雪堡后探出头的小伙伴扔雪球，雪球飞来时赶紧躲到雪墙后面。每局60秒，手机电脑都能玩。",
    "ogTitle": "打雪仗游戏 ☃️ 60秒内你能砸中几次？",
    "ogDescription": "扔得快、蹲得准，可别砸到小狗。3颗心，一分钟定胜负。"
  },
  "siteName": "打雪仗游戏",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "☃️ 下雪啦，口袋里装满雪球",
    "h1Kicker": "打雪仗游戏",
    "h1Html": "探头就砸<br><em>飞来就蹲</em>",
    "hook": "院子对面的小伙伴都躲在雪堡后面。趁他们探头时砸中，看到有人举起手臂就赶紧蹲下！",
    "how": {
      "throw": "点小伙伴扔雪球",
      "duck": "出现❗就按住蹲下",
      "avoid": "别砸到朋友"
    },
    "start": "开始打雪仗 →",
    "facts": "每局60秒 · 3颗心 · 手机电脑都能玩"
  },
  "play": {
    "score": "得分",
    "time": "时间",
    "lives": "生命",
    "secUnit": "秒",
    "pause": "暂停",
    "paused": "已暂停",
    "resume": "继续打雪仗",
    "hint": "点一下院子开始",
    "fieldAria": "雪地院子：点小伙伴扔雪球，按住雪墙或下蹲按钮就能躲起来",
    "duck": "下蹲（按住）",
    "duckAria": "按住时躲到雪墙后面",
    "combo": "连击 ×{n}",
    "golden": "金雪人！+{n}",
    "oops": "是朋友！−{n}",
    "miss": "没砸中",
    "block": "挡住了！",
    "ouch": "哎哟！",
    "timeUp": "时间到！",
    "out": "被雪埋啦！"
  },
  "result": {
    "over": "雪仗结束",
    "reasonTime": "你坚持到了最后一秒",
    "reasonOut": "被砸中三次，出局",
    "unit": "分",
    "newBest": "刷新个人纪录！",
    "best": "个人最佳：{n}分",
    "hits": "命中",
    "accuracy": "命中率",
    "bestCombo": "最高连击",
    "tierLabel": "你的打雪仗段位",
    "tiers": [
      "🧤 冻僵的小手",
      "❄️ 雪仗新手",
      "⛄ 院子常客",
      "🎯 神投手",
      "⭐ 雪堡突击队长",
      "🏆 雪仗传奇"
    ],
    "top": "前 {n}%",
    "beat": "超过了 {pct}% 的玩家",
    "beatAll": "超过了目前所有玩家",
    "others": "与另外 {n} 局成绩比较",
    "comparing": "正在和其他玩家比较…",
    "shareTitle": "打雪仗游戏",
    "shareText": "我在60秒打雪仗里拿了{n}分 ☃️ {tier}，你能超过我吗？",
    "retry": "再来一局"
  },
  "og": {
    "brand": "☃️ 打雪仗游戏",
    "defaultKicker": "在线打雪仗游戏",
    "defaultTitle": "60秒内你能砸中几次？",
    "defaultDesc": "扔雪球 · 快蹲下 · 别砸小狗"
  },
  "faq": [
    {
      "q": "怎么扔雪球、怎么躲？",
      "a": "点一下（或用鼠标点击）从雪堡后探出头的小伙伴，雪球就会飞过去。想躲的时候，按住下方的“下蹲”按钮或面前的雪墙即可。蹲着的时候不能扔雪球。电脑上可以用 ←、→ 选雪堡，按 ↑ 或 F 扔出，按住空格或 ↓ 下蹲。"
    },
    {
      "q": "怎么知道有雪球飞过来？",
      "a": "准备扔雪球的小伙伴会举起手臂，头顶出现红色的❗。在他扔出之前砸中他，他就扔不出来了。如果雪球已经飞过来，你的雪墙上方会出现大大的❗，“下蹲”按钮也会变红，一直按住直到雪球落下。"
    },
    {
      "q": "分数怎么算？",
      "a": "每砸中一次都会得分，雪人比小伙伴稍微多一点。连续砸中会累积连击，每次得分随之提高，没砸中连击就会中断。偶尔出现的金雪人分数最高。小狗和挥白旗的小伙伴是朋友，砸到他们会扣分。"
    },
    {
      "q": "一局什么时候结束？",
      "a": "每局60秒，被砸中三次也会提前结束。时间越往后，节奏越紧张。切换到其他标签页或锁屏时，游戏会自动暂停。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 打雪仗游戏",
    "description": "打雪仗游戏隐私政策：匿名成绩、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "打雪仗游戏（以下简称“本服务”）尊重您的隐私，只处理下文所述的最少信息。",
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
        "本政策自 2026 年 11 月 14 日起生效。"
      ]
    ],
    "back": "← 返回打雪仗游戏"
  }
};
