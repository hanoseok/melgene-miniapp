/* Game xếp tháp — Tiếng Việt (/vi/)
 * Luật chơi và điểm nằm trong stack-core.js; tệp này chỉ chứa chữ hiển thị. Giữ nguyên {n} {pct}.
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
    "title": "Game xếp tháp – xếp khối chồng lên nhau miễn phí",
    "description": "Game xếp tháp: chạm để thả khối đang trượt qua lại và xếp tháp cao nhất có thể. Phần thừa ra ngoài sẽ bị cắt rơi. Chơi miễn phí ngay trên trình duyệt.",
    "ogTitle": "Game xếp tháp 🏗️ Bạn xếp được cao bao nhiêu?",
    "ogDescription": "Chạm thả từng khối đúng lúc. Lệch bao nhiêu bị cắt bấy nhiêu. Tháp của bạn cao được mấy tầng?"
  },
  "siteName": "Game xếp tháp",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "🏗️ Arcade một chạm",
    "h1Kicker": "Game xếp tháp",
    "h1Html": "Chạm, thả,<br><em>xếp cao hơn!</em>",
    "hook": "Một khối trượt qua trượt lại phía trên tháp. Thả nó đúng khoảnh khắc. Phần nào lòi ra ngoài mép sẽ mất luôn.",
    "how": {
      "tap": "Chạm để thả",
      "cut": "Phần thừa bị cắt",
      "perfect": "Đặt thật khớp"
    },
    "facts": "Nhanh dần · chỉ một chạm · phá kỷ lục",
    "start": "Bắt đầu xếp →"
  },
  "play": {
    "score": "Số tầng",
    "best": "Kỷ lục",
    "paused": "Tạm dừng",
    "resume": "Chơi tiếp",
    "hint": "Chạm để thả khối",
    "perfect": "Hoàn hảo!",
    "combo": "Liên tiếp ×{n}",
    "fieldAria": "Khu vực chơi. Chạm, nhấp chuột hoặc nhấn phím cách để thả khối đang trượt.",
    "pause": "Tạm dừng"
  },
  "result": {
    "over": "Trượt khỏi tháp rồi!",
    "blocks": "tầng",
    "perfects": "Lần hoàn hảo",
    "bestCombo": "Chuỗi hoàn hảo dài nhất",
    "shareTitle": "Game xếp tháp",
    "shareText": "Mình xếp được {n} tầng trong Game xếp tháp 🏗️ Bạn xếp cao hơn được không?",
    "best": "Kỷ lục: {n} tầng",
    "newBest": "Kỷ lục mới!",
    "top": "Top {n}%",
    "beat": "Cao hơn {pct}% người chơi",
    "beatAll": "Cao hơn mọi kỷ lục từ trước tới nay",
    "others": "So với {n} kỷ lục khác",
    "comparing": "Đang so với người chơi khác…",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "🏗️ Game xếp tháp",
    "defaultKicker": "Game xếp khối miễn phí, một chạm",
    "defaultTitle": "Tháp của bạn cao được bao nhiêu?",
    "defaultDesc": "Chạm để thả · phần thừa bị cắt · nhắm đến hoàn hảo"
  },
  "faq": [
    {
      "q": "Chơi thế nào?",
      "a": "Một khối trượt qua lại phía trên tháp. Chạm vào khu vực chơi, nhấp chuột hoặc nhấn phím cách để thả. Chỉ phần nằm trên khối bên dưới được giữ lại, phần thừa bị cắt nên khối tiếp theo hẹp hơn. Ván kết thúc khi một khối trượt hẳn ra ngoài tháp."
    },
    {
      "q": "Thả hoàn hảo là gì?",
      "a": "Nếu bạn thả khối gần như trùng khít với khối bên dưới, nó sẽ tự khớp vào và giữ nguyên kích thước. Thả hoàn hảo nhiều lần liên tiếp thì khối sẽ rộng ra từng chút, giúp bạn dễ thở hơn."
    },
    {
      "q": "Sao càng chơi càng khó?",
      "a": "Mỗi tầng xếp thêm, khối tiếp theo trượt nhanh hơn một chút (đến một tốc độ tối đa). Hãy bắt nhịp và chạm sớm hơn một chút trước khi khối tới đúng chỗ."
    },
    {
      "q": "Top % có thật không?",
      "a": "Có. Khi hết mỗi ván, chỉ số tầng bạn xếp được gửi ẩn danh lên máy chủ để so với mọi người. Top % chỉ hiện khi có kỷ lục thật để so sánh; nếu không thì không hiện gì."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Game xếp tháp",
    "description": "Chính sách bảo mật của Game xếp tháp: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Game xếp tháp (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Khi hết một ván, chỉ điểm của bạn (số tầng đã xếp) được gửi lên máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động khi bạn sử dụng, như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phối quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Xem thêm và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số ván bắt đầu và kết thúc, đánh giá sao). Không thông tin nào trong số này nhận dạng cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 23 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Game xếp tháp"
  }
};
