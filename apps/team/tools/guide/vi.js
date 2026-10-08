module.exports = {
  metaTitle: 'Chia đội ngẫu nhiên: hướng dẫn chia nhóm công bằng',
  description: 'Cách chia danh sách tên thành các đội ngẫu nhiên công bằng, đặt đội trưởng, giữ số người mỗi đội đều nhau và chia sẻ kết quả với cả nhóm.',
  h1: 'Chia đội ngẫu nhiên: cách chia một nhóm thành các đội công bằng',
  updated: '2026-10-09',
  intro: 'Chia đội bằng tay mất thời gian, và thường có người cảm thấy bị bỏ rơi hoặc không hài lòng với kết quả. Công cụ chia đội ngẫu nhiên biến việc này thành một lần bốc thăm nhanh, trung lập mà ai cũng chấp nhận được. Bài viết này giải thích cách công cụ hoạt động và cách có những đội tốt nhất cho lớp học, thể thao, hội thảo và đêm chơi game.',
  sections: [
    {
      h: 'Công cụ làm gì',
      p: [
        'Bạn dán hoặc gõ danh sách tên, mỗi dòng một tên hoặc ngăn cách bằng dấu phẩy, và công cụ sẽ chia họ thành các đội. Bạn có thể yêu cầu một số đội nhất định, hoặc một số người mỗi đội, phần còn lại công cụ tự tính. Công cụ xử lý tối đa sáu mươi tên, mỗi tên dài tối đa hai mươi ký tự.',
        'Khi bấm trộn, các tên bay vào các hộp đội bằng một hiệu ứng ngắn, và kết quả hiện ra dưới dạng thẻ đội nhiều màu. Mỗi đội nhận một cái tên động vật vui nhộn, như hổ, đại bàng hay chim cánh cụt, để các nhóm có bản sắc ngay từ phút đầu. Nếu không thích tên đội, bạn có thể bốc tên mới mà không đổi ai ở đội nào.'
      ],
    },
    {
      h: 'Cách dùng từng bước',
      p: [
        'Thiết lập một lần bốc thăm mất chưa tới một phút, kể cả với nhóm đông.'
      ],
      list: [
        'Dán danh sách tên, hoặc chạm vào tên mẫu để dùng thử công cụ trước.',
        'Chọn chia theo số đội hay theo số người mỗi đội.',
        'Đánh dấu đội trưởng bằng dấu sao trước tên nếu muốn tách họ ra.',
        'Bấm trộn, rồi sao chép kết quả thành văn bản hoặc chia sẻ liên kết cho cả nhóm.'
      ],
    },
    {
      h: 'Mẹo để có những đội tốt hơn',
      p: [
        'Hãy làm sạch danh sách trước khi trộn. Viết mọi tên theo cùng một cách, xóa tên trùng và thêm chữ cái đầu của họ khi hai người trùng tên. Nếu ai đó vắng mặt, hãy xóa tên trước, vì số người mỗi đội được tính từ danh sách bạn đưa vào.',
        'Bốc thăm hoàn toàn ngẫu nhiên là quy trình công bằng, nhưng không phải lúc nào cũng cân bằng. Nếu trình độ chênh lệch nhiều, hãy dùng cách hai bước. Bốc một lần chỉ với những người giỏi nhất hoặc các đội trưởng để mỗi đội có một người, rồi thêm tất cả những người còn lại. Tùy chọn đội trưởng làm đúng việc đó: đội trưởng được chia trước, mỗi đội một người, sau đó mọi người khác được trộn vào. Nếu số đội trưởng nhiều hơn số đội, một số đội sẽ có hai người.',
        'Bạn cũng có thể chạy nhiều lần. Bấm trộn lại nếu kết quả có vẻ lệch, chẳng hạn khi tất cả bạn bè cùng văn phòng rơi vào một đội. Vì mỗi lần trộn độc lập nhau, bốc lại cũng công bằng như lần đầu. Hãy thống nhất trước khi bắt đầu xem kết quả đầu tiên có là chung cuộc không, nếu không có người sẽ cứ đòi bốc thêm vòng nữa cho đến khi được đội mình thích.'
      ],
    },
    {
      h: 'Vì sao việc bốc thăm công bằng',
      p: [
        'Các tên được trộn bằng bộ tạo số ngẫu nhiên mật mã của trình duyệt và một phương pháp gọi là Fisher–Yates. Nói đơn giản, mọi cách sắp xếp có thể của các tên đều có khả năng như nhau. Công cụ không thể bị điều khiển, và những người dùng nó cũng vậy, đó chính là mục đích của một lần bốc thăm trung lập.',
        'Số người các đội cũng được giữ đều nhau. Chúng không bao giờ lệch quá một người, nên với mười tên chia ba đội, bạn có các đội bốn, ba và ba. Thứ tự các đội cũng được trộn, nghĩa là đội nào có thêm một người là ngẫu nhiên, chứ không phải luôn là đội đầu tiên.'
      ],
    },
    {
      h: 'Vì sao chia đội ngẫu nhiên hiệu quả',
      p: [
        'Ai từng đứng xếp hàng chờ được chọn đều biết chia phe khó chịu đến mức nào. Bốc thăm ngẫu nhiên loại bỏ áp lực xã hội, vì không ai bị đánh giá và không ai phải chọn. Nó cũng xáo trộn các nhóm bạn thân, giúp mọi người gặp đồng đội mới và khiến kết quả có vẻ chính đáng ngay cả với những người không được lựa chọn đầu tiên. Giáo viên và huấn luyện viên thường dùng đội ngẫu nhiên vì chính lý do này.',
        'Phương pháp trộn này có một lịch sử thú vị. Ronald Fisher và Frank Yates mô tả phiên bản dùng giấy bút vào năm 1938, và Richard Durstenfeld công bố dạng nhanh hơn mà máy tính sử dụng vào năm 1964. Nó vẫn là cách tiêu chuẩn để trộn một danh sách công bằng, từ trò chơi bài đến phần mềm.'
      ],
    },
    {
      h: 'Chia sẻ kết quả và quyền riêng tư',
      p: [
        'Bạn có thể sao chép các đội thành văn bản thuần để dán vào tin nhắn, hoặc chia sẻ liên kết mở ra cùng một kết quả cho mọi người. Bản thân liên kết chứa các tên và các đội chính xác, nên không có gì được lưu trên máy chủ, và người mở liên kết sau đó có thể tự tạo đội của mình. Các tên bạn nhập gần nhất chỉ lưu trong trình duyệt của bạn để khỏi phải gõ lại. Nếu dùng máy tính chung, hãy xóa danh sách khi xong việc.'
      ],
    },
  ],
  cta: 'Chia đội ngẫu nhiên ngay',
};
