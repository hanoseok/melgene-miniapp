/* Trắc nghiệm hóa trang Halloween — Tiếng Việt (vi/)
 * Cùng 8 id hóa trang và cùng thứ tự câu hỏi/lựa chọn như costume-core.js (trọng số chỉ nằm ở đó). Không đổi thứ tự questions[i].choices[j].
 * Khóa kết thúc bằng Html được chèn dạng HTML (chỉ <br> và <em>). Nội dung privacy.sections cũng là HTML.
 * Không spoiler: meta / og.default* / start / faq / loading không nêu tên bộ hóa trang và không trích câu hỏi.
 * types.<id>.word = từ chỉ bộ hóa trang (cách nhau bằng dấu phẩy) — chỉ dùng để kiểm tra spoiler.
 * Biến: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Trắc nghiệm hóa trang Halloween – Năm nay hóa trang gì?',
    description: 'Halloween này hóa trang gì? Làm trắc nghiệm hóa trang Halloween miễn phí: 12 tình huống ở bữa tiệc, khoảng 2 phút, không cần đăng ký.',
    ogTitle: 'Trắc nghiệm hóa trang Halloween 🎃 Năm nay bạn hóa trang gì?',
    ogDescription: 'Trắc nghiệm miễn phí trong 2 phút. Trả lời 12 tình huống ở tiệc Halloween và tìm ra bộ hóa trang hợp với tính cách của bạn.',
  },
  siteName: 'Trắc nghiệm hóa trang Halloween',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🎃 Phòng thử đồ hóa trang',
    h1Kicker: 'Trắc nghiệm hóa trang Halloween',
    h1Html: 'Năm nay hóa trang gì<br>cho <em>Halloween</em>?',
    hook: 'Tiệc sắp tới mà vẫn chưa biết mặc gì? 12 tình huống nho nhỏ sẽ chọn giúp bạn bộ đồ hợp với con người thật của bạn.',
    metaTime: '⏱️ Khoảng 2 phút',
    metaCount: '🦇 12 câu hỏi',
    start: 'Tìm bộ đồ của tôi →',
  },

  quiz: {
    backAria: 'Câu trước',
    progressAria: 'Tiến độ',
    qLabel: 'Câu {n}',
  },

  loading: {
    text: 'Đang lục tung tủ đồ hóa trang…',
    sub: 'Thử vài bộ cho bạn đây',
  },

  result: {
    title: 'Trắc nghiệm hóa trang Halloween: mình hợp với {name}',
    eyebrow: 'Halloween này, bạn hợp với',
    strengthsLabel: 'Siêu năng lực trong bữa tiệc',
    tipsLabel: 'Cách tự làm bộ đồ',
    bestLabel: 'Cạ cứng',
    rivalLabel: 'Đối thủ thân',
    sameShare: '{pct}% người chơi có cùng bộ đồ này',
    shareText: 'Bộ hóa trang Halloween của mình là {name} {emoji} — “{vibe}” Còn bạn thì sao?',
    ctaStrong: 'Bạn bè vừa gửi bộ hóa trang Halloween của họ',
    ctaSub: 'Còn bạn hợp với bộ nào? Chỉ mất 2 phút.',
    retry: 'Làm lại trắc nghiệm',
  },

  og: {
    eyebrow: 'Bộ hóa trang Halloween của mình',
    brand: '🎃 Trắc nghiệm hóa trang Halloween',
    defaultKicker: 'Trắc nghiệm hóa trang Halloween',
    defaultTitle: 'Halloween này bạn hóa trang thành gì?',
    defaultDesc: '12 tình huống trong bữa tiệc · khoảng 2 phút',
  },

  faq: [
    { q: 'Trắc nghiệm chọn bộ hóa trang cho mình như thế nào?', a: 'Mỗi câu trả lời cộng điểm cho một vài bộ hóa trang, bộ nào nhiều điểm nhất sẽ thắng. Nếu hòa thì xử lý theo một quy tắc cố định, nên cùng câu trả lời luôn cho cùng một kết quả.' },
    { q: 'Mình có thể tự làm bộ đồ thật không?', a: 'Được chứ. Mỗi kết quả đều kèm mẹo đơn giản dùng đồ có sẵn trong nhà, cộng thêm vài món rẻ mua ở Daiso hay trên Shopee. Không cần biết may vá.' },
    { q: 'Nếu không thích kết quả thì sao?', a: 'Làm lại thôi! Kết quả chỉ phụ thuộc vào cách bạn trả lời hôm nay, và một tâm trạng khác có thể cho ra một phong cách khác. Hoặc rủ cạ cứng hóa trang thành nhóm.' },
    { q: 'Câu trả lời của mình có bị lưu lại không?', a: 'Không. Câu trả lời được tính ngay trong trình duyệt của bạn và không bao giờ được lưu. Chúng tôi chỉ đếm ẩn danh xem ra bộ hóa trang nào, để hiển thị mỗi kết quả phổ biến đến đâu.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Trắc nghiệm hóa trang Halloween',
    description: 'Chính sách quyền riêng tư của Trắc nghiệm hóa trang Halloween — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Trắc nghiệm hóa trang Halloween ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời được tính trong trình duyệt và không bao giờ được gửi hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh xem ra bộ hóa trang nào, để hiển thị mỗi kết quả phổ biến đến đâu.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Xem thêm và thay đổi cài đặt tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, số lần hoàn thành, đánh giá) để cải thiện Dịch vụ. Những con số này không nhận dạng được bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách có hiệu lực từ ngày 2 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại trắc nghiệm hóa trang',
  },

  questions: [
    { q: 'Vừa nhận lời mời dự tiệc Halloween. Suy nghĩ đầu tiên của bạn?', choices: [
      'Cuối cùng cũng tới! Mình lên ý tưởng trang phục cả mấy tuần rồi.',
      'Ai tổ chức vậy? Mình lo đồ ăn vặt với playlist.',
      'Có bắt buộc hóa trang không… hay mặc đồ thoải mái cũng được?',
      'Mình tự làm đồ. Đồ mua sẵn chán lắm.',
    ] },
    { q: 'Vào tiệm đồ hóa trang, bạn đi thẳng tới…', choices: [
      'Giá treo áo choàng nhung và kim tuyến',
      'Rổ đồ giảm giá. Gì cũng được!',
      'Tai thú, đuôi và phụ kiện nhỏ xinh',
      'Góc tự làm: băng gạc, màu vẽ mặt, băng keo',
    ] },
    { q: 'Bạn bước vào bữa tiệc. Việc đầu tiên?', choices: [
      'Tìm sàn nhảy',
      'Chào hết mọi người và giới thiệu mọi người với nhau',
      'Chọn một góc yên tĩnh và ngắm người qua lại',
      'Đi thẳng tới bàn đồ ăn',
    ] },
    { q: 'Kính coong! Lũ trẻ tới gõ cửa xin kẹo. Bạn…', choices: [
      'Vừa nhảy ở cửa vừa phát kẹo',
      'Núp sau cửa rồi nhảy ra. Hù!',
      'Tặng mỗi bé một túi quà nhỏ tự tay gói',
      'Bắt các bé làm trò trước đã. Công bằng mà.',
    ] },
    { q: 'DJ bật bài bạn mê. Bạn…', choices: [
      'Nhảy như không ai đang nhìn. Ngay lập tức.',
      'Lướt vào chậm rãi với những động tác đầy kịch tính',
      'Gật gù theo nhạc trên sofa, tay cầm đồ ăn vặt',
      'Kéo đứa bạn nhút nhát ra sàn nhảy',
    ] },
    { q: 'Chụp ảnh nhóm nào! Bạn đứng đâu?', choices: [
      'Chính giữa hàng đầu, góc đẹp nhất đã sẵn sàng',
      'Ló đầu vào từ tít ngoài rìa',
      'Làm mặt hề ở hàng cuối',
      'Chỉnh tóc tai, quần áo cho mọi người trước đã',
    ] },
    { q: 'Có người rủ: “Kể chuyện ma đi.” Bạn…', choices: [
      'Đã có sẵn một chuyện rợn người',
      'Nắm chặt tay người bên cạnh, nghe mà nhắm một mắt',
      'Biến câu chuyện thành hài kịch giữa chừng',
      'Lặng lẽ chuồn vào bếp',
    ] },
    { q: 'Bàn đồ ăn đang vẫy gọi. Bạn lấy…', choices: [
      'Mỗi thứ một chút. Rồi lấy thêm lần nữa.',
      'Món kỳ lạ nhất mà chẳng ai dám thử',
      'Chỉ món tráng miệng đẹp nhất trên bàn',
      'Lấy đĩa cho bạn bè trước rồi mới tới mình',
    ] },
    { q: 'Đúng nửa đêm, đèn bỗng tắt phụt. Bạn…', choices: [
      'Bật đèn pin điện thoại và trấn an mọi người',
      'Giả tiếng rùng rợn để trêu mọi người',
      'Đứng im phăng phắc. Bạn nhìn trong tối vẫn rõ.',
      'Vẫn ăn tiếp. Tối thì có sao đâu.',
    ] },
    { q: 'Cuộc thi hóa trang! Bạn sẽ giành giải nào?', choices: [
      'Thanh lịch nhất',
      'Sáng tạo nhất',
      'Được yêu thích nhất',
      'Dễ thương nhất',
    ] },
    { q: 'Cả nhóm vào nhà ma. Bạn là người…', choices: [
      'Dẫn đầu và cổ vũ cả nhóm',
      'Thong thả đi qua, chẳng thấy sợ chút nào',
      'Hét to nhất và cười nhiều nhất',
      'Soi kỹ đạo cụ: “Họ làm cái này kiểu gì nhỉ?”',
    ] },
    { q: 'Sáng hôm sau bữa tiệc, bạn đang…', choices: [
      'Vẫn ngủ. Hoàng hôn hẵng gọi.',
      'Dọn dẹp và trả lại đồ mọi người bỏ quên',
      'Đã lên kế hoạch cho tiệc năm sau',
      'Nằm bẹp trên sofa, cạn sạch năng lượng',
    ] },
  ],

  types: {
    vampire: {
      name: 'Ma cà rồng nhung đen',
      word: 'ma cà rồng',
      vibe: 'Thanh lịch tự nhiên, hơi kịch tính một chút và là ngôi sao của mọi đêm.',
      desc: 'Bạn sinh ra để làm ca đêm. Bạn thích những màn xuất hiện ấn tượng, biết rõ góc đẹp nhất của mình và có thể biến một buổi tối bình thường thành cảnh phim. Mọi người bị cuốn hút bởi sự tự tin điềm tĩnh và chút bí ẩn của bạn. Bạn rất nghiêm túc với phong cách, nhưng cũng chăm lo cho những người thân quanh mình — một khi đã trung thành thì là mãi mãi.',
      strengths: ['Sức hút khó cưỡng', 'Phong cách hoàn hảo', 'Làm chủ màn đêm'],
      tips: ['Đồ đen cộng một chiếc áo choàng (tấm ga giường tối màu cũng được) là thành “bá tước lâu đài” ngay.', 'Vuốt tóc ra sau và chấm một chút son đỏ ở khóe môi.', 'Răng nanh nhựa và một cái cúi chào thật chậm, thật kịch khi bước vào.'],
    },
    witch: {
      name: 'Phù thủy ánh trăng',
      word: 'phù thủy',
      vibe: 'Thông minh, sáng tạo và luôn đang ủ một kế hoạch thiên tài.',
      desc: 'Đầu óc bạn là một nồi ý tưởng đang sôi. Bạn thích tạo ra thứ gì đó độc đáo hơn là làm theo số đông, và thường có sẵn phương án B, C, D. Bạn độc lập, hơi tinh nghịch, với óc hài hước sắc sảo khiến cuộc trò chuyện nào cũng thú vị. Bạn bè tìm đến bạn khi cần một giải pháp thông minh — hay một “bùa chú” lời khuyên hay.',
      strengths: ['Ý tưởng xuất sắc', 'Tinh thần độc lập', 'Hài hước sắc sảo'],
      tips: ['Một chiếc mũ chóp nhọn và váy dài hoặc áo khoác tối màu là đủ để bắt đầu.', 'Cầm theo cây chổi hoặc chiếc cốc dán chữ “thuốc thần” làm đạo cụ đặc trưng.', 'Thêm sticker ngôi sao, son tím hoặc một con mèo đen nhồi bông trên vai.'],
    },
    ghost: {
      name: 'Hồn ma trùm chăn',
      word: 'hồn ma',
      vibe: 'Nhút nhát dễ thương, ấm áp và thật ra là người hài hước nhất phòng.',
      desc: 'Bạn không cần ánh đèn sân khấu để vui hết mình. Bạn thích đồ mặc thoải mái, vài người bạn thân và ngắm bữa tiệc từ một góc dễ chịu. Ban đầu người ta có thể đánh giá thấp bạn, nhưng những nhận xét kín đáo và câu đùa bất ngờ của bạn khiến ai cũng bật cười. Bạn hiền lành, tử tế và là kiểu bạn khiến người khác thấy an toàn.',
      strengths: ['Hiền lành tử tế', 'Hài hước ngầm', 'Quan sát tinh tế'],
      tips: ['Một tấm ga trắng khoét hai lỗ mắt. Kinh điển, thoải mái và xong trong năm phút.', 'Thêm kính râm hoặc một chiếc mũ tí hon cho đúng chất riêng của bạn.', 'Cầm một tấm biển nhỏ ghi “hù” để có những bức ảnh dễ thương nhất.'],
    },
    zombie: {
      name: 'Zombie quẩy tiệc',
      word: 'zombie',
      vibe: 'Dễ tính, lúc nào cũng đói và không ai cản nổi khi đã vào guồng.',
      desc: 'Bạn sống kiểu thuận theo dòng chảy và hiếm khi để chuyện gì làm mình căng thẳng. Có đồ ăn ngon, đôi giày êm và những người mình thương là bạn vui rồi. Buổi sáng bạn có thể hơi chậm, nhưng khi đã nhập cuộc thì hết mình — chẳng gì cản nổi. Bạn bè quý sự thoải mái của bạn và cách bạn luôn trung thành với hội.',
      strengths: ['Chill hết cỡ', 'Sức bền vô hạn', 'Trung thành với hội'],
      tips: ['Lấy đồ cũ, xé vài lỗ và chà bã cà phê lên làm “bùn đất”.', 'Màu vẽ mặt xám cộng phấn mắt tối quanh mắt là xong.', 'Đi chậm, giơ hai tay ra trước và rên rỉ đòi đồ ăn vặt.'],
    },
    blackcat: {
      name: 'Mèo đen nửa đêm',
      word: 'mèo',
      vibe: 'Ngầu, tò mò và bí ẩn — chỉ dành sự quan tâm cho vài người được chọn.',
      desc: 'Bạn làm mọi thứ theo cách của mình, với nhịp độ của mình. Bạn tò mò về mọi thứ nhưng chỉ thể hiện sự quan tâm khi thật sự thấy hứng thú. Mọi người thấy bạn hơi bí ẩn, và bạn thích đúng như vậy. Đằng sau vẻ ngoài lạnh lùng, bạn tinh nghịch và ngọt ngào với những ai đã chiếm được lòng tin — và lúc nào cũng tiếp đất bằng bốn chân.',
      strengths: ['Ngầu không cần cố', 'Tò mò bất tận', 'Luôn tiếp đất an toàn'],
      tips: ['Một bộ đồ đen toàn tập cùng bờm tai mèo là ai nhìn cũng nhận ra.', 'Dùng bút kẻ mắt vẽ chiếc mũi nhỏ và ria mép.', 'Gắn sau lưng một cái đuôi làm từ chiếc tất đen hoặc quần tất.'],
    },
    mummy: {
      name: 'Xác ướp ấm áp',
      word: 'xác ướp',
      vibe: 'Kiên nhẫn, chu đáo và là người bạn gắn kết cả nhóm.',
      desc: 'Bạn là người lặng lẽ đảm bảo ai cũng ổn. Bạn nhớ những điều nhỏ nhặt, sửa những gì bị hỏng và luôn sẵn sàng với miếng băng cá nhân — theo nghĩa đen lẫn nghĩa bóng. Bạn kiên nhẫn, vững vàng, có nét duyên của một tâm hồn cổ điển và yêu những thứ không bao giờ lỗi thời. Ở cạnh bạn, ai cũng thấy bình tâm hơn.',
      strengths: ['Kiên nhẫn vô hạn', 'Trái tim chu đáo', 'Đáng tin như núi'],
      tips: ['Quấn băng gạc trắng hoặc dải vải từ tấm ga cũ lên bộ đồ trắng.', 'Chừa hở một bên mắt và để vài đầu băng lủng lẳng.', 'Nhuộm băng bằng trà hoặc cà phê cho trông thật cổ xưa.'],
    },
    pumpkin: {
      name: 'Vua Bí Ngô',
      word: 'bí ngô',
      vibe: 'Ấm áp, rạng rỡ và là trái tim của bữa tiệc — vua hay nữ hoàng của Halloween.',
      desc: 'Bạn thắp sáng mọi căn phòng như một chiếc đèn lồng. Bạn thích gắn kết mọi người, nhớ tên tất cả và đảm bảo không ai bị bỏ rơi. Bữa tiệc sôi động hẳn khi có bạn, và nhiều khi chính bạn là người đứng ra tổ chức. Sự ấm áp của bạn rất dễ lây — ai rời khỏi bạn cũng thấy lòng sáng hơn một chút.',
      strengths: ['Chủ tiệc bẩm sinh', 'Ấm áp dễ lây', 'Gắn kết mọi người'],
      tips: ['Áo thun hoặc hoodie màu cam, dán mặt bí ngô cắt từ nỉ đen.', 'Đội thêm bờm lá xanh hoặc một chiếc vương miện nhỏ.', 'Xách theo xô kẹo và phát quà cho tất cả mọi người.'],
    },
    skeleton: {
      name: 'Bộ xương nhảy nhót',
      word: 'bộ xương',
      vibe: 'Tưng tửng, thật thà và luôn là người đầu tiên ra sàn nhảy.',
      desc: 'Bạn đến để vui, và điều đó lộ rõ. Bạn khiến mọi người bật cười mà chẳng cần cố, và năng lượng của bạn kéo cả hội ra sàn nhảy. Bạn thật thà đến đáng yêu — thấy sao thì là vậy, thật đến tận xương. Cuộc sống nhẹ nhàng hơn khi có bạn, vì bạn chẳng bao giờ quá nghiêm trọng với bản thân.',
      strengths: ['Khuấy động bầu không khí', 'Thật thà tận xương', 'Nhảy không biết sợ'],
      tips: ['Đồ đen cộng băng keo trắng hoặc màu vẽ vải để làm xương.', 'Vẽ mặt đầu lâu: nền trắng, viền mắt đen tròn và hàm răng khâu chỉ.', 'Tập một điệu nhảy ngớ ngẩn — lắc lư kêu lạch cạch là bắt buộc.'],
    },
  },
};
