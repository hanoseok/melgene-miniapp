/* Bạn là con vật nào? (vi)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Bạn là con vật nào? Trắc nghiệm tính cách",
    "description": "Bạn là con vật nào? Trắc nghiệm tính cách con vật qua 8 tình huống đời thường, 2–3 phút, miễn phí, không cần đăng ký. Tìm con vật giống bạn nhất, người bạn hợp nhất và mẹo nhỏ.",
    "ogTitle": "Bạn là con vật nào? 🦊 Trắc nghiệm tính cách",
    "ogDescription": "Bài trắc nghiệm nhanh 2 phút. Trả lời 8 tình huống đời thường và gặp con vật giống bạn nhất."
  },
  "siteName": "Bạn là con vật nào?",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🦊 Trắc nghiệm tính cách con vật",
    "h1Kicker": "Bạn là con vật nào?",
    "h1Html": "Bạn giống con vật nào<br><em>nhất</em>?",
    "hook": "Một kế hoạch bị hủy, cuộc gọi lúc nửa đêm, bữa tiệc chỉ quen đúng một người… Vài khoảnh khắc đời thường sẽ lộ ra phần hoang dã trong bạn.",
    "metaTime": "⏱️ 2–3 phút",
    "metaCount": "🐾 8 câu hỏi",
    "start": "Tìm con vật của tôi →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang lần theo dấu chân của bạn…",
    "sub": "Đang ghép câu trả lời với một con vật"
  },
  "result": {
    "title": "Bạn là con vật nào? Mình là {name}",
    "eyebrow": "Con vật giống bạn nhất là",
    "strengthsLabel": "Siêu năng lực của bạn",
    "tipsLabel": "Mẹo nhỏ cho bạn",
    "bestLabel": "Hợp nhất",
    "rivalLabel": "Oan gia",
    "sameShare": "{pct}% người chơi ra con vật này",
    "shareText": "Con vật giống mình nhất là {name} {emoji} — “{vibe}” Còn bạn là con vật nào?",
    "ctaStrong": "Một người bạn vừa chia sẻ con vật của họ",
    "ctaSub": "Bạn là con vật nào? Chỉ 2 phút.",
    "retry": "Làm lại trắc nghiệm"
  },
  "og": {
    "eyebrow": "Con vật của mình là",
    "brand": "🦊 Bạn là con vật nào?",
    "defaultKicker": "Trắc nghiệm tính cách con vật",
    "defaultTitle": "Bạn là con vật nào?",
    "defaultDesc": "8 tình huống đời thường · 2–3 phút"
  },
  "faq": [
    {
      "q": "Kết quả được chọn như thế nào?",
      "a": "Mỗi câu trả lời cộng điểm cho vài con vật, con vật nhiều điểm nhất sẽ là kết quả. Nếu hòa điểm sẽ có quy tắc cố định để phân định, nên cùng câu trả lời luôn ra cùng kết quả."
    },
    {
      "q": "Đây có phải trắc nghiệm tâm lý khoa học không?",
      "a": "Không, chỉ để giải trí thôi. Câu hỏi dựa trên thói quen và tâm trạng thường ngày, không phải chẩn đoán tâm lý. Hãy xem nó như chiếc gương vui vẻ."
    },
    {
      "q": "“Hợp nhất” và “Oan gia” nghĩa là gì?",
      "a": "Hợp nhất là con vật tự nhiên bổ sung cho bạn. Oan gia là con vật bạn hay va chạm nhất, và đôi khi cũng là nơi tóe lửa nhiều nhất."
    },
    {
      "q": "Câu trả lời của tôi có được lưu không?",
      "a": "Không. Câu trả lời chỉ được tính trong trình duyệt và không lưu ở đâu cả. Chúng tôi chỉ đếm ẩn danh con vật nào xuất hiện để hiển thị tỉ lệ mỗi kết quả."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Bạn là con vật nào?",
    "description": "Chính sách quyền riêng tư của “Bạn là con vật nào?” — cách dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Bạn là con vật nào? (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời chỉ được tính trong trình duyệt, không gửi lên hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh con vật nào xuất hiện để hiển thị tỉ lệ mỗi kết quả."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Xem thêm và thay đổi cài đặt tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi chỉ lưu tổng số ẩn danh theo ngày (lượt xem trang, lượt hoàn thành, đánh giá) để cải thiện Dịch vụ. Các con số này không thể nhận diện bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 6 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại trắc nghiệm con vật"
  },
  "questions": [
    {
      "q": "Kế hoạch cuối tuần bỗng bị hủy. Bạn…",
      "choices": [
        "Nhắn ngay cho mấy đứa bạn thân xem ai rảnh",
        "Cuối cùng cũng được ở nhà đọc sách hay xem phim tài liệu",
        "Thử đại một chỗ mới: quán cà phê mới, công viên, đâu cũng được",
        "Rủ cả nhóm đi ăn tối ngay. Hôm nay mình làm chủ xị!"
      ]
    },
    {
      "q": "Một dự án nhóm lớn rơi xuống đầu bạn. Bạn…",
      "choices": [
        "Làm từng bước một, chậm mà chắc, không vội",
        "Giữ không khí vui và làm phần mình theo nhịp của mình",
        "Đặt mục tiêu rõ ràng và nhắm tới kết quả tốt nhất",
        "Trước hết đảm bảo ai cũng được nói và thấy thoải mái"
      ]
    },
    {
      "q": "Nửa đêm bạn thân gọi điện, giọng buồn bã. Bạn…",
      "choices": [
        "Kể đủ chuyện cười cho tới khi bạn ấy bật cười",
        "Giúp bạn ấy lên một kế hoạch rõ ràng để giải quyết",
        "Nói “mình qua liền” rồi có mặt sau 20 phút",
        "Ở trên máy, nhẹ nhàng an ủi, bao lâu cũng được"
      ]
    },
    {
      "q": "Bạn tới một bữa tiệc mà chỉ quen đúng một người. Bạn…",
      "choices": [
        "Ở cạnh bạn mình, mỉm cười và chờ người khác tới bắt chuyện",
        "Bước vào như chủ nhà và chào hỏi mọi người",
        "Quan sát một lúc rồi bắt chuyện với người trông thú vị",
        "Tìm một góc thoải mái cạnh đồ ăn vặt rồi ngồi yên đó"
      ]
    },
    {
      "q": "Chọn chuyến đi trong mơ của bạn.",
      "choices": [
        "Khu nghỉ dưỡng ấm cúng: ngủ nướng, ăn ngon, chẳng làm gì",
        "Chuyến road trip với hội bạn thân, mỗi điểm dừng một kỷ niệm",
        "Miền quê đầy hoa hoặc căn nhà gỗ giữa rừng",
        "Phố cổ yên tĩnh đầy bảo tàng, hiệu sách và những câu chuyện"
      ]
    },
    {
      "q": "Đột nhiên có sự cố xảy ra. Bạn…",
      "choices": [
        "Tập trung, tìm cách nhanh nhất và giải quyết",
        "Cười xòa, ứng biến và biến nó thành vui",
        "Hít sâu, lấy chút đồ ăn vặt rồi để mọi chuyện tự ổn",
        "Bước lên và nắm quyền xử lý ngay"
      ]
    },
    {
      "q": "Bạn bè sẽ mô tả bạn là…",
      "choices": [
        "Người dịu dàng luôn nhận ra tâm trạng của mọi người",
        "Người có chí tiến thủ, lúc nào cũng có mục tiêu",
        "Người trung thành, luôn đứng về phía họ",
        "Người vui tính khiến kế hoạch nào cũng hay hơn"
      ]
    },
    {
      "q": "Buổi tối hoàn hảo của bạn kết thúc bằng…",
      "choices": [
        "Mọi người reo hò trong một đêm bạn khiến khó quên",
        "Đồ ăn ngon, người dễ mến và những tiếng cười không vội",
        "Một cuộc trò chuyện sâu lúc khuya dưới bầu trời sao",
        "Đi ngủ sớm, tắt điện thoại và ngủ thật lâu"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "Sói trung thành",
      "word": "sói",
      "vibe": "Trung thành tuyệt đối, bầy luôn đến trước.",
      "desc": "Bạn là người bạn luôn xuất hiện đúng lúc. Ai đã bước vào vòng tròn của bạn thì được bạn bảo vệ, ủng hộ và chuyện họ từng làm cho bạn, bạn không bao giờ quên. Ban đầu có thể trông nghiêm túc, nhưng bên người của mình bạn ấm áp, hài hước và hết lòng. Bầy của bạn thật may mắn.",
      "strengths": [
        "Lòng trung thành vững như đá",
        "Trái tim che chở",
        "Tinh thần đồng đội"
      ],
      "tips": [
        "Hãy để người khác giúp bạn nữa, bạn không cần gánh cả bầy.",
        "Thỉnh thoảng nói “không” cũng được. Trung thành không có nghĩa là gì cũng đồng ý.",
        "Chừa chỗ cho người mới; vòng tròn của bạn có thể rộng ra mà vẫn ấm áp."
      ]
    },
    "owl": {
      "name": "Cú thông thái",
      "word": "cú",
      "vibe": "Lặng lẽ quan sát, luôn nghĩ sâu hơn ba bước.",
      "desc": "Bạn thích nhìn, nghe và hiểu rồi mới nói. Mọi người tìm bạn khi cần lời khuyên chín chắn, và bạn tỏa sáng nhất trong những cuộc trò chuyện sâu lúc khuya. Bạn thích học hỏi và để ý những chi tiết người khác bỏ sót. Đôi khi nghĩ nhiều, nhưng sự tinh tế của bạn là một món quà thật sự.",
      "strengths": [
        "Nhìn thấu sắc bén",
        "Biết lắng nghe",
        "Trí tò mò"
      ],
      "tips": [
        "Hãy chia sẻ ý tưởng trước khi nó hoàn hảo, mọi người muốn nghe đấy.",
        "Khi đầu óc quay cuồng, hãy viết ra hoặc đi dạo thay vì nghĩ lại mãi.",
        "Dành chút thời gian chơi chẳng để làm gì cả. Bộ não cũng cần giờ ra chơi."
      ]
    },
    "otter": {
      "name": "Rái cá tinh nghịch",
      "word": "rái cá",
      "vibe": "Vui thuần túy, nụ cười rạng rỡ và tài biến ngày nào cũng tốt hơn.",
      "desc": "Bạn biến những khoảnh khắc bình thường thành trò chơi. Bạn tò mò, thân thiện và gần như không ai buồn nổi khi ở cạnh bạn. Đi đâu bạn cũng có bạn mới và giữ không khí nhẹ nhàng dù mọi thứ có lộn xộn. Sau những trò đùa là mong muốn đơn giản: ai cũng được vui cùng nhau.",
      "strengths": [
        "Mang năng lượng tốt ngay lập tức",
        "Kết bạn dễ dàng",
        "Vui vẻ không sợ gì"
      ],
      "tips": [
        "Thỉnh thoảng hãy có một phút yên tĩnh; không phải cảm xúc nào cũng cần trò đùa.",
        "Hoàn thành một việc nhỏ trước khi bắt đầu cuộc phiêu lưu tiếp theo.",
        "Khi thật sự khó khăn, hãy nói ra. Mọi người sẵn lòng ở bên bạn."
      ]
    },
    "lion": {
      "name": "Sư tử dũng cảm",
      "word": "sư tử",
      "vibe": "Tự tin, ấm áp và sinh ra để dẫn dắt cả căn phòng.",
      "desc": "Bạn bước lên khi người khác còn do dự. Bạn có phong thái, lòng can đảm và sự hào phóng, nên mọi người tự nhiên đi theo năng lượng của bạn. Bạn thích những khoảnh khắc lớn và đảm bảo người của mình được ăn mừng. Tốt nhất là khi bạn dẫn dắt bằng cách nâng mọi người xung quanh lên.",
      "strengths": [
        "Khả năng lãnh đạo bẩm sinh",
        "Can đảm rộng lượng",
        "Sự tự tin lan tỏa"
      ],
      "tips": [
        "Thỉnh thoảng nhường ánh đèn sân khấu; người ít nói thường có ý tưởng hay nhất.",
        "Hỏi trước khi đứng ra điều hành. Giúp đỡ hiệu quả nhất khi được mời.",
        "Nghỉ ngơi cũng là một phần của sức mạnh. Vua cũng ngủ trưa."
      ]
    },
    "panda": {
      "name": "Gấu trúc thư thả",
      "word": "gấu trúc",
      "vibe": "Dễ chịu, tốt bụng và là sự bình yên trong mọi cơn bão.",
      "desc": "Bạn thuận theo dòng chảy và giúp mọi người xung quanh thư giãn. Bạn thích đồ ăn ngon, bầu bạn tốt và những ngày không vội vã. Bạn hiếm khi gây chuyện và rất khó bị làm rối. Mọi người quý bạn vì ở cạnh bạn thấy an toàn và dễ chịu.",
      "strengths": [
        "Sự hiện diện điềm tĩnh",
        "Lòng tốt dễ chịu",
        "Tận hưởng điều nhỏ bé"
      ],
      "tips": [
        "Hãy nói điều bạn muốn; bạn cũng được phép có lựa chọn yêu thích.",
        "Mỗi tuần chọn một mục tiêu nhỏ để thử sức mình một chút.",
        "Đừng để câu “sao cũng được” che mất cảm xúc thật của bạn."
      ]
    },
    "eagle": {
      "name": "Đại bàng tham vọng",
      "word": "đại bàng",
      "vibe": "Tập trung, độc lập và luôn nhắm cao hơn.",
      "desc": "Bạn nhìn thấy bức tranh lớn và lao thẳng tới. Bạn đặt mục tiêu, lập kế hoạch và đòi hỏi cao ở bản thân. Bạn thích tự lập và giải quyết vấn đề nhanh. Tham vọng của bạn truyền cảm hứng, và trong thâm tâm bạn mong có ai đó theo kịp nhịp của mình.",
      "strengths": [
        "Tập trung rõ ràng",
        "Tinh thần tự lập",
        "Giải quyết vấn đề nhanh"
      ],
      "tips": [
        "Hãy ăn mừng những chiến thắng trên đường đi, không chỉ ở đỉnh núi.",
        "Tuần này thử giao một việc cho người khác. Sự tin tưởng đi xa hơn tốc độ.",
        "Hỏi thăm cảm xúc của người khác; tiến bộ sẽ tốt hơn khi được chia sẻ."
      ]
    },
    "sloth": {
      "name": "Lười ươi ấm áp",
      "word": "lười",
      "vibe": "Chậm, đều và là cao thủ tận hưởng cuộc sống.",
      "desc": "Bạn biết bí mật mà người khác hay quên: vội vàng không được thưởng gì. Bạn giữ gìn sự bình yên, yêu sự thoải mái và đi từng bước nhẹ nhàng. Bạn kiên nhẫn, ung dung và âm thầm hiểu điều gì thật sự quan trọng. Sự bình tĩnh của bạn là món quà giữa thế giới vội vã.",
      "strengths": [
        "Kiên nhẫn sâu sắc",
        "Tâm thế bình yên",
        "Bậc thầy thoải mái"
      ],
      "tips": [
        "Hãy bắt đầu trước khi thấy sẵn sàng; bước nhỏ cũng tính.",
        "Báo kế hoạch cho bạn bè sớm để họ điều chỉnh theo nhịp của bạn.",
        "Mỗi tháng thử một điều mới. Ấm cúng và tò mò có thể đi cùng nhau."
      ]
    },
    "deer": {
      "name": "Hươu dịu dàng",
      "word": "hươu,nai",
      "vibe": "Mềm lòng, duyên dáng và hiểu cảm xúc của mọi người.",
      "desc": "Bạn để ý những điều nhỏ: tâm trạng ai đó đổi khác, một người lẻ loi trong góc phòng. Bạn dịu dàng, nhạy cảm, tử tế lặng lẽ và thích những nơi đẹp, yên bình. Có thể bạn giật mình trước xung đột, nhưng sự đồng cảm khiến mọi người tin tưởng tâm sự với bạn.",
      "strengths": [
        "Đồng cảm sâu sắc",
        "Lòng tốt duyên dáng",
        "Mắt nhìn cái đẹp"
      ],
      "tips": [
        "Cảm xúc của bạn cũng quan trọng như của họ; hãy nói sớm, dù nhẹ nhàng.",
        "Sau những ngày bận rộn, hãy nạp lại năng lượng bằng thiên nhiên hoặc âm nhạc.",
        "Bạn được phép nói “cho mình một lát” mà không cần giải thích."
      ]
    }
  }
};
