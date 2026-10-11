/* Trắc nghiệm MBTI miễn phí – 16 nhóm tính cách (vi) — cấu trúc và quy tắc: xem đầu tệp en.js */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trắc nghiệm MBTI miễn phí – 16 nhóm tính cách",
    "description": "Làm trắc nghiệm MBTI miễn phí: 20 câu đời thường, 3 phút, không cần đăng ký. Tìm nhóm tính cách 4 chữ cái của bạn kèm tỉ lệ thật, điểm mạnh và người hợp nhất.",
    "ogTitle": "Trắc nghiệm MBTI 🧩 Bạn là nhóm nào trong 16 nhóm?",
    "ogDescription": "20 câu đời thường, 3 phút. Tìm ra nhóm 4 chữ cái của bạn."
  },
  "siteName": "Trắc nghiệm MBTI",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🧩 16 nhóm tính cách",
    "h1Kicker": "Trắc nghiệm MBTI",
    "h1Html": "Trong 16 nhóm tính cách<br><em>bạn là nhóm nào</em>?",
    "hook": "Hai mươi câu ngắn về cuộc sống hằng ngày. Chỉ cần chọn bạn đồng ý đến đâu, rồi xem nhóm 4 chữ cái của bạn và bạn nghiêng về phía nào bao nhiêu.",
    "metaTime": "⏱️ 3 phút",
    "metaCount": "✏️ 20 câu",
    "start": "Bắt đầu làm →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}",
    "scale": [
      "Hoàn toàn không đúng",
      "Không đúng lắm",
      "Không chắc",
      "Khá đúng",
      "Rất đúng"
    ]
  },
  "loading": {
    "text": "Đang đọc câu trả lời của bạn…",
    "sub": "Đang ghép 4 chữ cái"
  },
  "axes": [
    { "a": "Hướng ngoại", "b": "Hướng nội" },
    { "a": "Giác quan", "b": "Trực giác" },
    { "a": "Lý trí", "b": "Cảm xúc" },
    { "a": "Nguyên tắc", "b": "Linh hoạt" }
  ],
  "result": {
    "title": "Kết quả trắc nghiệm MBTI: {code} – {name}",
    "metaDesc": "Kết quả trắc nghiệm MBTI miễn phí {code}: {name}. {vibe}",
    "eyebrow": "Nhóm của bạn là",
    "barsLabel": "Bạn nghiêng về đâu",
    "strengthsLabel": "Điểm mạnh",
    "blindLabel": "Điểm mù",
    "workLabel": "Khi làm việc",
    "loveLabel": "Khi yêu",
    "bestLabel": "Hợp nhất",
    "clashLabel": "Dễ va chạm",
    "sameShare": "{pct}% người chơi cũng ra nhóm này",
    "shareText": "Mình là {code} {emoji} “{name}”. {vibe} Còn bạn thuộc nhóm nào?",
    "ctaStrong": "Bạn của bạn vừa chia sẻ nhóm tính cách",
    "ctaSub": "Còn bạn thì sao? 20 câu, 3 phút.",
    "retry": "Làm lại trắc nghiệm",
    "disclaimer": "Đây là trắc nghiệm giải trí không chính thức, lấy cảm hứng từ mô hình 16 nhóm. Không phải bài đánh giá MBTI® chính thức và không liên quan đến The Myers-Briggs Company. MBTI là nhãn hiệu của chủ sở hữu."
  },
  "og": {
    "eyebrow": "Nhóm của mình là",
    "brand": "🧩 Trắc nghiệm MBTI",
    "defaultKicker": "16 nhóm tính cách",
    "defaultTitle": "Bạn thuộc nhóm nào?",
    "defaultDesc": "20 câu đời thường · 3 phút"
  },
  "faq": [
    {
      "q": "Đây có phải bài trắc nghiệm MBTI chính thức không?",
      "a": "Không. Đây là trắc nghiệm giải trí không chính thức, lấy cảm hứng từ mô hình 16 nhóm. Không phải bài đánh giá MBTI® chính thức và không liên quan đến The Myers-Briggs Company. MBTI là nhãn hiệu của chủ sở hữu."
    },
    {
      "q": "Nhóm của tôi được tính thế nào?",
      "a": "Mỗi câu nghiêng về một phía của một trong bốn cặp. Câu trả lời được cộng theo từng cặp, phía nào nhiều điểm hơn sẽ cho chữ cái đó. Thanh tỉ lệ cho biết bạn nghiêng về mỗi phía bao nhiêu."
    },
    {
      "q": "Sao lần này kết quả lại khác?",
      "a": "Nếu một cặp gần 50%, chỉ cần tâm trạng thay đổi một chút là chữ cái có thể đổi. Hãy trả lời theo con người thường ngày của bạn, và xem cặp sát nút là dấu hiệu bạn dùng cả hai phía."
    },
    {
      "q": "Câu trả lời của tôi có được lưu lại không?",
      "a": "Không. Câu trả lời chỉ được tính trong trình duyệt của bạn và không bao giờ được lưu. Chúng tôi chỉ đếm ẩn danh nhóm nào được ra, để cho biết mỗi nhóm phổ biến đến đâu."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm MBTI",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm MBTI: cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm MBTI (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời được tính ngay trong trình duyệt và không bao giờ được gửi tới hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh nhóm nào được ra, để cho biết mỗi nhóm phổ biến đến đâu."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác. Tìm hiểu thêm và thay đổi cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, lượt hoàn thành, đánh giá) để cải thiện Dịch vụ. Các con số này không nhận diện được cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về chính sách quyền riêng tư này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 12 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại trắc nghiệm"
  },
  "questions": [
    { "q": "Sau một cuối tuần kín lịch hẹn hò, gặp gỡ, mình thấy được nạp đầy năng lượng chứ không phải kiệt sức." },
    { "q": "Mình hay bất chợt mơ màng tưởng tượng “nếu như…”." },
    { "q": "Khi bạn bè tâm sự chuyện buồn, phản xạ đầu tiên của mình là nghĩ cách giải quyết." },
    { "q": "Mình thường soạn đồ đi du lịch vào tối hôm trước, có khi sáng hôm đi mới soạn." },
    { "q": "Khi nhóm chat Zalo rôm rả, mình thường im lặng đọc trước rồi mới tham gia." },
    { "q": "Nấu ăn theo công thức, mình làm đúng từng định lượng." },
    { "q": "Mình thích chọn quán mà ai cũng thấy thoải mái hơn là quán được chấm điểm cao nhất." },
    { "q": "Cuối tuần có kế hoạch sẵn thì mình mới thấy yên tâm." },
    { "q": "Ở lớp mới hay chỗ làm mới, mình thường là người bắt chuyện trước." },
    { "q": "Xem phim xong, mình tò mò ý nghĩa ẩn giấu hơn là chuyện gì thực sự đã xảy ra." },
    { "q": "Khi thảo luận, nói cho chính xác quan trọng với mình hơn là giữ không khí vui vẻ." },
    { "q": "Mình thích để ngỏ các lựa chọn hơn là quyết định sớm." },
    { "q": "Tối thứ Sáu lý tưởng của mình là ở nhà ấm cúng, một mình hoặc với một người bạn thân." },
    { "q": "Mình tin vào những gì tự mắt thấy, tự tay thử hơn là linh cảm về tương lai." },
    { "q": "Khi đưa ra quyết định lớn, mình nghĩ trước tiên đến ảnh hưởng tới những người xung quanh." },
    { "q": "Gạch từng việc trong danh sách việc cần làm là một niềm vui nho nhỏ của mình." },
    { "q": "Mình hay vừa nói vừa nghĩ. Nói ra rồi mình mới rõ mình muốn gì." },
    { "q": "Có ý tưởng mới là mình hào hứng ngay, dù chưa biết có thành hay không." },
    { "q": "Mình có thể góp ý thẳng thắn mà không áy náy lâu." },
    { "q": "Kế hoạch thay đổi đột ngột khiến mình thấy hứng thú hơn là căng thẳng." }
  ],
  "types": {
    "intj": {
      "name": "Kiện tướng cờ vua trầm lặng",
      "word": "cờ vua",
      "vibe": "Luôn đi trước ba nước, và rất bình tĩnh.",
      "desc": "Bạn nhìn thấy bức tranh tổng thể và lặng lẽ vạch kế hoạch để đi tới đó. Bạn coi trọng năng lực, suy nghĩ độc lập và hiếm khi làm gì mà không có lý do. Lúc đầu bạn có vẻ kiệm lời, nhưng cuối cùng ý tưởng của bạn thường là thứ được giữ lại.",
      "strengths": ["Tầm nhìn dài hạn", "Độc lập", "Giải quyết vấn đề sắc bén"],
      "blind": ["Dễ bị cho là lạnh lùng", "Ngại chuyện xã giao", "Khắt khe với ý tưởng nửa vời"],
      "work": "Bạn tỏa sáng khi được giao một bài toán phức tạp và tự do thiết kế lời giải theo cách của mình.",
      "love": "Bạn thể hiện tình cảm bằng sự chung thủy và hành động thay vì lời hoa mỹ, và muốn một người cùng suy nghĩ với mình."
    },
    "intp": {
      "name": "Phòng thí nghiệm ý tưởng",
      "word": "phòng thí nghiệm",
      "vibe": "Lúc nào cũng hỏi “nhưng tại sao?”.",
      "desc": "Đầu óc bạn là một phòng thí nghiệm không bao giờ đóng cửa. Bạn thích tháo rời ý tưởng để xem chúng vận hành ra sao, và mê một lý thuyết hay hơn một câu trả lời nhanh. Bạn thoải mái, cởi mở và hài hước bất ngờ khi đã thân.",
      "strengths": ["Tò mò vô tận", "Logic", "Suy nghĩ độc đáo"],
      "blind": ["Hay chìm vào suy nghĩ", "Làm dở dang", "Tranh luận mà quên cảm xúc"],
      "work": "Bạn làm tốt nhất khi được tự do khám phá, có một câu đố khó và ít cuộc họp vô bổ.",
      "love": "Bạn cần một người thích những cuộc trò chuyện sâu và hơi lạ, và cho bạn không gian để suy nghĩ."
    },
    "entj": {
      "name": "Đội trưởng bẩm sinh",
      "word": "đội trưởng",
      "vibe": "Nhìn thấy mục tiêu và kéo cả đội đi tới.",
      "desc": "Bạn quyết đoán, tràn đầy năng lượng và sinh ra để dẫn dắt. Khi cả nhóm bế tắc, bạn là người chỉ hướng và khiến mọi thứ chuyển động. Bạn thích thử thách và kỳ vọng nhiều ở bản thân lẫn người khác.",
      "strengths": ["Lãnh đạo bẩm sinh", "Quyết đoán", "Hướng tới mục tiêu"],
      "blind": ["Đôi khi áp đặt", "Sốt ruột với nhịp chậm", "Quên nghỉ ngơi"],
      "work": "Chỉ cần một đội, một hạn chót và một mục tiêu lớn, bạn sẽ vạch ra đường đi tới chiến thắng.",
      "love": "Bạn tận tâm và che chở, và quý người dám đối đáp ngang hàng với mình."
    },
    "entp": {
      "name": "Tia lửa tranh luận",
      "word": "tia lửa",
      "vibe": "Mọi quy tắc chỉ là lời mở màn để phản biện.",
      "desc": "Bạn nhanh trí, tinh nghịch và đầy ý tưởng. Bạn thích thử giới hạn, tìm lỗ hổng trong kế hoạch và tranh luận cho vui, kể cả bênh phía mà mình không tin. Kẻ thù duy nhất của bạn là sự nhàm chán.",
      "strengths": ["Nhanh trí", "Sáng tạo", "Ăn nói có duyên"],
      "blind": ["Cãi cho vui", "Khởi đầu nhiều hơn kết thúc", "Ghét lặp lại"],
      "work": "Bạn bùng nổ trong các buổi brainstorm, thuyết trình và những bài toán chưa ai giải được.",
      "love": "Bạn muốn một người cười với câu đùa của bạn, phản bác ý tưởng của bạn và không bao giờ để mọi thứ nhạt nhẽo."
    },
    "infj": {
      "name": "Nhà tiên tri dịu dàng",
      "word": "nhà tiên tri",
      "vibe": "Lặng lẽ đọc được bầu không khí, và cả tương lai.",
      "desc": "Bạn sâu sắc, lý tưởng và rất biết quan tâm. Bạn thường cảm nhận được người khác đang nghĩ gì trước khi họ nói, và muốn cuộc đời mình có ý nghĩa. Bạn kín đáo, nhưng hết lòng với số ít người bạn cho phép bước vào.",
      "strengths": ["Thấu hiểu sâu sắc", "Có nguyên tắc", "Biết lắng nghe"],
      "blind": ["Ôm lo âu của người khác", "Cầu toàn", "Giấu nhu cầu của mình"],
      "work": "Bạn mạnh nhất khi công việc có ý nghĩa với bạn và thực sự giúp được mọi người.",
      "love": "Bạn tìm kiếm sự kết nối tri kỷ và dành cho người ấy sự quan tâm trọn vẹn, tinh tế."
    },
    "infp": {
      "name": "Nhà thơ mơ mộng",
      "word": "nhà thơ",
      "vibe": "Trái tim mềm mại và thế giới nội tâm phong phú.",
      "desc": "Bạn tử tế, giàu trí tưởng tượng và sống theo giá trị của riêng mình. Bạn thấy cái đẹp trong những điều nhỏ bé và cảm nhận mọi thứ rất sâu, dù không phải lúc nào cũng thể hiện ra. Bạn muốn sống thật với mình và khiến thế giới dịu dàng hơn một chút.",
      "strengths": ["Giàu đồng cảm", "Sáng tạo", "Sống đúng giá trị"],
      "blind": ["Dễ tổn thương khi bị chê", "Né tránh xung đột", "Mơ mộng quá hạn chót"],
      "work": "Bạn nở rộ với những việc sáng tạo có ý nghĩa, trong một nhóm tôn trọng cách làm của bạn.",
      "love": "Bạn lãng mạn và chung thủy, cần một người hiểu cảm xúc của bạn mà không phán xét."
    },
    "enfj": {
      "name": "Người truyền lửa ấm áp",
      "word": "truyền lửa",
      "vibe": "Luôn khơi dậy điều tốt nhất ở mỗi người.",
      "desc": "Bạn ấm áp, hay động viên và có năng khiếu với con người. Bạn thấy được tiềm năng của người khác và thích giúp họ trưởng thành. Mọi người tự nhiên tụ quanh bạn, vì bạn khiến ai cũng thấy mình thuộc về.",
      "strengths": ["Truyền cảm hứng", "Tinh ý", "Hào phóng"],
      "blind": ["Ôm đồm quá nhiều", "Cần được công nhận", "Quên giới hạn của bản thân"],
      "work": "Bạn tỏa sáng khi làm người hướng dẫn, người kết nối hoặc giữ cho cả đội luôn có động lực.",
      "love": "Bạn chu đáo, tinh tế và thật lòng nỗ lực để mối quan hệ lớn lên."
    },
    "enfp": {
      "name": "Tâm hồn tự do rạng rỡ",
      "word": "tâm hồn tự do, rạng rỡ",
      "vibe": "Háo hức với con người, ý tưởng và mọi thứ.",
      "desc": "Bạn nhiệt tình, sáng tạo và tò mò về mọi người mình gặp. Bạn thấy cơ hội ở khắp nơi và năng lượng của bạn làm bừng sáng cả căn phòng. Bạn cần tự do và một chút phiêu lưu, và luôn mang hơi ấm vào mọi kế hoạch.",
      "strengths": ["Nhiệt huyết", "Giàu tưởng tượng", "Thân thiện với tất cả"],
      "blind": ["Dễ xao nhãng", "Ghét lặp lại", "Đêm hay nghĩ nhiều"],
      "work": "Bạn rất hợp với vai trò sáng tạo, tiếp xúc nhiều người, nơi mỗi ngày đều có điều mới.",
      "love": "Bạn rung động vì sự đồng điệu và niềm vui, muốn một người cùng tò mò về cuộc sống như mình."
    },
    "istj": {
      "name": "Tảng đá đáng tin",
      "word": "tảng đá",
      "vibe": "Đã nói là làm, lần nào cũng vậy.",
      "desc": "Bạn có trách nhiệm, bền bỉ và kỹ lưỡng. Bạn giữ lời hứa, tôn trọng những cách làm đã được kiểm chứng và thích mọi thứ được làm đến nơi đến chốn. Giữa thế giới hỗn loạn, ai cũng biết có thể dựa vào bạn.",
      "strengths": ["Đáng tin cậy", "Ngăn nắp", "Tỉ mỉ"],
      "blind": ["Khó thích nghi thay đổi đột ngột", "Có vẻ cứng nhắc", "Giữ cảm xúc cho riêng mình"],
      "work": "Bạn làm tốt nhất khi mục tiêu rõ ràng, nhịp làm việc ổn định và được giao trách nhiệm từ đầu đến cuối.",
      "love": "Bạn thể hiện tình cảm bằng sự kiên định và quan tâm thiết thực, và rất coi trọng cam kết."
    },
    "isfj": {
      "name": "Người bảo hộ chu đáo",
      "word": "người bảo hộ",
      "vibe": "Nhớ cả sinh nhật lẫn món ăn vặt bạn thích.",
      "desc": "Bạn hiền hậu, trung thành và lặng lẽ tinh ý. Bạn nhận ra người khác cần gì và âm thầm lo liệu. Bạn trân trọng sự hòa thuận và truyền thống, khiến nơi nào cũng an toàn và ấm áp.",
      "strengths": ["Chu đáo", "Trung thành", "Chăm chỉ"],
      "blind": ["Khó từ chối", "Đánh giá thấp bản thân", "Hay lo lắng"],
      "work": "Bạn là chỗ dựa vững vàng mà đội nào cũng cần, nhất là ở nơi đòi hỏi sự cẩn thận và chính xác.",
      "love": "Bạn yêu bằng những cử chỉ nhỏ mỗi ngày và mong người ấy nhận ra."
    },
    "estj": {
      "name": "Trưởng ban tổ chức",
      "word": "trưởng ban",
      "vibe": "Có kế hoạch, có danh sách và cả danh sách dự phòng.",
      "desc": "Bạn thực tế, thẳng thắn và rất giỏi điều hành mọi việc. Bạn thích quy tắc rõ ràng, sự công bằng và kết quả nhìn thấy được. Khi cần sắp xếp điều gì, bạn xung phong và làm cho xong.",
      "strengths": ["Hiệu quả", "Giao tiếp rõ ràng", "Có trách nhiệm"],
      "blind": ["Đôi khi nói thẳng quá", "Kém linh hoạt", "Hay đánh giá tốc độ người khác"],
      "work": "Bạn nổi bật khi quản lý dự án và con người, nhất là khi cấu trúc và hạn chót quan trọng.",
      "love": "Bạn đáng tin và thẳng thắn, thể hiện tình cảm bằng cách cùng xây một cuộc sống ổn định."
    },
    "esfj": {
      "name": "Chủ tiệc hào phóng",
      "word": "chủ tiệc",
      "vibe": "Đảm bảo ai cũng có chỗ ngồi và đồ ăn vặt.",
      "desc": "Bạn thân thiện, hòa đồng và biết quan tâm. Bạn thích gom mọi người lại và đảm bảo không ai bị bỏ rơi. Bạn nắm bắt tâm trạng rất nhanh và cố gắng để ai cũng vui.",
      "strengths": ["Ấm áp", "Hợp tác tốt", "Khéo tiếp đãi"],
      "blind": ["Nhạy cảm với lời chê", "Rất cần hòa khí", "Luôn để mình sau cùng"],
      "work": "Bạn phát huy tốt trong vai trò đồng đội, nơi có thể hỗ trợ người khác và giúp mọi việc trôi chảy.",
      "love": "Bạn tình cảm và tận tụy, thích cùng người ấy tạo ra những thói quen riêng của hai người."
    },
    "istp": {
      "name": "Thợ sửa chữa điềm tĩnh",
      "word": "thợ sửa",
      "vibe": "Bình tĩnh khi có biến, khéo tay với mọi thứ.",
      "desc": "Bạn thực tế, độc lập và giữ được bình tĩnh dưới áp lực. Bạn học bằng cách làm, thích tìm hiểu mọi thứ hoạt động ra sao và vẫn điềm nhiên khi người khác hoảng loạn. Bạn coi trọng tự do và nói ít.",
      "strengths": ["Khéo tay", "Bình tĩnh khi khủng hoảng", "Xoay xở giỏi"],
      "blind": ["Khó đoán", "Không thích kế hoạch dài", "Chán việc lặp lại"],
      "work": "Bạn tỏa sáng khi được giải quyết vấn đề thực tế bằng đôi tay và kỹ năng của mình.",
      "love": "Bạn thể hiện tình cảm bằng hành động và những hoạt động làm cùng nhau hơn là lời nói."
    },
    "isfp": {
      "name": "Nghệ sĩ lặng lẽ",
      "word": "nghệ sĩ",
      "vibe": "Sống trọn khoảnh khắc, thật đẹp.",
      "desc": "Bạn dịu dàng, nhạy cảm và sáng tạo một cách lặng lẽ. Bạn thể hiện bản thân qua phong cách, tác phẩm hay những cử chỉ nhỏ hơn là lời nói dài dòng. Bạn trân trọng tự do và lòng tốt, sống theo gu riêng của mình.",
      "strengths": ["Có gu thẩm mỹ", "Dễ chịu", "Tốt bụng"],
      "blind": ["Ngại lập kế hoạch", "Giữ cảm xúc trong lòng", "Ngại ngùng chỗ đông người"],
      "work": "Bạn làm tốt nhất khi có tự do sáng tạo, không gian yên tĩnh và công việc có ý nghĩa với mình.",
      "love": "Bạn dịu dàng và chung thủy, thể hiện tình cảm bằng những bất ngờ tinh tế."
    },
    "estp": {
      "name": "Kẻ săn cảm giác mạnh",
      "word": "cảm giác mạnh",
      "vibe": "Nhảy trước, nghĩ sau khi đang bay.",
      "desc": "Bạn táo bạo, tràn trề năng lượng và hành động nhanh. Bạn thích hành động, phiêu lưu và một chút mạo hiểm. Bạn đọc vị người khác giỏi, ứng biến nhanh và mang sự sôi động tới mọi nơi.",
      "strengths": ["Hành động ngay", "Có sức thuyết phục", "Thích nghi tốt"],
      "blind": ["Bốc đồng", "Chán lý thuyết", "Thích thử giới hạn"],
      "work": "Bạn như cá gặp nước ở những công việc nhịp nhanh, được hành động, thương lượng và thấy kết quả ngay.",
      "love": "Bạn vui tính, ngẫu hứng và muốn một người sẵn sàng lao vào cuộc phiêu lưu cùng mình."
    },
    "esfp": {
      "name": "Ngôi sao sân khấu",
      "word": "ngôi sao, sân khấu",
      "vibe": "Bữa tiệc bắt đầu khi bạn bước vào.",
      "desc": "Bạn sôi nổi, tinh nghịch và ấm áp. Bạn yêu con người, âm nhạc và niềm vui của hiện tại. Bạn biến những ngày bình thường thành vui vẻ và thường là người đầu tiên làm ai đó vui lên.",
      "strengths": ["Biết tận hưởng", "Thân thiện", "Sống cho hiện tại"],
      "blind": ["Né chuyện nghiêm túc", "Mua sắm bốc đồng", "Nhanh chán"],
      "work": "Bạn tỏa sáng ở những vai trò sôi động, giao tiếp nhiều, nơi bạn làm việc với mọi người và giữ năng lượng luôn cao.",
      "love": "Bạn tình cảm và hào phóng, thích biến mỗi buổi hẹn thành một sự kiện."
    }
  }
};
