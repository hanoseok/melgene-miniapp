/* Tung đồng xu — tiếng Việt. Cấu trúc khóa giống en.js (xem chú thích). */
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
    title: 'Tung đồng xu online: sấp hay ngửa',
    description: 'Phân vân không biết chọn gì? Tung đồng xu online, sấp hay ngửa, để may rủi quyết định. Tự đặt tên cho hai mặt hoặc gieo từ một đến ba xúc xắc. Miễn phí, không cần đăng ký.',
    ogTitle: 'Tung đồng xu 🪙 Sấp ngửa & xúc xắc',
    ogDescription: 'Tung đồng xu hoặc gieo xúc xắc để quyết định ngay.',
  },
  siteName: 'Tung đồng xu',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🪙 Cách quyết định công bằng nhất',
    h1Kicker: 'Tung đồng xu',
    h1Html: 'Sấp hay ngửa?<br>Để <em>đồng xu</em> quyết định',
    hook: 'Đặt tên cho hai lựa chọn, tung đồng xu rồi chọn theo mặt rơi xuống. Muốn thì gieo xúc xắc cũng được.',
    facts: 'Đồng xu và xúc xắc · tự đặt tên hai mặt · lần nào cũng công bằng',
    start: 'Tung thôi →',
  },

  tool: {
    title: 'Tung nào',
    tabCoin: 'Đồng xu',
    tabDice: 'Xúc xắc',
    namesLabel: 'Đặt tên cho hai mặt',
    namesHint: 'Mặc định là sấp và ngửa. Hãy đổi thành lựa chọn của bạn, như phở và bún chả.',
    sideA: 'Sấp',
    sideB: 'Ngửa',
    fieldA: 'Tên mặt thứ nhất',
    fieldB: 'Tên mặt thứ hai',
    throwCoin: 'Tung đồng xu 🪙',
    diceLabel: 'Gieo mấy xúc xắc?',
    rollDice: 'Gieo xúc xắc 🎲',
  },

  count: { other: 'Lần này đã tung {n} lần' },
  countDice: { other: 'Lần này đã gieo {n} lần' },

  result: {
    titleCoin: 'Kết quả là',
    titleDice: 'Bạn gieo được',
    sum: 'Tổng {n}',
    tallyTitle: 'Lượt này',
    tallySide: '{name} {n}',
    againCoin: 'Tung lại',
    againDice: 'Gieo lại',
    change: 'Về phần cài đặt',
    shareTitle: 'Tung đồng xu – sấp hay ngửa',
    shareTextCoin: 'Mình tung đồng xu và ra {name} 🪙',
    shareTextDice: 'Mình gieo xúc xắc được {n} 🎲',
  },

  og: {
    brand: '🪙 Tung đồng xu',
    kicker: 'Sấp hay ngửa · đồng xu và xúc xắc',
    title: 'Sấp hay ngửa?',
    desc: 'Tung đồng xu, gieo xúc xắc · một lần tung công bằng quyết định',
  },

  faq: [
    { q: 'Tung đồng xu hoạt động thế nào?', a: 'Nếu muốn, hãy đặt tên cho hai mặt rồi bấm tung. Kết quả được chọn trước và đồng xu chỉ xoay để hiện ra mặt đó, nên điều bạn thấy luôn là kết quả thật. Sang thẻ Xúc xắc để gieo từ một đến ba xúc xắc sáu mặt.' },
    { q: 'Có thật sự công bằng không?', a: 'Có. Kết quả lấy từ bộ tạo số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues) cùng phương pháp lấy mẫu loại bỏ, nên sấp và ngửa có xác suất đúng bằng nhau, mỗi mặt xúc xắc cũng vậy. Hiệu ứng xoay và lăn chỉ để cho vui mắt.' },
    { q: 'Tôi có thể dùng lựa chọn riêng thay cho sấp và ngửa không?', a: 'Được. Nhập hai tên bất kỳ vào các ô phía trên đồng xu, chẳng hạn phở và bún chả, kết quả sẽ hiện tên bên thắng. Để trống một ô thì tên mặc định quay lại.' },
    { q: 'Các con số ở màn hình kết quả nghĩa là gì?', a: 'Đó là số lần bạn đã tung trên trang này kể từ lúc mở, cùng số lần mỗi mặt xuất hiện. Tải lại trang sẽ đếm lại từ đầu và không gửi đi đâu cả.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Tung đồng xu',
    description: 'Chính sách quyền riêng tư của Tung đồng xu: tên bạn nhập chỉ nằm trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Tung đồng xu (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Tên bạn nhập và kết quả tung chỉ được xử lý trong trình duyệt của bạn và không gửi đến máy chủ của chúng tôi. Tuy vậy, một số thông tin có thể được thu thập tự động khi bạn sử dụng, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần truy cập trước đây của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và đổi lựa chọn trong <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng theo ngày và theo ngôn ngữ (lượt xem, lượt tung, đánh giá sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang web.'],
      ['6. Ngày có hiệu lực', 'Chính sách này có hiệu lực từ ngày 5 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tung đồng xu',
  },
};
