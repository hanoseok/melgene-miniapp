/* 彩票号码生成器 — zh. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe'",
    displayWeight: 400,
    sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC'",
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: '彩票号码生成器：随机选号工具',
    description: '韩国乐透6/45、欧洲式5/50+2、美国强力球，或自定义号码范围。可固定想要的号码、排除不想要的号码，一次最多生成5注，仅供娱乐，无需注册。',
    ogTitle: '彩票号码生成器 🎱 随机选号',
    ogDescription: '随手选一组幸运号码，一次最多5注。'
  },
  siteName: '彩票号码生成器',
  privacyLink: '隐私政策',
  start: {
    badge: '🎱 仅供娱乐',
    h1Kicker: '彩票号码生成器',
    h1Html: '今天<em>手气</em>怎么样？<br>来摇一组号码',
    hook: '选好玩法，固定几个想要的号码，再排除不想要的，看着彩球一颗颗滚出来。一次最多5注。',
    facts: '韩国乐透 · 欧洲式 · 强力球 · 自定义 · 仅供娱乐',
    start: '开始摇号 →'
  },
  tool: {
    title: '设置摇号',
    presetLabel: '选哪种玩法？',
    presets: {
      kr: '韩国乐透 6/45',
      euro: '欧洲式 5/50 + 2',
      us: '美国强力球',
      custom: '自定义'
    },
    presetInfo: {
      kr: '从1到45选6个',
      euro: '从1到50选5个 + 从1到12选2个星号球',
      us: '从1到69选5个 + 从1到26选1个强力球',
      custom: '自己决定选几个号码和最大号码'
    },
    pickLabel: '选几个号码',
    maxLabel: '最大号码',
    gamesLabel: '几注？',
    fixedLabel: '固定号码（可选）',
    fixedHint: '例如 7, 21，每一注都会包含',
    fixedPh: '7, 21',
    excludeLabel: '排除号码（可选）',
    excludeHint: '例如 4, 13，绝不会摇出',
    excludePh: '4, 13',
    draw: '开始摇球 🎱',
    drawing: '摇号中…',
    machine: '彩球在摇奖机里翻滚',
    note: '仅供娱乐。每种组合出现的概率相同，本工具无法预测开奖，也不能提高中奖几率。',
    errors: {
      bad: '请输入1到{max}之间的整数，用逗号分隔。',
      overlap: '同一个号码不能既固定又排除。',
      tooMany: '固定号码最多{pick}个。',
      notEnough: '排除的号码太多，无法选出{pick}个。'
    }
  },
  result: {
    title: '你的幸运号码',
    game: '第{n}注',
    extraNames: {
      euro: '星号球',
      us: '强力球'
    },
    copy: '复制号码 📋',
    copied: '号码已复制',
    again: '再摇一次',
    change: '返回设置',
    disclaimer: '仅供娱乐，不预测开奖，也不保证中奖。',
    shareTitle: '彩票号码生成器',
    shareText: '我的幸运号码 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 彩票号码生成器',
    kicker: '随机选号 · 仅供娱乐',
    title: '今天手气怎么样？',
    desc: '选好玩法，一次最多摇5注号码'
  },
  faq: [
    {
      q: '号码是怎么摇出来的？',
      a: '先选玩法（韩国乐透、欧洲式、美国强力球或自定义范围），再选一到五注，点摇号按钮即可。结果会先确定，彩球再按顺序滚出，最后每一注都会按从小到大排好显示。'
    },
    {
      q: '真的是随机的吗？',
      a: '是的。号码来自浏览器的加密随机数生成器（crypto.getRandomValues）并使用拒绝采样，所以每个可选号码的概率完全相同，没有偏差。彩球滚动只是演示效果。'
    },
    {
      q: '固定号码和排除号码有什么作用？',
      a: '固定号码会出现在每一注里，其余号码围绕它们随机选取；排除号码绝不会出现。它们只作用于主号码，不影响星号球或强力球。'
    },
    {
      q: '用它能提高中奖几率吗？',
      a: '不能。真实开奖中每种组合的概率都一样，没有任何工具能预测结果。这个生成器只是随手选号的小乐趣，不保证中奖。'
    }
  ],
  privacy: {
    title: '隐私政策 | 彩票号码生成器',
    description: '彩票号码生成器的隐私政策：你输入的号码只在浏览器中处理，以及 Cookie、广告和访问统计的说明。',
    h1: '隐私政策',
    introHtml: '彩票号码生成器(以下简称“本服务”)尊重您的隐私，仅按以下方式处理必要的最少信息。',
    sections: [
      [
        '1. 我们收集的信息',
        '本服务无需注册或登录即可使用。您输入的号码和生成的结果只在您的浏览器中处理，不会发送到我们的服务器。但在使用过程中，下列信息可能会被自动收集。'
      ],
      [
        '2. Cookie 及类似技术',
        '本服务可能使用 Cookie 和浏览器本地存储来记住语言设置、展示广告以及分析使用情况。您可以在浏览器设置中拒绝或删除它们，但部分功能可能因此无法正常使用。'
      ],
      [
        '3. 广告服务(Google AdSense)',
        '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据您此前访问本网站和其他网站的记录投放广告。您可以在 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a> 中了解详情并更改偏好。'
      ],
      [
        '4. 访问统计',
        '为改进服务，我们可能使用 Google Analytics(GA4)以及只保留每日各语言合计数的自有统计(浏览量、抽取次数、星级评分)。这些数据不会识别您的个人身份。'
      ],
      [
        '5. 联系方式',
        '如对本隐私政策有任何疑问，请联系网站运营者。'
      ],
      [
        '6. 生效日期',
        '本政策自2026年10月7日起生效。'
      ]
    ],
    back: '← 返回彩票号码生成器'
  }
};
