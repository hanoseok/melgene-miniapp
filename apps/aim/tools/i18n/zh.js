/* Aim Trainer — zh (瞄准训练)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "瞄准训练 · 反应与准度测试（Aim Trainer）",
    "description": "瞄准训练：用最快速度点中30个靶子，或在30秒内尽量多命中。测出平均用时、命中率和你的排名，手机电脑都能免费玩。",
    "ogTitle": "瞄准训练 🎯 你的瞄准有多快多准？",
    "ogDescription": "命中30个靶子或挑战30秒限时，看看你的平均用时、命中率和瞄准等级。"
  },
  "siteName": "瞄准训练",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "🎯 你的瞄准有多准？",
    "h1Kicker": "瞄准训练 · 反应与准度测试",
    "h1Html": "靶子一出现<br><em>立刻点中它</em>",
    "hook": "靶子会在框里随机出现，在它消失前点中，测测你的手有多快多准。",
    "modeLabel": "模式",
    "modes": {
      "classic": {
        "name": "经典",
        "sub": "30个靶"
      },
      "timed": {
        "name": "限时",
        "sub": "30秒"
      }
    },
    "how": "点中中间的靶子开始 · 点到靶外算失误",
    "start": "开始瞄准训练 →",
    "facts": "鼠标、触控板、手指都行 · 手机或电脑 · 刷新你的纪录"
  },
  "modes": {
    "classic": "经典 · 30个靶",
    "timed": "限时 · 30秒"
  },
  "play": {
    "time": "时间",
    "hits": "命中",
    "acc": "命中率",
    "ready": "点中靶子开始",
    "readySub": "第一次命中时开始计时",
    "done": "完成！",
    "timeUp": "时间到！",
    "cancelled": "你离开了页面，这一局不算。再来一次吧！",
    "change": "← 更换模式",
    "areaAria": "瞄准区域"
  },
  "result": {
    "over": "你的成绩",
    "scoreClassic": "每个靶子的平均用时",
    "scoreTimed": "命中的靶子",
    "unitMs": "毫秒",
    "unitHits": "个",
    "acc": "命中率",
    "avg": "平均用时",
    "misses": "失误",
    "total": "总用时",
    "escaped": "漏掉的靶",
    "msValue": "{n}ms",
    "secValue": "{n}秒",
    "tierLabel": "你的瞄准等级",
    "tiers": [
      "🐢 热身中",
      "🙂 普通水平",
      "🎯 眼疾手快",
      "🦅 鹰眼",
      "⚡ 甩枪高手",
      "🏆 瞄准之神"
    ],
    "newBest": "刷新个人纪录！",
    "pbClassic": "经典模式最佳：{n}毫秒",
    "pbTimed": "限时模式最佳：{n}个",
    "invalid": "这个速度超出了人类反应极限，本局不保存也不参与比较。",
    "top": "前{n}%",
    "beat": "超过了{pct}%的玩家",
    "beatAll": "超过了目前所有其他玩家",
    "others": "与本模式其他{n}局成绩比较",
    "comparing": "正在和其他玩家比较…",
    "shareTitle": "瞄准训练",
    "shareClassic": "我每个靶平均{avg}毫秒，命中率{acc}% 🎯 {tier}。你能更快吗？",
    "shareTimed": "我30秒命中{hits}个靶，命中率{acc}% 🎯 {tier}。你能超过吗？",
    "retry": "再来一次"
  },
  "og": {
    "brand": "🎯 瞄准训练",
    "defaultKicker": "免费在线瞄准测试",
    "defaultTitle": "你的瞄准有多快多准？",
    "defaultDesc": "30个靶或30秒 · 手机电脑都能玩"
  },
  "faq": [
    {
      "q": "瞄准训练怎么玩？",
      "a": "选择经典或限时模式并点开始，然后点中框中间的靶子就开始了。经典模式会一个接一个出现30个靶子，成绩是命中每个靶子的平均用时。限时模式要在30秒内尽量多命中，靶子会慢慢变小，太慢就会消失。"
    },
    {
      "q": "多少分算厉害？",
      "a": "经典模式大多数人每个靶平均在500到800毫秒之间，高手能低于450毫秒。限时模式常见的成绩是35到45个。命中率也很重要：如果点击中命中靶子的比例低于70%，等级会降一级。"
    },
    {
      "q": "鼠标、触控板和触屏都能玩吗？",
      "a": "都可以。鼠标点击、触控板轻点、触控笔和手指都能用，键盘不参与。只有在游戏区域内的点击才会计算。不同设备手感差别很大，所以鼠标成绩和手机成绩可能相差不少。"
    },
    {
      "q": "为什么这一局没有记录？",
      "a": "如果游戏中切换标签页、锁屏或离开页面，为了公平这一局会作废。比人类反应还快的成绩（例如每个靶平均低于150毫秒）不会保存，也不会和其他玩家比较。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 瞄准训练",
    "description": "瞄准训练的隐私政策：匿名成绩、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "瞄准训练（以下简称“本服务”）尊重您的隐私，只处理下面说明的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录。每局结束时，只会把成绩（每个靶子的平均用时或命中数）以匿名计数的方式发送到服务器，不附带姓名或任何个人身份信息。使用过程中可能会自动收集以下信息。"
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
        "本政策自 2026 年 11 月 6 日起生效。"
      ]
    ],
    "back": "← 返回瞄准训练"
  }
};
