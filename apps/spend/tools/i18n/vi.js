/* Spending Personality Test (vi)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trắc nghiệm tính cách chi tiêu: bạn là người nào?",
    "description": "Trắc nghiệm tính cách chi tiêu: 12 tình huống đời thường, 2 phút, không cần đăng ký. Bạn tiết kiệm hay tiêu xài? Chỉ để vui, không phải tư vấn tài chính.",
    "ogTitle": "Trắc nghiệm chi tiêu 💸 Bạn là người tiết kiệm hay tiêu xài?",
    "ogDescription": "12 tình huống tiền bạc đời thường, 2 phút. Bạn thuộc kiểu nào?"
  },
  "siteName": "Trắc nghiệm chi tiêu",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "💸 Chỉ để vui",
    "h1Kicker": "Trắc nghiệm tính cách chi tiêu",
    "h1Html": "Bạn là kiểu người<br><em>chi tiêu</em> nào?",
    "hook": "Ngày nhận lương, đợt khuyến mãi, bữa tụ tập bạn bè và những khoản đăng ký bất ngờ. Trả lời thật lòng 12 tình huống tiền bạc quen thuộc để gặp phong cách chi tiêu của chính mình.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "🛍️ 12 tình huống",
    "start": "Xem phong cách →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang đếm từng đồng…",
    "sub": "Đọc hóa đơn của bạn, chỉ để vui thôi"
  },
  "result": {
    "title": "Phong cách chi tiêu của tôi: {name}",
    "metaDesc": "Kết quả trắc nghiệm tính cách chi tiêu: {name}. {vibe}",
    "eyebrow": "Phong cách chi tiêu của bạn là",
    "gaugeLabel": "Câu trả lời của bạn theo từng kiểu",
    "axes": [
      "Tiết kiệm",
      "Săn giá hời",
      "Xài sang",
      "Chốt đơn vội"
    ],
    "strengthsLabel": "Điểm mạnh về tiền bạc",
    "weaknessLabel": "Cần để ý",
    "tipLabel": "Gợi ý vui",
    "disclaimer": "Chỉ mang tính giải trí. Đây không phải tư vấn tài chính.",
    "sameShare": "{pct}% người ra kết quả này",
    "shareText": "Phong cách chi tiêu của mình: {name} {emoji} “{vibe}” Còn bạn thì sao?",
    "shareTextPct": "Phong cách chi tiêu của mình: {name} {emoji} (Tiết kiệm {s}% · Săn giá hời {v}% · Xài sang {f}% · Chốt đơn vội {i}%) Còn bạn thì sao?",
    "ctaStrong": "Một người bạn vừa chia sẻ phong cách chi tiêu của họ",
    "ctaSub": "Tiết kiệm hay xài sang? Biết ngay sau 2 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Phong cách chi tiêu của tôi",
    "brand": "💸 Trắc nghiệm chi tiêu",
    "defaultKicker": "Trắc nghiệm tính cách chi tiêu",
    "defaultTitle": "Bạn là kiểu người chi tiêu nào?",
    "defaultDesc": "12 tình huống tiền bạc đời thường · 2 phút"
  },
  "faq": [
    {
      "q": "Phong cách chi tiêu của tôi được xác định thế nào?",
      "a": "Mỗi câu trả lời nghiêng về một trong bốn thói quen tiền bạc: tiết kiệm, săn giá hời, tự thưởng cho mình hoặc mua theo cảm hứng. Kết quả phụ thuộc vào thói quen bạn chọn nhiều nhất và mức độ chênh lệch giữa chúng. Cùng một bộ câu trả lời sẽ luôn cho cùng một kết quả."
    },
    {
      "q": "Đây có phải tư vấn tài chính không?",
      "a": "Không. Đây chỉ là bài trắc nghiệm tính cách nhẹ nhàng làm để giải trí. Nó không nói gì về tình hình tài chính thật của bạn và không nên dùng để đưa ra quyết định về tiền. Với những câu hỏi tài chính thật, hãy hỏi chuyên gia có chuyên môn."
    },
    {
      "q": "Có phong cách chi tiêu nào tốt hay xấu không?",
      "a": "Không. Kiểu nào cũng có điểm mạnh và điểm mù, và hầu hết mọi người là sự pha trộn của nhiều kiểu. Câu trả lời của bạn cũng thay đổi theo tâm trạng, ngân sách và giai đoạn cuộc sống, nên hôm khác bạn cứ làm lại nhé."
    },
    {
      "q": "Câu trả lời của tôi có được lưu lại không?",
      "a": "Không. Câu trả lời được tính ngay trong trình duyệt của bạn và không bao giờ được lưu. Chúng tôi chỉ đếm ẩn danh xem kết quả nào xuất hiện để cho bạn biết mỗi kiểu phổ biến đến đâu."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm chi tiêu",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm chi tiêu — cách chúng tôi dùng cookie, quảng cáo và số liệu thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm chi tiêu (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời và tỉ lệ các phong cách của bạn được tính ngay trong trình duyệt và không bao giờ được gửi đến hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh xem kết quả nào xuất hiện để cho biết mỗi kết quả phổ biến đến đâu."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong phần cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên những lần bạn đã truy cập trang này và các trang web khác. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Số liệu thống kê",
        "Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, lượt hoàn thành bài test, lượt đánh giá) để cải thiện Dịch vụ. Những con số tổng này không nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ đơn vị vận hành trang web."
      ],
      [
        "6. Ngày có hiệu lực",
        "Chính sách này có hiệu lực từ ngày 18 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm chi tiêu"
  },
  "questions": [
    {
      "q": "Lương vừa về tài khoản. Việc đầu tiên bạn làm là gì?",
      "choices": [
        "Đặt món mình đã để mắt từ lâu",
        "Chuyển ngay một khoản kha khá vào sổ tiết kiệm",
        "Mở app mua sắm: “mình xứng đáng mà”",
        "Xem hóa đơn và các khoản đăng ký sắp đến hạn, rồi tính phần còn lại"
      ]
    },
    {
      "q": "Bạn bè rủ đi một quán đang hot, giá hơi chát.",
      "choices": [
        "Đề nghị quán rẻ hơn hoặc nấu ở nhà cho tiện",
        "Tuyệt! Mình gọi đúng món mình thích",
        "Xem đánh giá và combo để chọn phần hời nhất",
        "Chốt luôn, tiền nong tính sau"
      ]
    },
    {
      "q": "Tai nghe của bạn cuối cùng cũng hỏng, cần mua cái mới.",
      "choices": [
        "So sánh đánh giá và lịch sử giá suốt mấy tuần",
        "Mua luôn cái quảng cáo vừa hiện ra. Xong trong một phút",
        "Cố dùng thêm được càng lâu càng tốt, rồi mua cái rẻ mà ổn",
        "Chọn mẫu xịn nhất, nghe đã tai và dùng bền"
      ]
    },
    {
      "q": "Cửa hàng yêu thích của bạn đang xả hàng giảm giá lớn.",
      "choices": [
        "Giỏ hàng đầy trước khi kịp nghĩ",
        "Chỉ mua những món đã có trong danh sách",
        "Rước món cao cấp mà giờ mới vừa túi tiền",
        "Đi ngang qua thôi. Rẻ mà không cần thì cũng là đắt"
      ]
    },
    {
      "q": "Gói dùng thử miễn phí sắp chuyển sang tính tiền.",
      "choices": [
        "Mình hủy ngay hôm đăng ký rồi",
        "Giữ lại. Dịch vụ tốt thì đáng trả tiền",
        "Đặt nhắc lịch rồi cân nhắc có đáng không",
        "Quên mất, giờ đang trả tiền cho cả mấy cái"
      ]
    },
    {
      "q": "Giờ nghỉ uống cà phê giữa buổi làm.",
      "choices": [
        "Món đặc trưng của quán quen, không tiếc",
        "Cà phê pha ở nhà, mang bình riêng",
        "Một ly cà phê, một cái bánh và cái cốc xinh xinh cạnh quầy",
        "Quán có mã giảm giá và thẻ tích điểm ngon nhất"
      ]
    },
    {
      "q": "Hóa đơn bữa ăn nhóm được mang ra.",
      "choices": [
        "Hứng lên trả hết cho cả bàn, rồi tự hỏi tiền đâu mất",
        "Dùng app chia tiền cho nhanh và công bằng",
        "Mình bao một lượt đồ uống, rồi gọi thêm món tráng miệng",
        "Mình trả đúng phần mình ăn, chia tới từng đồng lẻ"
      ]
    },
    {
      "q": "Thu ngân mời mua thêm một món nhỏ lúc thanh toán.",
      "choices": [
        "Chỉ khi giá mua kèm thật sự có lợi",
        "Mua luôn, thêm cả gói kẹo ở quầy",
        "“Không, cảm ơn.” Khỏi cần nghĩ",
        "Ừ. Những thứ nhỏ xinh làm ngày vui hơn"
      ]
    },
    {
      "q": "Bạn đang lên kế hoạch cho chuyến du lịch.",
      "choices": [
        "Bảng tính và các trang so sánh để chọn lựa chọn hời nhất",
        "Tối nay đặt vé máy bay luôn vì thấy giá đẹp",
        "Đi trái mùa, ở chỗ giá mềm, chơi những chỗ miễn phí",
        "Một khách sạn thật đẹp. Chuyến đi là phần thưởng của mình"
      ]
    },
    {
      "q": "Cuối tháng bạn mở app ngân hàng.",
      "choices": [
        "Khoan, tiền đi đâu hết rồi?",
        "Mình xếp mọi khoản vào nhóm rồi chỉnh lại cho tháng sau",
        "Mình biết tiền đi đâu và thấy xứng đáng",
        "Số dư khá đầy và mình thầm tự hào"
      ]
    },
    {
      "q": "Bạn bắt đầu một sở thích mới.",
      "choices": [
        "Mua hẳn đồ chuyên nghiệp. Đã làm là làm cho ra trò",
        "Mượn đồ và học qua video miễn phí",
        "Đồ nghề, sách, lớp học và cả bộ đồ xinh, tất cả trong tuần đầu",
        "Mua bộ cho người mới được đánh giá tốt nhất"
      ]
    },
    {
      "q": "Câu nào giống bạn nhất?",
      "choices": [
        "“Tích tiểu thành đại”",
        "“Sống chỉ một lần thôi”",
        "“Sao phải trả nhiều hơn cho cùng một thứ?”",
        "“Lúc đó thấy hợp nên mua thôi”"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Chiến thần dè sẻn",
      "word": "dè sẻn",
      "vibe": "Mỗi đồng tiền đều có nhiệm vụ, và tiền của bạn luôn có mặt đúng giờ.",
      "desc": "Bạn thích biết tiền của mình đang ở đâu và để làm gì. Bạn mang cơm đi làm mà chẳng than phiền, để ý những khoản rò rỉ nhỏ và thầm vui mỗi khi con số trong tài khoản nhích lên. Bạn bè tìm đến bạn khi muốn biết một món có thật sự đáng mua không, và bạn trả lời rất thẳng thắn. Những thói quen điềm tĩnh, đều đặn của bạn khiến tương lai bớt đáng sợ.",
      "strengths": [
        "Kiên nhẫn và kỷ luật",
        "Nhìn ra lãng phí rất nhanh",
        "Bình tĩnh về tương lai"
      ],
      "weakness": "Bạn có thể từ chối những điều lẽ ra khiến mình thật sự vui, rồi thấy hơi lạc lõng.",
      "tip": "Mỗi tháng hãy chọn một món tự thưởng nhỏ, hưởng thụ không chút áy náy. Tận hưởng cũng là một phần của kế hoạch."
    },
    "value": {
      "name": "Thám tử săn deal",
      "word": "thám tử",
      "vibe": "Tìm hiểu trước, mua sau.",
      "desc": "Bạn tìm hiểu kỹ trước khi mua: đọc đánh giá, xem lịch sử giá, mở thêm tab này, ghé thêm cửa hàng kia. Tìm ra món hời giống như giải xong một câu đố nhỏ, và bạn thích chia sẻ lời giải. Bạn không keo kiệt, chỉ là dị ứng với việc trả giá cao. Mọi người tin lời giới thiệu của bạn vì bạn đã làm bài tập về nhà rồi.",
      "strengths": [
        "Tìm hiểu rất giỏi",
        "So sánh bình tĩnh",
        "Hay chia sẻ món hời hữu ích"
      ],
      "weakness": "So sánh đôi khi mất nhiều thời gian hơn giá trị món đồ, và bạn thỉnh thoảng bỏ lỡ đúng lúc.",
      "tip": "Đặt giới hạn thời gian cho việc tìm hiểu. Món hời nhất cũng là món bạn thật sự thích dùng."
    },
    "flex": {
      "name": "Nhân vật chính hào phóng",
      "word": "hào phóng",
      "vibe": "Coi ngày thường như một buổi ra mắt.",
      "desc": "Bạn tin rằng khoảnh khắc đẹp xứng đáng với những điều đẹp: bữa tối ngon, tấm vé buổi diễn, món quà khiến ai đó òa lên. Bạn chi có chủ ý và không áy náy nhiều, sự hào phóng của bạn có sức lan tỏa. Bạn bè thích ở cạnh bạn vì bạn biến những buổi tối bình thường thành dịp đặc biệt. Bạn sống ở hiện tại và làm nó lấp lánh.",
      "strengths": [
        "Hào phóng và vui tính",
        "Tạo ra khoảnh khắc đáng nhớ",
        "Biết rõ mình thích gì"
      ],
      "weakness": "Những dịp lớn có thể lấn át những điều lặng lẽ, nhàm chán nhưng quan trọng về sau.",
      "tip": "Hãy xếp thêm một món quà nhỏ cho “bạn của tương lai” vào lịch. Nó làm cho sự xả láng ngọt ngào hơn."
    },
    "impulse": {
      "name": "Tín đồ chốt đơn vội",
      "word": "chốt đơn vội",
      "vibe": "Giỏ hàng đầy nhanh hơn suy nghĩ.",
      "desc": "Bạn đi theo tia lửa trong lòng. Một món dễ thương, một tâm trạng đẹp hay sự hào hứng của bạn bè, và thế là món đồ đang trên đường đến nhà bạn. Sự bốc đồng ấy là một phần duyên của bạn: bạn thử cái mới, nhận lời phiêu lưu và cuộc sống hiếm khi nhàm chán. Kệ của bạn đầy những câu chuyện, kể cả những chuyện bắt đầu bằng “mình phải mua cái này”.",
      "strengths": [
        "Bốc đồng và tò mò",
        "Sẵn sàng cho phiêu lưu",
        "Lan tỏa năng lượng tốt"
      ],
      "weakness": "Một vài món mua xong là hết hứng, và hóa đơn cuối tháng khiến bạn giật mình.",
      "tip": "Thử “giỏ hàng chờ” một ngày. Nếu mai bạn vẫn mỉm cười thì đó mới là một cái gật đầu thật sự."
    },
    "saverflex": {
      "name": "Dè sẻn rồi xả láng",
      "word": "xả láng",
      "vibe": "Cẩn thận suốt mấy tháng, rồi một lần gật đầu thật đã.",
      "desc": "Hầu hết ngày bạn là người cẩn thận: mã giảm giá, cơm mang theo, câu “để sau”. Nhưng bạn tiết kiệm có mục đích, và khi ngày ấy đến, bạn chi cho điều mình thật sự muốn mà không hề xin lỗi. Đó là sự kết hợp bất ngờ: dè sẻn mà cũng kịch tính. Mọi người thường ngạc nhiên vì lần gật đầu của bạn có thể lớn đến thế.",
      "strengths": [
        "Tiết kiệm có mục tiêu",
        "Tận hưởng trọn vẹn món đã mua",
        "Biết điều gì quan trọng"
      ],
      "weakness": "Chờ lâu có thể khiến lần xả láng thấy quá lớn, và cảm giác tội lỗi đôi khi len vào sau đó.",
      "tip": "Hãy đặt tên và ngày cho món quà lớn của bạn. Mong chờ nó đã là một nửa niềm vui."
    },
    "dealhunter": {
      "name": "Thợ săn mùa sale",
      "word": "mùa sale",
      "vibe": "Gặp món hời là khó mà bước qua.",
      "desc": "Khuyến mãi làm bạn sáng mắt. Bạn mê ưu đãi có thời hạn, combo và mã giảm giá dùng được thật, và ra tay nhanh khi giá vừa ý. Vừa là thám tử, vừa là nhà thám hiểm, bạn thấy vui thật sự ngay trong quá trình đi săn. Bạn bè nhắn cho bạn mỗi khi muốn biết ưu đãi nào đáng tin.",
      "strengths": [
        "Mắt tinh với ưu đãi",
        "Nhanh nhạy và dứt khoát",
        "Đi mua sắm cùng rất vui"
      ],
      "weakness": "Giá quá đẹp đôi khi làm bạn quên hỏi mình có cần món đó không.",
      "tip": "Trước khi bấm mua, hãy hỏi: “Nếu giá gốc mình có muốn không?” Nếu có thì đó là một món hời thật."
    },
    "quality": {
      "name": "Tín đồ mua một lần dùng mãi",
      "word": "dùng mãi",
      "vibe": "Chi nhỉnh hơn một lần, dùng sướng nhiều năm.",
      "desc": "Bạn chọn kỹ và chọn tốt. Bạn thà có một chiếc áo khoác thật đẹp còn hơn năm cái tạm được, và quan tâm món đồ cầm có thích không, bền không, hợp với cuộc sống của mình không. Bạn tìm hiểu vừa đủ để chắc chắn, rồi quyết mà không hối tiếc. Đồ của bạn thường đẹp và giữ được lâu, và bạn tự hào về điều đó.",
      "strengths": [
        "Chu đáo và khó tính",
        "Coi trọng tay nghề và độ bền",
        "Hiếm khi hối hận khi mua"
      ],
      "weakness": "Lựa chọn “tốt nhất” khó tìm, và chờ nó có thể làm bạn chậm lại.",
      "tip": "Đôi khi đủ tốt đã là tuyệt. Cho phép mình tận hưởng món đẹp ngay bây giờ."
    },
    "balance": {
      "name": "Người chi tiêu cân bằng",
      "word": "cân bằng",
      "vibe": "Không quá dè sẻn, không quá phóng khoáng. Vừa vặn.",
      "desc": "Bạn pha trộn một chút của mọi thứ. Bạn biết tiết kiệm khi cần, mua khôn khi có lợi, tự thưởng khi xứng đáng và thỉnh thoảng mua theo hứng. Nhờ vậy ai cũng dễ đi mua sắm, đi chơi và chia hóa đơn với bạn. Mọi người thấy thoải mái với thói quen tiền bạc của bạn vì nó linh hoạt và dễ chịu.",
      "strengths": [
        "Linh hoạt và thoải mái",
        "Thích nghi với mọi tình huống",
        "Dễ chia hóa đơn cùng"
      ],
      "weakness": "Không có quy tắc rõ ràng, các quyết định nhỏ có thể trôi đi mà bạn không hay.",
      "tip": "Chọn một thói quen nhỏ bạn thích và làm điểm neo. Phần còn lại cứ linh hoạt."
    }
  }
};
