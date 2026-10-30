import React, { useState } from 'react';
import { StudentClass, LearningMaterial, Assignment, Submission, SurveyEvidence } from '../../types';
import { TeacherDashboard } from './TeacherDashboard';
import { ClassManagement } from './ClassManagement';
import { AICurriculumCreator } from './AICurriculumCreator';
import { AssignmentGrading } from './AssignmentGrading';
import { EvidenceReports } from './EvidenceReports';
import { LayoutDashboard, Users, Sparkles, Award, BarChart3, Clock } from 'lucide-react';

interface TeacherHubProps {
  classes: StudentClass[];
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: Submission[];
  evidences: SurveyEvidence[];
  onRefreshData: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const TeacherHub: React.FC<TeacherHubProps> = ({
  classes,
  materials,
  assignments,
  submissions,
  evidences,
  onRefreshData,
  onNavigateToTab
}) => {
  const [subtab, setSubtab] = useState<'dashboard' | 'classes' | 'curriculum' | 'grading' | 'reports'>('dashboard');

  const pendingCount = submissions.filter(s => s.status === 'submitted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Teacher Hub Header */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-300 tracking-wide uppercase mb-1">
            Không gian làm việc của Giáo viên bộ môn Ngữ văn 6
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Góc Giáo viên · Nguyễn Thị Hương Trầm
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Trường Tiểu học và THCS Quyết Tiến · Xã Quản Bạ, Tuyên Quang
          </p>
        </div>

        {/* Quick status */}
        <div className="flex items-center gap-2 text-xs bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-700/60 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Bài chờ duyệt: <strong className="text-amber-300 font-mono text-sm">{pendingCount}</strong> bài</span>
        </div>
      </div>

      {/* Subtabs Segmented Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-700">
        {[
          { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
          { id: 'classes', label: 'Quản lý lớp học', icon: Users },
          { id: 'curriculum', label: 'Tạo học liệu AI', icon: Sparkles },
          { id: 'grading', label: `Giao bài & Đánh giá (${pendingCount})`, icon: Award },
          { id: 'reports', label: 'Báo cáo minh chứng', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubtab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Panels */}
      {subtab === 'dashboard' && (
        <TeacherDashboard
          classes={classes}
          materials={materials}
          assignments={assignments}
          submissions={submissions}
          onNavigateSubtab={(st) => setSubtab(st as any)}
        />
      )}

      {subtab === 'classes' && (
        <ClassManagement
          classes={classes}
          onRefreshData={onRefreshData}
        />
      )}

      {subtab === 'curriculum' && (
        <AICurriculumCreator
          onRefreshData={onRefreshData}
          onMaterialCreated={() => setSubtab('dashboard')}
        />
      )}

      {subtab === 'grading' && (
        <AssignmentGrading
          assignments={assignments}
          submissions={submissions}
          classes={classes}
          onRefreshData={onRefreshData}
        />
      )}

      {subtab === 'reports' && (
        <EvidenceReports
          evidences={evidences}
          classes={classes}
          submissions={submissions}
          onRefreshData={onRefreshData}
        />
      )}
    </div>
  );
};
