/* Đoán số (Bulls and Cows) (숫자 야구 / number baseball) — vi
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Baloo 2'",
    "displayWeight": 700,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Đoán số (Bulls and Cows) – trò chơi đoán mật mã số",
    "description": "Chơi Đoán số (Bulls and Cows) miễn phí: đoán số bí mật 3 hoặc 4 chữ số qua gợi ý đúng vị trí, sai vị trí, trượt. Có kỷ lục từng cấp độ, không cần cài đặt.",
    "ogTitle": "Đoán số (Bulls and Cows) ⚾ Bạn có phá được mật mã không?",
    "ogDescription": "Một số bí mật không có chữ số lặp. Đoán, đọc gợi ý và tìm ra nó với ít lượt nhất."
  },
  "siteName": "Đoán số (Bulls and Cows)",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "⚾ Đoán số Bulls and Cows",
    "h1Kicker": "Đoán số (Bulls and Cows)",
    "h1Html": "Giải mã con số<br><em>bí mật</em>",
    "hook": "Máy tính đã chọn một số bí mật không có chữ số lặp. Hãy đoán, đọc gợi ý đúng hay sai vị trí rồi suy ra mật mã.",
    "how": "Đúng vị trí = đúng số, đúng chỗ · Sai vị trí = đúng số, sai chỗ · Trượt = không khớp",
    "levelLabel": "Chọn số chữ số",
    "levels": {
      "d3": "3 chữ số",
      "d4": "4 chữ số"
    },
    "levelSub": {
      "d3": "Cổ điển",
      "d4": "Khó hơn"
    },
    "timer": "Hiện đồng hồ",
    "start": "Bắt đầu →"
  },
  "play": {
    "tries": "Lượt",
    "time": "Thời gian",
    "slotAria": "Chữ số {n}",
    "enter": "Đoán",
    "del": "Xóa",
    "giveUp": "Bỏ cuộc",
    "giveUpSure": "Chạm lần nữa để xem đáp án",
    "historyTitle": "Các lần đoán",
    "historyEmpty": "Nhập một số để đoán lần đầu.",
    "errLen": "Hãy nhập {n} chữ số",
    "errDup": "Các chữ số không được lặp",
    "errAgain": "Bạn đã thử số này rồi",
    "strike": "Đúng vị trí",
    "ball": "Sai vị trí",
    "out": "Trượt",
    "legend": "Đúng vị trí: đúng số, đúng chỗ · Sai vị trí: đúng số, sai chỗ"
  },
  "result": {
    "done": "Đoán đúng rồi!",
    "gaveUp": "Đáp án là",
    "triesCaption": "Số lượt",
    "timeLabel": "Thời gian",
    "secretLabel": "Số bí mật",
    "sec": "giây",
    "best": "Kỷ lục cấp độ này: {n}",
    "newBest": "Kỷ lục cá nhân mới!",
    "top": "Top {n}%",
    "beat": "Ít lượt hơn {pct}% người chơi",
    "beatAll": "Ít lượt hơn mọi kết quả từ trước đến nay",
    "others": "So với {n} kết quả khác ở cấp độ này",
    "comparing": "Đang so sánh với người chơi khác…",
    "retry": "Chơi lại",
    "shareTitle": "Đoán số – bạn có phá được mật mã không?",
    "shareText": "Mình đoán đúng số {d} chữ số sau {n} lượt ⚾ Bạn đoán được ít lượt hơn không?"
  },
  "og": {
    "brand": "⚾ Đoán số",
    "defaultKicker": "Trò chơi đoán số miễn phí",
    "defaultTitle": "Bạn có phá được mật mã không?",
    "defaultDesc": "Đúng vị trí · Sai vị trí · Trượt"
  },
  "faq": [
    {
      "q": "Chơi Đoán số (Bulls and Cows) như thế nào?",
      "a": "Máy tính chọn một số bí mật có các chữ số đều khác nhau. Bạn nhập số cùng độ dài, cũng không lặp chữ số, rồi bấm Đoán. Chữ số đúng chỗ là “Đúng vị trí”, đúng số nhưng sai chỗ là “Sai vị trí”, không khớp gì là “Trượt”. Khi mọi chữ số đều đúng vị trí là bạn thắng."
    },
    {
      "q": "Số bí mật có thể bắt đầu bằng 0 không? Chữ số có lặp không?",
      "a": "Có thể bắt đầu bằng 0, ví dụ 072, nhưng một chữ số không xuất hiện hai lần. Số bạn đoán cũng không được lặp chữ số. Số đã thử rồi sẽ không tính lại, chỉ những lần đoán mới mới làm tăng số lượt."
    },
    {
      "q": "Có nút gợi ý hay giới hạn số lượt không?",
      "a": "Không có gợi ý và không giới hạn. Đây là trò suy luận thuần túy, càng ít lượt càng tốt. Nếu bí quá, bấm Bỏ cuộc để xem đáp án rồi chơi ván mới. Đồng hồ là tùy chọn và chỉ hiện khi bạn bật."
    },
    {
      "q": "3 chữ số và 4 chữ số khác nhau thế nào?",
      "a": "Với 3 chữ số có 720 số bí mật có thể, với 4 chữ số nhiều hơn rất nhiều, và mỗi số có khả năng như nhau. Kỷ lục của bạn được lưu riêng cho từng cấp độ trong trình duyệt này."
    },
    {
      "q": "Con số “Top %” lấy từ đâu?",
      "a": "Khi bạn đoán đúng, số lượt của bạn được so với kết quả thật của những người chơi khác ở cùng cấp độ. Nếu chưa có kết quả nào khác để so, phần này sẽ không hiện. Ván bỏ cuộc không được tính."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Đoán số",
    "description": "Chính sách quyền riêng tư của trò chơi Đoán số (Bulls and Cows): kết quả ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Đoán số (Bulls and Cows) (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi bạn đoán đúng một ván, chỉ cấp độ và số lượt được gửi lên máy chủ dưới dạng số liệu ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động trong khi bạn sử dụng Dịch vụ, như mô tả dưới đây."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi lựa chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, ván bắt đầu và hoàn thành, đánh giá sao). Không thông tin nào trong số này nhận dạng được cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 18 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Đoán số"
  }
};
