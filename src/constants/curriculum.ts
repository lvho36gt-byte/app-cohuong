export interface CurriculumTheme {
  id: string;
  name: string;
  order: number;
  objectives: string;
  readingFocus: string;
  grammarFocus: string;
  writingFocus: string;
  speakingFocus: string;
  localConnection: string;
}

export const CURRICULUM_THEMES: CurriculumTheme[] = [
  {
    id: 'theme-1',
    name: 'Tôi và các bạn',
    order: 1,
    objectives: 'Nhận biết đặc điểm truyện (nhân vật, sự việc, ngôi kể thứ nhất). Biết chia sẻ, đồng cảm với bạn bè cùng trang lứa.',
    readingFocus: 'Đọc hiểu truyện đồng thoại, truyện ngắn về tình bạn tuổi học trò.',
    grammarFocus: 'Từ đơn và từ phức (từ ghép, từ láy); biện pháp tu từ so sánh.',
    writingFocus: 'Viết bài văn kể lại một trải nghiệm của bản thân với bạn bè.',
    speakingFocus: 'Kể lại một trải nghiệm đáng nhớ với người bạn thân thiết.',
    localConnection: 'Kể về kỉ niệm cùng bạn cắp sách tới trường Quyết Tiến, chia nhau bắp ngô nướng mùa đông.'
  },
  {
    id: 'theme-2',
    name: 'Gõ cửa trái tim',
    order: 2,
    objectives: 'Cảm nhận tình cảm gia đình, lòng biết ơn cha mẹ, ông bà qua thơ lục bát và thơ có yếu tố tự sự, miêu tả.',
    readingFocus: 'Đặc điểm thơ (vần, nhịp, hình ảnh, tình cảm cảm xúc của nhân vật trữ tình).',
    grammarFocus: 'Biện pháp tu từ điệp ngữ; mở rộng trạng ngữ trong câu.',
    writingFocus: 'Tập làm thơ lục bát hoặc viết đoạn văn ghi lại cảm xúc về một bài thơ.',
    speakingFocus: 'Trình bày cảm xúc về một người thân trong gia đình.',
    localConnection: 'Hình ảnh đôi bàn tay bà dệt sợi lanh bên bếp lửa sưởi ấm những ngày đông giá rét Quản Bạ.'
  },
  {
    id: 'theme-3',
    name: 'Yêu thương và chia sẻ',
    order: 3,
    objectives: 'Hiểu được giá trị của lòng nhân ái, sự sẻ chia giữa con người với con người và với vạn vật.',
    readingFocus: 'Phân tích chi tiết tiêu biểu, tình huống truyện bộc lộ lòng vị tha.',
    grammarFocus: 'Cụm danh từ, cụm động từ, cụm tính từ.',
    writingFocus: 'Kể lại một trải nghiệm giúp đỡ người khác hoặc được người khác giúp đỡ.',
    speakingFocus: 'Chia sẻ về một việc tốt em đã làm trong bản làng hoặc trường học.',
    localConnection: 'Truyền thống "lá lành đùm lá rách" của đồng bào vùng cao trong mùa đông giá rét.'
  },
  {
    id: 'theme-4',
    name: 'Quê hương yêu dấu',
    order: 4,
    objectives: 'Cảm nhận vẻ đẹp thiên nhiên đất nước, khơi dậy niềm tự hào và tình yêu quê hương bản quán sâu sắc.',
    readingFocus: 'Đọc hiểu văn bản miêu tả cảnh sắc quê hương, nét độc đáo của ca dao dân ca.',
    grammarFocus: 'Từ nhiều nghĩa và hiện tượng chuyển nghĩa của từ; từ đồng âm.',
    writingFocus: 'Viết đoạn văn biểu cảm về một cảnh đẹp quê hương hoặc con người quê em.',
    speakingFocus: 'Giới thiệu về một nét đẹp văn hóa, phong cảnh Quản Bạ quê mình.',
    localConnection: 'Cổng trời Quản Bạ, thung lũng Tam Sơn, cánh đồng lúa chín vàng óng ả chân Núi Đôi.'
  },
  {
    id: 'theme-5',
    name: 'Những nẻo đường xứ sở',
    order: 5,
    objectives: 'Nhận biết đặc điểm thể loại ký (du ký, hồi ký): tính xác thực của sự việc, cảm xúc người viết.',
    readingFocus: 'Hình ảnh thiên nhiên và con người các vùng miền đất nước qua trang ký.',
    grammarFocus: 'Ẩn dụ và hoán dụ; công dụng của dấu chấm phẩy, dấu ngoặc kép.',
    writingFocus: 'Viết bài văn tả cảnh sinh hoạt (hội làng, chợ phiên vùng cao).',
    speakingFocus: 'Thuyết minh ngắn về một di tích lịch sử hoặc danh lam thắng cảnh.',
    localConnection: 'Chợ phiên Quyết Tiến rực rỡ sắc màu trang phục thổ cẩm và hương vị bánh thắng dền, mèn mén.'
  },
  {
    id: 'theme-6',
    name: 'Chuyện kể về những người anh hùng',
    order: 6,
    objectives: 'Nhận biết đặc trưng truyền thuyết: nhân vật anh hùng, chi tiết hoang đường kỳ ảo, cốt lõi lịch sử.',
    readingFocus: 'Ý nghĩa biểu tượng của người anh hùng đánh giặc, bảo vệ bờ cõi và bình yên xứ sở.',
    grammarFocus: 'Thành ngữ; mở rộng vị ngữ trong câu.',
    writingFocus: 'Viết bài văn đóng vai nhân vật kể lại một truyện truyền thuyết.',
    speakingFocus: 'Kể lại một truyện truyền thuyết bằng lời văn của em.',
    localConnection: 'Những câu chuyện lưu truyền về các nghĩa quân và đồng bào kiên cường bảo vệ biên cương.'
  },
  {
    id: 'theme-7',
    name: 'Thế giới cổ tích',
    order: 7,
    objectives: 'Hiểu thế giới cổ tích nhiệm màu, ước mơ về công lý, cái thiện chiến thắng cái ác, lòng hiền hậu.',
    readingFocus: 'Truyện cổ tích thần kỳ, cổ tích sinh hoạt; vai trò của yếu tố kỳ ảo.',
    grammarFocus: 'Từ Hán Việt; dấu chấm lửng và tác dụng biểu đạt.',
    writingFocus: 'Kể lại một truyện cổ tích có sáng tạo lời thoại hoặc phần kết.',
    speakingFocus: 'Kể lại truyện cổ tích với ngữ điệu sinh động và cử chỉ phù hợp.',
    localConnection: 'Sự tích dân gian Núi Đôi Cô Tiên - giọt sữa ngọt ngào tạo nên dòng nước mát cho thung lũng.'
  },
  {
    id: 'theme-8',
    name: 'Khác biệt và gần gũi',
    order: 8,
    objectives: 'Nhận biết đặc điểm văn bản nghị luận: ý kiến, lí lẽ, bằng chứng; tôn trọng sự đa dạng, nét riêng.',
    readingFocus: 'Đọc hiểu văn bản nghị luận về sự tôn trọng khác biệt trong cuộc sống.',
    grammarFocus: 'Liên kết câu và liên kết đoạn văn; từ ngữ chuyển tiếp.',
    writingFocus: 'Viết bài văn trình bày ý kiến về một hiện tượng trong đời sống.',
    speakingFocus: 'Thảo luận nhóm nhỏ về một vấn đề cần có giải pháp chung.',
    localConnection: 'Sự hòa hợp, đoàn kết gắn bó keo sơn giữa các dân tộc anh em trên mảnh đất Quản Bạ.'
  },
  {
    id: 'theme-9',
    name: 'Trái đất – ngôi nhà chung',
    order: 9,
    objectives: 'Nhận biết văn bản thông tin: nhan đề, sa-pô, đề mục, hình ảnh, số liệu; ý thức bảo vệ môi trường.',
    readingFocus: 'Đọc hiểu văn bản thông tin về thiên nhiên, đa dạng sinh học và biến đổi khí hậu.',
    grammarFocus: 'Nghĩa của từ ngữ khoa học phổ thông; cách dùng dấu ngoặc đơn.',
    writingFocus: 'Viết biên bản một cuộc họp hoặc tóm tắt một văn bản thông tin.',
    speakingFocus: 'Thảo luận về giải pháp bảo vệ nguồn nước sạch và rừng đầu nguồn quê hương.',
    localConnection: 'Bảo vệ rừng thông Quản Bạ, giữ gìn nguồn suối trong mát và nương đá xanh tươi.'
  },
  {
    id: 'theme-10',
    name: 'Cuốn sách tôi yêu',
    order: 10,
    objectives: 'Khơi dậy niềm đam mê đọc sách, biết lựa chọn sách bổ ích và lan tỏa văn hóa đọc trong trường lớp.',
    readingFocus: 'Đọc sách mở rộng theo chủ đề và ghi chép nhật ký đọc sách sáng tạo.',
    grammarFocus: 'Tổng kết ngữ pháp: các kiểu câu và thành phần chính, thành phần phụ.',
    writingFocus: 'Viết bài giới thiệu về cuốn sách em yêu thích nhất.',
    speakingFocus: 'Trình bày giới thiệu cuốn sách trước tập thể lớp.',
    localConnection: 'Góc thư viện xanh trường Tiểu học và THCS Quyết Tiến và những trang sách chắp cánh ước mơ.'
  }
];

export interface GameQuestion {
  id: string;
  type: 'quiz' | 'match' | 'sequence' | 'fill';
  themeId: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  pairs?: { item: string; match: string }[];
  sequenceItems?: string[]; // Correct order
  fillSentence?: { textBefore: string; textAfter: string; options: string[]; correctWord: string };
}

export const LITERATURE_GAMES: GameQuestion[] = [
  {
    id: 'g-01',
    type: 'quiz',
    themeId: 'theme-4',
    prompt: 'Trong câu văn: "Núi Đôi Quản Bạ tròn trịa như hai quả đào tiên giữa lòng thung lũng", tác giả dùng biện pháp nghệ thuật gì?',
    options: ['A. Nhân hóa', 'B. So sánh', 'C. Điệp từ', 'D. Nói quá'],
    correctIndex: 1,
    explanation: 'Từ so sánh "như" đặt giữa hai vế "Núi Đôi" và "hai quả đào tiên", làm hình ảnh trở nên sống động, gần gũi.',
  },
  {
    id: 'g-02',
    type: 'match',
    themeId: 'theme-4',
    prompt: 'Hãy ghép di tích / danh lam thắng cảnh với đặc điểm nổi bật tại Quản Bạ:',
    pairs: [
      { item: 'Núi Đôi Cô Tiên', match: 'Hai ngọn núi chóp nón tròn đều giữa cánh đồng Tam Sơn' },
      { item: 'Cổng trời Quản Bạ', match: 'Cửa ngõ trên đỉnh đèo nhìn bao quát thung lũng bồng bềnh mây' },
      { item: 'Làng Lùng Tám', match: 'Nghề dệt vải lanh và vẽ hoa văn sáp ong truyền thống' },
      { item: 'Chợ phiên Quyết Tiến', match: 'Nơi tụ họp giao lưu văn hóa và ẩm thực vùng cao vào cuối tuần' }
    ],
    explanation: 'Đây là 4 địa danh - di sản văn hóa đặc sắc làm nên bản sắc tự hào của vùng đất Quản Bạ.'
  },
  {
    id: 'g-03',
    type: 'sequence',
    themeId: 'theme-2',
    prompt: 'Sắp xếp quy trình dệt tấm vải lanh truyền thống của các bà, các mẹ người H\'Mông theo đúng trình tự:',
    sequenceItems: [
      'Gieo trồng và thu hoạch cây lanh trên nương đá',
      'Phơi khô và tước vỏ cây thành từng sợi mảnh',
      'Luộc tro, đập mềm và giăng sợi lên khung cửi dệt',
      'Vẽ hoa văn sáp ong tinh xảo trên nền vải mộc',
      'Nhuộm chàm nhiều lần tạo nên sắc xanh đen óng ả'
    ],
    explanation: 'Để có một tấm vải lanh thổ cẩm đẹp bền bỉ qua mùa đông giá buốt, người nghệ nhân phải thực hiện công phu hơn 40 công đoạn nối tiếp nhau.'
  },
  {
    id: 'g-04',
    type: 'fill',
    themeId: 'theme-1',
    prompt: 'Chọn từ láy thích hợp để điền vào chỗ trống:',
    fillSentence: {
      textBefore: 'Buổi sáng vùng cao, tiếng cười của các bạn học trò trường Quyết Tiến vang lên',
      textAfter: 'trên con đường uốn lượn quanh sườn núi.',
      options: ['giòn tan', 'lắc rắc', 'xào xạc', 'thung thăng'],
      correctWord: 'giòn tan'
    },
    explanation: '"Giòn tan" là từ láy gợi tả âm thanh tiếng cười trong trẻo, sảng khoái và tràn đầy năng lượng tươi vui của tuổi học trò.'
  },
  {
    id: 'g-05',
    type: 'quiz',
    themeId: 'theme-7',
    prompt: 'Trong truyện cổ tích và truyền thuyết dân gian, chi tiết kì ảo thường mang ý nghĩa gì chủ yếu?',
    options: [
      'A. Làm câu chuyện dài hơn để người nghe không buồn ngủ',
      'B. Thể hiện ước mơ, niềm tin của nhân dân về công lý, điều kỳ diệu và giải thích hiện tượng tự nhiên',
      'C. Gây sợ hãi cho người đọc',
      'D. Giấu đi sự thật lịch sử'
    ],
    correctIndex: 1,
    explanation: 'Chi tiết kì ảo trong truyện cổ tích (như giọt sữa Cô Tiên tưới mát thung lũng Tam Sơn) là phương tiện nghệ thuật gửi gắm ước mơ về sự trù phú và tấm lòng nhân ái.'
  },
  {
    id: 'g-06',
    type: 'quiz',
    themeId: 'theme-2',
    prompt: 'Dòng nào dưới đây gồm toàn các từ ghép biểu thị tình cảm gia đình?',
    options: [
      'A. Yêu thương, chăm sóc, ấm áp, đùm bọc',
      'B. Bàn tay, ngọn núi, rào đá, nương ngô',
      'C. Rộn ràng, róc rách, thoăn thoắt, lấp lánh',
      'D. Đi lại, chạy nhảy, viết vẽ, đọc nghe'
    ],
    correctIndex: 0,
    explanation: 'Các từ "yêu thương", "chăm sóc", "ấm áp", "đùm bọc" đều là từ ghép diễn tả tình cảm gia đình và tình yêu thương giữa con người với con người.'
  },
  {
    id: 'g-07',
    type: 'quiz',
    themeId: 'theme-9',
    prompt: 'Để góp phần bảo vệ "ngôi nhà chung" Quản Bạ xanh - sạch - đẹp, hành động nào dưới đây là thiết thực nhất đối với học sinh lớp 6?',
    options: [
      'A. Chờ người lớn dọn dẹp vệ sinh trường lớp',
      'B. Tích cực trồng và chăm sóc cây xanh, không vứt rác bừa bãi xuống khe suối, giữ gìn nguồn nước sạch',
      'C. Bẻ cành hoa ven đường về cắm trang trí',
      'D. Đốt lửa tự do trong rừng thông'
    ],
    correctIndex: 1,
    explanation: 'Bảo vệ nguồn nước, chăm sóc cây xanh và giữ vệ sinh trường làng là trách nhiệm vừa sức, thiết thực của mỗi bạn học sinh.'
  }
];
