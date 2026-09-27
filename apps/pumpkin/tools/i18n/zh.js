/* 万圣节南瓜灯制作 — 简体中文 (/zh/)
 * 键结构与 en.js 相同。部件图形和数量见 pumpkin-core.js。
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
    title: '万圣节南瓜灯制作 · 在线雕刻南瓜',
    description: '万圣节南瓜灯在线制作：挑选眼睛、鼻子和嘴巴，点亮蜡烛，做一盏属于你的杰克南瓜灯。免费、无需下载，1分钟完成，可以保存图片或用链接发给朋友。',
    ogTitle: '万圣节南瓜灯制作🎃在线雕刻南瓜',
    ogDescription: '1分钟做一盏专属南瓜灯，点亮蜡烛发给朋友。',
  },
  siteName: '南瓜灯制作',
  privacyLink: '隐私政策',

  start: {
    badge: '🎃 万圣节特辑',
    h1Kicker: '万圣节南瓜灯制作',
    h1Html: '雕一盏<br>专属<em>南瓜灯</em>',
    hook: '不用刀，也不用收拾。给南瓜配上表情，点亮蜡烛，它就会暖暖地亮起来。',
    start: '开始雕南瓜 →',
  },

  editor: {
    title: '来雕你的南瓜吧',
    hint: '小提示：点一下南瓜就换成下一个',
    previewAria: '你的南瓜，点一下换成下一个',
    tabsAria: '南瓜部位',
    tabs: { shape: '形状', color: '颜色', eyes: '眼睛', nose: '鼻子', mouth: '嘴巴', stem: '瓜蒂', extra: '装饰' },
    optionAria: '{part} {n}',
    glow: '蜡烛',
    night: '夜空',
    nameLabel: '给南瓜起个名字（可选）',
    namePlaceholder: '例如：笑嘻嘻小南瓜',
    random: '随机',
    done: '完成！',
  },

  result: {
    eyebrowMine: '你的南瓜灯做好啦！',
    eyebrowFriend: '朋友为你雕了一盏南瓜灯',
    untitled: '我的南瓜灯',
    imageAlt: '南瓜灯：{name}',
    save: '保存图片',
    saving: '正在生成图片…',
    saved: '图片已保存！',
    saveFail: '图片生成失败，请截屏保存。',
    edit: '继续修改',
    retry: '再雕一个南瓜',
    retryFriend: '我也来雕一个',
    shareTitle: '万圣节南瓜灯制作 · 在线雕刻南瓜',
    shareText: '我雕了一盏南瓜灯「{name}」🎃 你也来做一个吧！',
    shareTextNoName: '我雕了一盏专属南瓜灯🎃 你也来做一个吧！',
    fileName: 'pumpkin-lantern',
  },

  og: {
    brand: '🎃 南瓜灯制作',
    defaultKicker: '万圣节南瓜灯制作',
    defaultTitle: '雕一盏专属南瓜灯',
    defaultDesc: '眼睛、鼻子、嘴巴和烛光 · 免费，无需下载',
  },

  faq: [
    { q: '南瓜灯怎么做？', a: '选择形状、颜色、眼睛、鼻子、嘴巴、瓜蒂或装饰标签，再点你喜欢的样式。直接点南瓜会换成下一个样式，点“随机”会一次全部打乱。满意了就点“完成！”。' },
    { q: '做好的南瓜灯可以保存成图片吗？', a: '可以。点“保存图片”会生成PNG图片。手机上可以通过分享菜单存到相册，电脑上会直接下载。' },
    { q: '分享链接是怎么回事？', a: '南瓜的设计和名字都装在链接里。朋友打开链接就能看到一模一样的南瓜，也可以动手做自己的。我们的服务器不保存任何内容。' },
    { q: '蜡烛和夜空开关有什么用？', a: '打开蜡烛，雕出来的部分会像真的点了蜡烛一样暖暖发光；关掉就是白天的南瓜。夜空开关可以把背景在星空和明亮背景之间切换。' },
  ],

  privacy: {
    title: '隐私政策 | 南瓜灯制作',
    description: '南瓜灯制作隐私政策——关于南瓜设计的处理方式、Cookie、广告和访问统计的说明。',
    h1: '隐私政策',
    introHtml: '南瓜灯制作（以下简称"本服务"）重视用户的隐私，按照以下方针只处理最少限度的信息。',
    sections: [
      ['1. 收集的信息', '本服务无需注册或登录即可使用。南瓜的设计和名字不会发送到服务器，只在用户的浏览器中处理（分享时会包含在URL中）。不过在使用过程中，以下信息可能会被自动收集。'],
      ['2. Cookie等技术的使用', '本服务可能为投放广告和分析使用情况而使用Cookie。用户可以在浏览器设置中拒绝或删除Cookie，但这样可能会影响部分功能的正常使用。'],
      ['3. 广告服务（Google AdSense）', '本服务通过Google AdSense投放广告。Google及其广告合作伙伴可能使用Cookie，根据用户过去的访问记录投放广告。详情及个性化设置可在<a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google广告设置</a>中查看和修改。'],
      ['4. 访问统计分析', '为改善服务，本服务可能使用Google Analytics（GA4）以及只保留按日期、语言汇总的自有统计（访问量、完成的南瓜数、星级评分）。不会收集能识别个人身份的信息。'],
      ['5. 分享链接和图片', '通过"分享"生成的链接中，会以URL编码的形式包含用户做的南瓜设计和输入的名字。保存的图片在用户的浏览器中生成。建议名字中不要输入能识别个人身份的信息。'],
      ['6. 联系方式', '如对本隐私政策有任何疑问，请联系本服务的运营者。'],
      ['7. 生效日期', '本政策自2026年9月28日起施行。'],
    ],
    back: '← 返回南瓜灯制作',
  },
};
