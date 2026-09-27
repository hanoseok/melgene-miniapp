/* Vòng quay may mắn — Tiếng Việt (/vi/)
 * Từ khóa: "vòng quay may mắn". title = "{từ khóa} | {thương hiệu}".
 * Cùng cấu trúc khóa với các file ngôn ngữ khác. ui.presets phải giữ cùng khóa và cùng số lượng mục
 * ở mọi ngôn ngữ (check-roulette.js sẽ kiểm tra). Mỗi lựa chọn tối đa 24 ký tự.
 * FAQ chỉ hiện trong màn hình kết thúc dùng chung (dưới nút chia sẻ) — không đặt ở màn hình bắt đầu.
 */
module.exports = {
  siteName: 'Vòng quay may mắn',
  meta: {
    title: 'Vòng quay may mắn | Melgene Apps',
    description: 'Vòng quay may mắn miễn phí, trực tuyến. Nhập lựa chọn rồi quay — không cần cài đặt, không cần đăng ký, xong trong một phút. Có chỉnh trọng số và link chia sẻ.',
    ogTitle: 'Vòng quay may mắn — nhập lựa chọn rồi quay',
    ogDescription: 'Món trưa, trực nhật, hình phạt — quyết định nhanh. Vòng quay online miễn phí, công bằng.',
  },
  // Font chữ đậm cho biển hiệu, cổng ứng dụng và kết quả (fontCss nạp font, displayFont đặt tên — chỉ đổi 2 dòng này theo ngôn ngữ)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Vòng quay may mắn',
    description: 'Vòng quay may mắn miễn phí để chọn món trưa, trực nhật, hình phạt hay bốc thăm. Thêm 2 đến 16 lựa chọn kèm trọng số (tùy chọn) rồi quay — người thắng được chọn công bằng bằng số ngẫu nhiên mật mã học. Chia sẻ link để dùng đúng vòng quay đó.',
  },
  hero: {
    h1: 'Vòng quay may mắn',
    tagline: 'Không quyết định được? Viết ra rồi quay.',
  },
  wheel: {
    spin: 'Quay!',
    spinAria: 'Quay vòng quay',
    share: 'Chia sẻ',
    fair: 'Kết quả được chọn ngẫu nhiên ngay khi bạn nhấn quay. Vòng quay chỉ chậm dần rồi dừng đúng ô đó.',
  },
  history: {
    title: 'Lịch sử quay',
    clear: 'Xóa lịch sử',
  },
  editor: {
    title: 'Lựa chọn',
    presetsLabel: 'Bắt đầu nhanh',
    presets: { lunch: '🍜 Món trưa', dare: '🎤 Hình phạt', duty: '🙋 Tên', yesno: '👍 Có/Không', numbers: '🔢 Số 1-10' },
    add: 'Thêm lựa chọn',
    shuffle: 'Xáo trộn',
    weighted: 'Chỉnh trọng số',
    weightedHint: 'Số càng lớn thì ô càng rộng và ra càng thường xuyên.',
    themeLabel: 'Màu sắc',
  },
  result: {
    kicker: 'Vòng quay đã chọn',
    again: 'Quay lại',
    removeAgain: 'Bỏ mục này rồi quay lại',
    close: 'Đóng',
  },
  // Chỉ hiện trong màn hình kết thúc dùng chung (dưới nút chia sẻ) — không đặt ở màn hình bắt đầu
  faq: [
    { q: 'Kết quả vòng quay có thể bị can thiệp không?', a: 'Không. Người thắng được chọn bằng số ngẫu nhiên mật mã học ngay khi bạn nhấn quay, vòng quay chỉ dừng đúng ở đó. Thời điểm nhấn hay hình ảnh quay không ảnh hưởng đến kết quả.' },
    { q: 'Chỉnh trọng số hoạt động thế nào?', a: 'Cơ hội của mỗi lựa chọn là trọng số (1-5) chia cho tổng tất cả trọng số. Với trọng số 2, 1 và 1, lựa chọn đầu thắng 50% số lần, hai lựa chọn còn lại mỗi cái 25%.' },
    { q: 'Tôi có thể thêm tối đa bao nhiêu lựa chọn?', a: 'Từ 2 đến 16. Mỗi lựa chọn tối đa 24 ký tự; tên dài sẽ được thu nhỏ hoặc rút gọn bằng dấu ba chấm khi ô hẹp.' },
    { q: 'Tôi có thể gửi vòng quay cho ai đó không?', a: 'Có. Chia sẻ sẽ tạo một link mã hóa lựa chọn, trọng số và màu sắc ngay trong địa chỉ — không lưu gì trên máy chủ.' },
    { q: 'Có cần cài app hay đăng ký không?', a: 'Không. Vòng quay chạy ngay trên trình duyệt của điện thoại, máy tính bảng hay máy tính, không cần tải về hay tạo tài khoản.' },
  ],
  privacyLink: 'Chính sách bảo mật',

  ui: {
    itemN: 'Lựa chọn {n}',
    wheelAria: 'Vòng quay có {n} ô: {list}',
    ariaItem: 'Tên của lựa chọn {n}',
    ariaHandle: 'Sắp xếp lại lựa chọn {n} (mũi tên lên/xuống)',
    ariaDelete: 'Xóa lựa chọn {n}',
    ariaWeight: 'Lựa chọn {n}, trọng số {w}, nhấn để đổi',
    count: '{n}/{max}',
    maxReached: 'Bạn có thể thêm tối đa {max} lựa chọn',
    minReached: 'Cần ít nhất 2 lựa chọn mới quay được',
    soundOn: 'Bật âm thanh',
    soundOff: 'Tắt âm thanh',
    announce: 'Kết quả: {label}',
    historyItem: 'Lượt {n}',
    restore: 'Khôi phục {n} mục đã bỏ',
    loadedShare: 'Đã tải vòng quay được chia sẻ',
    badShare: 'Không mở được link này', // toast chỉ một dòng (nowrap) — giữ ngắn gọn
    shareTitle: 'Quay thử vòng quay của tôi',
    shareText: 'Tôi vừa tạo một vòng quay — quay thử không?',
    themes: { candy: 'Kẹo ngọt', macaron: 'Macaron', circus: 'Rạp xiếc', jewel: 'Đá quý' },
    presets: {
      lunch: ['Phở', 'Bánh mì', 'Cơm tấm', 'Bún chả', 'Pizza', 'Sushi', 'Salad', 'Mì Ý'],
      dare: ['Hát một câu', 'Nhảy 15 giây', 'Nhại giọng vùng miền', 'Mời cà phê', 'Kể chuyện cười', 'Hít đất 10 cái', 'Nói như cướp biển', 'Làm mặt hài hước'],
      duty: ['An', 'Linh', 'Minh', 'Chi', 'Huy', 'Mai'],
      yesno: ['Có', 'Không'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Miễn phí trực tuyến',
    title: 'Vòng quay may mắn',
    tag: 'Món trưa, trực nhật, hình phạt — nhập rồi quay',
  },

  privacy: {
    title: 'Chính sách bảo mật | Vòng quay may mắn',
    description: 'Chính sách bảo mật của Vòng quay may mắn — cách lưu lựa chọn của bạn, cookie, quảng cáo và thống kê truy cập.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Vòng quay may mắn (gọi là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý mức thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Lựa chọn, trọng số, màu sắc và lịch sử quay của bạn không bao giờ được gửi lên máy chủ — chúng ở lại trên trình duyệt của bạn (bộ nhớ cục bộ và URL). Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi nếu bạn làm vậy.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lượt truy cập trước đây của bạn. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê truy cập', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và theo ngôn ngữ (lượt xem trang, số lần quay, đánh giá sao). Không có thông tin nào trong đó nhận diện được cá nhân bạn.'],
      ['5. Về link chia sẻ', 'Link tạo bằng "Chia sẻ" chứa tên lựa chọn, trọng số và màu sắc bạn đã nhập, được mã hóa trong URL. Vui lòng tránh nhập thông tin có thể nhận diện cá nhân.'],
      ['6. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành Dịch vụ.'],
      ['7. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 27 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại Vòng quay may mắn',
  },
};
