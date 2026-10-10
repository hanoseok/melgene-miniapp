/* 二维码生成器 — 简体中文 (/zh/)
 * 编码器在 qr-core.js，本文件是该语言的全部界面文字。键结构与 en.js 相同。
 * 占位符 {bytes} {v} {n} {ratio} {value} 保持不变。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700;900&display=swap',
    display: "'PingFang SC', 'Noto Sans SC'",
    displayWeight: 900,
    sans: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '二维码生成器 – 免费在线制作二维码',
    description: '免费在线二维码生成器：网址、文字、Wi-Fi、邮箱、电话都能做成二维码。可选颜色、容错级别和尺寸，下载PNG或SVG。无需注册，只在浏览器里生成。',
    ogTitle: '二维码生成器 🔳 免费、无需注册',
    ogDescription: '几秒做好网址、Wi-Fi、邮箱、电话二维码，内容不会上传服务器。',
  },
  siteName: '二维码生成器',
  privacyLink: '隐私政策',
  fileName: 'qr-code',

  hero: {
    h1Kicker: '二维码生成器',
    h1Html: '边输入边生成<br>你的<em>二维码</em>',
    hook: '网址、文字、Wi-Fi、邮箱、电话号码，一边输入一边变成二维码。免费、免注册，只在你的浏览器里生成。',
  },

  ui: {
    typeLabel: '二维码里放什么？',
    types: { link: '网址', text: '文字', wifi: 'Wi-Fi', email: '邮箱', phone: '电话' },
    link: { label: '网站地址', placeholder: 'example.com/menu' },
    text: { label: '要放的文字', placeholder: '备忘、口令、一句话…' },
    wifi: {
      ssid: '网络名称（SSID）', ssidPh: 'MyHomeWiFi',
      password: '密码', passwordPh: 'Wi-Fi 密码',
      security: '加密方式',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP（旧）', nopass: '无密码' },
      hidden: '隐藏网络',
    },
    email: { to: '收件人邮箱', toPh: 'name@example.com', subject: '主题（可选）', subjectPh: '你好', body: '正文（可选）', bodyPh: '写点什么…' },
    phone: { label: '电话号码', placeholder: '138 0013 8000' },

    previewLabel: '二维码预览',
    previewReady: '二维码预览，版本 {v}',
    emptyPreview: '输入内容后，二维码会出现在这里',
    info: '{bytes} 字节 · 版本 {v} · {n}×{n} 模块',
    encodes: '内容：{value}',
    tooLong: '内容太长，一个二维码放不下。请缩短，或把容错级别调低（L）。',
    encodeFail: '无法生成这个二维码，请修改内容再试。',
    warnContrast: '对比度偏低（{ratio}:1），可能扫不出来。建议浅色背景配深色二维码。',
    warnInverted: '深色背景上的浅色二维码，部分扫码应用无法识别反色二维码。',
    warnQuiet: '留白太窄会影响识别，请至少留 2 格（标准为 4 格）。',

    downloadPng: '下载 PNG',
    downloadSvg: '下载 SVG',
    copyImage: '复制图片',
    savedPng: 'PNG 已保存。打印前先用手机扫一下试试。',
    savedSvg: 'SVG 已保存。放大印刷也清晰。',
    copied: '图片已复制，可以粘贴到文档或聊天里。',
    copyFail: '这里不支持复制图片，请改用下载 PNG。',
    saveFail: '保存失败，请再试一次。',

    options: '🎨 颜色 · 尺寸 · 容错级别',
    colors: '颜色',
    fg: '二维码',
    bg: '背景',
    resetColors: '恢复默认',
    ecc: '容错级别',
    eccHint: '级别越高越耐脏、耐遮挡（比如中间加 Logo），但图案更密。一般选 M 就够了。',
    size: '图片尺寸',
    margin: '留白（静区）',
    marginHint: '二维码四周的空白边，以模块计。标准是 4 格。',
    localNote: '🔒 只在你的浏览器里生成，输入的内容不会发送到服务器。',
  },

  result: {
    doneTitle: '二维码做好了 ✓',
    doneText: '打印或分享前，请先用手机相机扫一下确认。随时修改上面的内容就能做新的二维码。',
    again: '再做一个二维码',
    shareTitle: '二维码生成器 – 免费，浏览器内完成',
    shareText: '几秒做好网址、Wi-Fi、文字二维码，全程在浏览器里完成 🔳',
  },

  og: {
    brand: '🔳 二维码生成器',
    kicker: '网址 · Wi-Fi · 文字 · PNG/SVG',
    title: '几秒做好二维码',
    desc: '免费 · 免注册 · 只在浏览器里生成',
  },

  faq: [
    { q: '我输入的内容会被上传吗？', a: '不会。二维码由浏览器里的 JavaScript 计算，网址、Wi-Fi 密码和消息都不会到达服务器，也不会被保存，关闭页面就没了。' },
    { q: '生成的二维码会过期吗？', a: '不会。这是静态二维码，内容直接写在图案里，中间没有跳转地址或统计链接。只要指向的网址或 Wi-Fi 还在，印出来的二维码就一直能用。' },
    { q: 'Wi-Fi 二维码怎么用？', a: '它用标准的 WIFI: 格式保存网络名称、密码和加密方式。用 iPhone 或安卓自带相机一扫，就会提示连接这个网络，客人不用再手动输入密码。' },
    { q: '容错级别该选哪个？', a: '大多数情况选 M（约 15% 可恢复）。印在粗糙材质上、容易磨损，或者中间要放 Logo，就选 Q 或 H。内容很长、只在屏幕上显示时，可以选图案最小的 L。' },
    { q: 'PNG 和 SVG 有什么区别？', a: 'PNG 是普通图片，适合网页、聊天和文档。SVG 是矢量文件，放多大都清晰，最适合海报、传单和交给印刷厂。' },
  ],

  privacy: {
    title: '隐私政策 | 二维码生成器',
    description: '二维码生成器隐私政策：输入内容只留在浏览器里，以及 Cookie、广告和统计说明。',
    h1: '隐私政策',
    introHtml: '二维码生成器（以下简称“本服务”）尊重你的隐私，只处理下文所述的最少信息。',
    sections: [
      ['1. 收集的信息', '本服务无需注册或登录即可使用。你输入的网址、文字、Wi-Fi 信息、邮箱地址和电话号码只在你的浏览器里转换成二维码，不会发送到我们的服务器，也不会被保存。使用过程中可能会自动收集以下信息。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言设置、展示广告并了解使用情况。你可以在浏览器设置中拒绝或删除，但部分功能可能因此无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据你过去访问本网站和其他网站的记录投放广告。详情及设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及只记录各语言每日合计（页面浏览、生成次数、星级评分）的自有统计。二维码的内容绝不会进入统计，以上数据也都无法识别你的身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自 2026 年 10 月 11 日起生效。'],
    ],
    back: '← 返回二维码生成器',
  },
};
