/* Personal Color Test (vi)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {"css":"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap","display":"'Playfair Display'","displayWeight":700,"sans":"'Be Vietnam Pro'","wordBreak":"normal","hyphens":"manual"},
  "meta": {
    "title": "Trắc nghiệm màu sắc cá nhân: Bạn hợp tông màu mùa nào?",
    "description": "Trắc nghiệm màu sắc cá nhân: 12 câu hỏi soi gương, khoảng 2 phút, không cần ảnh hay đăng ký. Biết da tông nóng hay lạnh và bảng màu hợp bạn. Chơi cho vui.",
    "ogTitle": "Trắc nghiệm màu sắc cá nhân 🎨 Màu nào giúp bạn rạng rỡ?",
    "ogDescription": "Bài trắc nghiệm màu theo mùa với 12 câu hỏi tự soi gương. Tìm undertone và những gam màu tôn da nhất của bạn."
  },
  "siteName": "Trắc nghiệm màu sắc cá nhân",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🎨 Tự soi gương kiểm tra",
    "h1Kicker": "Trắc nghiệm màu sắc cá nhân",
    "h1Html": "Màu nào giúp gương mặt<br>bạn <em>bừng sáng</em>?",
    "hook": "Cầm một chiếc gương và tìm chỗ có ánh sáng tự nhiên. Trả lời 12 câu hỏi nhanh về làn da, mái tóc, đôi mắt và những màu bạn hay được khen, rồi khám phá bảng màu theo mùa của bạn.",
    "metaTime": "⏱️ 2 phút",
    "metaCount": "🪞 12 câu hỏi",
    "start": "Tìm màu của tôi →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang pha bảng màu của bạn…",
    "sub": "Ướm từng gam màu dưới ánh sáng"
  },
  "result": {
    "title": "Màu sắc cá nhân của tôi: {name}",
    "metaDesc": "Kết quả trắc nghiệm màu sắc cá nhân: {name}. {vibe} Xem những gam màu hợp nhất, màu nên hạn chế và gợi ý trang điểm, màu tóc, trang sức.",
    "eyebrow": "Màu sắc cá nhân của bạn là",
    "gaugeLabel": "Câu trả lời của bạn nghiêng về",
    "axes": [
      ["Nóng", "Lạnh"],
      ["Sáng", "Đậm"],
      ["Tươi", "Dịu"]
    ],
    "paletteLabel": "Những màu hợp nhất với bạn",
    "avoidLabel": "Màu nên dùng ít",
    "avoidNote": "Không phải cấm, chỉ là khó hợp khi để gần mặt. Hãy dành chúng cho giày, túi hoặc quần.",
    "makeupLabel": "Trang điểm",
    "hairLabel": "Màu tóc",
    "jewelryLabel": "Trang sức",
    "disclaimer": "Đây là bài tự kiểm tra cho vui, không phải phân tích màu sắc chuyên nghiệp. Draping thật dùng vải màu dưới ánh sáng được kiểm soát, còn ánh đèn, màn hình và lớp trang điểm đều làm màu trông khác đi.",
    "sameShare": "{pct}% người chơi có cùng bảng màu này",
    "shareText": "Màu sắc cá nhân của mình: {name} {emoji} “{vibe}” Còn bạn thì sao?",
    "ctaStrong": "Bạn bè vừa chia sẻ bảng màu của họ",
    "ctaSub": "Tông nóng hay tông lạnh? Biết ngay trong 2 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Màu sắc cá nhân của tôi",
    "brand": "🎨 Trắc nghiệm màu sắc cá nhân",
    "defaultKicker": "Trắc nghiệm màu theo mùa",
    "defaultTitle": "Màu nào giúp bạn rạng rỡ?",
    "defaultDesc": "12 câu hỏi tự soi gương · 2 phút"
  },
  "faq": [
    {
      "q": "Bài trắc nghiệm xác định màu của tôi như thế nào?",
      "a": "Mỗi câu trả lời đẩy nhẹ ba thang đo: undertone nóng hay lạnh, màu sáng hay đậm, và tươi hay dịu. Kết quả là bảng màu theo mùa nơi ba thang đo đó gặp nhau. Cùng một bộ câu trả lời luôn cho cùng một kết quả."
    },
    {
      "q": "Kết quả có chính xác như phân tích màu chuyên nghiệp không?",
      "a": "Không. Đây là bài tự kiểm tra cho vui, dựa trên những gì bạn thấy trong gương. Chuyên gia sẽ ướm nhiều tấm vải màu lên mặt bạn dưới ánh sáng trung tính, điều mà một bài trắc nghiệm không làm được. Hãy coi kết quả là điểm khởi đầu để thử nghiệm."
    },
    {
      "q": "Làm sao để có kết quả đáng tin hơn?",
      "a": "Hãy trả lời dưới ánh sáng ban ngày gần cửa sổ, mặt mộc và vén tóc ra sau. Đèn trong nhà, bộ lọc điện thoại và tóc nhuộm đều có thể khiến màu trông ấm hơn hoặc lạnh hơn thực tế."
    },
    {
      "q": "Câu trả lời hoặc ảnh của tôi có bị lưu lại không?",
      "a": "Bài trắc nghiệm không bao giờ yêu cầu ảnh. Câu trả lời được tính ngay trong trình duyệt và không được lưu lại. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho bạn biết kết quả đó phổ biến đến đâu."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm màu sắc cá nhân",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm màu sắc cá nhân — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm màu sắc cá nhân (“Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập, và Dịch vụ không bao giờ yêu cầu ảnh. Câu trả lời của bạn được tính ngay trong trình duyệt và không bao giờ được gửi đến hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh kết quả nào xuất hiện để cho biết mỗi kết quả phổ biến đến đâu."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ (local storage) của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động bình thường."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên những lần bạn truy cập trang này và các trang web khác trước đó. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu số liệu tổng hằng ngày ở dạng ẩn danh (lượt xem trang, số bài trắc nghiệm hoàn thành, đánh giá) để cải thiện Dịch vụ. Các số liệu này không xác định được danh tính cá nhân của bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu bạn có câu hỏi về Chính sách quyền riêng tư này, vui lòng liên hệ với người quản lý trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách này có hiệu lực từ ngày 23 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại Trắc nghiệm màu sắc cá nhân"
  },
  "questions": [
    {
      "q": "Dưới ánh sáng ban ngày, hãy nhìn mạch máu ở mặt trong cổ tay. Chúng có màu gì?",
      "choices": [
        "Chủ yếu xanh dương hoặc tím",
        "Chủ yếu xanh lá hoặc xanh ô liu",
        "Lẫn cả hai, khó phân biệt"
      ]
    },
    {
      "q": "Loại trang sức nào khiến làn da bạn trông đẹp nhất?",
      "choices": [
        "Vàng vàng (vàng ta)",
        "Bạc hoặc bạch kim",
        "Vàng hồng hoặc kim loại mờ, chải xước nhẹ",
        "Món nổi bật, bóng loáng, kim loại nào cũng được"
      ]
    },
    {
      "q": "Sau một giờ dưới nắng mà không bôi kem chống nắng, da bạn thường…",
      "choices": [
        "Ửng hồng rồi cháy nắng, hầu như không rám",
        "Hơi cháy nắng trước, sau đó rám nhẹ",
        "Chuyển màu bánh mật và dễ rám",
        "Hiếm khi cháy nắng, chỉ sậm hơn một chút"
      ]
    },
    {
      "q": "Ướm một chiếc áo trắng tinh và một chiếc màu ngà hoặc kem dưới cằm. Màu nào trông đẹp hơn?",
      "choices": [
        "Trắng tinh. Trông tươi tắn, trong trẻo",
        "Ngà hoặc kem. Màu trắng làm mình trông gắt",
        "Thật lòng mà nói, mình không thấy khác biệt"
      ]
    },
    {
      "q": "Màu cơ bản tối nào đẹp nhất khi đặt sát gương mặt bạn?",
      "choices": [
        "Đen tuyền. Sắc sảo và nổi bật",
        "Nâu sô-cô-la hoặc nâu lạc đà",
        "Xám than dịu hoặc xanh navy. Màu đen hơi nặng",
        "Không màu nào: kem hoặc be nhạt hợp hơn"
      ]
    },
    {
      "q": "Màu tóc tự nhiên của bạn là gì (hoặc lúc nhỏ là màu gì)?",
      "choices": [
        "Rất tối, gần như đen",
        "Nâu vừa đến nâu đậm, ánh đỏ hoặc ánh vàng",
        "Nâu khói hoặc nâu xám nhạt",
        "Sáng: nâu vàng, vàng dâu hoặc vàng hoe"
      ]
    },
    {
      "q": "Bạn mô tả đôi mắt của mình thế nào?",
      "choices": [
        "Đậm và sâu, lòng trắng rất trong",
        "Màu hạt dẻ ấm, hổ phách hoặc nâu vàng",
        "Nâu xám hoặc xanh xám dịu, hòa quyện nhẹ nhàng",
        "Sáng và lấp lánh, viền mống mắt rõ nét"
      ]
    },
    {
      "q": "Mặc màu nào bạn được khen nhiều nhất?",
      "choices": [
        "Màu rực như xanh coban hoặc hồng neon",
        "Màu trầm dịu như hồng đất hoặc xanh xô thơm",
        "Pastel nhạt, nhẹ nhàng",
        "Màu đậm, sâu như đỏ rượu vang hoặc xanh rừng"
      ]
    },
    {
      "q": "Độ tương phản giữa tóc và da của bạn mạnh đến mức nào?",
      "choices": [
        "Cao. Tóc nổi bật hẳn so với da",
        "Ở mức trung bình",
        "Thấp và sáng. Cả hai đều nhạt và dịu",
        "Thấp và đậm. Cả hai đều sậm, gần tông nhau"
      ]
    },
    {
      "q": "Khi không trang điểm, môi và má bạn trông…",
      "choices": [
        "Hồng hào",
        "Hơi cam đào hoặc san hô",
        "Nhợt, ngả be, không mấy sắc hồng",
        "Đậm tự nhiên, gần màu berry"
      ]
    },
    {
      "q": "Màu má hồng nào trông tự nhiên nhất trên bạn?",
      "choices": [
        "Cam đào hoặc san hô",
        "Hồng phấn hoặc hồng đất nhạt",
        "Đỏ đất hoặc nâu gạch dịu",
        "Berry hoặc mận"
      ]
    },
    {
      "q": "Không khí nào giống bạn nhất khi soi gương?",
      "choices": [
        "Rạng rỡ, tươi mát như ly nước chanh trong buổi picnic",
        "Nhẹ nhàng, mềm mại như oải hương trong sương sớm",
        "Ấm áp, đậm đà như tách trà gia vị bên lò sưởi",
        "Sắc nét, ấn tượng như ánh đèn thành phố về đêm"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Xuân Nhạt",
      "word": "xuân nhạt",
      "vibe": "Ấm áp, mong manh và ngập nắng sớm.",
      "desc": "Sắc vóc của bạn ấm nhưng dịu, có ánh vàng nhẹ và rất ít tương phản gắt. Những gam màu sáng, trong và hơi ấm giúp làn da trông tươi tắn, như vừa được nghỉ ngơi, còn màu nặng hoặc quá tối dễ đè lên bạn thay vì hòa cùng bạn. Hãy nghĩ đến cam đào, vàng bơ, xanh ngọc nhạt và hồng ấm: những màu như được pha cùng nắng.",
      "keywords": ["Ấm", "Sáng", "Tươi mát"],
      "makeup": "Má hồng cam đào hoặc mơ, son san hô hoặc hồng ấm mỏng nhẹ, kẻ mắt nâu nhạt hoặc đồng thay cho màu đen.",
      "hair": "Vàng óng, màu mật ong hoặc nâu caramel sáng. Tránh màu quá tối hoặc tông khói làm gương mặt bị tối.",
      "jewelry": "Vàng nhạt, vàng hồng và những món thanh mảnh. Ngọc trai tông kem ấm rất hợp với bạn."
    },
    "springbright": {
      "name": "Xuân Tươi",
      "word": "xuân tươi",
      "vibe": "Ấm áp, trong trẻo và lấp lánh.",
      "desc": "Bạn có sắc vóc tông ấm, sống động và trong trẻo, thường kèm đôi mắt sáng và độ tương phản tươi tắn. Những màu rực rỡ như nắng giúp gương mặt bừng tỉnh, còn màu trầm xám dễ khiến bạn trông mệt mỏi. San hô, cam quýt, vàng hướng dương, xanh ngọc lam và xanh cỏ là sân chơi của bạn. Bạn có thể mặc màu thật đậm mà vẫn là chính mình.",
      "keywords": ["Ấm", "Trong", "Rực rỡ"],
      "makeup": "Son san hô hoặc đỏ ấm, má hồng cam đào trong trẻo và chút nhũ. Kẻ mắt nâu ấm hoặc xanh mòng két tạo điểm nhấn.",
      "hair": "Nâu vàng ấm, màu đồng hoặc nâu hạt dẻ sáng. Highlight ấm, bóng mượt hợp hơn màu khói phẳng lì.",
      "jewelry": "Vàng đánh bóng, men màu sặc sỡ và đá sáng màu. Bề mặt bóng hợp với bạn hơn bề mặt mờ."
    },
    "summerlight": {
      "name": "Hạ Nhạt",
      "word": "hạ nhạt",
      "vibe": "Mát, mềm mại và trong như bầu trời quang.",
      "desc": "Sắc vóc của bạn sáng và lạnh, undertone hồng hoặc trung tính, tổng thể mềm mại. Pastel tông lạnh và các màu trung bình dịu nhẹ giúp làn da trông mịn màng, rạng rỡ, còn màu quá tối, quá ấm hoặc neon có thể lấn át bạn. Xanh phấn, oải hương, hồng nhạt và xanh bạc hà là lựa chọn dễ thắng. Hãy nghĩ đến những màu được pha thêm chút trắng và chút xanh.",
      "keywords": ["Lạnh", "Sáng", "Dịu nhẹ"],
      "makeup": "Má hồng đất nhạt hoặc hồng phấn, son hồng hoặc tím hồng mỏng nhẹ, kẻ mắt nâu xám hoặc xám nhạt.",
      "hair": "Vàng khói, nâu khói sáng hoặc vàng be dịu. Tông vàng hoặc cam đậm dễ đối chọi với làn da.",
      "jewelry": "Bạc, vàng trắng và bạch kim, cùng ngọc trai, đá mặt trăng hoặc đá xanh nhạt."
    },
    "summermute": {
      "name": "Hạ Dịu",
      "word": "hạ dịu",
      "vibe": "Mát, điềm tĩnh và thanh lịch nhẹ nhàng.",
      "desc": "Sắc vóc của bạn lạnh đến trung tính, hòa quyện tự nhiên, tóc, da và mắt ít tương phản. Những gam màu trầm, ngả xám khiến bạn trông chỉn chu và thư thái, còn màu quá rực hoặc quá ấm dễ trông chói khi đặt gần mặt. Tím hồng, hồng đất, xanh đá, xanh xô thơm và mận dịu là màu đặc trưng của bạn. Phối đồ cùng tông trông đặc biệt tinh tế trên bạn.",
      "keywords": ["Lạnh", "Trầm dịu", "Điềm tĩnh"],
      "makeup": "Son hồng đất hoặc tím hồng, má hồng dịu và kẻ mắt nâu xám hoặc mận để tạo đường nét nhẹ nhàng.",
      "hair": "Nâu khói, nâu nấm tông lạnh hoặc vàng khói dịu. Tránh vàng đồng chói hoặc đen tuyền quá gắt.",
      "jewelry": "Bạc chải xước, vàng trắng và thiếc mờ. Bề mặt mờ và ngọc trai xám rất đúng chất bạn."
    },
    "autumnmute": {
      "name": "Thu Dịu",
      "word": "thu dịu",
      "vibe": "Ấm áp, hiền hòa và ánh vàng dịu dàng.",
      "desc": "Sắc vóc của bạn ấm và hòa quyện, mang nét mềm mại của tông đất, ít tương phản gắt. Những gam màu ấm, trầm trông tự nhiên và sang trọng trên bạn, còn màu lạnh buốt hoặc quá rực dễ làm bạn nhợt nhạt. Nâu lạc đà, xanh ô liu, đỏ đất dịu, nâu xám ấm và xanh rêu là bạn thân của bạn. Phối nhiều lớp màu trung tính ấm là siêu năng lực của bạn.",
      "keywords": ["Ấm", "Trầm dịu", "Tông đất"],
      "makeup": "Son nude cam đào hoặc đỏ gạch dịu, má hồng đỏ đất ấm và kẻ mắt nâu hoặc kaki.",
      "hair": "Nâu vàng dịu, be ấm hoặc caramel trầm. Tránh màu khói lạnh hoặc đen ánh xanh làm mất sự ấm áp.",
      "jewelry": "Vàng mờ hoặc chải xước, đồng thau và gỗ, cùng đá tông ấm như hổ phách hoặc mắt hổ."
    },
    "autumndeep": {
      "name": "Thu Trầm",
      "word": "thu trầm",
      "vibe": "Ấm áp, đậm đà và đầy chiều sâu.",
      "desc": "Bạn có sắc vóc tông ấm với chiều sâu thực sự, thường tóc hoặc mắt tối màu và undertone vàng hoặc ô liu. Các màu đất đậm, nồng như gia vị khiến bạn trông mạnh mẽ và rạng rỡ, còn pastel và màu lạnh buốt dễ làm bạn nhợt nhạt. Nâu gỉ sắt, sô-cô-la, vàng mù tạt, xanh ô liu và xanh mòng két đậm là màu quyền lực của bạn. Bạn mặc màu tối mà không hề trông nặng nề.",
      "keywords": ["Ấm", "Đậm", "Sâu lắng"],
      "makeup": "Son đỏ gạch, quế hoặc đỏ rượu ấm, má hồng đồng hoặc đỏ đất, kẻ mắt nâu đậm hoặc xanh ô liu.",
      "hair": "Sô-cô-la đậm, nâu hạt dẻ, nâu đỏ hoặc caramel đậm. Màu quá sáng hoặc khói dễ trông lạc lõng với gương mặt.",
      "jewelry": "Vàng cổ hoặc vàng đậm, đồng đỏ và đồng thau, cùng đá garnet, mắt hổ hoặc đá xanh lục đậm."
    },
    "winterbright": {
      "name": "Đông Tươi",
      "word": "đông tươi",
      "vibe": "Lạnh, rực rỡ và không thể làm ngơ.",
      "desc": "Sắc vóc của bạn lạnh và trong, thường có độ tương phản nổi bật giữa tóc, da và mắt. Những màu thuần, rực như đá quý cùng đen trắng rõ nét khiến bạn trông sắc sảo và sống động, còn màu trầm, be hoặc ngả xám dễ làm mờ đi vẻ lấp lánh. Hồng fuchsia, xanh coban, xanh ngọc lục bảo, đỏ chuẩn và trắng lạnh là màu đặc trưng của bạn. Bạn có thể diện màu nổi nhất căn phòng.",
      "keywords": ["Lạnh", "Trong", "Tương phản cao"],
      "makeup": "Son đỏ chuẩn, hồng fuchsia hoặc hồng lạnh, má hồng tươi và kẻ mắt đen sắc nét.",
      "hair": "Nâu đậm tông lạnh, đen ánh xanh hoặc một tông lạnh sạch sẽ. Caramel ấm hoặc highlight vàng đồng dễ trông xỉn.",
      "jewelry": "Bạc đánh bóng, vàng trắng và bạch kim, cùng kim cương, sapphire hoặc đá màu rực."
    },
    "winterdeep": {
      "name": "Đông Trầm",
      "word": "đông trầm",
      "vibe": "Lạnh, sâu và kịch tính một cách lặng lẽ.",
      "desc": "Bạn có sắc vóc đậm với undertone lạnh hoặc trung tính hơi lạnh, thường tóc và mắt tối màu. Những gam màu đậm tông lạnh và đen tuyền khiến bạn trông thanh lịch, quyền lực, còn pastel ấm và màu be dễ làm bạn trông mệt mỏi. Đen, xanh navy như mực, mận, đỏ rượu vang, xanh thông và trắng lạnh để tạo tương phản chính là tủ đồ lý tưởng của bạn.",
      "keywords": ["Lạnh", "Đậm", "Thanh lịch"],
      "makeup": "Son berry, đỏ rượu hoặc mận đậm, má hồng tông lạnh và kẻ mắt đen hoặc mận đậm.",
      "hair": "Nâu espresso đậm, nâu tối tông lạnh hoặc đen mềm. Tông vàng sáng dễ làm mất chiều sâu tự nhiên của bạn.",
      "jewelry": "Bạc, vàng trắng hoặc kim loại xám khói, cùng đá đậm màu như hồng ngọc, thạch anh tím hoặc onyx."
    }
  }
};
