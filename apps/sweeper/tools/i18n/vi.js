/* Dò mìn — vi (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Chakra Petch'",
    displayWeight: 700,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Dò mìn – Chơi game dò mìn miễn phí',
    description: 'Chơi Dò mìn online: mở hết các ô an toàn, cắm cờ lên mìn và chạy đua với đồng hồ. Có 3 cấp độ, lần chạm đầu tiên luôn an toàn. Miễn phí, không cần tải.',
    ogTitle: 'Dò mìn 💣 Bạn dọn sạch bãi mìn nhanh cỡ nào?',
    ogDescription: 'Trò giải đố kinh điển ngay trên trình duyệt: ba kích thước, lần chạm đầu an toàn và đồng hồ để thử thách.',
  },
  siteName: 'Dò mìn',
  privacyLink: 'Chính sách quyền riêng tư',
  start: {
    badge: '💣 Giải đố kinh điển · 3 cấp',
    h1Kicker: 'Dò mìn',
    h1Html: 'Dọn sạch bãi mìn,<br>né mọi <em>quả mìn</em>',
    hook: 'Các con số cho biết xung quanh có bao nhiêu quả mìn. Hãy suy luận, cắm cờ vào ô nguy hiểm và dọn sạch bảng trước khi đồng hồ chạy mất.',
    how: { reveal: 'Chạm để mở', flag: 'Giữ để cắm cờ', chord: 'Chạm số để mở xung quanh' },
    facts: 'Lần chạm đầu luôn an toàn',
    diffLabel: 'Chọn cấp độ',
    diffs: { beginner: 'Dễ', intermediate: 'Vừa', expert: 'Khó' },
    start: 'Bắt đầu →',
  },
  play: {
    mines: 'Mìn',
    time: 'Giờ',
    digMode: 'Mở',
    flagMode: 'Cờ',
    boardAria: 'Bảng Dò mìn. Chạm vào ô để mở, giữ hoặc dùng chế độ cờ để đánh dấu mìn.',
    paused: 'Đã tạm dừng · chạm để tiếp tục',
    aHidden: 'Ô chưa mở',
    aFlag: 'Ô đã cắm cờ',
    aMine: 'Mìn',
    aNum: '{n} mìn xung quanh',
  },
  result: {
    win: 'Dọn sạch bãi mìn!',
    lose: 'Bùm!',
    sec: 'giây',
    timeLabel: 'Thời gian',
    clearedLabel: 'Đã mở',
    best: 'Kỷ lục: {t}',
    newBest: 'Kỷ lục mới!',
    top: 'Top {n}%',
    beat: 'Nhanh hơn {pct}% người chơi',
    beatAll: 'Nhanh hơn mọi thành tích từ trước đến nay',
    others: 'So với {n} thành tích khác',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Dò mìn – bạn dọn sạch được không?',
    shareWin: 'Mình dọn sạch Dò mìn cấp {diff} trong {time} giây 💣 Bạn thắng được mình không?',
    shareLose: 'Dò mìn cấp {diff}: mình mở được {pct}% thì nổ tung 💥 Bạn làm tốt hơn được không?',
  },
  og: { brand: '💣 Dò mìn', defaultKicker: 'Game giải đố miễn phí', defaultTitle: 'Bạn dọn sạch được không?', defaultDesc: 'Cắm cờ · chạy đua đồng hồ' },
  faq: [
    {
      q: 'Chơi Dò mìn như thế nào?',
      a: 'Chạm vào một ô để mở nó. Con số cho biết trong tám ô xung quanh có bao nhiêu ô chứa mìn. Dựa vào số để suy ra vị trí mìn, cắm cờ, rồi mở hết các ô không có mìn là thắng.',
    },
    {
      q: 'Cắm cờ trên điện thoại thế nào?',
      a: 'Nhấn giữ một ô trong giây lát, hoặc chuyển nút Mở / Cờ phía trên bảng sang chế độ cờ rồi chạm. Trên máy tính có thể bấm chuột phải hoặc nhấn phím F trên ô đang chọn.',
    },
    {
      q: 'Chạm vào con số thì sao?',
      a: 'Nếu bạn đã cắm đủ số cờ quanh một con số đúng bằng giá trị của nó, chạm vào số đó sẽ mở luôn các ô còn lại xung quanh. Nếu cắm cờ sai, ô đó sẽ nổ, nên hãy kiểm tra trước.',
    },
    {
      q: 'Lần chạm đầu có thật sự an toàn?',
      a: 'Có. Mìn chỉ được rải sau lần chạm đầu tiên, không đặt vào ô đó hay ô sát bên, nên luôn mở ra được một khoảng trống. Đồng hồ chạy từ lần chạm đầu và dừng khi bạn rời tab.',
    },
  ],
  privacy: {
    "title": "Chính sách quyền riêng tư | Dò mìn",
    "description": "Chính sách quyền riêng tư của Dò mìn: thời gian ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Dò mìn (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi bạn thắng một ván, chỉ cấp độ và thời gian hoàn thành (làm tròn tới nửa giây) được gửi đến máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ, như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Xem thêm và thay đổi lựa chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, ván chơi đã bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng được bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 10 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Dò mìn"
  },
};
