/* Cổng Melgene Apps (hub) — tiếng Việt (/vi/).
 * privacy.introHtml và nội dung privacy.sections là HTML; phần còn lại là văn bản thường.
 * ui được script.js dùng và nhúng vào trang dưới dạng window.PAGE_I18N.
 * Không tiết lộ nội dung: phần giới thiệu chỉ nói về không khí của từng ứng dụng, không trích câu hỏi hay kết quả thật. */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.vi.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  // Nội dung dùng Pretendard (đủ dấu tiếng Việt). Tiêu đề dùng Plus Jakarta Sans (có bộ vietnamese) —
  // Gabarito thiếu các chữ như ẫ ậ ự nên không dùng cho tiêu đề tiếng Việt.
  typography: {
    fonts: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap',
    display: "'Plus Jakarta Sans', var(--font-sans)",
  },
  meta: {
    title: 'Mini game miễn phí & trắc nghiệm tâm lý | Melgene Apps',
    description:
      'Tổng hợp mini game miễn phí và trắc nghiệm tâm lý chơi ngay trên trình duyệt. Không cần tải, không cần đăng ký, mỗi ứng dụng chỉ mất khoảng 1 phút.',
    ogTitle: 'Melgene Apps | Mini game miễn phí & trắc nghiệm tâm lý',
    ogDescription: 'Mini game, trắc nghiệm vui và ứng dụng sáng tạo. Không cần tải, không cần đăng ký, chạm là chơi trong 1 phút.',
  },
  homeAria: 'Trang chủ Melgene Apps',
  h1: 'Mini game miễn phí & trắc nghiệm tâm lý',
  curation: {
    h2: 'Mini app hôm nay',
    items: [
      {
        id: 'coffee',
        kicker: "Trắc nghiệm tính cách",
        headline: "Bạn là loại cà phê nào?",
        blurb: "12 câu hỏi đời thường, 2 phút. Tìm ly cà phê hợp với bạn.",
      },
      {
        id: 'sweeper',
        kicker: "Giải đố kinh điển",
        headline: "Né mìn, dọn sạch bảng",
        blurb: "Nhìn số mà suy luận. Lần chạm đầu an toàn, chạy đua đồng hồ.",
      },
      {
        id: 'hangul-name',
        kicker: "Ngày chữ Hangul",
        headline: "Tên bạn viết bằng tiếng Hàn",
        blurb: "Nhập tên, nhận thẻ tên chữ Hangul để lưu lại.",
      },
      {
        id: 'dice',
        kicker: "Trợ thủ board game",
        headline: "Tung xúc xắc ngay trên trình duyệt",
        blurb: "Tối đa sáu viên, d4 đến d20. Ngẫu nhiên công bằng.",
      },
      {
        id: 'brick',
        kicker: 'Game thùng cổ điển',
        headline: 'Một quả bóng, cả bức tường neon',
        blurb: 'Đỡ bóng bằng thanh trượt, phá sạch gạch. 3 mạng, càng chơi càng nhanh.',
      },
      {
        id: 'mentalage',
        kicker: 'Trắc nghiệm tính cách',
        headline: 'Tâm hồn bạn bao nhiêu tuổi?',
        blurb: '12 câu hỏi đời thường, hai phút. Biết tuổi tâm lý bằng con số.',
      },
      {
        id: 'fancytext',
        kicker: 'Tự tạo',
        headline: 'Cho chữ của bạn nổi bật',
        blurb: 'Biến chữ thường thành kiểu chữ đẹp, chạm một cái là sao chép.',
      },
      {
        id: 'mole',
        kicker: 'Game phản xạ',
        headline: 'Đập chuột chũi, né bom',
        blurb: 'Chạm trước khi chúng chui xuống. 30 giây, một danh hiệu.',
      },
      {
        id: 'nickname',
        kicker: 'Tự tạo',
        headline: 'Nickname hợp với bạn',
        blurb: 'Chọn phong cách là có ngay nickname mới chỉ với một chạm.',
      },
      {
        id: 'coinflip',
        kicker: 'Khó chọn?',
        headline: 'Tung đồng xu, đổ xúc xắc',
        blurb: 'Tung đồng xu hoặc đổ tối đa 3 xúc xắc, luôn công bằng.',
      },
      {
        id: 'lotto',
        kicker: 'Thử vận may?',
        headline: 'Tạo số xổ số cho vui',
        blurb: 'Chọn trò chơi và quay tối đa năm bộ số.',
      },
      {
        id: 'invite',
        kicker: 'Tự tay làm',
        headline: 'Làm thiệp mời tiệc Halloween',
        blurb: 'Điền thông tin tiệc, chọn chủ đề rồi lưu hoặc chia sẻ.',
      },
      {
        id: 'lunch',
        kicker: 'Chưa biết ăn gì?',
        headline: 'Quay slot chọn bữa hôm nay',
        blurb: 'Chọn bữa và tâm trạng, để máy slot quyết định.',
      },
      {
        id: 'merge',
        kicker: 'Game nhanh',
        headline: 'Thả, ghép, lớn dần',
        blurb: 'Hai vật giống nhau chạm vào sẽ ghép thành vật lớn hơn. Đừng để tràn hũ!',
      },
      {
        id: 'costume',
        kicker: 'Trắc nghiệm tính cách',
        headline: 'Halloween này hóa trang thành gì?',
        blurb: 'Trả lời vài tình huống để biết bộ trang phục hợp với bạn.',
      },
      {
        id: 'ghost',
        kicker: 'Tự tay tạo',
        headline: 'Tạo chú ma nhỏ của riêng bạn',
        blurb: 'Chọn dáng, khuôn mặt, mũ rồi lưu hoặc gửi đi.',
      },
      {
        id: 'team',
        kicker: 'Chia đội',
        headline: 'Chia đội ngẫu nhiên, công bằng',
        blurb: 'Nhập tên, chọn số đội rồi bấm trộn.',
      },
      {
        id: 'lovestyle',
        kicker: 'Trắc nghiệm tính cách',
        headline: 'Bạn là kiểu người yêu nào?',
        blurb: '10 khoảnh khắc nhỏ khi yêu cho thấy phong cách yêu của bạn.',
      },
      {
        id: 'animal',
        kicker: 'Trắc nghiệm tính cách',
        headline: 'Bạn là con vật nào?',
        blurb: 'Tám khoảnh khắc đời thường, hai phút. Gặp phần hoang dã của bạn.',
      },
      {
        id: 'game2048',
        kicker: 'Game giải đố',
        headline: 'Trượt, ghép, chạm mốc 2048',
        blurb: 'Ghép các số giống nhau. Trò xếp số kinh điển, bản Halloween.',
      },
      {
        id: 'aura',
        kicker: 'Trắc nghiệm tính cách',
        headline: 'Aura của bạn màu gì?',
        blurb: 'Trả lời vài khoảnh khắc thường ngày để biết màu aura của bạn.',
      },
      {
        id: 'candy-catch',
        kicker: 'Game nhanh',
        headline: 'Hứng kẹo rơi từ trên trời',
        blurb: 'Di chuyển xô bí ngô để hứng kẹo, né những thứ đáng sợ.',
      },
    ],
  },
  browse: {
    h2: 'Tất cả mini app',
    searchLabel: 'Tìm mini app',
    searchPlaceholder: 'Tìm mini app',
    catLabel: 'Danh mục',
    sortLabel: 'Sắp xếp',
  },
  ui: {
    cats: { all: 'Tất cả', game: 'Game', test: 'Trắc nghiệm', create: 'Sáng tạo', vote: 'Bình chọn' },
    sorts: { popular: 'Phổ biến', rating: 'Đánh giá cao', newest: 'Mới nhất' },
    totalHtml: 'Đã có <strong>{n} lượt chơi</strong>',
    play: 'Chơi ngay',
    newBadge: 'NEW',
    plays: '{n} lượt chơi',
    ratingAria: 'Đánh giá {avg}/5 từ {votes} lượt',
    prev: 'Gợi ý trước',
    next: 'Gợi ý tiếp theo',
    goTo: 'Xem gợi ý thứ {n}',
    count: '{n} app',
    countOne: '1 app',
    emptyCat: 'Danh mục này chưa có mini app nào.',
    emptySearch: 'Không tìm thấy mini app nào khớp với “{q}”. Hãy thử từ khác hoặc xem tất cả.',
    reset: 'Xem tất cả',
  },
  faqTitle: 'Câu hỏi thường gặp',
  faq: [
    [
      'Melgene Apps là gì?',
      'Đây là bộ sưu tập mini app miễn phí: mini game để so điểm với bạn bè hay bốc thăm xem ai bao bữa trưa, trắc nghiệm tâm lý cho lúc rảnh, và ứng dụng biến vài câu trả lời thành tác phẩm của riêng bạn. Mỗi cái chỉ mất khoảng một phút, mở ngay trên trình duyệt.',
    ],
    [
      'Có cần tải ứng dụng hay đăng ký không?',
      'Không. Mọi mini game và trắc nghiệm đều là trang web chạy trên điện thoại, máy tính bảng và máy tính, nên chỉ cần gửi đường link là bạn bè chơi được ngay. Nếu chơi thường xuyên, hãy chọn “Thêm vào màn hình chính” trong menu trình duyệt để dùng như một ứng dụng.',
    ],
    [
      'Các bạn có thu thập dữ liệu cá nhân không?',
      'Không. Chúng tôi không hỏi tên, email hay số điện thoại của bạn. Lượt tim, đánh giá và lượt chơi là tổng số ẩn danh của từng ứng dụng, còn đường link chia sẻ chỉ lưu những câu trả lời cần để hiển thị kết quả đó.',
    ],
    [
      'Bao lâu thì có mini app mới?',
      'Chúng tôi liên tục thêm mini game và trắc nghiệm mới theo xu hướng. Ứng dụng mới có nhãn NEW trong hai tuần và hiện đầu tiên khi sắp xếp theo “Mới nhất”.',
    ],
  ],
  privacyLink: 'Chính sách quyền riêng tư',
  og: {
    h1Html: 'Mini game miễn phí<br>&amp; trắc nghiệm tâm lý',
    tag: 'Không cần tải, không cần đăng ký',
  },
  privacy: {
    title: 'Chính sách quyền riêng tư | Melgene Apps',
    description:
      'Chính sách quyền riêng tư của Melgene Apps: quảng cáo (Google AdSense), lượt chơi, lượt tim và đánh giá ẩn danh, cookie và bộ nhớ trình duyệt.',
    h1: 'Chính sách quyền riêng tư',
    introHtml:
      'Melgene Apps (“Dịch vụ”) là bộ sưu tập mini app dùng được mà không cần tài khoản. Chúng tôi tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết để vận hành Dịch vụ như mô tả dưới đây.',
    sections: [
      [
        '1. Thông tin chúng tôi không thu thập',
        'Dịch vụ không yêu cầu hay thu thập thông tin cá nhân như tên, email, số điện thoại hoặc tài khoản. Nội dung bạn nhập vào từng mini app mặc định chỉ được xử lý trong trình duyệt của bạn.',
      ],
      [
        '2. Bộ đếm ẩn danh: lượt chơi, lượt tim và đánh giá (Supabase)',
        'Để hiển thị lượt chơi, lượt tim và đánh giá, chúng tôi chỉ lưu những dữ liệu sau trên Supabase (dịch vụ cơ sở dữ liệu): tổng cộng dồn của từng mini app (lượt chơi và lượt tim), điểm đánh giá sao (1–5) của từng mini app, và tổng theo ngày cho từng ngày, mini app và ngôn ngữ (lượt xem trang, lượt chơi hoàn tất và quảng cáo có được hiển thị hay không). Để không đếm trùng cùng một lượt truy cập trong vòng 30 giây, máy chủ lưu tạm giá trị băm một chiều của địa chỉ IP và tự động xóa, thường trong vòng một ngày. Để mỗi trình duyệt chỉ được tính một lượt đánh giá, trình duyệt của bạn giữ một mã ngẫu nhiên và máy chủ chỉ lưu giá trị băm của mã đó. Khi bạn tạo đường link chia sẻ, chúng tôi chỉ lưu các câu trả lời cần thiết để hiển thị lại đúng kết quả đó. Không dữ liệu nào trong số này được dùng để nhận dạng bạn.',
      ],
      [
        '3. Quảng cáo (Quảng cáo tự động của Google AdSense)',
        'Dịch vụ hiển thị quảng cáo qua Quảng cáo tự động của Google AdSense; Google sẽ tự chọn vị trí đặt quảng cáo. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo theo sở thích của bạn. Bạn có thể xem và thay đổi cài đặt quảng cáo được cá nhân hóa tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.',
      ],
      [
        '4. Thống kê truy cập (Google Analytics)',
        'Dịch vụ có thể dùng Google Analytics (GA4) để thống kê lượt truy cập và cải thiện Dịch vụ. Dữ liệu này chỉ dùng cho mục đích thống kê và không nhận dạng cá nhân bạn.',
      ],
      [
        '5. Cookie và bộ nhớ trình duyệt',
        'Các thiết lập như ngôn ngữ, danh mục và cách sắp xếp bạn dùng gần nhất, cùng các đánh giá bạn đã gửi chỉ được lưu trong trình duyệt của bạn (localStorage và một cookie ghi nhớ ngôn ngữ). Bạn có thể xóa hoặc chặn cookie và dữ liệu trang web bất cứ lúc nào trong phần cài đặt trình duyệt.',
      ],
      ['6. Liên hệ', 'Nếu có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ đơn vị vận hành trang web.'],
      ['7. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 26 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại Melgene Apps',
  },
  // Chân trang mọi trang cổng (Giới thiệu · Hướng dẫn · Điều khoản · Quyền riêng tư · Liên hệ). Văn bản thuần (được escape).
  footerNav: { about: 'Giới thiệu', guides: 'Hướng dẫn', terms: 'Điều khoản sử dụng', privacy: 'Quyền riêng tư', contact: 'Liên hệ' },
  aboutPage: {
    title: 'Giới thiệu | Melgene Apps',
    description: 'Melgene Apps là một studio độc lập nhỏ làm mini game, trắc nghiệm tính cách và công cụ sáng tạo miễn phí trên trình duyệt bằng 12 ngôn ngữ. Cách chúng tôi làm ra chúng.',
    h1: 'Về Melgene Apps',
    lead: 'Melgene Apps là một studio nhỏ, độc lập, chuyên làm các mini app miễn phí mở được trên mọi trình duyệt: game ngắn, trắc nghiệm tính cách vui vẻ, công cụ sáng tạo nho nhỏ và những trợ thủ giúp bạn quyết định chuyện thường ngày. Không cần tải về, không cần tài khoản, và phần lớn chỉ mất khoảng một phút.',
    sections: [
      {
        h: 'Chúng tôi làm gì',
        p: [
          'Mỗi mini app của Melgene chỉ làm một việc, nhưng làm thật tốt. Có những game kiểu arcade chơi xong trong giờ giải lao như đập chuột chũi, phá gạch hay xếp hình hợp nhất. Có những bài trắc nghiệm tính cách biến vài tình huống quen thuộc thành một kết quả vui nhộn để chia sẻ. Lại có những app giúp bạn tạo ra thứ gì đó như chữ kiểu, thiệp mời tiệc, biệt danh, hoặc chốt một quyết định nhỏ bằng vòng quay, trò bốc thăm thang hay tung đồng xu.',
          'Chúng tôi thường xuyên ra app mới, nhiều khi theo mùa và dịp lễ, đồng thời liên tục cải thiện các app cũ dựa trên cách mọi người thực sự sử dụng.',
        ],
      },
      {
        h: 'Vì sao chúng tôi làm',
        p: ['Chúng tôi tin rằng những khoảnh khắc vui vẻ trên mạng nên nhanh, thân thiện và miễn phí. Nhiều trang game hay trắc nghiệm bắt bạn đăng ký, hiện pop-up và mời cài app trước. Chúng tôi muốn làm ngược lại: chạm vào liên kết, app mở ra, bạn chơi ngay, và chỉ thêm một chạm là gửi được cho bạn bè.'],
      },
      {
        h: 'Mỗi app được làm và kiểm tra thế nào',
        p: ['Mỗi app bắt đầu từ một bản kế hoạch ngắn: dành cho ai, một lượt chơi mất bao lâu và màn hình kết quả hiển thị gì. Sau đó chúng tôi làm thành một trang web nhẹ và kiểm tra trước khi phát hành:'],
        list: [
          'Trên màn hình điện thoại nhỏ (rộng 360px) cũng như máy tính bảng và trình duyệt máy tính',
          'Đủ cả 12 ngôn ngữ, kiểm tra từng dòng có vừa màn hình và đọc tự nhiên không',
          'Bằng các bước kiểm tra tự động về liên kết hỏng, bản dịch còn thiếu và cấu trúc trang',
          'Không tiết lộ trước: màn hình bắt đầu chỉ gợi tò mò, không bao giờ để lộ câu hỏi hay kết quả',
        ],
      },
      {
        h: 'Ưu tiên di động, 12 ngôn ngữ',
        p: ['Phần lớn mọi người chơi trên điện thoại, nên app nào cũng được thiết kế cho màn hình hẹp trước tiên. Melgene Apps có bằng tiếng Việt, Anh, Nhật, Trung, Hàn, Pháp, Đức, Thái, Tây Ban Nha, Ý, Bồ Đào Nha và Nga. Chúng tôi viết từng ngôn ngữ cho người đọc bản xứ thay vì dịch từng chữ, và dùng đúng tên gọi mà người ở mỗi nước thật sự tìm kiếm.'],
      },
      {
        h: 'Tôn trọng quyền riêng tư ngay từ thiết kế',
        p: ['Bạn không bao giờ cần tài khoản, và chúng tôi không hỏi tên, email hay số điện thoại của bạn. Những gì bạn nhập vào app được xử lý ngay trong trình duyệt của bạn. Lượt chơi, tim và đánh giá chỉ là con số tổng ẩn danh của từng app. Trang web được duy trì nhờ quảng cáo Google AdSense; chi tiết có trong Chính sách quyền riêng tư.'],
      },
      {
        h: 'Lưu ý về trắc nghiệm tính cách',
        p: ['Các bài trắc nghiệm tính cách, kiểm tra tuổi tâm hồn và những câu đố tương tự được làm ra để giải trí. Chúng không phải đánh giá tâm lý, y khoa hay chuyên môn, và bạn đừng dựa vào kết quả để đưa ra quyết định quan trọng về bản thân hay người khác. Hãy xem chúng như một chủ đề để trò chuyện và một chút niềm vui.'],
      },
      {
        h: 'Liên hệ với chúng tôi',
        p: ['Chúng tôi đọc mọi tin nhắn. Nếu bạn phát hiện lỗi, có ý tưởng cho mini app mới hoặc muốn bàn chuyện hợp tác, hãy vào trang Liên hệ hoặc gửi email tới contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Liên hệ | Melgene Apps',
    description: 'Liên hệ Melgene Apps qua email để góp ý, báo lỗi, đề xuất hợp tác hoặc gửi yêu cầu về quyền riêng tư. Chúng tôi thường trả lời trong vài ngày làm việc.',
    h1: 'Liên hệ',
    lead: 'Bạn có câu hỏi, ý tưởng hay gặp trục trặc? Chúng tôi là một nhóm nhỏ và tự đọc từng tin nhắn.',
    emailH: 'Email',
    emailNote: 'Chúng tôi thường trả lời trong vài ngày làm việc.',
    sections: [
      {
        h: 'Bạn có thể liên hệ về',
        p: ['Cứ thoải mái viết cho chúng tôi về bất cứ điều gì liên quan đến Melgene Apps, ví dụ:'],
        list: [
          'Góp ý và ý tưởng cho mini game, trắc nghiệm hay công cụ mới',
          'Báo lỗi: trang không tải, nút không bấm được hoặc chữ bị cắt',
          'Lỗi dịch hoặc câu chữ nghe không tự nhiên trong ngôn ngữ của bạn',
          'Đề xuất hợp tác, bản quyền hoặc báo chí',
          'Yêu cầu về quyền riêng tư và câu hỏi về dữ liệu hay cookie',
        ],
      },
      {
        h: 'Khi báo lỗi',
        p: ['Để chúng tôi sửa nhanh, hãy ghi tên mini app, ngôn ngữ bạn đang dùng, thiết bị và trình duyệt (ví dụ iPhone với Safari hoặc Android với Chrome) và mô tả ngắn chuyện gì đã xảy ra. Có ảnh chụp màn hình thì càng tốt.'],
      },
      {
        h: 'Thời gian phản hồi',
        p: ['Chúng tôi thường trả lời trong vài ngày làm việc; dịp lễ Tết có thể lâu hơn một chút. Chúng tôi sẽ không bao giờ hỏi mật khẩu hay thông tin thanh toán của bạn.'],
      },
    ],
  },
  termsPage: {
    title: 'Điều khoản sử dụng | Melgene Apps',
    description: 'Điều khoản sử dụng Melgene Apps: mini game và trắc nghiệm miễn phí trên trình duyệt được cung cấp nguyên trạng để giải trí, quy tắc sử dụng, liên kết chia sẻ và quảng cáo bên thứ ba.',
    h1: 'Điều khoản sử dụng',
    updated: 'Cập nhật lần cuối: ngày 9 tháng 10 năm 2026',
    lead: 'Điều khoản sử dụng này áp dụng cho Melgene Apps (“Dịch vụ”), bao gồm cổng chính và mọi mini app trên trang của chúng tôi. Khi sử dụng Dịch vụ, bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng Dịch vụ.',
    sections: [
      { h: '1. Dịch vụ', p: ['Melgene Apps cung cấp miễn phí mini game, trắc nghiệm tính cách, công cụ sáng tạo và công cụ hỗ trợ quyết định chạy trên trình duyệt web. Không cần tài khoản. Chúng tôi có thể thêm, thay đổi hoặc gỡ bỏ app và tính năng bất cứ lúc nào.'] },
      { h: '2. Cung cấp nguyên trạng', p: ['Dịch vụ được cung cấp “nguyên trạng” và “tùy theo khả năng sẵn có”, không kèm bất kỳ bảo đảm nào. Chúng tôi cố gắng để mọi thứ chạy ổn định, nhưng không bảo đảm Dịch vụ luôn sẵn sàng, không có lỗi hay phù hợp với một mục đích cụ thể. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm về tổn thất hay thiệt hại phát sinh từ việc sử dụng Dịch vụ.'] },
      { h: '3. Chỉ để giải trí', p: ['Kết quả của trắc nghiệm tính cách, kiểm tra tuổi tâm hồn, bốc thăm ngẫu nhiên và các tính năng tương tự chỉ để vui. Chúng không phải lời khuyên khoa học, tâm lý, y khoa, tài chính hay chuyên môn. Kết quả ngẫu nhiên như dãy số xổ số cũng không làm tăng cơ hội trúng thưởng.'] },
      {
        h: '4. Quy tắc sử dụng',
        p: ['Khi dùng Dịch vụ, bạn đồng ý không:'],
        list: [
          'Dùng Dịch vụ cho mục đích trái pháp luật, gây hại hoặc lạm dụng',
          'Nhập nội dung thù ghét, quấy rối, khiêu dâm hoặc xâm phạm quyền của người khác',
          'Phá rối, gây quá tải, thu thập dữ liệu hàng loạt hoặc truy cập trái phép vào Dịch vụ',
          'Thao túng lượt chơi, tim, đánh giá hay quảng cáo, kể cả bằng công cụ tự động hoặc nhấp chuột không hợp lệ',
        ],
      },
      { h: '5. Nội dung bạn tạo và chia sẻ', p: ['Một số app cho phép bạn nhập tên hoặc chữ, tạo hình ảnh hay tạo liên kết chia sẻ. Bạn chịu trách nhiệm về những gì mình nhập và chia sẻ. Liên kết chia sẻ chỉ lưu thông tin cần thiết để hiển thị kết quả đó, và ai có liên kết cũng mở được, vì vậy đừng đưa thông tin cá nhân hay nhạy cảm vào. Chúng tôi có thể xóa liên kết vi phạm các điều khoản này.'] },
      { h: '6. Quảng cáo và cookie', p: ['Dịch vụ miễn phí nhờ quảng cáo. Quảng cáo do bên thứ ba như Google AdSense cung cấp; họ có thể dùng cookie và công nghệ tương tự để hiển thị và đo lường quảng cáo, bao gồm quảng cáo cá nhân hóa. Chúng tôi không kiểm soát nội dung quảng cáo của bên thứ ba hay các trang mà quảng cáo dẫn tới. Bạn có thể tìm hiểu thêm và điều chỉnh lựa chọn trong Chính sách quyền riêng tư và phần Cài đặt quảng cáo của Google.'] },
      { h: '7. Sở hữu trí tuệ', p: ['Thiết kế, mã nguồn, chữ viết, hình minh họa và các tài liệu khác của Dịch vụ thuộc về Melgene Apps hoặc bên cấp phép và được pháp luật bảo vệ. Bạn có thể dùng Dịch vụ cho mục đích cá nhân, phi thương mại và tự do chia sẻ liên kết. Vui lòng không sao chép, đăng lại hay bán app hoặc nội dung khi chưa được chúng tôi cho phép.'] },
      { h: '8. Thay đổi điều khoản', p: ['Thỉnh thoảng chúng tôi có thể cập nhật Điều khoản sử dụng này và sẽ đổi ngày ở đầu trang khi cập nhật. Nếu bạn tiếp tục dùng Dịch vụ sau khi cập nhật, nghĩa là bạn chấp nhận điều khoản mới.'] },
      { h: '9. Liên hệ', p: ['Nếu có câu hỏi về các điều khoản này, hãy gửi email tới contact@melgene.com hoặc dùng trang Liên hệ.'] },
    ],
  },
  guidesPage: {
    title: 'Hướng dẫn & mẹo cho mọi mini app | Melgene Apps',
    description: 'Cách chơi, mẹo hay và chuyện thú vị về mini game, trắc nghiệm tính cách và công cụ của Melgene. Đọc hướng dẫn ngắn rồi vào app chơi ngay.',
    h1: 'Hướng dẫn & mẹo',
    lead: 'Mỗi bài hướng dẫn giải thích mini app hoạt động ra sao, làm thế nào để chơi giỏi hơn và vài điều nên biết trước khi bắt đầu. Không tiết lộ trước: câu hỏi và kết quả vẫn là bất ngờ.',
    read: 'Đọc hướng dẫn',
    play: 'Chơi',
    empty: 'Các bài hướng dẫn sắp có. Bạn quay lại sau nhé!',
  },
};
