/* Tung xúc xắc — tiếng Việt. Cấu trúc khóa giống en.js (xem chú thích trong en.js). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tung xúc xắc online – Gieo xúc xắc ảo',
    description: 'Tung xúc xắc online chỉ với một chạm. Gieo từ một đến sáu viên cùng lúc, chọn xúc xắc 6 mặt quen thuộc hoặc d4, d8, d10, d12, d20 cho board game và xem ngay tổng điểm. Công bằng, miễn phí, không cần đăng ký.',
    ogTitle: 'Tung xúc xắc 🎲 Gieo xúc xắc online',
    ogDescription: 'Gieo từ một đến sáu viên, d6 đến d20, xem tổng ngay.',
  },
  siteName: 'Tung xúc xắc',
  privacyLink: 'Chính sách quyền riêng tư',

  hero: {
    h1Kicker: 'Tung xúc xắc online',
    h1Html: 'Lắc, tung và để<br><em>xúc xắc</em> quyết định',
    hook: 'Chọn số viên và loại xúc xắc rồi tung. Dùng cho cờ cá ngựa, board game, game nhập vai hay phân xử xem ai rửa bát.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: 'Mấy viên xúc xắc?',
    typeLabel: 'Loại xúc xắc',
    typeHint: 'd6 là viên lập phương quen thuộc. d4 đến d20 dành cho game nhập vai.',
    roll: 'Tung xúc xắc 🎲',
    rolling: 'Đang lăn…',
    keyHint: 'Mẹo: nhấn phím Space để tung',
    idle: 'Sẵn sàng khi bạn muốn',
    total: 'Tổng {n}',
    trayLabel: 'Khay xúc xắc',
    live: 'Bạn tung được {values}. Tổng {total}.',
    liveOne: 'Bạn tung được {values}.',
    fair: 'Mọi mặt đều có cơ hội như nhau (ngẫu nhiên mật mã)',
  },

  history: {
    title: '10 lượt tung gần nhất',
    note: 'Chỉ lưu khi trang này còn mở.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Tung lại',
    shareTitle: 'Tung xúc xắc – Gieo xúc xắc online',
    shareText: 'Mình tung {dice} và được {values} = {total} 🎲',
    shareTextOne: 'Mình tung {dice} và được {values} 🎲',
  },

  og: {
    brand: '🎲 Tung xúc xắc',
    kicker: '1–6 viên · d4 đến d20',
    title: 'Tung xúc xắc online',
    desc: 'Chạm một lần, xem từng viên và tổng điểm',
  },

  faq: [
    { q: 'Tung xúc xắc ở đây có thật sự ngẫu nhiên và công bằng không?', a: 'Có. Mỗi kết quả lấy từ bộ sinh số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues) kết hợp phương pháp loại bỏ, nên không mặt nào có cơ hội cao hơn mặt nào dù chỉ một chút. Kết quả được quyết định trước khi hiệu ứng bắt đầu; xúc xắc lăn chỉ để cho vui mắt.' },
    { q: 'Tôi có thể tung bao nhiêu viên cùng lúc?', a: 'Từ một đến sáu viên mỗi lượt, tất cả cùng một loại. Khay hiển thị từng viên và tổng điểm, còn mười lượt gần nhất được giữ trong một danh sách ngắn khi trang còn mở.' },
    { q: 'd4, d8, d10, d12 và d20 là gì?', a: 'Đó là xúc xắc có 4, 8, 10, 12 và 20 mặt, dùng trong các game nhập vai trên bàn như Dungeons & Dragons. Số sau chữ d là số mặt, nên d20 cho kết quả từ 1 đến 20, còn 2d6 nghĩa là hai viên xúc xắc sáu mặt.' },
    { q: 'Có dùng được cho board game không?', a: 'Tất nhiên. Hãy dùng khi bộ cờ bị thất lạc xúc xắc, khi cần nhiều viên hơn số có trong hộp, hoặc khi chơi cùng bạn bè qua video call. Trên bàn phím, nhấn Space để tung thật nhanh.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Tung xúc xắc',
    description: 'Chính sách quyền riêng tư của Tung xúc xắc: kết quả tung chỉ nằm trong trình duyệt của bạn, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Tung xúc xắc (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Cài đặt xúc xắc và kết quả tung chỉ được xử lý trong trình duyệt của bạn và không gửi đến máy chủ của chúng tôi. Tuy vậy, một số thông tin có thể được thu thập tự động khi bạn sử dụng, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần truy cập trước đây của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và đổi lựa chọn trong <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng theo ngày và theo ngôn ngữ (lượt xem, lượt tung, đánh giá sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang web.'],
      ['6. Ngày có hiệu lực', 'Chính sách này có hiệu lực từ ngày 9 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tung xúc xắc',
  },
};
