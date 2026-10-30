import React, { useState, useEffect } from 'react';
import { AppRole, StudentClass, LearningMaterial, Assignment, Submission, SurveyEvidence } from './types';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { JourneyView } from './components/StudentModule/JourneyView';
import { LibraryView } from './components/StudentModule/LibraryView';
import { ReadingComprehension } from './components/StudentModule/ReadingComprehension';
import { WritingCorner } from './components/StudentModule/WritingCorner';
import { SpeakingCorner } from './components/StudentModule/SpeakingCorner';
import { LiteratureGames } from './components/StudentModule/LiteratureGames';
import { ChatbotDrawer } from './components/StudentModule/ChatbotDrawer';
import { TeacherHub } from './components/TeacherModule/TeacherHub';
import { AdminPanel } from './components/AdminModule/AdminPanel';
import { Bot, Mountain, BookOpen, Feather, Shield, HeartHandshake } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppRole>('student');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Core Application Data
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [evidences, setEvidences] = useState<SurveyEvidence[]>([]);
  const [activeStudentCode, setActiveStudentCode] = useState<string>('QB-6A-01');
  const [selectedMaterialForReading, setSelectedMaterialForReading] = useState<string | undefined>(undefined);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Fetch all persistent data from backend
  const refreshAllData = async () => {
    try {
      const [clsRes, matRes, assignRes, subRes, eviRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/materials'),
        fetch('/api/assignments'),
        fetch('/api/submissions'),
        fetch('/api/evidences')
      ]);

      const [clsData, matData, assignData, subData, eviData] = await Promise.all([
        clsRes.json(),
        matRes.json(),
        assignRes.json(),
        subRes.json(),
        eviRes.json()
      ]);

      setClasses(clsData);
      setMaterials(matData);
      setAssignments(assignData);
      setSubmissions(subData);
      setEvidences(eviData);

      // Default active student code if valid
      if (clsData.length > 0 && clsData[0].studentCodes.length > 0) {
        if (!clsData.some((c: StudentClass) => c.studentCodes.some(s => s.code === activeStudentCode))) {
          setActiveStudentCode(clsData[0].studentCodes[0].code);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ máy chủ:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Determine current student support level
  let currentStudentLevel: 'muc1' | 'muc2' | 'muc3' = 'muc2';
  for (const c of classes) {
    const st = c.studentCodes.find(s => s.code === activeStudentCode);
    if (st) {
      currentStudentLevel = st.supportLevel;
      break;
    }
  }

  const handleNavigateTo = (tab: string, context?: any) => {
    if (context?.materialId) {
      setSelectedMaterialForReading(context.materialId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          if (role === 'teacher' && activeTab === 'home') setActiveTab('teacher');
          if (role === 'admin' && activeTab === 'home') setActiveTab('admin');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSaverMode={dataSaverMode}
        setDataSaverMode={setDataSaverMode}
        activeStudentCode={activeStudentCode}
        setActiveStudentCode={setActiveStudentCode}
        classes={classes}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {loadingInitial ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center space-y-2">
              <Mountain className="w-8 h-8 text-emerald-800 animate-pulse mx-auto" />
              <p className="text-xs text-stone-500">Đang khởi tạo không gian VĂN SẮC QUẢN BẠ AI...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <div className="space-y-12">
                <LandingHero
                  onEnterLearning={() => {
                    setCurrentRole('student');
                    setActiveTab('journey');
                  }}
                  onEnterTeacher={() => {
                    setCurrentRole('teacher');
                    setActiveTab('teacher');
                  }}
                  onEnterLibrary={() => {
                    setActiveTab('library');
                  }}
                  onOpenChat={() => setIsChatOpen(true)}
                />

                {/* Quick Entrance to Features */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <button
                      onClick={() => handleNavigateTo('reading')}
                      className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                        AI cùng em đọc hiểu
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Chinh phục 3 mức độ nhận thức với gợi ý Socratic chỉ dẫn manh mối trong bài.
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigateTo('writing')}
                      className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Feather className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                        Ngòi bút quê hương
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Quy trình viết 2 bản nháp, đối chiếu tiến bộ và nhận phản hồi theo tiêu chí sư phạm.
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigateTo('speaking')}
                      className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Mountain className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                        Góc "Em kể chuyện"
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Ghi âm giọng nói chia sẻ về nét đẹp văn hóa, phong cảnh bản làng miền núi Quản Bạ.
                      </p>
                    </button>

                    <button
                      onClick={() => handleNavigateTo('games')}
                      className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Bot className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                        Trò chơi Văn học vui
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Ghép nối, sắp xếp sự kiện truyện và trắc nghiệm tương tác ghi nhận kết quả thật.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'journey' && (
              <JourneyView
                materials={materials}
                assignments={assignments}
                submissions={submissions}
                activeStudentCode={activeStudentCode}
                onNavigateTo={handleNavigateTo}
              />
            )}

            {activeTab === 'library' && (
              <LibraryView
                materials={materials}
                currentRole={currentRole}
                onAddNewMaterial={() => {
                  setCurrentRole('teacher');
                  setActiveTab('teacher');
                }}
                onSelectForReading={(mat) => {
                  setSelectedMaterialForReading(mat.id);
                  setActiveTab('reading');
                }}
              />
            )}

            {activeTab === 'reading' && (
              <ReadingComprehension
                assignments={assignments}
                materials={materials}
                activeStudentCode={activeStudentCode}
                studentLevel={currentStudentLevel}
                selectedMaterialId={selectedMaterialForReading}
                onRefreshData={refreshAllData}
              />
            )}

            {activeTab === 'writing' && (
              <WritingCorner
                assignments={assignments}
                activeStudentCode={activeStudentCode}
                onRefreshData={refreshAllData}
              />
            )}

            {activeTab === 'speaking' && (
              <SpeakingCorner
                assignments={assignments}
                activeStudentCode={activeStudentCode}
                onRefreshData={refreshAllData}
              />
            )}

            {activeTab === 'games' && (
              <LiteratureGames
                activeStudentCode={activeStudentCode}
              />
            )}

            {activeTab === 'teacher' && (
              <TeacherHub
                classes={classes}
                materials={materials}
                assignments={assignments}
                submissions={submissions}
                evidences={evidences}
                onRefreshData={refreshAllData}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                materials={materials}
                onRefreshData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Chatbot Launch Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full shadow-xl flex items-center gap-2.5 transition-all active:scale-95 border border-emerald-600/40 cursor-pointer"
        aria-label="Mở Bạn đồng hành VĂN SẮC"
      >
        <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xs">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">Bạn đồng hành VĂN SẮC</span>
      </button>

      {/* Chatbot Drawer Modal */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeStudentCode={activeStudentCode}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 py-10 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
          <div className="space-y-2">
            <div className="font-serif font-bold text-base text-amber-300">
              VĂN SẮC QUẢN BẠ AI
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Khơi nguồn văn chương từ bản sắc quê hương. Ứng dụng hỗ trợ giáo viên và học sinh lớp 6 khai thác văn hóa, phong cảnh và đời sống vùng cao Quản Bạ làm học liệu sáng tạo.
            </p>
          </div>

          <div className="space-y-1.5 text-stone-400">
            <div className="font-semibold text-stone-200">Đơn vị & Tác giả phát triển:</div>
            <div>Tác giả: <strong>Nguyễn Thị Hương Trầm</strong></div>
            <div>Đơn vị: <strong>Trường Tiểu học và THCS Quyết Tiến</strong></div>
            <div>Địa phương: Xã Quản Bạ, tỉnh Tuyên Quang</div>
            <div>Môn học: Ngữ văn 6 – Kết nối tri thức với cuộc sống</div>
          </div>

          <div className="space-y-1.5 text-stone-400 text-[11px]">
            <div className="font-semibold text-stone-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cam kết Đạo đức AI & Bảo vệ trẻ em:</span>
            </div>
            <p>
              • Dùng mã học sinh ngẫu nhiên, không thu thập thông tin định danh cá nhân.<br />
              • AI sư phạm gợi mở tư duy, tuyệt đối không viết hộ bài học sinh.<br />
              • Giáo viên là người thẩm định, phê duyệt và xác nhận kết quả cuối cùng.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>© 2026 VĂN SẮC QUẢN BẠ AI · Trường Tiểu học & THCS Quyết Tiến. Bản quyền giáo dục.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('journey')} className="hover:text-stone-300">Hành trình</button>
            <button onClick={() => setActiveTab('library')} className="hover:text-stone-300">Thư viện</button>
            <button onClick={() => setActiveTab('teacher')} className="hover:text-stone-300">Góc Giáo viên</button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-stone-300">Quản trị</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
