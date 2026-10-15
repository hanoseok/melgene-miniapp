/* Trò chơi lật hình — Tiếng Việt */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 700,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Trò chơi lật hình – Lật thẻ Halloween tìm cặp',
    description: 'Chơi trò chơi lật hình miễn phí: lật hai lá bài Halloween mỗi lượt và tìm hết các cặp giống nhau. Ba cấp độ, bấm giờ và đếm lượt. Không cần tải về.',
    ogTitle: 'Trò chơi lật hình 🎃 Bạn tìm được hết các cặp không?',
    ogDescription: 'Bí ngô, con ma và dơi đang trốn sau những lá bài. Lật hai lá mỗi lượt và thử trí nhớ của bạn.',
  },
  siteName: 'Trò chơi lật hình Halloween',
  privacyLink: 'Chính sách quyền riêng tư',
  start: {
    badge: '🎃 Lật thẻ Halloween',
    h1Kicker: 'Trò chơi lật hình',
    h1Html: 'Lật thẻ bài,<br>tìm đủ các <em>cặp</em>',
    hook: 'Bí ngô, con ma và dơi đang trốn sau những lá bài. Lật hai lá mỗi lượt và nhớ thật kỹ chỗ của từng hình.',
    how: 'Lật hai lá · cùng hình là thành cặp',
    levelLabel: 'Chọn cấp độ',
    levels: { easy: 'Dễ', normal: 'Vừa', hard: 'Khó' },
    start: 'Bắt đầu →',
  },
  play: {
    time: 'Thời gian',
    moves: 'Lượt',
    pairs: 'Cặp',
    boardAria: 'Bàn lật hình. Lật hai lá bài để tìm cặp giống nhau.',
    aDown: 'Lá bài số {n}, đang úp',
    paused: 'Tạm dừng · chạm để chơi tiếp',
  },
  result: {
    done: 'Đã tìm đủ các cặp!',
    sec: 'giây',
    movesLabel: 'Số lượt',
    accLabel: 'Độ chính xác',
    best: 'Kỷ lục: {t}',
    newBest: 'Kỷ lục mới!',
    top: 'Top {n}%',
    beat: 'Nhanh hơn {pct}% người chơi',
    beatAll: 'Nhanh hơn mọi thành tích hiện có',
    others: 'So với {n} thành tích khác cùng cấp độ',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Lật hình Halloween – trí nhớ của bạn thế nào?',
    shareText: 'Mình tìm đủ {pairs} cặp trong {time} giây với {moves} lượt 🎃 Bạn có nhanh hơn không?',
  },
  og: {
    brand: '🃏 Trò chơi lật hình',
    defaultKicker: 'Game trí nhớ Halloween miễn phí',
    defaultTitle: 'Bạn tìm được hết các cặp không?',
    defaultDesc: 'Lật hai lá · ghi nhớ · ghép cặp',
  },
  faq: [
    {
      q: 'Trò chơi lật hình chơi thế nào?',
      a: 'Lúc đầu tất cả lá bài đều úp. Chạm một lá, rồi chạm lá thứ hai. Nếu hai hình giống nhau, chúng thành một cặp và vẫn mở; nếu khác, chúng hiện một lát rồi úp lại. Tìm đủ các cặp là thắng. Đồng hồ bắt đầu chạy khi bạn lật lá đầu tiên.',
    },
    {
      q: 'Lượt và độ chính xác được tính thế nào?',
      a: 'Mỗi lần lật hai lá là một lượt. Độ chính xác bằng số cặp chia cho số lượt, nên tìm đủ mà không sai lần nào là 100%. Lật sai không cộng thêm thời gian, nhưng làm tăng số lượt.',
    },
    {
      q: 'Các cấp độ khác nhau ra sao?',
      a: 'Dễ có 12 lá (6 cặp), Vừa có 16 lá (8 cặp) và Khó có 24 lá (12 cặp). Mỗi ván vị trí và hình đều được xáo lại, và kỷ lục được lưu riêng cho từng cấp độ.',
    },
    {
      q: 'Nếu chuyển sang ứng dụng khác thì sao?',
      a: 'Đồng hồ dừng lại và các lá bài bị che nên không ai nhìn trộm được. Quay lại và chạm vào bàn chơi là bạn chơi tiếp từ chỗ cũ.',
    },
    {
      q: 'Con số “Top %” lấy từ đâu?',
      a: 'Khi bạn chơi xong, cấp độ và thời gian đã làm tròn của bạn được so với thành tích thật của những người chơi khác cùng cấp độ. Nếu chưa có thành tích nào để so, phần này sẽ không hiện.',
    },
  ],
  privacy: {
    "title": "Chính sách quyền riêng tư | Trò chơi lật hình",
    "description": "Chính sách quyền riêng tư của trò chơi lật hình: thành tích ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trò chơi lật hình Halloween (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi bạn chơi xong một ván, chỉ cấp độ và thời gian (làm tròn đến 0,1 giây) được gửi lên máy chủ dưới dạng số liệu ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động trong khi bạn sử dụng Dịch vụ, như mô tả dưới đây."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi lựa chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, ván bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng được cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 16 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại trò chơi lật hình"
  },
};
