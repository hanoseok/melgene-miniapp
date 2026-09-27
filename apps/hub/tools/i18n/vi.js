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
        id: 'pumpkin',
        kicker: 'Tự tay làm',
        headline: 'Khắc đèn bí ngô phát sáng của bạn',
        blurb: 'Chọn mắt, mũi, miệng, thắp nến rồi lưu ảnh hoặc gửi đi.',
      },
      {
        id: 'monster',
        kicker: 'Đặc biệt Halloween',
        headline: 'Bạn là quái vật Halloween nào?',
        blurb: '10 câu hỏi trong đêm rùng rợn sẽ cho biết bạn là quái vật nào.',
      },
      {
        id: 'life',
        kicker: 'Biên tập viên chọn',
        headline: 'Cuộc đời bạn thành truyện tranh 1 phút',
        blurb: 'Chọn năm sinh và vài khoảnh khắc, rồi xem cuộc đời bạn được vẽ từng nét.',
      },
      {
        id: 'balance',
        kicker: 'Chơi cùng bạn bè',
        headline: 'Chọn một phe, rồi xem mọi người chọn gì',
        blurb: 'Câu hỏi khó chọn, xem ngay mọi người chọn gì. Hợp thả vào nhóm chat.',
      },
      {
        id: 'reaction',
        kicker: 'Thử thách 1 phút',
        headline: 'Chạm ngay khi màn hình chuyển xanh!',
        blurb: 'Biết ngay phản xạ của bạn xếp hạng thế nào so với mọi người. Chỉ cần một lượt.',
      },
      {
        id: 'roulette',
        kicker: 'Hết đau đầu chọn món',
        headline: 'Trưa nay ăn gì? Để vòng quay quyết định',
        blurb: 'Nhập các lựa chọn rồi quay. Dùng để chia việc hay chọn hình phạt cũng tiện.',
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
};
