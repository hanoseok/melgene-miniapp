/* Tạo nickname — Tiếng Việt (bạn). words: theo phong cách { adj, noun } (danh từ trước, tính từ sau). Xem en.js */
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
    title: 'Tạo nickname – Tên dễ thương, ngầu',
    description: 'Chưa nghĩ ra nickname? Chọn phong cách (dễ thương, ngầu, hài hước, mơ màng), thêm tên của bạn nếu muốn và nhận ngay một nickname ngẫu nhiên. Không ưng thì tạo lại, rồi sao chép. Miễn phí.',
    ogTitle: 'Tạo nickname ✨ Tên dễ thương, ngầu',
    ogDescription: 'Chọn phong cách, thêm tên và sao chép nickname chỉ với một chạm.',
  },
  siteName: 'Tạo nickname',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🏷️ Bí ý tưởng đặt tên?',
    h1Kicker: 'Tạo nickname',
    h1Html: 'Tìm nickname<br>thật <em>hợp với bạn</em>',
    hook: 'Chọn một phong cách, thêm tên của bạn nếu thích, rồi nhận nickname làm riêng cho bạn.',
    facts: 'Dễ thương, ngầu, hài, mơ màng · trộn cả tên bạn · sao chép một chạm',
    start: 'Tạo nickname ngay →',
  },

  make: {
    title: 'Bạn thích phong cách nào?',
    moodLabel: 'Chọn phong cách',
    moods: { cute: 'Dễ thương', cool: 'Ngầu', funny: 'Hài hước', dreamy: 'Mơ màng', mystic: 'Bí ẩn' },
    nameLabel: 'Tên hoặc chữ cái của bạn (không bắt buộc)',
    nameHint: 'Sẽ được trộn vào nickname. Tối đa 12 ký tự, chỉ nằm trong trình duyệt của bạn.',
    namePlaceholder: 'vd. Linh',
    numbers: '＋ Thêm số',
    poolCount: 'Số cách kết hợp của phong cách này: {n}+',
    make: 'Tạo nickname 🎲',
  },

  result: {
    title: 'Nickname của bạn',
    copy: 'Sao chép nickname',
    copied: 'Đã sao chép!',
    copyFail: 'Không sao chép được. Hãy chọn nickname rồi sao chép thủ công.',
    again: 'Tạo cái khác',
    change: 'Đổi phong cách',
    shareTitle: 'Tạo nickname',
    shareText: 'Trang tạo nickname vừa cho mình “{nick}” ✨',
  },

  style: { camel: true, order: 'noun-adj', nameSep: '_' },

  words: {
    cute: {
      adj: ['bông xù', 'mềm mại', 'bé xíu', 'ngọt ngào', 'ôm ấp', 'lấp lánh', 'tròn xoe', 'ấm áp', 'mũm mĩm', 'tí hon', 'vui vẻ', 'đáng yêu'],
      noun: ['thỏ', 'mèo con', 'cún con', 'gấu trúc', 'mochi', 'kẹo dẻo', 'cupcake', 'vịt con', 'trái đào', 'bánh flan', 'koala', 'sóc nhỏ'],
    },
    cool: {
      adj: ['neon', 'tốc độ', 'im lặng', 'nhanh nhẹn', 'băng giá', 'nguyên tử', 'hoang dã', 'nửa đêm', 'ánh bạc', 'hoàng gia', 'tia chớp', 'rực lửa'],
      noun: ['sói', 'chim ưng', 'rắn độc', 'tay đua', 'lưỡi kiếm', 'bão tố', 'hổ', 'sao chổi', 'titan', 'đại bàng', 'ninja', 'kỵ sĩ'],
    },
    funny: {
      adj: ['buồn ngủ', 'cáu kỉnh', 'lảo đảo', 'vụng về', 'lén lút', 'mập ú', 'ngố', 'ướt sũng', 'điên rồ', 'lười biếng', 'hay giận', 'đói bụng'],
      noun: ['khoai tây', 'bún', 'dưa muối', 'bánh quế', 'cánh cụt', 'lạc đà', 'bánh mì', 'thịt viên', 'hải mã', 'bánh tráng', 'yêu tinh', 'hamster'],
    },
    dreamy: {
      adj: ['đầy sao', 'mây trời', 'sương mờ', 'nhung lụa', 'ánh trăng', 'pastel', 'lơ lửng', 'lung linh', 'mượt mà', 'mờ ảo', 'vàng óng', 'thanh bình'],
      noun: ['mặt trăng', 'đám mây', 'cực quang', 'bụi sao', 'bài ru', 'chân trời', 'cánh hoa', 'thiên hà', 'lời thì thầm', 'giấc mơ', 'bình minh', 'đồng cỏ'],
    },
    mystic: {
      adj: ['trống rỗng', 'bí ẩn', 'che khuất', 'u ám', 'đen huyền', 'hoàng hôn', 'bị ám', 'ẩn giấu', 'bị lãng quên', 'độc ác', 'tro tàn', 'bí mật'],
      noun: ['quạ', 'bóng ma', 'nhà tiên tri', 'câu đố', 'mật mã', 'oan hồn', 'bóng tối', 'nhân sư', 'di vật', 'rune', 'than hồng', 'đêm khuya'],
    },
  },

  og: {
    brand: '🏷️ Tạo nickname',
    kicker: 'Chọn phong cách · nhận tên',
    title: 'Tìm nickname thật hợp với bạn',
    desc: 'Dễ thương, ngầu, hài, mơ màng · trộn cả tên bạn · sao chép một chạm',
  },

  faq: [
    { q: 'Công cụ tạo nickname hoạt động thế nào?', a: 'Bạn chọn một phong cách, nếu muốn thì nhập tên hoặc vài chữ cái rồi bấm tạo. Công cụ ghép một danh từ và một tính từ từ danh sách từ của phong cách đó, đồng thời trộn các chữ cái bạn nhập vào nếu có.' },
    { q: 'Nickname có thật sự ngẫu nhiên không?', a: 'Có. Các từ được bốc bằng bộ tạo số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues), nên mọi từ trong danh sách đều có cơ hội như nhau. Hiệu ứng chữ nhấp nháy trước khi ra kết quả chỉ để trang trí.' },
    { q: 'Mình có thể thêm tên của mình không?', a: 'Được, tối đa 12 ký tự: tên, chữ viết tắt hay chữ cái bất kỳ. Nội dung bạn nhập chỉ dùng trong trình duyệt này, không được gửi đi đâu và cũng không được lưu.' },
    { q: 'Người khác có thể nhận cùng nickname không?', a: 'Có thể, vì mỗi phong cách chỉ có vài trăm cách kết hợp. Nếu game hay dịch vụ báo nickname đã có người dùng, hãy tạo cái khác hoặc bật “Thêm số”.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Tạo nickname',
    description: 'Chính sách quyền riêng tư của Tạo nickname: tên bạn nhập chỉ nằm trong trình duyệt, cookie, quảng cáo và thống kê truy cập.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Tạo nickname (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Tên hoặc chữ cái bạn nhập và phong cách bạn chọn chỉ được xử lý trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi. Tuy nhiên, một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và phong cách bạn chọn gần nhất, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong phần cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần truy cập trước đây của bạn vào trang web này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi lựa chọn trong <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng theo ngày và ngôn ngữ (lượt xem, số nickname đã tạo, điểm sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có thắc mắc về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang web.'],
      ['6. Ngày có hiệu lực', 'Chính sách này có hiệu lực từ ngày 5 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tạo nickname',
  },
};
