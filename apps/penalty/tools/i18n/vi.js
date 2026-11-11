/* Bốc hình phạt (Penalty Card Flip) — Tiếng Việt (/vi/ ; ngôn ngữ lấy từ cookie hoặc cài đặt đã lưu)
 * Logic nằm ở penalty-core.js; mọi chữ hiển thị nằm trong file này. Khóa kết thúc bằng Html có thể chứa HTML (chỉ <br>, <em>, <a>).
 * Màn hình: bắt đầu (lời dẫn + nút bắt đầu + quảng cáo) → cài đặt (số người, số lá phạt, nội dung phạt, tên) → lật bài (lá úp) → kết thúc (ai bị phạt + màn hình kết thúc chung).
 * FAQ chỉ hiện ở màn hình kết thúc chung. Giữ nguyên các ký hiệu {n} {k}.
 */
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
    title: 'Bốc hình phạt tiệc nhậu – lật bài chọn người bị phạt',
    description: 'Trò lật bài chọn hình phạt miễn phí cho tiệc tùng và nhậu. Chọn số người và số lá phạt, rồi lật từng lá úp để xem ai bị phạt. Không cần đăng ký.',
    ogTitle: 'Bốc hình phạt 🃏 Lật bài, chọn người bị phạt',
    ogDescription: 'Bốc hình phạt tiệc công bằng, xáo bài ngay trên trình duyệt.',
  },
  siteName: 'Bốc hình phạt',
  privacyLink: 'Chính sách quyền riêng tư',

  hero: {
    h1Kicker: 'Bốc hình phạt',
    h1Html: 'Lật từng lá bài<br><em>chọn người bị phạt</em>',
    hook: 'Mỗi người một lá úp. Vài lá giấu hình phạt, còn lại an toàn. Lượt này ai sẽ dính phạt?',
  },

  ui: {
    playersLabel: 'Số người chơi',
    playersDec: 'Bớt một người',
    playersInc: 'Thêm một người',
    penaltyLabel: 'Số lá phạt',
    penaltyDec: 'Bớt một lá phạt',
    penaltyInc: 'Thêm một lá phạt',
    penaltyHint: 'Mặc định khoảng một phần ba số người. Bạn có thể đổi.',
    itemsLabel: 'Nội dung phạt',
    itemsHint: 'Mỗi dòng một hình phạt. Các lá phạt lấy ngẫu nhiên, không theo thứ tự, từ danh sách này. Cứ sửa thoải mái.',
    itemsPh: 'Hát một bài\nNâng ly chúc mừng',
    resetItems: 'Khôi phục hình phạt mẫu',
    itemsCount: '{count} dòng',
    namesBtn: '+ Thêm tên người chơi (tùy chọn)',
    namesLabel: 'Tên, theo thứ tự lật',
    namesPh: 'Minh\nHoa\nTuấn',
    namesHint: 'Để trống thì hiện là "người 1, người 2, người 3". Ít tên hơn số người cũng được.',
    start: 'Xáo bài 🃏',
    begin: 'Bắt đầu',
    setupTitle: 'Cài đặt',
    fair: 'Xáo một lần bằng số ngẫu nhiên an toàn · không có dữ liệu nào rời khỏi trình duyệt',
  },

  errors: {
    playersRange: 'Hãy chọn từ 2 đến 12 người chơi.',
    penaltiesRange: 'Số lá phạt phải từ 1 đến bằng số người chơi.',
    itemsEmpty: 'Hãy viết ít nhất một hình phạt.',
    itemsTooMany: 'Tối đa 30 hình phạt.',
    namesTooMany: 'Số tên nhiều hơn số người chơi. Hãy bớt tên hoặc thêm người chơi.',
    badLink: 'Liên kết kết quả này bị hỏng hoặc thiếu, nên không hiển thị được gì.',
  },

  draw: {
    progress: 'Đã lật {done}/{n} lá',
    left: 'Còn {n} lá',
    turn: 'Lượt tiếp theo: {who}',
    turnNum: 'Lượt thứ {k}',
    numbered: 'Người {k}',
    pick: 'Chạm vào lá úp bất kỳ. Tất cả các lá đã được xếp sẵn từ lúc xáo bài.',
    gridAria: 'Các lá phạt úp',
    cardAria: 'Lá {k}, úp',
    penaltyTag: 'Bị phạt!',
    safeTag: 'An toàn',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} an toàn lần này',
    revealNone: 'Chạm vào một lá để xem kết quả ở đây.',
    flipAll: 'Lật tất cả',
    reshuffle: 'Xáo lại',
    seeResults: 'Xem kết quả',
    done: 'Đã lật hết các lá.',
    live: '{who}: {text}',
    liveSafe: '{who}: an toàn',
  },

  result: {
    heading: 'Ai bị phạt',
    sharedBadge: '🃏 Kết quả được chia sẻ',
    sharedNote: 'Đây là kết quả được lưu trong liên kết. Không xáo lại.',
    summary: '{k} phạt · {s} an toàn',
    summaryMany: '{k} người bị phạt · {s} người an toàn',
    listHead: 'Ai bị phạt gì',
    safeList: 'An toàn: {names}',
    copy: 'Sao chép dạng chữ',
    copied: 'Đã sao chép kết quả',
    copyLink: 'Sao chép liên kết',
    linkCopied: 'Đã sao chép liên kết. Ai mở ra cũng thấy đúng kết quả này.',
    again: 'Tôi cũng thử',
    edit: 'Đổi cài đặt',
    textTitle: '🃏 Kết quả Bốc hình phạt',
    textSafe: 'an toàn',
    shareTitle: 'Bốc hình phạt',
    shareText: 'Lật bài và bốc hình phạt cho buổi tiệc nào 🃏',
  },

  og: {
    brand: '🃏 Bốc hình phạt',
    kicker: 'Hình phạt tiệc tùng · lật từng lá',
    title: 'Lật bài để chọn hình phạt',
    desc: 'Ngẫu nhiên, công bằng, xong trong vài giây',
    sample: 'Hát một bài',
  },

  defaults: [
    'Hát một bài (chỉ cần đoạn điệp khúc)',
    'Nâng ly chúc mừng bằng một câu',
    'Làm một tư thế thật dễ thương',
    'Rót nước cho người ngồi bên trái',
    'Nhảy robot trong 10 giây',
    'Giới thiệu lại bản thân thêm một câu',
    'Mở bài hát do người bên phải chọn',
    'Kể một câu đùa về chính mình',
    'Đọc câu tiếp theo bằng giọng lồng tiếng trailer phim',
    'Đoán đúng ngay lần đầu bài hát yêu thích của người tiếp theo',
  ],

  faq: [
    { q: 'Xáo bài có thật sự công bằng không?', a: 'Có. Khi xáo, các lá được sắp một lần bằng bộ sinh số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues), dùng kỹ thuật loại mẫu và xáo Fisher–Yates. Mọi lá được cố định ngay lúc đó, nên chạm vào lá nào cũng có cơ hội như nhau.' },
    { q: 'Nội dung phạt được chọn thế nào?', a: 'Mỗi lá phạt lấy một dòng trong danh sách theo thứ tự ngẫu nhiên. Nếu danh sách ít dòng hơn số lá phạt, danh sách đã xáo sẽ được dùng lại. Hãy sửa nội dung cho hợp với nhóm trước khi xáo.' },
    { q: 'Có được từ chối hình phạt không?', a: 'Có. Hình phạt chỉ để vui, và luôn là tự nguyện. Nếu ai không muốn làm, cả nhóm có thể đổi sang một hình phạt nhẹ nhàng hơn.' },
    { q: 'Làm sao chia sẻ kết quả cho cả nhóm?', a: 'Ở màn hình kết quả, chạm "Sao chép dạng chữ" để dán danh sách vào nhóm chat, hoặc "Sao chép liên kết". Liên kết lưu đúng kết quả này, ai mở ra cũng thấy cùng các lá và không bị xáo lại.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Bốc hình phạt',
    description: 'Chính sách quyền riêng tư của Bốc hình phạt: tên, nội dung phạt và kết quả chỉ nằm trên trình duyệt của bạn; giải thích về cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Bốc hình phạt ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Tên người chơi, nội dung phạt và kết quả bạn nhập chỉ được xử lý trong trình duyệt của bạn và không gửi về máy chủ của chúng tôi. Cài đặt gần nhất của bạn được lưu trong bộ nhớ cục bộ của trình duyệt trên thiết bị và bạn có thể xóa bất cứ lúc nào. Khi bạn sao chép liên kết kết quả, tên, nội dung phạt và kết quả được ghi trực tiếp vào liên kết và chỉ người bạn gửi mới xem được.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và cài đặt, hiển thị quảng cáo và hiểu cách dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt, khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phát quảng cáo dựa trên các lần bạn truy cập trước đây vào trang này và các trang khác. Tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp của riêng mình, chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số lượt chơi bắt đầu và kết thúc). Không có dữ liệu nào nhận dạng được cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có thắc mắc về chính sách này, vui lòng liên hệ người vận hành trang web.'],
      ['6. Ngày có hiệu lực', 'Chính sách này có hiệu lực từ ngày 11 tháng 11 năm 2026.'],
    ],
    back: '← Quay lại Bốc hình phạt',
  },
};
