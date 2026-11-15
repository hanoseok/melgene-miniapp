/* Party Personality Test (vi) — Trắc nghiệm tính cách khi đi tiệc
 * Same structure as en.js. questions[i].choices[j] keep the en order (scoring lives in partytype-core.js).
 * No spoilers in meta / og.default* / start / faq / loading. No digits in type texts.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trắc nghiệm tính cách khi đi tiệc – Bạn là kiểu khách nào?",
    "description": "Trắc nghiệm tính cách khi đi tiệc: 12 tình huống, 2 phút, không cần đăng ký. Xem bạn là kiểu khách nào ở tiệc tất niên, liên hoan hay karaoke, kèm điểm năng lượng tiệc của riêng bạn.",
    "ogTitle": "Trắc nghiệm tính cách khi đi tiệc 🎉 Bạn là kiểu khách nào?",
    "ogDescription": "Mười hai khoảnh khắc trong một buổi tiệc. Khám phá phong cách đi tiệc và điểm năng lượng tiệc của riêng bạn. Trò chơi cho vui, không phải đánh giá lâm sàng."
  },
  "siteName": "Trắc nghiệm tính cách khi đi tiệc",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🎉 Chơi vui mùa tiệc tùng",
    "h1Kicker": "Trắc nghiệm tính cách khi đi tiệc",
    "h1Html": "Tiệc tất niên, sinh nhật, liên hoan công ty:<br>bạn là <em>vị khách</em> kiểu nào?",
    "hook": "Buổi tiệc nào vui cũng cần đủ kiểu người. Có người bước vào là cả phòng bừng sáng, có người để ý không ai bị bỏ lại một mình, và có người lặng lẽ giữ cho cả buổi tối trôi chảy. Đi qua mười hai khoảnh khắc trong một bữa tiệc để biết vai nào thật sự là của bạn.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "💭 12 câu hỏi",
    "start": "Bắt đầu ngay →"
  },
  "quiz": {
    "backAria": "Câu hỏi trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang bắt sóng không khí…",
    "sub": "Đang xem năng lượng, sự chú ý và phong cách đi tiệc của bạn"
  },
  "result": {
    "title": "Phong cách đi tiệc của mình: {name}",
    "metaDesc": "Kết quả trắc nghiệm tính cách khi đi tiệc: {name}. {vibe} Xem điểm mạnh, mẹo đi tiệc, buổi tiệc lý tưởng, bạn cạ cứng và kiểu đối lập của bạn.",
    "eyebrow": "Ở bữa tiệc, bạn là…",
    "gaugeTitle": "Năng lượng tiệc của bạn",
    "gaugeLow": "Nhẹ nhàng",
    "gaugeHigh": "Hết công suất",
    "gaugeNote": "Chỉ tính từ câu trả lời của chính bạn về lúc đến, âm nhạc, thức khuya và sáng hôm sau. Không so sánh với bất kỳ ai.",
    "scoreFmt": "{n}",
    "bandLow": "Bạn thích tiệc ở âm lượng vừa phải: bạn bè thân, chỗ ngồi êm và những cuộc trò chuyện thật lòng.",
    "bandMid": "Bạn có thể vặn to hay nhỏ tùy đám đông và tâm trạng hôm đó.",
    "bandHigh": "Bạn mê sự náo nhiệt: nhạc to, người khắp nơi, và đêm vẫn còn dài.",
    "traitsLabel": "Điểm mạnh khi đi tiệc",
    "tipsLabel": "Mẹo đi tiệc cho bạn",
    "perfectLabel": "Buổi tiệc lý tưởng của bạn",
    "bestLabel": "Bạn cạ cứng",
    "rivalLabel": "Kiểu đối lập",
    "disclaimer": "Chỉ để cho vui thôi! Bài trắc nghiệm này để giải trí, không phải đánh giá lâm sàng hay bài kiểm tra tâm lý. Nó chỉ nhìn vào vài thói quen khi đi tiệc và không thể nói bạn là người thế nào. Kiểu nào cũng làm bữa tiệc vui hơn.",
    "sameShare": "{pct}% người chơi có cùng kết quả này",
    "shareText": "Phong cách đi tiệc của mình là {name} {emoji} “{vibe}” Còn bạn là kiểu khách nào?",
    "ctaStrong": "Bạn của bạn vừa chia sẻ phong cách đi tiệc",
    "ctaSub": "Bạn là kiểu khách nào ở bữa tiệc? Biết ngay sau 2 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Phong cách đi tiệc của mình",
    "brand": "🎉 Trắc nghiệm tính cách khi đi tiệc",
    "defaultKicker": "Chơi vui mùa tiệc tùng",
    "defaultTitle": "Bạn là kiểu khách nào ở bữa tiệc?",
    "defaultDesc": "12 khoảnh khắc đi tiệc · 2 phút · điểm năng lượng của riêng bạn"
  },
  "faq": [
    {
      "q": "Bài trắc nghiệm tính cách khi đi tiệc này xem xét điều gì?",
      "a": "Ba thói quen khi đi tiệc: bạn thích náo nhiệt đến mức nào, sự chú ý của bạn dồn vào con người hay khung cảnh xung quanh (nhạc, đồ ăn, ảnh, trò chơi), và bạn thích lên kế hoạch trước hay cứ để mọi thứ tự nhiên."
    },
    {
      "q": "Kết quả của tôi được chọn thế nào?",
      "a": "Mỗi khoảnh khắc xem xét một trong ba thói quen. Kết hợp cả ba sẽ ra phong cách đi tiệc của bạn, và cùng một cách trả lời thì luôn cho cùng một kết quả."
    },
    {
      "q": "Điểm năng lượng tiệc được tính từ đâu?",
      "a": "Chỉ tính từ câu trả lời của chính bạn ở các câu hỏi về năng lượng. Câu trả lời sôi nổi làm điểm tăng, câu trả lời nhẹ nhàng làm điểm giảm. Điểm này không được so với ai khác."
    },
    {
      "q": "Đi tiệc mà trầm tính thì có sao không?",
      "a": "Hoàn toàn không. Những vị khách điềm tĩnh thường có những cuộc trò chuyện hay nhất và khiến người khác thấy thoải mái. Một bữa tiệc tuyệt vời cần đủ kiểu khách, từ người ồn ào nhất đến người im lặng nhất."
    },
    {
      "q": "Đây có phải là đánh giá lâm sàng hay tâm lý không?",
      "a": "Không. Bài trắc nghiệm này chỉ để cho vui, không phải đánh giá lâm sàng hay bài kiểm tra tâm lý. Câu trả lời được tính ngay trên trình duyệt và không được lưu lại; chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm tính cách khi đi tiệc",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm tính cách khi đi tiệc — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm tính cách khi đi tiệc (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi đến hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho biết mỗi kết quả phổ biến đến đâu."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong phần cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên những lần bạn truy cập trang này và các trang web khác trước đó. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu tổng số liệu hằng ngày ở dạng ẩn danh (lượt xem trang, số bài hoàn thành, đánh giá) để cải thiện Dịch vụ. Các số liệu này không thể dùng để nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người quản lý trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 16 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm tính cách khi đi tiệc"
  },
  "questions": [
    {
      "q": "Bạn bước qua cửa, bữa tiệc đã bắt đầu từ lâu. Bạn…",
      "choices": [
        "Lặng lẽ đi vào và tìm một gương mặt quen",
        "Chào vài người rồi đi lấy đồ uống",
        "Xuất hiện thật hoành tráng: “Tới rồi đây! Quẩy thôi!”",
        "Chào chủ tiệc trước, rồi tìm một góc ngồi thoải mái"
      ]
    },
    {
      "q": "Bữa tiệc mãi chưa vào guồng. Bạn tìm đến thứ gì đầu tiên?",
      "choices": [
        "Cái loa. Đúng playlist là cứu được tất cả",
        "Người đang đứng một mình bên tường. Mình dẫn họ đi làm quen",
        "Nhóm nhỏ gần nhất, để nhập hội trò chuyện",
        "Bàn đồ ăn vặt. Đồ ngon là mọi người tự khắc nói chuyện"
      ]
    },
    {
      "q": "Lời mời đi tiệc tối thứ Bảy hiện lên trong nhóm Zalo. Bạn…",
      "choices": [
        "Trả lời “chắc là đi!” rồi để xem tuần này thế nào",
        "Xác nhận ngay, đặt nhắc lịch và hỏi có cần mang gì không",
        "Để hôm đó tính. Có khi cứ thế mà đến",
        "Nhận lời rồi hỏi mấy giờ nên có mặt"
      ]
    },
    {
      "q": "Ai đó vặn to nhạc và màn nhảy nhót (hoặc karaoke) bắt đầu. Bạn…",
      "choices": [
        "Nhập cuộc sau một hai bài",
        "Vui vẻ ngồi trên sofa cổ vũ mọi người",
        "Lắc lư nhẹ nhàng ở góc phòng",
        "Mình lên đầu tiên. Đưa micro đây!"
      ]
    },
    {
      "q": "Bạn đang đứng ở bàn đồ ăn. Bạn…",
      "choices": [
        "Bắt chuyện với bất kỳ ai đứng cạnh",
        "Nếm thử mọi món và thầm xếp hạng món ngon nhất",
        "Lấy mỗi món một ít đầy đĩa và ngắm cả bàn tiệc",
        "Lấy một đĩa cho người bạn đang kẹt trong cuộc nói chuyện dài"
      ]
    },
    {
      "q": "Có người hô lên: “Chơi trò gì đi!” Bạn…",
      "choices": [
        "Đã chuẩn bị sẵn ba trò, kèm luôn luật chơi",
        "Gợi ý một trò mình rành và giúp chuẩn bị",
        "Chơi theo trò nào được chọn cũng được",
        "Nghĩ ra ngay một trò mới thật lầy"
      ]
    },
    {
      "q": "Nửa đêm rồi. Có người hô: “Đi tăng hai nào!” Bạn…",
      "choices": [
        "Cũng hấp dẫn đấy… nhưng chắc mình về thôi",
        "Về nhà, đồ ngủ, lên giường. Tối nay vậy là hoàn hảo rồi",
        "Đương nhiên! Mình đang đặt xe đây",
        "Được, thêm một tiếng nữa thôi"
      ]
    },
    {
      "q": "Đến giờ chụp ảnh tập thể! Bạn…",
      "choices": [
        "Để ý sao cho không ai bị lọt khỏi khung hình",
        "Gợi ý chỗ có ánh sáng đẹp hơn",
        "Chen vào đứng cạnh những người mình quý nhất",
        "Cầm máy, chỉ đạo tạo dáng và bấm liền hai mươi tấm"
      ]
    },
    {
      "q": "Đã khuya rồi. Khi nào bạn về?",
      "choices": [
        "Tầm giờ đã định, sớm muộn chút xíu",
        "Lúc nào thấy muốn về thì về",
        "Đã chốt giờ về từ trước khi đến, và làm đúng như vậy",
        "Chịu. Để xem đêm nay sẽ đi đến đâu"
      ]
    },
    {
      "q": "Sáng hôm sau, nhóm chat bắt đầu rộn ràng. Bạn…",
      "choices": [
        "Thả cả loạt ảnh, tin nhắn thoại và “Bao giờ quẩy tiếp?”",
        "Thả vài trái tim và mỉm cười xem ảnh",
        "Đăng tấm ảnh mình thích nhất kèm caption thật hài",
        "Lặng lẽ đọc hết mọi tin nhắn trong chăn"
      ]
    },
    {
      "q": "Một người bạn của bạn mà bạn chưa gặp bao giờ nhập hội. Bạn…",
      "choices": [
        "Chỉ cho họ chỗ có đồ ăn ngon nhất",
        "Kéo họ vào ngay trò chơi đang diễn ra",
        "Hỏi họ cả chục câu. Mình muốn nghe hết câu chuyện của họ",
        "Mỉm cười, giới thiệu bản thân và kéo họ vào cuộc trò chuyện"
      ]
    },
    {
      "q": "Đồ ăn giao trễ cả tiếng và ai cũng đói. Bạn…",
      "choices": [
        "Ứng biến: lấy đồ trong tủ lạnh nấu tạm món gì đó",
        "Không sao. Mình đã có sẵn phương án dự phòng",
        "Kiểm tra ứng dụng và gợi ý phương án khác",
        "Nhún vai và tiếp tục tán gẫu. Rồi đồ cũng tới"
      ]
    }
  ],
  "types": {
    "confidant": {
      "name": "Bạn tâm giao ấm áp",
      "word": "tâm giao",
      "vibe": "Bạn tìm được một người tuyệt vời, một góc êm ái và cuộc trò chuyện hay nhất đêm nay.",
      "keywords": ["Ấm áp", "Biết lắng nghe", "Chân thành"],
      "desc": "Khi tiếng nhạc ngày càng to, bạn thường ở một góc yên tĩnh hơn một chút, chìm trong cuộc trò chuyện mà chẳng ai muốn kết thúc. Bạn không đến để gây ấn tượng với cả đám đông. Bạn đến vì sự gắn kết thật sự, và mọi người cảm nhận được điều đó. Bạn bè kể cho bạn nghe những điều họ chưa từng nói ra, còn người mới quen rời góc của bạn với cảm giác được lắng nghe thật lòng. Bạn cứ để mọi thứ tự nhiên, nên những cuộc nói chuyện hay nhất thường đến bất ngờ. Bữa tiệc nào cũng cần một bến đỗ bình yên, và bến đỗ đó chính là bạn.",
      "traits": ["Khiến người khác thấy được lắng nghe", "Biến chuyện phiếm thành chuyện thật lòng", "Nhớ cả những chi tiết nhỏ", "Bình tĩnh giữa căn phòng đông đúc"],
      "tips": ["Chào một người mới ngay từ sớm, khi phòng còn yên tĩnh", "Ra ngoài hít thở một chút khi tiếng ồn trở nên quá nhiều"],
      "perfect": "Một bữa tối nhỏ có nến, đồ ăn ngon và vài người bạn thích nói chuyện đến khuya."
    },
    "earlybird": {
      "name": "Chú chim đúng giờ",
      "word": "chim đúng giờ",
      "vibe": "Bạn đến đúng giờ, tận hưởng từng phút và ra về đúng lúc vui nhất.",
      "keywords": ["Chu đáo", "Đáng tin cậy", "Cân bằng"],
      "desc": "Bạn biết rõ điều gì làm nên một buổi tối tuyệt vời cho mình, và bạn lên kế hoạch đúng như thế. Bạn có mặt đúng giờ đã hẹn, thường còn mang theo một món quà nhỏ cho chủ tiệc. Bạn dành thời gian cho những cuộc trò chuyện thật và những lời chào ấm áp, rồi ra về khi vẫn còn đang cười, sau khi tạm biệt từng người tử tế. Mọi người quý bạn vì bạn luôn có mặt và luôn vui vẻ. Bạn không bao giờ ở lại đến lúc cạn pin, nên bạn bè chẳng bao giờ gặp phiên bản cáu kỉnh của bạn.",
      "traits": ["Luôn đúng giờ", "Biết giới hạn của mình và tôn trọng nó", "Chào hỏi và tạm biệt thật ấm áp", "Khiến chủ tiệc thấy được trân trọng"],
      "tips": ["Báo trước cho bạn bè là mình về sớm để không ai lo", "Thỉnh thoảng, ở thêm một chút khi buổi tối thật đặc biệt"],
      "perfect": "Một buổi gặp mặt buổi chiều hay bữa tối sớm, kết thúc bằng những cái ôm vui vẻ và một giấc ngủ ngon."
    },
    "snack": {
      "name": "Trinh sát đồ ăn vặt",
      "word": "trinh sát",
      "vibe": "Bạn biết món ngon nằm ở đâu và lặng lẽ làm mọi bữa tiệc ngon miệng hơn một chút.",
      "keywords": ["Tò mò", "Dễ tính", "Vui tươi"],
      "desc": "Vừa đến nơi, bạn đã dò xong bàn đồ ăn, tìm ra món ngon nhất và đoán được chén nước chấm nào sẽ hết đầu tiên. Bạn tận hưởng bữa tiệc bằng mọi giác quan: đồ ăn, mùi thơm, tiếng nhạc nền và những dây đèn lấp lánh. Bạn không cần ánh đèn sân khấu, chỉ cần được đi loanh quanh, nếm thử và tán gẫu với bất kỳ ai đứng cạnh ở bàn buffet. Niềm vui thoải mái của bạn rất dễ lây, còn những gợi ý món ăn của bạn thì đã thành huyền thoại. Ai cũng muốn đứng cạnh bạn ở bàn đồ ăn.",
      "traits": ["Nhận ra những niềm vui nhỏ", "Ở cạnh thấy dễ chịu", "Mang không khí vui mà chẳng cần cố", "Luôn tìm ra món ngon nhất"],
      "tips": ["Mang theo một món tự làm. Đó là cách mở lời dễ nhất", "Dùng bàn đồ ăn làm chỗ làm quen với người mới"],
      "perfect": "Một bữa tiệc mỗi người góp một món, nhạc nhẹ và thật nhiều thời gian để nếm thử mọi thứ."
    },
    "memory": {
      "name": "Người giữ kỷ niệm",
      "word": "giữ kỷ niệm",
      "vibe": "Bạn ghi lại những khoảnh khắc đẹp nhất và biến một đêm vui thành ký ức ai cũng trân trọng.",
      "keywords": ["Tinh ý", "Sáng tạo", "Ngăn nắp"],
      "desc": "Bạn nhìn bữa tiệc hơi khác mọi người, như một câu chuyện đang dần mở ra. Bạn để ý khoảnh khắc ai đó cười chảy nước mắt, ánh sáng đẹp vừa đủ trên chiếc bánh kem và cái ôm tập thể lúc cuối buổi. Máy ảnh của bạn luôn sẵn sàng, và bạn biết chính xác lúc nào nên rủ mọi người chụp hình. Hôm sau, chính album bạn chia sẻ gọn gàng trong nhóm chat là thứ ai cũng lưu về. Có thể bạn không phải người ồn ào nhất phòng, nhưng bạn là lý do đêm ấy còn sống mãi.",
      "traits": ["Nhìn ra những khoảnh khắc đẹp", "Sáng tạo với từng chi tiết", "Giữ mọi thứ ngăn nắp", "Khiến ký ức được lưu lâu dài"],
      "tips": ["Đưa máy ảnh cho người khác để chính bạn cũng có mặt trong ảnh", "Cất điện thoại trong một bài hát và chỉ tận hưởng khoảnh khắc"],
      "perfect": "Một bữa tiệc theo chủ đề với đèn dây, góc chụp ảnh và album chung trong nhóm Messenger sáng hôm sau."
    },
    "spark": {
      "name": "Cây hài sôi nổi",
      "word": "cây hài",
      "vibe": "Bạn bước vào là cả phòng bừng sáng. Năng lượng của bạn khiến ai cũng bật cười.",
      "keywords": ["Tràn năng lượng", "Hài hước", "Ngẫu hứng"],
      "desc": "Bạn đến là bữa tiệc ồn ào hơn theo cách tuyệt vời nhất. Bạn nói chuyện với tất cả mọi người, cười rất dễ và kéo những vị khách nhút nhát vào cuộc vui mà không làm họ ngại. Bạn chẳng cần kế hoạch: chỉ cần một căn phòng đầy người là chuyện hay sẽ xảy ra. Những câu chuyện của bạn thành giai thoại, và tiếng cười của bạn vọng tới tận bếp. Có bạn bên cạnh, mọi người thấy mạnh dạn và thoải mái hơn, đó là một món quà hiếm có. Chỉ cần nhớ rằng có những vị khách nạp năng lượng theo cách yên tĩnh hơn.",
      "traits": ["Khiến mọi người bật cười", "Giúp khách nhút nhát thấy được chào đón", "Giữ năng lượng luôn cao", "Biến khoảnh khắc nào cũng thành cuộc vui"],
      "tips": ["Dành thời gian nói chuyện riêng với những người bạn trầm hơn", "Uống một ly nước lọc giữa các hiệp để giữ sức"],
      "perfect": "Một bữa tiệc sinh nhật thật to và ồn ào, đông bạn bè, nhiều nhạc và những câu chuyện bắt đầu bằng “Kể nghe nè, không tin nổi đâu…”"
    },
    "host": {
      "name": "Chủ nhà tận tâm",
      "word": "chủ nhà tận tâm",
      "vibe": "Bạn để ý ly nào cũng đầy và vị khách nào cũng thấy như ở nhà.",
      "keywords": ["Chu đáo", "Hiếu khách", "Tinh tế"],
      "desc": "Dù có phải tiệc của bạn hay không, bạn vẫn tự nhiên cư xử như người chủ tiệc. Bạn đón người mới đến, giới thiệu những người có thể hợp nhau và nhận ra khi có ai đang đứng một mình. Bạn chuẩn bị từ trước nên lúc nào cũng đủ ly, đủ ghế và đồ ăn ngon. Ai dự một buổi tụ họp có bạn cũng ra về với cảm giác được chào đón thật sự. Bạn vừa mang năng lượng đến, vừa chăm sóc mọi người. Hãy nhớ để chính mình cũng được vui, chứ không chỉ lo điều phối.",
      "traits": ["Khiến ai cũng thấy được chào đón", "Kết nối những người hợp nhau", "Nhận ra ai đang cần gì", "Lo cả những chi tiết không ai thấy"],
      "tips": ["Nhờ một người bạn trông tiệc thay mình nửa tiếng", "Tự ngồi xuống ăn một đĩa đồ ăn. Bạn xứng đáng mà"],
      "perfect": "Một buổi tiệc tại gia ấm cúng do chính bạn tổ chức, bàn đầy đồ ăn, playlist dễ chịu và bạn bè từ mọi giai đoạn cuộc đời."
    },
    "dj": {
      "name": "DJ bắt sóng",
      "word": "DJ",
      "vibe": "Bạn chọn nhạc nền, đọc vị cả phòng và biết chính xác lúc nào nên vặn to lên.",
      "keywords": ["Biểu cảm", "Táo bạo", "Bắt trend"],
      "desc": "Bạn cảm nhận tâm trạng của căn phòng như cảm nhận âm nhạc. Khi bữa tiệc chùng xuống, bạn là người đổi playlist, khởi xướng màn hát tập thể hoặc tắt bớt đèn để mọi người nhảy. Bạn không cần kế hoạch; bạn đi theo năng lượng và đẩy nó về đúng hướng. Mọi người thích việc bạn luôn biết bài nào hợp với khoảnh khắc nào. Bạn tỏa sáng nhất khi cả phòng đang chuyển động, và bạn có tài biến những đêm bình thường thành lễ hội.",
      "traits": ["Đọc vị không khí ngay lập tức", "Khuấy động bằng âm nhạc", "Táo bạo và giàu biểu cảm", "Biến buổi tối thành sự kiện"],
      "tips": ["Thỉnh thoảng nhận yêu cầu bài hát. Ai cũng thích nghe bài của mình", "Dành một bài chậm cho những người muốn trò chuyện"],
      "perfect": "Một bữa tiệc nhảy có dàn loa xịn, đèn đủ màu và bạn bè hát theo mọi điệp khúc, hoặc một đêm karaoke không ai chịu buông micro."
    },
    "captain": {
      "name": "Đội trưởng bữa tiệc",
      "word": "đội trưởng",
      "vibe": "Trò chơi, giờ giấc, phương án dự phòng: bạn giữ cho cả bữa tiệc chạy trơn tru.",
      "keywords": ["Có tổ chức", "Tràn năng lượng", "Công bằng"],
      "desc": "Bạn yêu những bữa tiệc vui và yêu cả việc làm cho chúng thành hiện thực. Bạn chốt ngày, lên kế hoạch trò chơi, giải thích luật và ghi điểm. Khi đồ ăn đến trễ, bạn đã có sẵn phương án dự phòng. Năng lượng của bạn rất cao, và bạn dồn nó vào việc khiến buổi tối vui cho tất cả mọi người. Bạn bè tin tưởng giao cho bạn những buổi tụ họp lớn, từ tiệc tất niên, liên hoan công ty đến chuyến đi sinh nhật. Hãy chừa chỗ cho một chút bất ngờ, vì nhiều khoảnh khắc đẹp nhất chẳng bao giờ nằm trong lịch trình.",
      "traits": ["Biến ý tưởng thành kế hoạch thật", "Giữ trò chơi công bằng và vui", "Bình tĩnh khi kế hoạch thay đổi", "Gắn kết mọi người lại với nhau"],
      "tips": ["Để một phần buổi tối hoàn toàn không có kế hoạch", "Chia việc nhỏ cho mọi người để chính bạn cũng được vui"],
      "perfect": "Một đêm chơi board game lớn có chia đội, có giải thưởng, lịch trình chuẩn từng phút, cộng thêm một bất ngờ bạn không hề lên kế hoạch."
    }
  }
};
