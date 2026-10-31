/* Làm thiệp Giáng sinh — Tiếng Việt (/vi/). Cấu trúc khóa giống en.js. Giữ nguyên {name} {greeting} {n} {max}. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "'Be Vietnam Pro'",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Làm thiệp Giáng sinh online, gửi bằng link",
    description: "Làm thiệp Giáng sinh online: chọn chủ đề và lời chúc, ghi tên cùng vài lời ấm áp, rồi lưu thành ảnh hoặc gửi link mở ra như một phong thư thật.",
    ogTitle: "Làm thiệp Giáng sinh 🎄",
    ogDescription: "Làm một tấm thiệp Giáng sinh ấm áp trong một phút và gửi cho người bạn thương."
  },
  siteName: "Thiệp Giáng sinh",
  privacyLink: "Chính sách quyền riêng tư",
  start: {
    badge: "🎄 Đặc biệt mùa lễ",
    h1Kicker: "Làm thiệp Giáng sinh",
    h1Html: "Gửi chút ấm áp<br><em>mùa Giáng sinh</em>",
    hook: "Chọn một mẫu xinh xắn, viết vài lời từ trái tim và gửi tấm thiệp mở ra như phong thư thật.",
    start: "Làm thiệp ngay →"
  },
  editor: {
    title: "Trang trí thiệp",
    themesAria: "Mẫu thiệp",
    themes: {
      classic: "Cổ điển",
      snowy: "Đêm tuyết",
      golden: "Ánh vàng",
      cute: "Dễ thương",
      minimal: "Tối giản",
      forest: "Rừng đông"
    },
    previewAria: "Xem trước thiệp",
    greetingsLabel: "Lời chúc",
    decoLabel: "Trang trí",
    decos: {
      snow: "Tuyết",
      lights: "Đèn",
      sparkle: "Lấp lánh"
    },
    fields: {
      to: {
        label: "Gửi đến",
        placeholder: "VD: Mẹ yêu"
      },
      from: {
        label: "Người gửi",
        placeholder: "VD: Minh Anh"
      },
      message: {
        label: "Lời nhắn",
        placeholder: "Viết vài lời ấm áp…"
      }
    },
    ideas: "💡 Gợi ý",
    counter: "{n}/{max}",
    presets: [
      "Cảm ơn bạn vì đã luôn ở bên suốt một năm qua. Chúc bạn Giáng sinh thật ấm áp và vui vẻ!",
      "Chúc cả nhà một mùa Noel an lành, đầm ấm và tràn ngập tiếng cười.",
      "Dù ở xa nhưng lòng vẫn luôn nhớ. Hẹn sớm gặp lại để cùng ăn một bữa thật ngon nhé!",
      "Một năm vất vả rồi! Nghỉ ngơi thật nhiều và đón năm mới thật rực rỡ nhé.",
      "Chúc bạn năm mới sức khỏe dồi dào, công việc suôn sẻ và luôn hạnh phúc."
    ],
    defaultGreeting: "merry",
    done: "Hoàn thành thiệp"
  },
  card: {
    greetings: {
      merry: "Giáng sinh an lành!",
      holidays: "Mùa lễ vui vẻ!",
      newyear: "Chúc mừng năm mới!",
      seasons: "Năm mới bình an"
    },
    to: "Gửi {name},",
    from: "Thương mến, {name}"
  },
  open: {
    eyebrow: "Bạn nhận được một tấm thiệp Giáng sinh",
    fromName: "từ {name}",
    fromNone: "từ một người luôn nghĩ đến bạn",
    open: "Mở thiệp"
  },
  result: {
    eyebrowMine: "Thiệp của bạn đã xong!",
    eyebrowFriend: "Thiệp từ {name}",
    eyebrowFriendNoName: "Tấm thiệp dành cho bạn",
    imageAlt: "Thiệp Giáng sinh: {greeting}",
    save: "Lưu ảnh",
    saving: "Đang tạo ảnh…",
    saved: "Đã lưu ảnh!",
    saveFail: "Không tạo được ảnh. Bạn hãy chụp màn hình nhé.",
    copyText: "Sao chép chữ",
    copied: "Đã sao chép!",
    copyFail: "Không sao chép được. Thử lại nhé.",
    edit: "Sửa",
    retry: "Làm thêm thiệp khác",
    retryFriend: "Tôi cũng làm thiệp",
    shareTitle: "Làm thiệp Giáng sinh",
    shareText: "{name} gửi bạn một tấm thiệp Giáng sinh 🎄 Mở xem nhé:",
    shareTextNoName: "Có một tấm thiệp Giáng sinh gửi bạn 🎄 Mở xem nhé:",
    fileName: "christmas-card"
  },
  og: {
    brand: "🎄 Làm thiệp Giáng sinh",
    defaultKicker: "Làm thiệp Giáng sinh",
    defaultTitle: "Gửi chút ấm áp mùa Giáng sinh",
    defaultDesc: "6 mẫu thiệp · lưu ảnh · gửi bằng link",
    cardGreeting: "Giáng sinh an lành!"
  },
  faq: [
    {
      q: "Làm thiệp như thế nào?",
      a: "Chọn mẫu và lời chúc, bật hoặc tắt tuyết, đèn, lấp lánh, rồi ghi người nhận, người gửi và lời nhắn. Bản xem trước đổi ngay khi bạn gõ, ưng rồi thì bấm “Hoàn thành thiệp”."
    },
    {
      q: "Có lưu thiệp thành ảnh được không?",
      a: "Được. “Lưu ảnh” tạo file PNG 1080×1350, gửi Zalo hay đăng story đều đẹp. Trên điện thoại sẽ mở bảng chia sẻ, trên máy tính sẽ tải về luôn."
    },
    {
      q: "Người mở link sẽ thấy gì?",
      a: "Họ sẽ thấy một phong thư dán kín, chạm để mở và tấm thiệp hiện ra, lời chúc hiển thị bằng ngôn ngữ của họ. Người nhận cũng có thể tự làm thiệp của mình ngay."
    },
    {
      q: "Lời nhắn của tôi được lưu ở đâu?",
      a: "Chỉ nằm trong link chia sẻ và trong trình duyệt của bạn khi đang soạn, không gửi lên máy chủ. Nhưng ai có link cũng đọc được, nên chỉ gửi cho người bạn muốn."
    }
  ],
  privacy: {
    title: "Chính sách quyền riêng tư | Thiệp Giáng sinh",
    description: "Chính sách quyền riêng tư của Thiệp Giáng sinh: cách xử lý nội dung thiệp, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách quyền riêng tư",
    introHtml: "Thiệp Giáng sinh (sau đây gọi là “Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu như mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ dùng được mà không cần tài khoản hay đăng nhập. Tên và lời nhắn bạn nhập không được gửi lên máy chủ mà chỉ nằm trong trình duyệt của bạn (khi soạn, bản nháp được lưu trong bộ nhớ trình duyệt; khi chia sẻ, nội dung nằm trong link). Một số thông tin dưới đây có thể được thu thập tự động trong quá trình sử dụng."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie để hiển thị quảng cáo và phân tích cách sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần truy cập trước của bạn. Xem chi tiết và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày và theo ngôn ngữ (lượt xem, số thiệp hoàn thành, điểm đánh giá). Những dữ liệu này không xác định danh tính của bạn và không chứa lời nhắn."
      ],
      [
        "5. Link chia sẻ và hình ảnh",
        "Link tạo bằng nút “Chia sẻ” chứa nội dung thiệp được mã hóa trong địa chỉ, nên ai có link cũng xem được. Ảnh được tạo ngay trong trình duyệt của bạn. Bạn nên tránh ghi địa chỉ, số điện thoại hay thông tin cá nhân khác trong lời nhắn."
      ],
      [
        "6. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành Dịch vụ."
      ],
      [
        "7. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 1 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Thiệp Giáng sinh"
  }
};
