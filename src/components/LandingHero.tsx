import React from 'react';
import { BookOpen, Mountain, Feather, Compass, Sparkles, Shield, ArrowRight, HeartHandshake } from 'lucide-react';
import { AppRole } from '../types';

interface LandingHeroProps {
  onEnterLearning: () => void;
  onEnterTeacher: () => void;
  onEnterLibrary: () => void;
  onOpenChat: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterLearning,
  onEnterTeacher,
  onEnterLibrary,
  onOpenChat
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Highland Landscape Graphic Background with Mountain Motifs */}
      <div className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        {/* Decorative Mountain Silhouette SVG */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg className="w-full h-full preserve-3d" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400L220 220L440 340L720 180L980 320L1240 160L1440 280V400H0Z" fill="#FDE047" fillOpacity="0.3" />
            <path d="M120 400L380 180L620 300L860 140L1120 290L1360 210L1440 250V400H120Z" fill="#34D399" fillOpacity="0.25" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Authentic Attribution Header */}
          <div className="inline-flex items-center gap-2 text-xs text-emerald-200/90 font-medium">
            <span>Trường Tiểu học & THCS Quyết Tiến</span>
            <span aria-hidden="true">·</span>
            <span>Xã Quản Bạ, Tuyên Quang</span>
            <span aria-hidden="true">·</span>
            <span>Tác giả: Nguyễn Thị Hương Trầm</span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-200 text-balance leading-tight">
              VĂN SẮC QUẢN BẠ AI
            </h1>
            <p className="font-serif italic text-lg sm:text-2xl text-emerald-100/90 text-balance">
              “Khơi nguồn văn chương từ bản sắc quê hương”
            </p>
          </div>

          {/* Introduction Paragraph */}
          <p className="max-w-2xl mx-auto text-stone-200 text-sm sm:text-base leading-relaxed text-balance">
            Ứng dụng trí tuệ nhân tạo sư phạm đồng hành cùng học sinh lớp 6 bộ môn{' '}
            <strong className="text-amber-300 font-semibold">Ngữ văn 6 – Kết nối tri thức với cuộc sống</strong>.
            Cùng khám phá vẻ đẹp danh lam Núi Đôi, phiên chợ rực rỡ sắc chàm và câu chuyện nghĩa tình người thân,
            phát triển trọn vẹn năng lực <span className="underline decoration-amber-400/60 underline-offset-4">Đọc · Viết · Nói và Nghe</span>.
          </p>

          {/* Three Mandatory Entry Buttons with Mountain, Book, Pen Icons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={onEnterLearning}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-emerald-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-3 text-base whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-emerald-900" />
              <span>VÀO HỌC</span>
              <ArrowRight className="w-4 h-4 text-emerald-900" />
            </button>

            <button
              onClick={onEnterTeacher}
              className="px-6 py-3.5 bg-emerald-800/90 hover:bg-emerald-700/90 text-white font-semibold rounded-xl border border-emerald-600/50 transition-all flex items-center gap-2.5 text-base whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            >
              <Feather className="w-5 h-5 text-amber-300" />
              <span>GÓC GIÁO VIÊN</span>
            </button>

            <button
              onClick={onEnterLibrary}
              className="px-6 py-3.5 bg-stone-800/80 hover:bg-stone-700/80 text-stone-100 font-semibold rounded-xl border border-stone-600/50 transition-all flex items-center gap-2.5 text-base whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer"
            >
              <Mountain className="w-5 h-5 text-amber-400" />
              <span>THƯ VIỆN QUẢN BẠ</span>
            </button>
          </div>

          {/* Core Pedagogical Pillars Strip */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-1">
                <Mountain className="w-4 h-4" />
                <span>Bản sắc quê hương</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tích hợp hình ảnh Núi Đôi Cô Tiên, nghề dệt lanh Lùng Tám, chợ phiên Quyết Tiến làm chất liệu văn chương sống động.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-1">
                <BookOpen className="w-4 h-4" />
                <span>AI Sư phạm Gợi mở</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tuyệt đối không viết hộ bài học sinh. AI hỗ trợ tìm dẫn chứng đọc hiểu, lập dàn ý và góp ý từng câu chữ để học sinh tự làm chủ ngòi bút.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-1">
                <Feather className="w-4 h-4" />
                <span>Cá nhân hóa 3 mức độ</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Hỗ trợ phân hóa năng lực: Mức 1 (Cần hỗ trợ), Mức 2 (Đạt yêu cầu), Mức 3 (Mở rộng sáng tạo). Dữ liệu thật, minh bạch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Companion Hint */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 py-2.5 px-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              Bạn có câu hỏi về từ ngữ hay cần gợi ý dàn ý cho bài văn hôm nay?
            </span>
          </div>
          <button
            onClick={onOpenChat}
            className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
          >
            Trò chuyện cùng Bạn đồng hành VĂN SẮC &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
