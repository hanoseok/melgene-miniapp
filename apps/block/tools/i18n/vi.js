/* Xếp khối — Tiếng Việt */
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
    "title": "Xếp khối – game xếp khối 8×8, xóa hàng",
    "description": "Xếp khối: kéo các khối vào bàn 8×8, lấp đầy hàng hoặc cột để xóa và xóa liên tiếp để ăn combo. Chơi miễn phí ngay trên trình duyệt, không cần tải.",
    "ogTitle": "Xếp khối 🧩 Bạn trụ được bao lâu?",
    "ogDescription": "Kéo khối vào bàn, lấp đầy một hàng hoặc một cột là nó biến mất. Xóa liên tiếp để ăn combo."
  },
  "siteName": "Xếp khối",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "🧩 Game trí tuệ 8×8 thư giãn",
    "h1Kicker": "Xếp khối",
    "h1Html": "Lấp đầy hàng,<br><em>dọn sạch bàn!</em>",
    "hook": "Ba khối, một bàn 8×8 và không giới hạn thời gian. Xếp vừa khít, xóa hàng và cột, chơi tiếp chừng nào còn chỗ trống.",
    "how": {
      "drag": "Kéo một khối",
      "lines": "Lấp đầy hàng, cột",
      "plan": "Chừa chỗ trống"
    },
    "facts": "Không tính giờ · combo · phá kỷ lục",
    "start": "Chơi ngay →"
  },
  "play": {
    "score": "Điểm",
    "best": "Kỷ lục",
    "combo": "Combo",
    "comboValue": "×{n}",
    "hint": "Kéo một khối vào bàn",
    "hintSelected": "Chạm vào ô muốn đặt",
    "hintNoFit": "Khối này không vừa chỗ đó",
    "noRoom": "Hết chỗ rồi!",
    "boardAria": "Bàn 8 x 8. Chọn khối bằng phím 1, 2 hoặc 3, di chuyển bằng phím mũi tên và nhấn Enter để đặt. Nhấn Esc để hủy.",
    "trayAria": "Các khối cần đặt",
    "pieceAria": "Khối {n}",
    "pieceNoFit": "Khối {n} (không còn chỗ)"
  },
  "result": {
    "over": "Trên bàn đã hết chỗ",
    "points": "điểm",
    "lines": "Hàng đã xóa",
    "combo": "Combo cao nhất",
    "comboValue": "×{n}",
    "shareTitle": "Xếp khối",
    "shareText": "Mình được {n} điểm trong Xếp khối 🧩 Bạn vượt nổi không?",
    "best": "Kỷ lục: {n}",
    "newBest": "Kỷ lục mới!",
    "top": "Top {n}%",
    "beat": "Cao hơn {pct}% người chơi",
    "beatAll": "Cao hơn mọi người chơi khác cho đến giờ",
    "others": "So với {n} ván khác",
    "comparing": "Đang so với người chơi khác…",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "🧩 Xếp khối",
    "defaultKicker": "Game xếp khối 8×8 miễn phí",
    "defaultTitle": "Lấp đầy hàng, dọn sạch bàn",
    "defaultDesc": "Kéo thả · lấp hàng và cột · combo"
  },
  "faq": [
    {
      "q": "Chơi thế nào?",
      "a": "Kéo một trong ba khối bên dưới bàn và thả vào các ô trống. Khi một hàng hoặc một cột được lấp đầy, nó sẽ bị xóa. Đặt hết ba khối thì bạn nhận ba khối mới. Ván chơi kết thúc khi không khối nào còn lại vừa chỗ nào trên bàn."
    },
    {
      "q": "Điểm được tính thế nào?",
      "a": "Mỗi ô bạn đặt được một điểm. Xóa hàng được thêm điểm thưởng, càng xóa nhiều hàng cùng lúc thì thưởng càng lớn (10, 30, 60, 100 …), rồi nhân với combo hiện tại."
    },
    {
      "q": "Combo hoạt động ra sao?",
      "a": "Mỗi lần đặt khối mà xóa được ít nhất một hàng, combo tăng thêm một, và con số đó là hệ số nhân của lần ấy. Nếu ba lần đặt liên tiếp không xóa được gì, combo về lại không."
    },
    {
      "q": "Có chơi được mà không cần kéo không?",
      "a": "Được. Chạm vào một khối để chọn, rồi chạm vào chỗ trên bàn muốn đặt. Dùng bàn phím thì nhấn 1, 2 hoặc 3 để chọn, di chuyển bằng phím mũi tên và nhấn Enter để đặt."
    },
    {
      "q": "Phần trăm top có thật không?",
      "a": "Có. Khi ván chơi kết thúc, chỉ điểm của bạn được gửi ẩn danh lên máy chủ để so với điểm của mọi người. Chỉ hiển thị khi có điểm thật để so sánh, nếu không sẽ không hiện gì."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Xếp khối",
    "description": "Chính sách bảo mật của Xếp khối: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Xếp khối (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Khi ván chơi kết thúc, chỉ điểm của bạn được gửi lên máy chủ dưới dạng số đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Trong khi sử dụng, một số thông tin có thể được thu thập tự động như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và kỷ lục của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số ván bắt đầu và kết thúc, đánh giá sao). Không thông tin nào trong số này nhận dạng được bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày có hiệu lực",
        "Chính sách này có hiệu lực từ ngày 29 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Xếp khối"
  }
};
