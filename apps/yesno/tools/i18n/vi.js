/* Có hay không — tiếng Việt. Cấu trúc khóa giống en.js (xem chú thích).
 * oracle: 12 câu (0-3 tích cực · 4-7 trung lập · 8-11 tiêu cực), ngắn vì nằm trong quả cầu. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Có hay không – quay ngẫu nhiên trả lời',
    description: 'Phân vân mãi? Gõ câu hỏi và nhận ngay câu trả lời có hay không: có/không, có/không/có thể, quả cầu tiên tri hoặc thắng 2/3 và 3/5. Miễn phí, công bằng, không cần đăng ký.',
    ogTitle: 'Có hay không 🎱 Hỏi là quả cầu trả lời',
    ogDescription: 'Có, không, có thể hoặc lời phán của quả cầu tiên tri. Quay ngẫu nhiên công bằng cho mọi phân vân nhỏ.',
  },
  siteName: 'Có hay không',
  privacyLink: 'Chính sách bảo mật',

  hero: {
    h1Kicker: 'Có hay không',
    h1Html: 'Hỏi gì cũng được.<br>Quả cầu nói <em>có</em> hay <em>không</em>',
    hook: 'Gõ câu hỏi bạn cứ đắn đo mãi, chọn chế độ và để may rủi quyết định giúp.',
  },

  ui: {
    questionLabel: 'Câu hỏi của bạn (không bắt buộc)',
    questionPh: 'VD: Tối nay có nên gọi trà sữa?',
    questionHint: 'Chỉ lưu trên máy này. Chỉ đưa vào liên kết khi bạn chia sẻ câu trả lời.',
    modeLabel: 'Quả cầu trả lời kiểu nào?',
    modes: {
      classic: 'Có / Không',
      maybe: 'Có / Không / Có thể',
      oracle: 'Quả cầu tiên tri',
      best3: 'Thắng 2/3',
      best5: 'Thắng 3/5',
    },
    modeHints: {
      classic: 'Có hoặc không, tỉ lệ 50:50.',
      maybe: 'Có, không hoặc có thể, mỗi cái một phần ba.',
      oracle: 'Một trong 12 lời phán: có câu nghiêng về có, có câu nghiêng về không, có câu bảo “chờ đã”.',
      best3: 'Tung đến khi một bên thắng hai lần.',
      best5: 'Tung đến khi một bên thắng ba lần.',
    },
    ask: 'Hỏi quả cầu 🔮',
    asking: 'Quả cầu đang nghĩ…',
    fair: 'Ngẫu nhiên mật mã công bằng · chỉ để vui, bạn quyết định',
  },

  answers: { yes: 'CÓ', no: 'KHÔNG', maybe: 'CÓ THỂ' },
  tones: { positive: 'Nghiêng về có', neutral: 'Chờ xem đã', negative: 'Nghiêng về không' },
  oracle: [
    'Cứ làm đi!',
    'Các vì sao nói có',
    'Có, không hối tiếc',
    'Lòng bạn đã biết: có',
    'Ngủ một đêm rồi tính',
    'Mai hỏi lại nhé',
    'Bàn với ai đó rồi quyết',
    'Sương mù chưa tan',
    'Lần này thì không',
    'Các vì sao nói không',
    'Bỏ qua chuyện này đi',
    'Khoan đã, đợi thêm',
  ],

  result: {
    heading: 'Quả cầu nói',
    sharedBadge: '🔗 Câu trả lời được chia sẻ',
    sharedNote: 'Nhận lúc {date}. Đây là câu trả lời gốc lưu trong liên kết, mở ra sẽ không hỏi lại.',
    noQuestion: 'Không gõ câu hỏi',
    bestOf: 'Đấu {n} ván',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'C',
    flipNo: 'K',
    copyLink: 'Chia sẻ câu trả lời 🔗',
    linkCopied: 'Đã sao chép liên kết kèm câu hỏi và câu trả lời',
    again: 'Hỏi lại',
    askOwn: 'Tự mình hỏi',
    live: 'Câu trả lời: {answer}',
    shareTitle: 'Có hay không',
    shareText: 'Mình hỏi quả cầu có hay không và nó nói: {answer} 🎱',
  },

  tally: {
    title: 'Lần này',
    total: 'Số lần hỏi: {n}',
  },

  history: {
    title: 'Câu trả lời gần đây',
    note: '10 câu trả lời gần nhất, chỉ lưu trên máy này.',
    clear: 'Xóa',
  },

  errors: {
    badLink: 'Liên kết câu trả lời này bị hỏng hoặc thiếu nên không hiển thị được gì.',
  },

  og: {
    brand: '🎱 Có hay không',
    kicker: 'Có · Không · Có thể · Quả cầu tiên tri',
    title: 'Đặt câu hỏi, nhận có hay không',
    desc: 'Quay ngẫu nhiên công bằng cho mọi phân vân nhỏ',
  },

  faq: [
    { q: 'Công cụ có hay không dùng thế nào?', a: 'Gõ câu hỏi nếu muốn, chọn chế độ rồi bấm “Hỏi quả cầu”. Câu trả lời được bốc trước, sau đó quả cầu rung hoặc từng ván hiện ra để tiết lộ. Có/Không là 50:50, Có/Không/Có thể mỗi cái một phần ba, quả cầu tiên tri chọn một trong 12 lời phán, còn thắng 2/3 hay 3/5 sẽ tung đến khi một bên chiếm đa số.' },
    { q: 'Câu trả lời có thật sự ngẫu nhiên?', a: 'Có. Mọi câu trả lời đều lấy từ bộ sinh số ngẫu nhiên mật mã của trình duyệt (crypto.getRandomValues) kèm lấy mẫu loại bỏ, nên không câu nào dễ ra hơn câu nào dù chỉ một chút. Hiệu ứng chỉ hiển thị kết quả đã bốc sẵn.' },
    { q: 'Có cần làm theo câu trả lời không?', a: 'Chỉ khi bạn muốn. Đây là câu trả lời ngẫu nhiên cho vui, không phải lời khuyên hay dự đoán, đừng dùng cho chuyện sức khỏe, tiền bạc, pháp lý hay an toàn. Mẹo nhỏ: để ý xem bạn thấy nhẹ nhõm hay hụt hẫng khi câu trả lời hiện ra. Cảm giác đó thường là câu trả lời thật của bạn.' },
    { q: 'Câu hỏi của tôi có bị lưu hay gửi đi đâu không?', a: 'Câu hỏi chỉ nằm trong trình duyệt của bạn. 10 câu trả lời gần nhất được lưu trên máy này để xem lại và bạn có thể xóa bất cứ lúc nào. Câu hỏi chỉ rời khỏi máy khi bạn bấm “Chia sẻ câu trả lời”, lúc đó nó nằm trong liên kết bạn gửi.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Có hay không',
    description: 'Chính sách bảo mật của Có hay không: câu hỏi chỉ ở trong trình duyệt, cookie, quảng cáo và thống kê.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Có hay không ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin thu thập', 'Dịch vụ hoạt động không cần tài khoản hay đăng nhập. Câu hỏi bạn gõ và câu trả lời bạn nhận chỉ được xử lý trong trình duyệt và không gửi tới máy chủ của chúng tôi. 10 câu trả lời gần nhất, kèm câu hỏi, được lưu trong bộ nhớ cục bộ của trình duyệt trên máy bạn và có thể xóa bất cứ lúc nào bằng nút Xóa. Khi bạn bấm "Chia sẻ câu trả lời", câu hỏi và câu trả lời được ghi vào chính liên kết và chỉ chia sẻ với người nhận liên kết.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và câu trả lời gần đây, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Tìm hiểu thêm và thay đổi lựa chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ giữ tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, số lần hỏi, đánh giá sao). Câu hỏi của bạn không bao giờ nằm trong các số liệu này và không có gì xác định được cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có thắc mắc về Chính sách bảo mật này, vui lòng liên hệ người vận hành trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 15 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Có hay không',
  },
};
