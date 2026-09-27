/* Past Life Quiz — Tiếng Việt (/vi/)
 * Same 16 archetype ids and question/choice order as data.js (scoring weights live only there).
 * Reader is always "bạn". Korean roles use Sino-Vietnamese names Vietnamese readers already know (Cao Ly, Tân La, Bột Hải,
 * Ngự thiện phòng from "Nàng Dae Jang Geum", quan ngự sử vi hành à la Bao Thanh Thiên, "xem hồi sau sẽ rõ"), plus local
 * internet slang (con sen, chốt đơn, shipper, đắt show). Keys ending in Html are raw HTML; no spoilers in meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: { fontCss: ['https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap'], font: "'Be Vietnam Pro', 'Segoe UI', Roboto, Arial, sans-serif" },

  meta: {
    title: 'Trắc nghiệm kiếp trước: Kiếp trước bạn là ai?',
    description: 'Trắc nghiệm kiếp trước miễn phí: “Kiếp trước tôi là ai?” — 12 câu hỏi đời thường, 2 phút là có đáp án. Bói kiếp trước cho vui, không cần đăng ký.',
    ogTitle: 'Trắc nghiệm kiếp trước — Kiếp trước bạn là ai?',
    ogDescription: 'Test kiếp trước miễn phí, chỉ 2 phút: 12 câu hỏi đời thường, 16 kiếp trước đang chờ. Kiếp trước bạn là ai?',
  },
  siteName: 'Trắc nghiệm kiếp trước',
  landing: {
    badge: '🔮 Vui hơn cả xem tử vi',
    h1Kicker: 'Trắc nghiệm kiếp trước',
    h1Html: 'Kiếp trước<br>bạn là <em>ai</em>?',
    hookHtml: 'Mười hai câu hỏi. Hai phút thôi.<br>Rồi gặp lại chính bạn của kiếp trước.',
    metaTime: '⏱️ 2 phút',
    metaResults: '📜 16 kiếp trước',
    start: 'Xem kiếp trước của mình →',
    backAria: 'Câu hỏi trước',
    loading: 'Đang phủi bụi ký ức kiếp trước của bạn…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Trắc nghiệm kiếp trước hoạt động thế nào?', a: 'Mỗi câu trả lời trong 12 câu sẽ cộng điểm cho vài kiếp trước, kiếp nào nhiều điểm nhất sẽ là của bạn. Mọi phiên bản ngôn ngữ đều chấm điểm y hệt nhau.' },
    { q: 'Kết quả có chính xác không?', a: 'Đây là trò chơi cho vui chứ không phải bói toán thật — một tấm gương vui nhộn phản chiếu thói quen hằng ngày của bạn. Dù vậy, rất nhiều người thấy kết quả giống mình đến bất ngờ.' },
    { q: 'Làm lại có ra kết quả khác không?', a: 'Có. Kết quả chỉ phụ thuộc vào câu trả lời của bạn, nên trả lời khác đi thì bạn hoàn toàn có thể gặp một kiếp trước khác.' },
    { q: 'Câu trả lời có bị lưu lại không?', a: 'Không. Câu trả lời được chấm điểm ngay trên trình duyệt của bạn, không hề được gửi đi hay lưu trữ ở đâu cả. Không cần đăng ký.' },
  ],
  privacyLink: 'Chính sách quyền riêng tư',
  result: {
    title: 'Trắc nghiệm kiếp trước: {name}',
    shareText: 'Kiếp trước mình là {name} {emoji} — “{tagline}”. Còn bạn, kiếp trước bạn là ai?',
    ctaStrong: 'Bạn bè vừa khoe kết quả kiếp trước với bạn',
    ctaSub: 'Tò mò kiếp trước bạn là ai? Chỉ mất 2 phút thôi.',
    eyebrow: 'Kiếp trước, bạn từng là',
    adviceLabel: 'Lời khuyên cho kiếp này —',
    good: 'Tri kỷ kiếp trước',
    bad: 'Oan gia kiếp trước',
    retry: 'Làm lại trắc nghiệm',
  },
  og: {
    eyebrow: 'Kiếp trước, bạn từng là',
    brand: '🔮 Trắc nghiệm kiếp trước',
    defaultTitle: 'Trắc nghiệm kiếp trước',
    defaultDesc: '12 câu hỏi, 2 phút. Kiếp trước bạn là ai?',
  },
  privacy: {
    description: 'Chính sách quyền riêng tư của Trắc nghiệm kiếp trước — cách chúng tôi sử dụng cookie, quảng cáo và công cụ phân tích.',
    h1: 'Chính sách quyền riêng tư',
    introHtml: 'Trắc nghiệm kiếp trước (sau đây gọi là “Dịch vụ”) tôn trọng quyền riêng tư của bạn và chỉ xử lý lượng thông tin tối thiểu cần thiết, như được mô tả dưới đây.',
    sections: [
      ['1. Thông tin chúng tôi thu thập', 'Bạn có thể sử dụng Dịch vụ mà không cần đăng ký hay đăng nhập. Câu trả lời trắc nghiệm của bạn chỉ được xử lý ngay trong trình duyệt và không bao giờ được lưu trên máy chủ của chúng tôi. Một số thông tin có thể được thu thập tự động trong quá trình bạn sử dụng Dịch vụ, như mô tả dưới đây.'],
      ['2. Cookie và các công nghệ tương tự', 'Dịch vụ có thể sử dụng cookie để hiển thị quảng cáo và tìm hiểu cách Dịch vụ được sử dụng. Bạn có thể từ chối hoặc xóa cookie trong phần cài đặt trình duyệt; khi đó, một số tính năng có thể không hoạt động bình thường.'],
      ['3. Quảng cáo (Google AdSense)', 'Dịch vụ hiển thị quảng cáo thông qua Google AdSense. Google và các đối tác có thể sử dụng cookie để phân phát quảng cáo dựa trên những lần bạn truy cập trước đây vào trang này và các trang web khác. Bạn có thể tìm hiểu thêm và thay đổi cài đặt cá nhân hóa quảng cáo tại <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Cài đặt quảng cáo của Google</a>.'],
      ['4. Phân tích (Google Analytics)', 'Dịch vụ có thể sử dụng Google Analytics (GA4) để nắm được số lượng khách truy cập và nguồn truy cập, từ đó cải thiện Dịch vụ. Dữ liệu này chỉ được dùng cho mục đích thống kê và không nhận dạng cá nhân bạn.'],
      ['5. Liên hệ', 'Nếu bạn có bất kỳ câu hỏi nào về Chính sách quyền riêng tư này, vui lòng liên hệ với đơn vị vận hành trang web.'],
      ['6. Ngày hiệu lực', 'Chính sách này có hiệu lực từ ngày 1 tháng 1 năm 2026.'],
    ],
    back: '← Quay lại Trắc nghiệm kiếp trước',
  },

  types: {
    sura: {
      name: 'Thượng cung Ngự thiện phòng triều Joseon',
      tagline: 'Một nhúm muối thôi cũng đủ đổi tâm trạng nhà vua',
      story: 'Ở Ngự thiện phòng — gian bếp hoàng cung triều Joseon, đúng cái bếp trong phim “Nàng Dae Jang Geum” đấy — tâm trạng cả ngày của nhà vua được quyết định ngay trên đầu ngón tay bạn. Quan trọng hơn chuyện “mặn hay nhạt” là “mâm cơm này thật ra dành cho ai?”, và bạn luôn là người đọc ra điều đó đầu tiên. Bạn điều khiển hàng chục cung nữ nhịp nhàng như đồng hồ, nhưng chưa từng tiết lộ công thức riêng cho bất kỳ ai. Cầu toàn đến tận xương tủy: dâng lên mâm ngự thiện ngon nhất mỗi ngày chính là toàn bộ niềm kiêu hãnh của bạn.',
      traits: ['Món ăn lẫn không khí đều phải hoàn hảo', 'Để kết quả lên tiếng, không thèm buôn chuyện', 'Với người của mình thì mở kho không tiếc tay'],
      advice: 'Thỉnh thoảng nêm hơi đậm tay một chút cũng chẳng sao, ai cũng sẽ bỏ qua cho bạn.',
    },
    celadon: {
      name: 'Nghệ nhân gốm men ngọc Cao Ly',
      tagline: 'Nung cả nghìn chiếc bình, đập gần hết chỉ vì “chưa đạt”',
      story: 'Bạn thức trắng đêm bên lò nung, quyết tái hiện cho bằng được sắc men xanh ngọc huyền thoại của triều Cao Ly (Goryeo) — thứ màu quý đến mức sứ thần nhà Tống sang thăm còn ghi chép lại mà khen nức nở. Chỉ cần sắc men lệch đi một chút, bạn cầm búa lên chẳng chút do dự, còn đám học trò thì rón rén quanh những tiêu chuẩn mà họ chẳng tài nào hiểu nổi. Với bạn, chiếc bình men ngọc không phải đồ đựng — đó là một mảnh bầu trời. Số lần thất bại nhiều hơn hẳn số tác phẩm hoàn thành, nhưng thứ thế gian còn nhớ lại chính là những kiệt tác.',
      traits: ['Tiêu chuẩn: cao. Cao quá mức cần thiết.', 'Chậm thôi, nhưng làm là làm tới nơi tới chốn', 'Lặng lẽ nhưng cứng đầu hết chỗ nói'],
      advice: 'Dừng lại ở lần thứ chín mươi chín cũng đã đẹp lắm rồi.',
    },
    hwarang: {
      name: 'Hiệp sĩ Hoa Lang (Hwarang) xứ Tân La',
      tagline: 'Nhan sắc lẫn võ nghệ chuẩn “tuyển quốc gia” từ thế kỷ 6',
      story: 'Kiếm thuật lẫn học vấn đều top đầu — lại còn nổi tiếng đến phát sốt. Bạn chính là “át chủ bài” của Hoa Lang, đội thanh niên tinh anh mệnh danh “hoa của tuổi trẻ” thuộc vương quốc cổ Tân La (Silla) của Hàn Quốc — vâng, đúng hội mỹ nam trong phim “Hwarang” có Park Seo-joon và V (BTS) đấy. Ngay cả khi rong ruổi núi sông rèn luyện thân tâm, lúc nào cũng có một nhóm fan thầm lặng cổ vũ bạn từ đâu đó. Bạn coi danh dự còn hơn mạng sống, và thấy thắng kiểu gian lận còn nhục hơn thua. Dù ở chiến trường hay ngoài chợ, tên bạn luôn là chủ đề bàn tán số một.',
      traits: ['Đi đâu cũng tự nhiên thành tâm điểm', 'Coi danh dự và nguyên tắc là bất khả xâm phạm', 'Cứ có cạnh tranh là ánh mắt khác hẳn'],
      advice: 'Cùng nhau vui vẻ cũng “lời” chẳng kém gì chiến thắng đâu.',
    },
    viking: {
      name: 'Hoa tiêu Viking',
      tagline: 'Chỗ nào không có trên bản đồ, bạn lại càng muốn đến',
      story: 'Lái chiếc thuyền dài xuyên màn sương Biển Bắc, với bạn “nguy hiểm” chỉ có nghĩa là “nghe vui đấy”. Để được sướng rơn khi nhìn thấy một đường bờ biển chưa tấm bản đồ nào vẽ tới, vài cơn bão cũng là cái giá xứng đáng. Định cư một chỗ ư? Không đời nào — bạn luôn tò mò về chuyến hải trình kế tiếp hơn, đúng kiểu “chân không chịu đứng yên”. Thủy thủ đoàn lo sốt vó, nhưng rốt cuộc vẫn theo bạn. Dù sao thì lần nào bạn cũng sống sót trở về.',
      traits: ['Mắt sáng rực trước bất cứ thứ gì mới', 'Gặp khủng hoảng lại bình tĩnh đến lạ', 'Ở một chỗ lâu là bứt rứt không yên'],
      advice: 'Thỉnh thoảng cứ thả neo mà tận hưởng nơi mình đang đứng cũng được mà.',
    },
    pharaoh_cat: {
      name: 'Mèo cưng của Pharaoh',
      tagline: 'Được tôn thờ như thần, dành cả ngày để… ngủ trưa',
      story: 'Trong cung điện Ai Cập cổ đại, bạn là chú mèo được tôn kính như thần linh. Bạn có làm gì đặc biệt không? Không hề. Bạn chỉ ngồi đúng chỗ nắng đẹp nhất và ngắm đám “con sen” loài người tự giác cung phụng mình. Nhưng chỉ cần bạn hơi lộ vẻ khó chịu, cả cung điện lập tức nháo nhào — dù chẳng ai muốn nhắc lại chuyện đó. Nhìn thì tưởng chẳng làm gì, nhưng chỉ riêng sự hiện diện của bạn đã đủ nắm mọi thứ trong lòng bàn tay.',
      traits: ['Quan sát thanh lịch, di chuyển tối thiểu', 'Một cái liếc mắt là đổi cả bầu không khí', 'Thiên tài né việc nhà'],
      advice: 'Thần linh mà thỉnh thoảng đích thân ra mặt thì còn được kính nể hơn nữa.',
    },
    renaissance: {
      name: 'Học trò của danh họa thời Phục Hưng',
      tagline: 'Đang pha màu thì bị bắt quả tang… có tài',
      story: 'Trong một xưởng vẽ ở Florence, bạn nghiền bột màu và rửa cọ dưới cái bóng của một bậc thầy vĩ đại. Rồi một hôm, nhân lúc thầy vắng nhà, bạn vẽ nốt một góc phông nền — và hóa ra đó lại là phần tự nhiên nhất của cả bức tranh. Bạn trau dồi tay nghề một cách lặng lẽ, chẳng ai hay biết, nhưng chắc chắn. Giấu nơi đầu ngọn cọ là một giấc mơ: một ngày nào đó, sẽ có bức tranh mang chính tên bạn.',
      traits: ['Con mắt tinh tường đến từng chi tiết', 'Giỏi một cách lặng lẽ, chẳng cần phô trương', 'Gu quá rõ ràng nên không chịu nổi kiểu “tạm được”'],
      advice: 'Tay nghề đã đủ chín rồi. Đến lúc ký tên mình lên tranh thôi.',
    },
    jeongi: {
      name: 'Người kể chuyện “đắt show” nhất Seoul xưa',
      tagline: 'Bậc thầy “xem hồi sau sẽ rõ” từ 200 năm trước Netflix',
      story: 'Ở các khu chợ Seoul xưa (khi ấy gọi là Hán Dương), hễ bạn xuất hiện là người ta bỏ dở mọi việc. Bạn là một jeon-gi-su — người kể chuyện chuyên nghiệp, đọc to những cuốn tiểu thuyết đang thịnh hành cho cả đám đông nghe. Tuyệt chiêu của bạn: dừng phắt ngay đoạn gay cấn nhất, kiểu “muốn biết sự thể ra sao, xem hồi sau sẽ rõ”, rồi chờ tiền đồng rơi lẻng xẻng mới chịu kể tiếp. Nói thật thì một nửa câu chuyện là bạn ứng tác tại chỗ, nhưng nghe thuyết phục đến mức chẳng ai phát hiện. Qua tay bạn, đến chuyện “tám” của hàng xóm cũng thành sử thi.',
      traits: ['Có tài “thêm mắm dặm muối” cho mọi câu chuyện', 'Căn thời điểm và đọc không khí cực chuẩn', 'Biết thừa cách kéo đám đông tụ lại'],
      advice: 'Thỉnh thoảng cứ kể luôn cái kết cho người ta đi mà.',
    },
    silkroad: {
      name: 'Thương nhân trên Con đường tơ lụa',
      tagline: 'Mỗi lần qua một biên giới là thêm một hội bạn',
      story: 'Chở lụa là và hương liệu băng qua sa mạc, vượt những đèo núi phủ tuyết, bạn chưa bao giờ bị ngoại ngữ làm khó — vài cử chỉ tay chân kèm một nụ cười toe toét là “chốt đơn” cái một. Thành ốc đảo nào cũng có một người bạn chờ đón, và mạng lưới quan hệ ấy chính là tài sản lớn nhất của bạn. Thứ bạn để lại không chỉ là hàng hóa mà là con người: một “công dân toàn cầu” bẩm sinh, trùm giao lưu chính hiệu.',
      traits: ['Đến đâu cũng thân với người ta trong nháy mắt', 'Mặc cả được giá mà vẫn giữ trọn tình cảm', 'Thích nghi với văn hóa mới cực nhanh'],
      advice: 'Thỉnh thoảng cứ vui vẻ nhận quà mà đừng mặc cả nhé.',
    },
    monk_scribe: {
      name: 'Tu sĩ chép sách ở tu viện Trung cổ',
      tagline: 'Chép sách dưới ánh nến mà không sai một chữ nào',
      story: 'Trong một tu viện châu Âu thời Trung cổ, công việc của bạn là chép kinh thánh lên giấy da suốt cả ngày. Chăm chú tuyệt đối, chẳng thèm liếc ngang liếc dọc — vậy mà bạn vẫn lén vẽ những hình nguệch ngoạc ngớ ngẩn bên lề trang. Nơi người khác chỉ thấy sự lặp lại vô tận, bạn tìm thấy nhịp điệu và sự tĩnh lặng của riêng mình. (Chuyện có thật đấy: các bản chép tay thời Trung cổ đầy hình vẽ bậy bên lề, chẳng hạn hiệp sĩ đang đánh nhau với… ốc sên khổng lồ.)',
      traits: ['Đã tập trung là cả thế giới biến mất', 'Bề ngoài trầm lặng, bên trong hài hước hết nấc', 'Lỗi nhỏ xíu cũng không thể cho qua'],
      advice: 'Gấp sách lại và ra ngoài hít thở chút đi. Thế giới không sụp đổ đâu.',
    },
    pirate_cook: {
      name: 'Đầu bếp trên tàu cướp biển',
      tagline: 'Chưa từng rút kiếm, vẫn nắm quyền cả con tàu',
      story: 'Bạn chưa đánh nhau lấy một lần, vậy mà trên con tàu ấy lời bạn nói là luật — muốn tối nay có món ngon thì đến tên hải tặc hung hãn nhất cũng phải ngoan ngoãn với bạn. Bạn là tâm hồn dịu dàng duy nhất giữa đám thủy thủ gai góc, và những hôm tồi tệ, họ lại lặng lẽ lảng vảng vào bếp tìm chút an ủi. Bề ngoài xù xì nhưng chăm lo cho người khác giỏi hơn ai hết: thế lực ngầm thật sự đứng sau thuyền trưởng.',
      traits: ['Thương ai là thể hiện bằng hành động — nhất là cho ăn', 'Vào hội “giang hồ” cũng hòa nhập ngon lành', 'Mềm lòng và chu đáo đến bất ngờ'],
      advice: 'Đừng chỉ lo cho người khác mãi. Để ai đó chăm lại bạn một lần đi.',
    },
    amhaeng: {
      name: 'Quan ngự sử vi hành triều Joseon',
      tagline: 'Giấu lệnh bài của nhà vua dưới bộ áo ăn mày',
      story: 'Bạn lê bước qua các khu chợ trong bộ quần áo rách rưới, nhưng trong tay áo lại giấu mapae — tấm lệnh bài khắc hình ngựa chứng minh bạn là quan ngự sử vi hành, được nhà vua bí mật cử đi bắt quan tham. Nghe viên quan sở tại nói đúng ba câu là bạn ngửi ra mùi dối trá; đến thời khắc quyết định, bạn rút lệnh bài, lộ thân phận và lật ngược cả thế cờ — đúng chất Bao Thanh Thiên đi vi hành phiên bản Joseon. Nhìn thấu sự thật trong khi thiên hạ bị vẻ bề ngoài đánh lừa? Đó chính là cảm giác đã nhất. Chẳng có vũ khí gì ngoài lòng chính nghĩa, bạn rong ruổi khắp chốn làm “người giải quyết rắc rối” thầm lặng của Joseon.',
      traits: ['Bắt bài nói dối chuẩn đến đáng sợ', 'Nhìn xuyên vẻ ngoài để thấy bản chất', 'Đã tin mình đúng là theo đến cùng'],
      advice: 'Không phải ai cũng đang che giấu điều gì đâu, thỉnh thoảng cứ tin người ta một chút.',
    },
    gladiator: {
      name: 'Đấu sĩ La Mã',
      tagline: 'Siêu sao đấu trường Colosseum, ai ngờ nhát như thỏ đế',
      story: 'Vừa bước chân vào Colosseum, cả khán đài đã đồng thanh hô vang tên bạn. Đằng sau gương mặt đầy thần thái ấy là một người lần nào cũng run cầm cập hai đầu gối — nhưng chưa ai từng phát hiện ra. “Thắng trận này xong là giải nghệ, mở một quán nhậu nho nhỏ,” bạn tự nhủ… rồi lại cầm kiếm lên. Sợ muốn xỉu nhưng lần nào cũng bước ra đấu trường: một ngôi sao có sức hút “ngược đời” khó cưỡng.',
      traits: ['Che giấu sự hồi hộp như dân chuyên nghiệp', 'Lên sân khấu là thần thái bùng nổ', 'Lén ấp ủ những ước mơ nhỏ bé, giản dị'],
      advice: 'Thừa nhận mình sợ cũng chẳng khiến ai coi thường bạn đâu.',
    },
    teahouse: {
      name: 'Chủ quán trà thời nhà Thanh',
      tagline: 'Chỉ nhìn mặt khách là đoán trúng nỗi niềm hôm nay',
      story: 'Nơi một góc phố nhỏ khuất nẻo của Trung Hoa thời nhà Thanh, quán trà của bạn chưa bao giờ vắng khách. Nổi tiếng hơn cả trà là trực giác của bạn: khách vừa ngồi xuống, bạn đã đoán được kha khá hôm nay họ trải qua chuyện gì. Tin đồn, tâm sự, lời khuyên cuộc đời — tất cả đều bắt đầu từ quán trà nhỏ ấy. Bạn chẳng bao giờ gặng hỏi; chỉ rót một chén trà, vậy mà người ta đã thấy lòng nhẹ đi.',
      traits: ['Đọc vị không khí chỉ trong vài giây', 'Chuyện gì xảy ra cũng điềm tĩnh, thong thả', 'Người khác tự nhiên muốn mở lòng với bạn'],
      advice: 'Hôm nay gác chuyện của thiên hạ lại, kể chuyện của bạn đi.',
    },
    ninja_mailman: {
      name: 'Ninja thời Edo (thật ra là shipper)',
      tagline: 'Di chuyển như cái bóng, chưa làm thất lạc một lá thư nào',
      story: 'Bạn là một ninja thứ thiệt, khổ luyện nghiêm ngặt đàng hoàng — nhưng nhiệm vụ thực sự lại là… bí mật đưa thư. Bao nhiêu tài phi thân, leo tường vượt mái đều dồn hết vào một việc: giao đúng chỗ và không bao giờ trễ hẹn. Ai cũng tưởng tượng ra những phi vụ nghẹt thở, còn bạn sống mỗi ngày với niềm tự hào giản dị mang tên “giao hàng đúng giờ” — shipper năm sao của thời Edo. Hóa ra người đáng tin cậy nhất quanh đây lại chính là bạn.',
      traits: ['Việc gì được giao cũng làm chuẩn chỉnh, hoàn hảo', 'Được nể nhờ sự bền bỉ, không phải hào nhoáng', 'Có khiếu hài hước “ngầm” không ai ngờ tới'],
      advice: 'Đừng giấu nghề nữa. Cứ khoe một chút đi, có sao đâu.',
    },
    atlantis: {
      name: 'Người gác hải đăng xứ Atlantis',
      tagline: 'Giữ ngọn đèn sáng mãi khi cả thành phố chìm dần',
      story: 'Ở thành phố huyền thoại Atlantis, vào cái đêm sóng mỗi lúc một dâng cao, bạn vẫn giữ cho ngọn hải đăng cháy sáng. Giữa nỗi kinh hoàng của một thành phố đang chìm dần, bạn là người duy nhất vững vàng bám trụ vị trí. Nhờ bạn, những con tàu cuối cùng đã an toàn rời cảng. Không hào nhoáng — nhưng là kiểu hiện diện mà ở đâu đó, có một người nhất định cần đến.',
      traits: ['Khủng hoảng càng lớn, bạn càng bình tĩnh', 'Có sức mạnh thầm lặng để trụ vững đến cùng', 'Suy nghĩ sâu sắc hơn nhiều so với vẻ ngoài'],
      advice: 'Thỉnh thoảng dựa vào ánh sáng của người khác một chút cũng không sao đâu.',
    },
    balhae: {
      name: 'Cung thủ kỵ binh xứ Bột Hải',
      tagline: 'Phi ngựa hết tốc lực mà vẫn bách phát bách trúng',
      story: 'Băng băng giữa gió buốt phương Bắc — nơi biên cương của Bột Hải (Balhae), một vương quốc cổ ở vùng Mãn Châu xa xôi phía đông bắc — tay cầm cung của bạn chưa hề run. Bạn đã luyện tập không biết bao nhiêu lần chỉ cho một khoảnh khắc: bắn trúng hồng tâm từ lưng ngựa đang phi nước đại. Trung thành với đồng đội hơn tất cả, bạn luôn xông lên dẫn đầu, và anh em cứ thế theo sau không chút do dự. Vừa nhanh vừa chuẩn cùng lúc: một sự kết hợp hiếm có khó tìm.',
      traits: ['Mọi thứ diễn ra nhanh cỡ nào vẫn giữ được độ chuẩn', 'Trung thành hết mực với anh em cùng hội', 'Có mục tiêu là lao thẳng tới luôn'],
      advice: 'Thỉnh thoảng cứ thong dong phi ngựa, chẳng cần nhắm vào đâu cả.',
    },
  },

  questions: [
    {
      q: 'Trong buổi tụ tập với bạn bè, bạn thường…',
      choices: [
        'Chốt món ăn trước tiên. Thực đơn quyết định cả bầu không khí.',
        'Ngồi một góc, lặng lẽ quan sát mọi chuyện.',
        'Thành tâm điểm của cuộc vui lúc nào không hay.',
        'Ngó nghiêng tìm chỗ mới, gương mặt mới.',
      ],
    },
    {
      q: 'Khi có sự cố bất ngờ, bạn…',
      choices: [
        'Ngáp một cái trước đã. Kiểu gì cũng có người lo.',
        'Lặng lẽ tự mình đào sâu cho đến khi tìm ra nguyên nhân.',
        'Biến nó thành một câu chuyện hài để kể lại sau.',
      ],
    },
    {
      q: 'Khi lên kế hoạch du lịch, bạn…',
      choices: [
        'Đi càng nhiều nước càng tốt, “sưu tầm” con dấu hộ chiếu.',
        'Đặt mục tiêu kết bạn với dân địa phương.',
        'Lên cả lộ trình xoay quanh… đồ ăn.',
      ],
    },
    {
      q: 'Nghe bạn thân kể vừa bị oan ức, bạn sẽ…',
      choices: [
        'Nói: “Rồi, trước tiên mình đi thu thập bằng chứng đã.”',
        'Hành động ngay, đi kiểm tra tận nơi luôn.',
        'Kéo bạn ấy ngồi xuống, pha ấm trà rồi lắng nghe.',
        'Âm thầm giúp đỡ từ phía sau.',
      ],
    },
    {
      q: 'Deadline dí sát nút mà đầu óc trống trơn. Bạn…',
      choices: [
        'Tắt đèn ngồi thẫn thờ — rồi ý tưởng bỗng lóe lên.',
        'Phác thật nhanh cả đống bản nháp rồi chọn cái ổn nhất.',
        'Gom đủ mọi tài liệu, tham khảo thật hoàn hảo rồi mới bắt đầu.',
      ],
    },
    {
      q: 'Khi mua sắm, bạn…',
      choices: [
        'Xem đi xem lại cho đến khi tìm được món ưng ý nhất.',
        'Chốt đơn luôn. Hối hận tính sau.',
      ],
    },
    {
      q: 'Vai trò của bạn trong bài tập nhóm?',
      choices: [
        'Định hướng và kéo cả nhóm tiến lên.',
        'Lặng lẽ hoàn thành phần mình thật hoàn hảo.',
        'Lo phần chi tiết và khâu hoàn thiện cuối cùng.',
      ],
    },
    {
      q: 'Nếu đăng gì đó lên mạng xã hội, đó sẽ là…',
      choices: [
        'Một tấm ảnh “sống ảo” thật đẹp của mình.',
        'Chuyện về những người thú vị gặp được khi đi du lịch.',
        'Một câu trích từ cuốn sách vừa đọc hôm nay.',
        'Ảnh món ăn mình vừa nấu xong.',
      ],
    },
    {
      q: 'Có người tìm đến bạn xin lời khuyên. Bạn…',
      choices: [
        'Bắt đầu bằng việc sắp xếp lại các sự thật.',
        'Nổi giận cùng họ luôn.',
        'Lặng lẽ lắng nghe và an ủi.',
      ],
    },
    {
      q: 'Khi học một thứ mới, phong cách của bạn là…',
      choices: [
        'Làm theo hướng dẫn từng bước, không sai sót.',
        'Lặng lẽ quan sát và tự mình hiểu ra trước.',
        'Nhảy vào làm luôn để bắt nhịp.',
      ],
    },
    {
      q: 'Bạn sắp trễ hẹn. Bạn…',
      choices: [
        'Đằng nào cũng trễ rồi, cứ thong thả đến rồi chiếm chỗ ngồi trước.',
        'Tính toán chính xác lộ trình để đến đúng từng phút.',
        'Đến muộn thì cũng phải xuất hiện thật ấn tượng.',
        'Nhân tiện thử luôn một con đường hoàn toàn mới.',
      ],
    },
    {
      q: 'Tóm tắt ngày hôm nay của bạn trong một câu:',
      choices: [
        'Né được hết mọi việc phiền phức. Một ngày hoàn hảo.',
        'Tìm thấy chút vẻ đẹp trong một điều nhỏ bé.',
        'Chuyện hôm nay mà kể ra thì ai cũng phải sốc.',
      ],
    },
  ],
};
