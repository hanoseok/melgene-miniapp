/* Trắc nghiệm tình yêu — Tiếng Việt (vi/)
 * id kiểu người yêu và thứ tự câu hỏi/lựa chọn giống lovestyle-core.js (điểm số chỉ ở đó).
 * Không tiết lộ: meta, màn hình bắt đầu, FAQ, OG mặc định không nêu tên kiểu (con vật) và không trích câu hỏi.
 * types.<id>.word = từ chỉ con vật dùng cho kiểm tra tiết lộ. Giữ nguyên {name} {emoji} {vibe} {pct} {n}.
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
    title: 'Trắc nghiệm tình yêu – Khi yêu bạn là kiểu người yêu nào?',
    description: 'Khi yêu bạn là người thế nào? Làm trắc nghiệm tình yêu với 10 khoảnh khắc từ thả thính, buổi hẹn đầu đến giận dỗi, khoảng 2–3 phút, không cần đăng ký. Biết luôn người hợp nhất và bí kíp yêu.',
    ogTitle: 'Trắc nghiệm tình yêu 💘 Khi yêu bạn là kiểu nào?',
    ogDescription: 'Trả lời 10 khoảnh khắc yêu đương nhỏ, 2 phút là biết phong cách yêu thật sự của bạn.',
  },
  siteName: 'Trắc nghiệm tình yêu',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '💘 Trắc nghiệm tính cách khi yêu',
    h1Kicker: 'Trắc nghiệm tình yêu',
    h1Html: 'Khi yêu, bạn là<br><em>kiểu người yêu</em> nào?',
    hook: 'Cách nhắn tin, buổi hẹn đầu, những lần giận dỗi… 10 khoảnh khắc hằng ngày sẽ tìm ra nhân vật dễ thương đang trốn trong tim bạn.',
    metaTime: '⏱️ 2–3 phút',
    metaCount: '💌 10 câu hỏi',
    start: 'Xem kiểu yêu của tôi →',
  },

  quiz: {
    backAria: 'Câu trước',
    progressAria: 'Tiến độ',
    qLabel: 'Câu {n}',
  },

  loading: {
    text: 'Đang đọc trái tim bạn…',
    sub: 'Đang ghép câu trả lời với một kiểu người yêu',
  },

  result: {
    title: 'Trắc nghiệm tình yêu: Mình là {name}',
    eyebrow: 'Khi yêu, bạn là',
    strengthsLabel: 'Sức hút khi yêu',
    tipsLabel: 'Bí kíp yêu dành cho bạn',
    bestLabel: 'Hợp nhất',
    rivalLabel: 'Oan gia',
    sameShare: '{pct}% người chơi cùng kiểu',
    shareText: 'Kiểu người yêu của mình là {name} {emoji} “{vibe}” Còn bạn thì sao?',
    ctaStrong: 'Bạn bè vừa chia sẻ kiểu người yêu',
    ctaSub: 'Bạn là kiểu nào? Chỉ 2 phút.',
    retry: 'Làm lại trắc nghiệm',
  },

  og: {
    eyebrow: 'Kiểu người yêu của mình',
    brand: '💘 Trắc nghiệm tình yêu',
    defaultKicker: 'Trắc nghiệm tình yêu',
    defaultTitle: 'Khi yêu bạn là kiểu người yêu nào?',
    defaultDesc: '10 khoảnh khắc yêu đương · 2–3 phút',
  },

  faq: [
    { q: 'Kết quả được tính thế nào?', a: 'Mỗi câu trả lời cộng điểm cho vài kiểu người yêu, kiểu nhiều điểm nhất là kết quả của bạn. Nếu hòa điểm sẽ phân định theo quy tắc cố định, nên cùng câu trả lời luôn ra cùng kết quả.' },
    { q: 'Đây có phải bài trắc nghiệm tính cách khoa học không?', a: 'Không, đây là trắc nghiệm cho vui. Câu hỏi dựa trên thói quen yêu đương hằng ngày, không phải chẩn đoán tâm lý — hãy xem như một tấm gương vui để soi mình.' },
    { q: '“Hợp nhất” và “oan gia” nghĩa là gì?', a: 'Hợp nhất là kiểu bù trừ tự nhiên cho phong cách của bạn. Oan gia là kiểu hay va chạm với bạn nhất — nhưng cũng có thể là kiểu tóe lửa nhất.' },
    { q: 'Câu trả lời của tôi có được lưu không?', a: 'Không. Câu trả lời chỉ được tính trong trình duyệt và không lưu ở đâu cả. Chúng tôi chỉ đếm ẩn danh kiểu nào xuất hiện để cho biết mỗi kết quả phổ biến ra sao.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Trắc nghiệm tình yêu',
    description: 'Chính sách quyền riêng tư của Trắc nghiệm tình yêu — cách dùng cookie, quảng cáo và thống kê ẩn danh.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Trắc nghiệm tình yêu ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời chỉ được tính trong trình duyệt, không gửi lên hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kiểu nào xuất hiện để hiển thị tỉ lệ mỗi kết quả.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Xem thêm và thay đổi cài đặt tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Chúng tôi chỉ lưu tổng số ẩn danh theo ngày (lượt xem trang, lượt hoàn thành, đánh giá) để cải thiện Dịch vụ. Các con số này không thể nhận diện bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 4 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại trắc nghiệm tình yêu',
  },

  questions: [
    { q: 'Crush nhắn tin cho bạn trước! Bạn sẽ…', choices: [
      'Rep trong 3 giây, kèm 5 cái emoji',
      'Đợi một lát mới rep. Không muốn tỏ ra mong quá',
      'Rep một câu trêu nhẹ để người ta tò mò',
      'Hỏi hôm nay thế nào và nhớ hết từng chi tiết',
    ] },
    { q: 'Buổi hẹn đầu tiên! Bạn rủ đi đâu?', choices: [
      'Quán cà phê xinh, bánh đẹp, nhạc chill',
      'Một chỗ yên tĩnh để nói chuyện thật lòng',
      'Khu trò chơi hoặc cà phê board game. Chơi thôi!',
      'Chỗ mới toanh: chợ đêm, leo núi, đi chơi trong ngày',
    ] },
    { q: 'Sắp đến sinh nhật người yêu. Kế hoạch của bạn?', choices: [
      'Tiệc bất ngờ, mời đủ hội bạn của người ấy',
      'Một món quà thật chất mà người ấy không ngờ tới',
      'Thư tay và cuốn album kỷ niệm của hai đứa',
      'Một món quà bá đạo khiến người ấy cười mấy ngày',
    ] },
    { q: 'Người yêu vừa trải qua một ngày tồi tệ. Bạn…', choices: [
      'Ngồi cạnh lặng lẽ. Không cần nói gì',
      'Mang món người ấy thích tới và giải quyết được gì thì giải quyết',
      'Nghe người ấy kể cả tối và nhớ từng lời',
      'Rủ đi chạy xe hóng gió bất chợt cho nhẹ đầu',
    ] },
    { q: 'Khi yêu, bạn thích nhắn tin nhiều cỡ nào?', choices: [
      'Cả ngày! Từ chào buổi sáng đến chúc ngủ ngon',
      'Hỏi han một hai lần. Gọi điện vẫn hơn',
      'Tin nhắn dài, ngọt ngào, đầy trái tim',
      'Thỉnh thoảng thôi. Gặp nhau kể vẫn vui hơn',
    ] },
    { q: 'Hai người giận nhau chuyện nhỏ. Bạn…', choices: [
      'Cần ở một mình một lúc rồi mới nói chuyện',
      'Tỏ ra không sao nhưng cứ thả hint cho tới khi người ấy nhận ra',
      'Xin lỗi trước, dù không hẳn là lỗi của mình',
      'Pha một câu đùa cho bớt căng',
    ] },
    { q: 'Điều gì làm tim bạn lỡ một nhịp?', choices: [
      'Khi gương mặt người ấy bừng sáng lúc thấy mình',
      'Khi hai đứa cùng cười vì một chuyện ngớ ngẩn',
      'Khi người ấy bất chợt rủ “mình đi đâu đó đi”',
      'Khi người ấy tôn trọng không gian riêng mà vẫn chọn mình',
    ] },
    { q: 'Cuối tuần lý tưởng của hai người?', choices: [
      'Diện đồ đẹp, đi quán hot, chụp ảnh thật xinh',
      'Nấu ăn ở nhà và cùng sửa đồ',
      'Picnic với hoa và hoàng hôn',
      'Quán quen, món quen. Bình yên là nhất',
    ] },
    { q: 'Khi bắt đầu thích ai đó, bạn…', choices: [
      'Không giấu nổi. Hai ngày là cả thế giới biết',
      'Tỏ ra lạnh lùng, để người ta tự tìm đến',
      'Thích thầm thật lâu, thật lâu',
      'Rủ đi hẹn hò luôn. Đời ngắn lắm!',
    ] },
    { q: 'Trong tình yêu, điều gì quan trọng nhất với bạn?', choices: [
      'Sự tin tưởng và khoảng trời riêng',
      'Cảm giác an toàn và được chăm sóc',
      'Sự lãng mạn và những ngày kỷ niệm nhỏ',
      'Làm bạn thân, chuyện gì cũng kể được',
    ] },
  ],

  types: {
    puppy: {
      name: 'Cún Con Bám Người',
      word: 'cún,chó',
      vibe: 'Yêu hết mình, lần nào gặp cũng mừng rỡ vẫy đuôi.',
      desc: 'Khi bạn thích ai, cả thế giới đều biết. Bạn nhắn trước, đến sớm và chẳng bao giờ chơi trò nắng mưa — cảm xúc hiện hết trên mặt. Năng lượng của bạn khiến người yêu thấy mình là người quan trọng nhất trên đời. Chỉ nhớ chăm sóc cả bản thân nữa, để trái tim lớn ấy không bao giờ cạn pin.',
      strengths: ['Hết lòng hết dạ', 'Niềm vui lan tỏa', 'Không thả thính lửng lơ'],
      tips: ['Rep chậm không có nghĩa là có chuyện; hãy chừa chút khoảng trống để người ấy nhớ bạn.', 'Dành một ngày mỗi tuần cho riêng mình; thời gian bên nhau sẽ càng rực rỡ.', 'Hỏi người ấy thích được yêu thương theo cách nào, rồi dành trọn cho họ.'],
    },
    cat: {
      name: 'Mèo Tsundere',
      word: 'mèo',
      vibe: 'Ngoài lạnh trong mềm, chỉ làm nũng với người được chọn.',
      desc: 'Bạn không dễ rung động, càng không yêu ồn ào. Bạn cần không gian và thời gian riêng, nên lúc đầu có thể trông hơi xa cách. Nhưng khi đã tin ai, bạn sẽ để lộ mặt ngọt ngào, tinh nghịch mà chỉ người đó được thấy. Tình yêu của bạn lặng lẽ, chung thủy và rất thật.',
      strengths: ['Độc lập điềm tĩnh', 'Đã tin là chung thủy', 'Ngọt ngào bí mật'],
      tips: ['Thử nói to một câu “nhớ cậu lắm” — từ bạn mà ra thì quý vô cùng.', 'Nói trước rằng bạn cần thời gian riêng để người ấy không hiểu lầm là lạnh nhạt.', 'Những điều nhỏ như nhớ món cà phê người ấy thích chính là ngôn ngữ yêu của bạn.'],
    },
    fox: {
      name: 'Cáo Quyến Rũ',
      word: 'cáo',
      vibe: 'Lém lỉnh, sành điệu và luôn đi trước một bước trong trò chơi tình yêu.',
      desc: 'Bạn biết cách gây ấn tượng. Tin nhắn duyên dáng, outfit chuẩn chỉnh, chút bí ẩn vừa đủ — ai cũng khó cưỡng. Bạn mê cảm giác rung rinh và giữ lửa bằng những bất ngờ. Đằng sau sức hút ấy, bạn mong tìm được người theo kịp mình mà vẫn nhìn thấy con người thật của bạn.',
      strengths: ['Sức hút khó cưỡng', 'Gu thẩm mỹ xịn', 'Giữ lửa giỏi'],
      tips: ['Pha thêm chân thành vào màn kéo đẩy; tín hiệu rõ ràng tạo niềm tin rất nhanh.', 'Cho người ấy thấy bạn những ngày lười, mặt mộc — thật mới là quyến rũ.', 'Bất ngờ của bạn thuộc hàng huyền thoại; lần này hãy để người ấy làm bạn bất ngờ.'],
    },
    bear: {
      name: 'Gấu Ấm Áp',
      word: 'gấu',
      vibe: 'Vững vàng, ấm áp và là cái ôm an toàn nhất thế gian.',
      desc: 'Bạn thể hiện tình yêu bằng hành động hơn là lời hoa mỹ. Bạn sửa đồ, lo cơm nước và luôn có mặt khi cần. Có thể bạn không phải người lãng mạn nhất, nhưng người yêu chẳng bao giờ phải băn khoăn mình ở đâu trong lòng bạn. Ở bên bạn giống như được về nhà.',
      strengths: ['Đáng tin tuyệt đối', 'Yêu bằng hành động', 'Trái tim ấm áp'],
      tips: ['Thỉnh thoảng hãy nói cảm xúc thành lời — “mình tự hào về cậu” có sức nặng lắm.', 'Lên kế hoạch một buổi hẹn bất ngờ chỉ để vui, không cần thực tế.', 'Đôi khi hãy để người ấy chăm sóc lại bạn.'],
    },
    bunny: {
      name: 'Thỏ Lãng Mạn',
      word: 'thỏ',
      vibe: 'Người mộng mơ nhớ từng buổi hẹn, từng bài hát, từng ngày kỷ niệm nhỏ.',
      desc: 'Với bạn, tình yêu là một bộ phim và cảnh nào cũng phải đẹp. Bạn để ý từng chi tiết nhỏ, viết những tin nhắn chân thành và trân trọng mọi kỷ niệm. Bạn cảm nhận sâu sắc nên rất chu đáo, đôi khi cũng dễ tổn thương. Người phù hợp sẽ nâng niu sự dịu dàng ấy.',
      strengths: ['Lãng mạn chân thành', 'Nhớ mọi thứ', 'Chu đáo sâu sắc'],
      tips: ['Khi tủi thân, hãy nói nhẹ nhàng thay vì chờ người ấy đoán.', 'Không phải ai cũng yêu bằng những điều lớn lao; hãy để ý cả những điều lặng lẽ.', 'Làm một album ảnh chung đi — đó là siêu năng lực của bạn.'],
    },
    penguin: {
      name: 'Chim Cánh Cụt Chung Tình',
      word: 'cánh cụt',
      vibe: 'Khởi đầu chậm, nhưng đã yêu là chỉ một người, mãi mãi.',
      desc: 'Bạn cần thời gian để mở lòng và không bao giờ vội vàng. Nhưng khi đã chọn ai, bạn sẵn sàng đi cùng thật lâu. Bạn lắng nghe chăm chú, nhớ những điều quan trọng và chung thủy qua mọi mùa. Tình yêu của bạn dịu dàng, kiên nhẫn — kiểu tình yêu ai cũng mơ.',
      strengths: ['Chung tình một người', 'Lắng nghe tinh tế', 'Dịu dàng bền bỉ'],
      tips: ['Đừng đợi quá lâu mới thể hiện tình cảm — một bước nhỏ có thể thay đổi tất cả.', 'Hãy chia sẻ cả nỗi lo của mình chứ đừng chỉ nghe người ấy; yêu là hai chiều.', 'Mỗi tháng thử một kiểu hẹn hò mới để sự quen thuộc vẫn còn rung động.'],
    },
    hamster: {
      name: 'Hamster Bạn Thân',
      word: 'hamster',
      vibe: 'Người yêu cũng là bạn thân, buổi hẹn nào cũng cười không ngớt.',
      desc: 'Với bạn, mối tình đẹp nhất bắt đầu từ tình bạn. Bạn thích chơi game, chia đồ ăn vặt và cười đến đau bụng. Ở cạnh bạn thật dễ chịu, bạn mang năng lượng tươi vui, nhẹ nhàng vào tình yêu. Chuyện nghiêm túc có hơi ngại, nhưng sự thẳng thắn và hài hước giúp hai người gắn bó.',
      strengths: ['Vui không giới hạn', 'Dễ tâm sự', 'Tình bạn trước tiên'],
      tips: ['Thỉnh thoảng thêm chút lãng mạn — có lúc nến thắng cả câu đùa.', 'Khi chuyện nghiêm túc, hãy ở lại nói cho xong thay vì đùa cho qua.', 'Giữ những câu đùa chỉ hai đứa hiểu — đó là keo dính của tình yêu.'],
    },
    dolphin: {
      name: 'Cá Heo Tự Do',
      word: 'cá heo',
      vibe: 'Mê phiêu lưu, ngẫu hứng và lúc nào cũng có ý tưởng cho buổi hẹn sau.',
      desc: 'Bạn yêu tự do, những vùng đất mới và luôn sẵn sàng gật đầu với phiêu lưu. Hẹn hò với bạn là những chuyến đi, kế hoạch bất chợt và vô số chuyện để kể. Bạn mang năng lượng và sự tò mò vào mọi mối quan hệ, và cần một người thích thú cùng hành trình. Tự do rất quý, nhưng người đúng sẽ khiến bạn muốn trở về.',
      strengths: ['Tinh thần phiêu lưu', 'Ý tưởng tràn trề', 'Dũng cảm khi yêu'],
      tips: ['Cân bằng kế hoạch ngẫu hứng với vài thói quen cố định mà người ấy có thể dựa vào.', 'Hỏi ý trước những chuyến phiêu lưu lớn — không phải ai cũng thích bất ngờ.', 'Kể cho người ấy nghe ước mơ; cùng nhau lên kế hoạch cũng là một cuộc phiêu lưu.'],
    },
  },
};
