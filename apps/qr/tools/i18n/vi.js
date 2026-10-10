/* Tạo mã QR — Tiếng Việt (/vi/)
 * Bộ mã hóa nằm trong qr-core.js; tệp này chứa mọi chữ hiển thị của ngôn ngữ này. Cấu trúc khóa giống en.js.
 * Giữ nguyên {bytes} {v} {n} {ratio} {value}.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tạo mã QR miễn phí – link, Wi-Fi, PNG, SVG',
    description: 'Tạo mã QR miễn phí cho link, văn bản, Wi-Fi, email và số điện thoại. Chọn màu, mức sửa lỗi, kích thước rồi tải PNG hoặc SVG. Không cần đăng ký, chạy ngay trong trình duyệt.',
    ogTitle: 'Tạo mã QR 🔳 miễn phí, không cần đăng ký',
    ogDescription: 'Tạo mã QR cho link, Wi-Fi, email, số điện thoại trong vài giây. Dữ liệu không rời trình duyệt.',
  },
  siteName: 'Tạo mã QR',
  privacyLink: 'Chính sách bảo mật',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'Tạo mã QR',
    h1Html: 'Gõ là có ngay<br><em>mã QR</em> của bạn',
    hook: 'Link, văn bản, Wi-Fi, email hay số điện thoại thành mã QR ngay khi bạn gõ. Miễn phí, không cần đăng ký, tạo ngay trong trình duyệt của bạn.',
  },

  ui: {
    typeLabel: 'Mã QR sẽ chứa gì?',
    types: { link: 'Link', text: 'Chữ', wifi: 'Wi-Fi', email: 'Email', phone: 'Gọi' },
    link: { label: 'Địa chỉ trang web', placeholder: 'example.com/menu' },
    text: { label: 'Nội dung', placeholder: 'Ghi chú, mã số, lời nhắn ngắn…' },
    wifi: {
      ssid: 'Tên mạng (SSID)', ssidPh: 'MyHomeWiFi',
      password: 'Mật khẩu', passwordPh: 'Mật khẩu Wi-Fi',
      security: 'Bảo mật',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (cũ)', nopass: 'Không mật khẩu' },
      hidden: 'Mạng ẩn',
    },
    email: { to: 'Địa chỉ email', toPh: 'ten@example.com', subject: 'Tiêu đề (tùy chọn)', subjectPh: 'Xin chào', body: 'Nội dung (tùy chọn)', bodyPh: 'Viết lời nhắn…' },
    phone: { label: 'Số điện thoại', placeholder: '0912 345 678' },

    previewLabel: 'Xem trước mã QR',
    previewReady: 'Xem trước mã QR, phiên bản {v}',
    emptyPreview: 'Mã QR sẽ hiện ở đây khi bạn gõ',
    info: '{bytes} byte · phiên bản {v} · {n}×{n} ô',
    encodes: 'Nội dung: {value}',
    tooLong: 'Quá dài cho một mã QR. Hãy rút gọn hoặc chọn mức sửa lỗi thấp hơn (L).',
    encodeFail: 'Không tạo được mã QR này. Hãy thử sửa nội dung.',
    warnContrast: 'Độ tương phản thấp ({ratio}:1), máy quét có thể khó đọc. Nên dùng mã màu đậm trên nền sáng.',
    warnInverted: 'Mã màu sáng trên nền tối. Một số ứng dụng quét không đọc được mã đảo màu.',
    warnQuiet: 'Lề trống hẹp có thể khiến khó quét. Nên chừa ít nhất 2 ô (chuẩn là 4).',

    downloadPng: 'Tải PNG',
    downloadSvg: 'Tải SVG',
    copyImage: 'Sao chép ảnh',
    savedPng: 'Đã lưu PNG. Hãy thử quét bằng điện thoại trước khi in.',
    savedSvg: 'Đã lưu SVG. In khổ lớn vẫn sắc nét.',
    copied: 'Đã sao chép ảnh. Dán vào tài liệu hoặc khung chat nhé.',
    copyFail: 'Không thể sao chép ảnh ở đây. Hãy dùng Tải PNG.',
    saveFail: 'Lưu không thành công. Vui lòng thử lại.',

    options: '🎨 Màu, kích thước và sửa lỗi',
    colors: 'Màu',
    fg: 'Mã',
    bg: 'Nền',
    resetColors: 'Đặt lại',
    ecc: 'Mức sửa lỗi',
    eccHint: 'Mức cao chịu được trầy xước và logo tốt hơn nhưng mã dày hơn. Thường chọn M là đủ.',
    size: 'Kích thước ảnh',
    margin: 'Lề trống (quiet zone)',
    marginHint: 'Viền trống quanh mã, tính bằng ô. Chuẩn là 4.',
    localNote: '🔒 Tạo ngay trong trình duyệt. Nội dung bạn gõ không bao giờ được gửi lên máy chủ.',
  },

  result: {
    doneTitle: 'Mã QR đã sẵn sàng ✓',
    doneText: 'Hãy thử quét bằng camera điện thoại trước khi in hoặc chia sẻ. Sửa các ô phía trên bất cứ lúc nào để tạo mã mới.',
    again: 'Tạo mã QR khác',
    shareTitle: 'Tạo mã QR – miễn phí, ngay trên trình duyệt',
    shareText: 'Tạo mã QR cho link, Wi-Fi hay văn bản trong vài giây, ngay trên trình duyệt 🔳',
  },

  og: {
    brand: '🔳 Tạo mã QR',
    kicker: 'Link · Wi-Fi · Văn bản · PNG/SVG',
    title: 'Tạo mã QR trong vài giây',
    desc: 'Miễn phí, riêng tư, ngay trên trình duyệt',
  },

  faq: [
    { q: 'Nội dung tôi gõ có bị gửi đi đâu không?', a: 'Không. Mã QR được tính bằng JavaScript ngay trong trình duyệt, nên link, mật khẩu Wi-Fi và lời nhắn không bao giờ tới máy chủ. Chúng cũng không được lưu lại; đóng trang là mất.' },
    { q: 'Mã QR có hết hạn không?', a: 'Không. Đây là mã QR tĩnh: nội dung nằm ngay trong họa tiết, không có link chuyển hướng hay link theo dõi ở giữa. Mã đã in vẫn dùng được miễn là link hoặc mạng Wi-Fi còn tồn tại.' },
    { q: 'Mã QR Wi-Fi hoạt động thế nào?', a: 'Mã lưu tên mạng, mật khẩu và kiểu bảo mật theo định dạng chuẩn WIFI:. Camera iPhone và Android sẽ hỏi có muốn kết nối không, nên khách không phải gõ mật khẩu.' },
    { q: 'Nên chọn mức sửa lỗi nào?', a: 'Hầu hết trường hợp chọn M (khôi phục khoảng 15%). Chọn Q hoặc H nếu in trên bề mặt thô, dễ trầy hoặc đặt logo ở giữa. Chọn L để mã nhỏ nhất khi nội dung dài và chỉ hiển thị trên màn hình.' },
    { q: 'PNG hay SVG?', a: 'PNG là ảnh thông thường cho website, tin nhắn và tài liệu. SVG là tệp vector, phóng to bao nhiêu cũng sắc nét, rất hợp cho poster, tờ rơi và gửi nhà in.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Tạo mã QR',
    description: 'Chính sách bảo mật của Tạo mã QR: nội dung bạn gõ chỉ nằm trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Tạo mã QR ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Link, văn bản, thông tin Wi-Fi, địa chỉ email và số điện thoại bạn nhập chỉ được chuyển thành mã QR trong trình duyệt của bạn, không được gửi lên máy chủ và không được lưu. Một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần bạn truy cập trang này và trang khác trước đó. Xem thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số mã đã tạo, đánh giá sao). Nội dung mã QR của bạn không bao giờ nằm trong thống kê, và không dữ liệu nào nhận diện cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành trang web.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 11 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tạo mã QR',
  },
};
