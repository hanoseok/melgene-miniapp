/* 万圣节小幽灵制作 — 简体中文 (/zh/)
 * 键结构与 en.js 相同。部件图案与数量在 ghost-core.js。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe', 'Nunito'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '万圣节小幽灵制作 · 捏一只可爱幽灵',
    description: '万圣节小幽灵制作：挑选身体、眼睛、嘴巴和帽子，捏一只专属的可爱小幽灵。免费、无需下载，1分钟完成，可以存成图片，也能用链接发给朋友。',
    ogTitle: '万圣节小幽灵制作 👻 捏一只可爱幽灵',
    ogDescription: '1分钟捏出专属小幽灵，看它轻飘飘地浮起来，再发给朋友看看。',
  },
  siteName: '小幽灵制作',
  privacyLink: '隐私政策',

  start: {
    badge: '👻 万圣节特辑',
    h1Kicker: '万圣节小幽灵制作',
    h1Html: '床单下的<br><em>小幽灵</em>等你来捏',
    hook: '白床单下面躲着谁呢？给它一张脸和一点小个性，它就会轻飘飘地浮起来。',
    start: '开始捏幽灵 →',
  },

  editor: {
    title: '打扮你的小幽灵',
    hint: '小提示：点一下幽灵就换下一个',
    previewAria: '你的小幽灵。点一下换下一个',
    tabsAria: '幽灵部件',
    tabs: { body: '身体', color: '颜色', eyes: '眼睛', mouth: '嘴巴', cheeks: '脸颊', hat: '帽子', item: '手持', bg: '背景' },
    optionAria: '{part} {n}',
    nameLabel: '给幽灵起个名字（可选）',
    namePlaceholder: '例如：飘飘',
    random: '随机',
    done: '完成！',
  },

  result: {
    eyebrowMine: '你的专属小幽灵完成啦！',
    eyebrowFriend: '朋友捏了一只小幽灵送给你',
    untitled: '我的小幽灵',
    imageAlt: '小幽灵：{name}',
    save: '保存图片',
    saving: '正在生成图片…',
    saved: '图片已保存！',
    saveFail: '图片生成失败，请试试截图保存。',
    edit: '继续打扮',
    retry: '再捏一只幽灵',
    retryFriend: '我也要捏幽灵',
    shareTitle: '万圣节小幽灵制作 · 捏一只可爱幽灵',
    shareText: '来看看我捏的小幽灵「{name}」👻 你也来捏一只吧！',
    shareTextNoName: '我捏了一只专属小幽灵 👻 你也来捏一只吧！',
    fileName: 'my-ghost',
  },

  og: {
    brand: '👻 小幽灵制作',
    defaultKicker: '万圣节小幽灵制作',
    defaultTitle: '捏一只专属小幽灵',
    defaultDesc: '表情、帽子、小伙伴 · 浏览器里免费玩',
  },

  faq: [
    { q: '小幽灵要怎么捏？', a: '在编辑器上方选一个标签，再点你喜欢的图案。直接点幽灵本身会换成这个标签里的下一个，点“随机”可以一次全部打乱。满意了就点“完成！”。' },
    { q: '捏好的幽灵能存成图片吗？', a: '可以。点“保存图片”会生成PNG图片。手机上可以通过分享菜单存进相册，电脑上会直接下载。' },
    { q: '分享链接是怎么回事？', a: '幽灵的设计和名字都直接装在链接里。朋友打开后会看到一模一样的小幽灵，也能接着捏自己的。服务器上不会保存任何内容。' },
    { q: '为什么小幽灵在上下飘？', a: '因为幽灵会飘呀！这只是屏幕上的小动画。如果设备开启了“减弱动态效果”，它就会静止不动；保存的图片也一直是静止的。' },
  ],

  privacy: {
    title: '隐私政策 | 小幽灵制作',
    description: '小幽灵制作隐私政策——关于幽灵设计的处理方式、Cookie、广告和访问统计的说明。',
    h1: '隐私政策',
    introHtml: '小幽灵制作（以下简称"本服务"）重视用户的隐私，按照以下方针只处理最少限度的信息。',
    sections: [
      ['1. 收集的信息', '本服务无需注册或登录即可使用。幽灵的设计和名字不会发送到服务器，只在用户的浏览器中处理（分享时会包含在URL中）。不过在使用过程中，以下信息可能会被自动收集。'],
      ['2. Cookie等技术的使用', '本服务可能为投放广告和分析使用情况而使用Cookie。用户可以在浏览器设置中拒绝或删除Cookie，但这样可能会影响部分功能的正常使用。'],
      ['3. 广告服务（Google AdSense）', '本服务通过Google AdSense投放广告。Google及其广告合作伙伴可能使用Cookie，根据用户过去的访问记录投放广告。详情及个性化设置可在<a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>中查看和修改。'],
      ['4. 访问统计分析', '为改善服务，本服务可能使用Google Analytics（GA4）以及只保留按日期、语言汇总的自有统计（访问量、完成的幽灵数、星级评分）。不会收集能识别个人身份的信息。'],
      ['5. 分享链接和图片', '通过"分享"生成的链接中，会以URL编码的形式包含用户做的幽灵设计和输入的名字。保存的图片在用户的浏览器中生成。建议名字中不要输入能识别个人身份的信息。'],
      ['6. 联系方式', '如对本隐私政策有任何疑问，请联系本服务的运营者。'],
      ['7. 生效日期', '本政策自2026年10月1日起施行。'],
    ],
    back: '← 返回小幽灵制作',
  },
};
