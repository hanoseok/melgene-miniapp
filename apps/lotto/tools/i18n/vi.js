/* Tạo số xổ số — vi. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Tạo số xổ số: Chọn số ngẫu nhiên may mắn',
    description: 'Cần con số may mắn? Chọn lotto Hàn Quốc 6/45, kiểu Euro 5/50 + 2 sao, Powerball Mỹ 5/69 + 1 hoặc tự đặt khoảng số, giữ hoặc loại số và quay tối đa năm bộ. Chỉ để giải trí, không cần đăng ký.',
    ogTitle: 'Tạo số xổ số 🎱 Số ngẫu nhiên may mắn',
    ogDescription: 'Quay số may mắn cho vui, tối đa năm bộ cùng lúc.'
  },
  siteName: 'Tạo số xổ số',
  privacyLink: 'Chính sách quyền riêng tư',
  start: {
    badge: '🎱 Chỉ để cho vui',
    h1Kicker: 'Tạo số xổ số',
    h1Html: 'Hôm nay <em>may mắn</em> chứ?<br>Quay số thôi',
    hook: 'Chọn trò chơi, giữ hoặc loại vài con số rồi xem những quả bóng lăn ra. Tối đa năm bộ số cùng lúc.',
    facts: 'Hàn Quốc · kiểu Euro · Powerball · tự chọn · chỉ để giải trí',
    start: 'Quay số →'
  },
  tool: {
    title: 'Cài đặt lượt quay',
    presetLabel: 'Chơi trò nào?',
    presets: {
      kr: 'Hàn Quốc 6/45',
      euro: 'Kiểu Euro 5/50 + 2',
      us: 'Powerball Mỹ',
      custom: 'Tự chọn'
    },
    presetInfo: {
      kr: '6 số từ 1 đến 45',
      euro: '5 số từ 1 đến 50 + 2 sao từ 1 đến 12',
      us: '5 số từ 1 đến 69 + 1 Powerball từ 1 đến 26',
      custom: 'Tự chọn số lượng và số lớn nhất'
    },
    pickLabel: 'Số lượng cần quay',
    maxLabel: 'Số lớn nhất',
    gamesLabel: 'Mấy bộ số?',
    fixedLabel: 'Số muốn giữ (tùy chọn)',
    fixedHint: 'Luôn có trong mọi bộ, ví dụ 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Số muốn loại (tùy chọn)',
    excludeHint: 'Sẽ không bao giờ ra, ví dụ 4, 13',
    excludePh: '4, 13',
    draw: 'Quay bóng 🎱',
    drawing: 'Đang quay…',
    machine: 'Những quả bóng đang xoay trong máy quay số',
    note: 'Chỉ để giải trí. Mọi tổ hợp đều có khả năng ra như nhau, công cụ này không thể dự đoán hay tăng cơ hội trúng thưởng.',
    errors: {
      bad: 'Hãy nhập số nguyên từ 1 đến {max}, ngăn cách bằng dấu phẩy.',
      overlap: 'Một số không thể vừa giữ vừa loại.',
      tooMany: 'Bạn chỉ giữ được tối đa {pick} số.',
      notEnough: 'Loại quá nhiều số nên không thể quay {pick} số.'
    }
  },
  result: {
    title: 'Số may mắn của bạn',
    game: 'Bộ {n}',
    extraNames: {
      euro: 'Sao',
      us: 'Powerball'
    },
    copy: 'Sao chép số 📋',
    copied: 'Đã sao chép số!',
    again: 'Quay lại',
    change: 'Về phần cài đặt',
    disclaimer: 'Chỉ để giải trí. Không dự đoán, không hứa hẹn trúng thưởng.',
    shareTitle: 'Tạo số xổ số',
    shareText: 'Số may mắn của mình 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Tạo số xổ số',
    kicker: 'Số ngẫu nhiên · cho vui',
    title: 'Hôm nay may mắn chứ?',
    desc: 'Chọn trò chơi và quay tối đa năm bộ số'
  },
  faq: [
    {
      q: 'Quay số như thế nào?',
      a: 'Chọn trò chơi (lotto Hàn Quốc, kiểu Euro, Powerball Mỹ hoặc khoảng số tự đặt), chọn từ một đến năm bộ rồi bấm nút quay. Kết quả được quay trước, các quả bóng lăn ra lần lượt, sau đó mỗi bộ được hiển thị theo thứ tự tăng dần.'
    },
    {
      q: 'Các số có thật sự ngẫu nhiên không?',
      a: 'Có. Số được lấy từ bộ tạo số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues) kèm lấy mẫu loại bỏ, nên mọi số hợp lệ có xác suất như nhau và không bị lệch. Hiệu ứng quả bóng chỉ để trang trí.'
    },
    {
      q: 'Số giữ và số loại có tác dụng gì?',
      a: 'Số giữ xuất hiện trong mọi bộ, các số còn lại được quay xung quanh. Số loại sẽ không bao giờ ra. Cả hai chỉ áp dụng cho số chính, không áp dụng cho sao hay Powerball.'
    },
    {
      q: 'Dùng cái này có tăng cơ hội trúng không?',
      a: 'Không. Trong kỳ quay thật, mọi tổ hợp đều có xác suất như nhau và không công cụ nào dự đoán được kết quả. Trình tạo số này chỉ là cách chọn số cho vui và không hứa hẹn trúng thưởng.'
    }
  ],
  privacy: {
    title: 'Chính sách quyền riêng tư | Tạo số xổ số',
    description: 'Chính sách quyền riêng tư của Tạo số xổ số: số bạn nhập chỉ nằm trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Tạo số xổ số (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      [
        '1. Thông tin chúng tôi thu thập',
        'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Số bạn nhập và kết quả quay chỉ được xử lý trong trình duyệt của bạn và không gửi đến máy chủ của chúng tôi. Tuy vậy, một số thông tin có thể được thu thập tự động khi bạn sử dụng, như mô tả dưới đây.'
      ],
      [
        '2. Cookie và công nghệ tương tự',
        'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; một số tính năng có thể không hoạt động như mong đợi.'
      ],
      [
        '3. Quảng cáo (Google AdSense)',
        'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần truy cập trước đây của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và đổi lựa chọn trong <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'
      ],
      [
        '4. Thống kê',
        'Để cải thiện dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng theo ngày và theo ngôn ngữ (lượt xem, lượt quay, đánh giá sao). Không dữ liệu nào trong số này nhận dạng cá nhân bạn.'
      ],
      [
        '5. Liên hệ',
        'Nếu có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang web.'
      ],
      [
        '6. Ngày có hiệu lực',
        'Chính sách này có hiệu lực từ ngày 7 tháng 10 năm 2026.'
      ]
    ],
    back: '← Quay lại Tạo số xổ số'
  }
};
