/* Ice Fishing — vi (Câu cá trên băng)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Game câu cá trên băng – Câu cá mùa đông",
    "description": "Game câu cá trên băng miễn phí: thả dây câu qua lỗ băng, chờ cá cắn câu rồi kéo lên thật khéo để dây không đứt. Mỗi lượt 60 giây, chơi trên điện thoại hoặc máy tính.",
    "ogTitle": "Câu cá trên băng 🎣 60 giây bạn câu được mấy con?",
    "ogDescription": "Thả dây qua lỗ băng, chờ cá cắn rồi kéo lên từ từ. Kéo mạnh quá là đứt dây đấy."
  },
  "siteName": "Câu cá trên băng",
  "privacyLink": "Chính sách riêng tư",
  "start": {
    "badge": "🎣 Hồ đóng băng và một lỗ nhỏ",
    "h1Kicker": "Game câu cá trên băng",
    "h1Html": "Thả dây xuống<br><em>kéo cá lên</em>",
    "hook": "Có gì đó đang bơi dưới lớp băng. Thả lưỡi câu tới độ sâu vừa phải, chờ cá giật rồi nhẹ nhàng kéo lên trước khi dây đứt.",
    "how": {
      "lower": "Giữ để thả lưỡi câu",
      "reel": "Cá cắn? Giữ để kéo",
      "red": "Vạch đỏ thì buông tay"
    },
    "start": "Bắt đầu câu →",
    "facts": "Mỗi lượt 60 giây · điện thoại hoặc máy tính · phá kỷ lục"
  },
  "play": {
    "score": "Điểm",
    "time": "Thời gian",
    "secUnit": "s",
    "pause": "Tạm dừng",
    "paused": "Đang tạm dừng",
    "resume": "Câu tiếp",
    "hint": "Giữ dưới lớp băng để thả dây câu",
    "fieldAria": "Hồ đóng băng: giữ ở độ sâu muốn thả lưỡi câu, khi cá cắn thì giữ để kéo dây",
    "bite": "Cá cắn rồi!",
    "catchPop": "{fish} +{n}",
    "snap": "Đứt dây rồi!",
    "escape": "Cá sổng mất",
    "timeUp": "Hết giờ!"
  },
  "fish": {
    "minnow": "Cá mương",
    "perch": "Cá rô",
    "trout": "Cá hồi",
    "pike": "Cá chó",
    "golden": "Cá hoàng kim",
    "boot": "Ủng cũ"
  },
  "result": {
    "over": "Thành quả của bạn",
    "unit": "điểm",
    "newBest": "Kỷ lục mới của bạn!",
    "best": "Kỷ lục: {n} điểm",
    "caught": "Cá câu được",
    "snapped": "Lần đứt dây",
    "bestCatch": "Mẻ lớn nhất: {fish}",
    "noCatch": "Lần này chưa câu được con nào",
    "tierLabel": "Cấp độ cần thủ",
    "tiers": [
      "🧊 Tay cóng lạnh",
      "🪝 Học việc khoan băng",
      "🐟 Cần thủ kiên nhẫn",
      "🎣 Khách quen mặt hồ",
      "⭐ Người hiểu cá",
      "🏆 Huyền thoại hồ băng"
    ],
    "top": "Top {n}%",
    "beat": "Hơn {pct}% cần thủ",
    "beatAll": "Hơn mọi cần thủ cho tới giờ",
    "others": "So với {n} lượt chơi khác",
    "comparing": "Đang so với các cần thủ khác…",
    "shareTitle": "Câu cá trên băng",
    "shareText": "Mình câu được {n} điểm trong 60 giây câu cá trên băng 🎣 {tier}. Bạn hơn được không?",
    "retry": "Câu lại"
  },
  "og": {
    "brand": "🎣 Câu cá trên băng",
    "defaultKicker": "Game câu cá trên băng",
    "defaultTitle": "60 giây bạn câu được mấy con?",
    "defaultDesc": "Thả dây · cá cắn · đừng để đứt dây"
  },
  "faq": [
    {
      "q": "Thả dây câu thế nào?",
      "a": "Nhấn giữ ở bất kỳ chỗ nào trong nước dưới lớp băng, lưỡi câu sẽ di chuyển tới độ sâu đó và dừng lại khi bạn buông tay. Trên máy tính có thể giữ phím ↓ và ↑. Mỗi loại cá thích một độ sâu khác nhau, hãy thử vài tầng."
    },
    {
      "q": "Kéo cá lên thế nào?",
      "a": "Khi cá cắn câu, nhấn giữ để cuộn dây. Thanh lực căng bên phải sẽ tăng lên. Khi thanh chạm vùng đỏ, buông tay một chút cho dây chùng rồi giữ tiếp. Thanh đầy là đứt dây; để dây chùng quá lâu thì cá sẽ tuột mất."
    },
    {
      "q": "Vì sao mỗi con cá có điểm khác nhau?",
      "a": "Cá càng to, sống càng sâu thì càng khỏe và càng nhiều điểm; con cá hoàng kim hiếm gặp có điểm cao nhất. Rác như chiếc ủng cũ kéo lên rất dễ nhưng được 0 điểm. Kỷ lục được lưu trong trình duyệt này."
    },
    {
      "q": "Chuyển sang tab khác thì sao?",
      "a": "Khi bạn rời trang hoặc khóa màn hình, lượt chơi tự tạm dừng và đồng hồ cũng dừng. Bấm Câu tiếp (hoặc phím P) để chơi tiếp từ chỗ cũ."
    }
  ],
  "privacy": {
    "title": "Chính sách riêng tư | Trò chơi câu cá trên băng",
    "description": "Chính sách riêng tư của trò chơi câu cá trên băng: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách riêng tư",
    "introHtml": "Trò chơi câu cá trên băng (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
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
        "Chính sách này có hiệu lực từ ngày 10 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại trò chơi câu cá trên băng"
  }
};
