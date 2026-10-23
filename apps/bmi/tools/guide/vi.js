module.exports = {
  metaTitle: 'Tính BMI: công thức, phân loại và giới hạn',
  description: 'Cách tính BMI theo kg hoặc pound, ngưỡng của WHO và chuẩn châu Á khác nhau thế nào, vì sao người nhiều cơ có BMI cao và cách đo vòng eo, tỷ lệ eo trên chiều cao.',
  h1: 'Tính BMI: chỉ số khối cơ thể là gì và đọc thế nào',
  updated: '2026-10-24',
  intro: 'Chỉ số khối cơ thể, hay BMI, là con số mà bác sĩ, bảo hiểm và ứng dụng tập luyện dùng nhiều nhất để xếp người lớn vào nhóm thiếu cân, bình thường, thừa cân và béo phì. Chỉ cần chiều cao và cân nặng nên tính rất nhanh, nhưng cũng khá thô. Bài này giải thích cách dùng công cụ tính BMI, công thức phía sau, ý nghĩa từng mức, những trường hợp BMI dễ sai và vài phép đo đơn giản giúp bạn nhìn rõ hơn.',
  sections: [
    {
      h: 'Cách dùng công cụ tính BMI',
      p: [
        'Chọn đơn vị (cm và kg, hoặc feet, inch và pound) rồi nhập chiều cao và cân nặng. Ngay khi điền đủ hai ô, BMI hiện ra với một chữ số thập phân, kèm vạch chỉ trên thanh màu và tên mức. Bên dưới là khoảng cân nặng hợp lý cho chiều cao của bạn, và nếu bạn nằm ngoài khoảng đó, công cụ cho biết còn cách chừng bao nhiêu.',
        'Tuổi và giới tính không bắt buộc. Chúng không làm đổi con số, chỉ thêm lời nhắc khi cần, chẳng hạn công cụ này dành cho người lớn, hay sau 65 tuổi BMI hơi cao một chút thường vẫn ổn. Công tắc “Chuẩn châu Á” áp dụng các ngưỡng thấp hơn mà Bộ Y tế Việt Nam đang dùng. Mọi phép tính đều diễn ra trong trình duyệt, không có gì được gửi đi hay lưu lại.',
      ],
      list: [
        'Số thập phân dùng dấu chấm hay dấu phẩy đều được: 70,5 và 70.5 như nhau.',
        'Khi đổi đơn vị, các số đã nhập sẽ được quy đổi tự động.',
        'Thẻ tóm tắt gom BMI, mức và khoảng cân nặng hợp lý vào một chỗ.',
      ],
    },
    {
      h: 'Công thức BMI từng bước',
      p: [
        'BMI bằng cân nặng (kg) chia cho bình phương chiều cao (m). Cao 1,70 m, nặng 65 kg thì tính 1,7 × 1,7 = 2,89, rồi 65 ÷ 2,89 ≈ 22,5. Vì chiều cao được bình phương nên vài centimet cũng tạo khác biệt lớn: cùng 65 kg, cao 1,65 m thì BMI khoảng 23,9, còn cao 1,75 m thì khoảng 21,2.',
        'Với đơn vị Mỹ, công thức là 703 × cân nặng (pound) ÷ bình phương chiều cao (inch). Số 703 chỉ để quy đổi pound và inch sang kg và mét. Công cụ dùng hệ số chính xác: 1 inch = 2,54 cm và 1 pound = 0,45359237 kg.',
      ],
      list: [
        'Hệ mét: BMI = kg ÷ (m × m)',
        'Đơn vị Mỹ: BMI = 703 × lb ÷ (in × in)',
        'Cân nặng hợp lý = từ 18,5 × m² đến 22,9 × m² (chuẩn châu Á)',
      ],
    },
    {
      h: 'Các mức BMI có nghĩa là gì',
      p: [
        'WHO chia BMI người lớn thành thiếu cân (dưới 18,5), bình thường (18,5–24,9), thừa cân (25–29,9) và béo phì (từ 30), trong đó béo phì lại chia thành độ 1 đến độ 3. Ngưỡng như nhau cho nam và nữ. Các ranh giới này đến từ nghiên cứu trên số đông: BMI càng xa vùng giữa thì nguy cơ tiểu đường type 2, tăng huyết áp và bệnh tim càng cao.',
        'Nghiên cứu ở châu Á cho thấy nhiều người châu Á gặp các nguy cơ đó ở BMI thấp hơn, một phần vì cùng cân nặng họ thường có nhiều mỡ hơn, nhất là mỡ bụng. Vì vậy chuẩn WHO khu vực châu Á – Thái Bình Dương quy định 18,5–22,9 là bình thường, 23–24,9 thừa cân, 25–29,9 béo phì độ 1 và từ 30 là béo phì độ 2, và Việt Nam dùng chuẩn này. Nhật Bản tính béo phì từ 25, còn Trung Quốc tính thừa cân từ 24.',
      ],
      list: [
        'Dưới 18,5: thiếu cân ở mọi thang đo',
        '18,5–22,9: bình thường theo chuẩn châu Á',
        '23–24,9: thừa cân theo chuẩn châu Á, nhưng vẫn bình thường theo WHO',
      ],
    },
    {
      h: 'Những điều BMI không cho biết',
      p: [
        'BMI chỉ nhìn tổng cân nặng nên không phân biệt được cơ và mỡ, cũng không biết mỡ nằm ở đâu. Một cầu thủ bóng bầu dục hay người tập tạ có thể bị xếp vào thừa cân, thậm chí béo phì, dù rất săn chắc, trong khi người lớn tuổi bị mất cơ có thể có BMI bình thường nhưng lại nhiều mỡ. Hai người cùng BMI vẫn có thể có sức khỏe rất khác nhau.',
        'BMI cũng không dành cho tất cả mọi người. Trẻ em và thiếu niên được đánh giá bằng biểu đồ tăng trưởng theo tuổi và giới tính, còn tăng cân khi mang thai có hướng dẫn riêng. Người lớn quá cao hoặc quá thấp, người bị phù cũng có thể nhận kết quả sai lệch. Hãy coi BMI là con số sàng lọc đầu tiên, không phải lời phán xét về sức khỏe.',
      ],
    },
    {
      h: 'Vòng eo và tỷ lệ eo trên chiều cao',
      p: [
        'Mỡ tích ở bụng liên quan đến bệnh tim và rối loạn chuyển hóa nhiều hơn mỡ ở chỗ khác, mà BMI lại không thấy được. Chỉ cần một cây thước dây: đo ở điểm giữa xương sườn dưới cùng và mào hông, sau khi thở ra bình thường. Với người Việt, vòng eo từ 90 cm ở nam và từ 80 cm ở nữ thường được xem là béo bụng.',
        'Tỷ lệ eo trên chiều cao cũng hay được dùng: dưới 0,5, tức vòng eo nhỏ hơn nửa chiều cao, thường là nguy cơ thấp hơn. Cân đo thành phần cơ thể và các phương pháp chụp chiếu ước tính mỡ trực tiếp hơn, dù máy dùng ở nhà hay sai số. Nếu BMI và vòng eo nói hai điều khác nhau, hãy hỏi bác sĩ thay vì chỉ tin một con số.',
      ],
      list: [
        'Vòng eo ÷ chiều cao dưới 0,5: nguy cơ thường thấp hơn',
        'Đo buổi sáng, ở tư thế đứng, sau khi thở ra',
        'Mỗi lần đo dùng cùng một thước và cùng một vị trí',
      ],
    },
    {
      h: 'Mẹo đọc và theo dõi kết quả',
      p: [
        'Hãy cân vào cùng một giờ, tốt nhất là buổi sáng, vì cân nặng sáng và tối có thể chênh hơn một ký. Theo dõi xu hướng trong vài tuần thay vì một con số lẻ, và nhớ rằng khoảng cân nặng hợp lý rộng vài ký là có lý do: không có một cân nặng hoàn hảo duy nhất. Nếu muốn thay đổi cân nặng, điều chỉnh nhỏ nhưng đều đặn về giấc ngủ, vận động và bữa ăn sẽ bền hơn ăn kiêng khắt khe.',
      ],
      list: [
        'Đo chiều cao khi đã bỏ giày và cân khi mặc đồ nhẹ.',
        'Kiểm tra vòng eo cùng với BMI.',
        'Nếu có bệnh nền, hãy hỏi bác sĩ trước khi thay đổi lớn.',
      ],
    },
  ],
  cta: 'Tính BMI ngay',
};
