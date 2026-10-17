module.exports = {
  metaTitle: 'Đoán số (Bulls and Cows): cách chơi, mẹo và lịch sử',
  description: 'Cách chơi Đoán số (Bulls and Cows): luật chơi, cách đọc gợi ý đúng vị trí và sai vị trí, mẹo suy luận, lịch sử trò chơi và mối liên hệ với Mastermind.',
  h1: 'Đoán số (Bulls and Cows): cách chơi và cách suy luận',
  updated: '2026-10-18',
  intro: 'Đoán số là trò chơi giải mã kinh điển dành cho một người: một con số bí mật được giấu đi, bạn đoán và mỗi lần đoán đều nhận được một gợi ý nhỏ. Ở nhiều nước, trò này được gọi là bóng chày số vì các gợi ý mang tên strike, ball và out. Bài hướng dẫn này giải thích luật chơi của phiên bản trên trang, cách đọc gợi ý, vài cách nghĩ giúp câu đố dễ hơn, nguồn gốc của trò chơi và cách chơi cùng bạn bè.',
  sections: [
    {
      h: 'Đoán số (Bulls and Cows) là gì',
      p: [
        'Máy tính chọn một số bí mật gồm các chữ số khác nhau. Ở cấp độ cổ điển số này có 3 chữ số, ở cấp độ khó hơn có 4. Một chữ số không bao giờ xuất hiện hai lần, nhưng số 0 được phép dùng, kể cả ở đầu, nên 072 là một số bí mật hoàn toàn hợp lệ. Như vậy có 720 số bí mật với ba chữ số và 5.040 số với bốn chữ số, và mỗi số đều có khả năng như nhau vì các chữ số được xáo trộn công bằng ở mỗi ván.',
        'Mục tiêu của bạn là tìm ra số đó với ít lượt đoán nhất. Sau mỗi lần đoán, bạn biết mình đã gần đến mức nào nhưng không biết chữ số nào đúng, và chính điều đó tạo nên câu đố. Nếu không bật đồng hồ thì không có giới hạn thời gian, cũng không có nút gợi ý, nên cả trò chơi là sự suy luận cẩn thận.',
      ],
    },
    {
      h: 'Một ván diễn ra thế nào',
      p: [
        'Chọn 3 hoặc 4 chữ số ở màn hình bắt đầu rồi bấm Bắt đầu. Nhập một số cùng độ dài bằng bàn phím trên màn hình hoặc bàn phím máy, sau đó bấm Đoán. Lần đoán không được lặp chữ số, và số đã thử rồi sẽ không bị tính lại.',
      ],
      list: [
        'Đúng vị trí (strike) là chữ số đúng và nằm đúng chỗ.',
        'Sai vị trí (ball) là chữ số có trong số bí mật nhưng nằm ở chỗ khác.',
        'Trượt (out) nghĩa là không chữ số nào của bạn có trong số bí mật.',
        'Bạn thắng khi mọi chữ số đều đúng vị trí. Kết quả cho biết bạn đã dùng bao nhiêu lượt.',
        'Nếu bí, hãy bấm Bỏ cuộc hai lần để xem đáp án và bắt đầu ván mới. Ván bỏ cuộc không được tính vào kỷ lục.',
      ],
    },
    {
      h: 'Những cách nghĩ giúp ích',
      p: [
        'Người mới thường đoán bừa rồi hy vọng may mắn. Thói quen tốt hơn là coi mỗi câu trả lời như một sự thật nhỏ và ghi lại nó loại trừ điều gì. Ngay cả một cuốn sổ đơn giản, trên giấy hay trong đầu, cũng khiến trò chơi bớt giống chuyện may rủi hơn nhiều.',
      ],
      list: [
        'Cộng số lần đúng vị trí và sai vị trí. Tổng này cho biết có bao nhiêu chữ số của bạn nằm trong số bí mật, bất kể ở đâu.',
        'Kết quả “trượt” rất giá trị. Nó loại bỏ cùng lúc mọi chữ số bạn vừa dùng, bạn không cần nghĩ đến chúng nữa.',
        'Giữa các lần đoán chỉ nên đổi một hai chỗ. Nếu gợi ý thay đổi, bạn biết chữ số vừa đổi là nguyên nhân.',
        'Kiểm tra vị trí tách riêng khỏi chữ số. Khi đã biết một chữ số có trong số bí mật, hãy dịch chuyển nó để tìm chỗ của nó.',
        'Đảm bảo mỗi lần đoán vẫn có thể là đáp án. Nếu nó mâu thuẫn với điều bạn đã biết thì không thể thắng và phí mất một lượt.',
        'Đừng bám vào lần trúng may đầu tiên. Hãy kiểm tra xem nó có khớp với mọi gợi ý trước đó không rồi mới xây tiếp trên nó.',
      ],
    },
    {
      h: 'Nguồn gốc của trò chơi',
      p: [
        'Bulls and Cows là trò chơi giấy bút lâu đời, thường do hai người thay phiên làm người ra mã và người đoán. Nó được xem là tiền thân của Mastermind, trò chơi bàn cờ với các chốt màu phát hành vào đầu thập niên 1970. Cùng thập niên đó, một phiên bản máy tính tên là Moo chạy trên máy tính lớn của Đại học Cambridge, và từ đó trò chơi trở thành bài tập yêu thích của dân lập trình.',
        'Ý tưởng này lan đi với nhiều tên gọi địa phương. Ở Hàn Quốc là bóng chày số, và trang này dùng thuật ngữ đó; ở Nhật thường gọi là Hit and Blow, ở Trung Quốc là 1A2B, còn trong tiếng Nga hay tiếng Tây Ban Nha người ta dùng tên bò đực và bò cái. Máy tính đã chứng minh rằng nếu chơi hoàn hảo thì mọi số bí mật bốn chữ số đều tìm được trong tối đa bảy lượt, trung bình hơn năm lượt một chút, nên người chơi tiến gần mức đó là rất xuất sắc.',
      ],
    },
    {
      h: 'Chơi cùng bạn bè và theo dõi tiến bộ',
      p: [
        'Rất dễ biến trò chơi thành một cuộc thi thân thiện. Hãy thống nhất số chữ số, mỗi người chơi cùng một cấp độ vài lần rồi so xem ai cần ít lượt nhất. Vì chỉ có số bí mật là bị giấu, sau mỗi ván bạn cũng có thể cùng nhau bàn lại cách suy luận, đó là cách hay để học thêm mẹo mới.',
        'Kỷ lục từng cấp độ chỉ được lưu trong trình duyệt này. Khi bạn đoán đúng một ván, số lượt của bạn được so với kết quả thật của những người chơi khác ở cùng cấp độ, và nếu chưa có gì để so thì phần so sánh sẽ không hiện. Hãy thử phá kỷ lục của chính mình, rồi thử sức với cấp độ bốn chữ số.',
      ],
    },
  ],
  cta: 'Chơi Đoán số ngay',
};
