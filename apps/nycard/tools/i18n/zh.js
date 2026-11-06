/* 2027 新年贺卡制作 — 简体中文 (zh/)。结构与占位符同 en.js。card.* 会画进贺卡图片。 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&family=Ma+Shan+Zheng&display=swap",
    display: "'ZCOOL KuaiLe', 'Nunito'",
    displayWeight: 400,
    script: "'Ma Shan Zheng'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "2027 新年贺卡制作 · 在线电子贺卡",
    description: "2027 新年贺卡制作：选好样式和祝福语，写上名字和一句心里话。可存成图片，或发个链接，对方打开时信封会慢慢展开。",
    ogTitle: "2027 新年贺卡制作 🐑",
    ogDescription: "一分钟做好一张羊年新年贺卡，把第一句祝福送出去。"
  },
  siteName: "2027 新年贺卡",
  privacyLink: "隐私政策",
  start: {
    badge: "🧧 你好，2027",
    h1Kicker: "2027 新年贺卡制作",
    h1Html: "新年第一句祝福<br>写进<em>一张贺卡</em>",
    hook: "选个样式，写一句祝福，就能送出一张像真信封一样打开的贺卡。",
    start: "开始做贺卡 →"
  },
  editor: {
    title: "设计你的贺卡",
    themesAria: "贺卡样式",
    themes: {
      red: "红金喜庆",
      washi: "和纸风",
      goat: "萌萌小羊",
      minimal: "简约",
      snowy: "雪夜",
      fireworks: "烟花"
    },
    previewAria: "贺卡预览",
    greetingsLabel: "祝福语",
    decoLabel: "装饰",
    decos: {
      zodiac: "羊年徽章",
      year: "2027",
      sparkle: "闪光"
    },
    fields: {
      to: {
        label: "收件人",
        placeholder: "例：姥姥"
      },
      from: {
        label: "署名",
        placeholder: "例：小雨"
      },
      message: {
        label: "祝福的话",
        placeholder: "写一句新年祝福…"
      }
    },
    ideas: "💡 推荐文案",
    counter: "{n}/{max}",
    presets: [
      "新的一年，祝你身体健康，工作顺利，天天都有好心情！",
      "谢谢你去年的照顾，今年也请多多关照，常联系哦！",
      "羊年到，愿你的日子像小羊一样温柔，又像烟花一样灿烂。",
      "祝全家新春快乐，平安喜乐，万事胜意！",
      "今年的小目标：和你多见几次面。说到做到，新年快乐！"
    ],
    defaultGreeting: "happy",
    zodiacOn: true,
    done: "完成贺卡"
  },
  card: {
    greetings: {
      happy: "新年快乐",
      formal: "恭贺新禧",
      luck: "万事如意",
      year: "羊年大吉"
    },
    zodiac: "2027 丁未羊年",
    to: "致 {name}：",
    from: "{name} 敬上"
  },
  open: {
    eyebrow: "你收到了一张新年贺卡",
    fromName: "来自 {name}",
    fromNone: "来自一位惦记你的人",
    open: "打开贺卡"
  },
  result: {
    eyebrowMine: "贺卡做好啦！",
    eyebrowFriend: "{name} 送你的贺卡",
    eyebrowFriendNoName: "一张送给你的贺卡",
    imageAlt: "新年贺卡：{greeting}",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片没能生成，请截图保存。",
    copyText: "复制文字",
    copied: "文字已复制！",
    copyFail: "复制失败，请再试一次。",
    edit: "修改",
    retry: "再做一张",
    retryFriend: "我也做一张",
    shareTitle: "2027 新年贺卡",
    shareText: "{name} 给你寄了一张新年贺卡 🧧 点这里打开：",
    shareTextNoName: "有人给你寄了一张新年贺卡 🧧 点这里打开：",
    fileName: "new-year-card-2027"
  },
  og: {
    brand: "🧧 2027 新年贺卡",
    defaultKicker: "2027 新年贺卡制作",
    defaultTitle: "新年第一句祝福写进一张贺卡",
    defaultDesc: "6 种样式 · 存图片或发链接",
    cardGreeting: "新年快乐"
  },
  faq: [
    {
      q: "怎么做贺卡？",
      a: "选好样式和祝福语，打开或关闭羊年徽章、大号“2027”和闪光，再填上收件人、署名和一句祝福。预览会随着输入实时变化，满意了就点“完成贺卡”。"
    },
    {
      q: "羊年徽章是什么？",
      a: "按农历，2027 年是丁未羊年。很多人喜欢在新年贺卡上画上当年的生肖，所以我们准备了一个小羊头像徽章。不想要的话关掉就行。"
    },
    {
      q: "可以存成图片吗？",
      a: "可以。点“保存图片”会生成一张 1080×1350 的 PNG，发微信或朋友圈都合适。手机上会打开分享面板，电脑上会直接下载。"
    },
    {
      q: "对方打开链接会看到什么？",
      a: "先看到一个封好的信封，点一下打开就能看到贺卡，祝福语会用对方的语言显示。对方也可以马上做一张自己的贺卡。"
    },
    {
      q: "我写的内容存在哪里？",
      a: "只在链接里，以及编辑时你自己的浏览器里，不会发到我们的服务器。拿到链接的人都能看到，所以只分享给想送的人。"
    }
  ],
  privacy: {
    title: "隐私政策 | 2027 新年贺卡",
    description: "2027 新年贺卡的隐私政策：贺卡文字如何处理、Cookie、广告与匿名统计。",
    h1: "隐私政策",
    introHtml: "2027 新年贺卡（以下简称“本服务”）尊重你的隐私，只处理下文所述的最少信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。你输入的名字和祝福语不会发送到服务器，只保存在你的浏览器中（编辑时草稿存于本地存储）以及分享时的网址里。使用过程中，可能会按下文所述自动收集部分信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 来展示广告和了解使用情况。你可以在浏览器设置中拒绝或删除 Cookie，但部分功能可能因此无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据你过去访问本网站和其他网站的记录投放广告。详情及偏好设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只保留各语言每日总数（页面浏览、完成的贺卡数、星级评分）的自有统计。这些数据不会识别你的身份，也不包含你写的祝福。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接会把贺卡内容编码在网址中，任何拿到链接的人都能看到。保存的图片在你的浏览器内生成。请不要在祝福语中写地址、电话等个人信息。"
      ],
      [
        "6. 联系我们",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 7 日起生效。"
      ]
    ],
    back: "← 返回 2027 新年贺卡"
  }
};
