/* Tính BMI — tiếng Việt. Cấu trúc khóa và chỗ giữ chỗ giống en.js. scales.alt = chuẩn châu Á (asia, 5 mức). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800&display=swap',
    display: "'Be Vietnam Pro'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'Tính BMI – Chỉ số khối cơ thể, cân nặng chuẩn',
    description: 'Công cụ tính BMI miễn phí: nhập chiều cao và cân nặng để biết ngay chỉ số khối cơ thể, mức gầy, bình thường, thừa cân hay béo phì theo chuẩn châu Á và khoảng cân nặng hợp lý.',
    ogTitle: 'Tính BMI ⚖️ Chỉ số BMI và cân nặng chuẩn của bạn',
    ogDescription: 'Nhập chiều cao, cân nặng để biết BMI, mức gầy béo và khoảng cân nặng hợp lý cho chiều cao của bạn.',
  },
  siteName: 'Tính BMI',
  privacyLink: 'Chính sách quyền riêng tư',

  hero: {
    h1Kicker: 'Tính BMI',
    h1Html: 'Chỉ số BMI, <em>gõ là có ngay</em>',
    hook: 'Nhập chiều cao và cân nặng để xem BMI trên thanh màu, kèm khoảng cân nặng hợp lý cho chiều cao của bạn.',
  },

  ui: {
    unitsLabel: 'Đơn vị',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Chiều cao',
    weight: 'Cân nặng',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Tuổi và giới tính (không bắt buộc)',
    less: '− Ẩn tuổi và giới tính',
    age: 'Tuổi',
    years: 'tuổi',
    sex: 'Giới tính',
    sexNone: 'Không chọn',
    female: 'Nữ',
    male: 'Nam',
    asiaToggle: 'Chuẩn châu Á',
    yourBmi: 'BMI của bạn',
    waiting: 'Nhập chiều cao và cân nặng, BMI sẽ hiện ở đây.',
    scaleLabel: 'Thanh mức BMI',
    rangeTitle: 'Cân nặng hợp lý cho chiều cao của bạn',
    toLose: 'Cao hơn khoảng hợp lý chừng {w}',
    toGain: 'Thấp hơn khoảng hợp lý chừng {w}',
    inRange: 'Bạn đang ở trong khoảng cân nặng hợp lý.',
    under18: 'Công cụ này dành cho người lớn từ 18 tuổi. Trẻ em và thiếu niên được đánh giá bằng biểu đồ tăng trưởng theo tuổi và giới tính, nên mức ở trên không áp dụng.',
    senior: 'Từ 65 tuổi, BMI hơi cao một chút thường vẫn được xem là ổn. Hãy hỏi bác sĩ khoảng nào phù hợp với bạn.',
    sexNote: 'Ngưỡng BMI người lớn giống nhau cho nam và nữ, dù cùng một BMI thì nữ thường có nhiều mỡ hơn.',
    disclaimerTitle: 'Cần biết trước khi xem',
    disclaimer: [
      'BMI chỉ là con số sàng lọc nhanh, không phải chẩn đoán hay lời khuyên y khoa.',
      'BMI không phân biệt cơ và mỡ, nên vận động viên hay người nhiều cơ có thể bị tính cao.',
      'Không áp dụng khi mang thai, và công cụ này chỉ dành cho người lớn từ 18 tuổi.',
    ],
    decimalHint: 'Số thập phân dùng “.” hay “,” đều được.',
    finish: 'Xem tóm tắt BMI ✓',
    needOne: 'Hãy nhập chiều cao và cân nặng trước.',
    localNote: 'Tính ngay trên máy của bạn. Số bạn nhập không được gửi đi hay lưu lại.',
    summaryTitle: 'Tóm tắt BMI của tôi',
    summaryNote: 'Tóm tắt này chỉ có trên trang này, không được lưu ở đâu cả.',
    sumScale: 'Chuẩn',
    sumRange: 'Cân nặng hợp lý',
    again: 'Làm lại từ đầu',
    live: 'BMI {bmi}, {cat}',
    shareTitle: 'Tính BMI',
    shareText: 'Tính BMI và cân nặng hợp lý cho chiều cao của mình chỉ trong vài giây ⚖️',
  },

  scales: {
    who: {
      name: 'Chuẩn WHO',
      note: 'Phân loại cho người lớn của Tổ chức Y tế Thế giới (WHO).',
      labels: ['Thiếu cân', 'Bình thường', 'Thừa cân', 'Béo phì độ 1', 'Béo phì độ 2', 'Béo phì độ 3'],
    },
    alt: {
      name: 'WHO châu Á',
      note: 'Chuẩn WHO khu vực châu Á – Thái Bình Dương (2000), Bộ Y tế Việt Nam cũng dùng: người châu Á gặp rủi ro sức khỏe ở BMI thấp hơn.',
      labels: ['Thiếu cân', 'Bình thường', 'Thừa cân', 'Béo phì độ 1', 'Béo phì độ 2'],
    },
  },

  errors: {
    badNum: 'Chỉ nhập chữ số, dùng “.” hoặc “,” cho phần thập phân.',
    heightRange: 'Hãy kiểm tra chiều cao: nên trong khoảng 50–272 cm.',
    weightRange: 'Hãy kiểm tra cân nặng: nên trong khoảng 10–650 kg.',
    inchRange: 'Số inch phải nhỏ hơn 12. Số feet nguyên nhập ở ô đầu.',
    ageRange: 'Tuổi phải là số nguyên từ 2 đến 120.',
  },

  og: {
    brand: '⚖️ Tính BMI',
    kicker: 'Chiều cao · Cân nặng · BMI',
    title: 'BMI của bạn nằm ở đâu?',
    desc: 'Kèm cân nặng hợp lý cho chiều cao của bạn',
  },

  faq: [
    { q: 'BMI được tính thế nào?', a: 'Lấy cân nặng (kg) chia cho bình phương chiều cao (m). Cao 1,70 m, nặng 65 kg thì BMI = 65 ÷ (1,7 × 1,7) ≈ 22,5. Nếu nhập theo feet và pound, công cụ sẽ tự đổi.' },
    { q: 'Người Việt bao nhiêu BMI là bình thường?', a: 'Theo chuẩn châu Á – Thái Bình Dương mà Bộ Y tế dùng: dưới 18,5 là thiếu cân, 18,5–22,9 bình thường, 23–24,9 thừa cân, 25–29,9 béo phì độ 1 và từ 30 là béo phì độ 2. Ngưỡng này thấp hơn chuẩn WHO vì người châu Á dễ mắc tiểu đường, huyết áp ở BMI thấp hơn.' },
    { q: 'Tôi tập thể thao đều mà BMI vẫn cao?', a: 'BMI chỉ dựa vào cân nặng và chiều cao nên không biết đó là cơ hay mỡ. Người nhiều cơ dễ bị xếp vào thừa cân. Hãy đo thêm vòng eo (nam từ 90 cm, nữ từ 80 cm là béo bụng) hoặc đo thành phần cơ thể.' },
    { q: 'Trẻ em hay bà bầu có dùng được không?', a: 'Không. Dưới 18 tuổi cần dùng biểu đồ tăng trưởng theo tuổi và giới tính, còn tăng cân khi mang thai có hướng dẫn riêng. Hãy hỏi ý kiến bác sĩ.' },
  ],

  privacy: {
    title: 'Chính sách quyền riêng tư | Tính BMI',
    description: 'Chính sách quyền riêng tư của Tính BMI: chiều cao, cân nặng và tuổi bạn nhập chỉ được tính trong trình duyệt, cùng cookie, quảng cáo và thống kê.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Tính BMI ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu được nêu dưới đây.',
    sections: [
      ['1. Thông tin thu thập', 'Dịch vụ dùng được mà không cần tài khoản hay đăng nhập. Chiều cao, cân nặng, tuổi và giới tính bạn nhập chỉ được tính trong trình duyệt của bạn. Chúng không được gửi lên máy chủ, không được lưu và không được ghi vào bất kỳ liên kết nào. Dịch vụ chỉ ghi nhớ trên thiết bị của bạn đơn vị dùng gần nhất (cm·kg hoặc ft·lb). Khi bạn dùng nút chia sẻ, chỉ địa chỉ trang và một đoạn chữ ngắn không có số đo của bạn được gửi, và chỉ tới người bạn chọn.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để nhớ ngôn ngữ và đơn vị, hiển thị quảng cáo và hiểu cách Dịch vụ được dùng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không chạy như mong đợi.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn ghé trang này và trang khác. Bạn có thể tìm hiểu thêm và đổi lựa chọn trong <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Để cải thiện Dịch vụ, chúng tôi có thể dùng Google Analytics (GA4) và bộ đếm tổng hợp riêng chỉ giữ tổng số mỗi ngày theo ngôn ngữ (lượt xem, lượt tính, đánh giá sao). Số đo cơ thể của bạn không bao giờ nằm trong các con số này, và không có gì xác định được cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi về chính sách này, vui lòng liên hệ người quản lý trang.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 24 tháng 10 năm 2026.'],
    ],
    back: '← Quay lại Tính BMI',
  },
};
