/* Game 1 đến 50 — Tiếng Việt */
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
    title: 'Game 1 đến 50 – Chạm số theo thứ tự thật nhanh',
    description: 'Chơi game 1 đến 50 online: chạm các con số theo thứ tự nhanh nhất có thể và phá kỷ lục của bạn tới 0,01 giây. Chế độ cổ điển hoặc nhanh 1 đến 25. Miễn phí, không cần tải.',
    ogTitle: 'Game 1 đến 50 🔢 Bạn chạm từ 1 đến 50 mất bao lâu?',
    ogDescription: 'Tìm số tiếp theo và chạm theo thứ tự đến hết. Bài thử nhanh cho sự tập trung và tốc độ ngón tay.',
  },
  siteName: 'Game 1 đến 50',
  privacyLink: 'Chính sách quyền riêng tư',
  start: {
    badge: '🔢 Chạm số · đo tốc độ',
    h1Kicker: 'Game 1 đến 50',
    h1Html: 'Chạm từ 1 đến 50<br><em>nhanh</em> nhất có thể',
    hook: 'Các con số nằm rải rác trên bảng. Tìm số tiếp theo, chạm vào và đi tiếp đến cuối. Mắt phải nhanh hơn ngón tay mới thắng.',
    how: { order: 'Chạm theo thứ tự từ 1', swap: 'Số mới hiện ra', penalty: 'Chạm sai +0,5 giây' },
    facts: 'Đếm ngược 3-2-1 · bấm giờ tới 0,01 giây',
    modeLabel: 'Chọn chế độ',
    modes: { classic: 'Cổ điển', quick: 'Nhanh' },
    start: 'Bắt đầu →',
  },
  play: {
    next: 'Số tiếp',
    time: 'Thời gian',
    progress: 'Đã chạm',
    go: 'GO!',
    boardAria: 'Bảng game 1 đến 50. Chạm các số theo thứ tự, bắt đầu từ 1.',
    paused: 'Tạm dừng · chạm để chơi tiếp',
    aBlank: 'Ô trống',
  },
  result: {
    done: 'Hoàn thành!',
    sec: 'giây',
    mistakesLabel: 'Chạm sai',
    perLabel: 'Mỗi số',
    best: 'Kỷ lục: {t}',
    newBest: 'Kỷ lục mới!',
    penNote: 'Đã gồm +{s} giây vì chạm sai',
    top: 'Top {n}%',
    beat: 'Nhanh hơn {pct}% người chơi',
    beatAll: 'Nhanh hơn mọi thành tích khác đến giờ',
    others: 'So với {n} thành tích khác',
    comparing: 'Đang so với người chơi khác…',
    retry: 'Chơi lại',
    shareTitle: 'Game 1 đến 50 – bạn nhanh cỡ nào?',
    shareText: 'Mình chạm từ 1 đến {max} trong {time} giây 🔢 Bạn có nhanh hơn không?',
  },
  og: {
    brand: '🔢 Game 1 đến 50',
    defaultKicker: 'Game tốc độ miễn phí',
    defaultTitle: 'Chạm 1 đến 50 mất mấy giây?',
    defaultDesc: 'Tìm số tiếp theo · đua với đồng hồ',
  },
  faq: [
    {
      q: 'Chơi game 1 đến 50 như thế nào?',
      a: 'Sau khi đếm ngược 3-2-1, bảng 5×5 hiện các số từ 1 đến 25 ở vị trí ngẫu nhiên. Chạm 1, rồi 2, rồi 3 và cứ thế. Ở chế độ Cổ điển, mỗi ô vừa chạm sẽ hiện một số mới từ 26 đến 50, bạn chơi tiếp đến 50.',
    },
    {
      q: 'Chạm nhầm số thì sao?',
      a: 'Ô sẽ rung và thời gian bị cộng thêm 0,5 giây, nên bấm bừa không có lợi. Chạm vào ô trống thì không có gì xảy ra. Màn hình kết quả cho biết bạn đã chạm sai bao nhiêu lần.',
    },
    {
      q: 'Cổ điển và Nhanh khác nhau thế nào?',
      a: 'Cổ điển đi từ 1 đến 50, là cách phổ biến để so thời gian. Nhanh dừng ở 25 và ô đã chạm sẽ để trống, rất hợp để khởi động và giống bảng Schulte.',
    },
    {
      q: 'Con số “Top %” lấy từ đâu?',
      a: 'Khi hoàn thành, chế độ và thời gian đã làm tròn của bạn được so với thời gian thật của những người chơi khác cùng chế độ. Nếu chưa có thời gian nào để so, phần này sẽ không hiện.',
    },
  ],
  privacy: {
    "title": "Chính sách quyền riêng tư | Game 1 đến 50",
    "description": "Chính sách quyền riêng tư của Game 1 đến 50: thời gian ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Game 1 đến 50 (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi bạn chơi xong một ván, chỉ chế độ và thời gian hoàn thành (làm tròn tới 0,1 giây) được gửi đến máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ, như mô tả dưới đây."
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
        "Chính sách này có hiệu lực từ ngày 14 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Game 1 đến 50"
  },
};
