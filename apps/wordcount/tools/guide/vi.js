module.exports = {
  metaTitle: 'Hướng dẫn đếm ký tự: cách đếm chữ, số từ và byte',
  description: 'Công cụ đếm ký tự đếm ký tự có và không dấu cách, số từ và byte như thế nào, vì sao Word và các trang web không khớp nhau, các giới hạn thường gặp và mẹo viết vừa đủ độ dài.',
  h1: 'Hướng dẫn đếm ký tự: đếm những gì, vì sao các công cụ lệch nhau và cách viết vừa giới hạn',
  updated: '2026-10-15',
  intro: 'Giới hạn độ dài ở khắp nơi: bài luận xin học bổng tối đa 500 từ, thư xin việc 2.000 ký tự có dấu cách, bài đăng 280 ký tự, đoạn mô tả trên Google bị cắt sau khoảng 155 ký tự. Một công cụ đếm tốt cho bạn biết mình đang ở đâu ngay khi viết, để không phải cuống cuồng cắt bớt vào phút cuối. Bài này giải thích cách dùng công cụ, cách định nghĩa từng con số, vì sao các phần mềm cho kết quả hơi khác nhau, những giới hạn hay gặp và cách viết thoải mái đến đúng mục tiêu.',
  sections: [
    {
      h: 'Cách dùng công cụ đếm ký tự',
      p: [
        'Gõ thẳng vào ô hoặc dán văn bản từ bất cứ đâu. Thanh màu xanh đậm phía trên hiện bốn con số hay xem nhất: ký tự có dấu cách, ký tự không dấu cách, số từ và byte. Thanh này luôn nằm trên màn hình khi bạn cuộn để sửa một bản nháp dài. Bên dưới, phần số liệu chi tiết có thêm số câu, đoạn, dòng và thời gian đọc, thời gian nói ước tính.',
        'Nếu có giới hạn, hãy chọn 500, 1.000 hoặc 1.500 ký tự, hoặc tự nhập số. Thanh tiến độ đầy dần khi bạn viết, chuyển cam khi gần chạm mốc và đỏ khi vượt, đồng thời cho biết còn bao nhiêu hoặc cần cắt bao nhiêu ký tự. Công tắc "Tính dấu cách" quyết định mục tiêu theo con số có hay không có dấu cách. Viết xong, bấm "Xem tổng kết" để có bản tóm tắt dễ sao chép.',
      ],
      list: [
        'Dán hoặc gõ văn bản, các con số đổi theo từng phím.',
        'Đặt mục tiêu và chọn có tính dấu cách hay không.',
        'Chọn cách tính byte theo biểu mẫu: UTF-8, UTF-8 + CRLF hoặc 2 byte (cũ).',
        'Dọn văn bản vừa dán bằng "Gọn dấu cách" hoặc "Nối các dòng", lỡ tay thì "Hoàn tác".',
        'Bản nháp chỉ lưu trong trình duyệt này, tải lại trang vẫn còn.',
      ],
    },
    {
      h: 'Mỗi con số được đếm thế nào',
      p: [
        'Ký tự có dấu cách là mọi thứ mắt nhìn thấy là một ký tự, cộng thêm dấu cách và xuống dòng, mỗi lần xuống dòng tính 1. Tiếng Việt có chữ mang hai dấu như "ệ" hay "ữ"; có trang lưu chúng thành chữ cái cộng dấu riêng và đếm thành 2 hoặc 3, còn ở đây "ệ" luôn là 1 ký tự như mắt thấy. Lá cờ hay emoji gia đình ghép từ nhiều mã cũng là 1. Ký tự không dấu cách là con số đó trừ hết dấu cách, tab và xuống dòng.',
        'Số từ được tìm bằng bộ tách từ có sẵn trong trình duyệt. Tiếng Việt viết cách từng âm tiết, nên "học sinh" được tính là 2 từ, giống cách Word đếm. Câu kết thúc ở dấu chấm, chấm hỏi hoặc chấm than, còn đoạn văn ngăn nhau bằng một dòng trống.',
        'Thời gian đọc tính khoảng 238 từ mỗi phút khi đọc thầm, thời gian nói khoảng 150 từ mỗi phút, nhịp thuyết trình thong thả. Vì tiếng Việt đếm theo âm tiết nên con số này chỉ là ước lượng.',
      ],
      list: [
        'UTF-8: chữ không dấu, số và dấu cách 1 byte, chữ có dấu tiếng Việt 2 hoặc 3 byte, chữ Hán và Hàn 3, phần lớn emoji 4.',
        'UTF-8 + CRLF: giống UTF-8 nhưng mỗi lần xuống dòng tính 2 byte, như tệp văn bản trên Windows.',
        '2 byte (cũ): ASCII 1 byte, ký tự khác 2 byte, xuống dòng 2 byte (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Vì sao Word, Google Docs và các trang web đếm khác nhau',
      p: [
        'Không có một quy tắc chính thức duy nhất nên lệch vài ký tự là bình thường. Word không đếm dấu đoạn văn, trong khi nhiều biểu mẫu trên mạng tính cả xuống dòng, có nơi tính là 2. Một số công cụ đếm từng đơn vị mã Unicode nên chữ có dấu hay emoji bị tính thành 2 ký tự trở lên. Từ có gạch nối, số và địa chỉ email cũng được xử lý mỗi nơi một kiểu.',
        'Cách an toàn nhất là đọc hướng dẫn của biểu mẫu, chỉnh công cụ đếm cho giống, rồi chừa lại vài ký tự thay vì viết sát giới hạn. Trước khi gửi, hãy dán văn bản vào ô thật và xem con số trang web hiển thị.',
      ],
    },
    {
      h: 'Các giới hạn thường gặp',
      p: [
        'Hồ sơ du học, học bổng và xin việc thường giới hạn bài luận theo số từ (như 500 từ) hoặc số ký tự có dấu cách. Tóm tắt luận văn và bài báo khoa học hay giới hạn theo số từ. Luôn kiểm tra xem yêu cầu nói về ký tự hay từ, có tính dấu cách hay không.',
        'Mỗi mạng xã hội có mức trần riêng và thay đổi theo thời gian. Trên X, một bài đăng thường được 280 ký tự. Google thường hiện khoảng 150 đến 160 ký tự của thẻ mô tả rồi cắt.',
      ],
      list: [
        'X (Twitter): 280 ký tự.',
        'Chú thích Instagram: 2.200 ký tự.',
        'YouTube: tiêu đề 100 ký tự, mô tả 5.000 ký tự.',
        'SMS: 160 ký tự không dấu, có dấu tiếng Việt chỉ còn 70.',
        'Meta description: khoảng 150 đến 160 ký tự.',
      ],
    },
    {
      h: 'Mẹo viết vừa đủ giới hạn',
      p: [
        'Hãy viết hết những gì muốn nói mà chưa nhìn con số, rồi mới cắt. Rút gọn một bản nháp dài gần như luôn cho văn bản chắc hơn là kéo dài một bản ngắn. Bắt đầu từ chỗ cắt được nhiều: câu lặp lại đề bài, cụm rườm rà như "có thể nói rằng", "tiến hành", và từ đệm như "rất", "thật sự". Bảng từ lặp nhiều cũng giúp ích: một từ xuất hiện năm lần trong đoạn ngắn thường là lặp ý chứ không phải nhấn mạnh.',
      ],
      list: [
        'Viết khoảng 90 đến 100% giới hạn, quá ngắn dễ bị coi là thiếu đầu tư.',
        'Chừa vài ký tự cho biểu mẫu đếm xuống dòng theo cách khác.',
        'Văn bản dán từ PDF hay email thì bấm "Gọn dấu cách".',
        'Với bài nói, hãy đọc thành tiếng và xem "Thời gian nói".',
        'Lưu bản cuối ở nơi khác nữa, vì bản nháp chỉ nằm trong trình duyệt này.',
      ],
    },
  ],
  cta: 'Đếm văn bản của tôi ngay',
};
