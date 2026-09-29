/* Trắc nghiệm màu hào quang (aura) — Tiếng Việt (vi/)
 * 8 id hào quang và thứ tự câu hỏi/lựa chọn giống aura-core.js (trọng số chỉ nằm ở đó). Không đổi thứ tự questions[i].choices[j].
 * Khóa kết thúc bằng Html được chèn nguyên HTML (chỉ <br> và <em>). Nội dung privacy.sections cũng là HTML.
 * Không tiết lộ: meta / og.default* / start / faq không nêu tên màu hào quang, không trích câu hỏi.
 * types.<id>.word = từ chỉ màu cơ bản (cách nhau bằng dấu phẩy) — chỉ dùng cho kiểm tra tiết lộ.
 * Biến: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Trắc nghiệm màu hào quang – Aura của bạn màu gì?',
    description: 'Aura của bạn màu gì? Làm trắc nghiệm màu hào quang miễn phí: 12 câu hỏi đời thường, khoảng 2 phút, không cần đăng ký. Khám phá ánh sáng mà năng lượng của bạn tỏa ra.',
    ogTitle: 'Trắc nghiệm màu hào quang ✨ Aura của bạn màu gì?',
    ogDescription: 'Trắc nghiệm aura 2 phút. Trả lời 12 câu hỏi đời thường và xem năng lượng của bạn tỏa ra màu gì.',
  },
  siteName: 'Trắc nghiệm màu hào quang',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '✨ Đọc hào quang',
    h1Kicker: 'Trắc nghiệm màu hào quang',
    h1Html: '<em>Aura</em> của bạn<br>màu gì?',
    hook: 'Ai cũng tỏa ra một thứ ánh sáng riêng. 12 khoảnh khắc nhỏ trong ngày thường sẽ cho bạn biết ánh sáng ấy trông ra sao.',
    metaTime: '⏱️ Khoảng 2 phút',
    metaCount: '🔮 12 câu hỏi',
    start: 'Đọc aura của tôi →',
  },

  quiz: {
    backAria: 'Câu trước',
    progressAria: 'Tiến độ',
    qLabel: 'Câu {n}',
  },

  loading: {
    text: 'Đang đọc hào quang của bạn…',
    sub: 'Chờ các sắc màu lắng xuống',
  },

  result: {
    title: 'Trắc nghiệm màu hào quang: aura của mình là {name}',
    eyebrow: 'Màu hào quang của bạn là',
    strengthsLabel: 'Sức mạnh tỏa sáng',
    othersLabel: 'Trong mắt người khác',
    bestLabel: 'Hợp nhất',
    clashLabel: 'Dễ va chạm',
    sameShare: '{pct}% người chơi có cùng aura',
    shareText: 'Aura của mình là {name} {emoji} — “{vibe}” Còn aura của bạn màu gì?',
    ctaStrong: 'Bạn bè vừa gửi aura của họ cho bạn',
    ctaSub: 'Aura của bạn màu gì? Chỉ mất 2 phút.',
    retry: 'Làm lại trắc nghiệm',
  },

  og: {
    eyebrow: 'Màu hào quang của mình',
    brand: '✨ Trắc nghiệm màu hào quang',
    defaultKicker: 'Trắc nghiệm màu hào quang',
    defaultTitle: 'Aura của bạn màu gì?',
    defaultDesc: '12 câu hỏi đời thường · khoảng 2 phút',
  },

  faq: [
    { q: 'Trắc nghiệm màu hào quang tính kết quả thế nào?', a: 'Mỗi câu trả lời cộng điểm cho vài màu hào quang, màu nhiều điểm nhất là kết quả của bạn. Nếu bằng điểm, một quy tắc cố định sẽ quyết định, nên cùng câu trả lời luôn ra cùng một aura.' },
    { q: 'Hào quang (aura) là gì?', a: 'Theo quan niệm tâm linh phổ biến, hào quang là vầng năng lượng bao quanh mỗi người, và mỗi màu gắn với một tâm trạng, một tính cách. Trắc nghiệm này mượn ý tưởng đó để chơi cho vui và để hiểu mình hơn, không phải khoa học.' },
    { q: 'Màu hào quang có thay đổi không?', a: 'Có. Kết quả chỉ phụ thuộc vào câu trả lời hôm nay, nên khi tâm trạng hay giai đoạn cuộc sống thay đổi, bạn có thể ra một màu khác. Làm lại bất cứ lúc nào nhé.' },
    { q: 'Câu trả lời của tôi có bị lưu lại không?', a: 'Không. Câu trả lời được tính điểm ngay trong trình duyệt và không được lưu. Chúng tôi chỉ đếm ẩn danh xem ra aura nào, để hiển thị mỗi kết quả phổ biến đến đâu.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Trắc nghiệm màu hào quang',
    description: 'Chính sách quyền riêng tư của Trắc nghiệm màu hào quang — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Trắc nghiệm màu hào quang ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời được tính trong trình duyệt và không bao giờ được gửi hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh xem ra màu hào quang nào, để hiển thị mỗi kết quả phổ biến đến đâu.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Xem thêm và thay đổi cài đặt tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, số lần hoàn thành, đánh giá) để cải thiện Dịch vụ. Những con số này không nhận dạng được bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách có hiệu lực từ ngày 30 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại trắc nghiệm hào quang',
  },

  questions: [
    { q: 'Một sáng thứ Bảy thong thả, không có kế hoạch gì. Bạn bắt đầu ngày thế nào?', choices: [
      'Chạy bộ lúc bình minh. Phải vận động trước đã.',
      'Nhắn nhóm bạn: “Đi phượt không? Một tiếng nữa xuất phát.”',
      'Tưới cây rồi thong thả dạo chợ sáng',
      'Một ly cà phê, một cuốn sổ và sự im lặng tuyệt đối',
    ] },
    { q: 'Bạn thân nhắn: “Ê… nói chuyện chút được không?” Bạn sẽ…', choices: [
      'Gọi ngay. Chuyện gì cũng có mình ở đây.',
      'Nghe hết trước, rồi cùng tính xem nên làm gì',
      'Mang đồ ăn vặt tới và nghĩ cách chọc bạn cười',
      'Gửi một tin nhắn dài thật lòng kèm một bài hát hợp tâm trạng',
    ] },
    { q: 'Bạn đến một buổi tiệc gần như không quen ai.', choices: [
      'Mười phút sau đã nói chuyện với nửa phòng',
      'Không biết từ lúc nào cả phòng cười vì mình',
      'Tìm được một người rồi ngồi góc phòng tâm sự hàng giờ',
      'Khởi xướng một trò chơi và kéo mọi người vào',
    ] },
    { q: 'Được sống ở bất cứ đâu trong một năm, bạn chọn…', choices: [
      'Một căn nhà nhỏ bên bìa rừng',
      'Một thị trấn yên tĩnh bên biển',
      'Một căn gác xép ấm cúng đầy đồ vẽ',
      'Ngay giữa một thành phố lớn nhộn nhịp',
    ] },
    { q: 'Bài tập nhóm nộp vào ngày mai mà chưa làm gì cả.', choices: [
      'Mình đứng ra chỉ huy, chia việc rồi làm luôn',
      'Lập kế hoạch từng bước để không ai hoảng',
      'Nửa đêm nảy ra ý tưởng cứu cả nhóm',
      'Để ý xem ai đang căng thẳng và hỏi han mọi người',
    ] },
    { q: 'Được chọn một siêu năng lực, bạn chọn gì?', choices: [
      'Đọc được suy nghĩ người khác',
      'Dịch chuyển tức thời đến bất cứ đâu',
      'Chữa lành mọi vết thương và nỗi buồn',
      'Khiến bất kỳ ai mỉm cười ngay lập tức',
    ] },
    { q: 'Thư viện ảnh trong điện thoại bạn nhiều nhất là gì?', choices: [
      'Ảnh tự sướng và ảnh nhóm với những người mình thương',
      'Bầu trời, hoa lá, cây cối — toàn thiên nhiên',
      'Góc chụp lạ, ánh sáng có không khí, những tác phẩm nghệ thuật nhỏ',
      'Những nơi đã đến và những chuyến phiêu lưu',
    ] },
    { q: 'Căng thẳng dồn lại. Điều gì giúp bạn nhất?', choices: [
      'Dọn dẹp và viết một danh sách việc cần làm thật rõ ràng',
      'Tập luyện thật mạnh cho tới khi đầu óc trống trơn',
      'Ở một mình để nghĩ cho thông suốt',
      'Video hài và đồ ăn vặt. Lo sau.',
    ] },
    { q: 'Lần đầu gặp, mọi người thường nghĩ gì về bạn?', choices: [
      '“Tự tin. Hơi mạnh mẽ.”',
      '“Ấm áp và dễ thương quá.”',
      '“Điềm tĩnh. Có thể tin được.”',
      '“Bí ẩn. Không giống ai.”',
    ] },
    { q: 'Món quà nào làm bạn vui nhất?', choices: [
      'Một chậu cây hoặc món đồ handmade',
      'Vé xem concert cùng hội bạn thân',
      'Một cuốn sách hiếm hoặc cuốn sổ thật đẹp',
      'Một chuyến đi cuối tuần bất ngờ',
    ] },
    { q: 'Sắp cãi nhau đến nơi. Bạn sẽ…', choices: [
      'Bình tĩnh tìm xem thế nào là công bằng',
      'Xin lỗi trước. Hòa khí quan trọng hơn.',
      'Pha một câu đùa cho bớt căng',
      'Lùi lại một bước, để sau hẵng nghĩ',
    ] },
    { q: 'Chọn câu châm ngôn giống bạn nhất.', choices: [
      'Đời là một chuyến phiêu lưu — cứ gật đầu đi!',
      'Lớn lên chậm rãi, bám rễ thật sâu.',
      'Mơ trước, rồi biến giấc mơ thành thật.',
      'Yêu thật lớn, nói thật to.',
    ] },
  ],

  types: {
    red: {
      name: 'Đỏ hồng ngọc',
      word: 'đỏ',
      vibe: 'Ngọn lửa thuần khiết: táo bạo, quyết liệt, tràn đầy sức sống.',
      desc: 'Hào quang của bạn cháy rực và ấm nóng. Bạn là người hành động: khi điều gì quan trọng, bạn lao vào trước rồi vừa làm vừa nghĩ. Thử thách không làm bạn sợ mà còn khiến bạn hứng khởi, và năng lượng ấy kéo mọi người đi cùng. Bạn cảm nhận mọi thứ rất mạnh, từ phấn khích đến bực bội, và không hề giấu giếm. Chính sự thẳng thắn đó khiến người ta tin bạn.',
      strengths: ['Dám làm, không ngại', 'Năng lượng lan tỏa', 'Thẳng thắn, rõ ràng'],
      others: 'Trong mắt người khác, bạn là tia lửa của cả nhóm — người khởi động mọi chuyện và nói ra điều ai cũng nghĩ.',
    },
    orange: {
      name: 'Cam hoàng hôn',
      word: 'cam',
      vibe: 'Ấm áp, ngẫu hứng, lúc nào cũng sẵn sàng phiêu lưu.',
      desc: 'Hào quang của bạn rực lên như hoàng hôn trên chuyến đi mùa hè. Bạn mê nơi mới, người mới và câu “sao lại không?”. Đi đâu bạn cũng có bạn, và chuyện bạn kể luôn vui nhất bàn. Cuộc sống lặp lại làm bạn chán, nên bạn tô màu cho nó bằng những kế hoạch không ai nghĩ tới. Bên dưới sự vui vẻ là một trái tim rộng lượng thích chia sẻ những khoảnh khắc đẹp.',
      strengths: ['Tinh thần phiêu lưu', 'Kết bạn ở mọi nơi', 'Cây hài của nhóm'],
      others: 'Trong mắt người khác, bạn là người biến một ngày bình thường thành chuyện để kể — dễ gần, hòa đồng và đầy bất ngờ.',
    },
    yellow: {
      name: 'Vàng nắng',
      word: 'vàng',
      vibe: 'Mặt trời biết đi: vui tươi, tò mò và rạng rỡ.',
      desc: 'Hào quang của bạn là ánh sáng ban ngày trọn vẹn. Bạn lạc quan, tinh nghịch và tò mò không dứt, lúc nào cũng nhặt thêm ý tưởng và sở thích mới. Bạn tìm được điểm buồn cười trong gần như mọi chuyện, và tiếng cười của bạn nổi tiếng trong hội bạn. Bạn thích nhẹ nhàng, nhưng cũng rất nhanh nhạy — học nhanh và thích chia sẻ với mọi người.',
      strengths: ['Lạc quan bẩm sinh', 'Đầu óc nhanh nhạy, tò mò', 'Làm bừng sáng mọi bầu không khí'],
      others: 'Trong mắt người khác, bạn là một tia nắng — chỉ cần bạn xuất hiện, ngày khó khăn cũng nhẹ đi.',
    },
    green: {
      name: 'Xanh lục bảo',
      word: 'xanh lá, xanh lục',
      vibe: 'Vững vàng, chu đáo và lặng lẽ lớn lên.',
      desc: 'Hào quang của bạn giống khu rừng sau mưa: yên bình, tươi mát và đầy sức sống. Bạn quan tâm sâu sắc tới những người và những điều quanh mình, và thích xây dựng thứ bền lâu hơn là thắng nhanh. Bạn nhận ra người khác cần gì và giúp mà không cần ai biết. Cân bằng rất quan trọng với bạn — một vòng đi dạo, một bữa ăn ngon và những người mình thương là đủ chữa lành hầu hết mọi thứ.',
      strengths: ['Bền bỉ, kiên nhẫn', 'Người chăm sóc bẩm sinh', 'Giữ mọi thứ cân bằng'],
      others: 'Trong mắt người khác, bạn là chốn bình yên — đáng tin, tử tế, là người họ gọi đầu tiên khi lòng chông chênh.',
    },
    blue: {
      name: 'Xanh đại dương',
      word: 'xanh dương, xanh biển',
      vibe: 'Mặt nước lặng, lòng trung thành sâu sắc, lời nói chân thành.',
      desc: 'Hào quang của bạn bình yên như biển ngày trời trong. Bạn vững vàng khi mọi thứ rối tung và lựa lời rất cẩn thận. Sự thật và niềm tin có ý nghĩa lớn với bạn — bạn giữ lời hứa và mong người khác cũng vậy. Bạn có thể không phải người nói to nhất, nhưng khi bạn lên tiếng, ai cũng lắng nghe, vì họ biết bạn nói thật lòng.',
      strengths: ['Bình tĩnh trước áp lực', 'Trung thành sâu sắc', 'Nói năng chín chắn'],
      others: 'Trong mắt người khác, bạn là người đáng tin nhất họ từng biết — ôn hòa, công bằng và luôn trung thực.',
    },
    indigo: {
      name: 'Chàm nửa đêm',
      word: 'chàm',
      vibe: 'Trực giác nhạy, sâu sắc và luôn đi trước một bước.',
      desc: 'Hào quang của bạn lấp lánh như bầu trời vừa qua nửa đêm. Bạn cảm nhận được mọi chuyện trước khi ai nói ra, và thường đoán được cái kết trước khi câu chuyện bắt đầu. Bạn thích những câu hỏi lớn, thời gian yên tĩnh và những cuộc trò chuyện sâu. Bạn độc lập và hơi kín đáo, nhưng vài người thật sự hiểu bạn sẽ có một người bạn với góc nhìn hiếm có.',
      strengths: ['Trực giác sắc bén', 'Suy nghĩ sâu', 'Nhìn thấy bức tranh lớn'],
      others: 'Trong mắt người khác, bạn khôn ngoan hơn tuổi — trầm lặng, tinh ý và hơi khó đoán.',
    },
    violet: {
      name: 'Tím huyền bí',
      word: 'tím',
      vibe: 'Kẻ mộng mơ với một tầm nhìn không ai khác thấy.',
      desc: 'Hào quang của bạn cuộn xoáy trí tưởng tượng. Bạn nhìn thế giới như nó có thể trở thành, chứ không chỉ như nó đang là, và đầu bạn đầy ý tưởng, câu chuyện, kế hoạch. Bạn bị cuốn hút bởi nghệ thuật, âm nhạc và mọi thứ khác thường. Những quy tắc thông thường không phải lúc nào cũng hợp với bạn — và thế cũng tốt, vì cách nhìn riêng của bạn truyền cảm hứng cho người xung quanh.',
      strengths: ['Trí tưởng tượng bay bổng', 'Ý tưởng độc đáo', 'Truyền cảm hứng'],
      others: 'Trong mắt người khác, bạn là độc nhất vô nhị — sáng tạo, hơi bí ẩn và đầy ý tưởng bất ngờ.',
    },
    pink: {
      name: 'Hồng dịu dàng',
      word: 'hồng',
      vibe: 'Trái tim mềm, tình yêu lớn, sức mạnh dịu dàng.',
      desc: 'Hào quang của bạn ấm áp và dịu dàng như tia nắng đầu xuân. Bạn yêu thương không giấu giếm và khiến người khác thấy mình được quan tâm, dù là nhớ ngày sinh nhật hay nhận ra ai đó đang im lặng. Tử tế là bản năng của bạn, và bạn tin một cử chỉ nhỏ có thể thay đổi cả ngày của ai đó. Dịu dàng không có nghĩa là yếu đuối — trái tim chính là sức mạnh của bạn.',
      strengths: ['Tử tế vô tận', 'Thấu cảm sâu sắc', 'Khiến người khác thấy được yêu thương'],
      others: 'Trong mắt người khác, bạn ngọt ngào và dễ chịu — người bạn mà chỉ một cái ôm là mọi chuyện ổn cả.',
    },
  },
};
