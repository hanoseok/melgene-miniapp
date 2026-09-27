/* Trò chơi bậc thang — Tiếng Việt (/vi/)
 * Từ khóa: "bốc thăm", "trò chơi bậc thang", "amidakuji".
 * page.* được tools/gen-i18n.js ghi vào HTML tĩnh; ui.* được nhúng vào trang cho ladder.js dùng.
 */
module.exports = {
  siteName: 'Trò chơi bậc thang',
  meta: {
    title: 'Bốc thăm, trò chơi bậc thang | Melgene Apps',
    description: 'Ai khao cà phê? Trưa nay ăn gì? Ai rửa chén? Công cụ bốc thăm trực tuyến miễn phí này (trò chơi bậc thang, còn gọi là amidakuji) chọn ngẫu nhiên công bằng, không cần cài đặt hay đăng ký. Chia sẻ đúng bậc thang đó bằng một đường link.',
    ogTitle: 'Trò chơi bậc thang — bốc thăm công bằng, miễn phí trong 1 phút',
    ogDescription: 'Nhập tên và kết quả, chạm vào và xem đường đi. Bốc thăm trực tuyến miễn phí, không cần cài đặt.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap',
  app: {
    name: 'Trò chơi bậc thang',
    currency: 'VND',
    description: 'Công cụ bốc thăm trực tuyến miễn phí (trò chơi bậc thang) để chọn món trưa, ai khao cà phê, phân công trực nhật hoặc xếp thứ tự. Nhập người chơi và kết quả để có một bậc thang ngẫu nhiên công bằng, rồi chia sẻ đúng bậc thang đó cho bạn bè bằng một đường link.',
  },
  setup: {
    badge: '🪜 Miễn phí online',
    h1Html: 'Không quyết được?<br><em>Bốc thăm</em> giúp bạn chọn',
    hook: 'Nhập tên và kết quả, phần còn lại để số phận lo. Món trưa, khao cà phê, trực nhật, xếp thứ tự — công bằng hết.',
    countLabel: 'Số người chơi',
    minusAria: 'Bớt người chơi',
    plusAria: 'Thêm người chơi',
    presetLabel: 'Chọn nhanh',
    presets: { lunch: '🍜 Món trưa', coffee: '☕ Ai khao cà phê', clean: '🧹 Trực nhật', order: '🔢 Xếp thứ tự' },
    namesLabel: 'Người chơi',
    resultsLabel: 'Kết quả',
    shuffle: '🔀 Xáo kết quả',
    build: 'Tạo bậc thang →',
  },
  play: {
    edit: '← Chỉnh sửa',
    rebuild: '🔁 Bậc thang mới',
    hint: 'Chạm vào một người chơi để xem đường đi',
    revealAll: 'Xem tất cả kết quả',
    finalTitle: 'Kết quả cuối cùng',
  },
  privacyLink: 'Chính sách bảo mật',

  // FAQ ngắn, không spoil — chỉ hiện trong màn hình kết thúc dùng chung (MG_FAQ)
  faq: [
    { q: 'Trò chơi bậc thang có thật sự công bằng không?', a: 'Có. Các bậc ngang được đặt ngẫu nhiên mỗi lần và các đường đi không bao giờ giao nhau, nên không ai đoán trước hay gian lận được kết quả.' },
    { q: 'Có thể tạo bậc thang mới với cùng người chơi không?', a: 'Chạm "Bậc thang mới" để giữ nguyên người chơi và kết quả nhưng tạo ra một bậc thang ngẫu nhiên hoàn toàn mới.' },
    { q: 'Tối đa được bao nhiêu người chơi?', a: 'Từ 2 đến 10 người.' },
    { q: 'Dùng trên điện thoại có được không?', a: 'Được. Thiết kế để chạm, và bậc thang tự động vừa với mọi kích thước màn hình.' },
  ],

  ui: {
    defaultName: 'Người {n}',
    win: 'Trúng 🎉',
    lose: 'Trật rồi',
    coffeeWin: 'Khao cà phê',
    coffeeLose: 'Thoát nạn',
    order: ['Thứ 1', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Thứ 8', 'Thứ 9', 'Thứ 10'],
    pools: {
      lunch: ['Cơm tấm', 'Bún chả', 'Phở bò', 'Bánh mì', 'Bún bò Huế', 'Cơm gà', 'Bánh xèo', 'Hủ tiếu', 'Xôi mặn', 'Bún đậu'],
      clean: ['Rửa chén', 'Quét nhà', 'Đổ rác', 'Lau nhà', 'Giặt đồ', 'Dọn bàn', 'Tưới cây', 'Lau cửa sổ', 'Sắp xếp bàn', 'Rác tái chế'],
    },
    ariaName: 'Tên người chơi {n}',
    ariaResult: 'Kết quả {n}',
    ariaTrace: 'Xem đường đi của {name}',
    ariaHidden: 'Kết quả ô {n}, chưa mở',
    ariaRevealed: 'Đã mở {result}',
    shareTitle: 'Xem thử bậc thang này',
    shareText: 'Mình vừa tạo một bậc thang — thử đi cùng đường xem bạn về đâu nhé!',
    retryLabel: 'Bậc thang mới',
  },

  og: {
    badge: '🪜 Miễn phí online',
    title: 'Trò chơi bậc thang',
    tag: 'Từ món trưa đến khao cà phê, công bằng tuyệt đối',
  },

  privacy: {
    title: 'Chính sách bảo mật | Trò chơi bậc thang',
    description: 'Chính sách bảo mật của Trò chơi bậc thang — cách dùng cookie, quảng cáo và thống kê truy cập.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Trò chơi bậc thang ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu cần thiết như mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Tên người chơi và kết quả bạn nhập không bao giờ được lưu trên máy chủ của chúng tôi; chúng chỉ được xử lý trong trình duyệt của bạn (bộ nhớ cục bộ và địa chỉ trang). Một số thông tin có thể được thu thập tự động trong quá trình bạn dùng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động đúng nếu bạn làm vậy.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo thông qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên lượt truy cập trước đây của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi cài đặt quảng cáo cá nhân hóa tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê truy cập (Google Analytics)', 'Dịch vụ có thể dùng Google Analytics (GA4) để hiểu số lượng khách truy cập và nguồn truy cập nhằm cải thiện Dịch vụ. Dữ liệu này chỉ dùng cho mục đích thống kê và không định danh cá nhân bạn.'],
      ['5. Về liên kết chia sẻ', 'Liên kết tạo ra từ "Chia sẻ" chứa tên người chơi, nội dung kết quả bạn đã nhập, và cấu trúc bậc thang, được mã hóa trong URL. Chúng tôi khuyên bạn không nhập thông tin có thể nhận diện cá nhân.'],
      ['6. Liên hệ', 'Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ bên vận hành trang web.'],
      ['7. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 1 tháng 1 năm 2026.'],
    ],
    back: '← Quay lại Trò chơi bậc thang',
  },
};
