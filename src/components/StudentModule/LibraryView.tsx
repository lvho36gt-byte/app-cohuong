import React, { useState } from 'react';
import { LearningMaterial, AppRole } from '../../types';
import { CURRICULUM_THEMES } from '../../constants/curriculum';
import { Search, Filter, BookOpen, ShieldCheck, Tag, Calendar, User, Eye, Plus, Sparkles } from 'lucide-react';

interface LibraryViewProps {
  materials: LearningMaterial[];
  currentRole: AppRole;
  onAddNewMaterial?: () => void;
  onSelectForReading?: (material: LearningMaterial) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  materials,
  currentRole,
  onAddNewMaterial,
  onSelectForReading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);

  // Filter materials based on search and selected filters
  const filteredMaterials = materials.filter(m => {
    // Only show approved materials to students; teachers can see both
    if (currentRole === 'student' && m.status !== 'approved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchContent = m.content.toLowerCase().includes(q);
      const matchAuthor = m.authorOrProvider.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
    }

    if (selectedTheme !== 'all' && m.themeId !== selectedTheme) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedMediaType !== 'all' && m.mediaType !== selectedMediaType) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Không gian học liệu địa phương
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Thư viện "Quản Bạ trong em"
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            Kho tư liệu văn hóa, cảnh sắc, phong tục và câu chuyện đời sống do thầy cô và học sinh cùng vun đắp.
          </p>
        </div>

        {currentRole === 'teacher' && onAddNewMaterial && (
          <button
            onClick={onAddNewMaterial}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tư liệu mới</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, tác giả, cảnh sắc Quản Bạ..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-stone-500 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Bộ lọc:
          </span>

          {/* Theme Filter */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-stone-100 dark:bg-stone-700 px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200"
          >
            <option value="all">Tất cả chủ đề bài học</option>
            {CURRICULUM_THEMES.map(t => (
              <option key={t.id} value={t.id}>Bài {t.order}: {t.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-100 dark:bg-stone-700 px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="verified_fact">Tư liệu thực tế xác minh</option>
            <option value="creative_sample">Học liệu minh họa tự sáng tác</option>
          </select>

          {/* Media Type Filter */}
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="bg-stone-100 dark:bg-stone-700 px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200"
          >
            <option value="all">Mọi loại hình học liệu</option>
            <option value="text">Văn bản / Bài đọc</option>
            <option value="image">Hình ảnh / Tranh ảnh</option>
            <option value="audio">Ghi âm / Lời kể</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
            <p className="text-stone-500 text-sm">Không tìm thấy tư liệu nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          filteredMaterials.map(mat => (
            <div
              key={mat.id}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {/* Badges: Category & Approval Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                    mat.category === 'verified_fact'
                      ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}>
                    {mat.category === 'verified_fact' ? 'Tư liệu thực tế xác minh' : 'Học liệu minh họa tự sáng tác'}
                  </span>
                  
                  {currentRole === 'teacher' && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      mat.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {mat.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {mat.title}
                </h3>

                {/* Metadata Line */}
                <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>Cung cấp: {mat.authorOrProvider}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Ngày: {mat.createdDate}</span>
                  </div>
                </div>

                {/* Summary / Snippet */}
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {mat.summary || mat.content}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 truncate max-w-[150px]">
                  {mat.usageRights}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingMaterial(mat)}
                    className="px-3 py-1.5 text-emerald-800 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Đọc kỹ</span>
                  </button>

                  {onSelectForReading && (
                    <button
                      onClick={() => onSelectForReading(mat)}
                      className="px-3 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-xs cursor-pointer"
                    >
                      Luyện đọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Material Detailed Modal */}
      {viewingMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold mb-1.5 ${
                  viewingMaterial.category === 'verified_fact' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {viewingMaterial.category === 'verified_fact' ? 'Tư liệu thực tế xác minh' : 'Học liệu minh họa tự sáng tác'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {viewingMaterial.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingMaterial(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xl font-bold p-1 cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            {/* Content Display */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700 font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
              {viewingMaterial.content}
            </div>

            {/* Attribution and provenance table */}
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3">
              <div><strong>Người cung cấp:</strong> {viewingMaterial.authorOrProvider}</div>
              <div><strong>Ngày lưu:</strong> {viewingMaterial.createdDate}</div>
              <div><strong>Nguồn trích dẫn:</strong> {viewingMaterial.source}</div>
              <div><strong>Quyền sử dụng:</strong> {viewingMaterial.usageRights}</div>
              <div className="col-span-2">
                <strong>Chủ đề Ngữ văn 6:</strong> {viewingMaterial.themeName}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingMaterial(null)}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                Đóng
              </button>
              {onSelectForReading && (
                <button
                  onClick={() => {
                    const mat = viewingMaterial;
                    setViewingMaterial(null);
                    onSelectForReading(mat);
                  }}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Luyện đọc hiểu bài này
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
