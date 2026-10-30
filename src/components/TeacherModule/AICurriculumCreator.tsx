import React, { useState } from 'react';
import { CURRICULUM_THEMES } from '../../constants/curriculum';
import { Sparkles, CheckCircle, Edit3, Save, BookOpen, AlertCircle, Plus, Send } from 'lucide-react';

interface AICurriculumCreatorProps {
  onRefreshData: () => void;
  onMaterialCreated: () => void;
}

export const AICurriculumCreator: React.FC<AICurriculumCreatorProps> = ({
  onRefreshData,
  onMaterialCreated
}) => {
  const [themeId, setThemeId] = useState('theme-4');
  const [learningOutcomes, setLearningOutcomes] = useState('Nhận biết biện pháp so sánh và hình ảnh miêu tả cảnh sắc vùng cao, bộc lộ tình cảm yêu mến quê hương.');
  const [activityType, setActivityType] = useState('Đọc hiểu văn bản & 3 câu hỏi trắc nghiệm');
  const [localElement, setLocalElement] = useState('Núi Đôi Quản Bạ, cánh đồng lúa Tam Sơn, nương đá và mùi hương ngô non');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Proposal returned by AI
  const [proposal, setProposal] = useState<{
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
  } | null>(null);

  // Editable fields for teacher review
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');

  const selectedTheme = CURRICULUM_THEMES.find(t => t.id === themeId) || CURRICULUM_THEMES[3];

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProposal(null);

    try {
      const res = await fetch('/api/gemini/teacher-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeName: selectedTheme.name,
          learningOutcomes,
          activityType,
          localElement
        })
      });

      const data = await res.json();
      if (data.sampleText) {
        setProposal(data);
        setEditedTitle(data.suggestedTitle || 'Học liệu minh họa Quản Bạ');
        setEditedText(data.sampleText);
      } else {
        alert(data.error || 'Chưa thể tạo học liệu lúc này.');
      }
    } catch {
      alert('Không thể kết nối máy chủ AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndSave = async () => {
    if (!editedTitle.trim() || !editedText.trim()) {
      alert('Vui lòng kiểm tra lại tiêu đề và văn bản trước khi lưu!');
      return;
    }

    setSaving(true);
    try {
      // 1. Save Material to library
      const matRes = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle,
          themeId: selectedTheme.id,
          themeName: selectedTheme.name,
          authorOrProvider: 'Nguyễn Thị Hương Trầm (Biên soạn & Duyệt)',
          source: 'Học liệu minh họa tự sáng tác do giáo viên duyệt',
          usageRights: 'Được phép sử dụng trong nhà trường',
          status: 'approved',
          category: 'creative_sample', // Marked explicitly as HỌC LIỆU MINH HỌA TỰ SÁNG TÁC
          mediaType: 'text',
          summary: editedText.substring(0, 150) + '...',
          content: editedText,
          targetLevel: 'all'
        })
      });

      const savedMaterial = await matRes.json();

      // 2. If proposal has questions, create an assignment
      if (proposal && proposal.questions && proposal.questions.length > 0) {
        await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Đọc hiểu: ${editedTitle}`,
            themeId: selectedTheme.id,
            classId: 'class-6a',
            type: 'reading',
            deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
            instructions: 'Em hãy đọc kỹ văn bản do cô giáo biên soạn và trả lời các câu hỏi đọc hiểu 3 mức độ.',
            targetLevel: 'all',
            materialId: savedMaterial.id,
            questions: proposal.questions.map((q, idx) => ({
              id: 'q-' + Date.now() + '-' + idx,
              ...q
            }))
          })
        });
      }

      alert('Đã phê duyệt và lưu học liệu vào Thư viện Quản Bạ & Giao bài tập cho học sinh thành công!');
      setProposal(null);
      onRefreshData();
      onMaterialCreated();
    } catch {
      alert('Lỗi lưu học liệu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Trợ lý AI tạo học liệu & Đề xuất câu hỏi đọc hiểu
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Giáo viên giữ toàn quyền kiểm soát chuyên môn: AI chỉ đề xuất bản thảo minh họa, giáo viên trực tiếp chỉnh sửa và phê duyệt trước khi công bố cho học sinh.
        </p>
      </div>

      {/* Input Parameters Form */}
      <form onSubmit={handleGenerateProposal} className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Chủ đề Ngữ văn 6:
            </label>
            <select
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            >
              {CURRICULUM_THEMES.map(t => (
                <option key={t.id} value={t.id}>Bài {t.order}: {t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Loại hoạt động:
            </label>
            <input
              type="text"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Yêu cầu cần đạt (Mục tiêu bài dạy):
            </label>
            <input
              type="text"
              value={learningOutcomes}
              onChange={(e) => setLearningOutcomes(e.target.value)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Yếu tố bản sắc Quản Bạ dự kiến lồng ghép:
            </label>
            <input
              type="text"
              value={localElement}
              onChange={(e) => setLocalElement(e.target.value)}
              placeholder="Ví dụ: Núi Đôi Cô Tiên, chợ phiên Quyết Tiến, khung cửi dệt lanh Lùng Tám..."
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'AI đang soạn thảo đề xuất...' : 'AI đề xuất học liệu & câu hỏi'}</span>
          </button>
        </div>
      </form>

      {/* AI Proposal Review & Edit Interface (Teacher Gatekeeper) */}
      {proposal && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-300 dark:border-amber-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/50 pb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-700" />
              <h4 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-100">
                Bản thảo AI đề xuất – Giáo viên trực tiếp kiểm duyệt & chỉnh sửa
              </h4>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
              Chưa công bố (Đang chờ duyệt)
            </span>
          </div>

          {/* Edit Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tiêu đề bài đọc:
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-serif font-bold text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Edit Text */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Nội dung văn bản minh họa tự sáng tác:
            </label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={8}
              className="w-full p-3.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-serif leading-relaxed text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Questions Preview */}
          {proposal.questions && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                3 câu hỏi đọc hiểu 3 mức độ đi kèm:
              </div>
              <div className="space-y-2">
                {proposal.questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200 flex justify-between">
                      <span>Câu {idx + 1}: {q.question}</span>
                      <span className="text-stone-400 capitalize">({q.level})</span>
                    </div>
                    <div className="text-emerald-800 dark:text-emerald-400">
                      Đáp án đúng: {q.options[q.correctIndex]}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Gợi ý gợi mở (Socratic): {q.scaffoldingHint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation & Approval Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-200 dark:border-amber-900/50">
            <span className="text-[11px] text-stone-500 italic">
              * Tác giả: Nguyễn Thị Hương Trầm sẽ là người ký duyệt học liệu này.
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProposal(null)}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleApproveAndSave}
                disabled={saving}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>{saving ? 'Đang lưu...' : 'Phê duyệt & Xuất bản cho học sinh'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
