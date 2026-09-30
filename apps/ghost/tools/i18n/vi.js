/* Tạo con ma Halloween — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Hình vẽ và số lượng bộ phận nằm trong ghost-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tạo con ma Halloween – chú ma nhỏ dễ thương',
    description: 'Tạo con ma Halloween của riêng bạn: chọn dáng, mắt, miệng và mũ cho chú ma nhỏ dễ thương. Miễn phí, không cần cài đặt, xong trong 1 phút, lưu ảnh hoặc gửi link.',
    ogTitle: 'Tạo con ma Halloween 👻 chú ma nhỏ của bạn',
    ogDescription: 'Chỉ 1 phút là có chú ma nhỏ dễ thương bay lơ lửng, gửi ngay cho bạn bè.',
  },
  siteName: 'Tạo con ma',
  privacyLink: 'Chính sách bảo mật',

  start: {
    badge: '👻 Đặc biệt Halloween',
    h1Kicker: 'Tạo con ma Halloween',
    h1Html: 'Tạo chú<br><em>ma nhỏ</em> của bạn',
    hook: 'Ai đang trốn dưới tấm chăn kia nhỉ? Hãy cho bé một khuôn mặt và chút cá tính, rồi xem bé bay lơ lửng.',
    start: 'Bắt đầu tạo ma →',
  },

  editor: {
    title: 'Trang trí chú ma',
    hint: 'Mẹo: chạm vào chú ma để đổi sang kiểu tiếp theo',
    previewAria: 'Chú ma của bạn. Chạm để đổi sang kiểu tiếp theo',
    tabsAria: 'Các phần của chú ma',
    tabs: { body: 'Dáng', color: 'Màu', eyes: 'Mắt', mouth: 'Miệng', cheeks: 'Má', hat: 'Mũ', item: 'Cầm tay', bg: 'Cảnh' },
    optionAria: '{part} {n}',
    nameLabel: 'Đặt tên cho chú ma (không bắt buộc)',
    namePlaceholder: 'VD: Bé Bồng Bềnh',
    random: 'Ngẫu nhiên',
    done: 'Xong rồi!',
  },

  result: {
    eyebrowMine: 'Chú ma của bạn đã sẵn sàng đi dọa!',
    eyebrowFriend: 'Bạn bè đã tạo chú ma này tặng bạn',
    untitled: 'Chú ma nhỏ của tôi',
    imageAlt: 'Chú ma: {name}',
    save: 'Lưu ảnh',
    saving: 'Đang tạo ảnh…',
    saved: 'Đã lưu ảnh!',
    saveFail: 'Không tạo được ảnh. Hãy thử chụp màn hình nhé.',
    edit: 'Trang trí tiếp',
    retry: 'Tạo chú ma khác',
    retryFriend: 'Tạo chú ma của tôi',
    shareTitle: 'Tạo con ma Halloween – chú ma nhỏ dễ thương',
    shareText: 'Đây là chú ma “{name}” của mình 👻 Bạn cũng tạo thử nhé!',
    shareTextNoName: 'Mình vừa tạo chú ma nhỏ của riêng mình 👻 Bạn cũng tạo thử nhé!',
    fileName: 'chu-ma-cua-toi',
  },

  og: {
    brand: '👻 Tạo con ma',
    defaultKicker: 'Tạo con ma Halloween',
    defaultTitle: 'Tạo chú ma nhỏ của bạn',
    defaultDesc: 'Khuôn mặt, mũ và bạn đồng hành · miễn phí',
  },

  faq: [
    { q: 'Tạo chú ma như thế nào?', a: 'Chọn một thẻ phía trên trình chỉnh sửa rồi chạm vào kiểu bạn thích. Chạm vào chính chú ma sẽ đổi sang kiểu tiếp theo của thẻ đó, còn “Ngẫu nhiên” trộn tất cả một lần. Ưng ý rồi thì chạm “Xong rồi!”.' },
    { q: 'Có lưu chú ma thành ảnh được không?', a: 'Được. “Lưu ảnh” sẽ biến chú ma thành ảnh PNG. Trên điện thoại bạn có thể lưu vào thư viện ảnh từ menu chia sẻ; trên máy tính ảnh sẽ được tải về.' },
    { q: 'Link chia sẻ hoạt động thế nào?', a: 'Toàn bộ thiết kế và tên của chú ma nằm ngay trong link. Ai mở link sẽ thấy đúng chú ma đó và có thể tự tạo chú ma của mình. Chúng tôi không lưu gì trên máy chủ.' },
    { q: 'Sao chú ma cứ nhấp nhô lên xuống?', a: 'Vì ma thì phải bay lơ lửng chứ! Đó chỉ là chuyển động nhỏ trên màn hình. Nếu thiết bị bật chế độ giảm chuyển động, chú ma sẽ đứng yên, và ảnh đã lưu luôn là ảnh tĩnh.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Tạo con ma',
    description: 'Chính sách bảo mật của Tạo con ma — cách xử lý thiết kế của bạn, cookie, quảng cáo và thống kê truy cập.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Tạo con ma (gọi là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý mức thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Thiết kế chú ma và tên của nó không bao giờ được gửi lên máy chủ — chúng ở lại trên trình duyệt của bạn (và nằm trong URL khi bạn chia sẻ). Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi nếu bạn làm vậy.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lượt truy cập trước đây của bạn. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê truy cập', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và theo ngôn ngữ (lượt xem trang, số chú ma hoàn thành, đánh giá sao). Không có thông tin nào trong đó nhận diện được cá nhân bạn.'],
      ['5. Link chia sẻ và hình ảnh', 'Link tạo bằng "Chia sẻ" chứa thiết kế chú ma và cái tên bạn đã nhập, được mã hóa trong URL. Ảnh lưu về được tạo ngay trong trình duyệt của bạn. Vui lòng tránh dùng thông tin có thể nhận diện cá nhân làm tên.'],
      ['6. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành Dịch vụ.'],
      ['7. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 1 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tạo con ma',
  },
};
