/* Attachment Style Test (vi)
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
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
    "title": "Trắc nghiệm kiểu gắn bó – Kiểu gắn bó của tôi là gì?",
    "description": "Trắc nghiệm kiểu gắn bó với 11 câu hỏi đời thường về bạn bè, gia đình và người yêu, chỉ khoảng 2 phút, không cần đăng ký. Kèm gợi ý nhẹ nhàng.",
    "ogTitle": "Trắc nghiệm kiểu gắn bó 🫂 Bạn kết nối thế nào?",
    "ogDescription": "Mười một tình huống đời thường với bạn bè, gia đình và người thương. Khám phá kiểu gắn bó, điểm mạnh và những gợi ý ấm áp cho các mối quan hệ."
  },
  "siteName": "Trắc nghiệm kiểu gắn bó",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🫂 Bạn kết nối thế nào?",
    "h1Kicker": "Trắc nghiệm kiểu gắn bó",
    "h1Html": "Bạn yêu thương<br>và <em>gắn kết</em> ra sao?",
    "hook": "Một tin nhắn Zalo mãi chưa thấy trả lời, một buổi hẹn bị hủy, một người bạn bỗng dưng tâm sự thật lòng. Cách bạn phản ứng với những khoảnh khắc nhỏ ấy nói lên rất nhiều về cách bạn gắn kết với mọi người. Trả lời mười một câu hỏi đời thường và gặp gỡ kiểu gắn bó của bạn.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "✨ 11 câu hỏi",
    "start": "Bắt đầu trắc nghiệm →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang đọc giữa những dòng chữ…",
    "sub": "Đang vẽ bản đồ cách bạn kết nối với mọi người"
  },
  "result": {
    "title": "Kiểu gắn bó của tôi: {name}",
    "metaDesc": "Kết quả trắc nghiệm kiểu gắn bó: {name}, {nick}. {vibe} Xem điểm mạnh của bạn và ba gợi ý ấm áp cho các mối quan hệ.",
    "eyebrow": "Kiểu gắn bó của bạn",
    "gaugeLabel": "Câu trả lời của bạn nghiêng về đâu",
    "axes": [
      ["Thảnh thơi", "Hay bận lòng"],
      ["Muốn gần", "Cần khoảng riêng"]
    ],
    "strengthsLabel": "Điểm mạnh của bạn",
    "tipsLabel": "Gợi ý cho các mối quan hệ",
    "matchLabel": "Dễ hợp với",
    "disclaimer": "Chỉ để giải trí và tự chiêm nghiệm. Đây là một trắc nghiệm vui, không phải đánh giá hay chẩn đoán tâm lý. Kiểu gắn bó có thể thay đổi theo thời gian và trong từng mối quan hệ. Nếu các mối quan hệ thường khiến bạn đau lòng, trò chuyện với chuyên gia tâm lý thật sự có thể giúp ích.",
    "sameShare": "{pct}% người chơi có cùng kiểu này",
    "shareText": "Kiểu gắn bó của mình là {name} {emoji} “{vibe}” Còn bạn thì sao?",
    "ctaStrong": "Một người bạn vừa chia sẻ kiểu gắn bó của họ",
    "ctaSub": "Bạn kết nối thế nào? Tìm hiểu trong 2 phút.",
    "retry": "Làm lại trắc nghiệm"
  },
  "og": {
    "eyebrow": "Kiểu gắn bó của tôi",
    "brand": "🫂 Trắc nghiệm kiểu gắn bó",
    "defaultKicker": "Bài test nhẹ nhàng về các mối quan hệ",
    "defaultTitle": "Kiểu gắn bó của tôi là gì?",
    "defaultDesc": "11 câu hỏi · 2 phút · cách bạn kết nối"
  },
  "faq": [
    {
      "q": "Kết quả của tôi được tính thế nào?",
      "a": "Mỗi câu trả lời đẩy nhẹ hai thang đo mà các nhà nghiên cứu dùng để mô tả sự gắn bó ở người trưởng thành: bạn bận lòng đến đâu về sự gần gũi và bạn thoải mái đến đâu khi dựa vào người khác. Kết quả là điểm gặp nhau của hai thang đo đó, và cùng một bộ câu trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Đây có phải là chẩn đoán tâm lý không?",
      "a": "Không. Đây là một trắc nghiệm vui để giải trí và tự chiêm nghiệm, không phải đánh giá chuyên môn hay khoa học. Kiểu gắn bó không phải là rối loạn, cũng không phải nhãn dán cố định. Nếu các mối quan hệ thường khiến bạn đau lòng hay rối bời, chuyên gia tư vấn tâm lý có thể giúp bạn tìm hiểu kỹ hơn."
    },
    {
      "q": "Kiểu gắn bó của tôi có thay đổi được không?",
      "a": "Có. Nhiều người có cách ứng xử khác nhau với những người khác nhau, và những mối quan hệ ấm áp, sự thấu hiểu bản thân hay trị liệu đều giúp ta dần thấy yên lòng hơn. Hãy làm lại bài sau vài tháng và so sánh nhé."
    },
    {
      "q": "Câu trả lời của tôi có được lưu lại không?",
      "a": "Không. Câu trả lời được tính ngay trên trình duyệt của bạn và không được lưu trữ. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho biết kết quả đó phổ biến đến mức nào."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm kiểu gắn bó",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm kiểu gắn bó — cách chúng tôi dùng cookie, quảng cáo và số liệu thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm kiểu gắn bó (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi lên hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho biết mỗi kết quả phổ biến đến mức nào."
      ],
      [
        "2. Cookie và các công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong phần cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo thông qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên những lần bạn truy cập trang này và các trang web khác trước đây. Bạn có thể tìm hiểu thêm và thay đổi tùy chọn cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Số liệu thống kê",
        "Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, số bài đã hoàn thành, lượt đánh giá) để cải thiện Dịch vụ. Những con số này không thể dùng để nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ người quản lý trang web."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 2 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm kiểu gắn bó"
  },
  "questions": [
    {
      "q": "Một người bạn thân cả ngày chưa trả lời tin nhắn Zalo của bạn. Trong đầu bạn nghĩ gì?",
      "choices": [
        "Chắc bạn ấy đang bận. Lát nữa sẽ nhắn lại thôi.",
        "Mình đọc đi đọc lại tin nhắn, sợ mình đã lỡ lời gì đó.",
        "Thật lòng thì mình gần như không để ý. Mình không thích nhắn tin liên tục.",
        "Hơi lo một chút, rồi tự nhủ là không nên bận tâm nhiều thế."
      ]
    },
    {
      "q": "Một người bạn mới bắt đầu thân nói: “Mình rất thích ở bên cậu.” Bạn…",
      "choices": [
        "Vui hết cỡ, nhưng rồi băn khoăn không biết tháng sau họ còn nghĩ vậy không",
        "Thấy ấm lòng và nói rằng mình cũng cảm thấy như vậy",
        "Thấy vui, nhưng lạ là lại muốn lùi lại một bước nhỏ",
        "Hơi ngượng và đánh trống lảng bằng một câu đùa"
      ]
    },
    {
      "q": "Bạn đang trải qua một tuần thật sự mệt mỏi. Bạn thường làm gì?",
      "choices": [
        "Tự mình xoay xở. Mình không thích dựa dẫm vào ai.",
        "Muốn tìm ai đó tâm sự, nhưng lại im lặng vì sợ làm phiền",
        "Kể với một người thân chuyện đang xảy ra và để họ giúp mình",
        "Nhắn cho nhiều người một lúc, mong có ai đó hỏi han mình"
      ]
    },
    {
      "q": "Một người bạn hủy hẹn với bạn vào phút chót.",
      "choices": [
        "Mình nói không sao, nhưng thầm quyết định sẽ không trông cậy vào bạn ấy nhiều nữa",
        "Thật ra mình hơi nhẹ nhõm. Có thêm thời gian cho riêng mình!",
        "Mình tự hỏi có phải bạn ấy không thật sự muốn gặp mình",
        "Không sao cả. Hẹn hôm khác là được."
      ]
    },
    {
      "q": "Một người bạn mới bắt đầu kể chuyện riêng tư. Còn bạn thì sao?",
      "choices": [
        "Mình cũng mở lòng dần dần, theo nhịp tự nhiên",
        "Mình muốn mở lòng, nhưng đến nửa chừng thì khựng lại và thu mình",
        "Mình kể rất nhiều thật nhanh. Mình muốn hai đứa thân nhau ngay.",
        "Mình chỉ nói chuyện nhẹ nhàng. Chuyện riêng thì để riêng."
      ]
    },
    {
      "q": "Bạn và một người thân bất đồng về một chuyện quan trọng.",
      "choices": [
        "Mình muốn giải quyết ngay lập tức. Chờ đợi thật khó chịu nổi.",
        "Mình cần khoảng lặng và im lặng cho đến khi mọi chuyện lắng xuống",
        "Hai bên bình tĩnh nói chuyện, dù có hơi khó xử",
        "Mình chao đảo giữa muốn nói cho ra lẽ và muốn biến mất"
      ]
    },
    {
      "q": "Một người thân thiết đi xa một tuần. Liên lạc bao nhiêu là vừa?",
      "choices": [
        "Khi nào họ về thì mình kể chuyện sau. Mình thích có khoảng riêng.",
        "Vài tin nhắn thì vui, mà không có tin nào cũng chẳng sao",
        "Khó nói lắm. Mình nhớ họ, nhưng nhắn nhiều quá lại thấy căng thẳng.",
        "Mỗi ngày một chút tin tức. Mình thích cảm giác hai bên vẫn kết nối."
      ]
    },
    {
      "q": "Ai đó bất ngờ làm một điều rất tử tế cho bạn.",
      "choices": [
        "Mình cảm động, nhưng một phần trong mình tự hỏi họ muốn gì đáp lại",
        "Mình rất thích và thấy phải làm cho họ nhiều hơn nữa",
        "Mình thấy hơi khó xử, như thể giờ mình mắc nợ họ",
        "Mình cảm ơn và cứ thế tận hưởng"
      ]
    },
    {
      "q": "Khi nghĩ về những người gần gũi nhất với mình, câu nào giống bạn nhất?",
      "choices": [
        "Mình tin họ sẽ ở bên mình, và họ cũng có thể trông cậy vào mình",
        "Mình quý họ, nhưng mình thấy thoải mái nhất khi tự lo cho bản thân",
        "Đôi khi mình sợ mình quý họ nhiều hơn họ quý mình",
        "Mình muốn gần gũi, nhưng một phần trong mình luôn chờ ngày bị tổn thương"
      ]
    },
    {
      "q": "Một người mới gia nhập nhóm bạn và ai cũng có vẻ rất quý người đó.",
      "choices": [
        "Sao cũng được. Mình vẫn giữ vòng bạn bè nhỏ của mình.",
        "Mình hơi sợ bị cho ra rìa",
        "Mình hơi dè chừng cho đến khi biết có thể tin người đó",
        "Tuyệt, thêm một người bạn để đi chơi cùng"
      ]
    },
    {
      "q": "Ai đó nhẹ nhàng hỏi: “Dạo này cậu có ổn không?”",
      "choices": [
        "Mình nói “mình ổn”, rồi sau đó lại ước gì đã kể nhiều hơn",
        "Mình kể thật lòng tình hình của mình",
        "Mình nói mình ổn rồi lái sang chuyện khác. Tự mình lo được.",
        "Mình nhẹ nhõm vì có người để ý đến mức kể tuôn ra hết"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "An toàn",
      "nick": "Bến đỗ bình yên",
      "word": "gắn bó an toàn",
      "vibe": "Bạn có thể ở gần mà không đánh mất mình, ở xa mà không mất niềm tin.",
      "desc": "Bạn thường tin rằng những người mình thương sẽ có mặt khi cần, và bạn cũng thoải mái có mặt vì họ. Sự gần gũi không làm bạn sợ, một chút khoảng cách cũng vậy. Khi có chuyện không như ý, bạn thường nói được điều mình cảm thấy mà không bùng nổ hay đóng cửa lòng. Ở cạnh bạn, mọi người hay thấy bình tĩnh hơn, như thể bạn cho họ một chốn an toàn để dừng chân. Điều đó không có nghĩa là bạn không bao giờ lo lắng; mà là bạn thường tìm được đường quay về với sự cân bằng.",
      "keywords": ["Tin tưởng", "Cởi mở", "Cân bằng"],
      "strengths": ["Nói ra điều mình cần một cách giản dị và tử tế", "Cho người khác không gian mà không thấy bị từ chối", "Làm lành sau tranh cãi thay vì ghi sổ ai đúng ai sai"],
      "tips": ["Hãy nhớ lắng nghe cả chính mình. Làm người vững vàng không có nghĩa là phải gánh mọi thứ một mình.", "Khi người thân có vẻ bồn chồn hay xa cách, hãy nhớ đó có thể là thói quen cũ của họ, không phải lời phán xét về bạn.", "Chia sẻ cách bạn giữ bình tĩnh. Một câu đơn giản như “mình thường làm thế này” có thể là món quà cho những người bạn đang chật vật."],
      "match": "Hai trái tim vững vàng dễ xây nên mối quan hệ nhẹ nhàng và chân thành. Sự điềm tĩnh của bạn cũng giúp bất kỳ ai dần thấy yên lòng hơn."
    },
    "anxious": {
      "name": "Lo âu",
      "nick": "Trái tim tận tụy",
      "word": "gắn bó lo âu",
      "vibe": "Bạn yêu bằng cả trái tim và cảm nhận được từng thay đổi nhỏ trong không khí.",
      "desc": "Bạn quan tâm sâu sắc và để ý mọi thứ: một tin nhắn ngắn hơn, một giọng điệu khác, một kế hoạch bị dời lại. Gần gũi với mọi người rất quan trọng với bạn, nên khi một mối quan hệ có vẻ chông chênh, đầu óc bạn dễ tự lấp đầy những khoảng trống. Sự nhạy cảm ấy khiến bạn ấm áp, chu đáo và chung thủy. Nỗi bận lòng không phải là khuyết điểm; đó là dấu hiệu cho thấy bạn trân trọng những người trong đời mình đến nhường nào. Với một chút trấn an và luyện tập, trái tim lớn ấy có thể vừa gần gũi vừa bình yên.",
      "keywords": ["Chu đáo", "Tinh ý", "Chung thủy"],
      "strengths": ["Nhận ra cảm xúc của người khác trước khi họ nói", "Bày tỏ yêu thương và biết ơn một cách hào phóng", "Thật lòng nỗ lực để giữ cho các mối quan hệ luôn sống động"],
      "tips": ["Khi nỗi lo dâng lên, hãy dừng lại trước khi gửi thêm tin nhắn. Hỏi bản thân điều mình biết chắc, chứ không phải điều mình sợ.", "Hãy nói cho mọi người biết điều gì giúp bạn yên tâm, như một tin nhắn ngắn “lát nói chuyện nhé”. Nhu cầu rõ ràng dễ được đáp ứng hơn những phỏng đoán.", "Xây một cuộc sống tự nó đã làm bạn đầy đặn: sở thích, bạn bè, thời gian tĩnh lặng. Sự vững vàng đến từ nhiều điểm tựa, không chỉ một."],
      "match": "Một người bạn hay người thương vững vàng, nhất quán giúp nỗi lo của bạn lắng xuống, còn sự ấm áp của bạn giúp họ mở lòng."
    },
    "avoidant": {
      "name": "Né tránh",
      "nick": "Tâm hồn tự do",
      "word": "gắn bó né tránh",
      "vibe": "Bạn coi trọng sự độc lập và quan tâm theo cách lặng lẽ, thiết thực.",
      "desc": "Bạn tự lập và giỏi tự xoay xở mọi việc. Bạn thích ở cạnh mọi người, nhưng cũng cần nhiều không gian riêng, và cảm xúc quá dồn dập có thể khiến bạn muốn lùi lại. Đó không phải là lạnh lùng; thường đó là thói quen hình thành từ lâu: tin vào bản thân trước tiên. Sự điềm tĩnh khi gặp áp lực và việc tôn trọng tự do của người khác là những điểm mạnh thật sự. Để mọi người bước vào từng chút một có thể khiến các mối quan hệ của bạn nhẹ nhàng hơn chứ không nặng nề hơn.",
      "keywords": ["Độc lập", "Điềm tĩnh", "Tháo vát"],
      "strengths": ["Giữ bình tĩnh khi mọi thứ căng thẳng", "Tôn trọng không gian và lựa chọn của người khác", "Giải quyết vấn đề một cách thực tế và đáng tin cậy"],
      "tips": ["Khi cần không gian, hãy nói ra và cho biết khi nào bạn quay lại. “Cho mình một buổi tối, mai mình nói chuyện nhé” giúp giữ trọn niềm tin.", "Thử mỗi tuần chia sẻ một cảm xúc nhỏ với người bạn tin tưởng. Sự thân thiết có thể lớn lên từ những bước rất nhỏ.", "Để ý cảm giác muốn rút lui đúng lúc mọi thứ đang tốt đẹp. Nán lại thêm một chút thường là lúc sự kết nối sâu sắc hơn."],
      "match": "Một người vững vàng, kiên nhẫn tôn trọng khoảng riêng của bạn mà không để bụng, nhờ vậy bạn dễ để họ lại gần hơn."
    },
    "fearful": {
      "name": "Hỗn loạn",
      "nick": "Chú nhím dịu dàng",
      "word": "gắn bó hỗn loạn, gắn bó vô tổ chức",
      "vibe": "Bạn khao khát sự gần gũi, và cũng biết nó có thể làm mình đau đến thế nào.",
      "desc": "Một phần trong bạn muốn kết nối sâu sắc, còn một phần khác luôn cảnh giác, sẵn sàng che chở cho bạn. Vì vậy bạn có thể tiến lại gần rồi lùi ra xa, đôi khi chẳng rõ vì sao. Như chú nhím giữa trời lạnh, bạn muốn hơi ấm nhưng lại sợ những chiếc gai. Sự giằng co này thường đến từ những trải nghiệm mà sự gần gũi không phải lúc nào cũng bình yên. Bạn không hề quá đáng hay quá phức tạp: bạn tinh tế, nhạy cảm và giàu lòng thấu cảm, và với niềm tin cùng thời gian, bạn có thể vừa gần gũi vừa thấy yên lòng.",
      "keywords": ["Nhạy cảm", "Thấu cảm", "Tinh tế"],
      "strengths": ["Hiểu nỗi đau của người khác vì chính bạn từng trải qua", "Đọc con người và tình huống một cách sâu sắc", "Trân quý niềm tin khi nó thật sự được vun đắp"],
      "tips": ["Gọi tên cảm giác kéo đẩy khi nó xuất hiện. Nói ra “một phần mình muốn lại gần, một phần mình đang sợ” là điều can đảm và rất có ích.", "Chọn những mối quan hệ đem lại cảm giác êm đềm, nhất quán, và cho chúng thời gian để chứng minh.", "Hãy dịu dàng với bản thân. Nếu những tổn thương cũ vẫn chi phối hiện tại, một chuyên gia tâm lý có thể là người đồng hành thật sự."],
      "match": "Một người vững vàng, nhất quán, vẫn tử tế khi bạn chao đảo, có thể dần cho bạn thấy sự gần gũi có thể là chốn bình yên."
    }
  }
};
