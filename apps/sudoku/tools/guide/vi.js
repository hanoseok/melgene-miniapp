module.exports = {
  metaTitle: 'Hướng dẫn Sudoku: luật chơi, mẹo giải và lịch sử',
  description: 'Cách chơi Sudoku online: luật chơi, cách dùng ghi chú và gợi ý, các kỹ thuật từ Single đến X-Wing, ý nghĩa của bốn cấp độ và đôi nét lịch sử về trò chơi ô số này.',
  h1: 'Sudoku: cách chơi, mẹo giải nhanh và câu chuyện phía sau',
  updated: '2026-10-12',
  intro: 'Sudoku là trò chơi giải đố logic miễn phí trên bảng 9×9 ô. Một số ô đã có sẵn số, nhiệm vụ của bạn là điền các ô còn lại sao cho mỗi hàng, mỗi cột và mỗi khối 3×3 đều có đủ các số từ 1 đến 9, mỗi số đúng một lần. Bạn không cần làm phép tính nào, và một câu đố được làm tốt thì cũng không bao giờ bắt bạn phải đoán. Bài viết này giới thiệu luật chơi, cách điều khiển trên điện thoại và máy tính, các kỹ thuật giúp bạn tiến từ mức Dễ lên Chuyên gia, cùng lịch sử khá bất ngờ của Sudoku qua nhiều quốc gia.',
  sections: [
    {
      h: 'Sudoku là gì và luật chơi ra sao',
      p: [
        'Bảng gồm 81 ô, chia thành chín hàng, chín cột và chín khối nhỏ 3×3. Câu đố bắt đầu với một số ô cho sẵn, thường từ hai mươi đến bốn mươi ô, và những số này không thể thay đổi. Mỗi ô trống phải được điền một số từ 1 đến 9, và không số nào được xuất hiện hai lần trong cùng một hàng, cùng một cột hay cùng một khối. Khi mọi ô đều được điền mà không vi phạm quy tắc đó, câu đố đã được giải.',
        'Thật ra các con số chỉ là chín ký hiệu khác nhau. Thay bằng chữ cái hay màu sắc thì trò chơi vẫn y như cũ, nên Sudoku là trò chơi tìm vị trí và loại trừ chứ không phải bài toán. Mọi bảng trên trang này đều được tạo ngay trong trình duyệt của bạn và được chương trình giải kiểm tra trước khi hiện ra, vì vậy mỗi bảng chỉ có đúng một lời giải và có thể hoàn thành hoàn toàn bằng suy luận.',
      ],
    },
    {
      h: 'Cách điều khiển và bắt đầu nhanh',
      p: [
        'Chọn cấp độ rồi chạm Câu đố mới. Chạm vào một ô trống để chọn: hàng, cột và khối của ô đó sẽ được tô nhạt để bạn thấy nó liên quan đến những ô nào, và nếu ô đã có số thì mọi số giống vậy trên bảng cũng được làm nổi bật. Sau đó chạm một số trên bàn phím số bên dưới. Con số nhỏ dưới mỗi phím cho biết số đó còn thiếu bao nhiêu, giúp bạn nhanh chóng nhận ra những số sắp điền đủ.',
        'Ván chơi được lưu vào trình duyệt này sau mỗi nước đi. Nếu bạn đóng trang, lần sau màn hình đầu sẽ có nút Chơi tiếp kèm cấp độ và thời gian. Đồng hồ dừng lại ngay khi bạn chuyển sang thẻ hoặc ứng dụng khác, và bảng được che đi cho đến khi bạn quay lại, nên bị gián đoạn cũng không thiệt gì.',
      ],
      list: [
        'Ghi chú chuyển bàn phím sang chế độ bút chì: mỗi lần chạm một số sẽ viết hoặc xóa một số ứng viên nhỏ trong ô đang chọn.',
        'Xóa làm trống ô đang chọn, còn Hoàn tác lùi lại từng nước đi một.',
        'Gợi ý điền đúng một ô cho bạn. Mỗi câu đố có ba lần, và câu đố đã dùng gợi ý sẽ không được đưa vào so sánh thời gian.',
        'Soát lỗi tô đỏ những số không khớp với lời giải. Khi tắt Soát lỗi, chỉ những số trùng nhau trong cùng hàng, cột hoặc khối mới được viền lại.',
        'Trên máy tính, dùng phím mũi tên để di chuyển, phím 1 đến 9 để điền, Backspace để xóa, N để bật ghi chú và Z để hoàn tác.',
      ],
    },
    {
      h: 'Các kỹ thuật giải, từ Single đến X-Wing',
      p: [
        'Gần như câu đố nào cũng bắt đầu bằng Single. Naked Single là ô mà hàng, cột và khối của nó đã loại trừ tám trong chín số, nên chỉ còn đúng một số có thể điền. Hidden Single là góc nhìn ngược lại: trong một hàng, cột hoặc khối, chỉ còn một ô duy nhất có thể chứa một số nào đó. Lần lượt dò từng số qua ba khối nằm cạnh nhau là cách nhanh nhất để tìm Hidden Single, và các câu đố mức Dễ trên trang này có thể giải xong chỉ với hai ý tưởng đó.',
        'Mức Vừa và Khó đòi hỏi thêm một chút. Với kỹ thuật Pointing, nếu trong một khối một số chỉ có thể nằm trên một hàng, thì số đó không thể xuất hiện ở chỗ khác của hàng ấy. Với Naked Pair, hai ô trong cùng một nhóm chỉ có đúng hai ứng viên giống nhau sẽ giữ chặt hai số đó, nên bạn có thể loại chúng khỏi các ô còn lại của nhóm. Bảng Khó còn có thể cần Naked Triple hoặc X-Wing, khi một số bị giới hạn trong cùng hai cột ở hai hàng khác nhau. Mức Chuyên gia có ít số cho sẵn nhất và cần chuỗi suy luận dài hơn.',
      ],
      list: [
        'Chỉ bắt đầu ghi chú khi không còn tìm thấy Single. Ghi chú hữu ích nhất ở những bảng khó.',
        'Ngay khi điền một số, hãy xóa số đó khỏi ghi chú trong cùng hàng, cột và khối. Trò chơi sẽ tự làm việc này giúp bạn.',
        'Khi bị kẹt, hãy xem số lượng còn lại trên bàn phím và tập trung vào những số chỉ còn thiếu một hoặc hai.',
        'Đừng cố tình đoán. Nếu có hai khả năng đều hợp lý, hãy tìm ô thứ ba quyết định giữa chúng.',
      ],
    },
    {
      h: 'Đôi nét lịch sử Sudoku',
      p: [
        'Trò chơi này còn lâu đời hơn cả cái tên của nó. Hình vuông Latin, tức những bảng mà mỗi ký hiệu xuất hiện đúng một lần trên mỗi hàng và cột, đã được nhà toán học Leonhard Euler nghiên cứu từ thế kỷ mười tám, và báo chí Pháp những năm 1890 từng đăng các câu đố số có luật tương tự. Hình thức hiện đại với chín khối 3×3 xuất hiện năm 1979 trên một tạp chí giải đố của Mỹ với tên Number Place, và thường được cho là của nhà thiết kế câu đố Howard Garns.',
        'Năm 1984, nhà xuất bản Nikoli của Nhật Bản giới thiệu trò chơi này ở Nhật và đặt tên là Sudoku, viết tắt của một câu có nghĩa là mỗi con số phải đứng một mình. Ở Nhật, người ta vẫn hay gọi nó là Nanpure, rút gọn từ Number Place. Cơn sốt toàn cầu bùng lên vào năm 2004 và 2005, khi các tờ báo Anh bắt đầu đăng Sudoku mỗi ngày, và từ đó nó trở thành gương mặt quen thuộc trên báo, sách giải đố và điện thoại.',
      ],
    },
    {
      h: 'Cấp độ, câu đố hôm nay và so sánh công bằng',
      p: [
        'Bốn cấp độ được quyết định bởi hai yếu tố: số ô cho sẵn được giữ lại và những kỹ thuật mà bộ chấm điểm tích hợp cần dùng để giải bảng đó. Mức Dễ để lại nhiều số và chỉ cần Single. Mức Vừa bớt thêm số và cho phép các bước loại trừ đơn giản. Mức Khó được chọn sao cho cần ít nhất một kỹ thuật trung cấp, còn Chuyên gia giảm số cho sẵn xuống mức thấp nhất mà vẫn giữ một lời giải duy nhất. Câu đố hôm nay được tạo từ ngày tháng, mỗi cấp độ một bảng, giống nhau cho mọi người trên thế giới, và đổi lúc 7 giờ sáng giờ Việt Nam (nửa đêm UTC), rất hợp để thi tốc độ với bạn bè trên cùng một đề.',
        'Khi bạn giải xong mà không dùng gợi ý, thời gian sẽ được lưu làm kỷ lục của cấp độ đó chỉ trong trình duyệt của bạn, và màn hình kết quả cho biết thời gian ấy đứng ở đâu so với thành tích thật của những người chơi khác. Thứ duy nhất được gửi lên máy chủ là cấp độ và thời gian làm tròn xuống theo từng năm giây, không bao giờ có tên bạn, và phần so sánh sẽ được ẩn khi chưa có gì để so.',
      ],
    },
  ],
  cta: 'Chơi Sudoku ngay',
};
