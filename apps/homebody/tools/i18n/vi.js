/* 집순이·집돌이 지수 테스트 — vi
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "'Be Vietnam Pro'",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Trắc nghiệm mê ở nhà – Bạn “cú đêm” ở nhà cỡ nào?",
    "description": "Bạn mê ở nhà đến mức nào? Làm trắc nghiệm mê ở nhà miễn phí: 10 tình huống đời thường, khoảng 1 phút, không cần đăng ký. Nhận ngay phần trăm “ghiền nhà” của bạn.",
    "ogTitle": "Trắc nghiệm mê ở nhà 🏠 Bạn ghiền nhà cỡ nào?",
    "ogDescription": "Bài trắc nghiệm miễn phí 1 phút. Trả lời 10 tình huống đời thường và nhận phần trăm ghiền nhà của bạn."
  },
  "siteName": "Trắc nghiệm mê ở nhà",
  "privacyLink": "Chính sách quyền riêng tư",
  "start": {
    "badge": "🏠 Chỉ số ghiền nhà",
    "h1Kicker": "Trắc nghiệm mê ở nhà",
    "h1Html": "Bạn <em>ghiền nhà</em><br>đến mức nào?",
    "hook": "Mười tình huống nhỏ sẽ cho biết bạn yêu căn nhà của mình đến đâu và thế giới bên ngoài phải cố gắng thế nào mới kéo được bạn ra.",
    "metaTime": "⏱️ Khoảng 1 phút",
    "metaCount": "🛋️ 10 câu hỏi",
    "start": "Xem mức của tôi →"
  },
  "quiz": {
    "backAria": "Câu trước",
    "progressAria": "Tiến độ",
    "qLabel": "Câu {n}"
  },
  "loading": {
    "text": "Đang đếm điểm ấm cúng của bạn…",
    "sub": "Đang kiểm tra ghế sofa"
  },
  "result": {
    "title": "Trắc nghiệm mê ở nhà: tôi là {name}",
    "eyebrow": "Kiểu ở nhà của bạn là",
    "strengthsLabel": "Siêu năng lực của bạn",
    "othersLabel": "Người khác nhìn bạn thế nào",
    "bestLabel": "Cặp hợp nhất",
    "clashLabel": "Kiểu đối lập",
    "meterLabel": "Mức ghiền nhà",
    "moreShare": "{pct}% người chơi ghiền nhà hơn bạn",
    "shareText": "Tôi là {name} {emoji} — “{vibe}” Còn bạn ghiền nhà cỡ nào?",
    "shareTextPct": "Tôi ghiền nhà {pct}%: {name} {emoji}. Còn bạn?",
    "ctaStrong": "Một người bạn đã chia sẻ kết quả",
    "ctaSub": "Bạn ghiền nhà cỡ nào? Chỉ mất 1 phút.",
    "retry": "Làm lại bài trắc nghiệm"
  },
  "og": {
    "eyebrow": "Mức ghiền nhà của tôi",
    "brand": "🏠 Trắc nghiệm mê ở nhà",
    "defaultKicker": "Trắc nghiệm mê ở nhà",
    "defaultTitle": "Bạn ghiền nhà đến mức nào?",
    "defaultDesc": "10 tình huống đời thường · khoảng 1 phút"
  },
  "faq": [
    {
      "q": "Phần trăm ghiền nhà được tính thế nào?",
      "a": "Mỗi đáp án được 0 đến 10 điểm nghiêng về phía ở nhà. Điểm của mười câu được cộng lại rồi quy về thang 0–100, phần trăm càng cao nghĩa là bạn càng thích ở trong nhà."
    },
    {
      "q": "Ghiền nhà có giống hướng nội không?",
      "a": "Không hẳn. Hướng nội nói về nơi bạn lấy năng lượng, còn ghiền nhà nói về nơi bạn thích dành thời gian. Nhiều người hướng ngoại cũng mê ghế sofa và nhiều người hướng nội lại thích đi bộ đường dài."
    },
    {
      "q": "Bài trắc nghiệm này có khoa học không?",
      "a": "Không. Đây chỉ là bài trắc nghiệm nhẹ nhàng để vui và bắt chuyện, không phải đánh giá tâm lý. Kết quả chỉ phản ánh câu trả lời hôm nay của bạn."
    },
    {
      "q": "“Ghiền nhà hơn X% người chơi” được tính thế nào?",
      "a": "Chúng tôi chỉ đếm ẩn danh mỗi bài đã xong rơi vào khoảng điểm nào. Khi có ít nhất 20 kết quả, chúng tôi so sánh với kết quả của bạn. Dòng này chỉ hiện ở kết quả bạn vừa làm và ẩn đi khi chưa đủ người chơi."
    }
  ],
  "privacy": {
    "title": "Chính sách quyền riêng tư | Trắc nghiệm mê ở nhà",
    "description": "Chính sách quyền riêng tư của Trắc nghiệm mê ở nhà — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.",
    "h1": "Chính sách quyền riêng tư",
    "introHtml": "Trắc nghiệm mê ở nhà (\"Dịch vụ\") tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết như mô tả dưới đây.",
    "sections": [
      [
        "1. Thông tin chúng tôi thu thập",
        "Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời được tính trong trình duyệt và không bao giờ được gửi hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh xem ra khoảng điểm nào, để hiển thị mỗi kết quả phổ biến đến đâu."
      ],
      [
        "2. Cookie và công nghệ tương tự",
        "Dịch vụ có thể dùng cookie và bộ nhớ cục bộ của trình duyệt để ghi nhớ ngôn ngữ, hiển thị quảng cáo và hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa chúng trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng."
      ],
      [
        "3. Quảng cáo (Google AdSense)",
        "Dịch vụ hiển thị quảng cáo qua Google AdSense. Google và đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trước đây. Xem thêm và thay đổi cài đặt tại <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Cài đặt quảng cáo của Google</a>."
      ],
      [
        "4. Thống kê",
        "Chúng tôi lưu tổng số ẩn danh theo ngày (lượt xem trang, số lần hoàn thành, đánh giá) để cải thiện Dịch vụ. Những con số này không nhận dạng được bạn."
      ],
      [
        "5. Liên hệ",
        "Nếu có câu hỏi về chính sách này, vui lòng liên hệ người vận hành trang."
      ],
      [
        "6. Ngày hiệu lực",
        "Chính sách có hiệu lực từ ngày 21 tháng 10 năm 2026."
      ]
    ],
    "back": "← Quay lại trắc nghiệm mê ở nhà"
  },
  "questions": [
    {
      "q": "Tối thứ Sáu, nhóm chat sáng đèn: “Đi nhậu ở trung tâm không?”",
      "choices": [
        "Nhắn “hẹn dịp khác” rồi vui vẻ về nhà",
        "Đi một tiếng rồi lặng lẽ biến mất",
        "Đề nghị lại: qua nhà ai đó gọi đồ ăn về",
        "Đi và ở lại đến lúc quán đóng cửa"
      ]
    },
    {
      "q": "Cuối tuần dài chưa có kế hoạch gì. Dự định lý tưởng của bạn?",
      "choices": [
        "Xếp balo và đi du lịch bất chợt",
        "Cố tình không bước chân ra khỏi nhà",
        "Đi trong ngày rồi về ngủ giường mình",
        "Ra quán cà phê hoặc công viên gần nhà rồi về"
      ]
    },
    {
      "q": "Chuông cửa reo mà bạn không hẹn ai. Bạn…",
      "choices": [
        "Mở cửa, hơi bất ngờ",
        "Nhìn qua mắt thần trước",
        "Rất vui: khách đến bất ngờ là nhất",
        "Đứng im chờ người ta đi mất"
      ]
    },
    {
      "q": "Bạn muốn sống ở đâu nhất?",
      "choices": [
        "Một ngôi nhà yên tĩnh có góc riêng của mình",
        "Ngay giữa trung tâm thành phố náo nhiệt",
        "Một tổ ấm mà mọi thứ nằm trong tầm tay",
        "Căn hộ có ban công đẹp gần khu sầm uất"
      ]
    },
    {
      "q": "Chủ nhật mưa. Điều đầu tiên bạn nghĩ?",
      "choices": [
        "Thời tiết tuyệt nhất: chăn, trà, cửa sổ",
        "Chán thật, hỏng hết kế hoạch",
        "Cuối cùng cũng có cớ hoàn hảo để ở nhà",
        "Thôi được, tìm chỗ nào đi trong nhà vậy"
      ]
    },
    {
      "q": "Bạn bè mời bạn đi một sự kiện hai tuần nữa.",
      "choices": [
        "Xem lịch trước đã",
        "Bắt đầu nghĩ cách từ chối cho khéo",
        "Tính tôi một suất!",
        "Nhận lời rồi càng gần ngày càng lo"
      ]
    },
    {
      "q": "Về nhà sau một ngày dài ở ngoài. Bạn cảm thấy…",
      "choices": [
        "Vẫn tràn năng lượng, muốn đi tiếp",
        "Mệt dễ chịu",
        "Cuối cùng: khóa cửa, điện thoại tắt tiếng",
        "Nhẹ nhõm như pin đang được sạc"
      ]
    },
    {
      "q": "Đến giờ ăn tối. Bạn muốn ở đâu?",
      "choices": [
        "Tự nấu ở nhà",
        "Ra ngoài nhưng chọn quán nhỏ yên tĩnh",
        "Một nhà hàng sôi động đông người",
        "Trên sofa với đồ ăn giao tận nơi và một bộ phim"
      ]
    },
    {
      "q": "Bạn ở nhà liên tiếp mấy ngày mà không phát điên?",
      "choices": [
        "Một ngày là đủ",
        "Cả tuần lễ mà không hay biết",
        "Khoảng ba ngày",
        "Một tuần là chuyện nhỏ"
      ]
    },
    {
      "q": "Bạn có chút tiền dư. Bạn sẽ chi vào đâu?",
      "choices": [
        "Một buổi tối với bạn bè",
        "Vé biểu diễn và du lịch",
        "Đồ công nghệ, game hoặc xem phim trực tuyến cho sofa",
        "Nâng cấp sự ấm cúng: ghế tốt, đèn, bộ chăn ga"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Sinh ra để ở ngoài",
      "vibe": "Nhà là nơi bạn quẳng balo trước khi đi tiếp.",
      "desc": "Cửa nhà bạn như cửa xoay. Một ngày ở trong nhà thấy phí, và ý tưởng hay nhất đến khi bạn đang trên đường mòn, trên tàu hay ngoài sân thượng. Bạn nạp năng lượng từ con người và không khí trong lành, và sưu tầm kế hoạch như người khác sưu tầm cốc. Nhà chủ yếu là chỗ để ngủ, tắm và đổi giày.",
      "strengths": [
        "Năng lượng vô tận",
        "Luôn nói có với phiêu lưu",
        "Không bao giờ chán"
      ],
      "others": "Mọi người thấy bạn luôn có kế hoạch và kéo được cả nhóm rời khỏi ghế sofa."
    },
    "roamer": {
      "name": "Lãng du cuối tuần",
      "vibe": "Ra ngoài nhiều hơn ở nhà, nhưng vẫn mê giấc ngủ trưa.",
      "desc": "Bạn thích ra ngoài, nhất là với bạn bè, nhưng cũng biết niềm vui của một buổi tối kết thúc sớm. Tuần của bạn kín kế hoạch, và một tối yên tĩnh ở nhà là phần thưởng chứ không phải thói quen. Bạn thích sự đa dạng: quán cà phê mới, chuyến đi ngắn, con phố chưa từng đi qua.",
      "strengths": [
        "Hòa đồng và tò mò",
        "Kế hoạch linh hoạt",
        "Giỏi khởi động mọi việc"
      ],
      "others": "Mọi người thấy bạn thân thiện, sôi nổi, lúc nào cũng sẵn sàng đi cà phê, nhưng thỉnh thoảng biến mất để nạp lại pin."
    },
    "switch": {
      "name": "Thăng bằng trong ngoài",
      "vibe": "Nửa sofa, nửa thành phố, thích nghi tất cả.",
      "desc": "Bạn tận hưởng một tối ồn ào bên ngoài và một tối yên ắng trong nhà với cùng một nụ cười. Cả hai đều không phải hy sinh: bạn đọc năng lượng của ngày hôm đó rồi làm theo. Nhờ vậy bạn là bạn đồng hành dễ chịu với cả người thích đi chơi lẫn người thích ở nhà. Thử thách duy nhất là chọn nghe theo bên nào vào tối thứ Sáu.",
      "strengths": [
        "Hợp mọi kế hoạch",
        "Hiểu năng lượng của mình",
        "Dễ làm bạn đồng hành"
      ],
      "others": "Mọi người thấy bạn dễ tính, khó đoán, người bạn hợp với mọi kế hoạch."
    },
    "nester": {
      "name": "Tổ ấm ấm cúng",
      "vibe": "Hạnh phúc với chiếc chăn, ngọn đèn và kế hoạch ở nhà.",
      "desc": "Ở nhà là lúc bạn giống mình nhất. Bạn cố ý làm nhà thật dễ chịu: ánh sáng đúng, chiếc ghế đúng, món ăn vặt đúng. Bạn vẫn ra ngoài vì những người quan trọng, nhưng giữ buổi tối ngắn và lối ra gần. Buổi tụ họp lý tưởng của bạn có giờ bắt đầu, giờ kết thúc và một chiếc sofa gần đó.",
      "strengths": [
        "Biến mọi nơi thành ấm cúng",
        "Dùng năng lượng khôn ngoan",
        "Chủ nhà tuyệt vời"
      ],
      "others": "Mọi người thấy bạn ấm áp và điềm tĩnh, người bạn mà ai cũng muốn tụ tập ở nhà."
    },
    "homebody": {
      "name": "Người mê ở nhà chính hiệu",
      "vibe": "Kế hoạch hay nhất là kế hoạch bị hủy.",
      "desc": "Bạn thật lòng yêu việc ở nhà và không còn xin lỗi vì điều đó. Không gian của bạn vừa là trạm sạc, vừa là phòng sở thích, vừa là nơi trú ẩn. Lời mời được đáp lại sau một quãng lặng lịch sự, và một cuối tuần trống lịch giống như món quà. Bạn không ngại giao tiếp, chỉ chọn lọc nơi mình ra ngoài.",
      "strengths": [
        "Vui khi ở một mình",
        "Thế giới nội tâm phong phú",
        "Giữ gìn bình yên"
      ],
      "others": "Mọi người thấy bạn điềm tĩnh, hơi bí ẩn và hài hước bất ngờ khi ở trong thế giới của mình."
    },
    "legend": {
      "name": "Huyền thoại ở nhà",
      "vibe": "Cánh cửa chỉ là gợi ý. Chiếc sofa là cả vương quốc.",
      "desc": "Bạn đã biến việc ở nhà thành một nghệ thuật. Ứng dụng giao đồ ăn biết tên bạn, góc làm việc được tối ưu và pin giao tiếp được sạc bằng sự yên tĩnh. Bạn có thể nhiều ngày không nhớ đến thế giới bên ngoài mà vẫn hài lòng. Khi bạn ra ngoài, đó là vì điều thật sự đáng giá, và bạn lên kế hoạch về nhà từ trước khi đi.",
      "strengths": [
        "Bậc thầy thoải mái",
        "Hoàn toàn tự cung tự cấp",
        "Không biết FOMO"
      ],
      "others": "Mọi người thấy bạn là huyền thoại: hiếm khi gặp, luôn bình yên và là người để hỏi xin gợi ý phim hay."
    }
  }
};
