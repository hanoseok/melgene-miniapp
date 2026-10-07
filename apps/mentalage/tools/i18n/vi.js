/* Trắc nghiệm tuổi tâm lý (vi)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trắc nghiệm tuổi tâm lý: Tâm hồn bạn bao nhiêu tuổi?",
    "description": "Làm trắc nghiệm tuổi tâm lý miễn phí: 12 câu hỏi đời thường nhẹ nhàng, 2–3 phút, không cần đăng ký. Biết chính xác tuổi tâm lý của bạn bằng con số, kèm điểm mạnh và lời khuyên.",
    "ogTitle": "Trắc nghiệm tuổi tâm lý 🧠 Tâm hồn bạn bao nhiêu tuổi?",
    "ogDescription": "Bài trắc nghiệm 2 phút. 12 câu hỏi đời thường cho bạn biết tuổi tâm lý bằng con số."
  },
  "siteName": "Trắc nghiệm tuổi tâm lý",
  "privacyLink": "Chính sách bảo mật",
  "start": {
    "badge": "🧠 Đo tuổi tâm hồn",
    "h1Kicker": "Trắc nghiệm tuổi tâm lý",
    "h1Html": "Thật ra tâm hồn bạn<br><em>bao nhiêu tuổi</em>?",
    "hook": "Căn cước ghi một con số, còn thói quen hằng ngày có thể nói con số khác. Trả lời thật lòng để xem đầu óc bạn nghĩ mình bao nhiêu tuổi.",
    "metaTime": "⏱️ 2–3 phút",
    "metaCount": "✏️ 12 câu hỏi",
    "start": "Xem tuổi tâm lý →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang đọc cuốn sổ nguệch ngoạc…",
    "sub": "Đang đếm nến trên chiếc bánh sinh nhật trong lòng bạn"
  },
  "result": {
    "title": "Trắc nghiệm tuổi tâm lý: Mình là {name}",
    "eyebrow": "Tuổi tâm lý của bạn",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} tuổi",
      "few": "{n} tuổi",
      "many": "{n} tuổi",
      "other": "{n} tuổi"
    },
    "metaRange": "Tuổi tâm lý: {range}.",
    "strengthsLabel": "Điểm sáng của bạn",
    "tipsLabel": "Lời khuyên cho tuổi tâm hồn",
    "bestLabel": "Bạn thân hợp cạ",
    "rivalLabel": "Oan gia",
    "sameShare": "{pct}% người chơi cùng nhóm tuổi",
    "shareText": "Tuổi tâm lý của mình là {age}! {emoji} {name} “{vibe}” Còn tâm hồn bạn bao nhiêu tuổi?",
    "ctaStrong": "Bạn bè vừa chia sẻ tuổi tâm lý",
    "ctaSub": "Tâm hồn bạn bao nhiêu tuổi? 2 phút thôi.",
    "retry": "Làm lại trắc nghiệm"
  },
  "og": {
    "eyebrow": "Tuổi tâm lý của mình",
    "brand": "🧠 Trắc nghiệm tuổi tâm lý",
    "defaultKicker": "Trắc nghiệm tuổi tâm lý",
    "defaultTitle": "Tâm hồn bạn bao nhiêu tuổi?",
    "defaultDesc": "12 câu hỏi đời thường · 2–3 phút"
  },
  "faq": [
    {
      "q": "Tuổi tâm lý được tính thế nào?",
      "a": "Mỗi câu trả lời mang một ít “điểm tuổi tâm hồn”. Tổng điểm xếp bạn vào một nhóm tuổi, và vị trí câu trả lời trong nhóm đó cho ra con số chính xác. Trả lời giống nhau thì kết quả luôn giống nhau."
    },
    {
      "q": "Đây có phải bài kiểm tra tâm lý thật không?",
      "a": "Không, chỉ để giải trí thôi. Bài này nhìn vào thói quen và tâm trạng hằng ngày, không đo trí thông minh hay độ trưởng thành. Hãy xem nó như một tấm gương vui, không phải chẩn đoán."
    },
    {
      "q": "Sao kết quả khác tuổi thật của mình nhiều thế?",
      "a": "Đó chính là phần thú vị. Nhiều người có tâm hồn trẻ hơn hoặc già dặn hơn tuổi thật. Kết quả cũng có thể đổi theo tâm trạng, hãy thử lại vào hôm khác nhé."
    },
    {
      "q": "Câu trả lời của mình có bị lưu lại không?",
      "a": "Không. Câu trả lời được tính ngay trong trình duyệt và không được lưu. Chúng tôi chỉ đếm ẩn danh nhóm tuổi nào xuất hiện để hiển thị tỉ lệ của từng kết quả."
    }
  ],
  "privacy": {
    "title": "Chính sách bảo mật | Trắc nghiệm tuổi tâm lý",
    "description": "Chính sách bảo mật của Trắc nghiệm tuổi tâm lý — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách bảo mật",
    "introHtml": "Trắc nghiệm tuổi tâm lý (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời được tính trong trình duyệt và không bao giờ được gửi hay lưu trên máy chủ. Chúng tôi chỉ đếm ẩn danh nhóm tuổi nào xuất hiện để hiển thị tỉ lệ của từng kết quả."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu tổng số theo ngày ở dạng ẩn danh (lượt xem trang, bài trắc nghiệm hoàn thành, đánh giá) để cải thiện Dịch vụ. Các số liệu này không thể nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ người vận hành trang web."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 8 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại trắc nghiệm tuổi tâm lý"
  },
  "questions": [
    {
      "q": "Thứ Bảy không đặt báo thức. Bạn dậy lúc mấy giờ?",
      "choices": [
        "6 giờ sáng, đã lên kế hoạch cả ngày",
        "Khoảng 9 giờ, tự dậy thật sảng khoái",
        "Quá trưa… buổi sáng là gì nhỉ?",
        "Dậy sớm tinh vì được nghỉ, vui quá!"
      ]
    },
    {
      "q": "Sinh nhật lý tưởng của bạn là…",
      "choices": [
        "Bóng bay, mũ chóp và bánh kem thật to!",
        "Tiệc lớn với cả hội bạn tới khuya",
        "Bữa tối ấm cúng với vài người bạn thân",
        "Một ngày yên tĩnh, gia đình gọi điện là đủ"
      ]
    },
    {
      "q": "Đang ở ngoài mà điện thoại còn 15% pin!",
      "choices": [
        "Hoảng, đi tìm chỗ sạc ngay",
        "Không sao, sạc dự phòng lúc nào cũng mang theo",
        "Tắt thì tắt, coi như phiêu lưu!"
      ]
    },
    {
      "q": "Vào siêu thị, bạn đi thẳng tới…",
      "choices": [
        "Quầy bánh kẹo",
        "Mì gói và đồ đông lạnh",
        "Rau củ tươi và hàng khuyến mãi tuần này",
        "Theo danh sách đã ghi, từng món một"
      ]
    },
    {
      "q": "Ai cũng đang nói về một bài hit mới.",
      "choices": [
        "Vũ đạo trend mình nhảy được rồi",
        "Thêm vào playlist ngay ngày đầu",
        "Ủa, đây chẳng phải bài cũ làm lại sao?",
        "Để hôm nào rảnh nghe thử"
      ]
    },
    {
      "q": "Ngày nghỉ trời mưa, kế hoạch là…",
      "choices": [
        "Đi ủng ra ngoài nhảy vũng nước!",
        "Cuộn chăn, ăn vặt, cày nguyên mùa phim",
        "Nấu nồi canh nóng và dọn nhà một chút",
        "Pha trà, đọc sách rồi ngủ trưa nghe mưa rơi"
      ]
    },
    {
      "q": "Bất ngờ được thưởng một khoản!",
      "choices": [
        "Mua ngay game hay mô hình mình thèm từ lâu",
        "Đặt chuyến đi chơi với bạn bè liền",
        "Ăn một bữa ngon, còn lại để dành",
        "Gửi tiết kiệm hết. Bản thân tương lai cảm ơn."
      ]
    },
    {
      "q": "Tối thứ Sáu không có hẹn.",
      "choices": [
        "Chơi game hoặc gọi điện tới sáng",
        "Nhắn khắp nơi tới khi có kèo",
        "9 giờ mặc đồ ngủ, 10 giờ đi ngủ. Hạnh phúc."
      ]
    },
    {
      "q": "Thấy mình sắp bị cảm, bạn sẽ…",
      "choices": [
        "Than thở chút, chờ người khác chăm sóc",
        "Mặc kệ, cứ làm tiếp",
        "Trà gừng, vitamin rồi đi ngủ sớm",
        "Uống thuốc rồi bình tĩnh làm việc tiếp"
      ]
    },
    {
      "q": "Nhóm chat Zalo réo liên tục.",
      "choices": [
        "Thả liền mười cái sticker",
        "Gửi một cái meme chuẩn chỉnh",
        "Đọc hết rồi trả lời một tin thật dài sau",
        "Tắt thông báo. Sao mọi người nói nhiều thế?"
      ]
    },
    {
      "q": "Căn phòng của bạn lúc này…",
      "choices": [
        "Đầy gấu bông, mô hình và đồ sặc sỡ",
        "Poster, dây sạc và một mớ hỗn độn sáng tạo",
        "Gọn gàng tối giản, mọi thứ đúng chỗ",
        "Cây xanh, ghế bành êm ái và đèn đọc sách"
      ]
    },
    {
      "q": "Nếu chỉ được chọn một…",
      "choices": [
        "Làm đứa trẻ vô tư thêm một ngày",
        "Tua nhanh tới tuổi nghỉ hưu bình yên"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Nhóc sân chơi",
      "word": "nhóc,sân chơi",
      "vibe": "Tò mò, tinh nghịch và tràn đầy niềm vui.",
      "desc": "Tâm hồn bạn vẫn chạy theo tốc độ giờ ra chơi. Bạn dễ phấn khích, cười thật to và tìm ra niềm vui trong gần như mọi thứ. Có trò chơi là luật lệ tạm gác lại. Nguồn năng lượng hồn nhiên ấy lan tỏa, khiến người xung quanh cũng trẻ ra.",
      "strengths": [
        "Tò mò vô tận",
        "Cây hài tức thì",
        "Trí tưởng tượng không sợ hãi"
      ],
      "tips": [
        "Giữ sự háo hức, nhưng đặt một lời nhắc cho việc người lớn nhàm chán.",
        "Thấy bất công thì hít thở ba lần rồi hãy nói.",
        "Chia sẻ món vui yêu thích với người bạn đang cần nụ cười."
      ]
    },
    "teen": {
      "name": "Teen nổi loạn",
      "word": "teen,nổi loạn",
      "vibe": "Cảm xúc lớn, quan điểm rõ và playlist cho mọi tâm trạng.",
      "desc": "Tâm hồn bạn đang ở giữa lớp học cấp ba: chuyện gì cũng quan trọng và cảm nhận cái gì cũng mãnh liệt. Bạn đặt câu hỏi với luật lệ, bắt trend nhanh hơn ai hết và cần không gian riêng. Sau vẻ ngầu là trái tim trung thành, sẵn sàng làm mọi thứ vì bạn bè.",
      "strengths": [
        "Nhiệt huyết với mọi thứ",
        "Cực kỳ nghĩa khí",
        "Radar bắt trend"
      ],
      "tips": [
        "Không phải cảm xúc nào cũng cần trả lời ngay. Ngủ một đêm đã.",
        "Ghi lại những ý tưởng lớn, có cái hay thật đấy.",
        "Thử nói chuyện với người lớn. Họ cũng từng nổi loạn."
      ]
    },
    "fresh": {
      "name": "Tân sinh viên tự do",
      "word": "tân sinh viên",
      "vibe": "Tự do, ngẫu hứng và cái gì cũng chơi.",
      "desc": "Tâm hồn bạn như năm nhất đại học: hơi cháy túi nhưng rất tự do, kèo bất chợt nào cũng sẵn sàng. Bạn sưu tầm trải nghiệm thay vì đồ vật và đi đâu cũng có bạn. Cuộc sống là một chuyến phiêu lưu lớn, vừa đi vừa học.",
      "strengths": [
        "Nghĩ là làm",
        "Đi đâu cũng có bạn",
        "Dũng cảm với điều mới"
      ],
      "tips": [
        "Cứ phiêu lưu, nhưng tập một thói quen để dành nho nhỏ.",
        "Chọn một mục tiêu trong tháng này và làm tới cùng.",
        "Thỉnh thoảng gọi về nhà, mọi người thích nghe chuyện của bạn lắm."
      ]
    },
    "hustle": {
      "name": "Tuổi đôi mươi cháy hết mình",
      "word": "đôi mươi",
      "vibe": "Tham vọng, bận rộn, chạy bằng cà phê và giấc mơ lớn.",
      "desc": "Tâm hồn bạn đang ở chế độ xây dựng cuộc đời. Bạn tung hứng mục tiêu, dự án tay trái và lịch kín mít mà vẫn có thời gian vui chơi. Bạn muốn trưởng thành nhưng không muốn nhàm chán. Sự quyết tâm của bạn truyền cảm hứng, miễn là nhớ nghỉ ngơi.",
      "strengths": [
        "Động lực không ngừng",
        "Cao thủ đa nhiệm",
        "Người lập kế hoạch lạc quan"
      ],
      "tips": [
        "Xếp lịch nghỉ ngơi như xếp lịch làm việc.",
        "Ăn mừng cả những thành công nhỏ.",
        "Chưa cần biết hết mọi câu trả lời đâu."
      ]
    },
    "steady": {
      "name": "Tuổi ba mươi vững vàng",
      "word": "ba mươi",
      "vibe": "Điềm tĩnh, đáng tin và âm thầm làm chủ.",
      "desc": "Tâm hồn bạn đã tìm thấy nhịp riêng. Bạn biết mình thích gì, không thích gì và khi nào cần từ chối. Bạn lên kế hoạch trước, giữ lời hứa và nấu ăn khá ngon. Ai cần một chỗ dựa vững vàng đều tìm tới bạn, và hiếm khi thất vọng.",
      "strengths": [
        "Đáng tin tuyệt đối",
        "Lập kế hoạch thông minh",
        "Hiểu rõ giới hạn bản thân"
      ],
      "tips": [
        "Tuần này chừa chỗ cho niềm vui không định trước.",
        "Thử một thứ khiến bạn lại làm người mới bắt đầu.",
        "Thỉnh thoảng để người khác giúp. Tin tưởng là chuyện hai chiều."
      ]
    },
    "seasoned": {
      "name": "Tuổi bốn mươi từng trải",
      "word": "bốn mươi,từng trải",
      "vibe": "Nhiều kinh nghiệm, thực tế và khó bị lay động.",
      "desc": "Tâm hồn bạn đã thấy nhiều cú plot twist mà vẫn bình tĩnh. Bạn giải quyết vấn đề nhanh, góp ý thẳng thắn và không phí sức cho drama. Bạn quý sự thoải mái, chất lượng và người nói được làm được. Có bạn bên cạnh ai cũng thấy yên tâm.",
      "strengths": [
        "Bình tĩnh trước áp lực",
        "Góp ý chân thành",
        "Khôn ngoan thực tế"
      ],
      "tips": [
        "Kể chuyện của bạn, người trẻ học được nhiều lắm.",
        "Giữ một sở thích chỉ để vui, không vì thành tích.",
        "Giãn cơ mỗi sáng. Cái lưng sẽ cảm ơn bạn."
      ]
    },
    "mellow": {
      "name": "Tuổi năm mươi thong thả",
      "word": "năm mươi,thong thả",
      "vibe": "Thư thái, ấm áp và hạnh phúc không vội vàng.",
      "desc": "Tâm hồn bạn thích làn đường chậm. Bạn chuộng bữa ăn ngon, cuộc dạo bộ dài và câu chuyện thật lòng hơn một đêm ồn ào. Chuyện nhỏ cũng làm bạn vui, và bạn không còn bận tâm ánh nhìn người khác. Sự ấm áp thong thả của bạn làm buổi gặp nào cũng dễ chịu hơn.",
      "strengths": [
        "Sự hiện diện bình yên",
        "Biết tận hưởng niềm vui nhỏ",
        "Người lắng nghe rộng lượng"
      ],
      "tips": [
        "Mùa này hãy nói “có” với một trải nghiệm mới.",
        "Dạy ai đó một kỹ năng bạn tự hào.",
        "Gửi một tin nhắn ngắn hỏi thăm bạn cũ."
      ]
    },
    "sage": {
      "name": "Tâm hồn già thông thái",
      "word": "thông thái,tâm hồn già",
      "vibe": "Sâu sắc, dịu dàng và đầy trí tuệ lặng lẽ.",
      "desc": "Tâm hồn bạn như đã sống qua nhiều kiếp. Bạn yêu sự yên bình, nếp sinh hoạt quen thuộc, tách trà nóng và những cuốn sách hay. Bạn nhận ra điều người khác bỏ lỡ, và lời khuyên của bạn được nhớ nhiều năm. Không chạy theo trend, nhưng ai cũng muốn nghe góc nhìn điềm đạm của bạn.",
      "strengths": [
        "Góc nhìn sâu sắc",
        "Kiên nhẫn dịu dàng",
        "Lời khuyên đọng lại lâu"
      ],
      "tips": [
        "Tuần này làm một việc ngẫu hứng, ngớ ngẩn chút. Chẳng vì gì cả.",
        "Chia sẻ những thói quen bình yên của bạn với một người bạn.",
        "Chơi một ván game với người nhỏ tuổi hơn nhiều. Cả hai sẽ cùng cười."
      ]
    }
  }
};
