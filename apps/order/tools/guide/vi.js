module.exports = {
  metaTitle: 'Bốc thăm thứ tự: hướng dẫn xếp lượt công bằng',
  description: 'Cách bốc thăm thứ tự thuyết trình, lượt chơi hay lịch trực nhật, vì sao cách xáo là công bằng và mẹo công bố thứ tự trước cả nhóm.',
  h1: 'Bốc thăm thứ tự: thứ tự công bằng từ đầu đến cuối',
  updated: '2026-11-15',
  intro: 'Quyết định ai đi trước nghe có vẻ nhỏ nhặt, cho đến khi cả lớp, cả nhóm hay cả nhà đang chờ câu trả lời. Lúc nào cũng có người cho rằng thứ tự đã được sắp đặt, hoặc để ý thấy toàn là mấy người quen thuộc đi đầu. Bốc thăm thứ tự giải quyết chuyện đó chỉ trong một bước: bạn nhập tên, xáo một lần, và toàn bộ thứ tự từ người đầu đến người cuối được chốt ngay tại chỗ. Bài hướng dẫn này giải thích công cụ hoạt động thế nào, vì sao kết quả công bằng, khi nào nên dùng thứ tự ngẫu nhiên và cách công bố để ai cũng thấy thuyết phục.',
  sections: [
    {
      h: 'Cách sử dụng',
      p: [
        'Màn hình đầu tiên là toàn bộ phần chuẩn bị. Trước hết chọn thứ tự này dùng để làm gì: thuyết trình, lượt chơi hay trực nhật. Nhãn này chỉ đổi tiêu đề ở phần kết quả, nên nếu chỉ cần một danh sách thì bạn có thể bỏ qua. Sau đó nhập hoặc dán tên, mỗi dòng một người. Danh sách sao chép từ Zalo hay Excel đều được, dấu phẩy cũng tách tên. Nếu không muốn dùng tên, hãy chuyển sang số và chọn từ 2 đến 40, rất tiện khi xếp theo số báo danh hay số ghế.',
        'Chọn lật thứ tự từ người số 1 hay từ người cuối, rồi bấm bốc thăm. Mỗi vị trí hiện ra dưới dạng một thẻ đánh số: chạm vào thẻ hoặc nút Tiếp để xem thẻ sau, bật tự động lật để thẻ tự hiện, hoặc bấm Xem hết để đến ngay danh sách đầy đủ. Màn hình cuối liệt kê mọi người theo thứ tự với số lớn, kèm nút sao chép danh sách dạng chữ và sao chép liên kết.',
      ],
      list: [
        'Chọn nhãn: thứ tự thường, thuyết trình, lượt chơi hoặc trực nhật.',
        'Nhập từ 2 đến 40 tên, mỗi dòng một tên, hoặc chuyển sang số 1 đến N.',
        'Chọn lật từ người số 1 hay từ người cuối.',
        'Bấm bốc thăm một lần: toàn bộ thứ tự được chốt ngay lúc đó.',
        'Lật từng thẻ, tự động, hoặc xem hết một lần.',
      ],
    },
    {
      h: 'Vì sao cách xáo là công bằng',
      p: [
        'Một thứ tự công bằng cần hai điều: mọi cách sắp xếp có thể xảy ra đều có xác suất như nhau, và kết quả được quyết định trước khi ai nhìn thấy. Khi bạn bấm bốc thăm, ứng dụng lấy giá trị từ bộ sinh số ngẫu nhiên mật mã của trình duyệt, cùng loại nguồn dùng để tạo khóa bảo mật. Sau đó ứng dụng dùng phương pháp lấy mẫu loại bỏ, bỏ đi những giá trị hiếm hoi khiến vài vị trí dễ ra hơn một chút, rồi xáo theo thuật toán Fisher–Yates, một phương pháp nổi tiếng cho mọi thứ tự có cơ hội đúng bằng nhau.',
        'Toàn bộ thứ tự đã tồn tại kể từ lúc đó. Lật từng thẻ không bốc thêm gì mới, chỉ cho thấy kết quả đã được chốt. Không có gì được gửi lên máy chủ, nên không ai, kể cả chúng tôi, có thể xem hay sửa danh sách. Nếu có người nghi ngờ, hãy mở liên kết chia sẻ trên một điện thoại khác: thứ tự hiện ra y hệt, vì liên kết lưu thứ tự đã xong chứ không xáo lại.',
      ],
    },
    {
      h: 'Khi nào nên dùng thứ tự ngẫu nhiên',
      p: [
        'Bất cứ khi nào cả nhóm phải làm lần lượt, bốc thăm thứ tự sẽ chấm dứt cuộc tranh cãi ai đi trước. Giáo viên dùng để xếp thứ tự thuyết trình hay đọc bài. Các nhóm làm việc dùng để xếp lượt phát biểu trong cuộc họp hoặc buổi workshop. Gia đình và bạn cùng phòng dùng để lập lịch trực nhật, còn bạn bè dùng để chọn lượt chơi board game, hát karaoke hay giải đấu game.',
        'Điều này khác với bốc thăm trúng thưởng. Bốc thăm trúng thưởng dừng ở một cái tên, còn công cụ chia đội thì chia mọi người thành nhóm. Ở đây ai cũng có một vị trí từ đầu đến cuối, đúng thứ bạn cần khi ai cũng sẽ đến lượt và chỉ còn phải quyết định trình tự.',
      ],
      list: [
        'Trường học: thứ tự thuyết trình, đọc bài, lượt làm thí nghiệm.',
        'Công việc: lượt phát biểu trong họp, thứ tự demo, lịch trực.',
        'Ở nhà: ai rửa bát ngày nào, ai chọn phim.',
        'Trò chơi: lượt chơi board game, vòng câu đố, karaoke.',
      ],
    },
    {
      h: 'Mẹo khi bốc thăm cùng cả nhóm',
      p: [
        'Hãy bốc thăm ở nơi mọi người đều thấy màn hình, hoặc chia sẻ màn hình khi gọi video. Khi tận mắt thấy nút chỉ được bấm một lần, mọi người tin kết quả hơn là nhận một danh sách đã làm sẵn. Nếu cần xáo lại, chẳng hạn vì gõ sai tên, hãy nói trước khi biết thứ tự chứ đừng nói sau.',
        'Với danh sách dài, tự động lật giữ nhịp đều mà không ai phải chạm, còn Xem hết là cách nhanh nhất nếu chỉ cần danh sách. Sao chép dạng chữ sẽ dán danh sách có đánh số thẳng vào nhóm chat hay tài liệu. Danh sách gần nhất được ghi nhớ trên thiết bị, nên lịch trực nhật hằng tuần lần sau chỉ cần một chạm để xáo lại.',
      ],
    },
    {
      h: 'Lật từ đầu hay từ cuối, và chia sẻ kết quả',
      p: [
        'Lật từ người số 1 rất thực tế: người đi đầu biết ngay và có thể chuẩn bị. Lật từ người cuối biến thứ tự thành một màn đếm ngược nho nhỏ, vì thẻ cuối cùng mới cho biết ai đi trước. Lớp học và bữa tiệc thường thích sự hồi hộp này, còn cuộc họp thường chọn cách nhanh.',
        'Nút sao chép liên kết tạo ra một địa chỉ chứa sẵn thứ tự đã xong. Ai mở sẽ thấy cùng danh sách kèm ghi chú rằng nó không được xáo lại, và có thể tự bốc thăm với cùng các tên nếu muốn thứ tự mới. Liên kết mang theo các tên bạn đã nhập, vì vậy chỉ gửi cho những người cần xem.',
      ],
    },
  ],
  cta: 'Bốc thăm thứ tự ngay',
};
