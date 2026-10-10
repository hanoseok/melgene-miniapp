module.exports = {
  metaTitle: 'Hướng dẫn tạo mã QR: tạo, in và quét an toàn',
  description: 'Mã QR lưu thông tin thế nào, cách tạo mã QR cho link hoặc Wi-Fi, mẹo in về kích thước, độ tương phản và mức sửa lỗi, lịch sử mã QR và cách quét an toàn.',
  h1: 'Cách tạo mã QR quét là ăn ngay',
  updated: '2026-10-11',
  intro: 'Mã QR có mặt khắp nơi: trên bàn quán ăn, vé ca nhạc, kiện hàng và áp phích. Nhìn qua thì giống một mớ chấm lộn xộn, nhưng mỗi ô vuông đều có nhiệm vụ riêng. Bài hướng dẫn này giải thích mã QR thật ra lưu gì, cách tạo mã cho link, lời nhắn hay mạng Wi-Fi, cách in để quét được ngay lần đầu, ý tưởng này đến từ đâu và cần cẩn thận gì khi quét mã do người khác tạo.',
  sections: [
    {
      h: 'Mã QR là gì?',
      p: [
        'QR là viết tắt của Quick Response, nghĩa là phản hồi nhanh. Mã QR là mã vạch hai chiều: thay vì một hàng vạch, nó lưu thông tin trong một lưới vuông gồm các ô sáng và tối gọi là module. Ba hình vuông lớn ở các góc là mẫu định vị, cho camera biết mã nằm ở đâu, xoay bao nhiêu và to cỡ nào, vì vậy bạn có thể quét ngược hay quét nghiêng đều được.',
        'Phần còn lại của lưới chứa dữ liệu của bạn cùng dữ liệu sửa lỗi tính bằng mã Reed–Solomon, cùng loại toán học dùng cho đĩa CD và tàu thăm dò vũ trụ. Nhờ phần dư này, máy đọc có thể khôi phục nội dung ngay cả khi một phần mã bị bẩn, rách hay bị che. Phiên bản nhỏ nhất là phiên bản 1 với 21×21 ô, lớn nhất là phiên bản 40 với 177×177 ô, chứa được gần ba nghìn byte. Nội dung càng dài thì lưới càng to và dày.'
      ]
    },
    {
      h: 'Cách tạo mã QR tại đây',
      p: [
        'Công cụ chạy hoàn toàn trong trình duyệt. Mã được tính ngay trên thiết bị của bạn lúc bạn gõ, nên không có gì bị tải lên, ghi lại hay lưu trữ, và cũng không cần tạo tài khoản.'
      ],
      list: [
        'Chọn nội dung cho mã: link, văn bản, Wi-Fi, email hoặc số điện thoại.',
        'Điền thông tin. Nếu bạn gõ địa chỉ web không có https://, công cụ sẽ tự thêm để điện thoại mở được như một link.',
        'Xem bản xem trước trực tiếp. Mở phần tùy chọn để đổi màu, mức sửa lỗi, kích thước ảnh hoặc lề trống.',
        'Tải PNG cho màn hình và tài liệu, hoặc SVG để in. Trên trình duyệt hỗ trợ, bạn còn có thể sao chép ảnh thẳng vào bộ nhớ tạm.',
        'Quét thử bằng điện thoại của mình trước khi chia sẻ hoặc in.'
      ]
    },
    {
      h: 'Mã QR Wi-Fi cho khách',
      p: [
        'Mã QR Wi-Fi giúp khách khỏi phải gõ mật khẩu dài. Mã lưu tên mạng, mật khẩu và kiểu bảo mật theo một định dạng văn bản chuẩn bắt đầu bằng WIFI:. Ứng dụng camera có sẵn trên iPhone và Android nhận ra định dạng này và đề nghị kết nối chỉ bằng một lần chạm.',
        'Hãy chọn đúng kiểu bảo mật mà router đang dùng. Hầu hết router hiện nay dùng WPA2 hoặc WPA3, cả hai đều thuộc nhóm WPA. Chỉ chọn Không mật khẩu cho mạng mở, và tích Mạng ẩn nếu router không phát tên mạng. Các ký tự đặc biệt như chấm phẩy, dấu phẩy, hai chấm và ngoặc kép được xử lý tự động, nên mật khẩu lạ vẫn dùng tốt. Nếu sau này đổi mật khẩu Wi-Fi, hãy tạo mã mới vì mã cũ sẽ không còn dùng được.'
      ]
    },
    {
      h: 'Mẹo in: kích thước, độ tương phản và mức sửa lỗi',
      p: [
        'Phần lớn lỗi quét đến từ khâu in chứ không phải từ bản thân mã. Vài quy tắc đơn giản tạo khác biệt rất lớn.'
      ],
      list: [
        'Kích thước: theo kinh nghiệm, cạnh mã nên dài ít nhất một phần mười khoảng cách quét. Mã quét từ 30 cm cần rộng khoảng 3 cm, còn áp phích nhìn từ 3 m cần khoảng 30 cm.',
        'Độ tương phản: dùng mã màu đậm trên nền sáng. Đen trên trắng là chắc ăn nhất. Màu nhạt, màu chuyển sắc và mã sáng trên nền tối làm nhiều ứng dụng quét bối rối, nên công cụ sẽ cảnh báo khi độ tương phản thấp.',
        'Lề trống: chừa một viền trống quanh mã. Tiêu chuẩn yêu cầu bốn ô, và chữ hay hình dán sát mép là nguyên nhân thường gặp khiến quét thất bại.',
        'Mức sửa lỗi: L khôi phục khoảng 7% hư hại, M khoảng 15%, Q khoảng 25% và H khoảng 30%. Dùng M hằng ngày, Q hoặc H cho nhãn dán, biển ngoài trời hoặc mã có logo nhỏ đặt lên, và L khi cần nhét văn bản dài vào mã nhỏ trên màn hình.',
        'Độ dài nội dung: cùng kích thước in, nội dung ngắn hơn cho ô to hơn. Hãy ưu tiên link ngắn thay vì địa chỉ quá dài.'
      ]
    },
    {
      h: 'Lược sử mã QR',
      p: [
        'Mã QR được phát minh năm 1994 bởi Masahiro Hara và nhóm của ông tại Denso Wave, khi đó là một bộ phận của Denso, hãng linh kiện ô tô Nhật Bản thuộc tập đoàn Toyota. Các nhà máy ô tô theo dõi linh kiện bằng mã vạch thông thường, và công nhân phải quét nhiều nhãn cho mỗi thùng vì mỗi mã vạch chỉ chứa khoảng hai mươi ký tự. Hara muốn một loại mã chứa được nhiều dữ liệu hơn hẳn và đọc thật nhanh từ mọi hướng.',
        'Các ô vuông định vị được thiết kế với tỉ lệ đen trắng hiếm khi xuất hiện trong chữ in hay hình ảnh, nên máy quét tìm ra chúng ngay lập tức. Denso Wave nắm bằng sáng chế nhưng chọn không thực thi, và định dạng này trở thành tiêu chuẩn quốc tế ISO năm 2000. Khi camera điện thoại thông minh tự đọc được mã QR, nó nhanh chóng lan sang thanh toán, thẻ lên máy bay, thực đơn và nhiều thứ khác. Cái tên QR Code đến nay vẫn là nhãn hiệu đã đăng ký của Denso Wave.'
      ]
    },
    {
      h: 'Quét mã an toàn',
      p: [
        'Mã QR chỉ là cái hộp đựng, và ai cũng có thể in ra. Kẻ gian đôi khi dán mã giả đè lên mã thật ở máy thu phí đỗ xe, áp phích hay bàn quán ăn để dẫn người dùng tới trang thanh toán hoặc đăng nhập giả. Trước khi mở link, hãy đọc địa chỉ camera hiển thị và kiểm tra xem đó có đúng là của cửa hàng bạn nghĩ không. Cẩn thận với mã đòi thông tin thẻ, mật khẩu hay cài ứng dụng, và đừng bao giờ quét mã trong tin nhắn lạ hối thúc bạn làm ngay.',
        'Khi tự tạo mã, hãy áp dụng ngược lại: dùng link do bạn quản lý, thử mã trước khi in và nếu dán ở nơi công cộng, thỉnh thoảng kiểm tra xem có ai dán đè nhãn khác lên không.'
      ]
    }
  ],
  cta: 'Tạo mã QR ngay'
};
