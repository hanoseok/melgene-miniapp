/* 字数统计 — 简体中文 (zh/)
 * 统计逻辑在 wordcount-core.js，本文件是该语言显示的全部文字。
 * 以 Html 结尾的键按 HTML 插入（仅 <br>、<em>），privacy.sections 正文也是 HTML。
 * {n} {max} {m} {s} {pct} {chars} {words} 保持原样。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&family=Montserrat:wght@700;800&display=swap',
    display: "'ZCOOL QingKe HuangYou', 'Montserrat'",
    displayWeight: 400,
    sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '字数统计（含空格/不含空格·字节数）',
    description: '免费在线字数统计：实时显示含空格和不含空格的字数、词数、句数、段落、字节数和阅读时间，还有目标字数进度条。全部在浏览器里完成，不上传。',
    ogTitle: '字数统计 📝 含空格·不含空格·字节数',
    ogDescription: '粘贴论文、文案或简历，马上看到字数、字节数和阅读时间。文字只留在你的设备上。',
  },
  siteName: '字数统计',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: '字数统计',
    h1Html: '边写边数的<br><em>字数和字节数</em>',
    hook: '输入或粘贴你的文字。含空格和不含空格的字数、字节数实时更新，超过目标字数会马上提醒你。',
  },

  ui: {
    editorLabel: '输入文字',
    placeholder: '在这里输入或粘贴文字…',
    bar: { chars: '含空格', noSpaces: '不含空格', words: '词数', bytes: '字节' },
    toolsLabel: '文字工具',
    tools: { copy: '复制文字', tidy: '整理空格', join: '去掉换行', clear: '全部清空', undo: '撤销' },
    saved: '草稿只保存在这台设备上，不会上传。',
    copied: '已复制文字',
    copyFail: '复制失败，请选中文字后手动复制。',
    cleared: '已清空。点“撤销”可以恢复。',
    tidied: '已删除多余的空格和空行。',
    joined: '已去掉换行。',
    undone: '已撤销。',
    nothing: '没有需要修改的地方。',
    limitLabel: '目标字数',
    limitOff: '关闭',
    limitChip: '{n}字',
    limitCustom: '自定义',
    limitCustomPh: '例如 800',
    limitCustomAria: '输入目标字数',
    limitSpaces: '计入空格',
    limitText: '{n} / {max} 字',
    limitLeft: '还剩 {n} 字',
    limitOver: '超出 {n} 字',
    statsLabel: '详细统计',
    stats: {
      chars: '字数（含空格）',
      noSpaces: '字数（不含空格）',
      words: '词数',
      sentences: '句数',
      paragraphs: '段落',
      lines: '行数',
      reading: '阅读时间',
      speaking: '朗读时间',
      bytes: '字节数',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: '双字节(GBK)' },
    byteHint: {
      utf8: '标准 UTF-8：英文字母、数字和半角空格 1 字节，汉字 3 字节，表情 4 字节，换行 1 字节。',
      neis: 'UTF-8，但每个换行按 2 字节（CR+LF）计算，和 Windows 文本文件一样。',
      legacy: 'GBK 等旧编码的算法：半角字符 1 字节，汉字和全角字符 2 字节，换行 2 字节。',
    },
    time: { sec: '{s} 秒', min: '{m} 分钟', minSec: '{m} 分 {s} 秒' },
    timeNote: '时间仅供参考：默读约每分钟 500 字，朗读或演讲约每分钟 300 字。',
    kwLabel: '高频词',
    kwEmpty: '用了两次以上的词会显示在这里。“的”“了”这类常用字不计。',
    kwCount: '{n} 次',
    finish: '查看结果 ✓',
    needText: '请先输入或粘贴文字。',
    local: '只在你的设备上统计，文字不会发送到任何地方。',
  },

  result: {
    heading: '你的文字一览',
    limitOk: '在目标 {max} 字以内（{pct}%）。',
    limitOver: '比目标 {max} 字多了 {n} 字。',
    copySummary: '复制结果',
    summaryCopied: '已复制结果',
    summaryTitle: '字数统计结果',
    again: '统计新文字',
    live: '结果：含空格 {chars} 字，{words} 个词。',
    shareTitle: '字数统计',
    shareText: '免费统计含空格/不含空格字数、字节数和阅读时间，文字只留在自己的设备上 📝',
  },

  og: {
    brand: '📝 字数统计',
    kicker: '含空格 · 不含空格 · 字节 · 阅读时间',
    title: '边写边数的在线字数统计',
    desc: '免费使用，文字不离开你的设备',
  },

  faq: [
    { q: '空格和换行算字数吗？', a: '两个数字都会显示。“含空格”会把空格和换行（每个换行算 1 字）也算进去，“不含空格”则去掉所有空格、制表符和换行。目标字数进度条可以用“计入空格”开关选择按哪一个计算。' },
    { q: '为什么和 Word 或其他网站的字数不一样？', a: '每个工具的规则不同，比如换行算不算、表情算几个字、英文单词按词还是按字母算。这里换行算 1 字，一个表情算 1 字。提交前请看清对方的要求，并留一点余量。' },
    { q: '字节数是怎么算的？', a: '可以选三种方式。UTF-8 下一个汉字是 3 字节；UTF-8 + CRLF 把每个换行算 2 字节；双字节(GBK) 按旧系统的算法，半角 1 字节、汉字 2 字节、换行 2 字节。' },
    { q: '我的文字会被保存或上传吗？', a: '不会上传。为了刷新后还能接着写，草稿只存在这个浏览器的本地存储里，点“全部清空”就会删除。网址和分享链接里也不会出现你的文字。' },
  ],

  privacy: {
    title: '隐私政策 | 字数统计',
    description: '字数统计隐私政策：文字只在你的浏览器里统计和保存；关于 Cookie、广告和统计的说明。',
    h1: '隐私政策',
    introHtml: '字数统计（以下简称“本服务”）尊重你的隐私，只处理下面列出的最少信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录。你输入或粘贴的文字只在你的浏览器里统计，不会发送到本服务或任何其他服务器，也不会写进网页地址或分享链接。为了刷新后还能接着写，文字和设置只保存在这台设备浏览器的本地存储（localStorage）中；点击“全部清空”会删除已保存的草稿，清除浏览器网站数据也会删除。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言和设置、展示广告并了解使用情况。你可以在浏览器设置中拒绝或删除它们，但部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie，根据你以前访问本网站和其他网站的情况投放广告。详情及偏好设置请见 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a>。'],
      ['4. 统计', '为了改进服务，我们可能使用 Google Analytics（GA4）以及只记录各语言每日总数（页面浏览、使用次数、星级评分）的自有统计。这些统计不包含你的文字或其数字，也不会识别你的身份。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自 2026 年 10 月 15 日起生效。'],
    ],
    back: '← 返回字数统计',
  },
};
