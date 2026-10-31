module.exports = {
  metaTitle: 'Chọn ngẫu nhiên bằng ngón tay: cách dùng và độ công bằng',
  description: 'Chọn ngẫu nhiên bằng ngón tay: mọi người đặt một ngón lên màn hình điện thoại, ứng dụng sẽ chọn một người. Hợp để quyết định ai trả tiền, ai đi trước, ai rửa bát và chia đội công bằng.',
  h1: 'Chọn ngẫu nhiên bằng ngón tay: ai bao cà phê, ai đi trước, ai rửa bát',
  updated: '2026-11-01',
  intro: 'Chọn ngẫu nhiên bằng ngón tay là cách nhanh nhất để dàn xếp những tranh cãi nhỏ. Đặt điện thoại giữa bàn, mỗi người đặt một ngón tay lên màn hình, chờ một lát và ứng dụng sẽ làm sáng một trong các ngón đó. Không cần gõ tên, không cần xé giấy bốc thăm, không ai phải cầm nón để rút. Bài hướng dẫn này giải thích cách dùng, ba chế độ, vì sao kết quả thật sự công bằng, cùng vài ý tưởng cho buổi tụ tập bạn bè, lớp học và bữa cơm gia đình.',
  sections: [
    {
      h: 'Cách sử dụng',
      p: [
        'Ở màn hình bắt đầu, hãy chọn điều bạn muốn ứng dụng quyết định. Chế độ một người thắng chọn đúng một ngón tay. Chế độ nhiều người chọn cùng lúc hai người thắng trở lên, tiện khi cần vài người tình nguyện. Chế độ chia đội chia mọi người thành hai, ba hoặc bốn đội màu có số người gần bằng nhau. Sau đó hãy mở bảng ngón tay.',
        'Bây giờ mọi người cùng đặt một ngón tay lên màn hình. Mỗi ngón có một vòng tròn phát sáng với màu riêng. Khi đủ người, các vòng tròn bắt đầu nhấp nháy và vòng tiến trình dần đầy lên. Hãy giữ yên: nếu ai đó thêm hoặc nhấc một ngón tay, đồng hồ đếm ngược sẽ bắt đầu lại. Khi vòng đầy, kết quả được chốt. Các vòng khác mờ đi, vòng được chọn phóng to ra và điện thoại rung nhẹ nếu có hỗ trợ rung.',
      ],
      list: [
        'Chọn một người thắng, nhiều người thắng hoặc chia đội.',
        'Mở bảng ngón tay và đặt điện thoại lên mặt phẳng.',
        'Mỗi người đặt một ngón tay lên màn hình.',
        'Giữ yên cho đến khi vòng tiến trình đầy.',
        'Vòng tròn phát sáng, hoặc các vòng theo màu đội, là kết quả.',
      ],
    },
    {
      h: 'Dùng máy tính hoặc màn hình chỉ chạm được một điểm',
      p: [
        'Không phải màn hình nào cũng cảm nhận được nhiều ngón tay cùng lúc. Laptop và máy tính để bàn thường chỉ có chuột, còn một số điện thoại và máy tính bảng chỉ theo dõi được vài điểm chạm. Khi đó ứng dụng chuyển sang chế độ nhấp chuột. Mỗi người chơi nhấp một lần để đặt một chấm màu, nhấp lại vào chấm đó nếu đặt nhầm, rồi bấm Bắt đầu khi mọi người đã vào. Cách chọn sau đó hoạt động y hệt bản dùng ngón tay.',
        'Chế độ nhấp chuột cũng hữu ích với nhóm đông. Hầu hết điện thoại theo dõi được khoảng năm ngón tay cùng lúc, còn bảng ngón tay nhận tối đa mười ngón. Nếu số người nhiều hơn mức màn hình cảm nhận được, hãy ngồi quanh một chiếc máy tính bảng, dùng chế độ nhấp chuột trên laptop, hoặc chia nhóm làm hai vòng rồi cho người thắng của mỗi vòng đấu với nhau.',
      ],
    },
    {
      h: 'Vì sao kết quả công bằng',
      p: [
        'Ứng dụng không quyết định trước bất cứ điều gì. Chỉ đúng lúc vòng tiến trình đầy, nó mới xem các ngón tay đang đặt trên màn hình và bốc thăm giữa chúng bằng bộ tạo số ngẫu nhiên mật mã của trình duyệt, crypto.getRandomValues. Nó dùng phương pháp rejection sampling, loại bỏ một vài giá trị thô khiến một số vị trí có xác suất cao hơn chút ít, nhờ đó mọi ngón tay có cơ hội hoàn toàn như nhau. Bạn đặt ngón ở đâu, đến sớm hay muộn, được màu nào đều không ảnh hưởng gì.',
        'Việc chia đội dùng cùng nguồn ngẫu nhiên đó. Tất cả ngón tay được xáo trộn rồi chia vào các đội lần lượt từng ngón, bắt đầu từ một đội được chọn ngẫu nhiên. Nhờ vậy số người giữa các đội chênh nhau tối đa một người, và ai cũng có cơ hội như nhau để vào bất kỳ đội nào. Vì đồng hồ đếm ngược bắt đầu lại mỗi khi có ngón tay được thêm vào hay nhấc ra, không ai có thể chờ xem tình hình rồi lén vào hoặc thoát ra vào giây cuối cùng.',
      ],
    },
    {
      h: 'Ý tưởng cho buổi tụ tập và đời thường',
      p: [
        'Chọn ngẫu nhiên bằng ngón tay rất hợp khi cả nhóm cần một quyết định nhanh và trung lập. Hãy thống nhất trước khi chạm màn hình xem người được chọn sẽ phải làm gì, để kết quả được đón nhận bằng tiếng cười thay vì tranh cãi.',
      ],
      list: [
        'Ai trả tiền cà phê hoặc ai thanh toán bữa này.',
        'Ai đi trước trong trò chơi bàn cờ hoặc bài.',
        'Ai rửa bát, đổ rác hoặc dắt chó đi dạo.',
        'Ai trả lời câu hỏi tiếp theo trong vòng đố vui hoặc thật hay thách.',
        'Chia bạn bè thành đội chơi đoán chữ, đá bóng hoặc đố vui ở quán nhậu.',
        'Chọn hai bạn tình nguyện trong lớp bằng chế độ nhiều người thắng.',
      ],
    },
    {
      h: 'Mẹo để mỗi lượt diễn ra suôn sẻ',
      p: [
        'Hãy đặt điện thoại nằm phẳng trên bàn thay vì cầm trên tay, để không ai vô tình chạm ngón cái vào màn hình. Mỗi người chỉ nên dùng một ngón tay và giữ yên; trượt ngón đi lại thì không sao, nhưng nhấc lên sẽ phải chờ lại từ đầu. Nếu điện thoại hiện cử chỉ hệ thống hoặc kéo xuống một menu, hãy đặt ngón cách xa mép màn hình hơn một chút.',
        'Kết quả của mười lượt gần nhất được liệt kê bên dưới kết quả khi trang còn mở, giúp ích khi chơi ba ván thắng hai. Chúng chỉ được lưu trong bộ nhớ và biến mất khi bạn đóng trang, còn các điểm chạm không bao giờ rời khỏi thiết bị của bạn.',
      ],
      list: [
        'Đặt điện thoại nằm phẳng và quây quanh nó.',
        'Mỗi người một ngón, cách xa mép màn hình.',
        'Đừng nhấc ngón cho đến khi kết quả hiện ra.',
        'Hơn năm người thì thử máy tính bảng hoặc chế độ nhấp chuột.',
      ],
    },
  ],
  cta: 'Mở trình chọn bằng ngón tay',
};
