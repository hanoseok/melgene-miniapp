/* Trang trí cây thông Noel — Tiếng Việt (/vi/). Cấu trúc khóa giống en.js. Giữ nguyên {name} {n} {max}.
 * Xưng "bạn" thân thiện. editor.presets là lời chúc viết riêng cho người Việt (tối đa 50 ký tự), không dịch từ tiếng Anh.
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
    title: "Trang trí cây thông Noel online",
    description: "Trang trí cây thông Noel online: chọn dáng cây, treo quả châu, ngôi sao, kẹo gậy, bật đèn nhấp nháy và tuyết rơi, rồi lưu ảnh hoặc gửi link cho bạn bè.",
    ogTitle: "Trang trí cây thông Noel 🎄",
    ogDescription: "Treo đồ trang trí, bật đèn lung linh và gửi cây thông của riêng bạn chỉ trong một phút."
  },
  siteName: "Trang trí cây thông Noel",
  privacyLink: "Chính sách quyền riêng tư",
  start: {
    badge: "🎄 Mùa Giáng sinh",
    h1Kicker: "Trang trí cây thông Noel",
    h1Html: "Cây thông Noel<br><em>lấp lánh của bạn</em>",
    hook: "Treo quả châu, kẹo gậy, bật đèn, cho tuyết rơi rồi gửi cây thông của bạn tới người bạn thương.",
    start: "Bắt đầu trang trí →"
  },
  editor: {
    title: "Trang trí cây thông",
    canvasAria: "Cây thông Noel của bạn. Chạm để treo món đồ đang chọn, kéo một món đồ để di chuyển.",
    hint: "Chạm vào cây để treo đồ · kéo để di chuyển",
    paletteLabel: "Đồ trang trí",
    kinds: {
      red: "Châu đỏ",
      gold: "Châu vàng",
      blue: "Châu xanh",
      purple: "Châu tím",
      silver: "Châu bạc",
      star: "Ngôi sao",
      bell: "Chuông",
      cane: "Kẹo gậy",
      gift: "Hộp quà",
      bow: "Nơ",
      sock: "Tất Noel",
      flake: "Bông tuyết",
      cookie: "Bánh quy",
      erase: "Cục tẩy"
    },
    undo: "Hoàn tác",
    clear: "Xóa hết",
    auto: "Ngẫu nhiên",
    count: "{n}/{max} món đồ",
    full: "Cây đã kín chỗ rồi! Hãy di chuyển hoặc xóa bớt một món trước nhé.",
    styleLabel: "Dáng cây",
    styles: {
      classic: "Cổ điển",
      snowy: "Phủ tuyết",
      nordic: "Bắc Âu",
      pink: "Màu hồng"
    },
    bgLabel: "Phông nền",
    bgs: {
      night: "Đêm đầy sao",
      cozy: "Phòng ấm áp",
      snowfield: "Đồi tuyết",
      red: "Đỏ rộn ràng"
    },
    topperLabel: "Đỉnh cây",
    toppers: {
      none: "Không",
      star: "Ngôi sao",
      angel: "Thiên thần",
      bow: "Nơ"
    },
    extrasLabel: "Thêm hiệu ứng",
    snow: "Tuyết",
    lights: "Đèn",
    fields: {
      name: {
        label: "Tên của bạn",
        placeholder: "VD: Minh Anh"
      },
      message: {
        label: "Lời nhắn",
        placeholder: "VD: Giáng sinh an lành!"
      }
    },
    ideas: "💡 Gợi ý",
    counter: "{n}/{max}",
    presets: [
      "Giáng sinh an lành nhé!",
      "Chúc cả nhà một mùa Noel ấm áp, vui vẻ!",
      "Noel này mình đi chơi phố đi bộ nhé? 🎄",
      "Chúc bạn mùa lễ hội thật lung linh!",
      "Năm mới bình an, vạn sự như ý!"
    ],
    done: "Xong cây thông"
  },
  card: {
    by: "Trang trí bởi {name}"
  },
  result: {
    eyebrowMine: "Cây thông của bạn đã xong!",
    eyebrowFriend: "{name} đã trang trí cây thông này tặng bạn",
    eyebrowFriendNoName: "Có người đã trang trí cây thông này tặng bạn",
    imageAlt: "Cây thông Noel được trang trí với {n} món đồ",
    save: "Lưu ảnh",
    saving: "Đang tạo ảnh…",
    saved: "Đã lưu ảnh!",
    saveFail: "Không tạo được ảnh. Bạn thử chụp màn hình nhé.",
    edit: "Trang trí tiếp",
    retry: "Trang trí cây mới",
    retryFriend: "Tự trang trí một cây",
    shareTitle: "Trang trí cây thông Noel",
    shareText: "{name} vừa trang trí một cây thông Noel 🎄 Xem thử nhé:",
    shareTextNoName: "Xem cây thông Noel mình vừa trang trí nè 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Trang trí cây thông Noel",
    defaultKicker: "Trang trí cây thông Noel",
    defaultTitle: "Cây thông lấp lánh của bạn",
    defaultDesc: "Đồ trang trí · đèn · tuyết · lưu hoặc chia sẻ"
  },
  faq: [
    {
      q: "Làm sao để treo đồ trang trí lên cây?",
      a: "Chọn một món ở hàng bên dưới cây, rồi chạm vào bất kỳ chỗ nào trên cây. Muốn dời một món, hãy nhấn giữ và kéo. Chọn cục tẩy để gỡ từng món, hoặc bấm Hoàn tác để quay lại bước trước."
    },
    {
      q: "Đã treo đồ rồi thì còn đổi được cây không?",
      a: "Được chứ. Bạn có thể đổi dáng cây, phông nền, món trên đỉnh và bật tắt tuyết hoặc đèn bất cứ lúc nào. Các món đồ vẫn nằm nguyên chỗ bạn đã treo."
    },
    {
      q: "Làm sao để lưu hoặc gửi cây thông?",
      a: "Bấm “Xong cây thông”. Nút “Lưu ảnh” tạo ảnh PNG 1080×1350, còn các nút chia sẻ sẽ gửi đi một đường link. Người mở link sẽ thấy cây thông của bạn với đèn nhấp nháy và có thể tự trang trí một cây khác."
    },
    {
      q: "Cây thông của mình được lưu ở đâu?",
      a: "Đồ trang trí, tên và lời nhắn chỉ nằm trong đường link và, trong lúc bạn trang trí, trên trình duyệt của chính bạn. Chúng không bao giờ được gửi lên máy chủ của chúng tôi, nên ai có link cũng xem được."
    }
  ],
  privacy: {
    title: "Chính sách quyền riêng tư | Trang trí cây thông Noel",
    description: "Chính sách quyền riêng tư của Trang trí cây thông Noel: cách xử lý cây thông, tên và lời nhắn của bạn, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách quyền riêng tư",
    introHtml: "Trang trí cây thông Noel (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Cây thông, tên và lời nhắn bạn nhập không bao giờ được gửi lên máy chủ. Chúng chỉ nằm trong trình duyệt của bạn (bản nháp được lưu trong bộ nhớ cục bộ khi bạn đang trang trí) và trong đường link khi bạn chia sẻ. Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả bên dưới."
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
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số cây đã hoàn thành, điểm đánh giá sao). Những dữ liệu này không xác định danh tính của bạn và không chứa tên hay lời nhắn của bạn."
      ],
      [
        "5. Đường link và hình ảnh được chia sẻ",
        "Đường link tạo bằng nút “Chia sẻ” chứa cây thông của bạn được mã hóa trong URL, nên ai có link cũng xem được. Ảnh lưu về được tạo ngay trong trình duyệt của bạn. Vui lòng không ghi địa chỉ, số điện thoại hay thông tin cá nhân khác vào lời nhắn."
      ],
      [
        "6. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ với người vận hành trang web."
      ],
      [
        "7. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 5 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Trang trí cây thông Noel"
  }
};
