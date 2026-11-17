/* Reindeer Jump — vi (Tuần lộc nhảy)
 * Rules live in reindeer-core.js; this file holds every visible string (same keys as en.js).
 * Placeholders: {n} {pct} {tier} — keep them as-is.
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
    "title": "Game tuần lộc nhảy – chạy vô tận trên mái nhà",
    "description": "Tuần lộc nhảy là game chạy vô tận một nút miễn phí: phóng qua những mái nhà phủ tuyết trong đêm, nhảy qua ống khói và quạ, nhảy đôi qua khe hở và nhặt quà.",
    "ogTitle": "Tuần lộc nhảy 🦌 Bạn chạy được bao xa trên mái nhà?",
    "ogDescription": "Chạm để nhảy, giữ để nhảy cao hơn, chạm thêm lần nữa giữa không trung để nhảy đôi. Đừng rơi xuống khe giữa hai mái nhà!"
  },
  "siteName": "Tuần lộc nhảy",
  "privacyLink": "Chính sách riêng tư",
  "start": {
    "badge": "🦌 Mái nhà tuyết, đêm đầy sao",
    "h1Kicker": "Game tuần lộc nhảy",
    "h1Html": "Nhảy qua mái nhà,<br><em>đừng nhìn xuống!</em>",
    "hook": "Đêm nay có người phải băng qua cả thị trấn. Nhảy từ mái nhà này sang mái nhà khác, vượt ống khói và lũ quạ, nhặt hết quà trên đường.",
    "how": {
      "tap": "Chạm để nhảy",
      "hold": "Giữ để nhảy cao",
      "air": "Chạm lại trên không"
    },
    "start": "Bắt đầu chạy →",
    "facts": "Chạy vô tận · 3 tim · điện thoại hoặc PC"
  },
  "play": {
    "score": "Điểm",
    "dist": "Đã đi",
    "lives": "Tim",
    "mUnit": "m",
    "pause": "Tạm dừng",
    "paused": "Tạm dừng",
    "resume": "Chạy tiếp",
    "hint": "Chạm để bắt đầu chạy",
    "fieldAria": "Mái nhà tuyết: chạm màn hình hoặc nhấn Space để nhảy, giữ để nhảy cao hơn, chạm lại khi đang trên không để nhảy đôi",
    "bell": "Chuông! +{n}",
    "ouch": "Ui da!",
    "fall": "Ối!",
    "crash": "Hết tim rồi!"
  },
  "result": {
    "over": "Kết thúc",
    "reasonFall": "Bạn trượt xuống khe giữa hai mái nhà",
    "reasonCrash": "Va chạm ba lần, hết tim rồi",
    "unit": "điểm",
    "newBest": "Kỷ lục mới của bạn!",
    "best": "Kỷ lục của bạn: {n} điểm",
    "distance": "Quãng đường",
    "presents": "Quà",
    "bells": "Chuông",
    "tierLabel": "Hạng chạy trên mái nhà",
    "tiers": [
      "🧦 Cú nhảy đầu",
      "❄️ Tay nhảy ống khói",
      "🦌 Chạy bền bỉ",
      "🌙 Kẻ lướt đêm",
      "⭐ Ngôi sao mái nhà",
      "🏆 Vô địch bầu trời"
    ],
    "top": "Top {n}%",
    "beat": "Hơn {pct}% người chơi",
    "beatAll": "Hơn mọi người chơi khác cho đến giờ",
    "others": "So với {n} lượt chơi khác",
    "comparing": "Đang so sánh với người chơi khác…",
    "shareTitle": "Tuần lộc nhảy",
    "shareText": "Mình được {n} điểm khi nhảy qua các mái nhà 🦌 {tier}. Bạn vượt được không?",
    "retry": "Chạy lại"
  },
  "og": {
    "brand": "🦌 Tuần lộc nhảy",
    "defaultKicker": "Game chạy trên mái nhà một nút",
    "defaultTitle": "Bạn chạy được bao xa trên mái nhà?",
    "defaultDesc": "Chạm để nhảy · giữ để cao hơn · nhảy đôi"
  },
  "faq": [
    {
      "q": "Làm sao để nhảy cao hơn?",
      "a": "Giữ càng lâu nhảy càng cao: cứ giữ ngón tay (hoặc Space, ↑ hay nút chuột) khi tuần lộc đang bay lên thì nó sẽ lên tiếp; thả sớm thì chỉ là một cú nhảy thấp. Khi đang trên không, chạm thêm một lần để nhảy đôi."
    },
    {
      "q": "Khi nào thì kết thúc?",
      "a": "Rơi xuống khe giữa hai mái nhà là kết thúc ngay. Đụng ống khói, đống tuyết, khối băng hay con quạ sẽ mất một tim, sau đó tuần lộc nhấp nháy một lúc và không bị mất thêm tim. Mất cả ba tim cũng kết thúc."
    },
    {
      "q": "Mọi khe hở đều nhảy qua được thật chứ?",
      "a": "Đúng vậy. Mỗi khe hở và chướng ngại vật đều được tạo để chỉ một cú nhảy giữ lâu ở tốc độ hiện tại là qua được, và còn chỗ đáp trước cái tiếp theo. Nhảy đôi là phương án dự phòng khi bạn nhảy muộn."
    },
    {
      "q": "Điểm được tính thế nào?",
      "a": "Mỗi mét chạy được 1 điểm và tốc độ tăng dần khi bạn trụ lâu hơn. Quà được 10 điểm, chuông vàng hiếm hoi được 50 điểm. Trò chơi tự tạm dừng khi bạn chuyển tab hoặc khóa điện thoại."
    }
  ],
  "privacy": {
    "title": "Chính sách riêng tư | Trò chơi Tuần lộc nhảy",
    "description": "Chính sách riêng tư của trò chơi Tuần lộc nhảy: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách riêng tư",
    "introHtml": "Trò chơi Tuần lộc nhảy (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
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
        "Chính sách này có hiệu lực từ ngày 18 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại trò chơi tuần lộc nhảy"
  }
};
