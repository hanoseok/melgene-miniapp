module.exports = {
  metaTitle: 'Hướng dẫn quay số ngẫu nhiên: bốc thăm công bằng',
  description: 'Cách dùng công cụ quay số ngẫu nhiên để bốc thăm trúng thưởng, làm minigame fanpage và gọi bạn trong lớp, ngẫu nhiên thật sự là gì, số ngẫu nhiên thật và giả, cùng mẹo bốc thăm minh bạch.',
  h1: 'Quay số ngẫu nhiên: cách dùng và cách bốc thăm thật công bằng',
  updated: '2026-10-11',
  intro: 'Công cụ quay số ngẫu nhiên trông như thứ đơn giản nhất trên mạng: gõ hai số và nhận về một số. Vậy mà người ta dùng nó để chọn người trúng thưởng, gọi học sinh lên bảng, bốc số, lấy mẫu câu trả lời khảo sát và dàn xếp những cuộc cãi nhau nhỏ, và lần nào kết quả cũng chỉ có ý nghĩa khi mọi người tin vào nó. Bài hướng dẫn này giới thiệu cách dùng, ý tưởng cho minigame và lớp học, giải thích ngẫu nhiên thật sự nghĩa là gì, so sánh số ngẫu nhiên thật và giả, rồi kết thúc bằng vài thói quen đơn giản giúp buổi bốc thăm minh bạch.',
  sections: [
    {
      h: 'Cách dùng công cụ quay số ngẫu nhiên',
      p: [
        'Mọi thứ nằm gọn trong một màn hình. Nhập số nhỏ nhất vào ô Từ và số lớn nhất vào ô Đến, hoặc chạm vào khoảng nhanh như 1–10, 1–45 hay 1–100. Cả hai đầu đều được tính, nên từ 1 đến 10 vẫn có thể ra 1 hoặc 10. Số âm cũng dùng được, và mỗi đầu có thể xa tới một tỷ theo cả hai chiều.',
        'Tiếp theo chọn số lượng cần quay, từ một đến một nghìn. Để tắt Cho phép lặp nếu mỗi số chỉ được ra một lần, như số vé bốc thăm hay số ghế. Bật Sắp xếp nếu muốn đọc từ nhỏ đến lớn. Trong Tùy chọn khác, bạn có thể loại trừ số như 13 hoặc cả đoạn như 20-25 và đặt tên cho đợt quay. Bấm Quay số, các chữ số sẽ chạy như máy xèng rồi dừng ở kết quả.',
      ],
      list: [
        'Nhập Từ và Đến, hoặc chạm vào một khoảng nhanh.',
        'Chọn số lượng số cần quay.',
        'Quyết định có cho lặp và có sắp xếp hay không.',
        'Nếu cần, loại trừ số và đặt tên đợt quay.',
        'Bấm Quay số, rồi sao chép các số hoặc link kết quả.',
      ],
    },
    {
      h: 'Ý tưởng cho minigame, bốc thăm và lớp học',
      p: [
        'Hầu hết cách dùng đều là đánh số cho từng người hoặc từng món rồi để công cụ chọn. Với minigame trên fanpage Facebook hay TikTok, hãy đánh số các bình luận hợp lệ theo thứ tự thời gian, quay mỗi giải một số không lặp, rồi đăng link kết quả để mọi người xem đúng lượt quay cùng thời gian và cài đặt. Tên như Minigame tháng 10 cũng nằm trong link.',
        'Thầy cô dùng số ngẫu nhiên để công bằng và thêm chút hồi hộp cho tiết học. Khi mỗi bạn đều có số thứ tự, không ai than được là lúc nào cũng gọi trúng một người.',
      ],
      list: [
        'Bốc thăm: đặt khoảng theo số vé đã phát và quay mỗi giải một người.',
        'Minigame bình luận: đánh số người chơi hợp lệ, quay không lặp và chia sẻ link kết quả.',
        'Lớp học: chọn ai trả lời, ghép cặp ngẫu nhiên hoặc xếp thứ tự thuyết trình.',
        'Văn phòng: thứ tự trao quà bí mật, người ghi biên bản họp hay quán ăn trưa từ danh sách đã đánh số.',
        'Học và chơi: số để luyện tính nhẩm, trang sách cần đọc hay xúc xắc bao nhiêu mặt tùy ý.',
      ],
    },
    {
      h: 'Ngẫu nhiên thật sự nghĩa là gì',
      p: [
        'Một lượt quay là ngẫu nhiên khi mọi kết quả hợp lệ đều có cơ hội như nhau và không ai đoán được kết quả tiếp theo, kể cả người bấm nút lẫn người viết code. Ngẫu nhiên không có nghĩa là trải đều trong vài lần quay. Nếu quay vài lần từ 1 đến 10, việc trùng số hay ra liên tiếp là hoàn toàn bình thường: ra số 7 hai lần liền có xác suất đúng bằng ra số 3 rồi số 8.',
        'Con người nổi tiếng là giả vờ ngẫu nhiên rất dở. Khi được hỏi chọn một số từ 1 đến 10, nhiều người chọn 7 và rất ít người chọn 1 hay 10; khi cố viết một dãy số ngẫu nhiên, ta né số trùng nhiều hơn hẳn so với xác suất thật. Vì vậy công cụ quay số có ích cả với chuyện nhỏ như ai đi trước: nó xóa đi những thói quen ẩn trong lựa chọn của con người.',
      ],
    },
    {
      h: 'Ngẫu nhiên thật, giả ngẫu nhiên và bộ sinh số mật mã',
      p: [
        'Máy tính làm theo lệnh nên không thể tự tạo ra sự ngẫu nhiên từ hư không. Bộ sinh số giả ngẫu nhiên bắt đầu từ một giá trị gọi là hạt giống rồi dùng công thức để tạo ra một dãy dài trông như ngẫu nhiên. Loại đơn giản đủ dùng cho game nhưng có thể bị đoán trước và còn sót những quy luật tinh vi. Số ngẫu nhiên thật lấy từ nhiễu vật lý, như nhiễu nhiệt trong linh kiện hay độ lệch thời gian rất nhỏ của phần cứng.',
        'Các trình duyệt hiện đại có bộ sinh số an toàn mật mã crypto.getRandomValues, và công cụ này dùng chính nó. Hệ điều hành nạp hạt giống bằng nhiễu phần cứng, và nó được thiết kế để kết quả trước không tiết lộ gì về kết quả sau, nên cũng được dùng để tạo khóa bảo mật. Ngoài ra công cụ còn tránh một lỗi kinh điển gọi là thiên lệch do phép chia lấy dư: thu một số ngẫu nhiên lớn về khoảng nhỏ bằng phép chia lấy dư sẽ khiến vài số có thêm chút cơ hội. Công cụ bỏ những giá trị dư đó và quay lại, nên mọi số trong khoảng đều có xác suất đúng bằng nhau. Khi quay không lặp, nó dùng cách xáo trộn chạy được cả trên khoảng hai tỷ số.',
      ],
    },
    {
      h: 'Mẹo để bốc thăm công bằng và minh bạch',
      p: [
        'Công cụ công bằng mới chỉ là một nửa của một lượt bốc thăm công bằng. Nửa còn lại là chuẩn bị sao cho sau này không ai nghi ngờ kết quả.',
      ],
      list: [
        'Công bố luật trước: khoảng số, cách đánh số người chơi và số người trúng giải.',
        'Chốt danh sách người tham gia trước khi quay và ghi lại ai mang số nào.',
        'Quay một lần và giữ kết quả. Quay lại đến khi vừa ý thì bốc thăm chẳng còn ý nghĩa.',
        'Chia sẻ link kết quả: trong đó có các số, cài đặt và thời gian, nên ai xem cũng thấy lượt quay gốc chứ không phải lượt mới.',
        'Nếu có người xem, hãy quay trên màn hình chia sẻ hoặc livestream để mọi người cùng thấy các số dừng lại.',
        'Chỉ loại trừ những số thật sự không hợp lệ, như vé chưa phát ra, và nói rõ công khai.',
      ],
    },
  ],
  cta: 'Quay số ngẫu nhiên ngay',
};
