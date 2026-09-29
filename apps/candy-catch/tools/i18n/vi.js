/* Trò chơi hứng kẹo Halloween — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Luật chơi và điểm nằm trong candy-catch-core.js.
 * Lilita One không có dấu tiếng Việt → tiêu đề dùng Baloo 2, chữ thường dùng Be Vietnam Pro.
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
    title: 'Trò chơi hứng kẹo Halloween – Game miễn phí',
    description: 'Trò chơi hứng kẹo Halloween: kéo xô bí ngô để hứng kẹo rơi, né nhện và ma, nối combo để ghi điểm. Mỗi lượt 50 giây, miễn phí, không cần cài đặt.',
    ogTitle: 'Trò chơi hứng kẹo Halloween 🍬 Bạn hứng được bao nhiêu?',
    ogDescription: 'Kẹo rơi đầy trời. 50 giây, 3 mạng — xô của bạn đầy được đến đâu?',
  },
  siteName: 'Hứng kẹo Halloween',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🎃 Cho kẹo hay bị ghẹo · arcade',
    h1Kicker: 'Trò chơi hứng kẹo Halloween',
    h1Html: 'Bạn hứng được<br>bao nhiêu <em>viên kẹo</em>?',
    hook: 'Đêm nay trời mưa kẹo. Hãy làm đầy xô trước khi hết giờ — nhưng không phải thứ gì rơi xuống cũng ngọt đâu.',
    how: { move: 'Kéo hoặc ← →', catch: 'Hứng kẹo', avoid: 'Né thứ đáng sợ' },
    facts: '50 giây · 3 mạng · có combo',
    start: 'Bắt đầu hứng kẹo →',
  },

  play: {
    score: 'Điểm',
    time: 'Giờ',
    lives: 'Mạng',
    livesAria: 'Còn {n} mạng',
    combo: 'Combo ×{n}',
    pause: 'Tạm dừng',
    paused: 'Đang tạm dừng',
    resume: 'Chơi tiếp',
    go: 'Bắt đầu!',
    fieldAria: 'Khu vực chơi. Kéo, di chuột hoặc dùng phím mũi tên để di chuyển xô.',
  },

  result: {
    timeUp: 'Hết giờ!',
    outOfLives: 'Hết mạng rồi!',
    points: 'điểm',
    best: 'Kỷ lục: {n}',
    newBest: 'Kỷ lục mới!',
    caught: 'Kẹo hứng được',
    streak: 'Combo dài nhất',
    top: 'Top {n}%',
    beat: 'Cao hơn {pct}% người chơi',
    beatAll: 'Cao hơn mọi điểm số hiện có',
    others: 'So với {n} điểm số khác',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Trò chơi hứng kẹo Halloween',
    shareText: 'Mình được {score} điểm trong trò hứng kẹo Halloween 🍬 Bạn vượt nổi không?',
  },

  og: {
    brand: '🍬 Hứng kẹo Halloween',
    defaultKicker: 'Game Halloween miễn phí',
    defaultTitle: 'Bạn hứng được bao nhiêu viên kẹo?',
    defaultDesc: 'Kéo xô · hứng kẹo · 50 giây',
  },

  faq: [
    { q: 'Chơi thế nào?', a: 'Kéo ngón tay trên khu vực chơi, di chuột hoặc giữ phím ← → để di chuyển xô bí ngô. Hứng kẹo rơi xuống và tránh xa những thứ đáng sợ. Mỗi lượt kéo dài 50 giây hoặc đến khi hết 3 mạng.' },
    { q: 'Điểm và combo tính thế nào?', a: 'Mỗi viên kẹo có điểm riêng, loại càng hiếm và càng xịn thì càng nhiều điểm. Hứng liên tiếp sẽ tích combo, chuỗi càng dài hệ số nhân càng cao. Làm rơi kẹo hoặc hứng phải thứ đáng sợ thì combo về 0.' },
    { q: 'Tỷ lệ % có thật không?', a: 'Có. Khi hết lượt, chỉ điểm số của bạn được gửi ẩn danh lên máy chủ để so với người khác. Tỷ lệ % chỉ hiện khi có điểm số thật để so sánh; nếu không thì không hiện gì cả.' },
    { q: 'Sao trò chơi tự dừng?', a: 'Khi bạn chuyển sang thẻ hoặc ứng dụng khác, trò chơi tự tạm dừng để bạn không mất mạng lúc vắng mặt. Bấm Chơi tiếp để chơi tiếp. Kỷ lục của bạn được lưu trong trình duyệt này.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Trò chơi hứng kẹo Halloween',
    description: 'Chính sách quyền riêng tư của Trò chơi hứng kẹo Halloween: điểm ẩn danh, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Trò chơi hứng kẹo Halloween (sau đây gọi là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu theo chính sách dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi hết một lượt, chỉ điểm số của bạn (làm tròn đến hàng chục) được gửi lên máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin dưới đây có thể được thu thập tự động trong quá trình sử dụng.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, để hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Xem thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và ngôn ngữ (lượt xem, số lượt bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 30 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại Trò chơi hứng kẹo Halloween',
  },
};
