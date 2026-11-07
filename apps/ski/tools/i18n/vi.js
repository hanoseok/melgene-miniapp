/* Ski Downhill — vi (Trò chơi trượt tuyết)
 * Luật chơi nằm trong ski-core.js; tệp này chỉ chứa chữ hiển thị. Khóa kết thúc bằng Html là HTML (chỉ <br> và <em>); privacy.sections cũng là HTML.
 * Giữ nguyên các chỗ thay thế {n} {pct} {s} {c} {tier}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trò chơi trượt tuyết – Đổ dốc slalom",
    "description": "Trò chơi trượt tuyết online: lao xuống con dốc tuyết bất tận, né cây thông, tảng đá và người tuyết, luồn qua cổng cờ slalom để cộng mét thưởng. Chơi trên điện thoại hoặc PC.",
    "ogTitle": "Trượt tuyết ⛷️ Bạn trượt được bao xa trước khi ngã?",
    "ogDescription": "Lao xuống con dốc bất tận, luồn qua cổng cờ và né cây thông. Va một lần là hết lượt!"
  },
  "siteName": "Trượt tuyết",
  "privacyLink": "Chính sách riêng tư",
  "start": {
    "badge": "⛷️ Tuyết mới, dốc trượt bất tận",
    "h1Kicker": "Trò chơi trượt tuyết",
    "h1Html": "Lao xuống núi tuyết<br><em>xa nhất có thể</em>",
    "hook": "Con dốc không bao giờ hết và ván trượt ngày càng nhanh. Lách qua cây thông và cờ, xem bạn trượt được bao nhiêu mét trước khi ngã.",
    "how": {
      "steer": "Giữ trái hoặc phải để rẽ",
      "gates": "Qua giữa cờ để thưởng",
      "avoid": "Né cây, đá, người tuyết"
    },
    "start": "Xuất phát →",
    "facts": "Giữ màn hình hoặc phím ← → · điện thoại hay PC · phá kỷ lục"
  },
  "play": {
    "dist": "Quãng đường",
    "best": "Kỷ lục",
    "pause": "Tạm dừng",
    "paused": "Tạm dừng",
    "resume": "Trượt tiếp",
    "hint": "Chạm để xuất phát",
    "fieldAria": "Dốc trượt: giữ nửa trái hoặc nửa phải để rẽ sang bên đó",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Trượt cổng"
  },
  "result": {
    "over": "Lượt trượt của bạn",
    "unit": "m",
    "newBest": "Kỷ lục mới!",
    "best": "Kỷ lục của bạn: {n} m",
    "gates": "Cổng đã qua",
    "time": "Thời gian",
    "timeValue": "{s} giây",
    "tierLabel": "Trình độ trượt tuyết",
    "tiers": [
      "🧊 Dốc tập trượt",
      "🟢 Dốc xanh lá",
      "🔵 Dốc xanh dương",
      "⚫ Dốc kim cương đen",
      "⚡ Tay đua tốc độ",
      "🏆 Huyền thoại núi tuyết"
    ],
    "top": "Top {n}%",
    "beat": "Xa hơn {pct}% người chơi",
    "beatAll": "Xa hơn mọi người chơi khác tới giờ",
    "others": "So với {n} lượt khác",
    "comparing": "Đang so với người chơi khác…",
    "shareTitle": "Trò chơi trượt tuyết",
    "shareText": "Mình vừa trượt {n} m xuống núi ⛷️ {tier}. Bạn đi được bao xa?",
    "retry": "Trượt lại"
  },
  "og": {
    "brand": "⛷️ Trượt tuyết",
    "defaultKicker": "Trò chơi trượt tuyết online",
    "defaultTitle": "Bạn trượt được bao xa trước khi ngã?",
    "defaultDesc": "Dốc bất tận · cổng slalom · điện thoại hoặc PC"
  },
  "faq": [
    {
      "q": "Điều khiển người trượt thế nào?",
      "a": "Dùng ngón tay hoặc chuột giữ nửa trái hay nửa phải của dốc, hoặc giữ phím ← → (hay A / D). Người trượt sẽ nghiêng và lướt nhẹ nhàng sang bên đó; thả ra để trượt thẳng. Lượt chơi bắt đầu từ lần chạm hoặc bấm phím đầu tiên."
    },
    {
      "q": "Những lá cờ dùng để làm gì?",
      "a": "Hai lá cờ cùng màu tạo thành một cổng. Đi qua giữa hai cờ để được cộng mét thưởng, qua liên tiếp nhiều cổng thì combo tăng và tiền thưởng càng lớn. Bỏ lỡ cổng không làm hết lượt nhưng combo sẽ về 0."
    },
    {
      "q": "Quãng đường được tính thế nào?",
      "a": "Số mét bạn trượt xuống cộng với mét thưởng từ cổng cờ. Càng đi xa tốc độ càng nhanh, và lượt chơi kết thúc ngay khi bạn va vào cây, đá hay người tuyết. Kỷ lục được lưu trong trình duyệt này."
    },
    {
      "q": "Chuyển sang tab khác thì sao?",
      "a": "Trò chơi tự tạm dừng khi bạn rời trang hoặc khóa màn hình điện thoại. Bấm “Trượt tiếp” (hoặc phím P) để chơi tiếp đúng chỗ đã dừng."
    }
  ],
  "privacy": {
    "title": "Chính sách riêng tư | Trò chơi trượt tuyết",
    "description": "Chính sách riêng tư của trò chơi trượt tuyết: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách riêng tư",
    "introHtml": "Trò chơi trượt tuyết (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc một lượt, chỉ quãng đường (mét) của bạn được gửi về máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động trong lúc sử dụng, như mô tả dưới đây."
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
        "Chính sách này có hiệu lực từ ngày 8 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại trò chơi trượt tuyết"
  }
};
