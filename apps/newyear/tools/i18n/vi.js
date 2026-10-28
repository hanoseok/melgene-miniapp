/* Bói vui năm mới (vi) — cấu trúc khóa giống en.js. Năm lấy từ newyear-core.js (YEAR), không gõ tay.
 * Thứ tự choices phải khớp en. Kết quả không có chữ số/%, không tiết lộ trước, không phải lời tiên đoán,
 * không có lời khuyên sức khỏe hay tài chính. Chỉ để vui.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `Bói vui năm mới ${Y} – từ khóa của bạn`,
    "description": `Bói vui năm mới ${Y}: 11 câu hỏi nhẹ nhàng, khoảng 2 phút, không cần đăng ký. Nhận từ khóa của năm cùng màu may mắn, tháng may mắn và vật may mắn. Chỉ để vui thôi.`,
    "ogTitle": `Bói vui năm mới ${Y} 🌅 Từ khóa năm nay của bạn là gì?`,
    "ogDescription": `Mười một câu hỏi nhẹ nhàng về cách bạn muốn sống trong năm ${Y}. Khám phá từ khóa, màu may mắn, tháng may mắn và vật may mắn của bạn.`
  },
  "siteName": `Bói vui năm mới ${Y}`,
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": `🌅 Xin chào ${Y}`,
    "h1Kicker": `Bói vui năm mới ${Y}`,
    "h1Html": `Năm ${Y} của bạn<br>sẽ <em>xoay quanh</em> điều gì?`,
    "hook": "Cuốn lịch mới, tia nắng đầu năm và cả một năm trang giấy còn trắng. Trả lời mười một câu hỏi nhẹ nhàng về cách bạn thích sống, rồi khám phá từ khóa, vật may mắn và những lời chúc nho nhỏ đang chờ bạn trong năm mới.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "✨ 11 câu hỏi",
    "start": "Xem năm của tôi →"
  },
  "quiz": {
    "backAria": "Câu hỏi trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang ngắm bình minh đầu năm…",
    "sub": "Đang viết quẻ năm mới cho bạn"
  },
  "result": {
    "title": `Từ khóa năm ${Y} của tôi: {name}`,
    "metaDesc": `Kết quả bói vui năm mới ${Y}: {name}. {vibe} Xem màu may mắn, tháng may mắn, vật may mắn và một chút vận may vui cho cả năm.`,
    "eyebrow": `Từ khóa năm ${Y} của bạn`,
    "colorLabel": "Màu may mắn",
    "monthLabel": "Tháng may mắn",
    "itemLabel": "Vật may mắn",
    "gaugeLabel": "Câu trả lời của bạn nghiêng về",
    "axes": [
      ["Điều mới mẻ", "Ổn định"],
      ["Cùng mọi người", "Thời gian riêng"],
      ["Lên kế hoạch", "Tùy hứng"]
    ],
    "fortuneLabel": "Năm của bạn trong nháy mắt",
    "areas": {
      "work": "Công việc & học tập",
      "money": "Chuyện tiền bạc",
      "love": "Mọi người & tình yêu",
      "self": "Chăm sóc bản thân"
    },
    "tipLabel": "Một quyết tâm nhỏ để thử",
    "buddyLabel": "Hợp nhau nhất",
    "rivalLabel": "Đối lập dễ mến",
    "disclaimer": "Chỉ để vui thôi. Từ khóa, vật may mắn và những lời chúc là ý tưởng vui cho năm mới, không phải lời tiên đoán và không phải lời khuyên về sức khỏe, tiền bạc hay cuộc sống.",
    "sameShare": "{pct}% người chơi nhận được từ khóa này",
    "shareText": `Từ khóa năm ${Y} của tôi là {name} {emoji} “{vibe}” Còn bạn thì sao?`,
    "ctaStrong": "Bạn của bạn vừa chia sẻ quẻ năm mới",
    "ctaSub": `Năm ${Y} của bạn sẽ xoay quanh điều gì? Biết ngay sau 2 phút.`,
    "retry": "Làm lại bài bói"
  },
  "months": ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"],
  "og": {
    "eyebrow": `Từ khóa năm ${Y} của tôi`,
    "brand": `🌅 Bói vui năm mới ${Y}`,
    "defaultKicker": "Trắc nghiệm năm mới nhẹ nhàng",
    "defaultTitle": `Năm ${Y} của bạn sẽ xoay quanh điều gì?`,
    "defaultDesc": "11 câu hỏi · 2 phút · vật may mắn"
  },
  "faq": [
    {
      "q": "Từ khóa của tôi được chọn như thế nào?",
      "a": "Mỗi câu trả lời đẩy nhẹ ba thang đo: thích điều mới mẻ hay nhịp sống ổn định, thích ở cùng mọi người hay có thời gian riêng, và thích lên kế hoạch trước hay để mọi thứ tùy hứng. Từ khóa của bạn là điểm gặp nhau của ba thang đo đó, và cùng một bộ câu trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Đây có phải là lời tiên đoán thật về năm của tôi không?",
      "a": "Không. Từ khóa, màu may mắn, tháng may mắn, vật may mắn và những lời chúc nhỏ đều là ý tưởng vui, không phải lời tiên đoán. Không ai biết trước một năm sẽ ra sao. Hãy coi kết quả như một cách thú vị để nghĩ xem năm nay bạn muốn làm gì."
    },
    {
      "q": "Làm lại thì có ra kết quả khác không?",
      "a": "Có. Nếu bạn trả lời khác đi, bạn có thể nhận một từ khóa khác. Nhiều người quay lại làm vào dịp Tết hoặc giữa năm, khi tâm trạng hay kế hoạch đã thay đổi."
    },
    {
      "q": "Câu trả lời của tôi có được lưu lại không?",
      "a": "Không. Câu trả lời được tính ngay trong trình duyệt của bạn và không được lưu. Chúng tôi chỉ đếm ẩn danh xem từ khóa nào xuất hiện, để cho biết từ khóa đó phổ biến đến mức nào."
    }
  ],
  "privacy": {
    "title": `Chính sách quyền riêng tư | Bói vui năm mới ${Y}`,
    "description": `Chính sách quyền riêng tư của Bói vui năm mới ${Y} — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.`,
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Bói vui năm mới (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi đến hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện, để cho biết mỗi kết quả phổ biến đến mức nào."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ (local storage) của trình duyệt để ghi nhớ ngôn ngữ của bạn, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động bình thường."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên những lần bạn truy cập trang này và các trang khác trước đây. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi giữ các số liệu tổng hợp ẩn danh theo ngày (lượt xem trang, số lượt làm xong, đánh giá) để cải thiện Dịch vụ. Những số liệu này không nhận diện cá nhân bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ với người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 29 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Bói vui năm mới"
  },
  "questions": [
    {
      "q": "Còn mười phút nữa là đến giao thừa. Bạn đang ở đâu?",
      "choices": [
        "Trên ghế sofa cùng những người thân yêu, bánh mứt bày sẵn, chẳng có kế hoạch gì",
        "Ở buổi đếm ngược mà bạn đã lên kế hoạch cho cả nhóm bạn từ mấy tuần trước",
        "Ở nhà một mình, viết mục tiêu năm tới vào cuốn sổ mới tinh",
        "Ở một nơi lạ trong chuyến đi một mình quyết định vào phút chót, ngắm người lạ ăn mừng"
      ]
    },
    {
      "q": "Một cuốn sổ kế hoạch mới cho cả năm vừa đặt lên bàn. Trang đầu tiên bạn ghi gì?",
      "choices": [
        "Danh sách những trò vui muốn thử cùng bạn bè. Ngày tháng tính sau",
        "Chưa ghi gì cả. Lúc nào có hứng thì viết",
        "Sinh nhật của mọi người và các buổi họp mặt gia đình, ghi trước tiên",
        "Một mục tiêu cá nhân thật lớn, chia nhỏ ra từng tháng"
      ]
    },
    {
      "q": "Bình minh đầu tiên của năm. Bạn đón nó thế nào?",
      "choices": [
        "Đặt báo thức, cầm cốc đồ uống ấm, lặng lẽ ngắm từ cửa sổ",
        "Ngẫu hứng nhảy lên chuyến tàu sớm tới một nơi chưa từng đến",
        "Dẫn cả nhóm leo đồi ngắm mặt trời, lộ trình và đồ ăn đã chuẩn bị sẵn",
        "Vẫn còn thức cùng bạn bè sau bữa tiệc, và tình cờ được ngắm"
      ]
    },
    {
      "q": "Quyết tâm năm mới của bạn nhiều khả năng là…",
      "choices": [
        "Học một kỹ năng mới, có lịch học và bảng theo dõi tiến độ",
        "Gọi điện hoặc ghé thăm những người mình thương thật đều đặn",
        "Nhận lời nhiều lời mời hơn và xem chúng dẫn mình đến đâu",
        "Không có quyết tâm gì lớn. Chỉ cần dịu dàng với bản thân hơn một chút"
      ]
    },
    {
      "q": "Có một dự án mới ở chỗ làm hoặc ở trường. Bạn sẽ…",
      "choices": [
        "Nhận phần chưa ai thử bao giờ và vừa làm vừa tìm cách",
        "Vào một nhóm mình thích và giúp ở bất cứ chỗ nào cần người",
        "Nhận phần mình rành và tự làm thật cẩn thận",
        "Xung phong dẫn dắt và cùng mọi người lên kế hoạch"
      ]
    },
    {
      "q": "Bất ngờ nhận được một khoản tiền nhỏ, như phong bao lì xì hay một khoản thưởng nhỏ.",
      "choices": [
        "Góp vào buổi họp mặt đã lên kế hoạch hoặc mua quà cho gia đình",
        "Đãi bạn bè một trận vui ngay lập tức",
        "Cất đi rồi quên luôn cho đến khi cần",
        "Dùng để đăng ký lớp học hoặc mua đồ cho việc mới đã định từ lâu"
      ]
    },
    {
      "q": "Một cuối tuần rảnh rỗi, lịch trống trơn. Chuyện gì sẽ xảy ra?",
      "choices": [
        "Bạn lên kế hoạch chuyến đi trong ngày cho cả nhóm đến nơi chưa ai biết",
        "Bạn dọn dẹp, chuẩn bị cho tuần tới và tận hưởng sự yên tĩnh",
        "Bạn một mình lang thang qua một khu phố chưa từng khám phá",
        "Bạn nhắn cho bạn bè “qua nhà chơi không?” rồi để ngày trôi tự nhiên"
      ]
    },
    {
      "q": "Trong một buổi gặp mặt đầu năm, một người bạn chưa từng quen ngồi cạnh bạn.",
      "choices": [
        "Mỉm cười, trò chuyện nhẹ nhàng và lặng lẽ thưởng thức đồ ăn",
        "Hỏi về công việc của họ. Biết đâu có điều để học cho mục tiêu của mình",
        "Giới thiệu họ với mọi người và bắt đầu một trò chơi",
        "Để ý cho họ thấy được chào đón và rủ họ đến buổi gặp lần sau"
      ]
    },
    {
      "q": "Sau một thời gian bận rộn, bạn thấy hơi mệt. Bạn nạp lại năng lượng thế nào?",
      "choices": [
        "Gọi cho bạn thân và tán gẫu đủ thứ chuyện hàng giờ",
        "Ngẫu hứng thử một điều hoàn toàn mới, chỉ cho riêng mình",
        "Tổ chức chuyến đi cuối tuần với bạn bè, có cả lịch trình",
        "Dành riêng một buổi tối yên tĩnh: ngủ sớm, một cuốn sách hay, một tách trà"
      ]
    },
    {
      "q": "Giữa năm, một cơ hội bất ngờ gõ cửa.",
      "choices": [
        "Cân nhắc kỹ, rồi bắt tay vào với một kế hoạch rõ ràng",
        "Để nó qua đi. Bạn đang hài lòng với nhịp sống hiện tại",
        "Bàn với những người thân thiết nhất trước khi quyết định",
        "Nhảy vào ngay và rủ thêm một người bạn đi cùng"
      ]
    },
    {
      "q": "Hãy hình dung đêm giao thừa năm sau. Điều gì khiến bạn tự hào nhất?",
      "choices": [
        "Một cuốn sổ đầy những thói quen nhỏ mà bạn thật sự giữ được",
        "Một mục tiêu lớn mà cả nhóm cùng nhau đạt được",
        "Một năm đầy những khoảnh khắc ấm áp bên người mình thương",
        "Cả kho chuyện kể từ những điều lần đầu tiên được thử"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "Hải Trình Vươn Khơi",
      "word": "hải trình",
      "vibe": "Bạn vạch hướng đi, và thủy thủ đoàn vui vẻ ra khơi cùng bạn.",
      "desc": "Năm nay có thể là năm giương buồm. Bạn thích những chân trời mới, nhưng chẳng bao giờ rời bến mà thiếu bản đồ, và hiếm khi đi một mình. Mọi người tin kế hoạch của bạn vì bạn luôn nghĩ đến từng người trên thuyền. Những mục tiêu lớn làm cùng nhau rất hợp với bạn năm nay: một dự án nhóm, một chuyến đi cả hội, một thử thách cùng bạn bè. Cứ giữ vững hướng đi, nhưng nhớ ngắm cảnh dọc đường nhé.",
      "keywords": ["Kế hoạch táo bạo", "Tinh thần đồng đội", "Chân trời mới"],
      "color": "Xanh đại dương",
      "item": "Một tấm bản đồ giấy của nơi bạn muốn đến",
      "fortune": {
        "work": "Một năm tốt để bắt đầu điều gì đó lớn hơn sức một người. Khả năng gắn kết mọi người của bạn có thể mở ra những cánh cửa thú vị.",
        "money": "Để dành cho một mục tiêu chung, như một chuyến đi hay một dịp ăn mừng, có thể tạo nhiều động lực hơn là để dành cho có.",
        "love": "Mọi người hay quây quần quanh bạn. Nhớ hỏi thủy thủ đoàn xem họ thế nào, chứ không chỉ hỏi kế hoạch tới đâu rồi.",
        "self": "Hãy xếp lịch nghỉ ngơi như cách bạn xếp mọi việc khác. Thuyền trưởng nào cũng cần một đêm yên bình ở bến."
      },
      "tip": "Viết ra một chuyến phiêu lưu bạn muốn cùng ai đó trải qua năm nay, rồi cùng nhau chọn tháng."
    },
    "festival": {
      "name": "Lễ Hội Rực Rỡ",
      "word": "lễ hội",
      "vibe": "Bạn biến những ngày bình thường thành những buổi tiệc nho nhỏ.",
      "desc": "Năm của bạn có thể giống một mùa vui dài với rất nhiều sân khấu nhỏ. Bạn thích thử điều mới, thích làm cùng người khác, và tốt nhất là đừng kế hoạch quá nhiều. Năng lượng của bạn kéo mọi người lại gần nhau và biến một ngày thứ Ba buồn tẻ thành bữa tiệc. Năm nay, sự cởi mở của bạn có thể mang đến bạn mới và những lời mời bất ngờ. Chỉ cần chừa chút chỗ trong lịch để kịp thở.",
      "keywords": ["Vui tươi", "Hòa đồng", "Ngẫu hứng"],
      "color": "Hồng san hô rạng rỡ",
      "item": "Một chùm bóng bay nhiều màu",
      "fortune": {
        "work": "Ý tưởng mới đến dễ dàng khi bạn cùng mọi người động não. Một cách tiếp cận vui vẻ có khi giải được bài toán mà vẻ mặt nghiêm trọng bó tay.",
        "money": "Những khoảnh khắc vui cùng nhau rất quan trọng với bạn. Một hũ nhỏ dành cho những buổi đi chơi có thể giữ cho cả ví lẫn tâm trạng đều vui.",
        "love": "Vòng bạn bè của bạn có thể rộng ra năm nay. Một người tình cờ gặp có thể trở thành bạn tốt.",
        "self": "Cân bằng những tuần bận rộn bằng vài buổi tối chậm rãi. Bạn tỏa sáng hơn khi được nghỉ ngơi đủ."
      },
      "tip": "Tổ chức một buổi ăn mừng nho nhỏ chẳng vì lý do gì, và mời một người bạn muốn thân hơn."
    },
    "summit": {
      "name": "Đỉnh Núi Cao Vời",
      "word": "đỉnh núi",
      "vibe": "Một mục tiêu rõ ràng, một chặng leo vững vàng, một khung cảnh tuyệt đẹp trên cao.",
      "desc": "Năm nay trông như một ngọn núi bạn tự chọn để chinh phục. Bạn thích thử thách thật sự, thích chuẩn bị kỹ và thoải mái tập trung vào con đường riêng. Từng bước một, bạn có thể tiến bộ rõ rệt ở điều quan trọng với mình: một kỹ năng, một dự án, một kỷ lục cá nhân. Bạn không cần khán giả, nhưng khung cảnh trên cao sẽ đáng để kể lại. Hãy ăn mừng những trạm dừng nhỏ dọc đường.",
      "keywords": ["Tập trung", "Quyết tâm", "Chuẩn bị kỹ"],
      "color": "Xanh lá thông",
      "item": "Một đôi giày thể thao êm chân",
      "fortune": {
        "work": "Khả năng tập trung sâu là thế mạnh của bạn. Một dự án dài hơi hay một kỹ năng mới có thể lớn dần nhờ sự kiên trì của bạn.",
        "money": "Mục tiêu rõ ràng cũng giúp ích ở đây. Biết mình để dành cho điều gì có thể giúp những lựa chọn nhỏ dễ dàng hơn.",
        "love": "Có thể bạn đang mải leo núi, nên một tin nhắn ngắn gửi bạn cũ có khi ý nghĩa hơn bạn tưởng.",
        "self": "Ngày nghỉ là một phần của mọi chuyến leo tốt. Hãy lên kế hoạch cho chúng nghiêm túc như ngày tập."
      },
      "tip": "Chọn một mục tiêu cho cả năm và đánh dấu ba trạm kiểm tra nhỏ trên lịch."
    },
    "adventure": {
      "name": "Con Đường Tự Do",
      "word": "con đường tự do",
      "vibe": "Không bản đồ cũng chẳng sao. Mỗi khúc rẽ là một câu chuyện mới.",
      "desc": "Năm của bạn có thể như một chuyến đi đường dài không có điểm đến cố định. Bạn đi theo sự tò mò, tận hưởng thời gian một mình và sẵn sàng đổi hướng khi gặp điều gì thú vị. Sự tự do ấy đưa bạn tới những nơi chốn và ý tưởng mà người khác bỏ lỡ. Đây có thể là năm của những lần đầu tiên: một thành phố mới, một sở thích mới, một cách nhìn mới. Hãy mang theo một cuốn sổ, vì bạn sẽ muốn nhớ những lối rẽ bất ngờ.",
      "keywords": ["Tò mò", "Phóng khoáng", "Độc lập"],
      "color": "Cam hoàng hôn",
      "item": "Một chiếc ba lô nhẹ",
      "fortune": {
        "work": "Những lối đi khác thường có thể hợp với bạn. Thử một cách chưa ai dùng có khi dẫn tới ý tưởng hay nhất của bạn.",
        "money": "Trải nghiệm quan trọng với bạn hơn đồ vật. Một hũ tiền du lịch nho nhỏ có thể biến mong ước thành chuyến đi thật.",
        "love": "Bạn gặp nhiều người thú vị trên đường. Hãy để vài người trong số họ ở lại câu chuyện của bạn lâu hơn một chương.",
        "self": "Tự do là năng lượng của bạn. Nhưng cũng nhớ có một góc ấm cúng để quay về."
      },
      "tip": "Mỗi mùa thử một điều hoàn toàn mới, và viết một dòng về cảm giác lúc ấy."
    },
    "nest": {
      "name": "Tổ Ấm Yêu Thương",
      "word": "tổ ấm",
      "vibe": "Bạn xây một mái nhà nơi ai cũng thấy được chào đón.",
      "desc": "Năm nay có thể là năm xây dựng điều gì đó ấm áp và bền lâu. Bạn thích nhịp sống ổn định, quan tâm sâu sắc đến những người xung quanh và chuẩn bị chu đáo để ai cũng thấy được chăm lo. Ngôi nhà, đội nhóm hay hội bạn của bạn có thể trở thành nơi mọi người thích tụ họp. Những truyền thống nhỏ bạn bắt đầu năm nay, như bữa cơm mỗi tháng hay cùng nhau gói bánh chưng ngày Tết, có thể trở thành điều được giữ suốt nhiều năm.",
      "keywords": ["Chu đáo", "Đáng tin cậy", "Tinh tế"],
      "color": "Be ấm áp",
      "item": "Một cây nến thơm dịu nhẹ",
      "fortune": {
        "work": "Mọi người dựa vào sự vững vàng của bạn. Sắp xếp và hỗ trợ người khác có thể là lúc bạn tỏa sáng nhất.",
        "money": "Lên kế hoạch cho sự thoải mái rất hợp với bạn. Dành ra một chút cho những khoảnh khắc chung ở nhà có thể khiến bạn mãn nguyện.",
        "love": "Các mối quan hệ của bạn có thể sâu hơn thay vì rộng hơn. Một cuộc trò chuyện dài có khi ý nghĩa hơn một bữa tiệc lớn.",
        "self": "Bạn chăm lo cho mọi người, nên hãy để ai đó chăm lo cho bạn nữa. Nhận sự giúp đỡ cũng chẳng sao."
      },
      "tip": "Bắt đầu một truyền thống nhỏ với người mình thương, như một bữa cơm mỗi tháng hay một tấm ảnh mỗi năm."
    },
    "bond": {
      "name": "Vòng Tròn Tri Kỷ",
      "word": "tri kỷ",
      "vibe": "Những khoảnh khắc đẹp nhất năm nay sẽ có những gương mặt thân quen.",
      "desc": "Năm của bạn có thể được tô màu bởi những người bạn tốt. Bạn thích nhịp sống thong thả, biết lắng nghe và thích để kế hoạch đến tự nhiên cùng những người mình thương. Bạn bè thấy dễ chịu khi ở bên bạn, và những mối quen cũ có thể quay lại theo những cách thật dễ thương. Đây có thể là năm của những cuộc trò chuyện dài, những bữa ăn chung và những tràng cười bạn vẫn nhớ đến tận mùa đông sau. Hãy luôn mở cửa và mở lòng.",
      "keywords": ["Ấm áp", "Dễ tính", "Chung thủy"],
      "color": "Hồng anh đào",
      "item": "Một xấp thiệp viết tay",
      "fortune": {
        "work": "Quan hệ tốt với đồng nghiệp hay bạn học có thể giúp mọi việc dễ dàng hơn. Sự tử tế của bạn là một thế mạnh thật sự.",
        "money": "Sẻ chia dễ chịu hơn sở hữu. Những món quà nhỏ chu đáo có thể mang lại nhiều niềm vui hơn những món đồ lớn.",
        "love": "Một tình bạn cũ có thể nở hoa trở lại, hoặc một người bạn mới khiến bạn thấy như đã quen nhau cả đời.",
        "self": "Thời gian bên mọi người nạp năng lượng cho bạn, nhưng những phút lặng yên cũng giúp bạn nghe được mong muốn của chính mình."
      },
      "tip": "Mỗi tháng gửi một lời nhắn viết tay cho một người đã làm cuộc sống bạn tươi sáng hơn."
    },
    "seed": {
      "name": "Hạt Mầm Kiên Nhẫn",
      "word": "hạt mầm",
      "vibe": "Mỗi ngày một bước nhỏ, và điều gì đó tươi đẹp sẽ lớn lên.",
      "desc": "Năm nay có thể là năm lớn lên lặng lẽ. Bạn thích nhịp sống đều đặn, thích có không gian riêng và thích lên kế hoạch những bước nhỏ, hợp lý. Chẳng có gì rực rỡ, nhưng đến mùa đông sau bạn có thể ngạc nhiên vì mọi thứ đã lớn lên nhiều thế nào: một thói quen giữ được, một kỹ năng nở hoa, một nếp sống bình yên hơn. Sự kiên nhẫn là sức mạnh bí mật của bạn năm nay. Hãy tưới cho mầm của mình một chút mỗi ngày.",
      "keywords": ["Kiên nhẫn", "Bền bỉ", "Điềm tĩnh"],
      "color": "Xanh bạc hà tươi",
      "item": "Một cuốn sổ nhỏ ghi thói quen",
      "fortune": {
        "work": "Năm nay sự đều đặn có thể thắng tốc độ. Những tiến bộ nhỏ mỗi ngày có thể cộng lại thành điều bạn tự hào.",
        "money": "Những nếp nhẹ nhàng hợp với bạn, như mỗi tháng tự xem lại chuyện chi tiêu của mình một cách đơn giản.",
        "love": "Vòng bạn bè của bạn có thể không lớn nhất, nhưng những người trong đó sẽ biết họ luôn có thể dựa vào bạn.",
        "self": "Một nếp sinh hoạt đơn giản, một góc nhà gọn gàng và một giấc ngủ sớm có khi là tất cả những gì bạn cần để thấy mình ở trạng thái tốt nhất."
      },
      "tip": "Chọn một thói quen nhỏ xíu mỗi ngày, nhỏ đến mức ngày lười nhất vẫn làm được."
    },
    "pause": {
      "name": "Khoảng Lặng Dịu Êm",
      "word": "khoảng lặng",
      "vibe": "Một năm chậm hơn, một trái tim mềm hơn, và chỗ để thở.",
      "desc": "Năm của bạn có thể là năm sống chậm lại theo cách tốt đẹp nhất. Bạn thích nhịp bình yên, trân trọng thời gian cho riêng mình và vui lòng để cuộc sống tự diễn ra mà không gượng ép. Đó không phải là không làm gì: đó là khoảng trống nơi những ý tưởng mới lặng lẽ xuất hiện. Đây có thể là năm để tận hưởng niềm vui giản dị, một cuốn sách hay, một cuộc dạo bộ dài, một buổi tối ấm cúng, và nhận ra điều gì thật sự khiến bạn hạnh phúc.",
      "keywords": ["Bình yên", "Suy ngẫm", "Dịu dàng"],
      "color": "Tím oải hương",
      "item": "Một chiếc khăn quàng mềm ấm",
      "fortune": {
        "work": "Một tâm trí bình thản nhìn mọi thứ rõ ràng. Dành một chút thời gian trước khi quyết định có thể giúp bạn chọn đúng lối.",
        "money": "Niềm vui giản dị thường chẳng tốn mấy. Bạn có thể nhận ra những điều mình yêu nhất vốn đã ở ngay bên cạnh.",
        "love": "Những người bạn trầm lặng hợp với bạn. Chỉ một hai người bạn thân cũng đủ làm năm của bạn trọn vẹn.",
        "self": "Đây là năm bạn được nghỉ ngơi mà không áy náy. Những buổi sáng chậm rãi và buổi tối yên tĩnh là điều bạn xứng đáng có."
      },
      "tip": "Giữ trống hoàn toàn một buổi tối mỗi tuần, chỉ để làm điều mình thích."
    }
  }
};
