import React from 'react';
import { BookOpen, Mountain, Feather, ShieldCheck, UserCheck, Sparkles, WifiOff, Sun, Moon } from 'lucide-react';
import { AppRole, StudentClass } from '../types';

interface HeaderProps {
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dataSaverMode: boolean;
  setDataSaverMode: (val: boolean) => void;
  activeStudentCode: string;
  setActiveStudentCode: (code: string) => void;
  classes: StudentClass[];
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  dataSaverMode,
  setDataSaverMode,
  activeStudentCode,
  setActiveStudentCode,
  classes
}) => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md"
            aria-label="Về trang chủ Văn Sắc Quản Bạ AI"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
              <Mountain className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-100 block leading-tight">
                VĂN SẮC QUẢN BẠ
              </span>
              <span className="text-[11px] font-sans tracking-wide text-stone-500 dark:text-stone-400 block -mt-0.5">
                Ngữ văn 6 · Trường TH & THCS Quyết Tiến
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setActiveTab('journey')}
              className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'journey' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Hành trình bài học
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'library' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Thư viện Quản Bạ
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'reading' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Góc Đọc hiểu
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'writing' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Ngòi bút quê hương
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'games' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Văn học vui
            </button>
            {currentRole === 'teacher' && (
              <button
                onClick={() => setActiveTab('teacher')}
                className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  activeTab === 'teacher' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
                }`}
              >
                Góc Giáo viên
              </button>
            )}
            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  activeTab === 'admin' ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700' : ''
                }`}
              >
                Quản trị hệ thống
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action & role switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Data saver toggle */}
            <button
              onClick={() => setDataSaverMode(!dataSaverMode)}
              title={dataSaverMode ? 'Đang bật tiết kiệm dữ liệu (không tự tải đa phương tiện nặng)' : 'Bật chế độ tiết kiệm dữ liệu'}
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1.5 border ${
                dataSaverMode
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{dataSaverMode ? 'Tiết kiệm data: Bật' : 'Tiết kiệm data'}</span>
            </button>

            {/* Dark mode switch */}
            <button
              onClick={toggleDark}
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-md transition-colors"
              aria-label="Đổi giao diện sáng/tối"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Role switch pill selector */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setCurrentRole('student')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentRole === 'student'
                    ? 'bg-white dark:bg-stone-700 text-emerald-900 dark:text-emerald-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => setCurrentRole('teacher')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentRole === 'teacher'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Giáo viên
              </button>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentRole === 'admin'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Active student selector if student mode */}
            {currentRole === 'student' && classes.length > 0 && (
              <div className="hidden sm:flex items-center text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-md px-2 py-1 bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 mr-1.5">Mã:</span>
                <select
                  value={activeStudentCode}
                  onChange={(e) => setActiveStudentCode(e.target.value)}
                  className="bg-transparent font-mono font-semibold text-emerald-900 dark:text-emerald-300 focus:outline-none"
                  aria-label="Chọn mã học sinh"
                >
                  {classes.flatMap(c => c.studentCodes).map(s => (
                    <option key={s.code} value={s.code} className="dark:bg-stone-800">
                      {s.code} ({s.supportLevel === 'muc1' ? 'Mức 1' : s.supportLevel === 'muc2' ? 'Mức 2' : 'Mức 3'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs">
        <button onClick={() => setActiveTab('journey')} className={`px-2 py-1 whitespace-nowrap ${activeTab === 'journey' ? 'font-bold text-emerald-700' : 'text-stone-600'}`}>Hành trình</button>
        <button onClick={() => setActiveTab('library')} className={`px-2 py-1 whitespace-nowrap ${activeTab === 'library' ? 'font-bold text-emerald-700' : 'text-stone-600'}`}>Thư viện</button>
        <button onClick={() => setActiveTab('reading')} className={`px-2 py-1 whitespace-nowrap ${activeTab === 'reading' ? 'font-bold text-emerald-700' : 'text-stone-600'}`}>Đọc hiểu</button>
        <button onClick={() => setActiveTab('writing')} className={`px-2 py-1 whitespace-nowrap ${activeTab === 'writing' ? 'font-bold text-emerald-700' : 'text-stone-600'}`}>Ngòi bút</button>
        <button onClick={() => setActiveTab('games')} className={`px-2 py-1 whitespace-nowrap ${activeTab === 'games' ? 'font-bold text-emerald-700' : 'text-stone-600'}`}>Trò chơi</button>
        {currentRole === 'teacher' && <button onClick={() => setActiveTab('teacher')} className={`px-2 py-1 whitespace-nowrap font-bold ${activeTab === 'teacher' ? 'text-emerald-700' : 'text-stone-600'}`}>Góc GV</button>}
      </div>
    </header>
  );
};
