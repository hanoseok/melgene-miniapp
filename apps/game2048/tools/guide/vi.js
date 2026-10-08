module.exports = {
  "metaTitle": "Game 2048: cách chơi, mẹo chiến thuật và nguồn gốc",
  "description": "Tìm hiểu cách chơi 2048, vì sao chiến thuật góc hiệu quả, cách tính điểm và nguồn gốc của trò chơi. Sau đó chơi miễn phí ngay trên trình duyệt.",
  "h1": "Game 2048: cách chơi và đạt tới ô 2048",
  "updated": "2026-10-09",
  "intro": "2048 trông đơn giản: trượt các ô số trên bảng bốn nhân bốn và ghép những ô giống nhau. Nhưng nó sâu hơn bạn nghĩ. Bài viết này trình bày luật chơi, cách tính điểm, các kỹ thuật chiến thuật của người chơi kinh nghiệm và lịch sử ngắn của một trong những trò xếp hình bị sao chép nhiều nhất thập kỷ qua.",
  "sections": [
    {
      "h": "Cách chơi",
      "p": [
        "Bảng là lưới bốn nhân bốn với vài ô số. Vuốt trên bảng hoặc nhấn phím mũi tên (hay W, A, S, D), mọi ô sẽ trượt xa nhất có thể theo hướng đó. Khi hai ô cùng số va vào nhau, chúng ghép thành một ô có giá trị gấp đôi: hai ô 2 thành 4, hai ô 64 thành 128.",
        "Sau mỗi nước đi thực sự làm thay đổi bảng, một ô mới xuất hiện ở ô trống. Phần lớn là số 2, và khoảng mười lần có một lần là số 4. Nếu cú vuốt không làm gì di chuyển, sẽ không có ô mới. Mục tiêu là tạo ra ô số 2048. Khi đạt được, bạn có thể chơi tiếp để lấy điểm cao hơn hoặc dừng lại ở đó."
      ],
      "list": [
        "Vuốt hoặc dùng phím để trượt mọi ô cùng lúc.",
        "Hai ô kề nhau cùng số sẽ ghép thành một ô giá trị gấp đôi.",
        "Một ô 2 hoặc 4 mới xuất hiện sau mỗi nước đi làm đổi bảng.",
        "Trò chơi kết thúc khi bảng đầy và không còn ô kề nhau nào giống nhau."
      ]
    },
    {
      "h": "Những luật đáng biết",
      "p": [
        "Một ô chỉ ghép được một lần trong mỗi nước đi. Nếu một hàng có 2, 2, 2, 2, một cú vuốt cho ra hai ô 4 chứ không phải một ô 8, và cặp gần bức tường phía hướng vuốt sẽ ghép trước. Chi tiết này quan trọng khi bạn lên kế hoạch ghép liên tiếp.",
        "Không có đồng hồ bấm giờ và không thể hoàn tác, nên mỗi nước đi là cố định. Điểm tăng thêm bằng giá trị của mỗi ô mới tạo ra, nên một lần ghép ra ô 512 cộng 512 điểm. Vì thế các lần ghép lớn đáng giá hơn nhiều so với lần ghép nhỏ. Điểm cao nhất được lưu trong trình duyệt này, và khi ván kết thúc, điểm của bạn có thể được so sánh ẩn danh với người chơi khác để hiện phần trăm xếp hạng."
      ]
    },
    {
      "h": "Chiến thuật: giữ ô lớn nhất ở góc",
      "p": [
        "Thói quen hữu ích nhất là chọn một góc và giữ ô lớn nhất ở đó. Xây một chuỗi giảm dần dọc theo cạnh, ô lớn nhất ở góc, ô lớn nhì ngay bên cạnh, cứ thế như một con rắn. Vì các ô trong chuỗi có giá trị gần nhau, chúng ghép lần lượt thay vì bị kẹt.",
        "Chọn hai hướng chính, ví dụ xuống và trái nếu góc của bạn ở dưới bên trái. Chỉ dùng hướng thứ ba khi buộc phải, và cố đừng dùng hướng thứ tư, vì đó là nước kéo ô lớn ra khỏi góc. Nếu bắt buộc, hãy kiểm tra hàng ở góc đã đầy chưa để ô không trượt đi mất."
      ],
      "list": [
        "Chọn một góc và để ô lớn nhất ở đó.",
        "Ưu tiên hai hướng chính, dùng hướng thứ ba tiết kiệm.",
        "Lấp đầy hàng của chuỗi trước khi xây hàng tiếp theo.",
        "Ghép các ô nhỏ gần chuỗi, đừng ở xa."
      ]
    },
    {
      "h": "Những sai lầm thường gặp",
      "p": [
        "Người mới hay vuốt cả bốn hướng để đuổi theo những lần ghép dễ. Điều này làm các ô lớn rải khắp bảng và các ô nhỏ bị kẹt ở giữa. Một sai lầm khác là tốn nước đi cho các lần ghép nhỏ trong khi ô lớn không có bạn ghép gần đó.",
        "Hãy nhìn trước một hai nước. Trước mỗi cú vuốt, tự hỏi ô mới có thể rơi vào đâu và nước đi này mở hay khóa một hàng. Khi bảng chật, hãy chậm lại: một cú vuốt bất cẩn có thể kết thúc ván chơi, còn sự kiên nhẫn có thể cứu một thế cờ rối."
      ]
    },
    {
      "h": "Nguồn gốc của 2048",
      "p": [
        "2048 do nhà phát triển người Ý Gabriele Cirulli tạo ra vào tháng 3 năm 2014 như một dự án cuối tuần. Nó lấy cảm hứng từ các trò trước đó như 1024 và Threes, và anh công khai mã nguồn, dẫn đến vô số biến thể và bản sao. Số 2048 là 2 mũ 11, và về lý thuyết, bảng bốn nhân bốn có thể đạt ô 131072.",
        "Phiên bản này thêm không khí Halloween nhưng luật là luật cổ điển. Hãy chơi vài ván, thử chiến thuật góc và chia sẻ điểm cho bạn bè để xem ai đi xa hơn."
      ]
    }
  ],
  "cta": "Chơi 2048 ngay"
};
