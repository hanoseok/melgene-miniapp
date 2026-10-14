/* Đếm ký tự — Tiếng Việt (vi/)
 * Logic đếm nằm trong wordcount-core.js; tệp này chứa mọi chữ hiển thị bằng ngôn ngữ này.
 * Khóa kết thúc bằng Html được chèn dạng HTML (chỉ <br> và <em>); nội dung privacy.sections cũng là HTML.
 * Giữ nguyên {n} {max} {m} {s} {pct} {chars} {words}.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Đếm ký tự, đếm chữ online miễn phí',
    description: 'Công cụ đếm ký tự và đếm chữ miễn phí: ký tự có và không có dấu cách, số từ, câu, đoạn, byte và thời gian đọc theo thời gian thực, kèm thanh giới hạn. Chạy ngay trong trình duyệt.',
    ogTitle: 'Đếm ký tự 📝 ký tự, số từ, byte trực tiếp',
    ogDescription: 'Dán văn bản là thấy ngay số ký tự, số từ, câu, byte và thời gian đọc. Không gửi đi đâu cả.',
  },
  siteName: 'Đếm ký tự',
  privacyLink: 'Chính sách quyền riêng tư',

  hero: {
    h1Kicker: 'Đếm ký tự',
    h1Html: 'Đếm từng ký tự<br><em>ngay khi bạn gõ</em>',
    hook: 'Gõ hoặc dán văn bản. Số ký tự, số từ và byte cập nhật trực tiếp, thanh mục tiêu báo ngay khi bạn vượt giới hạn.',
  },

  ui: {
    editorLabel: 'Văn bản của bạn',
    placeholder: 'Gõ hoặc dán văn bản vào đây…',
    bar: { chars: 'Ký tự', noSpaces: 'Không cách', words: 'Số từ', bytes: 'Byte' },
    toolsLabel: 'Công cụ văn bản',
    tools: { copy: 'Sao chép', tidy: 'Gọn dấu cách', join: 'Nối các dòng', clear: 'Xóa hết', undo: 'Hoàn tác' },
    saved: 'Bản nháp chỉ lưu trên thiết bị này, không tải lên đâu cả.',
    copied: 'Đã sao chép văn bản',
    copyFail: 'Không sao chép được. Hãy chọn văn bản và tự sao chép.',
    cleared: 'Đã xóa văn bản. Bấm Hoàn tác để lấy lại.',
    tidied: 'Đã bỏ dấu cách thừa và dòng trống.',
    joined: 'Đã bỏ xuống dòng.',
    undone: 'Đã hoàn tác.',
    nothing: 'Không có gì để sửa.',
    limitLabel: 'Độ dài mục tiêu',
    limitOff: 'Tắt',
    limitChip: '{n}',
    limitCustom: 'Tự nhập',
    limitCustomPh: 'vd: 280',
    limitCustomAria: 'Nhập độ dài mục tiêu (ký tự)',
    limitSpaces: 'Tính dấu cách',
    limitText: '{n} / {max} ký tự',
    limitLeft: 'còn {n}',
    limitOver: 'vượt {n}',
    statsLabel: 'Số liệu chi tiết',
    stats: {
      chars: 'Ký tự (có dấu cách)',
      noSpaces: 'Ký tự (không dấu cách)',
      words: 'Số từ',
      sentences: 'Số câu',
      paragraphs: 'Đoạn văn',
      lines: 'Số dòng',
      reading: 'Thời gian đọc',
      speaking: 'Thời gian nói',
      bytes: 'Byte',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: '2 byte (cũ)' },
    byteHint: {
      utf8: 'UTF-8 chuẩn: chữ không dấu, số và dấu cách 1 byte, chữ có dấu tiếng Việt 2–3 byte, chữ Hán và Hàn 3, emoji 4. Xuống dòng 1 byte.',
      neis: 'UTF-8, nhưng mỗi lần xuống dòng tính 2 byte (CR + LF), như tệp văn bản trên Windows.',
      legacy: 'Kiểu mã hóa 2 byte cũ (EUC-KR, Shift_JIS, GBK): ASCII 1 byte, ký tự khác 2 byte, xuống dòng 2 byte.',
    },
    time: { sec: '{s} giây', min: '{m} phút', minSec: '{m} phút {s} giây' },
    timeNote: 'Thời gian là ước tính: đọc thầm khoảng 238 từ mỗi phút, nói khoảng 150 từ mỗi phút.',
    kwLabel: 'Từ lặp nhiều nhất',
    kwEmpty: 'Những từ bạn dùng từ hai lần trở lên sẽ hiện ở đây.',
    kwCount: '{n} lần',
    finish: 'Xem tổng kết ✓',
    needText: 'Hãy gõ hoặc dán văn bản trước nhé.',
    local: 'Đếm ngay trên thiết bị của bạn. Văn bản không gửi đi đâu cả.',
  },

  result: {
    heading: 'Tổng quan văn bản của bạn',
    limitOk: 'Nằm trong mục tiêu {max} ký tự ({pct}%).',
    limitOver: 'Vượt mục tiêu {max} ký tự {n} ký tự.',
    copySummary: 'Sao chép tổng kết',
    summaryCopied: 'Đã sao chép tổng kết',
    summaryTitle: 'Kết quả đếm ký tự',
    again: 'Đếm văn bản mới',
    live: 'Tổng kết: {chars} ký tự, {words} từ.',
    shareTitle: 'Đếm ký tự',
    shareText: 'Đếm ký tự, số từ, byte và thời gian đọc miễn phí. Văn bản ở lại trên máy bạn 📝',
  },

  og: {
    brand: '📝 Đếm ký tự',
    kicker: 'Ký tự · số từ · byte · thời gian đọc',
    title: 'Đếm ký tự và số từ trực tiếp',
    desc: 'Miễn phí, văn bản không rời khỏi máy bạn',
  },

  faq: [
    { q: 'Dấu cách và xuống dòng có được đếm không?', a: 'Có cả hai con số. "Có dấu cách" đếm cả dấu cách và xuống dòng (mỗi lần là 1). "Không dấu cách" bỏ hết dấu cách, tab và xuống dòng. Công tắc "Tính dấu cách" chọn con số mà thanh mục tiêu sẽ theo.' },
    { q: 'Sao kết quả khác với Word hay Google Docs?', a: 'Mỗi công cụ có quy tắc riêng. Có nơi tính chữ có dấu như "ệ" thành hai ký tự, có nơi tính emoji là hai, Word bỏ qua xuống dòng. Ở đây "ệ" hay một emoji đều là 1 ký tự, và xuống dòng là 1.' },
    { q: 'Byte được đếm thế nào?', a: 'Chọn quy tắc khớp với biểu mẫu bạn điền. Hầu hết trang web dùng UTF-8, trong đó chữ có dấu tiếng Việt chiếm 2–3 byte. UTF-8 + CRLF tính mỗi lần xuống dòng là 2 byte. 2 byte (cũ) tính ASCII 1 byte, ký tự khác 2 byte.' },
    { q: 'Văn bản của tôi có bị lưu hay gửi đi không?', a: 'Không gửi đi đâu cả. Bản nháp nằm trong bộ nhớ của trình duyệt này để tải lại trang vẫn còn, bấm "Xóa hết" là mất. Địa chỉ trang và liên kết chia sẻ không chứa văn bản của bạn.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Đếm ký tự',
    description: 'Chính sách quyền riêng tư của Đếm ký tự: văn bản chỉ được đếm và lưu trong trình duyệt của bạn; cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Đếm ký tự ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Dịch vụ hoạt động mà không cần tài khoản hay đăng nhập. Văn bản bạn gõ hoặc dán chỉ được đếm trong trình duyệt của bạn. Văn bản không bao giờ được gửi tới máy chủ của chúng tôi hay bất kỳ máy chủ nào khác, và không được đưa vào địa chỉ trang hay liên kết chia sẻ. Để bản nháp còn sau khi tải lại, văn bản và cài đặt chỉ được lưu trong bộ nhớ cục bộ của trình duyệt trên thiết bị này; bấm "Xóa hết" hoặc xóa dữ liệu trang web trong trình duyệt sẽ xóa bản nháp.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ và cài đặt, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đó. Tìm hiểu thêm và thay đổi tùy chọn tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ lưu tổng số theo ngày cho từng ngôn ngữ (lượt xem trang, lượt dùng, điểm sao). Các bộ đếm này không bao giờ chứa văn bản hay con số của bạn và không nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang web.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 15 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Đếm ký tự',
  },
};
