import { GoogleGenAI } from '@google/genai';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trong biến môi trường server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Chatbot Bạn đồng hành VĂN SẮC
 * Dành cho học sinh lớp 6 (11-12 tuổi) môn Ngữ văn - Kết nối tri thức với cuộc sống
 */
export async function generateChatbotReply(
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  latestMessage: string,
  studentContext?: { studentCode: string; level: string; currentTopic?: string }
): Promise<string> {
  const ai = getAiClient();
  const systemInstruction = `BẠN LÀ "BẠN ĐỒNG HÀNH VĂN SẮC" - Trợ lý sư phạm Ngữ văn 6 thân thiện, tâm lý, đồng hành cùng học sinh lớp 6 vùng cao (xã Quản Bạ, trường Tiểu học và THCS Quyết Tiến).
Môn học: Ngữ văn 6 – Bộ sách Kết nối tri thức với cuộc sống.

NGUYÊN TẮC CỐT LÕI (TUYỆT ĐỐI TUÂN THỦ):
1. GIỌNG ĐIỆU: Thân thiện, ấm áp, trong sáng, khuyến khích, xưng hô "Bạn đồng hành VĂN SẮC" hoặc "mình" và gọi học sinh là "bạn" hoặc "em". Phù hợp lứa tuổi 11-12.
2. TUYỆT ĐỐI KHÔNG VIẾT HỘ BÀI: Nếu học sinh yêu cầu "viết cho em đoạn văn/bài văn/thơ...", hãy từ chối một cách khích lệ: "Mình rất muốn đồng hành cùng bạn, nhưng bài văn hay nhất là bài văn do chính cảm xúc của bạn viết nên! Mình sẽ giúp bạn lập dàn ý, tìm từ ngữ hay và đặt câu hỏi gợi ý nhé!".
3. HƯỚNG DẪN TỰ LẬP DÀN Ý & TÌM TỪ NGỮ: Gợi ý các bước Mở - Thân - Kết, gợi ý từ ngữ tả cảnh sắc quê hương (sương mờ, rào đá, nương ngô, khung cửi dệt lanh, màu chàm, dốc đá...).
4. TRUNG THỰC VÀ CHÍNH XÁC VĂN HÓA ĐỊA PHƯƠNG: Chỉ trích dẫn thông tin văn hóa, địa danh, phong tục Quản Bạ khi có dữ liệu thật. Không tự bịa đặt lịch sử hay phong tục các dân tộc (H'Mông, Dao, Tày, Nùng, Bố Y...). Nếu không có đủ tài liệu, hãy thành thật: "Thông tin văn hóa này mình chưa có đủ tư liệu chính thống được thầy cô xác nhận, em hãy hỏi thêm ông bà, thầy cô tại bản làng nhé!".
5. AN TOÀN TRẺ EM: Từ chối các nội dung bạo lực, nhạy cảm hoặc không lành mạnh. Không hỏi hay lưu thông tin cá nhân của học sinh.
${studentContext ? `Học sinh đang ở mức học tập: ${studentContext.level}. Chủ đề đang học: ${studentContext.currentTopic || 'Ngữ văn 6'}.` : ''}`;

  const chat = ai.chats.create({
    model: 'gemini-3.8-flash',
    config: {
      systemInstruction,
    },
  });

  const response = await chat.sendMessage({
    message: latestMessage,
  });

  return response.text || 'Bạn đồng hành VĂN SẮC đang lắng nghe bạn. Bạn hãy chia sẻ thêm suy nghĩ của mình nhé!';
}

/**
 * Gợi ý đọc hiểu (Scaffolding reading comprehension)
 * Không đưa ngay đáp án, gợi ý học sinh tìm dẫn chứng trong văn bản
 */
export async function generateReadingHint(params: {
  textSnippet: string;
  question: string;
  questionLevel: 'nhan_biet' | 'thong_hieu' | 'van_dung';
  studentDoubt?: string;
}): Promise<string> {
  const ai = getAiClient();
  const systemInstruction = `Bạn là giáo viên hướng dẫn đọc hiểu Ngữ văn 6.
Nhiệm vụ: Giúp học sinh tìm ra manh mối và dẫn chứng trong đoạn trích để trả lời câu hỏi đọc hiểu.
QUY TẮC SƯ PHẠM:
- KHÔNG ĐƯỢC NÓI NGAY ĐÁP ÁN (A, B, C, D hay câu trả lời trực tiếp).
- Hướng dẫn học sinh khoanh vùng đoạn văn chứa chi tiết, chú ý từ khóa, hoặc đặt câu hỏi gợi mở tư duy (Socratic method).
- Câu trả lời ngắn gọn (dưới 120 từ), dễ hiểu đối với học sinh lớp 6.`;

  const prompt = `Đoạn văn đọc hiểu:
"""
${params.textSnippet}
"""

Câu hỏi (${params.questionLevel}):
"${params.question}"

Thắc mắc của học sinh: "${params.studentDoubt || 'Em chưa tìm thấy câu trả lời, hãy gợi ý cho em.'}"

Hãy đưa ra lời gợi ý giúp học sinh tự tìm ra dẫn chứng trong văn bản:`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return response.text || 'Em hãy đọc lại từng câu trong đoạn văn để tìm từ khóa liên quan đến câu hỏi nhé!';
}

/**
 * Góp ý bài viết Bản nháp 1 theo tiêu chí giáo viên (Writing Rubrics)
 */
export async function generateWritingFeedback(params: {
  topic: string;
  genre: string;
  studentDraft: string;
  rubrics: { criterion: string; description: string; weight: number }[];
  targetLevel?: string;
}): Promise<{
  structure: string;
  contentAndEmotion: string;
  localImageryAndVocabulary: string;
  grammarAndSpelling: string;
  encouragement: string;
}> {
  const ai = getAiClient();
  const systemInstruction = `Bạn là trợ lý sư phạm Ngữ văn 6 đánh giá bài viết bản nháp của học sinh lớp 6.
QUY TẮC:
- Đóng vai trò là góp ý bản nháp sơ bộ, luôn kèm tinh thần nâng đỡ, khích lệ.
- KHÔNG VIẾT LẠI HOẶC SỬA HỘ BÀI VĂN CỦA HỌC SINH.
- Chỉ ra điểm tốt, sau đó gợi ý 1-2 chỗ học sinh có thể thêm hình ảnh cụ thể quê hương Quản Bạ (tiếng gió, màu sắc lá ngô, hàng rào đá, dáng núi, mùi khói bếp...) hoặc liên kết câu.
- Kết quả phải ở định dạng JSON chuẩn.`;

  const prompt = `Chủ đề bài viết: "${params.topic}"
Thể loại: ${params.genre}
Tiêu chí đánh giá của giáo viên:
${params.rubrics.map(r => `- ${r.criterion}: ${r.description}`).join('\n')}

Bài viết Bản nháp 1 của học sinh:
"""
${params.studentDraft}
"""

Hãy đưa ra nhận xét theo 5 mục dưới dạng JSON:
{
  "structure": "Nhận xét về bố cục mở - thân - kết của học sinh",
  "contentAndEmotion": "Nhận xét về cảm xúc chân thành và nội dung bài viết",
  "localImageryAndVocabulary": "Gợi ý về hình ảnh quê hương vùng cao Quản Bạ và cách dùng từ gợi cảm",
  "grammarAndSpelling": "Nhắc nhở nhẹ nhàng về chính tả, dấu câu, ngắt đoạn",
  "encouragement": "Lời động viên ấm áp để học sinh tự tin chỉnh sửa Bản nháp 2"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  try {
    const parsed = JSON.parse(response.text || '{}');
    return {
      structure: parsed.structure || 'Bố cục bài viết đã có các ý cơ bản.',
      contentAndEmotion: parsed.contentAndEmotion || 'Cảm xúc trong bài rất tự nhiên và chân thật.',
      localImageryAndVocabulary: parsed.localImageryAndVocabulary || 'Em có thể thêm những chi tiết thân thương về quê hương mình nhé.',
      grammarAndSpelling: parsed.grammarAndSpelling || 'Chú ý dấu chấm câu và viết hoa đầu câu.',
      encouragement: parsed.encouragement || 'Bản nháp 1 rất đáng khen! Em hãy đọc lại và hoàn thiện Bản nháp 2 nhé!'
    };
  } catch {
    return {
      structure: 'Bố cục bài viết đã có hướng đi tốt.',
      contentAndEmotion: 'Bài viết chan chứa tình cảm trong sáng.',
      localImageryAndVocabulary: 'Em hãy thử thêm 1-2 hình ảnh quen thuộc của bản làng để bài viết thêm sinh động.',
      grammarAndSpelling: 'Kiểm tra lại một vài dấu câu ngắt nhịp.',
      encouragement: 'Thầy cô và bạn đồng hành VĂN SẮC tin em sẽ có Bản nháp 2 tuyệt vời hơn!'
    };
  }
}

/**
 * Trợ lý giáo viên: Tạo đề xuất học liệu và câu hỏi đọc hiểu 3 mức độ
 */
export async function generateTeacherCurriculumProposal(params: {
  themeName: string;
  learningOutcomes: string;
  activityType: string;
  localElement: string;
}): Promise<{
  suggestedTitle: string;
  sampleText: string;
  questions: {
    question: string;
    level: 'nhan_biet' | 'thong_hieu' | 'van_dung';
    options: string[];
    correctIndex: number;
    explanation: string;
    scaffoldingHint: string;
  }[];
}> {
  const ai = getAiClient();
  const systemInstruction = `Bạn là chuyên gia phương pháp dạy học Ngữ văn 6 (Bộ sách Kết nối tri thức với cuộc sống).
Nhiệm vụ: Hỗ trợ giáo viên soạn thảo bản thảo học liệu minh họa tự sáng tác gắn với bản sắc địa phương Quản Bạ và bộ câu hỏi trắc nghiệm/đọc hiểu 3 mức độ (Nhận biết, Thông hiểu, Vận dụng).
ĐẶC BIỆT: Phải đánh dấu rõ ràng đây là "BẢN THẢO HỌC LIỆU MINH HỌA ĐỂ GIÁO VIÊN KIỂM DUYỆT VÀ CHỈNH SỬA", giáo viên là người duyệt cuối cùng trước khi giao cho học sinh.`;

  const prompt = `Chủ đề: "${params.themeName}"
Yêu cầu cần đạt: "${params.learningOutcomes}"
Loại hoạt động: "${params.activityType}"
Yếu tố văn hóa/cảnh quan Quản Bạ dự kiến lồng ghép: "${params.localElement}"

Hãy tạo ra một bản thảo gồm:
1. Tiêu đề bài đọc hấp dẫn phù hợp học sinh lớp 6
2. Một đoạn văn bản minh họa tự sáng tác (khoảng 150-250 từ) giàu chất thơ, trong sáng, gắn liền với Quản Bạ
3. 3 câu hỏi trắc nghiệm đọc hiểu (1 câu Nhận biết, 1 câu Thông hiểu, 1 câu Vận dụng), mỗi câu có 4 đáp án A, B, C, D, chỉ rõ đáp án đúng (0-3), lời giải thích và gợi ý gợi mở (scaffoldingHint).

Trả về dạng JSON:
{
  "suggestedTitle": "...",
  "sampleText": "...",
  "questions": [
    {
      "question": "...",
      "level": "nhan_biet",
      "options": ["A...", "B...", "C...", "D..."],
      "correctIndex": 0,
      "explanation": "...",
      "scaffoldingHint": "..."
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text || '{}');
}
