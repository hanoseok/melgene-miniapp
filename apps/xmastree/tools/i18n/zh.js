/* 装饰圣诞树 — 简体中文 (/zh/)。键结构与 en.js 相同。{name} {n} {max} 保持原样。
 * editor.presets 为中文原创的圣诞树留言（每条不超过 50 字），不是英文翻译。
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
    title: "装饰圣诞树｜在线圣诞树装饰小游戏",
    description: "在线装饰圣诞树：选一棵树，挂上彩球、星星和拐杖糖，打开闪烁的彩灯和飘雪，完成后保存图片或分享链接给朋友。",
    ogTitle: "装饰圣诞树 🎄",
    ogDescription: "挂上装饰、点亮彩灯，一分钟做好你的专属圣诞树并分享出去。"
  },
  siteName: "装饰圣诞树",
  privacyLink: "隐私政策",
  start: {
    badge: "🎄 圣诞限定",
    h1Kicker: "装饰圣诞树",
    h1Html: "亲手装扮<br><em>闪亮圣诞树</em>",
    hook: "挂上彩球和拐杖糖，点亮彩灯，再下一场雪，把装饰好的圣诞树送给你在乎的人。",
    start: "开始装饰 →"
  },
  editor: {
    title: "装饰你的圣诞树",
    canvasAria: "你的圣诞树。点击挂上选中的装饰，拖动装饰可以移动位置。",
    hint: "点击树挂装饰 · 拖动可移动",
    paletteLabel: "装饰",
    kinds: {
      red: "红色彩球",
      gold: "金色彩球",
      blue: "蓝色彩球",
      purple: "紫色彩球",
      silver: "银色彩球",
      star: "星星",
      bell: "铃铛",
      cane: "拐杖糖",
      gift: "礼物",
      bow: "蝴蝶结",
      sock: "圣诞袜",
      flake: "雪花",
      cookie: "饼干",
      erase: "橡皮擦"
    },
    undo: "撤销",
    clear: "清空",
    auto: "随机装饰",
    count: "装饰 {n}/{max}",
    full: "圣诞树挂满啦！请先移动或擦掉一个装饰。",
    styleLabel: "树型",
    styles: {
      classic: "经典",
      snowy: "雪松",
      nordic: "北欧",
      pink: "粉色"
    },
    bgLabel: "背景",
    bgs: {
      night: "星空",
      cozy: "温馨小屋",
      snowfield: "雪原",
      red: "喜庆红"
    },
    topperLabel: "树顶",
    toppers: {
      none: "无",
      star: "星星",
      angel: "天使",
      bow: "蝴蝶结"
    },
    extrasLabel: "效果",
    snow: "飘雪",
    lights: "彩灯",
    fields: {
      name: {
        label: "你的名字",
        placeholder: "例如：小雪"
      },
      message: {
        label: "一句话",
        placeholder: "例如：圣诞快乐！"
      }
    },
    ideas: "💡 灵感",
    counter: "{n}/{max}",
    presets: [
      "圣诞快乐，平安喜乐！🎄",
      "平安夜吃个苹果，岁岁平安🍎",
      "今年辛苦啦，愿你冬天暖暖的",
      "圣诞快乐，新年也要顺顺利利！",
      "和喜欢的人一起过个温暖的圣诞吧✨"
    ],
    done: "完成装饰"
  },
  card: {
    by: "{name} 装饰的圣诞树"
  },
  result: {
    eyebrowMine: "你的圣诞树完成啦！",
    eyebrowFriend: "{name} 为你装饰了这棵圣诞树",
    eyebrowFriendNoName: "有人为你装饰了这棵圣诞树",
    imageAlt: "挂着 {n} 个装饰的圣诞树",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片生成失败，请试试截图保存。",
    edit: "继续装饰",
    retry: "再装饰一棵",
    retryFriend: "我也来装饰",
    shareTitle: "装饰圣诞树",
    shareText: "{name} 装饰了一棵圣诞树🎄 快来看看：",
    shareTextNoName: "来看看我装饰的圣诞树🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 装饰圣诞树",
    defaultKicker: "装饰圣诞树",
    defaultTitle: "亲手装扮闪亮圣诞树",
    defaultDesc: "装饰 · 彩灯 · 飘雪 · 保存或分享"
  },
  faq: [
    {
      q: "怎么挂装饰？",
      a: "在树下方的一排装饰中选一个，然后点击树上任意位置就能挂上。想移动时，按住装饰拖动即可。选橡皮擦可以去掉单个装饰，点“撤销”可以退回上一步。"
    },
    {
      q: "挂好装饰后还能换树吗？",
      a: "可以。树型、背景和树顶装饰随时都能更换，飘雪和彩灯也能随时开关。已经挂好的装饰会留在原来的位置。"
    },
    {
      q: "怎么保存或发送我的圣诞树？",
      a: "点击“完成装饰”。“保存图片”会生成一张 1080×1350 的 PNG 图片，分享按钮则会发送链接。打开链接的人能看到你那棵彩灯闪烁的圣诞树，也可以自己装饰一棵。"
    },
    {
      q: "我的圣诞树保存在哪里？",
      a: "装饰、名字和留言只保存在链接里，装饰过程中也只保存在你自己的浏览器中。它们不会发送到我们的服务器，所以拿到链接的人都能看到。"
    }
  ],
  privacy: {
    title: "隐私政策 | 装饰圣诞树",
    description: "装饰圣诞树的隐私政策：说明你的圣诞树、名字和留言如何处理，以及 Cookie、广告和匿名统计。",
    h1: "隐私政策",
    introHtml: "装饰圣诞树（以下简称“本服务”）尊重您的隐私，仅处理下文所述的最少信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册账号或登录即可使用。您的圣诞树以及输入的名字和留言不会发送到服务器。它们只存在于您的浏览器中（装饰过程中草稿保存在本地存储）以及您分享时的网址里。使用本服务时，可能会按下文所述自动收集部分信息。"
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
        "为改进服务，我们可能使用 Google Analytics（GA4）以及自有的汇总计数器，后者只按语言记录每日总数（页面浏览量、完成的圣诞树数量、星级评分）。这些数据都无法识别您的个人身份，也不包含您的名字或留言。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接会把您的圣诞树编码在网址中，因此任何拿到链接的人都能看到。保存的图片在您的浏览器内生成。请避免在留言中填写地址、电话号码等个人信息。"
      ],
      [
        "6. 联系方式",
        "如对本隐私政策有任何疑问，请联系网站运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自 2026 年 11 月 5 日起生效。"
      ]
    ],
    back: "← 返回装饰圣诞树"
  }
};
