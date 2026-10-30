import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDatabase,
  saveDatabase,
  logAudit,
  LearningMaterial,
  Assignment,
  Submission,
  StudentClass,
  SurveyEvidence
} from './server/db.ts';
import {
  generateChatbotReply,
  generateReadingHint,
  generateWritingFeedback,
  generateTeacherCurriculumProposal
} from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Standard body parser with generous limit for audio data URLs
app.use(express.json({ limit: '20mb' }));

// Health / Config Status
app.get('/api/status', (req, res) => {
  res.json({
    appName: 'VĂN SẮC QUẢN BẠ AI',
    version: '1.0.0',
    unit: 'Trường Tiểu học và THCS Quyết Tiến - Xã Quản Bạ, Tuyên Quang',
    author: 'Nguyễn Thị Hương Trầm',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Materials endpoints
app.get('/api/materials', (req, res) => {
  const db = getDatabase();
  const { themeId, category, status } = req.query;
  let items = db.materials;

  if (themeId && themeId !== 'all') {
    items = items.filter(m => m.themeId === themeId);
  }
  if (category && category !== 'all') {
    items = items.filter(m => m.category === category);
  }
  if (status && status !== 'all') {
    items = items.filter(m => m.status === status);
  }

  res.json(items);
});

app.post('/api/materials', (req, res) => {
  const db = getDatabase();
  const newMaterial: LearningMaterial = {
    id: 'mat-' + Date.now(),
    title: req.body.title || 'Học liệu mới',
    themeId: req.body.themeId || 'theme-4',
    themeName: req.body.themeName || 'Quê hương yêu dấu',
    authorOrProvider: req.body.authorOrProvider || 'Giáo viên bộ môn',
    source: req.body.source || 'Trường TH & THCS Quyết Tiến',
    createdDate: new Date().toISOString().split('T')[0],
    usageRights: req.body.usageRights || 'Sử dụng nội bộ',
    status: req.body.status || 'pending',
    category: req.body.category || 'creative_sample',
    mediaType: req.body.mediaType || 'text',
    summary: req.body.summary || '',
    content: req.body.content || '',
    targetLevel: req.body.targetLevel || 'all'
  };

  db.materials.unshift(newMaterial);
  saveDatabase(db);
  logAudit(req.body.authorOrProvider || 'Giáo viên', 'THÊM_HỌC_LIỆU', `Thêm tài liệu: ${newMaterial.title}`);
  res.json(newMaterial);
});

app.put('/api/materials/:id', (req, res) => {
  const db = getDatabase();
  const index = db.materials.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy học liệu' });
  }

  db.materials[index] = { ...db.materials[index], ...req.body };
  saveDatabase(db);
  logAudit(req.body.modifiedBy || 'Giáo viên', 'SỬA_HỌC_LIỆU', `Cập nhật học liệu ID ${req.params.id}`);
  res.json(db.materials[index]);
});

app.delete('/api/materials/:id', (req, res) => {
  const db = getDatabase();
  const index = db.materials.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy học liệu' });
  }

  const deleted = db.materials.splice(index, 1)[0];
  saveDatabase(db);
  logAudit('Giáo viên/Quản trị', 'XÓA_HỌC_LIỆU', `Xóa học liệu: ${deleted.title}`);
  res.json({ success: true, deletedId: req.params.id });
});

// Classes & Students
app.get('/api/classes', (req, res) => {
  const db = getDatabase();
  res.json(db.classes);
});

app.post('/api/classes', (req, res) => {
  const db = getDatabase();
  const className = req.body.name || 'Lớp 6 mới';
  const classCodePrefix = req.body.prefix || 'QB-6C-';
  const studentCount = parseInt(req.body.studentCount || '10', 10);

  const studentCodes = [];
  for (let i = 1; i <= studentCount; i++) {
    studentCodes.push({
      code: `${classCodePrefix}${i < 10 ? '0' + i : i}`,
      supportLevel: 'muc2' as const,
      joinedAt: new Date().toISOString().split('T')[0]
    });
  }

  const newClass: StudentClass = {
    id: 'class-' + Date.now(),
    name: className,
    academicYear: req.body.academicYear || '2026-2027',
    teacherName: req.body.teacherName || 'Nguyễn Thị Hương Trầm',
    studentCodes
  };

  db.classes.push(newClass);
  saveDatabase(db);
  logAudit(newClass.teacherName, 'TẠO_LỚP_HỌC', `Tạo ${newClass.name} với ${studentCount} mã học sinh`);
  res.json(newClass);
});

app.put('/api/classes/:classId/students/:code/level', (req, res) => {
  const db = getDatabase();
  const cls = db.classes.find(c => c.id === req.params.classId);
  if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp' });

  const st = cls.studentCodes.find(s => s.code === req.params.code);
  if (!st) return res.status(404).json({ error: 'Không tìm thấy học sinh' });

  const oldLevel = st.supportLevel;
  st.supportLevel = req.body.supportLevel;
  saveDatabase(db);
  logAudit('Giáo viên', 'ĐIỀU_CHỈNH_MỨC_ĐỘ', `Chuyển học sinh ${st.code} từ ${oldLevel} sang ${st.supportLevel}`);
  res.json(st);
});

// Assignments
app.get('/api/assignments', (req, res) => {
  const db = getDatabase();
  const { classId } = req.query;
  let items = db.assignments;
  if (classId) {
    items = items.filter(a => a.classId === classId);
  }
  res.json(items);
});

app.post('/api/assignments', (req, res) => {
  const db = getDatabase();
  const newAssign: Assignment = {
    id: 'assign-' + Date.now(),
    title: req.body.title || 'Nhiệm vụ học tập mới',
    themeId: req.body.themeId || 'theme-4',
    classId: req.body.classId || 'class-6a',
    type: req.body.type || 'quiz',
    deadline: req.body.deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
    instructions: req.body.instructions || '',
    targetLevel: req.body.targetLevel || 'all',
    materialId: req.body.materialId,
    questions: req.body.questions,
    writingPrompt: req.body.writingPrompt,
    speakingPrompt: req.body.speakingPrompt
  };

  db.assignments.unshift(newAssign);
  saveDatabase(db);
  logAudit('Giáo viên', 'GIAO_BÀI_TẬP', `Giao bài tập: ${newAssign.title} cho lớp ${newAssign.classId}`);
  res.json(newAssign);
});

app.delete('/api/assignments/:id', (req, res) => {
  const db = getDatabase();
  const idx = db.assignments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  const deleted = db.assignments.splice(idx, 1)[0];
  saveDatabase(db);
  logAudit('Giáo viên', 'XÓA_BÀI_TẬP', `Xóa bài tập: ${deleted.title}`);
  res.json({ success: true });
});

// Submissions
app.get('/api/submissions', (req, res) => {
  const db = getDatabase();
  const { studentId, assignmentId, classId } = req.query;
  let items = db.submissions;

  if (studentId) {
    items = items.filter(s => s.studentId === studentId);
  }
  if (assignmentId) {
    items = items.filter(s => s.assignmentId === assignmentId);
  }
  if (classId) {
    items = items.filter(s => s.classId === classId);
  }

  res.json(items);
});

app.post('/api/submissions', (req, res) => {
  const db = getDatabase();
  const submissionData = req.body;

  let existingIdx = db.submissions.findIndex(
    s => s.assignmentId === submissionData.assignmentId && s.studentId === submissionData.studentId
  );

  let submission: Submission;
  if (existingIdx !== -1) {
    submission = {
      ...db.submissions[existingIdx],
      ...submissionData,
      submittedAt: new Date().toISOString()
    };
    db.submissions[existingIdx] = submission;
  } else {
    submission = {
      id: 'sub-' + Date.now(),
      ...submissionData,
      submittedAt: new Date().toISOString()
    };
    db.submissions.unshift(submission);
  }

  saveDatabase(db);
  logAudit(submission.studentId, 'NỘP_BÀI', `Học sinh ${submission.studentId} nộp bài ID: ${submission.assignmentId}`);
  res.json(submission);
});

app.put('/api/submissions/:id/grade', (req, res) => {
  const db = getDatabase();
  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài làm' });

  sub.teacherScore = req.body.teacherScore;
  sub.teacherFeedback = req.body.teacherFeedback;
  sub.teacherVerifiedAt = new Date().toISOString();
  sub.teacherName = req.body.teacherName || 'Nguyễn Thị Hương Trầm';
  sub.status = 'graded';

  saveDatabase(db);
  logAudit(sub.teacherName || 'Giáo viên', 'CHẤM_BÀI', `Giáo viên chấm bài cho học sinh ${sub.studentId}: ${sub.teacherScore} điểm`);
  res.json(sub);
});

// Evidence & Surveys (Báo cáo minh chứng - Real Data Only)
app.get('/api/evidences', (req, res) => {
  const db = getDatabase();
  res.json(db.evidences);
});

app.post('/api/evidences', (req, res) => {
  const db = getDatabase();
  const newEvidence: SurveyEvidence = {
    id: 'evi-' + Date.now(),
    title: req.body.title || 'Khảo sát năng lực thực tế môn Ngữ văn 6',
    classId: req.body.classId || 'class-6a',
    conductedDate: req.body.conductedDate || new Date().toISOString().split('T')[0],
    metricName: req.body.metricName || 'Điểm đọc hiểu có dẫn chứng (Thang 10)',
    unit: req.body.unit || 'điểm',
    isLocked: false,
    records: req.body.records || []
  };

  db.evidences.unshift(newEvidence);
  saveDatabase(db);
  logAudit('Giáo viên', 'TẠO_MINH_CHỨNG', `Tạo bộ dữ liệu khảo sát: ${newEvidence.title}`);
  res.json(newEvidence);
});

app.put('/api/evidences/:id/lock', (req, res) => {
  const db = getDatabase();
  const evi = db.evidences.find(e => e.id === req.params.id);
  if (!evi) return res.status(404).json({ error: 'Không tìm thấy bộ dữ liệu minh chứng' });

  evi.isLocked = req.body.isLocked ?? true;
  saveDatabase(db);
  logAudit('Giáo viên/Quản trị', 'KHÓA_MINH_CHỨNG', `Xác nhận & khóa bộ dữ liệu ${evi.title}`);
  res.json(evi);
});

// Audit Logs & System Admin
app.get('/api/logs', (req, res) => {
  const db = getDatabase();
  res.json(db.logs);
});

app.get('/api/backup', (req, res) => {
  const db = getDatabase();
  res.setHeader('Content-Disposition', `attachment; filename=vansac_backup_${Date.now()}.json`);
  res.json(db);
});

app.post('/api/restore', (req, res) => {
  try {
    const importedDb = req.body;
    if (!importedDb.classes || !importedDb.materials) {
      return res.status(400).json({ error: 'Cấu trúc tệp sao lưu không hợp lệ.' });
    }
    saveDatabase(importedDb);
    logAudit('Quản trị viên', 'KHÔI_PHỤC_HỆ_THỐNG', 'Khôi phục toàn bộ cơ sở dữ liệu từ tệp sao lưu');
    res.json({ success: true, message: 'Khôi phục dữ liệu thành công.' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khôi phục: ' + String(err) });
  }
});

// Gemini AI Server Endpoints
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { history, message, studentContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    const reply = await generateChatbotReply(history || [], message, studentContext);
    res.json({ reply });
  } catch (err: any) {
    console.error('Lỗi Gemini Chatbot:', err);
    res.status(500).json({
      error: 'Không thể kết nối mô hình AI.',
      details: err?.message || 'Vui lòng kiểm tra GEMINI_API_KEY trong cấu hình hệ thống.'
    });
  }
});

app.post('/api/gemini/reading-hint', async (req, res) => {
  try {
    const { textSnippet, question, questionLevel, studentDoubt } = req.body;
    const hint = await generateReadingHint({
      textSnippet,
      question,
      questionLevel: questionLevel || 'thong_hieu',
      studentDoubt
    });
    res.json({ hint });
  } catch (err: any) {
    console.error('Lỗi Gemini Reading Hint:', err);
    res.status(500).json({
      error: 'Không thể tạo gợi ý đọc hiểu lúc này.',
      details: err?.message
    });
  }
});

app.post('/api/gemini/writing-feedback', async (req, res) => {
  try {
    const { topic, genre, studentDraft, rubrics, targetLevel } = req.body;
    if (!studentDraft || studentDraft.trim().length < 15) {
      return res.status(400).json({ error: 'Bản nháp quá ngắn để trợ lý AI có thể góp ý hiệu quả.' });
    }

    const feedback = await generateWritingFeedback({
      topic,
      genre,
      studentDraft,
      rubrics: rubrics || [],
      targetLevel
    });
    res.json({ feedback });
  } catch (err: any) {
    console.error('Lỗi Gemini Writing Feedback:', err);
    res.status(500).json({
      error: 'Không thể tạo phản hồi bài viết lúc này.',
      details: err?.message
    });
  }
});

app.post('/api/gemini/teacher-generate', async (req, res) => {
  try {
    const { themeName, learningOutcomes, activityType, localElement } = req.body;
    const proposal = await generateTeacherCurriculumProposal({
      themeName,
      learningOutcomes,
      activityType,
      localElement
    });
    res.json(proposal);
  } catch (err: any) {
    console.error('Lỗi Gemini Teacher Proposal:', err);
    res.status(500).json({
      error: 'Không thể đề xuất học liệu lúc này.',
      details: err?.message
    });
  }
});

// Frontend Vite Integration (Dev middleware or static serve)
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VĂN SẮC QUẢN BẠ AI] Máy chủ đang hoạt động tại cổng ${PORT}`);
  });
}

startServer();
