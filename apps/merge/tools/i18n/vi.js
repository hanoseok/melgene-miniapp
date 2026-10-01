/* Game dưa hấu Halloween (Suika Game) — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Luật chơi, cấp và điểm nằm trong merge-core.js.
 */
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
    title: 'Game dưa hấu Halloween – Suika Game miễn phí',
    description: 'Game dưa hấu (Suika Game) phiên bản Halloween: thả kẹo vào hũ, gộp hai món giống nhau thành món lớn hơn và nuôi đèn bí ngô khổng lồ. Miễn phí, không cần tải.',
    ogTitle: 'Game dưa hấu Halloween 🎃 Bạn gộp được lớn cỡ nào?',
    ogDescription: 'Thả, ghép đôi, gộp lại. Đừng để tràn vạch và xem bạn đi được bao xa.',
  },
  siteName: 'Game dưa hấu Halloween',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🎃 Halloween · xếp hình gộp',
    h1Kicker: 'Game dưa hấu Halloween',
    h1Html: 'Bạn gộp được<br><em>lớn</em> cỡ nào?',
    hook: 'Thả đồ ngọt vào hũ. Hai món giống nhau chạm vào sẽ gộp thành món lớn hơn — nhưng đừng để chồng đồ tràn qua vạch.',
    how: { aim: 'Ngắm rồi thả', match: 'Ghép hai món', line: 'Đừng vượt vạch' },
    facts: 'Không giới hạn thời gian · chơi theo nhịp của bạn',
    start: 'Bắt đầu gộp →',
  },

  play: {
    score: 'Điểm',
    best: 'Kỷ lục',
    next: 'Tiếp',
    nextAria: 'Món tiếp theo: {name}',
    pause: 'Tạm dừng',
    paused: 'Tạm dừng',
    resume: 'Chơi tiếp',
    full: 'Hũ đầy rồi!',
    chainAria: 'Thứ tự gộp từ món nhỏ nhất đến lớn nhất',
    fieldAria: 'Hũ trò chơi. Di chuyển hoặc kéo để ngắm, nhả tay hoặc bấm để thả. Phím mũi tên để ngắm, phím cách để thả.',
  },

  result: {
    full: 'Hũ tràn rồi!',
    points: 'điểm',
    best: 'Kỷ lục: {n}',
    newBest: 'Kỷ lục mới!',
    biggest: 'Món lớn nhất',
    merges: 'Số lần gộp',
    top: 'Top {n}%',
    beat: 'Cao hơn {pct}% người chơi',
    beatAll: 'Cao hơn mọi điểm số khác từ trước đến nay',
    others: 'So với {n} điểm số khác',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Game dưa hấu Halloween',
    shareText: 'Mình được {score} điểm trong Game dưa hấu Halloween 🎃 Bạn có vượt được không?',
  },

  tiers: ['Kẹo bắp', 'Kẹo', 'Kẹo mút', 'Hạt dẻ', 'Táo', 'Nấm', 'Dơi', 'Con ma', 'Quả cầu pha lê', 'Bí ngô', 'Đèn bí ngô'],

  og: {
    brand: '🎃 Game dưa hấu Halloween',
    defaultKicker: 'Game gộp Halloween miễn phí',
    defaultTitle: 'Bạn gộp được lớn cỡ nào?',
    defaultDesc: 'Thả · ghép hai món · gộp lớn hơn',
  },

  faq: [
    { q: 'Chơi thế nào?', a: 'Di chuyển ngón tay hoặc chuột phía trên hũ để ngắm, rồi nhả tay (hoặc bấm) để thả món đồ. Bạn cũng có thể ngắm bằng phím mũi tên và thả bằng phím cách. Khi hai món giống hệt nhau chạm vào nhau, chúng gộp thành món lớn hơn một cấp.' },
    { q: 'Khi nào thì thua?', a: 'Không có giới hạn thời gian. Ván chơi kết thúc khi chồng đồ nằm trên vạch đứt nét phía trên khoảng hai giây. Hãy chừa chỗ trống và tính trước chỗ để gộp.' },
    { q: 'Điểm được tính ra sao?', a: 'Mỗi lần gộp đều được điểm, gộp ra món càng lớn càng nhiều điểm. Những chuỗi gộp liên tiếp giúp điểm tăng rất nhanh.' },
    { q: 'Con số top % có thật không?', a: 'Có. Khi hết ván, chỉ điểm số của bạn được gửi ẩn danh lên máy chủ để so với người khác. Top % chỉ hiện khi có điểm thật để so sánh, nếu không sẽ không hiện gì. Trò chơi cũng tự tạm dừng khi bạn chuyển sang tab khác.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Game dưa hấu Halloween',
    description: 'Chính sách quyền riêng tư của Game dưa hấu Halloween: điểm ẩn danh, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Game dưa hấu Halloween (sau đây gọi là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu theo chính sách dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi hết một ván, chỉ điểm số của bạn (làm tròn đến hàng chục) được gửi lên máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin dưới đây có thể được thu thập tự động trong quá trình sử dụng.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, để hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Xem thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và ngôn ngữ (lượt xem, số ván bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 2 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Game dưa hấu Halloween',
  },
};
