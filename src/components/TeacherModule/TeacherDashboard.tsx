import React from 'react';
import { StudentClass, LearningMaterial, Assignment, Submission } from '../../types';
import { Users, BookOpen, Clock, AlertTriangle, Award, CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface TeacherDashboardProps {
  classes: StudentClass[];
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: Submission[];
  onNavigateSubtab: (subtab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  classes,
  materials,
  assignments,
  submissions,
  onNavigateSubtab
}) => {
  // Real data calculations (No fake numbers!)
  const totalRealStudents = classes.reduce((sum, c) => sum + c.studentCodes.length, 0);
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  // Support alerts: Students marked as 'muc1' (Cần hỗ trợ)
  const studentsNeedingSupport: { code: string; className: string }[] = [];
  classes.forEach(cls => {
    cls.studentCodes.forEach(st => {
      if (st.supportLevel === 'muc1') {
        studentsNeedingSupport.push({ code: st.code, className: cls.name });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* 4 Real Data Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Học sinh thật trong hệ thống</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-mono font-bold text-stone-900 dark:text-stone-100">
            {totalRealStudents}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Trên tổng số {classes.length} lớp học đã tạo
          </div>
        </div>

        {/* Pending Approval Submissions */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Bài làm chờ giáo viên duyệt</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-mono font-bold text-amber-700 dark:text-amber-400">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {pendingSubmissions.length > 0 ? 'Cần đánh giá và xác nhận điểm' : 'Hiện chưa có bài chờ duyệt'}
          </div>
        </div>

        {/* Approved Materials Count */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Học liệu Quản Bạ đã duyệt</span>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-mono font-bold text-stone-900 dark:text-stone-100">
            {materials.filter(m => m.status === 'approved').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {materials.filter(m => m.category === 'verified_fact').length} xác minh · {materials.filter(m => m.category === 'creative_sample').length} tự sáng tác
          </div>
        </div>

        {/* Support Alert Count */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Học sinh ở Mức 1 (Cần hỗ trợ)</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-mono font-bold text-red-600 dark:text-red-400">
            {studentsNeedingSupport.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Được AI tăng cường gợi ý bước nhỏ
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Submissions & Support Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Submissions awaiting Teacher Confirmation */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Bài làm học sinh chờ giáo viên xác nhận kết quả
              </h3>
            </div>
            <button
              onClick={() => onNavigateSubtab('grading')}
              className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả bài</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs">
              Tất cả bài nộp đã được chấm hoặc chưa có bài nộp mới.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.slice(0, 5).map(sub => (
                <div
                  key={sub.id}
                  className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span className="font-mono text-emerald-800 dark:text-emerald-300">{sub.studentId}</span>
                      <span className="text-stone-400">·</span>
                      <span>
                        {sub.type === 'writing' ? 'Bài viết Ngòi bút quê hương (Có 2 bản nháp)' : sub.type === 'speaking' ? 'Bài nói & nghe' : 'Bài trắc nghiệm đọc hiểu'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Nộp lúc: {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateSubtab('grading')}
                    className="px-3 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Chấm & Duyệt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Alert List (Mức 1) */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-700 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Danh sách học sinh cần hỗ trợ (Mức 1)
            </h3>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Học sinh được phân hóa nhận câu hỏi ngắn hơn, gợi ý chi tiết từng bước để không bị bỏ lại phía sau:
          </p>

          <div className="space-y-2">
            {studentsNeedingSupport.length === 0 ? (
              <div className="py-6 text-center text-stone-400 text-xs">
                Không có học sinh nào ở Mức 1.
              </div>
            ) : (
              studentsNeedingSupport.map((st, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between text-xs"
                >
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{st.code}</span>
                  <span className="text-[11px] text-stone-500">{st.className}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-700">
            <button
              onClick={() => onNavigateSubtab('classes')}
              className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:underline block text-center w-full cursor-pointer"
            >
              Quản lý và điều chỉnh mức độ tại Quản lý lớp &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
