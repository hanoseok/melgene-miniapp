/* 堆雪人 — 简体中文 (/zh/)。键结构与 en.js 相同。{name} {n} {max} 原样保留。
 * editor.namePresets 是为中文用户想的雪人名字（每个不超过 20 个字符），不是英文翻译。
 */
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
    title: "堆雪人小游戏：在线堆一个可爱雪人",
    description: "在手机上堆雪人：叠好雪球，挑眼睛、胡萝卜鼻子、帽子、围巾和手臂，起个名字，再保存成图片或用链接分享给朋友。",
    ogTitle: "堆雪人 ⛄",
    ogDescription: "滚雪球、叠雪人、穿上衣服，一分钟堆好自己的雪人，再发给朋友。"
  },
  siteName: "堆雪人",
  privacyLink: "隐私政策",
  start: {
    badge: "⛄ 冬日限定",
    h1Kicker: "堆雪人",
    h1Html: "滚雪球、叠一叠，<br><em>给雪人穿新衣</em>",
    hook: "不用戴手套。挑好每一个小零件，看雪花飘落，再把雪人送给需要一个笑脸的人。",
    start: "开始堆雪人 →"
  },
  editor: {
    title: "堆一个雪人",
    canvasAria: "冬日场景中你的雪人预览",
    stepOf: "第 {n} 步 / 共 {max} 步",
    steps: {
      body: "身体",
      face: "脸",
      nose: "鼻子",
      hat: "帽子",
      scarf: "围巾",
      arms: "手臂",
      extras: "配饰",
      scene: "背景",
      name: "名字"
    },
    labels: {
      body: "雪球",
      eyes: "眼睛",
      mouth: "嘴巴",
      nose: "鼻子",
      hat: "帽子",
      scarf: "围巾颜色",
      pattern: "花纹",
      arms: "手臂",
      extras: "配饰（可多选）",
      scene: "背景",
      name: "名字（选填）"
    },
    bodies: {
      classic: "经典",
      duo: "双球",
      chubby: "圆滚滚",
      slim: "瘦高"
    },
    eyes: {
      coal: "煤球",
      buttons: "纽扣",
      sparkly: "闪亮",
      sleepy: "困困"
    },
    mouths: {
      pebbles: "小石子",
      smile: "微笑",
      grin: "大笑",
      oh: "哇！"
    },
    noses: {
      carrot: "胡萝卜",
      long: "长萝卜",
      berry: "红果子",
      pinecone: "松果"
    },
    hats: {
      top: "礼帽",
      beanie: "毛线帽",
      santa: "圣诞帽",
      bucket: "水桶帽",
      earmuffs: "耳罩",
      none: "不戴"
    },
    scarves: {
      red: "红色",
      green: "绿色",
      blue: "蓝色",
      yellow: "黄色",
      purple: "紫色",
      none: "不围"
    },
    patterns: {
      solid: "纯色",
      stripes: "条纹",
      dots: "圆点"
    },
    arms: {
      twigs: "树枝",
      mittens: "手套",
      wave: "挥手",
      none: "无手臂"
    },
    extras: {
      broom: "扫帚",
      buttons: "纽扣",
      bird: "小鸟",
      flakes: "闪光"
    },
    scenes: {
      night: "雪夜",
      sunny: "晴天雪地",
      village: "村庄灯火"
    },
    random: "随机来一个",
    back: "← 上一步",
    next: "下一步 →",
    done: "雪人完成啦",
    namePlaceholder: "例如：雪球球",
    ideas: "💡 灵感",
    counter: "{n}/{max}",
    namePresets: [
      "雪球球",
      "团团",
      "糯米团",
      "冰冰",
      "小雪花"
    ]
  },
  card: {
    named: "我是{name}！"
  },
  result: {
    eyebrowMine: "你的雪人堆好啦！",
    eyebrowFriend: "有人专门为你堆了{name}",
    eyebrowFriendNoName: "有人专门为你堆了一个雪人",
    revealHint: "它还盖着一层新雪呢……",
    reveal: "❄️ 拂去积雪",
    imageAlt: "冬日场景中的雪人",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片生成失败，请试试截图保存。",
    edit: "继续堆",
    retry: "再堆一个雪人",
    retryFriend: "我也来堆一个",
    shareTitle: "堆雪人",
    shareText: "快来认识{name}，我堆的雪人 ⛄ 看看吧：",
    shareTextNoName: "看看我堆的雪人 ⛄",
    fileName: "snowman"
  },
  og: {
    brand: "⛄ 堆雪人",
    defaultKicker: "堆雪人",
    defaultTitle: "滚雪球、叠一叠，给雪人穿新衣",
    defaultDesc: "帽子 · 围巾 · 飘雪 · 保存或分享"
  },
  faq: [
    {
      q: "怎样堆出我的雪人？",
      a: "按图片下方的步骤依次选择：雪球、脸、鼻子、帽子、围巾、手臂、配饰和背景。点一个选项就能试穿，雪人会立刻变化。步骤之间可以随时来回切换。"
    },
    {
      q: "“随机来一个”有什么用？",
      a: "它会替你随机搭配所有部件。多点几次，直到遇到喜欢的，再手动改掉其中某一处就行。"
    },
    {
      q: "怎样保存或发送我的雪人？",
      a: "点“雪人完成啦”。“保存图片”会生成 1080×1350 的 PNG 图片，分享按钮则发送链接。打开链接的人先拂去积雪，就能见到你的雪人，还可以自己堆一个。"
    },
    {
      q: "我的雪人保存在哪里？",
      a: "你的选择和名字只存在于链接里，以及你堆雪人期间所用的浏览器中，不会发送到我们的服务器，所以拿到链接的人都能看到。"
    }
  ],
  privacy: {
    title: "隐私政策 | 堆雪人",
    description: "堆雪人的隐私政策：说明你的雪人和名字如何处理，以及 Cookie、广告和匿名统计。",
    h1: "隐私政策",
    introHtml: "堆雪人（以下简称“本服务”）尊重您的隐私，仅处理下文所述的最少信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册账号或登录即可使用。您堆的雪人以及输入的名字不会发送到服务器。它们只存在于您的浏览器中（堆雪人过程中草稿保存在本地存储）以及您分享时的网址里。使用本服务时，可能会按下文所述自动收集部分信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 来展示广告并了解服务的使用情况。您可以在浏览器设置中拒绝或删除 Cookie，但这样做可能导致部分功能无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据您以往访问本网站和其他网站的记录投放广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及自有的汇总计数器，后者只按语言记录每日总数（页面浏览量、完成的雪人数量、星级评分）。这些数据都无法识别您的个人身份，也不包含雪人的名字。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接会把您的雪人编码在网址中，因此任何拿到链接的人都能看到。保存的图片在您的浏览器内生成。请避免在名字中填写地址、电话号码等个人信息。"
      ],
      [
        "6. 联系方式",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 9 日起生效。"
      ]
    ],
    back: "← 返回堆雪人"
  }
};
