import fs from 'fs';
import path from 'path';

export interface UserRole {
  role: 'student' | 'teacher' | 'admin';
  id: string;
  name: string;
  classId?: string;
  className?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  themeId: string;
  themeName: string;
  authorOrProvider: string;
  source: string;
  createdDate: string;
  usageRights: string;
  status: 'approved' | 'pending';
  category: 'verified_fact' | 'creative_sample'; // Tư liệu thực tế xác minh vs Học liệu minh họa tự sáng tác
  mediaType: 'text' | 'image' | 'audio' | 'document';
  summary: string;
  content: string;
  targetLevel?: 'muc1' | 'muc2' | 'muc3' | 'all';
}

export interface Assignment {
  id: string;
  title: string;
  themeId: string;
  classId: string;
  type: 'quiz' | 'reading' | 'writing' | 'speaking';
  deadline: string;
  instructions: string;
  targetLevel: 'muc1' | 'muc2' | 'muc3' | 'all';
  materialId?: string;
  questions?: {
    id: string;
    question: string;
    level: 'nhan_biet' | 'thong_hieu' | 'van_dung';
    options: string[];
    correctIndex: number;
    explanation: string;
    scaffoldingHint: string;
  }[];
  writingPrompt?: {
    genre: 'doan_van' | 'bai_van' | 'tho_luc_bat' | 'nhat_ky';
    topic: string;
    guidingQuestions: string[];
    suggestedOutline: string[];
    rubricCriteria: {
      criterion: string;
      description: string;
      weight: number;
    }[];
  };
  speakingPrompt?: {
    topic: string;
    timeLimitSeconds: number;
    keyPoints: string[];
  };
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string; // Internal code e.g. QB-6A-01
  studentDisplayName: string;
  classId: string;
  submittedAt: string;
  type: 'quiz' | 'reading' | 'writing' | 'speaking';
  status: 'draft' | 'submitted' | 'graded';
  
  // Quiz/Reading data
  quizAnswers?: number[];
  quizScore?: number; // Real score out of 10
  readingResponses?: {
    questionId: string;
    answerText: string;
    evidenceText: string;
    level: string;
  }[];
  
  // Writing data
  writingDraft1?: string;
  writingDraft1SavedAt?: string;
  aiFeedback1?: {
    structure: string;
    contentAndEmotion: string;
    localImageryAndVocabulary: string;
    grammarAndSpelling: string;
    encouragement: string;
  };
  writingDraft2?: string;
  writingDraft2SavedAt?: string;
  
  // Speaking data
  audioDataUrl?: string; // base64 or audio blob representation
  transcriptText?: string;
  speakingSelfReflection?: string;
  
  // Teacher evaluation
  teacherScore?: number;
  teacherFeedback?: string;
  teacherVerifiedAt?: string;
  teacherName?: string;
}

export interface StudentClass {
  id: string;
  name: string;
  academicYear: string;
  teacherName: string;
  studentCodes: {
    code: string;
    supportLevel: 'muc1' | 'muc2' | 'muc3';
    joinedAt: string;
  }[];
}

export interface SurveyEvidence {
  id: string;
  title: string;
  classId: string;
  conductedDate: string;
  metricName: string; // e.g. "Hứng thú học tập với văn học địa phương", "Năng lực đọc hiểu tìm dẫn chứng"
  unit: string;
  isLocked: boolean;
  records: {
    studentCode: string;
    preScore: number;
    postScore: number;
    note?: string;
  }[];
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface AppDatabase {
  classes: StudentClass[];
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: Submission[];
  evidences: SurveyEvidence[];
  logs: SystemAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'app_data.json');

// Initial seed data adhering strictly to the prompt specifications
const INITIAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-001',
    title: 'Buổi sáng trên đường tới trường Quyết Tiến',
    themeId: 'theme-4',
    themeName: 'Quê hương yêu dấu',
    authorOrProvider: 'Tập thể giáo viên Ngữ văn Trường TH & THCS Quyết Tiến',
    source: 'Học liệu nội bộ sinh hoạt chuyên môn cụm xã Quản Bạ',
    createdDate: '2026-09-05',
    usageRights: 'Được phép sử dụng trong nhà trường',
    status: 'approved',
    category: 'creative_sample', // HỌC LIỆU MINH HỌA TỰ SÁNG TÁC
    mediaType: 'text',
    summary: 'Đoạn văn tự sáng tác miêu tả khung cảnh con đường đất đỏ xuyên qua làn sương bảng lảng, tiếng bước chân học trò rộn rã tới trường.',
    content: `Khi vạt sương mờ còn giăng ngang sườn núi Ba Bế, mặt trời Quản Bạ vừa hé nhô lên như chiếc nón đồng lấp lánh, chúng em đã í ới gọi nhau đến trường. Con đường từ xóm trên xuống trường Tiểu học và THCS Quyết Tiến uốn lượn như dải khăn chàm mềm mại vắt ngang thung lũng. Hai bên bờ rào đá, những bông hoa cúc dại vàng rực đón sương sớm, rung rinh trong ngọn gió thoảng hương ngô non. Tiếng cười giòn tan hòa vào tiếng lục lạc của chú ngựa thồ hàng của bác nông dân đi sớm. Mỗi bước chân tới lớp như đưa chúng em bước vào thế giới tri thức chan chứa tình yêu bản làng.`,
    targetLevel: 'all',
  },
  {
    id: 'mat-002',
    title: 'Một cảnh đẹp quê hương: Núi Đôi Quản Bạ và thung lũng Tam Sơn',
    themeId: 'theme-5',
    themeName: 'Những nẻo đường xứ sở',
    authorOrProvider: 'Nguyễn Thị Hương Trầm',
    source: 'Tư liệu tự biên soạn từ thực tế địa phương',
    createdDate: '2026-09-12',
    usageRights: 'Được phép sử dụng trong nhà trường',
    status: 'approved',
    category: 'creative_sample', // HỌC LIỆU MINH HỌA TỰ SÁNG TÁC
    mediaType: 'text',
    summary: 'Bài văn ngắn minh họa vẻ đẹp kỳ thú của Núi Đôi Cô Tiên và bức tranh bốn mùa ruộng bậc thang vùng cao.',
    content: `Đứng trên cổng trời nhìn xuống, thung lũng Tam Sơn hiện ra tựa hồ bức tranh thủy mặc diệu kỳ của tạo hóa. Nổi bật giữa cánh đồng lúa chín vàng óng ả là hai ngọn núi hình chóp nón tròn trịa, cân đối đến lạ lùng. Người dân quê em bao đời nay vẫn trìu mến gọi đó là Núi Đôi Cô Tiên. Mùa xuân, hoa đào hoa lê nở trắng sườn đồi, ôm ấp lấy dáng núi dịu dàng. Mùa gặt, thảm lúa dưới chân núi đổi sắc vàng tươi, thơm lừng hương cốm mới. Cảnh sắc ấy không chỉ làm say lòng du khách gần xa mà còn gieo vào tâm hồn mỗi cô cậu học trò chúng em niềm tự hào sâu sắc về dải đất quê hương.`,
    targetLevel: 'all',
  },
  {
    id: 'mat-003',
    title: 'Câu chuyện về đôi bàn tay dệt lanh của người bà',
    themeId: 'theme-2',
    themeName: 'Gõ cửa trái tim',
    authorOrProvider: 'Tổ Xã hội - Trường TH & THCS Quyết Tiến',
    source: 'Học liệu minh họa tự sáng tác theo chủ đề gia đình',
    createdDate: '2026-09-20',
    usageRights: 'Được phép sử dụng trong nhà trường',
    status: 'approved',
    category: 'creative_sample', // HỌC LIỆU MINH HỌA TỰ SÁNG TÁC
    mediaType: 'text',
    summary: 'Câu chuyện cảm động về sự cần cù, yêu thương của người bà bên khung cửi dệt sợi lanh truyền thống.',
    content: `Mỗi buổi tối bên bếp lửa bập bùng, hình ảnh thân thương nhất khắc sâu trong tâm trí em là dáng bà ngồi miệt mài bên khung cửi. Đôi bàn tay gầy guộc của bà thoăn thoắt tước từng sợi lanh dẻo dai, luồn con thoi gỗ đều đặn phát ra tiếng lách cách ấm áp. Bà bảo: “Từng sợi lanh này lớn lên từ sỏi đá khô cằn, phải qua bao bận ngâm, giặt, đập, se sợi mới nên tấm vải chàm bền đẹp, ấm áp khi mùa đông về”. Nhìn ánh mắt hiền hậu và đôi tay chai sần vì sương gió của bà, em hiểu rằng tấm áo thổ cẩm bà may không chỉ để che lạnh, mà còn chứa đựng cả tấm lòng yêu thương bao la và bài học kiên trì nuôi em khôn lớn.`,
    targetLevel: 'all',
  },
  {
    id: 'mat-004',
    title: 'Nghề dệt lanh truyền thống của đồng bào H\'Mông Lùng Tám',
    themeId: 'theme-4',
    themeName: 'Quê hương yêu dấu',
    authorOrProvider: 'UBND Xã Quản Bạ - Ban Văn hóa',
    source: 'Tài liệu giới thiệu di sản văn hóa phi vật thể địa phương',
    createdDate: '2026-08-15',
    usageRights: 'Được phép trích dẫn giáo dục',
    status: 'approved',
    category: 'verified_fact', // TƯ LIỆU THỰC TẾ XÁC MINH
    mediaType: 'text',
    summary: 'Tư liệu văn hóa giới thiệu quy trình trồng lanh, dệt vải, vẽ sáp ong và nhuộm chàm cổ truyền.',
    content: `Xã Lùng Tám (Quản Bạ) từ lâu nổi tiếng với nghề dệt vải lanh truyền thống của phụ nữ người H'Mông. Cây lanh được gieo trồng trên các nương đá, sau khi thu hoạch được phơi khô rồi tước thành từng sợi nhỏ. Qua hơn 40 công đoạn tỉ mỉ như luộc tro, đập mềm, quay sợi, giăng sợi và dệt trên khung cửi thủ công, những tấm vải mộc được tạo hình hoa văn bằng kỹ thuật vẽ sáp ong tinh xảo trước khi nhuộm chàm nhiều lần để có màu xanh đen óng ả. Nghề dệt lanh không chỉ tạo ra trang phục thường nhật mà còn biểu trưng cho sự cần cù, khéo léo và bản sắc gắn kết cộng đồng miền sơn cước.`,
    targetLevel: 'all',
  }
];

const INITIAL_CLASSES: StudentClass[] = [
  {
    id: 'class-6a',
    name: 'Lớp 6A (TH & THCS Quyết Tiến)',
    academicYear: '2026-2027',
    teacherName: 'Nguyễn Thị Hương Trầm',
    studentCodes: [
      { code: 'QB-6A-01', supportLevel: 'muc2', joinedAt: '2026-09-05' },
      { code: 'QB-6A-02', supportLevel: 'muc1', joinedAt: '2026-09-05' },
      { code: 'QB-6A-03', supportLevel: 'muc3', joinedAt: '2026-09-05' },
      { code: 'QB-6A-04', supportLevel: 'muc2', joinedAt: '2026-09-05' },
      { code: 'QB-6A-05', supportLevel: 'muc1', joinedAt: '2026-09-05' },
      { code: 'QB-6A-06', supportLevel: 'muc2', joinedAt: '2026-09-05' },
    ]
  },
  {
    id: 'class-6b',
    name: 'Lớp 6B (TH & THCS Quyết Tiến)',
    academicYear: '2026-2027',
    teacherName: 'Nguyễn Thị Hương Trầm',
    studentCodes: [
      { code: 'QB-6B-01', supportLevel: 'muc2', joinedAt: '2026-09-05' },
      { code: 'QB-6B-02', supportLevel: 'muc2', joinedAt: '2026-09-05' },
      { code: 'QB-6B-03', supportLevel: 'muc1', joinedAt: '2026-09-05' },
      { code: 'QB-6B-04', supportLevel: 'muc3', joinedAt: '2026-09-05' },
    ]
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-001',
    title: 'Đọc hiểu và khám phá cảnh đẹp Núi Đôi Quản Bạ',
    themeId: 'theme-5',
    classId: 'class-6a',
    type: 'reading',
    deadline: '2026-11-15T23:59:59',
    instructions: 'Đọc kĩ văn bản mẫu miêu tả Núi Đôi Cô Tiên và trả lời các câu hỏi đọc hiểu 3 mức độ. Hãy chú ý tìm dẫn chứng cụ thể trong bài.',
    targetLevel: 'all',
    materialId: 'mat-002',
    questions: [
      {
        id: 'q1',
        question: 'Trong văn bản, hai ngọn núi ở thung lũng Tam Sơn được người dân địa phương gọi bằng tên thân thương nào?',
        level: 'nhan_biet',
        options: [
          'A. Núi Mẹ Bồng Con',
          'B. Núi Đôi Cô Tiên',
          'C. Núi Ba Bế hùng vĩ',
          'D. Núi Thần Quản Bạ'
        ],
        correctIndex: 1,
        explanation: 'Dẫn chứng trong câu văn: "Người dân quê em bao đời nay vẫn trìu mến gọi đó là Núi Đôi Cô Tiên".',
        scaffoldingHint: 'Em hãy đọc lại đoạn 1 của bài viết, chú ý câu văn có cụm từ "trìu mến gọi đó là...".'
      },
      {
        id: 'q2',
        question: 'Tác giả đã sử dụng biện pháp tu từ nào nổi bật khi so sánh con đường và dáng núi trong các văn bản miêu tả Quản Bạ?',
        level: 'thong_hieu',
        options: [
          'A. Ẩn dụ chuyển đổi cảm giác',
          'B. Hoán dụ lấy bộ phận chỉ toàn thể',
          'C. So sánh giàu hình ảnh ("như bức tranh thủy mặc", "như dải khăn chàm")',
          'D. Điệp từ ngữ ngắt nhịp nhanh'
        ],
        correctIndex: 2,
        explanation: 'Các hình ảnh so sánh gợi cảm "như bức tranh thủy mặc", "tròn trịa như...", "uốn lượn như dải khăn chàm" làm nổi bật nét đẹp đặc trưng vùng núi.',
        scaffoldingHint: 'Tìm các từ chỉ quan hệ so sánh như "như", "tựa hồ" trong các câu miêu tả cảnh sắc.'
      },
      {
        id: 'q3',
        question: 'Qua bức tranh bốn mùa quanh Núi Đôi, em cảm nhận được tình cảm gì của tác giả đối với quê hương Quản Bạ?',
        level: 'van_dung',
        options: [
          'A. Nỗi bâng khuâng khi phải đi xa',
          'B. Tình yêu mộc mạc, tha thiết và niềm tự hào sâu sắc với vẻ đẹp xứ sở',
          'C. Sự ngạc nhiên trước vẻ hoang vu hẻo lánh',
          'D. Ước mơ biến đổi hoàn toàn thiên nhiên'
        ],
        correctIndex: 1,
        explanation: 'Tác giả thể hiện tình cảm gắn bó, tự hào qua câu: "gieo vào tâm hồn mỗi cô cậu học trò chúng em niềm tự hào sâu sắc về dải đất quê hương".',
        scaffoldingHint: 'Em hãy chú ý câu kết của bài văn: điều gì đọng lại trong tâm hồn các bạn học trò khi ngắm nhìn cảnh sắc ấy?'
      }
    ]
  },
  {
    id: 'assign-002',
    title: 'Viết đoạn văn biểu cảm về một cảnh đẹp hoặc con người Quản Bạ',
    themeId: 'theme-4',
    classId: 'class-6a',
    type: 'writing',
    deadline: '2026-11-20T23:59:59',
    instructions: 'Chọn một cảnh đẹp (Núi Đôi, Cổng trời, rừng thông Yên Minh, ruộng bậc thang) hoặc một nét đẹp con người lao động nơi em sinh sống để viết đoạn văn (từ 7 đến 10 câu).',
    targetLevel: 'all',
    writingPrompt: {
      genre: 'doan_van',
      topic: 'Vẻ đẹp thiên nhiên hoặc con người quê hương Quản Bạ trong cảm xúc của em',
      guidingQuestions: [
        'Cảnh đẹp hay hình ảnh người thân nào để lại ấn tượng sâu đậm nhất trong em?',
        'Em quan sát thấy những màu sắc, âm thanh, hương vị gì đặc trưng của vùng cao?',
        'Cảm xúc nổi bật nhất (yêu mến, tự hào, biết ơn) của em khi nhìn ngắm hoặc nhớ về cảnh sắc/con người ấy là gì?',
        'Em sẽ làm gì để giữ gìn nét đẹp của quê hương mình?'
      ],
      suggestedOutline: [
        'Mở đoạn: Giới thiệu ngắn gọn đối tượng biểu cảm (tên cảnh đẹp/người thân và ấn tượng bao quát).',
        'Thân đoạn: Miêu tả 2-3 nét đặc trưng tiêu biểu kết hợp bộc lộ cảm xúc trực tiếp hoặc gián tiếp.',
        'Kết đoạn: Khẳng định lại tình cảm yêu mến, tự hào và lời hứa với quê hương.'
      ],
      rubricCriteria: [
        { criterion: 'Bố cục và hình thức', description: 'Đảm bảo hình thức đoạn văn (viết hoa lùi dòng, kết thúc bằng dấu chấm, dung lượng 7-10 câu)', weight: 2 },
        { criterion: 'Cảm xúc và nội dung', description: 'Bộc lộ tình cảm chân thành, tự nhiên; đúng chủ đề quê hương Quản Bạ', weight: 3 },
        { criterion: 'Từ ngữ và hình ảnh', description: 'Có từ ngữ gợi tả màu sắc, âm thanh, không khí vùng cao (đá tai mèo, sương sớm, chàm, cúc dại...)', weight: 3 },
        { criterion: 'Chính tả và ngữ pháp', description: 'Không mắc lỗi chính tả, câu văn rành mạch, có dấu câu rõ ràng', weight: 2 }
      ]
    }
  },
  {
    id: 'assign-003',
    title: 'Thực hành Nói và Nghe: Giới thiệu nét đẹp văn hóa bản làng em',
    themeId: 'theme-4',
    classId: 'class-6a',
    type: 'speaking',
    deadline: '2026-11-25T23:59:59',
    instructions: 'Em hãy chuẩn bị một bài nói ngắn (1 đến 2 phút) hoặc viết bản chuẩn bị bài nói giới thiệu một phong tục, nét ẩm thực (mèn mén, thắng cố) hoặc nghề truyền thống quê em.',
    targetLevel: 'all',
    speakingPrompt: {
      topic: 'Giới thiệu một nét đẹp văn hóa bản làng Quản Bạ với bạn bè muôn phương',
      timeLimitSeconds: 120,
      keyPoints: [
        'Lời chào và giới thiệu bản thân (Mã số học sinh, lớp)',
        'Tên nét đẹp văn hóa em muốn giới thiệu',
        'Điểm độc đáo thu hút của nét văn hóa ấy',
        'Tình cảm của em và lời mời bạn bè đến thăm Quản Bạ'
      ]
    }
  }
];

// Ensure DB directory and load or initialize
function ensureStorage(): AppDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialDb: AppDatabase = {
      classes: INITIAL_CLASSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: [],
      evidences: [],
      logs: [
        {
          id: 'log-001',
          timestamp: new Date().toISOString(),
          actor: 'Hệ thống VĂN SẮC',
          action: 'KHỞI_TẠO',
          details: 'Khởi tạo hệ thống dữ liệu giáo dục chuẩn môn Ngữ văn 6 - Trường TH & THCS Quyết Tiến'
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc file cơ sở dữ liệu:', err);
    return {
      classes: INITIAL_CLASSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: [],
      evidences: [],
      logs: []
    };
  }
}

export function getDatabase(): AppDatabase {
  return ensureStorage();
}

export function saveDatabase(data: AppDatabase): void {
  ensureStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function logAudit(actor: string, action: string, details: string) {
  const db = getDatabase();
  db.logs.unshift({
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    actor,
    action,
    details
  });
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  saveDatabase(db);
}
