/* Trắc nghiệm nghề nghiệp (vi)
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Placeholders: {name} {emoji} {vibe} {pct}.
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
    "title": "Trắc nghiệm nghề nghiệp: Bạn hợp với nghề gì?",
    "description": "Làm trắc nghiệm nghề nghiệp 11 câu ngắn, khoảng 2 phút, không cần đăng ký. Khám phá phong cách làm việc, điểm mạnh và những nghề có thể hợp với bạn. Chỉ để giải trí.",
    "ogTitle": "Trắc nghiệm nghề nghiệp 💼 Bạn hợp với nghề gì?",
    "ogDescription": "11 câu hỏi nhẹ nhàng về cách bạn thích làm việc. Khám phá phong cách làm việc, điểm mạnh và vài nghề đáng để tìm hiểu."
  },
  "siteName": "Trắc nghiệm nghề nghiệp",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "💼 Hợp nghề gì?",
    "h1Kicker": "Trắc nghiệm nghề nghiệp",
    "h1Html": "Bạn sẽ<br><em>tỏa sáng</em> ở công việc nào?",
    "hook": "Có người bừng năng lượng giữa đám đông, có người lại thích góc yên tĩnh với một bài toán hóc búa. Trả lời 11 câu hỏi đời thường để biết phong cách làm việc, những điểm mạnh tiềm ẩn và vài nghề có thể hợp với bạn đến bất ngờ.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "✨ 11 câu hỏi",
    "start": "Khám phá ngay →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang tổng hợp câu trả lời của bạn…",
    "sub": "Ghép phong cách của bạn với thế giới nghề nghiệp"
  },
  "result": {
    "title": "Phong cách làm việc của tôi: {name}",
    "metaDesc": "Kết quả trắc nghiệm nghề nghiệp: {name}. {vibe} Xem điểm mạnh, những nghề có thể hợp với bạn và một mẹo làm việc.",
    "eyebrow": "Tính cách nghề nghiệp của bạn",
    "gaugeLabel": "Câu trả lời của bạn nghiêng về đâu",
    "axes": [
      ["Con người", "Vật & ý tưởng"],
      ["Trí tưởng tượng", "Quy trình"],
      ["Đi đầu", "Tập trung sâu"]
    ],
    "jobsLabel": "Những nghề đáng tìm hiểu",
    "strengthsLabel": "Điểm mạnh của bạn",
    "envLabel": "Nơi bạn tỏa sáng",
    "watchLabel": "Cần lưu ý",
    "tipLabel": "Mẹo làm việc",
    "buddyLabel": "Cộng sự lý tưởng",
    "rivalLabel": "Trái ngược",
    "disclaimer": "Chỉ để giải trí. Đây là bài trắc nghiệm nhẹ nhàng, không phải đánh giá nghề nghiệp chuyên môn. Các nghề gợi ý chỉ là ý tưởng để tìm hiểu, không phải lời khuyên, và bạn hoàn toàn có thể thành công ở nhiều con đường khác.",
    "sameShare": "{pct}% người có cùng phong cách làm việc này",
    "shareText": "Phong cách làm việc của mình là {name} {emoji} “{vibe}” Còn bạn thì sao?",
    "ctaStrong": "Một người bạn vừa chia sẻ phong cách làm việc",
    "ctaSub": "Bạn hợp với nghề gì? Biết ngay sau 2 phút.",
    "retry": "Làm lại trắc nghiệm"
  },
  "og": {
    "eyebrow": "Tính cách nghề nghiệp của tôi",
    "brand": "💼 Trắc nghiệm nghề nghiệp",
    "defaultKicker": "Trắc nghiệm nghề nhẹ nhàng",
    "defaultTitle": "Bạn hợp với nghề gì?",
    "defaultDesc": "11 câu · 2 phút · phong cách làm việc của bạn"
  },
  "faq": [
    {
      "q": "Kết quả được chọn như thế nào?",
      "a": "Mỗi câu trả lời dịch chuyển ba thang đo: thích làm việc với con người hay với đồ vật và ý tưởng, thích nghĩ ra điều mới hay xây dựng hệ thống rõ ràng, thích đi đầu hành động hay lặn sâu tập trung. Kết quả là nơi ba thang đo gặp nhau, và cùng một bộ câu trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Đây có phải bài đánh giá nghề nghiệp thật sự không?",
      "a": "Không. Đây chỉ là bài trắc nghiệm nhẹ nhàng để giải trí và ngẫm lại bản thân, không phải bài kiểm tra chuyên môn hay khoa học. Với những quyết định quan trọng về học tập hay công việc, hãy trao đổi với giáo viên hướng nghiệp, thầy cô hoặc những người đang làm nghề bạn quan tâm."
    },
    {
      "q": "Vì sao các nghề gợi ý có vẻ chưa đúng lắm?",
      "a": "Bốn nghề không bao giờ đủ để nói hết một con người. Đó chỉ là ví dụ về công việc thường phát huy phong cách của bạn, nên hãy xem như điểm khởi đầu. Nhiều người có cùng kết quả với bạn vẫn hạnh phúc ở những lĩnh vực hoàn toàn khác."
    },
    {
      "q": "Câu trả lời của tôi có được lưu lại không?",
      "a": "Không. Câu trả lời được tính ngay trong trình duyệt của bạn và không được lưu lại. Chúng tôi chỉ đếm ẩn danh xem kết quả nào xuất hiện để cho biết kết quả đó phổ biến đến mức nào."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm nghề nghiệp",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm nghề nghiệp: cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm nghề nghiệp (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh xem kết quả nào xuất hiện để cho biết mức độ phổ biến của từng kết quả."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; một số tính năng có thể không hoạt động đúng nếu bạn làm vậy."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo thông qua Google AdSense. Google và các đối tác có thể dùng cookie để phân phối quảng cáo dựa trên các lượt truy cập trước đó của bạn vào trang này và các trang web khác. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu các số liệu tổng hợp ẩn danh theo ngày (lượt xem trang, số bài đã hoàn thành, đánh giá) để cải thiện Dịch vụ. Các số liệu này không xác định danh tính cá nhân của bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có bất kỳ câu hỏi nào về Chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang web."
      ],
      [
        "6. Ngày có hiệu lực",
        "Chính sách này có hiệu lực từ ngày 31 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm nghề nghiệp"
  },
  "questions": [
    {
      "q": "Dự án nhóm bắt đầu. Bạn thường tự nhiên nhận vai trò nào?",
      "choices": [
        "Người âm thầm nghĩ ra cách giải quyết thông minh mà chẳng ai nghĩ tới",
        "Người đưa ra ý tưởng rồi lên thuyết trình trước lớp hay trước cả nhóm",
        "Người cầm dụng cụ lên và thực sự làm ra sản phẩm, từng bước một",
        "Người canh lịch trình và kiểm tra xem có ai bị bỏ lại phía sau không"
      ]
    },
    {
      "q": "Bỗng dưng bạn có một ngày rảnh. Điều gì nghe hấp dẫn nhất?",
      "choices": [
        "Cà phê với bạn thân và trò chuyện thật lâu về bộ phim cả hai cùng thích",
        "Cuối cùng cũng sắp xếp lại thư mục ảnh hay sổ chi tiêu cho gọn gàng",
        "Rủ mọi người đá bóng hay chơi board game do chính bạn làm chủ nhà",
        "Một buổi workshop trong ngày để tự tay làm ra thứ gì đó"
      ]
    },
    {
      "q": "Bạn vừa mua một món đồ công nghệ mới. Việc đầu tiên bạn làm là gì?",
      "choices": [
        "Cài đặt ngay, làm theo từng bước một",
        "Viết hướng dẫn đơn giản để cả nhà cũng dùng được",
        "Quay clip mở hộp hay khoe với bạn bè",
        "Lục tung phần cài đặt để tìm tính năng ẩn và cách dùng hay ho"
      ]
    },
    {
      "q": "Lời khen nào làm bạn vui cả ngày?",
      "choices": [
        "“Không sai một lỗi nào luôn. Bạn chính xác thật đấy.”",
        "“Nhóm chạy trơn tru là nhờ có bạn đó.”",
        "“Khoan, bạn tự làm cái này á? Đỉnh quá.”",
        "“Điều bạn nói thực sự đọng lại trong mình.”"
      ]
    },
    {
      "q": "Chọn nơi làm việc trong mơ của bạn.",
      "choices": [
        "Một văn phòng thân thiện, mọi người làm việc nhịp nhàng với nhau",
        "Ngoài hiện trường, di chuyển liên tục, được vận hành thiết bị thật",
        "Một nơi sôi động, ngày nào cũng có điều mới mẻ xảy ra",
        "Một xưởng yên tĩnh với tấm bảng trắng đầy những ý tưởng dang dở"
      ]
    },
    {
      "q": "Có chuyện không ổn xảy ra. Phản ứng đầu tiên của bạn là gì?",
      "choices": [
        "Tập hợp mọi người, chia việc và đứng ra dẫn dắt",
        "Lắng nghe từng người liên quan và tìm một góc nhìn mới",
        "Bình tĩnh kiểm tra số liệu và hồ sơ để tìm nguyên nhân",
        "Bắt tay mày mò và thử ngay một cách sửa mới"
      ]
    },
    {
      "q": "Video nào cứ liên tục hiện lên trong phần đề xuất của bạn?",
      "choices": [
        "Vlog, clip hài và các xu hướng mới nhất",
        "Sửa chữa, đồ tự làm và review đồ cắm trại",
        "Khoa học, vũ trụ và những bí ẩn chưa có lời giải",
        "Câu chuyện thật về những người giúp đỡ người khác như thầy cô giáo, y tá"
      ]
    },
    {
      "q": "Khi đi du lịch, bạn thường là người…",
      "choices": [
        "Đi lang thang không kế hoạch và chụp đầy thư viện ảnh hay phác họa kín sổ",
        "Lên bảng tính hoàn hảo cho ngân sách và lịch trình",
        "Ngồi tán gẫu với người dân địa phương trong một quán cà phê nhỏ",
        "Dẫn cả đoàn đi từ nơi này sang nơi khác"
      ]
    },
    {
      "q": "Còn một ngày nữa là đến hạn nộp. Bạn…",
      "choices": [
        "Viết danh sách việc cần làm rõ ràng rồi xử lý từng việc một",
        "Trau chuốt bài thuyết trình cuối và giữ tinh thần cho cả nhóm",
        "Hỏi thăm từng bạn trong nhóm xem có ai đang bị kẹt không",
        "Chìm đắm vào công việc rồi nghĩ ra một ý tưởng còn hay hơn"
      ]
    },
    {
      "q": "Trong câu lạc bộ hay hội nhóm, bạn muốn nhận vai trò nào nhất?",
      "choices": [
        "Chào đón thành viên mới và lắng nghe khi ai đó cần tâm sự",
        "Làm chủ nhiệm để mọi việc luôn chạy đều",
        "Thiết kế áp phích, logo và đồ lưu niệm",
        "Giữ sổ sách và quỹ chung cho gọn gàng đâu ra đấy"
      ]
    },
    {
      "q": "Mười năm nữa, bạn muốn nghe câu nào nhất?",
      "choices": [
        "“Có bạn ở đó, mình luôn thấy yên tâm.”",
        "“Bạn là người đầu tiên nghĩ ra điều đó, đúng không?”",
        "“Bạn đã khiến rất nhiều người mỉm cười.”",
        "“Việc gì qua tay bạn là chạy ngon lành.”"
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "Người truyền lửa",
      "word": "truyền lửa",
      "vibe": "Cho bạn một sân khấu và một ý tưởng, cả căn phòng sẽ háo hức theo bạn.",
      "desc": "Bạn bừng sáng ở nơi con người, ý tưởng và hành động gặp nhau. Bạn thích đưa ra điều mới, kéo mọi người cùng tham gia và nhìn nó thành hiện thực ngay trước khán giả. Năng lượng là siêu năng lực của bạn: một cuộc họp tẻ nhạt hóa thành buổi động não khi bạn bước vào. Công việc cho phép bạn khởi động dự án, thuyết trình và kết nối có lẽ sẽ giống một trò chơi hơn là làm việc.",
      "keywords": ["Tràn năng lượng", "Có sức thuyết phục", "Nhiều ý tưởng"],
      "strengths": ["Biến một ý tưởng thô thành điều khiến mọi người muốn tham gia", "Đọc được không khí căn phòng và làm nó phấn khởi hơn", "Dám lên tiếng và thuyết trình tự tin"],
      "jobs": ["Chuyên viên marketing", "Nhà sản xuất truyền hình", "Tổ chức sự kiện", "Chủ startup"],
      "env": "Những nhóm chuyển động nhanh, các buổi ra mắt và sự kiện trực tiếp, nơi tuần nào cũng có điều mới và bạn thấy được phản ứng của mọi người với việc mình làm.",
      "watch": "Bắt đầu nhiều dự án hơn mức có thể hoàn thành. Ý tưởng mới lấp lánh có thể cướp thời gian của những việc đang làm dở.",
      "tip": "Kết đôi với một người mê chi tiết, và thống nhất một vạch đích rõ ràng trước khi bắt đầu việc lớn tiếp theo."
    },
    "storyteller": {
      "name": "Người kể chuyện",
      "word": "kể chuyện",
      "vibe": "Bạn biến ý tưởng thành lời nói và câu chuyện mà người ta nhớ mãi.",
      "desc": "Bạn bị cuốn hút bởi con người và ý nghĩa của mọi điều. Bạn thích hiểu cảm xúc của người khác rồi chuyển nó thành lời nói, bài học hay câu chuyện giúp họ nhìn thấy điều mới. Bạn có thể không cần ánh đèn sân khấu, nhưng ảnh hưởng âm thầm của bạn lan đi rất xa. Công việc cho phép bạn lắng nghe, viết, dạy hoặc giải thích có lẽ rất tự nhiên với bạn.",
      "keywords": ["Thấu cảm", "Giàu diễn đạt", "Sâu sắc"],
      "strengths": ["Giải thích điều phức tạp một cách đơn giản và gần gũi", "Lắng nghe kỹ và nhận ra điều người ta thực sự muốn nói", "Tìm ra câu chuyện đằng sau số liệu và sự kiện"],
      "jobs": ["Biên tập viên", "Giáo viên", "Chuyên viên tư vấn tâm lý", "Copywriter"],
      "env": "Không gian yên tĩnh có chỗ để suy nghĩ, những cuộc trò chuyện gần gũi và các dự án mà lời của bạn đến được với người thật và giúp được họ.",
      "watch": "Mang nỗi lo của người khác về nhà. Quan tâm sâu sắc là món quà, nhưng bạn cũng cần thời gian nạp lại năng lượng.",
      "tip": "Giữ một cuốn sổ nhỏ ghi ý tưởng và câu chữ hay. Tác phẩm hay nhất của bạn thường bắt đầu từ một câu suýt bị quên."
    },
    "captain": {
      "name": "Thuyền trưởng",
      "word": "thuyền trưởng",
      "vibe": "Khi mọi thứ trở nên bận rộn, người ta nhìn về bạn để cầm lái.",
      "desc": "Bạn giỏi nhất khi có một đội để dẫn dắt và một mục tiêu để chạm tới. Bạn thích kế hoạch rõ ràng, quyết định gọn gàng và giữ cả nhóm đi cùng một hướng. Mọi người tin tưởng bạn khi khủng hoảng vì bạn bình tĩnh và ngăn nắp. Công việc đặt bạn phụ trách con người, lịch trình hay dịch vụ có lẽ sẽ làm lộ rõ tố chất lãnh đạo tự nhiên của bạn.",
      "keywords": ["Quyết đoán", "Ngăn nắp", "Đáng tin cậy"],
      "strengths": ["Chia việc lớn thành các nhiệm vụ rõ ràng cho từng người", "Giữ bình tĩnh và thực tế khi chịu áp lực", "Giữ lời hứa và đúng hạn"],
      "jobs": ["Quản lý dự án", "Trưởng phòng kinh doanh", "Quản lý khách sạn", "Tiếp viên hàng không"],
      "env": "Những đội năng động với mục tiêu rõ ràng, nơi bạn điều phối con người, xử lý vấn đề tại chỗ và nhanh chóng thấy kết quả.",
      "watch": "Tự làm hết mọi thứ vì thấy như vậy nhanh hơn. Thỉnh thoảng để người khác cầm lái sẽ làm cả đội mạnh hơn.",
      "tip": "Trước khi giao việc, hãy hỏi từng người họ muốn làm gì nhất. Bạn có thể bất ngờ với câu trả lời."
    },
    "caretaker": {
      "name": "Người chăm sóc",
      "word": "chăm sóc",
      "vibe": "Bạn đảm bảo không ai bị bỏ rơi bên lề.",
      "desc": "Bạn quan tâm đến con người và thể hiện điều đó bằng sự hỗ trợ đều đặn, thiết thực. Bạn nhận ra khi ai đó đang gặp khó, nhớ những chi tiết quan trọng và thích những cách làm giúp mọi người an toàn và được quan tâm. Bạn có thể không đòi công, nhưng cả đội cảm nhận được sự khác biệt khi có bạn. Công việc cho phép bạn giúp đỡ, hỗ trợ và bảo vệ người khác có lẽ sẽ rất ý nghĩa với bạn.",
      "keywords": ["Chu đáo", "Kiên nhẫn", "Đáng tin"],
      "strengths": ["Nhận ra những dấu hiệu nhỏ cho thấy ai đó cần giúp", "Theo sát đến cùng một cách cẩn thận, ngày này qua ngày khác", "Tạo bầu không khí bình yên và tin tưởng"],
      "jobs": ["Y tá", "Chuyên viên nhân sự", "Nhân viên công tác xã hội", "Nhân viên chăm sóc khách hàng"],
      "env": "Những đội gắn bó, có mục đích rõ ràng, nơi sự tử tế và nếp làm việc tốt tạo ra khác biệt thật sự cho mọi người.",
      "watch": "Nhận lời với tất cả mọi người. Bảo vệ thời gian của chính mình cũng là một phần của việc lo cho người khác thật tốt.",
      "tip": "Dành một giờ mỗi tuần chỉ cho mục tiêu của riêng bạn, và giữ nó như mọi cuộc hẹn quan trọng khác."
    },
    "creator": {
      "name": "Người sáng tạo",
      "word": "sáng tạo",
      "vibe": "Đưa bạn nguyên liệu, và điều mới mẻ sẽ xuất hiện.",
      "desc": "Bạn nghĩ bằng đôi tay và đôi mắt. Bạn yêu việc làm ra những thứ người ta có thể nhìn, nếm, cầm hay dùng, và vui nhất khi được thử, kiểm tra rồi cải tiến dần. Có quy tắc cũng được, nhưng bạn thích có chỗ để thử nghiệm hơn. Công việc cho phép bạn thiết kế, chế tác hay làm ra một thứ có thật có lẽ sẽ giữ bạn hào hứng rất lâu.",
      "keywords": ["Linh hoạt", "Thích làm tay", "Giàu thị giác"],
      "strengths": ["Biến ý tưởng thành tác phẩm thật, hoàn chỉnh", "Nhận ra thứ gì nhìn hay cảm thấy vừa vặn", "Học nhanh bằng cách thử"],
      "jobs": ["Thiết kế đồ họa", "Đầu bếp", "Nhà sáng tạo video", "Thiết kế nội thất"],
      "env": "Xưởng, bếp, studio hay phim trường, nơi bạn làm việc với chất liệu thật và cho mọi người thấy điều mình làm ra.",
      "watch": "Trau chuốt mãi không thôi. Một sản phẩm hoàn thành và ra đời dạy bạn nhiều hơn một sản phẩm hoàn hảo nằm trong ngăn kéo.",
      "tip": "Lưu lại một bộ sưu tập mọi thứ bạn làm, kể cả những thứ nhỏ. Nó sẽ thành câu chuyện hay nhất về bản thân bạn."
    },
    "inventor": {
      "name": "Nhà phát minh",
      "word": "phát minh",
      "vibe": "Đầu óc bạn là phòng thí nghiệm nơi ý tưởng mới không ngừng sôi lên.",
      "desc": "Bạn yêu những câu hỏi lớn và những lời giải thông minh. Bạn thích lặn sâu vào một câu đố, thử ý tưởng trong đầu và tìm ra lời giải không ai ngờ tới. Bạn nghĩ tốt nhất khi có thời gian yên tĩnh và tự do khám phá. Công việc cho phép bạn nghiên cứu, thiết kế hệ thống hay giải những bài toán khó có lẽ sẽ như một sân chơi cho sự tò mò của bạn.",
      "keywords": ["Tò mò", "Độc đáo", "Lý trí"],
      "strengths": ["Thấy được quy luật và mối liên hệ mà người khác bỏ sót", "Tập trung sâu vào một vấn đề khó", "Nghĩ ra những giải pháp độc đáo"],
      "jobs": ["Nhà nghiên cứu", "Lập trình viên", "Kiến trúc sư", "Lập trình game"],
      "env": "Những nơi yên tĩnh có chỗ để tập trung, các vấn đề thú vị và đồng nghiệp thích tranh luận vui về ý tưởng.",
      "watch": "Giữ những ý tưởng tuyệt vời trong đầu. Chia sẻ sớm giúp người khác hiểu và xây tiếp trên đó.",
      "tip": "Giải thích ý tưởng hiện tại cho một người bạn trong ba câu. Nếu họ hiểu, bạn đã sẵn sàng bắt tay làm."
    },
    "builder": {
      "name": "Thợ lành nghề",
      "word": "thợ lành nghề",
      "vibe": "Bạn không chỉ nói suông. Bạn làm cho xong, và làm cho đàng hoàng.",
      "desc": "Bạn thực tế, vững vàng và vui nhất khi thấy được kết quả thật. Bạn thích các bước rõ ràng, dụng cụ tốt và công việc khiến bạn vận động thay vì ngồi yên. Khi có thứ gì hỏng, bạn là người bình tĩnh sửa nó. Công việc cho phép bạn xây dựng, sửa chữa, vận hành hay giữ mọi thứ chạy an toàn có lẽ sẽ mang lại cảm giác thỏa mãn sâu sắc.",
      "keywords": ["Thực tế", "Tay nghề cao", "Vững vàng"],
      "strengths": ["Làm theo quy trình cẩn thận và an toàn", "Xử lý sự cố bằng tay nghề điềm tĩnh", "Tạo ra kết quả thật, nhìn thấy được"],
      "jobs": ["Kỹ sư cơ khí", "Thợ điện", "Phi công", "Thợ sửa ô tô"],
      "env": "Xưởng, công trường, phòng thí nghiệm hay buồng lái, nơi tay nghề, an toàn và tinh thần đồng đội đều quan trọng, và mỗi ngày bạn thấy mình đã làm được gì.",
      "watch": "Đánh giá thấp kỹ năng của mình. Điều bạn thấy hiển nhiên thường khiến mọi người khác thán phục.",
      "tip": "Mỗi mùa học một công cụ hay kỹ thuật mới. Kỹ năng của bạn lớn nhanh nhất khi chồng lên nhau từng bước."
    },
    "analyst": {
      "name": "Nhà phân tích",
      "word": "phân tích",
      "vibe": "Chi tiết, dữ liệu và trật tự là siêu năng lực thầm lặng của bạn.",
      "desc": "Bạn để ý những điều người khác bỏ qua. Bạn thích công việc tỉ mỉ, quy tắc rõ ràng và niềm vui khi từng con số, từng chi tiết đều chính xác. Bạn nghĩ trước khi làm, và mọi người tin phán đoán của bạn vì nó dựa trên sự thật. Công việc cho phép bạn sắp xếp, kiểm tra, đo lường hay tìm hiểu thông tin có lẽ sẽ mang lại cảm giác bình yên và xứng đáng.",
      "keywords": ["Chính xác", "Logic", "Điềm tĩnh"],
      "strengths": ["Phát hiện lỗi và quy luật trong thông tin", "Giữ những thứ phức tạp gọn gàng, ngăn nắp", "Đưa ra quyết định cẩn trọng dựa trên sự thật"],
      "jobs": ["Kế toán", "Chuyên viên phân tích dữ liệu", "Thủ thư", "Kỹ thuật viên xét nghiệm"],
      "env": "Những nơi yên tĩnh, tổ chức tốt, kỳ vọng rõ ràng, coi trọng sự chính xác và cho bạn thời gian làm cho đúng.",
      "watch": "Chờ thông tin hoàn hảo. Đôi khi một quyết định đủ tốt hôm nay hơn một quyết định hoàn hảo vào tháng sau.",
      "tip": "Mỗi tuần chia sẻ một phát hiện từ công việc của bạn. Những điều bạn tìm ra cẩn thận sẽ giúp được nhiều người hơn khi họ nghe thấy."
    }
  }
};
