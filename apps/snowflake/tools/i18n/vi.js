/* Tạo bông tuyết — Tiếng Việt (bản /vi/). Cùng khóa với en.js. Viết tự nhiên như người Việt, không dịch word-by-word.
 * Khóa kết thúc bằng Html được chèn nguyên văn (chỉ <br> và <em>). */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "'Be Vietnam Pro'",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Tạo bông tuyết trực tuyến · Snowflake Maker",
    description: "Tự tạo bông tuyết đối xứng của riêng bạn ngay trên web. Chỉnh số nhánh, độ chi tiết và độ dài, chọn hình dạng và màu, rồi lưu ảnh PNG 1080 × 1080 hoặc chia sẻ liên kết.",
    ogTitle: "Tạo một bông tuyết ❄️",
    ogDescription: "Chỉ vài lần chạm là bông tuyết sáu cánh đối xứng hiện ra. Lưu lại hoặc gửi cho bạn bè xem."
  },
  siteName: "Snowflake Maker",
  privacyLink: "Chính sách bảo mật",
  start: {
    badge: "❄️ Đặc biệt mùa đông",
    h1Kicker: "Tạo bông tuyết trực tuyến",
    h1Html: "Nuôi lớn một bông tuyết<br><em>chỉ thuộc về riêng bạn</em>",
    hook: "Chạm vài lần và xem bông tuyết đối xứng hoàn hảo từ từ hình thành. Lưu thành ảnh hoặc gửi liên kết cho bạn bè nhé.",
    start: "Bắt đầu tạo →"
  },
  editor: {
    title: "Tạo bông tuyết của bạn",
    canvasAria: "Xem trước bông tuyết của bạn",
    labels: {
      arms: "Số nhánh mỗi bên",
      complexity: "Độ chi tiết",
      size: "Độ dài nhánh"
    },
    levels: {
      complexity: ["Đơn giản", "Vừa", "Chi tiết"],
      size: ["Ngắn", "Vừa", "Dài"]
    },
    buttons: {
      newFlake: "Bông tuyết mới",
      shape: "Đổi hình dạng",
      color: "Đổi màu",
      save: "Lưu PNG",
      share: "Chia sẻ",
      done: "Xong rồi, xem kết quả"
    },
    shapes: {
      needle: "Kim nhỏ",
      plate: "Phiến lục giác",
      spike: "Gai nhọn",
      feather: "Lông vũ"
    },
    palettes: ["Xanh băng", "Trắng sương", "Tím oải hương", "Vàng nửa đêm", "Bạc hà"],
    status: {
      copied: "Đã sao chép liên kết!",
      copyFail: "Không sao chép được liên kết. Hãy thử lưu PNG.",
      shared: "Đã chia sẻ!",
      saving: "Đang tạo ảnh…",
      saved: "Đã lưu ảnh!",
      saveFail: "Không tạo được ảnh. Bạn thử chụp màn hình nhé."
    }
  },
  result: {
    eyebrowMine: "Bông tuyết của bạn đã sẵn sàng!",
    eyebrowFriend: "Một người bạn đã tạo bông tuyết này cho bạn",
    save: "Lưu PNG",
    edit: "Tiếp tục tạo",
    retry: "Tạo bông tuyết mới",
    retryFriend: "Tạo bông của tôi",
    shareTitle: "Snowflake Maker",
    shareText: "Xem bông tuyết tôi vừa tạo nè ❄️ Mở liên kết để xem nhé:",
    fileName: "bong-tuyet"
  },
  og: {
    brand: "❄️ Snowflake Maker",
    defaultKicker: "Tạo bông tuyết trực tuyến",
    defaultTitle: "Nuôi lớn một bông tuyết của riêng bạn",
    defaultDesc: "Sáu cánh đối xứng · hình dạng · màu sắc · lưu hoặc chia sẻ"
  },
  faq: [
    {
      q: "Làm bông tuyết như thế nào?",
      a: "Chạm “Bông tuyết mới” để có một hình mới, rồi dùng ba thanh trượt để chỉnh số nhánh, độ chi tiết và độ dài nhánh. Mỗi bông tuyết là một nhánh được xoay sáu lần và lật đối xứng, nên lúc nào cũng cân đối."
    },
    {
      q: "Nút đổi hình dạng và đổi màu dùng để làm gì?",
      a: "“Đổi hình dạng” thay đổi cách vẽ các nhánh (kim nhỏ, phiến lục giác, gai nhọn hoặc lông vũ) và giữ nguyên bố cục. “Đổi màu” thay đổi màu nền và màu nét. Bạn có thể thử cả hai trên cùng một bông."
    },
    {
      q: "Làm sao để lưu hoặc chia sẻ bông tuyết?",
      a: "Chạm “Lưu PNG” để tải ảnh 1080 × 1080. “Chia sẻ” tạo liên kết có chứa các thiết lập của bạn, nên ai mở liên kết cũng thấy đúng bông tuyết đó."
    },
    {
      q: "Bông tuyết của tôi có được lưu ở đâu không?",
      a: "Không. Bông tuyết chỉ nằm trong ảnh và liên kết. Khi lưu hoặc chia sẻ, nội dung bạn tạo không được tải lên máy chủ của chúng tôi."
    }
  ],
  privacy: {
    title: "Chính sách bảo mật | Snowflake Maker",
    description: "Chính sách bảo mật của Snowflake Maker: cách xử lý bông tuyết của bạn, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách bảo mật",
    introHtml: "Snowflake Maker (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu được mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Thiết lập bông tuyết của bạn không bao giờ được gửi lên máy chủ. Chúng chỉ nằm trong trình duyệt của bạn và trong liên kết khi bạn chia sẻ. Một số thông tin có thể được thu thập tự động trong khi bạn sử dụng Dịch vụ, như mô tả dưới đây."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie để hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi nếu bạn làm vậy."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên lần truy cập trước đó của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số bông tuyết đã hoàn thành). Dữ liệu này không nhận diện được cá nhân bạn."
      ],
      [
        "5. Liên kết và ảnh đã chia sẻ",
        "Liên kết tạo bằng “Chia sẻ” chứa thiết lập bông tuyết của bạn trong URL, vì vậy ai có liên kết cũng thấy cùng bông tuyết đó. Ảnh đã lưu được tạo ngay trong trình duyệt của bạn và không được tải lên máy chủ của chúng tôi."
      ],
      [
        "6. Liên hệ",
        "Nếu có thắc mắc về Chính sách bảo mật này, vui lòng liên hệ với đơn vị vận hành trang web."
      ],
      [
        "7. Ngày có hiệu lực",
        "Chính sách này có hiệu lực từ ngày 11 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Snowflake Maker"
  }
};
