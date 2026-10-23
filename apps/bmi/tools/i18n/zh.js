/* BMI计算器 — 简体中文。键结构与占位符同 en.js。scales.alt = 中国成人标准（cn，4 级）。 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  num: { kg: '{n} 公斤', lb: '{n} 磅', range: '{min} ~ {max}' },

  meta: {
    title: 'BMI计算器 – 身体质量指数与标准体重',
    description: '免费BMI计算器：输入身高体重，马上算出身体质量指数（BMI），按中国成人标准或WHO标准显示偏瘦、正常、超重还是肥胖，并给出你身高对应的健康体重范围。',
    ogTitle: 'BMI计算器 ⚖️ 看看你的BMI和健康体重',
    ogDescription: '用身高体重算出BMI与胖瘦等级，并显示你身高对应的健康体重范围。',
  },
  siteName: 'BMI计算器',
  privacyLink: '隐私政策',

  hero: {
    h1Kicker: 'BMI计算器',
    h1Html: '你的BMI，<em>一输入就出来</em>',
    hook: '输入身高和体重，BMI 和胖瘦等级马上显示在彩色刻度条上，还会告诉你身高对应的健康体重范围。',
  },

  ui: {
    unitsLabel: '单位',
    metric: '厘米 · 公斤',
    imperial: '英尺 · 磅',
    height: '身高',
    weight: '体重',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ 年龄和性别（选填）',
    less: '− 收起年龄和性别',
    age: '年龄',
    years: '岁',
    sex: '性别',
    sexNone: '不填',
    female: '女',
    male: '男',
    asiaToggle: '亚洲标准',
    yourBmi: '你的BMI',
    waiting: '输入身高和体重，BMI 就会显示在这里。',
    scaleLabel: 'BMI 等级刻度条',
    rangeTitle: '你身高对应的健康体重',
    toLose: '比健康范围多约 {w}',
    toGain: '比健康范围少约 {w}',
    inRange: '你在健康体重范围内。',
    under18: '本计算器适用于 18 岁及以上的成年人。儿童和青少年要按年龄、性别的生长曲线（百分位）来判断，上面的等级不适用。',
    senior: '65 岁以上的老年人，BMI 稍高一些通常也没问题。适合自己的范围请咨询医生。',
    sexNote: '成年人的 BMI 分级男女通用。不过在相同 BMI 下，女性的体脂通常更高。',
    disclaimerTitle: '看结果前请注意',
    disclaimer: [
      'BMI 只是一个简单的筛查指标，不是诊断，也不是医疗建议。',
      '它分不清肌肉和脂肪，运动员和肌肉多的人可能算出偏高的数值。',
      '不适用于孕期，本计算器只适用于 18 岁及以上的成年人。',
    ],
    decimalHint: '小数点用“.”或“,”都可以。',
    finish: '查看BMI小结 ✓',
    needOne: '请先输入身高和体重。',
    localNote: '只在你的设备上计算，输入的数值不会发送，也不会保存。',
    summaryTitle: '我的BMI小结',
    summaryNote: '小结只显示在这个页面上，不会保存在任何地方。',
    sumScale: '标准',
    sumRange: '健康体重',
    again: '重新开始',
    live: 'BMI {bmi}，{cat}',
    shareTitle: 'BMI计算器',
    shareText: '输入身高体重，几秒算出BMI和适合自己身高的健康体重 ⚖️',
  },

  scales: {
    who: {
      name: 'WHO标准',
      note: '世界卫生组织（WHO）成人分级。',
      labels: ['偏瘦', '正常', '超重', '肥胖 I 级', '肥胖 II 级', '肥胖 III 级'],
    },
    alt: {
      name: '中国标准',
      note: '中国成人标准（WS/T 428-2013）：BMI 24 及以上为超重，28 及以上为肥胖，比 WHO 标准更低。',
      labels: ['偏瘦', '正常', '超重', '肥胖'],
    },
  },

  errors: {
    badNum: '请只输入数字，小数点用“.”或“,”。',
    heightRange: '请检查身高，应在 50～272 厘米之间。',
    weightRange: '请检查体重，应在 10～650 公斤之间。',
    inchRange: '英寸请填小于 12 的数，整英尺填在第一格。',
    ageRange: '年龄请填 2～120 之间的整数。',
  },

  og: {
    brand: '⚖️ BMI计算器',
    kicker: '身高 · 体重 · BMI',
    title: '你的BMI落在哪一档？',
    desc: '顺便看看你身高对应的健康体重',
  },

  faq: [
    { q: 'BMI 怎么计算？', a: '用体重（公斤）除以身高（米）的平方。身高 170 厘米、体重 65 公斤，就是 65 ÷ (1.7 × 1.7) ≈ 22.5。用磅和英尺输入时，计算器会自动换算。' },
    { q: '中国的 BMI 正常范围是多少？', a: '按国家卫生行业标准，成年人 BMI 18.5～23.9 为正常，24～27.9 为超重，28 及以上为肥胖，低于 18.5 为偏瘦。这比 WHO 的 25 和 30 更低，因为中国人在同样的 BMI 下更容易出现高血压、糖尿病等问题。' },
    { q: '我经常健身，为什么 BMI 偏高？', a: 'BMI 只看身高和体重，分不清体重来自肌肉还是脂肪，所以肌肉多的人常被算成超重。可以再量一量腰围（男性 90 厘米、女性 85 厘米及以上为中心型肥胖），或做一次体成分测试。' },
    { q: '孩子或孕妇可以用吗？', a: '不适合。18 岁以下要用按年龄和性别划分的生长曲线来判断，孕期体重增长也有专门的标准。这些情况请咨询医生。' },
  ],

  privacy: {
    title: '隐私政策 | BMI计算器',
    description: 'BMI计算器隐私政策：你输入的身高、体重和年龄只在浏览器里计算，以及 Cookie、广告和统计说明。',
    h1: '隐私政策',
    introHtml: 'BMI计算器（以下简称“本服务”）尊重你的隐私，只处理下面列出的最少信息。',
    sections: [
      ['1. 我们收集的信息', '本服务无需注册或登录。你输入的身高、体重、年龄和性别只在你的浏览器中计算，不会发送到服务器，不会保存，也不会写进任何链接。本服务只在你的设备上记住你上次使用的单位（厘米·公斤或英尺·磅）。使用分享按钮时，只会把页面地址和不含数值的简短文字发给你选择的人。'],
      ['2. Cookie 及类似技术', '本服务可能使用 Cookie 和浏览器本地存储来记住语言和单位、展示广告并了解使用情况。你可以在浏览器设置中拒绝或删除，但部分功能可能无法正常使用。'],
      ['3. 广告（Google AdSense）', '本服务通过 Google AdSense 展示广告。Google 及其合作伙伴可能根据你对本站和其他网站的访问记录，使用 Cookie 投放广告。你可以在 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 广告设置</a> 中了解详情并更改偏好。'],
      ['4. 统计', '为改进服务，我们可能使用 Google Analytics（GA4）以及只按语言保存每日总数（页面浏览、计算次数、评分）的自有统计。你的身体数据不会计入这些统计，也没有任何能识别你个人身份的信息。'],
      ['5. 联系方式', '如对本隐私政策有任何疑问，请联系网站运营者。'],
      ['6. 生效日期', '本政策自2026年10月24日起生效。'],
    ],
    back: '← 返回BMI计算器',
  },
};
