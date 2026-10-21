module.exports = {
  metaTitle: 'Hướng dẫn tính phần trăm: công thức, giảm giá, điểm %',
  description: 'Cách tính phần trăm bằng tay: X% của một số, một số chiếm bao nhiêu phần trăm, phần trăm tăng giảm, giảm giá chồng, tìm giá gốc và khác biệt giữa phần trăm với điểm phần trăm.',
  h1: 'Tính phần trăm: cách giải mọi bài toán phần trăm',
  updated: '2026-10-22',
  intro: 'Phần trăm có mặt ở khắp nơi: bảng giá khuyến mãi, phiếu lương, điểm thi, lãi suất vay, kết quả thăm dò. Phần lớn chỉ cần ba công thức nhỏ, nhưng vẫn có vài cái bẫy mà hầu như ai cũng từng mắc, như cộng lại đúng phần trăm vừa giảm hay nhầm phần trăm với điểm phần trăm. Bài hướng dẫn này giải thích cách máy tính phần trăm hoạt động, cách làm phép tính tương tự bằng giấy bút, những lỗi thường gặp nằm ở đâu và vài mẹo tính nhẩm dùng hằng ngày.',
  sections: [
    {
      h: 'Cách dùng máy tính phần trăm',
      p: [
        'Chọn câu hỏi bạn cần trong sáu thẻ phía trên: phần trăm của một số, một số chiếm bao nhiêu phần trăm của số khác, phần trăm thay đổi giữa hai giá trị, giảm hoặc tăng theo phần trăm, giá trị gốc trước khi thay đổi, và chênh lệch giữa hai tỷ lệ tính bằng điểm phần trăm. Mỗi thẻ có hai ô. Khi điền đủ cả hai, đáp án hiện ra ngay, kèm một dòng cho biết chính xác đã tính thế nào.',
        'Bạn có thể nhập số thập phân bằng dấu phẩy hoặc dấu chấm, cả 12,5 và 12.5 đều được, dấu phân cách hàng nghìn như 1.250 cũng được hiểu. Kết quả được làm tròn tối đa mười chữ số thập phân để ẩn các sai số làm tròn rất nhỏ của máy tính. Tính xong, hãy mở phần tổng kết để xem mọi kết quả trong lần này trong một danh sách và sao chép cái bạn cần.',
      ],
      list: [
        'Mọi phép tính diễn ra trong trình duyệt, số bạn nhập không được gửi đi đâu.',
        'Nút sao chép sẽ chép kết quả cùng công thức.',
        'Thẻ giảm giá có nút nhanh cho giảm 10, 20, 30 và 50 phần trăm.',
      ],
    },
    {
      h: 'Ba công thức cơ bản để tự tính',
      p: [
        'Phần trăm nghĩa là “trên một trăm”, nên 15% là 15 trên 100, tức 0,15. Nắm được điều này, gần như mọi bài toán phần trăm đều quy về một trong ba công thức. Muốn tìm phần trăm của một số, nhân rồi chia cho 100: 15% của 200 là 200 × 15 ÷ 100 = 30. Muốn biết một số chiếm bao nhiêu phần trăm số khác, lấy phần chia cho tổng rồi nhân 100: 30 trên 120 là 30 ÷ 120 × 100 = 25%. Muốn tìm tổng khi biết một phần và tỷ lệ của nó, lấy phần chia cho phần trăm rồi nhân 100: nếu 30 là 25% thì tổng là 30 ÷ 25 × 100 = 120.',
        'Mẹo là luôn tự hỏi “phần trăm của cái gì?”. Con số đứng sau chữ “của” là số gốc, và số gốc nằm ở mẫu số. Phần lớn lỗi xảy ra khi số gốc lặng lẽ thay đổi giữa chừng.',
      ],
      list: [
        'Phần = tổng × phần trăm ÷ 100',
        'Phần trăm = phần ÷ tổng × 100',
        'Tổng = phần ÷ phần trăm × 100',
      ],
    },
    {
      h: 'Tăng giảm, giảm giá và cái bẫy tính ngược',
      p: [
        'Phần trăm thay đổi so sánh giá trị mới với giá trị cũ: (mới − cũ) ÷ cũ × 100. Giá tăng từ 80 lên 100 là tăng 25%, nhưng giá giảm từ 100 xuống 80 chỉ giảm 20%, vì số gốc mỗi chiều khác nhau. Sự lệch này giải thích một câu đố nổi tiếng: lấy 100 giảm 20% được 80, cộng lại 20% chỉ được 96.',
        'Cũng vì vậy mà giảm giá chồng nhỏ hơn vẻ ngoài. Giảm thêm 20% trên giá đã giảm 30% không phải giảm 50%, mà bạn trả 0,7 × 0,8 = 0,56 giá gốc, tức giảm 44%. Muốn đảo ngược một thay đổi phần trăm, hãy chia chứ đừng trừ. Chiếc áo 400.000 đồng sau khi giảm 20% có giá gốc 400.000 ÷ 0,8 = 500.000 đồng. Hóa đơn 110.000 đồng đã gồm 10% VAT thì giá trước thuế là 110.000 ÷ 1,1 = 100.000 đồng, không phải 99.000 đồng. Thẻ “Tìm giá gốc” hiển thị phép chia này và còn cảnh báo đáp án sai dễ mắc.',
      ],
    },
    {
      h: 'Phần trăm khác điểm phần trăm',
      p: [
        'Khi so sánh hai con số phần trăm, có hai cách mô tả chênh lệch đều đúng, nhưng cho kết quả rất khác. Nếu lãi suất tiết kiệm tăng từ 4% lên 6%, nó tăng 2 điểm phần trăm: chỉ cần lấy tỷ lệ này trừ tỷ lệ kia. Xét tương đối, lãi suất tăng 50%, vì mức tăng 2 bằng một nửa của 4 ban đầu. Tin tức và quảng cáo đôi khi chọn cách nghe ấn tượng hơn, nên hãy xem kỹ họ đang nói theo cách nào.',
        'Điểm phần trăm là đơn vị phù hợp cho lãi suất, thuế suất, tỷ lệ thất nghiệp, thăm dò ý kiến và tỷ lệ chuyển đổi, tức những con số vốn đã là phần trăm. Thẻ “Chênh điểm %” cho bạn cả hai con số cùng lúc: chênh lệch tính bằng điểm và thay đổi tương đối tính bằng phần trăm.',
      ],
    },
    {
      h: 'Ví dụ đời thường và mẹo tính nhẩm',
      p: [
        'Không phải lúc nào cũng cần máy tính. 10% của một số chính là số đó dời dấu thập phân sang trái một chữ số: 10% của 64 là 6,4. 5% là một nửa của nó, còn 20% là gấp đôi. Phần trăm cũng có thể đổi chỗ: 8% của 50 bằng 50% của 8, tức là 4. Muốn tính tiền tip 15%, hãy lấy 10% rồi cộng thêm một nửa của nó.',
        'Với những quyết định lớn, hãy viết công thức ra. So sánh mức tăng lương với lạm phát bằng cách trừ hai tỷ lệ theo điểm phần trăm, kiểm tra giá khuyến mãi bằng cách nhân với phần còn lại thay vì trừ hai lần, và nếu khoản vay ghi lãi suất theo tháng, hãy nhớ rằng mười hai tháng lãi kép sẽ lớn hơn mười hai lần lãi suất đó.',
      ],
      list: [
        'Giảm 25% nghĩa là trả 0,75 giá; giảm 40% là trả 0,6.',
        'Một giá trị giảm 50% cần tăng 100% mới trở lại như cũ.',
        'Gấp đôi là +100%, giảm một nửa là −50%.',
      ],
    },
  ],
  cta: 'Mở máy tính phần trăm',
};
