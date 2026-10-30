import React, { useState } from 'react';
import { CURRICULUM_THEMES, CurriculumTheme } from '../../constants/curriculum';
import { LearningMaterial, Assignment, Submission } from '../../types';
import { BookOpen, CheckCircle, ChevronRight, Sparkles, Feather, Volume2, Gamepad2, Award, Compass, FileText, ArrowRight } from 'lucide-react';

interface JourneyViewProps {
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: Submission[];
  activeStudentCode: string;
  onNavigateTo: (tab: string, context?: any) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  materials,
  assignments,
  submissions,
  activeStudentCode,
  onNavigateTo
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('theme-4');
  const [activeStage, setActiveStage] = useState<string>('muctieu');

  const selectedTheme = CURRICULUM_THEMES.find(t => t.id === selectedThemeId) || CURRICULUM_THEMES[3];
  const themeMaterials = materials.filter(m => m.themeId === selectedTheme.id && m.status === 'approved');
  const themeAssignments = assignments.filter(a => a.themeId === selectedTheme.id);
  const mySubmissions = submissions.filter(s => s.studentId === activeStudentCode);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Chương trình GDPT 2018 · Ngữ văn 6
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Hành trình Ngữ văn 6 – Kết nối tri thức với cuộc sống
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Khám phá 10 chủ đề học tập gắn liền với trải nghiệm thực tế và nét đẹp quê hương Quản Bạ.
          </p>
        </div>

        {/* Student identification badge */}
        <div className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 self-start md:self-auto">
          Đang học với mã: <strong className="font-mono text-emerald-800 dark:text-emerald-300">{activeStudentCode}</strong>
        </div>
      </div>

      {/* 10 Themes Horizontal Scroll / Grid */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase">
          Chọn chủ đề bài học (10 chủ đề):
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CURRICULUM_THEMES.map((theme) => {
            const isSelected = theme.id === selectedThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setSelectedThemeId(theme.id);
                  setActiveStage('muctieu');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border shrink-0 text-left ${
                  isSelected
                    ? 'bg-emerald-800 text-amber-200 border-emerald-900 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-600'
                }`}
              >
                <div className="text-[10px] opacity-75">Bài {theme.order}</div>
                <div className="font-semibold text-sm">{theme.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Theme Overview Card */}
      <div className="bg-emerald-900/5 dark:bg-emerald-950/20 border border-emerald-900/15 dark:border-emerald-800/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
              Chủ đề {selectedTheme.order} / 10
            </div>
            <h3 className="font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              {selectedTheme.name}
            </h3>
          </div>
          <div className="bg-amber-100/80 dark:bg-amber-900/30 text-amber-950 dark:text-amber-200 text-xs px-3 py-1.5 rounded-lg border border-amber-300/60 max-w-md">
            <strong>Dấu ấn Quản Bạ:</strong> {selectedTheme.localConnection}
          </div>
        </div>

        {/* 9 Pedagogical Stages Segmented Navigation */}
        <div className="border-t border-emerald-900/10 dark:border-emerald-800/20 pt-4">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
            9 bước học tập theo định hướng phát triển năng lực:
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'muctieu', label: '1. Mục tiêu học tập', icon: Compass },
              { id: 'hoclieu', label: '2. Học liệu GV duyệt', icon: BookOpen },
              { id: 'dochieuvb', label: '3. Đọc hiểu', icon: FileText },
              { id: 'tiengviet', label: '4. Thực hành tiếng Việt', icon: Feather },
              { id: 'viet', label: '5. Viết', icon: Feather },
              { id: 'noinghe', label: '6. Nói và nghe', icon: Volume2 },
              { id: 'luyentap', label: '7. Luyện tập tương tác', icon: Gamepad2 },
              { id: 'vandung', label: '8. Vận dụng', icon: Sparkles },
              { id: 'ketqua', label: '9. Kết quả của em', icon: Award }
            ].map(stage => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content Viewer */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 shadow-xs">
        
        {/* Stage 1: Mục tiêu học tập */}
        {activeStage === 'muctieu' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-700" />
              Yêu cầu cần đạt – Chủ đề "{selectedTheme.name}"
            </h4>
            <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-700 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {selectedTheme.objectives}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Đọc hiểu trọng tâm</div>
                <p className="text-xs text-stone-600 dark:text-stone-300">{selectedTheme.readingFocus}</p>
              </div>
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Thực hành tiếng Việt</div>
                <p className="text-xs text-stone-600 dark:text-stone-300">{selectedTheme.grammarFocus}</p>
              </div>
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Kỹ năng Viết</div>
                <p className="text-xs text-stone-600 dark:text-stone-300">{selectedTheme.writingFocus}</p>
              </div>
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Kỹ năng Nói và Nghe</div>
                <p className="text-xs text-stone-600 dark:text-stone-300">{selectedTheme.speakingFocus}</p>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setActiveStage('hoclieu')}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
              >
                Tiếp tục xem Học liệu được giáo viên phê duyệt &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Học liệu do GV duyệt */}
        {activeStage === 'hoclieu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                Học liệu đã được kiểm duyệt cho chủ đề này
              </h4>
              <span className="text-xs text-stone-500">
                {themeMaterials.length} văn bản / tư liệu
              </span>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 italic">
              * Lưu ý bản quyền: Hệ thống không tự ý sao chép nguyên văn SGK. Mọi văn bản dưới đây đều do giáo viên tự biên soạn hoặc sử dụng tư liệu địa phương được cấp phép.
            </div>

            {themeMaterials.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
                <p className="text-stone-500 text-sm">Chưa có học liệu nào được giáo viên duyệt cho chủ đề này.</p>
                <p className="text-xs text-stone-400 mt-1">Giáo viên có thể thêm văn bản mới tại mục Góc Giáo viên &gt; Tạo học liệu AI.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {themeMaterials.map(mat => (
                  <div key={mat.id} className="border border-stone-200 dark:border-stone-700 rounded-xl p-5 hover:border-emerald-600 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded font-medium ${
                          mat.category === 'verified_fact' ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        }`}>
                          {mat.category === 'verified_fact' ? 'Tư liệu thực tế xác minh' : 'Học liệu minh họa tự sáng tác'}
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-500">{mat.authorOrProvider}</span>
                      </div>
                      <span className="text-xs text-stone-400">{mat.createdDate}</span>
                    </div>

                    <h5 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
                      {mat.title}
                    </h5>

                    <p className="font-serif text-sm leading-relaxed text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-4 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                      {mat.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                      <span>Nguồn: {mat.source} ({mat.usageRights})</span>
                      <button
                        onClick={() => onNavigateTo('reading', { materialId: mat.id })}
                        className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Luyện đọc hiểu bài này &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stage 3: Đọc hiểu */}
        {activeStage === 'dochieuvb' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              Luyện đọc hiểu 3 mức độ (Nhận biết · Thông hiểu · Vận dụng)
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Hệ thống đọc hiểu với AI sư phạm: AI không tiết lộ ngay đáp án mà hướng dẫn gợi mở, yêu cầu học sinh tìm dẫn chứng từ văn bản để phát triển tư duy đọc sâu.
            </p>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-emerald-950 dark:text-emerald-200 text-sm">
                  Góc "AI cùng em đọc hiểu"
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300">
                  Làm bài tập đọc hiểu có gợi ý Socratic và lưu kết quả thật.
                </div>
              </div>
              <button
                onClick={() => onNavigateTo('reading')}
                className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                Mở Góc Đọc hiểu ngay
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: Thực hành tiếng Việt */}
        {activeStage === 'tiengviet' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-emerald-700" />
              Thực hành tiếng Việt: {selectedTheme.grammarFocus}
            </h4>
            <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-700 text-sm space-y-3">
              <div>
                <strong className="text-stone-900 dark:text-stone-100">Kiến thức cần nhớ:</strong>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  Quan sát các từ ngữ miêu tả cảnh sắc vùng cao (Núi Đôi, rào đá, nương ngô, khung cửi, màu chàm) để nhận biết từ láy, từ ghép và tác dụng của biện pháp tu từ trong việc gợi tả sắc thái quê hương.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTo('games')}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Luyện tập qua Trò chơi Văn học vui &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: Viết */}
        {activeStage === 'viet' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-emerald-700" />
              Góc "Ngòi bút quê hương" – Viết đoạn văn, bài văn, thơ
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Quy trình viết 2 bản nháp khoa học: Lập dàn ý &rarr; Viết Bản nháp 1 &rarr; Nhận phản hồi AI theo tiêu chí giáo viên &rarr; Chỉnh sửa Bản nháp 2 &rarr; So sánh sự tiến bộ.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTo('writing')}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <span>Vào Góc Ngòi bút quê hương</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 6: Nói và nghe */}
        {activeStage === 'noinghe' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-700" />
              Góc "Em kể chuyện" – Thực hành Nói và Nghe
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Ghi âm giọng nói hoặc nộp bản viết chuẩn bị bài nói giới thiệu cảnh đẹp, câu chuyện người thân hoặc phong tục bản làng.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTo('speaking')}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <span>Vào Góc Em kể chuyện</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 7: Luyện tập tương tác */}
        {activeStage === 'luyentap' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-700" />
              Trò chơi "Văn học vui"
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Ôn luyện kiến thức qua các mini-game tương tác: Trắc nghiệm 4 lựa chọn, Ghép nhân vật/địa danh với hành động, Sắp xếp sự kiện, Điền từ ngữ.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTo('games')}
                className="px-5 py-2.5 bg-amber-400 text-emerald-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors flex items-center gap-2"
              >
                <span>Chơi trò chơi ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 8: Vận dụng */}
        {activeStage === 'vandung' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              Hoạt động vận dụng thực tế tại quê hương Quản Bạ
            </h4>
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-sm text-stone-700 dark:text-stone-300 space-y-2">
              <p>
                <strong>Nhiệm vụ vận dụng:</strong> Sau khi học chủ đề "{selectedTheme.name}", em hãy:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-stone-600 dark:text-stone-300">
                <li>Hỏi chuyện ông bà, cha mẹ về một câu chuyện xưa hoặc một nét sinh hoạt ở bản làng em.</li>
                <li>Ghi lại 3 từ ngữ đặc trưng vùng cao mà em cảm thấy thân thương nhất vào nhật ký học tập.</li>
                <li>Chia sẻ cảm xúc về bài học với một người bạn cùng lớp.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Stage 9: Kết quả của em */}
        {activeStage === 'ketqua' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Kết quả học tập thực tế của học sinh {activeStudentCode}
            </h4>

            {mySubmissions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
                <p className="text-stone-500 text-sm">Chưa có bài nộp nào được ghi nhận với mã {activeStudentCode}.</p>
                <p className="text-xs text-stone-400 mt-1">Hãy tham gia Đọc hiểu, Viết hoặc Nói để hệ thống ghi lại kết quả thật của em.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map(sub => (
                  <div key={sub.id} className="p-3.5 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {sub.type === 'quiz' ? 'Trắc nghiệm / Đọc hiểu' : sub.type === 'writing' ? 'Bài viết Ngòi bút quê hương' : 'Nói và nghe'}
                      </div>
                      <div className="text-stone-400 mt-0.5">Nộp lúc: {new Date(sub.submittedAt).toLocaleString('vi-VN')}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === 'graded' ? `Điểm: ${sub.teacherScore}/10` : 'Chờ giáo viên duyệt'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
