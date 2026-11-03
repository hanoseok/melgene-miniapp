/* Enneagram Test (vi)
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Trắc nghiệm Enneagram – Bạn thuộc nhóm tính cách nào?",
    "description": "Trắc nghiệm Enneagram miễn phí: 12 câu hỏi đời thường, khoảng 2 phút, không cần đăng ký. Khám phá nhóm Enneagram của bạn, động lực cốt lõi, điểm mạnh và gợi ý để phát triển.",
    "ogTitle": "Trắc nghiệm Enneagram 🔷 Bạn thuộc nhóm nào?",
    "ogDescription": "Mười hai câu hỏi đời thường về cách bạn phản ứng, quyết định và nạp lại năng lượng. Khám phá nhóm Enneagram của bạn, điều thúc đẩy bạn và cách bạn trưởng thành."
  },
  "siteName": "Trắc nghiệm Enneagram",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🔷 Chín cách nhìn thế giới",
    "h1Kicker": "Trắc nghiệm Enneagram",
    "h1Html": "Điều gì thật sự<br><em>thúc đẩy</em> bạn?",
    "hook": "Có người thích dẫn dắt, có người giữ hòa khí, có người lặng lẽ tự tìm ra mọi thứ. Enneagram mô tả chín cách con người nhìn thế giới và điều mỗi người mong muốn nhất. Trả lời mười hai câu hỏi đời thường thật nhanh để gặp nhóm tính cách của bạn.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "✨ 12 câu hỏi",
    "start": "Tìm nhóm của tôi →"
  },
  "quiz": {
    "backAria": "Câu hỏi trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang nối các điểm lại với nhau…",
    "sub": "Đang tìm vị trí của bạn trên vòng tròn"
  },
  "result": {
    "title": "Enneagram nhóm {n}: {name}",
    "metaDesc": "Kết quả trắc nghiệm Enneagram: Nhóm {n}, {name}. {vibe} Xem động lực cốt lõi, điểm mạnh và ba gợi ý để phát triển của bạn.",
    "eyebrow": "Nhóm Enneagram của bạn",
    "typeNum": "Nhóm {n}",
    "desireLabel": "Sâu thẳm bên trong, bạn muốn",
    "fearLabel": "Điều bạn cố tránh",
    "gaugeLabel": "Câu trả lời của bạn nghiêng về",
    "centerLabel": "Năng lượng của bạn bắt đầu từ…",
    "centers": ["Bản năng", "Con tim", "Cái đầu"],
    "stanceLabel": "Bạn theo đuổi điều mình cần bằng cách…",
    "stances": ["Tiến lên", "Làm điều đúng", "Lùi lại"],
    "strengthsLabel": "Điểm mạnh của bạn",
    "tipsLabel": "Gợi ý để phát triển",
    "growthLabel": "Khi trưởng thành, bạn học hỏi từ",
    "disclaimer": "Chỉ để giải trí và tự chiêm nghiệm. Bài trắc nghiệm ngắn này không phải bài đánh giá Enneagram chính thức như RHETI, cũng không phải bài kiểm tra hay chẩn đoán tâm lý. Hầu hết mọi người đều thấy mình trong vài nhóm, nên hãy xem kết quả như một điểm khởi đầu, không phải một cái nhãn.",
    "sameShare": "{pct}% người làm có cùng nhóm này",
    "shareText": "Mình là Enneagram nhóm {n}, {name} {emoji} “{vibe}” Còn bạn thuộc nhóm nào?",
    "ctaStrong": "Bạn của bạn vừa chia sẻ nhóm Enneagram của họ",
    "ctaSub": "Điều gì thúc đẩy bạn? Tìm hiểu trong 2 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Nhóm Enneagram của tôi",
    "brand": "🔷 Trắc nghiệm Enneagram",
    "defaultKicker": "Một bài trắc nghiệm tính cách ngắn",
    "defaultTitle": "Tôi thuộc nhóm Enneagram nào?",
    "defaultDesc": "12 câu hỏi · 2 phút · điều thúc đẩy bạn"
  },
  "faq": [
    {
      "q": "Nhóm của tôi được xác định thế nào?",
      "a": "Một nửa số câu hỏi xem năng lượng của bạn thường bắt đầu từ đâu: cơ thể và bản năng, cảm xúc hay suy nghĩ. Nửa còn lại xem bạn thường theo đuổi điều mình cần theo cách nào. Nhóm của bạn nằm ở điểm giao của hai câu trả lời đó, và cùng một bộ câu trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Đây có phải bài trắc nghiệm Enneagram chính thức không?",
      "a": "Không. Đây là một bài quiz ngắn để giải trí và tự chiêm nghiệm, không phải bài đánh giá chính thức hay đã được kiểm chứng như RHETI, và cũng không phải chẩn đoán tâm lý. Nếu kết quả chưa thấy đúng, hãy đọc thêm về các nhóm lân cận. Nhiều người chỉ tìm ra nhóm của mình sau một thời gian suy ngẫm."
    },
    {
      "q": "Nhóm của tôi có thể thay đổi không?",
      "a": "Theo Enneagram, nhóm cốt lõi của bạn khá ổn định, nhưng cách bạn thể hiện nó thay đổi nhiều theo căng thẳng, tâm trạng và sự trưởng thành. Câu trả lời trong bài quiz cũng có thể thay đổi, vì vậy hãy làm lại sau vài tháng xem có ra cùng nhóm không."
    },
    {
      "q": "Câu trả lời của tôi có bị lưu lại không?",
      "a": "Không. Câu trả lời của bạn được tính ngay trong trình duyệt và không được lưu lại. Chúng tôi chỉ đếm ẩn danh nhóm nào xuất hiện để cho biết nhóm đó phổ biến đến mức nào."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm Enneagram",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm Enneagram — cách chúng tôi dùng cookie, quảng cáo và số liệu thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm Enneagram (gọi tắt là \"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
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
        "Chính sách này có hiệu lực từ ngày 4 tháng 11 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm Enneagram"
  },
  "questions": [
    {
      "q": "Bạn bước vào một bữa tiệc mà gần như không quen ai. Việc đầu tiên bạn làm là gì?",
      "choices": [
        "Cảm nhận không khí trong phòng rồi đi về phía sôi động nhất",
        "Để ý xem ai trông thân thiện, và mình đang tạo ấn tượng thế nào",
        "Đứng ngoài một lúc để xem mọi người ở đây cư xử ra sao",
        "Cầm ly nước rồi nhảy ngay vào một cuộc trò chuyện"
      ]
    },
    {
      "q": "Khi làm việc nhóm, bạn thường tự nhiên…",
      "choices": [
        "Đứng ra dẫn dắt và đẩy mọi việc tiến lên",
        "Nhận phần của mình và lặng lẽ làm theo cách riêng",
        "Đảm bảo mọi người đúng tiến độ và không sót việc gì",
        "Đưa ra ý tưởng táo bạo nhất và khiến mọi người hào hứng"
      ]
    },
    {
      "q": "Khi phải đưa ra một quyết định lớn, bạn tin vào điều gì nhất?",
      "choices": [
        "Cảm giác của mình, và điều đó có ý nghĩa gì với những người mình thương",
        "Tìm hiểu kỹ, liệt kê ưu nhược điểm và chuẩn bị phương án dự phòng",
        "Tâm sự với người thân thiết cho đến khi thấy ổn",
        "Trực giác. Phần lớn thời gian mình cứ thế mà biết."
      ]
    },
    {
      "q": "Khi thật sự muốn điều gì đó, bạn thường…",
      "choices": [
        "Xem trước những người xung quanh có thấy ổn không",
        "Lao thẳng tới mà giành lấy",
        "Mơ về nó thật lâu trước khi làm gì",
        "Chăm chỉ làm đúng cách và tin rằng sẽ được đền đáp"
      ]
    },
    {
      "q": "Vào một ngày tệ, điều gì làm bạn chao đảo nhất?",
      "choices": [
        "Không biết chuyện gì sắp xảy ra",
        "Bị sai khiến, hoặc thấy có gì đó bất công",
        "Cảm thấy không được trân trọng hay bị lãng quên",
        "Quá nhiều việc dang dở mà chẳng ai có kế hoạch rõ ràng"
      ]
    },
    {
      "q": "Sau một tuần dài bận rộn, nạp lại năng lượng với bạn là…",
      "choices": [
        "Ở một mình, tắt điện thoại, đắm chìm trong thế giới riêng",
        "Một kế hoạch mới: một chuyến đi, một buổi tối đi chơi, một điều gì đó thật lớn",
        "Một ngày chậm rãi chẳng làm gì cả",
        "Xử lý xong danh sách việc cần làm để cuối cùng được nghỉ thật sự"
      ]
    },
    {
      "q": "Bạn đang kẹt trong một hàng người không nhúc nhích. Bạn…",
      "choices": [
        "Bắt chuyện với người bên cạnh hoặc nhắn tin cho bạn bè",
        "Cảm thấy rõ trong người: bồn chồn, nghiến chặt hàm",
        "Tính xem sẽ mất bao lâu và tìm cách nhanh hơn",
        "Đi lên phía trước xem thật ra đang có chuyện gì"
      ]
    },
    {
      "q": "Ai đó phản đối bạn trước mặt mọi người. Bạn…",
      "choices": [
        "Tìm một điểm chung công bằng mà ai cũng chấp nhận được",
        "Phản bác lại và bảo vệ quan điểm của mình",
        "Im lặng rồi sau đó tự mình nghĩ lại",
        "Thật lòng mà nói, mình khá thích một cuộc tranh luận hay"
      ]
    },
    {
      "q": "Lời khen nào sẽ khiến bạn vui cả ngày?",
      "choices": [
        "“Bạn lúc nào cũng biết chuyện gì đang thật sự diễn ra.”",
        "“Bạn có một trái tim thật lớn.”",
        "“Bạn thật chân thật. Bạn luôn giữ vững lập trường.”",
        "“Chẳng có ai giống như bạn cả.”"
      ]
    },
    {
      "q": "Một quy định mà bạn thấy vô lý…",
      "choices": [
        "Sẽ được mình lặng lẽ lách qua, không làm ầm lên",
        "Làm mình khó chịu, nhưng mình không muốn làm ai thất vọng",
        "Sẽ bị mình chất vấn công khai, hoặc đơn giản là phớt lờ",
        "Mình vẫn tuân theo cho đến khi nó được thay đổi đúng cách"
      ]
    },
    {
      "q": "Khi một người bạn gặp chuyện, bạn là người…",
      "choices": [
        "Xắn tay vào làm gì đó để giải quyết",
        "Lắng nghe và giúp họ thấy bớt cô đơn",
        "Giúp họ nghĩ thấu đáo và nhìn ra các lựa chọn",
        "Tìm thông tin và xem ai có thể giúp"
      ]
    },
    {
      "q": "Một ngày thứ Bảy rảnh rỗi, không có kế hoạch gì. Nhiều khả năng bạn sẽ…",
      "choices": [
        "Nhắn tin cho mọi người và bày ra một cuộc vui",
        "Chìm vào một cuốn sách, trò chơi hay sở thích suốt mấy tiếng",
        "Làm cho xong việc nhà hoặc giúp ai đó đang cần",
        "Để ngày trôi đi tự nhiên xem nó dẫn tới đâu"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "Người Cầu Toàn",
      "word": "người cầu toàn",
      "vibe": "Bạn thấy mọi thứ có thể tốt hơn ra sao, và lặng lẽ đặt chuẩn mực đó cho chính mình.",
      "desire": "Được là người tốt, công bằng và làm mọi việc đúng đắn",
      "fear": "Mắc sai lầm, cẩu thả hay để mọi thứ trôi tuột",
      "desc": "Bạn mang trong mình cảm nhận rõ ràng về đúng và sai, và hầu như nhìn đâu cũng thấy chỗ có thể cải thiện. Bạn giữ lời hứa, dám nhận trách nhiệm, và mọi người tin bạn vì bạn nói là làm. Nhưng chính những chuẩn mực cao ấy có thể biến thành một giọng phê bình ồn ào trong đầu, và bạn có thể bực mình khi người khác dường như không quan tâm bằng mình. Ở phiên bản tốt nhất, bạn có nguyên tắc, kiên nhẫn và sáng suốt, và bạn biết rằng đôi khi “đủ tốt” mới chính là vừa đúng.",
      "keywords": ["Có nguyên tắc", "Đáng tin cậy", "Chu đáo"],
      "strengths": ["Làm việc đến nơi đến chốn, kể cả khi không ai kiểm tra", "Đứng lên vì lẽ công bằng", "Biến tình huống rối ren thành kế hoạch rõ ràng, khả thi"],
      "tips": ["Hãy để ý giọng phê bình trong đầu và đáp lại nó như một người bạn tử tế.", "Mỗi tuần chọn một việc cố tình để dở dang, và thấy rằng thế giới chẳng sụp đổ.", "Dành chỗ cho niềm vui. Nghỉ ngơi và vui chơi là một phần của sống tốt, không phải phần thưởng sau khi xong hết mọi việc."],
      "growth": "Khi trưởng thành, bạn thả lỏng hơn và tìm thấy nhiều niềm vui, sự tự nhiên và nhẹ nhõm hơn."
    },
    "type2": {
      "name": "Người Giúp Đỡ",
      "word": "người giúp đỡ",
      "vibe": "Bạn nhận ra người khác cần gì trước khi họ kịp nói, và rất thích làm ngày của họ tươi hơn.",
      "desire": "Được yêu thương và cảm thấy mình thật sự được cần đến",
      "fear": "Không được ai cần hay không được yêu thương",
      "desc": "Bạn ấm áp, hào phóng và rất nhạy với người khác. Bạn nhớ ngày sinh nhật, có mặt vào những lúc quan trọng, và bạn bè thường cảm thấy được thấu hiểu, được chăm sóc khi ở cạnh bạn. Các mối quan hệ là trung tâm cuộc sống của bạn. Vì quá tập trung vào người khác, bạn có thể quên nhu cầu của bản thân, khó nói lời từ chối, hoặc thấy tổn thương khi sự quan tâm của mình không được ai để ý. Ở phiên bản tốt nhất, bạn cho đi một cách tự do, không tính toán, và cũng để người khác chăm sóc mình.",
      "keywords": ["Ấm áp", "Hào phóng", "Quan tâm"],
      "strengths": ["Khiến mọi người cảm thấy được chào đón và trân trọng", "Nhận ra ngay ai đó đang cần gì", "Xây dựng những tình bạn gần gũi, bền chặt"],
      "tips": ["Trước khi nói đồng ý, hãy hỏi bản thân hôm nay mình cần gì.", "Hãy để người khác giúp bạn, kể cả những việc nhỏ. Biết nhận cũng là một phần của sự gắn bó.", "Nói ra nhu cầu của mình thay vì mong ai đó tự đoán được."],
      "growth": "Khi trưởng thành, bạn dành một phần sự quan tâm ấy cho chính mình và thành thật hơn với cảm xúc, nhu cầu của bản thân."
    },
    "type3": {
      "name": "Người Thành Đạt",
      "word": "người thành đạt",
      "vibe": "Bạn đặt mục tiêu, tìm con đường nhanh nhất để tới đó và kéo mọi người đi cùng.",
      "desire": "Cảm thấy mình có giá trị và thành công",
      "fear": "Trở nên vô giá trị hoặc thất bại",
      "desc": "Bạn đầy động lực, linh hoạt và tràn năng lượng. Bạn biết cách đặt mục tiêu, đọc không khí và tạo ra kết quả, và mọi người thường được truyền cảm hứng từ sự tự tin, quyết tâm của bạn. Bạn thích tiến bộ, hoàn thiện và giỏi việc mình làm. Tuy vậy, đôi khi bạn dễ chỉ đo giá trị bản thân bằng thành tích và cứ chạy tiếp dù đã mệt. Ở phiên bản tốt nhất, bạn vừa thành công vừa chân thật, và biết rằng mình vẫn có giá trị ngay cả trong một ngày chậm chạp.",
      "keywords": ["Quyết tâm", "Linh hoạt", "Truyền cảm hứng"],
      "strengths": ["Biến ý tưởng thành kết quả thật", "Tạo động lực cho cả nhóm và giữ được đà", "Học nhanh và thích nghi với mọi hoàn cảnh"],
      "tips": ["Hãy hỏi bản thân mình thật sự muốn gì, chứ không chỉ điều gì trông đẹp mắt.", "Lên lịch nghỉ ngơi thật sự và coi trọng nó như một hạn chót.", "Chia sẻ một thất bại hay một nỗi băn khoăn với người bạn tin tưởng. Sự chân thật khiến mọi người thấy gần bạn hơn."],
      "growth": "Khi trưởng thành, bạn gắn bó hơn với con người và những mục tiêu lớn hơn thành công của riêng mình."
    },
    "type4": {
      "name": "Người Cá Tính",
      "word": "người cá tính",
      "vibe": "Bạn cảm nhận mọi thứ thật sâu và muốn cuộc đời mình mang một ý nghĩa thật sự của riêng bạn.",
      "desire": "Được là chính mình và tìm ra ý nghĩa của riêng mình",
      "fear": "Không có bản sắc hoặc trở nên tầm thường",
      "desc": "Bạn nhạy cảm, sáng tạo và thành thật với những cảm xúc mà người khác thường né tránh. Bạn thấy cái đẹp và ý nghĩa trong những điều nhỏ bé, và thà được là chính mình còn hơn cố hòa lẫn vào đám đông. Bạn bè tìm đến bạn khi cuộc sống khó khăn, vì bạn không sợ những cảm xúc thật. Đôi lúc bạn có thể thấy như thiếu một điều gì đó, hoặc người khác sống dễ dàng hơn, và tâm trạng có thể cuốn bạn đi. Ở phiên bản tốt nhất, bạn biến cảm xúc sâu sắc thành sáng tạo và lòng trắc ẩn, và tận hưởng những điều tốt đẹp đã có trong đời.",
      "keywords": ["Sáng tạo", "Chân thật", "Sâu sắc"],
      "strengths": ["Thể hiện cảm xúc qua lời nói, nghệ thuật hay phong cách", "Ở bên người khác qua những cảm xúc khó khăn", "Nhìn thấy cái đẹp và ý nghĩa mà người khác bỏ lỡ"],
      "tips": ["Khi tâm trạng ập đến, hãy gọi tên nó, rồi vẫn làm một việc nhỏ thiết thực.", "Ghi lại những điều tốt đẹp đã có trong đời và thường xuyên bổ sung.", "Sáng tạo đều đặn, kể cả khi không ai thấy. Thói quen ổn định cho cảm xúc của bạn một chốn để về."],
      "growth": "Khi trưởng thành, bạn thêm vào kỷ luật và nề nếp, biến cảm xúc thành những việc làm bền bỉ mà bạn tự hào."
    },
    "type5": {
      "name": "Người Quan Sát",
      "word": "người quan sát",
      "vibe": "Bạn muốn hiểu mọi thứ vận hành ra sao, tốt nhất là từ một góc yên tĩnh.",
      "desire": "Hiểu thế giới và trở thành người có năng lực",
      "fear": "Bất lực, quá tải hoặc mù mờ",
      "desc": "Bạn tò mò, tinh ý và độc lập. Bạn thích đào sâu một chủ đề cho đến khi thật sự hiểu, và thường để ý những chi tiết, quy luật mà người khác bỏ qua. Bạn quý thời gian, năng lượng và sự riêng tư của mình, và cần khoảng trống để suy nghĩ trước khi hành động hay chia sẻ. Đôi khi bạn có thể ở trong đầu mình hơi lâu, hoặc rút lui khi người khác đòi hỏi nhiều hơn mức bạn sẵn sàng cho đi. Ở phiên bản tốt nhất, bạn rộng rãi chia sẻ hiểu biết và tự tin bước ra thế giới.",
      "keywords": ["Tò mò", "Thấu đáo", "Độc lập"],
      "strengths": ["Suy nghĩ sáng suốt khi người khác hoảng loạn", "Học sâu và giải thích được những ý tưởng phức tạp", "Giữ được sự khách quan và bình tĩnh"],
      "tips": ["Chia sẻ điều bạn biết trước khi thấy nó hoàn chỉnh. Ý tưởng còn dang dở của bạn thường đã hữu ích rồi.", "Thử làm bằng tay và cơ thể, không chỉ bằng đầu óc.", "Nói cho mọi người biết khi bạn cần ở một mình, để họ không hiểu sự im lặng của bạn là xa cách."],
      "growth": "Khi trưởng thành, bạn chuyển từ quan sát sang hành động, và sống tự tin, hiện diện hơn."
    },
    "type6": {
      "name": "Người Trung Thành",
      "word": "người trung thành",
      "vibe": "Bạn là người bạn biết lo xa, luôn có kế hoạch và ở lại vào lúc quan trọng.",
      "desire": "Cảm thấy an toàn, được hỗ trợ và tin chắc vào những người xung quanh",
      "fear": "Không có ai hỗ trợ hay chỉ đường",
      "desc": "Bạn tận tụy, có trách nhiệm và nhanh nhạy phát hiện điều có thể trục trặc, nhờ vậy bạn là người lập kế hoạch giỏi và một người bạn đáng tin. Bạn coi trọng lời cam kết và quan tâm sâu sắc đến người thân, cộng đồng của mình. Vì bạn tính trước mọi kịch bản, đầu óc bạn có thể đầy những nghi ngại, và bạn có thể cần thời gian mới tin được người khác, hay tin chính mình. Ở phiên bản tốt nhất, bạn can đảm và vững vàng, và tin vào phán đoán của bản thân nhiều như tin những người bạn yêu thương.",
      "keywords": ["Tận tụy", "Có trách nhiệm", "Chu toàn"],
      "strengths": ["Phát hiện vấn đề sớm và lên kế hoạch đối phó", "Sát cánh bên bạn bè lúc vui cũng như lúc khó", "Gắn kết mọi người quanh một mục tiêu chung"],
      "tips": ["Khi lo lắng cuộn xoáy, hãy viết ra điều đang thật sự diễn ra lúc này, chứ không phải điều có thể xảy ra.", "Mỗi ngày tự đưa ra một quyết định nhỏ mà không hỏi ai, và nhận ra mọi chuyện vẫn ổn.", "Hãy nhớ lại những gì bạn đã vượt qua. Bạn từng xử lý được những chuyện khó rồi."],
      "growth": "Khi trưởng thành, bạn thư thái hơn, tin vào cuộc sống thêm một chút và tìm thấy một trọng tâm bình yên, vững vàng."
    },
    "type7": {
      "name": "Người Nhiệt Huyết",
      "word": "người nhiệt huyết",
      "vibe": "Cuộc sống là một cuộc phiêu lưu, và bạn muốn nếm thử mọi hương vị trong thực đơn.",
      "desire": "Được hạnh phúc, tự do và có thật nhiều trải nghiệm hay",
      "fear": "Bị mắc kẹt trong đau khổ, buồn chán hay giới hạn",
      "desc": "Bạn lạc quan, tò mò và đầy ý tưởng. Bạn tìm ra niềm vui trong hầu hết mọi thứ, mau chóng lấy lại tinh thần, và năng lượng của bạn khiến mọi người xung quanh phấn chấn. Những nơi chốn, kế hoạch và khả năng mới khiến bạn bừng sáng. Vì luôn có điều thú vị tiếp theo, bạn có thể khó ở lâu với một việc, hay với những cảm xúc khó chịu. Ở phiên bản tốt nhất, bạn kết hợp niềm vui với sự tập trung và chiều sâu, và khám phá ra rằng sống trọn khoảnh khắc hiện tại có thể còn tuyệt hơn kế hoạch tiếp theo.",
      "keywords": ["Lạc quan", "Tò mò", "Ngẫu hứng"],
      "strengths": ["Mang năng lượng và niềm vui đến bất kỳ nhóm nào", "Nhanh chóng nghĩ ra giải pháp sáng tạo", "Mau chóng đứng dậy sau vấp ngã"],
      "tips": ["Hoàn thành một kế hoạch trước khi bắt đầu kế hoạch tiếp theo, và tận hưởng cảm giác làm xong đó.", "Khi có điều gì làm bạn đau, hãy cho phép mình cảm nhận nó một lúc trước khi tìm cách xao nhãng.", "Thỉnh thoảng thử một giờ chậm rãi, yên tĩnh. Sự bình lặng cũng có thể là một kiểu phiêu lưu."],
      "growth": "Khi trưởng thành, bạn chậm lại, tập trung sâu hơn và tận hưởng những khoảnh khắc yên tĩnh, chiêm nghiệm."
    },
    "type8": {
      "name": "Người Thách Thức",
      "word": "người thách thức",
      "vibe": "Bạn nói thẳng, bảo vệ người của mình và không bao giờ lùi bước trước thử thách.",
      "desire": "Được mạnh mẽ, làm chủ cuộc đời mình và bảo vệ người khác",
      "fear": "Bị kiểm soát, bị tổn hại hoặc bất lực",
      "desc": "Bạn tự tin, thẳng thắn và tràn đầy năng lượng. Bạn đứng ra nắm quyền khi mọi chuyện rối tung, lên tiếng cho những người không thể tự bảo vệ mình, và người khác thấy an toàn khi có bạn đứng về phía họ. Bạn coi trọng sự trung thực và tôn trọng sức mạnh. Đôi khi sự mãnh liệt của bạn có thể khiến người khác thấy hơi quá, và bạn có thể giấu đi những cảm xúc mềm mỏng để không bao giờ trông yếu đuối. Ở phiên bản tốt nhất, bạn dùng sức mạnh của mình để nâng đỡ người khác, và để những người bạn tin tưởng thấy trái tim lớn, ấm áp của bạn.",
      "keywords": ["Mạnh mẽ", "Che chở", "Thẳng thắn"],
      "strengths": ["Quyết đoán và nắm quyền chỉ huy trong khủng hoảng", "Bảo vệ những người bị đối xử bất công", "Nói thật khi người khác còn ngần ngại"],
      "tips": ["Trước khi gây sức ép, hãy hỏi thêm một câu và thật sự lắng nghe câu trả lời.", "Cho người bạn tin tưởng thấy mặt mềm mỏng của bạn. Đó là sức mạnh, không phải yếu đuối.", "Để ý khi bạn đang chạy hết công suất, và chọn xem trận chiến nào thật sự đáng."],
      "growth": "Khi trưởng thành, bạn mở lòng và dùng sức mạnh của mình để chăm sóc người khác một cách dịu dàng."
    },
    "type9": {
      "name": "Người Hòa Giải",
      "word": "người hòa giải",
      "vibe": "Bạn mang sự bình yên đến mọi nơi và nhìn thấy mọi mặt của câu chuyện.",
      "desire": "Có được bình yên bên trong và hòa hợp với người khác",
      "fear": "Xung đột, mất kết nối hoặc bị tách rời",
      "desc": "Bạn dễ tính, kiên nhẫn và bao dung. Bạn nhìn được nhiều góc độ, làm dịu những tình huống căng thẳng, và mọi người cảm thấy thoải mái, được chấp nhận khi ở bên bạn. Bạn thường là chất keo giữ cho cả nhóm gắn kết. Vì muốn mọi thứ êm đẹp, bạn có thể chiều theo người khác, gác lại ưu tiên của mình hoặc tránh nói ra điều bạn thật sự nghĩ. Ở phiên bản tốt nhất, bạn vững vàng và hiện diện trọn vẹn, và biết rằng tiếng nói cùng mong muốn của bạn quan trọng chẳng kém bất kỳ ai.",
      "keywords": ["Điềm tĩnh", "Bao dung", "Hỗ trợ"],
      "strengths": ["Xoa dịu mâu thuẫn và giúp mọi người hiểu nhau", "Lắng nghe mà không phán xét", "Tạo ra bầu không khí thoải mái, thân thiện"],
      "tips": ["Hãy hỏi mình muốn gì trước khi hỏi người khác muốn gì.", "Mỗi sáng chọn một việc quan trọng và làm nó trước tiên.", "Chia sẻ ý kiến thật lòng của bạn một cách tử tế. Một chút va chạm có thể khiến mối quan hệ bền chặt hơn."],
      "growth": "Khi trưởng thành, bạn bừng tỉnh với mục tiêu của chính mình và hành động đầy năng lượng, tập trung."
    }
  }
};
