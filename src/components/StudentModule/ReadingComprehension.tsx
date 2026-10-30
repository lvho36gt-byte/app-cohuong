import React, { useState } from 'react';
import { Assignment, AssignmentQuestion, LearningMaterial, Submission } from '../../types';
import { BookOpen, CheckCircle, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw, AlertTriangle, Send } from 'lucide-react';

interface ReadingProps {
  assignments: Assignment[];
  materials: LearningMaterial[];
  activeStudentCode: string;
  studentLevel?: 'muc1' | 'muc2' | 'muc3';
  selectedMaterialId?: string;
  onRefreshData: () => void;
}

export const ReadingComprehension: React.FC<ReadingProps> = ({
  assignments,
  materials,
  activeStudentCode,
  studentLevel = 'muc2',
  selectedMaterialId,
  onRefreshData
}) => {
  // Find reading assignments
  const readingAssignments = assignments.filter(a => a.type === 'reading' || a.type === 'quiz');
  
  // Current active assignment
  const [selectedAssignId, setSelectedAssignId] = useState<string>(
    readingAssignments.length > 0 ? readingAssignments[0].id : ''
  );

  const currentAssignment = readingAssignments.find(a => a.id === selectedAssignId) || readingAssignments[0];
  const linkedMaterial = materials.find(m => m.id === (currentAssignment?.materialId || selectedMaterialId)) || materials[0];

  const questions = currentAssignment?.questions || [];

  // Student answer state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [aiHints, setAiHints] = useState<Record<number, string>>({});
  const [loadingHintFor, setLoadingHintFor] = useState<number | null>(null);
  const [submittingResult, setSubmittingResult] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Request AI Socratic Scaffolding Hint (never gives direct answer)
  const handleRequestHint = async (qIndex: number, question: AssignmentQuestion) => {
    setLoadingHintFor(qIndex);
    try {
      const res = await fetch('/api/gemini/reading-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textSnippet: linkedMaterial?.content || '',
          question: question.question,
          questionLevel: question.level,
          studentDoubt: `Em đang ở ${studentLevel === 'muc1' ? 'Mức 1 cần hướng dẫn cụ thể' : studentLevel === 'muc3' ? 'Mức 3 mở rộng' : 'Mức 2 đạt chuẩn'}. Giúp em tìm dẫn chứng trong bài!`
        })
      });
      const data = await res.json();
      if (data.hint) {
        setAiHints(prev => ({ ...prev, [qIndex]: data.hint }));
      } else {
        setAiHints(prev => ({ ...prev, [qIndex]: question.scaffoldingHint || 'Em hãy đọc lại đoạn văn trên để tìm chi tiết nhé!' }));
      }
    } catch {
      setAiHints(prev => ({ ...prev, [qIndex]: question.scaffoldingHint || 'Em hãy chú ý các từ khóa trong câu hỏi để đối chiếu với văn bản nhé!' }));
    } finally {
      setLoadingHintFor(null);
    }
  };

  // Submit test and persist score in database
  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!confirm(`Em mới trả lời ${Object.keys(selectedAnswers).length}/${questions.length} câu. Em có chắc chắn muốn nộp bài không?`)) {
        return;
      }
    }

    setSubmittingResult(true);

    // Calculate real score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / (questions.length || 1)) * 10 * 10) / 10;

    const submissionPayload = {
      assignmentId: currentAssignment.id,
      studentId: activeStudentCode,
      studentDisplayName: `Học sinh ${activeStudentCode}`,
      classId: currentAssignment.classId,
      type: 'quiz',
      status: 'submitted',
      quizAnswers: Object.values(selectedAnswers),
      quizScore: calculatedScore
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });
      if (res.ok) {
        setSubmitted(true);
        setSubmissionSuccess(true);
        onRefreshData();
      } else {
        alert('Lỗi lưu kết quả. Vui lòng thử lại!');
      }
    } catch {
      alert('Không thể kết nối máy chủ để lưu bài làm.');
    } finally {
      setSubmittingResult(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setSubmissionSuccess(false);
    setAiHints({});
  };

  if (!currentAssignment || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300">Chưa có bài tập đọc hiểu</h3>
        <p className="text-sm text-stone-500 mt-1">Giáo viên sẽ sớm giao bài đọc hiểu cho lớp của em.</p>
      </div>
    );
  }

  // Calculate stats when submitted
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) correctCount++;
  });
  const currentScore = Math.round((correctCount / questions.length) * 10 * 10) / 10;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Assignment Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Góc tương tác sư phạm
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Góc "AI cùng em đọc hiểu"
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Đọc sâu văn bản, phát hiện dẫn chứng và chinh phục 3 mức độ nhận thức.
          </p>
        </div>

        {/* Assignment Selector */}
        {readingAssignments.length > 1 && (
          <div className="text-xs">
            <label className="text-stone-500 mr-2 font-medium">Chọn bài tập:</label>
            <select
              value={selectedAssignId}
              onChange={(e) => {
                setSelectedAssignId(e.target.value);
                handleReset();
              }}
              className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 font-medium text-stone-800 dark:text-stone-200"
            >
              {readingAssignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Reading Text Anchor Box */}
      {linkedMaterial && (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-300">
              Văn bản đọc hiểu: {linkedMaterial.title}
            </span>
            <span className="text-stone-500">Nguồn: {linkedMaterial.source}</span>
          </div>

          <div className="font-serif text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900/70 p-5 rounded-xl border border-amber-100 dark:border-stone-800 shadow-2xs">
            {linkedMaterial.content}
          </div>

          <div className="text-[11px] text-stone-500 italic">
            * Em hãy đọc kỹ từng chi tiết trong bài trên trước khi trả lời các câu hỏi bên dưới.
          </div>
        </div>
      )}

      {/* Submitted Result Summary Banner */}
      {submitted && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            Kết quả của em: {currentScore} / 10 điểm
          </h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            Em đã trả lời đúng {correctCount} / {questions.length} câu. Kết quả thật đã được lưu vào hệ thống giáo viên!
          </p>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại bài này</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const studentChoice = selectedAnswers[qIdx];
          const isAnswered = studentChoice !== undefined;
          const isCorrect = submitted && studentChoice === q.correctIndex;
          const isWrong = submitted && studentChoice !== q.correctIndex;
          const hint = aiHints[qIdx];

          const levelLabel = q.level === 'nhan_biet' ? 'Mức 1: Nhận biết' : q.level === 'thong_hieu' ? 'Mức 2: Thông hiểu' : 'Mức 3: Vận dụng';
          const levelColor = q.level === 'nhan_biet' ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/40' : q.level === 'thong_hieu' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40' : 'text-amber-700 bg-amber-50 dark:bg-amber-950/40';

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-stone-800 rounded-2xl border p-6 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/10'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              {/* Question Header & Level */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Câu hỏi {qIdx + 1}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${levelColor}`}>
                  {levelLabel}
                </span>
              </div>

              {/* Question Text */}
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
                {q.question}
              </h4>

              {/* 4 Multiple Choice Options (A, B, C, D) */}
              <div className="space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = studentChoice === optIdx;
                  let optionClass = 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold';
                    } else if (isThisSelected) {
                      optionClass = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900';
                    } else {
                      optionClass = 'opacity-60 border-stone-200';
                    }
                  } else if (isThisSelected) {
                    optionClass = 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-700';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between cursor-pointer ${optionClass}`}
                    >
                      <span>{option}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {submitted && isThisSelected && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Socratic AI Scaffolding Clue Button (Not showing answer!) */}
              {!submitted && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                  <button
                    onClick={() => handleRequestHint(qIdx, q)}
                    disabled={loadingHintFor === qIdx}
                    className="text-xs text-amber-800 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>
                      {loadingHintFor === qIdx ? 'AI đang tìm manh mối...' : 'Em cần gợi ý tìm dẫn chứng (AI không nói đáp án)?'}
                    </span>
                  </button>
                </div>
              )}

              {/* Display AI Hint */}
              {hint && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                  <div className="font-semibold flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gợi ý tư duy từ Bạn đồng hành VĂN SẮC:</span>
                  </div>
                  {hint}
                </div>
              )}

              {/* Post-submission explanation */}
              {submitted && (
                <div className="mt-4 p-3.5 bg-stone-100 dark:bg-stone-900/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                  <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Chính xác!
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Chưa chính xác.
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong>Giải thích chi tiết:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      {!submitted && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
          <span className="text-xs text-stone-500">
            Đã chọn {Object.keys(selectedAnswers).length} / {questions.length} câu
          </span>
          <button
            onClick={handleSubmitQuiz}
            disabled={submittingResult}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submittingResult ? 'Đang chấm & lưu bài...' : 'Nộp bài & Xem giải thích'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
