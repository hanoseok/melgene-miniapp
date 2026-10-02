/* 万圣节派对邀请函制作 — 中文(简体)
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&display=swap",
    display: "'ZCOOL KuaiLe', 'Nunito'",
    displayWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "万圣节派对邀请函制作",
    description: "免费制作万圣节派对邀请函：填写派对名称、日期、时间和地点，选择幽灵、南瓜、蝙蝠或女巫主题，可存成图片或生成链接发给朋友。无需安装，1分钟完成。",
    ogTitle: "万圣节派对邀请函制作 🎃",
    ogDescription: "填好派对名称和时间，就能做出一张又酷又可爱的邀请函，发给朋友吧。"
  },
  siteName: "万圣节派对邀请函制作",
  privacyLink: "隐私政策",
  start: {
    badge: "🎃 万圣节特辑",
    h1Kicker: "万圣节派对邀请函",
    h1Html: "邀请大家来<br><em>一场惊悚派对</em>",
    hook: "写上派对名称和时间，挑一个主题，就能做出让人忍不住点开的邀请函。",
    start: "制作邀请函 →"
  },
  editor: {
    title: "设计你的邀请函",
    themesAria: "邀请函主题",
    themes: {
      ghost: "幽灵",
      pumpkin: "南瓜",
      bat: "蝙蝠",
      witch: "女巫",
      spider: "蜘蛛"
    },
    previewAria: "邀请函预览",
    fields: {
      title: {
        label: "派对名称",
        placeholder: "例如：鬼屋派对"
      },
      date: {
        label: "日期"
      },
      time: {
        label: "时间"
      },
      place: {
        label: "地点",
        placeholder: "例如：我家三楼"
      },
      note: {
        label: "给客人的话",
        placeholder: "例如：欢迎来变装！"
      }
    },
    done: "完成邀请函"
  },
  card: {
    invited: "诚邀您参加！",
    defaultTitle: "万圣节派对"
  },
  result: {
    eyebrowMine: "邀请函做好了！",
    eyebrowFriend: "你收到一张邀请函",
    imageAlt: "邀请函：{title}",
    save: "保存图片",
    saving: "正在生成图片…",
    saved: "图片已保存！",
    saveFail: "图片生成失败，请改用截图保存。",
    copyText: "复制文字",
    copied: "文字已复制！",
    copyFail: "复制失败，请再试一次。",
    edit: "修改",
    retry: "再做一张",
    retryFriend: "我也做一张",
    shareTitle: "万圣节派对邀请函制作",
    shareText: "诚邀你参加“{title}”！🎃 打开邀请函看看：",
    shareTextNoTitle: "诚邀你参加万圣节派对！🎃 打开邀请函看看：",
    fileName: "party-invitation"
  },
  og: {
    brand: "🎃 万圣节邀请函",
    defaultKicker: "万圣节派对",
    defaultTitle: "制作你的派对邀请函",
    defaultDesc: "选一个惊悚主题 · 存成图片或发链接",
    cardTitle: "万圣节派对"
  },
  faq: [
    {
      q: "邀请函怎么做？",
      a: "选择主题，填写派对名称、日期、时间、地点和给客人的话，再点“完成邀请函”。每一项都可以留空，输入时预览会立刻更新。"
    },
    {
      q: "可以把邀请函存成图片吗？",
      a: "可以。点“保存图片”会生成一张PNG，可以发到任何聊天里。手机上会打开分享面板，电脑上则直接下载。"
    },
    {
      q: "分享链接是怎么工作的？",
      a: "邀请函的全部内容都包含在链接里，打开链接的人会看到一模一样的邀请函。我们的服务器不保存任何内容，打开别人的链接也不会改变你自己的邀请函。"
    },
    {
      q: "能只发文字吗？",
      a: "可以。点“复制文字”，派对名称、日期、时间、地点、留言和链接会一起复制，直接粘贴到消息里即可。"
    }
  ],
  privacy: {
    title: "隐私政策 | 万圣节派对邀请函制作",
    description: "万圣节派对邀请函制作隐私政策——关于邀请函内容的处理方式、Cookie、广告和访问统计的说明。",
    h1: "隐私政策",
    introHtml: "万圣节派对邀请函制作（以下简称\"本服务\"）重视用户的隐私，按照以下方针只处理最少限度的信息。",
    sections: [
      [
        "1. 收集的信息",
        "本服务无需注册或登录即可使用。你填写的派对名称、日期、时间、地点和留言不会发送到服务器，只在用户的浏览器中处理（分享时会包含在URL中）。不过在使用过程中，以下信息可能会被自动收集。"
      ],
      [
        "2. Cookie等技术的使用",
        "本服务可能为投放广告和分析使用情况而使用Cookie。用户可以在浏览器设置中拒绝或删除Cookie，但这样可能会影响部分功能的正常使用。"
      ],
      [
        "3. 广告服务（Google AdSense）",
        "本服务通过Google AdSense投放广告。Google及其广告合作伙伴可能使用Cookie，根据用户过去的访问记录投放广告。详情及个性化设置可在<a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 广告设置</a>中查看和修改。"
      ],
      [
        "4. 访问统计分析",
        "为改善服务，本服务可能使用Google Analytics（GA4）以及只保留按日期、语言汇总的自有统计（访问量、完成的邀请函数、星级评分）。不会收集能识别个人身份的信息。"
      ],
      [
        "5. 分享链接和图片",
        "通过\"分享\"生成的链接中，会以URL编码的形式包含你填写的邀请函内容。保存的图片在用户的浏览器中生成。建议不要在地点中填写家庭详细住址等能识别个人身份的信息。"
      ],
      [
        "6. 联系方式",
        "如对本隐私政策有任何疑问，请联系本服务的运营者。"
      ],
      [
        "7. 生效日期",
        "本政策自2026年10月3日起施行。"
      ]
    ],
    back: "← 返回邀请函制作"
  }
};
