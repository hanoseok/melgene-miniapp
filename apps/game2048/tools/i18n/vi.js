/* Game 2048 (phiên bản Halloween) — Tiếng Việt */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Game 2048 – chơi miễn phí online, bản Halloween',
    description: 'Chơi game 2048 online phiên bản Halloween: vuốt hoặc dùng phím mũi tên, ghép các ô cùng số và đạt tới 2048. Miễn phí, không cần tải về.',
    ogTitle: 'Game 2048 🎃 Bạn có lên được 2048 không?',
    ogDescription: 'Vuốt, ghép, nhân đôi. Một bản 2048 rùng rợn chơi ngay trên trình duyệt.',
  },
  siteName: 'Game 2048',
  privacyLink: 'Chính sách bảo mật',

  start: {
    badge: '🎃 Bản Halloween · xếp số',
    h1Kicker: 'Game 2048',
    h1Html: 'Bạn có lên được<br><em>2048</em> không?',
    hook: 'Vuốt các ô số. Hai số giống nhau gặp nhau sẽ gộp làm một — cứ nhân đôi trước khi bàn cờ đầy.',
    how: { swipe: 'Vuốt để trượt', match: 'Ghép số giống nhau', goal: 'Đạt tới 2048' },
    facts: 'Không giới hạn thời gian · vuốt hoặc phím mũi tên',
    start: 'Bắt đầu chơi →',
  },

  play: {
    score: 'Điểm',
    best: 'Kỷ lục',
    boardAria: 'Bàn chơi. Vuốt hoặc dùng phím mũi tên để trượt các ô.',
    won: 'Bạn đã đạt 2048!',
    keepGoing: 'Chơi tiếp',
    finish: 'Dừng ở đây',
    over: 'Hết nước đi rồi!',
  },

  result: {
    over: 'Hết nước đi rồi!',
    won: 'Bạn đã lên tới 2048!',
    points: 'điểm',
    best: 'Kỷ lục: {n}',
    newBest: 'Kỷ lục mới!',
    biggest: 'Ô lớn nhất',
    moves: 'Số lượt',
    top: 'Top {n}%',
    beat: 'Cao hơn {pct}% người chơi',
    beatAll: 'Cao hơn mọi điểm số khác từ trước tới nay',
    others: 'So với {n} điểm số khác',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Game 2048 – bản Halloween',
    shareText: 'Mình được {score} điểm trong game 2048 🎃 Bạn vượt được không?',
  },

  og: {
    brand: '🔢 Game 2048',
    defaultKicker: 'Game 2048 Halloween miễn phí',
    defaultTitle: 'Bạn có lên được 2048 không?',
    defaultDesc: 'Vuốt · ghép · nhân đôi',
  },

  faq: [
    { q: 'Chơi game 2048 thế nào?', a: 'Vuốt trên bàn chơi (hoặc nhấn phím mũi tên) để trượt tất cả các ô cùng lúc. Khi hai ô cùng số chạm nhau, chúng gộp thành một ô có giá trị gấp đôi. Sau mỗi lượt sẽ xuất hiện một ô 2 hoặc 4 mới.' },
    { q: 'Khi nào trò chơi kết thúc?', a: 'Không giới hạn thời gian. Trò chơi kết thúc khi bàn chơi đầy và không còn hai ô cạnh nhau nào cùng số. Đạt 2048 rồi thì bạn có thể dừng hoặc chơi tiếp để lấy điểm cao hơn.' },
    { q: 'Điểm được tính thế nào?', a: 'Mỗi lần ghép, giá trị của ô mới được cộng vào điểm, nên ghép số càng lớn càng nhiều điểm. Kỷ lục chỉ được lưu trên trình duyệt này.' },
    { q: 'Top % có thật không?', a: 'Có. Khi kết thúc, chỉ điểm của bạn được gửi ẩn danh lên máy chủ để so với mọi người. Top % chỉ hiện khi có điểm thật để so sánh; nếu không thì sẽ không hiện gì.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Game 2048',
    description: 'Chính sách bảo mật của Game 2048: điểm ẩn danh, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Game 2048 (gọi tắt là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc ván, chỉ điểm của bạn (làm tròn tới 20 điểm) được gửi lên máy chủ dưới dạng bộ đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong muốn.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Xem thêm và thay đổi lựa chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số ván bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng được bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ quản trị viên trang web.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 4 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Game 2048',
  },
};
