module.exports = {
  metaTitle: "Tạo số xổ số: hướng dẫn về quay số ngẫu nhiên và tổ hợp",
  description: "Cách dùng công cụ tạo số xổ số, số có thật sự ngẫu nhiên không, toán học đằng sau các tổ hợp xổ số và cách dùng có trách nhiệm để giải trí.",
  h1: "Tạo số xổ số: số ngẫu nhiên thực sự được tạo ra như thế nào",
  updated: "2026-10-09",
  intro: "Công cụ tạo số xổ số quay số cho lotto 6/45 của Hàn Quốc, trò chơi kiểu Euro, Powerball của Mỹ hoặc khoảng số bạn tự đặt, rồi cho các quả bóng lăn ra khỏi máy quay số trên màn hình. Công cụ chỉ dành để giải trí. Bài viết này giải thích cách dùng, vì sao các số là ngẫu nhiên theo nghĩa chặt chẽ, toán học của các tổ hợp xổ số trông ra sao, những cách dùng sáng tạo ngoài xổ số và cách chơi có trách nhiệm.",
  sections: [
    {
      h: "Công cụ hoạt động thế nào",
      p: [
        "Trước hết hãy chọn một trò chơi. Lotto 6/45 của Hàn Quốc quay sáu số từ 1 đến 45. Trò chơi kiểu Euro quay năm số từ 1 đến 50 cộng hai ngôi sao từ 1 đến 12. Powerball của Mỹ quay năm số từ 1 đến 69 cộng một quả Powerball từ 1 đến 26. Trò chơi tự đặt cho phép bạn chọn số lớn nhất, tối đa 100, và số lượng số cần quay, tối đa mười. Sau đó chọn số bộ cần tạo, từ một đến năm.",
        "Trước khi quay, bạn có thể thêm các số muốn giữ và các số muốn loại. Số giữ lại xuất hiện trong mọi bộ và các số còn lại được quay xung quanh chúng; số bị loại không bao giờ xuất hiện. Hai thiết lập này chỉ áp dụng cho các số chính, không áp dụng cho ngôi sao hay Powerball. Khi bấm nút quay, các số được chọn trước, sau đó bóng xoay tít trong máy rồi lăn ra từng quả một, và cuối cùng mỗi bộ được hiển thị theo thứ tự từ nhỏ đến lớn. Màu bóng theo các khoảng quen thuộc của lotto Hàn Quốc, và nút sao chép đưa kết quả vào bộ nhớ tạm."
      ],
      list: [
        "Chọn lotto 6/45 Hàn Quốc, kiểu Euro, Powerball Mỹ hoặc khoảng số tự đặt.",
        "Chọn số bộ cần quay, từ 1 đến 5.",
        "Nếu muốn, nhập các số giữ lại và các số loại, ngăn cách bằng dấu phẩy.",
        "Bấm nút quay và xem bóng lăn ra.",
        "Sao chép các số, quay lại hoặc trở về phần thiết lập."
      ]
    },
    {
      h: "Các số có thật sự ngẫu nhiên không",
      p: [
        "Công cụ dùng nguồn ngẫu nhiên mật mã của trình duyệt, cùng loại ngẫu nhiên dùng để tạo khóa bảo mật. Chọn một số nguyên trong một khoảng nghe có vẻ dễ, nhưng cách làm cẩu thả có thể thiên vị một số số. Ví dụ, nếu lấy một giá trị ngẫu nhiên lớn rồi dùng số dư khi chia cho 45, các số dư nhỏ hơn sẽ xuất hiện nhiều hơn một chút. Để tránh điều đó, công cụ bỏ đi vài giá trị ngẫu nhiên gây ra sự mất cân bằng ấy rồi chọn lại, một kỹ thuật gọi là lấy mẫu loại bỏ (rejection sampling).",
        "Sau đó các số được chọn không lặp lại bằng cách xáo trộn một phần, nên ở mỗi bước mọi số còn lại đều có cơ hội như nhau. Hoạt ảnh bóng lăn chỉ chạy sau khi kết quả đã được quyết định và không ảnh hưởng gì đến nó. Vì vậy mọi số hợp lệ đều có khả năng như nhau, và không thể điều khiển công cụ bằng thời điểm hay cách bấm nút."
      ]
    },
    {
      h: "Toán học của các tổ hợp xổ số",
      p: [
        "Xổ số là một bài toán đếm. Ở trò chơi 6/45 có 8.145.060 bộ sáu số khác nhau. Ở trò chơi 5/50 cộng 2/12 có 2.118.760 cách chọn năm số chính và 66 cách chọn hai ngôi sao, tổng cộng 139.838.160 tổ hợp. Ở trò chơi 5/69 cộng 1/26 có 11.238.513 cách chọn năm số và 26 lựa chọn cho Powerball, tổng cộng 292.201.338 tổ hợp. Có càng nhiều tổ hợp, một tấm vé càng chiếm phần nhỏ hơn.",
        "Mọi tổ hợp đều có khả năng ngang nhau, kể cả 1, 2, 3, 4, 5, 6. Kết quả quá khứ không làm thay đổi các lần quay sau, nên không có số nóng hay số lạnh, và việc giữ hay loại số cũng không thay đổi gì về cơ hội. Điểm khác biệt thật sự là có bao nhiêu người chơi khác chọn cùng số. Nhiều người chọn ngày sinh, nên các tổ hợp chỉ gồm số nhỏ có lẽ dễ phải chia giải hơn nếu trúng, nhưng đó là chuyện chia giải thưởng chứ không phải chuyện trúng thưởng."
      ]
    },
    {
      h: "Những cách dùng công cụ",
      p: [
        "Một công cụ chọn số ngẫu nhiên công bằng và nhanh có ích hơn nhiều so với chỉ dành cho xổ số. Chế độ tự đặt biến nó thành một hộp đồ nghề nhỏ cho mọi việc cần số không thiên lệch."
      ],
      list: [
        "Chọn số may mắn cho vui, giữ một số ngày sinh hoặc ngày kỷ niệm trong mọi bộ.",
        "Bốc người trúng thưởng cho rút thăm hoặc tặng quà bằng cách đánh số người tham gia rồi quay một số.",
        "Tạo bộ số kiểu bingo hoặc quay một số từ 1 đến 100 cho trò chơi trong tiệc.",
        "Quyết định ai đi trước bằng cách quay số ghế hoặc số đội.",
        "Dạy xác suất ở lớp học bằng cách so sánh nhiều lần quay."
      ]
    },
    {
      h: "Chơi có trách nhiệm và quyền riêng tư",
      p: [
        "Công cụ này không phải đơn vị tổ chức xổ số, không thể bán vé và không thể dự đoán hay cải thiện cơ hội trúng thưởng của bạn. Nếu mua vé, hãy xem chi phí đó là khoản chi cho giải trí: đặt ngân sách từ trước, chỉ mua từ đơn vị được cấp phép, tuân thủ quy định độ tuổi tối thiểu nơi bạn sống và dừng lại khi không còn vui. Nếu cờ bạc đang gây rắc rối cho bạn, hãy liên hệ dịch vụ hỗ trợ tại địa phương.",
        "Các số bạn nhập và các số được quay được xử lý trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi. Không có gì về các bộ số của bạn được lưu lại. Trang có thể ghi nhớ các tùy chọn cơ bản như ngôn ngữ. Hãy dùng nút sao chép nếu bạn muốn giữ kết quả."
      ]
    }
  ],
  cta: "Quay số của tôi"
};
