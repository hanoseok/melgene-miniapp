/* Aim Trainer — vi (Luyện aim)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "Luyện aim · Kiểm tra độ chính xác online",
    "description": "Luyện aim miễn phí: bấm trúng 30 mục tiêu thật nhanh hoặc trúng nhiều nhất trong 30 giây. Xem thời gian trung bình, độ chính xác và thứ hạng của bạn.",
    "ogTitle": "Luyện aim 🎯 Tay bạn nhanh và chuẩn cỡ nào?",
    "ogDescription": "Bấm trúng 30 mục tiêu hoặc đua 30 giây để xem thời gian trung bình, độ chính xác và huy hiệu aim của bạn."
  },
  "siteName": "Luyện aim",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "🎯 Aim của bạn chuẩn cỡ nào?",
    "h1Kicker": "Luyện aim · Kiểm tra độ chính xác",
    "h1Html": "Thấy là bấm,<br><em>bấm là trúng</em>",
    "hook": "Mục tiêu hiện ra bất kỳ đâu trong khung. Chạm vào trước khi nó biến mất để biết tay bạn nhanh và chuẩn đến đâu.",
    "modeLabel": "Chế độ",
    "modes": {
      "classic": {
        "name": "Cổ điển",
        "sub": "30 mục tiêu"
      },
      "timed": {
        "name": "Tính giờ",
        "sub": "30 giây"
      }
    },
    "how": "Bấm trúng mục tiêu ở giữa để bắt đầu · bấm ra ngoài tính là trượt",
    "start": "Bắt đầu luyện aim →",
    "facts": "Chuột, touchpad hay ngón tay · điện thoại hoặc PC · phá kỷ lục"
  },
  "modes": {
    "classic": "Cổ điển · 30 mục tiêu",
    "timed": "Tính giờ · 30 giây"
  },
  "play": {
    "time": "Thời gian",
    "hits": "Trúng",
    "acc": "Chính xác",
    "ready": "Bấm trúng mục tiêu để bắt đầu",
    "readySub": "Đồng hồ chạy từ lần trúng đầu tiên",
    "done": "Xong!",
    "timeUp": "Hết giờ!",
    "cancelled": "Bạn đã rời trang nên lượt này không được tính. Thử lại nhé!",
    "change": "← Đổi chế độ",
    "areaAria": "Vùng ngắm"
  },
  "result": {
    "over": "Kết quả của bạn",
    "scoreClassic": "Thời gian trung bình mỗi mục tiêu",
    "scoreTimed": "Số mục tiêu trúng",
    "unitMs": "ms",
    "unitHits": "lần",
    "acc": "Độ chính xác",
    "avg": "TB mỗi lần",
    "misses": "Trượt",
    "total": "Tổng thời gian",
    "escaped": "Bị lỡ",
    "msValue": "{n} ms",
    "secValue": "{n}s",
    "tierLabel": "Huy hiệu aim của bạn",
    "tiers": [
      "🐢 Đang khởi động",
      "🙂 Aim bình thường",
      "🎯 Mắt tinh",
      "🦅 Mắt đại bàng",
      "⚡ Cao thủ vẩy chuột",
      "🏆 Huyền thoại aim"
    ],
    "newBest": "Kỷ lục cá nhân mới!",
    "pbClassic": "Kỷ lục chế độ Cổ điển: {n} ms",
    "pbTimed": "Kỷ lục chế độ Tính giờ: {n} lần trúng",
    "invalid": "Nhanh hơn mức con người có thể phản xạ, nên kết quả này không được lưu hay so sánh.",
    "top": "Top {n}%",
    "beat": "Giỏi hơn {pct}% người chơi",
    "beatAll": "Giỏi hơn mọi người chơi khác cho đến giờ",
    "others": "So với {n} lượt khác ở chế độ này",
    "comparing": "Đang so với người chơi khác…",
    "shareTitle": "Luyện aim",
    "shareClassic": "Trung bình {avg} ms mỗi mục tiêu, chính xác {acc}% 🎯 {tier}. Bạn aim nhanh hơn không?",
    "shareTimed": "Trúng {hits} mục tiêu trong 30 giây, chính xác {acc}% 🎯 {tier}. Bạn vượt được không?",
    "retry": "Chơi lại"
  },
  "og": {
    "brand": "🎯 Luyện aim",
    "defaultKicker": "Kiểm tra aim miễn phí",
    "defaultTitle": "Tay bạn nhanh và chuẩn cỡ nào?",
    "defaultDesc": "30 mục tiêu hoặc 30 giây · điện thoại hoặc PC"
  },
  "faq": [
    {
      "q": "Luyện aim chơi như thế nào?",
      "a": "Chọn Cổ điển hoặc Tính giờ, bấm nút bắt đầu rồi bấm trúng mục tiêu ở giữa khung để vào lượt. Ở Cổ điển, 30 mục tiêu lần lượt hiện ra và điểm của bạn là thời gian trung bình để bấm trúng mỗi cái. Ở Tính giờ, bạn có 30 giây để bấm trúng càng nhiều càng tốt; mỗi mục tiêu nhỏ dần và biến mất nếu bạn quá chậm."
    },
    {
      "q": "Bao nhiêu điểm là giỏi?",
      "a": "Ở Cổ điển, đa số người chơi trung bình khoảng 500 đến 800 mili giây mỗi mục tiêu, người giỏi xuống dưới 450. Ở Tính giờ, khoảng 35 đến 45 lần trúng là phổ biến. Độ chính xác cũng quan trọng: nếu dưới 70% số lần bấm trúng mục tiêu, huy hiệu sẽ tụt một bậc."
    },
    {
      "q": "Có chơi bằng chuột, touchpad hay màn hình cảm ứng được không?",
      "a": "Được. Chuột, touchpad, bút cảm ứng và ngón tay đều dùng được; bàn phím thì không. Chỉ những lần bấm trong vùng chơi mới được tính. Điểm trên các thiết bị khác nhau khó so sánh, vì chơi bằng chuột và bằng điện thoại có thể cho kết quả khá khác."
    },
    {
      "q": "Vì sao lượt của tôi không được tính?",
      "a": "Nếu bạn chuyển tab, khóa màn hình hoặc rời trang khi đang chơi, lượt đó bị hủy để đảm bảo công bằng. Kết quả nhanh hơn phản xạ của con người, như trung bình dưới 150 mili giây mỗi mục tiêu, sẽ không được lưu và không so sánh với người chơi khác."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Luyện aim",
    "description": "Chính sách bảo mật của Luyện aim: điểm ẩn danh, cookie, quảng cáo và thống kê.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Luyện aim (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Khi kết thúc một lượt chơi, chỉ điểm số (thời gian trung bình mỗi mục tiêu hoặc số lần trúng) được gửi lên máy chủ dưới dạng đếm ẩn danh, không kèm tên hay thông tin nhận dạng cá nhân. Một số thông tin có thể được thu thập tự động như mô tả dưới đây."
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
        "Chính sách này có hiệu lực từ ngày 6 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Luyện aim"
  }
};
