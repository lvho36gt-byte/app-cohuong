import React, { useState } from 'react';
import { Assignment, Submission } from '../../types';
import { Feather, Sparkles, Save, FileDown, CheckCircle, ArrowRight, BookOpen, Layers, Edit3, HelpCircle } from 'lucide-react';

interface WritingCornerProps {
  assignments: Assignment[];
  activeStudentCode: string;
  onRefreshData: () => void;
}

const SAMPLE_TOPICS = [
  {
    genre: 'doan_van',
    title: 'Đoạn văn biểu cảm về Núi Đôi Cô Tiên và thung lũng Tam Sơn (7-10 câu)',
    theme: 'Quê hương yêu dấu',
    guidingQuestions: [
      'Điều gì ở Núi Đôi khiến em ấn tượng nhất (hình dáng tròn trịa, màu xanh mùa xuân, màu vàng mùa lúa chín)?',
      'Em có cảm xúc gì khi đứng trên cổng trời ngắm nhìn cảnh sắc ấy?',
      'Hình ảnh quê hương đó bồi đắp cho em tình cảm gì?'
    ],
    outline: [
      'Mở đoạn: Giới thiệu Núi Đôi Quản Bạ và ấn tượng chung.',
      'Thân đoạn: Miêu tả vẻ đẹp tạo hóa qua từng mùa và bộc lộ cảm xúc yêu mến, tự hào.',
      'Kết đoạn: Khẳng định tình cảm thiêng liêng với quê hương bản quán.'
    ]
  },
  {
    genre: 'doan_van',
    title: 'Đoạn văn kể lại kỉ niệm bên người thân bên khung cửi dệt lanh (7-10 câu)',
    theme: 'Gõ cửa trái tim',
    guidingQuestions: [
      'Người thân nào gắn liền với kỷ niệm ấm áp của em (ông bà, cha mẹ)?',
      'Đôi bàn tay hay ánh mắt của người thân lúc lao động toát lên vẻ đẹp gì?',
      'Em rút ra được bài học hay cảm xúc biết ơn sâu sắc nào?'
    ],
    outline: [
      'Mở đoạn: Giới thiệu người thân và hình ảnh khó quên bên bếp lửa hoặc khung cửi.',
      'Thân đoạn: Tái hiện chi tiết hành động lao động cần cù và tình yêu thương dành cho em.',
      'Kết đoạn: Lòng biết ơn và mong muốn đền đáp công ơn người thân.'
    ]
  },
  {
    genre: 'tho_luc_bat',
    title: 'Tập sáng tác bài thơ lục bát về con đường tới trường bản làng',
    theme: 'Tôi và các bạn',
    guidingQuestions: [
      'Con đường có rào đá, có sương sớm, có hoa cúc dại hay tiếng chim hót?',
      'Tiếng cười bạn bè và niềm vui khi tới lớp được gieo vần thế nào (vần lưng, vần chân)?',
      'Tình bạn trong sáng ở mái trường Quyết Tiến.'
    ],
    outline: [
      'Cặp câu 1-2 (6-8): Khắc họa buổi sớm mai trên đường tới trường.',
      'Cặp câu 3-4 (6-8): Niềm vui gặp bạn, cùng chia sẻ ước mơ học trò.'
    ]
  }
];

export const WritingCorner: React.FC<WritingCornerProps> = ({
  assignments,
  activeStudentCode,
  onRefreshData
}) => {
  const writingAssignments = assignments.filter(a => a.type === 'writing');
  const currentAssignment = writingAssignments[0];

  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const selectedTopic = SAMPLE_TOPICS[selectedTopicIdx];

  const [draft1, setDraft1] = useState('');
  const [draft1Saved, setDraft1Saved] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{
    structure: string;
    contentAndEmotion: string;
    localImageryAndVocabulary: string;
    grammarAndSpelling: string;
    encouragement: string;
  } | null>(null);

  const [draft2, setDraft2] = useState('');
  const [draft2Saved, setDraft2Saved] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedToTeacher, setSubmittedToTeacher] = useState(false);

  // Rubrics
  const rubrics = currentAssignment?.writingPrompt?.rubricCriteria || [
    { criterion: 'Bố cục và dung lượng', description: 'Đảm bảo cấu trúc mở - thân - kết, dung lượng 7-10 câu', weight: 2 },
    { criterion: 'Cảm xúc và nội dung', description: 'Bộc lộ tình cảm chân thành với bản sắc quê hương Quản Bạ', weight: 3 },
    { criterion: 'Từ ngữ và hình ảnh', description: 'Sử dụng từ ngữ gợi cảm, hình ảnh đặc trưng miền núi', weight: 3 },
    { criterion: 'Chính tả và ngữ pháp', description: 'Viết đúng chính tả, câu văn mạch lạc, có dấu câu rõ ràng', weight: 2 }
  ];

  // Request AI Feedback on Draft 1
  const handleRequestAiFeedback = async () => {
    if (!draft1.trim() || draft1.trim().length < 20) {
      alert('Em hãy viết bản nháp lần 1 ít nhất vài câu để Bạn đồng hành VĂN SẮC có thể đọc và góp ý nhé!');
      return;
    }

    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.title,
          genre: selectedTopic.genre,
          studentDraft: draft1,
          rubrics
        })
      });
      const data = await res.json();
      if (data.feedback) {
        setAiFeedback(data.feedback);
        // Pre-fill draft 2 with draft 1 if empty
        if (!draft2) setDraft2(draft1);
      } else {
        alert(data.error || 'Chưa thể phân tích bài viết lúc này.');
      }
    } catch {
      alert('Không thể kết nối dịch vụ AI. Vui lòng kiểm tra lại!');
    } finally {
      setLoadingAi(false);
    }
  };

  // Submit to Teacher
  const handleSubmitToTeacher = async () => {
    if (!draft2.trim() && !draft1.trim()) {
      alert('Vui lòng viết bài trước khi nộp cho thầy cô!');
      return;
    }

    setSubmitting(true);
    const payload = {
      assignmentId: currentAssignment?.id || 'assign-002',
      studentId: activeStudentCode,
      studentDisplayName: `Học sinh ${activeStudentCode}`,
      classId: currentAssignment?.classId || 'class-6a',
      type: 'writing',
      status: 'submitted',
      writingDraft1: draft1,
      writingDraft1SavedAt: new Date().toISOString(),
      aiFeedback1: aiFeedback || undefined,
      writingDraft2: draft2 || draft1,
      writingDraft2SavedAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSubmittedToTeacher(true);
        onRefreshData();
      } else {
        alert('Có lỗi khi gửi bài. Vui lòng thử lại!');
      }
    } catch {
      alert('Không thể kết nối máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  // Export to DOCX (HTML format compatible with Microsoft Word)
  const handleExportDocx = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${selectedTopic.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        h1 { font-size: 16pt; text-align: center; color: #1e3a2b; }
        .meta { text-align: center; font-style: italic; margin-bottom: 20px; }
        .section-title { font-weight: bold; margin-top: 15px; color: #166534; }
        .box { border: 1px solid #ccc; padding: 10px; margin-top: 10px; }
      </style>
      </head>
      <body>
        <h1>BÀI LÀM NGỮ VĂN 6</h1>
        <div class="meta">
          Môn học: Ngữ văn 6 – Kết nối tri thức với cuộc sống<br>
          Trường Tiểu học và THCS Quyết Tiến · Xã Quản Bạ, Tuyên Quang<br>
          Mã học sinh: ${activeStudentCode} | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </div>
        <p><strong>Chủ đề:</strong> ${selectedTopic.title}</p>
        
        <div class="section-title">BẢN LẦN 2 (BẢN HOÀN THIỆN):</div>
        <div class="box">
          <p>${(draft2 || draft1).replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section-title">BẢN LẦN 1 (BẢN NHÁP):</div>
        <div class="box">
          <p>${draft1.replace(/\n/g, '<br>')}</p>
        </div>

        ${aiFeedback ? `
        <div class="section-title">GÓP Ý SƯ PHẠM TỪ BẠN ĐỒNG HÀNH VĂN SẮC:</div>
        <ul>
          <li><strong>Bố cục:</strong> ${aiFeedback.structure}</li>
          <li><strong>Cảm xúc:</strong> ${aiFeedback.contentAndEmotion}</li>
          <li><strong>Hình ảnh quê hương Quản Bạ:</strong> ${aiFeedback.localImageryAndVocabulary}</li>
          <li><strong>Chính tả:</strong> ${aiFeedback.grammarAndSpelling}</li>
        </ul>
        <p><em>* Lưu ý: Nhận xét AI mang tính hỗ trợ học sinh tự chỉnh sửa; điểm và đánh giá chính thức do Thầy/Cô bộ môn phê duyệt.</em></p>
        ` : ''}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bai_Viet_${activeStudentCode}_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to Print / PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Quy trình rèn luyện kỹ năng viết
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Góc "Ngòi bút quê hương"
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Khơi nguồn cảm xúc từ cảnh sắc và con người Quản Bạ, thực hiện quy trình viết 2 bản nháp hoàn thiện.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportDocx}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xuất bài viết sang tệp Word (.doc/.docx)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất Word (.doc)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="In hoặc lưu file PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>In / PDF</span>
          </button>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase">
          1. Chọn chủ đề bài viết:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedTopicIdx(idx);
                setDraft1Saved(false);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                selectedTopicIdx === idx
                  ? 'border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-700'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-emerald-500'
              }`}
            >
              <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                {topic.title}
              </div>
              <div className="text-[11px] text-stone-500">Chủ đề: {topic.theme}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Guided Outline & Prompting Questions */}
      <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 font-serif font-bold text-base text-amber-950 dark:text-amber-200">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Hệ thống câu hỏi gợi mở & Dàn ý tham khảo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Câu hỏi gợi ý:</div>
            <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
              {selectedTopic.guidingQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Gợi ý dàn ý:</div>
            <ol className="list-decimal list-inside space-y-1 text-stone-700 dark:text-stone-300">
              {selectedTopic.outline.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Two-Draft Writing Stage Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Draft 1: Bản nháp lần 1 */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Bản nháp lần 1
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">
              {draft1.trim().split(/\s+/).filter(Boolean).length} từ
            </span>
          </div>

          <textarea
            value={draft1}
            onChange={(e) => {
              setDraft1(e.target.value);
              setDraft1Saved(false);
            }}
            placeholder="Viết những cảm xúc đầu tiên của em vào đây. Đừng ngại câu từ chưa chau chuốt, hãy viết thật tự nhiên..."
            rows={10}
            className="w-full p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-sm leading-relaxed text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-y font-serif"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setDraft1Saved(true)}
              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{draft1Saved ? 'Đã lưu bản 1' : 'Lưu bản 1'}</span>
            </button>

            <button
              onClick={handleRequestAiFeedback}
              disabled={loadingAi}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingAi ? 'AI đang đọc & góp ý...' : 'Nhận góp ý sư phạm từ AI'}</span>
            </button>
          </div>
        </div>

        {/* Draft 2: Bản nháp lần 2 (Đã chỉnh sửa theo góp ý) */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Bản nháp lần 2 (Hoàn thiện)
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">
              {draft2.trim().split(/\s+/).filter(Boolean).length} từ
            </span>
          </div>

          <textarea
            value={draft2}
            onChange={(e) => {
              setDraft2(e.target.value);
              setDraft2Saved(false);
            }}
            placeholder="Dựa vào góp ý của AI và thầy cô, em hãy tự chỉnh sửa, thêm từ ngữ gợi cảm, sửa dấu câu để hoàn thiện bản viết lần 2..."
            rows={10}
            className="w-full p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-sm leading-relaxed text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y font-serif"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isComparing ? 'Ẩn so sánh' : 'So sánh 2 bản nháp'}</span>
            </button>

            <button
              onClick={handleSubmitToTeacher}
              disabled={submitting}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{submitting ? 'Đang gửi...' : 'Nộp bài lên Thầy/Cô'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Pedagogical Feedback Box (Adheres to the prompt constraint: AI does not write for students) */}
      {aiFeedback && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h4 className="font-serif font-bold text-lg text-emerald-950 dark:text-emerald-100">
                Gợi ý sư phạm từ Bạn đồng hành VĂN SẮC
              </h4>
            </div>
            <span className="text-[11px] text-stone-500 italic">
              * AI chỉ đóng vai trò trợ lý gợi ý, không thay thế nhận xét và điểm số của Giáo viên
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-emerald-100 dark:border-stone-700 space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">1. Về bố cục đoạn văn:</div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{aiFeedback.structure}</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-emerald-100 dark:border-stone-700 space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">2. Cảm xúc & Nội dung:</div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{aiFeedback.contentAndEmotion}</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-emerald-100 dark:border-stone-700 space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">3. Hình ảnh Quản Bạ quê hương:</div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{aiFeedback.localImageryAndVocabulary}</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-emerald-100 dark:border-stone-700 space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">4. Chính tả & Diễn đạt:</div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{aiFeedback.grammarAndSpelling}</p>
            </div>
          </div>

          <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-300/60 text-xs text-amber-950 dark:text-amber-200">
            <strong>Lời động viên:</strong> {aiFeedback.encouragement}
          </div>
        </div>
      )}

      {/* Comparison Diff Box between Draft 1 & Draft 2 */}
      {isComparing && (
        <div className="bg-stone-100 dark:bg-stone-900 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-4">
          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            So sánh đối chiếu tiến bộ giữa Bản nháp 1 và Bản nháp 2
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed">
            <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="font-sans font-bold text-stone-500 mb-2">Bản nháp 1:</div>
              <p className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">{draft1 || '(Chưa có nội dung)'}</p>
            </div>

            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-300 dark:border-emerald-800">
              <div className="font-sans font-bold text-emerald-800 dark:text-emerald-300 mb-2">Bản nháp 2 (Đã chỉnh sửa):</div>
              <p className="whitespace-pre-wrap text-emerald-950 dark:text-emerald-100">{draft2 || '(Chưa có nội dung)'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Success Toast */}
      {submittedToTeacher && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 text-emerald-950 dark:text-emerald-100 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>Bài viết của học sinh <strong>{activeStudentCode}</strong> đã được gửi lên hệ thống của Thầy/Cô thành công!</span>
          </div>
          <span className="font-semibold text-emerald-800">Trạng thái: Chờ giáo viên chấm điểm</span>
        </div>
      )}
    </div>
  );
};
