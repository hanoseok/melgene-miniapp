module.exports = {
  metaTitle: 'Sơ đồ thi đấu: miễn đấu, hạt giống, bốc thăm công bằng',
  description: 'Sơ đồ thi đấu loại trực tiếp hoạt động thế nào, miễn đấu và hạt giống là gì, cách dùng cho buổi chơi game, công ty, thể thao hay trò chọn món yêu thích, và vì sao bốc thăm ngẫu nhiên là công bằng.',
  h1: 'Sơ đồ thi đấu: loại trực tiếp, miễn đấu và hạt giống',
  updated: '2026-10-30',
  intro: 'Sơ đồ thi đấu là cách đơn giản nhất để biến một danh sách dài thành một người thắng duy nhất. Hai bên gặp nhau, một bên đi tiếp, và số người giảm một nửa sau mỗi vòng cho đến khi còn lại nhà vô địch. Bài viết giải thích cách tạo sơ đồ loại trực tiếp, vì sao có người được miễn đấu, hạt giống là gì, cách dùng cho buổi chơi với bạn bè, cuộc thi ở công ty, thể thao hay trò “world cup” chọn món yêu thích, và vì sao bốc thăm thật sự ngẫu nhiên là khởi đầu công bằng nhất.',
  sections: [
    {
      h: 'Thể thức loại trực tiếp diễn ra thế nào',
      p: [
        'Trong thể thức loại trực tiếp, mỗi trận có đúng một người thắng và một người thua, và người thua bị loại. Với 8 người sẽ có 4 trận tứ kết, 2 trận bán kết và 1 trận chung kết. Từ đó có một quy tắc gọn: mỗi trận loại đúng một người, nên sơ đồ có n người luôn cần n − 1 trận để tìm ra nhà vô địch. 16 người cần 15 trận, 64 người cần 63 trận.',
        'Tên vòng đếm ngược từ cuối: còn 2 là chung kết, còn 4 là bán kết, còn 8 là tứ kết, trước đó là vòng 16 và vòng 32. Trong ứng dụng này, bạn có thể tự chọn người thắng với hai thẻ mỗi lần, hoặc chỉ bốc thăm sơ đồ rồi chạm người thắng sau khi đấu thật.',
      ],
      list: [
        'Nhập 2–64 tên hoặc lựa chọn, mỗi dòng một mục.',
        'Chọn bốc thăm ngẫu nhiên hoặc giữ thứ tự làm hạt giống.',
        'Chọn người thắng từng trận, hoặc chỉ bốc thăm sơ đồ.',
        'Đổi ý thì bấm hoàn tác hoặc chạm tên còn lại.',
        'Lưu sơ đồ thành ảnh PNG, chép văn bản hoặc chia sẻ liên kết.',
      ],
    },
    {
      h: 'Miễn đấu: khi con số không tròn',
      p: [
        'Sơ đồ chỉ chia đôi gọn gàng khi số chỗ là lũy thừa của hai: 2, 4, 8, 16, 32 hoặc 64. Số người thật hiếm khi như vậy. Với 6 người, sơ đồ vẫn có 8 chỗ nên còn trống 2 chỗ. Ai bị xếp gặp chỗ trống sẽ được miễn đấu, tức là vào thẳng vòng sau mà không cần đá.',
        'Suất miễn đấu phải được rải đều, không dồn lại. Sơ đồ tốt không bao giờ để hai chỗ trống gặp nhau và chia miễn đấu đều nhất có thể giữa nửa trên và nửa dưới, để không bên nào có đường đi dễ hơn. Ứng dụng đặt miễn đấu theo cách xếp hạt giống chuẩn, đúng như vậy, và không bao giờ tính miễn đấu là một trận.',
      ],
    },
    {
      h: 'Hạt giống: bốc thăm hay giữ thứ tự của bạn',
      p: [
        'Hạt giống quyết định mỗi người bắt đầu ở đâu. Trong thể thao, người ta xếp theo sức mạnh để các đội mạnh gặp nhau muộn nhất: hạt giống số 1 gặp hạt giống thấp nhất trước, số 2 nằm ở nửa còn lại, và cứ thế. Nếu bạn giữ thứ tự của mình trong ứng dụng, danh sách sẽ thành thứ tự hạt giống: dòng đầu là số 1, dòng hai là số 2, và hạt giống cao được miễn đấu trước.',
        'Khi không muốn ai có lợi thế, hãy bốc thăm ngẫu nhiên. Nó hợp với trò chơi giữa bạn bè, bốc thăm quà, chọn món ăn hay phim, hoặc bất kỳ nhóm nào không muốn bị nói là xếp cặp có sắp đặt.',
      ],
    },
    {
      h: 'Vì sao bốc thăm ngẫu nhiên là công bằng',
      p: [
        'Bốc thăm chỉ công bằng khi mọi thứ tự đều có xác suất như nhau. Nhiều công cụ nhanh xáo bằng số ngẫu nhiên yếu hoặc mẹo sắp xếp, vô tình ưu ái vài vị trí. Ứng dụng này dùng bộ sinh số ngẫu nhiên mật mã của trình duyệt cùng thuật toán Fisher–Yates có lấy mẫu loại bỏ, xóa cả độ lệch nhỏ xuất hiện khi ép số ngẫu nhiên vào một khoảng hẹp hơn. Nhờ vậy mọi cách xếp danh sách đều có cơ hội y hệt nhau, và không ai, kể cả người cầm điện thoại, chọn được ai gặp ai.',
        'Công bằng còn nghĩa là sơ đồ luôn nhất quán. Nếu bạn đổi người thắng ở vòng trước, mọi kết quả sau phụ thuộc vào trận đó đều bị xóa, nên một cái tên không thể xuất hiện ở vòng mà nó chưa vào tới.',
      ],
    },
    {
      h: 'Gợi ý: chơi game, công ty, thể thao và world cup món yêu thích',
      p: [
        'Khi tụ tập, hãy nhập tên mọi người, bốc thăm rồi đấu thật bóng bàn, game hay oẳn tù tì và chạm người thắng sau mỗi trận. Ở công ty, sơ đồ là cách bình chọn nhẹ nhàng cho bữa trưa cả nhóm, tên dự án hay chiếc cốc đẹp nhất phòng pha chế. Câu lạc bộ và giải nhỏ có thể bốc thăm cúp loại trực tiếp, lưu ảnh và đăng vào nhóm chat.',
        'Ở Hàn Quốc, thể thức này nổi tiếng với tên “world cup hình mẫu lý tưởng”: chọn cái mình thích hơn giữa hai lựa chọn, vòng này qua vòng khác, đến khi còn một. Hãy thử với món ăn, bài hát, điểm du lịch hay bất cứ thứ gì bạn phân vân. Kết quả cuối thường bất ngờ, và đó là một nửa niềm vui. Xong rồi, chia sẻ liên kết để bạn bè thấy cả con đường đến ngôi vô địch.',
      ],
    },
  ],
  cta: 'Tạo sơ đồ thi đấu ngay',
};
