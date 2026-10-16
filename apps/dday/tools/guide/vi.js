module.exports = {
  metaTitle: 'Hướng dẫn đếm ngược ngày: còn bao lâu, 100 ngày, cộng trừ',
  description: 'Cách dùng công cụ đếm ngược ngày, cách tính ngày (có tính ngày đầu hay không), vì sao các cặp đôi Hàn Quốc gọi ngày đầu là ngày 1, mẹo làm thẻ đếm ngược và lịch sử ngắn của việc đếm ngược.',
  h1: 'Đếm ngược ngày: tính đúng số ngày còn lại, đã qua và sau bao nhiêu ngày',
  updated: '2026-10-17',
  intro: 'Đếm ngày nghe thì dễ, nhưng làm thật mới thấy rối. Chuyến đi thứ Bảy tuần sau còn 6 hay 7 ngày nữa? Nếu bắt đầu yêu nhau ngày 1 tháng 1 thì ngày thứ 100 là 10 hay 11 tháng 4? Công cụ đếm ngược ngày trả lời ngay, lúc nào cũng theo cùng một quy tắc. Bài viết này giải thích cách dùng ba chế độ, cách tính ngày, lý do cùng một ngày mà mỗi người đếm ra một kiểu, và cách biến bộ đếm thành tấm thẻ gửi cho bạn bè. Cuối bài là lịch sử ngắn của việc đếm ngược, từ phóng tên lửa đến ứng dụng cho các cặp đôi.',
  sections: [
    {
      h: 'Cách dùng công cụ đếm ngược ngày',
      p: [
        'Chọn chế độ ở các tab phía trên. Đếm ngược cho biết còn bao nhiêu ngày đến một ngày, viết là D-n: D-1 là ngày mai, D-DAY là hôm nay. Bên dưới con số là đồng hồ chạy theo giờ, phút, giây. Nếu sự kiện có giờ cụ thể, ví dụ buổi hòa nhạc lúc 19 giờ 30, bạn có thể nhập giờ; để trống thì đếm đến 0 giờ của ngày đó.',
        'Đã bao lâu thì ngược lại. Nhập ngày một điều bắt đầu, như ngày gặp nhau, ngày bé chào đời hay ngày đầu đi làm, bạn sẽ thấy hôm nay là ngày thứ mấy, kèm danh sách các cột mốc 100, 200, 1000 ngày và kỷ niệm năm sắp tới. Cộng trừ ngày là phép tính ngày đơn giản: chọn ngày, chọn sau hoặc trước, nhập số ngày, bạn có ngày kết quả và thứ trong tuần.',
        'Nếu muốn, hãy đặt tiêu đề, chọn emoji và màu cho thẻ. Sau đó lưu thành ảnh, sao chép liên kết mở đúng tấm thẻ đó trên điện thoại khác, hoặc lưu vào danh sách trên máy này. Những gì bạn nhập không được gửi lên máy chủ.',
      ],
      list: [
        'Chọn nhanh điền sẵn Halloween, Giáng sinh, Tết Dương lịch hoặc Valentine gần nhất.',
        'Nút Hôm nay điền ngày hôm nay, tiện khi cộng trừ ngày.',
        'Chạm vào một mục đã lưu để mở lại với số liệu mới nhất.',
        'Liên kết chia sẻ được đếm lại trên máy và theo múi giờ của người nhận.',
      ],
    },
    {
      h: 'Số ngày được tính như thế nào',
      p: [
        'Công cụ đếm ngày theo lịch chứ không theo từng khối 24 giờ. Nó so ngày trên máy bạn với ngày mục tiêu và đếm số lần qua nửa đêm ở giữa. Vì vậy D-1 luôn là ngày mai, kể cả khi chỉ còn mười phút nữa là sang ngày mới. Chỉ có đồng hồ trực tiếp dùng thời gian thật, chính xác đến từng giây.',
        'Có hai chi tiết khiến bảng tính tự làm hay sai. Thứ nhất là giờ mùa hè ở nhiều nước: ngày đổi giờ dài 23 hoặc 25 tiếng, nên lấy mili giây chia cho độ dài một ngày sẽ ra 1,96 và bộ đếm nhảy sớm một ngày. Công cụ này so các ngày vào buổi trưa theo một mốc cố định, nên ngày nào cũng tính đúng một ngày. Thứ hai là năm nhuận: ngày 29 tháng 2 chỉ có trong năm nhuận (2024, 2028, nhưng không phải 2100), và 29/2/2024 cộng 365 ngày là 28/2/2025. Kỷ niệm của một khởi đầu ngày 29/2 rơi vào 28/2 trong năm thường.',
      ],
    },
    {
      h: 'Có tính ngày đầu không? Vì sao cặp đôi Hàn Quốc gọi là ngày 1',
      p: [
        'Câu hỏi đã bao nhiêu ngày rồi có hai cách trả lời đều đúng. Cách không tính ngày đầu chỉ đếm những ngày trọn vẹn đã qua, ngày bắt đầu là ngày 0, hôm sau là ngày 1. Phần lớn công cụ tính ngày, ngân hàng và hợp đồng đếm như vậy. Cách tính ngày đầu thì coi chính ngày bắt đầu là ngày 1, giống như nói ngày đầu tiên đi học.',
        'Ở Hàn Quốc, các cặp đôi kỷ niệm 100 ngày yêu nhau và gia đình mừng 100 ngày tuổi của em bé, gọi là baegil. Cả hai đều tính ngày đầu: ngày bắt đầu yêu là ngày 1, nên ngày thứ 100 là 99 ngày sau đó. Đó là lý do có công tắc Tính ngày bắt đầu là ngày 1. Bật lên nếu muốn đếm kiểu Hàn hoặc theo cách nhóm bạn quen dùng, tắt đi nếu muốn đếm đúng số ngày đã trôi qua. Danh sách cột mốc cũng theo cùng cài đặt.',
      ],
      list: [
        'Bật (tính ngày đầu): ngày bắt đầu = ngày 1, ngày thứ 100 = ngày bắt đầu + 99 ngày.',
        'Tắt (không tính ngày đầu): ngày bắt đầu = ngày 0, 100 ngày = ngày bắt đầu + 100 ngày.',
        'Chế độ đếm ngược không bị ảnh hưởng: D-n luôn là số ngày còn lại.',
      ],
    },
    {
      h: 'Mẹo làm thẻ đếm ngược đẹp hơn',
      p: [
        'Tiêu đề ngắn trông đẹp nhất trên thẻ và trong danh sách. Chữ Đà Lạt kèm emoji máy bay dễ đọc hơn cả một câu dài, và emoji đã nói lên không khí. Chọn màu theo dịp: cà chua cho ngày vui, bạc hà cho khởi đầu mới, nho cho ngày kỷ niệm, biển cho chuyến đi và mực cho những hạn chót cần nghiêm túc.',
        'Với buổi hòa nhạc hay chuyến bay có giờ bắt đầu, hãy nhập giờ để đồng hồ về 0 đúng lúc. Hạn chót thường được tính đến hết ngày, khi đó đặt 23:59. Khi gửi thẻ cho bạn ở nước ngoài, họ thấy cùng ngày đó được đếm theo múi giờ của họ, nên bữa tiệc thứ Bảy vẫn là thứ Bảy với tất cả mọi người.',
        'Chế độ cộng trừ ngày còn hữu ích trong đời sống: hạn đổi trả 90 ngày kết thúc khi nào, 30 ngày trước buổi phỏng vấn visa là ngày nào, hay ngày thứ 1000 của hai bạn rơi vào thứ mấy.',
      ],
    },
    {
      h: 'Lịch sử ngắn của việc đếm ngược',
      p: [
        'Thói quen đếm ngày chờ một khoảnh khắc có từ trước cả đồng hồ, nhưng kiểu đếm ngược mười, chín, tám lại khá mới. Nó được biết đến rộng rãi nhờ bộ phim Đức Woman in the Moon năm 1929, khi đạo diễn thêm cảnh đếm ngược trước lúc phóng tên lửa để tăng kịch tính. Sau đó các kỹ sư tên lửa thật áp dụng, và những buổi truyền hình phóng tàu thập niên 1960 đã đưa nó vào đời sống hằng ngày.',
        'Từ D-Day bắt nguồn từ kế hoạch quân sự: D là ngày chiến dịch bắt đầu, còn D-3 hay D+2 chỉ những ngày trước và sau đó. Ở Hàn Quốc, từ này trở thành cách nói quen thuộc cho mọi ngày quan trọng, từ kỳ thi đến đám cưới, và các ứng dụng đếm ngày cho cặp đôi rất được ưa chuộng. Ngày nay cùng một ý tưởng ấy sống trong lịch Mùa Vọng, ứng dụng chuẩn bị cưới và màn đếm ngược đêm giao thừa, và giờ là trong một tấm thẻ bạn tạo trong vài giây.',
      ],
    },
  ],
  cta: 'Mở công cụ đếm ngược ngày',
};
