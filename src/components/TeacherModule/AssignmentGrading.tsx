import React, { useState } from 'react';
import { Assignment, Submission, StudentClass } from '../../types';
import { Award, CheckCircle, Clock, Volume2, Feather, BookOpen, Layers, Edit2, Send } from 'lucide-react';

interface AssignmentGradingProps {
  assignments: Assignment[];
  submissions: Submission[];
  classes: StudentClass[];
  onRefreshData: () => void;
}

export const AssignmentGrading: React.FC<AssignmentGradingProps> = ({
  assignments,
  submissions,
  classes,
  onRefreshData
}) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    submissions.length > 0 ? submissions[0].id : null
  );

  const [teacherScoreInput, setTeacherScoreInput] = useState<number>(8.5);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');
  const [savingGrade, setSavingGrade] = useState(false);

  const selectedSub = submissions.find(s => s.id === selectedSubmissionId) || submissions[0];

  React.useEffect(() => {
    if (selectedSub) {
      setTeacherScoreInput(selectedSub.teacherScore ?? (selectedSub.quizScore ?? 8.0));
      setTeacherFeedbackInput(selectedSub.teacherFeedback ?? 'Bài làm thể hiện tình cảm chân thành với bản sắc quê hương Quản Bạ, có ý thức chỉnh sửa từ bản nháp 1 sang bản nháp 2.');
    }
  }, [selectedSub]);

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSavingGrade(true);
    try {
      const res = await fetch(`/api/submissions/${selectedSub.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherScore: Number(teacherScoreInput),
          teacherFeedback: teacherFeedbackInput,
          teacherName: 'Nguyễn Thị Hương Trầm'
        })
      });
      if (res.ok) {
        alert('Đã lưu điểm và nhận xét của giáo viên thành công!');
        onRefreshData();
      } else {
        alert('Lỗi lưu điểm.');
      }
    } catch {
      alert('Không thể kết nối máy chủ.');
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-700" />
          Chấm bài & Xác nhận kết quả chính thức của Giáo viên
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Xem lại bản nháp 1, góp ý của AI, bản hoàn thiện lần 2 và bản thu âm của học sinh để đưa ra điểm số và lời phê chuẩn mực.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-12 text-center text-stone-500 text-xs">
          Hiện tại chưa có bài nộp nào từ học sinh.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submissions List Sidebar */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 space-y-3 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">
              Danh sách bài nộp ({submissions.length}):
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {submissions.map(sub => {
                const isSelected = sub.id === selectedSub?.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-700'
                        : 'border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{sub.studentId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === 'graded' ? `Đã chấm: ${sub.teacherScore}đ` : 'Chờ chấm'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {sub.type === 'writing' ? 'Ngòi bút quê hương' : sub.type === 'speaking' ? 'Bài nói & nghe' : 'Đọc hiểu'}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-1">
                      {new Date(sub.submittedAt).toLocaleDateString('vi-VN')} {new Date(sub.submittedAt).toLocaleTimeString('vi-VN')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Submission Viewer & Teacher Grading Form */}
          {selectedSub && (
            <div className="lg:col-span-2 space-y-5">
              
              {/* Submission Header */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-2 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 font-mono text-sm">
                    Mã học sinh: {selectedSub.studentId}
                  </span>
                  <span className="text-stone-400">
                    Thời gian nộp: {new Date(selectedSub.submittedAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300">
                  Phân loại bài: <strong>{selectedSub.type === 'writing' ? 'Kỹ năng Viết' : selectedSub.type === 'speaking' ? 'Kỹ năng Nói & Nghe' : 'Kỹ năng Đọc hiểu'}</strong>
                </div>
              </div>

              {/* Writing Work Review (Draft 1 & Draft 2) */}
              {selectedSub.type === 'writing' && (
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    <Layers className="w-5 h-5 text-emerald-700" />
                    <span>Nội dung bài viết: Đối chiếu 2 bản nháp</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed">
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <div className="font-sans font-bold text-stone-500 mb-2">Bản nháp 1:</div>
                      <p className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">{selectedSub.writingDraft1 || '(Trống)'}</p>
                    </div>

                    <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-300 dark:border-emerald-800">
                      <div className="font-sans font-bold text-emerald-800 dark:text-emerald-300 mb-2">Bản hoàn thiện lần 2:</div>
                      <p className="whitespace-pre-wrap text-emerald-950 dark:text-emerald-100">{selectedSub.writingDraft2 || selectedSub.writingDraft1 || '(Trống)'}</p>
                    </div>
                  </div>

                  {/* AI Feedback Log */}
                  {selectedSub.aiFeedback1 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-stone-700 dark:text-stone-300">
                      <div className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                        Góp ý sư phạm sơ bộ AI đã gửi cho học sinh:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        <li><strong>Bố cục:</strong> {selectedSub.aiFeedback1.structure}</li>
                        <li><strong>Cảm xúc:</strong> {selectedSub.aiFeedback1.contentAndEmotion}</li>
                        <li><strong>Hình ảnh địa phương:</strong> {selectedSub.aiFeedback1.localImageryAndVocabulary}</li>
                        <li><strong>Chính tả:</strong> {selectedSub.aiFeedback1.grammarAndSpelling}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Speaking Work Review */}
              {selectedSub.type === 'speaking' && (
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    <Volume2 className="w-5 h-5 text-emerald-700" />
                    <span>Bản ghi âm & Bản chuẩn bị bài nói</span>
                  </div>

                  {selectedSub.audioDataUrl && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                      <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                        File ghi âm giọng nói của học sinh:
                      </div>
                      <audio src={selectedSub.audioDataUrl} controls className="w-full" />
                    </div>
                  )}

                  {selectedSub.transcriptText && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                      <div className="font-semibold text-stone-700 dark:text-stone-300">
                        Bản chuẩn bị bài nói bằng văn bản:
                      </div>
                      <p className="font-serif leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
                        {selectedSub.transcriptText}
                      </p>
                    </div>
                  )}

                  {selectedSub.speakingSelfReflection && (
                    <div className="text-xs text-stone-500 italic">
                      Học sinh tự nhận xét: "{selectedSub.speakingSelfReflection}"
                    </div>
                  )}
                </div>
              )}

              {/* Quiz / Reading Work Review */}
              {selectedSub.type === 'quiz' && (
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-3 shadow-xs text-xs">
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <span>Kết quả bài trắc nghiệm đọc hiểu</span>
                  </div>
                  <p>
                    Điểm tự động theo đáp án đã duyệt: <strong>{selectedSub.quizScore} / 10 điểm</strong>
                  </p>
                </div>
              )}

              {/* Teacher Official Grading Form */}
              <form onSubmit={handleSaveGrade} className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs text-xs">
                <div className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-emerald-700" />
                  <span>Đánh giá & Cho điểm chính thức của Giáo viên</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Điểm số (Thang 10):
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={teacherScoreInput}
                      onChange={(e) => setTeacherScoreInput(parseFloat(e.target.value || '0'))}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-bold text-emerald-900 dark:text-emerald-300 font-mono"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Lời nhận xét của Thầy/Cô (Nguyễn Thị Hương Trầm):
                    </label>
                    <input
                      type="text"
                      value={teacherFeedbackInput}
                      onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                      placeholder="Lời động viên và hướng dẫn học sinh khắc phục điểm yếu..."
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingGrade}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{savingGrade ? 'Đang lưu kết quả...' : 'Xác nhận & Cập nhật kết quả'}</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
