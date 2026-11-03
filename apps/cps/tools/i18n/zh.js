/* CPS Test — zh (click speed test / cps). Same keys as en.js; see en.js header for rules and placeholders. */
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
    "title": "点击速度测试 · CPS测试 – 手速测试，每秒点几下",
    "description": "点击速度测试（CPS测试）：在1秒、5秒或10秒内尽情狂点，测出你的每秒点击数和手速等级。手机、电脑都能玩，免费，无需下载。",
    "ogTitle": "点击速度测试 🖱️ 你一秒能点几下？",
    "ogDescription": "1秒、5秒、10秒疯狂连点，看看你的CPS成绩和手速等级。"
  },
  "siteName": "点击速度测试",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "🖱️ 你的手指有多快？",
    "h1Kicker": "点击速度测试 · CPS测试",
    "h1Html": "一秒钟你能<br><em>点几下？</em>",
    "hook": "在时间结束前，尽可能快地点击或轻触大方框。成绩就是你的每秒点击数。",
    "modeLabel": "测试时长",
    "modeValue": "{n}秒",
    "how": "第一次点击开始计时 · 只算鼠标点击和触屏",
    "start": "开始 →",
    "facts": "1秒·5秒·10秒 · 手机电脑都行 · 挑战个人最佳"
  },
  "play": {
    "mode": "{n}秒测试",
    "time": "时间",
    "clicks": "点击",
    "cps": "CPS",
    "ready": "点这里开始",
    "readySub": "第一次点击时开始计时",
    "go": "继续狂点！",
    "over": "时间到！",
    "cancelled": "你离开了页面，这次不算。再来一次吧！",
    "change": "← 换个模式",
    "zoneAria": "点击区域",
    "sec": "{n}秒"
  },
  "result": {
    "over": "你的成绩",
    "mode": "{n}秒测试",
    "unit": "CPS",
    "clicks": "点击次数",
    "time": "时间",
    "tierLabel": "你的手速等级",
    "tiers": [
      "🐢 慢悠悠小乌龟",
      "🐇 敏捷小兔子",
      "🐆 猎豹手指",
      "⚡ 闪电连点手",
      "🔥 抖动点击高手",
      "🚀 人形连点器"
    ],
    "newBest": "刷新个人最佳！",
    "pb": "本模式个人最佳：{n} CPS",
    "tooFast": "超过25 CPS已超出人类极限，本次成绩不会保存或参与比较。",
    "top": "前{n}%",
    "beat": "比{pct}%的玩家更快",
    "beatAll": "比目前所有玩家都快",
    "others": "已与本模式其他{n}局成绩比较",
    "comparing": "正在与其他玩家比较…",
    "shareTitle": "点击速度测试",
    "shareText": "我{sec}秒点了{clicks}下，{cps} CPS 🖱️ {tier}。你能比我更快吗？",
    "retry": "再玩一次"
  },
  "og": {
    "brand": "🖱️ 点击速度测试",
    "defaultKicker": "免费CPS测试",
    "defaultTitle": "你一秒能点几下？",
    "defaultDesc": "1秒·5秒·10秒 · 手机电脑都能玩"
  },
  "faq": [
    {
      "q": "CPS测试怎么玩？",
      "a": "先选择1秒、5秒或10秒的测试时长，再按开始按钮。你第一次点击或轻触大方框的瞬间开始计时，这一下也算在内。在时间结束前尽可能快地点。CPS就是点击次数除以测试的秒数。"
    },
    {
      "q": "多少CPS算快？",
      "a": "正常点击的话，大多数人每秒在5到8下左右。会抖动点击（jitter click）或蝴蝶点击（butterfly click）等技巧的玩家常常能超过10下。1秒模式来不及累，通常会测出最高的数字。"
    },
    {
      "q": "键盘或多根手指算吗？",
      "a": "只计算方框内的鼠标点击和触屏轻触。键盘按住不放会自动连发，所以故意不计。在触屏上，每根碰到方框的手指都算一下，用两根手指或双手拇指都可以。"
    },
    {
      "q": "为什么这次成绩没算？",
      "a": "计时过程中如果切换标签页、锁屏或离开页面，为了公平这次挑战会被取消。另外，每秒超过25下的成绩是人类手指做不到的，不会保存，也不会和其他玩家比较。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 点击速度测试",
    "description": "点击速度测试的隐私政策：匿名成绩、Cookie、广告与统计说明。",
    "h1": "隐私政策",
    "introHtml": "点击速度测试（以下简称“本服务”）尊重您的隐私，只处理下面说明的最少信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录。每次测试结束时，只会把成绩（每秒点击数）以匿名计数的方式发送到服务器，不附带姓名或任何个人身份信息。使用过程中可能会自动收集以下信息。"
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
        "本政策自 2026 年 11 月 4 日起生效。"
      ]
    ],
    "back": "← 返回点击速度测试"
  }
};
