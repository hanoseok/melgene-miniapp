/* 雪花制作器 — 简体中文 (/zh/ 副本). 键结构与 en.js 相同。不要直译，用中文用户的说法来写。
 * 以 Html 结尾的键原样插入 (仅 <br>、<em>)。 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&display=swap",
    display: "'ZCOOL KuaiLe', 'Nunito'",
    displayWeight: 400,
    script: "'ZCOOL KuaiLe'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "雪花制作 · 在线制作对称雪花",
    description: "在线制作属于你自己的对称雪花。调整分支数量、细致程度和长度，选择形状和颜色，即可保存 1080×1080 的 PNG 图片或分享链接。",
    ogTitle: "制作一朵雪花 ❄️",
    ogDescription: "点几下就能长出六方对称的雪花，保存下来，或发给朋友看看。"
  },
  siteName: "雪花制作器",
  privacyLink: "隐私政策",
  start: {
    badge: "❄️ 冬季限定",
    h1Kicker: "雪花制作 · 在线制作雪花",
    h1Html: "长出一朵<br><em>只属于你的雪花</em>",
    hook: "点几下，一朵完美对称的雪花就慢慢成形了。存成图片，或者把链接发给朋友。",
    start: "开始制作 →"
  },
  editor: {
    title: "制作你的雪花",
    canvasAria: "正在制作的雪花预览",
    labels: {
      arms: "单侧分支数",
      complexity: "细致程度",
      size: "分支长度"
    },
    levels: {
      complexity: ["简单", "适中", "精细"],
      size: ["短", "适中", "长"]
    },
    buttons: {
      newFlake: "新雪花",
      shape: "更换分支形状",
      color: "更换颜色",
      save: "保存 PNG",
      share: "分享",
      done: "做好了"
    },
    shapes: {
      needle: "细线",
      plate: "六角片",
      spike: "小刺",
      feather: "羽毛"
    },
    palettes: ["冰蓝", "霜白", "丁香紫", "午夜金", "薄荷绿"],
    status: {
      copied: "链接已复制！",
      copyFail: "无法复制链接，请试试保存 PNG。",
      shared: "已分享！",
      saving: "正在生成图片…",
      saved: "图片已保存！",
      saveFail: "无法生成图片，可以试试截屏。"
    }
  },
  result: {
    eyebrowMine: "你的雪花完成啦！",
    eyebrowFriend: "一位朋友为你做了这朵雪花",
    save: "保存 PNG",
    edit: "继续制作",
    retry: "制作新雪花",
    retryFriend: "我也要做一朵",
    shareTitle: "雪花制作器",
    shareText: "看看我做的雪花 ❄️ 打开链接就能看到同一朵:",
    fileName: "雪花"
  },
  og: {
    brand: "❄️ 雪花制作器",
    defaultKicker: "雪花制作 · 在线制作雪花",
    defaultTitle: "慢慢长出只属于你的雪花",
    defaultDesc: "六方对称 · 形状 · 颜色 · 保存与分享"
  },
  faq: [
    {
      q: "雪花要怎么做？",
      a: "点“新雪花”就会出现一朵新图案。再用下面的三个滑块调整分支数、细致程度和分支长度。雪花由一根分支旋转六次并镜像得到，所以永远是对称的。"
    },
    {
      q: "形状和颜色按钮有什么用？",
      a: "“更换分支形状”会在细线、六角片、小刺和羽毛之间切换分支的画法，设计本身不变。“更换颜色”会切换背景和线条的颜色。两者可以在同一个设计上反复试。"
    },
    {
      q: "怎样保存或分享雪花？",
      a: "点“保存 PNG”会下载一张 1080×1080 的图片。点“分享”会生成一个包含设置的链接，打开的人会看到同一朵雪花。"
    },
    {
      q: "我做的雪花会存在服务器上吗？",
      a: "不会。雪花只保存在图片和链接里。保存或分享时，你做的内容不会上传到我们的服务器。"
    }
  ],
  privacy: {
    title: "隐私政策 | 雪花制作器",
    description: "雪花制作器隐私政策：雪花数据的处理方式、Cookie、广告和匿名统计说明。",
    h1: "隐私政策",
    introHtml: "雪花制作器（以下简称“本服务”）尊重您的隐私，仅处理下述必要的最少信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。您制作的雪花设置不会发送到服务器。设置只保存在您的浏览器中，以及您点击分享时生成的链接里。使用本服务时，可能会自动收集下面所述的信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 来展示广告并了解服务的使用情况。您可以在浏览器设置中拒绝或删除 Cookie，但这样做可能会导致部分功能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会根据您访问本站和其他网站的历史，使用 Cookie 来展示广告。您可以在 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>中了解详情并更改偏好。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及仅按语言保存每日总数的自有汇总计数器（页面浏览量、完成的雪花数）。这些数据不会识别您的个人身份。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接在 URL 中包含雪花设置，因此拥有该链接的人都能看到同一朵雪花。保存的图片在您的浏览器中生成，不会上传到我们这里。"
      ],
      [
        "6. 联系方式",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 11 日起生效。"
      ]
    ],
    back: "← 返回雪花制作器"
  }
};
