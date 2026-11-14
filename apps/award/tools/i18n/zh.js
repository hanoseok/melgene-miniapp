/* 奖状制作 — 简体中文 (zh/)。键结构与 en.js 相同，说明见 en.js 开头。 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&family=Noto+Serif+SC:wght@700;900&display=swap",
    display: "'ZCOOL KuaiLe', 'Nunito'",
    displayWeight: 400,
    serif: "'Noto Serif SC'",
    serifWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "奖状制作｜搞笑奖状在线生成",
    description: "奖状在线制作：写上奖项和获奖理由，选好样式和印章，1分钟做出搞笑奖状、感谢状。可存成A4图片，或发链接开启颁奖仪式。",
    ogTitle: "奖状制作 🏆",
    ogDescription: "年会、班会、朋友聚会都能用，做一张搞笑又暖心的奖状，用链接颁给TA。"
  },
  siteName: "奖状制作",
  privacyLink: "隐私政策",
  start: {
    badge: "🏆 年终颁奖季",
    h1Kicker: "奖状制作",
    h1Html: "总有一个人，<br><em>值得发个奖</em>",
    hook: "写上奖项和理由做成奖状，发个链接，对方打开就像真的颁奖典礼。",
    start: "开始做奖状 →"
  },
  editor: {
    title: "设计奖状",
    themesAria: "奖状样式",
    themes: {
      gold: "经典金框",
      pastel: "可爱马卡龙",
      minimal: "简约",
      ribbon: "复古缎带"
    },
    previewAria: "奖状预览",
    examplesAria: "奖项名称示例",
    sealLabel: "印章",
    seals: {
      none: "不要",
      red: "红色印章",
      gold: "金牌"
    },
    fields: {
      title: {
        label: "奖项名称",
        placeholder: "例：年度最佳搭子奖"
      },
      to: {
        label: "获奖人",
        placeholder: "例：小雨"
      },
      reason: {
        label: "获奖理由",
        placeholder: "在过去的一年里……"
      },
      date: {
        label: "日期"
      },
      issuer: {
        label: "颁发人/单位",
        placeholder: "例：三楼零食委员会"
      }
    },
    titleExamples: [
      "年度最佳搭子奖",
      "零食分享大使",
      "气氛担当奖",
      "最强捧场王"
    ],
    dice: "🎲 随机",
    counter: "{n}/{max}",
    reasons: [
      "在过去的一年里，你让群聊从未冷场，表情包质量稳居第一，特发此奖。",
      "无论周一多难熬，你总是笑着说早安，照亮了大家的一周。",
      "你抽屉里的零食从不吝啬分享，承包了全组的下午茶快乐。",
      "每次你都第一个说“我来”，又最后一个收拾完离开。",
      "再冷的笑话你都能笑出声，拯救了无数尴尬瞬间。",
      "你记得每个人的生日和咖啡口味，细心得让人感动。",
      "面对打印机卡纸、地铁晚点和烤糊的面包，你始终淡定从容。",
      "你把最后一块饼干让了出来，这份胸怀值得表彰。",
      "虽然是路痴，但你总能找到最好吃的那家店。",
      "在我难过的时候，你总是默默陪在身边，谢谢你。",
      "你勇敢地第一个尝试没人敢点的新菜，为大家排雷。",
      "这一年你证明了：有你在，身边就会变得温暖。"
    ],
    done: "完成奖状"
  },
  card: {
    heading: "奖 状",
    defaultTitle: "优秀奖",
    presented: "获奖人",
    name: "{name}",
    closing: "特发此状，以资鼓励。",
    sealFallback: "奖"
  },
  open: {
    eyebrow: "🏆 颁奖典礼",
    forName: "颁给 {name} 的奖状",
    forNone: "一张颁给你的奖状",
    hint: "点一下卷轴，把它展开",
    open: "展开奖状"
  },
  result: {
    eyebrowMine: "奖状做好啦！",
    eyebrowFriend: "恭喜 {name} 获奖！",
    eyebrowFriendNoName: "恭喜获奖！",
    imageAlt: "奖状：{title}",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片生成失败，请试试截图。",
    edit: "修改",
    retry: "再做一张",
    retryFriend: "我也来做一张",
    shareTitle: "奖状制作",
    shareText: "{name}，你有一张奖状 🏆 点开颁奖典礼：",
    shareTextNoName: "有人给你颁了奖 🏆 点开颁奖典礼：",
    fileName: "award-certificate"
  },
  og: {
    brand: "🏆 奖状制作",
    defaultKicker: "奖状制作",
    defaultTitle: "总有一个人，值得发个奖",
    defaultDesc: "4种样式 · 印章 · A4图片和颁奖链接",
    sampleTitle: "年度最佳搭子奖"
  },
  faq: [
    {
      q: "怎么做奖状？",
      a: "从4种样式中选一个，写上奖项名称、获奖人和获奖理由，再定好日期、颁发人和印章就行。边写边预览，满意了就点“完成奖状”。"
    },
    {
      q: "保存的图片是多大？",
      a: "“保存图片”会生成1240×1754的PNG，和A4纸比例一样，打印出来很整齐，发到微信里也清楚。手机上会打开分享面板，电脑上直接下载。"
    },
    {
      q: "对方打开链接会看到什么？",
      a: "一场小小的颁奖典礼：先出现一个卷轴，点一下就会展开写着名字的奖状。标题和日期会用对方的语言显示，对方也能马上做一张自己的奖状。"
    },
    {
      q: "我写的内容保存在哪里？",
      a: "只在分享链接和你自己的浏览器里。内容不会发送到我们的服务器，所以拿到链接的人都能看到奖状，请只发给你想发的人。"
    }
  ],
  privacy: {
    title: "隐私政策 | 奖状制作",
    description: "奖状制作的隐私政策：你输入的文字如何处理、Cookie、广告与匿名统计。",
    h1: "隐私政策",
    introHtml: "奖状制作（以下简称“本服务”）尊重你的隐私，只处理下面说明的最少信息。",
    sections: [
      [
        "1. 我们收集的信息",
        "本服务无需注册或登录即可使用。你输入的奖项名称、名字、理由和日期不会发送到服务器，只保存在你的浏览器中（编辑时暂存在本地存储）以及分享时的网址里。使用过程中可能会自动收集下面所述的信息。"
      ],
      [
        "2. Cookie 及类似技术",
        "本服务可能使用 Cookie 来展示广告和了解使用情况。你可以在浏览器设置中拒绝或删除 Cookie，但部分功能可能因此无法正常使用。"
      ],
      [
        "3. 广告（Google AdSense）",
        "本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据你过去访问本站和其他网站的记录投放广告。详情及设置请见 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>。"
      ],
      [
        "4. 统计",
        "为改进服务，我们可能使用 Google Analytics（GA4）以及只按语言保存每日总数的自有统计（页面浏览、完成的奖状数、星级评分）。这些信息无法识别个人身份，也不包含你写的内容。"
      ],
      [
        "5. 分享链接与图片",
        "通过“分享”生成的链接把奖状内容编码在网址中，任何拿到链接的人都能看到。保存的图片在你的浏览器中生成。请不要在奖状上写地址、电话等个人信息。"
      ],
      [
        "6. 联系我们",
        "如对本隐私政策有疑问，请联系网站运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自2026年11月15日起生效。"
      ]
    ],
    back: "← 返回奖状制作"
  }
};
