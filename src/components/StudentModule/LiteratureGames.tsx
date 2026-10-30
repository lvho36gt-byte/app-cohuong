import React, { useState } from 'react';
import { LITERATURE_GAMES, GameQuestion } from '../../constants/curriculum';
import { Gamepad2, CheckCircle, XCircle, RotateCcw, ArrowRight, Award, Trophy, Sparkles } from 'lucide-react';

interface LiteratureGamesProps {
  activeStudentCode: string;
}

export const LiteratureGames: React.FC<LiteratureGamesProps> = ({ activeStudentCode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<number | null>(null);
  
  // Matching mode state
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  
  // Sequence mode state
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  
  // Fill mode state
  const [fillChoice, setFillChoice] = useState<string | null>(null);

  // Round results
  const [answeredState, setAnsweredState] = useState<Record<number, { isCorrect: boolean; feedback: string }>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);

  // History attempts
  const [attemptHistory, setAttemptHistory] = useState<{ attempt: number; score: number; date: string }[]>([]);

  const currentQ = LITERATURE_GAMES[currentIdx];

  // Initialize interactive question state
  React.useEffect(() => {
    setSelectedQuizChoice(null);
    setShowExplanation(false);
    setFillChoice(null);

    if (currentQ.type === 'match' && currentQ.pairs) {
      setMatchSelections({});
    }
    if (currentQ.type === 'sequence' && currentQ.sequenceItems) {
      // Shuffle sequence items initially
      const shuffled = [...currentQ.sequenceItems].sort(() => Math.random() - 0.5);
      setSequenceOrder(shuffled);
    }
  }, [currentIdx]);

  // Handle checking answers
  const handleCheckAnswer = () => {
    let isCorrect = false;
    let feedback = currentQ.explanation;

    if (currentQ.type === 'quiz') {
      isCorrect = selectedQuizChoice === currentQ.correctIndex;
    } else if (currentQ.type === 'match' && currentQ.pairs) {
      // Check all matches
      const allCorrect = currentQ.pairs.every(p => matchSelections[p.item] === p.match);
      isCorrect = allCorrect;
    } else if (currentQ.type === 'sequence' && currentQ.sequenceItems) {
      const matchExact = sequenceOrder.every((item, idx) => item === currentQ.sequenceItems![idx]);
      isCorrect = matchExact;
    } else if (currentQ.type === 'fill' && currentQ.fillSentence) {
      isCorrect = fillChoice === currentQ.fillSentence.correctWord;
    }

    setAnsweredState(prev => ({
      ...prev,
      [currentIdx]: { isCorrect, feedback }
    }));
    setShowExplanation(true);
  };

  // Move to next question or complete round
  const handleNext = () => {
    if (currentIdx < LITERATURE_GAMES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Complete round
      const totalCorrect = Object.values(answeredState).filter(a => a.isCorrect).length;
      const score = Math.round((totalCorrect / LITERATURE_GAMES.length) * 10 * 10) / 10;
      setAttemptHistory(prev => [
        ...prev,
        { attempt: prev.length + 1, score, date: new Date().toLocaleTimeString('vi-VN') }
      ]);
      setRoundCompleted(true);
    }
  };

  // Restart round
  const handleRestart = () => {
    setCurrentIdx(0);
    setAnsweredState({});
    setShowExplanation(false);
    setRoundCompleted(false);
  };

  const currentResult = answeredState[currentIdx];
  const totalCorrect = Object.values(answeredState).filter(a => a.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Học mà chơi – Chơi mà học
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-emerald-700" />
            Trò chơi "Văn học vui"
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Ôn luyện kiến thức tiếng Việt, truyện dân gian và văn hóa Quản Bạ qua chuỗi thử thách hào hứng.
          </p>
        </div>

        {/* Progress pill */}
        <div className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
          Câu {currentIdx + 1} / {LITERATURE_GAMES.length}
        </div>
      </div>

      {/* Round Completed Screen */}
      {roundCompleted ? (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Chúc mừng em đã hoàn thành lượt luyện tập!
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm">
              Kết quả: Em đã trả lời đúng <strong>{totalCorrect}</strong> / {LITERATURE_GAMES.length} câu hỏi.
            </p>
          </div>

          {/* Attempts progress table */}
          {attemptHistory.length > 0 && (
            <div className="max-w-md mx-auto bg-stone-50 dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-left">
              <div className="font-bold text-stone-700 dark:text-stone-300 mb-2">Tiến bộ qua các lần chơi:</div>
              <div className="space-y-1">
                {attemptHistory.map(att => (
                  <div key={att.attempt} className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Lần {att.attempt} ({att.date})</span>
                    <strong className="text-emerald-700 dark:text-emerald-300">{att.score} / 10 điểm</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại lượt mới</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Game Question Card */
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-6 shadow-xs">
          
          {/* Question Prompt */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
              {currentQ.type === 'quiz' && 'Trắc nghiệm 4 lựa chọn'}
              {currentQ.type === 'match' && 'Thử thách: Ghép nối địa danh / di sản'}
              {currentQ.type === 'sequence' && 'Thử thách: Sắp xếp thứ tự quy trình'}
              {currentQ.type === 'fill' && 'Thử thách: Điền từ ngữ quê hương'}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {currentQ.prompt}
            </h3>
          </div>

          {/* Mode 1: Multiple Choice */}
          {currentQ.type === 'quiz' && currentQ.options && (
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  disabled={showExplanation}
                  onClick={() => setSelectedQuizChoice(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedQuizChoice === optIdx
                      ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-700'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Mode 2: Matching Pairs */}
          {currentQ.type === 'match' && currentQ.pairs && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">Chọn mô tả phù hợp cho từng mục ở cột bên trái:</p>
              <div className="space-y-3">
                {currentQ.pairs.map((p, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-stone-900 dark:text-stone-100 min-w-[140px]">{p.item}</span>
                    <select
                      disabled={showExplanation}
                      value={matchSelections[p.item] || ''}
                      onChange={(e) => setMatchSelections(prev => ({ ...prev, [p.item]: e.target.value }))}
                      className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200 w-full sm:w-auto flex-1 ml-0 sm:ml-4"
                    >
                      <option value="">-- Chọn đặc điểm phù hợp --</option>
                      {currentQ.pairs!.map((pairOpt, pIdx) => (
                        <option key={pIdx} value={pairOpt.match}>{pairOpt.match}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Sequence Ordering */}
          {currentQ.type === 'sequence' && sequenceOrder.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">Nhấn nút mũi tên để di chuyển các bước theo đúng trình tự từ trên xuống dưới:</p>
              <div className="space-y-2">
                {sequenceOrder.map((step, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-stone-800 dark:text-stone-200">{step}</span>
                    </div>
                    {!showExplanation && (
                      <div className="flex gap-1">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const next = [...sequenceOrder];
                              [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                              setSequenceOrder(next);
                            }}
                            className="p-1 text-xs border rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Lên trên"
                          >
                            ▲
                          </button>
                        )}
                        {idx < sequenceOrder.length - 1 && (
                          <button
                            onClick={() => {
                              const next = [...sequenceOrder];
                              [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                              setSequenceOrder(next);
                            }}
                            className="p-1 text-xs border rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Xuống dưới"
                          >
                            ▼
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 4: Sentence Fill */}
          {currentQ.type === 'fill' && currentQ.fillSentence && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 font-serif text-sm leading-loose">
                {currentQ.fillSentence.textBefore}{' '}
                <span className="inline-block px-3 py-1 font-sans font-bold text-emerald-800 dark:text-emerald-300 border-b-2 border-emerald-700 bg-white dark:bg-stone-800 rounded min-w-[90px] text-center">
                  {fillChoice || '.........'}
                </span>{' '}
                {currentQ.fillSentence.textAfter}
              </div>

              <div className="space-y-2">
                <span className="text-xs text-stone-500 font-medium">Chọn từ láy thích hợp:</span>
                <div className="flex flex-wrap gap-2">
                  {currentQ.fillSentence.options.map((w, idx) => (
                    <button
                      key={idx}
                      disabled={showExplanation}
                      onClick={() => setFillChoice(w)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        fillChoice === w
                          ? 'border-emerald-700 bg-emerald-800 text-white'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-emerald-600'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Explanation & Feedback Box */}
          {showExplanation && currentResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              currentResult.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-950 dark:text-emerald-100' : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-950 dark:text-red-100'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {currentResult.isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Hoan hô em, câu trả lời hoàn toàn chính xác!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Chưa đúng rồi! Em hãy xem giải thích để nhớ bài hơn nhé:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed opacity-90">{currentResult.feedback}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                Kiểm tra kết quả
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>{currentIdx < LITERATURE_GAMES.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết lượt chơi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
