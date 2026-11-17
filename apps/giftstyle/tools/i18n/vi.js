/* Gift Giver Personality Test (vi) — Trắc nghiệm phong cách tặng quà
 * Same structure as en.js. questions[i].choices[j] keep the en order/side (scoring lives in giftstyle-core.js).
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
    "title": "Trắc nghiệm phong cách tặng quà – Bạn là kiểu người tặng quà nào?",
    "description": "Trắc nghiệm phong cách tặng quà: 12 tình huống tặng quà quen thuộc, 2 phút, không cần đăng ký. Từ sinh nhật, Tết đến Giáng sinh, khám phá phong cách tặng quà và điểm chuẩn bị quà của riêng bạn.",
    "ogTitle": "Trắc nghiệm phong cách tặng quà 🎁 Bạn là kiểu người tặng quà nào?",
    "ogDescription": "Mười hai khoảnh khắc tặng quà đời thường. Khám phá phong cách tặng quà và điểm chuẩn bị của riêng bạn. Trò chơi cho vui, không phải đánh giá lâm sàng."
  },
  "siteName": "Trắc nghiệm phong cách tặng quà",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🎁 Chơi vui mùa tặng quà",
    "h1Kicker": "Trắc nghiệm phong cách tặng quà",
    "h1Html": "Sinh nhật, Tết, Giáng sinh, trao đổi quà:<br>bạn là <em>người tặng quà</em> kiểu nào?",
    "hook": "Có người chọn xong món quà hoàn hảo từ mấy tháng trước. Có người lại xoay xở được một món quà tuyệt vời ngay trên đường tới bữa tiệc. Đi qua mười hai khoảnh khắc tặng quà quen thuộc để biết bạn thường thể hiện sự quan tâm với mọi người theo cách nào.",
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
    "text": "Đang mở hộp quà câu trả lời…",
    "sub": "Xem thời điểm chuẩn bị, điều bạn coi trọng và cách bạn chọn quà"
  },
  "result": {
    "title": "Phong cách tặng quà của tôi: {name}",
    "metaDesc": "Kết quả trắc nghiệm phong cách tặng quà: {name}. {vibe} Xem điểm mạnh, mẹo chọn quà, món quà đặc trưng, cặp bài trùng và kiểu đối lập của bạn.",
    "eyebrow": "Nói đến chuyện quà cáp, bạn là…",
    "gaugeTitle": "Thước đo chuẩn bị quà",
    "gaugeLow": "Tùy hứng",
    "gaugeHigh": "Chuẩn bị sớm",
    "gaugeNote": "Chỉ tính từ chính câu trả lời của bạn về sinh nhật, sắm quà cuối năm, gói quà và những lần tìm được quà sớm. Không so sánh với bất kỳ ai.",
    "scoreFmt": "{n}",
    "bandLow": "Bạn tỏa sáng vào phút chót: ý tưởng hay thường đến đúng lúc bạn cần.",
    "bandMid": "Có món bạn lên kế hoạch, có món bạn ứng biến, tùy người và tùy dịp.",
    "bandHigh": "Bạn thích sẵn sàng từ sớm: đến ngày, món quà đã nằm chờ sẵn.",
    "traitsLabel": "Điểm mạnh khi tặng quà",
    "tipsLabel": "Mẹo tặng quà cho bạn",
    "perfectLabel": "Món quà đặc trưng của bạn",
    "bestLabel": "Cặp bài trùng",
    "rivalLabel": "Kiểu đối lập",
    "disclaimer": "Chỉ để cho vui thôi! Bài trắc nghiệm này để cho vui, không phải đánh giá lâm sàng hay bài kiểm tra tâm lý. Nó chỉ nhìn vào vài thói quen tặng quà và không thể nói bạn là người như thế nào. Kiểu tặng quà nào cũng xuất phát từ tấm lòng.",
    "sameShare": "{pct}% người chơi có kết quả này",
    "shareText": "Phong cách tặng quà của tôi là {name} {emoji} “{vibe}” Còn bạn là kiểu người tặng quà nào?",
    "ctaStrong": "Bạn của bạn vừa chia sẻ phong cách tặng quà",
    "ctaSub": "Bạn là kiểu người tặng quà nào? Biết ngay trong 2 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Phong cách tặng quà của tôi",
    "brand": "🎁 Trắc nghiệm phong cách tặng quà",
    "defaultKicker": "Chơi vui mùa tặng quà",
    "defaultTitle": "Bạn là kiểu người tặng quà nào?",
    "defaultDesc": "12 khoảnh khắc tặng quà · 2 phút · điểm chuẩn bị của riêng bạn"
  },
  "faq": [
    {
      "q": "Trắc nghiệm phong cách tặng quà này xem xét điều gì?",
      "a": "Ba thói quen khi tặng quà: bạn thường chuẩn bị quà vào lúc nào, bạn nghiêng về món đồ hữu ích hay món quà ý nghĩa, và bạn thích tạo bất ngờ hay muốn hỏi trước."
    },
    {
      "q": "Kết quả của tôi được chọn như thế nào?",
      "a": "Mỗi tình huống xem xét một trong ba thói quen đó. Kết hợp cả ba sẽ ra phong cách tặng quà của bạn, và cùng một cách trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Điểm chuẩn bị quà của tôi đến từ đâu?",
      "a": "Điểm này chỉ tính từ chính câu trả lời của bạn ở các câu hỏi về thời điểm. Câu trả lời chuẩn bị từ sớm làm điểm tăng, câu trả lời quyết định ngay lúc đó làm điểm giảm. Không so sánh với bất kỳ ai."
    },
    {
      "q": "Mua quà vào phút chót có phải là không tốt?",
      "a": "Hoàn toàn không. Nhiều món quà tinh tế nhất lại đến từ một tia cảm hứng bất chợt. Kiểu tặng quà nào cũng có điểm mạnh riêng, và tấm lòng phía sau món quà quan trọng hơn ngày in trên hóa đơn."
    },
    {
      "q": "Đây có phải là đánh giá lâm sàng hay tâm lý không?",
      "a": "Không. Bài trắc nghiệm này để cho vui, không phải đánh giá lâm sàng hay bài kiểm tra tâm lý. Câu trả lời của bạn được tính ngay trong trình duyệt và không được lưu lại; chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm phong cách tặng quà",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm phong cách tặng quà — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm phong cách tặng quà (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi lên hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho biết mỗi kết quả phổ biến đến đâu."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ (local storage) của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phát quảng cáo dựa trên những lần bạn truy cập trang này và các trang web khác trước đó. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu tổng số liệu ẩn danh theo ngày (lượt xem trang, lượt hoàn thành bài trắc nghiệm, lượt đánh giá) để cải thiện Dịch vụ. Những con số này không thể nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ với người quản lý trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 18 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm phong cách tặng quà"
  },
  "questions": [
    {
      "q": "Còn ba tuần nữa là sinh nhật bạn thân. Bạn sẽ…",
      "choices": [
        "Quên béng cho đến hôm trước, rồi vẫn kiếm được món quà xịn",
        "Đặt lời nhắc để tuần sau bắt đầu tìm quà",
        "Có quà rồi. Mình nghĩ ra ý tưởng từ mấy tháng trước",
        "Thỉnh thoảng nghĩ tới, khi nào thấy đúng thì quyết"
      ]
    },
    {
      "q": "Lần này ngân sách mua quà khá eo hẹp. Bạn dành nó cho…",
      "choices": [
        "Một món nhỏ gợi lại câu đùa chỉ hai đứa mới hiểu",
        "Một món họ sẽ dùng mỗi ngày",
        "Phiên bản xịn hơn của món họ đang dùng",
        "Một món ăn vặt nhỏ kèm tấm thiệp viết tay thật dài"
      ]
    },
    {
      "q": "Trao đổi quà bí mật cuối năm ở công ty: bạn bốc trúng tên một người gần như không quen. Bạn…",
      "choices": [
        "Lặng lẽ tìm manh mối trên bàn làm việc và mạng xã hội của họ",
        "Hỏi thẳng họ muốn gì. Đoán làm chi cho mệt?",
        "Tin vào trực giác. Bất ngờ mới là một nửa niềm vui",
        "Hỏi một đồng nghiệp thân với họ xem họ thích gì"
      ]
    },
    {
      "q": "Bạn thường bắt đầu sắm quà Tết và Giáng sinh từ khi nào?",
      "choices": [
        "Đầu tháng Mười Hai, với một danh sách sơ sơ",
        "Cuối tuần cuối cùng trước lễ. Cảnh chen chúc cũng là truyền thống",
        "Bất cứ khi nào tình cờ đi ngang một cửa hàng xinh",
        "Từ mùa thu. Mình ghi danh sách quà quanh năm"
      ]
    },
    {
      "q": "Quà tự làm hay quà mua sẵn?",
      "choices": [
        "Mua sẵn, nhưng phải tốt và dùng được lâu",
        "Tự làm, lần nào cũng vậy, dù hơi méo mó một chút",
        "Mua sẵn, nhưng khắc tên hoặc in ảnh riêng",
        "Mua sẵn. Hữu ích hơn dễ thương"
      ]
    },
    {
      "q": "Có người bảo bạn: “Thôi, đừng mua gì cho mình nha!” Bạn…",
      "choices": [
        "Hỏi thẳng: “Được, nhưng nếu phải chọn một thứ thì sao?”",
        "Gợi ý hai ba ý tưởng nhỏ rồi để họ chọn",
        "Vẫn mang theo một món nhỏ, phòng khi cần",
        "Cười gật đầu, rồi bí mật lên kế hoạch bất ngờ"
      ]
    },
    {
      "q": "Bạn gói quà vào lúc nào?",
      "choices": [
        "Tối hôm trước, với bất kỳ tờ giấy nào tìm được",
        "Trên xe, năm phút trước khi tới nơi. Túi quà sinh ra là để vậy",
        "Trước mấy tuần, ruy băng đồng bộ và thiệp đã viết sẵn",
        "Trước vài ngày, cho khỏi căng thẳng"
      ]
    },
    {
      "q": "Bạn cần quà cho một đồng nghiệp không thân lắm. Bạn chọn…",
      "choices": [
        "Một chiếc cốc đẹp hoặc món đồ tiện dụng để trên bàn",
        "Đặc sản quê nhà kèm một lời cảm ơn ngắn",
        "Một thẻ quà tặng để họ tự chọn thứ mình cần",
        "Một món gắn với câu chuyện họ từng kể lúc ăn trưa"
      ]
    },
    {
      "q": "Bạn mở một món quà không mấy ưng ý. Trong đầu bạn nghĩ…",
      "choices": [
        "Lần sau chắc phải bóng gió vài câu",
        "Quan trọng là tấm lòng, thật đấy",
        "Chính vì vậy mà mình luôn có wishlist",
        "Bất ngờ mới là phần hay nhất, kể cả khi trật"
      ]
    },
    {
      "q": "Giữa mùa hè, bạn thấy món quà hoàn hảo cho một người sinh nhật vào mùa đông. Bạn…",
      "choices": [
        "Mua ngay rồi giấu vào ngăn kéo đựng quà",
        "Chụp ảnh lại, rồi chắc là quên luôn",
        "Lưu đường link vào ghi chú để dùng sau",
        "Đi tiếp. Mình của mùa đông sẽ lo"
      ]
    },
    {
      "q": "Món quà tuyệt nhất ai đó có thể tặng bạn là…",
      "choices": [
        "Một ngày đi chơi cùng nhau, như xem hòa nhạc hay một chuyến đi ngắn",
        "Một lá thư hay cuốn album ảnh khiến mình rơi nước mắt",
        "Món đồ công nghệ mình cần mà chẳng bao giờ tự mua",
        "Một món ấm áp, êm ái để dùng suốt mùa lạnh"
      ]
    },
    {
      "q": "Đến lúc trao quà rồi. Bạn trao thế nào?",
      "choices": [
        "Giấu đi rồi bày một trò truy tìm kho báu nho nhỏ",
        "Không bí mật gì cả: hai đứa đã cùng nhau chọn",
        "Kèm hóa đơn và câu “Không thích thì cứ đổi nhé”",
        "Để trên bàn họ cùng một mẩu giấy bí ẩn"
      ]
    }
  ],
  "types": {
    "quickfind": {
      "name": "Người hùng chớp nhoáng",
      "word": "người hùng chớp nhoáng, người hùng",
      "vibe": "Chỉ cần mười phút và một cửa hàng, bạn sẽ bước ra với đúng thứ họ thật sự cần.",
      "keywords": ["Nhanh trí", "Bình tĩnh khi gấp", "Thực tế"],
      "desc": "Bạn không tin vào chuyện căng thẳng vì quà cáp trước cả mấy tuần. Khi thời khắc đến, trực giác của bạn bật lên: bạn biết người đó hay dùng gì, cuộc sống của họ đang thiếu gì và tìm ở đâu cho nhanh. Sự bất ngờ là thật, vì chính bạn cũng không biết mình sẽ mang gì tới cho đến khi nhìn thấy nó. Bạn bè lúc nào cũng ngạc nhiên vì những quyết định chớp nhoáng của bạn lại trúng đến vậy. Bạn chứng minh rằng món quà hay đến từ sự để ý, chứ không phải từ tờ lịch.",
      "traits": ["Quyết nhanh mà vẫn chuẩn", "Nhận ra điều người khác thật sự cần", "Vẫn thong thả khi thời gian gấp", "Yêu những bất ngờ thật lòng"],
      "tips": ["Ghi lại trong điện thoại những ý tưởng nghe được trong năm", "Thêm một chút dấu ấn riêng, như một dòng viết tay, cho món quà tìm vội"],
      "perfect": "Một chiếc ô thật tốt, trao kèm nụ cười vào đúng ngày mưa, đúng lúc họ cần nhất."
    },
    "helper": {
      "name": "Bạn thân thực tế",
      "word": "bạn thân thực tế",
      "vibe": "Đoán làm gì? Bạn chỉ cần hỏi điều gì giúp được họ, rồi lo liệu nhanh gọn và chu đáo.",
      "keywords": ["Thẳng thắn", "Hay giúp đỡ", "Dễ tính"],
      "desc": "Với bạn, món quà là cách làm cuộc sống của ai đó dễ dàng hơn một chút. Bạn không ngại hỏi người ta cần gì, và mọi người thích vì chẳng bao giờ phải đoán già đoán non ngượng ngùng. Bạn không lên kế hoạch trước hàng tuần, nhưng hễ nghe ai kể ấm đun nước hỏng hay chiếc túi đã sờn, bạn ra tay ngay. Quà của bạn được dùng mỗi ngày, và đó là lời khen tuyệt nhất. Bạn bè biết rằng ở bên bạn, sự tử tế đến mà không cần màu mè.",
      "traits": ["Hỏi thay vì đoán", "Quà của bạn được dùng mỗi ngày", "Khiến việc tặng quà trở nên nhẹ nhàng", "Hành động nhanh khi ai đó cần giúp"],
      "tips": ["Gói món quà hữu ích theo cách thật vui để vẫn có không khí lễ hội", "Thỉnh thoảng kèm một bất ngờ nhỏ bên cạnh món họ đã xin"],
      "perfect": "Đúng chiếc tai nghe họ nhắc tới tuần trước, trao tận tay kèm nụ cười, không cần đoán."
    },
    "moment": {
      "name": "Nhà tạo khoảnh khắc",
      "word": "nhà tạo khoảnh khắc, tạo khoảnh khắc",
      "vibe": "Bạn biến một ngày bình thường thành một câu chuyện, thường từ ý tưởng vừa nảy ra ngay sáng hôm đó.",
      "keywords": ["Ngẫu hứng", "Ấm áp", "Tinh nghịch"],
      "desc": "Quà của bạn hiếm khi là đồ vật. Đó là những khoảnh khắc: một buổi picnic bất ngờ, một bài hát tự thu âm, một chuyến đi ngẫu hứng về nơi hai người gặp nhau lần đầu. Bạn đi theo trái tim và cảm hứng, và thích nhìn gương mặt ai đó bừng sáng khi nhận ra bạn đã làm gì. Bạn không cần kế hoạch dài dòng, vì ý tưởng hay nhất của bạn đến như những tia lửa. Người ta nhớ quà của bạn suốt nhiều năm, không phải vì chúng đắt tiền mà vì chúng sống động.",
      "traits": ["Biến ngày thường thành kỷ niệm", "Đi theo cảm hứng", "Khiến người khác thấy mình đặc biệt", "Mang lại niềm vui mà không cần kịch bản"],
      "tips": ["Ghi lại ý tưởng lóe lên để một tuần bận rộn không cuốn mất", "Chụp một tấm ảnh khoảnh khắc ấy để kỷ niệm còn mãi"],
      "perfect": "Một buổi picnic bất ngờ trong công viên với món ăn vặt họ thích và danh sách nhạc chung của hai người."
    },
    "together": {
      "name": "Người lan tỏa niềm vui",
      "word": "người lan tỏa niềm vui, lan tỏa niềm vui",
      "vibe": "Món quà tuyệt nhất là thời gian bên nhau, nên bạn hỏi họ thích gì rồi biến nó thành chuyến phiêu lưu chung.",
      "keywords": ["Hòa đồng", "Chu đáo", "Rộng rãi"],
      "desc": "Với bạn, món quà hay nhất là món được cùng nhau tận hưởng. Thay vì một chiếc hộp, bạn tặng một kế hoạch: buổi hòa nhạc họ từng nhắc tới, nhà hàng mới mở, một buổi chiều làm đúng điều họ thích. Bạn thích hỏi điều gì khiến họ vui, nên trải nghiệm ấy thật sự hợp với họ. Bạn không cần lên kế hoạch trước hàng tuần, và sẵn lòng cùng quyết định ngay trong ngày. Ở bên bạn, người ta thấy mình được quan tâm và được chúc mừng, và quà của bạn thường kết thúc bằng tiếng cười cùng một câu chuyện để kể lại.",
      "traits": ["Biến quà thành thời gian bên nhau", "Hỏi điều gì thật sự làm người khác vui", "Hào phóng với thời gian của mình", "Khiến buổi ăn mừng là của tất cả mọi người"],
      "tips": ["Tặng thêm một tấm thiệp hay món nhỏ trong ngày để kế hoạch thêm chân thật", "Đặt sớm những thứ hot, phần còn lại quyết sau cũng được"],
      "perfect": "Hai vé xem buổi diễn họ nhắc tới suốt mấy tháng, kèm bữa tối sau đó."
    },
    "detective": {
      "name": "Thám tử quà tặng",
      "word": "thám tử quà tặng, thám tử",
      "vibe": "Bạn gom từng manh mối nhỏ suốt cả năm rồi tung ra món quà hữu ích bất ngờ khi chẳng ai ngờ tới.",
      "keywords": ["Tinh ý", "Kiên nhẫn", "Lanh lợi"],
      "desc": "Bạn lắng nghe rất kỹ. Khi một người bạn than chiếc máy xay cà phê chậm rì từ đầu năm, bạn vẫn nhớ đến tận cuối năm. Bạn ghi chú, so sánh lựa chọn và tìm đúng phiên bản phù hợp nhất của thứ họ cần. Rồi bạn giữ bí mật cho đến ngày quan trọng. Quà của bạn vừa hữu ích vừa bất ngờ, một sự kết hợp hiếm có. Người ta hay hỏi sao bạn biết, và câu trả lời thật lòng là bạn đã để ý từ đầu đến cuối.",
      "traits": ["Nhớ những chi tiết nhỏ", "Tìm ra phiên bản tốt nhất của mọi thứ", "Giữ bí mật rất giỏi", "Lên kế hoạch mà không ai hay"],
      "tips": ["Chia sẻ danh sách manh mối với người yêu hay bạn thân để ý tưởng không bị thất lạc", "Chừa chỗ cho chút tình cảm, như một mẩu ghi chú ngắn"],
      "perfect": "Đúng món đồ bếp họ từng than thở mấy tháng trước, gói gọn gàng và để dành cho ngày sinh nhật."
    },
    "wishlist": {
      "name": "Phù thủy wishlist",
      "word": "phù thủy wishlist, phù thủy",
      "vibe": "Danh sách, đường link và thời điểm chuẩn xác: ai cũng nhận đúng thứ mình mong, đúng hẹn.",
      "keywords": ["Ngăn nắp", "Đáng tin cậy", "Công bằng"],
      "desc": "Bạn là lý do những buổi trao đổi quà cuối năm diễn ra suôn sẻ. Bạn xin wishlist từ sớm, nhớ size và màu sắc, và đặt hàng trước khi cửa hàng đông nghẹt. Không món nào bị trả lại, không ai nhận hai món giống nhau và ngân sách vẫn nằm gọn trong kế hoạch. Có người bảo như vậy chẳng lãng mạn, nhưng ai cũng thích nhận đúng thứ mình muốn. Quà của bạn nói rằng: mình đã lắng nghe, mình đã nhớ và mình đã lo để nó tới đúng lúc.",
      "traits": ["Khiến việc trao đổi quà thật dễ dàng", "Nhớ size và sở thích của mọi người", "Giữ ngân sách đâu ra đấy", "Luôn sẵn sàng đúng hẹn"],
      "tips": ["Thêm một món ngoài danh sách, chỉ để ngắm vẻ bất ngờ của họ", "Giúp bạn bè lập danh sách riêng, ai cũng sẽ nhẹ nhõm hơn"],
      "perfect": "Mọi món trong wishlist, gói xong xuôi trước cả tuần, kèm hóa đơn đổi hàng kẹp bên trong."
    },
    "crafter": {
      "name": "Nghệ nhân tận tâm",
      "word": "nghệ nhân tận tâm, nghệ nhân",
      "vibe": "Hàng tuần lặng lẽ làm việc để tạo nên món quà độc nhất mà không ai khác có thể tặng.",
      "keywords": ["Sáng tạo", "Tận tụy", "Giàu tình cảm"],
      "desc": "Bạn tin rằng món quà quý nhất là món được làm ra, không phải mua về. Một chiếc khăn len tự đan, một cuốn album tự đóng, một hộp công thức nấu ăn viết tay: bạn bắt đầu từ sớm và dành thật nhiều giờ cho từng món. Bạn thích giữ bí mật và tưởng tượng khoảnh khắc nó được mở ra. Quà của bạn chứa đầy kỷ niệm và những câu đùa chỉ hai người hiểu. Chúng hiếm khi nằm trong ngăn kéo, mà ở trên tường, trên kệ hay quàng quanh cổ ai đó suốt nhiều năm.",
      "traits": ["Làm ra những món bền lâu", "Đặt cả trái tim vào từng chi tiết", "Bắt đầu sớm và luôn kiên nhẫn", "Biến kỷ niệm thành đồ vật"],
      "tips": ["Bắt đầu với dự án đơn giản để mùa bận rộn không gây áp lực", "Khi thời gian gấp, một tấm thiệp tự làm ngắn gọn là đủ"],
      "perfect": "Một cuốn album tự làm đầy ắp kỷ niệm chung, mỗi tấm ảnh đều có dòng ghi chú nhỏ bên cạnh."
    },
    "curator": {
      "name": "Nhà thiết kế trải nghiệm",
      "word": "nhà thiết kế trải nghiệm, thiết kế trải nghiệm",
      "vibe": "Bạn hỏi, lên kế hoạch và đặt trước mọi thứ, nên buổi ăn mừng trông thật nhẹ nhàng và vừa vặn với họ.",
      "keywords": ["Chu đáo", "Ngăn nắp", "Biết quan tâm"],
      "desc": "Bạn tin rằng món quà tuyệt nhất là trải nghiệm hợp với người đó một cách hoàn hảo. Bạn hỏi họ luôn muốn thử điều gì, rồi lặng lẽ lo hết mọi thứ: vé, đặt chỗ, thời gian và những điều nhỏ xinh đi kèm. Không gì bị phó mặc cho may rủi, vậy mà ngày hôm đó vẫn thật thư thái và vui vẻ. Mọi người thích cách bạn trân trọng mong muốn của họ và biến chúng thành kỷ niệm thật. Ở bên bạn, một ngày sinh nhật trở thành sự kiện bạn bè còn nhắc mãi về sau.",
      "traits": ["Biến mong muốn thành kế hoạch thật", "Nghĩ tới từng chi tiết nhỏ", "Khiến người khác thấy được chăm chút", "Tạo nên những buổi ăn mừng đáng nhớ"],
      "tips": ["Chừa một giờ trống trong kế hoạch cho niềm vui ngẫu hứng", "Để nhân vật chính tự chọn một phần trong ngày"],
      "perfect": "Chuyến đi cuối tuần họ hằng mơ ước, lên kế hoạch đến từng chi tiết, ghé quán cà phê yêu thích trên đường."
    }
  }
};
