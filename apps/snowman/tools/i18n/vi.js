/* Đắp người tuyết — Tiếng Việt (/vi/). Cấu trúc khóa giống en.js; giữ nguyên {name} {n} {max}.
 * Xưng "bạn" thân thiện. namePresets là tên người tuyết viết riêng cho người Việt, không dịch từ tiếng Anh.
 */
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
    title: "Đắp người tuyết online – Dễ thương trong 1 phút",
    description: "Đắp người tuyết online: xếp các quả cầu tuyết, chọn mắt, mũi cà rốt, mũ, khăn và tay, đặt tên rồi lưu ảnh hoặc gửi link cho bạn bè.",
    ogTitle: "Đắp người tuyết ⛄",
    ogDescription: "Lăn tuyết, xếp cầu, mặc đồ cho người tuyết của riêng bạn trong một phút rồi gửi cho bạn bè."
  },
  siteName: "Đắp người tuyết",
  privacyLink: "Chính sách quyền riêng tư",
  start: {
    badge: "⛄ Đặc biệt mùa đông",
    h1Kicker: "Đắp người tuyết online",
    h1Html: "Lăn tuyết, xếp cầu<br><em>đắp người tuyết</em>",
    hook: "Không cần găng tay. Chọn từng bộ phận, ngắm tuyết rơi rồi gửi người tuyết của bạn cho ai đó đang cần một nụ cười.",
    start: "Bắt đầu đắp →"
  },
  editor: {
    title: "Đắp người tuyết của bạn",
    canvasAria: "Xem trước người tuyết của bạn trong khung cảnh mùa đông",
    stepOf: "Bước {n}/{max}",
    steps: {
      body: "Thân",
      face: "Mặt",
      nose: "Mũi",
      hat: "Mũ",
      scarf: "Khăn",
      arms: "Tay",
      extras: "Phụ kiện",
      scene: "Nền",
      name: "Tên"
    },
    labels: {
      body: "Quả cầu tuyết",
      eyes: "Mắt",
      mouth: "Miệng",
      nose: "Mũi",
      hat: "Mũ",
      scarf: "Màu khăn",
      pattern: "Họa tiết",
      arms: "Tay",
      extras: "Phụ kiện (chọn nhiều)",
      scene: "Phông nền",
      name: "Đặt tên (tùy chọn)"
    },
    bodies: {
      classic: "Cổ điển",
      duo: "Hai cầu",
      chubby: "Tròn mập",
      slim: "Cao gầy"
    },
    eyes: {
      coal: "Than đen",
      buttons: "Cúc áo",
      sparkly: "Lấp lánh",
      sleepy: "Buồn ngủ"
    },
    mouths: {
      pebbles: "Sỏi nhỏ",
      smile: "Mỉm cười",
      grin: "Cười toe",
      oh: "Ồ!"
    },
    noses: {
      carrot: "Cà rốt",
      long: "Cà rốt dài",
      berry: "Quả mọng",
      pinecone: "Quả thông"
    },
    hats: {
      top: "Mũ chóp",
      beanie: "Mũ len",
      santa: "Mũ Noel",
      bucket: "Mũ xô",
      earmuffs: "Bịt tai",
      none: "Không mũ"
    },
    scarves: {
      red: "Đỏ",
      green: "Xanh lá",
      blue: "Xanh dương",
      yellow: "Vàng",
      purple: "Tím",
      none: "Không khăn"
    },
    patterns: {
      solid: "Trơn",
      stripes: "Kẻ sọc",
      dots: "Chấm bi"
    },
    arms: {
      twigs: "Cành cây",
      mittens: "Găng tay",
      wave: "Vẫy tay",
      none: "Không tay"
    },
    extras: {
      broom: "Chổi",
      buttons: "Cúc áo",
      bird: "Chim nhỏ",
      flakes: "Lấp lánh"
    },
    scenes: {
      night: "Đêm tuyết",
      sunny: "Nắng đẹp",
      village: "Làng lên đèn"
    },
    random: "Ngẫu nhiên",
    back: "← Quay lại",
    next: "Tiếp →",
    done: "Xong người tuyết",
    namePlaceholder: "VD: Bông Gòn",
    ideas: "💡 Gợi ý",
    counter: "{n}/{max}",
    namePresets: [
      "Bông Gòn",
      "Ú Tròn",
      "Tuyết Nhỏ",
      "Cu Lạnh",
      "Mochi"
    ]
  },
  card: {
    named: "Đây là {name}!"
  },
  result: {
    eyebrowMine: "Người tuyết của bạn đã xong!",
    eyebrowFriend: "Có người đắp {name} dành riêng cho bạn",
    eyebrowFriendNoName: "Có người đắp một người tuyết dành riêng cho bạn",
    revealHint: "Người tuyết vẫn còn phủ đầy tuyết mới…",
    reveal: "❄️ Phủi tuyết đi",
    imageAlt: "Một người tuyết trong khung cảnh mùa đông",
    save: "Lưu ảnh",
    saving: "Đang tạo ảnh…",
    saved: "Đã lưu ảnh!",
    saveFail: "Không tạo được ảnh. Bạn thử chụp màn hình nhé.",
    edit: "Đắp tiếp",
    retry: "Đắp người tuyết mới",
    retryFriend: "Tự đắp người tuyết",
    shareTitle: "Đắp người tuyết",
    shareText: "Giới thiệu {name}, người tuyết mình vừa đắp ⛄ Xem thử nhé:",
    shareTextNoName: "Xem người tuyết mình vừa đắp nè ⛄",
    fileName: "nguoi-tuyet"
  },
  og: {
    brand: "⛄ Đắp người tuyết",
    defaultKicker: "Đắp người tuyết online",
    defaultTitle: "Lăn tuyết, xếp cầu, mặc đồ cho người tuyết",
    defaultDesc: "Mũ · khăn · tuyết rơi · lưu hoặc chia sẻ"
  },
  faq: [
    {
      q: "Đắp người tuyết như thế nào?",
      a: "Đi lần lượt qua các bước dưới bức tranh: quả cầu tuyết, khuôn mặt, mũi, mũ, khăn, tay, phụ kiện và phông nền. Chạm vào một lựa chọn để thử, người tuyết sẽ thay đổi ngay. Bạn có thể nhảy qua lại giữa các bước bất cứ lúc nào."
    },
    {
      q: "Nút “Ngẫu nhiên” làm gì?",
      a: "Nút này chọn ngẫu nhiên một bộ kết hợp cho mọi bộ phận. Bạn cứ bấm đến khi ưng ý, rồi chỉnh tay từng chi tiết nếu muốn."
    },
    {
      q: "Làm sao để lưu hoặc gửi người tuyết?",
      a: "Chạm “Xong người tuyết”. “Lưu ảnh” tạo ra ảnh PNG 1080×1350, còn các nút chia sẻ sẽ gửi một đường link. Ai mở link sẽ phủi tuyết để gặp người tuyết của bạn và có thể tự đắp một người khác."
    },
    {
      q: "Người tuyết của tôi được lưu ở đâu?",
      a: "Các lựa chọn và tên chỉ nằm trong đường link và, trong lúc bạn đắp, trong trình duyệt của chính bạn. Chúng không bao giờ được gửi lên máy chủ của chúng tôi, nên ai có link đều xem được."
    }
  ],
  privacy: {
    title: "Chính sách quyền riêng tư | Đắp người tuyết",
    description: "Chính sách quyền riêng tư của Đắp người tuyết: cách xử lý người tuyết và tên của bạn, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách quyền riêng tư",
    introHtml: "Đắp người tuyết (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Người tuyết và tên bạn nhập không bao giờ được gửi lên máy chủ. Chúng chỉ nằm trong trình duyệt của bạn (bản nháp được lưu trong bộ nhớ cục bộ khi bạn đang đắp) và trong đường link khi bạn chia sẻ. Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả bên dưới."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách mọi người sử dụng Dịch vụ. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang web khác trước đó. Xem chi tiết và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số người tuyết đã hoàn thành, điểm đánh giá sao). Những dữ liệu này không xác định danh tính của bạn và không chứa tên người tuyết của bạn."
      ],
      [
        "5. Đường link và hình ảnh được chia sẻ",
        "Đường link tạo bằng nút “Chia sẻ” chứa người tuyết của bạn được mã hóa trong URL, nên ai có link cũng xem được. Ảnh lưu về được tạo ngay trong trình duyệt của bạn. Vui lòng không ghi địa chỉ, số điện thoại hay thông tin cá nhân khác vào phần tên."
      ],
      [
        "6. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ với người vận hành trang web."
      ],
      [
        "7. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 9 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Đắp người tuyết"
  }
};
