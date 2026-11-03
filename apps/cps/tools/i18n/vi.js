/* CPS Test — vi (click speed test / cps). Same keys as en.js; see en.js header for rules and placeholders. */
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
    "title": "Test tốc độ click · CPS test – đo số click mỗi giây",
    "description": "Test tốc độ click (CPS test): click thật nhanh trong 1, 5 hoặc 10 giây để biết số click mỗi giây và cấp độ tay nhanh. Miễn phí, trên điện thoại và máy tính.",
    "ogTitle": "Test tốc độ click 🖱️ Bạn click được bao nhiêu lần mỗi giây?",
    "ogDescription": "Click hoặc chạm liên tục trong 1, 5 hoặc 10 giây để nhận điểm CPS và huy hiệu tốc độ."
  },
  "siteName": "Test tốc độ click",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "🖱️ Ngón tay bạn nhanh cỡ nào?",
    "h1Kicker": "Test tốc độ click · CPS test",
    "h1Html": "Mỗi giây bạn<br><em>click mấy lần?</em>",
    "hook": "Click hoặc chạm vào ô lớn thật nhanh trước khi hết giờ. Điểm của bạn là số click mỗi giây.",
    "modeLabel": "Thời gian test",
    "modeValue": "{n} giây",
    "how": "Tính giờ từ cú click đầu tiên · chỉ tính chuột và chạm",
    "start": "Bắt đầu →",
    "facts": "1, 5 hoặc 10 giây · điện thoại hoặc máy tính · phá kỷ lục"
  },
  "play": {
    "mode": "Test {n} giây",
    "time": "Thời gian",
    "clicks": "Click",
    "cps": "CPS",
    "ready": "Click vào đây để bắt đầu",
    "readySub": "Đồng hồ chạy từ cú click đầu tiên",
    "go": "Click tiếp đi!",
    "over": "Hết giờ!",
    "cancelled": "Bạn đã rời trang nên lượt này không được tính. Thử lại nhé!",
    "change": "← Đổi chế độ",
    "zoneAria": "Vùng click",
    "sec": "{n} giây"
  },
  "result": {
    "over": "Kết quả của bạn",
    "mode": "Test {n} giây",
    "unit": "CPS",
    "clicks": "Số click",
    "time": "Thời gian",
    "tierLabel": "Huy hiệu tốc độ click",
    "tiers": [
      "🐢 Rùa thong thả",
      "🐇 Thỏ lanh lẹ",
      "🐆 Ngón tay báo đốm",
      "⚡ Tay click tia chớp",
      "🔥 Cao thủ jitter click",
      "🚀 Cỗ máy click"
    ],
    "newBest": "Kỷ lục cá nhân mới!",
    "pb": "Kỷ lục của bạn ở chế độ này: {n} CPS",
    "tooFast": "Trên 25 CPS là vượt quá tốc độ của con người, nên kết quả này không được lưu hay so sánh.",
    "top": "Top {n}%",
    "beat": "Nhanh hơn {pct}% người chơi",
    "beatAll": "Nhanh hơn mọi người chơi khác tính đến giờ",
    "others": "So với {n} lượt khác ở chế độ này",
    "comparing": "Đang so với người chơi khác…",
    "shareTitle": "Test tốc độ click",
    "shareText": "Mình đạt {cps} CPS ({clicks} click trong {sec} giây) 🖱️ {tier}. Bạn click nhanh hơn được không?",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "🖱️ Test tốc độ click",
    "defaultKicker": "CPS test miễn phí",
    "defaultTitle": "Bạn click được bao nhiêu lần mỗi giây?",
    "defaultDesc": "1, 5 hoặc 10 giây · điện thoại hoặc máy tính"
  },
  "faq": [
    {
      "q": "Test CPS chơi thế nào?",
      "a": "Chọn thời gian test 1, 5 hoặc 10 giây rồi bấm nút. Đồng hồ bắt đầu ngay khi bạn click hoặc chạm vào ô lớn lần đầu, và cú click đó cũng được tính. Click nhanh nhất có thể cho đến khi hết giờ. CPS là số click chia cho số giây của bài test."
    },
    {
      "q": "Bao nhiêu CPS là nhanh?",
      "a": "Click bình thường thì phần lớn mọi người đạt khoảng 5 đến 8 lần mỗi giây. Game thủ dùng kỹ thuật như jitter click hay butterfly click thường vượt 10. Chế độ 1 giây hay cho con số cao nhất vì chưa kịp mỏi tay."
    },
    {
      "q": "Bàn phím hoặc nhiều ngón tay có được tính không?",
      "a": "Chỉ tính click chuột và chạm trong ô. Phím bàn phím cố ý không được tính, vì giữ phím sẽ tự lặp lại. Trên màn hình cảm ứng, mỗi ngón tay chạm vào ô được tính là một click, nên bạn có thể dùng hai ngón hoặc cả hai ngón cái."
    },
    {
      "q": "Vì sao lượt của tôi không được tính?",
      "a": "Nếu bạn chuyển tab, khóa máy hoặc rời trang khi đồng hồ đang chạy, lượt đó sẽ bị hủy để công bằng. Kết quả trên 25 click mỗi giây là không thể với ngón tay người, nên không được lưu hay so sánh với người chơi khác."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Test tốc độ click",
    "description": "Chính sách bảo mật của Test tốc độ click: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Test tốc độ click (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc một lượt test, chỉ điểm số (số click mỗi giây) được gửi lên máy chủ dưới dạng đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động như mô tả dưới đây."
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
        "Chính sách này có hiệu lực từ ngày 4 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Test tốc độ click"
  }
};
