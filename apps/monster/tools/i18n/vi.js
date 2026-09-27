/* Which Monster Are You? — Tiếng Việt (/vi/)
 * Cùng 12 id quái vật, cùng thứ tự câu hỏi/lựa chọn với monster-core.js (điểm số chỉ nằm ở monster-core.js).
 * Khoá kết thúc bằng Html được chèn dạng HTML (chỉ <br>, <em>); nội dung privacy.sections cũng là HTML.
 * Không spoil: meta / og.default* / start / faq không nêu tên quái vật hay trích câu hỏi.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "'Be Vietnam Pro'",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Bạn là quái vật nào? Trắc nghiệm Halloween vui',
    description: 'Bạn là quái vật nào? Làm trắc nghiệm tính cách Halloween miễn phí này: 10 câu hỏi dễ thương, khoảng 1 phút, không cần đăng ký. Tìm ra con quái vật hợp gu với bạn.',
    ogTitle: 'Bạn là quái vật nào? 🎃 Trắc nghiệm Halloween',
    ogDescription: 'Trắc nghiệm Halloween miễn phí, chỉ 1 phút. Trả lời 10 câu hỏi dễ thương và gặp bản sao quái vật của bạn.',
  },
  siteName: 'Bạn là quái vật nào?',
  privacyLink: 'Chính sách bảo mật',

  start: {
    badge: '🎃 Đặc biệt mùa Halloween',
    h1Kicker: 'Trắc nghiệm Halloween',
    h1Html: 'Bạn là <em>quái vật</em><br>nào?',
    hook: 'Một đêm ma mị, mười lựa chọn nhỏ. Đâu đó trong bóng tối, có một con quái vật giống bạn y hệt đang chờ.',
    metaTime: '⏱️ Khoảng 1 phút',
    metaCount: '🦇 10 câu hỏi',
    start: 'Triệu hồi quái vật →',
  },

  quiz: {
    backAria: 'Câu trước',
    progressAria: 'Tiến độ',
    qLabel: 'Câu {n}',
  },

  loading: {
    text: 'Đang triệu hồi quái vật của bạn…',
    sub: 'Khuấy nồi nước phù thuỷ',
  },

  result: {
    title: 'Bạn là quái vật nào? Tôi ra {name}',
    eyebrow: 'Quái vật hợp với bạn là',
    strengthsLabel: 'Sức mạnh quái vật',
    partyLabel: 'Ở tiệc Halloween, bạn là…',
    bestLabel: 'Tri kỷ',
    rivalLabel: 'Kỳ phùng địch thủ',
    sameShare: '{pct}% người chơi cũng ra quái vật này',
    shareText: 'Quái vật Halloween của tôi là {name} {emoji} — “{catch}” Còn bạn là quái vật nào?',
    ctaStrong: 'Một người bạn vừa gửi kết quả quái vật của họ',
    ctaSub: 'Còn bạn là quái vật nào? Chỉ mất 1 phút thôi.',
    retry: 'Làm lại trắc nghiệm',
  },

  og: {
    eyebrow: 'Quái vật Halloween của tôi',
    brand: '🎃 Bạn là quái vật nào?',
    defaultKicker: 'Trắc nghiệm Halloween',
    defaultTitle: 'Bạn là quái vật nào?',
    defaultDesc: '10 câu hỏi dễ thương · khoảng 1 phút',
  },

  // Chỉ hiện trong màn hình kết thúc chung, dạng accordion. Chữ thường, không spoil.
  faq: [
    { q: 'Trắc nghiệm quái vật này tính kết quả thế nào?', a: 'Mỗi câu trả lời sẽ cộng điểm cho vài con quái vật, con nào nhiều điểm nhất sẽ là kết quả của bạn. Nếu bằng điểm thì có một quy tắc cố định để phân định, nên trả lời giống nhau luôn ra cùng một quái vật.' },
    { q: 'Trắc nghiệm này có đáng sợ không?', a: 'Không hề. Đây là bài test Halloween dễ thương, phù hợp mọi lứa tuổi — không máu me, không hù dọa, chỉ vui vui rùng rợn nhẹ nhàng thôi.' },
    { q: 'Làm lại có ra quái vật khác không?', a: 'Có chứ. Kết quả chỉ phụ thuộc vào câu trả lời của bạn, nên chọn khác đi là có thể triệu hồi một con quái vật khác.' },
    { q: 'Câu trả lời của tôi có được lưu lại không?', a: 'Không. Câu trả lời được tính ngay trên trình duyệt của bạn và không hề lưu trữ. Chúng tôi chỉ đếm ẩn danh xem quái vật nào ra nhiều nhất, để hiện tỉ lệ % của mỗi kết quả.' },
  ],

  privacy: {
    title: 'Chính sách bảo mật | Bạn là quái vật nào?',
    description: 'Chính sách bảo mật của Bạn là quái vật nào? — cách chúng tôi dùng cookie, quảng cáo và thống kê ẩn danh.',
    h1: 'Chính sách bảo mật',
    introHtml: 'Bạn là quái vật nào? ("Dịch vụ") tôn trọng quyền riêng tư của bạn và chỉ xử lý những thông tin tối thiểu cần thiết, như mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể dùng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời của bạn được tính điểm ngay trên trình duyệt và không bao giờ được gửi đến hay lưu trên máy chủ của chúng tôi. Chúng tôi chỉ đếm ẩn danh loại quái vật nào xuất hiện, để cho biết mỗi kết quả phổ biến ra sao.'],
      ['2. Cookie và công nghệ tương tự', 'Dịch vụ có thể dùng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xoá cookie trong cài đặt trình duyệt; khi đó một số tính năng có thể không hoạt động đúng.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo thông qua Google AdSense. Google và các đối tác có thể dùng cookie để hiển thị quảng cáo dựa trên lượt truy cập trước đây của bạn vào trang này và các trang khác. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hoá quảng cáo tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Thống kê', 'Chúng tôi lưu tổng số liệu ẩn danh theo ngày (lượt xem trang, số lần hoàn thành test, đánh giá sao) để cải thiện Dịch vụ. Các số liệu này không thể dùng để nhận diện cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu có câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với đơn vị vận hành trang web.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 27 tháng 9 năm 2026.'],
    ],
    back: '← Quay lại trắc nghiệm quái vật',
  },

  questions: [
    { q: 'Bỗng dưng có lời mời gấp đi tiệc Halloween tối nay. Bạn nghĩ gì đầu tiên?', choices: [
      'Mặc gì đây? Phải thật để đời.',
      'Có đồ ăn không? Vậy thì đi liền.',
      'Ừm… có ai đi cùng không nhỉ?',
      'Trang trí với playlist để mình lo!',
    ] },
    { q: 'Tiệc bắt đầu được 30 phút. Bạn đang ở đâu?', choices: [
      'Giữa sàn nhảy, tay chân vung tứ tung',
      'Ở bàn đồ ăn. Đĩa thứ ba rồi.',
      'Góc yên tĩnh, đang tám chuyện nghiêm túc với một người',
      'Không hiểu sao đã thân với cả đám rồi',
    ] },
    { q: 'Một tiếng hét vang lên cuối hành lang tối om. Bạn…', choices: [
      'Hét to hơn, rồi phá lên cười',
      'Lao tới ngay. Biết đâu ai đó cần giúp!',
      'Đứng hình, lặng lẽ dán mình vào tường',
      'Bình tĩnh xem giờ. Chắc lại trò đùa thôi.',
    ] },
    { q: 'Nửa đêm, đói bụng. Bạn với tay lấy gì?', choices: [
      'Món gì đó đỏ và sang: nước ép cherry với socola đen',
      'Bất cứ thứ gì trong tủ lạnh. Tất cả luôn.',
      'Cacao nóng pha công thức bí truyền của riêng mình',
    ] },
    { q: 'Chiến lược trang phục Halloween của bạn?', choices: [
      'Tự tay may. Chuẩn bị từ tháng 8 rồi.',
      'Ga giường cũ khoét hai lỗ mắt. Xong.',
      'Quấn quanh người bất cứ thứ gì có sẵn. Giấy vệ sinh cũng tính.',
      'Mỗi giờ một phong cách khác. Cho mọi người đoán chơi.',
    ] },
    { q: 'Bing boong! Có mấy bé xin kẹo trước cửa. Bạn…', choices: [
      'Phát nguyên thanh kẹo to và khen nức nở từng bộ đồ',
      'Nấp sau cửa rồi bất ngờ hù (nhẹ nhàng thôi)',
      'Tắt đèn, hé rèm nhìn ra. Nhà không có ai đâu.',
    ] },
    { q: 'Bạn bè hay miêu tả bạn thế nào?', choices: [
      'Nhìn dữ vậy chứ thật ra mềm lòng cực',
      'Lúc nào cũng đúng giờ và bình tĩnh đến lạ',
      'Muốn làm gì thì làm mà chẳng ai giận nổi',
      'Bí ẩn. Hỏi gì cũng có cách giải quyết',
    ] },
    { q: '3 giờ sáng, tiệc sắp tàn. Bạn đang…', choices: [
      'Mới bắt đầu thôi. Về nhà mình chơi tiếp!',
      'Ngủ trên ghế sofa. Từ 11 giờ rồi.',
      'Gói đồ ăn thừa vào hộp, dán nhãn cẩn thận',
      'Sửa cái loa ai đó làm hỏng để nhạc chơi tiếp',
    ] },
    { q: 'Bước ra ngoài, thấy trăng tròn to vành vạnh. Bạn cảm thấy…', choices: [
      'Máu lửa. Phải chạy đi đâu đó ngay!',
      'Mơ màng. Đêm đẹp thế này để đi dạo lặng lẽ.',
      'Ấm áp. Về nhà thôi: chăn, trà, phim cũ.',
      'May mắn. Nhanh, ước một điều gì đi!',
    ] },
    { q: 'Chọn câu châm ngôn cho đêm Halloween của bạn.', choices: [
      'Nhảy như chẳng ai nhìn. Toàn ma cả mà.',
      'Chín mạng, không lo nghĩ gì.',
      'Đúng giờ, lần nào cũng vậy.',
      'Chuyện gì cũng có phép giải hết.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Ma cà rồng',
      catch: 'Đến trễ mà vẫn sang chảnh, có mặt là thành tâm điểm.',
      desc: 'Bạn là sinh vật bóng đêm với gu thẩm mỹ hoàn hảo — từ trang phục, âm nhạc đến món ăn vặt. Người ta bị cuốn hút trước khi bạn kịp nói câu nào, và bạn luôn biết cách xuất hiện thật ấn tượng. Thà thức đến sáng để trò chuyện thật sâu còn hơn đi ngủ sớm. Đúng là hơi drama một chút, nhưng chính vì thế mà ai cũng mê bạn.',
      strengths: ['Sức hút khó cưỡng', 'Gu thẩm mỹ hoàn hảo', 'Thức khuya bền bỉ'],
      party: 'Người đến sau cùng mà lập tức thành tâm điểm của cả bữa tiệc.',
    },
    werewolf: {
      name: 'Người sói',
      catch: 'Hết lòng vì bầy đàn, bên trong hoang dã không giới hạn.',
      desc: 'Bạn có năng lượng vô tận và trái tim to như trăng rằm. Bạn bè chính là bầy đàn của bạn, gọi là bạn phi ngay giữa đêm khuya để có mặt. Bạn thẳng thắn đến mức thật thà quá mức, lúc nào cũng đói, và tâm trạng thì… cứ gọi là theo chu kỳ mặt trăng. Đã tham gia là chơi hết mình, cả nhóm cũng bị cuốn theo.',
      strengths: ['Trung thành hết mình', 'Năng lượng vô tận', 'Thật thà dễ thương'],
      party: 'Người dẫn đầu xông vào bàn đồ ăn rồi hú theo từng bài nhạc.',
    },
    witch: {
      name: 'Phù thuỷ',
      catch: 'Pha chế ý tưởng, bày mưu tính kế, không bao giờ hết chiêu.',
      desc: 'Tò mò, thông minh và hơi tinh nghịch — lúc nào cũng có kế hoạch, kế hoạch dự phòng, và cả một nguyên liệu bí mật. Bạn thích sưu tầm những chuyện lạ rồi biến chúng thành thứ hữu ích (hoặc hỗn loạn một cách đáng yêu). Bạn bè hay tìm bạn xin lời khuyên vì cách bạn nói luôn đúng. Độc lập từ trong ra ngoài, bạn thà tự đi chổi bay còn hơn chờ ai đó chở đi.',
      strengths: ['Xử lý vấn đề cực nhạy', 'Tò mò vô hạn', 'Có cách cho mọi chuyện'],
      party: 'Pha mấy ly nước bí ẩn trong bếp và xem bói vui cho cả đám.',
    },
    ghost: {
      name: 'Bóng Ma',
      catch: 'Trầm lặng, dịu dàng, mà lại là người hài nhất ở đây.',
      desc: 'Bạn lướt qua cuộc sống nhẹ nhàng và để ý mọi thứ người khác bỏ lỡ. Không hẳn là nhút nhát — bạn chỉ thích vài người bạn thật lòng hơn là cả một đám đông. Khi bạn lên tiếng, đúng lúc đến mức khiến cả nhóm bật cười. Bạn cũng là bậc thầy biến mất êm ru: vừa mới ở đây, đã yên vị ở nhà lúc nào không hay.',
      strengths: ['Quan sát cực nhạy', 'Đùa tỉnh queo cực đỉnh', 'Có mặt là thấy bình yên'],
      party: 'Lướt qua các phòng, nghe lỏm chuyện hay nhất, rồi biến mất không dấu vết.',
    },
    zombie: {
      name: 'Xác sống',
      catch: 'Chậm rãi, đều đều, và tuyệt đối chẳng có gì làm phiền nổi.',
      desc: 'Chẳng gì làm bạn dao động. Deadline, drama, hỗn loạn — bạn cứ lê bước theo tốc độ của riêng mình mà rồi vẫn tới đích. Bạn sống nhờ đồ ăn vặt và giấc ngủ trưa, là bằng chứng sống rằng "thư giãn" cũng là một siêu năng lực. Bạn bè yêu sự dễ tính của bạn; có đồ ăn là bạn đi liền. Chỉ đừng đánh thức bạn trước giờ trưa.',
      strengths: ['Bình tĩnh không lay chuyển', 'Sống thuận theo dòng chảy', 'Kiên trì bất ngờ'],
      party: 'Ngồi sofa, mỗi tay một đĩa đồ ăn, an nhiên như không có gì xảy ra.',
    },
    mummy: {
      name: 'Xác ướp',
      catch: 'Tâm hồn hoài cổ được bọc trong lớp lớp ấm áp.',
      desc: 'Bạn yêu ngôi nhà của mình, những thói quen quen thuộc và kệ đồ được sắp xếp gọn gàng tăm tắp. Bạn giữ mọi thứ nhiều năm liền — vé xem phim cũ, ảnh xưa, tình bạn — và chăm chút chúng cẩn thận. Có người bảo bạn cổ điển; bạn gọi đó là vượt thời gian. Ẩn dưới lớp lớp ấy là một trái tim ấm áp, đáng tin cậy suốt hàng thế kỷ.',
      strengths: ['Đáng tin cậy tuyệt đối', 'Ngăn nắp cực đỉnh', 'Giữ bạn bè mãi mãi'],
      party: 'Quấn chăn bên lò sưởi, kể chuyện "hồi xưa" hay nhất hội.',
    },
    frank: {
      name: 'Quái vật Frankenstein',
      catch: 'To con, hiền lành, được tạo nên bằng cả tấm lòng.',
      desc: 'Thoạt nhìn có vẻ nghiêm túc, nhưng ai hiểu bạn đều biết bạn là người tốt bụng nhất phòng. Bạn là người thích tự tay làm — sửa đồ, chế đồ, và thể hiện tình cảm bằng hành động hơn lời nói. Đôi lúc bạn thấy hơi bị hiểu lầm, nhưng những người bạn thật sự hiểu bạn sẽ làm mọi thứ vì bạn. Sống rồi đấy… và đáng yêu cực kỳ.',
      strengths: ['Tay nghề sửa chữa đỉnh', 'Trái tim vàng', 'Vững vàng đáng tin cậy'],
      party: 'Lặng lẽ sửa lại đèn, rồi lóng ngóng khiêu vũ chậm khi đúng bài nhạc yêu thích vang lên.',
    },
    pumpkin: {
      name: 'Đèn bí ngô',
      catch: 'Nụ cười rạng rỡ, có mặt là vui liền tức khắc.',
      desc: 'Bạn thắp sáng mọi căn phòng — gần như theo nghĩa đen. Sự lạc quan của bạn lây lan, tiếng cười thì to, và thường chính bạn là người lên kế hoạch từ đầu. Bạn khiến ai cũng thấy được chào đón và chẳng bao giờ quên tên một ai. Ngay cả đêm tối nhất, bạn vẫn tìm ra điều để cười, và giúp mọi người tìm thấy điều đó nữa.',
      strengths: ['Lạc quan dễ lây', 'Sinh ra để làm chủ tiệc', 'Khiến ai cũng thấy được chào đón'],
      party: 'Chủ tiệc, người khuấy động không khí, và lý do cả đám kéo tới.',
    },
    blackcat: {
      name: 'Mèo đen',
      catch: 'Bí ẩn, độc lập, ngầu một cách không tưởng.',
      desc: 'Bạn làm mọi thứ theo cách riêng và trông cực ngầu mà chẳng cần cố gắng. Bạn kén chọn ai được đến gần, nhưng một khi đã chọn ai, người đó có bạn suốt cả chín kiếp. Bạn thích ngủ trưa ngon, góc yên tĩnh và được để yên một mình — cho đến khi bỗng dưng muốn cả thế giới chú ý. Có người bảo bạn xui xẻo. Bạn bè thì biết, bạn chính là bùa may mắn.',
      strengths: ['Phong cách tự nhiên mà ngầu', 'Trực giác nhạy bén', 'Khó gần nhưng chung tình'],
      party: 'Ngồi ở chỗ đẹp nhất nhà, âu yếm phán xét từng người một.',
    },
    reaper: {
      name: 'Thần chết',
      catch: 'Điềm tĩnh, đúng giờ, chưa bao giờ trễ deadline.',
      desc: 'Bạn là sự bình tĩnh giữa cơn bão của mọi người. Khi người khác hoảng loạn, bạn kiểm tra lịch trình, lên kế hoạch và hoàn thành — đúng giờ, lần nào cũng vậy. Óc hài hước của bạn khô đến mức người ta phải một tiếng sau mới nhận ra bạn đang đùa. Chiếc áo choàng trông đáng sợ, nhưng thực ra chính bạn là người đảm bảo ai cũng về nhà an toàn.',
      strengths: ['Bình tĩnh dưới áp lực', 'Canh giờ hoàn hảo', 'Quan tâm thầm lặng'],
      party: 'Xem giờ lúc 11 giờ 58, rồi rất điềm tĩnh thông báo bài hát cuối cùng.',
    },
    fox: {
      name: 'Hồ ly chín đuôi',
      catch: 'Biến hình khắp nơi, mỉm cười hợp với mọi hoàn cảnh.',
      desc: 'Bạn hợp với mọi nơi — bữa tối sang trọng, tiệc nhà hỗn loạn, họp mặt gia đình. Bạn đọc vị người khác cực nhanh và luôn biết nói điều đúng lúc. Thông minh và tinh nghịch, bạn thích chơi trò gì đó và thường thắng. Đằng sau bao gương mặt duyên dáng ấy là một người chung thuỷ hết mực với số ít người từng thấy đuôi thật của bạn.',
      strengths: ['Đọc vị tình huống tức thì', 'Ăn nói lanh lợi', 'Thích nghi với mọi chuyện'],
      party: 'Đổi trang phục hai lần rồi không hiểu sao đã thân với bà của chủ tiệc.',
    },
    skeleton: {
      name: 'Bộ xương',
      catch: 'Xương sống hài hước? Bạn toàn là xương hài thôi.',
      desc: 'Bạn không sống quá nghiêm túc — và đó chính là bí quyết của bạn. Bạn pha trò đúng lúc dở khóc dở cười nhất, có cớ là nhảy múa liền, và có thể làm ai đó vui lên chỉ trong 30 giây. Bạn sống nhẹ nhàng và đơn giản: không drama, không rườm rà, chỉ toàn năng lượng tích cực. Ở gần bạn, ai cũng thấy nhẹ nhõm như vừa trút được vài cân lo âu.',
      strengths: ['Vực dậy tinh thần tức thì', 'Tưng tửng không sợ hãi', 'Nhẹ nhàng không drama'],
      party: 'Lóc cóc trên sàn nhảy rồi bày trò xếp hàng conga chẳng ai nhờ.',
    },
  },
};
