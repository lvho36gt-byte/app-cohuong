import React, { useState, useEffect } from 'react';
import { LearningMaterial, SystemAuditLog } from '../../types';
import { ShieldCheck, Database, Download, Upload, Trash2, Eye, EyeOff, Server, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  materials: LearningMaterial[];
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  materials,
  onRefreshData
}) => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const fetchStatusAndLogs = async () => {
    setLoadingLogs(true);
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/logs')
      ]);
      const statusData = await statusRes.json();
      const logsData = await logsRes.json();
      setSystemStatus(statusData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStatusAndLogs();
  }, []);

  const handleToggleMaterialStatus = async (mat: LearningMaterial) => {
    const nextStatus = mat.status === 'approved' ? 'pending' : 'approved';
    try {
      const res = await fetch(`/api/materials/${mat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, modifiedBy: 'Quản trị viên' })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch {
      alert('Lỗi cập nhật học liệu.');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Em/Thầy cô có chắc chắn muốn xóa học liệu này khỏi hệ thống không?')) return;
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch {
      alert('Lỗi xóa học liệu.');
    }
  };

  // Export full JSON backup
  const handleBackup = () => {
    window.open('/api/backup', '_blank');
  };

  // Restore JSON backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        if (res.ok) {
          alert('Khôi phục dữ liệu thành công!');
          onRefreshData();
          fetchStatusAndLogs();
        } else {
          alert('Tệp sao lưu không đúng cấu trúc.');
        }
      } catch {
        alert('Lỗi đọc tệp JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Trung tâm kiểm soát hệ thống
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-800" />
            Phân hệ Quản trị & Nhật ký hệ thống
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Quản trị quyền, duyệt/ẩn học liệu, sao lưu an toàn và giám sát toàn vẹn dữ liệu giáo dục.
          </p>
        </div>

        <button
          onClick={fetchStatusAndLogs}
          className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới nhật ký</span>
        </button>
      </div>

      {/* System Status & Backup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Status Card */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase">
            <Server className="w-4 h-4 text-emerald-700" />
            <span>Trạng thái máy chủ AI</span>
          </div>
          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {systemStatus ? systemStatus.appName : 'Đang tải...'}
          </div>
          <div className="text-xs text-stone-500">
            Trường: {systemStatus ? systemStatus.unit : ''}
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${systemStatus?.geminiConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>
              {systemStatus?.geminiConfigured ? 'Gemini 3.8 Flash: Sẵn sàng' : 'GEMINI_API_KEY: Chưa cấu hình biến môi trường'}
            </span>
          </div>
        </div>

        {/* Database & Persistence Card */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase">
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Kho dữ liệu lưu trữ bền vững</span>
          </div>
          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Cơ sở dữ liệu nội bộ (data/app_data.json)
          </div>
          <p className="text-xs text-stone-500">
            Dữ liệu học sinh, bài làm, khảo sát được ghi bền vững vào hệ thống, không bị mất khi làm mới trình duyệt.
          </p>
        </div>

        {/* Backup & Restore Card */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase">
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Sao lưu & Phục hồi dữ liệu</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={handleBackup}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải bản sao lưu JSON</span>
            </button>
            <label className="px-3 py-1.5 border border-stone-300 dark:border-stone-600 rounded-lg font-semibold flex items-center gap-1 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Khôi phục từ file</span>
              <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
            </label>
          </div>
        </div>

      </div>

      {/* Materials Moderation Table */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Kiểm duyệt, Ẩn hoặc Xóa học liệu trong Thư viện ({materials.length})
          </h3>
          <span className="text-xs text-stone-400">
            Quyền quản trị viên
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 uppercase tracking-wider border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="py-2.5 px-3">Tiêu đề học liệu</th>
                <th className="py-2.5 px-3">Phân loại</th>
                <th className="py-2.5 px-3">Tác giả / Nguồn</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-700/60">
              {materials.map(mat => (
                <tr key={mat.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30">
                  <td className="py-2.5 px-3 font-serif font-bold text-stone-900 dark:text-stone-100 max-w-[240px] truncate">
                    {mat.title}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      mat.category === 'verified_fact' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {mat.category === 'verified_fact' ? 'Xác minh' : 'Tự sáng tác'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-500 max-w-[160px] truncate">
                    {mat.authorOrProvider}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      mat.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {mat.status === 'approved' ? 'Đang hiển thị' : 'Đang ẩn/Chờ duyệt'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleMaterialStatus(mat)}
                      className="p-1 hover:text-emerald-700 cursor-pointer"
                      title={mat.status === 'approved' ? 'Ẩn tài liệu này' : 'Duyệt công khai'}
                    >
                      {mat.status === 'approved' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(mat.id)}
                      className="p-1 hover:text-red-600 cursor-pointer text-stone-400"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Logs Table */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Nhật ký thay đổi dữ liệu & Thao tác giáo viên/học sinh ({logs.length})
          </h3>
          <span className="text-xs text-stone-400">Audit Trail</span>
        </div>

        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2 px-3">Thời gian</th>
                <th className="py-2 px-3">Chủ thể</th>
                <th className="py-2 px-3">Hành động</th>
                <th className="py-2 px-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-700/60 font-sans">
              {logs.map(log => (
                <tr key={log.id} className="text-[11px] text-stone-600 dark:text-stone-300">
                  <td className="py-2 px-3 font-mono text-stone-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2 px-3 font-semibold text-stone-800 dark:text-stone-200">
                    {log.actor}
                  </td>
                  <td className="py-2 px-3 font-mono text-emerald-800 dark:text-emerald-400 font-bold">
                    {log.action}
                  </td>
                  <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
