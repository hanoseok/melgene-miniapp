/* Chọn món ăn – giải đấu món ăn — Tiếng Việt (/vi/)
 * Cấu trúc khóa giống en.js. Mã món, emoji và nhánh đấu nằm trong food-cup-core.js.
 * Unbounded và Oswald đều hỗ trợ dấu tiếng Việt (Google Fonts subset: vietnamese).
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Chọn món ăn – giải đấu món ăn',
    description: 'Chọn món ăn: mỗi lượt hai món, chạm vào món muốn ăn hơn đến khi còn một nhà vô địch. Giải đấu món ăn chơi xong trong khoảng 1 phút. Miễn phí, không cần cài đặt.',
    ogTitle: 'Chọn món ăn 🏆 Giải đấu món ăn',
    ogDescription: 'Hai món, một lựa chọn, mười lăm trận. Món nào sẽ lên ngôi?',
  },
  siteName: 'Giải đấu món ăn',
  privacyLink: 'Chính sách quyền riêng tư',

  start: {
    badge: '🍽️ Bạn chọn cái nào · món ăn',
    h1Kicker: 'Chọn món ăn',
    h1Html: 'Món nào sẽ<br><em>lên ngôi</em>?',
    hook: 'Hai món, chỉ được chọn một. Cứ chọn đến khi chỉ còn món bạn mê nhất.',
    facts: '16 món · 15 lượt chọn · 1 phút',
    start: 'Bắt đầu giải đấu →',
  },

  play: {
    rounds: { r16: 'Vòng 1/8', qf: 'Tứ kết', sf: 'Bán kết', f: 'Chung kết' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Lượt {n} trên {total}',
    hint: 'Bạn muốn ăn món nào hơn?',
    vs: 'VS',
    pickAria: 'Chọn {food}',
    same: '{pct}% chọn giống bạn',
  },

  result: {
    eyebrow: 'Món vô địch của bạn',
    champPct: '{pct}% người chơi khác cũng chọn {food} vô địch',
    champFirst: 'Bạn là một trong những người đầu tiên chơi xong — chưa có thống kê.',
    fourTitle: 'Bộ tứ của bạn',
    retry: 'Chơi lại (nhánh đấu mới)',
    shareTitle: 'Chọn món ăn – giải đấu món ăn',
    shareText: 'Món vô địch của mình là {emoji} {food}! Còn bạn?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Hamburger',
    sushi: 'Sushi',
    noodles: 'Phở',
    chicken: 'Gà rán',
    tacos: 'Tacos',
    pasta: 'Mì Ý',
    curry: 'Cà ri',
    dumplings: 'Há cảo',
    steak: 'Bít tết',
    hotpot: 'Lẩu',
    hotdog: 'Hot dog',
    friedrice: 'Cơm chiên',
    sandwich: 'Bánh mì',
    stew: 'Bò kho',
    shrimp: 'Tôm chiên',
  },

  og: {
    brand: '🏆 Giải đấu món ăn',
    defaultKicker: 'Bạn chọn cái nào · món ăn',
    defaultTitle: 'Món nào sẽ lên ngôi?',
    defaultDesc: 'Mỗi lượt hai món · một nhà vô địch · khoảng 1 phút',
  },

  faq: [
    { q: 'Giải đấu món ăn chơi thế nào?', a: 'Mười sáu món được xếp ngẫu nhiên vào nhánh đấu. Mỗi trận có hai món, bạn chạm vào món muốn ăn hơn và món đó đi tiếp. Vòng 1/8, tứ kết, bán kết và chung kết là 15 lượt chọn, món cuối cùng còn lại là nhà vô địch của bạn.' },
    { q: 'Tỉ lệ phần trăm có thật không?', a: 'Có. Mỗi lựa chọn được đếm ẩn danh trên máy chủ, mỗi trình duyệt chỉ tính một lần cho mỗi cặp đấu. Phần trăm chỉ hiện khi đã có đủ người chơi đúng cặp đấu đó; trước đó chúng tôi không hiện gì thay vì bịa ra một con số.' },
    { q: 'Tôi có thể chơi lại hoặc chia sẻ kết quả không?', a: 'Chơi lại bao nhiêu lần cũng được. Mỗi lần nhánh đấu được xáo mới nên các cặp đấu sẽ khác. Dùng nút chia sẻ để gửi món vô địch cho bạn bè và xem họ chọn gì.' },
    { q: 'Vì sao lại là 16 món này?', a: 'Đây là những món được yêu thích khắp thế giới, từ đồ ăn đường phố đến món ăn quen thuộc. Tên món theo cách người Việt hay gọi, nhưng món ăn ở mọi ngôn ngữ là một, nên tỉ lệ gộp lựa chọn của người chơi ở mọi quốc gia.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Giải đấu món ăn',
    description: 'Chính sách quyền riêng tư của Giải đấu món ăn: đếm lựa chọn ẩn danh, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Giải đấu món ăn (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Lựa chọn của bạn chỉ được gửi lên máy chủ dưới dạng tổng số ẩn danh (món nào thắng cặp đấu nào, món nào bạn chọn vô địch), không kèm tên hay thông tin định danh cá nhân. Một số thông tin có thể được thu thập tự động khi bạn sử dụng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và các cặp đấu đã được tính, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày và ngôn ngữ (lượt xem trang, số lượt chơi xong, đánh giá sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ đơn vị vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 29 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại Giải đấu món ăn',
  },
};
