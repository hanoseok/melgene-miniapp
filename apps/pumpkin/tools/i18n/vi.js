/* Khắc bí ngô Halloween online — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Hình vẽ và số lượng chi tiết nằm trong pumpkin-core.js.
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
    title: 'Khắc bí ngô Halloween online – Làm đèn bí ngô',
    description: 'Khắc bí ngô Halloween online: chọn mắt, mũi, miệng, thắp nến và làm chiếc đèn bí ngô của riêng bạn. Miễn phí, không cần cài đặt, xong trong 1 phút.',
    ogTitle: 'Khắc bí ngô Halloween online 🎃 Làm đèn bí ngô',
    ogDescription: 'Làm chiếc đèn bí ngô của riêng bạn trong 1 phút, thắp nến rồi gửi cho bạn bè.',
  },
  siteName: 'Khắc bí ngô Halloween',
  privacyLink: 'Chính sách bảo mật',

  start: {
    badge: '🎃 Đặc biệt Halloween',
    h1Kicker: 'Khắc bí ngô Halloween online',
    h1Html: 'Tự làm<br><em>đèn bí ngô</em> của bạn',
    hook: 'Không cần dao, không lo bừa bộn. Chọn gương mặt cho bí ngô, thắp nến và ngắm nó sáng lung linh.',
    start: 'Bắt đầu khắc →',
  },

  editor: {
    title: 'Khắc bí ngô của bạn',
    hint: 'Mẹo: chạm vào bí ngô để thử kiểu tiếp theo',
    previewAria: 'Bí ngô của bạn. Chạm để đổi sang kiểu tiếp theo',
    tabsAria: 'Các phần của bí ngô',
    tabs: { shape: 'Hình dáng', color: 'Màu', eyes: 'Mắt', nose: 'Mũi', mouth: 'Miệng', stem: 'Cuống', extra: 'Phụ kiện' },
    optionAria: '{part} {n}',
    glow: 'Nến',
    night: 'Trời đêm',
    nameLabel: 'Đặt tên cho bí ngô (không bắt buộc)',
    namePlaceholder: 'VD: Bí Cười Toe',
    random: 'Ngẫu nhiên',
    done: 'Xong rồi!',
  },

  result: {
    eyebrowMine: 'Đèn bí ngô của bạn đã xong!',
    eyebrowFriend: 'Bạn bè đã khắc chiếc đèn bí ngô này tặng bạn',
    untitled: 'Đèn bí ngô của tôi',
    imageAlt: 'Đèn bí ngô: {name}',
    save: 'Lưu ảnh',
    saving: 'Đang tạo ảnh…',
    saved: 'Đã lưu ảnh!',
    saveFail: 'Không tạo được ảnh. Bạn hãy chụp màn hình nhé.',
    edit: 'Sửa tiếp',
    retry: 'Khắc thêm một quả',
    retryFriend: 'Mình cũng khắc một quả',
    shareTitle: 'Khắc bí ngô Halloween online – Làm đèn bí ngô',
    shareText: 'Mình vừa khắc đèn bí ngô tên “{name}” 🎃 Bạn cũng thử đi!',
    shareTextNoName: 'Mình vừa khắc chiếc đèn bí ngô của riêng mình 🎃 Bạn cũng thử đi!',
    fileName: 'den-bi-ngo',
  },

  og: {
    brand: '🎃 Khắc bí ngô Halloween',
    defaultKicker: 'Khắc bí ngô Halloween online',
    defaultTitle: 'Tự làm đèn bí ngô của bạn',
    defaultDesc: 'Mắt, mũi, miệng và ánh nến · miễn phí ngay trên trình duyệt',
  },

  faq: [
    { q: 'Khắc bí ngô như thế nào?', a: 'Chọn một thẻ (hình dáng, màu, mắt, mũi, miệng, cuống hoặc phụ kiện) rồi chạm vào kiểu bạn thích. Chạm vào chính quả bí ngô sẽ đổi sang kiểu tiếp theo, còn nút Ngẫu nhiên trộn tất cả một lượt. Ưng rồi thì chạm “Xong rồi!”.' },
    { q: 'Mình có lưu đèn bí ngô thành ảnh được không?', a: 'Được. Nút “Lưu ảnh” tạo ra một ảnh PNG. Trên điện thoại, bạn lưu vào thư viện ảnh qua menu chia sẻ; trên máy tính, ảnh sẽ được tải xuống ngay.' },
    { q: 'Link chia sẻ hoạt động thế nào?', a: 'Toàn bộ thiết kế và tên bí ngô nằm ngay trong link. Người mở link sẽ thấy đúng quả bí ngô đó và có thể tự khắc quả của mình. Máy chủ của chúng tôi không lưu gì cả.' },
    { q: 'Công tắc Nến và Trời đêm để làm gì?', a: 'Bật nến, các phần được khắc sẽ tỏa sáng ấm áp như có ngọn nến thật bên trong. Tắt đi thì bí ngô trông như ban ngày. Công tắc Trời đêm đổi nền giữa bầu trời đầy sao và nền sáng.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Khắc bí ngô Halloween',
    description: 'Chính sách bảo mật của Khắc bí ngô Halloween — cách xử lý thiết kế của bạn, cookie, quảng cáo và thống kê truy cập.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Khắc bí ngô Halloween (gọi là "Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý mức thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Thiết kế bí ngô và tên của nó không bao giờ được gửi lên máy chủ — chúng ở lại trên trình duyệt của bạn (và nằm trong URL khi bạn chia sẻ). Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi nếu bạn làm vậy.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lượt truy cập trước đây của bạn. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê truy cập', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và theo ngôn ngữ (lượt xem trang, số bí ngô hoàn thành, đánh giá sao). Không có thông tin nào trong đó nhận diện được cá nhân bạn.'],
      ['5. Link chia sẻ và hình ảnh', 'Link tạo bằng "Chia sẻ" chứa thiết kế bí ngô và cái tên bạn đã nhập, được mã hóa trong URL. Ảnh lưu về được tạo ngay trong trình duyệt của bạn. Vui lòng tránh dùng thông tin có thể nhận diện cá nhân làm tên.'],
      ['6. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành Dịch vụ.'],
      ['7. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 28 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại Khắc bí ngô Halloween',
  },
};
