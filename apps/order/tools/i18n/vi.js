/* Bốc thăm thứ tự — Tiếng Việt (/vi/). Cấu trúc khóa giống en.js (xem phần đầu en.js). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@800&display=swap',
    display: "'Be Vietnam Pro'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Bốc thăm thứ tự – sắp xếp danh sách ngẫu nhiên',
    description: 'Bốc thăm thứ tự miễn phí: dán danh sách tên hoặc dùng số 1 đến N để xếp thứ tự thuyết trình, lượt chơi hay lịch trực nhật thật công bằng. Không cần đăng ký.',
    ogTitle: 'Bốc thăm thứ tự 🔢 Ai đi trước?',
    ogDescription: 'Xáo danh sách tên thành một thứ tự công bằng rồi lật từng thẻ.',
  },
  siteName: 'Bốc thăm thứ tự',
  privacyLink: 'Chính sách bảo mật',

  hero: {
    h1Kicker: 'Bốc thăm thứ tự',
    h1Html: 'Ai đi <em>trước?</em>',
    hook: 'Nhập tên, xáo một lần là có ngay thứ tự từ người đầu tiên đến người cuối cùng.',
  },

  ui: {
    presetLabel: 'Thứ tự này để làm gì?',
    modeLabel: 'Tên hoặc số',
    modeNames: 'Tên',
    modeNumbers: 'Số 1–N',
    namesLabel: 'Tên, mỗi dòng một người',
    namesPh: 'Minh Anh\nGia Huy\nBảo Ngọc\nĐức Anh',
    namesHint: 'Có thể dán danh sách từ Zalo hay Excel. Dấu phẩy cũng tách tên.',
    namesCount: '{n} / {max}',
    clear: 'Xóa',
    numbersLabel: 'Đến số mấy?',
    numbersDec: 'Bớt một',
    numbersInc: 'Thêm một',
    numbersHint: 'Xáo các số từ 1 đến N. Tiện khi xếp theo số báo danh hay số ghế.',
    numberItem: 'Số {n}',
    fromLabel: 'Lật thứ tự',
    fromFirst: 'Từ số 1',
    fromLast: 'Từ cuối',
    shuffle: 'Bốc thăm thứ tự 🔀',
    fair: 'Xáo một lần bằng số ngẫu nhiên mật mã · tên không rời khỏi trình duyệt',
  },

  presets: [
    { label: 'Thứ tự thường', heading: 'Thứ tự ngẫu nhiên' },
    { label: 'Thuyết trình', heading: 'Thứ tự thuyết trình' },
    { label: 'Lượt chơi', heading: 'Thứ tự lượt chơi' },
    { label: 'Trực nhật', heading: 'Lịch trực nhật' },
  ],

  errors: {
    namesFew: 'Hãy nhập ít nhất 2 tên, mỗi dòng một tên, hoặc chuyển sang số.',
    namesMany: 'Tối đa 40 tên.',
    numbersRange: 'Hãy chọn một số từ 2 đến 40.',
    badLink: 'Liên kết này bị hỏng hoặc thiếu nên không thể hiển thị.',
  },

  reveal: {
    progress: 'Đã lật {k}/{n}',
    tapHint: 'Chạm vào thẻ hoặc bấm “Tiếp”. Thứ tự đã được chốt lúc xáo.',
    first: 'Lật thẻ ▶',
    next: 'Tiếp ▶',
    done: 'Xem toàn bộ thứ tự',
    auto: 'Tự động lật',
    autoStop: 'Tạm dừng',
    showAll: 'Xem hết',
    soFar: 'Đã lật',
    live: 'Số {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Thứ tự được chia sẻ',
    sharedNote: 'Đây là thứ tự lưu trong liên kết, không xáo lại.',
    summary: 'Tổng cộng {n}, từ đầu đến cuối',
    copy: 'Sao chép dạng chữ',
    copied: 'Đã sao chép thứ tự',
    copyLink: 'Sao chép liên kết',
    linkCopied: 'Đã sao chép liên kết. Ai mở cũng thấy đúng thứ tự này.',
    linkTooLong: 'Danh sách quá dài để đưa vào liên kết nên chỉ sao chép địa chỉ trang.',
    edit: 'Sửa tên',
    again: 'Xáo lại 🔀',
    againShared: 'Xáo lại / Tự bốc 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Bốc thăm thứ tự',
    shareText: 'Đây là thứ tự của nhóm mình, bốc thăm ngẫu nhiên 🔢',
  },

  og: {
    brand: '🔢 Bốc thăm thứ tự',
    kicker: 'Thuyết trình · trò chơi · trực nhật',
    title: 'Ai đi trước? Bốc thăm thật công bằng',
    desc: 'Nhập tên, có thứ tự chỉ trong vài giây',
  },

  faq: [
    { q: 'Thứ tự có thật sự công bằng không?', a: 'Có. Khi bạn bấm xáo, trình duyệt dùng bộ sinh số ngẫu nhiên mật mã (crypto.getRandomValues) với lấy mẫu loại bỏ và thuật toán xáo Fisher–Yates, nên mọi thứ tự đều có xác suất như nhau. Toàn bộ thứ tự được chốt lúc đó, việc lật thẻ chỉ để hiển thị.' },
    { q: 'Khác gì với bốc thăm trúng thưởng?', a: 'Bốc thăm trúng thưởng dừng lại sau một cái tên. Ở đây ai cũng có một vị trí từ đầu đến cuối, rất hợp để xếp thứ tự thuyết trình, lượt chơi, lượt phát biểu hay lịch trực nhật.' },
    { q: 'Nên lật từ số 1 hay từ cuối?', a: 'Lật từ số 1 nhanh gọn khi mọi người cần chuẩn bị ngay. Lật từ cuối hồi hộp hơn vì người số 1 chỉ lộ diện ở cuối cùng.' },
    { q: 'Tên có bị lưu hay gửi đi đâu không?', a: 'Không. Tên chỉ nằm trong trình duyệt của bạn. Danh sách gần nhất được lưu trên thiết bị này để dùng lại, và liên kết chia sẻ chỉ mang thứ tự đến người bạn gửi.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Bốc thăm thứ tự',
    description: 'Chính sách bảo mật của Bốc thăm thứ tự: tên và thứ tự chỉ ở trong trình duyệt, cùng cookie, quảng cáo và thống kê.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Bốc thăm thứ tự ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Tên hoặc số bạn nhập và thứ tự sau khi xáo chỉ được xử lý trong trình duyệt, không gửi lên máy chủ của chúng tôi. Danh sách gần nhất được lưu trong bộ nhớ cục bộ của trình duyệt trên thiết bị của bạn. Khi bạn sao chép liên kết, thứ tự được ghi vào chính liên kết và chỉ chia sẻ với người bạn gửi.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và cài đặt, hiển thị quảng cáo và hiểu cách dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và trang khác trước đây. Tìm hiểu thêm và thay đổi lựa chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, lượt bắt đầu và hoàn thành). Không thông tin nào nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 15 tháng 11 năm 2026.'],
    ],
    back: '← Quay lại Bốc thăm thứ tự',
  },
};
