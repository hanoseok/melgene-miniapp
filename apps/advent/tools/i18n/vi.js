/* Lịch Advent — tiếng Việt (vi/)
 * Mẫu thiết kế, giới hạn ký tự, ngày và dạng link nằm trong advent-core.js; màn hình và canvas trong advent.js. File này chứa mọi chữ hiển thị.
 * Khóa kết thúc bằng Html được chèn nguyên HTML (chỉ <br> và <em>); nội dung privacy.sections cũng là HTML.
 * Màn hình bắt đầu chỉ để gợi tò mò (không có ô nhập, không có FAQ). FAQ chỉ ở màn hình kết thúc chung.
 * Giữ nguyên {name} {n} {day} {date} {title}. Số nhiều theo Intl.PluralRules (tiếng Việt chỉ có other).
 * ideas = lời nhắn viết trực tiếp bằng tiếng Việt (không phải bản dịch), mỗi câu tối đa 80 ký tự, khoảng 30 câu.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "'Be Vietnam Pro'",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Tạo lịch Advent online: 24 ô quà tặng",
    description: "Tạo lịch Advent (lịch đếm ngược Giáng sinh) miễn phí: giấu lời nhắn sau 24 ô cửa rồi gửi bằng link. Từ ngày 1/12, mỗi ngày mở được một ô. Không cần đăng ký.",
    ogTitle: "Tạo lịch Advent 🎄",
    ogDescription: "Giấu 24 lời nhắn nhỏ cho người thương. Tháng 12, mỗi ngày mở một ô."
  },
  siteName: "Lịch Advent",
  privacyLink: "Chính sách riêng tư",
  start: {
    badge: "🎄 Đếm ngược Giáng sinh",
    h1Kicker: "Tạo lịch Advent",
    h1Html: "24 ô cửa nhỏ,<br>mỗi ngày một <em>bất ngờ</em>",
    hook: "Giấu một lời nhắn sau mỗi ô cửa cho người bạn thương. Từ ngày 1/12, mỗi ngày họ mở được một ô.",
    start: "Tạo lịch ngay →"
  },
  editor: {
    title: "Điền lịch của bạn",
    themesAria: "Mẫu lịch",
    themes: {
      classic: "Cổ điển",
      snow: "Tuyết rơi",
      gold: "Vàng sao",
      candy: "Kẹo ngọt"
    },
    fields: {
      to: { label: "Gửi", placeholder: "VD: Minh Anh" },
      from: { label: "Từ", placeholder: "VD: Tuấn" }
    },
    daysLabel: "Lời nhắn sau các ô cửa",
    daysHint: "Mỗi ô tối đa 80 ký tự. Ô để trống sẽ giấu một món quà vặt nhỏ.",
    dayAria: "Lời nhắn ô {day}",
    diceAria: "Gợi ý ngẫu nhiên cho ô {day}",
    placeholder: "Viết lời nhắn…",
    counter: "Đã điền {n}/24 ô",
    fillAll: "🎲 Điền ô trống",
    preview: "👀 Xem trước",
    create: "Tạo link",
    needOne: "Hãy viết ít nhất một lời nhắn nhé."
  },
  ideas: [
    "Chào buổi sáng! Hôm nay là một ngày thật đẹp để được là chính cậu.",
    "Ly ca cao nóng tuần này tớ bao. Cậu chỉ cần chọn quán thôi.",
    "Thật may vì có cậu trong đời. Lời nhắn hôm nay chỉ vậy thôi.",
    "Bật bài hát yêu thích và nhảy một phút nhé. Bác sĩ dặn đấy.",
    "Nhớ hôm mình cười đến đau bụng không? Tớ vẫn hay nghĩ tới.",
    "Phiếu: một buổi xem phim, cậu chọn phim, đồ ăn vặt để tớ lo.",
    "Cậu dũng cảm hơn cậu nghĩ, và tốt bụng hơn cậu biết.",
    "Nhiệm vụ hôm nay: chụp một thứ làm cậu mỉm cười rồi gửi tớ xem.",
    "Nhắc nhẹ: uống một cốc nước và vươn vai một cái nào.",
    "Nếu hôm nay thấy dài, lời nhắn này là một cái ôm nhỏ.",
    "Ở cạnh cậu, ngày bình thường cũng vui như ngày nghỉ.",
    "Tối nay gọi điện nhé? Tớ muốn nghe cậu kể về hôm nay.",
    "Phiếu: một cái ôm, dùng lúc nào cũng được, không hết hạn.",
    "Hôm nay tự thưởng một món ngọt đi. Cậu xứng đáng mà.",
    "Đã đi được nửa chặng đến Giáng sinh! Cậu giỏi lắm.",
    "Ra ngoài một chút và ngước nhìn trời. Trời se lạnh đẹp lắm.",
    "Ba điều tớ thích ở cậu: tiếng cười, tấm lòng và playlist của cậu.",
    "Viết ra một điều tốt đẹp của năm nay. Của tớ là quen được cậu.",
    "Phiếu: tớ làm giúp một việc nhà cậu chọn, không than một câu.",
    "Cậu là thông báo tớ mong chờ nhất.",
    "Tối nay thắp một ngọn nến và ước một điều nhé.",
    "Nghỉ ngơi cũng là việc quan trọng. Hôm nay cứ thong thả thôi.",
    "Ngày mai lại gần Giáng sinh hơn hôm nay. Cố lên nào!",
    "Chúc cậu đêm Giáng sinh an lành! Cảm ơn vì cậu là cậu.",
    "Mình cùng chọn một việc vui để làm cùng nhau năm mới nhé.",
    "Tối nay cuộn mình trong chiếc chăn ấm nhất nhé.",
    "Sự thật thú vị: cậu là người rất dễ thương.",
    "Hôm nay gửi một tin nhắn dễ thương cho ai đó. Bắt đầu từ tớ cũng được.",
    "Dù xa đến đâu, cậu vẫn luôn ở gần trong tim tớ.",
    "Hôm nay là ngày ăn vặt: bánh quy, socola nóng, gì cũng được!"
  ],
  calendar: {
    heading: "Lịch Advent",
    forName: "Gửi {name}",
    forNone: "Một cuốn lịch Advent dành cho bạn",
    fromName: "Từ {name}",
    before: {
      other: "Ô đầu tiên sẽ mở vào ngày {date}. Còn {n} ngày nữa!"
    },
    during: "Hôm nay là ngày {date}. Mở ô của hôm nay nào!",
    after: "Giáng sinh đến rồi. Tất cả các ô đã mở.",
    locked: {
      other: "Ô {day} sẽ mở vào ngày {date}, còn {n} ngày nữa."
    },
    hint: "Chạm vào một ô để mở",
    doorAria: "Ô {day}",
    dayTitle: "Ngày {date}",
    treat: "Hôm nay không có lời nhắn, chỉ có một món quà vặt nhỏ cho bạn.",
    close: "Đóng",
    makeOwn: "🎄 Tự làm một cái"
  },
  preview: {
    badge: "👀 Chế độ xem trước",
    note: "Chỉ bạn thấy màn hình này. Mọi ô đều mở để bạn kiểm tra lời nhắn. Người nhận sẽ mở được mỗi ngày một ô.",
    back: "← Quay lại"
  },
  result: {
    eyebrowMine: "Lịch Advent của bạn đã xong!",
    eyebrowFriend: "Cuốn lịch làm riêng cho bạn",
    linkLabel: "Link lịch",
    copy: "Sao chép",
    copied: "Đã sao chép link!",
    copyFail: "Không sao chép được. Hãy chọn link rồi sao chép.",
    note: "Lời nhắn chỉ nằm trong link này. Ai có link cũng mở được từng ô khi đến ngày, nên chỉ gửi cho đúng người nhé.",
    save: "Lưu ảnh",
    saving: "Đang tạo ảnh…",
    saved: "Đã lưu ảnh!",
    saveFail: "Không tạo được ảnh. Hãy chụp màn hình nhé.",
    imageAlt: "Lịch Advent với 24 ô cửa đang đóng",
    preview: "Xem trước mọi ô",
    edit: "Sửa",
    retry: "Tạo thêm một lịch",
    retryFriend: "Tự làm một cái",
    shareTitle: "Lịch Advent",
    shareText: "Tớ làm cho cậu một cuốn lịch Advent 🎄 Từ 1/12 mỗi ngày mở một ô:",
    shareTextFriend: "Tạo lịch Advent tặng người bạn thương 🎄",
    fileName: "lich-advent"
  },
  og: {
    brand: "🎄 Lịch Advent",
    kicker: "Tạo lịch Advent",
    title: "24 ô cửa, mỗi ngày một bất ngờ",
    desc: "4 mẫu · lời nhắn sau mỗi ô · gửi bằng link"
  },
  faq: [
    {
      q: "Khi nào các ô mở ra?",
      a: "Theo ngày trên điện thoại hoặc máy tính của người nhận: ô 1 mở ngày 1/12, ô 2 mở ngày 2/12… cho đến ngày 24/12. Từ 25/12 đến 31/1 mọi ô đều mở, trước tháng 12 tất cả đều khóa."
    },
    {
      q: "Lời nhắn của tôi được lưu ở đâu?",
      a: "Chỉ nằm trong link. Nội dung bạn viết không được gửi lên máy chủ của chúng tôi, nên ai có link cũng đọc được lời nhắn khi ô mở. Hãy chỉ gửi cho đúng người."
    },
    {
      q: "Gửi link rồi có sửa lời nhắn được không?",
      a: "Không, vì lời nhắn nằm ngay trong link. Hãy sửa lịch, tạo link mới và gửi link đó thay thế."
    },
    {
      q: "Mở ô trống thì thấy gì?",
      a: "Một món quà vặt nhỏ của ngày hôm đó, như bánh quy, kẹo gậy hay ngôi sao. Bạn có thể điền hết, điền vài ô hoặc nhấn 🎲 để lấy gợi ý."
    }
  ],
  privacy: {
    title: "Chính sách riêng tư | Lịch Advent",
    description: "Chính sách riêng tư của Lịch Advent: cách xử lý lời nhắn, cookie, quảng cáo và thống kê ẩn danh.",
    h1: "Chính sách riêng tư",
    introHtml: "Lịch Advent (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.",
    sections: [
      [
        "1. Thông tin chúng tôi thu thập",
        "Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Tên và lời nhắn bạn nhập không bao giờ được gửi lên máy chủ. Khi soạn, chúng được lưu tạm trong trình duyệt (local storage), khi chia sẻ thì chỉ nằm trong link. Những ô đã mở chỉ được ghi nhớ trong trình duyệt của người nhận. Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả dưới đây."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie để hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Xem thêm và thay đổi tùy chọn tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số lịch được tạo, điểm sao). Những thông tin này không nhận diện được bạn và không chứa nội dung bạn viết."
      ],
      [
        "5. Link chia sẻ và hình ảnh",
        "Link tạo bằng Dịch vụ chứa lịch của bạn được mã hóa trong URL, nên ai có link cũng đọc được từng lời nhắn khi ô đó mở. Ảnh đã lưu chỉ có số của các ô và được tạo ngay trong trình duyệt. Vui lòng không ghi địa chỉ, số điện thoại hay thông tin cá nhân khác trong lời nhắn."
      ],
      [
        "6. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "7. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 17 tháng 11 năm 2026."
      ]
    ],
    back: "← Quay lại Lịch Advent"
  }
};
