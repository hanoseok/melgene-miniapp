/* Chia đội ngẫu nhiên — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Nunito có đủ dấu tiếng Việt.
 */
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
    title: 'Chia đội ngẫu nhiên - Chia nhóm online công bằng',
    description: 'Chia đội ngẫu nhiên: dán danh sách tên, chọn số đội hoặc số người mỗi đội rồi chia nhóm công bằng, các đội chênh nhau tối đa 1 người. Đội trưởng tách riêng, chia sẻ kết quả bằng link. Miễn phí, không cần đăng ký.',
    ogTitle: 'Chia đội ngẫu nhiên 🎲 Chia nhóm online',
    ogDescription: 'Dán tên, bấm trộn, vài giây là có đội công bằng — gửi đúng kết quả đó bằng link.',
  },
  siteName: 'Chia đội ngẫu nhiên',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🎲 Hết cãi nhau chuyện chia đội',
    h1Kicker: 'Chia đội ngẫu nhiên',
    h1Html: 'Ai sẽ về<br><em>đội của bạn</em>?',
    hook: 'Dán danh sách tên, bấm trộn và để may mắn chia đội. Công bằng, không ai phàn nàn.',
    facts: 'Tối đa 60 tên · đội trưởng tách riêng · chia sẻ kết quả',
    start: 'Chia đội →',
  },

  input: {
    title: 'Ai tham gia?',
    namesLabel: 'Danh sách tên',
    namesHint: 'Mỗi dòng một tên hoặc cách nhau bằng dấu phẩy. Thêm * trước tên đội trưởng.',
    placeholder: 'Minh\nLan\n*Hùng\nHương, Tuấn, Mai',
    sample: 'Tên mẫu',
    clear: 'Xóa',
    tooMany: 'Chỉ dùng {max} tên đầu tiên.',
    needMore: 'Hãy nhập ít nhất 2 tên.',
    modeLabel: 'Chia theo',
    modeTeams: 'Số đội',
    modeSize: 'Số người mỗi đội',
    minus: 'Giảm',
    plus: 'Tăng',
    previewEq: '{k} đội × {size} người',
    previewRange: '{k} đội × {min}–{max} người',
    leaders: 'Đội trưởng (*) ở các đội khác nhau',
    leadersCount: 'Đội trưởng đã đánh dấu: {n}',
    leadersNone: 'Thêm * trước tên để chọn làm đội trưởng',
    shuffle: 'Trộn và chia đội 🎲',
  },

  result: {
    shuffling: 'Đang trộn…',
    title: 'Kết quả chia đội',
    sharedTitle: 'Đội được chia sẻ',
    sharedNote: 'Có người đã chia sẻ kết quả chia đội này với bạn.',
    captain: 'Đội trưởng',
    rename: 'Đổi tên đội',
    again: 'Trộn lại',
    edit: 'Sửa tên',
    copy: 'Sao chép dạng chữ',
    copied: 'Đã sao chép các đội!',
    makeOwn: 'Tự chia đội của tôi',
    badShare: 'Link này không dùng được — hãy tự chia đội ở đây.',
    shareTitle: 'Chia đội ngẫu nhiên - Chia nhóm online',
    shareText: 'Đây là {k} đội chia ngẫu nhiên của chúng mình 🎲',
  },

  people: { other: '{n} người' },

  teams: {
    tiger: 'Đội Hổ',
    eagle: 'Đội Đại Bàng',
    shark: 'Đội Cá Mập',
    wolf: 'Đội Sói',
    fox: 'Đội Cáo',
    panda: 'Đội Gấu Trúc',
    lion: 'Đội Sư Tử',
    owl: 'Đội Cú Mèo',
    dolphin: 'Đội Cá Heo',
    bear: 'Đội Gấu',
    rabbit: 'Đội Thỏ',
    penguin: 'Đội Cánh Cụt',
    dragon: 'Đội Rồng',
    unicorn: 'Đội Kỳ Lân',
    octopus: 'Đội Bạch Tuộc',
    frog: 'Đội Ếch',
    koala: 'Đội Koala',
    parrot: 'Đội Vẹt',
    bee: 'Đội Ong',
    turtle: 'Đội Rùa',
  },

  sample: ['Minh', 'Lan', 'Hùng', 'Hương', 'Tuấn', 'Mai', 'Dũng', 'Linh', 'Nam', 'Thảo', 'Phúc', 'Trang'],

  og: {
    brand: '🎲 Chia đội ngẫu nhiên',
    kicker: 'Nhập tên · ra đội',
    title: 'Ai sẽ về đội của bạn?',
    desc: 'Chia đội công bằng trong vài giây · đội trưởng tách riêng · chia sẻ kết quả',
  },

  faq: [
    { q: 'Làm sao chia danh sách tên thành các đội?', a: 'Nhập hoặc dán tên, mỗi dòng một tên hoặc cách nhau bằng dấu phẩy (tối đa 60). Chọn số đội hoặc số người mỗi đội rồi bấm trộn. Các đội không bao giờ chênh nhau quá một người.' },
    { q: 'Chia đội có thật sự công bằng không?', a: 'Có. Tên được trộn bằng bộ sinh số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues) và thuật toán Fisher–Yates, nên mọi cách chia đều có khả năng như nhau. Chúng tôi hay bất kỳ ai cũng không thể điều khiển kết quả.' },
    { q: 'Đội trưởng hoạt động thế nào?', a: 'Thêm * trước tên để đánh dấu đội trưởng và bật “Đội trưởng ở các đội khác nhau”. Đội trưởng được chia trước, mỗi đội một người, sau đó mọi người khác được trộn vào. Nếu có nhiều đội trưởng hơn số đội, vài đội sẽ có hai.' },
    { q: 'Link chia sẻ chứa gì?', a: 'Chính link mang theo danh sách tên và các đội, nên ai mở cũng thấy đúng kết quả đó. Máy chủ của chúng tôi không lưu gì cả. Danh sách gần nhất của bạn chỉ được giữ trong trình duyệt này để khỏi phải gõ lại.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Chia đội ngẫu nhiên',
    description: 'Chính sách quyền riêng tư của Chia đội ngẫu nhiên: tên chỉ xử lý trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Chia đội ngẫu nhiên (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu như mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Tên bạn nhập chỉ được xử lý trong trình duyệt và không được gửi lên máy chủ của chúng tôi. Nếu bạn chia sẻ kết quả, tên và các đội nằm ngay trong link, ai có link đều xem được. Một số thông tin có thể được thu thập tự động khi bạn dùng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và danh sách tên gần nhất, hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và ngôn ngữ (lượt xem, lượt trộn, đánh giá sao). Không dữ liệu nào trong đó nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có thắc mắc về chính sách này, vui lòng liên hệ người quản lý trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 1 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Chia đội ngẫu nhiên',
  },
};
