/* Tạo giấy khen — Tiếng Việt (vi/). Cấu trúc khóa giống en.js; xem ghi chú đầu en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "'Be Vietnam Pro'",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Tạo giấy khen online: giấy khen vui miễn phí",
    description: "Tạo giấy khen online: ghi tên giải và lý do, chọn khung và con dấu để có giấy khen vui nhộn hay giấy cảm ơn ấm áp. Lưu ảnh A4 hoặc gửi link mở lễ trao giải.",
    ogTitle: "Tạo giấy khen 🏆",
    ogDescription: "Làm giấy khen vui hoặc cảm động trong 1 phút và trao tặng bằng một đường link."
  },
  siteName: "Tạo giấy khen",
  privacyLink: "Chính sách bảo mật",
  start: {
    badge: "🏆 Mùa trao giải cuối năm",
    h1Kicker: "Tạo giấy khen",
    h1Html: "Chắc chắn có ai đó<br>xứng đáng <em>được khen</em>",
    hook: "Đặt tên giải, ghi lý do rồi gửi link mở ra như một lễ trao giải thật sự.",
    start: "Tạo giấy khen →"
  },
  editor: {
    title: "Thiết kế giấy khen",
    themesAria: "Mẫu giấy khen",
    themes: {
      gold: "Khung vàng",
      pastel: "Pastel dễ thương",
      minimal: "Tối giản",
      ribbon: "Ruy băng cổ điển"
    },
    previewAria: "Xem trước giấy khen",
    examplesAria: "Gợi ý tên giải",
    sealLabel: "Con dấu",
    seals: {
      none: "Không",
      red: "Dấu đỏ",
      gold: "Huy chương"
    },
    fields: {
      title: {
        label: "Tên giải",
        placeholder: "VD: Nhân viên chăm chỉ nhất năm"
      },
      to: {
        label: "Trao cho",
        placeholder: "VD: Minh Anh"
      },
      reason: {
        label: "Lý do",
        placeholder: "Vì đã…"
      },
      date: {
        label: "Ngày"
      },
      issuer: {
        label: "Người trao",
        placeholder: "VD: Hội ăn vặt phòng 3"
      }
    },
    titleExamples: [
      "Chăm chỉ nhất năm",
      "Đại sứ chia đồ ăn vặt",
      "Cây hài của nhóm",
      "Vua thả tim"
    ],
    dice: "🎲 Ngẫu nhiên",
    counter: "{n}/{max}",
    reasons: [
      "Vì đã giữ cho nhóm chat luôn rộn ràng với những chiếc meme chất lượng suốt cả năm.",
      "Vì luôn tươi cười chào mọi người kể cả sáng thứ Hai, làm cả tuần sáng bừng.",
      "Vì hào phóng chia đồ ăn vặt trong ngăn bàn, lo trọn khoản nạp năng lượng cho cả team.",
      "Vì luôn là người đầu tiên nói “để mình làm” và người cuối cùng dọn dẹp.",
      "Vì cười thật to với cả những câu đùa nhạt nhất, cứu vãn không biết bao lần im lặng.",
      "Vì nhớ sinh nhật và cả món cà phê yêu thích của từng người.",
      "Vì bình tĩnh tuyệt đối trước máy in kẹt giấy, kẹt xe và bánh mì cháy.",
      "Vì đã nhường miếng bánh cuối cùng dù chẳng ai biết.",
      "Vì dù hay lạc đường nhưng lần nào cũng tìm ra quán ngon.",
      "Vì luôn ở bên cạnh những lúc mệt mỏi. Xin trao giải này với lòng biết ơn.",
      "Vì dũng cảm thử món mới đầu tiên để mọi người khỏi phải liều.",
      "Vì cả năm qua đã chứng minh: có bạn ở đâu, ở đó ấm áp."
    ],
    done: "Hoàn thành giấy khen"
  },
  card: {
    heading: "GIẤY KHEN",
    defaultTitle: "Giải xuất sắc",
    presented: "Trân trọng trao tặng",
    name: "{name}",
    closing: "Vậy xin trao tặng giấy khen này để ghi nhận và cảm ơn.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Lễ trao giải",
    forName: "Giấy khen dành cho {name}",
    forNone: "Giấy khen dành riêng cho bạn",
    hint: "Chạm vào cuộn giấy để mở ra",
    open: "Mở giấy khen"
  },
  result: {
    eyebrowMine: "Giấy khen đã xong!",
    eyebrowFriend: "Chúc mừng {name}!",
    eyebrowFriendNoName: "Chúc mừng bạn!",
    imageAlt: "Giấy khen: {title}",
    save: "Lưu ảnh",
    saving: "Đang tạo ảnh…",
    saved: "Đã lưu ảnh!",
    saveFail: "Không tạo được ảnh. Hãy thử chụp màn hình nhé.",
    edit: "Sửa",
    retry: "Tạo giấy khen khác",
    retryFriend: "Mình cũng làm",
    shareTitle: "Tạo giấy khen",
    shareText: "{name} có một giấy khen 🏆 Mở lễ trao giải tại đây:",
    shareTextNoName: "Có người trao giấy khen cho bạn 🏆 Mở lễ trao giải tại đây:",
    fileName: "giay-khen"
  },
  og: {
    brand: "🏆 Tạo giấy khen",
    defaultKicker: "Tạo giấy khen",
    defaultTitle: "Chắc chắn có ai đó xứng đáng được khen",
    defaultDesc: "4 mẫu · con dấu · ảnh A4 hoặc link trao giải",
    sampleTitle: "Cây hài của nhóm"
  },
  faq: [
    {
      q: "Tạo giấy khen như thế nào?",
      a: "Chọn 1 trong 4 mẫu, ghi tên giải, tên người nhận và lý do, rồi chọn ngày, người trao và con dấu. Bản xem trước đổi ngay khi bạn gõ. Ưng rồi thì chạm “Hoàn thành giấy khen”."
    },
    {
      q: "Ảnh lưu về có kích thước bao nhiêu?",
      a: "“Lưu ảnh” tạo file PNG 1240×1754, cùng tỉ lệ giấy A4, in ra rất gọn và gửi qua chat vẫn nét. Trên điện thoại sẽ mở bảng chia sẻ, trên máy tính sẽ tải về ngay."
    },
    {
      q: "Người mở link sẽ thấy gì?",
      a: "Một lễ trao giải nho nhỏ: cuộn giấy hiện ra, chạm vào là giấy khen có tên họ mở ra. Tiêu đề và ngày hiển thị bằng ngôn ngữ của họ, và họ cũng có thể tự làm một giấy khen."
    },
    {
      q: "Nội dung mình viết được lưu ở đâu?",
      a: "Chỉ trong đường link và trong trình duyệt của bạn. Nội dung không được gửi lên máy chủ, nên ai có link cũng đọc được. Chỉ gửi cho người bạn muốn trao nhé."
    }
  ],
  privacy: {
    title: "Chính sách bảo mật | Tạo giấy khen",
    description: "Chính sách bảo mật của Tạo giấy khen: cách xử lý nội dung bạn nhập, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách bảo mật",
    introHtml: "Tạo giấy khen (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Tên giải, tên người, lý do và ngày bạn nhập không bao giờ được gửi lên máy chủ. Chúng chỉ nằm trong trình duyệt của bạn (bản nháp được lưu tạm trong bộ nhớ cục bộ khi chỉnh sửa) và trong URL khi bạn chia sẻ. Một số thông tin có thể được thu thập tự động như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie để hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần truy cập trước của bạn vào trang này và các trang khác. Xem thêm và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số giấy khen hoàn thành, đánh giá sao). Những dữ liệu này không nhận dạng được bạn và không chứa nội dung bạn viết."
      ],
      [
        "5. Link chia sẻ và hình ảnh",
        "Link tạo bằng “Chia sẻ” chứa nội dung giấy khen được mã hóa trong URL, ai có link cũng xem được. Ảnh lưu về được tạo ngay trong trình duyệt. Đừng ghi địa chỉ, số điện thoại hay thông tin cá nhân khác lên giấy khen."
      ],
      [
        "6. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ đơn vị vận hành trang web."
      ],
      [
        "7. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 15 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Tạo giấy khen"
  }
};
