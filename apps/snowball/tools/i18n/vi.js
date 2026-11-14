/* Snowball Fight — vi (Ném tuyết)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Baloo 2'",
    "displayWeight": 800,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trò chơi ném tuyết – ném, nấp, trúng đích",
    "description": "Trò chơi ném tuyết miễn phí: ném trúng những bạn nhỏ ló đầu sau pháo đài tuyết và cúi nấp sau bức tường khi quả cầu tuyết bay tới. Mỗi lượt 60 giây.",
    "ogTitle": "Ném tuyết ☃️ 60 giây bạn ném trúng được mấy lần?",
    "ogDescription": "Ném thật nhanh, nấp đúng lúc và đừng ném trúng cún. 3 trái tim, một phút."
  },
  "siteName": "Ném tuyết",
  "privacyLink": "Chính sách riêng tư",
  "start": {
    "badge": "☃️ Tuyết mới rơi, túi đầy cầu tuyết",
    "h1Kicker": "Trò chơi ném tuyết",
    "h1Html": "Ló đầu là ném<br><em>bay tới thì nấp</em>",
    "hook": "Bên kia sân, lũ trẻ đang nấp sau pháo đài tuyết. Ném trúng khi chúng ló đầu ra, và cúi xuống thật nhanh khi có đứa vung tay định ném lại.",
    "how": {
      "throw": "Chạm bạn nhỏ để ném",
      "duck": "Thấy ❗ thì giữ Nấp",
      "avoid": "Đừng ném bạn bè"
    },
    "start": "Bắt đầu ném tuyết →",
    "facts": "Mỗi lượt 60 giây · 3 trái tim · điện thoại hoặc máy tính"
  },
  "play": {
    "score": "Điểm",
    "time": "Thời gian",
    "lives": "Tim",
    "secUnit": "s",
    "pause": "Tạm dừng",
    "paused": "Tạm dừng",
    "resume": "Quay lại trận đấu",
    "hint": "Chạm vào sân để bắt đầu",
    "fieldAria": "Sân tuyết: chạm vào bạn nhỏ để ném cầu tuyết, giữ bức tường hoặc nút Nấp để trốn",
    "duck": "Nấp (giữ)",
    "duckAria": "Cúi nấp sau tường khi đang giữ",
    "combo": "Combo ×{n}",
    "golden": "Vàng! +{n}",
    "oops": "Bạn bè đó! −{n}",
    "miss": "Trượt",
    "block": "Chặn được!",
    "ouch": "Ối!",
    "timeUp": "Hết giờ!",
    "out": "Bị vùi trong tuyết!"
  },
  "result": {
    "over": "Trận đấu kết thúc",
    "reasonTime": "Bạn trụ được trọn một phút",
    "reasonOut": "Trúng ba lần, bị loại",
    "unit": "điểm",
    "newBest": "Kỷ lục mới!",
    "best": "Kỷ lục của bạn: {n} điểm",
    "hits": "Ném trúng",
    "accuracy": "Độ chính xác",
    "bestCombo": "Combo cao nhất",
    "tierLabel": "Hạng ném tuyết của bạn",
    "tiers": [
      "🧤 Tay cóng",
      "❄️ Tân binh tuyết",
      "⛄ Khách quen của sân",
      "🎯 Tay ném cừ khôi",
      "⭐ Chiến binh pháo đài",
      "🏆 Huyền thoại tuyết"
    ],
    "top": "Top {n}%",
    "beat": "Hơn {pct}% người chơi",
    "beatAll": "Hơn tất cả người chơi khác đến giờ",
    "others": "So với {n} lượt chơi khác",
    "comparing": "Đang so sánh với người chơi khác…",
    "shareTitle": "Trò chơi ném tuyết",
    "shareText": "Mình được {n} điểm trong 60 giây ném tuyết ☃️ {tier}. Bạn có vượt được không?",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "☃️ Ném tuyết",
    "defaultKicker": "Trò chơi ném tuyết online",
    "defaultTitle": "60 giây ném trúng được mấy lần?",
    "defaultDesc": "Ném · nấp · đừng ném trúng cún"
  },
  "faq": [
    {
      "q": "Ném và nấp thế nào?",
      "a": "Chạm (hoặc bấm chuột) vào bạn nhỏ đang ló đầu sau pháo đài tuyết, quả cầu tuyết sẽ bay tới đó. Muốn trốn thì giữ nút Nấp hoặc bức tường tuyết phía dưới. Khi đang nấp thì không ném được. Trên máy tính, dùng ← và → để chọn pháo đài, ↑ hoặc F để ném, giữ phím cách hoặc ↓ để nấp."
    },
    {
      "q": "Làm sao biết có cầu tuyết bay tới?",
      "a": "Bạn nhỏ sắp ném sẽ giơ tay lên và trên đầu hiện dấu ❗ màu đỏ. Ném trúng trước thì bạn ấy không ném được nữa. Nếu quả cầu đã bay, một dấu ❗ lớn hiện trên bức tường của bạn và nút Nấp chuyển đỏ, hãy giữ cho tới khi quả cầu rơi xuống."
    },
    {
      "q": "Điểm được tính thế nào?",
      "a": "Mỗi lần ném trúng được điểm, người tuyết được nhiều hơn bạn nhỏ một chút. Ném trúng liên tiếp sẽ tạo combo làm mỗi cú ném đáng giá hơn, còn ném trượt thì combo về 0. Người tuyết vàng hiếm hoi cho nhiều điểm nhất. Chú cún và bạn nhỏ vẫy cờ trắng là bạn bè, ném trúng sẽ bị trừ điểm."
    },
    {
      "q": "Khi nào một lượt kết thúc?",
      "a": "Mỗi lượt dài 60 giây, hoặc kết thúc sớm nếu bạn bị ném trúng ba lần. Càng về cuối càng dồn dập. Lượt chơi tự tạm dừng khi bạn chuyển thẻ hoặc khóa màn hình."
    }
  ],
  "privacy": {
    "title": "Chính sách riêng tư | Trò chơi ném tuyết",
    "description": "Chính sách riêng tư của trò chơi ném tuyết: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách riêng tư",
    "introHtml": "Trò chơi ném tuyết (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc một lượt, chỉ điểm số của bạn được gửi về máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động trong lúc sử dụng, như mô tả dưới đây."
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
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, lượt chơi bắt đầu và kết thúc, đánh giá sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 14 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại trò chơi ném tuyết"
  }
};
