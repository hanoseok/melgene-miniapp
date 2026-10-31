/* 圣诞贺卡制作 — 简体中文 (/zh/)。键结构与 en.js 相同。{name} {greeting} {n} {max} 保持原样。 */
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
    title: "圣诞贺卡制作 - 在线做电子贺卡",
    description: "圣诞贺卡制作：选主题和祝福语，写上名字和暖心的话，就能做好一张电子贺卡。可以存成图片，也能发一个像信封一样打开的链接。",
    ogTitle: "圣诞贺卡制作 🎄",
    ogDescription: "一分钟做一张温暖的圣诞贺卡，送给你在乎的人。"
  },
  siteName: "圣诞贺卡制作",
  privacyLink: "隐私政策",
  start: {
    badge: "🎄 年末特辑",
    h1Kicker: "圣诞贺卡制作",
    h1Html: "给重要的人<br><em>送上一份温暖</em>",
    hook: "挑一个喜欢的设计，写几句心里话，做一张像真信封一样拆开的贺卡。",
    start: "开始做贺卡 →"
  },
  editor: {
    title: "设计你的贺卡",
    themesAria: "贺卡设计",
    themes: {
      classic: "经典",
      snowy: "雪夜",
      golden: "金色",
      cute: "可爱",
      minimal: "简约",
      forest: "冬日森林"
    },
    previewAria: "贺卡预览",
    greetingsLabel: "祝福语",
    decoLabel: "装饰",
    decos: {
      snow: "雪花",
      lights: "彩灯",
      sparkle: "闪光"
    },
    fields: {
      to: {
        label: "收件人",
        placeholder: "例如：妈妈"
      },
      from: {
        label: "署名",
        placeholder: "例如：小雨"
      },
      message: {
        label: "想说的话",
        placeholder: "写几句暖心的话…"
      }
    },
    ideas: "💡 文案灵感",
    counter: "{n}/{max}",
    presets: [
      "谢谢你这一年的陪伴，祝你圣诞快乐，天天开心！",
      "愿你的冬天有热可可、有暖气，还有喜欢的人在身边。",
      "一年辛苦啦！好好休息，新的一年继续闪闪发光。",
      "虽然隔得很远，但祝福一点都不会少。早点见面吃顿好的！",
      "愿平安夜的苹果带给你一整年的平安和好运。"
    ],
    defaultGreeting: "merry",
    done: "完成贺卡"
  },
  card: {
    greetings: {
      merry: "圣诞快乐！",
      holidays: "节日快乐！",
      newyear: "新年快乐！",
      seasons: "岁末安康，万事顺意"
    },
    to: "致 {name}：",
    from: "—— {name}"
  },
  open: {
    eyebrow: "你收到了一张圣诞贺卡",
    fromName: "来自 {name}",
    fromNone: "来自一位惦记你的人",
    open: "拆开贺卡"
  },
  result: {
    eyebrowMine: "贺卡做好啦！",
    eyebrowFriend: "{name} 送你的贺卡",
    eyebrowFriendNoName: "一张给你的贺卡",
    imageAlt: "圣诞贺卡：{greeting}",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片生成失败，请直接截图。",
    copyText: "复制文字",
    copied: "文字已复制！",
    copyFail: "复制失败，请再试一次。",
    edit: "修改",
    retry: "再做一张",
    retryFriend: "我也做一张",
    shareTitle: "圣诞贺卡制作",
    shareText: "{name} 给你寄了一张圣诞贺卡 🎄 点开看看：",
    shareTextNoName: "你收到了一张圣诞贺卡 🎄 点开看看：",
    fileName: "christmas-card"
  },
  og: {
    brand: "🎄 圣诞贺卡制作",
    defaultKicker: "圣诞贺卡制作",
    defaultTitle: "给重要的人送上一份温暖",
    defaultDesc: "6 种设计 · 保存图片 · 发链接",
    cardGreeting: "圣诞快乐！"
  },
  faq: [
    {
      q: "怎么做贺卡？",
      a: "选好设计和祝福语，打开或关闭雪花、彩灯、闪光装饰，再填上收件人、署名和想说的话。预览会实时变化，满意了就点“完成贺卡”。"
    },
    {
      q: "可以把贺卡存成图片吗？",
      a: "可以。点“保存图片”会生成 1080×1350 的 PNG，适合发微信或朋友圈。手机上会打开分享菜单，电脑上会直接下载。"
    },
    {
      q: "对方打开链接会看到什么？",
      a: "先看到一个封好的信封，点一下拆开就能看到贺卡，祝福语会用对方自己的语言显示。对方也可以马上做一张自己的贺卡。"
    },
    {
      q: "我写的话会保存在哪里？",
      a: "只在分享链接里，以及编辑时你自己的浏览器里，不会发送到我们的服务器。不过拿到链接的人都能看到内容，所以只分享给你想送的人。"
    }
  ],
  privacy: {
    title: "隐私政策 | 圣诞贺卡制作",
    description: "圣诞贺卡制作隐私政策：说明贺卡内容如何处理，以及 Cookie、广告和访问统计的使用方式。",
    h1: "隐私政策",
    introHtml: "圣诞贺卡制作（以下简称“本服务”）尊重您的隐私，并按照以下政策只处理最少的必要信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。您输入的名字和留言不会发送到服务器，只在您的浏览器中处理（编辑时草稿会保存在浏览器存储中，分享时会包含在链接里）。在使用过程中，以下信息可能会被自动收集。"
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
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只记录每日、每种语言合计数的自有统计（浏览次数、完成的贺卡数、评分）。这些都不会识别您的身份，也不包含留言内容。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接会把贺卡内容编码在网址中，持有链接的人都能看到。保存的图片在您的浏览器中生成。建议不要在留言中填写地址、电话等个人信息。"
      ],
      [
        "6. 联系我们",
        "如对本隐私政策有任何疑问，请联系本服务的运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 1 日起生效。"
      ]
    ],
    back: "← 返回圣诞贺卡制作"
  }
};
