module.exports = {
  metaTitle: 'Hướng dẫn tạo mật khẩu mạnh: cụm mật khẩu và entropy',
  description: 'Cách tạo mật khẩu mạnh và cụm mật khẩu dễ nhớ, entropy và thời gian bẻ khóa thực sự có nghĩa là gì, và vì sao nên dùng trình quản lý mật khẩu cùng xác thực hai lớp.',
  h1: 'Tạo mật khẩu mạnh: mật khẩu chắc chắn, cụm mật khẩu và ý nghĩa của entropy',
  updated: '2026-10-13',
  intro: 'Phần lớn tài khoản bị chiếm không phải do một hacker thiên tài nào cả. Mọi chuyện bắt đầu từ một mật khẩu quá ngắn, một mật khẩu dùng lại sau khi trang khác bị lộ dữ liệu, hoặc một kiểu dễ đoán như tên kèm năm sinh. Công cụ tạo mật khẩu làm thay con người việc mà ta làm dở nhất: chọn thật ngẫu nhiên. Bài hướng dẫn này chỉ cách dùng công cụ, giải thích điều gì thực sự làm mật khẩu mạnh, giới thiệu cụm mật khẩu, giải nghĩa con số entropy và thời gian bẻ khóa, và kết thúc bằng hai thói quen còn quan trọng hơn cả mật khẩu.',
  sections: [
    {
      h: 'Cách dùng công cụ tạo mật khẩu',
      p: [
        'Mọi thứ diễn ra trên một màn hình và ngay trên thiết bị của bạn. Trước tiên chọn Mật khẩu hoặc Cụm mật khẩu ở trên cùng. Với mật khẩu, kéo thanh độ dài từ 4 đến 64 ký tự rồi bật các loại ký tự muốn dùng: chữ hoa, chữ thường, chữ số và ký hiệu. Mỗi loại đã bật chắc chắn xuất hiện ít nhất một lần, nên các trang có quy định như phải có chữ hoa, số và ký hiệu cũng không làm khó bạn. Nếu cần đọc mật khẩu cho người khác hoặc gõ lại từ màn hình, hãy bật Bỏ ký tự dễ nhầm để loại 0, O, 1, l và I.',
        'Với cụm mật khẩu, chọn số từ (3 đến 8), dấu nối giữa các từ, có viết hoa chữ đầu mỗi từ và thêm một con số hay không. Chọn Chỉ 1 cái hoặc 5 cái một lúc rồi bấm Tạo ngay. Mỗi kết quả có nút Sao chép riêng, và thanh độ mạnh bên dưới cho biết entropy tính bằng bit, mức độ mạnh và thời gian ước tính để bẻ khóa.',
      ],
      list: [
        'Chọn Mật khẩu hoặc Cụm mật khẩu.',
        'Đặt độ dài hoặc số từ.',
        'Chọn loại ký tự, hoặc dấu nối và các tùy chọn.',
        'Bấm Tạo ngay và sao chép cái bạn thích.',
        'Lưu ngay vào trình quản lý mật khẩu.',
      ],
    },
    {
      h: 'Điều gì làm nên một mật khẩu mạnh',
      p: [
        'Độ mạnh phụ thuộc vào số khả năng kẻ tấn công phải thử, chứ không phải vẻ ngoài phức tạp của mật khẩu. P@ssw0rd! trông rối mắt, nhưng công cụ bẻ khóa luôn thử các từ phổ biến với kiểu thay thế quen thuộc trước, nên nó thủng chỉ trong vài giây. Một chuỗi thật sự ngẫu nhiên thì khác: mỗi ký tự là một lựa chọn độc lập, và mỗi ký tự thêm vào nhân số khả năng lên nhiều lần. Vì vậy độ dài thắng sự khéo léo. Chỉ cần tăng từ 12 lên 16 ký tự ngẫu nhiên, mật khẩu đã khó đoán hơn hàng chục triệu lần.',
        'Nửa còn lại là tính ngẫu nhiên. Chúng ta hay chọn ngày sinh, tên thú cưng, dãy phím như qwerty và dùng cùng một kiểu yêu thích ở mọi nơi, và kẻ tấn công biết hết những thói quen đó. Công cụ này dùng nguồn ngẫu nhiên mật mã của trình duyệt, crypto.getRandomValues, cùng kỹ thuật lấy mẫu loại bỏ để mọi ký tự được phép đều có xác suất xuất hiện bằng nhau tuyệt đối. Không có quy luật nào để học, không có độ lệch nào để khai thác.',
        'Thành phần thứ ba là không dùng lại. Mật khẩu hoàn hảo đến đâu cũng trở nên yếu ngay khi dùng cho nhiều nơi, vì chỉ cần một trang bị lộ, kẻ tấn công sẽ đem nó đi thử ở mọi trang khác. Mỗi tài khoản một mật khẩu.',
      ],
    },
    {
      h: 'Cụm mật khẩu: mạnh mà dễ nhớ hơn',
      p: [
        'Cụm mật khẩu là vài từ ngẫu nhiên ghép lại, giống một câu ngắn vô nghĩa. Bí quyết là các từ phải do may rủi chọn, không phải do bạn chọn. Một câu hát hay một câu danh ngôn hoàn toàn không ngẫu nhiên. Công cụ này lấy từng từ trong danh sách 2.048 từ tiếng Anh ngắn có sẵn, nên mỗi từ thêm đúng 11 bit entropy. Năm từ cho 55 bit, sáu từ cho 66 bit, và thêm một con số ngẫu nhiên sẽ cộng thêm vài bit.',
        'Cụm mật khẩu phát huy tác dụng với vài bí mật mà bạn buộc phải tự gõ hoặc tự nhớ: mật khẩu chính của trình quản lý mật khẩu, mật khẩu đăng nhập máy tính hay mật khẩu sao lưu điện thoại. Chúng dài nên mạnh, lại là từ thật nên gõ trên bàn phím điện thoại dễ hơn nhiều so với một mớ ký hiệu. Viết hoa chữ đầu mỗi từ không làm mạnh hơn vì kiểu này dễ đoán, nhưng hữu ích với những trang bắt buộc phải có chữ hoa.',
      ],
    },
    {
      h: 'Hiểu đúng về entropy và thời gian bẻ khóa',
      p: [
        'Entropy được đo bằng bit, cho biết mật khẩu được chọn từ bao nhiêu khả năng có xác suất như nhau. Mỗi bit nhân đôi con số đó, nên 60 bit là khoảng một tỷ tỷ khả năng, còn 80 bit nhiều hơn thế khoảng một triệu lần. Thanh độ mạnh tính chính xác giá trị này từ thiết lập của bạn. Với mật khẩu, nó đếm mọi chuỗi có độ dài đã chọn chứa ít nhất một ký tự của mỗi loại đã chọn; với cụm mật khẩu, nó nhân số cách chọn từ với vị trí và giá trị của con số thêm vào.',
        'Thời gian bẻ khóa giả định một cuộc tấn công ngoại tuyến rất nhanh, thử 10 tỷ lần mỗi giây, tốc độ mà chỉ một card đồ họa đời mới cũng đạt được khi tấn công một cơ sở dữ liệu mật khẩu bị lộ và được bảo vệ kém. Trung bình, kẻ tấn công tìm ra mật khẩu sau khi thử một nửa số khả năng. Ước tính này còn giả định kẻ tấn công biết chính xác bạn đã chọn thiết lập nào, nên nó không bao giờ tô hồng. Đại khái: dưới 45 bit là yếu, 45 đến 60 là tạm được, 60 đến 80 là mạnh, từ 80 trở lên là rất mạnh.',
      ],
      list: [
        'Tài khoản dùng một lần hoặc không quan trọng: 45 đến 60 bit.',
        'Tài khoản hằng ngày như mua sắm, mạng xã hội: 60 đến 80 bit.',
        'Email, ngân hàng, công việc và trình quản lý mật khẩu: từ 80 bit trở lên.',
      ],
    },
    {
      h: 'Trình quản lý mật khẩu và xác thực hai lớp',
      p: [
        'Không ai nhớ nổi hàng chục mật khẩu ngẫu nhiên khác nhau, và cũng không nên cố. Trình quản lý mật khẩu cất chúng trong một két được mã hóa, tự điền đúng trang và cảnh báo khi có mật khẩu bị dùng lại hoặc bị lộ. Hãy tạo mật khẩu mạnh ở đây, dán vào trình quản lý khi tạo hoặc đổi tài khoản, và bạn sẽ không cần nhìn thấy nó nữa. Còn bản thân trình quản lý thì bảo vệ bằng một cụm mật khẩu dài mà bạn tự nhớ.',
        'Xác thực hai lớp (2FA) thêm một bước thứ hai như mã từ ứng dụng xác thực, passkey hoặc khóa bảo mật phần cứng. Dù mật khẩu có bị lộ, kẻ tấn công vẫn không đăng nhập được. Hãy bật cho email trước, vì hầu hết tài khoản khác đều đặt lại mật khẩu qua email.',
      ],
      list: [
        'Dùng mật khẩu khác nhau cho mỗi tài khoản.',
        'Lưu mật khẩu trong trình quản lý, không phải trong ghi chú, tin nhắn hay ảnh chụp màn hình.',
        'Bật 2FA hoặc passkey ở mọi nơi có hỗ trợ, bắt đầu từ email.',
        'Đổi mật khẩu ngay khi dịch vụ thông báo bị lộ dữ liệu.',
        'Không gửi mật khẩu qua tin nhắn hay email, và cảnh giác với đường link đăng nhập bất ngờ.',
      ],
    },
  ],
  cta: 'Tạo mật khẩu mạnh ngay',
};
