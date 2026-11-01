/* Thử thách 10 giây — vi (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "Thử thách 10 giây – Dừng đồng hồ đúng 10,00 giây",
    "description": "Thử thách 10 giây: bấm đồng hồ bấm giờ rồi dừng đúng 10,00 giây chỉ bằng cảm giác. 3 lượt, chế độ che số, mục tiêu 5 hoặc 30 giây. Miễn phí, không cần tải.",
    "ogTitle": "Thử thách 10 giây ⏱️ Bạn dừng đúng 10,00 được không?",
    "ogDescription": "Đếm thầm trong đầu và bấm dừng đúng lúc. 3 lượt, ở chế độ che số các con số sẽ biến mất."
  },
  "siteName": "Thử thách 10 giây",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "⏱️ Bạn cảm được 10 giây không?",
    "h1Kicker": "Thử thách 10 giây",
    "h1Html": "Dừng đồng hồ<br><em>đúng 10,00 giây</em>",
    "hook": "Bấm chạy đồng hồ, đếm thầm trong đầu rồi dừng đúng khoảnh khắc. Có 3 lượt, chỉ tính lượt gần nhất.",
    "targetLabel": "Thời gian mục tiêu",
    "targetValue": "{n} giây",
    "blindLabel": "Chế độ che số",
    "blindDesc": "Các con số biến mất sau 3 giây",
    "how": "Bắt đầu rồi STOP · chạm bất kỳ đâu hoặc nhấn Space",
    "start": "Chơi ngay →",
    "facts": "3 lượt · 5, 10 hoặc 30 giây · phá kỷ lục của bạn"
  },
  "play": {
    "target": "Mục tiêu {t}",
    "blindTag": "Che số",
    "attempt": "Lượt {n}/{total}",
    "go": "Bắt đầu",
    "stop": "STOP",
    "next": "Lượt tiếp",
    "finish": "Xem kết quả",
    "readyHint": "Bấm Bắt đầu rồi dừng đúng {t}",
    "runHint": "Chạm bất kỳ đâu hoặc nhấn Space để dừng",
    "early": "Sớm {n}",
    "late": "Trễ {n}",
    "perfect": "Hoàn hảo! Đúng {t} 🎉",
    "cancelled": "Bạn đã rời trang nên lượt này không tính. Thử lại nhé!",
    "hidden": "??:??.??",
    "change": "← Đổi chế độ",
    "clockAria": "Đồng hồ bấm giờ",
    "sec": "{n} giây"
  },
  "result": {
    "over": "Kết quả của bạn",
    "mode": "Mục tiêu {t}",
    "perfect": "Đúng {t}! Dừng hoàn hảo 🎉",
    "bestLabel": "Lượt gần nhất, lệch",
    "stoppedAt": "Dừng ở {time}",
    "tierLabel": "Đồng hồ sinh học của bạn",
    "tiers": [
      "🐌 Lạc mất thời gian",
      "⏳ Cũng tàm tạm",
      "🙂 Cảm giác khá tốt",
      "🎯 Canh giờ chuẩn",
      "⚡ Cao thủ tích tắc",
      "🧠 Đồng hồ người"
    ],
    "newBest": "Kỷ lục mới!",
    "pb": "Kỷ lục của bạn ở chế độ này: {n}",
    "avg": "Độ lệch trung bình",
    "listLabel": "3 lượt của bạn",
    "top": "Top {n}%",
    "beat": "Chính xác hơn {pct}% người chơi",
    "beatAll": "Chính xác hơn mọi người chơi khác tới giờ",
    "others": "So với {n} lượt chơi khác ở chế độ này",
    "comparing": "Đang so sánh với người chơi khác…",
    "shareTitle": "Thử thách 10 giây",
    "shareText": "Mình dừng đồng hồ chỉ lệch {n} so với {t} ⏱️ {tier}. Bạn dừng chuẩn hơn không?",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "⏱️ Thử thách 10 giây",
    "defaultKicker": "Game canh giờ miễn phí",
    "defaultTitle": "Bạn dừng đồng hồ đúng 10,00 được không?",
    "defaultDesc": "3 lượt · chế độ che số · 5, 10 hoặc 30 giây"
  },
  "faq": [
    {
      "q": "Chơi thế nào?",
      "a": "Chọn thời gian mục tiêu (5, 10 hoặc 30 giây) rồi bấm Bắt đầu. Đồng hồ chạy ngay khi bạn chạm. Đếm thầm trong đầu, khi nghĩ đã đến lúc thì bấm STOP, chạm bất kỳ đâu trên màn hình chơi hoặc nhấn Space. Mỗi ván có 3 lượt, lượt gần nhất là kết quả của bạn."
    },
    {
      "q": "Chế độ che số là gì?",
      "a": "Ở chế độ che số, sau 3 giây đầu các con số biến thành dấu hỏi và bạn phải đếm tiếp hoàn toàn bằng cảm giác. Khó hơn nhiều, và chế độ này có kỷ lục riêng cùng phần so sánh riêng với người chơi khác."
    },
    {
      "q": "Sao dừng đúng 10,00 lại khó vậy?",
      "a": "Ngón tay cần một chút thời gian để phản ứng, và nhịp đếm trong đầu cũng lệch dần trong mười giây, nên dù dừng khéo vẫn sớm hoặc trễ vài phần trăm giây. Đồng hồ lấy đúng thời điểm bạn chạm và hiển thị tới phần trăm giây như đồng hồ bấm giờ thật. Dừng đúng 10,00 rất hiếm, chính vì thế mới vui."
    },
    {
      "q": "Sao lượt của tôi không được tính?",
      "a": "Nếu bạn chuyển tab, khóa màn hình hoặc rời trang khi đồng hồ đang chạy, lượt đó sẽ bị hủy để công bằng. Chỉ cần bắt đầu lại đúng lượt đó."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Thử thách 10 giây",
    "description": "Chính sách bảo mật của Thử thách 10 giây: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Thử thách 10 giây (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc một lượt chơi, chỉ điểm số (độ lệch tính bằng mili giây của lượt chính xác nhất) được gửi lên máy chủ dưới dạng đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Tìm hiểu thêm và thay đổi lựa chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng theo ngày cho từng ngôn ngữ (lượt xem trang, lượt chơi bắt đầu và kết thúc, đánh giá sao). Không dữ liệu nào nhận dạng cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ người quản lý trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 2 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Thử thách 10 giây"
  }
};
