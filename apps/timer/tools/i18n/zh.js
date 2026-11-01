/* 10秒挑战 — zh (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "10秒挑战 – 秒表停在10.00秒的小游戏",
    "description": "10秒挑战：启动秒表，全凭感觉停在正好10.00秒。每局3次机会，还有盲测模式和5秒、30秒目标。免费，无需下载。",
    "ogTitle": "10秒挑战 ⏱️ 你能停在正好10.00秒吗？",
    "ogDescription": "在心里默数，看准时机按停止。每局3次，盲测模式下数字会消失。"
  },
  "siteName": "10秒挑战",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "⏱️ 你能凭感觉数准10秒吗？",
    "h1Kicker": "10秒挑战",
    "h1Html": "让秒表停在<br><em>正好10.00秒</em>",
    "hook": "启动秒表，在心里默数，在刚好的那一刻按停止。每局3次机会，只算最接近的一次。",
    "targetLabel": "目标时间",
    "targetValue": "{n}秒",
    "blindLabel": "盲测模式",
    "blindDesc": "3秒后数字会消失",
    "how": "点开始 → 停止 · 点屏幕任意位置也能停",
    "start": "开始挑战 →",
    "facts": "3次机会 · 5／10／30秒 · 刷新个人最佳"
  },
  "play": {
    "target": "目标 {t}",
    "blindTag": "盲测",
    "attempt": "第{n}次（共{total}次）",
    "go": "开始",
    "stop": "停止",
    "next": "下一次",
    "finish": "查看结果",
    "readyHint": "按开始，然后停在正好{t}",
    "runHint": "点屏幕任意位置或按空格键停止",
    "early": "早了{n}",
    "late": "晚了{n}",
    "perfect": "完美！正好{t} 🎉",
    "cancelled": "你离开了页面，这次不算。再来一次吧！",
    "hidden": "??:??.??",
    "change": "← 更换模式",
    "clockAria": "秒表",
    "sec": "{n}秒"
  },
  "result": {
    "over": "你的成绩",
    "mode": "目标 {t}",
    "perfect": "正好{t}！完美停表 🎉",
    "bestLabel": "最接近的一次，误差",
    "stoppedAt": "停在 {time}",
    "tierLabel": "你的生物钟",
    "tiers": [
      "🐌 时间迷路人",
      "⏳ 差不多那附近",
      "🙂 感觉不错",
      "🎯 时机精准",
      "⚡ 瞬间掌控者",
      "🧠 人形秒表"
    ],
    "newBest": "刷新个人最佳！",
    "pb": "本模式个人最佳：{n}",
    "avg": "平均误差",
    "listLabel": "你的3次成绩",
    "top": "前{n}%",
    "beat": "比{pct}%的玩家更准",
    "beatAll": "比目前所有其他玩家都准",
    "others": "与本模式其他{n}局成绩比较",
    "comparing": "正在与其他玩家比较…",
    "shareTitle": "10秒挑战",
    "shareText": "我把秒表停在离{t}只差{n}的地方 ⏱️ {tier}。你能停得正好吗？",
    "retry": "再挑战一次"
  },
  "og": {
    "brand": "⏱️ 10秒挑战",
    "defaultKicker": "免费计时小游戏",
    "defaultTitle": "你能把秒表停在正好10.00秒吗？",
    "defaultDesc": "3次机会 · 盲测模式 · 5／10／30秒"
  },
  "faq": [
    {
      "q": "怎么玩？",
      "a": "选择目标时间（5、10或30秒）后按开始，秒表从你点下的那一刻开始计时。在心里默数，觉得时间到了就按停止按钮、点游戏画面任意位置或按空格键。每局有3次机会，最接近的一次就是你的成绩。"
    },
    {
      "q": "盲测模式是什么？",
      "a": "盲测模式下，前3秒过后数字会变成问号，之后只能全凭感觉数下去。难度高很多，个人最佳和与其他玩家的比较也和普通模式分开计算。"
    },
    {
      "q": "为什么正好10.00秒这么难？",
      "a": "手指反应需要一点时间，心里数的节奏在10秒里也会慢慢偏移，所以就算停得很好，也会早或晚几百分之一秒。计时器按你点击的那一刻计算，并像真正的秒表一样显示到百分之一秒。正好10.00很少见，所以才好玩。"
    },
    {
      "q": "为什么这次不算？",
      "a": "如果计时中切换标签页、锁屏或离开页面，为了公平这一次会被取消。重新开始同一次就可以了。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 10秒挑战",
    "description": "10秒挑战的隐私政策：匿名成绩、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "10秒挑战（以下简称“本服务”）尊重您的隐私，只处理下面说明的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录。每局结束时，只会把成绩（最准一次的误差毫秒数）以匿名计数的方式发送到服务器，不附带姓名或任何个人身份信息。使用过程中可能会自动收集以下信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 和浏览器本地存储来记住您的语言和最佳成绩、展示广告以及了解使用情况。您可以在浏览器设置中拒绝或删除，但部分功能可能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据您以往访问本网站和其他网站的情况展示广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只保留各语言每日合计的自有统计（页面浏览、开始与完成的局数、星级评分）。这些都不会识别您的个人身份。"
      ],
      [
        "5. 联系我们",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "6. 生效日期",
        "本政策自 2026 年 11 月 2 日起生效。"
      ]
    ],
    "back": "← 返回10秒挑战"
  }
};
