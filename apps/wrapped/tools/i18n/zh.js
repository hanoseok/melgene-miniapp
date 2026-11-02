/* 年度总结卡片 — 简体中文. Key structure = en.js; see en.js for notes ({year}/{next} are filled in by the browser — never write a year as digits). */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&display=swap",
    "display": "'ZCOOL KuaiLe', 'Nunito'",
    "displayWeight": 400,
    "script": "'ZCOOL KuaiLe'",
    "scriptWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "年度总结卡片制作·年终总结模板",
    "description": "在线制作年度总结卡片：写下年度关键词、最难忘的瞬间、年度歌曲、美食、地点、想感谢的人和明年的目标，选个主题，一键生成年终总结图片，可保存也可分享链接。",
    "ogTitle": "年度总结卡片 🎁",
    "ogDescription": "一个词、一首歌、一个难忘的瞬间，把你的这一年装进一张卡片。"
  },
  "siteName": "年度总结卡片",
  "privacyLink": "隐私政策",
  "start": {
    "badge": "🎁 年终特辑",
    "h1Kicker": "年度总结卡片制作",
    "h1Html": "把这一年<br><em>装进一张卡片</em>",
    "hook": "一个词、一首歌、一个忘不掉的瞬间。写上几行，就能得到一张属于你的年度总结卡片。",
    "start": "开始制作 →"
  },
  "editor": {
    "title": "用几行字回顾这一年",
    "themesAria": "卡片主题",
    "themes": {
      "aurora": "极光",
      "sunset": "晚霞",
      "mint": "薄荷",
      "midnight": "午夜",
      "paper": "纸张",
      "neon": "霓虹"
    },
    "previewAria": "卡片预览",
    "fields": {
      "nm": {
        "label": "名字（可选）",
        "placeholder": "例如：小雨"
      },
      "w": {
        "label": "年度关键词",
        "placeholder": "用一个词形容今年"
      },
      "mo": {
        "label": "最难忘的瞬间",
        "placeholder": "例如：和妹妹看冬天的海"
      },
      "so": {
        "label": "年度歌曲",
        "placeholder": "今年单曲循环最多的歌"
      },
      "fo": {
        "label": "年度美食",
        "placeholder": "例如：深夜的一碗面"
      },
      "pl": {
        "label": "年度地点",
        "placeholder": "例如：公司楼下的小咖啡馆"
      },
      "th": {
        "label": "想感谢的人",
        "placeholder": "例如：妈妈、我的团队"
      },
      "go": {
        "label": "明年的目标",
        "placeholder": "例如：跑完10公里"
      }
    },
    "ideasAria": "关键词推荐",
    "ideas": [
      "成长",
      "坚持",
      "突破",
      "治愈",
      "松弛感"
    ],
    "needWord": "先写下你的年度关键词吧，其他都可以不填。",
    "done": "生成卡片"
  },
  "card": {
    "kicker": "年度总结",
    "titleMine": "我的{year}",
    "titleName": "{name}的{year}",
    "word": "年度关键词",
    "rows": {
      "mo": "难忘瞬间",
      "so": "年度歌曲",
      "fo": "年度美食",
      "pl": "年度地点",
      "th": "感谢",
      "go": "{next}年目标"
    }
  },
  "result": {
    "eyebrowMine": "{year}年度总结完成！",
    "eyebrowFriend": "{name}的{year}年度总结",
    "eyebrowFriendNoName": "朋友的{year}年度总结",
    "imageAlt": "年度总结卡片。年度关键词：{word}",
    "save": "保存图片",
    "saving": "正在生成图片…",
    "saved": "图片已保存！",
    "saveFail": "图片生成失败，请截图保存。",
    "copyText": "复制文字",
    "copied": "文字已复制！",
    "copyFail": "复制失败，请重试。",
    "edit": "修改",
    "retry": "再做一张",
    "retryFriend": "我也来做",
    "shareTitle": "年度总结卡片",
    "shareText": "{name}的{year}年度总结 🎁 来看看：",
    "shareTextNoName": "我的{year}年度总结 🎁 来看看：",
    "fileName": "year-in-review"
  },
  "og": {
    "brand": "🎁 年度总结卡片",
    "defaultKicker": "年度总结卡片制作",
    "defaultTitle": "把这一年装进一张卡片",
    "defaultDesc": "6种主题 · 关键词、歌曲、瞬间 · 保存或分享",
    "cardKicker": "年度总结",
    "cardWord": "成长",
    "cardRows": [
      "难忘瞬间",
      "年度歌曲",
      "明年目标"
    ]
  },
  "faq": [
    {
      "q": "需要填写哪些内容？",
      "a": "只需要填年度关键词。名字、难忘瞬间、歌曲、美食、地点、想感谢的人和明年的目标都可以不填，空着的项目不会出现在卡片上。"
    },
    {
      "q": "卡片上显示的是哪一年？",
      "a": "根据设备日期显示你正在回顾的那一年。一月份制作时会显示刚过去的那一年，晚一点做也没关系。"
    },
    {
      "q": "可以把卡片保存成图片吗？",
      "a": "可以。点「保存图片」会生成适合朋友圈和聊天的 1080×1350 PNG。手机上会打开分享菜单，电脑上会直接下载。"
    },
    {
      "q": "我写的内容存在哪里？",
      "a": "编辑时只存在你自己的浏览器里，分享时只在链接里。内容不会发送到我们的服务器。拿到链接的人都能看到卡片，请只发给信任的人。"
    }
  ],
  "privacy": {
    "title": "隐私政策 | 年度总结卡片",
    "description": "年度总结卡片隐私政策：说明卡片内容如何处理，以及 Cookie、广告和访问统计的使用方式。",
    "h1": "隐私政策",
    "introHtml": "年度总结卡片（以下简称“本服务”）尊重您的隐私，并按照以下政策只处理最少的必要信息。",
    "sections": [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。您在卡片上填写的内容不会发送到服务器，只在您的浏览器中处理（编辑时草稿会保存在浏览器存储中，分享时会包含在链接里）。在使用过程中，以下信息可能会被自动收集。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 来投放广告和分析使用情况。您可以在浏览器设置中拒绝或删除 Cookie，但部分功能可能因此无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您以往的访问记录投放广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 访问统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只记录每日、每种语言合计数的自有统计（浏览次数、完成的卡片数、评分）。这些都不会识别您的身份，也不包含卡片内容。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接会把卡片内容编码在网址中，持有链接的人都能看到。保存的图片在您的浏览器中生成。建议不要在卡片上填写地址、电话等个人信息。"
      ],
      [
        "6. 联系我们",
        "如对本隐私政策有任何疑问，请联系本服务的运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 3 日起生效。"
      ]
    ],
    "back": "← 返回年度总结卡片"
  }
};
