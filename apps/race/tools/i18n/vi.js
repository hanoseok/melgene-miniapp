/* Đua thú bốc thăm — tiếng Việt. Cấu trúc khóa giống en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Đua thú bốc thăm – cuộc đua ngẫu nhiên online',
    description: 'Bốc thăm bằng cuộc đua thú: nhập 2 đến 10 tên, mỗi người có một con thú chạy trên làn riêng. Về nhất thắng, hoặc về chót bao cà phê. Ngẫu nhiên công bằng, miễn phí, không cần đăng ký.',
    ogTitle: 'Đua thú bốc thăm 🏁 Ai bao cà phê?',
    ogDescription: 'Nhập tên, đưa các con thú vào vạch xuất phát và để cuộc đua quyết định. Về nhất thắng, hoặc về chót trả tiền.',
  },
  siteName: 'Đua thú bốc thăm',
  privacyLink: 'Chính sách quyền riêng tư',

  hero: {
    h1Kicker: 'Đua thú bốc thăm',
    h1Html: 'Không chọn được?<br><em>Để các con thú chạy đua</em>',
    hook: 'Ai bao cà phê? Ai đi trước? Cho mọi người vào làn rồi cùng xem đua.',
  },

  ui: {
    modeLabel: 'Quyết định thế nào?',
    modeWin: '🏆 Về nhất thắng',
    modeLose: '☕ Về chót bao',
    countLabel: 'Số người đua',
    countValue: '{n} người',
    less: 'Bớt người đua',
    more: 'Thêm người đua',
    namesLabel: 'Ai tham gia?',
    namesHint: 'Làn để trống sẽ dùng tên mặc định. Con thú chỉ để vui, không ảnh hưởng cơ hội của ai cả.',
    playerN: 'Người chơi {n}',
    nameAria: 'Tên ở làn {n}',
    start: 'Xuất phát! 🏁',
    fair: 'Thứ tự về đích được bốc thăm công bằng bằng crypto trước khi xuất phát · tên chỉ lưu trên máy này',
    trackAria: 'Đường đua',
    go: 'CHẠY!',
    bannerWin: '🏆 Ai về đích đầu tiên thì thắng',
    bannerLose: '☕ Ai về đích cuối cùng thì bao',
    liveStart: 'Ba, hai, một, chạy! Cuộc đua bắt đầu.',
  },

  errors: {
    tooFew: 'Cần ít nhất 2 người đua.',
    tooMany: 'Đường đua chỉ chứa tối đa 10 người.',
    badLink: 'Liên kết bị hỏng nên không tải được tên.',
  },

  result: {
    winKicker: 'Người thắng là',
    winTitle: '{name} thắng! 🏆',
    winSub: 'Về đích đầu tiên.',
    loseKicker: 'Về đích cuối cùng',
    loseTitle: '{name} về chót',
    loseSub: 'Xui quá! Chầu cà phê này {name} bao nhé ☕',
    rankingTitle: 'Thứ tự về đích',
    tagWin: 'Thắng',
    tagLose: 'Bao ☕',
    edit: 'Đổi tên',
    shareNames: 'Sao chép liên kết với các tên này',
    linkCopied: 'Đã sao chép liên kết. Mở ra là đúng những người đua này, sẵn sàng chạy.',
    sharedNote: 'Đã tải người đua từ liên kết chia sẻ. Sẵn sàng thì xuất phát!',
    history: 'Các cuộc đua gần đây',
    historyClear: 'Xóa',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} người',
    liveWin: '{name} thắng cuộc đua.',
    liveLose: '{name} về đích cuối cùng.',
    again: 'Đua lại 🏁',
    shareTitle: 'Đua thú bốc thăm',
    shareText: 'Không chọn được? Để các con thú chạy đua quyết định 🏁',
  },

  og: {
    brand: '🏁 Đua thú bốc thăm',
    kicker: 'Bốc thăm bằng cuộc đua · 2 đến 10 người',
    title: 'Để các con thú chạy đua quyết định',
    desc: 'Về nhất thắng, hoặc về chót bao cà phê',
  },

  faq: [
    { q: 'Cuộc đua có thật sự ngẫu nhiên và công bằng?', a: 'Có. Ngay khi bạn bấm xuất phát, toàn bộ thứ tự về đích được bốc bằng bộ sinh số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues), lấy mẫu loại bỏ và xáo trộn Fisher–Yates. Mọi thứ tự đều có cơ hội như nhau; cuộc đua trên màn hình chỉ diễn lại kết quả đó.' },
    { q: 'Con thú hay làn chạy có ảnh hưởng cơ hội không?', a: 'Không. Các con thú được chia theo làn chỉ cho vui. Ở đây thỏ không nhanh hơn rùa, và làn 1 có cơ hội y như làn 10.' },
    { q: 'Sao lần nào về đích cũng sát nút vậy?', a: 'Để thêm hồi hộp. Sau khi bốc thứ tự, hoạt ảnh thêm những pha bứt tốc, vấp ngã và cho vị trí quan trọng về sát nút, là hạng nhất hoặc hạng chót tùy chế độ. Phần diễn không bao giờ đổi thứ tự.' },
    { q: 'Có gửi cùng nhóm người đua cho bạn bè được không?', a: 'Được. Nút “Sao chép liên kết với các tên này” chỉ đưa tên và chế độ vào liên kết, không có kết quả. Người mở sẽ chạy một cuộc đua mới. Kết quả gần đây chỉ lưu trên máy này.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Đua thú bốc thăm',
    description: 'Chính sách quyền riêng tư của Đua thú bốc thăm: tên và kết quả chỉ ở trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Đua thú bốc thăm (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin thu thập', 'Dịch vụ dùng được mà không cần tài khoản hay đăng nhập. Tên bạn nhập chỉ được xử lý trong trình duyệt và không gửi về máy chủ của chúng tôi. Danh sách tên gần nhất và 10 kết quả gần đây có thể được lưu trong bộ nhớ cục bộ của trình duyệt trên thiết bị của bạn. Khi bạn sao chép liên kết có tên, các tên đó nằm trong chính liên kết và chỉ đến những người bạn gửi.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để nhớ ngôn ngữ và cài đặt, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong muốn.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên những lần bạn truy cập trang này và các trang khác trước đó. Tìm hiểu thêm và thay đổi lựa chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số cuộc đua bắt đầu và kết thúc, điểm sao). Không thông tin nào trong đó nhận diện được bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người quản lý trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 22 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Đua thú bốc thăm',
  },
};
