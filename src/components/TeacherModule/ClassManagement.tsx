import React, { useState } from 'react';
import { StudentClass, SupportLevel } from '../../types';
import { Users, Plus, Shield, Check, Edit2, AlertCircle } from 'lucide-react';

interface ClassManagementProps {
  classes: StudentClass[];
  onRefreshData: () => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  classes,
  onRefreshData
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes.length > 0 ? classes[0].id : ''
  );

  // New class modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('Lớp 6C');
  const [newPrefix, setNewPrefix] = useState('QB-6C-');
  const [newCount, setNewCount] = useState(8);
  const [creating, setCreating] = useState(false);

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName,
          prefix: newPrefix,
          studentCount: newCount,
          teacherName: 'Nguyễn Thị Hương Trầm',
          academicYear: '2026-2027'
        })
      });
      if (res.ok) {
        setShowCreateModal(false);
        onRefreshData();
      } else {
        alert('Có lỗi khi tạo lớp học.');
      }
    } catch {
      alert('Không thể kết nối máy chủ.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStudentLevel = async (studentCode: string, newLevel: SupportLevel) => {
    try {
      const res = await fetch(`/api/classes/${currentClass.id}/students/${studentCode}/level`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supportLevel: newLevel })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch {
      alert('Lỗi cập nhật mức độ học sinh.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Class Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            Quản lý Lớp học & Mã học sinh nội bộ
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Mỗi học sinh được cấp một mã định danh ngẫu nhiên (ví dụ: QB-6A-01). Không thu thập số điện thoại, CCCD hay email cá nhân.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo lớp & Sinh mã học sinh</span>
        </button>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-700 pb-2 overflow-x-auto">
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentClass?.id === cls.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-600'
            }`}
          >
            {cls.name} ({cls.studentCodes.length} HS)
          </button>
        ))}
      </div>

      {/* Class Details & Student Table */}
      {currentClass && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-700 pb-3 text-xs">
            <div>
              <span className="text-stone-400">Giáo viên phụ trách:</span>{' '}
              <strong className="text-stone-800 dark:text-stone-200">{currentClass.teacherName}</strong>
              <span className="mx-2 text-stone-300">·</span>
              <span className="text-stone-400">Năm học:</span>{' '}
              <strong className="text-stone-800 dark:text-stone-200">{currentClass.academicYear}</strong>
            </div>

            <div className="flex items-center gap-2 text-stone-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chế độ ẩn danh bảo vệ trẻ em đã kích hoạt</span>
            </div>
          </div>

          {/* Differentiated Levels Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
            <div>
              <span className="font-bold text-red-600 dark:text-red-400">Mức 1 – CẦN HỖ TRỢ:</span>
              <p className="text-[11px] text-stone-500 mt-0.5">Câu hỏi ngắn, gợi ý từng bước, trợ giúp chi tiết.</p>
            </div>
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Mức 2 – ĐẠT YÊU CẦU:</span>
              <p className="text-[11px] text-stone-500 mt-0.5">Câu hỏi vừa sức chuẩn lớp 6, tự tìm dẫn chứng.</p>
            </div>
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400">Mức 3 – MỞ RỘNG:</span>
              <p className="text-[11px] text-stone-500 mt-0.5">Vận dụng liên hệ thực tế Quản Bạ, sáng tạo nâng cao.</p>
            </div>
          </div>

          {/* Students List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 uppercase tracking-wider border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Mã học sinh nội bộ</th>
                  <th className="py-3 px-4">Ngày cấp mã</th>
                  <th className="py-3 px-4">Mức độ hỗ trợ học tập</th>
                  <th className="py-3 px-4 text-right">Điều chỉnh mức</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/60 font-sans">
                {currentClass.studentCodes.map((st, idx) => (
                  <tr key={st.code} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30">
                    <td className="py-3 px-4 text-stone-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900 dark:text-emerald-300">
                      {st.code}
                    </td>
                    <td className="py-3 px-4 text-stone-500">{st.joinedAt}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded font-semibold text-[11px] ${
                        st.supportLevel === 'muc1'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : st.supportLevel === 'muc3'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {st.supportLevel === 'muc1' ? 'Mức 1: Cần hỗ trợ' : st.supportLevel === 'muc3' ? 'Mức 3: Mở rộng' : 'Mức 2: Đạt yêu cầu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={st.supportLevel}
                        onChange={(e) => handleUpdateStudentLevel(st.code, e.target.value as SupportLevel)}
                        className="bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded px-2 py-1 text-xs text-stone-700 dark:text-stone-200 focus:outline-none"
                      >
                        <option value="muc1">Mức 1 (Hỗ trợ)</option>
                        <option value="muc2">Mức 2 (Đạt chuẩn)</option>
                        <option value="muc3">Mức 3 (Mở rộng)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200 dark:border-stone-800">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Tạo lớp mới & Tự động sinh mã học sinh
            </h3>
            <p className="text-xs text-stone-500">
              Hệ thống sẽ tạo ra danh sách mã học sinh ngẫu nhiên gắn với lớp, đảm bảo bảo mật thông tin cá nhân học sinh.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Tên lớp:</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Tiền tố mã học sinh:</label>
                <input
                  type="text"
                  value={newPrefix}
                  onChange={(e) => setNewPrefix(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Số lượng học sinh trong lớp:</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newCount}
                  onChange={(e) => setNewCount(parseInt(e.target.value || '1', 10))}
                  className="w-full p-2.5 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  {creating ? 'Đang tạo...' : 'Tạo lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
